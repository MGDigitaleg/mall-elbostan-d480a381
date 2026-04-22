import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE_URL = "https://mallelbostan.com";
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;

const PING_ENDPOINTS = [
  `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`,
  `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`,
];

// Key pages to request indexing for via IndexNow (Bing/Yandex)
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

  try {
    const results: { endpoint: string; status: number | string }[] = [];

    // 1. Sitemap ping (Google + Bing)
    for (const url of PING_ENDPOINTS) {
      try {
        const res = await fetch(url, { method: "GET" });
        results.push({ endpoint: url.split("?")[0], status: res.status });
      } catch (e) {
        results.push({ endpoint: url.split("?")[0], status: `error: ${(e as Error).message}` });
      }
    }

    // 2. IndexNow (Bing + Yandex) — if INDEXNOW_KEY is configured
    const indexNowKey = Deno.env.get("INDEXNOW_KEY");
    if (indexNowKey) {
      const indexNowHosts = [
        "https://api.indexnow.org/indexnow",
        "https://www.bing.com/indexnow",
      ];

      const urlList = KEY_PAGES.map((p) => `${SITE_URL}${p}`);

      for (const host of indexNowHosts) {
        try {
          const res = await fetch(host, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
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
    }

    return new Response(
      JSON.stringify({
        success: true,
        timestamp: new Date().toISOString(),
        pings: results,
        indexNowConfigured: !!indexNowKey,
        pagesSubmitted: KEY_PAGES.length,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
