import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Verify admin auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return json({ error: "Unauthorized" }, 401);
    }

    const { data: { user }, error: authErr } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authErr || !user) {
      return json({ error: "Unauthorized" }, 401);
    }

    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });

    if (!isAdmin) {
      return json({ error: "Forbidden" }, 403);
    }

    const { claim_code, action } = await req.json();

    if (!claim_code?.trim()) {
      return json({ error: "رمز الاستلام مطلوب" }, 400);
    }

    // Look up the claim
    const { data: session, error: lookupErr } = await supabase
      .from("spin_sessions")
      .select(`
        *,
        store_prizes(*),
        competition_stores(*, stores:store_id(name_ar, unit_code))
      `)
      .eq("claim_code", claim_code.trim().toUpperCase())
      .maybeSingle();

    if (lookupErr || !session) {
      return json({ error: "رمز الاستلام غير صالح" }, 404);
    }

    if (action === "verify") {
      // Just return the details
      return json({
        success: true,
        session: {
          id: session.id,
          full_name: session.full_name,
          phone: session.phone,
          claim_code: session.claim_code,
          claim_status: session.claim_status,
          expires_at: session.expires_at,
          created_at: session.created_at,
          prize: session.store_prizes,
          store: (session.competition_stores as any)?.stores ?? null,
        },
      });
    }

    if (action === "redeem") {
      if (session.claim_status === "redeemed") {
        return json({ error: "تم استلام هذه المكافأة بالفعل", already_redeemed: true }, 409);
      }
      if (session.claim_status === "expired" || session.claim_status === "cancelled") {
        return json({ error: "هذه المكافأة منتهية الصلاحية أو ملغية" }, 410);
      }
      if (session.expires_at && new Date(session.expires_at) < new Date()) {
        await supabase
          .from("spin_sessions")
          .update({ claim_status: "expired" })
          .eq("id", session.id);
        return json({ error: "انتهت صلاحية هذه المكافأة" }, 410);
      }

      const { error: updateErr } = await supabase
        .from("spin_sessions")
        .update({
          claim_status: "redeemed",
          redeemed_at: new Date().toISOString(),
          redeemed_by: user.email ?? user.id,
        })
        .eq("id", session.id);

      if (updateErr) {
        return json({ error: "حدث خطأ أثناء تحديث حالة الاستلام" }, 500);
      }

      return json({ success: true, message: "تم تأكيد استلام المكافأة بنجاح" });
    }

    return json({ error: "إجراء غير صالح" }, 400);
  } catch (err) {
    console.error("Verify claim error:", err);
    return json({ error: "حدث خطأ غير متوقع" }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};
