import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Rss as RssIcon, ExternalLink, Copy, Check, Calendar } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { PageHero } from "@/components/PageHero";
import { supabase } from "@/integrations/supabase/client";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const FEED_URL = `${SUPABASE_URL}/functions/v1/rss`;

interface Post {
  slug: string;
  title_ar: string | null;
  excerpt_ar: string | null;
  category: string | null;
  published_at: string;
}

function formatArabicDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function Rss() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase
      .from("blog_posts")
      .select("slug, title_ar, excerpt_ar, category, published_at")
      .not("published_at", "is", null)
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (mounted) {
          setPosts((data ?? []) as Post[]);
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  const copyFeed = async () => {
    try {
      await navigator.clipboard.writeText(FEED_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <>
      <SEOHead
        title="خلاصة RSS — مدونة مول البستان"
        description="اشترك في خلاصة RSS لمدونة مول البستان لمتابعة آخر المقالات والأخبار."
      />

      <PageHero
        kicker="خلاصة المدونة"
        title="RSS"
        subtitle="اشترك في خلاصة المدونة لتصلك آخر المقالات والأخبار في قارئ RSS الذي تفضّله."
        compact
      />

      <section className="container py-12 md:py-16">
        {/* Feed URL card */}
        <div className="mb-10 rounded-2xl border bg-card p-5 md:p-6">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <RssIcon className="h-5 w-5" />
            </span>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold text-foreground">رابط الخلاصة</h2>
              <p className="mt-1 text-[13px] text-muted-foreground">
                انسخ الرابط التالي وأضفه في أي قارئ RSS مثل Feedly أو Inoreader.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <code
                  dir="ltr"
                  className="flex-1 min-w-0 truncate rounded-lg bg-muted/50 px-3 py-2 font-mono text-[12px] text-foreground"
                >
                  {FEED_URL}
                </code>
                <button
                  onClick={copyFeed}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-bold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "تم النسخ" : "نسخ"}
                </button>
                <a
                  href={FEED_URL}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border bg-background px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  فتح XML
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Latest posts preview */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">آخر المقالات</h2>
          <Link to="/blog" className="text-xs font-medium text-primary hover:underline">
            كل المقالات
          </Link>
        </div>

        {loading && (
          <div className="py-12 text-center text-sm text-muted-foreground">جارِ التحميل…</div>
        )}

        {!loading && posts.length === 0 && (
          <div className="rounded-xl border bg-muted/30 px-5 py-8 text-center text-sm text-muted-foreground">
            لا توجد مقالات منشورة حالياً.
          </div>
        )}

        {!loading && posts.length > 0 && (
          <ul className="divide-y divide-border rounded-2xl border bg-card">
            {posts.map((p) => (
              <li key={p.slug}>
                <Link
                  to={`/blog/${p.slug}`}
                  className="flex flex-col gap-1.5 px-5 py-4 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-bold text-foreground">
                      {p.title_ar ?? p.slug}
                    </h3>
                    {p.excerpt_ar && (
                      <p className="mt-1 line-clamp-1 text-[13px] text-muted-foreground">
                        {p.excerpt_ar}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5 text-[12px] text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <time dateTime={p.published_at}>{formatArabicDate(p.published_at)}</time>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
