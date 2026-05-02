import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import { PageHero } from "@/components/PageHero";
import { Map, FileText, Store, Package, Newspaper, Cpu, RefreshCw, ExternalLink } from "lucide-react";

interface SitemapSection {
  key: string;
  label_ar: string;
  description_ar: string;
  count: number;
  lastmod: string;
}

interface SitemapSummary {
  total_urls: number;
  generated_at: string;
  sections: SitemapSection[];
}

const SECTION_ICONS: Record<string, typeof FileText> = {
  pages: FileText,
  devices: Cpu,
  stores: Store,
  products: Package,
  blog: Newspaper,
};

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const FN_BASE = `${SUPABASE_URL}/functions/v1/sitemap`;

function formatArabicDate(iso: string): string {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("ar-EG", { year: "numeric", month: "long", day: "numeric" }).format(d);
  } catch {
    return iso;
  }
}

function formatNumber(n: number): string {
  return new Intl.NumberFormat("ar-EG").format(n);
}

export default function Sitemap() {
  const [summary, setSummary] = useState<SitemapSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch(`${FN_BASE}?format=summary`)
      .then((r) => {
        if (!r.ok) throw new Error("failed");
        return r.json();
      })
      .then((data: SitemapSummary) => {
        if (mounted) {
          setSummary(data);
          setError(null);
        }
      })
      .catch(() => mounted && setError("تعذّر تحميل ملخص خريطة الموقع، حاول مرة أخرى."))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <SEOHead
        title="خريطة الموقع — مول البستان"
        description="استعرض جميع أقسام موقع مول البستان: الصفحات الرئيسية، فئات الأجهزة، المحلات، المنتجات، والمدونة."
        canonical="https://www.mallelbostan.com/sitemap"
      />

      <PageHero
        eyebrow="الفهرس العام"
        title="خريطة الموقع"
        description="نظرة سريعة على كل أقسام مول البستان — عدد الصفحات في كل قسم وآخر تاريخ تحديث."
        icon={Map}
      />

      <section className="container py-12 md:py-16">
        {loading && (
          <div className="flex items-center justify-center py-20" aria-live="polite">
            <RefreshCw className="h-5 w-5 animate-spin text-primary" />
            <span className="mr-3 text-sm text-muted-foreground">جارِ تحميل الملخص…</span>
          </div>
        )}

        {error && !loading && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-5 py-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {summary && !loading && (
          <>
            {/* Top stats */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border bg-card p-5">
                <div className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">إجمالي الروابط</div>
                <div className="mt-2 text-3xl font-bold text-foreground">{formatNumber(summary.total_urls)}</div>
              </div>
              <div className="rounded-2xl border bg-card p-5">
                <div className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">آخر توليد</div>
                <div className="mt-2 text-base font-medium text-foreground">{formatArabicDate(summary.generated_at)}</div>
              </div>
            </div>

            {/* Sections */}
            <div className="grid gap-4 md:grid-cols-2">
              {summary.sections.map((s) => {
                const Icon = SECTION_ICONS[s.key] ?? FileText;
                const xmlUrl = `${FN_BASE}?section=${s.key}`;
                return (
                  <article
                    key={s.key}
                    className="group rounded-2xl border bg-card p-5 transition-colors hover:border-primary/40"
                  >
                    <header className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-base font-bold text-foreground">{s.label_ar}</h2>
                        <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{s.description_ar}</p>
                      </div>
                    </header>

                    <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-xl bg-muted/40 px-3 py-2">
                        <dt className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">عدد الروابط</dt>
                        <dd className="mt-0.5 text-lg font-bold text-foreground">{formatNumber(s.count)}</dd>
                      </div>
                      <div className="rounded-xl bg-muted/40 px-3 py-2">
                        <dt className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">آخر تحديث</dt>
                        <dd className="mt-0.5 text-sm font-medium text-foreground">{formatArabicDate(s.lastmod)}</dd>
                      </div>
                    </dl>

                    <a
                      href={xmlUrl}
                      target="_blank"
                      rel="noopener"
                      className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                    >
                      عرض ملف XML
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </article>
                );
              })}
            </div>

            {/* Quick access */}
            <div className="mt-10 rounded-2xl border bg-muted/30 p-5">
              <h3 className="text-sm font-bold text-foreground">روابط مفيدة</h3>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                <a href="/sitemap.xml" target="_blank" rel="noopener" className="text-primary hover:underline">
                  sitemap.xml الكامل
                </a>
                <a href="/robots.txt" target="_blank" rel="noopener" className="text-primary hover:underline">
                  robots.txt
                </a>
                <Link to="/stores" className="text-primary hover:underline">دليل المحلات</Link>
                <Link to="/products" className="text-primary hover:underline">كتالوج المنتجات</Link>
                <Link to="/blog" className="text-primary hover:underline">المدونة</Link>
              </div>
            </div>
          </>
        )}
      </section>
    </>
  );
}
