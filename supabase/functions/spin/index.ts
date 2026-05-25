import { withLogging } from "../_shared/log.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type PrizeRow = {
  id: string;
  name_ar: string;
  name_en: string | null;
  category: string | null;
  image_url: string | null;
  redemption_rules_ar: string | null;
  remaining_stock: number;
  probability_weight: number;
  prize_type: string;
  visitor_only: boolean;
  is_grand: boolean;
  grand_probability: number;
  validity_days: number | null;
  competition_store_id: string;
};

Deno.serve(withLogging("spin", async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const body = await req.json();
    const { full_name, phone, email, visitor_token } = body;
    const utm_source = typeof body.utm_source === "string" ? body.utm_source.slice(0, 120) : null;
    const utm_medium = typeof body.utm_medium === "string" ? body.utm_medium.slice(0, 120) : null;
    const utm_campaign = typeof body.utm_campaign === "string" ? body.utm_campaign.slice(0, 120) : null;
    const utm_content = typeof body.utm_content === "string" ? body.utm_content.slice(0, 120) : null;

    // ── Validate input ──
    if (!full_name?.trim() || !phone?.trim()) {
      return json({ error: "يرجى ملء الاسم ورقم الهاتف" }, 400);
    }

    // ── Hash phone ──
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(phone.trim()));
    const phoneHash = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // ── Daily limit (one spin per phone per day) ──
    const today = new Date().toISOString().split("T")[0];
    const { data: existing } = await supabase
      .from("spin_sessions")
      .select("id")
      .eq("phone_hash", phoneHash)
      .eq("spin_date", today)
      .maybeSingle();

    if (existing) {
      return json({ error: "لقد شاركت اليوم بالفعل. يمكنك المحاولة مرة أخرى غدًا.", already_spun: true }, 409);
    }

    // ── Verify visitor token (if provided) ──
    let visitorVerified = false;
    let visitorTokenValue: string | null = null;
    if (visitor_token && typeof visitor_token === "string" && visitor_token.trim().length > 0) {
      const tokenStr = visitor_token.trim().toUpperCase();
      const { data: tokenRow } = await supabase
        .from("visitor_verifications")
        .select("id, is_active, valid_from, valid_to, max_uses, used_count")
        .eq("token", tokenStr)
        .maybeSingle();

      const now = new Date();
      if (
        tokenRow &&
        tokenRow.is_active &&
        (!tokenRow.valid_from || new Date(tokenRow.valid_from) <= now) &&
        (!tokenRow.valid_to || new Date(tokenRow.valid_to) >= now) &&
        (tokenRow.max_uses == null || tokenRow.used_count < tokenRow.max_uses)
      ) {
        visitorVerified = true;
        visitorTokenValue = tokenStr;
      }
    }

    // ── Load all eligible prizes (single query) ──
    const { data: allPrizes, error: prizeErr } = await supabase
      .from("store_prizes")
      .select("id, name_ar, name_en, category, image_url, redemption_rules_ar, remaining_stock, probability_weight, prize_type, visitor_only, is_grand, grand_probability, validity_days, competition_store_id")
      .eq("is_active", true)
      .gt("remaining_stock", 0);

    if (prizeErr) {
      console.error("Prize load error:", prizeErr);
      return json({ error: "حدث خطأ — حاول مرة أخرى" }, 500);
    }

    const prizes = (allPrizes ?? []) as PrizeRow[];

    // ── Stage A: Grand prize roll (independent, very rare) ──
    const grandPrize = prizes.find((p) => p.is_grand);
    let selectedPrize: PrizeRow | null = null;

    if (grandPrize && Math.random() < (grandPrize.grand_probability || 0)) {
      selectedPrize = grandPrize;
    }

    // ── Stage B: Visitor-only prize (if verified) ──
    if (!selectedPrize && visitorVerified) {
      const visitorPrize = prizes.find((p) => p.visitor_only && !p.is_grand);
      // ~25% chance to award visitor prize when verified (rest go to instant)
      if (visitorPrize && Math.random() < 0.25) {
        selectedPrize = visitorPrize;
      }
    }

    // ── Stage C: Weighted instant prize ──
    if (!selectedPrize) {
      const instantPool = prizes.filter(
        (p) => p.prize_type === "instant" && !p.is_grand && !p.visitor_only,
      );

      if (instantPool.length === 0) {
        // No instant prizes left — record as no_prize
        const claimCode = generateClaimCode();
        await supabase.from("spin_sessions").insert({
          full_name: full_name.trim(),
          phone: phone.trim(),
          email: email?.trim() || null,
          phone_hash: phoneHash,
          spin_date: today,
          claim_code: claimCode,
          claim_status: "no_prize",
          visitor_verified: visitorVerified,
          visitor_token: visitorTokenValue,
        });
        return json({
          success: true,
          won: false,
          message: "نفدت الجوائز الحالية — تابعنا للمفاجآت القادمة.",
        });
      }

      const totalWeight = instantPool.reduce((sum, p) => sum + p.probability_weight, 0);
      let r = Math.random() * totalWeight;
      selectedPrize = instantPool[instantPool.length - 1];
      for (const p of instantPool) {
        r -= p.probability_weight;
        if (r <= 0) {
          selectedPrize = p;
          break;
        }
      }
    }

    // ── Generate claim code + expiry ──
    const claimCode = generateClaimCode();
    const validityDays = selectedPrize.validity_days ?? 30;
    const expiresAt = new Date(Date.now() + validityDays * 86400000).toISOString();

    const qrData = JSON.stringify({
      code: claimCode,
      prize: selectedPrize.name_ar,
      type: selectedPrize.prize_type,
      exp: expiresAt,
    });

    // ── Decrement stock atomically ──
    const { data: decremented } = await supabase.rpc("decrement_prize_stock", {
      p_prize_id: selectedPrize.id,
    });

    if (!decremented) {
      // Stock ran out between selection and decrement
      const claimCode2 = generateClaimCode();
      await supabase.from("spin_sessions").insert({
        full_name: full_name.trim(),
        phone: phone.trim(),
        email: email?.trim() || null,
        phone_hash: phoneHash,
        spin_date: today,
        claim_code: claimCode2,
        claim_status: "no_prize",
        visitor_verified: visitorVerified,
        visitor_token: visitorTokenValue,
      });
      return json({
        success: true,
        won: false,
        message: "نفدت الجوائز الحالية — تابعنا للمفاجآت القادمة.",
      });
    }

    // ── Bump visitor token usage ──
    if (visitorTokenValue) {
      const { data: vRow } = await supabase
        .from("visitor_verifications")
        .select("id, used_count")
        .eq("token", visitorTokenValue)
        .maybeSingle();
      if (vRow) {
        await supabase
          .from("visitor_verifications")
          .update({ used_count: (vRow.used_count ?? 0) + 1 })
          .eq("id", vRow.id);
      }
    }

    // ── Fetch sponsor store info for display ──
    const { data: csRow } = await supabase
      .from("competition_stores")
      .select("store_id, stores:store_id(id, name_ar, unit_code, floor_id, category, logo_url, slug)")
      .eq("id", selectedPrize.competition_store_id)
      .maybeSingle();

    const storeData = (csRow?.stores ?? null) as {
      id: string; name_ar: string; unit_code: string | null;
      floor_id: string | null; category: string | null;
      logo_url: string | null; slug: string;
    } | null;

    // ── Record spin session ──
    const { error: insertErr } = await supabase.from("spin_sessions").insert({
      full_name: full_name.trim(),
      phone: phone.trim(),
      email: email?.trim() || null,
      phone_hash: phoneHash,
      spin_date: today,
      competition_store_id: selectedPrize.competition_store_id,
      prize_id: selectedPrize.id,
      claim_code: claimCode,
      qr_data: qrData,
      claim_status: "pending",
      expires_at: expiresAt,
      visitor_verified: visitorVerified,
      visitor_token: visitorTokenValue,
      prize_type: selectedPrize.prize_type,
    });

    if (insertErr) {
      if (insertErr.code === "23505") {
        return json({ error: "لقد شاركت اليوم بالفعل.", already_spun: true }, 409);
      }
      console.error("Insert error:", insertErr);
      return json({ error: "حدث خطأ — حاول مرة أخرى" }, 500);
    }

    return json({
      success: true,
      won: true,
      result: {
        claim_code: claimCode,
        qr_data: qrData,
        expires_at: expiresAt,
        prize_type: selectedPrize.prize_type,
        is_grand: selectedPrize.is_grand,
        visitor_only: selectedPrize.visitor_only,
        prize: {
          id: selectedPrize.id,
          name_ar: selectedPrize.name_ar,
          name_en: selectedPrize.name_en,
          category: selectedPrize.category,
          image_url: selectedPrize.image_url,
          redemption_rules_ar: selectedPrize.redemption_rules_ar,
        },
        store: {
          id: storeData?.id ?? null,
          name_ar: storeData?.name_ar ?? null,
          unit_code: storeData?.unit_code ?? null,
          floor_id: storeData?.floor_id ?? null,
          category: storeData?.category ?? null,
          logo_url: storeData?.logo_url ?? null,
          slug: storeData?.slug ?? null,
        },
      },
    });
  } catch (err) {
    console.error("Spin error:", err);
    return json({ error: "حدث خطأ غير متوقع" }, 500);
  }
}));

function generateClaimCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const segments: string[] = [];
  for (let s = 0; s < 3; s++) {
    let seg = "";
    for (let i = 0; i < 4; i++) {
      seg += chars[Math.floor(Math.random() * chars.length)];
    }
    segments.push(seg);
  }
  return segments.join("-");
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
