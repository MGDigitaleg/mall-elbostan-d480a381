import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useRequireContentAccess } from "@/hooks/useAuth";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminPageHeader, AdminStatusBadge, AdminSectionCard, AdminEmptyState } from "@/components/admin/AdminPrimitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import {
  ArrowRight, Save, ExternalLink, Trash2, RefreshCw, Store as StoreIcon,
  ShoppingBag, Tag, Bell, MapPin, Link2, Info,
} from "lucide-react";

type Store = any;

const EXT_TYPES = [
  { value: "none", label: "بدون متجر خارجي" },
  { value: "manual", label: "إدارة يدوية (المحتوى من لوحة التحكم)" },
  { value: "website", label: "موقع خارجي للعرض فقط" },
  { value: "shopify", label: "Shopify" },
  { value: "woocommerce", label: "WooCommerce" },
  { value: "other", label: "أخرى" },
];

const STATUSES = [
  { value: "leased", label: "مؤجّر" },
  { value: "available", label: "متاح للتأجير" },
  { value: "hidden", label: "مخفي" },
];

export default function AdminStoreDetail() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const { loading: authLoading, user, canManageContent, isAdmin } = useRequireContentAccess();
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [counts, setCounts] = useState({ products: 0, deals: 0, social: 0 });

  useEffect(() => {
    if (!user || !canManageContent || !id) return;
    let cancelled = false;
    (async () => {
      const [storeRes, prodC, dealC, socialC] = await Promise.all([
        supabase.from("stores").select("*").eq("id", id).maybeSingle(),
        supabase.from("products").select("id", { count: "exact", head: true }).eq("store_id", id),
        supabase.from("deals").select("id", { count: "exact", head: true }).eq("store_id", id),
        supabase.from("social_offer_intake").select("id", { count: "exact", head: true }).eq("store_id", id),
      ]);
      if (cancelled) return;
      if (storeRes.error || !storeRes.data) {
        toast({ title: "لم يتم العثور على المحل", variant: "destructive" });
        nav("/admin/stores");
        return;
      }
      setStore(storeRes.data);
      setCounts({ products: prodC.count ?? 0, deals: dealC.count ?? 0, social: socialC.count ?? 0 });
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [id, user, canManageContent, nav]);

  const update = (patch: Partial<Store>) => setStore((s: any) => ({ ...s, ...patch }));

  const save = async () => {
    if (!store) return;
    setSaving(true);
    const patch = {
      name_ar: store.name_ar, name_en: store.name_en, display_name: store.display_name,
      slug: store.slug, category: store.category, status: store.status, featured: store.featured,
      opening_status: store.opening_status, floor_label: store.floor_label, unit_label: store.unit_label,
      unit_code: store.unit_code, short_description_ar: store.short_description_ar,
      long_description_ar: store.long_description_ar, logo_url: store.logo_url,
      cover_image_url: store.cover_image_url, phone: store.phone, whatsapp: store.whatsapp,
      email: store.email, website: store.website, opening_hours: store.opening_hours,
      admin_notes: store.admin_notes,
      external_store_type: store.external_store_type, external_store_url: store.external_store_url,
      external_store_handle: store.external_store_handle,
      sync_mode: store.sync_mode, import_products: store.import_products, import_offers: store.import_offers,
    };
    const { error } = await supabase.from("stores").update(patch).eq("id", store.id);
    setSaving(false);
    if (error) toast({ title: "تعذّر الحفظ", description: error.message, variant: "destructive" });
    else toast({ title: "تم الحفظ" });
  };

  const remove = async () => {
    if (!store || !isAdmin) return;
    if (!confirm(`حذف المحل "${store.name_ar}" نهائياً؟ سيتم حذف المنتجات والعروض المرتبطة.`)) return;
    const { error } = await supabase.from("stores").delete().eq("id", store.id);
    if (error) { toast({ title: "تعذّر الحذف", description: error.message, variant: "destructive" }); return; }
    toast({ title: "تم الحذف" });
    nav("/admin/stores");
  };

  if (authLoading || loading || !store) {
    return (
      <AdminShell>
        <div className="p-6 max-w-6xl mx-auto space-y-4">
          <Skeleton className="h-10 w-60" />
          <Skeleton className="h-72 w-full" />
        </div>
      </AdminShell>
    );
  }
  if (!user || !canManageContent) return null;

  return (
    <AdminShell>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-3">
          <Link to="/admin/stores" className="text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1">
            <ArrowRight className="w-3 h-3 rotate-180" /> العودة لكل المحلات
          </Link>
        </div>
        <AdminPageHeader
          title={store.display_name || store.name_ar || "محل بدون اسم"}
          subtitle={store.slug}
          actions={
            <div className="flex flex-wrap gap-2">
              <Link to={`/stores/${store.slug}`} target="_blank">
                <Button variant="outline" size="sm" className="gap-1"><ExternalLink className="w-4 h-4" /> معاينة</Button>
              </Link>
              {isAdmin && (
                <Button variant="outline" size="sm" onClick={remove} className="gap-1 text-red-600 hover:text-red-600">
                  <Trash2 className="w-4 h-4" /> حذف
                </Button>
              )}
              <Button variant="cta" size="sm" onClick={save} disabled={saving} className="gap-1">
                <Save className="w-4 h-4" /> {saving ? "جاري الحفظ..." : "حفظ"}
              </Button>
            </div>
          }
        />

        <Tabs defaultValue="identity" className="w-full">
          <TabsList className="bg-secondary/60 mb-4 flex flex-wrap h-auto">
            <TabsTrigger value="identity"><StoreIcon className="w-4 h-4 ml-1" /> الهوية</TabsTrigger>
            <TabsTrigger value="location"><MapPin className="w-4 h-4 ml-1" /> الموقع</TabsTrigger>
            <TabsTrigger value="external"><Link2 className="w-4 h-4 ml-1" /> المتجر الخارجي</TabsTrigger>
            <TabsTrigger value="products"><ShoppingBag className="w-4 h-4 ml-1" /> المنتجات ({counts.products})</TabsTrigger>
            <TabsTrigger value="offers"><Tag className="w-4 h-4 ml-1" /> العروض ({counts.deals})</TabsTrigger>
            <TabsTrigger value="social"><Bell className="w-4 h-4 ml-1" /> سوشيال ({counts.social})</TabsTrigger>
            <TabsTrigger value="notes"><Info className="w-4 h-4 ml-1" /> ملاحظات داخلية</TabsTrigger>
          </TabsList>

          {/* IDENTITY */}
          <TabsContent value="identity">
            <AdminSectionCard title="الهوية والظهور">
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="الاسم بالعربية"><Input value={store.name_ar ?? ""} onChange={(e) => update({ name_ar: e.target.value })} /></Field>
                <Field label="الاسم بالإنجليزية"><Input value={store.name_en ?? ""} onChange={(e) => update({ name_en: e.target.value })} /></Field>
                <Field label="الاسم المعروض (اختياري)"><Input value={store.display_name ?? ""} onChange={(e) => update({ display_name: e.target.value })} placeholder="مثال: نايك" /></Field>
                <Field label="الرابط (slug)"><Input value={store.slug ?? ""} onChange={(e) => update({ slug: e.target.value })} /></Field>
                <Field label="الفئة"><Input value={store.category ?? ""} onChange={(e) => update({ category: e.target.value })} /></Field>
                <Field label="الحالة">
                  <select value={store.status} onChange={(e) => update({ status: e.target.value })}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                    {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </Field>
                <Field label="حالة الافتتاح">
                  <select value={store.opening_status ?? ""} onChange={(e) => update({ opening_status: e.target.value || null })}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                    <option value="">—</option>
                    <option value="open">مفتوح</option>
                    <option value="opening_soon">يُفتتح قريباً</option>
                    <option value="closed">مغلق</option>
                  </select>
                </Field>
                <Field label="رابط الشعار"><Input value={store.logo_url ?? ""} onChange={(e) => update({ logo_url: e.target.value })} /></Field>
                <Field label="رابط صورة الغلاف"><Input value={store.cover_image_url ?? ""} onChange={(e) => update({ cover_image_url: e.target.value })} /></Field>
                <Field label="مميز" inline>
                  <Switch checked={!!store.featured} onCheckedChange={(v) => update({ featured: v })} />
                </Field>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <Field label="وصف قصير عربي"><Textarea rows={3} value={store.short_description_ar ?? ""} onChange={(e) => update({ short_description_ar: e.target.value })} /></Field>
                <Field label="وصف تفصيلي عربي"><Textarea rows={3} value={store.long_description_ar ?? ""} onChange={(e) => update({ long_description_ar: e.target.value })} /></Field>
                <Field label="الهاتف"><Input value={store.phone ?? ""} onChange={(e) => update({ phone: e.target.value })} /></Field>
                <Field label="واتساب"><Input value={store.whatsapp ?? ""} onChange={(e) => update({ whatsapp: e.target.value })} /></Field>
                <Field label="البريد"><Input value={store.email ?? ""} onChange={(e) => update({ email: e.target.value })} /></Field>
                <Field label="الموقع الإلكتروني"><Input value={store.website ?? ""} onChange={(e) => update({ website: e.target.value })} /></Field>
                <Field label="ساعات العمل"><Input value={store.opening_hours ?? ""} onChange={(e) => update({ opening_hours: e.target.value })} /></Field>
              </div>
            </AdminSectionCard>
          </TabsContent>

          {/* LOCATION */}
          <TabsContent value="location">
            <AdminSectionCard title="الموقع داخل المول">
              <div className="grid md:grid-cols-3 gap-4">
                <Field label="الطابق (نص للعرض)"><Input value={store.floor_label ?? ""} onChange={(e) => update({ floor_label: e.target.value })} placeholder="مثال: الطابق الأرضي" /></Field>
                <Field label="رقم/اسم الوحدة"><Input value={store.unit_label ?? ""} onChange={(e) => update({ unit_label: e.target.value })} placeholder="مثال: G-12" /></Field>
                <Field label="رمز الوحدة (داخلي)"><Input value={store.unit_code ?? ""} onChange={(e) => update({ unit_code: e.target.value })} /></Field>
                <Field label="الفرع">
                  <select value={store.branch_context ?? ""} onChange={(e) => update({ branch_context: e.target.value || null })}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                    <option value="">—</option>
                    <option value="new-cairo">التجمع الخامس</option>
                    <option value="downtown">وسط البلد</option>
                  </select>
                </Field>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                لتعديل إحداثيات الخريطة التفاعلية، استخدم محرر الخريطة في صفحة الوحدات.
              </p>
            </AdminSectionCard>
          </TabsContent>

          {/* EXTERNAL STORE */}
          <TabsContent value="external">
            <AdminSectionCard title="ربط متجر خارجي">
              <p className="text-sm text-muted-foreground mb-4">
                اربط متجر التاجر الخارجي (Shopify / WooCommerce / موقع) ليظهر للزوار، مع إمكانية تفعيل المزامنة لاحقاً.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="نوع المتجر الخارجي">
                  <select value={store.external_store_type} onChange={(e) => update({ external_store_type: e.target.value })}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                    {EXT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </Field>
                <Field label="رابط المتجر"><Input value={store.external_store_url ?? ""} onChange={(e) => update({ external_store_url: e.target.value })} placeholder="https://..." disabled={store.external_store_type === "none"} /></Field>
                <Field label="معرّف/Handle">
                  <Input value={store.external_store_handle ?? ""} onChange={(e) => update({ external_store_handle: e.target.value })}
                    placeholder="my-store.myshopify.com" disabled={store.external_store_type === "none"} />
                </Field>
                <Field label="وضع المزامنة">
                  <select value={store.sync_mode} onChange={(e) => update({ sync_mode: e.target.value })}
                    disabled={store.external_store_type === "none"}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                    <option value="manual">يدوي</option>
                    <option value="scheduled">دوري</option>
                    <option value="webhook">Webhook</option>
                  </select>
                </Field>
                <Field label="استيراد المنتجات" inline>
                  <Switch checked={!!store.import_products} disabled={store.external_store_type === "none"} onCheckedChange={(v) => update({ import_products: v })} />
                </Field>
                <Field label="استيراد العروض" inline>
                  <Switch checked={!!store.import_offers} disabled={store.external_store_type === "none"} onCheckedChange={(v) => update({ import_offers: v })} />
                </Field>
              </div>

              <div className="mt-5 rounded-lg border border-border bg-secondary/40 p-3 flex items-center justify-between gap-3">
                <div className="text-sm">
                  <div className="font-bold text-foreground">حالة المزامنة:&nbsp;
                    <AdminStatusBadge tone={store.sync_status === "error" ? "danger" : store.sync_status === "success" ? "success" : "neutral"}>
                      {store.sync_status}
                    </AdminStatusBadge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {store.last_sync_at ? `آخر مزامنة: ${new Date(store.last_sync_at).toLocaleString("ar-EG")}` : "لم تتم أي مزامنة بعد."}
                    {store.last_sync_error && <span className="block text-red-600 mt-1">{store.last_sync_error}</span>}
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-1" disabled
                  title="المزامنة الفعلية ستتفعّل عند ربط Edge Function للمزود.">
                  <RefreshCw className="w-4 h-4" /> مزامنة الآن
                </Button>
              </div>
            </AdminSectionCard>
          </TabsContent>

          {/* PRODUCTS */}
          <TabsContent value="products">
            <AdminSectionCard title="منتجات هذا المحل" action={
              <Link to={`/admin/products?store=${store.id}`} className="text-xs font-bold text-primary hover:underline">إدارة في صفحة المنتجات</Link>
            }>
              {counts.products === 0
                ? <AdminEmptyState icon={ShoppingBag} title="لا توجد منتجات بعد" description="أضف منتجات يدوياً أو فعّل الاستيراد من المتجر الخارجي." />
                : <p className="text-sm text-muted-foreground">عدد المنتجات المرتبطة: <span className="font-bold text-foreground">{counts.products}</span></p>}
            </AdminSectionCard>
          </TabsContent>

          {/* OFFERS */}
          <TabsContent value="offers">
            <AdminSectionCard title="عروض هذا المحل" action={
              <Link to={`/admin/deals?store=${store.id}`} className="text-xs font-bold text-primary hover:underline">إدارة في صفحة العروض</Link>
            }>
              {counts.deals === 0
                ? <AdminEmptyState icon={Tag} title="لا توجد عروض بعد" />
                : <p className="text-sm text-muted-foreground">عدد العروض المرتبطة: <span className="font-bold text-foreground">{counts.deals}</span></p>}
            </AdminSectionCard>
          </TabsContent>

          {/* SOCIAL */}
          <TabsContent value="social">
            <AdminSectionCard title="عروض السوشيال المرتبطة" action={
              <Link to={`/admin/social-offers`} className="text-xs font-bold text-primary hover:underline">مراجعة عروض السوشيال</Link>
            }>
              {counts.social === 0
                ? <AdminEmptyState icon={Bell} title="لا توجد منشورات سوشيال مرتبطة" />
                : <p className="text-sm text-muted-foreground">عدد المنشورات: <span className="font-bold text-foreground">{counts.social}</span></p>}
            </AdminSectionCard>
          </TabsContent>

          {/* NOTES */}
          <TabsContent value="notes">
            <AdminSectionCard title="ملاحظات داخلية (لا تظهر للزوار)">
              <Textarea
                rows={8}
                value={store.admin_notes ?? ""}
                onChange={(e) => update({ admin_notes: e.target.value })}
                placeholder="ملاحظات عن العقد، التواصل مع التاجر، حالة التركيب..."
              />
            </AdminSectionCard>
          </TabsContent>
        </Tabs>
      </div>
    </AdminShell>
  );
}

function Field({ label, children, inline }: { label: string; children: React.ReactNode; inline?: boolean }) {
  if (inline) {
    return (
      <div className="flex items-center justify-between rounded-md border border-border bg-secondary/40 px-3 py-2">
        <Label className="text-xs font-bold">{label}</Label>
        {children}
      </div>
    );
  }
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-bold text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
