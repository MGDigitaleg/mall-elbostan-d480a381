import { Link } from "react-router-dom";
import { ArrowLeft, Store, Zap, Gift, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Reveal } from "@/components/home/Reveal";
import { OpeningOfferCard, type OpeningOfferRecord } from "@/components/offers/OpeningOfferCard";

const PROMO_CARDS = [
  {
    icon: Zap,
    title: "عروض الافتتاح",
    desc: "خصومات حصرية من محلات المول احتفالاً بالافتتاح الكبير.",
    color: "#F97316",
    to: "/daily-deals",
  },
  {
    icon: Gift,
    title: "أدر واربح",
    desc: "جوائز حقيقية من المحلات المشاركة — سجّل الآن.",
    color: "#2563EB",
    to: "/spin-win",
  },
  {
    icon: ShoppingBag,
    title: "منتجات مميزة",
    desc: "تصفّح أحدث المنتجات من محلات مول البستان.",
    color: "#06B6D4",
    to: "/products",
  },
];

export function DealsTeaser() {
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
        .limit(4);
      return (data ?? []) as OpeningOfferRecord[];
    },
  });

  const hasDeals = !isLoading && deals && deals.length > 0;

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #071326 0%, #0D1F3C 50%, #071326 100%)",
        paddingTop: "clamp(48px, 6vw, 96px)",
        paddingBottom: "clamp(48px, 6vw, 96px)",
      }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, #F97316 0%, transparent 70%)" }}
        />
      </div>

      <div className="container relative">
        <Reveal rootMargin="-60px" offset={12}>
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-[0.68rem] font-semibold tracking-[0.04em] mb-1.5" style={{ color: "#F97316" }}>
                عروض الافتتاح
              </p>
              <h2
                className="text-[1rem] md:text-[1.15rem] font-bold leading-[1.2]"
                style={{ fontFamily: "var(--font-arabic-display)", color: "#F8FAFC" }}
              >
                عروض الافتتاح من المحلات الجديدة.
              </h2>
              <p className="mt-2 max-w-xl text-[0.76rem] leading-[1.8]" style={{ color: "#94A3B8" }}>
                معاينة مختارة لعروض المحلات المشاركة في افتتاح مول البستان، مع ربط مباشر بكل متجر داخل المنظومة الرسمية للمول.
              </p>
            </div>
            <Link to="/daily-deals" className="hidden lg:inline-flex shrink-0">
              <Button
                variant="ghost"
                className="gap-1.5 text-[0.78rem] font-bold"
                style={{ color: "#60A5FA" }}
              >
                جميع العروض <ArrowLeft className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          {/* Layout: promo banner + deal cards */}
          <div className="grid gap-4 lg:grid-cols-[1fr_1.6fr]">
            {/* Left: promo campaign cards */}
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {PROMO_CARDS.map((card) => (
                <Link
                  key={card.title}
                  to={card.to}
                  className="group flex items-start gap-3.5 rounded-xl p-4 transition-all duration-200 hover:bg-white/[0.04]"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
                    style={{ background: `${card.color}10`, border: `1px solid ${card.color}18` }}
                  >
                    <card.icon className="h-4 w-4" style={{ color: card.color }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[0.82rem] font-bold leading-snug" style={{ color: "#F1F5F9" }}>
                      {card.title}
                    </p>
                    <p className="mt-1 text-[0.7rem] leading-[1.6] line-clamp-2" style={{ color: "#94A3B8" }}>
                      {card.desc}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

             {/* Right: opening offers */}
            <div>
              {isLoading ? (
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="rounded-xl p-4 space-y-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <Skeleton className="h-3 w-1/3 bg-white/10" />
                      <Skeleton className="h-4 w-3/4 bg-white/10" />
                      <Skeleton className="h-3 w-full bg-white/10" />
                    </div>
                  ))}
                </div>
              ) : hasDeals ? (
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                  {deals.map((deal) => (
                    <div key={deal.id} className="h-full rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <OpeningOfferCard offer={deal} compact showAllStoreOffersCta={false} />
                    </div>
                  ))}
                </div>
              ) : (
                /* Pre-launch state */
                <div className="flex flex-col items-center justify-center rounded-xl p-8 text-center" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", minHeight: "280px" }}>
                  <Store className="mb-3 h-8 w-8" style={{ color: "#F97316", opacity: 0.4 }} />
                  <h3 className="text-[0.92rem] font-bold" style={{ color: "#F1F5F9" }}>
                    عروض الافتتاح قيد التجهيز
                  </h3>
                  <p className="mt-1.5 max-w-[18rem] text-[0.76rem] leading-[1.6]" style={{ color: "#94A3B8" }}>
                    سيتم عرض العروض المنظمة للمحلات المشاركة هنا فور اكتمال ربطها بصفحات المتاجر.
                  </p>
                  <Link to="/daily-deals" className="mt-4">
                    <Button
                      className="h-9 rounded-xl px-5 text-[0.78rem] font-bold"
                      style={{ background: "#F97316", color: "#fff" }}
                    >
                      صفحة العروض
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 flex justify-center lg:hidden">
            <Link to="/daily-deals">
              <Button
                className="h-9 rounded-xl px-5 text-[0.78rem] font-bold gap-1.5"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#CBD5E1" }}
              >
                جميع العروض <ArrowLeft className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
