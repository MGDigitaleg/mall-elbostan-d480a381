import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { Tag, Sparkles, Store, ArrowLeft } from "lucide-react";
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
  const { isExpired } = useCountdown(LAUNCH_DATE);
  const [searchParams] = useSearchParams();
  const activeMerchant = searchParams.get("merchant");

  const { data: deals, isLoading } = useQuery({
    queryKey: ["live-deals", activeMerchant],
    queryFn: async () => {
      let query = supabase
        .from("deals")
        .select("id, title_ar, description_ar, valid_to, featured, campaign_key, brand, model, specs_short_ar, price_current, price_old, currency, offer_badge_ar, image_primary, opening_status, sort_order, stores:store_id(name_ar, slug, logo_url, category, opening_status)")
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
  const upcomingCount = (deals ?? []).filter((deal) => deal.opening_status === "opening_soon").length;

  return (
    <MainLayout>
      <SEOHead title="عروض الافتتاح | مول البستان" titleEn="Opening Offers | Mall Elbostan" description="عروض الافتتاح من المحلات الجديدة في مول البستان، مع ربط مباشر بكل متجر داخل المنظومة الرسمية للمول." descriptionEn="Opening offers from participating new tenants at Mall Elbostan, linked directly to each store inside the mall system." keywords="عروض الافتتاح, عروض مول البستان, Infinity Computer Services, Kareem Stores, خصومات لابتوب, إكسسوارات تصوير, mall offers" breadcrumbs={[{ name: "عروض الافتتاح", url: "/daily-deals" }]} noIndex={!deals || deals.length === 0} />

      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute inset-0 opacity-[0.08]" style={{ background: "radial-gradient(circle at top right, hsl(var(--primary) / 0.45), transparent 35%)" }} />
        <div className="container relative py-14 md:py-20">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[0.72rem] font-semibold text-white/70">
                <Sparkles className="h-3.5 w-3.5" /> عروض المحلات الجديدة
              </p>
              <h1 className="max-w-2xl text-[1.9rem] font-bold leading-[1.15] text-white md:text-[2.8rem]" style={{ fontFamily: "var(--font-arabic-display)" }}>
                عروض الافتتاح داخل منظومة مول البستان.
              </h1>
              <p className="mt-4 max-w-2xl text-[0.88rem] leading-[2] text-white/60">
                قبل الافتتاح نعرض لك Preview حقيقي لعروض المحلات المشاركة، وبعد يوم الافتتاح تتحول الصفحة تلقائياً إلى وجهة التصفح الكاملة لجميع عروض الافتتاح.
              </p>

              {!isExpired && (
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                  <p className="mb-3 text-[0.82rem] font-bold text-white">العدّ التنازلي لانطلاق عروض الافتتاح</p>
                  <CountdownTimer />
                </div>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <OfferMetaLine count={merchantCount} label="محلات مشاركة" />
              <OfferMetaLine count={liveOffersCount} label="عروض متاحة الآن" />
              <OfferMetaLine count={upcomingCount} label="عروض بافتتاح قريب" />
            </div>
          </div>
        </div>
      </section>

      <div className="container py-10 md:py-14">
        {featuredOffer && (
          <section className="mb-8 rounded-3xl border border-border/70 bg-card p-5 shadow-[var(--shadow-premium)] md:p-7">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[0.68rem] font-semibold text-primary">عرض بارز</p>
                <h2 className="mt-1 text-[1.15rem] font-bold text-foreground">ترشيح اليوم من عروض الافتتاح</h2>
              </div>
              {featuredOffer.stores && (
                <Link to={`/stores/${featuredOffer.stores.slug}`}>
                  <Button variant="outline-blue" className="h-10 rounded-xl px-5 text-[0.78rem] font-bold gap-1.5">
                    صفحة المتجر <ArrowLeft className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              )}
            </div>
            <OpeningOfferCard offer={featuredOffer} showAllStoreOffersCta />
          </section>
        )}

        {merchantGroups.length > 0 && (
          <section className="mb-8">
            <div className="mb-4 flex items-center gap-2 text-[0.8rem] font-bold text-foreground">
              <Store className="h-4 w-4 text-primary" /> تصفح حسب المتجر
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/daily-deals">
                <Button variant={activeMerchant ? "outline-blue" : "cta"} className="h-10 rounded-xl px-5 text-[0.76rem] font-bold">جميع عروض الافتتاح</Button>
              </Link>
              {merchantGroups.map((merchant) => (
                <Link key={merchant.slug} to={`/daily-deals?merchant=${merchant.slug}`}>
                  <Button variant={activeMerchant === merchant.slug ? "cta" : "outline-blue"} className="h-10 rounded-xl px-5 text-[0.76rem] font-bold">
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
          <section>
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-[1rem] font-bold text-foreground">{isExpired ? "جميع عروض الافتتاح" : "Preview عروض الافتتاح"}</h2>
                <p className="mt-1 text-[0.74rem] text-muted-foreground">عروض منظمة ومرتبطة مباشرة بصفحات محلات المول المشاركة.</p>
              </div>
              {!isExpired && (
                <div className="rounded-full border border-orange-500/15 bg-orange-500/5 px-3 py-1 text-[0.68rem] font-semibold text-orange-600">
                  يفتتح قريبًا
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {deals.map((deal) => (
                <OpeningOfferCard key={deal.id} offer={deal} showAllStoreOffersCta />
              ))}
            </div>
          </section>
        ) : (
          <EmptyState title="لا توجد عروض افتتاح منشورة حالياً" description="سيتم عرض عروض المحلات الجديدة هنا فور تجهيزها وربطها بصفحات المتاجر." />
        )}
      </div>
    </MainLayout>
  );
};

export default DailyDeals;
