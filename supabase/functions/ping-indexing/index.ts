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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const sb = createClient(supabaseUrl, serviceKey);

  try {
    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const source: string = body.source ?? "manual";
    const requestedEnv: string | undefined = body.env;
    const customUrls: string[] = body.urls ?? [];

    const envConfig = resolveEnv(requestedEnv);
    const { siteUrl, host, indexNowKeyEnv } = envConfig;

    const urlList = customUrls.length > 0
      ? customUrls.map((u: string) => u.startsWith("http") ? u : `${siteUrl}${u}`)
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
      "https://api.indexnow.org/indexnow",
      "https://www.bing.com/indexnow",
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

    await sb.from("indexing_logs").insert({
      source: "unknown",
      urls_submitted: 0,
      url_list: [],
      results: [],
      success: false,
      error_message: msg,
    }).catch(() => {});

    return new Response(
      JSON.stringify({ success: false, error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
