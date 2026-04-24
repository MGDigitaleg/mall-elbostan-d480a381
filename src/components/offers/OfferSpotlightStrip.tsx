import { Link } from "react-router-dom";
import { ArrowLeft, Flame, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TenantLogo } from "@/components/TenantLogo";
import { getVerifiedLogoUrl } from "@/lib/tenantLogoRegistry";
import { optimizeImageUrl } from "@/lib/imageUtils";
import type { OpeningOfferRecord } from "./OpeningOfferCard";

function formatCurrency(value?: number | null, currency = "EGP") {
  if (typeof value !== "number") return null;
  if (currency === "EGP") return `${value.toLocaleString("ar-EG")} ج.م`;
  return `${value.toLocaleString("ar-EG")} ${currency}`;
}

function calculateDiscount(current?: number | null, old?: number | null) {
  if (!current || !old || old <= current) return null;
  return Math.round(((old - current) / old) * 100);
}

type Props = {
  offers: OpeningOfferRecord[];
};

export function OfferSpotlightStrip({ offers }: Props) {
  if (!offers.length) return null;

  return (
    <section dir="rtl" aria-label="أبرز عروض الافتتاح">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[0.82rem] font-bold text-foreground">
          <Flame className="h-4 w-4 text-orange" />
          أبرز العروض الآن
        </div>
        <span className="text-[0.66rem] text-muted-foreground">{offers.length.toLocaleString("ar-EG")} عرض مميّز</span>
      </div>

      <div className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2 md:grid md:grid-cols-2 md:gap-3 md:overflow-visible lg:grid-cols-3">
        {offers.map((offer) => {
          const store = offer.stores;
          const discount = calculateDiscount(offer.price_current, offer.price_old);
          const priceNow = formatCurrency(offer.price_current, offer.currency ?? "EGP");
          const priceOld = formatCurrency(offer.price_old, offer.currency ?? "EGP");
          const optimized = offer.image_primary ? optimizeImageUrl(offer.image_primary, 280) : null;

          return (
            <article
              key={offer.id}
              className="group flex w-[300px] shrink-0 snap-start overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[var(--shadow-premium)] md:w-auto"
            >
              {/* Image side */}
              <div className="relative w-[42%] shrink-0 overflow-hidden bg-gradient-to-br from-secondary/40 to-muted/20">
                {optimized ? (
                  <img
                    src={optimized}
                    alt={offer.title_ar}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-contain p-2 transition-transform duration-700 group-hover:scale-[1.06]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[0.7rem] text-muted-foreground">
                    {offer.brand ?? "صورة العرض"}
                  </div>
                )}
                {discount && (
                  <span className="absolute right-1.5 top-1.5 rounded-md bg-orange px-2 py-0.5 text-[0.66rem] font-bold text-orange-foreground shadow-md">
                    -{discount}%
                  </span>
                )}
              </div>

              {/* Info side */}
              <div className="flex min-w-0 flex-1 flex-col p-3">
                {store && (
                  <div className="mb-1.5 flex items-center gap-1.5">
                    <TenantLogo
                      src={getVerifiedLogoUrl(store.slug, store.logo_url)}
                      alt={store.name_ar}
                      fallbackName={store.name_ar}
                      size="xs"
                      rounded="md"
                    />
                    <span className="truncate text-[0.62rem] font-semibold text-muted-foreground">{store.name_ar}</span>
                  </div>
                )}
                <h3 className="line-clamp-2 text-[0.78rem] font-bold leading-snug text-foreground">{offer.title_ar}</h3>

                <div className="mt-auto pt-2">
                  {priceNow && <p className="text-[0.95rem] font-bold text-primary">{priceNow}</p>}
                  {priceOld && <p className="text-[0.66rem] text-muted-foreground line-through">{priceOld}</p>}
                </div>

                {store && (
                  <Link to={`/stores/${store.slug}#offer-${offer.id}`} className="mt-2 block">
                    <Button variant="cta" className="h-8 w-full rounded-lg text-[0.7rem] font-bold gap-1">
                      <Tag className="h-3 w-3" />
                      اذهب للعرض
                      <ArrowLeft className="h-3 w-3" />
                    </Button>
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
