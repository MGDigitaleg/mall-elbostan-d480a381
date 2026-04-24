import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation, useParams, useSearchParams } from "react-router-dom";
import { Store, ArrowLeft, Clock3, LayoutGrid, ArrowDownUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { CountdownTimer } from "@/components/CountdownTimer";
import { useCountdown } from "@/hooks/useCountdown";
import { LoadingGrid, EmptyState } from "@/components/ui/loading-states";
import { Button } from "@/components/ui/button";
import { OpeningOfferCard, type OpeningOfferRecord } from "@/components/offers/OpeningOfferCard";
import { OfferSpotlightStrip } from "@/components/offers/OfferSpotlightStrip";

const LAUNCH_DATE = new Date("2026-05-01T00:00:00+02:00");
const PAGE_BATCH = 8;

const DailyDeals = () => {
  const { id: offerId } = useParams<{ id?: string }>();
  const { isExpired } = useCountdown(LAUNCH_DATE);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const activeMerchant = searchParams.get("merchant");

  const { data: deals, isLoading } = useQuery({
    queryKey: ["live-deals", activeMerchant],
    queryFn: async () => {
      let query = supabase
        .from("deals")
        .select("id, title_ar, description_ar, valid_to, featured, campaign_key, brand, model, specs_short_ar, price_current, price_old, currency, offer_badge_ar, image_primary, opening_status, sort_order, created_at, stores:store_id(name_ar, slug, logo_url, category, opening_status)")
        .eq("is_live", true)
        .eq("campaign_key", "opening-offers-2026")
        .order("featured", { ascending: false })
        .order("sort_order", { ascending: true });

      if (activeMerchant) query = query.eq("stores.slug", activeMerchant);

      const { data } = await query;
      return (data ?? []) as OpeningOfferRecord[];
    },
  });

  const merchantGroups = useMemo(() => {
    const map = new Map<string, { slug: string; name: string; count: number }>();
    (deals ?? []).forEach((deal) => {
      if (!deal.stores) return;
      const prev = map.get(deal.stores.slug);
      map.set(deal.stores.slug, {
        slug: deal.stores.slug,
        name: deal.stores.name_ar,
        count: (prev?.count ?? 0) + 1,
      });
    });
    return Array.from(map.values());
  }, [deals]);

  const liveOffersCount = deals?.length ?? 0;
  const merchantCount = merchantGroups.length;
  const openNowCount = (deals ?? []).filter((deal) => deal.opening_status === "opening_soon").length;

  type SortKey = "newest" | "strongest" | "expiring";
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [visibleCount, setVisibleCount] = useState(PAGE_BATCH);

  const discountPct = (d: OpeningOfferRecord) => {
    const cur = Number(d.price_current ?? 0);
    const old = Number(d.price_old ?? 0);
    if (!cur || !old || old <= cur) return 0;
    return ((old - cur) / old) * 100;
  };

  const sortOffers = (list: OpeningOfferRecord[]) => {
    const arr = [...list];
    if (sortKey === "newest") {
      arr.sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime());
    } else if (sortKey === "strongest") {
      arr.sort((a, b) => discountPct(b) - discountPct(a));
    } else if (sortKey === "expiring") {
      const far = Number.POSITIVE_INFINITY;
      arr.sort((a, b) => {
        const av = a.valid_to ? new Date(a.valid_to).getTime() : far;
        const bv = b.valid_to ? new Date(b.valid_to).getTime() : far;
        return av - bv;
      });
    }
    return arr;
  };

  // Spotlight: top 3 (featured first, then strongest discount)
  const spotlightOffers = useMemo(() => {
    const all = deals ?? [];
    const featured = all.filter((d) => d.featured);
    const rest = all
      .filter((d) => !d.featured)
      .sort((a, b) => discountPct(b) - discountPct(a));
    return [...featured, ...rest].slice(0, 3);
  }, [deals]);

  const spotlightIds = useMemo(() => new Set(spotlightOffers.map((o) => o.id)), [spotlightOffers]);

  const sortedAllDeals = useMemo(() => sortOffers(deals ?? []), [deals, sortKey]);
  // Grid excludes spotlight to avoid duplication
  const gridDeals = useMemo(
    () => sortedAllDeals.filter((d) => !spotlightIds.has(d.id)),
    [sortedAllDeals, spotlightIds],
  );
  const visibleDeals = gridDeals.slice(0, visibleCount);
  const remaining = Math.max(0, gridDeals.length - visibleCount);

  const sectionTitle = isExpired ? "كل عروض الافتتاح" : "كل العروض الحالية";
  const targetOfferId = offerId ?? location.hash.replace("#offer-", "").replace("#", "");

  useEffect(() => {
    if (!targetOfferId || isLoading || !deals?.length) return;
    const targetId = `offer-${targetOfferId}`;
    const scrollToOffer = () => {
      const target = document.getElementById(targetId);
      if (!target) return false;
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      return true;
    };
    if (scrollToOffer()) return;
    const timeoutId = window.setTimeout(scrollToOffer, 180);
    return () => window.clearTimeout(timeoutId);
  }, [targetOfferId, deals, isLoading]);

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: "newest", label: "الأحدث" },
    { key: "strongest", label: "الأقوى" },
    { key: "expiring", label: "الأقرب لانتهاء العرض" },
  ];

  return (
    <MainLayout>
      <SEOHead
        title="عروض الافتتاح | مول البستان"
        titleEn="Opening Offers | Mall Elbostan"
        description="عروض الافتتاح من المحلات الجديدة في مول البستان، مع ربط مباشر بكل متجر داخل المنظومة الرسمية للمول."
        descriptionEn="Opening offers from participating new tenants at Mall Elbostan, linked directly to each store inside the mall system."
        keywords="عروض الافتتاح, عروض مول البستان, Infinity Computer Services, Kareem Stores, خصومات لابتوب, إكسسوارات تصوير, mall offers"
        breadcrumbs={[{ name: "عروض الافتتاح", url: "/daily-deals" }]}
        noIndex={!deals || deals.length === 0}
      />

      {/* Compact hero */}
      <section dir="rtl" className="relative overflow-hidden border-b border-border/40" style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute inset-0 opacity-[0.08]" style={{ background: "radial-gradient(circle at top right, hsl(var(--primary) / 0.45), transparent 35%)" }} />
        <div className="container relative py-5 md:py-6">
          <div className="flex flex-col gap-3 text-right">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.66rem] font-semibold text-white/75">
                {isExpired ? <LayoutGrid className="h-3 w-3" /> : <Clock3 className="h-3 w-3" />}
                {isExpired ? "العروض متاحة الآن" : "افتتاح تجريبي"}
              </span>
              {!isExpired && (
                <div className="hidden md:block">
                  <CountdownTimer compact />
                </div>
              )}
            </div>

            <h1 className="text-[1.25rem] font-bold leading-tight text-white md:text-[1.6rem]" style={{ fontFamily: "var(--font-arabic-display)" }}>
              {isExpired ? "عروض المحلات المشاركة داخل مول البستان" : "عروض المحلات المشاركة متاحة الآن"}
            </h1>

            {/* Inline stats pills */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[0.72rem] text-white/80">
              <span className="inline-flex items-center gap-1.5">
                <Store className="h-3.5 w-3.5 text-white/60" />
                <strong className="font-bold text-white">{merchantCount.toLocaleString("ar-EG")}</strong>
                <span className="text-white/60">محلات مشاركة</span>
              </span>
              <span className="h-1 w-1 rounded-full bg-white/30" />
              <span className="inline-flex items-center gap-1.5">
                <strong className="font-bold text-white">{liveOffersCount.toLocaleString("ar-EG")}</strong>
                <span className="text-white/60">عروض متاحة</span>
              </span>
              <span className="h-1 w-1 rounded-full bg-white/30" />
              <span className="inline-flex items-center gap-1.5">
                <strong className="font-bold text-white">{openNowCount.toLocaleString("ar-EG")}</strong>
                <span className="text-white/60">مفتوحة الآن</span>
              </span>
            </div>

            {!isExpired && (
              <div className="md:hidden">
                <CountdownTimer compact />
              </div>
            )}
          </div>
        </div>
      </section>

      <div dir="rtl" className="container space-y-6 py-5 md:py-6">
        {isLoading ? (
          <LoadingGrid />
        ) : !deals || deals.length === 0 ? (
          <EmptyState title="لا توجد عروض افتتاح منشورة حالياً" description="سيتم عرض عروض المحلات الجديدة هنا فور تجهيزها وربطها بصفحات المتاجر." />
        ) : (
          <>
            {/* Spotlight Strip — replaces the old large preview section */}
            {spotlightOffers.length > 0 && <OfferSpotlightStrip offers={spotlightOffers} />}

            {/* Sticky filter + sort bar */}
            <div className="sticky top-16 z-20 -mx-4 border-b border-border/50 bg-background/95 px-4 py-2.5 backdrop-blur supports-[backdrop-filter]:bg-background/80">
              <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between">
                {merchantGroups.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
                    <Link to="/daily-deals">
                      <Button variant={activeMerchant ? "outline-blue" : "cta"} className="h-8 rounded-full px-3 text-[0.7rem] font-bold">
                        الكل
                      </Button>
                    </Link>
                    {merchantGroups.map((m) => (
                      <Link key={m.slug} to={`/daily-deals?merchant=${m.slug}`}>
                        <Button variant={activeMerchant === m.slug ? "cta" : "outline-blue"} className="h-8 rounded-full px-3 text-[0.7rem] font-bold">
                          {m.name} ({m.count.toLocaleString("ar-EG")})
                        </Button>
                      </Link>
                    ))}
                  </div>
                )}
                <div
                  role="group"
                  aria-label="ترتيب العروض"
                  className="inline-flex shrink-0 items-center gap-1 self-start rounded-full border border-border/70 bg-card p-1 shadow-sm lg:self-auto"
                >
                  <span className="hidden items-center gap-1 px-2 text-[0.62rem] font-semibold text-muted-foreground sm:inline-flex">
                    <ArrowDownUp className="h-3 w-3" /> ترتيب
                  </span>
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setSortKey(opt.key)}
                      aria-pressed={sortKey === opt.key}
                      className={`h-7 rounded-full px-3 text-[0.66rem] font-bold transition-colors ${
                        sortKey === opt.key
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Unified grid */}
            <section id="opening-offers-grid">
              <div className="mb-3 flex items-end justify-between gap-3">
                <h2 className="text-[0.95rem] font-bold text-foreground">{sectionTitle}</h2>
                <span className="text-[0.66rem] text-muted-foreground">
                  {gridDeals.length.toLocaleString("ar-EG")} عرض
                </span>
              </div>

              {visibleDeals.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {visibleDeals.map((deal) => (
                      <OpeningOfferCard
                        key={deal.id}
                        cardId={`offer-${deal.id}`}
                        offer={deal}
                        showAllStoreOffersCta
                        compact
                      />
                    ))}
                  </div>
                  {remaining > 0 && (
                    <div className="mt-5 flex justify-center">
                      <Button
                        variant="outline-blue"
                        className="h-9 rounded-xl px-5 text-[0.74rem] font-bold"
                        onClick={() => setVisibleCount((v) => v + PAGE_BATCH)}
                      >
                        عرض المزيد ({remaining.toLocaleString("ar-EG")})
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="rounded-2xl border border-border/70 bg-muted/20 p-6 text-center text-[0.78rem] text-muted-foreground">
                  جميع العروض المميّزة معروضة في الأعلى. تصفّح المحلات للمزيد.
                  <div className="mt-3">
                    <Link to="/stores">
                      <Button variant="outline-blue" className="h-9 rounded-xl px-4 text-[0.74rem] font-bold gap-1.5">
                        استعرض المحلات <ArrowLeft className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default DailyDeals;
