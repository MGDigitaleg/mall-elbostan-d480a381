import { Link } from "react-router-dom";
import { ArrowLeft, Clock3, Store, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TenantLogo } from "@/components/TenantLogo";
import { getVerifiedLogoUrl } from "@/lib/tenantLogoRegistry";

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
  compact?: boolean;
  showStoreLink?: boolean;
  showAllStoreOffersCta?: boolean;
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

export function OpeningOfferCard({ offer, compact = false, showStoreLink = true, showAllStoreOffersCta = false }: Props) {
  const store = offer.stores;
  const discount = calculateDiscount(offer.price_current, offer.price_old);
  const priceNow = formatCurrency(offer.price_current, offer.currency ?? "EGP");
  const priceOld = formatCurrency(offer.price_old, offer.currency ?? "EGP");
  const validTo = offer.valid_to ? new Date(offer.valid_to) : null;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[var(--shadow-premium)]">
      <div className="relative aspect-[4/3] overflow-hidden border-b border-border/60 bg-muted/30">
        {offer.image_primary ? (
          <img
            src={offer.image_primary}
            alt={offer.title_ar}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full flex-col justify-between bg-[var(--gradient-hero)] p-4 text-white">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[0.64rem] font-semibold text-white/85">
                {offer.offer_badge_ar ?? "عروض الافتتاح"}
              </span>
              {discount ? (
                <span className="rounded-full border border-orange-400/25 bg-orange-500/15 px-3 py-1 text-[0.68rem] font-bold text-orange-200">
                  خصم {discount}%
                </span>
              ) : null}
            </div>
            <div>
              {offer.brand && (
                <p className="mb-1 text-[0.72rem] font-medium text-white/55">{offer.brand}</p>
              )}
              <h3 className="text-[1rem] font-bold leading-snug text-white line-clamp-2">{offer.model ?? offer.title_ar}</h3>
              {offer.specs_short_ar && (
                <p className="mt-2 text-[0.72rem] leading-6 text-white/65 line-clamp-3">{offer.specs_short_ar}</p>
              )}
            </div>
          </div>
        )}

        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
          {(offer.opening_status === "opening_soon" || store?.opening_status === "opening_soon") && (
            <span className="rounded-full border border-orange-500/25 bg-background/90 px-3 py-1 text-[0.64rem] font-bold text-orange-600 backdrop-blur-sm">
              يفتتح قريبًا
            </span>
          )}
          {offer.featured && (
            <span className="ms-auto rounded-full border border-primary/20 bg-background/90 px-3 py-1 text-[0.64rem] font-bold text-primary backdrop-blur-sm">
              مميز
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 md:p-5">
        {store && (
          <div className="mb-3 flex items-center gap-3">
            <TenantLogo
              src={getVerifiedLogoUrl(store.slug, store.logo_url)}
              alt={store.name_ar}
              fallbackName={store.name_ar}
              size="sm"
              rounded="lg"
            />
            <div className="min-w-0">
              <p className="truncate text-[0.76rem] font-bold text-foreground">{store.name_ar}</p>
              <p className="text-[0.66rem] text-muted-foreground">{offer.category ?? store.category ?? "عروض افتتاح"}</p>
            </div>
          </div>
        )}

        <h3 className={`font-bold leading-snug text-foreground ${compact ? "text-[0.82rem]" : "text-[0.95rem]"}`}>
          {offer.title_ar}
        </h3>

        {(offer.specs_short_ar || offer.description_ar) && (
          <p className={`mt-2 text-muted-foreground ${compact ? "line-clamp-2 text-[0.7rem] leading-6" : "line-clamp-3 text-[0.76rem] leading-7"}`}>
            {offer.specs_short_ar ?? offer.description_ar}
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {offer.offer_badge_ar && (
            <span className="rounded-full border border-primary/15 bg-primary/5 px-2.5 py-1 text-[0.64rem] font-semibold text-primary">
              {offer.offer_badge_ar}
            </span>
          )}
          {discount && (
            <span className="rounded-full border border-orange-500/15 bg-orange-500/5 px-2.5 py-1 text-[0.64rem] font-semibold text-orange-600">
              وفر {discount}%
            </span>
          )}
        </div>

        <div className="mt-4 flex items-end justify-between gap-3 border-t border-border/60 pt-4">
          <div>
            {priceNow && <p className="text-[1rem] font-bold text-primary">{priceNow}</p>}
            {priceOld && <p className="mt-1 text-[0.72rem] text-muted-foreground line-through">{priceOld}</p>}
          </div>
          {validTo && !compact && (
            <div className="flex items-center gap-1.5 text-[0.68rem] text-muted-foreground">
              <Clock3 className="h-3 w-3" />
              <span>حتى {validTo.toLocaleDateString("ar-EG")}</span>
            </div>
          )}
        </div>

        <div className={`mt-4 ${compact ? "space-y-2" : "space-y-2.5"}`}>
          {showStoreLink && store && (
            <Link to={`/stores/${store.slug}`} className="block">
              <Button variant="cta" className="h-10 w-full rounded-xl text-[0.78rem] font-bold gap-1.5">
                صفحة المتجر <ArrowLeft className="h-3.5 w-3.5" />
              </Button>
            </Link>
          )}
          {showAllStoreOffersCta && store && (
            <Link to={`/daily-deals?merchant=${store.slug}`} className="block">
              <Button variant="outline-blue" className="h-10 w-full rounded-xl text-[0.76rem] font-bold gap-1.5">
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
