import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.49.1/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const { full_name, phone, email } = await req.json();

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

    // ── Check daily limit ──
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

    // ── Stage 1: Pick a participating store ──
    const { data: activeStores } = await supabase
      .from("competition_stores")
      .select("id, store_id, stores:store_id(id, name_ar, unit_code, floor_id, category, logo_url, slug)")
      .eq("is_active", true);

    if (!activeStores || activeStores.length === 0) {
      return json({ error: "لا توجد متاجر مشاركة حاليًا" }, 404);
    }

    // Filter to stores that have prizes with stock > 0
    const storesWithPrizes: typeof activeStores = [];
    for (const store of activeStores) {
      const { data: prizes } = await supabase
        .from("store_prizes")
        .select("id, remaining_stock")
        .eq("competition_store_id", store.id)
        .eq("is_active", true)
        .gt("remaining_stock", 0);

      if (prizes && prizes.length > 0) {
        storesWithPrizes.push(store);
      }
    }

    if (storesWithPrizes.length === 0) {
      // No prizes available — record a "no prize" spin
      const claimCode = generateClaimCode();
      await supabase.from("spin_sessions").insert({
        full_name: full_name.trim(),
        phone: phone.trim(),
        email: email?.trim() || null,
        phone_hash: phoneHash,
        spin_date: today,
        claim_code: claimCode,
        claim_status: "no_prize",
      });

      return json({ success: true, won: false, message: "شكرًا لمشاركتك — لم تتوفر مكافأة هذه المرة." });
    }

    // Random store selection (equal weight per store)
    const selectedStore = storesWithPrizes[Math.floor(Math.random() * storesWithPrizes.length)];

    // ── Stage 2: Pick a prize from that store ──
    const { data: availablePrizes } = await supabase
      .from("store_prizes")
      .select("*")
      .eq("competition_store_id", selectedStore.id)
      .eq("is_active", true)
      .gt("remaining_stock", 0);

    if (!availablePrizes || availablePrizes.length === 0) {
      return json({ error: "حدث خطأ — حاول مرة أخرى" }, 500);
    }

    // Weighted random selection
    const totalWeight = availablePrizes.reduce((sum, p) => sum + p.probability_weight, 0);
    let random = Math.random() * totalWeight;
    let selectedPrize = availablePrizes[availablePrizes.length - 1];
    for (const prize of availablePrizes) {
      random -= prize.probability_weight;
      if (random <= 0) {
        selectedPrize = prize;
        break;
      }
    }

    // ── Generate claim code ──
    const claimCode = generateClaimCode();
    const expiresAt = selectedPrize.validity_days
      ? new Date(Date.now() + selectedPrize.validity_days * 86400000).toISOString()
      : new Date(Date.now() + 30 * 86400000).toISOString();

    // QR data: compact JSON with claim info
    const qrData = JSON.stringify({
      code: claimCode,
      prize: selectedPrize.name_ar,
      store: (selectedStore.stores as any)?.name_ar ?? "",
      exp: expiresAt,
    });

    // ── Decrement stock ──
    const { error: stockErr } = await supabase.rpc("decrement_prize_stock", {
      p_prize_id: selectedPrize.id,
    });

    // If RPC doesn't exist yet, do it manually
    if (stockErr) {
      await supabase
        .from("store_prizes")
        .update({ remaining_stock: selectedPrize.remaining_stock - 1 })
        .eq("id", selectedPrize.id);
    }

    // ── Record spin session ──
    const { error: insertErr } = await supabase.from("spin_sessions").insert({
      full_name: full_name.trim(),
      phone: phone.trim(),
      email: email?.trim() || null,
      phone_hash: phoneHash,
      spin_date: today,
      competition_store_id: selectedStore.id,
      prize_id: selectedPrize.id,
      claim_code: claimCode,
      qr_data: qrData,
      claim_status: "pending",
      expires_at: expiresAt,
    });

    if (insertErr) {
      if (insertErr.code === "23505") {
        return json({ error: "لقد شاركت اليوم بالفعل.", already_spun: true }, 409);
      }
      console.error("Insert error:", insertErr);
      return json({ error: "حدث خطأ — حاول مرة أخرى" }, 500);
    }

    const storeData = selectedStore.stores as any;

    return json({
      success: true,
      won: true,
      result: {
        claim_code: claimCode,
        qr_data: qrData,
        expires_at: expiresAt,
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
});

function generateClaimCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const segments = [];
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
