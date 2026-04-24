import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { Sparkles, Store, ArrowLeft, Clock3, LayoutGrid, Zap } from "lucide-react";
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
  const previewOffers = useMemo(() => (deals ?? []).slice(0, 6), [deals]);
  const previewPrimaryOffer = useMemo(() => previewOffers.find((deal) => deal.featured) ?? previewOffers[0] ?? null, [previewOffers]);
  const previewGridOffers = useMemo(() => previewOffers.filter((deal) => deal.id !== previewPrimaryOffer?.id), [previewOffers, previewPrimaryOffer]);
  const sectionTitle = isExpired ? "جميع عروض الافتتاح" : "معاينات عروض الافتتاح";
  const sectionDescription = isExpired
    ? "جميع العروض المنشورة من المحلات المشاركة داخل مول البستان، مع ربط مباشر بصفحات المتاجر."
    : "مراجعة مبكرة ومنظمة للعروض المنتظرة من المحلات المشاركة قبل يوم الافتتاح.";

  return (
    <MainLayout>
      <SEOHead title="عروض الافتتاح | مول البستان" titleEn="Opening Offers | Mall Elbostan" description="عروض الافتتاح من المحلات الجديدة في مول البستان، مع ربط مباشر بكل متجر داخل المنظومة الرسمية للمول." descriptionEn="Opening offers from participating new tenants at Mall Elbostan, linked directly to each store inside the mall system." keywords="عروض الافتتاح, عروض مول البستان, Infinity Computer Services, Kareem Stores, خصومات لابتوب, إكسسوارات تصوير, mall offers" breadcrumbs={[{ name: "عروض الافتتاح", url: "/daily-deals" }]} noIndex={!deals || deals.length === 0} />

      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute inset-0 opacity-[0.08]" style={{ background: "radial-gradient(circle at top right, hsl(var(--primary) / 0.45), transparent 35%)" }} />
        <div className="container relative py-14 md:py-20">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[0.72rem] font-semibold text-white/70">
                {isExpired ? <LayoutGrid className="h-3.5 w-3.5" /> : <Clock3 className="h-3.5 w-3.5" />} {isExpired ? "العروض متاحة الآن" : "العدّاد يعمل حتى الإطلاق"}
              </p>
              <h1 className="max-w-2xl text-[1.9rem] font-bold leading-[1.15] text-white md:text-[2.8rem]" style={{ fontFamily: "var(--font-arabic-display)" }}>
                {isExpired ? "جميع عروض الافتتاح داخل مول البستان." : "عروض الافتتاح تبدأ بعد العدّاد، والمعاينات جاهزة الآن."}
              </h1>
              <p className="mt-4 max-w-2xl text-[0.88rem] leading-[2] text-white/60">
                {isExpired
                  ? "انتهى العدّاد وتحوّلت الصفحة تلقائيًا إلى شبكة كاملة تعرض كل عروض الافتتاح المنشورة من المحلات المشاركة داخل المنظومة الرسمية للمول."
                  : "قبل موعد الإطلاق نعرض لك عدّادًا واضحًا في الهيرو، ثم معاينات منظمة للعروض أسفل الهيرو مباشرة، وبعد التاريخ المحدد تنتقل الصفحة تلقائيًا إلى عرض كامل لجميع العروض."}
              </p>

              {!isExpired && (
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-[0.82rem] font-bold text-white">العدّ التنازلي لانطلاق عروض الافتتاح</p>
                      <p className="mt-1 text-[0.72rem] text-white/60">بمجرد انتهاء العدّاد ستنتقل الصفحة تلقائيًا من المعاينة إلى الشبكة الكاملة.</p>
                    </div>
                    <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.68rem] font-semibold text-white/75">
                      إطلاق تلقائي
                    </div>
                  </div>
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
        {!isExpired && (
          <section className="mb-8 rounded-3xl border border-border/70 bg-card p-5 shadow-[var(--shadow-premium)] md:p-7">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[0.68rem] font-semibold text-primary">تحت الهيرو مباشرة</p>
                <h2 className="mt-1 text-[1.15rem] font-bold text-foreground">معاينات عروض منظمة قبل الإطلاق</h2>
                <p className="mt-1 text-[0.74rem] text-muted-foreground">اختيار مبكر من العروض المتاحة الآن داخل المنظومة، مرتب ليبقى المحتوى واضحًا وغير فارغ قبل موعد الإطلاق.</p>
              </div>
              {previewPrimaryOffer?.stores && (
                <Link to={`/stores/${previewPrimaryOffer.stores.slug}`}>
                  <Button variant="outline-blue" className="h-10 rounded-xl px-5 text-[0.78rem] font-bold gap-1.5">
                    صفحة المتجر <ArrowLeft className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              )}
            </div>
            {previewPrimaryOffer ? (
              <div className="grid gap-5 xl:grid-cols-[1.18fr_0.82fr]">
                <OpeningOfferCard offer={previewPrimaryOffer} showAllStoreOffersCta />
                <div className="rounded-2xl border border-border/70 bg-secondary/25 p-4 md:p-5">
                  <div className="mb-4 flex items-center gap-2 text-[0.8rem] font-bold text-foreground">
                    <Zap className="h-4 w-4 text-primary" /> كيف تعمل الصفحة الآن؟
                  </div>
                  <div className="space-y-3 text-[0.76rem] leading-7 text-muted-foreground">
                    <p>الجزء العلوي يعرض العدّاد حتى تاريخ الإطلاق الرسمي.</p>
                    <p>أسفل العدّاد تظهر معاينات منتقاة ومنظمة من المحلات المشاركة.</p>
                    <p>بعد انتهاء العدّاد، تختفي حالة المعاينة وتظهر جميع العروض داخل شبكة كاملة تلقائيًا.</p>
                  </div>
                </div>
              </div>
            ) : (
              <EmptyState title="لا توجد معاينات جاهزة بعد" description="ستظهر هنا أولى معاينات عروض الافتتاح فور تجهيزها وربطها بالمحلات المشاركة." />
            )}
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
          <section id="opening-offers-grid">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-[1rem] font-bold text-foreground">{sectionTitle}</h2>
                <p className="mt-1 text-[0.74rem] text-muted-foreground">{sectionDescription}</p>
              </div>
              {!isExpired && (
                <div className="rounded-full border border-orange/20 bg-orange/10 px-3 py-1 text-[0.68rem] font-semibold text-orange">
                  وضع المعاينة قبل الإطلاق
                </div>
              )}
            </div>

            {!isExpired ? (
              <div className="space-y-8">
                {previewGridOffers.length > 0 && (
                  <div>
                    <div className="mb-4 flex items-center gap-2 text-[0.8rem] font-bold text-foreground">
                      <Sparkles className="h-4 w-4 text-primary" /> معاينات منظمة قبل الإطلاق
                    </div>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                      {previewGridOffers.map((deal) => (
                        <OpeningOfferCard key={deal.id} offer={deal} showAllStoreOffersCta />
                      ))}
                    </div>
                  </div>
                )}

                <div className="rounded-2xl border border-border/70 bg-muted/20 p-4 md:p-5">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-[0.95rem] font-bold text-foreground">ما الذي يحدث بعد الافتتاح؟</h3>
                      <p className="mt-1 text-[0.74rem] leading-7 text-muted-foreground">
                        عند انتهاء العدّاد ستتحول هذه الصفحة تلقائيًا إلى عرض كامل يضم جميع عروض الافتتاح المنشورة من المحلات المشاركة.
                      </p>
                    </div>
                    <Link to="/stores">
                      <Button variant="outline-blue" className="h-10 rounded-xl px-5 text-[0.76rem] font-bold">
                        استعرض المحلات المشاركة
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {deals.map((deal) => (
                  <OpeningOfferCard key={deal.id} offer={deal} showAllStoreOffersCta />
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
