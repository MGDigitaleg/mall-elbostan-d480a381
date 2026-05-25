import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useRequireAdmin } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { ArrowRight, Plus, Pencil, Trash2, Search, Download, ShieldCheck, Sparkles } from "lucide-react";
import { downloadCsv } from "@/lib/csvExport";
import {
  VERIFICATION_STATUSES, CURRENT_STATUS_OPTIONS, STORE_CATEGORIES,
  type VerificationStatus,
} from "@/lib/downtownVerification";
import { DowntownVerificationDashboard, type Merchant } from "@/components/admin/DowntownVerificationDashboard";
import { DowntownCsvImporter } from "@/components/admin/DowntownCsvImporter";

const FIELDS: { key: string; label: string; type?: string; group: string }[] = [
  { key: "name_ar", label: "الاسم بالعربية", group: "basic" },
  { key: "name_en", label: "الاسم بالإنجليزية", group: "basic" },
  { key: "slug", label: "الرابط (slug)", group: "basic" },
  { key: "category", label: "التصنيف", group: "basic" },
  { key: "tech_related", label: "تقني؟ (true/false)", group: "basic" },
  { key: "floor_unit_location", label: "الموقع داخل المول", group: "basic" },
  { key: "detailed_specialisation", label: "التخصص التفصيلي", type: "textarea", group: "content" },
  { key: "products_services", label: "المنتجات/الخدمات", type: "textarea", group: "content" },
  { key: "summary_ar", label: "وصف عربي", type: "textarea", group: "content" },
  { key: "summary_en", label: "وصف إنجليزي", type: "textarea", group: "content" },
  { key: "opening_hours", label: "ساعات العمل", group: "contact" },
  { key: "phone", label: "هاتف", group: "contact" },
  { key: "whatsapp", label: "واتساب", group: "contact" },
  { key: "email", label: "البريد", group: "contact" },
  { key: "website", label: "الموقع", group: "contact" },
  { key: "facebook_url", label: "فيسبوك", group: "social" },
  { key: "instagram_url", label: "انستجرام", group: "social" },
  { key: "tiktok_url", label: "تيك توك", group: "social" },
  { key: "google_maps_url", label: "خرائط جوجل", group: "social" },
  { key: "logo_url", label: "الشعار", group: "media" },
  { key: "verification_status", label: "حالة التوثيق", group: "verification" },
  { key: "current_status", label: "الوضع الحالي", group: "verification" },
  { key: "confidence_score", label: "درجة الثقة (1-5)", type: "number", group: "verification" },
  { key: "evidence_summary", label: "ملخص الأدلة", type: "textarea", group: "verification" },
  { key: "source_1_url", label: "مصدر ١", group: "verification" },
  { key: "source_2_url", label: "مصدر ٢", group: "verification" },
  { key: "source_3_url", label: "مصدر ٣", group: "verification" },
  { key: "last_evidence_date", label: "تاريخ آخر دليل", group: "verification" },
  { key: "last_manual_check_date", label: "تاريخ آخر تأكيد يدوي", type: "date", group: "verification" },
  { key: "notes_for_website_team", label: "ملاحظات لفريق الموقع", type: "textarea", group: "verification" },
  { key: "missing_data", label: "بيانات ناقصة", type: "textarea", group: "verification" },
  { key: "show_verified_publicly", label: "إظهار شارة موثّق علناً (true/false)", group: "publishing" },
  { key: "is_active", label: "نشط (true/false)", group: "publishing" },
];

const GROUPS = [
  { key: "basic", label: "الأساسي" },
  { key: "content", label: "المحتوى" },
  { key: "contact", label: "التواصل" },
  { key: "social", label: "روابط اجتماعية" },
  { key: "media", label: "الوسائط" },
  { key: "verification", label: "التحقق والأدلة" },
  { key: "publishing", label: "النشر" },
];

const BOOL_KEYS = new Set(["tech_related", "show_verified_publicly", "is_active"]);

type Tab = "dashboard" | "directory" | "import";

export default function AdminDowntownMerchants() {
  const { loading: authLoading } = useRequireAdmin();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("dashboard");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterTech, setFilterTech] = useState<"all" | "yes" | "no">("all");

  const { data: items, isLoading } = useQuery({
    queryKey: ["admin-downtown-merchants"],
    queryFn: async () => {
      const { data } = await supabase.from("downtown_merchants").select("*").order("sort_order").order("name_ar");
      return (data ?? []) as Merchant[];
    },
  });

  const filtered = useMemo(() => {
    if (!items) return [];
    return items.filter((m) => {
      const matchSearch = !search
        || m.name_ar.includes(search)
        || (m.name_en && m.name_en.toLowerCase().includes(search.toLowerCase()))
        || (m.category && m.category.toLowerCase().includes(search.toLowerCase()));
      const matchStatus = filterStatus === "all" || m.verification_status === filterStatus;
      const matchTech = filterTech === "all" || (filterTech === "yes" ? !!m.tech_related : m.tech_related === false);
      return matchSearch && matchStatus && matchTech;
    });
  }, [items, search, filterStatus, filterTech]);

  const saveMutation = useMutation({
    mutationFn: async (data: Record<string, string>) => {
      const clean: Record<string, unknown> = {};
      FIELDS.forEach((f) => {
        const v = data[f.key];
        if (BOOL_KEYS.has(f.key)) clean[f.key] = v === "true";
        else if (f.type === "number") clean[f.key] = v ? Number(v) : null;
        else if (f.type === "date") clean[f.key] = v || null;
        else clean[f.key] = v || null;
      });
      if (editId) {
        const { error } = await supabase.from("downtown_merchants").update(clean as never).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("downtown_merchants").insert(clean as never);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-downtown-merchants"] });
      setShowForm(false); setEditId(null); setFormData({});
      toast({ title: "تم الحفظ" });
    },
    onError: (e: unknown) => toast({ title: "خطأ", description: e instanceof Error ? e.message : "", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("downtown_merchants").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-downtown-merchants"] });
      toast({ title: "تم الحذف" });
    },
  });

  const quickStatusUpdate = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("downtown_merchants").update({ verification_status: status } as never).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-downtown-merchants"] }),
  });

  const markManuallyVerified = useMutation({
    mutationFn: async (id: string) => {
      const today = new Date().toISOString().slice(0, 10);
      const { error } = await supabase.from("downtown_merchants")
        .update({
          confirmed_by_team_at: new Date().toISOString(),
          last_manual_check_date: today,
        } as never)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-downtown-merchants"] });
      toast({ title: "تم تأكيد المراجعة اليدوية" });
    },
  });

  const openEdit = (item: Merchant) => {
    setEditId(item.id);
    const data: Record<string, string> = {};
    FIELDS.forEach((f) => { data[f.key] = item[f.key] == null ? "" : String(item[f.key]); });
    setFormData(data);
    setShowForm(true);
  };

  const exportCsv = () => {
    if (!filtered.length) return;
    downloadCsv("downtown-directory", filtered, [
      { header: "Name AR", value: r => r.name_ar },
      { header: "Name EN", value: r => r.name_en ?? "" },
      { header: "Category", value: r => r.category ?? "" },
      { header: "Tech", value: r => r.tech_related ? "Yes" : r.tech_related === false ? "No" : "" },
      { header: "Floor/Unit", value: r => (r.floor_unit_location as string) ?? "" },
      { header: "Phone", value: r => (r.phone as string) ?? "" },
      { header: "Verification Status", value: r => r.verification_status ?? "" },
      { header: "Current Status", value: r => r.current_status ?? "" },
      { header: "Confidence", value: r => r.confidence_score ?? "" },
      { header: "Show Verified Public", value: r => r.show_verified_publicly ? "Yes" : "No" },
      { header: "Last Manual Check", value: r => r.last_manual_check_date ?? "" },
    ]);
  };

  if (authLoading) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="glass sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="text-primary hover:underline"><ArrowRight className="w-5 h-5" /></Link>
            <h1 className="text-lg font-bold text-foreground">دليل وسط البلد — التحقق والإدارة</h1>
            <Badge variant="secondary" className="text-[0.65rem]">{items?.length ?? 0} محل</Badge>
          </div>
          <Button variant="cta" size="sm" onClick={() => {
            setEditId(null);
            setFormData({ branch: "downtown", verification_status: "UNREVIEWED_LISTED_ONLY", show_verified_publicly: "false", is_active: "true" });
            setShowForm(true);
          }}>
            <Plus className="w-4 h-4 ml-1" /> إضافة محل
          </Button>
        </div>
      </header>

      <main className="container py-5 space-y-4">
        {/* Tabs */}
        <div className="flex gap-1 border-b border-border">
          {([
            { id: "dashboard", label: "لوحة التحكم" },
            { id: "directory", label: "الدليل" },
            { id: "import", label: "استيراد" },
          ] as { id: Tab; label: string }[]).map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 text-[0.82rem] font-medium border-b-2 transition-colors ${
                tab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "dashboard" && (
          isLoading
            ? <p className="text-muted-foreground">جاري التحميل...</p>
            : <DowntownVerificationDashboard
                merchants={items ?? []}
                onJump={(f) => {
                  setTab("directory");
                  if (f.status) setFilterStatus(f.status);
                  if (f.tech) setFilterTech("yes");
                }}
              />
        )}

        {tab === "import" && <DowntownCsvImporter />}

        {tab === "directory" && (
          <>
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="بحث..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-10 pr-10 bg-card" />
              </div>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="h-10 rounded-md border border-input bg-card px-3 text-sm">
                <option value="all">كل الحالات</option>
                {VERIFICATION_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              <select value={filterTech} onChange={(e) => setFilterTech(e.target.value as "all" | "yes" | "no")} className="h-10 rounded-md border border-input bg-card px-3 text-sm">
                <option value="all">تقنية: الكل</option>
                <option value="yes">تقنية: نعم</option>
                <option value="no">تقنية: لا</option>
              </select>
              <Button variant="outline" size="sm" onClick={exportCsv} className="h-10 text-[0.78rem]">
                <Download className="ml-1 h-4 w-4" /> تصدير CSV
              </Button>
            </div>

            {isLoading ? <p className="text-muted-foreground">جاري التحميل...</p> : (
              <div className="space-y-2">
                {filtered.map((item) => {
                  const vs = VERIFICATION_STATUSES.find(v => v.value === item.verification_status);
                  return (
                    <div key={item.id} className="card-premium p-3 flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-foreground text-[0.85rem]">{item.name_ar}</span>
                          {item.name_en && <span className="text-[0.7rem] text-muted-foreground font-poppins">{item.name_en}</span>}
                          {vs && <Badge variant="outline" className="text-[0.55rem]">{vs.label}</Badge>}
                          {item.tech_related && <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[0.55rem]">تقني</Badge>}
                          {item.show_verified_publicly && (item.last_manual_check_date || item.confirmed_by_team_at) && (
                            <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-[0.55rem]">
                              <ShieldCheck className="ml-0.5 h-2.5 w-2.5" /> عام
                            </Badge>
                          )}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-[0.7rem] text-muted-foreground">
                          {item.category && <span>{item.category}</span>}
                          {item.confidence_score != null && <span>ثقة {item.confidence_score}/5</span>}
                          {item.phone && <span>{item.phone as string}</span>}
                          {item.current_status && <span>· {item.current_status}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <select
                          value={item.verification_status ?? ""}
                          onChange={(e) => quickStatusUpdate.mutate({ id: item.id, status: e.target.value })}
                          className="h-8 rounded-md border border-input bg-card px-2 text-[0.7rem]"
                        >
                          {VERIFICATION_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                        <Button variant="ghost" size="icon" title="تأكيد يدوي" onClick={() => markManuallyVerified.mutate(item.id)}>
                          <Sparkles className="w-4 h-4 text-success" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openEdit(item)}><Pencil className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => { if (confirm("حذف هذا المحل؟")) deleteMutation.mutate(item.id); }}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                      </div>
                    </div>
                  );
                })}
                {filtered.length === 0 && <p className="text-muted-foreground text-center py-8">لا توجد نتائج</p>}
              </div>
            )}
          </>
        )}
      </main>

      {/* Editor dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-card border-border max-h-[85vh] overflow-y-auto max-w-3xl">
          <DialogHeader><DialogTitle>{editId ? "تعديل" : "إضافة"} محل</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(formData); }} className="space-y-5">
            {GROUPS.map((g) => {
              const fields = FIELDS.filter(f => f.group === g.key);
              return (
                <div key={g.key}>
                  <h3 className="text-[0.82rem] font-bold text-foreground mb-2 border-b border-border pb-1">{g.label}</h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {fields.map((f) => (
                      <div key={f.key} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
                        <label className="text-[0.7rem] text-muted-foreground mb-0.5 block">{f.label}</label>
                        {f.type === "textarea" ? (
                          <Textarea value={formData[f.key] ?? ""} onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })} className="bg-secondary text-sm" rows={2} />
                        ) : f.key === "verification_status" ? (
                          <select value={formData[f.key] ?? ""} onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                            className="w-full h-10 rounded-md border border-input bg-secondary px-3 text-sm">
                            {VERIFICATION_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                          </select>
                        ) : f.key === "current_status" ? (
                          <select value={formData[f.key] ?? ""} onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                            className="w-full h-10 rounded-md border border-input bg-secondary px-3 text-sm">
                            <option value="">—</option>
                            {CURRENT_STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                          </select>
                        ) : f.key === "category" ? (
                          <select value={formData[f.key] ?? ""} onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                            className="w-full h-10 rounded-md border border-input bg-secondary px-3 text-sm">
                            <option value="">—</option>
                            {STORE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        ) : (
                          <Input
                            value={formData[f.key] ?? ""}
                            onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                            className="bg-secondary text-sm"
                            type={f.type ?? "text"}
                            dir={f.key.includes("url") || f.key.includes("email") || f.key === "phone" || f.key === "whatsapp" || f.key === "slug" ? "ltr" : "rtl"}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            <Button type="submit" variant="cta" className="w-full" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "جاري الحفظ..." : "حفظ"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
