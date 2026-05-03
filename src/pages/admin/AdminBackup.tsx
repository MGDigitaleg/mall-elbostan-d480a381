import { useState } from "react";
import { Link } from "react-router-dom";
import JSZip from "jszip";
import { useRequireAdmin } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ArrowRight, Download, Loader2, Database, FileJson, FileSpreadsheet } from "lucide-react";

// Tables that admins can read (per RLS). Sensitive ones are flagged.
const TABLES: { name: string; sensitive?: boolean; label: string }[] = [
  { name: "stores", label: "المحلات" },
  { name: "products", label: "المنتجات" },
  { name: "product_categories", label: "فئات المنتجات" },
  { name: "deals", label: "العروض" },
  { name: "events", label: "الفعاليات" },
  { name: "blog_posts", label: "المدونة" },
  { name: "faqs", label: "الأسئلة الشائعة" },
  { name: "jobs", label: "الوظائف" },
  { name: "floors", label: "الطوابق" },
  { name: "units", label: "الوحدات التجارية" },
  { name: "downtown_merchants", label: "دليل وسط البلد" },
  { name: "rewards", label: "المكافآت" },
  { name: "competition_stores", label: "محلات المسابقة" },
  { name: "store_prizes", label: "جوائز المحلات" },
  { name: "campaign_settings", label: "إعدادات الحملة" },
  { name: "site_settings", label: "إعدادات الموقع" },
  { name: "tenant_logo_assets", label: "أصول شعارات المستأجرين" },
  { name: "kz_categories", label: "Kasr Zero — الفئات" },
  { name: "kz_products", label: "Kasr Zero — المنتجات" },
  { name: "kz_product_variants", label: "Kasr Zero — متغيرات المنتجات" },
  { name: "kz_product_images", label: "Kasr Zero — صور المنتجات" },
  { name: "kz_product_specs", label: "Kasr Zero — مواصفات المنتجات" },
  { name: "social_monitored_merchants", label: "محلات السوشيال المراقَبة" },
  { name: "social_merchant_sources", label: "مصادر السوشيال للمحلات" },
  { name: "social_offer_intake", label: "عروض السوشيال — الوارد" },
  { name: "social_offer_activity_log", label: "سجل نشاط عروض السوشيال" },
  { name: "social_offer_notifications", label: "إشعارات عروض السوشيال" },
  { name: "social_offer_settings", label: "إعدادات عروض السوشيال" },
  { name: "indexing_logs", label: "سجل IndexNow" },
  { name: "leads", label: "العملاء المحتملون", sensitive: true },
  { name: "spin_entries", label: "مشاركات أدر واربح", sensitive: true },
  { name: "spin_sessions", label: "جلسات أدر واربح", sensitive: true },
  { name: "spin_history", label: "سجل أدر واربح", sensitive: true },
  { name: "user_roles", label: "أدوار المستخدمين", sensitive: true },
];

const PAGE_SIZE = 1000;

async function fetchAllRows(table: string): Promise<any[]> {
  const all: any[] = [];
  let from = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { data, error } = await (supabase as any)
      .from(table)
      .select("*")
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw new Error(`${table}: ${error.message}`);
    if (!data || data.length === 0) break;
    all.push(...data);
    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }
  return all;
}

function toCsv(rows: any[]): string {
  if (rows.length === 0) return "";
  const headers = Array.from(
    rows.reduce((set: Set<string>, r) => {
      Object.keys(r).forEach((k) => set.add(k));
      return set;
    }, new Set<string>())
  );
  const escape = (v: any) => {
    if (v === null || v === undefined) return "";
    const s = typeof v === "object" ? JSON.stringify(v) : String(v);
    if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const lines = [headers.join(",")];
  for (const r of rows) lines.push(headers.map((h) => escape(r[h])).join(","));
  return lines.join("\n");
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const AdminBackup = () => {
  const { loading } = useRequireAdmin();
  const [selected, setSelected] = useState<Set<string>>(
    new Set(TABLES.filter((t) => !t.sensitive).map((t) => t.name))
  );
  const [busy, setBusy] = useState<null | "json" | "csv">(null);
  const [progress, setProgress] = useState<string>("");

  const toggle = (name: string) =>
    setSelected((s) => {
      const next = new Set(s);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });

  const setAll = (mode: "all" | "safe" | "none") => {
    if (mode === "all") setSelected(new Set(TABLES.map((t) => t.name)));
    else if (mode === "safe") setSelected(new Set(TABLES.filter((t) => !t.sensitive).map((t) => t.name)));
    else setSelected(new Set());
  };

  const runExport = async (mode: "json" | "csv") => {
    if (selected.size === 0) {
      toast.error("اختر جدولاً واحداً على الأقل");
      return;
    }
    setBusy(mode);
    try {
      const tables = TABLES.filter((t) => selected.has(t.name));
      const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);

      if (mode === "json") {
        const out: Record<string, any> = {
          _meta: {
            exported_at: new Date().toISOString(),
            project: "mall-elbostan",
            tables: tables.map((t) => t.name),
          },
        };
        for (const t of tables) {
          setProgress(`تصدير ${t.label}…`);
          out[t.name] = await fetchAllRows(t.name);
        }
        downloadBlob(
          new Blob([JSON.stringify(out, null, 2)], { type: "application/json" }),
          `mallelbostan-backup-${stamp}.json`
        );
      } else {
        const zip = new JSZip();
        for (const t of tables) {
          setProgress(`تصدير ${t.label}…`);
          const rows = await fetchAllRows(t.name);
          zip.file(`${t.name}.csv`, toCsv(rows));
        }
        zip.file(
          "_meta.json",
          JSON.stringify(
            { exported_at: new Date().toISOString(), tables: tables.map((t) => t.name) },
            null,
            2
          )
        );
        setProgress("ضغط الملفات…");
        const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
        downloadBlob(blob, `mallelbostan-backup-${stamp}.zip`);
      }

      toast.success("تم إنشاء النسخة الاحتياطية بنجاح");
    } catch (e: any) {
      toast.error(e.message || "فشل التصدير");
    } finally {
      setBusy(null);
      setProgress("");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        جاري التحميل...
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      <header className="glass sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-bold text-foreground">النسخ الاحتياطية لقاعدة البيانات</h1>
          </div>
          <Link to="/admin">
            <Button variant="ghost" size="sm">
              <ArrowRight className="w-4 h-4 ml-1" /> رجوع
            </Button>
          </Link>
        </div>
      </header>

      <main className="container py-10 space-y-8">
        <section className="card-premium p-6 space-y-3">
          <h2 className="text-lg font-bold text-foreground">حول النسخ الاحتياطية</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            تصدير بيانات الجداول العامة من قاعدة بيانات لوحة التحكم. اختر الجداول، ثم اختر صيغة التصدير
            (JSON واحد للاستعادة البرمجية، أو ZIP يحتوي ملف CSV لكل جدول للتحليل في Excel). تذكّر أن
            ملفات النسخة الاحتياطية تحوي بيانات حساسة — احفظها في مكان آمن.
          </p>
        </section>

        <section className="card-premium p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-bold text-foreground">اختيار الجداول ({selected.size}/{TABLES.length})</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setAll("all")}>الكل</Button>
              <Button variant="outline" size="sm" onClick={() => setAll("safe")}>المحتوى فقط</Button>
              <Button variant="outline" size="sm" onClick={() => setAll("none")}>مسح</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {TABLES.map((t) => (
              <label
                key={t.name}
                className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card/40 hover:bg-card cursor-pointer transition"
              >
                <Checkbox
                  checked={selected.has(t.name)}
                  onCheckedChange={() => toggle(t.name)}
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-foreground">{t.label}</span>
                    {t.sensitive && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-destructive/15 text-destructive font-medium">
                        حساس
                      </span>
                    )}
                  </div>
                  <code className="text-xs text-muted-foreground" dir="ltr">{t.name}</code>
                </div>
              </label>
            ))}
          </div>
        </section>

        <section className="card-premium p-6 space-y-4">
          <h3 className="font-bold text-foreground">تنفيذ التصدير</h3>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => runExport("json")} disabled={busy !== null} size="lg">
              {busy === "json" ? (
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
              ) : (
                <FileJson className="w-4 h-4 ml-2" />
              )}
              تنزيل JSON واحد
            </Button>
            <Button
              onClick={() => runExport("csv")}
              disabled={busy !== null}
              size="lg"
              variant="secondary"
            >
              {busy === "csv" ? (
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
              ) : (
                <FileSpreadsheet className="w-4 h-4 ml-2" />
              )}
              تنزيل ZIP بصيغة CSV
            </Button>
          </div>
          {busy && progress && (
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Download className="w-4 h-4" /> {progress}
            </p>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminBackup;
