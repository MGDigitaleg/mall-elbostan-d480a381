import { withLogging } from "../_shared/log.ts";
// Dynamic robots.txt generator — Mall El Bostan
// Reflects current admin routes, internal paths, and sitemap endpoints.
// Served by GET requests; cached at the edge for 1 hour.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Public site origin — overridable per environment via PUBLIC_SITE_URL secret.
// FN_BASE derives from SUPABASE_URL so each environment uses its own functions endpoint.
const SITE = (Deno.env.get("PUBLIC_SITE_URL") ?? "https://mallelbostan.com").replace(/\/+$/, "");
const SUPABASE_URL = (Deno.env.get("SUPABASE_URL") ?? "https://wrheltmgquyqqhscrpds.supabase.co").replace(/\/+$/, "");
const FN_BASE = `${SUPABASE_URL}/functions/v1/sitemap`;

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

  // Sitemaps — expose clean public URLs on the canonical domain instead
  // of the internal Supabase functions endpoint. Each per-section file is
  // a static shim under /public that wraps the live edge function.
  lines.push("# Sitemaps");
  lines.push(`Sitemap: ${SITE}/sitemap.xml`);
  for (const key of ["pages", "categories", "devices", "stores", "products", "offers", "blog", "images", "news"]) {
    lines.push(`Sitemap: ${SITE}/sitemap-${key}.xml`);
  }

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
