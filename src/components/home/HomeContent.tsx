import { lazy, Suspense, useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Reveal } from "@/components/home/Reveal";

import {
  ArrowLeft,
  Compass,
  Phone,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ProductRail } from "@/components/home/ProductRail";
import { LazySection } from "@/components/home/LazySection";
import { useIsMobile } from "@/hooks/use-mobile";

import { HeroSlider } from "@/components/home/HeroSlider";
import { HeroSliderMobile } from "@/components/home/HeroSliderMobile";
import { QuickActions } from "@/components/home/QuickActions";
import { WhyElBostan } from "@/components/home/WhyElBostan";

const FeaturedStores = lazy(() =>
  import("@/components/home/FeaturedStores").then((m) => ({ default: m.FeaturedStores }))
);
const MerchantLogoWall = lazy(() =>
  import("@/components/home/MerchantLogoWall").then((m) => ({ default: m.MerchantLogoWall }))
);
const DealsTeaser = lazy(() =>
  import("@/components/home/DealsTeaser").then((m) => ({ default: m.DealsTeaser }))
);
const DowntownTeaser = lazy(() =>
  import("@/components/home/DowntownTeaser").then((m) => ({ default: m.DowntownTeaser }))
);
const MapTeaserPreview = lazy(() =>
  import("@/components/home/MapTeaserPreview").then((m) => ({ default: m.MapTeaserPreview }))
);

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CategoryStrip } from "@/components/home/CategoryStrip";

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

  /* Defer product fetch */
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if ("requestIdleCallback" in window) {
      const id = (window as any).requestIdleCallback(() => setReady(true), { timeout: 1200 });
      return () => (window as any).cancelIdleCallback(id);
    }
    const t = setTimeout(() => setReady(true), 300);
    return () => clearTimeout(t);
  }, []);

  const { data: allProducts, isLoading: productsLoading } = useQuery({
    queryKey: ["home-all-products"],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select(
          "id, name_ar, slug, price, price_note, image_url, brand, category_id, store_id, featured, created_at, stores(name_ar, slug, logo_url, category)"
        )
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(24);
      return (data ?? []) as ProductRow[];
    },
    enabled: ready,
    staleTime: 3 * 60 * 1000,
  });

  const products = allProducts ?? [];
  const productsWithImages = useMemo(() => products.filter((p) => p.image_url), [products]);

  /* Single curated selection — featured first, then latest */
  const selectedProducts = useMemo(() => {
    const sorted = [...productsWithImages].sort((a, b) => {
      if (a.featured !== b.featured) return b.featured ? 1 : -1;
      return 0;
    });
    return sorted.slice(0, 12);
  }, [productsWithImages]);

  return (
    <div>
      {/* ═══════════ 1 · HERO ═══════════ */}
      <section
        style={{
          contain: "layout style",
          height: isMobile ? 520 : "85vh",
          maxHeight: isMobile ? 620 : 660,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {isMobile ? <HeroSliderMobile /> : <HeroSlider />}
      </section>

      {/* ═══════════ 2 · QUICK ACTIONS ═══════════ */}
      <QuickActions />

      {/* ═══════════ 3 · FEATURED STORES ═══════════ */}
      <section style={{ contentVisibility: "auto", containIntrinsicSize: "auto 400px" } as React.CSSProperties}>
        <LazySection minHeight={400}>
          <Suspense fallback={<div style={{ minHeight: 400 }} />}><FeaturedStores /></Suspense>
        </LazySection>
      </section>

      {/* ═══════════ 4 · CATEGORIES ═══════════ */}
      <section style={{ contain: "layout", minHeight: 296, contentVisibility: "auto", containIntrinsicSize: "auto 296px" } as React.CSSProperties}>
        <CategoryStrip />
      </section>

      {/* ═══════════ 5 · INTERACTIVE MAP TEASER ═══════════ */}
      <section
        className="bg-card dark:bg-background"
        style={{
          contentVisibility: "auto",
          containIntrinsicSize: "auto 400px",
          paddingTop: "clamp(48px, 6.5vw, 104px)",
          paddingBottom: "clamp(48px, 6.5vw, 104px)",
        } as React.CSSProperties}
      >
        <div className="container">
          <Reveal className="mx-auto max-w-[58rem]">
            <Suspense fallback={
              <div className="flex items-center justify-center rounded-2xl border border-border bg-card py-24">
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

      {/* ═══════════ 6 · DEALS / OFFERS ═══════════ */}
      <section style={{ contain: "layout", contentVisibility: "auto", containIntrinsicSize: "auto 320px" } as React.CSSProperties}>
        <Suspense fallback={<div style={{ minHeight: 320 }} />}><DealsTeaser /></Suspense>
      </section>

      {/* ═══════════ 7 · SELECTED PRODUCTS (single section) ═══════════ */}
      <section
        className="bg-card dark:bg-background"
        style={{
          contain: "layout",
          contentVisibility: "auto",
          containIntrinsicSize: "auto 500px",
          paddingTop: "clamp(56px, 7vw, 112px)",
          paddingBottom: "clamp(56px, 7vw, 112px)",
          ...(selectedProducts.length < 3 && !productsLoading ? { display: "none" } : {}),
        } as React.CSSProperties}
      >
        <div className="container">
          <ProductRail
            kicker="من محلات المول"
            title="منتجات مختارة"
            subtitle="تصفّح أبرز ما تقدمه محلات مول البستان."
            products={selectedProducts}
            ctaLabel="عرض كل المنتجات"
            ctaTo="/products"
            layout="grid"
            columns={4}
            theme="light"
            loading={productsLoading}
          />
        </div>
      </section>

      {/* ═══════════ 8 · WHY EL BOSTAN ═══════════ */}
      <WhyElBostan />

      {/* ═══════════ 9 · MERCHANT LOGO WALL ═══════════ */}
      <section style={{ contentVisibility: "auto", containIntrinsicSize: "auto 280px" } as React.CSSProperties}>
        <LazySection minHeight={280}>
          <Suspense fallback={<div style={{ minHeight: 280 }} />}><MerchantLogoWall /></Suspense>
        </LazySection>
      </section>

      {/* ═══════════ 10 · DOWNTOWN HERITAGE ═══════════ */}
      <section style={{ minHeight: 420 }}>
        <LazySection minHeight={420}>
          <Suspense fallback={<div style={{ minHeight: 420 }} />}><DowntownTeaser /></Suspense>
        </LazySection>
      </section>

      {/* ═══════════ 11 · FAQ ═══════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #050E1C 0%, #0B1930 50%, #071326 100%)",
          paddingTop: "clamp(56px, 7vw, 112px)",
          paddingBottom: "clamp(56px, 7vw, 112px)",
        }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-[0.025]" style={{ background: "radial-gradient(circle, #2563EB 0%, transparent 70%)" }} />
          <div className="absolute bottom-0 right-[20%] w-[300px] h-[300px] rounded-full opacity-[0.015]" style={{ background: "radial-gradient(circle, #CDBB9A 0%, transparent 70%)" }} />
        </div>

        <div className="container relative max-w-5xl">
          <Reveal>
            <div className="grid items-start gap-10 lg:grid-cols-[0.75fr_1.25fr]">
              <div className="lg:sticky lg:top-24">
                <p className="text-[0.62rem] font-bold tracking-[0.24em] uppercase mb-4" style={{ color: "#60A5FA" }}>أسئلة شائعة</p>
                <h2 className="text-[1.25rem] md:text-[1.5rem] font-bold leading-[1.1]" style={{ fontFamily: "var(--font-arabic-display)", color: "#F8FAFC", letterSpacing: "-0.02em" }}>
                  إجابات سريعة.
                </h2>
                <p className="mt-3 text-[0.82rem] leading-[1.75] max-w-[20rem]" style={{ color: "#94A3B8" }}>
                  أبرز الأسئلة حول الموقع والافتتاح والتأجير.
                </p>
                <Link to="/faq" className="mt-5 inline-flex">
                  <Button className="h-10 rounded-xl border px-5 text-[0.8rem] font-bold gap-1.5 transition-all duration-300 hover:bg-white/8"
                          style={{ borderColor: "#ffffff15", background: "#ffffff06", color: "#CBD5E1" }}>
                    جميع الأسئلة <ArrowLeft className="h-3 w-3" />
                  </Button>
                </Link>
              </div>

              <Accordion type="single" collapsible defaultValue={faqItems[0]?.id} className="space-y-3">
                {faqItems.map((faq, i) => (
                  <AccordionItem
                    key={faq.id}
                    value={faq.id}
                    className="overflow-hidden rounded-2xl border px-5 transition-all duration-300 data-[state=open]:bg-white/[0.03]"
                    style={{ background: "#ffffff03", borderColor: "#ffffff08" }}
                  >
                    <AccordionTrigger className="min-h-[3.25rem] py-4 text-right text-[0.86rem] font-bold hover:no-underline" style={{ color: "#F1F5F9" }}>
                      <span className="flex items-center gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-poppins text-[0.62rem] font-extrabold"
                              style={{ background: "#2563EB10", color: "#60A5FA", border: "1px solid #2563EB1A" }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {faq.question_ar}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 pr-10 text-[0.8rem] leading-[1.85]" style={{ color: "#94A3B8" }}>
                      {faq.answer_ar}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════ 12 · FINAL CTA ═══════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #050E1C 0%, #0B1930 50%, #071326 100%)",
          paddingTop: "clamp(64px, 8vw, 128px)",
          paddingBottom: "clamp(64px, 8vw, 128px)",
        }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full opacity-[0.03]" style={{ background: "radial-gradient(circle, #2563EB 0%, transparent 70%)" }} />
        </div>

        <div className="container relative max-w-[700px]">
          <Reveal>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-12 rounded-full" style={{ background: "linear-gradient(to left, #CDBB9A50, transparent)" }} />
              <span className="font-poppins text-[0.6rem] font-bold tracking-[0.22em] uppercase" style={{ color: "#CDBB9A" }}>ابدأ من هنا</span>
              <div className="h-px w-12 rounded-full" style={{ background: "linear-gradient(to right, #CDBB9A50, transparent)" }} />
            </div>

            <h2 className="mx-auto max-w-[22rem] text-center text-[1.3rem] md:text-[1.6rem] font-bold leading-[1.08]"
                style={{ fontFamily: "var(--font-arabic-display)", color: "#F8FAFC", letterSpacing: "-0.025em" }}>
              ابدأ من هنا.
            </h2>
            <p className="mx-auto mt-3 max-w-[22rem] text-center text-[0.84rem] leading-[1.75]" style={{ color: "#94A3B8" }}>
              دليل المحلات، الخريطة التفاعلية، والوحدات المتاحة.
            </p>

            <div className="mx-auto mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { icon: Compass, label: "الخريطة التفاعلية", desc: "خريطة لكل دور.", to: "/map", color: "#2563EB" },
                { icon: Store, label: "دليل المحلات", desc: "تصفّح المحلات.", to: "/stores", color: "#06B6D4" },
                { icon: Phone, label: "استفسار التأجير", desc: "وحدات جاهزة.", to: "/leasing", color: "#F97316" },
              ].map((item) => (
                <Link key={item.to} to={item.to} className="group">
                  <div className="rounded-2xl p-5 text-center transition-all duration-300 hover:bg-white/[0.04]"
                       style={{ background: "#ffffff03", border: "1px solid #ffffff06" }}>
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl"
                         style={{ background: `${item.color}0D`, border: `1px solid ${item.color}1A`, boxShadow: `0 4px 16px ${item.color}08` }}>
                      <item.icon className="h-5 w-5" style={{ color: item.color }} />
                    </div>
                    <p className="text-[0.84rem] font-bold" style={{ color: "#F1F5F9" }}>{item.label}</p>
                    <p className="mt-1.5 text-[0.72rem] leading-[1.6]" style={{ color: "#7C8BA1" }}>{item.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
