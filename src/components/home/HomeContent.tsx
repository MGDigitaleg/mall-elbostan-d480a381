import { lazy, Suspense, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
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
import { HeroSlider } from "@/components/home/HeroSlider";
import { CategoryStrip } from "@/components/home/CategoryStrip";
import { ProductRail } from "@/components/home/ProductRail";
import { MerchantLogoWall } from "@/components/home/MerchantLogoWall";
import { DowntownTeaser } from "@/components/home/DowntownTeaser";
import { DealsTeaser } from "@/components/home/DealsTeaser";
import { FeaturedStores } from "@/components/home/FeaturedStores";
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

const sectionReveal = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

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

  /* ── Single data source for all product sections ── */
  const { data: allProducts, isLoading: isLoadingProducts } = useQuery({
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
      <HeroSlider />

      {/* ═══════════ 2 · CATEGORY STRIP ═══════════ */}
      <CategoryStrip />

      {/* ═══════════ 3 · LATEST PRODUCTS ═══════════ */}
      <section
        className="bg-card dark:bg-background"
        style={{
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

      {/* ═══════════ 4 · DEALS / OFFERS ═══════════ */}
      <DealsTeaser />

      {/* ═══════════ 5 · TRENDING / BEST-SELLING ═══════════ */}
      {trendingProducts.length >= 3 && (
        <section
          className="bg-card dark:bg-background"
          style={{
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
      <FeaturedStores />

      {/* ═══════════ 8 · CATEGORY: PHONES ═══════════ */}
      {phoneProducts.length >= 3 && (
        <section
          className="bg-card dark:bg-background"
          style={{
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
            background: "linear-gradient(160deg, #071326 0%, #0D1F3C 50%, #071326 100%)",
            paddingTop: "clamp(48px, 6vw, 96px)",
            paddingBottom: "clamp(48px, 6vw, 96px)",
          }}>
          {/* Dark overlay glow for depth */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full opacity-[0.05]" style={{ background: "radial-gradient(circle, #2563EB 0%, transparent 70%)" }} />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.03]" style={{ background: "radial-gradient(circle, #06B6D4 0%, transparent 70%)" }} />
          </div>
          {/* Subtle grid texture */}
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
      <MerchantLogoWall />

      {/* ═══════════ 12 · MAP TEASER ═══════════ */}
      <section
        className="bg-card dark:bg-background"
        style={{
          paddingTop: "clamp(40px, 5.5vw, 88px)",
          paddingBottom: "clamp(40px, 5.5vw, 88px)",
        }}>
        <div className="container">
          <motion.div
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="mx-auto max-w-[58rem]"
          >
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
          </motion.div>
        </div>
      </section>

      {/* ═══════════ 13 · SPIN & WIN ═══════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #071326 0%, #0D1F3C 50%, #071326 100%)",
          paddingTop: "clamp(48px, 6vw, 96px)",
          paddingBottom: "clamp(48px, 6vw, 96px)",
        }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, #2563EB 0%, transparent 70%)" }} />
        </div>

        <div className="container relative">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="mx-auto max-w-[54rem]">
              <div className="text-center mb-7">
                <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 mb-3" style={{ background: "#F9731610", border: "1px solid #F9731620" }}>
                  <Gift className="h-3 w-3" style={{ color: "#F97316" }} />
                  <span className="text-[0.66rem] font-bold" style={{ color: "#F97316" }}>حملة الافتتاح</span>
                </div>
                <h2 className="text-[1.15rem] md:text-[1.35rem] font-bold leading-[1.15]" style={{ fontFamily: "var(--font-arabic-display)", color: "#F8FAFC" }}>
                  أدر العجلة واربح يوم الافتتاح.
                </h2>
                <p className="mt-2 text-[0.8rem] leading-[1.7] max-w-md mx-auto" style={{ color: "#94A3B8" }}>
                  جوائز حقيقية من محلات المول — سجّل الآن واحضر يوم الافتتاح.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2.5 md:gap-3 mb-7">
                {[
                  { n: "01", title: "تصفّح المحلات", desc: "اعرف المحلات المشاركة.", color: "#2563EB" },
                  { n: "02", title: "أدر واربح", desc: "سجّل واحفظ نتيجتك.", color: "#06B6D4" },
                  { n: "03", title: "احضر واستلم", desc: "أثبت حضورك يوم الافتتاح.", color: "#F97316" },
                ].map((s) => (
                  <div key={s.n} className="rounded-xl p-4 md:p-5 text-center"
                       style={{ background: "#ffffff04", border: "1px solid #ffffff0A" }}>
                    <div className="mx-auto mb-2.5 flex h-9 w-9 items-center justify-center rounded-lg"
                         style={{ background: `${s.color}12`, border: `1px solid ${s.color}20` }}>
                      <span className="font-poppins text-[0.7rem] font-extrabold" style={{ color: s.color }}>{s.n}</span>
                    </div>
                    <p className="text-[0.82rem] font-bold" style={{ color: "#F1F5F9" }}>{s.title}</p>
                    <p className="mt-1 text-[0.7rem] leading-[1.55]" style={{ color: "#7C8BA1" }}>{s.desc}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-center">
                <Link to="/spin-win">
                  <Button variant="cta" className="h-10 rounded-xl px-6 font-bold text-[0.82rem] shadow-lg shadow-primary/15">
                    <Gift className="ml-1.5 h-3.5 w-3.5" />أدر واربح الآن
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ 14 · MARKET ECHO TEASER ═══════════ */}
      <section
        className="relative overflow-hidden bg-background"
        style={{
          paddingTop: "clamp(40px, 5vw, 72px)",
          paddingBottom: "clamp(40px, 5vw, 72px)",
        }}
      >
        <div className="container max-w-[720px]">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <Link to="/market-echo" className="group block">
              <div
                className="relative rounded-2xl overflow-hidden p-6 md:p-8 text-center transition-all duration-300 group-hover:shadow-lg"
                style={{
                  background: "linear-gradient(160deg, #04152F 0%, #071B44 50%, #04152F 100%)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {/* Subtle grid texture */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                     style={{
                       backgroundImage: "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
                       backgroundSize: "88px 88px",
                     }}
                />

                <div className="relative">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="h-px w-8 rounded-full" style={{ background: "linear-gradient(to left, #CDBB9A50, transparent)" }} />
                    <span className="font-poppins text-[0.56rem] font-bold tracking-[0.2em] uppercase" style={{ color: "#CDBB9A" }}>
                      صدى السوق
                    </span>
                    <div className="h-px w-8 rounded-full" style={{ background: "linear-gradient(to right, #CDBB9A50, transparent)" }} />
                  </div>

                  <h3 className="text-[1.05rem] md:text-[1.2rem] font-bold leading-[1.25]" style={{ fontFamily: "var(--font-arabic-display)", color: "#F1F5F9" }}>
                    ٣٥ سنة والسوق يبدأ من هنا.
                  </h3>
                  <p className="mt-2 text-[0.78rem] leading-[1.7] max-w-[22rem] mx-auto" style={{ color: "#7C8BA1" }}>
                    قصة اسم بناه التجار والزبائن — ليس الإعلانات.
                  </p>

                  <div className="mt-4 inline-flex items-center gap-1.5 text-[0.78rem] font-bold transition-all group-hover:gap-2.5" style={{ color: "#5B9AFF" }}>
                    اكتشف القصة <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ 14.5 · DOWNTOWN HERITAGE ═══════════ */}
      <DowntownTeaser />

      {/* ═══════════ 15 · FAQ ═══════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #071326 0%, #0D1F3C 50%, #071326 100%)",
          paddingTop: "clamp(48px, 6vw, 96px)",
          paddingBottom: "clamp(48px, 6vw, 96px)",
        }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-[0.03]" style={{ background: "radial-gradient(circle, #2563EB 0%, transparent 70%)" }} />
        </div>

        <div className="container relative max-w-5xl">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
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
          </motion.div>
        </div>
      </section>

      {/* ═══════════ 16 · FINAL CTA ═══════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #071326 0%, #0D1F3C 50%, #071326 100%)",
          paddingTop: "clamp(56px, 7vw, 112px)",
          paddingBottom: "clamp(56px, 7vw, 112px)",
        }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, #2563EB 0%, transparent 70%)" }} />
        </div>

        <div className="container relative max-w-[700px]">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>
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
          </motion.div>
        </div>
      </section>
    </>
  );
}
