import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useRequireContentAccess } from "@/hooks/useAuth";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  AdminPageHeader, AdminStatusBadge, AdminEmptyState,
} from "@/components/admin/AdminPrimitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, Store as StoreIcon, ExternalLink, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type Row = {
  id: string;
  slug: string;
  name_ar: string;
  display_name: string | null;
  category: string | null;
  floor_label: string | null;
  unit_label: string | null;
  unit_code: string | null;
  status: string;
  featured: boolean;
  opening_status: string | null;
  logo_url: string | null;
  external_store_type: string;
  external_store_url: string | null;
  sync_status: string;
  last_sync_at: string | null;
};

const STATUS_LABELS: Record<string, { label: string; tone: "success"|"warning"|"neutral"|"info"|"danger" }> = {
  leased: { label: "مؤجّر", tone: "success" },
  available: { label: "متاح", tone: "info" },
  hidden: { label: "مخفي", tone: "neutral" },
};

const EXT_LABELS: Record<string, string> = {
  none: "—",
  manual: "إدارة يدوية",
  website: "موقع خارجي",
  shopify: "Shopify",
  woocommerce: "WooCommerce",
  other: "أخرى",
};

const SYNC_TONES: Record<string, "success"|"warning"|"neutral"|"info"|"danger"> = {
  idle: "neutral", queued: "info", running: "info",
  success: "success", error: "danger", disabled: "neutral",
};

export default function AdminStoresList() {
  const { loading: authLoading, user, canManageContent } = useRequireContentAccess();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [extFilter, setExtFilter] = useState<string>("all");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("stores")
      .select("id, slug, name_ar, display_name, category, floor_label, unit_label, unit_code, status, featured, opening_status, logo_url, external_store_type, external_store_url, sync_status, last_sync_at")
      .order("featured", { ascending: false })
      .order("name_ar", { ascending: true })
      .limit(500);
    if (error) toast({ title: "تعذّر تحميل المحلات", description: error.message, variant: "destructive" });
    setRows((data as Row[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    if (!user || !canManageContent) return;
    load();
  }, [user, canManageContent]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (extFilter !== "all" && r.external_store_type !== extFilter) return false;
      if (!needle) return true;
      const hay = [r.name_ar, r.display_name, r.slug, r.category, r.unit_label, r.unit_code]
        .filter(Boolean).join(" ").toLowerCase();
      return hay.includes(needle);
    });
  }, [rows, q, statusFilter, extFilter]);

  const counts = useMemo(() => ({
    total: rows.length,
    leased: rows.filter(r => r.status === "leased").length,
    available: rows.filter(r => r.status === "available").length,
    external: rows.filter(r => r.external_store_type && r.external_store_type !== "none").length,
    errors: rows.filter(r => r.sync_status === "error").length,
  }), [rows]);

  const createNew = async () => {
    const slug = `store-${Math.random().toString(36).slice(2, 8)}`;
    const { data, error } = await supabase
      .from("stores")
      .insert({ slug, name_ar: "محل جديد", status: "hidden" })
      .select("id").single();
    if (error) { toast({ title: "تعذّر الإنشاء", description: error.message, variant: "destructive" }); return; }
    window.location.href = `/admin/stores/${data!.id}`;
  };

  if (authLoading) {
    return <div className="min-h-screen bg-background grid place-items-center text-muted-foreground">جاري التحميل...</div>;
  }
  if (!user || !canManageContent) return null;

  return (
    <AdminShell>
      <div className="p-6 max-w-7xl mx-auto">
        <AdminPageHeader
          title="إدارة المحلات"
          subtitle="إدارة المستأجرين، الوحدات، الواجهات الخارجية، وحالة كل محل."
          actions={
            <Button variant="cta" size="sm" onClick={createNew} className="gap-1">
              <Plus className="w-4 h-4" /> محل جديد
            </Button>
          }
        />

        {/* Mini stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-5">
          <Pill label="إجمالي" value={counts.total} />
          <Pill label="مؤجّر" value={counts.leased} tone="success" />
          <Pill label="متاح" value={counts.available} tone="info" />
          <Pill label="متجر خارجي مرتبط" value={counts.external} tone="info" />
          <Pill label="أخطاء مزامنة" value={counts.errors} tone={counts.errors > 0 ? "danger" : "neutral"} />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="ابحث بالاسم، الفئة، أو رمز الوحدة..."
              className="pr-9"
            />
          </div>
          <Select value={statusFilter} onChange={setStatusFilter} options={[
            { value: "all", label: "كل الحالات" },
            { value: "leased", label: "مؤجّر" },
            { value: "available", label: "متاح" },
            { value: "hidden", label: "مخفي" },
          ]} />
          <Select value={extFilter} onChange={setExtFilter} options={[
            { value: "all", label: "كل المصادر" },
            { value: "none", label: "بدون متجر خارجي" },
            { value: "shopify", label: "Shopify" },
            { value: "woocommerce", label: "WooCommerce" },
            { value: "website", label: "موقع خارجي" },
            { value: "manual", label: "يدوي" },
          ]} />
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 text-muted-foreground">
                <tr className="text-right">
                  <th className="px-3 py-2 font-bold">المحل</th>
                  <th className="px-3 py-2 font-bold">الفئة</th>
                  <th className="px-3 py-2 font-bold">الموقع</th>
                  <th className="px-3 py-2 font-bold">الحالة</th>
                  <th className="px-3 py-2 font-bold">المتجر الخارجي</th>
                  <th className="px-3 py-2 font-bold">المزامنة</th>
                  <th className="px-3 py-2 font-bold"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}><td colSpan={7} className="p-2"><Skeleton className="h-9 w-full" /></td></tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={7} className="p-0">
                    <AdminEmptyState icon={StoreIcon} title="لا توجد محلات مطابقة" description="جرّب تعديل الفلاتر أو إنشاء محل جديد." />
                  </td></tr>
                ) : filtered.map((r) => {
                  const st = STATUS_LABELS[r.status] ?? { label: r.status, tone: "neutral" as const };
                  return (
                    <tr key={r.id} className="hover:bg-secondary/40">
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2 min-w-0">
                          {r.logo_url
                            ? <img src={r.logo_url} alt="" className="w-7 h-7 rounded object-contain bg-secondary border border-border shrink-0" loading="lazy" />
                            : <div className="w-7 h-7 rounded bg-secondary border border-border grid place-items-center text-[0.6rem] text-muted-foreground shrink-0">{r.name_ar?.[0] ?? "?"}</div>}
                          <div className="min-w-0">
                            <Link to={`/admin/stores/${r.id}`} className="font-bold text-foreground hover:text-primary truncate block">{r.display_name || r.name_ar}</Link>
                            <div className="text-[0.7rem] text-muted-foreground truncate">{r.slug}</div>
                          </div>
                          {r.featured && <AdminStatusBadge tone="warning">مميز</AdminStatusBadge>}
                        </div>
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">{r.category || "—"}</td>
                      <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">
                        {(r.floor_label || r.unit_label || r.unit_code)
                          ? `${r.floor_label ?? ""} ${r.unit_label || r.unit_code || ""}`.trim()
                          : "—"}
                      </td>
                      <td className="px-3 py-2"><AdminStatusBadge tone={st.tone}>{st.label}</AdminStatusBadge></td>
                      <td className="px-3 py-2">
                        {r.external_store_type === "none" ? (
                          <span className="text-muted-foreground">—</span>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <AdminStatusBadge tone="info">{EXT_LABELS[r.external_store_type] ?? r.external_store_type}</AdminStatusBadge>
                            {r.external_store_url && (
                              <a href={r.external_store_url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary">
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        {r.external_store_type === "none" ? (
                          <span className="text-muted-foreground">—</span>
                        ) : (
                          <div className="flex items-center gap-1.5 text-[0.72rem]">
                            <AdminStatusBadge tone={SYNC_TONES[r.sync_status] ?? "neutral"}>
                              {r.sync_status === "success" ? <CheckCircle2 className="w-3 h-3" />
                                : r.sync_status === "error" ? <AlertCircle className="w-3 h-3" /> : null}
                              {r.sync_status}
                            </AdminStatusBadge>
                            {r.last_sync_at && <span className="text-muted-foreground">{new Date(r.last_sync_at).toLocaleDateString("ar-EG")}</span>}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2 text-left">
                        <Link to={`/admin/stores/${r.id}`}>
                          <Button variant="outline" size="sm">إدارة</Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

function Pill({ label, value, tone = "neutral" as "neutral"|"success"|"info"|"danger" }: any) {
  const map = {
    neutral: "bg-secondary text-foreground border-border",
    success: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
    info: "bg-primary/10 text-primary border-primary/20",
    danger: "bg-red-500/10 text-red-600 border-red-500/20",
  } as const;
  return (
    <div className={`rounded-lg border px-3 py-2 ${map[tone as keyof typeof map]}`}>
      <div className="text-[0.7rem] font-bold opacity-80">{label}</div>
      <div className="text-lg font-bold leading-tight">{value}</div>
    </div>
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select
      value={value} onChange={(e) => onChange(e.target.value)}
      className="h-10 rounded-md border border-input bg-background px-3 text-sm font-bold text-foreground"
    >
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}
