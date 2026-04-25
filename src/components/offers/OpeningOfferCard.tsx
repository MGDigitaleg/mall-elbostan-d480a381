import { Link } from "react-router-dom";
import { ArrowLeft, Clock3, Store, Tag, AlertTriangle, BadgeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TenantLogo } from "@/components/TenantLogo";
import { getVerifiedLogoUrl } from "@/lib/tenantLogoRegistry";
import { optimizeImageUrl } from "@/lib/imageUtils";

export type OpeningOfferRecord = {
  id: string;
  title_ar: string;
  description_ar?: string | null;
  specs_short_ar?: string | null;
  brand?: string | null;
  model?: string | null;
  price_current?: number | null;
  price_old?: number | null;
  currency?: string | null;
  offer_badge_ar?: string | null;
  image_primary?: string | null;
  valid_to?: string | null;
  created_at?: string | null;
  opening_status?: string | null;
  featured?: boolean | null;
  category?: string | null;
  stores?: {
    name_ar: string;
    slug: string;
    logo_url?: string | null;
    category?: string | null;
    opening_status?: string | null;
  } | null;
};

type Props = {
  offer: OpeningOfferRecord;
  cardId?: string;
  compact?: boolean;
  showStoreLink?: boolean;
  showAllStoreOffersCta?: boolean;
  directOfferHref?: string;
  directOfferLabel?: string;
};

function formatCurrency(value?: number | null, currency = "EGP") {
  if (typeof value !== "number") return null;
  if (currency === "EGP") return `${value.toLocaleString("ar-EG")} ج.م`;
  return `${value.toLocaleString("ar-EG")} ${currency}`;
}

function calculateDiscount(current?: number | null, old?: number | null) {
  if (!current || !old || old <= current) return null;
  return Math.round(((old - current) / old) * 100);
}

type CampaignState = { status: "expired" | "ending_soon" | "active" | "none"; label: string; days?: number };

function getCampaignState(validTo?: string | null): CampaignState {
  if (!validTo) return { status: "none", label: "" };
  const ts = new Date(validTo).getTime();
  if (isNaN(ts)) return { status: "none", label: "" };
  const remaining = ts - Date.now();
  if (remaining <= 0) return { status: "expired", label: "انتهت الحملة" };
  const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
  const hours = Math.floor(remaining / (60 * 60 * 1000));
  if (remaining <= 3 * 24 * 60 * 60 * 1000) {
    return {
      status: "ending_soon",
      label: days >= 1 ? `تنتهي خلال ${days} ${days === 1 ? "يوم" : "أيام"}` : `تنتهي خلال ${hours} ساعة`,
      days,
    };
  }
  return { status: "active", label: "" };
}

export function OpeningOfferCard({ offer, cardId, compact = false, showStoreLink = true, showAllStoreOffersCta = false, directOfferHref, directOfferLabel = "انتقل إلى العرض" }: Props) {
  const store = offer.stores;
  const discount = calculateDiscount(offer.price_current, offer.price_old);
  const priceNow = formatCurrency(offer.price_current, offer.currency ?? "EGP");
  const priceOld = formatCurrency(offer.price_old, offer.currency ?? "EGP");
  const validTo = offer.valid_to ? new Date(offer.valid_to) : null;
  const categoryLabel = offer.category ?? store?.category ?? "عروض الافتتاح";
  const primaryTitle = offer.model ?? offer.title_ar;
  const campaign = getCampaignState(offer.valid_to);
  const isExpired = campaign.status === "expired";
  const isEndingSoon = campaign.status === "ending_soon";
  const showOpenNowBadge = !!store && (offer.opening_status === "opening_soon" || store.opening_status === "opening_soon");

  // Compact-aware tokens — automatically shrink across all screens when compact=true
  const c = compact;
  const aspectClass = c ? "aspect-[16/10]" : "aspect-[4/3]";
  const bodyPadClass = c ? "p-3" : "p-4 md:p-5";
  const titleClass = c ? "text-[0.78rem] leading-snug line-clamp-2 min-h-[2.4em]" : "text-[0.95rem] leading-snug line-clamp-2 min-h-[2.4em]";
  const descClass = c ? "line-clamp-2 min-h-[2.4em] text-[0.68rem] leading-5 mt-1.5" : "line-clamp-2 min-h-[2.4em] text-[0.76rem] leading-7 mt-2";
  const priceNowClass = c ? "text-[0.95rem]" : "text-[1.08rem]";
  const priceOldClass = c ? "text-[0.68rem]" : "text-[0.74rem]";
  const priceBoxPad = c ? "p-2.5 mt-3" : "p-3.5 mt-4";
  const buttonHeight = c ? "h-9" : "h-10";
  const buttonText = c ? "text-[0.72rem]" : "text-[0.76rem]";
  const ctaText = c ? "text-[0.74rem]" : "text-[0.78rem]";
  const buttonsGap = c ? "mt-3 space-y-1.5" : "mt-4 space-y-2.5";
  const chipsGap = c ? "mt-2.5 gap-1.5" : "mt-4 gap-2";
  const discountBoxClass = c ? "px-2.5 py-1.5" : "px-3 py-2";
  const discountValueClass = c ? "text-[0.78rem]" : "text-[0.9rem]";
  const overlayLogoSize: "xs" | "sm" = c ? "xs" : "sm";
  const overlayPad = c ? "p-2" : "p-3";
  const overlayChipText = c ? "text-[0.6rem]" : "text-[0.64rem]";

  return (
    <article id={cardId} className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-premium)] scroll-mt-24 ${isExpired ? "border-destructive/40 opacity-90" : isEndingSoon ? "border-orange/40" : "border-border/70 hover:border-primary/25"}`}>
      <div className={`relative ${aspectClass} overflow-hidden border-b border-border/60 bg-gradient-to-br from-secondary/45 via-background to-muted/30 ${isExpired ? "grayscale" : ""}`}>
        {offer.image_primary ? (
          <>
            <img
              src={optimizeImageUrl(offer.image_primary, 480)}
              alt={offer.title_ar}
              className="absolute inset-0 h-full w-full object-contain p-3 transition-transform duration-700 ease-out group-hover:scale-[1.06]"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/55 via-transparent to-transparent opacity-90" />
            {discount && (
              <span className={`absolute top-2 left-2 z-10 rounded-lg bg-orange ${c ? "px-2 py-1 text-[0.66rem]" : "px-2.5 py-1 text-[0.74rem]"} font-bold text-orange-foreground shadow-[0_4px_12px_-2px_hsl(var(--orange)/0.5)]`}>
                خصم {discount}%
              </span>
            )}
          </>
        ) : (
          <div className={`flex h-full w-full flex-col justify-between bg-[var(--gradient-hero)] ${c ? "p-3" : "p-4"} text-primary-foreground`}>
            <div className="flex items-center justify-between gap-3">
              <span className={`rounded-full border border-primary-foreground/15 bg-primary-foreground/10 px-3 py-1 ${overlayChipText} font-semibold text-primary-foreground/85`}>
                {offer.offer_badge_ar ?? "عروض الافتتاح"}
              </span>
              {discount ? (
                <span className={`rounded-full border border-orange/20 bg-orange/15 px-3 py-1 ${overlayChipText} font-bold text-orange-foreground`}>
                  خصم {discount}%
                </span>
              ) : null}
            </div>
            <div>
              {offer.brand && (
                <p className={`mb-1 ${c ? "text-[0.66rem]" : "text-[0.72rem]"} font-medium text-primary-foreground/65`}>{offer.brand}</p>
              )}
              <h3 className={`line-clamp-2 ${c ? "text-[0.86rem]" : "text-[1rem]"} font-bold leading-snug text-primary-foreground`}>{primaryTitle}</h3>
              {offer.specs_short_ar && !c && (
                <p className="mt-2 line-clamp-3 text-[0.72rem] leading-6 text-primary-foreground/70">{offer.specs_short_ar}</p>
              )}
            </div>
          </div>
        )}

        <div className={`absolute inset-x-0 top-0 flex items-start justify-between gap-2 ${overlayPad}`}>
          <div className="flex flex-wrap items-center gap-1.5">
            {showOpenNowBadge && (
              <span className={`rounded-full border border-primary/20 bg-background/90 px-2.5 py-0.5 ${overlayChipText} font-bold text-primary backdrop-blur-sm`}>
                مفتوح الآن
              </span>
            )}
            <span className={`rounded-full border border-border/70 bg-background/90 px-2.5 py-0.5 ${overlayChipText} font-semibold text-foreground backdrop-blur-sm`}>
              {categoryLabel}
            </span>
          </div>
          {offer.featured && (
            <span className={`ms-auto rounded-full border border-primary/20 bg-background/90 px-2.5 py-0.5 ${overlayChipText} font-bold text-primary backdrop-blur-sm`}>
              مميز
            </span>
          )}
        </div>

        {store && (
          <div className={`absolute inset-x-0 bottom-0 ${overlayPad}`}>
            <div className={`flex items-center gap-2.5 rounded-2xl border border-border/70 bg-background/92 ${c ? "px-2.5 py-1.5" : "px-3 py-2.5"} shadow-[var(--shadow-soft)] backdrop-blur-sm`}>
              <TenantLogo
                src={getVerifiedLogoUrl(store.slug, store.logo_url)}
                alt={store.name_ar}
                fallbackName={store.name_ar}
                size={overlayLogoSize}
                rounded="lg"
              />
              <div className="min-w-0">
                <p className={`truncate ${c ? "text-[0.7rem]" : "text-[0.76rem]"} font-bold text-foreground`}>{store.name_ar}</p>
                <p className={`truncate ${c ? "text-[0.62rem]" : "text-[0.66rem]"} text-muted-foreground`}>{categoryLabel}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={`flex flex-1 flex-col ${bodyPadClass}`}>
        <div className="mb-1.5 flex items-start justify-between gap-3">
          <div className="min-w-0">
            {offer.brand && <p className={`mb-1 ${c ? "text-[0.62rem]" : "text-[0.68rem]"} font-semibold text-muted-foreground`}>{offer.brand}</p>}
            <h3 className={`font-bold text-foreground ${titleClass}`}>
              {offer.title_ar}
            </h3>
          </div>
          {discount && (
            <div className={`shrink-0 rounded-xl border border-orange/20 bg-orange/10 ${discountBoxClass} text-center`}>
              <p className={`${c ? "text-[0.58rem]" : "text-[0.62rem]"} font-semibold text-muted-foreground`}>الخصم</p>
              <p className={`${discountValueClass} font-bold text-orange`}>{discount}%</p>
            </div>
          )}
        </div>

        {(offer.specs_short_ar || offer.description_ar) && (
          <p className={`text-muted-foreground ${descClass}`}>
            {offer.specs_short_ar ?? offer.description_ar}
          </p>
        )}

        {(offer.offer_badge_ar || categoryLabel) && (
          <div className={`flex flex-wrap items-center ${chipsGap}`}>
            {offer.offer_badge_ar && (
              <span className={`rounded-full border border-primary/15 bg-primary/5 px-2 py-0.5 ${c ? "text-[0.6rem]" : "text-[0.64rem]"} font-semibold text-primary`}>
                {offer.offer_badge_ar}
              </span>
            )}
            {!c && (
              <span className="rounded-full border border-border/70 bg-secondary/60 px-2.5 py-1 text-[0.64rem] font-medium text-foreground">
                {categoryLabel}
              </span>
            )}
          </div>
        )}

        <div className={`mt-auto rounded-2xl border border-border/60 bg-secondary/35 ${priceBoxPad}`}>
          <div className="flex items-end justify-between gap-3">
            <div>
              {priceNow && <p className={`${priceNowClass} font-bold text-primary`}>{priceNow}</p>}
              {priceOld && <p className={`mt-0.5 ${priceOldClass} text-muted-foreground line-through`}>{priceOld}</p>}
            </div>
            {discount && (
              <div className={`flex items-center gap-1 rounded-full border border-orange/20 bg-background ${c ? "px-2 py-1 text-[0.62rem]" : "px-3 py-1.5 text-[0.68rem]"} font-bold text-orange`}>
                <Tag className="h-3 w-3" />
                وفر {discount}%
              </div>
            )}
          </div>
          {validTo && !c && (
            <div className="mt-2 flex items-center gap-1.5 text-[0.68rem] text-muted-foreground">
              <Clock3 className="h-3 w-3" />
              <span>حتى {validTo.toLocaleDateString("ar-EG")}</span>
            </div>
          )}
        </div>

        <div className={buttonsGap}>
          {directOfferHref && (
            <Link to={directOfferHref} className="block">
              <Button variant="outline-blue" className={`${buttonHeight} w-full rounded-xl ${buttonText} font-bold gap-1.5 justify-between overflow-hidden`}>
                <span className="truncate">{directOfferLabel}</span>
                <Tag className="h-3.5 w-3.5 shrink-0" />
              </Button>
            </Link>
          )}
          {showStoreLink && store && (
            <Link to={`/stores/${store.slug}`} className="block">
              <Button variant="cta" className={`${buttonHeight} w-full rounded-xl ${ctaText} font-bold gap-1.5`}>
                انتقل إلى صفحة المتجر <ArrowLeft className="h-3.5 w-3.5" />
              </Button>
            </Link>
          )}
          {showAllStoreOffersCta && store && (
            <Link to={`/daily-deals?merchant=${store.slug}`} className="block">
              <Button variant="outline-blue" className={`${buttonHeight} w-full rounded-xl ${buttonText} font-bold gap-1.5`}>
                شاهد كل عروض هذا المحل <Store className="h-3.5 w-3.5" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

export function OfferMetaLine({ count, label }: { count: number; label: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card px-4 py-3 shadow-[var(--shadow-soft)]">
      <p className="text-[1.05rem] font-bold text-foreground">{count.toLocaleString("ar-EG")}</p>
      <p className="mt-1 text-[0.68rem] text-muted-foreground">{label}</p>
    </div>
  );
}
