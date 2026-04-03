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
import { MapTeaserPreview } from "@/components/home/MapTeaserPreview";
import { HeroSlider } from "@/components/home/HeroSlider";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { MerchantLogoWall } from "@/components/home/MerchantLogoWall";
import { DowntownTeaser } from "@/components/home/DowntownTeaser";
import { DealsTeaser } from "@/components/home/DealsTeaser";

const fallbackFaqs = [
  { id: "faq-1", question_ar: "أين يقع مول البستان؟", answer_ar: "في قلب القاهرة الجديدة، ضمن موقع يخدم مدينتي والرحاب والمناطق المحيطة." },
  { id: "faq-2", question_ar: "متى موعد الافتتاح؟", answer_ar: "الافتتاح الكبير مقرر في 1 مايو 2026." },
  { id: "faq-3", question_ar: "هل تتوفر وحدات للتأجير؟", answer_ar: "نعم، وحدات متعددة المساحات. استعرضها عبر الخريطة التفاعلية." },
  { id: "faq-4", question_ar: "كيف أجد محلًا داخل المول؟", answer_ar: "استخدم الخريطة التفاعلية أو دليل المحلات." },
  { id: "faq-5", question_ar: "هل سيتوفر تسوّق إلكتروني؟", answer_ar: "السوق الرقمي مرحلة قادمة." },
  { id: "faq-6", question_ar: "كيف أتقدم باستفسار تجاري؟", answer_ar: "من صفحة التأجير أو التواصل." },
];

const sectionReveal = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
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
      {/* ═══════════ 1 · HERO (with integrated countdown) ═══════════ */}
      <HeroSlider />

      {/* ── mobile countdown strip ── */}
      <section className="border-b border-border bg-card py-2.5 lg:hidden">
        <div className="container flex flex-col items-center gap-2 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <p className="text-[0.78rem] font-bold text-foreground">الافتتاح — 1 مايو 2026</p>
          </div>
          <CountdownTimer compact />
        </div>
      </section>

      {/* ═══════════ 2 · FEATURED PRODUCTS ═══════════ */}
      <FeaturedProducts />

      {/* ═══════════ 3 · DEALS TEASER ═══════════ */}
      <DealsTeaser />

      {/* ═══════════ 4 · MERCHANT LOGO WALL ═══════════ */}
      <MerchantLogoWall />

      <div className="band-primary" />

      {/* ═══════════ 4 · MAP TEASER ═══════════ */}
      <section className="py-7 md:py-9" style={{ background: "#FAFAF8" }}>
        <div className="container">
          <motion.div
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="mx-auto max-w-[58rem]"
          >
            <MapTeaserPreview />
          </motion.div>
        </div>
      </section>

      {/* ═══════════ 5 · SPIN & WIN TEASER ═══════════ */}
      <section className="relative overflow-hidden py-10 md:py-14" style={{ background: "linear-gradient(135deg, #071326 0%, #0D1F3C 50%, #071326 100%)" }}>
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, #2563EB 0%, transparent 70%)" }} />
          <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full opacity-[0.03]" style={{ background: "radial-gradient(circle, #F97316 0%, transparent 70%)" }} />
        </div>

        <div className="container relative">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="mx-auto max-w-[54rem]">
              {/* Header */}
              <div className="text-center mb-7">
                <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 mb-3" style={{ background: "#F9731612", border: "1px solid #F9731625" }}>
                  <Gift className="h-3 w-3" style={{ color: "#F97316" }} />
                  <span className="text-[0.68rem] font-bold" style={{ color: "#F97316" }}>حملة الافتتاح الكبرى</span>
                </div>
                <h2 className="text-[1.15rem] md:text-[1.35rem] font-bold leading-[1.2] dark-heading" style={{ fontFamily: "var(--font-arabic-display)" }}>
                  سجّل. ادخل السحب. احضر واستلم.
                </h2>
                <p className="mt-2 text-[0.82rem] leading-[1.65] max-w-md mx-auto" style={{ color: "#94A3B8" }}>
                  شارك في مسابقة الافتتاح واحصل على فرصة للفوز بجوائز حقيقية من محلات المول.
                </p>
              </div>

              {/* Steps */}
              <div className="grid grid-cols-3 gap-2 md:gap-3 mb-7">
                {[
                  { n: "01", title: "استكشف", desc: "تعرّف على المحلات المشاركة في السحب.", color: "#2563EB" },
                  { n: "02", title: "شارك وادخل السحب", desc: "سجّل بياناتك واحفظ نتيجتك.", color: "#06B6D4" },
                  { n: "03", title: "احضر واستلم", desc: "أثبت حضورك يوم الافتتاح لاستلام الجائزة.", color: "#F97316" },
                ].map((s, i) => (
                  <div key={s.n} className="group relative rounded-xl p-4 md:p-5 text-center transition-all" style={{ background: "#ffffff06", border: "1px solid #ffffff0D" }}>
                    {/* Step number */}
                    <div className="mx-auto mb-2.5 flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: `${s.color}18`, border: `1px solid ${s.color}30` }}>
                      <span className="font-poppins text-[0.72rem] font-extrabold" style={{ color: s.color }}>{s.n}</span>
                    </div>
                    <p className="text-[0.84rem] font-bold dark-heading">{s.title}</p>
                    <p className="mt-1 text-[0.72rem] leading-[1.6]" style={{ color: "#7C8BA1" }}>{s.desc}</p>
                    {/* Connector line */}
                    {i < 2 && (
                      <div className="hidden md:block absolute top-1/2 -left-1.5 md:-left-2 w-3 md:w-4 h-px" style={{ background: "#ffffff15" }} />
                    )}
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex flex-wrap justify-center gap-2.5">
                <Link to="/spin-win">
                  <Button variant="cta" className="h-10 rounded-lg px-6 font-bold text-[0.84rem] shadow-[var(--shadow-blue)]">
                    <Gift className="ml-1.5 h-4 w-4" />أدر واربح الآن
                  </Button>
                </Link>
                <Link to="/opening-day">
                  <Button className="h-10 rounded-lg border px-5 text-[0.84rem] font-bold" style={{ borderColor: "#ffffff1A", background: "#ffffff08", color: "#CBD5E1" }}>
                    تفاصيل يوم الافتتاح
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="band-primary" />

      {/* ═══════════ 6 · MARKETPLACE CTA ═══════════ */}
      <section className="heritage-deep relative overflow-hidden py-8 md:py-10">
        <div className="relative container max-w-3xl">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="mx-auto max-w-[22rem] text-center">
              <p className="section-kicker dark-kicker">سوق البستان الرقمي</p>
              <h2 className="section-title dark-heading">من مول إلى منصة.</h2>
            </div>

            <div className="mx-auto mt-5 grid max-w-2xl gap-2.5 sm:grid-cols-3">
              {[
                { n: "01", icon: Compass, label: "الدليل التفاعلي", desc: "خريطة لكل دور بالحالة الفعلية.", active: true },
                { n: "02", icon: ShoppingBag, label: "سوق المنتجات", desc: "تصفّح منتجات المحلات.", active: true },
                { n: "03", icon: Store, label: "الماركتبليس", desc: "شراء وسلة ودفع — قريبا.", active: false },
              ].map((item) => (
                <div key={item.n} className="heritage-surface rounded-lg p-4 text-center">
                  <span className="font-poppins text-[0.58rem] font-bold dark-kicker">{item.n}</span>
                  <div className="mx-auto mt-2 mb-2 flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: item.active ? "#2D6BFF14" : "#ffffff08", border: `1px solid ${item.active ? "#2D6BFF30" : "#ffffff10"}` }}>
                    <item.icon className="h-4 w-4" style={{ color: item.active ? "#5B9AFF" : "#7C8BA1" }} />
                  </div>
                  <p className="text-[0.82rem] font-bold dark-heading">{item.label}</p>
                  <p className="mt-0.5 text-[0.72rem] leading-[1.5] dark-muted">{item.desc}</p>
                  {item.active && (
                    <span className="mt-2 inline-flex rounded-full px-2.5 py-0.5 text-[0.58rem] font-bold" style={{ background: "#2D6BFF14", color: "#5B9AFF", border: "1px solid #2D6BFF25" }}>
                      متاح
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-2.5">
              <Link to="/products">
                <Button variant="cta" className="h-9 rounded-lg px-5 text-[0.8rem] font-bold">
                  <ShoppingBag className="ml-1.5 h-3.5 w-3.5" /> تصفّح المنتجات
                </Button>
              </Link>
              <Link to="/join-marketplace">
                <Button className="h-9 rounded-lg border px-5 text-[0.8rem] font-bold" style={{ borderColor: "#ffffff1A", background: "#ffffff0A", color: "#E2E8F0" }}>
                  انضم كتاجر
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ 7 · DOWNTOWN TEASER ═══════════ */}
      <DowntownTeaser />

      <div className="band-primary" />

      {/* ═══════════ 8 · FAQ ═══════════ */}
      <section className="relative overflow-hidden py-10 md:py-14" style={{ background: "linear-gradient(160deg, #071326 0%, #0D1F3C 50%, #071326 100%)" }}>
        {/* Decorative */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, #2563EB 0%, transparent 70%)" }} />
        </div>

        <div className="container relative max-w-5xl">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="grid items-start gap-8 lg:grid-cols-[0.75fr_1.25fr]">
              {/* Right: intro */}
              <div className="lg:sticky lg:top-24">
                <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 mb-3" style={{ background: "#2563EB12", border: "1px solid #2563EB25" }}>
                  <span className="text-[0.68rem] font-bold" style={{ color: "#60A5FA" }}>FAQ</span>
                </div>
                <h2 className="text-[1.15rem] md:text-[1.35rem] font-bold leading-[1.2] dark-heading" style={{ fontFamily: "var(--font-arabic-display)" }}>
                  ما يجب معرفته قبل الزيارة
                </h2>
                <p className="mt-2.5 text-[0.84rem] leading-[1.7] max-w-[22rem]" style={{ color: "#94A3B8" }}>
                  أبرز الأسئلة حول الموقع، الافتتاح، التأجير، والخدمات المتاحة.
                </p>
                <Link to="/faq" className="mt-4 inline-flex">
                  <Button className="h-9 rounded-lg border px-5 text-[0.8rem] font-bold gap-1.5" style={{ borderColor: "#ffffff1A", background: "#ffffff08", color: "#CBD5E1" }}>
                    جميع الأسئلة <ArrowLeft className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>

              {/* Left: accordion */}
              <Accordion type="single" collapsible defaultValue={faqItems[0]?.id} className="space-y-2.5">
                {faqItems.map((faq, i) => (
                  <AccordionItem
                    key={faq.id}
                    value={faq.id}
                    className="overflow-hidden rounded-xl border px-5"
                    style={{ background: "#ffffff06", borderColor: "#ffffff0D" }}
                  >
                    <AccordionTrigger className="min-h-[3rem] py-3.5 text-right text-[0.86rem] font-bold hover:no-underline" style={{ color: "#F1F5F9" }}>
                      <span className="flex items-center gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md font-poppins text-[0.62rem] font-extrabold" style={{ background: "#2563EB18", color: "#60A5FA", border: "1px solid #2563EB30" }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {faq.question_ar}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 pr-9 text-[0.82rem] leading-[1.7]" style={{ color: "#94A3B8" }}>
                      {faq.answer_ar}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ FINAL CTA ═══════════ */}
      <section className="relative overflow-hidden py-12 md:py-16" style={{ background: "linear-gradient(160deg, #071326 0%, #0D1F3C 50%, #071326 100%)" }}>
        {/* Decorative */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full opacity-[0.05]" style={{ background: "radial-gradient(circle, #2563EB 0%, transparent 70%)" }} />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, #F97316 0%, transparent 70%)" }} />
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[300px] h-[300px] rounded-full opacity-[0.03]" style={{ background: "radial-gradient(circle, #06B6D4 0%, transparent 70%)" }} />
        </div>

        <div className="container relative max-w-[720px]">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {/* Divider accent */}
            <div className="flex items-center justify-center gap-2.5 mb-5">
              <div className="h-px w-10 rounded-full" style={{ background: "linear-gradient(to left, #CDBB9A, transparent)" }} />
              <span className="font-poppins text-[0.58rem] font-bold tracking-[0.22em] uppercase" style={{ color: "#CDBB9A" }}>ابدأ من هنا</span>
              <div className="h-px w-10 rounded-full" style={{ background: "linear-gradient(to right, #CDBB9A, transparent)" }} />
            </div>

            <h2 className="mx-auto max-w-[22rem] text-center text-[1.15rem] md:text-[1.4rem] font-bold leading-[1.2] dark-heading" style={{ fontFamily: "var(--font-arabic-display)" }}>
              المول جاهز — والقرار بيدك.
            </h2>
            <p className="mx-auto mt-2.5 max-w-[20rem] text-center text-[0.84rem] leading-[1.7]" style={{ color: "#94A3B8" }}>
              استكشف المحلات، قارن الوحدات، واتخذ خطوتك القادمة.
            </p>

            {/* Action cards */}
            <div className="mx-auto mt-7 grid gap-2.5 sm:grid-cols-3">
              {[
                { icon: Compass, label: "استكشف الخريطة", desc: "خريطة تفاعلية لكل دور.", to: "/map", color: "#2563EB", variant: "cta" as const },
                { icon: Store, label: "دليل المحلات", desc: "تصفّح كل المحلات.", to: "/stores", color: "#06B6D4", variant: undefined },
                { icon: Phone, label: "استفسار التأجير", desc: "وحدات جاهزة للتأجير.", to: "/leasing", color: "#F97316", variant: "orange" as const },
              ].map((item) => (
                <Link key={item.to} to={item.to} className="group">
                  <div className="rounded-xl p-4 text-center transition-all duration-300 hover:scale-[1.02]" style={{ background: "#ffffff06", border: "1px solid #ffffff0D" }}>
                    <div className="mx-auto mb-2.5 flex h-10 w-10 items-center justify-center rounded-lg transition-colors" style={{ background: `${item.color}15`, border: `1px solid ${item.color}28` }}>
                      <item.icon className="h-4.5 w-4.5" style={{ color: item.color }} />
                    </div>
                    <p className="text-[0.86rem] font-bold" style={{ color: "#F1F5F9" }}>{item.label}</p>
                    <p className="mt-1 text-[0.72rem] leading-[1.5]" style={{ color: "#7C8BA1" }}>{item.desc}</p>
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
