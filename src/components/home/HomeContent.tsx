import { lazy, Suspense, useMemo } from "react";
import { Link } from "react-router-dom";
import { Reveal } from "@/components/home/Reveal";
import {
  ArrowLeft,
  Compass,
  Gift,
  Phone,
  Store,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CategoryStrip } from "@/components/home/CategoryStrip";
import { ProductRail } from "@/components/home/ProductRail";
import { LazySection } from "@/components/home/LazySection";
import { useIsMobile } from "@/hooks/use-mobile";

const HeroSlider = lazy(() =>
  import("@/components/home/HeroSlider").then((m) => ({ default: m.HeroSlider }))
);
const HeroSliderMobile = lazy(() =>
  import("@/components/home/HeroSliderMobile").then((m) => ({ default: m.HeroSliderMobile }))
);
const MerchantLogoWall = lazy(() =>
  import("@/components/home/MerchantLogoWall").then((m) => ({ default: m.MerchantLogoWall }))
);
const DowntownTeaser = lazy(() =>
  import("@/components/home/DowntownTeaser").then((m) => ({ default: m.DowntownTeaser }))
);
const DealsTeaser = lazy(() =>
  import("@/components/home/DealsTeaser").then((m) => ({ default: m.DealsTeaser }))
);
const FeaturedStores = lazy(() =>
  import("@/components/home/FeaturedStores").then((m) => ({ default: m.FeaturedStores }))
);
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const MapTeaserPreview = lazy(() =>
  import("@/components/home/MapTeaserPreview").then((m) => ({ default: m.MapTeaserPreview }))
);

const fallbackFaqs = [
  { id: "faq-1", question_ar: "أين يقع مول البستان؟", answer_ar: "في قلب القاهرة الجديدة، ضمن موقع يخدم مدينتي والرحاب والمناطق المحيطة." },
  { id: "faq-2", question_ar: "متى موعد الافتتاح؟", answer_ar: "الافتتاح الكبير مقرر في 1 مايو 2026." },
  { id: "faq-3", question_ar: "هل تتوفر وحدات للتأجير؟", answer_ar: "نعم، وحدات متعددة المساحات. استعرضها عبر الخريطة التفاعلية." },
  { id: "faq-4", question_ar: "كيف أجد محلاً داخل المول؟", answer_ar: "استخدم الخريطة التفاعلية أو دليل المحلات." },
  { id: "faq-5", question_ar: "هل سيتوفر تسوّق إلكتروني؟", answer_ar: "السوق الرقمي مرحلة قادمة." },
  { id: "faq-6", question_ar: "كيف أتقدم باستفسار تجاري؟", answer_ar: "من صفحة التأجير أو التواصل." },
];


type HomeContentProps = {
  faqs: Array<{ id: string; question_ar: string; answer_ar: string }>;
  featuredStores: Array<{
    id: string; name_ar: string; category: string | null;
    slug: string; logo_url: string | null; short_description_ar: string | null;
  }>;
  upcomingEvents: Array<{
    id: string; title_ar: string; description_ar: string | null;
    image_url: string | null; event_date: string | null;
  }>;
};

type ProductRow = {
  id: string;
  name_ar: string;
  slug: string;
  price: number | null;
  price_note: string | null;
  image_url: string | null;
  featured: boolean;
  brand: string | null;
  created_at: string;
  store_id: string | null;
  category_id: string | null;
  stores: { name_ar: string; slug: string; logo_url: string | null; category: string | null } | null;
};

export function HomeContent({ faqs }: HomeContentProps) {
  const faqItems = (faqs.length >= 5 ? faqs : fallbackFaqs).slice(0, 6);
  const isMobile = useIsMobile();

  /* ── Single data source for all product sections ── */
  const { data: allProducts } = useQuery({
    queryKey: ["home-all-products"],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select(
          "id, name_ar, slug, price, price_note, image_url, brand, category_id, store_id, featured, created_at, stores(name_ar, slug, logo_url, category)"
        )
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(60);
      return (data ?? []) as ProductRow[];
    },
  });

  const products = allProducts ?? [];

  /* ── Filter out products without images for homepage ── */
  const productsWithImages = useMemo(() => products.filter((p) => p.image_url), [products]);

  /* ── Derive sections from single dataset ── */
  const latestProducts = useMemo(() => productsWithImages.slice(0, 12), [productsWithImages]);

  const featuredProducts = useMemo(
    () => productsWithImages.filter((p) => p.featured).slice(0, 8),
    [productsWithImages]
  );

  /* Trending: featured first, then by recency — different slice than latest */
  const trendingProducts = useMemo(() => {
    const sorted = [...productsWithImages].sort((a, b) => {
      if (a.featured !== b.featured) return b.featured ? 1 : -1;
      return 0;
    });
    return sorted.slice(8, 16);
  }, [productsWithImages]);

  /* Category-based blocks */
  const phoneProducts = useMemo(
    () => productsWithImages.filter((p) => p.stores?.category === "الهواتف والإكسسوارات").slice(0, 8),
    [productsWithImages]
  );
  const computerProducts = useMemo(
    () => productsWithImages.filter((p) => p.stores?.category === "الكمبيوتر والأجهزة").slice(0, 8),
    [productsWithImages]
  );
  const gamingProducts = useMemo(
    () => productsWithImages.filter((p) => p.stores?.category === "الألعاب والترفيه").slice(0, 8),
    [productsWithImages]
  );



  return (
    <>
      {/* ═══════════ 1 · HERO ═══════════ */}
      <section style={{ contain: "layout" }}>
        <Suspense fallback={<div style={{ minHeight: isMobile ? 520 : 580, background: "#071326" }} />}>
          {isMobile ? <HeroSliderMobile /> : <HeroSlider />}
        </Suspense>
      </section>

      {/* ═══════════ 2 · CATEGORY STRIP ═══════════ */}
      <section style={{ contain: "layout" }}><CategoryStrip /></section>

      {/* ═══════════ 3 · LATEST PRODUCTS ═══════════ */}
      {latestProducts.length > 0 && (
        <section
          className="bg-card dark:bg-background"
          style={{
            contain: "layout",
            paddingTop: "clamp(48px, 6vw, 96px)",
            paddingBottom: "clamp(48px, 6vw, 96px)",
          }}>
          <div className="container">
            <ProductRail
              kicker="من محلات المول"
              title="أحدث المنتجات"
              subtitle="تصفح أحدث ما أضافته محلات مول البستان في مكان واحد."
              products={latestProducts}
              ctaLabel="عرض كل المنتجات"
              ctaTo="/products"
              layout="grid"
              columns={4}
              maxItems={12}
              theme="light"
            />
          </div>
        </section>
      )}

      {/* ═══════════ 4 · DEALS / OFFERS ═══════════ */}
      <section style={{ contain: "layout" }}><Suspense fallback={<div style={{ minHeight: 320 }} />}><DealsTeaser /></Suspense></section>

      {/* ═══════════ 5 · TRENDING / BEST-SELLING ═══════════ */}
      {trendingProducts.length >= 3 && (
        <section
          className="bg-card dark:bg-background"
          style={{
            contain: "layout",
            paddingTop: "clamp(48px, 6vw, 96px)",
            paddingBottom: "clamp(48px, 6vw, 96px)",
          }}>
          <div className="container">
            <ProductRail
              kicker="الأكثر طلباً"
              title="المنتجات الرائجة"
              subtitle="منتجات يبحث عنها الزوار ويطلبها السوق."
              products={trendingProducts}
              ctaLabel="تصفّح المنتجات"
              ctaTo="/products"
              layout="rail"
              theme="light"
            />
          </div>
        </section>
      )}

      {/* ═══════════ 6 · FEATURED PRODUCTS RAIL ═══════════ */}
      {featuredProducts.length >= 3 && (
        <section
          className="relative overflow-hidden"
          style={{
            contain: "layout",
            background: "linear-gradient(160deg, #071326 0%, #0D1F3C 50%, #071326 100%)",
            paddingTop: "clamp(48px, 6vw, 96px)",
            paddingBottom: "clamp(48px, 6vw, 96px)",
          }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, #2563EB 0%, transparent 70%)" }} />
          </div>
          <div className="container relative">
            <ProductRail
              kicker="اختيارات مميزة"
              title="منتجات مميزة من المول"
              products={featuredProducts}
              ctaLabel="عرض المنتجات المميزة"
              ctaTo="/products"
              layout="rail"
              theme="dark"
            />
          </div>
        </section>
      )}

      {/* ═══════════ 7 · FEATURED STORES ═══════════ */}
      <section style={{ contain: "layout" }}>
        <LazySection minHeight={400}>
          <Suspense fallback={<div style={{ minHeight: 400 }} />}><FeaturedStores /></Suspense>
        </LazySection>
      </section>

      {/* ═══════════ 8 · CATEGORY: PHONES ═══════════ */}
      {phoneProducts.length >= 3 && (
        <section
          className="bg-card dark:bg-background"
          style={{
            contain: "layout",
            paddingTop: "clamp(48px, 6vw, 96px)",
            paddingBottom: "clamp(48px, 6vw, 96px)",
          }}>
          <div className="container">
            <ProductRail
              kicker="الهواتف والإكسسوارات"
              title="أحدث الهواتف وملحقاتها"
              products={phoneProducts}
              ctaLabel="عرض الكل"
              ctaTo="/products?category=الهواتف والإكسسوارات"
              layout="grid"
              columns={4}
              maxItems={8}
              theme="light"
            />
          </div>
        </section>
      )}

      {/* ═══════════ 9 · CATEGORY: COMPUTERS ═══════════ */}
      {computerProducts.length >= 3 && (
        <section
          className="relative overflow-hidden"
          style={{
            contain: "layout",
            background: "linear-gradient(160deg, #071326 0%, #0D1F3C 50%, #071326 100%)",
            paddingTop: "clamp(48px, 6vw, 96px)",
            paddingBottom: "clamp(48px, 6vw, 96px)",
          }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full opacity-[0.05]" style={{ background: "radial-gradient(circle, #2563EB 0%, transparent 70%)" }} />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.03]" style={{ background: "radial-gradient(circle, #06B6D4 0%, transparent 70%)" }} />
          </div>
          <div className="absolute inset-0 pointer-events-none opacity-[0.015]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
          <div className="container relative">
            <ProductRail
              kicker="الكمبيوتر والأجهزة"
              title="أجهزة الكمبيوتر والملحقات"
              products={computerProducts}
              ctaLabel="عرض الكل"
              ctaTo="/products?category=الكمبيوتر والأجهزة"
              layout="rail"
              theme="dark"
            />
          </div>
        </section>
      )}

      {/* ═══════════ 10 · CATEGORY: GAMING ═══════════ */}
      {gamingProducts.length >= 3 && (
        <section
          className="bg-card dark:bg-background"
          style={{
            contain: "layout",
            paddingTop: "clamp(48px, 6vw, 96px)",
            paddingBottom: "clamp(48px, 6vw, 96px)",
          }}>
          <div className="container">
            <ProductRail
              kicker="الألعاب والترفيه"
              title="أحدث ألعاب الفيديو والأجهزة"
              products={gamingProducts}
              ctaLabel="عرض الكل"
              ctaTo="/products?category=الألعاب والترفيه"
              layout="grid"
              columns={4}
              maxItems={8}
              theme="light"
            />
          </div>
        </section>
      )}

      {/* ═══════════ 11 · MERCHANT LOGO WALL ═══════════ */}
      <section style={{ contain: "layout" }}>
        <LazySection minHeight={280}>
          <Suspense fallback={<div style={{ minHeight: 280 }} />}><MerchantLogoWall /></Suspense>
        </LazySection>
      </section>

      {/* ═══════════ 12 · MAP TEASER ═══════════ */}
      <section
        className="bg-card dark:bg-background"
        style={{
          contain: "layout",
          paddingTop: "clamp(40px, 5.5vw, 88px)",
          paddingBottom: "clamp(40px, 5.5vw, 88px)",
        }}>
        <div className="container">
          <Reveal className="mx-auto max-w-[58rem]">
            <Suspense fallback={
              <div className="flex items-center justify-center rounded-2xl border border-border bg-card py-20">
                <div className="flex flex-col items-center gap-3">
                  <Compass className="h-8 w-8 text-primary/30 animate-pulse" />
                  <p className="text-[0.8rem] text-muted-foreground">جارٍ تحميل الخريطة...</p>
                </div>
              </div>
            }>
              <MapTeaserPreview />
            </Suspense>
          </Reveal>
        </div>
      </section>

      {/* ═══════════ 13 · SPIN & WIN ═══════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          contain: "layout",
          background: "linear-gradient(135deg, #071326 0%, #0D1F3C 50%, #071326 100%)",
          paddingTop: "clamp(48px, 6vw, 96px)",
          paddingBottom: "clamp(48px, 6vw, 96px)",
        }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, #2563EB 0%, transparent 70%)" }} />
        </div>

        <div className="container relative">
          <Reveal>
            <div className="mx-auto max-w-[54rem]">
...
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════ 14 · MARKET ECHO TEASER ═══════════ */}
      <section
        className="relative overflow-hidden bg-background"
        style={{
          contain: "layout",
          paddingTop: "clamp(40px, 5vw, 72px)",
          paddingBottom: "clamp(40px, 5vw, 72px)",
        }}
      >
        <div className="container max-w-[720px]">
          <Reveal>
            <Link to="/market-echo" className="group block">
...
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ═══════════ 14.5 · DOWNTOWN HERITAGE ═══════════ */}
      <section style={{ contain: "layout" }}>
        <LazySection minHeight={420}>
          <Suspense fallback={<div style={{ minHeight: 420 }} />}><DowntownTeaser /></Suspense>
        </LazySection>
      </section>

      {/* ═══════════ 15 · FAQ ═══════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          contain: "layout",
          background: "linear-gradient(160deg, #071326 0%, #0D1F3C 50%, #071326 100%)",
          paddingTop: "clamp(48px, 6vw, 96px)",
          paddingBottom: "clamp(48px, 6vw, 96px)",
        }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-[0.03]" style={{ background: "radial-gradient(circle, #2563EB 0%, transparent 70%)" }} />
        </div>

        <div className="container relative max-w-5xl">
          <Reveal>
            <div className="grid items-start gap-8 lg:grid-cols-[0.75fr_1.25fr]">
...
              </Accordion>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════ 16 · FINAL CTA ═══════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          contain: "layout",
          background: "linear-gradient(160deg, #071326 0%, #0D1F3C 50%, #071326 100%)",
          paddingTop: "clamp(56px, 7vw, 112px)",
          paddingBottom: "clamp(56px, 7vw, 112px)",
        }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, #2563EB 0%, transparent 70%)" }} />
        </div>

        <div className="container relative max-w-[700px]">
          <Reveal>
            <div className="flex items-center justify-center gap-3 mb-5">
...
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
