// RSS feed for Mall El Bostan blog
// Returns RSS 2.0 XML with latest published posts.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE = "https://mallelbostan.com";
const FEED_URL = `${SITE}/rss.xml`;

function escapeXml(s: string): string {
  return (s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

interface Post {
  slug: string;
  title_ar: string | null;
  excerpt_ar: string | null;
  cover_image_url: string | null;
  category: string | null;
  published_at: string;
}

function buildRss(posts: Post[]): string {
  const lastBuild = posts[0]?.published_at ?? new Date().toISOString();
  const items = posts
    .map((p) => {
      const url = `${SITE}/blog/${p.slug}`;
      const title = escapeXml(p.title_ar ?? p.slug);
      const desc = escapeXml(p.excerpt_ar ?? "");
      const pubDate = new Date(p.published_at).toUTCString();
      const enclosure = p.cover_image_url
        ? `\n      <enclosure url="${escapeXml(p.cover_image_url)}" type="image/jpeg" />`
        : "";
      const category = p.category ? `\n      <category>${escapeXml(p.category)}</category>` : "";
      return `    <item>
      <title>${title}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${desc}</description>${category}${enclosure}
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>مدونة مول البستان</title>
    <link>${SITE}/blog</link>
    <atom:link href="${FEED_URL}" rel="self" type="application/rss+xml" />
    <description>أحدث المقالات والأخبار من مول البستان — سوق التقنية الأول في مصر.</description>
    <language>ar</language>
    <lastBuildDate>${new Date(lastBuild).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data, error } = await supabase
      .from("blog_posts")
      .select("slug, title_ar, excerpt_ar, cover_image_url, category, published_at")
      .not("published_at", "is", null)
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false })
      .limit(50);

    if (error) throw error;

    return new Response(buildRss((data ?? []) as Post[]), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=1800, s-maxage=1800",
      },
    });
  } catch (err) {
    console.error("rss error:", err);
    return new Response("Internal Server Error", { status: 500, headers: corsHeaders });
  }
});
