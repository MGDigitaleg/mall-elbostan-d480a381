import { Link } from "react-router-dom";
import { Store } from "lucide-react";
import { OffersPrimaryCta, OffersSecondaryCta, OffersCtaGroup } from "@/components/offers/OffersCtaButtons";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Reveal } from "@/components/home/Reveal";
import { OpeningOfferCard, type OpeningOfferRecord } from "@/components/offers/OpeningOfferCard";
import { useCountdown } from "@/hooks/useCountdown";

const LAUNCH_DATE = new Date("2026-05-15T00:00:00+02:00");

export function DealsTeaser() {
  const { isExpired } = useCountdown(LAUNCH_DATE);
  const { data: deals, isLoading } = useQuery({
    queryKey: ["home-deals"],
    queryFn: async () => {
      const { data } = await supabase
        .from("deals")
        .select("id, title_ar, description_ar, valid_to, featured, brand, model, specs_short_ar, price_current, price_old, currency, offer_badge_ar, image_primary, opening_status, stores:store_id(name_ar, slug, logo_url, category, opening_status)")
        .eq("campaign_key", "opening-offers-2026")
        .eq("is_live", true)
        .order("featured", { ascending: false })
        .order("sort_order", { ascending: true })
        .limit(3);
      return (data ?? []) as OpeningOfferRecord[];
    },
  });

  const hasDeals = !isLoading && deals && deals.length > 0;
  const teaserDeals = deals?.slice(0, 3) ?? [];

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #071326 0%, #0D1F3C 50%, #071326 100%)",
        paddingTop: "clamp(16px, 2vw, 28px)",
        paddingBottom: "clamp(16px, 2vw, 28px)",
      }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[280px] h-[280px] rounded-full opacity-[0.025]"
          style={{ background: "radial-gradient(circle, #F97316 0%, transparent 70%)" }}
        />
      </div>

      <div className="container relative">
        <Reveal rootMargin="-60px" offset={12}>
          <div className="mb-2.5 flex flex-wrap items-end justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[0.58rem] font-bold tracking-[0.06em] mb-0.5 uppercase" style={{ color: "#FDBA74" }}>
                عروض مختارة
              </p>
              <h2
                className="text-[0.8rem] md:text-[0.9rem] font-extrabold leading-[1.25]"
                style={{ fontFamily: "var(--font-arabic-display)", color: "#FFFFFF" }}
              >
                {isExpired ? "مختارات من العروض." : "معاينات العروض."}
              </h2>
            </div>
            <OffersCtaGroup>
              <OffersPrimaryCta to="/daily-deals" label="افتح صفحة العروض" placement="home_deals_teaser" />
              <OffersSecondaryCta to="/daily-deals" label="جميع العروض" hiddenOnMobile placement="home_deals_teaser" />
            </OffersCtaGroup>
          </div>

          {/* Single-row offer teaser */}
          <div>
            {isLoading ? (
              <div className="grid gap-2.5 grid-cols-1 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="rounded-xl p-3 space-y-2" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <Skeleton className="h-3 w-1/3 bg-white/10" />
                    <Skeleton className="h-4 w-3/4 bg-white/10" />
                    <Skeleton className="h-3 w-full bg-white/10" />
                  </div>
                ))}
              </div>
            ) : hasDeals ? (
              <div className="-mx-4 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-2.5 sm:overflow-visible sm:px-0 sm:pb-0 items-stretch sm:auto-rows-fr [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {teaserDeals.map((deal) => (
                  <div
                    key={deal.id}
                    className="snap-start shrink-0 basis-[82%] xs:basis-[72%] sm:basis-auto sm:shrink h-full flex rounded-xl overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <OpeningOfferCard offer={deal} compact showAllStoreOffersCta={false} />
                  </div>
                ))}
              </div>
            ) : (
              /* Pre-launch state — slim */
              <div className="flex items-center justify-center gap-3 rounded-xl p-4 text-center" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <Store className="h-5 w-5 shrink-0" style={{ color: "#F97316", opacity: 0.5 }} />
                <p className="text-[0.74rem] leading-[1.5]" style={{ color: "#CBD5E1" }}>
                  العروض قيد الإعداد —
                </p>
                <Link to="/daily-deals">
                  <Button
                    className="h-8 rounded-lg px-3 text-[0.72rem] font-bold"
                    style={{ background: "#F97316", color: "#fff" }}
                  >
                    صفحة العروض
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
