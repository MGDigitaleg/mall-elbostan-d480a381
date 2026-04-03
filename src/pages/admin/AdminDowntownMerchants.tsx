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
import { ArrowRight, Plus, Pencil, Trash2, Search, ShieldCheck, ExternalLink, AlertCircle, Archive, HelpCircle } from "lucide-react";

const VERIFICATION_STATUSES = [
  { value: "Verified", label: "موثّق", icon: ShieldCheck },
  { value: "Official source linked", label: "مصدر رسمي", icon: ExternalLink },
  { value: "Needs review", label: "قيد المراجعة", icon: AlertCircle },
  { value: "Archived / inactive", label: "غير نشط", icon: Archive },
  { value: "Unknown status", label: "غير محدد", icon: HelpCircle },
];

const FIELDS: { key: string; label: string; type?: string; group: string }[] = [
  // Basic Info
  { key: "name_ar", label: "الاسم بالعربية", group: "basic" },
  { key: "name_en", label: "الاسم بالإنجليزية", group: "basic" },
  { key: "slug", label: "الرابط (slug)", group: "basic" },
  { key: "category", label: "التصنيف الرئيسي", group: "basic" },
  { key: "category_secondary", label: "التصنيف الثانوي", group: "basic" },
  { key: "branch", label: "الفرع (downtown/new_cairo)", group: "basic" },
  { key: "floor", label: "الدور", group: "basic" },
  { key: "unit_number", label: "رقم الوحدة", group: "basic" },
  // Content
  { key: "summary_ar", label: "نبذة بالعربية", type: "textarea", group: "content" },
  { key: "summary_en", label: "نبذة بالإنجليزية", type: "textarea", group: "content" },
  { key: "products_services_ar", label: "المنتجات/الخدمات عربي", type: "textarea", group: "content" },
  { key: "products_services_en", label: "المنتجات/الخدمات إنجليزي", type: "textarea", group: "content" },
  // Contact
  { key: "phone", label: "الهاتف", group: "contact" },
  { key: "whatsapp", label: "واتساب", group: "contact" },
  { key: "email", label: "البريد الإلكتروني", group: "contact" },
  { key: "website", label: "الموقع الإلكتروني", group: "contact" },
  { key: "address", label: "العنوان بالعربية", group: "contact" },
  { key: "address_en", label: "العنوان بالإنجليزية", group: "contact" },
  // Social
  { key: "facebook_url", label: "فيسبوك", group: "social" },
  { key: "instagram_url", label: "انستجرام", group: "social" },
  { key: "tiktok_url", label: "تيك توك", group: "social" },
  { key: "google_maps_url", label: "خرائط جوجل", group: "social" },
  // Media
  { key: "logo_url", label: "رابط الشعار", group: "media" },
  { key: "cover_image_url", label: "صورة الغلاف", group: "media" },
  // Verification
  { key: "verification_status", label: "حالة التوثيق", group: "verification" },
  { key: "verification_notes", label: "ملاحظات التوثيق", type: "textarea", group: "verification" },
  { key: "source_1_label", label: "مصدر ١ — العنوان", group: "verification" },
  { key: "source_1_url", label: "مصدر ١ — الرابط", group: "verification" },
  { key: "source_2_label", label: "مصدر ٢ — العنوان", group: "verification" },
  { key: "source_2_url", label: "مصدر ٢ — الرابط", group: "verification" },
  { key: "source_3_label", label: "مصدر ٣ — العنوان", group: "verification" },
  { key: "source_3_url", label: "مصدر ٣ — الرابط", group: "verification" },
  // SEO
  { key: "seo_title_ar", label: "عنوان SEO عربي", group: "seo" },
  { key: "seo_meta_description_ar", label: "وصف SEO عربي", type: "textarea", group: "seo" },
  { key: "seo_title_en", label: "عنوان SEO إنجليزي", group: "seo" },
  { key: "seo_meta_description_en", label: "وصف SEO إنجليزي", type: "textarea", group: "seo" },
  { key: "keywords_ar", label: "كلمات مفتاحية عربية", group: "seo" },
  { key: "keywords_en", label: "كلمات مفتاحية إنجليزية", group: "seo" },
  // Flags
  { key: "is_active", label: "نشط (true/false)", group: "flags" },
  { key: "is_marketplace_enabled", label: "مفعّل في السوق (true/false)", group: "flags" },
  { key: "sort_order", label: "الترتيب", type: "number", group: "flags" },
];

const GROUPS: { key: string; label: string }[] = [
  { key: "basic", label: "البيانات الأساسية" },
  { key: "content", label: "المحتوى" },
  { key: "contact", label: "التواصل" },
  { key: "social", label: "الروابط الاجتماعية" },
  { key: "media", label: "الوسائط" },
  { key: "verification", label: "التوثيق" },
  { key: "seo", label: "تحسين محركات البحث" },
  { key: "flags", label: "الإعدادات" },
];

export default function AdminDowntownMerchants() {
  const { loading: authLoading } = useRequireAdmin();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const { data: items, isLoading } = useQuery({
    queryKey: ["admin-downtown-merchants"],
    queryFn: async () => {
      const { data } = await supabase.from("downtown_merchants").select("*").order("sort_order");
      return data ?? [];
    },
  });

  const filtered = useMemo(() => {
    if (!items) return [];
    return items.filter((m) => {
      const matchSearch = !search || m.name_ar.includes(search) || (m.name_en && m.name_en.toLowerCase().includes(search.toLowerCase()));
      const matchStatus = filterStatus === "all" || m.verification_status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [items, search, filterStatus]);

  const saveMutation = useMutation({
    mutationFn: async (data: Record<string, string>) => {
      const cleanData: Record<string, unknown> = {};
      FIELDS.forEach((f) => {
        const val = data[f.key];
        if (f.key === "is_active" || f.key === "is_marketplace_enabled") cleanData[f.key] = val === "true";
        else if (f.type === "number") cleanData[f.key] = val ? Number(val) : null;
        else cleanData[f.key] = val || null;
      });
      if (editId) {
        const { error } = await supabase.from("downtown_merchants").update(cleanData).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("downtown_merchants").insert(cleanData as never);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-downtown-merchants"] });
      setShowForm(false);
      setEditId(null);
      setFormData({});
      toast({ title: "تم الحفظ بنجاح" });
    },
    onError: () => toast({ title: "خطأ", description: "حدث خطأ أثناء الحفظ", variant: "destructive" }),
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

  const openEdit = (item: Record<string, unknown>) => {
    setEditId(item.id as string);
    const data: Record<string, string> = {};
    FIELDS.forEach((f) => { data[f.key] = String(item[f.key] ?? ""); });
    setFormData(data);
    setShowForm(true);
  };

  if (authLoading) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="glass sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="text-primary hover:underline"><ArrowRight className="w-5 h-5" /></Link>
            <h1 className="text-lg font-bold text-foreground">دليل محلات وسط البلد</h1>
            <Badge variant="secondary" className="text-[0.65rem]">{items?.length ?? 0} محل</Badge>
          </div>
          <Button variant="cta" size="sm" onClick={() => { setEditId(null); setFormData({ branch: "downtown", verification_status: "Unknown status", is_active: "true", is_marketplace_enabled: "false" }); setShowForm(true); }}>
            <Plus className="w-4 h-4 ml-1" /> إضافة
          </Button>
        </div>
      </header>

      <main className="container py-6">
        {/* Filters */}
        <div className="mb-4 flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="بحث..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-10 pr-10 bg-card" />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-10 rounded-md border border-input bg-card px-3 text-sm"
          >
            <option value="all">كل الحالات</option>
            {VERIFICATION_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {isLoading ? <p className="text-muted-foreground">جاري التحميل...</p> : (
          <div className="space-y-2">
            {filtered.map((item) => {
              const vs = VERIFICATION_STATUSES.find(v => v.value === item.verification_status);
              return (
                <div key={item.id} className="card-premium p-4 flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground text-[0.88rem]">{item.name_ar}</span>
                      {vs && <Badge variant="outline" className="text-[0.55rem]">{vs.label}</Badge>}
                      {!item.is_active && <Badge variant="destructive" className="text-[0.55rem]">غير نشط</Badge>}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-[0.72rem] text-muted-foreground">
                      {item.name_en && <span className="font-poppins">{item.name_en}</span>}
                      {item.category && <span>{item.category}</span>}
                      {item.phone && <span>{item.phone}</span>}
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(item as unknown as Record<string, unknown>)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => { if (confirm("حذف هذا المحل؟")) deleteMutation.mutate(item.id); }}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && <p className="text-muted-foreground text-center py-8">لا توجد نتائج</p>}
          </div>
        )}
      </main>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-card border-border max-h-[85vh] overflow-y-auto max-w-2xl">
          <DialogHeader><DialogTitle>{editId ? "تعديل" : "إضافة"} محل</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(formData); }} className="space-y-6">
            {GROUPS.map((group) => {
              const groupFields = FIELDS.filter(f => f.group === group.key);
              return (
                <div key={group.key}>
                  <h3 className="text-[0.82rem] font-bold text-foreground mb-2 border-b border-border pb-1">{group.label}</h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {groupFields.map((field) => (
                      <div key={field.key} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
                        <label className="text-[0.72rem] text-muted-foreground mb-0.5 block">{field.label}</label>
                        {field.type === "textarea" ? (
                          <Textarea value={formData[field.key] ?? ""} onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })} className="bg-secondary border-border text-sm" rows={2} />
                        ) : field.key === "verification_status" ? (
                          <select
                            value={formData[field.key] ?? "Unknown status"}
                            onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                            className="w-full h-10 rounded-md border border-input bg-secondary px-3 text-sm"
                          >
                            {VERIFICATION_STATUSES.map((s) => (
                              <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                          </select>
                        ) : (
                          <Input
                            value={formData[field.key] ?? ""}
                            onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                            className="bg-secondary border-border text-sm"
                            type={field.type === "number" ? "number" : "text"}
                            dir={field.key.includes("url") || field.key.includes("email") || field.key.includes("phone") || field.key.includes("slug") || field.key === "branch" ? "ltr" : "rtl"}
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
