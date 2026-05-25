import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { AdminStatusBadge } from "@/components/admin/AdminPrimitives";
import { toast } from "@/hooks/use-toast";
import {
  CheckCircle2, ChevronLeft, ChevronRight, ExternalLink, Eye,
  Save, Send, AlertTriangle, Image as ImageIcon, Sparkles,
} from "lucide-react";

type IntakePost = {
  id: string;
  merchant_id: string;
  store_id: string;
  branch_context: string;
  source_platform: string;
  source_post_url: string | null;
  source_caption: string | null;
  source_thumbnail_url: string | null;
  source_published_at: string | null;
  offer_title: string | null;
  offer_subtitle: string | null;
  short_specs: string | null;
  current_price: number | null;
  old_price: number | null;
  currency: string;
  opening_related: boolean;
  review_status: string;
  publish_status: string;
  published_deal_id: string | null;
  featured: boolean;
  category: string | null;
  expires_at: string | null;
  media_assets: unknown;
  curated_media_assets: unknown;
};

type StoreOpt = { id: string; name_ar: string; slug: string; logo_url: string | null };

type WizardState = {
  store_id: string;
  image_url: string;
  title: string;
  subtitle: string;
  short_specs: string;
  category: string;
  current_price: string;
  old_price: string;
  badge: string;
  opening_related: boolean;
  featured: boolean;
  valid_from: string;
  valid_to: string;
};

const STEPS = [
  { key: "source", label: "المصدر" },
  { key: "store", label: "المتجر والوسائط" },
  { key: "content", label: "المحتوى" },
  { key: "commercial", label: "التسعير والتنسيق" },
  { key: "preview", label: "المعاينة والنشر" },
] as const;

const CURRENCY_LABEL = "ج.م";

export function SocialOfferConvertWizard({
  post,
  stores,
  open,
  onOpenChange,
  onConverted,
}: {
  post: IntakePost | null;
  stores: StoreOpt[];
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onConverted: () => void;
}) {
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState<WizardState>({
    store_id: "",
    image_url: "",
    title: "",
    subtitle: "",
    short_specs: "",
    category: "",
    current_price: "",
    old_price: "",
    badge: "",
    opening_related: false,
    featured: false,
    valid_from: "",
    valid_to: "",
  });

  useEffect(() => {
    if (!post) return;
    setStep(0);
    setState({
      store_id: post.store_id ?? "",
      image_url: post.source_thumbnail_url ?? "",
      title: post.offer_title ?? "",
      subtitle: post.offer_subtitle ?? "",
      short_specs: post.short_specs ?? "",
      category: post.category ?? "",
      current_price: post.current_price?.toString() ?? "",
      old_price: post.old_price?.toString() ?? "",
      badge: "",
      opening_related: post.opening_related ?? false,
      featured: post.featured ?? false,
      valid_from: new Date().toISOString().slice(0, 10),
      valid_to: post.expires_at ? post.expires_at.slice(0, 10) : "",
    });
  }, [post]);

  const mediaOptions = useMemo(() => {
    if (!post) return [];
    const arr: string[] = [];
    if (post.source_thumbnail_url) arr.push(post.source_thumbnail_url);
    const media = Array.isArray(post.media_assets) ? post.media_assets : [];
    media.forEach((m: unknown) => {
      if (typeof m === "string") arr.push(m);
      else if (m && typeof m === "object" && "url" in m && typeof (m as { url: unknown }).url === "string") {
        arr.push((m as { url: string }).url);
      }
    });
    return Array.from(new Set(arr));
  }, [post]);

  const selectedStore = stores.find((s) => s.id === state.store_id) ?? null;

  if (!post) return null;

  const set = <K extends keyof WizardState>(k: K, v: WizardState[K]) =>
    setState((s) => ({ ...s, [k]: v }));

  const canNext = () => {
    if (step === 1) return !!state.store_id && !!state.image_url;
    if (step === 2) return state.title.trim().length > 2;
    return true;
  };

  const buildDealPayload = () => ({
    title_ar: state.title.trim(),
    description_ar: state.subtitle.trim() || null,
    specs_short_ar: state.short_specs.trim() || null,
    store_id: state.store_id,
    price_current: state.current_price ? Number(state.current_price) : null,
    price_old: state.old_price ? Number(state.old_price) : null,
    currency: "EGP",
    image_primary: state.image_url || null,
    source_type: "social_intake",
    source_link: post.source_post_url,
    verified: true,
    featured: state.featured,
    opening_status: state.opening_related ? "opening_soon" : "standard",
    campaign_key: state.opening_related ? "opening" : "general",
    valid_from: state.valid_from ? new Date(state.valid_from).toISOString() : new Date().toISOString(),
    valid_to: state.valid_to ? new Date(state.valid_to).toISOString() : null,
    offer_badge_ar: state.badge.trim() || null,
    category: state.category || null,
  });

  const logActivity = async (action_type: string, action_label_ar: string, payload: Record<string, unknown> = {}) => {
    await supabase.from("social_offer_activity_log").insert([
      { intake_id: post.id, action_type, action_label_ar, payload: payload as never },
    ]);
  };

  const persist = async (mode: "draft" | "publish") => {
    setBusy(true);
    try {
      const isLive = mode === "publish";
      const payload = { ...buildDealPayload(), is_live: isLive };
      const { data: deal, error: dealErr } = await supabase
        .from("deals")
        .insert(payload as never)
        .select("id")
        .single();
      if (dealErr || !deal) throw dealErr ?? new Error("لم يتم إنشاء العرض");

      const intakePatch = {
        review_status: "approved",
        publish_status: isLive ? "published" : "draft",
        published_deal_id: deal.id,
        published_at: isLive ? new Date().toISOString() : null,
        offer_title: state.title,
        offer_subtitle: state.subtitle,
        short_specs: state.short_specs,
        current_price: state.current_price ? Number(state.current_price) : null,
        old_price: state.old_price ? Number(state.old_price) : null,
        featured: state.featured,
        opening_related: state.opening_related,
        category: state.category || null,
        expires_at: state.valid_to ? new Date(state.valid_to).toISOString() : null,
      };
      const { error: upErr } = await supabase
        .from("social_offer_intake")
        .update(intakePatch as never)
        .eq("id", post.id);
      if (upErr) throw upErr;

      await logActivity(
        isLive ? "post_published" : "post_drafted",
        isLive ? "اعتماد ونشر العرض عبر المعالج" : "حفظ العرض كمسودة عبر المعالج",
        { deal_id: deal.id, mode },
      );

      toast({
        title: isLive ? "تم النشر" : "تم الحفظ كمسودة",
        description: isLive
          ? "العرض ظاهر الآن في صفحة العروض وصفحة المتجر."
          : "تم إنشاء عرض بحالة مسودة جاهز للنشر لاحقاً.",
      });
      onConverted();
      onOpenChange(false);
    } catch (e) {
      toast({
        title: "تعذّر إتمام التحويل",
        description: e instanceof Error ? e.message : "خطأ غير معروف",
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  const reject = async () => {
    setBusy(true);
    const { error } = await supabase
      .from("social_offer_intake")
      .update({ review_status: "rejected", publish_status: "archived" } as never)
      .eq("id", post.id);
    if (error) {
      toast({ title: "تعذّر الرفض", description: error.message, variant: "destructive" });
    } else {
      await logActivity("post_rejected", "رفض المنشور من المعالج");
      toast({ title: "تم رفض المنشور" });
      onConverted();
      onOpenChange(false);
    }
    setBusy(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            تحويل منشور سوشيال إلى عرض رسمي
          </DialogTitle>
        </DialogHeader>

        {/* Source trace strip */}
        <div className="rounded-lg border border-border bg-secondary/40 p-3 flex flex-wrap items-center gap-2 text-xs">
          <AdminStatusBadge tone="info">{post.source_platform}</AdminStatusBadge>
          <AdminStatusBadge tone={post.review_status === "rejected" ? "danger" : "warning"}>
            {post.review_status}
          </AdminStatusBadge>
          {post.opening_related && <AdminStatusBadge tone="success">افتتاح</AdminStatusBadge>}
          {post.source_published_at && (
            <span className="text-muted-foreground">
              نُشر في {new Date(post.source_published_at).toLocaleDateString("ar-EG")}
            </span>
          )}
          {post.source_post_url && (
            <a
              href={post.source_post_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center gap-1 mr-auto"
            >
              <ExternalLink className="w-3.5 h-3.5" /> المصدر
            </a>
          )}
        </div>

        {/* Stepper */}
        <ol className="flex items-center gap-1 text-[0.7rem] font-bold mt-2">
          {STEPS.map((s, i) => (
            <li
              key={s.key}
              className={`flex items-center gap-1 px-2 py-1 rounded-full border ${
                i === step
                  ? "bg-primary text-primary-foreground border-primary"
                  : i < step
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    : "bg-secondary text-muted-foreground border-border"
              }`}
            >
              <span className="w-4 h-4 grid place-items-center rounded-full bg-background/60 text-[0.65rem]">
                {i + 1}
              </span>
              {s.label}
            </li>
          ))}
        </ol>

        <div className="space-y-4 mt-2">
          {step === 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-foreground">مراجعة المنشور الأصلي</h3>
              {post.source_caption ? (
                <div className="rounded-lg bg-muted/40 p-3 text-sm whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {post.source_caption}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">لا يوجد نص أصلي للمنشور.</p>
              )}
              <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 dark:bg-amber-500/5 border border-amber-500/20 rounded-lg p-3">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <p>
                  لا تُنشر نص المنشور كما هو. الخطوات التالية تساعدك على تنظيف المحتوى وتحويله إلى عرض رسمي
                  للموقع باسم العلامة وبسعر ومواصفات واضحة.
                </p>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label>المتجر / العلامة</Label>
                <Select value={state.store_id} onValueChange={(v) => set("store_id", v)}>
                  <SelectTrigger><SelectValue placeholder="اختر متجراً" /></SelectTrigger>
                  <SelectContent className="max-h-72">
                    {stores.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name_ar}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedStore && (
                  <p className="text-xs text-muted-foreground mt-1">/stores/{selectedStore.slug}</p>
                )}
              </div>

              <div>
                <Label>صورة العرض الرئيسية</Label>
                {mediaOptions.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {mediaOptions.map((url) => (
                      <button
                        key={url}
                        type="button"
                        onClick={() => set("image_url", url)}
                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition ${
                          state.image_url === url ? "border-primary ring-2 ring-primary/30" : "border-border"
                        }`}
                      >
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        {state.image_url === url && (
                          <span className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-0.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <ImageIcon className="w-3.5 h-3.5" /> لا توجد صور من المصدر
                  </div>
                )}
                <Input
                  className="mt-2"
                  dir="ltr"
                  placeholder="أو ألصق رابط صورة مخصص"
                  value={state.image_url}
                  onChange={(e) => set("image_url", e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <div>
                <Label>عنوان العرض الرسمي (يظهر على الموقع)</Label>
                <Input
                  value={state.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="مثال: لابتوب Lenovo IdeaPad 3 — خصم الافتتاح"
                />
              </div>
              <div>
                <Label>عنوان فرعي (اختياري)</Label>
                <Input
                  value={state.subtitle}
                  onChange={(e) => set("subtitle", e.target.value)}
                  placeholder="مثال: ضمان رسمي سنة + شحن مجاني"
                />
              </div>
              <div>
                <Label>مواصفات قصيرة</Label>
                <Textarea
                  rows={3}
                  value={state.short_specs}
                  onChange={(e) => set("short_specs", e.target.value)}
                  placeholder="i5 جيل 12 / 8GB / 512GB SSD"
                />
              </div>
              <div>
                <Label>الفئة</Label>
                <Input
                  value={state.category}
                  onChange={(e) => set("category", e.target.value)}
                  placeholder="لابتوبات / موبايلات / إكسسوار..."
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <Label>السعر الحالي ({CURRENCY_LABEL})</Label>
                  <Input type="number" value={state.current_price} onChange={(e) => set("current_price", e.target.value)} />
                </div>
                <div>
                  <Label>السعر القديم</Label>
                  <Input type="number" value={state.old_price} onChange={(e) => set("old_price", e.target.value)} />
                </div>
                <div>
                  <Label>شارة العرض</Label>
                  <Input
                    value={state.badge}
                    onChange={(e) => set("badge", e.target.value)}
                    placeholder="خصم 20% / حصري الافتتاح"
                  />
                </div>
                <div>
                  <Label>تاريخ البدء</Label>
                  <Input type="date" value={state.valid_from} onChange={(e) => set("valid_from", e.target.value)} />
                </div>
                <div>
                  <Label>تاريخ الانتهاء</Label>
                  <Input type="date" value={state.valid_to} onChange={(e) => set("valid_to", e.target.value)} />
                </div>
              </div>
              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={state.opening_related}
                    onChange={(e) => set("opening_related", e.target.checked)}
                  />
                  مرتبط بافتتاح المول
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={state.featured}
                    onChange={(e) => set("featured", e.target.checked)}
                  />
                  عرض مميَّز
                </label>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <Eye className="w-4 h-4" /> معاينة العرض النهائي
              </h3>
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                {state.image_url && (
                  <img src={state.image_url} alt="" className="w-full aspect-video object-cover bg-muted" />
                )}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-foreground">{state.title || "بدون عنوان"}</h4>
                    {state.badge && (
                      <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                        {state.badge}
                      </span>
                    )}
                  </div>
                  {state.subtitle && <p className="text-sm text-muted-foreground">{state.subtitle}</p>}
                  {state.short_specs && (
                    <p className="text-xs bg-secondary rounded px-2 py-1 inline-block">{state.short_specs}</p>
                  )}
                  <div className="flex items-baseline gap-2 pt-1">
                    {state.current_price && (
                      <span className="text-lg font-bold text-foreground">{state.current_price} {CURRENCY_LABEL}</span>
                    )}
                    {state.old_price && (
                      <s className="text-sm text-muted-foreground">{state.old_price} {CURRENCY_LABEL}</s>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                    {selectedStore && <span>{selectedStore.name_ar}</span>}
                    {state.opening_related && <AdminStatusBadge tone="success">افتتاح</AdminStatusBadge>}
                    {state.featured && <AdminStatusBadge tone="info">مميَّز</AdminStatusBadge>}
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                بعد الحفظ سيتم ربط هذا العرض بسجل المنشور الأصلي للحفاظ على إمكانية التتبع.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost" size="sm" disabled={busy || post.review_status === "rejected"} onClick={reject}
            >
              رفض المنشور
            </Button>
          </div>
          <div className="flex items-center gap-2 mr-auto">
            <Button
              variant="outline" size="sm"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0 || busy}
            >
              <ChevronRight className="w-4 h-4 ml-1" /> السابق
            </Button>
            {step < STEPS.length - 1 ? (
              <Button
                size="sm"
                onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
                disabled={!canNext() || busy}
              >
                التالي <ChevronLeft className="w-4 h-4 mr-1" />
              </Button>
            ) : (
              <>
                <Button variant="outline" size="sm" disabled={busy} onClick={() => persist("draft")}>
                  <Save className="w-4 h-4 ml-1" /> حفظ مسودة
                </Button>
                <Button size="sm" disabled={busy} onClick={() => persist("publish")}>
                  <Send className="w-4 h-4 ml-1" /> اعتماد ونشر
                </Button>
              </>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
