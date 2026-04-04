import { useState, useMemo, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Compass,
  Gift,
  Phone,
  ShoppingBag,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "@/components/CountdownTimer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HeroSlider } from "@/components/home/HeroSlider";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { MerchantLogoWall } from "@/components/home/MerchantLogoWall";
import { DowntownTeaser } from "@/components/home/DowntownTeaser";
import { DealsTeaser } from "@/components/home/DealsTeaser";
import { FeaturedStores } from "@/components/home/FeaturedStores";

/* Lazy-load the map teaser since it includes a heavy SVG floor plan */
const MapTeaserPreview = lazy(() =>
  import("@/components/home/MapTeaserPreview").then((m) => ({ default: m.MapTeaserPreview }))
);

const fallbackFaqs = [
  { id: "faq-1", question_ar: "أين يقع مول البستان؟", answer_ar: "في قلب القاهرة الجديدة، ضمن موقع يخدم مدينتي والرحاب والمناطق المحيطة." },
  { id: "faq-2", question_ar: "متى موعد الافتتاح؟", answer_ar: "الافتتاح الكبير مقرر في 1 مايو 2026." },
  { id: "faq-3", question_ar: "هل تتوفر وحدات للتأجير؟", answer_ar: "نعم، وحدات متعددة المساحات. استعرضها عبر الخريطة التفاعلية." },
  { id: "faq-4", question_ar: "كيف أجد محلًا داخل المول؟", answer_ar: "استخدم الخريطة التفاعلية أو دليل المحلات." },
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

export function HomeContent({ faqs }: HomeContentProps) {
  const faqItems = (faqs.length >= 5 ? faqs : fallbackFaqs).slice(0, 6);

  return (
    <>
      {/* ═══════════ 1 · HERO ═══════════ */}
      <HeroSlider />

      {/* countdown is now inside the hero — no separate strip needed */}

      {/* ═══════════ 2 · FEATURED PRODUCTS ═══════════ */}
      <FeaturedProducts />

      {/* ═══════════ 3 · DEALS TEASER ═══════════ */}
      <DealsTeaser />

      {/* ═══════════ 3.5 · FEATURED STORES ═══════════ */}
      <FeaturedStores />

      {/* ═══════════ 4 · MERCHANT LOGO WALL ═══════════ */}
      <MerchantLogoWall />

      <div className="band-primary" />

      {/* ═══════════ 5 · MAP TEASER ═══════════ */}
      <section className="py-8 md:py-10" style={{ background: "#FAFAF8" }}>
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

      {/* ═══════════ 6 · SPIN & WIN TEASER ═══════════ */}
      <section className="relative overflow-hidden py-12 md:py-16" style={{ background: "linear-gradient(135deg, #071326 0%, #0D1F3C 50%, #071326 100%)" }}>
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-[0.05]" style={{ background: "radial-gradient(circle, #2563EB 0%, transparent 70%)" }} />
          <div className="absolute bottom-0 right-0 w-[350px] h-[350px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, #F97316 0%, transparent 70%)" }} />
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        <div className="container relative">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="mx-auto max-w-[56rem]">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-3.5" style={{ background: "#F9731612", border: "1px solid #F9731625" }}>
                  <Gift className="h-3.5 w-3.5" style={{ color: "#F97316" }} />
                  <span className="text-[0.7rem] font-bold" style={{ color: "#F97316" }}>حملة الافتتاح الكبرى</span>
                </div>
                <h2 className="text-[1.2rem] md:text-[1.45rem] font-bold leading-[1.15]" style={{ fontFamily: "var(--font-arabic-display)", color: "#F8FAFC" }}>
                  أدر العجلة واربح يوم الافتتاح.
                </h2>
                <p className="mt-2.5 text-[0.84rem] leading-[1.7] max-w-lg mx-auto" style={{ color: "#94A3B8" }}>
                  جوائز حقيقية من محلات المول — سجّل الآن واحضر يوم الافتتاح لاستلام جائزتك.
                </p>
              </div>

              {/* Steps */}
              <div className="grid grid-cols-3 gap-2.5 md:gap-3.5 mb-8">
                {[
                  { n: "01", title: "تصفّح المحلات", desc: "اعرف المحلات المشاركة.", color: "#2563EB" },
                  { n: "02", title: "أدر واربح", desc: "سجّل بياناتك واحفظ نتيجتك.", color: "#06B6D4" },
                  { n: "03", title: "احضر واستلم", desc: "أثبت حضورك يوم الافتتاح.", color: "#F97316" },
                ].map((s, i) => (
                  <div key={s.n} className="group relative rounded-2xl p-4 md:p-6 text-center transition-all hover:bg-white/[0.04]"
                       style={{ background: "#ffffff05", border: "1px solid #ffffff0D" }}>
                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
                         style={{ background: `${s.color}15`, border: `1px solid ${s.color}28` }}>
                      <span className="font-poppins text-[0.74rem] font-extrabold" style={{ color: s.color }}>{s.n}</span>
                    </div>
                    <p className="text-[0.86rem] font-bold" style={{ color: "#F1F5F9" }}>{s.title}</p>
                    <p className="mt-1.5 text-[0.74rem] leading-[1.65]" style={{ color: "#7C8BA1" }}>{s.desc}</p>
                    {i < 2 && (
                      <div className="hidden md:block absolute top-1/2 -left-2 w-4 h-px" style={{ background: "#ffffff12" }} />
                    )}
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/spin-win">
                  <Button variant="cta" className="h-11 rounded-xl px-7 font-bold text-[0.86rem] shadow-lg shadow-primary/20">
                    <Gift className="ml-1.5 h-4 w-4" />أدر واربح الآن
                  </Button>
                </Link>
                <Link to="/opening-day">
                  <Button className="h-11 rounded-xl border px-6 text-[0.86rem] font-bold transition-colors hover:bg-white/8"
                          style={{ borderColor: "#ffffff18", background: "#ffffff06", color: "#CBD5E1" }}>
                    تفاصيل يوم الافتتاح
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="band-primary" />

      {/* ═══════════ 7 · MARKETPLACE CTA ═══════════ */}
      <section className="heritage-deep relative overflow-hidden py-10 md:py-12">
        <div className="relative container max-w-3xl">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="mx-auto max-w-[24rem] text-center">
              <p className="section-kicker dark-kicker">سوق المحلات</p>
              <h2 className="section-title dark-heading">تصفّح منتجات المحلات.</h2>
            </div>

            <div className="mx-auto mt-6 grid max-w-2xl gap-3 sm:grid-cols-3">
              {[
                { n: "01", icon: Compass, label: "الخريطة التفاعلية", desc: "كل دور بحالته الفعلية.", active: true },
                { n: "02", icon: ShoppingBag, label: "منتجات المحلات", desc: "تصفّح واطلب مباشرة.", active: true },
                { n: "03", icon: Store, label: "السوق الإلكتروني", desc: "طلب ودفع — قريبًا.", active: false },
              ].map((item) => (
                <div key={item.n} className="heritage-surface rounded-xl p-5 text-center transition-all hover:scale-[1.01]">
                  <span className="font-poppins text-[0.6rem] font-bold dark-kicker">{item.n}</span>
                  <div className="mx-auto mt-2.5 mb-2.5 flex h-10 w-10 items-center justify-center rounded-xl"
                       style={{ background: item.active ? "#2D6BFF12" : "#ffffff08", border: `1px solid ${item.active ? "#2D6BFF28" : "#ffffff10"}` }}>
                    <item.icon className="h-4.5 w-4.5" style={{ color: item.active ? "#5B9AFF" : "#7C8BA1" }} />
                  </div>
                  <p className="text-[0.84rem] font-bold dark-heading">{item.label}</p>
                  <p className="mt-1 text-[0.74rem] leading-[1.55] dark-muted">{item.desc}</p>
                  {item.active && (
                    <span className="mt-2.5 inline-flex rounded-full px-3 py-0.5 text-[0.6rem] font-bold"
                          style={{ background: "#2D6BFF12", color: "#5B9AFF", border: "1px solid #2D6BFF22" }}>
                      متاح
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/products">
                <Button variant="cta" className="h-10 rounded-xl px-6 text-[0.82rem] font-bold">
                  <ShoppingBag className="ml-1.5 h-3.5 w-3.5" /> تصفّح المنتجات
                </Button>
              </Link>
              <Link to="/join-marketplace">
                <Button className="h-10 rounded-xl border px-6 text-[0.82rem] font-bold transition-colors hover:bg-white/8"
                        style={{ borderColor: "#ffffff18", background: "#ffffff08", color: "#E2E8F0" }}>
                  انضم كتاجر
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ 8 · DOWNTOWN TEASER ═══════════ */}
      <DowntownTeaser />

      <div className="band-primary" />

      {/* ═══════════ 9 · FAQ ═══════════ */}
      <section className="relative overflow-hidden py-12 md:py-16" style={{ background: "linear-gradient(160deg, #071326 0%, #0D1F3C 50%, #071326 100%)" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, #2563EB 0%, transparent 70%)" }} />
          <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        <div className="container relative max-w-5xl">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="grid items-start gap-8 lg:grid-cols-[0.75fr_1.25fr]">
              {/* Right: intro */}
              <div className="lg:sticky lg:top-24">
                <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-3.5" style={{ background: "#2563EB10", border: "1px solid #2563EB20" }}>
                  <span className="text-[0.7rem] font-bold" style={{ color: "#60A5FA" }}>FAQ</span>
                </div>
                <h2 className="text-[1.2rem] md:text-[1.4rem] font-bold leading-[1.15]" style={{ fontFamily: "var(--font-arabic-display)", color: "#F8FAFC" }}>
                  أسئلة شائعة
                </h2>
                <p className="mt-3 text-[0.84rem] leading-[1.75] max-w-[22rem]" style={{ color: "#94A3B8" }}>
                  أبرز الأسئلة حول الموقع، الافتتاح، التأجير، والخدمات.
                </p>
                <Link to="/faq" className="mt-5 inline-flex">
                  <Button className="h-10 rounded-xl border px-6 text-[0.82rem] font-bold gap-1.5 transition-colors hover:bg-white/8"
                          style={{ borderColor: "#ffffff18", background: "#ffffff06", color: "#CBD5E1" }}>
                    جميع الأسئلة <ArrowLeft className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>

              {/* Left: accordion */}
              <Accordion type="single" collapsible defaultValue={faqItems[0]?.id} className="space-y-3">
                {faqItems.map((faq, i) => (
                  <AccordionItem
                    key={faq.id}
                    value={faq.id}
                    className="overflow-hidden rounded-xl border px-5 transition-colors data-[state=open]:bg-white/[0.03]"
                    style={{ background: "#ffffff04", borderColor: "#ffffff0D" }}
                  >
                    <AccordionTrigger className="min-h-[3.25rem] py-4 text-right text-[0.88rem] font-bold hover:no-underline" style={{ color: "#F1F5F9" }}>
                      <span className="flex items-center gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-poppins text-[0.64rem] font-extrabold"
                              style={{ background: "#2563EB15", color: "#60A5FA", border: "1px solid #2563EB28" }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {faq.question_ar}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 pr-10 text-[0.82rem] leading-[1.8]" style={{ color: "#94A3B8" }}>
                      {faq.answer_ar}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ 10 · FINAL CTA ═══════════ */}
      <section className="relative overflow-hidden py-14 md:py-20" style={{ background: "linear-gradient(160deg, #071326 0%, #0D1F3C 50%, #071326 100%)" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full opacity-[0.05]" style={{ background: "radial-gradient(circle, #2563EB 0%, transparent 70%)" }} />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, #F97316 0%, transparent 70%)" }} />
        </div>

        <div className="container relative max-w-[740px]">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {/* Divider accent */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-12 rounded-full" style={{ background: "linear-gradient(to left, #CDBB9A, transparent)" }} />
              <span className="font-poppins text-[0.6rem] font-bold tracking-[0.22em] uppercase" style={{ color: "#CDBB9A" }}>ابدأ من هنا</span>
              <div className="h-px w-12 rounded-full" style={{ background: "linear-gradient(to right, #CDBB9A, transparent)" }} />
            </div>

            <h2 className="mx-auto max-w-[24rem] text-center text-[1.2rem] md:text-[1.5rem] font-bold leading-[1.15]"
                style={{ fontFamily: "var(--font-arabic-display)", color: "#F8FAFC" }}>
              المول جاهز — والقرار بيدك.
            </h2>
            <p className="mx-auto mt-3 max-w-[22rem] text-center text-[0.86rem] leading-[1.75]" style={{ color: "#94A3B8" }}>
              استكشف المحلات، قارن الوحدات، واتخذ خطوتك القادمة.
            </p>

            {/* Action cards */}
            <div className="mx-auto mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { icon: Compass, label: "استكشف الخريطة", desc: "خريطة تفاعلية لكل دور.", to: "/map", color: "#2563EB" },
                { icon: Store, label: "دليل المحلات", desc: "تصفّح كل المحلات.", to: "/stores", color: "#06B6D4" },
                { icon: Phone, label: "استفسار التأجير", desc: "وحدات جاهزة للتأجير.", to: "/leasing", color: "#F97316" },
              ].map((item) => (
                <Link key={item.to} to={item.to} className="group">
                  <div className="rounded-2xl p-5 text-center transition-all duration-300 hover:scale-[1.02] hover:bg-white/[0.04]"
                       style={{ background: "#ffffff05", border: "1px solid #ffffff0D" }}>
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl transition-colors"
                         style={{ background: `${item.color}12`, border: `1px solid ${item.color}22` }}>
                      <item.icon className="h-5 w-5" style={{ color: item.color }} />
                    </div>
                    <p className="text-[0.88rem] font-bold" style={{ color: "#F1F5F9" }}>{item.label}</p>
                    <p className="mt-1.5 text-[0.74rem] leading-[1.55]" style={{ color: "#7C8BA1" }}>{item.desc}</p>
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
