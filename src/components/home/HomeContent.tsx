import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Compass,
  Gift,
  Phone,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

const fallbackFaqs = [
  { id: "faq-1", question_ar: "أين يقع مول البستان؟", answer_ar: "في قلب القاهرة الجديدة، ضمن موقع يخدم مدينتي والرحاب والمناطق المحيطة." },
  { id: "faq-2", question_ar: "متى موعد الافتتاح؟", answer_ar: "الافتتاح الكبير مقرر في 1 مايو 2026." },
  { id: "faq-3", question_ar: "هل تتوفر وحدات للتأجير؟", answer_ar: "نعم، وحدات متعددة المساحات. استعرضها عبر الخريطة التفاعلية." },
  { id: "faq-4", question_ar: "كيف أجد محلا داخل المول؟", answer_ar: "استخدم الخريطة التفاعلية أو دليل المحلات." },
  { id: "faq-5", question_ar: "هل سيتوفر تسوّق إلكتروني؟", answer_ar: "السوق الرقمي مرحلة قادمة." },
  { id: "faq-6", question_ar: "كيف أتقدم باستفسار تجاري؟", answer_ar: "من صفحة التأجير أو التواصل." },
];

const sectionReveal = {
  hidden: { opacity: 0, y: 14 },
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
      {/* ═══════════ 1 · HERO WITH INTEGRATED COUNTDOWN ═══════════ */}
      <HeroSlider />

      {/* ═══════════ 2 · FEATURED PRODUCTS ═══════════ */}
      <FeaturedProducts />

      {/* ═══════════ 3 · MERCHANT LOGO WALL ═══════════ */}
      <MerchantLogoWall />

      <div className="band-primary" />

      {/* ═══════════ 4 · MAP TEASER ═══════════ */}
      <section className="py-6 md:py-8" style={{ background: "#FAFAF8" }}>
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
      <section className="py-6 md:py-8" style={{ background: "#F5F2EC" }}>
        <div className="container">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
              <div className="space-y-3 p-5 md:p-6">
                <p className="section-kicker">أدر واربح</p>
                <h2 className="section-title max-w-[18rem]">شارك واحضر لاستلام جائزتك.</h2>
                <p className="text-[0.82rem] leading-[1.65] light-body max-w-[24rem]">
                  سجّل مشاركتك الآن — واحضر يوم الافتتاح لاستلام جائزتك.
                </p>

                <div className="flex flex-wrap gap-5 border-t border-border pt-3">
                  {[
                    { n: "01", title: "سجّل", desc: "أدخل بياناتك وأدر العجلة." },
                    { n: "02", title: "احفظ النتيجة", desc: "احتفظ بشاشة الفوز." },
                    { n: "03", title: "احضر واستلم", desc: "أثبت حضورك يوم الافتتاح." },
                  ].map((s) => (
                    <div key={s.n} className="min-w-[6rem]">
                      <span className="font-poppins text-[0.62rem] font-bold text-primary">{s.n}</span>
                      <p className="mt-0.5 text-[0.82rem] font-bold light-heading">{s.title}</p>
                      <p className="mt-0.5 text-[0.74rem] leading-[1.5] light-body">{s.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2.5 pt-1">
                  <Link to="/spin-win">
                    <Button variant="cta" className="h-10 rounded-lg px-5 font-bold text-[0.82rem]">
                      <Gift className="ml-1.5 h-3.5 w-3.5" />أدر واربح
                    </Button>
                  </Link>
                  <Link to="/opening-day">
                    <Button variant="outline-blue" className="h-10 rounded-lg px-5 text-[0.82rem]">تفاصيل الافتتاح</Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ 6 · DOWNTOWN TEASER ═══════════ */}
      <DowntownTeaser />

      <div className="band-primary" />

      {/* ═══════════ 7 · FAQ ═══════════ */}
      <section className="py-6 md:py-8" style={{ background: "#FAFAF8" }}>
        <div className="container max-w-5xl">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="grid items-start gap-6 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="lg:sticky lg:top-24">
                <div className="chapter-shell pt-3">
                  <p className="section-kicker">أسئلة شائعة</p>
                  <h2 className="section-title">ما يجب معرفته</h2>
                </div>
                <p className="mt-2 text-[0.82rem] leading-[1.65] light-body max-w-[22rem]">أبرز الأسئلة قبل الزيارة أو الاستثمار.</p>
                <Link to="/faq" className="mt-3 inline-flex">
                  <Button variant="ghost" className="gap-1 px-0 text-[0.82rem] font-bold text-primary hover:text-primary/80">جميع الأسئلة <ArrowLeft className="h-3.5 w-3.5" /></Button>
                </Link>
              </div>

              <Accordion type="single" collapsible defaultValue={faqItems[0]?.id} className="space-y-2">
                {faqItems.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id} className="overflow-hidden rounded-lg border border-border bg-card px-4">
                    <AccordionTrigger className="min-h-[2.75rem] py-3 text-right text-[0.86rem] font-bold light-heading hover:text-primary">
                      {faq.question_ar}
                    </AccordionTrigger>
                    <AccordionContent className="pb-3.5 text-[0.82rem] leading-[1.65] light-body">
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
      <section className="py-6 md:py-8" style={{ background: "#071326" }}>
        <div className="container max-w-[680px] text-center">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="mx-auto max-w-[20rem] text-[1.1rem] font-bold leading-[1.15] md:text-[1.3rem] dark-heading">
              استكشف، قارن، وقرّر.
            </h2>
            <p className="mx-auto mt-2 text-[0.82rem] leading-[1.65] dark-body max-w-[18rem]">
              كل ما تحتاجه للبدء — أمامك الآن.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2.5">
              <Link to="/map">
                <Button variant="cta" className="h-10 rounded-lg px-5 text-[0.82rem] font-bold shadow-[var(--shadow-blue)]">
                  <Compass className="ml-1.5 h-3.5 w-3.5" /> استكشف الخريطة
                </Button>
              </Link>
              <Link to="/stores">
                <Button className="h-10 rounded-lg border px-5 text-[0.82rem] font-bold" style={{ borderColor: "#ffffff1A", background: "#ffffff0A", color: "#E2E8F0" }}>
                  تصفّح المحلات
                </Button>
              </Link>
              <Link to="/leasing">
                <Button variant="orange" className="h-10 rounded-lg px-5 text-[0.82rem] font-bold">
                  <Phone className="ml-1.5 h-3.5 w-3.5" /> استفسار التأجير
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
