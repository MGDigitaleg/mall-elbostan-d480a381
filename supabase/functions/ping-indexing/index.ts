import { withLogging } from "../_shared/log.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/* ── Environment-aware configuration ── */

interface EnvConfig {
  siteUrl: string;
  host: string;
  indexNowKeyEnv: string;
}

const ENV_CONFIGS: Record<string, EnvConfig> = {
  prod: {
    siteUrl: "https://mallelbostan.com",
    host: "mallelbostan.com",
    indexNowKeyEnv: "INDEXNOW_KEY",
  },
  staging: {
    siteUrl: "https://mall-elbostan.lovable.app",
    host: "mall-elbostan.lovable.app",
    indexNowKeyEnv: "INDEXNOW_KEY_STAGING",
  },
  dev: {
    siteUrl: "https://id-preview--e15fd6f4-5b0a-4c66-a6f5-7545a6eb5f24.lovable.app",
    host: "id-preview--e15fd6f4-5b0a-4c66-a6f5-7545a6eb5f24.lovable.app",
    indexNowKeyEnv: "INDEXNOW_KEY_DEV",
  },
};

function resolveEnv(requested?: string): EnvConfig {
  // 1. Explicit env from request body
  if (requested && ENV_CONFIGS[requested]) return ENV_CONFIGS[requested];

  // 2. Secret-based detection: DEPLOY_ENV
  const deployEnv = Deno.env.get("DEPLOY_ENV");
  if (deployEnv && ENV_CONFIGS[deployEnv]) return ENV_CONFIGS[deployEnv];

  // 3. Fallback: if INDEXNOW_KEY exists → prod, else staging
  if (Deno.env.get("INDEXNOW_KEY")) return ENV_CONFIGS.prod;
  if (Deno.env.get("INDEXNOW_KEY_STAGING")) return ENV_CONFIGS.staging;
  return ENV_CONFIGS.prod;
}

/* ── Key pages ── */

const KEY_PAGES = [
  "/", "/stores", "/products", "/map", "/leasing",
  "/opening-day", "/spin-win", "/daily-deals",
  "/new-cairo-branch", "/downtown-branch", "/downtown-directory",
  "/about", "/contact", "/blog", "/faq", "/careers",
  "/kz", "/kz/products", "/market-echo",
];

serve(withLogging("ping-indexing", async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const sb = createClient(supabaseUrl, serviceKey);

  try {
    // ── Auth: accept either an admin bearer token OR an internal webhook secret ──
    const authHeader = req.headers.get("Authorization") ?? "";
    const webhookSecret = req.headers.get("X-Webhook-Secret");
    const expectedWebhookSecret = Deno.env.get("INDEXING_WEBHOOK_SECRET");
    const isWebhook = Boolean(
      expectedWebhookSecret &&
      webhookSecret &&
      webhookSecret === expectedWebhookSecret
    );

    if (!isWebhook) {
      if (!authHeader) {
        return new Response(
          JSON.stringify({ success: false, error: "Unauthorized" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data: { user }, error: authErr } = await userClient.auth.getUser(
        authHeader.replace("Bearer ", "")
      );
      if (authErr || !user) {
        return new Response(
          JSON.stringify({ success: false, error: "Unauthorized" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const { data: isAdmin } = await sb.rpc("has_role", {
        _user_id: user.id,
        _role: "admin",
      });
      if (!isAdmin) {
        return new Response(
          JSON.stringify({ success: false, error: "Forbidden" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const source: string = body.source ?? (isWebhook ? "trigger" : "manual");
    const requestedEnv: string | undefined = body.env;
    const customUrls: string[] = body.urls ?? [];

    const envConfig = resolveEnv(requestedEnv);
    const { siteUrl, host, indexNowKeyEnv } = envConfig;

    // Restrict customUrls: only allow URLs whose host matches the resolved siteUrl host,
    // or relative paths (which get prefixed with siteUrl).
    const normalizedUrls: string[] = [];
    for (const u of customUrls) {
      if (typeof u !== "string" || u.length === 0) continue;
      if (u.startsWith("http")) {
        try {
          const parsed = new URL(u);
          if (parsed.host !== host) continue; // reject foreign hosts
          normalizedUrls.push(parsed.toString());
        } catch {
          continue;
        }
      } else {
        normalizedUrls.push(`${siteUrl}${u.startsWith("/") ? u : `/${u}`}`);
      }
    }
    const urlList = normalizedUrls.length > 0
      ? normalizedUrls
      : KEY_PAGES.map((p) => `${siteUrl}${p}`);

    const indexNowKey = Deno.env.get(indexNowKeyEnv);
    const keyFileUrl = `${siteUrl}/${indexNowKey ?? "MISSING"}.txt`;

    // ── Pre-flight: verify key file is reachable ──
    let keyFileOk = false;
    let keyFileError: string | null = null;
    if (indexNowKey) {
      try {
        const probe = await fetch(keyFileUrl, { method: "HEAD" });
        if (probe.status === 200) {
          keyFileOk = true;
        } else {
          keyFileError = `Key file returned HTTP ${probe.status} at ${keyFileUrl}`;
        }
      } catch (e) {
        keyFileError = `Key file unreachable: ${(e as Error).message}`;
      }
    }
    const results: { endpoint: string; status: number | string }[] = [];

    if (!indexNowKey) {
      await sb.from("indexing_logs").insert({
        source,
        urls_submitted: 0,
        url_list: [],
        results: [],
        success: false,
        error_message: `${indexNowKeyEnv} not configured (env: ${requestedEnv ?? "auto"})`,
      });

      return new Response(
        JSON.stringify({
          success: false,
          resolvedEnv: requestedEnv ?? "auto",
          error: `${indexNowKeyEnv} not configured. Add an IndexNow key to enable search engine pinging.`,
          setup: `Generate a key at https://www.indexnow.org/genkey, add it as ${indexNowKeyEnv} secret, and place {key}.txt at ${siteUrl}/{key}.txt`,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── Key file missing → warn but still attempt (some engines tolerate it) ──
    if (!keyFileOk) {
      const warning = keyFileError ?? "Key file check skipped";
      await sb.from("indexing_logs").insert({
        source,
        urls_submitted: 0,
        url_list: [],
        results: [{ check: "key_file", status: warning }],
        success: false,
        error_message: `Key file verification failed: ${warning}. Place ${indexNowKey}.txt at ${siteUrl}/${indexNowKey}.txt`,
      });

      return new Response(
        JSON.stringify({
          success: false,
          resolvedEnv: requestedEnv ?? "auto",
          keyFileUrl,
          error: warning,
          fix: `Upload a text file containing only "${indexNowKey}" to ${siteUrl}/${indexNowKey}.txt`,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const indexNowHosts = [
      "https://api.indexnow.org/indexnow", // fans out to Bing, Yandex, Seznam, Naver
      "https://www.bing.com/indexnow",
      "https://yandex.com/indexnow",
    ];

    for (const endpoint of indexNowHosts) {
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json; charset=utf-8" },
          body: JSON.stringify({
            host,
            key: indexNowKey,
            keyLocation: `${siteUrl}/${indexNowKey}.txt`,
            urlList,
          }),
        });
        results.push({ endpoint, status: res.status });
      } catch (e) {
        results.push({ endpoint, status: `error: ${(e as Error).message}` });
      }
    }

    const allSuccess = results.every(
      (r) => typeof r.status === "number" && r.status >= 200 && r.status < 300
    );

    await sb.from("indexing_logs").insert({
      source,
      urls_submitted: urlList.length,
      url_list: urlList,
      results,
      success: allSuccess,
      error_message: allSuccess ? null : JSON.stringify(results.filter(r => typeof r.status !== "number" || r.status >= 400)),
    });

    return new Response(
      JSON.stringify({
        success: true,
        resolvedEnv: requestedEnv ?? "auto",
        resolvedHost: host,
        timestamp: new Date().toISOString(),
        pings: results,
        urlsSubmitted: urlList.length,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";

    const { error: logInsertError } = await sb.from("indexing_logs").insert({
      source: "unknown",
      urls_submitted: 0,
      url_list: [],
      results: [],
      success: false,
      error_message: msg,
    });

    if (logInsertError) {
      console.error("Failed to write indexing error log:", logInsertError);
    }

    return new Response(
      JSON.stringify({ success: false, error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
