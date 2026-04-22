import { useMemo, useState } from "react";
import { useRequireAdmin } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  Globe,
  FileText,
  Code2,
  ExternalLink,
  RefreshCw,
} from "lucide-react";

/* ── Page registry with expected SEO data ── */

interface PageSeoEntry {
  path: string;
  labelAr: string;
  labelEn: string;
  priority: number;
  hasTitle: boolean;
  hasDescription: boolean;
  hasCanonical: boolean;
  hasOg: boolean;
  hasJsonLd: boolean;
  hasBreadcrumbs: boolean;
  notes?: string;
}

const PAGES: PageSeoEntry[] = [
  { path: "/", labelAr: "الرئيسية", labelEn: "Home", priority: 1.0, hasTitle: true, hasDescription: true, hasCanonical: true, hasOg: true, hasJsonLd: true, hasBreadcrumbs: false },
  { path: "/stores", labelAr: "دليل المحلات", labelEn: "Stores", priority: 0.9, hasTitle: true, hasDescription: true, hasCanonical: true, hasOg: true, hasJsonLd: true, hasBreadcrumbs: true },
  { path: "/products", labelAr: "المنتجات", labelEn: "Products", priority: 0.9, hasTitle: true, hasDescription: true, hasCanonical: true, hasOg: true, hasJsonLd: false, hasBreadcrumbs: true },
  { path: "/map", labelAr: "الدليل التفاعلي", labelEn: "Interactive Map", priority: 0.9, hasTitle: true, hasDescription: true, hasCanonical: true, hasOg: true, hasJsonLd: false, hasBreadcrumbs: true },
  { path: "/leasing", labelAr: "التأجير", labelEn: "Leasing", priority: 0.8, hasTitle: true, hasDescription: true, hasCanonical: true, hasOg: true, hasJsonLd: false, hasBreadcrumbs: true },
  { path: "/opening-day", labelAr: "يوم الافتتاح", labelEn: "Opening Day", priority: 0.8, hasTitle: true, hasDescription: true, hasCanonical: true, hasOg: true, hasJsonLd: true, hasBreadcrumbs: true },
  { path: "/spin-win", labelAr: "أدر واربح", labelEn: "Spin & Win", priority: 0.8, hasTitle: true, hasDescription: true, hasCanonical: true, hasOg: true, hasJsonLd: false, hasBreadcrumbs: true },
  { path: "/daily-deals", labelAr: "العروض اليومية", labelEn: "Daily Deals", priority: 0.7, hasTitle: true, hasDescription: true, hasCanonical: true, hasOg: true, hasJsonLd: false, hasBreadcrumbs: true },
  { path: "/about", labelAr: "من نحن", labelEn: "About", priority: 0.7, hasTitle: true, hasDescription: true, hasCanonical: true, hasOg: true, hasJsonLd: false, hasBreadcrumbs: true },
  { path: "/new-cairo-branch", labelAr: "فرع القاهرة الجديدة", labelEn: "New Cairo Branch", priority: 0.7, hasTitle: true, hasDescription: true, hasCanonical: true, hasOg: true, hasJsonLd: false, hasBreadcrumbs: true },
  { path: "/downtown-branch", labelAr: "فرع وسط البلد", labelEn: "Downtown Branch", priority: 0.7, hasTitle: true, hasDescription: true, hasCanonical: true, hasOg: true, hasJsonLd: false, hasBreadcrumbs: true },
  { path: "/downtown-directory", labelAr: "دليل وسط البلد", labelEn: "Downtown Directory", priority: 0.7, hasTitle: true, hasDescription: true, hasCanonical: true, hasOg: true, hasJsonLd: false, hasBreadcrumbs: true },
  { path: "/contact", labelAr: "تواصل معنا", labelEn: "Contact", priority: 0.7, hasTitle: true, hasDescription: true, hasCanonical: true, hasOg: true, hasJsonLd: false, hasBreadcrumbs: true },
  { path: "/blog", labelAr: "المدونة", labelEn: "Blog", priority: 0.7, hasTitle: true, hasDescription: true, hasCanonical: true, hasOg: true, hasJsonLd: false, hasBreadcrumbs: true },
  { path: "/faq", labelAr: "الأسئلة الشائعة", labelEn: "FAQ", priority: 0.6, hasTitle: true, hasDescription: true, hasCanonical: true, hasOg: true, hasJsonLd: true, hasBreadcrumbs: true },
  { path: "/careers", labelAr: "الوظائف", labelEn: "Careers", priority: 0.6, hasTitle: true, hasDescription: true, hasCanonical: true, hasOg: true, hasJsonLd: false, hasBreadcrumbs: true },
  { path: "/join-marketplace", labelAr: "انضم للسوق", labelEn: "Join Marketplace", priority: 0.6, hasTitle: true, hasDescription: true, hasCanonical: true, hasOg: true, hasJsonLd: false, hasBreadcrumbs: true },
  { path: "/kz", labelAr: "كسر زيرو", labelEn: "Kasr Zero", priority: 0.7, hasTitle: true, hasDescription: true, hasCanonical: true, hasOg: true, hasJsonLd: false, hasBreadcrumbs: false },
  { path: "/market-echo", labelAr: "صدى السوق", labelEn: "Market Echo", priority: 0.5, hasTitle: true, hasDescription: true, hasCanonical: true, hasOg: true, hasJsonLd: false, hasBreadcrumbs: false },
  { path: "/countdown", labelAr: "العد التنازلي", labelEn: "Countdown", priority: 0.7, hasTitle: true, hasDescription: true, hasCanonical: true, hasOg: true, hasJsonLd: false, hasBreadcrumbs: false },
  { path: "/privacy", labelAr: "سياسة الخصوصية", labelEn: "Privacy", priority: 0.3, hasTitle: true, hasDescription: true, hasCanonical: true, hasOg: true, hasJsonLd: false, hasBreadcrumbs: true },
  { path: "/terms", labelAr: "الشروط والأحكام", labelEn: "Terms", priority: 0.3, hasTitle: true, hasDescription: true, hasCanonical: true, hasOg: true, hasJsonLd: false, hasBreadcrumbs: true },
  { path: "/reward-terms", labelAr: "شروط المكافآت", labelEn: "Reward Terms", priority: 0.3, hasTitle: true, hasDescription: true, hasCanonical: true, hasOg: true, hasJsonLd: false, hasBreadcrumbs: true },
];

const BASE_URL = "https://mallelbostan.com";

function getScore(p: PageSeoEntry): number {
  let score = 0;
  if (p.hasTitle) score += 25;
  if (p.hasDescription) score += 25;
  if (p.hasCanonical) score += 20;
  if (p.hasOg) score += 15;
  if (p.hasJsonLd) score += 10;
  if (p.hasBreadcrumbs) score += 5;
  return score;
}

function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 90 ? "bg-emerald-500" : score >= 70 ? "bg-sky-500" : score >= 50 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-20 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-mono text-muted-foreground">{score}%</span>
    </div>
  );
}

function CheckIcon({ ok }: { ok: boolean }) {
  return ok ? (
    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
  ) : (
    <XCircle className="h-4 w-4 text-red-400/60" />
  );
}

type FilterType = "all" | "high" | "medium" | "low" | "issues";

export default function AdminSeoAudit() {
  const { loading } = useRequireAdmin();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  const scored = useMemo(() => PAGES.map((p) => ({ ...p, score: getScore(p) })), []);

  const avgScore = useMemo(() => Math.round(scored.reduce((s, p) => s + p.score, 0) / scored.length), [scored]);
  const withIssues = useMemo(() => scored.filter((p) => p.score < 90).length, [scored]);
  const inSitemap = PAGES.length;

  const filtered = useMemo(() => {
    let list = scored;
    if (filter === "high") list = list.filter((p) => p.priority >= 0.8);
    else if (filter === "medium") list = list.filter((p) => p.priority >= 0.5 && p.priority < 0.8);
    else if (filter === "low") list = list.filter((p) => p.priority < 0.5);
    else if (filter === "issues") list = list.filter((p) => p.score < 90);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.labelAr.includes(q) || p.labelEn.toLowerCase().includes(q) || p.path.includes(q));
    }
    return list.sort((a, b) => b.priority - a.priority);
  }, [scored, filter, search]);

  if (loading)
    return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">جاري التحميل...</div>;

  const FILTERS: { key: FilterType; label: string; count: number }[] = [
    { key: "all", label: "الكل", count: PAGES.length },
    { key: "high", label: "أولوية عالية", count: scored.filter((p) => p.priority >= 0.8).length },
    { key: "medium", label: "أولوية متوسطة", count: scored.filter((p) => p.priority >= 0.5 && p.priority < 0.8).length },
    { key: "low", label: "أولوية منخفضة", count: scored.filter((p) => p.priority < 0.5).length },
    { key: "issues", label: "بها ملاحظات", count: withIssues },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin">
              <Button variant="ghost" size="sm">
                <ArrowRight className="h-4 w-4 ml-1" />
                لوحة التحكم
              </Button>
            </Link>
            <h1 className="text-lg font-bold text-gradient-blue">تدقيق SEO</h1>
          </div>
          <div className="flex items-center gap-2">
            <a href={`${BASE_URL}/sitemap.xml`} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-1.5">
                <FileText className="h-3.5 w-3.5" />
                Sitemap
              </Button>
            </a>
            <a href={`${BASE_URL}/robots.txt`} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Code2 className="h-3.5 w-3.5" />
                robots.txt
              </Button>
            </a>
            <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer">
              <Button variant="default" size="sm" className="gap-1.5">
                <Globe className="h-3.5 w-3.5" />
                Search Console
              </Button>
            </a>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs text-muted-foreground mb-1">الصفحات في Sitemap</p>
            <p className="text-2xl font-bold text-foreground">{inSitemap}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs text-muted-foreground mb-1">متوسط النتيجة</p>
            <p className="text-2xl font-bold" style={{ color: avgScore >= 80 ? "hsl(var(--primary))" : "hsl(40 95% 55%)" }}>
              {avgScore}%
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs text-muted-foreground mb-1">صفحات بملاحظات</p>
            <p className="text-2xl font-bold text-amber-400">{withIssues}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs text-muted-foreground mb-1">robots.txt</p>
            <p className="text-sm font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" /> مفتوح للزحف
            </p>
          </div>
        </div>

        {/* Checklist summary */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-bold text-foreground mb-3">قائمة التحقق العامة</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            {[
              { label: "robots.txt مفتوح", ok: true },
              { label: "sitemap.xml موجود", ok: true },
              { label: "Canonical tags", ok: true },
              { label: "Open Graph meta", ok: true },
              { label: "Twitter Cards", ok: true },
              { label: "JSON-LD Schema", ok: true },
              { label: "Hreflang (ar)", ok: true },
              { label: "Semantic HTML (H1)", ok: true },
              { label: "Google Search Console", ok: false },
            ].map((c) => (
              <div key={c.label} className="flex items-center gap-2">
                {c.ok ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <AlertTriangle className="h-4 w-4 text-amber-400" />}
                <span className={c.ok ? "text-foreground" : "text-amber-400"}>{c.label}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Google Search Console يحتاج ربط يدوي — أضف كود التحقق في index.html ثم أرسل sitemap.xml
          </p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث عن صفحة..."
              className="pr-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {FILTERS.map((f) => (
              <Button
                key={f.key}
                variant={filter === f.key ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(f.key)}
                className="gap-1"
              >
                {f.label}
                <Badge variant="secondary" className="text-[0.65rem] px-1.5 py-0 h-4 rounded-full">
                  {f.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" dir="rtl">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-3 text-right font-semibold text-muted-foreground">الصفحة</th>
                  <th className="px-4 py-3 text-center font-semibold text-muted-foreground">النتيجة</th>
                  <th className="px-4 py-3 text-center font-semibold text-muted-foreground">العنوان</th>
                  <th className="px-4 py-3 text-center font-semibold text-muted-foreground">الوصف</th>
                  <th className="px-4 py-3 text-center font-semibold text-muted-foreground">Canonical</th>
                  <th className="px-4 py-3 text-center font-semibold text-muted-foreground">OG</th>
                  <th className="px-4 py-3 text-center font-semibold text-muted-foreground">JSON-LD</th>
                  <th className="px-4 py-3 text-center font-semibold text-muted-foreground">Breadcrumbs</th>
                  <th className="px-4 py-3 text-center font-semibold text-muted-foreground">الأولوية</th>
                  <th className="px-4 py-3 text-center font-semibold text-muted-foreground">رابط</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.path} className="border-b border-border/50 transition-colors hover:bg-muted/20">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-bold text-foreground text-[0.82rem]">{p.labelAr}</p>
                        <p className="text-xs text-muted-foreground font-mono">{p.path}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <ScoreBar score={p.score} />
                    </td>
                    <td className="px-4 py-3 text-center"><CheckIcon ok={p.hasTitle} /></td>
                    <td className="px-4 py-3 text-center"><CheckIcon ok={p.hasDescription} /></td>
                    <td className="px-4 py-3 text-center"><CheckIcon ok={p.hasCanonical} /></td>
                    <td className="px-4 py-3 text-center"><CheckIcon ok={p.hasOg} /></td>
                    <td className="px-4 py-3 text-center"><CheckIcon ok={p.hasJsonLd} /></td>
                    <td className="px-4 py-3 text-center"><CheckIcon ok={p.hasBreadcrumbs} /></td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        variant="secondary"
                        className={
                          p.priority >= 0.8
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                            : p.priority >= 0.5
                            ? "bg-sky-500/15 text-sky-400 border-sky-500/20"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {p.priority}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <a href={`${BASE_URL}${p.path}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
                        <ExternalLink className="h-4 w-4 inline" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Indexing priority guide */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-bold text-foreground mb-3">ترتيب أولوية الفهرسة في Google</h3>
          <p className="text-xs text-muted-foreground mb-4">
            استخدم URL Inspection في Google Search Console لطلب فهرسة هذه الصفحات بالترتيب:
          </p>
          <ol className="space-y-2 text-sm list-decimal list-inside text-foreground" dir="rtl">
            {scored
              .sort((a, b) => b.priority - a.priority)
              .slice(0, 10)
              .map((p, i) => (
                <li key={p.path} className="flex items-center gap-2">
                  <span className="text-muted-foreground font-mono text-xs w-6">{i + 1}.</span>
                  <span className="font-bold">{p.labelAr}</span>
                  <span className="text-muted-foreground font-mono text-xs">{p.path}</span>
                </li>
              ))}
          </ol>
        </div>
      </main>
    </div>
  );
}
