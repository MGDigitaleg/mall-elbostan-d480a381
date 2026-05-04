import { withLogging } from "../_shared/log.ts";
// Dynamic robots.txt generator — Mall El Bostan
// Reflects current admin routes, internal paths, and sitemap endpoints.
// Served by GET requests; cached at the edge for 1 hour.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE = "https://mallelbostan.com";
const FN_BASE = "https://wrheltmgquyqqhscrpds.supabase.co/functions/v1/sitemap";

// ── Allowed public routes (kept in sync with App.tsx) ─────────────
const ALLOWED = [
  "/",
  "/stores",
  "/stores/category/",
  "/products",
  "/map",
  "/leasing",
  "/about",
  "/contact",
  "/blog",
  "/faq",
  "/careers",
  "/join-marketplace",
  "/opening-day",
  "/spin-win",
  "/daily-deals",
  "/new-cairo-branch",
  "/downtown-branch",
  "/downtown-directory",
  "/devices",
  "/market-echo",
  "/tech-planet",
  "/kz",
  "/sitemap",
  "/privacy",
  "/terms",
  "/reward-terms",
];

// ── Disallowed routes ─────────────────────────────────────────────
const DISALLOWED = [
  "/admin",
  "/admin/",
  "/spin-win/claim",
  "/spin-win/account",
  "/countdown",
  "/kz/cart",
  "/kz/search",
  "/products?*",
  "/stores?*",
  "/kz/products?*",
  "/daily-deals?*",
];

// Sensitive crawlers we want to keep out entirely
const BLOCKED_BOTS = ["GPTBot", "CCBot", "anthropic-ai", "Google-Extended"];

function buildRobots(): string {
  const lines: string[] = [];
  lines.push("# Mall El Bostan — مول البستان");
  lines.push(`# ${SITE}`);
  lines.push(`# Generated: ${new Date().toISOString()}`);
  lines.push("");

  // AI training crawlers — explicit block
  for (const bot of BLOCKED_BOTS) {
    lines.push(`User-agent: ${bot}`);
    lines.push("Disallow: /");
    lines.push("");
  }

  // Default rules for all other crawlers
  lines.push("User-agent: *");
  for (const path of ALLOWED) lines.push(`Allow: ${path}`);
  lines.push("");
  lines.push("# Block admin, internal flows, and parameterized listings");
  for (const path of DISALLOWED) lines.push(`Disallow: ${path}`);
  lines.push("");
  lines.push("Crawl-delay: 1");
  lines.push("");

  // Sitemaps — prefer the dynamic edge function (always fresh lastmod)
  lines.push("# Sitemaps");
  lines.push(`Sitemap: ${SITE}/sitemap.xml`);
  lines.push(`Sitemap: ${FN_BASE}`);
  lines.push(`Sitemap: ${FN_BASE}?section=pages`);
  lines.push(`Sitemap: ${FN_BASE}?section=categories`);
  lines.push(`Sitemap: ${FN_BASE}?section=devices`);
  lines.push(`Sitemap: ${FN_BASE}?section=stores`);
  lines.push(`Sitemap: ${FN_BASE}?section=products`);
  lines.push(`Sitemap: ${FN_BASE}?section=offers`);
  lines.push(`Sitemap: ${FN_BASE}?section=blog`);
  lines.push(`Sitemap: ${FN_BASE}?section=images`);
  lines.push(`Sitemap: ${FN_BASE}?section=news`);

  return lines.join("\n") + "\n";
}

Deno.serve(withLogging("robots", (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  return new Response(buildRobots(), {
    headers: {
      ...corsHeaders,
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}));
