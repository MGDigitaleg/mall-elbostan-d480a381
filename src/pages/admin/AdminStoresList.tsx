import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useRequireContentAccess } from "@/hooks/useAuth";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  AdminPageHeader, AdminStatusBadge, AdminEmptyState, AdminFilterPanel,
} from "@/components/admin/AdminPrimitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus, Search, Store as StoreIcon, ExternalLink, AlertCircle, CheckCircle2,
  Download, X, ChevronDown,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { downloadCsv, type CsvColumn } from "@/lib/csvExport";
import { LIFECYCLE_META, LIFECYCLE_VALUES, type Lifecycle } from "@/lib/storeLifecycle";

type Row = {
  id: string;
  slug: string;
  name_ar: string;
  display_name: string | null;
  category: string | null;
  branch_context: string | null;
  floor_label: string | null;
  unit_label: string | null;
  unit_code: string | null;
  status: string;
  lifecycle_status: Lifecycle;
  featured: boolean;
  opening_status: string | null;
  logo_url: string | null;
  external_store_type: string;
  external_store_url: string | null;
  sync_status: string;
  last_sync_at: string | null;
  updated_at: string;
};

const BRANCH_LABELS: Record<string, string> = {
  "new-cairo": "التجمع الخامس",
  "downtown": "وسط البلد",
};

const VISIBILITY_LABELS: Record<string, { label: string; tone: "success"|"neutral" }> = {
  leased: { label: "ظاهر", tone: "success" },
  available: { label: "ظاهر — متاح", tone: "success" },
  hidden: { label: "مخفي", tone: "neutral" },
};

const SYNC_TONES: Record<string, "success"|"warning"|"neutral"|"info"|"danger"> = {
  idle: "neutral", queued: "info", running: "info",
  success: "success", error: "danger", disabled: "neutral",
};

const EXT_LABELS: Record<string, string> = {
  none: "—", manual: "يدوي", website: "موقع خارجي",
  shopify: "Shopify", woocommerce: "WooCommerce", other: "أخرى",
};

export default function AdminStoresList() {
  const { loading: authLoading, user, canManageContent } = useRequireContentAccess();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [branchFilter, setBranchFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [lifecycleFilter, setLifecycleFilter] = useState("all");
  const [openingFilter, setOpeningFilter] = useState("all");
  const [visibilityFilter, setVisibilityFilter] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState("all");
  const [extFilter, setExtFilter] = useState("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("stores")
      .select("id, slug, name_ar, display_name, category, branch_context, floor_label, unit_label, unit_code, status, lifecycle_status, featured, opening_status, logo_url, external_store_type, external_store_url, sync_status, last_sync_at, updated_at")
      .order("featured", { ascending: false })
      .order("name_ar", { ascending: true })
      .limit(1000);
    if (error) toast({ title: "تعذّر تحميل المحلات", description: error.message, variant: "destructive" });
    setRows((data as Row[]) ?? []);
    setSelected(new Set());
    setLoading(false);
  };

  useEffect(() => {
    if (!user || !canManageContent) return;
    load();
  }, [user, canManageContent]);

  const categories = useMemo(
    () => Array.from(new Set(rows.map(r => r.category).filter(Boolean) as string[])).sort(),
    [rows]
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (branchFilter !== "all" && (r.branch_context || "") !== branchFilter) return false;
      if (categoryFilter !== "all" && (r.category || "") !== categoryFilter) return false;
      if (lifecycleFilter !== "all" && r.lifecycle_status !== lifecycleFilter) return false;
      if (openingFilter !== "all" && (r.opening_status || "") !== openingFilter) return false;
      if (visibilityFilter !== "all" && r.status !== visibilityFilter) return false;
      if (featuredFilter === "yes" && !r.featured) return false;
      if (featuredFilter === "no" && r.featured) return false;
      if (extFilter !== "all") {
        if (extFilter === "linked" && (!r.external_store_type || r.external_store_type === "none")) return false;
        if (extFilter === "none" && r.external_store_type && r.external_store_type !== "none") return false;
        if (extFilter === "error" && r.sync_status !== "error") return false;
      }
      if (!needle) return true;
      const hay = [r.name_ar, r.display_name, r.slug, r.category, r.unit_label, r.unit_code]
        .filter(Boolean).join(" ").toLowerCase();
      return hay.includes(needle);
    });
  }, [rows, q, branchFilter, categoryFilter, lifecycleFilter, openingFilter, visibilityFilter, featuredFilter, extFilter]);

  const counts = useMemo(() => ({
    total: rows.length,
    active: rows.filter(r => r.lifecycle_status === "active").length,
    pending: rows.filter(r => r.lifecycle_status === "pending").length,
    opening_soon: rows.filter(r => r.lifecycle_status === "opening_soon").length,
    archived: rows.filter(r => r.lifecycle_status === "archived").length,
    errors: rows.filter(r => r.sync_status === "error").length,
  }), [rows]);

  const resetFilters = () => {
    setQ(""); setBranchFilter("all"); setCategoryFilter("all");
    setLifecycleFilter("all"); setOpeningFilter("all"); setVisibilityFilter("all");
    setFeaturedFilter("all"); setExtFilter("all");
  };

  const activeFilterCount =
    [branchFilter, categoryFilter, lifecycleFilter, openingFilter, visibilityFilter, featuredFilter, extFilter]
      .filter(v => v !== "all").length + (q.trim() ? 1 : 0);

  const toggleOne = (id: string) => {
    setSelected(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };
  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(r => r.id)));
  };

  const bulkUpdate = async (patch: Record<string, any>, label: string) => {
    if (selected.size === 0) return;
    setBusy(true);
    const ids = Array.from(selected);
    const { error } = await supabase.from("stores").update(patch as any).in("id", ids);
    setBusy(false);
    if (error) { toast({ title: "تعذّر تنفيذ الإجراء", description: error.message, variant: "destructive" }); return; }
    toast({ title: label, description: `تم تطبيقه على ${ids.length} محل` });
    load();
  };

  const exportCsv = () => {
    const columns: CsvColumn<Row>[] = [
      { header: "id", value: (r) => r.id },
      { header: "slug", value: (r) => r.slug },
      { header: "name_ar", value: (r) => r.name_ar },
      { header: "display_name", value: (r) => r.display_name },
      { header: "category", value: (r) => r.category },
      { header: "branch", value: (r) => BRANCH_LABELS[r.branch_context ?? ""] ?? r.branch_context ?? "" },
      { header: "lifecycle", value: (r) => LIFECYCLE_META[r.lifecycle_status]?.label ?? r.lifecycle_status },
      { header: "visibility", value: (r) => r.status },
      { header: "opening_status", value: (r) => r.opening_status },
      { header: "featured", value: (r) => (r.featured ? "yes" : "no") },
      { header: "floor", value: (r) => r.floor_label },
      { header: "unit", value: (r) => r.unit_label || r.unit_code || "" },
      { header: "external_type", value: (r) => r.external_store_type },
      { header: "external_url", value: (r) => r.external_store_url },
      { header: "sync_status", value: (r) => r.sync_status },
      { header: "last_sync_at", value: (r) => r.last_sync_at },
      { header: "updated_at", value: (r) => r.updated_at },
    ];
    const source = selected.size > 0 ? filtered.filter(r => selected.has(r.id)) : filtered;
    downloadCsv(`stores-${new Date().toISOString().slice(0,10)}.csv`, source, columns);
  };

  const createNew = async () => {
    const slug = `store-${Math.random().toString(36).slice(2, 8)}`;
    const { data, error } = await supabase
      .from("stores")
      .insert({ slug, name_ar: "محل جديد", status: "hidden", lifecycle_status: "draft" } as any)
      .select("id").single();
    if (error) { toast({ title: "تعذّر الإنشاء", description: error.message, variant: "destructive" }); return; }
    window.location.href = `/admin/stores/${data!.id}`;
  };

  if (authLoading) {
    return <div className="min-h-screen bg-background grid place-items-center text-muted-foreground">جاري التحميل...</div>;
  }
  if (!user || !canManageContent) return null;

  const allChecked = filtered.length > 0 && selected.size === filtered.length;

  return (
    <AdminShell>
      <div className="p-6 max-w-7xl mx-auto">
        <AdminPageHeader
          title="إدارة المحلات"
          subtitle="إدارة المستأجرين، دورة الحياة، الواجهات الخارجية، والحالة التشغيلية لكل محل."
          actions={
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={exportCsv} className="gap-1">
                <Download className="w-4 h-4" /> تصدير CSV
              </Button>
              <Button variant="cta" size="sm" onClick={createNew} className="gap-1">
                <Plus className="w-4 h-4" /> محل جديد
              </Button>
            </div>
          }
        />

        {/* Mini stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-5">
          <Pill label="إجمالي" value={counts.total} />
          <Pill label="نشِط" value={counts.active} tone="success" />
          <Pill label="بانتظار المراجعة" value={counts.pending} tone="warning" />
          <Pill label="يُفتتح قريباً" value={counts.opening_soon} tone="info" />
          <Pill label="مؤرشف" value={counts.archived} />
          <Pill label="أخطاء مزامنة" value={counts.errors} tone={counts.errors > 0 ? "danger" : "neutral"} />
        </div>

        {/* Filters */}
        <div className="rounded-xl border border-border bg-card p-3 mb-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q} onChange={(e) => setQ(e.target.value)}
                placeholder="ابحث بالاسم، الـ slug، الفئة، أو رمز الوحدة..."
                className="pr-9"
              />
            </div>
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={resetFilters} className="gap-1 text-xs">
                <X className="w-3.5 h-3.5" /> مسح الفلاتر ({activeFilterCount})
              </Button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
            <Select label="الفرع" value={branchFilter} onChange={setBranchFilter} options={[
              { value: "all", label: "كل الفروع" },
              { value: "new-cairo", label: "التجمع الخامس" },
              { value: "downtown", label: "وسط البلد" },
            ]} />
            <Select label="الفئة" value={categoryFilter} onChange={setCategoryFilter} options={[
              { value: "all", label: "كل الفئات" },
              ...categories.map(c => ({ value: c, label: c })),
            ]} />
            <Select label="دورة الحياة" value={lifecycleFilter} onChange={setLifecycleFilter} options={[
              { value: "all", label: "كل الحالات" },
              ...LIFECYCLE_VALUES.map(v => ({ value: v, label: LIFECYCLE_META[v].label })),
            ]} />
            <Select label="حالة الافتتاح" value={openingFilter} onChange={setOpeningFilter} options={[
              { value: "all", label: "الكل" },
              { value: "open", label: "مفتوح" },
              { value: "opening_soon", label: "يُفتتح قريباً" },
              { value: "closed", label: "مغلق" },
            ]} />
            <Select label="الظهور" value={visibilityFilter} onChange={setVisibilityFilter} options={[
              { value: "all", label: "الكل" },
              { value: "leased", label: "ظاهر" },
              { value: "available", label: "متاح للتأجير" },
              { value: "hidden", label: "مخفي" },
            ]} />
            <Select label="مميز" value={featuredFilter} onChange={setFeaturedFilter} options={[
              { value: "all", label: "الكل" },
              { value: "yes", label: "مميز فقط" },
              { value: "no", label: "غير مميز" },
            ]} />
            <Select label="ربط خارجي" value={extFilter} onChange={setExtFilter} options={[
              { value: "all", label: "الكل" },
              { value: "linked", label: "مرتبط" },
              { value: "none", label: "غير مرتبط" },
              { value: "error", label: "أخطاء مزامنة" },
            ]} />
          </div>
        </div>

        {/* Bulk action bar */}
        {selected.size > 0 && (
          <div className="sticky top-2 z-10 mb-3 rounded-xl border border-primary/30 bg-primary/5 backdrop-blur px-3 py-2 flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-foreground">
              تم تحديد {selected.size} محل
            </span>
            <span className="text-muted-foreground text-xs">— تطبيق إجراء جماعي:</span>
            <div className="flex flex-wrap gap-1.5 ms-auto">
              <BulkBtn onClick={() => bulkUpdate({ lifecycle_status: "active", status: "leased" }, "تم تفعيل المحلات")} disabled={busy}>تفعيل</BulkBtn>
              <BulkBtn onClick={() => bulkUpdate({ lifecycle_status: "opening_soon", opening_status: "opening_soon" }, "تم تحديثها كقادمة قريباً")} disabled={busy}>يُفتتح قريباً</BulkBtn>
              <BulkBtn onClick={() => bulkUpdate({ lifecycle_status: "pending" }, "تم تحويلها للمراجعة")} disabled={busy}>للمراجعة</BulkBtn>
              <BulkBtn onClick={() => bulkUpdate({ lifecycle_status: "inactive", status: "hidden" }, "تم إيقافها مؤقتاً")} disabled={busy}>إيقاف</BulkBtn>
              <BulkBtn onClick={() => bulkUpdate({ lifecycle_status: "archived", status: "hidden", featured: false }, "تم الأرشفة")} disabled={busy} tone="danger">أرشفة</BulkBtn>
              <span className="mx-1 w-px h-5 bg-border self-center" />
              <BulkBtn onClick={() => bulkUpdate({ status: "leased" }, "تم النشر")} disabled={busy}>نشر</BulkBtn>
              <BulkBtn onClick={() => bulkUpdate({ status: "hidden" }, "تم الإخفاء")} disabled={busy}>إخفاء</BulkBtn>
              <BulkBtn onClick={() => bulkUpdate({ featured: true }, "تم تمييزها")} disabled={busy}>تمييز</BulkBtn>
              <BulkBtn onClick={() => bulkUpdate({ featured: false }, "إزالة التمييز")} disabled={busy}>إزالة تمييز</BulkBtn>
              <BulkBtn onClick={() => setSelected(new Set())} disabled={busy}>إلغاء</BulkBtn>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 text-muted-foreground">
                <tr className="text-right">
                  <th className="px-3 py-2 w-10">
                    <Checkbox checked={allChecked} onCheckedChange={toggleAll} aria-label="تحديد الكل" />
                  </th>
                  <th className="px-3 py-2 font-bold">المحل</th>
                  <th className="px-3 py-2 font-bold">الفئة / الفرع</th>
                  <th className="px-3 py-2 font-bold">الموقع</th>
                  <th className="px-3 py-2 font-bold">دورة الحياة</th>
                  <th className="px-3 py-2 font-bold">الظهور</th>
                  <th className="px-3 py-2 font-bold">خارجي</th>
                  <th className="px-3 py-2 font-bold">المزامنة</th>
                  <th className="px-3 py-2 font-bold"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}><td colSpan={9} className="p-2"><Skeleton className="h-9 w-full" /></td></tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={9} className="p-0">
                    <AdminEmptyState icon={StoreIcon} title="لا توجد محلات مطابقة" description="جرّب تعديل الفلاتر أو إنشاء محل جديد." />
                  </td></tr>
                ) : filtered.map((r) => {
                  const lc = LIFECYCLE_META[r.lifecycle_status] ?? LIFECYCLE_META.draft;
                  const vis = VISIBILITY_LABELS[r.status] ?? { label: r.status, tone: "neutral" as const };
                  const isSel = selected.has(r.id);
                  return (
                    <tr key={r.id} className={isSel ? "bg-primary/5" : "hover:bg-secondary/40"}>
                      <td className="px-3 py-2">
                        <Checkbox checked={isSel} onCheckedChange={() => toggleOne(r.id)} aria-label="تحديد" />
                      </td>
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
                      <td className="px-3 py-2 text-muted-foreground">
                        <div>{r.category || "—"}</div>
                        <div className="text-[0.7rem]">{BRANCH_LABELS[r.branch_context ?? ""] ?? "—"}</div>
                      </td>
                      <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">
                        {(r.floor_label || r.unit_label || r.unit_code)
                          ? `${r.floor_label ?? ""} ${r.unit_label || r.unit_code || ""}`.trim()
                          : "—"}
                      </td>
                      <td className="px-3 py-2"><AdminStatusBadge tone={lc.tone}>{lc.label}</AdminStatusBadge></td>
                      <td className="px-3 py-2"><AdminStatusBadge tone={vis.tone}>{vis.label}</AdminStatusBadge></td>
                      <td className="px-3 py-2">
                        {!r.external_store_type || r.external_store_type === "none" ? (
                          <span className="text-muted-foreground text-xs">—</span>
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
                        {!r.external_store_type || r.external_store_type === "none" ? (
                          <span className="text-muted-foreground text-xs">—</span>
                        ) : (
                          <div className="flex items-center gap-1.5 text-[0.72rem]">
                            <AdminStatusBadge tone={SYNC_TONES[r.sync_status] ?? "neutral"}>
                              {r.sync_status === "success" ? <CheckCircle2 className="w-3 h-3" />
                                : r.sync_status === "error" ? <AlertCircle className="w-3 h-3" /> : null}
                              {r.sync_status}
                            </AdminStatusBadge>
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

        {!loading && filtered.length > 0 && (
          <div className="text-xs text-muted-foreground mt-3 text-center">
            عرض {filtered.length} من إجمالي {rows.length} محل
          </div>
        )}
      </div>
    </AdminShell>
  );
}

function Pill({ label, value, tone = "neutral" as "neutral"|"success"|"info"|"warning"|"danger" }: any) {
  const map = {
    neutral: "bg-secondary text-foreground border-border",
    success: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
    info: "bg-primary/10 text-primary border-primary/20",
    warning: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    danger: "bg-red-500/10 text-red-600 border-red-500/20",
  } as const;
  return (
    <div className={`rounded-lg border px-3 py-2 ${map[tone as keyof typeof map]}`}>
      <div className="text-[0.7rem] font-bold opacity-80">{label}</div>
      <div className="text-lg font-bold leading-tight">{value}</div>
    </div>
  );
}

function Select({ label, value, onChange, options }: { label?: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <label className="relative block">
      {label && <span className="block text-[0.65rem] font-bold text-muted-foreground mb-1">{label}</span>}
      <select
        value={value} onChange={(e) => onChange(e.target.value)}
        className="h-9 w-full appearance-none rounded-md border border-input bg-background ps-3 pe-7 text-xs font-bold text-foreground cursor-pointer"
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <ChevronDown className="w-3.5 h-3.5 absolute end-2 bottom-2.5 text-muted-foreground pointer-events-none" />
    </label>
  );
}

function BulkBtn({ children, onClick, disabled, tone }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; tone?: "danger" }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`h-8 px-3 rounded-md text-xs font-bold border transition-colors disabled:opacity-50 ${
        tone === "danger"
          ? "border-red-500/30 text-red-600 hover:bg-red-500/10"
          : "border-border bg-background hover:bg-secondary text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
