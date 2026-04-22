import { useState, useCallback, useRef } from "react";
import { useRequireAdmin } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  Loader2,
} from "lucide-react";

/* ── All public routes to verify ── */
const PUBLIC_ROUTES = [
  { path: "/", label: "الرئيسية" },
  { path: "/stores", label: "دليل المحلات" },
  { path: "/products", label: "المنتجات" },
  { path: "/map", label: "الدليل التفاعلي" },
  { path: "/leasing", label: "التأجير" },
  { path: "/opening-day", label: "يوم الافتتاح" },
  { path: "/spin-win", label: "أدر واربح" },
  { path: "/daily-deals", label: "العروض اليومية" },
  { path: "/about", label: "من نحن" },
  { path: "/new-cairo-branch", label: "فرع القاهرة الجديدة" },
  { path: "/downtown-branch", label: "فرع وسط البلد" },
  { path: "/downtown-directory", label: "دليل وسط البلد" },
  { path: "/contact", label: "تواصل معنا" },
  { path: "/blog", label: "المدونة" },
  { path: "/faq", label: "الأسئلة الشائعة" },
  { path: "/careers", label: "الوظائف" },
  { path: "/join-marketplace", label: "انضم للسوق" },
  { path: "/kz", label: "كسر زيرو" },
  { path: "/market-echo", label: "صدى السوق" },
  { path: "/countdown", label: "العد التنازلي" },
  { path: "/privacy", label: "سياسة الخصوصية" },
  { path: "/terms", label: "الشروط والأحكام" },
  { path: "/reward-terms", label: "شروط المكافآت" },
];

interface SeoCheckResult {
  path: string;
  label: string;
  status: "pending" | "checking" | "done" | "error";
  title: string | null;
  titleLength: number;
  description: string | null;
  descriptionLength: number;
  canonical: string | null;
  canonicalCorrect: boolean;
  hasOgTitle: boolean;
  hasOgDescription: boolean;
  hasOgImage: boolean;
  hasTwitterCard: boolean;
  hasJsonLd: boolean;
  jsonLdTypes: string[];
  hasBreadcrumbs: boolean;
  isNoIndex: boolean;
  hasKeywords: boolean;
  hasHreflang: boolean;
  h1Count: number;
  h1Text: string | null;
  issues: string[];
  score: number;
}

function createEmptyResult(path: string, label: string): SeoCheckResult {
  return {
    path,
    label,
    status: "pending",
    title: null,
    titleLength: 0,
    description: null,
    descriptionLength: 0,
    canonical: null,
    canonicalCorrect: false,
    hasOgTitle: false,
    hasOgDescription: false,
    hasOgImage: false,
    hasTwitterCard: false,
    hasJsonLd: false,
    jsonLdTypes: [],
    hasBreadcrumbs: false,
    isNoIndex: false,
    hasKeywords: false,
    hasHreflang: false,
    h1Count: 0,
    h1Text: null,
    issues: [],
    score: 0,
  };
}

const BASE_URL = "https://mallelbostan.com";

function extractSeoFromDocument(doc: Document, path: string): Partial<SeoCheckResult> {
  const issues: string[] = [];

  // Title
  const title = doc.querySelector("title")?.textContent ?? null;
  const titleLength = title?.length ?? 0;
  if (!title) issues.push("عنوان الصفحة مفقود");
  else if (titleLength > 60) issues.push(`العنوان طويل (${titleLength} حرف)`);
  else if (titleLength < 20) issues.push(`العنوان قصير (${titleLength} حرف)`);

  // Description
  const descMeta = doc.querySelector('meta[name="description"]');
  const description = descMeta?.getAttribute("content") ?? null;
  const descriptionLength = description?.length ?? 0;
  if (!description) issues.push("وصف الصفحة مفقود");
  else if (descriptionLength > 160) issues.push(`الوصف طويل (${descriptionLength} حرف)`);
  else if (descriptionLength < 80) issues.push(`الوصف قصير (${descriptionLength} حرف)`);

  // Canonical
  const canonicalEl = doc.querySelector('link[rel="canonical"]');
  const canonical = canonicalEl?.getAttribute("href") ?? null;
  const expectedCanonical = `${BASE_URL}${path}`;
  const canonicalCorrect = canonical === expectedCanonical;
  if (!canonical) issues.push("Canonical مفقود");
  else if (!canonicalCorrect) issues.push(`Canonical غير صحيح: ${canonical}`);

  // OG
  const hasOgTitle = !!doc.querySelector('meta[property="og:title"]');
  const hasOgDescription = !!doc.querySelector('meta[property="og:description"]');
  const hasOgImage = !!doc.querySelector('meta[property="og:image"]');
  if (!hasOgTitle) issues.push("og:title مفقود");
  if (!hasOgDescription) issues.push("og:description مفقود");
  if (!hasOgImage) issues.push("og:image مفقود");

  // Twitter
  const hasTwitterCard = !!doc.querySelector('meta[name="twitter:card"]');
  if (!hasTwitterCard) issues.push("Twitter Card مفقود");

  // JSON-LD
  const jsonLdScripts = doc.querySelectorAll('script[type="application/ld+json"]');
  const jsonLdTypes: string[] = [];
  let hasBreadcrumbs = false;
  jsonLdScripts.forEach((script) => {
    try {
      const data = JSON.parse(script.textContent ?? "{}");
      const type = data["@type"];
      if (type) jsonLdTypes.push(type);
      if (type === "BreadcrumbList") hasBreadcrumbs = true;
    } catch { /* ignore */ }
  });
  const hasJsonLd = jsonLdTypes.length > 0;

  // Breadcrumbs check — pages that should have them
  const noNeedBreadcrumbs = ["/", "/market-echo", "/countdown", "/kz"];
  if (!hasBreadcrumbs && !noNeedBreadcrumbs.includes(path)) {
    issues.push("BreadcrumbList مفقود");
  }

  // noindex
  const robotsMeta = doc.querySelector('meta[name="robots"]');
  const isNoIndex = robotsMeta?.getAttribute("content")?.includes("noindex") ?? false;

  // Keywords
  const hasKeywords = !!doc.querySelector('meta[name="keywords"]');

  // Hreflang
  const hasHreflang = !!doc.querySelector('link[hreflang="ar-EG"]');
  if (!hasHreflang) issues.push("hreflang مفقود");

  // H1
  const h1s = doc.querySelectorAll("h1");
  const h1Count = h1s.length;
  const h1Text = h1s[0]?.textContent?.trim() ?? null;
  if (h1Count === 0) issues.push("لا يوجد H1");
  else if (h1Count > 1) issues.push(`عدد H1 = ${h1Count} (يجب أن يكون 1)`);

  // Score
  let score = 0;
  if (title) score += 15;
  if (description) score += 15;
  if (canonical && canonicalCorrect) score += 15;
  if (hasOgTitle && hasOgDescription && hasOgImage) score += 10;
  if (hasTwitterCard) score += 5;
  if (hasJsonLd) score += 10;
  if (hasBreadcrumbs || noNeedBreadcrumbs.includes(path)) score += 10;
  if (hasKeywords) score += 5;
  if (hasHreflang) score += 5;
  if (h1Count === 1) score += 10;
  if (!isNoIndex) score += 0; // not penalized unless it shouldn't be

  return {
    title,
    titleLength,
    description,
    descriptionLength,
    canonical,
    canonicalCorrect,
    hasOgTitle,
    hasOgDescription,
    hasOgImage,
    hasTwitterCard,
    hasJsonLd,
    jsonLdTypes,
    hasBreadcrumbs,
    isNoIndex,
    hasKeywords,
    hasHreflang,
    h1Count,
    h1Text,
    issues,
    score,
    status: "done" as const,
  };
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 90
      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
      : score >= 70
      ? "bg-sky-500/15 text-sky-400 border-sky-500/30"
      : score >= 50
      ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
      : "bg-red-500/15 text-red-400 border-red-500/30";

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border ${color}`}>
      {score}%
    </span>
  );
}

function StatusIcon({ result }: { result: SeoCheckResult }) {
  if (result.status === "pending") return <div className="h-4 w-4 rounded-full bg-muted-foreground/20" />;
  if (result.status === "checking") return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
  if (result.status === "error") return <XCircle className="h-4 w-4 text-red-400" />;
  if (result.issues.length === 0) return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
  return <AlertTriangle className="h-4 w-4 text-amber-400" />;
}

function Check({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs">
      {ok ? (
        <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
      ) : (
        <XCircle className="h-3 w-3 text-red-400/60 shrink-0" />
      )}
      <span className={ok ? "text-muted-foreground" : "text-red-400/80"}>{label}</span>
    </span>
  );
}

export default function AdminSeoVerify() {
  const { loading } = useRequireAdmin();
  const [results, setResults] = useState<SeoCheckResult[]>(
    PUBLIC_ROUTES.map((r) => createEmptyResult(r.path, r.label))
  );
  const [running, setRunning] = useState(false);
  const [expandedPath, setExpandedPath] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const runAudit = useCallback(async () => {
    setRunning(true);
    setExpandedPath(null);

    const newResults: SeoCheckResult[] = PUBLIC_ROUTES.map((r) => createEmptyResult(r.path, r.label));
    setResults([...newResults]);

    for (let i = 0; i < PUBLIC_ROUTES.length; i++) {
      const route = PUBLIC_ROUTES[i];

      // Mark as checking
      newResults[i] = { ...newResults[i], status: "checking" };
      setResults([...newResults]);

      try {
        // Navigate iframe to the route
        const iframe = iframeRef.current;
        if (!iframe) throw new Error("Iframe not found");

        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error("Timeout"));
          }, 12000);

          const onLoad = () => {
            clearTimeout(timeout);
            iframe.removeEventListener("load", onLoad);
            // Wait for react-helmet to inject tags
            setTimeout(resolve, 1500);
          };

          iframe.addEventListener("load", onLoad);
          iframe.src = route.path;
        });

        const iframeDoc = iframe.contentDocument;
        if (!iframeDoc) throw new Error("Cannot access iframe document");

        const extracted = extractSeoFromDocument(iframeDoc, route.path);
        newResults[i] = { ...newResults[i], ...extracted };
      } catch {
        newResults[i] = {
          ...newResults[i],
          status: "error",
          issues: ["فشل في تحميل الصفحة"],
          score: 0,
        };
      }

      setResults([...newResults]);
    }

    setRunning(false);
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        جاري التحميل...
      </div>
    );

  const completedResults = results.filter((r) => r.status === "done");
  const avgScore = completedResults.length
    ? Math.round(completedResults.reduce((s, r) => s + r.score, 0) / completedResults.length)
    : 0;
  const totalIssues = completedResults.reduce((s, r) => s + r.issues.length, 0);
  const perfectPages = completedResults.filter((r) => r.issues.length === 0).length;
  const missingBreadcrumbs = completedResults.filter(
    (r) => !r.hasBreadcrumbs && !["/", "/market-echo", "/countdown", "/kz"].includes(r.path)
  ).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Hidden iframe for live verification */}
      <iframe
        ref={iframeRef}
        className="fixed -left-[9999px] top-0 w-[1280px] h-[800px]"
        title="SEO Verification"
        sandbox="allow-same-origin allow-scripts"
      />

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
            <h1 className="text-lg font-bold text-gradient-blue">فحص SEO المباشر</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/admin/seo-audit">
              <Button variant="outline" size="sm">
                تقرير SEO الثابت
              </Button>
            </Link>
            <Button
              onClick={runAudit}
              disabled={running}
              size="sm"
              className="gap-1.5"
            >
              {running ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  جاري الفحص...
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5" />
                  فحص جميع الصفحات
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-6">
        {/* Stats */}
        {completedResults.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="text-xs text-muted-foreground mb-1">الصفحات المفحوصة</p>
              <p className="text-2xl font-bold text-foreground">
                {completedResults.length}/{PUBLIC_ROUTES.length}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="text-xs text-muted-foreground mb-1">متوسط النتيجة</p>
              <p
                className="text-2xl font-bold"
                style={{
                  color: avgScore >= 80 ? "hsl(var(--primary))" : "hsl(40 95% 55%)",
                }}
              >
                {avgScore}%
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="text-xs text-muted-foreground mb-1">صفحات بلا مشاكل</p>
              <p className="text-2xl font-bold text-emerald-400">{perfectPages}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="text-xs text-muted-foreground mb-1">إجمالي الملاحظات</p>
              <p className="text-2xl font-bold text-amber-400">{totalIssues}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="text-xs text-muted-foreground mb-1">Breadcrumbs مفقودة</p>
              <p className="text-2xl font-bold text-red-400">{missingBreadcrumbs}</p>
            </div>
          </div>
        )}

        {/* Instructions */}
        {completedResults.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <Play className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-foreground mb-2">فحص SEO المباشر</h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              يقوم هذا الفحص بتحميل كل صفحة عامة والتحقق من العناوين، الأوصاف، Canonical، Breadcrumbs،
              Open Graph، JSON-LD، وبنية H1 بشكل مباشر من الكود المُنفّذ.
            </p>
            <Button onClick={runAudit} size="lg" className="gap-2">
              <Play className="h-4 w-4" />
              ابدأ الفحص الآن
            </Button>
          </div>
        )}

        {/* Results table */}
        {results.some((r) => r.status !== "pending" || completedResults.length > 0) && (
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm" dir="rtl">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-4 py-3 text-right font-semibold text-muted-foreground w-8"></th>
                    <th className="px-4 py-3 text-right font-semibold text-muted-foreground">الصفحة</th>
                    <th className="px-4 py-3 text-center font-semibold text-muted-foreground">النتيجة</th>
                    <th className="px-4 py-3 text-center font-semibold text-muted-foreground">العنوان</th>
                    <th className="px-4 py-3 text-center font-semibold text-muted-foreground">الوصف</th>
                    <th className="px-4 py-3 text-center font-semibold text-muted-foreground">Canonical</th>
                    <th className="px-4 py-3 text-center font-semibold text-muted-foreground">OG</th>
                    <th className="px-4 py-3 text-center font-semibold text-muted-foreground">JSON-LD</th>
                    <th className="px-4 py-3 text-center font-semibold text-muted-foreground">Breadcrumbs</th>
                    <th className="px-4 py-3 text-center font-semibold text-muted-foreground">H1</th>
                    <th className="px-4 py-3 text-center font-semibold text-muted-foreground">ملاحظات</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r) => (
                    <>
                      <tr
                        key={r.path}
                        className={`border-b border-border/50 transition-colors hover:bg-muted/20 cursor-pointer ${
                          expandedPath === r.path ? "bg-muted/10" : ""
                        }`}
                        onClick={() =>
                          r.status === "done"
                            ? setExpandedPath(expandedPath === r.path ? null : r.path)
                            : undefined
                        }
                      >
                        <td className="px-4 py-3 text-center">
                          <StatusIcon result={r} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">{r.label}</span>
                            <span className="text-xs text-muted-foreground font-mono" dir="ltr">
                              {r.path}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {r.status === "done" ? <ScoreBadge score={r.score} /> : "—"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {r.status === "done" ? (
                            <Check ok={!!r.title && r.titleLength <= 60 && r.titleLength >= 20} label="عنوان" />
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {r.status === "done" ? (
                            <Check ok={!!r.description && r.descriptionLength <= 160 && r.descriptionLength >= 80} label="وصف" />
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {r.status === "done" ? <Check ok={r.canonicalCorrect} label="صحيح" /> : "—"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {r.status === "done" ? (
                            <Check ok={r.hasOgTitle && r.hasOgDescription && r.hasOgImage} label="OG" />
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {r.status === "done" ? <Check ok={r.hasJsonLd} label={r.jsonLdTypes.join(", ") || "لا"} /> : "—"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {r.status === "done" ? (
                            <Check
                              ok={r.hasBreadcrumbs || ["/", "/market-echo", "/countdown", "/kz"].includes(r.path)}
                              label={r.hasBreadcrumbs ? "موجود" : "—"}
                            />
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {r.status === "done" ? <Check ok={r.h1Count === 1} label={`${r.h1Count}`} /> : "—"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {r.status === "done" ? (
                            r.issues.length > 0 ? (
                              <Badge variant="outline" className="text-amber-400 border-amber-500/30 text-[0.65rem]">
                                {r.issues.length}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 text-[0.65rem]">
                                0
                              </Badge>
                            )
                          ) : (
                            "—"
                          )}
                        </td>
                      </tr>
                      {/* Expanded details */}
                      {expandedPath === r.path && r.status === "done" && (
                        <tr key={`${r.path}-detail`}>
                          <td colSpan={11} className="px-6 py-4 bg-muted/5 border-b border-border/50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs" dir="rtl">
                              <div className="space-y-2">
                                <h4 className="font-bold text-foreground text-sm mb-2">تفاصيل الصفحة</h4>
                                <div>
                                  <span className="text-muted-foreground">العنوان: </span>
                                  <span className="text-foreground">{r.title ?? "غير موجود"}</span>
                                  <span className="text-muted-foreground mr-1">({r.titleLength} حرف)</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">الوصف: </span>
                                  <span className="text-foreground line-clamp-2">
                                    {r.description ?? "غير موجود"}
                                  </span>
                                  <span className="text-muted-foreground mr-1">({r.descriptionLength} حرف)</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Canonical: </span>
                                  <span className="text-foreground font-mono text-[0.65rem]" dir="ltr">
                                    {r.canonical ?? "غير موجود"}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">H1: </span>
                                  <span className="text-foreground">{r.h1Text ?? "غير موجود"}</span>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-1">
                                  <Check ok={r.hasKeywords} label="Keywords" />
                                  <Check ok={r.hasHreflang} label="Hreflang" />
                                  <Check ok={r.hasTwitterCard} label="Twitter Card" />
                                  <Check ok={!r.isNoIndex} label="Indexable" />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <h4 className="font-bold text-foreground text-sm mb-2">
                                  الملاحظات ({r.issues.length})
                                </h4>
                                {r.issues.length === 0 ? (
                                  <p className="text-emerald-400">لا توجد ملاحظات — الصفحة ممتازة</p>
                                ) : (
                                  <ul className="space-y-1">
                                    {r.issues.map((issue, idx) => (
                                      <li key={idx} className="flex items-start gap-1.5">
                                        <AlertTriangle className="h-3 w-3 text-amber-400 mt-0.5 shrink-0" />
                                        <span className="text-amber-300">{issue}</span>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                                {r.jsonLdTypes.length > 0 && (
                                  <div className="pt-2">
                                    <span className="text-muted-foreground">JSON-LD: </span>
                                    <span className="text-foreground">{r.jsonLdTypes.join(" / ")}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
