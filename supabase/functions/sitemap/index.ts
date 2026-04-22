import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.49.4/cors";

const BASE_URL = "https://mallelbostan.com";

const STATIC_ROUTES = [
  { loc: "/", priority: "1.0", changefreq: "daily" },
  { loc: "/stores", priority: "0.9", changefreq: "daily" },
  { loc: "/products", priority: "0.9", changefreq: "daily" },
  { loc: "/map", priority: "0.8", changefreq: "weekly" },
  { loc: "/leasing", priority: "0.8", changefreq: "weekly" },
  { loc: "/about", priority: "0.7", changefreq: "monthly" },
  { loc: "/contact", priority: "0.7", changefreq: "monthly" },
  { loc: "/blog", priority: "0.7", changefreq: "daily" },
  { loc: "/faq", priority: "0.6", changefreq: "monthly" },
  { loc: "/careers", priority: "0.6", changefreq: "weekly" },
  { loc: "/join-marketplace", priority: "0.6", changefreq: "monthly" },
  { loc: "/opening-day", priority: "0.8", changefreq: "weekly" },
  { loc: "/spin-win", priority: "0.7", changefreq: "weekly" },
  { loc: "/daily-deals", priority: "0.7", changefreq: "daily" },
  { loc: "/countdown", priority: "0.5", changefreq: "weekly" },
  { loc: "/new-cairo-branch", priority: "0.8", changefreq: "monthly" },
  { loc: "/downtown-branch", priority: "0.8", changefreq: "monthly" },
  { loc: "/downtown-directory", priority: "0.7", changefreq: "weekly" },
  { loc: "/market-echo", priority: "0.5", changefreq: "monthly" },
  { loc: "/kz", priority: "0.7", changefreq: "daily" },
  { loc: "/kz/products", priority: "0.7", changefreq: "daily" },
  { loc: "/privacy", priority: "0.3", changefreq: "yearly" },
  { loc: "/terms", priority: "0.3", changefreq: "yearly" },
  { loc: "/reward-terms", priority: "0.3", changefreq: "yearly" },
];

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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all dynamic content in parallel
    const [storesRes, productsRes, blogRes, downtownRes, kzProductsRes] = await Promise.all([
      supabase.from("stores").select("slug, updated_at").neq("status", "hidden"),
      supabase.from("products").select("slug, updated_at").eq("status", "published"),
      supabase.from("blog_posts").select("slug, updated_at, published_at").not("published_at", "is", null),
      supabase.from("downtown_merchants").select("slug, updated_at").eq("is_active", true),
      supabase.from("kz_products").select("slug, updated_at").eq("status", "published"),
    ]);

    const entries: string[] = [];

    // Static routes
    for (const route of STATIC_ROUTES) {
      entries.push(urlEntry(`${BASE_URL}${route.loc}`, undefined, route.changefreq, route.priority));
    }

    // Stores
    for (const store of storesRes.data ?? []) {
      entries.push(urlEntry(`${BASE_URL}/stores/${store.slug}`, store.updated_at, "weekly", "0.7"));
    }

    // Products
    for (const product of productsRes.data ?? []) {
      entries.push(urlEntry(`${BASE_URL}/products/${product.slug}`, product.updated_at, "weekly", "0.6"));
    }

    // Blog posts
    for (const post of blogRes.data ?? []) {
      entries.push(urlEntry(`${BASE_URL}/blog/${post.slug}`, post.updated_at, "monthly", "0.6"));
    }

    // Downtown merchants
    for (const merchant of downtownRes.data ?? []) {
      entries.push(urlEntry(`${BASE_URL}/downtown-directory/${merchant.slug}`, merchant.updated_at, "monthly", "0.5"));
    }

    // KZ Products
    for (const product of kzProductsRes.data ?? []) {
      entries.push(urlEntry(`${BASE_URL}/products/${product.slug}`, product.updated_at, "weekly", "0.6"));
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>`;

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return new Response("Internal Server Error", {
      status: 500,
      headers: corsHeaders,
    });
  }
});
