import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Compass,
  Gift,
  Layers,
  MapPin,
  Phone,
  ShoppingBag,
  Store,
  Zap,
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

import { allMapUnits } from "@/lib/floorMapData";

const fallbackFaqs = [
  { id: "faq-1", question_ar: "أين يقع مول البستان؟", answer_ar: "في قلب القاهرة الجديدة، ضمن موقع يخدم مدينتي والرحاب والمناطق المحيطة." },
  { id: "faq-2", question_ar: "متى موعد الافتتاح؟", answer_ar: "الافتتاح الكبير مقرر في 1 مايو 2026." },
  { id: "faq-3", question_ar: "هل تتوفر وحدات للتأجير؟", answer_ar: "نعم، وحدات متعددة المساحات. استعرضها عبر الخريطة التفاعلية." },
  { id: "faq-4", question_ar: "كيف أجد متجرًا داخل المول؟", answer_ar: "استخدم الخريطة التفاعلية أو دليل المتاجر." },
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
  const totalUnits = allMapUnits.length;
  const faqItems = (faqs.length >= 5 ? faqs : fallbackFaqs).slice(0, 6);

  return (
    <>
      {/* ═══════════ 1 · 3-SLIDE HERO ═══════════ */}
      <HeroSlider />

      {/* ── countdown strip ── */}
      <section className="border-b border-border bg-card py-2.5">
        <div className="container flex flex-col items-center gap-2 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <p className="text-[0.8rem] font-bold text-foreground">الافتتاح الكبير — 1 مايو 2026</p>
          </div>
          <CountdownTimer compact />
        </div>
      </section>

      {/* ── quick stats strip ── */}
      <section className="py-4" style={{ background: "#F5F2EC" }}>
        <div className="container">
          <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
            {[
              { icon: MapPin, stat: `${totalUnits}+`, label: "وحدة تجارية" },
              { icon: Layers, stat: "3", label: "أدوار تجارية" },
              { icon: Store, stat: "6", label: "تخصصات" },
              { icon: Compass, stat: "دليل حي", label: "خريطة تفاعلية" },
              { icon: Gift, stat: "جوائز", label: "أدر واربح" },
              { icon: ShoppingBag, stat: "سوق رقمي", label: "ماركتبليس" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
                <s.icon className="h-3.5 w-3.5 shrink-0 text-primary" />
                <div>
                  <p className="font-poppins text-[0.72rem] font-extrabold light-heading">{s.stat}</p>
                  <p className="text-[0.55rem] font-semibold light-muted">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
      <section className="py-8 md:py-10" style={{ background: "#F5F2EC" }}>
        <div className="container">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
              <div className="grid lg:grid-cols-[1.4fr_0.6fr]">
                <div className="space-y-3.5 p-5 md:p-6">
                  <p className="section-kicker">حملة الافتتاح</p>
                  <h2 className="section-title max-w-[18rem]">افتتاح يكافئ من يحضر.</h2>
                  <p className="text-[0.82rem] leading-[1.65] light-body max-w-[24rem]">
                    سجّل مشاركتك الآن — واحضر يوم الافتتاح لاستلام جائزتك.
                  </p>

                  <div className="flex flex-wrap gap-5 border-t border-border pt-4">
                    {[
                      { n: "01", title: "استكشف", desc: "تعرّف على الأقسام والمتاجر." },
                      { n: "02", title: "شارك", desc: "سجّل واحفظ نتيجتك." },
                      { n: "03", title: "احضر واستلم", desc: "إثبات حضورك يوم الافتتاح." },
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

                <div className="hidden border-r border-border p-5 lg:flex lg:flex-col lg:items-center lg:justify-center" style={{ background: "#F5F2EC" }}>
                  <div className="rounded-lg border border-border bg-card p-4 text-center shadow-[var(--shadow-soft)]">
                    <p className="text-[0.7rem] font-bold light-muted">الافتتاح الكبير</p>
                    <p className="mt-1.5 text-[1.15rem] font-extrabold light-heading">1 مايو 2026</p>
                    <div className="mt-2.5"><CountdownTimer compact /></div>
                  </div>
                </div>
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
              <h2 className="section-title dark-heading">من مول إلى منصة رقمية.</h2>
            </div>

            <div className="mx-auto mt-5 grid max-w-2xl gap-2.5 sm:grid-cols-3">
              {[
                { n: "01", icon: Compass, label: "الدليل التفاعلي", desc: "خريطة لكل دور — بالحالة الفعلية.", active: true },
                { n: "02", icon: ShoppingBag, label: "سوق المنتجات", desc: "تصفّح منتجات المتاجر مباشرة.", active: true },
                { n: "03", icon: Zap, label: "الماركتبليس الكامل", desc: "شراء وسلة ودفع — قريبًا.", active: false },
              ].map((item) => (
                <div key={item.n} className="heritage-surface rounded-lg p-4 text-center">
                  <span className="font-poppins text-[0.58rem] font-bold dark-kicker">{item.n}</span>
                  <div className="mx-auto mt-2 mb-2 flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: item.active ? "#2D6BFF14" : "#ffffff08", border: `1px solid ${item.active ? "#2D6BFF30" : "#ffffff10"}` }}>
                    <item.icon className="h-4 w-4" style={{ color: item.active ? "#5B9AFF" : "#7C8BA1" }} />
                  </div>
                  <p className="text-[0.82rem] font-bold dark-heading">{item.label}</p>
                  <p className="mt-0.5 text-[0.74rem] leading-[1.5] dark-muted">{item.desc}</p>
                  {item.active && (
                    <span className="mt-2 inline-flex rounded-full px-2.5 py-0.5 text-[0.6rem] font-bold" style={{ background: "#2D6BFF14", color: "#5B9AFF", border: "1px solid #2D6BFF25" }}>
                      متاح الآن
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-2.5">
              <Link to="/products">
                <Button variant="cta" className="h-10 rounded-lg px-5 text-[0.82rem] font-bold">
                  <ShoppingBag className="ml-1.5 h-3.5 w-3.5" /> تصفّح المنتجات
                </Button>
              </Link>
              <Link to="/join-marketplace">
                <Button className="h-10 rounded-lg border px-5 text-[0.82rem] font-bold" style={{ borderColor: "#ffffff1A", background: "#ffffff0A", color: "#E2E8F0" }}>
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
      <section className="py-8 md:py-10" style={{ background: "#FAFAF8" }}>
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
      <section className="py-8 md:py-10" style={{ background: "#071326" }}>
        <div className="container max-w-[680px] text-center">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="flex items-center justify-center gap-2 mb-2.5">
              <div className="h-[2px] w-5 rounded-full" style={{ background: "#CDBB9A" }} />
              <span className="font-poppins text-[0.56rem] font-bold tracking-[0.22em] uppercase dark-accent">ابدأ من هنا</span>
              <div className="h-[2px] w-5 rounded-full" style={{ background: "#CDBB9A" }} />
            </div>
            <h2 className="mx-auto max-w-[20rem] text-[1.1rem] font-bold leading-[1.15] md:text-[1.3rem] dark-heading">
              المول جاهز — والقرار بيدك.
            </h2>
            <p className="mx-auto mt-2 text-[0.82rem] leading-[1.65] dark-body max-w-[18rem]">
              استكشف، قارن، وقرّر — كل شيء أمامك.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2.5">
              <Link to="/map">
                <Button variant="cta" className="h-10 rounded-lg px-5 text-[0.82rem] font-bold shadow-[var(--shadow-blue)]">
                  <Compass className="ml-1.5 h-3.5 w-3.5" /> استكشف الخريطة
                </Button>
              </Link>
              <Link to="/stores">
                <Button className="h-10 rounded-lg border px-5 text-[0.82rem] font-bold" style={{ borderColor: "#ffffff1A", background: "#ffffff0A", color: "#E2E8F0" }}>
                  تصفّح المتاجر
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
