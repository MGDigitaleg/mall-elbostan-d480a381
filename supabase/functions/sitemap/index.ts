import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BASE_URL = "https://mallelbostan.com";
const SPLIT_THRESHOLD = 500;

// Keep this in sync with public/sitemap.xml.
// Excluded on purpose:
//   - /countdown      → noIndex + Disallow in robots.txt (campaign-only page)
//   - /kz/products    → redirects to /products (canonical)
//   - /blog, /careers, /daily-deals → conditionally noIndex when empty;
//                       allowed in robots.txt but we keep them out of the
//                       sitemap until they have published content (added back
//                       per-row via DB queries below).
const STATIC_ROUTES = [
  { loc: "/", priority: "1.0", changefreq: "daily" },
  { loc: "/stores", priority: "0.9", changefreq: "daily" },
  { loc: "/products", priority: "0.9", changefreq: "daily" },
  { loc: "/map", priority: "0.8", changefreq: "weekly" },
  { loc: "/leasing", priority: "0.8", changefreq: "weekly" },
  { loc: "/about", priority: "0.7", changefreq: "monthly" },
  { loc: "/contact", priority: "0.7", changefreq: "monthly" },
  { loc: "/faq", priority: "0.6", changefreq: "monthly" },
  { loc: "/join-marketplace", priority: "0.6", changefreq: "monthly" },
  { loc: "/opening-day", priority: "0.8", changefreq: "weekly" },
  { loc: "/spin-win", priority: "0.7", changefreq: "weekly" },
  { loc: "/new-cairo-branch", priority: "0.8", changefreq: "monthly" },
  { loc: "/downtown-branch", priority: "0.8", changefreq: "monthly" },
  { loc: "/downtown-directory", priority: "0.7", changefreq: "weekly" },
  { loc: "/market-echo", priority: "0.5", changefreq: "monthly" },
  { loc: "/kz", priority: "0.7", changefreq: "daily" },
  { loc: "/privacy", priority: "0.3", changefreq: "yearly" },
  { loc: "/terms", priority: "0.3", changefreq: "yearly" },
  { loc: "/reward-terms", priority: "0.3", changefreq: "yearly" },
];

// Device category landing pages — keep in sync with src/lib/deviceCatalog.ts
const DEVICE_SLUGS = [
  "laptops","smartphones","monitors","cpus","headphones","keyboards","storage",
  "mice","cameras","gaming-consoles","printers","routers","tablets","smartwatches",
  "speakers","ram","webcams","cables","chargers","networking","televisions",
  "projectors","servers","external-storage","controllers","microphones","ups",
  "scanners","accessories","nas","intercoms","smart-lighting","security-cameras",
  "pc-components","cooling","power-adapters","gaming-laptops","macbook",
  "graphics-cards","earbuds","powerbanks","vr-gaming","office-supplies","streaming-gear",
];
const HIGH_PRIORITY_DEVICES = new Set([
  "laptops","smartphones","monitors","gaming-consoles","macbook","gaming-laptops",
  "tablets","televisions","graphics-cards",
]);
const MID_PRIORITY_DEVICES = new Set([
  "cpus","headphones","keyboards","storage","cameras","printers","routers",
  "smartwatches","speakers","ram","projectors","servers","controllers","microphones",
  "earbuds","security-cameras","pc-components","networking","external-storage",
]);
function devicePriority(slug: string): string {
  if (HIGH_PRIORITY_DEVICES.has(slug)) return "0.7";
  if (MID_PRIORITY_DEVICES.has(slug)) return "0.6";
  return "0.5";
}
// Validate uniqueness at module load (catches drift early in logs).
{
  const seen = new Set<string>();
  for (const s of DEVICE_SLUGS) {
    if (seen.has(s)) console.error(`[sitemap] duplicate device slug: ${s}`);
    seen.add(s);
  }
}

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function urlEntry(loc: string, lastmod?: string, changefreq = "weekly", priority = "0.5"): string {
  return `  <url>
    <loc>${escapeXml(loc)}</loc>${lastmod ? `\n    <lastmod>${lastmod.slice(0, 10)}</lastmod>` : ""}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function wrapUrlset(entries: string[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>`;
}

function buildSitemapIndex(sitemaps: { loc: string; lastmod?: string }[]): string {
  const items = sitemaps
    .map(
      (s) =>
        `  <sitemap>
    <loc>${escapeXml(s.loc)}</loc>${s.lastmod ? `\n    <lastmod>${s.lastmod}</lastmod>` : ""}
  </sitemap>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</sitemapindex>`;
}

function xmlResponse(body: string) {
  return new Response(body, {
    headers: {
      ...corsHeaders,
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

interface DynamicData {
  stores: { slug: string; updated_at: string }[];
  products: { slug: string; updated_at: string }[];
  blog: { slug: string; updated_at: string }[];
  downtown: { slug: string; updated_at: string }[];
  kzProducts: { slug: string; updated_at: string }[];
}

function latestDate(items: { updated_at: string }[]): string | undefined {
  if (items.length === 0) return undefined;
  return items.reduce((a, b) => (a.updated_at > b.updated_at ? a : b)).updated_at.slice(0, 10);
}

async function fetchAllData(supabase: any): Promise<DynamicData> {
  const [storesRes, productsRes, blogRes, downtownRes, kzProductsRes] = await Promise.all([
    supabase.from("stores").select("slug, updated_at").neq("status", "hidden"),
    supabase.from("products").select("slug, updated_at").eq("status", "published"),
    supabase.from("blog_posts").select("slug, updated_at, published_at").not("published_at", "is", null),
    supabase.from("downtown_merchants").select("slug, updated_at").eq("is_active", true),
    supabase.from("kz_products").select("slug, updated_at").eq("status", "published"),
  ]);

  return {
    stores: (storesRes.data ?? []) as { slug: string; updated_at: string }[],
    products: (productsRes.data ?? []) as { slug: string; updated_at: string }[],
    blog: (blogRes.data ?? []) as { slug: string; updated_at: string }[],
    downtown: (downtownRes.data ?? []) as { slug: string; updated_at: string }[],
    kzProducts: (kzProductsRes.data ?? []) as { slug: string; updated_at: string }[],
  };
}

function totalUrls(data: DynamicData): number {
  return (
    STATIC_ROUTES.length +
    DEVICE_SLUGS.length +
    data.stores.length +
    data.products.length +
    data.blog.length +
    data.downtown.length +
    data.kzProducts.length
  );
}

/** Deduplicate `<url>` entries by `<loc>` (defensive — slugs should already be unique). */
function dedupeEntries(entries: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const e of entries) {
    const m = e.match(/<loc>([^<]+)<\/loc>/);
    const loc = m?.[1];
    if (!loc) { out.push(e); continue; }
    if (seen.has(loc)) continue;
    seen.add(loc);
    out.push(e);
  }
  return out;
}

/** Build a single flat sitemap with all URLs */
function buildFlatSitemap(data: DynamicData): string {
  const entries: string[] = [];

  for (const route of STATIC_ROUTES) {
    entries.push(urlEntry(`${BASE_URL}${route.loc}`, undefined, route.changefreq, route.priority));
  }
  for (const slug of DEVICE_SLUGS) {
    entries.push(urlEntry(`${BASE_URL}/devices/${slug}`, undefined, "weekly", devicePriority(slug)));
  }
  for (const s of data.stores) {
    entries.push(urlEntry(`${BASE_URL}/stores/${s.slug}`, s.updated_at, "weekly", "0.7"));
  }
  for (const p of data.products) {
    entries.push(urlEntry(`${BASE_URL}/products/${p.slug}`, p.updated_at, "weekly", "0.6"));
  }
  for (const p of data.blog) {
    entries.push(urlEntry(`${BASE_URL}/blog/${p.slug}`, p.updated_at, "monthly", "0.6"));
  }
  for (const m of data.downtown) {
    entries.push(urlEntry(`${BASE_URL}/downtown-directory/${m.slug}`, m.updated_at, "monthly", "0.5"));
  }
  for (const p of data.kzProducts) {
    entries.push(urlEntry(`${BASE_URL}/products/${p.slug}`, p.updated_at, "weekly", "0.6"));
  }

  return wrapUrlset(dedupeEntries(entries));
}

/** Build sub-sitemap for a specific section */
function buildSubSitemap(section: string, data: DynamicData): string {
  const entries: string[] = [];

  switch (section) {
    case "pages":
      for (const route of STATIC_ROUTES) {
        entries.push(urlEntry(`${BASE_URL}${route.loc}`, undefined, route.changefreq, route.priority));
      }
      for (const m of data.downtown) {
        entries.push(urlEntry(`${BASE_URL}/downtown-directory/${m.slug}`, m.updated_at, "monthly", "0.5"));
      }
      break;

    case "devices":
      for (const slug of DEVICE_SLUGS) {
        entries.push(urlEntry(`${BASE_URL}/devices/${slug}`, undefined, "weekly", devicePriority(slug)));
      }
      break;

    case "stores":
      for (const s of data.stores) {
        entries.push(urlEntry(`${BASE_URL}/stores/${s.slug}`, s.updated_at, "weekly", "0.7"));
      }
      break;

    case "products":
      for (const p of data.products) {
        entries.push(urlEntry(`${BASE_URL}/products/${p.slug}`, p.updated_at, "weekly", "0.6"));
      }
      for (const p of data.kzProducts) {
        entries.push(urlEntry(`${BASE_URL}/products/${p.slug}`, p.updated_at, "weekly", "0.6"));
      }
      break;

    case "blog":
      for (const p of data.blog) {
        entries.push(urlEntry(`${BASE_URL}/blog/${p.slug}`, p.updated_at, "monthly", "0.6"));
      }
      break;

    default:
      break;
  }

  return wrapUrlset(dedupeEntries(entries));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);
    const section = url.searchParams.get("section");

    const data = await fetchAllData(supabase);
    const total = totalUrls(data);

    // If a specific section is requested, return that sub-sitemap
    if (section) {
      return xmlResponse(buildSubSitemap(section, data));
    }

    // Below threshold → single flat sitemap
    if (total <= SPLIT_THRESHOLD) {
      return xmlResponse(buildFlatSitemap(data));
    }

    // Above threshold → sitemap index pointing to sub-sitemaps
    const fnUrl = `${supabaseUrl}/functions/v1/sitemap`;
    const today = new Date().toISOString().slice(0, 10);

    const sitemaps = [
      { loc: `${fnUrl}?section=pages`, lastmod: today },
      { loc: `${fnUrl}?section=devices`, lastmod: today },
      {
        loc: `${fnUrl}?section=stores`,
        lastmod: latestDate(data.stores) ?? today,
      },
      {
        loc: `${fnUrl}?section=products`,
        lastmod: latestDate([...data.products, ...data.kzProducts]) ?? today,
      },
      {
        loc: `${fnUrl}?section=blog`,
        lastmod: latestDate(data.blog) ?? today,
      },
    ];

    return xmlResponse(buildSitemapIndex(sitemaps));
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return new Response("Internal Server Error", {
      status: 500,
      headers: corsHeaders,
    });
  }
});
