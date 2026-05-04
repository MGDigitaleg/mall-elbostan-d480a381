import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation, useParams, useSearchParams } from "react-router-dom";
import { Store, ArrowLeft, Clock3, LayoutGrid, ArrowDownUp, Tag, Heart, Scale } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead, buildCollectionPageLd } from "@/components/SEOHead";
import { useCountdown } from "@/hooks/useCountdown";
import { LoadingGrid, EmptyState } from "@/components/ui/loading-states";
import { Button } from "@/components/ui/button";
import { OpeningOfferCard, type OpeningOfferRecord } from "@/components/offers/OpeningOfferCard";
import { OfferSpotlightStrip } from "@/components/offers/OfferSpotlightStrip";
import { OfferCollectionsDrawer } from "@/components/offers/OfferCollectionsDrawer";
import { OfferCardSkeletonGrid, OfferHeroSkeleton } from "@/components/offers/OfferCardSkeleton";
import { SearchX, RotateCcw } from "lucide-react";
import { useOfferCollections } from "@/hooks/useOfferCollections";
import { trackSeoLinkClick } from "@/lib/analytics";

const LAUNCH_DATE = new Date("2026-05-15T00:00:00+02:00");
const PAGE_BATCH = 12;

const DailyDeals = () => {
  const { id: offerId } = useParams<{ id?: string }>();
  const { isExpired } = useCountdown(LAUNCH_DATE);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const activeMerchant = searchParams.get("merchant");
  const activeCategory = searchParams.get("category");

  const { data: allDeals, isLoading } = useQuery({
    queryKey: ["live-deals-all"],
    queryFn: async () => {
      const { data } = await supabase
        .from("deals")
        .select("id, title_ar, description_ar, valid_to, featured, campaign_key, brand, model, specs_short_ar, price_current, price_old, currency, offer_badge_ar, image_primary, opening_status, sort_order, created_at, stores:store_id(name_ar, slug, logo_url, category, opening_status)")
        .eq("is_live", true)
        .eq("campaign_key", "opening-offers-2026")
        .order("featured", { ascending: false })
        .order("sort_order", { ascending: true });
      return (data ?? []) as OpeningOfferRecord[];
    },
  });

  // Filtered set (merchant + category) — used for the grid
  const deals = useMemo(() => {
    let list = allDeals ?? [];
    if (activeMerchant) list = list.filter((d) => d.stores?.slug === activeMerchant);
    if (activeCategory) list = list.filter((d) => (d.stores?.category ?? "") === activeCategory);
    return list;
  }, [allDeals, activeMerchant, activeCategory]);

  // Always derived from full set so chips remain stable
  const merchantGroups = useMemo(() => {
    const map = new Map<string, { slug: string; name: string; count: number }>();
    (allDeals ?? []).forEach((deal) => {
      if (!deal.stores) return;
      const prev = map.get(deal.stores.slug);
      map.set(deal.stores.slug, {
        slug: deal.stores.slug,
        name: deal.stores.name_ar,
        count: (prev?.count ?? 0) + 1,
      });
    });
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [allDeals]);

  const categoryGroups = useMemo(() => {
    const map = new Map<string, number>();
    (allDeals ?? []).forEach((deal) => {
      const c = deal.stores?.category;
      if (!c) return;
      map.set(c, (map.get(c) ?? 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [allDeals]);

  const setFilter = (key: "merchant" | "category", value: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next, { replace: true });
  };


  const resetAll = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("merchant");
    next.delete("category");
    setSearchParams(next, { replace: true });
  };

  const liveOffersCount = allDeals?.length ?? 0;
  const merchantCount = merchantGroups.length;
  const openNowCount = (allDeals ?? []).filter((deal) => deal.opening_status === "opening_soon").length;

  type SortKey = "newest" | "discount" | "expiring";
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [visibleCount, setVisibleCount] = useState(PAGE_BATCH);

  // Reset pagination whenever sorting or filters change so users always see the
  // first page of the new ordering instead of a sliced middle.
  useEffect(() => {
    setVisibleCount(PAGE_BATCH);
  }, [sortKey, activeMerchant, activeCategory]);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const { favorites, compare } = useOfferCollections();
  const savedCount = favorites.length + compare.length;

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
    } else if (sortKey === "discount") {
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
    { key: "discount", label: "الأعلى خصمًا" },
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
        <div className="container relative py-3.5 md:py-4">
          <div className="flex flex-col gap-2 text-right">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.62rem] font-semibold text-white/75">
                <LayoutGrid className="h-3 w-3" />
                {isExpired ? "العروض متاحة الآن" : "العروض متاحة — تصفّح وقارن"}
              </span>
              {!isExpired && (
                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[0.58rem] font-medium text-white/55">
                  <Clock3 className="h-2.5 w-2.5" />
                  دعم: افتتاح رسمي ١٥ مايو ٢٠٢٦
                </span>
              )}
            </div>

            <h1 className="text-[1.1rem] font-bold leading-tight text-white md:text-[1.4rem]" style={{ fontFamily: "var(--font-arabic-display)" }}>
              عروض المحلات المشاركة داخل مول البستان
            </h1>

            {/* Inline stats pills */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.68rem] text-white/80">
              <span className="inline-flex items-center gap-1.5">
                <Store className="h-3.5 w-3.5 text-white/60" />
                <strong className="font-bold text-white">{merchantCount.toLocaleString("ar-EG")}</strong>
                <span className="text-white/60">محلات</span>
              </span>
              <span className="h-1 w-1 rounded-full bg-white/30" />
              <span className="inline-flex items-center gap-1.5">
                <strong className="font-bold text-white">{liveOffersCount.toLocaleString("ar-EG")}</strong>
                <span className="text-white/60">عرض</span>
              </span>
              <span className="h-1 w-1 rounded-full bg-white/30" />
              <span className="inline-flex items-center gap-1.5">
                <strong className="font-bold text-white">{openNowCount.toLocaleString("ar-EG")}</strong>
                <span className="text-white/60">مفتوحة الآن</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <div dir="rtl" className="container space-y-4 py-4 md:py-5">
        {isLoading ? (
          <div className="space-y-4">
            <OfferHeroSkeleton />
            <OfferCardSkeletonGrid count={8} />
          </div>
        ) : !allDeals || allDeals.length === 0 ? (
          <EmptyState title="لا توجد عروض افتتاح منشورة حالياً" description="سيتم عرض عروض المحلات الجديدة هنا فور تجهيزها وربطها بصفحات المتاجر." />
        ) : (
          <>
            {/* Spotlight Strip — top picks (always from full set, ignores filters) */}
            {spotlightOffers.length > 0 && !activeMerchant && !activeCategory && (
              <OfferSpotlightStrip offers={spotlightOffers} />
            )}

            {/* Sticky filter + sort bar */}
            <div className="sticky top-16 z-20 -mx-4 space-y-2 border-b border-border/50 bg-background/95 px-4 py-2.5 backdrop-blur supports-[backdrop-filter]:bg-background/80">
              {/* Merchant filter row */}
              {merchantGroups.length > 0 && (
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  <span className="inline-flex shrink-0 items-center gap-1 px-1 text-[0.6rem] font-semibold text-muted-foreground">
                    <Store className="h-3 w-3" /> المحل
                  </span>
                  <button
                    type="button"
                    onClick={() => setFilter("merchant", null)}
                    className={`h-7 shrink-0 rounded-full px-3 text-[0.66rem] font-bold transition-colors ${
                      !activeMerchant ? "bg-primary text-primary-foreground" : "border border-border/70 bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    الكل
                  </button>
                  {merchantGroups.map((m) => (
                    <button
                      key={m.slug}
                      type="button"
                      onClick={() => setFilter("merchant", activeMerchant === m.slug ? null : m.slug)}
                      className={`h-7 shrink-0 rounded-full px-3 text-[0.66rem] font-bold transition-colors ${
                        activeMerchant === m.slug ? "bg-primary text-primary-foreground" : "border border-border/70 bg-card text-foreground/80 hover:text-foreground"
                      }`}
                    >
                      {m.name} ({m.count.toLocaleString("ar-EG")})
                    </button>
                  ))}
                </div>
              )}

              {/* Category + Sort row */}
              <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                {categoryGroups.length > 0 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto">
                    <span className="inline-flex shrink-0 items-center gap-1 px-1 text-[0.6rem] font-semibold text-muted-foreground">
                      <Tag className="h-3 w-3" /> الفئة
                    </span>
                    <button
                      type="button"
                      onClick={() => setFilter("category", null)}
                      className={`h-7 shrink-0 rounded-full px-3 text-[0.66rem] font-bold transition-colors ${
                        !activeCategory ? "bg-primary text-primary-foreground" : "border border-border/70 bg-card text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      الكل
                    </button>
                    {categoryGroups.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setFilter("category", activeCategory === c.name ? null : c.name)}
                        className={`h-7 shrink-0 rounded-full px-3 text-[0.66rem] font-bold transition-colors ${
                          activeCategory === c.name ? "bg-primary text-primary-foreground" : "border border-border/70 bg-card text-foreground/80 hover:text-foreground"
                        }`}
                      >
                        {c.name} ({c.count.toLocaleString("ar-EG")})
                      </button>
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

              {/* Active filters summary — removable chips + reset all */}
              {(activeMerchant || activeCategory) && (() => {
                const merchantInfo = activeMerchant
                  ? merchantGroups.find((m) => m.slug === activeMerchant)
                  : null;
                const categoryInfo = activeCategory
                  ? categoryGroups.find((c) => c.name === activeCategory)
                  : null;
                const resetAll = () => {
                  const next = new URLSearchParams(searchParams);
                  next.delete("merchant");
                  next.delete("category");
                  setSearchParams(next, { replace: true });
                };
                return (
                  <div
                    role="region"
                    aria-label="الفلاتر النشطة"
                    className="flex flex-wrap items-center gap-2 rounded-lg border border-primary/20 bg-primary/[0.04] px-3 py-1.5"
                  >
                    <span className="text-[0.62rem] font-semibold text-muted-foreground">
                      الفلاتر النشطة:
                    </span>
                    <span className="text-[0.66rem] text-muted-foreground">
                      {gridDeals.length.toLocaleString("ar-EG")} عرض مطابق
                    </span>

                    {merchantInfo && (
                      <button
                        type="button"
                        onClick={() => setFilter("merchant", null)}
                        aria-label={`إزالة فلتر المحل: ${merchantInfo.name}`}
                        className="group inline-flex h-7 items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 text-[0.64rem] font-bold text-foreground transition-colors hover:bg-primary/20"
                      >
                        <Store className="h-3 w-3 opacity-70" aria-hidden="true" />
                        <span>المحل: {merchantInfo.name}</span>
                        <span className="rounded-full bg-background/60 px-1.5 text-[0.58rem] font-bold text-muted-foreground">
                          {merchantInfo.count.toLocaleString("ar-EG")}
                        </span>
                        <span className="text-[0.78rem] leading-none opacity-70 transition-opacity group-hover:opacity-100" aria-hidden="true">
                          ×
                        </span>
                      </button>
                    )}

                    {categoryInfo && (
                      <button
                        type="button"
                        onClick={() => setFilter("category", null)}
                        aria-label={`إزالة فلتر الفئة: ${categoryInfo.name}`}
                        className="group inline-flex h-7 items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 text-[0.64rem] font-bold text-foreground transition-colors hover:bg-primary/20"
                      >
                        <Tag className="h-3 w-3 opacity-70" aria-hidden="true" />
                        <span>الفئة: {categoryInfo.name}</span>
                        <span className="rounded-full bg-background/60 px-1.5 text-[0.58rem] font-bold text-muted-foreground">
                          {categoryInfo.count.toLocaleString("ar-EG")}
                        </span>
                        <span className="text-[0.78rem] leading-none opacity-70 transition-opacity group-hover:opacity-100" aria-hidden="true">
                          ×
                        </span>
                      </button>
                    )}

                    <div className="ms-auto flex items-center gap-1.5">
                      {activeMerchant && (
                        <Link to={`/stores/${activeMerchant}`}>
                          <Button variant="outline-blue" className="h-7 rounded-full px-3 text-[0.62rem] font-bold gap-1">
                            صفحة المحل <ArrowLeft className="h-3 w-3" />
                          </Button>
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={resetAll}
                        className="h-7 rounded-full border border-border/70 bg-card px-3 text-[0.62rem] font-bold text-muted-foreground transition-colors hover:text-foreground"
                      >
                        إعادة الضبط
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Unified grid */}
            <section id="opening-offers-grid">
              <div className="mb-3 flex items-end justify-between gap-3">
                <h2 className="text-[0.95rem] font-bold text-foreground">{sectionTitle}</h2>
                <span className="text-[0.66rem] text-muted-foreground" aria-live="polite">
                  عرض{" "}
                  <strong className="font-bold text-foreground">
                    {Math.min(visibleDeals.length, gridDeals.length).toLocaleString("ar-EG")}
                  </strong>{" "}
                  من {gridDeals.length.toLocaleString("ar-EG")}
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

                  {/* Pagination footer */}
                  <div className="mt-6 flex flex-col items-center gap-3">
                    {/* Progress bar */}
                    <div
                      className="h-1 w-full max-w-md overflow-hidden rounded-full bg-muted"
                      role="progressbar"
                      aria-valuemin={0}
                      aria-valuemax={gridDeals.length}
                      aria-valuenow={Math.min(visibleDeals.length, gridDeals.length)}
                      aria-label="نسبة العروض المعروضة"
                    >
                      <div
                        className="h-full rounded-full bg-primary transition-[width] duration-300"
                        style={{
                          width: `${Math.min(100, (visibleDeals.length / Math.max(1, gridDeals.length)) * 100)}%`,
                        }}
                      />
                    </div>

                    {remaining > 0 ? (
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        <Button
                          variant="cta"
                          className="h-10 rounded-xl px-5 text-[0.78rem] font-bold gap-1.5"
                          onClick={() => setVisibleCount((v) => v + PAGE_BATCH)}
                        >
                          تحميل المزيد
                          <span className="rounded-full bg-primary-foreground/15 px-2 py-0.5 text-[0.64rem] font-bold">
                            +{Math.min(PAGE_BATCH, remaining).toLocaleString("ar-EG")}
                          </span>
                        </Button>
                        {gridDeals.length > PAGE_BATCH * 2 && (
                          <Button
                            variant="outline-blue"
                            className="h-10 rounded-xl px-4 text-[0.74rem] font-bold"
                            onClick={() => setVisibleCount(gridDeals.length)}
                          >
                            عرض كل العروض ({gridDeals.length.toLocaleString("ar-EG")})
                          </Button>
                        )}
                      </div>
                    ) : (
                      gridDeals.length > PAGE_BATCH && (
                        <div className="flex flex-col items-center gap-1.5">
                          <p className="text-[0.7rem] font-semibold text-muted-foreground">
                            وصلت لنهاية العروض المتاحة
                          </p>
                          <Button
                            variant="ghost"
                            className="h-9 rounded-xl px-4 text-[0.72rem] font-semibold"
                            onClick={() => {
                              setVisibleCount(PAGE_BATCH);
                              document
                                .getElementById("opening-offers-grid")
                                ?.scrollIntoView({ behavior: "smooth", block: "start" });
                            }}
                          >
                            العودة إلى الأعلى
                          </Button>
                        </div>
                      )
                    )}
                  </div>
                </>
              ) : activeMerchant || activeCategory ? (
                (() => {
                  const merchantInfo = activeMerchant
                    ? merchantGroups.find((m) => m.slug === activeMerchant)
                    : null;
                  const categoryInfo = activeCategory
                    ? categoryGroups.find((c) => c.name === activeCategory)
                    : null;
                  return (
                    <div
                      role="status"
                      aria-live="polite"
                      className="relative overflow-hidden rounded-2xl border border-border/70 bg-card p-8 text-center shadow-[var(--shadow-soft)]"
                    >
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-border/60 bg-secondary/40">
                        <SearchX className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
                      </div>
                      <h3 className="mt-4 text-[1rem] font-bold text-foreground">
                        لا توجد عروض مطابقة للفلاتر الحالية
                      </h3>
                      <p className="mx-auto mt-2 max-w-md text-[0.8rem] leading-7 text-muted-foreground">
                        {merchantInfo && categoryInfo
                          ? `لا توجد عروض حالياً من «${merchantInfo.name}» ضمن فئة «${categoryInfo.name}». جرّب إزالة أحد الفلاتر أو استعراض كل العروض.`
                          : merchantInfo
                          ? `لا توجد عروض منشورة حالياً من «${merchantInfo.name}». ربما تكون مخزّنة أو قيد التحضير.`
                          : categoryInfo
                          ? `لا توجد عروض حالياً ضمن فئة «${categoryInfo.name}». جرّب فئة أخرى أو استعرض كل العروض.`
                          : "جرّب إزالة الفلاتر لرؤية كل العروض المتاحة."}
                      </p>

                      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                        <Button
                          variant="cta"
                          onClick={resetAll}
                          className="h-9 rounded-xl px-4 text-[0.74rem] font-bold gap-1.5"
                        >
                          <RotateCcw className="h-3.5 w-3.5" /> مسح كل الفلاتر
                        </Button>
                        {merchantInfo && (
                          <Link to={`/stores/${merchantInfo.slug}`}>
                            <Button variant="outline-blue" className="h-9 rounded-xl px-4 text-[0.74rem] font-bold gap-1.5">
                              صفحة {merchantInfo.name} <ArrowLeft className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                        )}
                        <Link to="/stores">
                          <Button variant="ghost" className="h-9 rounded-xl px-4 text-[0.74rem] font-semibold gap-1.5">
                            استعراض المحلات <ArrowLeft className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })()
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

      {/* Floating button — open saved offers / comparison drawer */}
      {(allDeals?.length ?? 0) > 0 && (
        <button
          type="button"
          onClick={() => setCollectionsOpen(true)}
          aria-label={`عرض العروض المحفوظة (${savedCount})`}
          className="fixed bottom-5 start-5 z-40 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary px-4 py-2.5 text-[0.74rem] font-bold text-primary-foreground shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
        >
          <Heart className="h-3.5 w-3.5" />
          <span>محفوظاتي</span>
          {favorites.length > 0 && (
            <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-rose-500 px-1.5 text-[0.62rem] font-bold text-white">
              {favorites.length.toLocaleString("ar-EG")}
            </span>
          )}
          {compare.length > 0 && (
            <span className="inline-flex h-5 items-center gap-0.5 rounded-full bg-background/20 px-1.5 text-[0.62rem] font-bold text-primary-foreground">
              <Scale className="h-2.5 w-2.5" /> {compare.length.toLocaleString("ar-EG")}
            </span>
          )}
        </button>
      )}

      <OfferCollectionsDrawer
        open={collectionsOpen}
        onOpenChange={setCollectionsOpen}
        offers={allDeals ?? []}
      />

      {/* ═══════════ DEALS SEO CONTENT — internal linking footer ═══════════ */}
      <section className="bg-card dark:bg-background border-t border-border/30" style={{ paddingTop: "clamp(24px, 3vw, 40px)", paddingBottom: "clamp(24px, 3vw, 40px)" }}>
        <div className="container max-w-4xl">
          <h2 className="text-[0.92rem] font-bold text-foreground mb-3" style={{ fontFamily: "var(--font-arabic-display)" }}>
            عروض افتتاح مول البستان
          </h2>
          <div className="text-[0.76rem] leading-[2.1] text-muted-foreground space-y-3">
            <p>
              <strong className="text-foreground">عروض الافتتاح</strong>{" "}
              مجموعة من أقوى الخصومات والباقات التي تطرحها{" "}
              <Link to="/stores" className="text-primary font-semibold hover:underline" onClick={() => trackSeoLinkClick("deals_seo", "page", "محلات المول", "/stores")}>محلات مول البستان</Link>{" "}
              بمناسبة افتتاح فرع التجمع الخامس. تشمل العروض فئات{" "}
              <Link to="/stores?category=الكمبيوتر والأجهزة" className="text-primary font-semibold hover:underline" onClick={() => trackSeoLinkClick("deals_seo", "category", "الكمبيوتر واللابتوبات", "/stores?category=الكمبيوتر والأجهزة")}>الكمبيوتر واللابتوبات</Link>،{" "}
              <Link to="/stores?category=الهواتف والإكسسوارات" className="text-primary font-semibold hover:underline" onClick={() => trackSeoLinkClick("deals_seo", "category", "الهواتف والإكسسوارات", "/stores?category=الهواتف والإكسسوارات")}>الهواتف والإكسسوارات</Link>،{" "}
              <Link to="/stores?category=الألعاب والترفيه" className="text-primary font-semibold hover:underline" onClick={() => trackSeoLinkClick("deals_seo", "category", "الجيمنج والألعاب", "/stores?category=الألعاب والترفيه")}>الجيمنج والألعاب</Link>،{" "}
              <Link to="/stores?category=الطباعة والتصوير" className="text-primary font-semibold hover:underline" onClick={() => trackSeoLinkClick("deals_seo", "category", "الطباعة والتصوير", "/stores?category=الطباعة والتصوير")}>الطباعة والتصوير</Link>، و{" "}
              <Link to="/stores?category=الصيانة والدعم الفني" className="text-primary font-semibold hover:underline" onClick={() => trackSeoLinkClick("deals_seo", "category", "الصيانة", "/stores?category=الصيانة والدعم الفني")}>الصيانة والدعم الفني</Link>.
            </p>
            <p>
              قارن بين المنتجات المعروضة عبر{" "}
              <Link to="/products" className="text-primary font-semibold hover:underline" onClick={() => trackSeoLinkClick("deals_seo", "page", "كتالوج المنتجات", "/products")}>كتالوج المنتجات الكامل</Link>،{" "}
              أو حدد موقع المحل صاحب العرض على{" "}
              <Link to="/map" className="text-primary font-semibold hover:underline" onClick={() => trackSeoLinkClick("deals_seo", "page", "الخريطة", "/map")}>الخريطة التفاعلية</Link>،{" "}
              وتعرّف على باقي{" "}
              <Link to="/opening-day" className="text-primary font-semibold hover:underline" onClick={() => trackSeoLinkClick("deals_seo", "page", "يوم الافتتاح", "/opening-day")}>فعاليات يوم الافتتاح</Link>{" "}
              ومسابقة{" "}
              <Link to="/spin-win" className="text-primary font-semibold hover:underline" onClick={() => trackSeoLinkClick("deals_seo", "page", "اربح مع البستان", "/spin-win")}>اربح مع البستان</Link>.
            </p>
            <p>
              لأي استفسار عن شروط العروض راجع{" "}
              <Link to="/faq" className="text-primary font-semibold hover:underline" onClick={() => trackSeoLinkClick("deals_seo", "page", "الأسئلة الشائعة", "/faq")}>الأسئلة الشائعة</Link>{" "}
              أو{" "}
              <Link to="/contact" className="text-primary font-semibold hover:underline" onClick={() => trackSeoLinkClick("deals_seo", "page", "التواصل", "/contact")}>تواصل مع فريق المول</Link>.
            </p>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default DailyDeals;
