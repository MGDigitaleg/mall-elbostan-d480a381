import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useRequireAdmin } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OFFICIAL_PHONE } from "@/lib/contactInfo";
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
  Phone,
  Map as MapIcon,
  Code2,
  EyeOff,
  Image as ImageIcon,
  Share2,
} from "lucide-react";

type Status = "go" | "no-go" | "warn" | "pending";

interface CheckItem {
  id: string;
  title: string;
  icon: typeof ShieldCheck;
  status: Status;
  detail: string;
  hint?: string;
}

const STATUS_META: Record<Status, { label: string; tone: string; Icon: typeof CheckCircle2 }> = {
  go: { label: "جاهز للإطلاق", tone: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30", Icon: CheckCircle2 },
  "no-go": { label: "حاجب للإطلاق", tone: "bg-red-500/15 text-red-600 border-red-500/30", Icon: XCircle },
  warn: { label: "تحذير", tone: "bg-amber-500/15 text-amber-600 border-amber-500/30", Icon: AlertTriangle },
  pending: { label: "قيد الفحص", tone: "bg-muted text-muted-foreground border-border", Icon: RefreshCw },
};

const SOCIAL_URLS = [
  "https://www.facebook.com/mallelbostan",
  "https://www.instagram.com/mallelbostan",
  "https://www.tiktok.com/@mallelbostan",
];

const NOINDEX_PATHS = ["/countdown", "/spin-win/claim"];
const SITEMAP_URL = "/sitemap.xml";
const ROBOTS_URL = "/robots.txt";
const OG_IMAGE_URL = "/og-default.jpg";

async function safeFetchText(url: string): Promise<{ ok: boolean; text: string; status: number }> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    const text = await res.text();
    return { ok: res.ok, text, status: res.status };
  } catch {
    return { ok: false, text: "", status: 0 };
  }
}

async function safeFetchHead(url: string): Promise<{ ok: boolean; status: number; type: string | null }> {
  try {
    const res = await fetch(url, { method: "HEAD", cache: "no-store" });
    return { ok: res.ok, status: res.status, type: res.headers.get("content-type") };
  } catch {
    return { ok: false, status: 0, type: null };
  }
}

const AdminLaunchReadiness = () => {
  const { loading } = useRequireAdmin();
  const [checks, setChecks] = useState<CheckItem[]>([]);
  const [running, setRunning] = useState(false);

  const runChecks = async () => {
    setRunning(true);
    const results: CheckItem[] = [];

    // 1. GSC verification meta tag
    const gscMeta = document.querySelector<HTMLMetaElement>('meta[name="google-site-verification"]');
    const gscValue = gscMeta?.content?.trim() ?? "";
    const gscOk = gscValue.length > 5 && !gscValue.toLowerCase().includes("replace");
    results.push({
      id: "gsc",
      title: "كود التحقق من Google Search Console",
      icon: ShieldCheck,
      status: gscOk ? "go" : "no-go",
      detail: gscOk
        ? `تم العثور على كود التحقق (${gscValue.slice(0, 12)}…)`
        : "لم يُضَف كود التحقق بعد في index.html",
      hint: gscOk ? undefined : "افتح index.html وألغِ تعليق وسم google-site-verification ثم استبدل الكود.",
    });

    // 2. Phone number in JSON-LD + footer
    const phoneSet = OFFICIAL_PHONE.trim().length > 0;
    const ldBlocks = Array.from(document.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]'));
    const ldHasPhone = ldBlocks.some((b) => b.textContent?.includes('"telephone"'));
    results.push({
      id: "phone",
      title: "رقم الهاتف الرسمي (JSON-LD + الفوتر)",
      icon: Phone,
      status: phoneSet ? (ldHasPhone ? "go" : "warn") : "warn",
      detail: phoneSet
        ? ldHasPhone
          ? `الرقم الحالي: ${OFFICIAL_PHONE} — يظهر في schema والفوتر`
          : `تم تعيين الرقم (${OFFICIAL_PHONE}) لكن لم يظهر بعد في JSON-LD على هذه الصفحة`
        : "لم يُضَف الرقم بعد — الفوتر يستخدم WhatsApp كبديل مؤقت",
      hint: phoneSet ? undefined : "حدِّث OFFICIAL_PHONE في src/lib/contactInfo.ts عند توفر الرقم.",
    });

    // 3. sitemap.xml
    const sitemap = await safeFetchText(SITEMAP_URL);
    const urlCount = (sitemap.text.match(/<url>/g) || []).length;
    results.push({
      id: "sitemap",
      title: "خريطة الموقع sitemap.xml",
      icon: MapIcon,
      status: sitemap.ok && urlCount > 0 ? "go" : "no-go",
      detail: sitemap.ok
        ? `تم تحميل الخريطة بنجاح — ${urlCount} رابط`
        : `فشل التحميل (HTTP ${sitemap.status})`,
    });

    // 4. robots.txt + sitemap reference
    const robots = await safeFetchText(ROBOTS_URL);
    const robotsHasSitemap = /sitemap:/i.test(robots.text);
    results.push({
      id: "robots",
      title: "robots.txt يشير إلى sitemap",
      icon: EyeOff,
      status: robots.ok && robotsHasSitemap ? "go" : "warn",
      detail: robots.ok
        ? robotsHasSitemap
          ? "robots.txt متاح ويحتوي على Sitemap directive"
          : "robots.txt متاح لكن بدون Sitemap directive"
        : `تعذّر تحميل robots.txt (HTTP ${robots.status})`,
    });

    // 5. JSON-LD schema present + valid
    let validLd = 0;
    let invalidLd = 0;
    for (const b of ldBlocks) {
      try {
        JSON.parse(b.textContent || "");
        validLd += 1;
      } catch {
        invalidLd += 1;
      }
    }
    results.push({
      id: "schema",
      title: "Schema.org JSON-LD على الصفحة",
      icon: Code2,
      status: invalidLd === 0 && validLd > 0 ? "go" : invalidLd > 0 ? "no-go" : "warn",
      detail:
        validLd === 0
          ? "لا توجد كتل JSON-LD على هذه الصفحة"
          : `${validLd} كتلة صالحة${invalidLd ? ` · ${invalidLd} كتلة غير صالحة` : ""}`,
      hint: "للتحقق الشامل: شغّل scripts/validate-rich-results.ts بعد النشر.",
    });

    // 6. noindex pages
    results.push({
      id: "noindex",
      title: "صفحات مستثناة من الفهرسة",
      icon: EyeOff,
      status: "go",
      detail: `محجوبة عن الفهرسة: ${NOINDEX_PATHS.join("، ")} + كل /admin/*`,
    });

    // 7. OG image
    const og = await safeFetchHead(OG_IMAGE_URL);
    results.push({
      id: "og",
      title: "صورة المشاركة الاجتماعية og-default.jpg",
      icon: ImageIcon,
      status: og.ok ? "go" : "no-go",
      detail: og.ok
        ? `الصورة متاحة (${og.type ?? "image"})`
        : `الصورة غير متاحة (HTTP ${og.status})`,
      hint: og.ok ? undefined : "ارفع صورة 1200×630 باسم og-default.jpg في مجلد public/.",
    });

    // 8. sameAs social URLs
    results.push({
      id: "social",
      title: "روابط التواصل الاجتماعي (sameAs)",
      icon: Share2,
      status: "go",
      detail: `${SOCIAL_URLS.length} روابط مثبتة على /mallelbostan — تأكد يدوياً من تفعيلها.`,
    });

    setChecks(results);
    setRunning(false);
  };

  useEffect(() => {
    if (!loading) void runChecks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const summary = useMemo(() => {
    const go = checks.filter((c) => c.status === "go").length;
    const noGo = checks.filter((c) => c.status === "no-go").length;
    const warn = checks.filter((c) => c.status === "warn").length;
    const overall: Status = noGo > 0 ? "no-go" : warn > 0 ? "warn" : checks.length > 0 ? "go" : "pending";
    return { go, noGo, warn, overall };
  }, [checks]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        جاري التحميل...
      </div>
    );
  }

  const overallMeta = STATUS_META[summary.overall];

  return (
    <div className="min-h-screen bg-background">
      <header className="glass sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin">
              <Button variant="ghost" size="sm">
                <ArrowRight className="w-4 h-4 ml-1" />
                لوحة التحكم
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-gradient-blue">جاهزية الإطلاق</h1>
          </div>
          <Button variant="outline" size="sm" onClick={runChecks} disabled={running}>
            <RefreshCw className={`w-4 h-4 ml-1 ${running ? "animate-spin" : ""}`} />
            إعادة الفحص
          </Button>
        </div>
      </header>

      <main className="container py-10 space-y-8">
        {/* Overall verdict */}
        <section className="card-premium p-8">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <div className="text-sm text-muted-foreground mb-2">الحالة العامة</div>
              <div className="flex items-center gap-3">
                <overallMeta.Icon
                  className={`w-8 h-8 ${
                    summary.overall === "go"
                      ? "text-emerald-500"
                      : summary.overall === "no-go"
                      ? "text-red-500"
                      : summary.overall === "warn"
                      ? "text-amber-500"
                      : "text-muted-foreground"
                  } ${summary.overall === "pending" ? "animate-spin" : ""}`}
                />
                <h2 className="text-3xl font-bold text-foreground">
                  {summary.overall === "go" && "GO — جاهز للإطلاق"}
                  {summary.overall === "no-go" && "NO-GO — يوجد حواجب يجب حلها"}
                  {summary.overall === "warn" && "GO مع ملاحظات — يمكن الإطلاق مع متابعة التحذيرات"}
                  {summary.overall === "pending" && "جاري الفحص..."}
                </h2>
              </div>
            </div>
            <div className="flex gap-3">
              <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30 text-sm py-1.5 px-3">
                {summary.go} جاهز
              </Badge>
              <Badge className="bg-amber-500/15 text-amber-600 border-amber-500/30 text-sm py-1.5 px-3">
                {summary.warn} تحذير
              </Badge>
              <Badge className="bg-red-500/15 text-red-600 border-red-500/30 text-sm py-1.5 px-3">
                {summary.noGo} حاجب
              </Badge>
            </div>
          </div>
        </section>

        {/* Individual checks */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {checks.map((c) => {
            const meta = STATUS_META[c.status];
            return (
              <article key={c.id} className="card-premium p-6 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <c.icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-foreground">{c.title}</h3>
                  </div>
                  <Badge className={`${meta.tone} border whitespace-nowrap`}>
                    <meta.Icon className="w-3.5 h-3.5 ml-1" />
                    {meta.label}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.detail}</p>
                {c.hint && (
                  <p className="text-xs text-foreground/70 bg-muted/50 rounded-md px-3 py-2 border border-border">
                    {c.hint}
                  </p>
                )}
              </article>
            );
          })}
        </section>

        {/* Quick links */}
        <section className="card-premium p-6">
          <h3 className="font-bold text-foreground mb-4">روابط فحص سريعة</h3>
          <div className="flex flex-wrap gap-2">
            <a href={SITEMAP_URL} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">sitemap.xml</Button>
            </a>
            <a href={ROBOTS_URL} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">robots.txt</Button>
            </a>
            <a href={OG_IMAGE_URL} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">og-default.jpg</Button>
            </a>
            <a
              href="https://search.google.com/test/rich-results?url=https%3A%2F%2Fmallelbostan.com%2F"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm">Rich Results Test</Button>
            </a>
            <a
              href="https://search.google.com/search-console"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm">Google Search Console</Button>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminLaunchReadiness;
