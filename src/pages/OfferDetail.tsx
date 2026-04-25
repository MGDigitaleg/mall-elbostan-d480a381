import { useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  Clock3,
  CalendarDays,
  Tag,
  Store as StoreIcon,
  ShieldCheck,
  Info,
  AlertTriangle,
  BadgeX,
  ExternalLink,
  Heart,
  Scale,
  Map as MapIcon,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { TenantLogo } from "@/components/TenantLogo";
import { getVerifiedLogoUrl } from "@/lib/tenantLogoRegistry";
import { optimizeImageUrl } from "@/lib/imageUtils";
import { useOfferCollections } from "@/hooks/useOfferCollections";
import { toast } from "sonner";

type OfferDetailRecord = {
  id: string;
  title_ar: string;
  title_en?: string | null;
  description_ar?: string | null;
  brand?: string | null;
  model?: string | null;
  specs_short_ar?: string | null;
  price_current?: number | null;
  price_old?: number | null;
  currency?: string | null;
  offer_badge_ar?: string | null;
  image_primary?: string | null;
  promo_code?: string | null;
  source_link?: string | null;
  valid_from?: string | null;
  valid_to?: string | null;
  campaign_key?: string | null;
  featured?: boolean | null;
  verified?: boolean | null;
  opening_status?: string | null;
  stores?: {
    name_ar: string;
    slug: string;
    logo_url?: string | null;
    category?: string | null;
    opening_status?: string | null;
  } | null;
};

function formatCurrency(value?: number | null, currency = "EGP") {
  if (typeof value !== "number") return null;
  if (currency === "EGP") return `${value.toLocaleString("ar-EG")} ج.م`;
  return `${value.toLocaleString("ar-EG")} ${currency}`;
}

function formatDateAr(value?: string | null) {
  if (!value) return null;
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" });
}

function getCampaignState(validTo?: string | null) {
  if (!validTo) return { status: "none" as const, label: "" };
  const ts = new Date(validTo).getTime();
  if (isNaN(ts)) return { status: "none" as const, label: "" };
  const remaining = ts - Date.now();
  if (remaining <= 0) return { status: "expired" as const, label: "انتهت الحملة" };
  const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
  const hours = Math.floor(remaining / (60 * 60 * 1000));
  if (remaining <= 3 * 24 * 60 * 60 * 1000) {
    return {
      status: "ending_soon" as const,
      label: days >= 1 ? `تنتهي خلال ${days} ${days === 1 ? "يوم" : "أيام"}` : `تنتهي خلال ${hours} ساعة`,
    };
  }
  return { status: "active" as const, label: "ساري" };
}

const OfferDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isFavorite, isCompared, toggleFavorite, toggleCompare } = useOfferCollections();

  const { data: offer, isLoading, isError } = useQuery({
    queryKey: ["offer-detail", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deals")
        .select(
          "id, title_ar, title_en, description_ar, brand, model, specs_short_ar, price_current, price_old, currency, offer_badge_ar, image_primary, promo_code, source_link, valid_from, valid_to, campaign_key, featured, verified, opening_status, stores:store_id(name_ar, slug, logo_url, category, opening_status)"
        )
        .eq("id", id!)
        .eq("is_live", true)
        .maybeSingle();
      if (error) throw error;
      return data as OfferDetailRecord | null;
    },
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [id]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16">
          <div className="h-6 w-40 animate-pulse rounded bg-muted" />
          <div className="mt-6 grid gap-8 lg:grid-cols-2">
            <div className="aspect-[4/3] animate-pulse rounded-2xl bg-muted" />
            <div className="space-y-4">
              <div className="h-8 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
              <div className="h-24 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (isError || !offer) {
    return (
      <MainLayout>
        <SEOHead title="العرض غير متوفر | مول البستان" description="هذا العرض غير متاح حالياً." />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">العرض غير متوفر</h1>
          <p className="mt-3 text-muted-foreground">قد يكون العرض قد انتهى أو تم تعديله.</p>
          <Button onClick={() => navigate("/daily-deals")} className="mt-6 gap-2">
            <ArrowRight className="h-4 w-4" /> العودة إلى كل العروض
          </Button>
        </div>
      </MainLayout>
    );
  }

  const store = offer.stores;
  const campaign = getCampaignState(offer.valid_to);
  const isExpired = campaign.status === "expired";
  const isEndingSoon = campaign.status === "ending_soon";
  const priceNow = formatCurrency(offer.price_current, offer.currency ?? "EGP");
  const priceOld = formatCurrency(offer.price_old, offer.currency ?? "EGP");
  const discount =
    offer.price_current && offer.price_old && offer.price_old > offer.price_current
      ? Math.round(((offer.price_old - offer.price_current) / offer.price_old) * 100)
      : null;
  const validFrom = formatDateAr(offer.valid_from);
  const validTo = formatDateAr(offer.valid_to);
  const categoryLabel = store?.category ?? "عروض الافتتاح";
  const favorite = isFavorite(offer.id);
  const compared = isCompared(offer.id);

  const seoTitle = `${offer.title_ar}${store ? ` - ${store.name_ar}` : ""} | مول البستان`;
  const seoDesc =
    offer.description_ar?.slice(0, 155) ??
    `${offer.title_ar}${priceNow ? ` بسعر ${priceNow}` : ""}${store ? ` من ${store.name_ar}` : ""} في مول البستان.`;

  const handleFavorite = () => {
    toggleFavorite(offer.id);
    toast.success(favorite ? "أُزيل من المفضلة" : "أُضيف إلى المفضلة", { duration: 1500 });
  };
  const handleCompare = () => {
    const r = toggleCompare(offer.id);
    if (!r.ok && r.reason === "limit") {
      toast.error("وصلت للحد الأقصى للمقارنة", { duration: 1800 });
      return;
    }
    toast.success(compared ? "أُزيل من المقارنة" : "أُضيف إلى المقارنة", { duration: 1500 });
  };

  return (
    <MainLayout>
      <SEOHead
        title={seoTitle}
        description={seoDesc}
        canonical={`/daily-deals/${offer.id}`}
      />

      <div className="bg-gradient-to-b from-secondary/30 via-background to-background">
        <div className="container mx-auto px-4 py-6 md:py-10">
          {/* Breadcrumbs */}
          <nav aria-label="مسار التنقل" className="mb-5 flex flex-wrap items-center gap-1.5 text-[0.75rem] text-muted-foreground">
            <Link to="/" className="hover:text-primary">الرئيسية</Link>
            <span>/</span>
            <Link to="/daily-deals" className="hover:text-primary">عروض اليوم</Link>
            {store && (
              <>
                <span>/</span>
                <Link to={`/stores/${store.slug}`} className="hover:text-primary">{store.name_ar}</Link>
              </>
            )}
            <span>/</span>
            <span className="text-foreground line-clamp-1">{offer.title_ar}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[5fr_6fr]">
            {/* Image / hero */}
            <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-card)]">
              <div className={`relative aspect-[4/3] bg-gradient-to-br from-secondary/45 via-background to-muted/30 ${isExpired ? "grayscale" : ""}`}>
                {offer.image_primary ? (
                  <img
                    src={optimizeImageUrl(offer.image_primary, 960)}
                    alt={offer.title_ar}
                    className="absolute inset-0 h-full w-full object-contain p-6"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[var(--gradient-hero)] text-primary-foreground">
                    <h2 className="px-8 text-center text-2xl font-bold leading-snug">{offer.model ?? offer.title_ar}</h2>
                  </div>
                )}

                {discount && !isExpired && (
                  <span className="absolute left-3 top-3 rounded-lg bg-orange px-3 py-1.5 text-[0.85rem] font-bold text-orange-foreground shadow-lg">
                    خصم {discount}%
                  </span>
                )}

                {isExpired && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/55 backdrop-blur-[2px]">
                    <span className="inline-flex items-center gap-1.5 rounded-xl border border-destructive/40 bg-destructive px-4 py-2 text-[0.95rem] font-extrabold text-destructive-foreground shadow-lg">
                      <BadgeX className="h-4 w-4" />
                      انتهت الحملة
                    </span>
                  </div>
                )}

                {isEndingSoon && (
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-orange/30 bg-orange/95 px-3 py-1 text-[0.7rem] font-bold text-orange-foreground shadow-lg backdrop-blur-sm">
                    <AlertTriangle className="h-3 w-3" />
                    {campaign.label}
                  </span>
                )}
              </div>
            </div>

            {/* Info column */}
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-border/70 bg-secondary/60 px-3 py-1 text-[0.7rem] font-semibold text-foreground">
                  {categoryLabel}
                </span>
                {offer.offer_badge_ar && (
                  <span className="rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-[0.7rem] font-semibold text-primary">
                    {offer.offer_badge_ar}
                  </span>
                )}
                {offer.featured && (
                  <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[0.7rem] font-bold text-primary">
                    عرض مميز
                  </span>
                )}
                {offer.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[0.7rem] font-bold text-emerald-700 dark:text-emerald-400">
                    <ShieldCheck className="h-3 w-3" /> موثوق
                  </span>
                )}
              </div>

              {offer.brand && (
                <p className="mt-4 text-[0.78rem] font-semibold text-muted-foreground">{offer.brand}</p>
              )}
              <h1 className="mt-1 text-[1.6rem] font-bold leading-tight text-foreground md:text-[2rem]">
                {offer.title_ar}
              </h1>
              {offer.specs_short_ar && (
                <p className="mt-3 text-[0.95rem] leading-7 text-muted-foreground">{offer.specs_short_ar}</p>
              )}

              {/* Price block */}
              <div className="mt-5 rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-soft)]">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    {priceNow ? (
                      <p className="text-[1.6rem] font-bold text-primary">{priceNow}</p>
                    ) : (
                      <p className="text-[1.1rem] font-semibold text-foreground">السعر عند الزيارة</p>
                    )}
                    {priceOld && (
                      <p className="mt-1 text-[0.9rem] text-muted-foreground line-through">{priceOld}</p>
                    )}
                  </div>
                  {discount && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-orange/20 bg-orange/10 px-3 py-1.5 text-[0.8rem] font-bold text-orange">
                      <Tag className="h-3.5 w-3.5" /> وفر {discount}%
                    </span>
                  )}
                </div>

                {offer.promo_code && (
                  <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-dashed border-primary/30 bg-primary/5 px-3 py-2.5">
                    <span className="text-[0.72rem] font-semibold text-muted-foreground">كود الخصم:</span>
                    <code className="rounded-md bg-background px-2 py-1 text-[0.85rem] font-bold tracking-wider text-primary">
                      {offer.promo_code}
                    </code>
                    <Button
                      type="button"
                      variant="outline-blue"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard?.writeText(offer.promo_code!);
                        toast.success("تم نسخ الكود", { duration: 1500 });
                      }}
                      className="ms-auto h-8 rounded-lg text-[0.7rem]"
                    >
                      نسخ الكود
                    </Button>
                  </div>
                )}
              </div>

              {/* Validity */}
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className={`flex items-start gap-2.5 rounded-xl border p-3.5 ${isExpired ? "border-destructive/40 bg-destructive/5" : isEndingSoon ? "border-orange/40 bg-orange/5" : "border-border/70 bg-card"}`}>
                  <CalendarDays className="mt-0.5 h-4 w-4 text-primary" />
                  <div className="min-w-0">
                    <p className="text-[0.7rem] font-semibold text-muted-foreground">يبدأ من</p>
                    <p className="mt-0.5 text-[0.85rem] font-bold text-foreground">{validFrom ?? "متاح الآن"}</p>
                  </div>
                </div>
                <div className={`flex items-start gap-2.5 rounded-xl border p-3.5 ${isExpired ? "border-destructive/40 bg-destructive/5" : isEndingSoon ? "border-orange/40 bg-orange/5" : "border-border/70 bg-card"}`}>
                  <Clock3 className={`mt-0.5 h-4 w-4 ${isExpired ? "text-destructive" : isEndingSoon ? "text-orange" : "text-primary"}`} />
                  <div className="min-w-0">
                    <p className="text-[0.7rem] font-semibold text-muted-foreground">ينتهي في</p>
                    <p className={`mt-0.5 text-[0.85rem] font-bold ${isExpired ? "text-destructive" : isEndingSoon ? "text-orange" : "text-foreground"}`}>
                      {validTo ?? "حتى نفاذ الكمية"}
                    </p>
                    {(isEndingSoon || isExpired) && campaign.label && (
                      <p className={`mt-0.5 text-[0.7rem] font-semibold ${isExpired ? "text-destructive" : "text-orange"}`}>
                        {campaign.label}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {store && (
                  <Link to={`/stores/${store.slug}`} className="block">
                    <Button variant="cta" className="h-11 w-full rounded-xl text-[0.85rem] font-bold gap-1.5">
                      صفحة المتجر <ArrowLeft className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
                {store && (
                  <Link to={`/map?store=${store.slug}`} className="block">
                    <Button variant="outline-blue" className="h-11 w-full rounded-xl text-[0.8rem] font-bold gap-1.5">
                      <MapIcon className="h-4 w-4" /> عرض على الخريطة
                    </Button>
                  </Link>
                )}
                {offer.source_link && (
                  <a href={offer.source_link} target="_blank" rel="noopener noreferrer" className="block sm:col-span-2">
                    <Button variant="outline" className="h-10 w-full rounded-xl text-[0.78rem] font-semibold gap-1.5">
                      <ExternalLink className="h-3.5 w-3.5" /> رابط العرض الأصلي
                    </Button>
                  </a>
                )}
              </div>

              {/* Quick collection actions */}
              {!isExpired && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleFavorite}
                    aria-pressed={favorite}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[0.72rem] font-semibold transition-all ${favorite ? "border-rose-400/40 bg-rose-500 text-white" : "border-border/70 bg-card text-foreground/80 hover:text-rose-500 hover:border-rose-400/40"}`}
                  >
                    <Heart className={`h-3.5 w-3.5 ${favorite ? "fill-current" : ""}`} />
                    {favorite ? "في المفضلة" : "أضف للمفضلة"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCompare}
                    aria-pressed={compared}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[0.72rem] font-semibold transition-all ${compared ? "border-primary/40 bg-primary text-primary-foreground" : "border-border/70 bg-card text-foreground/80 hover:text-primary hover:border-primary/40"}`}
                  >
                    <Scale className="h-3.5 w-3.5" />
                    {compared ? "في المقارنة" : "أضف للمقارنة"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Description + Terms */}
          <div className="mt-10 grid gap-6 lg:grid-cols-[2fr_1fr]">
            <section className="rounded-2xl border border-border/70 bg-card p-6 shadow-[var(--shadow-soft)]">
              <h2 className="flex items-center gap-2 text-[1.05rem] font-bold text-foreground">
                <Info className="h-4 w-4 text-primary" /> تفاصيل العرض
              </h2>
              {offer.description_ar ? (
                <p className="mt-3 whitespace-pre-line text-[0.92rem] leading-8 text-muted-foreground">
                  {offer.description_ar}
                </p>
              ) : (
                <p className="mt-3 text-[0.88rem] leading-7 text-muted-foreground">
                  {offer.title_ar}
                  {store ? ` متوفر حصرياً لدى ${store.name_ar} في مول البستان.` : ""}
                  {priceNow ? ` السعر الحالي ${priceNow}.` : ""}
                </p>
              )}

              <h3 className="mt-6 text-[0.95rem] font-bold text-foreground">شروط وأحكام العرض</h3>
              <ul className="mt-3 space-y-2 text-[0.85rem] leading-7 text-muted-foreground">
                <li className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>
                    العرض ساري{validTo ? ` حتى ${validTo}` : " لفترة محدودة"} أو حتى نفاذ الكمية المتاحة، أيهما أقرب.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>الأسعار شاملة الضرائب المقررة، وقد تختلف الأسعار النهائية عند التطبيق داخل المتجر.</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>لا يجمع هذا العرض مع عروض أو خصومات أخرى ما لم يُذكر خلاف ذلك من المتجر.</span>
                </li>
                {offer.promo_code && (
                  <li className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>يجب إبراز كود الخصم <strong className="text-foreground">{offer.promo_code}</strong> عند الشراء للاستفادة من العرض.</span>
                  </li>
                )}
                <li className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>يحق لإدارة المتجر تعديل أو إيقاف العرض في أي وقت دون إشعار مسبق.</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>للاستفسار أو التأكد من توفر المنتج، يُرجى التواصل مباشرة مع المتجر داخل مول البستان.</span>
                </li>
              </ul>
            </section>

            {/* Store card */}
            {store && (
              <aside className="rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-soft)]">
                <h2 className="flex items-center gap-2 text-[0.95rem] font-bold text-foreground">
                  <StoreIcon className="h-4 w-4 text-primary" /> المتجر المقدم للعرض
                </h2>
                <Link
                  to={`/stores/${store.slug}`}
                  className="mt-4 flex items-center gap-3 rounded-xl border border-border/60 bg-secondary/30 p-3 transition-all hover:border-primary/40 hover:bg-secondary/50"
                >
                  <TenantLogo
                    src={getVerifiedLogoUrl(store.slug, store.logo_url)}
                    alt={store.name_ar}
                    fallbackName={store.name_ar}
                    size="md"
                    rounded="lg"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[0.9rem] font-bold text-foreground">{store.name_ar}</p>
                    <p className="truncate text-[0.72rem] text-muted-foreground">{categoryLabel}</p>
                  </div>
                  <ArrowLeft className="h-4 w-4 shrink-0 text-primary" />
                </Link>

                <div className="mt-4 space-y-2">
                  <Link to={`/daily-deals?merchant=${store.slug}`} className="block">
                    <Button variant="outline-blue" className="h-10 w-full rounded-xl text-[0.75rem] font-bold gap-1.5">
                      كل عروض هذا المتجر
                    </Button>
                  </Link>
                  <Link to={`/map?store=${store.slug}`} className="block">
                    <Button variant="ghost" className="h-9 w-full rounded-xl text-[0.72rem] font-semibold gap-1.5">
                      <MapIcon className="h-3.5 w-3.5" /> الموقع داخل المول
                    </Button>
                  </Link>
                </div>
              </aside>
            )}
          </div>

          <div className="mt-10 flex justify-center">
            <Link to="/daily-deals">
              <Button variant="ghost" className="gap-1.5 text-[0.8rem]">
                <ArrowRight className="h-4 w-4" /> العودة إلى كل العروض
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default OfferDetail;
