import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation, useParams, useSearchParams } from "react-router-dom";
import { Sparkles, Store, ArrowLeft, Clock3, LayoutGrid, Zap, ArrowDownUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { CountdownTimer } from "@/components/CountdownTimer";
import { useCountdown } from "@/hooks/useCountdown";
import { LoadingGrid, EmptyState } from "@/components/ui/loading-states";
import { Button } from "@/components/ui/button";
import { OfferMetaLine, OpeningOfferCard, type OpeningOfferRecord } from "@/components/offers/OpeningOfferCard";

const LAUNCH_DATE = new Date("2026-05-01T00:00:00+02:00");

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

  const featuredOffer = deals?.find((deal) => deal.featured) ?? deals?.[0] ?? null;
  const liveOffersCount = deals?.length ?? 0;
  const merchantCount = merchantGroups.length;
  const openNowCount = (deals ?? []).filter((deal) => deal.opening_status === "opening_soon").length;
  const PREVIEW_LIMIT = 4;
  const [showAllPreview, setShowAllPreview] = useState(false);
  type SortKey = "newest" | "strongest" | "expiring";
  const [sortKey, setSortKey] = useState<SortKey>("newest");

  const previewPrimaryOffer = useMemo(() => (deals ?? []).find((deal) => deal.featured) ?? (deals ?? [])[0] ?? null, [deals]);

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

  const remainingOffers = useMemo(
    () => sortOffers((deals ?? []).filter((deal) => deal.id !== previewPrimaryOffer?.id)),
    [deals, previewPrimaryOffer, sortKey],
  );
  const sortedAllDeals = useMemo(() => sortOffers(deals ?? []), [deals, sortKey]);
  const previewGridOffers = useMemo(
    () => (showAllPreview ? remainingOffers : remainingOffers.slice(0, PREVIEW_LIMIT)),
    [remainingOffers, showAllPreview],
  );
  const hiddenCount = Math.max(0, remainingOffers.length - PREVIEW_LIMIT);
  const sectionTitle = isExpired ? "جميع عروض الافتتاح" : "معاينات عروض الافتتاح";
  const sectionDescription = isExpired
    ? "جميع العروض المنشورة من المحلات المشاركة داخل مول البستان، مع ربط مباشر بصفحات المتاجر."
    : "مراجعة مبكرة ومنظمة للعروض المنتظرة من المحلات المشاركة قبل يوم الافتتاح.";
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

  return (
    <MainLayout>
      <SEOHead title="عروض الافتتاح | مول البستان" titleEn="Opening Offers | Mall Elbostan" description="عروض الافتتاح من المحلات الجديدة في مول البستان، مع ربط مباشر بكل متجر داخل المنظومة الرسمية للمول." descriptionEn="Opening offers from participating new tenants at Mall Elbostan, linked directly to each store inside the mall system." keywords="عروض الافتتاح, عروض مول البستان, Infinity Computer Services, Kareem Stores, خصومات لابتوب, إكسسوارات تصوير, mall offers" breadcrumbs={[{ name: "عروض الافتتاح", url: "/daily-deals" }]} noIndex={!deals || deals.length === 0} />

      <section dir="rtl" className="relative overflow-hidden border-b border-border/40" style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute inset-0 opacity-[0.08]" style={{ background: "radial-gradient(circle at top right, hsl(var(--primary) / 0.45), transparent 35%)" }} />
        <div className="container relative py-7 md:py-9">
          <div className="grid items-start gap-6 lg:grid-cols-[1.35fr_0.65fr] lg:items-center">
            <div className="text-right">
              <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-[0.68rem] font-semibold text-white/70">
                {isExpired ? <LayoutGrid className="h-3.5 w-3.5" /> : <Clock3 className="h-3.5 w-3.5" />} {isExpired ? "العروض متاحة الآن" : "العروض متاحة مع عدّاد رمزي"}
              </p>
              <h1 className="max-w-2xl text-[1.45rem] font-bold leading-[1.18] text-white md:text-[2rem]" style={{ fontFamily: "var(--font-arabic-display)" }}>
                {isExpired ? "عروض المحلات المشاركة داخل مول البستان" : "عروض المحلات المشاركة متاحة الآن داخل الافتتاح التجريبي"}
              </h1>
              <p className="mt-2 max-w-2xl text-[0.78rem] leading-7 text-white/60 md:text-[0.82rem]">
                {isExpired
                  ? "انتهى العدّاد وتحوّلت الصفحة تلقائيًا إلى شبكة كاملة تعرض كل عروض الافتتاح المنشورة من المحلات المشاركة داخل المنظومة الرسمية للمول."
                  : "المول يعمل حاليًا في الافتتاح التجريبي، لذلك نعرض العروض مباشرة مع شريط علوي مضغوط وعدّاد تعريفي فقط."}
              </p>

              {!isExpired && (
                <div className="mt-3.5 rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
                  <div className="mb-2.5 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-right">
                      <p className="text-[0.78rem] font-bold text-white">العدّاد الرسمي للافتتاح الكبير</p>
                      <p className="mt-0.5 text-[0.66rem] leading-6 text-white/60">العروض الحالية متاحة بالفعل، مع استمرار العدّاد كمرجع لافتتاح المرحلة الكاملة.</p>
                    </div>
                    <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[0.66rem] font-semibold text-primary-foreground/90">
                      افتتاح تجريبي
                    </div>
                  </div>
                  <CountdownTimer compact />
                </div>
              )}
            </div>

            <div className="grid h-full content-start gap-2.5 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <OfferMetaLine count={merchantCount} label="محلات مشاركة" />
              <OfferMetaLine count={liveOffersCount} label="عروض متاحة الآن" />
              <OfferMetaLine count={openNowCount} label="محلات مفتوحة الآن" />
            </div>
          </div>
        </div>
      </section>

      <div dir="rtl" className="container space-y-6 py-6 md:py-8">
        {!isExpired && (
          <section className="rounded-2xl border border-border/70 bg-card p-4 shadow-[var(--shadow-premium)] md:p-5">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div className="text-right">
                <p className="text-[0.66rem] font-semibold text-primary">تحت الهيرو مباشرة</p>
                <h2 className="mt-1 text-[0.98rem] font-bold text-foreground">مختارات سريعة من العروض الحالية</h2>
                <p className="mt-1 text-[0.7rem] leading-6 text-muted-foreground">عرض مضغوط ومنظم لأبرز العروض النشطة من المحلات المفتوحة الآن.</p>
              </div>
              {previewPrimaryOffer?.stores && (
                <Link to={`/stores/${previewPrimaryOffer.stores.slug}`} className="shrink-0">
                  <Button variant="outline-blue" className="h-9 rounded-xl px-4 text-[0.74rem] font-bold gap-1.5">
                    صفحة المتجر <ArrowLeft className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              )}
            </div>
            {previewPrimaryOffer ? (
              <div className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
                <OpeningOfferCard cardId={`offer-${previewPrimaryOffer.id}`} offer={previewPrimaryOffer} showAllStoreOffersCta compact />
                <div className="rounded-2xl border border-border/70 bg-secondary/25 p-4">
                  <div className="mb-2.5 flex items-center gap-2 text-[0.78rem] font-bold text-foreground">
                    <Zap className="h-4 w-4 text-primary" /> حالة الصفحة الآن
                  </div>
                  <ul className="space-y-2 text-[0.72rem] leading-6 text-muted-foreground">
                    <li>المحلات ذات العروض الحالية تُعرض باعتبارها مفتوحة الآن.</li>
                    <li>العدّاد ما زال ظاهرًا بصيغة مختصرة للمرحلة الرسمية القادمة.</li>
                    <li>باقي العروض تظهر أسفل هذا السكشن ضمن شبكة أكثر كثافة.</li>
                  </ul>
                </div>
              </div>
            ) : (
              <EmptyState title="لا توجد معاينات جاهزة بعد" description="ستظهر هنا أولى معاينات عروض الافتتاح فور تجهيزها وربطها بالمحلات المشاركة." />
            )}
          </section>
        )}

        {merchantGroups.length > 0 && (
          <section>
            <div className="mb-3 flex items-center gap-2 text-[0.8rem] font-bold text-foreground">
              <Store className="h-4 w-4 text-primary" /> تصفح حسب المتجر
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/daily-deals">
                <Button variant={activeMerchant ? "outline-blue" : "cta"} className="h-9 rounded-xl px-4 text-[0.74rem] font-bold">جميع عروض الافتتاح</Button>
              </Link>
              {merchantGroups.map((merchant) => (
                <Link key={merchant.slug} to={`/daily-deals?merchant=${merchant.slug}`}>
                  <Button variant={activeMerchant === merchant.slug ? "cta" : "outline-blue"} className="h-9 rounded-xl px-4 text-[0.74rem] font-bold">
                    {merchant.name} ({merchant.count.toLocaleString("ar-EG")})
                  </Button>
                </Link>
              ))}
            </div>
          </section>
        )}

        {isLoading ? (
          <LoadingGrid />
        ) : deals && deals.length > 0 ? (
          <section id="opening-offers-grid">
            <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
              <div className="text-right">
                <h2 className="text-[0.98rem] font-bold text-foreground">{sectionTitle}</h2>
                <p className="mt-1 text-[0.72rem] leading-6 text-muted-foreground">{sectionDescription}</p>
              </div>
              {!isExpired && (
                <div className="shrink-0 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[0.66rem] font-semibold text-primary">
                  المحلات مفتوحة الآن
                </div>
              )}
            </div>

            {!isExpired ? (
              <div className="space-y-5">
                {previewGridOffers.length > 0 && (
                  <div>
                    <div className="mb-3 flex items-center gap-2 text-[0.78rem] font-bold text-foreground">
                      <Sparkles className="h-4 w-4 text-primary" /> بقية العروض الحالية
                    </div>
                    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {previewGridOffers.map((deal) => (
                        <OpeningOfferCard key={deal.id} cardId={`offer-${deal.id}`} offer={deal} showAllStoreOffersCta compact />
                      ))}
                    </div>
                    {hiddenCount > 0 && (
                      <div className="mt-4 flex justify-center">
                        <Button
                          variant="outline-blue"
                          className="h-9 rounded-xl px-5 text-[0.74rem] font-bold"
                          onClick={() => setShowAllPreview((v) => !v)}
                        >
                          {showAllPreview ? "عرض أقل" : `عرض المزيد (${hiddenCount.toLocaleString("ar-EG")})`}
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="text-right">
                      <h3 className="text-[0.88rem] font-bold text-foreground">استكشف كل المحلات المشاركة</h3>
                      <p className="mt-1 text-[0.72rem] leading-6 text-muted-foreground">
                        صفحة العروض أصبحت أكثر كثافة الآن، ويمكنك الانتقال مباشرة إلى صفحات المحلات المشاركة لمتابعة التفاصيل الكاملة.
                      </p>
                    </div>
                    <Link to="/stores" className="md:shrink-0">
                      <Button variant="outline-blue" className="h-9 rounded-xl px-4 text-[0.74rem] font-bold">
                        استعرض المحلات المشاركة
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {deals.map((deal) => (
                  <OpeningOfferCard key={deal.id} cardId={`offer-${deal.id}`} offer={deal} showAllStoreOffersCta compact />
                ))}
              </div>
            )}
          </section>
        ) : (
          <EmptyState title="لا توجد عروض افتتاح منشورة حالياً" description="سيتم عرض عروض المحلات الجديدة هنا فور تجهيزها وربطها بصفحات المتاجر." />
        )}
      </div>
    </MainLayout>
  );
};

export default DailyDeals;
