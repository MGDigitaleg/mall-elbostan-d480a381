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
import { HomeAnchorNav } from "@/components/home/HomeAnchorNav";
import { OFFICIAL_WHATSAPP } from "@/lib/contactInfo";
import { useSitePhone } from "@/hooks/useSitePhone";
import { Mail } from "lucide-react";

// FeaturedStores moved to /new-cairo-branch

const MerchantLogoWall = lazy(() =>
  import("@/components/home/MerchantLogoWall").then((m) => ({ default: m.MerchantLogoWall }))
);
const DealsTeaser = lazy(() =>
  import("@/components/home/DealsTeaser").then((m) => ({ default: m.DealsTeaser }))
);
const DowntownTeaser = lazy(() =>
  import("@/components/home/DowntownTeaser").then((m) => ({ default: m.DowntownTeaser }))
);
const MapTeaserCompact = lazy(() =>
  import("@/components/home/MapTeaserCompact").then((m) => ({ default: m.MapTeaserCompact }))
);

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CategoryStrip } from "@/components/home/CategoryStrip";

const TechPlanetCTA = lazy(() =>
  import("@/components/home/TechPlanetCTA").then((m) => ({ default: m.TechPlanetCTA }))
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

      {/* ═══════════ HOMEPAGE ANCHOR NAV ═══════════ */}
      <HomeAnchorNav />

      {/* ═══════════ SEO INTRO ═══════════ */}
      <section className="bg-card dark:bg-background" style={{ paddingTop: "clamp(24px, 3vw, 40px)", paddingBottom: "clamp(16px, 2vw, 28px)" }}>
        <div className="container max-w-4xl text-center">
          <h1
            className="text-[1.1rem] md:text-[1.3rem] font-bold leading-[1.4] text-foreground"
            style={{ fontFamily: "var(--font-arabic-display)" }}
          >
            مول البستان: وجهتك الأولى للكمبيوتر والإلكترونيات في وسط القاهرة
          </h1>
          <p className="mt-2.5 text-[0.82rem] leading-[1.9] text-muted-foreground max-w-2xl mx-auto">
            أكثر من 150 محل متخصص في <Link to="/stores?category=الكمبيوتر والأجهزة" className="text-primary font-semibold hover:underline">اللابتوبات والكمبيوتر</Link>، <Link to="/stores?category=الهواتف والإكسسوارات" className="text-primary font-semibold hover:underline">الهواتف والإكسسوارات</Link>، <Link to="/stores?category=الألعاب والترفيه" className="text-primary font-semibold hover:underline">الجيمنج</Link>، و<Link to="/stores?category=الصيانة والدعم الفني" className="text-primary font-semibold hover:underline">الصيانة</Link> على 3 أدوار.
            استخدم <Link to="/map" className="text-primary font-semibold hover:underline">الخريطة التفاعلية</Link> للعثور على المحل المناسب، أو تصفّح <Link to="/stores" className="text-primary font-semibold hover:underline">دليل المحلات</Link> و<Link to="/products" className="text-primary font-semibold hover:underline">المنتجات</Link>.
          </p>
        </div>
      </section>

      {/* ═══════════ 2 · QUICK ACTIONS ═══════════ */}
      <QuickActions />

      {/* ═══════════ 3 · (Featured Stores moved to فرع التجمع) ═══════════ */}


      {/* ═══════════ 4 · CATEGORIES ═══════════ */}
      <section style={{ contain: "layout", minHeight: 296, contentVisibility: "auto", containIntrinsicSize: "auto 296px" } as React.CSSProperties}>
        <CategoryStrip />
      </section>

      {/* ═══════════ 4.5 · TECH PLANET CTA ═══════════ */}
      <section style={{ contentVisibility: "auto", containIntrinsicSize: "auto 320px" } as React.CSSProperties}>
        <LazySection minHeight={300}>
          <Suspense fallback={<div style={{ minHeight: 300 }} />}><TechPlanetCTA /></Suspense>
        </LazySection>
      </section>

      {/* ═══════════ 5 · INTERACTIVE MAP TEASER (compact) ═══════════ */}
      <section
        id="home-map"
        className="bg-card dark:bg-background"
        style={{
          scrollMarginTop: 80,
          contentVisibility: "auto",
          containIntrinsicSize: "auto 200px",
          paddingTop: "clamp(28px, 4vw, 56px)",
          paddingBottom: "clamp(28px, 4vw, 56px)",
        } as React.CSSProperties}
      >
        <div className="container">
          <Reveal className="mx-auto max-w-[64rem]">
            <Suspense fallback={<div style={{ minHeight: 140 }} />}>
              <MapTeaserCompact />
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
          paddingTop: "clamp(48px, 6vw, 96px)",
          paddingBottom: "clamp(48px, 6vw, 96px)",
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
      <section id="home-stores" style={{ scrollMarginTop: 80, contentVisibility: "auto", containIntrinsicSize: "auto 280px" } as React.CSSProperties}>
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
          background: "linear-gradient(160deg, #071326 0%, #0D1F3C 50%, #071326 100%)",
          paddingTop: "clamp(48px, 6vw, 96px)",
          paddingBottom: "clamp(48px, 6vw, 96px)",
        }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-[0.03]" style={{ background: "radial-gradient(circle, #2563EB 0%, transparent 70%)" }} />
        </div>

        <div className="container relative max-w-5xl">
          <Reveal>
            <div className="grid items-start gap-8 lg:grid-cols-[0.75fr_1.25fr]">
              <div className="lg:sticky lg:top-24">
                <p className="text-[0.68rem] font-semibold tracking-[0.04em] mb-3" style={{ color: "#60A5FA" }}>أسئلة شائعة</p>
                <h2 className="text-[1.15rem] md:text-[1.35rem] font-bold leading-[1.15]" style={{ fontFamily: "var(--font-arabic-display)", color: "#F8FAFC" }}>
                  إجابات سريعة.
                </h2>
                <p className="mt-2.5 text-[0.8rem] leading-[1.7] max-w-[20rem]" style={{ color: "#94A3B8" }}>
                  أبرز الأسئلة حول الموقع والافتتاح والتأجير.
                </p>
                <Link to="/faq" className="mt-4 inline-flex">
                  <Button className="h-9 rounded-xl border px-5 text-[0.78rem] font-bold gap-1.5 transition-colors hover:bg-white/8"
                          style={{ borderColor: "#ffffff15", background: "#ffffff06", color: "#CBD5E1" }}>
                    جميع الأسئلة <ArrowLeft className="h-3 w-3" />
                  </Button>
                </Link>
              </div>

              <Accordion type="single" collapsible defaultValue={faqItems[0]?.id} className="space-y-2.5">
                {faqItems.map((faq, i) => (
                  <AccordionItem
                    key={faq.id}
                    value={faq.id}
                    className="overflow-hidden rounded-xl border px-4 transition-colors data-[state=open]:bg-white/[0.03]"
                    style={{ background: "#ffffff03", borderColor: "#ffffff0A" }}
                  >
                    <AccordionTrigger className="min-h-[3rem] py-3.5 text-right text-[0.84rem] font-bold hover:no-underline" style={{ color: "#F1F5F9" }}>
                      <span className="flex items-center gap-2.5">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md font-poppins text-[0.6rem] font-extrabold"
                              style={{ background: "#2563EB12", color: "#60A5FA", border: "1px solid #2563EB20" }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {faq.question_ar}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-3.5 pr-9 text-[0.78rem] leading-[1.8]" style={{ color: "#94A3B8" }}>
                      {faq.answer_ar}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════ 11.5 · CONTACT STRIP ═══════════ */}
      <section
        id="home-contact"
        className="relative"
        style={{
          scrollMarginTop: 80,
          background: "linear-gradient(180deg, #071326 0%, #0A1830 100%)",
          paddingTop: "clamp(40px, 5vw, 72px)",
          paddingBottom: "clamp(40px, 5vw, 72px)",
        }}
      >
        <div className="container max-w-4xl">
          <Reveal>
            <div className="text-center mb-6">
              <p className="text-[0.68rem] font-semibold tracking-[0.04em] mb-2" style={{ color: "#60A5FA" }}>تواصل معنا</p>
              <h2 className="text-[1.15rem] md:text-[1.35rem] font-bold leading-[1.15]"
                  style={{ fontFamily: "var(--font-arabic-display)", color: "#F8FAFC" }}>
                نحن هنا للإجابة على استفساراتك
              </h2>
              <p className="mt-2 text-[0.82rem] leading-[1.7]" style={{ color: "#94A3B8" }}>
                للاستفسارات التجارية، التأجير، أو الزيارة — رد خلال يوم عمل واحد.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {officialPhone && (
                <a
                  href={`tel:${officialPhone}`}
                  className="group flex items-center gap-3 rounded-xl p-4 transition-all duration-300 hover:bg-white/[0.04]"
                  style={{ background: "#ffffff03", border: "1px solid #ffffff0A" }}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                        style={{ background: "#10B98115", border: "1px solid #10B98128" }}>
                    <Phone className="h-4 w-4" style={{ color: "#34D399" }} />
                  </span>
                  <div>
                    <p className="text-[0.7rem]" style={{ color: "#7C8BA1" }}>الهاتف</p>
                    <p className="font-poppins text-[0.84rem] font-bold" style={{ color: "#F1F5F9" }} dir="ltr">{officialPhone}</p>
                  </div>
                </a>
              )}

              <a
                href={`https://wa.me/${OFFICIAL_WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-xl p-4 transition-all duration-300 hover:bg-white/[0.04]"
                style={{ background: "#ffffff03", border: "1px solid #ffffff0A" }}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                      style={{ background: "#25D36615", border: "1px solid #25D36628" }}>
                  <Phone className="h-4 w-4" style={{ color: "#25D366" }} />
                </span>
                <div>
                  <p className="text-[0.7rem]" style={{ color: "#7C8BA1" }}>واتساب</p>
                  <p className="text-[0.84rem] font-bold" style={{ color: "#F1F5F9" }}>راسلنا الآن</p>
                </div>
              </a>

              <a
                href="mailto:info@mallelbostan.com"
                className="group flex items-center gap-3 rounded-xl p-4 transition-all duration-300 hover:bg-white/[0.04]"
                style={{ background: "#ffffff03", border: "1px solid #ffffff0A" }}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                      style={{ background: "#2563EB15", border: "1px solid #2563EB28" }}>
                  <Mail className="h-4 w-4" style={{ color: "#60A5FA" }} />
                </span>
                <div>
                  <p className="text-[0.7rem]" style={{ color: "#7C8BA1" }}>البريد</p>
                  <p className="font-poppins text-[0.82rem] font-bold" style={{ color: "#F1F5F9" }}>info@mallelbostan.com</p>
                </div>
              </a>
            </div>

            <div className="mt-5 text-center">
              <Link to="/contact" className="inline-flex">
                <Button className="h-9 rounded-xl border px-5 text-[0.78rem] font-bold gap-1.5 transition-colors hover:bg-white/8"
                        style={{ borderColor: "#ffffff15", background: "#ffffff06", color: "#CBD5E1" }}>
                  صفحة التواصل الكاملة <ArrowLeft className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════ 12 · FINAL CTA ═══════════ */}
      <section
        id="home-leasing"
        className="relative overflow-hidden"
        style={{
          scrollMarginTop: 80,
          background: "linear-gradient(160deg, #071326 0%, #0D1F3C 50%, #071326 100%)",
          paddingTop: "clamp(56px, 7vw, 112px)",
          paddingBottom: "clamp(56px, 7vw, 112px)",
        }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, #2563EB 0%, transparent 70%)" }} />
        </div>

        <div className="container relative max-w-[700px]">
          <Reveal>
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px w-10 rounded-full" style={{ background: "linear-gradient(to left, #CDBB9A60, transparent)" }} />
              <span className="font-poppins text-[0.58rem] font-bold tracking-[0.2em] uppercase" style={{ color: "#CDBB9A" }}>ابدأ من هنا</span>
              <div className="h-px w-10 rounded-full" style={{ background: "linear-gradient(to right, #CDBB9A60, transparent)" }} />
            </div>

            <h2 className="mx-auto max-w-[22rem] text-center text-[1.15rem] md:text-[1.4rem] font-bold leading-[1.15]"
                style={{ fontFamily: "var(--font-arabic-display)", color: "#F8FAFC" }}>
              ابدأ من هنا.
            </h2>
            <p className="mx-auto mt-2.5 max-w-[20rem] text-center text-[0.82rem] leading-[1.7]" style={{ color: "#94A3B8" }}>
              دليل المحلات، الخريطة التفاعلية، والوحدات المتاحة.
            </p>

            <div className="mx-auto mt-7 grid gap-2.5 sm:grid-cols-3">
              {[
                { icon: Compass, label: "الخريطة التفاعلية", desc: "خريطة لكل دور.", to: "/map", color: "#2563EB" },
                { icon: Store, label: "دليل المحلات", desc: "تصفّح المحلات.", to: "/stores", color: "#06B6D4" },
                { icon: Phone, label: "استفسار التأجير", desc: "وحدات جاهزة.", to: "/leasing", color: "#F97316" },
              ].map((item) => (
                <Link key={item.to} to={item.to} className="group">
                  <div className="rounded-xl p-4 text-center transition-all duration-300 hover:bg-white/[0.03]"
                       style={{ background: "#ffffff03", border: "1px solid #ffffff08" }}>
                    <div className="mx-auto mb-2.5 flex h-10 w-10 items-center justify-center rounded-lg"
                         style={{ background: `${item.color}10`, border: `1px solid ${item.color}18` }}>
                      <item.icon className="h-4 w-4" style={{ color: item.color }} />
                    </div>
                    <p className="text-[0.82rem] font-bold" style={{ color: "#F1F5F9" }}>{item.label}</p>
                    <p className="mt-1 text-[0.7rem] leading-[1.5]" style={{ color: "#7C8BA1" }}>{item.desc}</p>
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
