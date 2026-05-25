import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type Action =
  | { action: "invite"; email: string; role: "admin" | "editor" }
  | { action: "set_role"; user_id: string; role: "admin" | "editor" | "none" }
  | { action: "reset_password"; email: string }
  | { action: "disable"; user_id: string; disabled: boolean }
  | { action: "delete"; user_id: string };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const url = Deno.env.get("SUPABASE_URL")!;
    const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
    const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const userClient = createClient(url, anon, { global: { headers: { Authorization: authHeader } } });
    const token = authHeader.replace("Bearer ", "");
    const { data: claims } = await userClient.auth.getClaims(token);
    const actorId = claims?.claims?.sub;
    if (!actorId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const admin = createClient(url, service);
    const { data: hasAdmin } = await admin.rpc("has_role", { _user_id: actorId, _role: "admin" });
    if (!hasAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const body = (await req.json()) as Action;
    const origin = req.headers.get("origin") ?? "https://mall-elbostan.lovable.app";

    switch (body.action) {
      case "invite": {
        if (!body.email) throw new Error("email required");
        const { data, error } = await admin.auth.admin.inviteUserByEmail(body.email, {
          redirectTo: `${origin}/admin/reset-password`,
        });
        if (error) throw error;
        if (data.user) {
          await admin.from("user_roles").insert({ user_id: data.user.id, role: body.role });
        }
        return ok({ user: data.user });
      }
      case "set_role": {
        await admin.from("user_roles").delete().eq("user_id", body.user_id);
        if (body.role !== "none") {
          const { error } = await admin.from("user_roles").insert({ user_id: body.user_id, role: body.role });
          if (error) throw error;
        }
        return ok({ ok: true });
      }
      case "reset_password": {
        const { error } = await admin.auth.admin.generateLink({
          type: "recovery",
          email: body.email,
          options: { redirectTo: `${origin}/admin/reset-password` },
        });
        if (error) throw error;
        return ok({ ok: true });
      }
      case "disable": {
        const { error } = await admin.auth.admin.updateUserById(body.user_id, {
          ban_duration: body.disabled ? "876000h" : "none",
        } as any);
        if (error) throw error;
        return ok({ ok: true });
      }
      case "delete": {
        if (body.user_id === actorId) throw new Error("Cannot delete self");
        await admin.from("user_roles").delete().eq("user_id", body.user_id);
        const { error } = await admin.auth.admin.deleteUser(body.user_id);
        if (error) throw error;
        return ok({ ok: true });
      }
    }
    return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e?.message ?? e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});

function ok(payload: unknown) {
  return new Response(JSON.stringify(payload), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
