import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  Building2,
  CircuitBoard,
  Compass,
  Gift,
  Globe,
  Layers,
  MapPin,
  Monitor,
  Phone,
  Shield,
  ShoppingBag,
  Smartphone,
  Store,
  TrendingUp,
  Users,
  Wrench,
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
import {
  allMapUnits,
  availableMapUnits,
  exploreNeeds,
  floorMapData,
  homepageLeasingUnits,
  needCategoryLabels,
  type NeedCategory,
} from "@/lib/floorMapData";
import heroImage from "@/assets/mall-exterior.jpg";
import interiorImage from "@/assets/mall-interior.jpg";
import facadeImage from "@/assets/mall-facade.jpg";
import entranceImage from "@/assets/mall-entrance.jpg";

/* ─── category ─── */
const categoryMeta: Record<NeedCategory, { icon: typeof Smartphone }> = {
  Accessories: { icon: Smartphone },
  Laptops: { icon: Monitor },
  Components: { icon: CircuitBoard },
  Networking: { icon: Globe },
  Maintenance: { icon: Wrench },
  "Security Systems": { icon: Shield },
};

const categoryBriefs: Record<NeedCategory, string> = {
  Accessories: "أغطية، شواحن، سماعات، وملحقات.",
  Laptops: "أجهزة للعمل والدراسة.",
  Components: "قطع غيار ومكوّنات للتجميع.",
  Networking: "حلول شبكات للمنازل والشركات.",
  Maintenance: "صيانة متخصصة ودعم فني.",
  "Security Systems": "كاميرات مراقبة وأنظمة حماية.",
};

const fallbackFaqs = [
  { id: "faq-1", question_ar: "أين يقع مول البستان؟", answer_ar: "في قلب القاهرة الجديدة، ضمن موقع يخدم مدينتي والرحاب والمناطق المحيطة." },
  { id: "faq-2", question_ar: "متى موعد الافتتاح؟", answer_ar: "الافتتاح الكبير مقرر في 1 مايو 2026." },
  { id: "faq-3", question_ar: "هل تتوفر وحدات للتأجير؟", answer_ar: "نعم، وحدات متعددة المساحات. استعرضها عبر الخريطة التفاعلية." },
  { id: "faq-4", question_ar: "كيف أجد متجرًا داخل المول؟", answer_ar: "استخدم الخريطة التفاعلية أو دليل المتاجر." },
  { id: "faq-5", question_ar: "هل سيتوفر تسوّق إلكتروني؟", answer_ar: "السوق الرقمي مرحلة قادمة." },
  { id: "faq-6", question_ar: "كيف أتقدم باستفسار تجاري؟", answer_ar: "من صفحة التأجير أو التواصل." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  }),
};

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

export function HomeContent({ faqs, featuredStores }: HomeContentProps) {
  const totalUnits = allMapUnits.length;
  const floorLabels = Object.fromEntries(floorMapData.map((f) => [f.id, f.label]));
  const categoryStories = exploreNeeds.map((need) => ({
    key: need, name: needCategoryLabels[need],
    icon: categoryMeta[need].icon, brief: categoryBriefs[need],
  }));
  const faqItems = (faqs.length >= 5 ? faqs : fallbackFaqs).slice(0, 6);
  const availableByFloor = floorMapData.map((f) => ({
    id: f.id, label: f.label,
    count: f.units.filter((u) => u.status === "available").length,
  }));

  return (
    <>
      {/* ═══════════ 1 · HERO ═══════════ */}
      <section className="relative overflow-hidden" style={{ background: "#071326" }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 45% at 70% 50%, #2D6BFF06, transparent 70%)" }} />

        <div className="relative mx-auto w-full max-w-[1440px]">
          <div className="grid min-h-[48vh] items-center lg:grid-cols-[1.2fr_0.8fr]">

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="order-1 space-y-3 px-5 py-8 md:px-10 lg:py-10 lg:pr-12 xl:pr-14"
            >
              <div className="flex items-center gap-2.5">
                <div className="h-[2px] w-6 rounded-full" style={{ background: "#64748B" }} />
                <span className="font-poppins text-[0.54rem] font-bold tracking-[0.28em] uppercase" style={{ color: "#64748B" }}>
                  Est. 2010 — New Cairo
                </span>
              </div>

              <h1 className="max-w-[18rem] text-[1.4rem] leading-[1.1] md:text-[1.65rem] lg:text-[1.85rem]" style={{ color: "#F8FAFC" }}>
                المكان الذي بناه
                <br />
                <span style={{ color: "#CDBB9A" }}>تكرار الثقة.</span>
              </h1>

              <p className="max-w-[22rem] text-[0.82rem] leading-[1.8]" style={{ color: "#94A3B8" }}>
                وجهة تقنية راسخة في القاهرة الجديدة — أكثر من عقد من قرارات الشراء.
              </p>

              <div className="flex flex-wrap gap-2">
                <Link to="/map">
                  <Button variant="cta" className="h-9 min-w-[9rem] rounded-lg px-4 text-[0.8rem] font-bold shadow-[var(--shadow-blue)]">
                    <Compass className="ml-1.5 h-3.5 w-3.5" />
                    استكشف الدليل
                  </Button>
                </Link>
                <Link to="/stores">
                  <Button className="h-9 rounded-lg border px-4 text-[0.8rem] font-semibold" style={{ borderColor: "#1E293B", background: "transparent", color: "#CBD5E1" }}>
                    تصفّح المتاجر
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-4 pt-2.5" style={{ borderTop: "1px solid #1E293B" }}>
                {[
                  { v: `${totalUnits}+`, l: "وحدة تجارية" },
                  { v: `${floorMapData.length}`, l: "أدوار تجارية" },
                  { v: `${categoryStories.length}`, l: "أقسام متخصصة" },
                ].map((s, i) => (
                  <div key={s.l} className="flex items-center gap-4">
                    <div>
                      <p className="font-poppins text-[1rem] font-extrabold" style={{ color: "#F8FAFC" }}>{s.v}</p>
                      <p className="text-[0.56rem] font-semibold" style={{ color: "#64748B" }}>{s.l}</p>
                    </div>
                    {i < 2 && <div className="h-5 w-px" style={{ background: "#1E293B" }} />}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* image — smaller diptych */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative order-2 hidden self-center py-8 pe-5 lg:block xl:pe-7"
            >
              <div className="grid grid-cols-[1fr_0.4fr] gap-1.5">
                <div className="frame-geometric overflow-hidden">
                  <img
                    src={heroImage}
                    alt="الواجهة الرئيسية لمول البستان"
                    className="aspect-[3/4] max-h-[280px] w-full object-cover object-[center_30%] img-grade-dark"
                    loading="eager"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="frame-heritage flex-1 overflow-hidden">
                    <img src={interiorImage} alt="التفاصيل الداخلية" className="h-full max-h-[180px] w-full object-cover object-[center_45%] img-grade-dark" loading="lazy" />
                  </div>
                  <div className="rounded-md px-2 py-1.5" style={{ background: "#ffffff0D", border: "1px solid #ffffff14" }}>
                    <p className="font-poppins text-[0.5rem] font-bold tracking-[0.18em] uppercase dark-accent">Mall Elbostan</p>
                    <p className="mt-0.5 text-[0.62rem] font-bold dark-subheading">وجهة تقنية منذ 2010+</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── countdown strip ── */}
      <section className="border-b border-border bg-card py-2">
        <div className="container flex flex-col items-center gap-2 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <p className="text-[0.78rem] font-bold text-foreground">الافتتاح الكبير — 1 مايو 2026</p>
          </div>
          <CountdownTimer compact />
        </div>
      </section>

      {/* ═══════════ 2 · HERITAGE ═══════════ */}
      <section className="py-5 md:py-7 overflow-hidden" style={{ background: "#FAFAF8" }}>
        <div className="container">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="grid items-center gap-5 lg:grid-cols-[1fr_1fr] lg:gap-8">

              <div className="order-1 space-y-3">
                <div className="chapter-shell pt-3">
                  <p className="section-kicker">مكانة وتاريخ</p>
                  <h2 className="section-title max-w-[16rem]">اسم يسبق التعريف.</h2>
                </div>

                <p className="text-[0.84rem] leading-[1.8] light-body max-w-[26rem]">
                  سمعة بنتها سنوات — الزائر يعرف أنه سيجد ما يبحث عنه.
                </p>

                <div className="grid gap-1.5 sm:grid-cols-3">
                  {[
                    { icon: Award, title: "إرث سوقي", desc: "أكثر من عقد." },
                    { icon: MapPin, title: "وجهة مقصودة", desc: "القاهرة الجديدة." },
                    { icon: Layers, title: "تصنيف دقيق", desc: "مسار شراء منظّم." },
                  ].map((c) => (
                    <div key={c.title} className="card-architectural rounded-lg p-3">
                      <c.icon className="mb-1 h-3.5 w-3.5 text-primary" />
                      <p className="text-[0.78rem] font-bold light-heading">{c.title}</p>
                      <p className="mt-0.5 text-[0.72rem] leading-5 light-body">{c.desc}</p>
                    </div>
                  ))}
                </div>

                <Link to="/about">
                  <Button variant="ghost" className="mt-0.5 gap-1.5 px-0 text-[0.82rem] font-bold text-primary hover:text-primary/80">
                    تعرّف على القصة <ArrowLeft className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>

              <div className="order-2">
                <div className="grid grid-cols-[1.2fr_0.8fr] gap-1.5">
                  <div className="frame-geometric overflow-hidden">
                    <img src={facadeImage} alt="الواجهة المعمارية" className="img-grade-arch aspect-[4/5] max-h-[220px] w-full object-cover object-[center_35%]" loading="lazy" />
                  </div>
                  <div className="frame-diptych overflow-hidden">
                    <img src={entranceImage} alt="مدخل المول" className="img-grade-warm aspect-[4/5] max-h-[220px] w-full object-cover object-[50%_30%]" loading="lazy" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ 3 · VALUE PROPOSITION ═══════════ */}
      <section className="heritage-deep py-5 md:py-7 relative overflow-hidden">
        <div className="relative container">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="mb-4 max-w-[24rem]">
              <p className="section-kicker dark-kicker">القيمة الحقيقية</p>
              <h2 className="section-title dark-heading">جمهور بنيّة شراء واضحة.</h2>
            </div>

            <div className="grid gap-2 md:grid-cols-3">
              {[
                {
                  icon: Users, title: "للمشتري",
                  lead: "مسار أقصر للمنتج الصحيح.",
                  points: ["تصنيف دقيق يوصلك مباشرة.", "خريطة تفاعلية بالحالات.", "مكافآت مرتبطة بمتاجر فعلية."],
                },
                {
                  icon: Store, title: "للتاجر",
                  lead: "حضور في موقع يصل إليه جمهورك.",
                  points: ["ظهور في الدليل والخريطة.", "جمهور بقرار شراء.", "بيئة ترفع القيمة."],
                },
                {
                  icon: TrendingUp, title: "للمستثمر",
                  lead: "وحدة في مكان مُثبت تجاريًا.",
                  points: ["مساحات متنوعة.", "منطقة طلب متنامٍ.", "استفسار مباشر للتأجير."],
                },
              ].map((card, i) => (
                <motion.div key={card.title} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <div className="heritage-surface flex h-full flex-col p-4">
                    <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg" style={{ border: "1px solid #2D6BFF30", background: "#2D6BFF14" }}>
                      <card.icon className="h-4 w-4 dark-kicker" />
                    </div>
                    <h3 className="text-[0.92rem] font-bold dark-heading">{card.title}</h3>
                    <p className="mt-1 text-[0.78rem] font-semibold dark-subheading">{card.lead}</p>
                    <ul className="mt-2.5 space-y-1.5 flex-1">
                      {card.points.map((p) => (
                        <li key={p} className="flex items-start gap-1.5 text-[0.78rem] leading-5 dark-body">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "#5B9AFF60" }} />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ 4 · CATEGORIES ═══════════ */}
      <section className="py-5 md:py-7" style={{ background: "#F5F2EC" }}>
        <div className="container">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="mb-4 max-w-[24rem]">
              <p className="section-kicker">التصنيف التجاري</p>
              <h2 className="section-title">ستة أسواق متخصصة.</h2>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {categoryStories.map((cat, i) => (
                <motion.div key={cat.key} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <Link to="/stores" className="block">
                    <div className="group flex h-full items-start gap-2.5 rounded-lg border border-border bg-card p-3.5 transition-all duration-200 hover:border-primary/20 hover:shadow-[var(--shadow-card)]">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary text-primary transition-colors group-hover:border-primary/20 group-hover:bg-primary/5">
                        <cat.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <h3 className="text-[0.84rem] font-bold light-heading">{cat.name}</h3>
                          <span className="font-poppins text-[0.58rem] font-bold light-meta">0{i + 1}</span>
                        </div>
                        <p className="mt-0.5 text-[0.76rem] leading-5 light-body">{cat.brief}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {featuredStores.length > 0 && (
              <div className="mt-4 rounded-xl border border-border bg-card p-3.5 md:p-4">
                <div className="mb-2.5 flex items-center justify-between">
                  <h3 className="text-[0.88rem] font-bold light-heading">علامات رائدة داخل المول</h3>
                  <Link to="/stores">
                    <Button variant="ghost" size="sm" className="gap-1 text-[0.78rem] font-bold text-primary">
                      عرض الكل <ArrowLeft className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {featuredStores.slice(0, 6).map((store) => (
                    <Link key={store.id} to={`/stores/${store.slug}`} className="flex items-center gap-2.5 rounded-lg border border-border p-3 transition-all hover:border-primary/15 hover:shadow-sm">
                      {store.logo_url ? (
                        <img src={store.logo_url} alt={store.name_ar} className="h-9 w-9 rounded-lg border border-border object-contain" />
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary text-primary">
                          <Store className="h-3.5 w-3.5" />
                        </div>
                      )}
                      <div>
                        <p className="text-[0.82rem] font-bold light-heading">{store.name_ar}</p>
                        {store.category && <p className="mt-0.5 text-[0.68rem] light-muted">{store.category}</p>}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5 flex justify-center">
              <Link to="/stores">
                <Button variant="secondary" className="h-9 rounded-lg px-6 text-[0.82rem] font-bold">تصفّح جميع المتاجر</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="band-primary" />

      {/* ═══════════ 5 · MAP PREVIEW ═══════════ */}
      <section className="py-5 md:py-7" style={{ background: "#FAFAF8" }}>
        <div className="container">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="mb-3.5 grid items-end gap-2 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="section-kicker">الخريطة التجارية</p>
                <h2 className="section-title max-w-[20rem]">استكشف المول — قبل أن تصل.</h2>
              </div>
              <div className="hidden lg:flex lg:gap-2">
                <Link to="/map"><Button variant="cta" className="h-8 rounded-lg px-4 text-[0.78rem] font-bold">افتح الدليل</Button></Link>
                <Link to="/leasing"><Button variant="outline-blue" className="h-8 rounded-lg px-4 text-[0.78rem]">استفسر عن وحدة</Button></Link>
              </div>
            </div>

            <MapTeaserPreview />

            <div className="mt-2.5 grid gap-1.5 sm:grid-cols-2 lg:hidden">
              <Link to="/map"><Button variant="cta" className="h-9 w-full rounded-lg text-[0.8rem]">افتح الدليل</Button></Link>
              <Link to="/leasing"><Button variant="outline-blue" className="h-9 w-full rounded-lg text-[0.8rem]">استفسر عن وحدة</Button></Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ 6 · LEASING ═══════════ */}
      <section className="py-5 md:py-7" style={{ background: "#F5F2EC" }}>
        <div className="container">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="grid items-start gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
              <div className="space-y-3">
                <div className="chapter-shell pt-3">
                  <p className="section-kicker">الفرصة التجارية</p>
                  <h2 className="section-title max-w-[18rem]">وحدتك في موقع مُثبت.</h2>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  {availableByFloor.map((f) => (
                    <div key={f.id} className="rounded-lg border border-border bg-card px-2.5 py-2.5 text-center">
                      <p className="font-poppins text-[1.1rem] font-extrabold light-heading">{f.count}</p>
                      <p className="mt-0.5 text-[0.62rem] font-semibold light-muted">{f.label}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { icon: MapPin, label: "موقع مقصود" },
                    { icon: Users, label: "جمهور بنيّة شراء" },
                    { icon: TrendingUp, label: "طلب متنامٍ" },
                    { icon: Layers, label: "تصنيف دقيق" },
                  ].map((p) => (
                    <div key={p.label} className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5">
                      <p.icon className="h-3 w-3 text-primary" />
                      <span className="text-[0.74rem] font-bold light-heading">{p.label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 pt-0.5">
                  <Link to="/leasing"><Button variant="orange" className="h-9 rounded-lg px-5 font-bold text-[0.8rem]">استفسار التأجير</Button></Link>
                  <Link to="/map"><Button variant="outline-blue" className="h-9 rounded-lg px-5 text-[0.8rem]">الوحدات على الخريطة</Button></Link>
                </div>
              </div>

              {/* unit cards */}
              <div className="space-y-2">
                {homepageLeasingUnits.slice(0, 3).map((unit) => (
                  <Link key={unit.unit_id} to="/map" className="group flex flex-col rounded-lg border border-border bg-card p-3.5 transition-all duration-200 hover:border-orange/25 hover:shadow-[var(--shadow-card)]">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[0.88rem] font-bold light-heading">وحدة {unit.unit_id}</p>
                        <p className="mt-0.5 text-[0.76rem] light-muted">{needCategoryLabels[unit.category]}</p>
                      </div>
                      <span className="rounded-md border border-orange/25 bg-orange/8 px-2 py-0.5 text-[0.64rem] font-bold text-orange">متاحة</span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-1.5">
                      <div className="rounded-md bg-secondary px-2.5 py-2">
                        <p className="text-[0.62rem] light-muted">الدور</p>
                        <p className="mt-0.5 text-[0.82rem] font-bold light-heading">{floorLabels[unit.floor_id]}</p>
                      </div>
                      <div className="rounded-md bg-secondary px-2.5 py-2">
                        <p className="text-[0.62rem] light-muted">المساحة</p>
                        <p className="mt-0.5 text-[0.82rem] font-bold light-heading">{unit.area_m2} م²</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ 7 · SPIN & WIN ═══════════ */}
      <section className="py-5 md:py-7" style={{ background: "#FAFAF8" }}>
        <div className="container">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
              <div className="grid lg:grid-cols-[1.4fr_0.6fr]">
                <div className="space-y-3 p-4 md:p-5">
                  <p className="section-kicker">حملة الافتتاح</p>
                  <h2 className="section-title max-w-[18rem]">افتتاح يكافئ من يحضر.</h2>

                  <div className="flex flex-wrap gap-4 border-t border-border pt-3">
                    {[
                      { n: "01", title: "استكشف", desc: "تعرّف على الأقسام." },
                      { n: "02", title: "شارك", desc: "سجّل واحفظ نتيجتك." },
                      { n: "03", title: "احضر واستلم", desc: "إثباتك يوم الافتتاح." },
                    ].map((s) => (
                      <div key={s.n} className="min-w-[5.5rem]">
                        <span className="font-poppins text-[0.6rem] font-bold text-primary">{s.n}</span>
                        <p className="mt-0.5 text-[0.78rem] font-bold light-heading">{s.title}</p>
                        <p className="mt-0.5 text-[0.7rem] leading-5 light-body">{s.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 pt-0.5">
                    <Link to="/spin-win"><Button variant="cta" className="h-9 rounded-lg px-5 font-bold text-[0.8rem]"><Gift className="ml-1.5 h-3.5 w-3.5" />أدر واربح</Button></Link>
                    <Link to="/opening-day"><Button variant="outline-blue" className="h-9 rounded-lg px-5 text-[0.8rem]">تفاصيل الافتتاح</Button></Link>
                  </div>
                </div>

                <div className="hidden border-r border-border p-4 lg:flex lg:flex-col lg:items-center lg:justify-center" style={{ background: "#F5F2EC" }}>
                  <div className="rounded-lg border border-border bg-card p-3.5 text-center shadow-[var(--shadow-soft)]">
                    <p className="text-[0.68rem] font-bold light-muted">الافتتاح الكبير</p>
                    <p className="mt-1 text-[1.1rem] font-extrabold light-heading">1 مايو 2026</p>
                    <div className="mt-2"><CountdownTimer compact /></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="band-primary" />

      {/* ═══════════ 8 · DIGITAL EXTENSION ═══════════ */}
      <section className="heritage-deep relative overflow-hidden py-5 md:py-7">
        <div className="relative container max-w-3xl">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="mx-auto max-w-[22rem] text-center">
              <p className="section-kicker dark-kicker">التطوّر الرقمي</p>
              <h2 className="section-title dark-heading">نفس الوجهة — بأدوات رقمية.</h2>
            </div>

            <div className="mx-auto mt-4 grid max-w-2xl gap-2 sm:grid-cols-3">
              {[
                { n: "01", icon: Compass, label: "الدليل التفاعلي", desc: "خريطة لكل دور.", active: true },
                { n: "02", icon: ShoppingBag, label: "دليل المتاجر", desc: "كل علامة تجارية.", active: true },
                { n: "03", icon: Zap, label: "السوق الرقمي", desc: "تسوّق إلكتروني — قريبًا.", active: false },
              ].map((item) => (
                <div key={item.n} className="heritage-surface rounded-lg p-3.5 text-center">
                  <span className="font-poppins text-[0.56rem] font-bold dark-kicker">{item.n}</span>
                  <div className="mx-auto mt-1.5 mb-1.5 flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: item.active ? "#2D6BFF14" : "#ffffff08", border: `1px solid ${item.active ? "#2D6BFF30" : "#ffffff10"}` }}>
                    <item.icon className="h-3.5 w-3.5" style={{ color: item.active ? "#5B9AFF" : "#7C8BA1" }} />
                  </div>
                  <p className="text-[0.78rem] font-bold dark-heading">{item.label}</p>
                  <p className="mt-0.5 text-[0.7rem] leading-5 dark-muted">{item.desc}</p>
                  {item.active && (
                    <span className="mt-1.5 inline-flex rounded-full px-2 py-0.5 text-[0.58rem] font-bold" style={{ background: "#2D6BFF14", color: "#5B9AFF", border: "1px solid #2D6BFF25" }}>
                      متاح الآن
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 text-center">
              <Link to="/stores">
                <Button className="h-9 rounded-lg border px-5 text-[0.8rem] font-bold" style={{ borderColor: "#ffffff1A", background: "#ffffff0A", color: "#E2E8F0" }}>
                  استعرض دليل المتاجر
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ 9 · FAQ ═══════════ */}
      <section className="py-5 md:py-7" style={{ background: "#F5F2EC" }}>
        <div className="container max-w-5xl">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="grid items-start gap-5 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="lg:sticky lg:top-24">
                <div className="chapter-shell pt-3">
                  <p className="section-kicker">أسئلة شائعة</p>
                  <h2 className="section-title">ما يجب معرفته</h2>
                </div>
                <p className="mt-1.5 text-[0.8rem] leading-6 light-body">أبرز الأسئلة قبل الزيارة.</p>
                <Link to="/faq" className="mt-3 inline-flex">
                  <Button variant="ghost" className="gap-1 px-0 text-[0.8rem] font-bold text-primary hover:text-primary/80">جميع الأسئلة <ArrowLeft className="h-3.5 w-3.5" /></Button>
                </Link>
              </div>

              <Accordion type="single" collapsible defaultValue={faqItems[0]?.id} className="space-y-1.5">
                {faqItems.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id} className="overflow-hidden rounded-lg border border-border bg-card px-4">
                    <AccordionTrigger className="min-h-[2.5rem] py-2.5 text-right text-[0.84rem] font-bold light-heading hover:text-primary">
                      {faq.question_ar}
                    </AccordionTrigger>
                    <AccordionContent className="pb-3 text-[0.8rem] leading-6 light-body">
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
      <section className="py-5 md:py-7" style={{ background: "#071326" }}>
        <div className="container max-w-[680px] text-center">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="h-[2px] w-5 rounded-full" style={{ background: "#CDBB9A" }} />
              <span className="font-poppins text-[0.54rem] font-bold tracking-[0.22em] uppercase dark-accent">ابدأ من هنا</span>
              <div className="h-[2px] w-5 rounded-full" style={{ background: "#CDBB9A" }} />
            </div>
            <h2 className="mx-auto max-w-[20rem] text-[1.05rem] font-bold leading-[1.15] md:text-[1.25rem] dark-heading">
              المول جاهز — والقرار بيدك.
            </h2>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Link to="/map">
                <Button variant="cta" className="h-9 rounded-lg px-5 text-[0.8rem] font-bold shadow-[var(--shadow-blue)]">
                  <Compass className="ml-1.5 h-3.5 w-3.5" /> استكشف الخريطة
                </Button>
              </Link>
              <Link to="/stores">
                <Button className="h-9 rounded-lg border px-5 text-[0.8rem] font-bold" style={{ borderColor: "#ffffff1A", background: "#ffffff0A", color: "#E2E8F0" }}>
                  تصفّح المتاجر
                </Button>
              </Link>
              <Link to="/leasing">
                <Button variant="orange" className="h-9 rounded-lg px-5 text-[0.8rem] font-bold">
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
