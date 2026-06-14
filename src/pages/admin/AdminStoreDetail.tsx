import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useRequireContentAccess } from "@/hooks/useAuth";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  AdminPageHeader, AdminStatusBadge, AdminSectionCard, AdminEmptyState, AdminStatCard,
} from "@/components/admin/AdminPrimitives";
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
  ShoppingBag, Tag, Bell, MapPin, Link2, Info, LayoutDashboard, Send, History,
  Copy, Star, Archive, Eye, EyeOff, CheckCircle2,
} from "lucide-react";
import { LIFECYCLE_META, LIFECYCLE_VALUES, type Lifecycle } from "@/lib/storeLifecycle";
import AdminStoreExternalTab from "@/components/admin/AdminStoreExternalTab";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { isValidEgyptPhone, normalizeEgyptPhone, normalizeEgyptWhatsapp, stripToDigits } from "@/lib/egyptPhone";

type Store = any;

const EXT_TYPES = [
  { value: "none", label: "بدون متجر خارجي" },
  { value: "manual", label: "إدارة يدوية (المحتوى من لوحة التحكم)" },
  { value: "website", label: "موقع خارجي للعرض فقط" },
  { value: "shopify", label: "Shopify" },
  { value: "woocommerce", label: "WooCommerce" },
  { value: "other", label: "أخرى" },
];

const VISIBILITY = [
  { value: "leased", label: "ظاهر — مؤجّر" },
  { value: "available", label: "ظاهر — متاح للتأجير" },
  { value: "hidden", label: "مخفي" },
];

const BRANCH_LABELS: Record<string, string> = {
  "new-cairo": "التجمع الخامس",
  "downtown": "وسط البلد",
};

export default function AdminStoreDetail() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const { loading: authLoading, user, canManageContent, isAdmin } = useRequireContentAccess();
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [counts, setCounts] = useState({ products: 0, deals: 0, social: 0, sources: 0 });
  const [activity, setActivity] = useState<any[]>([]);

  const reload = async () => {
    if (!id) return;
    const [storeRes, prodC, dealC, socialC, sourcesC, act] = await Promise.all([
      supabase.from("stores").select("*").eq("id", id).maybeSingle(),
      supabase.from("products").select("id", { count: "exact", head: true }).eq("store_id", id),
      supabase.from("deals").select("id", { count: "exact", head: true }).eq("store_id", id),
      supabase.from("social_offer_intake").select("id", { count: "exact", head: true }).eq("store_id", id),
      supabase.from("social_monitored_merchants").select("id", { count: "exact", head: true }).eq("store_id", id),
      supabase.from("audit_logs").select("id, action, actor_id, changed_columns, created_at")
        .eq("table_name", "stores").eq("row_id", id).order("created_at", { ascending: false }).limit(30),
    ]);
    if (storeRes.error || !storeRes.data) {
      toast({ title: "لم يتم العثور على المحل", variant: "destructive" });
      nav("/admin/stores");
      return;
    }
    setStore(storeRes.data);
    setCounts({
      products: prodC.count ?? 0,
      deals: dealC.count ?? 0,
      social: socialC.count ?? 0,
      sources: sourcesC.count ?? 0,
    });
    setActivity(act.data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    if (!user || !canManageContent || !id) return;
    reload();
     
  }, [id, user, canManageContent]);

  const update = (patch: Partial<Store>) => setStore((s: any) => ({ ...s, ...patch }));

  const save = async () => {
    if (!store) return;

    // Validate Egyptian WhatsApp number before saving (+20 followed by 10 digits)
    if (store.whatsapp && !isValidEgyptPhone(store.whatsapp)) {
      toast({ title: "رقم واتساب غير صحيح", description: "يجب أن يكون رقماً مصرياً بصيغة ‎+20‎ متبوعاً بعشرة أرقام.", variant: "destructive" });
      return;
    }

    setSaving(true);
    const patch = {
      name_ar: store.name_ar, name_en: store.name_en, display_name: store.display_name,
      slug: store.slug, category: store.category, status: store.status, featured: store.featured,
      lifecycle_status: store.lifecycle_status,
      opening_status: store.opening_status, floor_label: store.floor_label, unit_label: store.unit_label,
      unit_code: store.unit_code, branch_context: store.branch_context,
      short_description_ar: store.short_description_ar,
      long_description_ar: store.long_description_ar, logo_url: store.logo_url,
      cover_image_url: store.cover_image_url,
      phone: store.phone ? stripToDigits(store.phone) : null,
      whatsapp: store.whatsapp ? normalizeEgyptWhatsapp(store.whatsapp) : null,
      hotline: store.hotline ? stripToDigits(store.hotline) : null,
      email: store.email, website: store.website, opening_hours: store.opening_hours,
      admin_notes: store.admin_notes,
      external_store_type: store.external_store_type, external_store_url: store.external_store_url,
      external_store_handle: store.external_store_handle,
      sync_mode: store.sync_mode, import_products: store.import_products, import_offers: store.import_offers,
      connector_enabled: store.connector_enabled, sync_notes: store.sync_notes,
    };
    const { error } = await supabase.from("stores").update(patch as any).eq("id", store.id);
    setSaving(false);
    if (error) toast({ title: "تعذّر الحفظ", description: error.message, variant: "destructive" });
    else { toast({ title: "تم الحفظ" }); reload(); }
  };

  const quickPatch = async (patch: Record<string, any>, msg: string) => {
    if (!store) return;
    const { error } = await supabase.from("stores").update(patch as any).eq("id", store.id);
    if (error) { toast({ title: "تعذّر التنفيذ", description: error.message, variant: "destructive" }); return; }
    toast({ title: msg });
    reload();
  };

  const remove = async () => {
    if (!store || !isAdmin) return;
    if (!confirm(`حذف المحل "${store.name_ar}" نهائياً؟ سيتم حذف المنتجات والعروض المرتبطة.`)) return;
    const { error } = await supabase.from("stores").delete().eq("id", store.id);
    if (error) { toast({ title: "تعذّر الحذف", description: error.message, variant: "destructive" }); return; }
    toast({ title: "تم الحذف" });
    nav("/admin/stores");
  };

  const copySlug = async () => {
    if (!store?.slug) return;
    await navigator.clipboard.writeText(store.slug);
    toast({ title: "تم نسخ الـ slug" });
  };

  if (authLoading || loading || !store) {
    return (
      <AdminShell>
        <div className="p-6 max-w-7xl mx-auto space-y-4">
          <Skeleton className="h-10 w-60" />
          <Skeleton className="h-72 w-full" />
        </div>
      </AdminShell>
    );
  }
  if (!user || !canManageContent) return null;

  const lc = LIFECYCLE_META[store.lifecycle_status as Lifecycle] ?? LIFECYCLE_META.draft;
  const extLinked = store.external_store_type && store.external_store_type !== "none";

  return (
    <AdminShell>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-3">
          <Link to="/admin/stores" className="text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1">
            <ArrowRight className="w-3 h-3 rotate-180" /> العودة لكل المحلات
          </Link>
        </div>

        <AdminPageHeader
          title={store.display_name || store.name_ar || "محل بدون اسم"}
          subtitle={`${store.slug}${store.category ? ` • ${store.category}` : ""}${store.branch_context ? ` • ${BRANCH_LABELS[store.branch_context] ?? store.branch_context}` : ""}`}
          actions={
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={copySlug} className="gap-1">
                <Copy className="w-4 h-4" /> نسخ Slug
              </Button>
              <a href={`/stores/${store.slug}`} target="_blank" rel="noreferrer">
                <Button variant="outline" size="sm" className="gap-1"><ExternalLink className="w-4 h-4" /> صفحة عامة</Button>
              </a>
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

        {/* Identity strip */}
        <div className="rounded-xl border border-border bg-card p-4 mb-4 flex flex-wrap items-center gap-4">
          {store.logo_url ? (
            <img src={store.logo_url} alt="" className="w-14 h-14 rounded-lg object-contain bg-secondary border border-border shrink-0" />
          ) : (
            <div className="w-14 h-14 rounded-lg bg-secondary border border-border grid place-items-center text-muted-foreground shrink-0">
              <StoreIcon className="w-6 h-6" />
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
            <AdminStatusBadge tone={lc.tone}>{lc.label}</AdminStatusBadge>
            <AdminStatusBadge tone={store.status === "hidden" ? "neutral" : "success"}>
              {store.status === "hidden" ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              {store.status === "hidden" ? "مخفي" : "ظاهر"}
            </AdminStatusBadge>
            {store.featured && <AdminStatusBadge tone="warning"><Star className="w-3 h-3" /> مميز</AdminStatusBadge>}
            {store.opening_status === "opening_soon" && <AdminStatusBadge tone="info">يُفتتح قريباً</AdminStatusBadge>}
            {extLinked && <AdminStatusBadge tone="info"><Link2 className="w-3 h-3" /> متجر خارجي مرتبط</AdminStatusBadge>}
            {store.pending_verification && <AdminStatusBadge tone="warning">بانتظار التحقق</AdminStatusBadge>}
          </div>
          <div className="text-[0.7rem] text-muted-foreground text-end shrink-0">
            آخر تحديث: {new Date(store.updated_at).toLocaleString("ar-EG")}
          </div>
        </div>

        {/* Operational summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <AdminStatCard label="المنتجات" value={counts.products} icon={ShoppingBag} tone="info" />
          <AdminStatCard label="العروض" value={counts.deals} icon={Tag} tone="warning" />
          <AdminStatCard label="منشورات سوشيال" value={counts.social} icon={Bell} tone="neutral" />
          <AdminStatCard label="مصادر مراقَبة" value={counts.sources} icon={RefreshCw} tone="neutral" />
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-secondary/60 mb-4 flex flex-wrap h-auto">
            <TabsTrigger value="overview"><LayoutDashboard className="w-4 h-4 ml-1" /> نظرة عامة</TabsTrigger>
            <TabsTrigger value="products"><ShoppingBag className="w-4 h-4 ml-1" /> المنتجات ({counts.products})</TabsTrigger>
            <TabsTrigger value="offers"><Tag className="w-4 h-4 ml-1" /> العروض ({counts.deals})</TabsTrigger>
            <TabsTrigger value="social"><Bell className="w-4 h-4 ml-1" /> مصادر سوشيال ({counts.sources})</TabsTrigger>
            <TabsTrigger value="external"><Link2 className="w-4 h-4 ml-1" /> المتجر الخارجي</TabsTrigger>
            <TabsTrigger value="location"><MapPin className="w-4 h-4 ml-1" /> الخريطة والموقع</TabsTrigger>
            <TabsTrigger value="publishing"><Send className="w-4 h-4 ml-1" /> النشر</TabsTrigger>
            <TabsTrigger value="activity"><History className="w-4 h-4 ml-1" /> السجل</TabsTrigger>
          </TabsList>

          {/* OVERVIEW */}
          <TabsContent value="overview" className="space-y-4">
            <AdminSectionCard title="الهوية الأساسية">
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="الاسم بالعربية"><Input value={store.name_ar ?? ""} onChange={(e) => update({ name_ar: e.target.value })} /></Field>
                <Field label="الاسم بالإنجليزية"><Input value={store.name_en ?? ""} onChange={(e) => update({ name_en: e.target.value })} /></Field>
                <Field label="الاسم المعروض"><Input value={store.display_name ?? ""} onChange={(e) => update({ display_name: e.target.value })} /></Field>
                <Field label="الرابط (slug)"><Input value={store.slug ?? ""} onChange={(e) => update({ slug: e.target.value })} /></Field>
                <Field label="الفئة"><Input value={store.category ?? ""} onChange={(e) => update({ category: e.target.value })} /></Field>
                <Field label="الفرع">
                  <select value={store.branch_context ?? ""} onChange={(e) => update({ branch_context: e.target.value || null })}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                    <option value="">—</option>
                    <option value="new-cairo">التجمع الخامس</option>
                    <option value="downtown">وسط البلد</option>
                  </select>
                </Field>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <Field label="الشعار">
                  <ImageUploadField
                    value={store.logo_url}
                    onChange={(url) => update({ logo_url: url || null })}
                    pathPrefix={store.id}
                    kind="logo"
                    shape="square"
                  />
                </Field>
                <Field label="صورة الغلاف">
                  <ImageUploadField
                    value={store.cover_image_url}
                    onChange={(url) => update({ cover_image_url: url || null })}
                    pathPrefix={store.id}
                    kind="cover"
                    shape="wide"
                  />
                </Field>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <Field label="وصف قصير عربي"><Textarea rows={3} value={store.short_description_ar ?? ""} onChange={(e) => update({ short_description_ar: e.target.value })} /></Field>
                <Field label="وصف تفصيلي عربي"><Textarea rows={3} value={store.long_description_ar ?? ""} onChange={(e) => update({ long_description_ar: e.target.value })} /></Field>
              </div>
            </AdminSectionCard>

            <AdminSectionCard title="بيانات التواصل">
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="الهاتف">
                  <Input
                    dir="ltr"
                    value={store.phone ?? ""}
                    onChange={(e) => update({ phone: e.target.value })}
                    placeholder="+201012345678"
                  />
                </Field>
                <Field label="واتساب">
                  <Input
                    dir="ltr"
                    value={store.whatsapp ?? ""}
                    onChange={(e) => update({ whatsapp: e.target.value })}
                    placeholder="+201012345678"
                    aria-invalid={!!store.whatsapp && !isValidEgyptPhone(store.whatsapp)}
                  />
                  {!!store.whatsapp && !isValidEgyptPhone(store.whatsapp) && (
                    <p className="mt-1.5 text-xs text-destructive">رقم غير صحيح — يجب أن يكون رقماً مصرياً بصيغة ‎+20‎ متبوعاً بعشرة أرقام.</p>
                  )}
                </Field>
                <Field label="البريد"><Input value={store.email ?? ""} onChange={(e) => update({ email: e.target.value })} /></Field>
                <Field label="الموقع الإلكتروني"><Input value={store.website ?? ""} onChange={(e) => update({ website: e.target.value })} /></Field>
                <Field label="ساعات العمل"><Input value={store.opening_hours ?? ""} onChange={(e) => update({ opening_hours: e.target.value })} /></Field>
                <Field label="الخط الساخن">
                  <Input
                    dir="ltr"
                    value={store.hotline ?? ""}
                    onChange={(e) => update({ hotline: e.target.value })}
                    placeholder="مثال: 16280"
                  />
                </Field>
              </div>
            </AdminSectionCard>

            <AdminSectionCard title="ملاحظات داخلية (لا تظهر للزوار)">
              <Textarea rows={5} value={store.admin_notes ?? ""}
                onChange={(e) => update({ admin_notes: e.target.value })}
                placeholder="ملاحظات عن العقد، التواصل مع التاجر، حالة التركيب..." />
            </AdminSectionCard>
          </TabsContent>

          {/* PRODUCTS */}
          <TabsContent value="products">
            <AdminSectionCard title="منتجات هذا المحل" action={
              <Link to={`/admin/products?store=${store.id}`} className="text-xs font-bold text-primary hover:underline">إدارة في صفحة المنتجات</Link>
            }>
              {counts.products === 0
                ? <AdminEmptyState icon={ShoppingBag} title="لا توجد منتجات بعد"
                    description="أضف منتجات يدوياً أو فعّل الاستيراد من المتجر الخارجي." />
                : <p className="text-sm text-muted-foreground">عدد المنتجات المرتبطة: <span className="font-bold text-foreground">{counts.products}</span></p>}
            </AdminSectionCard>
          </TabsContent>

          {/* OFFERS */}
          <TabsContent value="offers">
            <AdminSectionCard title="عروض هذا المحل" action={
              <Link to={`/admin/offers?store=${store.id}`} className="text-xs font-bold text-primary hover:underline">إدارة في خط أنابيب العروض</Link>
            }>
              {counts.deals === 0
                ? <AdminEmptyState icon={Tag} title="لا توجد عروض بعد" />
                : <p className="text-sm text-muted-foreground">عدد العروض المرتبطة: <span className="font-bold text-foreground">{counts.deals}</span></p>}
            </AdminSectionCard>
          </TabsContent>

          {/* SOCIAL */}
          <TabsContent value="social">
            <AdminSectionCard title="مصادر السوشيال المراقَبة" action={
              <Link to={`/admin/social-offers`} className="text-xs font-bold text-primary hover:underline">مراجعة عروض السوشيال</Link>
            }>
              {counts.sources === 0 && counts.social === 0 ? (
                <AdminEmptyState icon={Bell} title="لا توجد مصادر سوشيال مرتبطة"
                  description="يمكنك ربط حساب تاجر للمراقبة الآلية ومراجعة عروضه قبل النشر." />
              ) : (
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg border border-border bg-secondary/30 p-3">
                    <div className="text-[0.7rem] font-bold text-muted-foreground">مصادر مراقَبة</div>
                    <div className="text-xl font-bold">{counts.sources}</div>
                  </div>
                  <div className="rounded-lg border border-border bg-secondary/30 p-3">
                    <div className="text-[0.7rem] font-bold text-muted-foreground">منشورات مكتشَفة</div>
                    <div className="text-xl font-bold">{counts.social}</div>
                  </div>
                </div>
              )}
            </AdminSectionCard>
          </TabsContent>

          {/* EXTERNAL */}
          <TabsContent value="external">
            <AdminStoreExternalTab store={store} onPatch={update} onReload={reload} />
          </TabsContent>

          {/* LOCATION */}
          <TabsContent value="location">
            <AdminSectionCard title="الموقع داخل المول">
              <div className="grid md:grid-cols-3 gap-4">
                <Field label="الطابق (نص للعرض)"><Input value={store.floor_label ?? ""} onChange={(e) => update({ floor_label: e.target.value })} placeholder="مثال: الطابق الأرضي" /></Field>
                <Field label="رقم/اسم الوحدة"><Input value={store.unit_label ?? ""} onChange={(e) => update({ unit_label: e.target.value })} placeholder="مثال: G-12" /></Field>
                <Field label="رمز الوحدة (داخلي)"><Input value={store.unit_code ?? ""} onChange={(e) => update({ unit_code: e.target.value })} /></Field>
              </div>
              <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1">
                <Info className="w-3 h-3" />
                لتعديل إحداثيات الخريطة التفاعلية، استخدم محرر الخريطة في صفحة الوحدات.
              </p>
            </AdminSectionCard>
          </TabsContent>

          {/* PUBLISHING */}
          <TabsContent value="publishing" className="space-y-4">
            <AdminSectionCard title="دورة حياة المحل">
              <p className="text-xs text-muted-foreground mb-3">
                دورة الحياة تحدد كيف يظهر المحل في الواجهات العامة وفي إدارة فرق العمل.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {LIFECYCLE_VALUES.map(v => {
                  const meta = LIFECYCLE_META[v];
                  const active = store.lifecycle_status === v;
                  return (
                    <button key={v}
                      onClick={() => update({ lifecycle_status: v })}
                      className={`text-right rounded-lg border p-3 transition ${
                        active ? "border-primary bg-primary/5 ring-1 ring-primary/40" : "border-border bg-card hover:bg-secondary/40"
                      }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <AdminStatusBadge tone={meta.tone}>{meta.label}</AdminStatusBadge>
                        {active && <CheckCircle2 className="w-3.5 h-3.5 text-primary" />}
                      </div>
                      <div className="text-[0.7rem] text-muted-foreground leading-snug">{meta.hint}</div>
                    </button>
                  );
                })}
              </div>
            </AdminSectionCard>

            <AdminSectionCard title="الظهور والإعدادات التشغيلية">
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="حالة الظهور">
                  <select value={store.status} onChange={(e) => update({ status: e.target.value })}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                    {VISIBILITY.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
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
                <Field label="مميز على الصفحة الرئيسية" inline>
                  <Switch checked={!!store.featured} onCheckedChange={(v) => update({ featured: v })} />
                </Field>
                <Field label="بانتظار التحقق من البيانات" inline>
                  <Switch checked={!!store.pending_verification} onCheckedChange={(v) => update({ pending_verification: v })} />
                </Field>
              </div>
            </AdminSectionCard>

            <AdminSectionCard title="إجراءات سريعة">
              <div className="flex flex-wrap gap-2">
                <QuickAction icon={CheckCircle2} label="تفعيل المحل"
                  onClick={() => quickPatch({ lifecycle_status: "active", status: "leased" }, "تم تفعيل المحل")} />
                <QuickAction icon={Eye} label="إظهار للزوار"
                  onClick={() => quickPatch({ status: "leased" }, "أصبح المحل ظاهراً")} />
                <QuickAction icon={EyeOff} label="إخفاء"
                  onClick={() => quickPatch({ status: "hidden" }, "تم إخفاء المحل")} />
                <QuickAction icon={Star} label={store.featured ? "إزالة التمييز" : "تمييز"}
                  onClick={() => quickPatch({ featured: !store.featured }, store.featured ? "تمت إزالة التمييز" : "تم التمييز")} />
                <QuickAction icon={Archive} tone="danger" label="أرشفة"
                  onClick={() => quickPatch({ lifecycle_status: "archived", status: "hidden", featured: false }, "تمت الأرشفة")} />
              </div>
            </AdminSectionCard>
          </TabsContent>

          {/* ACTIVITY */}
          <TabsContent value="activity">
            <AdminSectionCard title="سجل التعديلات الأخيرة">
              {activity.length === 0 ? (
                <AdminEmptyState icon={History} title="لا يوجد سجل بعد"
                  description="ستظهر هنا التعديلات على هذا المحل من جميع المستخدمين." />
              ) : (
                <div className="divide-y divide-border">
                  {activity.map((a) => (
                    <div key={a.id} className="py-2.5 flex items-start gap-3 text-sm">
                      <AdminStatusBadge tone={a.action === "DELETE" ? "danger" : a.action === "INSERT" ? "success" : "info"}>
                        {a.action}
                      </AdminStatusBadge>
                      <div className="flex-1 min-w-0">
                        <div className="text-foreground">
                          {a.changed_columns?.length
                            ? <>تعديل: <span className="font-mono text-xs">{a.changed_columns.join(", ")}</span></>
                            : <span className="text-muted-foreground">—</span>}
                        </div>
                        <div className="text-[0.7rem] text-muted-foreground mt-0.5">
                          {new Date(a.created_at).toLocaleString("ar-EG")}
                          {a.actor_id && <> • بواسطة <span className="font-mono">{String(a.actor_id).slice(0, 8)}</span></>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

function QuickAction({ icon: Icon, label, onClick, tone }: { icon: any; label: string; onClick: () => void; tone?: "danger" }) {
  return (
    <button onClick={onClick}
      className={`h-9 px-3 rounded-md border text-xs font-bold inline-flex items-center gap-1.5 transition ${
        tone === "danger"
          ? "border-red-500/30 text-red-600 hover:bg-red-500/10"
          : "border-border bg-background hover:bg-secondary text-foreground"
      }`}>
      <Icon className="w-3.5 h-3.5" /> {label}
    </button>
  );
}
