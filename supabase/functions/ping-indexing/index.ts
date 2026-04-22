import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE_URL = "https://mallelbostan.com";

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
    const customUrls: string[] = body.urls ?? [];
    const urlList = customUrls.length > 0
      ? customUrls.map((u: string) => u.startsWith("http") ? u : `${SITE_URL}${u}`)
      : KEY_PAGES.map((p) => `${SITE_URL}${p}`);

    const indexNowKey = Deno.env.get("INDEXNOW_KEY");
    const results: { endpoint: string; status: number | string }[] = [];

    if (!indexNowKey) {
      // Log the failed attempt
      await sb.from("indexing_logs").insert({
        source,
        urls_submitted: 0,
        url_list: [],
        results: [],
        success: false,
        error_message: "INDEXNOW_KEY not configured",
      });

      return new Response(
        JSON.stringify({
          success: false,
          error: "INDEXNOW_KEY not configured. Add an IndexNow key to enable search engine pinging.",
          setup: "Generate a key at https://www.indexnow.org/genkey, add it as INDEXNOW_KEY secret, and place {key}.txt in /public/",
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const indexNowHosts = [
      "https://api.indexnow.org/indexnow",
      "https://www.bing.com/indexnow",
    ];

    for (const host of indexNowHosts) {
      try {
        const res = await fetch(host, {
          method: "POST",
          headers: { "Content-Type": "application/json; charset=utf-8" },
          body: JSON.stringify({
            host: "mallelbostan.com",
            key: indexNowKey,
            keyLocation: `${SITE_URL}/${indexNowKey}.txt`,
            urlList,
          }),
        });
        results.push({ endpoint: host, status: res.status });
      } catch (e) {
        results.push({ endpoint: host, status: `error: ${(e as Error).message}` });
      }
    }

    const allSuccess = results.every(
      (r) => typeof r.status === "number" && r.status >= 200 && r.status < 300
    );

    // Log to database
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
        timestamp: new Date().toISOString(),
        pings: results,
        urlsSubmitted: urlList.length,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";

    // Log error
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
