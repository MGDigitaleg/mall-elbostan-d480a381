import { lazy, Suspense, useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Reveal } from "@/components/home/Reveal";

import { ArrowLeft, Phone } from "lucide-react";
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
import { HomeAnchorNav } from "@/components/home/HomeAnchorNav";
import { OFFICIAL_WHATSAPP } from "@/lib/contactInfo";
import { useSitePhone } from "@/hooks/useSitePhone";

const MerchantLogoWall = lazy(() =>
  import("@/components/home/MerchantLogoWall").then((m) => ({ default: m.MerchantLogoWall }))
);
const DealsTeaser = lazy(() =>
  import("@/components/home/DealsTeaser").then((m) => ({ default: m.DealsTeaser }))
);
const MapTeaserCompact = lazy(() =>
  import("@/components/home/MapTeaserCompact").then((m) => ({ default: m.MapTeaserCompact }))
);
const TechPlanetCTA = lazy(() =>
  import("@/components/home/TechPlanetCTA").then((m) => ({ default: m.TechPlanetCTA }))
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
  const faqItems = (faqs.length >= 4 ? faqs : fallbackFaqs).slice(0, 4);
  const isMobile = useIsMobile();
  const { phone: officialPhone } = useSitePhone();

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
        .limit(48);
      return (data ?? []) as ProductRow[];
    },
    enabled: ready,
    staleTime: 3 * 60 * 1000,
  });

  const products = allProducts ?? [];
  const productsWithImages = useMemo(() => products.filter((p) => p.image_url), [products]);

  /* Featured first (large block) — 18 items */
  const featuredProducts = useMemo(() => {
    const featured = productsWithImages.filter((p) => p.featured);
    const rest = productsWithImages.filter((p) => !p.featured);
    return [...featured, ...rest].slice(0, 18);
  }, [productsWithImages]);

  /* Latest picks — 12 items, skipping any already in featured */
  const latestProducts = useMemo(() => {
    const featuredIds = new Set(featuredProducts.map((p) => p.id));
    return productsWithImages.filter((p) => !featuredIds.has(p.id)).slice(0, 12);
  }, [productsWithImages, featuredProducts]);

  return (
    <div>
      {/* ═══════════ 1 · HERO ═══════════ */}
      <section
        style={{
          contain: "layout style",
          height: isMobile ? 440 : "70vh",
          maxHeight: isMobile ? 540 : 560,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {isMobile ? <HeroSliderMobile /> : <HeroSlider />}
      </section>

      {/* ═══════════ HOMEPAGE ANCHOR NAV ═══════════ */}
      <HomeAnchorNav />

      {/* ═══════════ SEO INTRO (compact bridge) ═══════════ */}
      <section
        className="bg-card dark:bg-background"
        style={{ paddingTop: "clamp(12px, 1.5vw, 20px)", paddingBottom: "clamp(8px, 1vw, 14px)" }}
      >
        <div className="container max-w-3xl text-center">
          <h1
            className="text-[0.92rem] md:text-[1.08rem] font-bold leading-[1.4] text-foreground"
            style={{ fontFamily: "var(--font-arabic-display)" }}
          >
            مول البستان — وجهتك للكمبيوتر والإلكترونيات في القاهرة
          </h1>
          <p className="mt-1.5 text-[0.74rem] leading-[1.7] text-muted-foreground max-w-xl mx-auto">
            +150 محل في{" "}
            <Link to="/stores?category=الكمبيوتر والأجهزة" className="text-primary font-semibold hover:underline">الكمبيوتر</Link> ·{" "}
            <Link to="/stores?category=الهواتف والإكسسوارات" className="text-primary font-semibold hover:underline">الهواتف</Link> ·{" "}
            <Link to="/stores?category=الألعاب والترفيه" className="text-primary font-semibold hover:underline">الجيمنج</Link> ·{" "}
            <Link to="/stores?category=الصيانة والدعم الفني" className="text-primary font-semibold hover:underline">الصيانة</Link>
          </p>
        </div>
      </section>

      {/* ═══════════ 2 · QUICK ACTIONS ═══════════ */}
      <QuickActions />

      {/* ═══════════ 3 · CATEGORIES ═══════════ */}
      <section style={{ contain: "layout", minHeight: 260, contentVisibility: "auto", containIntrinsicSize: "auto 260px" } as React.CSSProperties}>
        <CategoryStrip />
      </section>

      {/* ═══════════ 4 · FEATURED PRODUCTS (primary commerce block) ═══════════ */}
      <section
        className="bg-card dark:bg-background"
        style={{
          contain: "layout",
          contentVisibility: "auto",
          containIntrinsicSize: "auto 700px",
          paddingTop: "clamp(28px, 3.6vw, 56px)",
          paddingBottom: "clamp(24px, 3vw, 48px)",
          ...(featuredProducts.length < 3 && !productsLoading ? { display: "none" } : {}),
        } as React.CSSProperties}
      >
        <div className="container">
          <ProductRail
            kicker="من محلات المول"
            title="منتجات مختارة"
            subtitle="أبرز ما تقدمه محلات مول البستان."
            products={featuredProducts}
            ctaLabel="عرض كل المنتجات"
            ctaTo="/products"
            layout="grid"
            density="standard"
            theme="light"
            loading={productsLoading}
          />
        </div>
      </section>

      {/* ═══════════ 5 · OPENING OFFERS TEASER (compact) ═══════════ */}
      <section style={{ contain: "layout", contentVisibility: "auto", containIntrinsicSize: "auto 220px" } as React.CSSProperties}>
        <Suspense fallback={<div style={{ minHeight: 220 }} />}><DealsTeaser /></Suspense>
      </section>

      {/* ═══════════ 6 · LATEST PICKS (secondary product block) ═══════════ */}
      <section
        className="bg-card dark:bg-background"
        style={{
          contain: "layout",
          contentVisibility: "auto",
          containIntrinsicSize: "auto 560px",
          paddingTop: "clamp(24px, 3vw, 48px)",
          paddingBottom: "clamp(24px, 3vw, 48px)",
          ...(latestProducts.length < 3 && !productsLoading ? { display: "none" } : {}),
        } as React.CSSProperties}
      >
        <div className="container">
          <ProductRail
            kicker="جديد المحلات"
            title="أحدث ما وصل."
            subtitle="منتجات أُضيفت حديثاً من محلات المول."
            products={latestProducts}
            ctaLabel="تصفّح الجديد"
            ctaTo="/products"
            layout="grid"
            density="standard"
            theme="light"
            loading={productsLoading}
          />
        </div>
      </section>

      {/* ═══════════ 7 · INTERACTIVE MAP TEASER (compact) ═══════════ */}
      <section
        id="home-map"
        className="bg-card dark:bg-background"
        style={{
          scrollMarginTop: 80,
          contentVisibility: "auto",
          containIntrinsicSize: "auto 180px",
          paddingTop: "clamp(18px, 2.4vw, 36px)",
          paddingBottom: "clamp(18px, 2.4vw, 36px)",
        } as React.CSSProperties}
      >
        <div className="container">
          <Reveal className="mx-auto max-w-[64rem]">
            <Suspense fallback={<div style={{ minHeight: 120 }} />}>
              <MapTeaserCompact />
            </Suspense>
          </Reveal>
        </div>
      </section>

      {/* ═══════════ 7.5 · TECH PLANET TEASER (compact strip) ═══════════ */}
      <section style={{ contentVisibility: "auto", containIntrinsicSize: "auto 200px" } as React.CSSProperties}>
        <LazySection minHeight={180}>
          <Suspense fallback={<div style={{ minHeight: 180 }} />}><TechPlanetCTA /></Suspense>
        </LazySection>
      </section>

      {/* ═══════════ 8 · WHY EL BOSTAN ═══════════ */}
      <WhyElBostan />

      {/* ═══════════ 9 · ABOUT STRIP — MERCHANT LOGO WALL ═══════════ */}
      <section id="home-stores" style={{ scrollMarginTop: 80, contentVisibility: "auto", containIntrinsicSize: "auto 240px" } as React.CSSProperties}>
        <LazySection minHeight={240}>
          <Suspense fallback={<div style={{ minHeight: 240 }} />}><MerchantLogoWall /></Suspense>
        </LazySection>
      </section>

      {/* ═══════════ 10 · FAQ ═══════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #071326 0%, #0D1F3C 50%, #071326 100%)",
          paddingTop: "clamp(24px, 3vw, 48px)",
          paddingBottom: "clamp(24px, 3vw, 48px)",
        }}
      >
        <div className="container relative max-w-5xl">
          <Reveal>
            <div className="grid items-start gap-6 lg:grid-cols-[0.75fr_1.25fr]">
              <div className="lg:sticky lg:top-24">
                <p className="text-[0.64rem] font-semibold tracking-[0.04em] mb-2" style={{ color: "#60A5FA" }}>أسئلة شائعة</p>
                <h2 className="text-[1.05rem] md:text-[1.25rem] font-bold leading-[1.15]" style={{ fontFamily: "var(--font-arabic-display)", color: "#F8FAFC" }}>
                  إجابات سريعة.
                </h2>
                <p className="mt-2 text-[0.76rem] leading-[1.7] max-w-[20rem]" style={{ color: "#94A3B8" }}>
                  أبرز الأسئلة حول الموقع والافتتاح والتأجير.
                </p>
                <Link to="/faq" className="mt-3 inline-flex">
                  <Button className="h-9 rounded-xl border px-5 text-[0.76rem] font-bold gap-1.5 transition-colors hover:bg-white/8"
                          style={{ borderColor: "#ffffff15", background: "#ffffff06", color: "#CBD5E1" }}>
                    جميع الأسئلة <ArrowLeft className="h-3 w-3" />
                  </Button>
                </Link>
              </div>

              <Accordion type="single" collapsible defaultValue={faqItems[0]?.id} className="space-y-2">
                {faqItems.map((faq, i) => (
                  <AccordionItem
                    key={faq.id}
                    value={faq.id}
                    className="overflow-hidden rounded-xl border px-4 transition-colors data-[state=open]:bg-white/[0.03]"
                    style={{ background: "#ffffff03", borderColor: "#ffffff0A" }}
                  >
                    <AccordionTrigger className="min-h-[2.75rem] py-3 text-right text-[0.82rem] font-bold hover:no-underline" style={{ color: "#F1F5F9" }}>
                      <span className="flex items-center gap-2.5">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md font-poppins text-[0.6rem] font-extrabold"
                              style={{ background: "#2563EB12", color: "#60A5FA", border: "1px solid #2563EB20" }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {faq.question_ar}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-3 pr-9 text-[0.76rem] leading-[1.75]" style={{ color: "#94A3B8" }}>
                      {faq.answer_ar}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════ 11 · CONTACT CTA ═══════════ */}
      <section
        id="home-contact"
        className="relative"
        style={{
          scrollMarginTop: 80,
          background: "linear-gradient(180deg, #0A1830 0%, #071326 100%)",
          paddingTop: "clamp(22px, 2.8vw, 40px)",
          paddingBottom: "clamp(22px, 2.8vw, 40px)",
        }}
      >
        <div className="container max-w-4xl">
          <Reveal>
            <div className="text-center mb-3.5">
              <p className="text-[0.62rem] font-semibold tracking-[0.04em] mb-1.5" style={{ color: "#60A5FA" }}>تواصل معنا</p>
              <h2 className="text-[1rem] md:text-[1.2rem] font-bold leading-[1.15]"
                  style={{ fontFamily: "var(--font-arabic-display)", color: "#F8FAFC" }}>
                نحن هنا للإجابة على استفساراتك.
              </h2>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {officialPhone && (
                <a
                  href={`tel:${officialPhone}`}
                  className="group flex items-center gap-2.5 rounded-lg p-2.5 transition-all duration-300 hover:bg-white/[0.04]"
                  style={{ background: "#ffffff03", border: "1px solid #ffffff0A" }}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
                        style={{ background: "#10B98115", border: "1px solid #10B98128" }}>
                    <Phone className="h-3.5 w-3.5" style={{ color: "#34D399" }} />
                  </span>
                  <div>
                    <p className="text-[0.6rem]" style={{ color: "#7C8BA1" }}>الهاتف</p>
                    <p className="font-poppins text-[0.78rem] font-bold" style={{ color: "#F1F5F9" }} dir="ltr">{officialPhone}</p>
                  </div>
                </a>
              )}

              <a
                href={`https://wa.me/${OFFICIAL_WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2.5 rounded-lg p-2.5 transition-all duration-300 hover:bg-white/[0.04]"
                style={{ background: "#ffffff03", border: "1px solid #ffffff0A" }}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
                      style={{ background: "#25D36615", border: "1px solid #25D36628" }}>
                  <Phone className="h-3.5 w-3.5" style={{ color: "#25D366" }} />
                </span>
                <div>
                  <p className="text-[0.6rem]" style={{ color: "#7C8BA1" }}>واتساب</p>
                  <p className="text-[0.78rem] font-bold" style={{ color: "#F1F5F9" }}>راسلنا الآن</p>
                </div>
              </a>
            </div>

            <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2">
              <Link to="/contact" className="inline-flex">
                <Button className="h-9 rounded-xl border px-5 text-[0.78rem] font-bold gap-1.5 transition-colors hover:bg-white/8"
                        style={{ borderColor: "#ffffff15", background: "#ffffff06", color: "#CBD5E1" }}>
                  صفحة التواصل <ArrowLeft className="h-3 w-3" />
                </Button>
              </Link>
              <Link to="/leasing" className="inline-flex" id="home-leasing">
                <Button className="h-9 rounded-xl px-5 text-[0.78rem] font-bold gap-1.5"
                        style={{ background: "#2563EB", color: "#fff" }}>
                  استفسار التأجير <ArrowLeft className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

    </div>
  );
}
