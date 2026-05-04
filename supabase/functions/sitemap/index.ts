import { withLogging } from "../_shared/log.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BASE_URL = "https://mallelbostan.com";

// XML namespaces
const NS = {
  url: 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
  image: 'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"',
  news: 'xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"',
  video: 'xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"',
  xhtml: 'xmlns:xhtml="http://www.w3.org/1999/xhtml"',
};

// Category slugs (for clean /stores/category/<slug> URLs)
const CATEGORY_SLUGS: { slug: string; label: string }[] = [
  { slug: "phones", label: "الهواتف والإكسسوارات" },
  { slug: "computers", label: "الكمبيوتر والأجهزة" },
  { slug: "gaming", label: "الألعاب والترفيه" },
  { slug: "networks", label: "الشبكات والأنظمة الأمنية" },
  { slug: "printing", label: "الطباعة والتصوير" },
  { slug: "maintenance", label: "الصيانة والدعم الفني" },
  { slug: "components", label: "المكونات والتجميع" },
  { slug: "screens", label: "الشاشات" },
  { slug: "smart-home", label: "الأنظمة الذكية" },
  { slug: "office", label: "حلول المكاتب" },
];

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
  { loc: "/daily-deals", priority: "0.8", changefreq: "daily" },
  { loc: "/new-cairo-branch", priority: "0.8", changefreq: "monthly" },
  { loc: "/downtown-branch", priority: "0.8", changefreq: "monthly" },
  { loc: "/downtown-directory", priority: "0.7", changefreq: "weekly" },
  
  { loc: "/blog", priority: "0.6", changefreq: "weekly" },
  { loc: "/careers", priority: "0.5", changefreq: "monthly" },
  { loc: "/market-echo", priority: "0.5", changefreq: "monthly" },
  { loc: "/tech-planet", priority: "0.6", changefreq: "monthly" },
  { loc: "/kz", priority: "0.7", changefreq: "daily" },
  { loc: "/sitemap", priority: "0.3", changefreq: "monthly" },
  { loc: "/privacy", priority: "0.3", changefreq: "yearly" },
  { loc: "/terms", priority: "0.3", changefreq: "yearly" },
  { loc: "/reward-terms", priority: "0.3", changefreq: "yearly" },
];

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

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

type ImageData = { loc: string; title?: string; caption?: string };
type UrlOpts = {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
  images?: ImageData[];
  hreflang?: boolean;
};

function urlEntry(opts: UrlOpts): string {
  const { loc, lastmod, changefreq = "weekly", priority = "0.5", images = [], hreflang = true } = opts;
  let body = `  <url>\n    <loc>${escapeXml(loc)}</loc>`;
  if (lastmod) body += `\n    <lastmod>${lastmod.slice(0, 10)}</lastmod>`;
  body += `\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>`;
  if (hreflang) {
    body += `\n    <xhtml:link rel="alternate" hreflang="ar-EG" href="${escapeXml(loc)}"/>`;
    body += `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(loc)}"/>`;
  }
  for (const img of images) {
    if (!img.loc) continue;
    body += `\n    <image:image>\n      <image:loc>${escapeXml(img.loc)}</image:loc>`;
    if (img.title) body += `\n      <image:title>${escapeXml(img.title)}</image:title>`;
    if (img.caption) body += `\n      <image:caption>${escapeXml(img.caption)}</image:caption>`;
    body += `\n    </image:image>`;
  }
  body += `\n  </url>`;
  return body;
}

function newsUrlEntry(loc: string, title: string, publishedAt: string): string {
  return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <news:news>
      <news:publication>
        <news:name>مول البستان</news:name>
        <news:language>ar</news:language>
      </news:publication>
      <news:publication_date>${publishedAt}</news:publication_date>
      <news:title>${escapeXml(title)}</news:title>
    </news:news>
  </url>`;
}

function wrapUrlset(entries: string[], extraNs: string[] = []): string {
  const ns = [NS.url, NS.xhtml, ...extraNs].join(" ");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset ${ns}>
${entries.join("\n")}
</urlset>`;
}

function buildSitemapIndex(sitemaps: { loc: string; lastmod?: string }[]): string {
  const items = sitemaps
    .map((s) => `  <sitemap>\n    <loc>${escapeXml(s.loc)}</loc>${s.lastmod ? `\n    <lastmod>${s.lastmod}</lastmod>` : ""}\n  </sitemap>`)
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
  stores: { slug: string; updated_at: string; logo_url: string | null; name_ar: string }[];
  products: { slug: string; updated_at: string; image_url: string | null; name_ar: string }[];
  blog: { slug: string; updated_at: string; published_at: string | null; cover_image_url: string | null; title_ar: string }[];
  downtown: { slug: string; updated_at: string; logo_url: string | null; name_ar: string }[];
  kzProducts: { slug: string; updated_at: string; image: string | null; title: string }[];
  deals: { id: string; updated_at: string; image_primary: string | null; title_ar: string; valid_to: string | null }[];
}

function latestDate(items: { updated_at: string }[]): string | undefined {
  if (items.length === 0) return undefined;
  return items.reduce((a, b) => (a.updated_at > b.updated_at ? a : b)).updated_at.slice(0, 10);
}

async function fetchAllData(supabase: any): Promise<DynamicData> {
  const [storesRes, productsRes, blogRes, downtownRes, kzProductsRes, dealsRes] = await Promise.all([
    supabase.from("stores").select("slug, updated_at, logo_url, name_ar").neq("status", "hidden"),
    supabase.from("products").select("slug, updated_at, image_url, name_ar").eq("status", "published"),
    supabase.from("blog_posts").select("slug, updated_at, published_at, cover_image_url, title_ar").not("published_at", "is", null),
    supabase.from("downtown_merchants").select("slug, updated_at, logo_url, name_ar").eq("is_active", true),
    supabase.from("kz_products").select("slug, updated_at, image, title").eq("status", "published"),
    supabase.from("deals").select("id, updated_at, image_primary, title_ar, valid_to").eq("is_live", true),
  ]);

  return {
    stores: (storesRes.data ?? []) as DynamicData["stores"],
    products: (productsRes.data ?? []) as DynamicData["products"],
    blog: (blogRes.data ?? []) as DynamicData["blog"],
    downtown: (downtownRes.data ?? []) as DynamicData["downtown"],
    kzProducts: (kzProductsRes.data ?? []) as DynamicData["kzProducts"],
    deals: (dealsRes.data ?? []) as DynamicData["deals"],
  };
}

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

/** Build sub-sitemap for a specific section */
function buildSubSitemap(section: string, data: DynamicData): string {
  const entries: string[] = [];
  let extraNs: string[] = [];

  switch (section) {
    case "pages":
      for (const r of STATIC_ROUTES) {
        entries.push(urlEntry({ loc: `${BASE_URL}${r.loc}`, changefreq: r.changefreq, priority: r.priority }));
      }
      for (const m of data.downtown) {
        entries.push(urlEntry({ loc: `${BASE_URL}/downtown-directory/${m.slug}`, lastmod: m.updated_at, changefreq: "monthly", priority: "0.5" }));
      }
      break;

    case "categories":
      for (const c of CATEGORY_SLUGS) {
        entries.push(urlEntry({ loc: `${BASE_URL}/stores/category/${c.slug}`, changefreq: "weekly", priority: "0.7" }));
      }
      break;

    case "devices":
      for (const slug of DEVICE_SLUGS) {
        entries.push(urlEntry({ loc: `${BASE_URL}/devices/${slug}`, changefreq: "weekly", priority: devicePriority(slug) }));
      }
      break;

    case "stores":
      extraNs = [NS.image];
      for (const s of data.stores) {
        const images: ImageData[] = s.logo_url ? [{ loc: s.logo_url, title: s.name_ar }] : [];
        entries.push(urlEntry({ loc: `${BASE_URL}/stores/${s.slug}`, lastmod: s.updated_at, changefreq: "weekly", priority: "0.7", images }));
      }
      break;

    case "products":
      extraNs = [NS.image];
      for (const p of data.products) {
        const images: ImageData[] = p.image_url ? [{ loc: p.image_url, title: p.name_ar }] : [];
        entries.push(urlEntry({ loc: `${BASE_URL}/products/${p.slug}`, lastmod: p.updated_at, changefreq: "weekly", priority: "0.6", images }));
      }
      for (const p of data.kzProducts) {
        const images: ImageData[] = p.image ? [{ loc: p.image, title: p.title }] : [];
        entries.push(urlEntry({ loc: `${BASE_URL}/products/${p.slug}`, lastmod: p.updated_at, changefreq: "weekly", priority: "0.6", images }));
      }
      break;

    case "offers":
      extraNs = [NS.image];
      // active deals only (not expired)
      const today = new Date().toISOString().slice(0, 10);
      for (const d of data.deals) {
        if (d.valid_to && d.valid_to.slice(0, 10) < today) continue;
        const images: ImageData[] = d.image_primary ? [{ loc: d.image_primary, title: d.title_ar }] : [];
        entries.push(urlEntry({ loc: `${BASE_URL}/daily-deals/${d.id}`, lastmod: d.updated_at, changefreq: "daily", priority: "0.7", images }));
      }
      break;

    case "blog":
      extraNs = [NS.image];
      for (const p of data.blog) {
        const images: ImageData[] = p.cover_image_url ? [{ loc: p.cover_image_url, title: p.title_ar }] : [];
        entries.push(urlEntry({ loc: `${BASE_URL}/blog/${p.slug}`, lastmod: p.updated_at, changefreq: "monthly", priority: "0.6", images }));
      }
      break;

    case "images": {
      // Aggregated image-only sitemap (Google Images-friendly)
      extraNs = [NS.image];
      for (const p of data.products) {
        if (!p.image_url) continue;
        entries.push(urlEntry({
          loc: `${BASE_URL}/products/${p.slug}`,
          lastmod: p.updated_at,
          images: [{ loc: p.image_url, title: p.name_ar, caption: `${p.name_ar} — مول البستان` }],
          hreflang: false,
        }));
      }
      for (const s of data.stores) {
        if (!s.logo_url) continue;
        entries.push(urlEntry({
          loc: `${BASE_URL}/stores/${s.slug}`,
          lastmod: s.updated_at,
          images: [{ loc: s.logo_url, title: s.name_ar, caption: `شعار ${s.name_ar} — مول البستان` }],
          hreflang: false,
        }));
      }
      for (const m of data.downtown) {
        if (!m.logo_url) continue;
        entries.push(urlEntry({
          loc: `${BASE_URL}/downtown-directory/${m.slug}`,
          lastmod: m.updated_at,
          images: [{ loc: m.logo_url, title: m.name_ar, caption: `${m.name_ar} — وسط البلد` }],
          hreflang: false,
        }));
      }
      for (const b of data.blog) {
        if (!b.cover_image_url) continue;
        entries.push(urlEntry({
          loc: `${BASE_URL}/blog/${b.slug}`,
          lastmod: b.updated_at,
          images: [{ loc: b.cover_image_url, title: b.title_ar }],
          hreflang: false,
        }));
      }
      break;
    }

    case "news": {
      // Only posts published in the last 48 hours
      const cutoff = Date.now() - 48 * 60 * 60 * 1000;
      const recent = data.blog.filter((p) => p.published_at && new Date(p.published_at).getTime() >= cutoff);
      const items = recent.map((p) =>
        newsUrlEntry(`${BASE_URL}/blog/${p.slug}`, p.title_ar, p.published_at!)
      );
      return `<?xml version="1.0" encoding="UTF-8"?>
<urlset ${NS.url} ${NS.news}>
${items.join("\n")}
</urlset>`;
    }

    default:
      break;
  }

  return wrapUrlset(dedupeEntries(entries), extraNs);
}

Deno.serve(withLogging("sitemap", async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);
    const section = url.searchParams.get("section");
    const format = url.searchParams.get("format");

    const data = await fetchAllData(supabase);

    if (format === "summary") {
      const today = new Date().toISOString().slice(0, 10);
      const summary = {
        total_urls:
          STATIC_ROUTES.length + CATEGORY_SLUGS.length + DEVICE_SLUGS.length +
          data.stores.length + data.products.length + data.blog.length +
          data.downtown.length + data.kzProducts.length + data.deals.length,
        generated_at: new Date().toISOString(),
        sections: [
          { key: "pages", label_ar: "الصفحات الرئيسية", description_ar: "صفحات المول، الفروع، الدليل، والمعلومات الأساسية.", count: STATIC_ROUTES.length + data.downtown.length, lastmod: latestDate(data.downtown) ?? today },
          { key: "categories", label_ar: "أقسام المحلات", description_ar: "صفحات هبوط للفئات (هواتف، كمبيوتر، جيمنج، …).", count: CATEGORY_SLUGS.length, lastmod: today },
          { key: "devices", label_ar: "فئات الأجهزة", description_ar: "صفحات تصنيفات الأجهزة والمنتجات التقنية.", count: DEVICE_SLUGS.length, lastmod: today },
          { key: "stores", label_ar: "المحلات", description_ar: "صفحات المحلات والتجار داخل المول.", count: data.stores.length, lastmod: latestDate(data.stores) ?? today },
          { key: "products", label_ar: "المنتجات", description_ar: "كتالوج منتجات المحلات وقصر زيرو.", count: data.products.length + data.kzProducts.length, lastmod: latestDate([...data.products, ...data.kzProducts]) ?? today },
          { key: "offers", label_ar: "العروض", description_ar: "العروض اليومية والصفقات السارية.", count: data.deals.length, lastmod: latestDate(data.deals) ?? today },
          { key: "blog", label_ar: "المدونة", description_ar: "مقالات ومحتوى المدونة المنشور.", count: data.blog.length, lastmod: latestDate(data.blog) ?? today },
          { key: "images", label_ar: "الصور", description_ar: "خريطة صور للمنتجات والشعارات والمقالات.", count: 0, lastmod: today },
          { key: "news", label_ar: "الأخبار", description_ar: "آخر مقالات المدونة (آخر 48 ساعة) لخدمة الأخبار.", count: 0, lastmod: today },
        ],
      };
      return new Response(JSON.stringify(summary), {
        headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8", "Cache-Control": "public, max-age=600, s-maxage=600" },
      });
    }

    if (section) {
      return xmlResponse(buildSubSitemap(section, data));
    }

    // Default: sitemap index pointing to all sub-sitemaps
    const fnUrl = `${supabaseUrl}/functions/v1/sitemap`;
    const today = new Date().toISOString().slice(0, 10);

    const sitemaps = [
      { loc: `${fnUrl}?section=pages`, lastmod: today },
      { loc: `${fnUrl}?section=categories`, lastmod: today },
      { loc: `${fnUrl}?section=devices`, lastmod: today },
      { loc: `${fnUrl}?section=stores`, lastmod: latestDate(data.stores) ?? today },
      { loc: `${fnUrl}?section=products`, lastmod: latestDate([...data.products, ...data.kzProducts]) ?? today },
      { loc: `${fnUrl}?section=offers`, lastmod: latestDate(data.deals) ?? today },
      { loc: `${fnUrl}?section=blog`, lastmod: latestDate(data.blog) ?? today },
      { loc: `${fnUrl}?section=images`, lastmod: today },
      { loc: `${fnUrl}?section=news`, lastmod: today },
    ];

    return xmlResponse(buildSitemapIndex(sitemaps));
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return new Response("Internal Server Error", { status: 500, headers: corsHeaders });
  }
}));
