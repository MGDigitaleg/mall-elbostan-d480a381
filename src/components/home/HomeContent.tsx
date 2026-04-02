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
  Accessories: "أغطية، شواحن، سماعات، وملحقات لكل الأجهزة.",
  Laptops: "أجهزة للعمل والدراسة من علامات رائدة.",
  Components: "قطع غيار ومكوّنات للتجميع والتحديث.",
  Networking: "حلول شبكات للمنازل والشركات.",
  Maintenance: "صيانة متخصصة ودعم فني فوري.",
  "Security Systems": "كاميرات مراقبة وأنظمة حماية متكاملة.",
};

const fallbackFaqs = [
  { id: "faq-1", question_ar: "أين يقع مول البستان؟", answer_ar: "يقع المول في قلب القاهرة الجديدة، ضمن موقع استراتيجي يخدم مدينتي والرحاب والمناطق المحيطة." },
  { id: "faq-2", question_ar: "متى موعد الافتتاح الرسمي؟", answer_ar: "الافتتاح الكبير مقرر في 1 مايو 2026. تابع صفحة الافتتاح لمعرفة البرنامج الكامل." },
  { id: "faq-3", question_ar: "هل تتوفر وحدات تجارية للتأجير؟", answer_ar: "نعم، تتوفر وحدات متعددة المساحات والفئات. يمكنك استعراضها عبر الخريطة التفاعلية وتقديم استفسار مباشر." },
  { id: "faq-4", question_ar: "كيف أجد متجرًا محددًا داخل المول؟", answer_ar: "استخدم الخريطة التفاعلية أو دليل المتاجر مع إمكانية التصفية حسب الفئة والدور والحالة." },
  { id: "faq-5", question_ar: "هل سيتوفر تسوّق إلكتروني؟", answer_ar: "السوق الرقمي مرحلة قادمة — امتداد طبيعي من التجربة الفعلية إلى التسوّق عن بُعد." },
  { id: "faq-6", question_ar: "كيف أتقدم باستفسار تجاري؟", answer_ar: "من خلال صفحة التأجير أو التواصل — يصل طلبك مباشرة للفريق المختص." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
};

const sectionReveal = {
  hidden: { opacity: 0, y: 18 },
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
      {/* ═══════════════════════════════════════════════
          1 · HERO — compact, confident, restrained image
          ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: "#071326" }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 45% at 70% 50%, #2D6BFF06, transparent 70%)" }} />

        <div className="relative mx-auto w-full max-w-[1440px]">
          <div className="grid min-h-[56vh] items-center lg:grid-cols-[1.2fr_0.8fr]">

            {/* ── text column ── */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="order-1 space-y-4 px-6 py-10 md:px-12 lg:py-12 lg:pr-14 xl:pr-16"
            >
              <div className="flex items-center gap-3">
                <div className="h-[2px] w-7 rounded-full" style={{ background: "#64748B" }} />
                <span className="font-poppins text-[0.58rem] font-bold tracking-[0.28em] uppercase" style={{ color: "#64748B" }}>
                  Est. 2010 — New Cairo
                </span>
              </div>

              <h1 className="max-w-[20rem] text-[1.55rem] leading-[1.1] md:text-[1.85rem] lg:text-[2.1rem]" style={{ color: "#F8FAFC" }}>
                المكان الذي بناه
                <br />
                <span style={{ color: "#CDBB9A" }}>تكرار الثقة.</span>
              </h1>

              <p className="max-w-[24rem] text-[0.88rem] leading-[1.85]" style={{ color: "#94A3B8" }}>
                وجهة تقنية راسخة في القاهرة الجديدة — أكثر من عقد من قرارات الشراء الحقيقية.
              </p>

              <div className="flex flex-wrap gap-2.5">
                <Link to="/map">
                  <Button variant="cta" size="lg" className="h-10 min-w-[10rem] rounded-lg px-5 text-[0.82rem] font-bold shadow-[var(--shadow-blue)]">
                    <Compass className="ml-2 h-4 w-4" />
                    استكشف الدليل
                  </Button>
                </Link>
                <Link to="/stores">
                  <Button size="lg" className="h-10 rounded-lg border px-5 text-[0.82rem] font-semibold" style={{ borderColor: "#1E293B", background: "transparent", color: "#CBD5E1" }}>
                    تصفّح المتاجر
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-5 pt-3" style={{ borderTop: "1px solid #1E293B" }}>
                {[
                  { v: `${totalUnits}+`, l: "وحدة تجارية" },
                  { v: `${floorMapData.length}`, l: "أدوار تجارية" },
                  { v: `${categoryStories.length}`, l: "أقسام متخصصة" },
                ].map((s, i) => (
                  <div key={s.l} className="flex items-center gap-4">
                    <div>
                      <p className="font-poppins text-[1.15rem] font-extrabold" style={{ color: "#F8FAFC" }}>{s.v}</p>
                      <p className="text-[0.6rem] font-semibold" style={{ color: "#64748B" }}>{s.l}</p>
                    </div>
                    {i < 2 && <div className="h-6 w-px" style={{ background: "#1E293B" }} />}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ── image column — smaller, tighter diptych ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative order-2 hidden self-center py-10 pe-6 lg:block xl:pe-8"
            >
              <div className="grid grid-cols-[1fr_0.4fr] gap-2">
                <div className="frame-geometric overflow-hidden">
                  <img
                    src={heroImage}
                    alt="الواجهة الرئيسية لمول البستان — القاهرة الجديدة"
                    className="aspect-[3/4] max-h-[340px] w-full object-cover object-[center_30%] img-grade-dark"
                    loading="eager"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="frame-heritage flex-1 overflow-hidden">
                    <img src={interiorImage} alt="التفاصيل الداخلية" className="h-full max-h-[220px] w-full object-cover object-[center_45%] img-grade-dark" loading="lazy" />
                  </div>
                  <div className="rounded-md px-2.5 py-1.5" style={{ background: "#ffffff0D", border: "1px solid #ffffff14" }}>
                    <p className="font-poppins text-[0.56rem] font-bold tracking-[0.18em] uppercase dark-accent">Mall Elbostan</p>
                    <p className="mt-0.5 text-[0.68rem] font-bold dark-subheading">وجهة تقنية منذ 2010+</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── countdown strip ── */}
      <section className="border-b border-border bg-card py-3">
        <div className="container flex flex-col items-center gap-2.5 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <p className="text-[0.84rem] font-bold text-foreground">الافتتاح الكبير — 1 مايو 2026</p>
          </div>
          <CountdownTimer compact />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          2 · HERITAGE — tight, confident
          ═══════════════════════════════════════════════ */}
      <section className="py-7 md:py-9 overflow-hidden" style={{ background: "#FAFAF8" }}>
        <div className="container">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="grid items-center gap-6 lg:grid-cols-[1fr_1fr] lg:gap-10">

              <div className="order-1 space-y-4">
                <div className="chapter-shell pt-4">
                  <p className="section-kicker">مكانة وتاريخ</p>
                  <h2 className="section-title max-w-[18rem]">اسم يسبق التعريف.</h2>
                </div>

                <p className="text-[0.9rem] leading-[1.9] light-body max-w-[28rem]">
                  سمعة بنتها سنوات من التعامل المباشر — الزائر يعرف أنه سيجد ما يبحث عنه.
                </p>

                <div className="grid gap-2 sm:grid-cols-3">
                  {[
                    { icon: Award, title: "إرث سوقي", desc: "أكثر من عقد." },
                    { icon: MapPin, title: "وجهة مقصودة", desc: "القاهرة الجديدة." },
                    { icon: Layers, title: "تصنيف دقيق", desc: "مسار شراء منظّم." },
                  ].map((c) => (
                    <div key={c.title} className="card-architectural rounded-lg p-3.5">
                      <c.icon className="mb-1.5 h-4 w-4 text-primary" />
                      <p className="text-[0.84rem] font-bold light-heading">{c.title}</p>
                      <p className="mt-0.5 text-[0.78rem] leading-5 light-body">{c.desc}</p>
                    </div>
                  ))}
                </div>

                <Link to="/about">
                  <Button variant="ghost" className="mt-1 gap-1.5 px-0 text-[0.88rem] font-bold text-primary hover:text-primary/80">
                    تعرّف على القصة <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div className="order-2">
                <div className="grid grid-cols-[1.2fr_0.8fr] gap-2">
                  <div className="frame-geometric overflow-hidden">
                    <img src={facadeImage} alt="الواجهة المعمارية" className="img-grade-arch aspect-[4/5] max-h-[260px] w-full object-cover object-[center_35%]" loading="lazy" />
                  </div>
                  <div className="frame-diptych overflow-hidden">
                    <img src={entranceImage} alt="مدخل المول" className="img-grade-warm aspect-[4/5] max-h-[260px] w-full object-cover object-[50%_30%]" loading="lazy" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          3 · VALUE PROPOSITION — tighter cards
          ═══════════════════════════════════════════════ */}
      <section className="heritage-deep py-7 md:py-9 relative overflow-hidden">
        <div className="relative container">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="mb-5 max-w-[28rem]">
              <p className="section-kicker dark-kicker">القيمة الحقيقية</p>
              <h2 className="section-title dark-heading">جمهور بنيّة شراء واضحة.</h2>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
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
                  <div className="heritage-surface flex h-full flex-col p-5">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl" style={{ border: "1px solid #2D6BFF30", background: "#2D6BFF14" }}>
                      <card.icon className="h-4.5 w-4.5 dark-kicker" />
                    </div>
                    <h3 className="text-[1rem] font-bold dark-heading">{card.title}</h3>
                    <p className="mt-1.5 text-[0.84rem] font-semibold dark-subheading">{card.lead}</p>
                    <ul className="mt-3 space-y-2 flex-1">
                      {card.points.map((p) => (
                        <li key={p} className="flex items-start gap-2 text-[0.84rem] leading-6 dark-body">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "#5B9AFF60" }} />
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

      {/* ═══════════════════════════════════════════════
          4 · CATEGORIES — what you'll find
          ═══════════════════════════════════════════════ */}
      <section className="py-7 md:py-9" style={{ background: "#F5F2EC" }}>
        <div className="container">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="mb-5 max-w-[28rem]">
              <p className="section-kicker">التصنيف التجاري</p>
              <h2 className="section-title">ستة أسواق متخصصة.</h2>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {categoryStories.map((cat, i) => (
                <motion.div key={cat.key} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <Link to="/stores" className="block">
                    <div className="group flex h-full items-start gap-3 rounded-lg border border-border bg-card p-4 transition-all duration-200 hover:border-primary/20 hover:shadow-[var(--shadow-card)]">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary text-primary transition-colors group-hover:border-primary/20 group-hover:bg-primary/5">
                        <cat.icon className="h-4.5 w-4.5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <h3 className="text-[0.92rem] font-bold light-heading">{cat.name}</h3>
                          <span className="font-poppins text-[0.64rem] font-bold light-meta">0{i + 1}</span>
                        </div>
                        <p className="mt-1 text-[0.82rem] leading-6 light-body">{cat.brief}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {featuredStores.length > 0 && (
              <div className="mt-6 rounded-xl border border-border bg-card p-4 md:p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-[0.98rem] font-bold light-heading">علامات رائدة داخل المول</h3>
                  <Link to="/stores">
                    <Button variant="ghost" size="sm" className="gap-1 text-[0.82rem] font-bold text-primary">
                      عرض الكل <ArrowLeft className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
                <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                  {featuredStores.slice(0, 6).map((store) => (
                    <Link key={store.id} to={`/stores/${store.slug}`} className="flex items-center gap-3 rounded-xl border border-border p-3.5 transition-all hover:border-primary/15 hover:shadow-sm">
                      {store.logo_url ? (
                        <img src={store.logo_url} alt={store.name_ar} className="h-10 w-10 rounded-lg border border-border object-contain" />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary text-primary">
                          <Store className="h-4 w-4" />
                        </div>
                      )}
                      <div>
                        <p className="text-[0.88rem] font-bold light-heading">{store.name_ar}</p>
                        {store.category && <p className="mt-0.5 text-[0.72rem] light-muted">{store.category}</p>}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-7 flex justify-center">
              <Link to="/stores">
                <Button variant="secondary" size="lg" className="h-10 rounded-xl px-7 text-[0.88rem] font-bold">تصفّح جميع المتاجر</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="band-primary" />

      {/* ═══════════════════════════════════════════════
          5 · MAP PREVIEW
          ═══════════════════════════════════════════════ */}
      <section className="py-7 md:py-9" style={{ background: "#FAFAF8" }}>
        <div className="container">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="mb-5 grid items-end gap-3 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="section-kicker">الخريطة التجارية</p>
                <h2 className="section-title max-w-[22rem]">استكشف المول — قبل أن تصل.</h2>
              </div>
              <div className="hidden lg:flex lg:gap-2">
                <Link to="/map"><Button variant="cta" className="h-9 rounded-lg px-5 text-[0.82rem] font-bold">افتح الدليل</Button></Link>
                <Link to="/leasing"><Button variant="outline-blue" className="h-9 rounded-lg px-5 text-[0.82rem]">استفسر عن وحدة</Button></Link>
              </div>
            </div>

            <MapTeaserPreview />

            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:hidden">
              <Link to="/map"><Button variant="cta" className="h-9 w-full rounded-lg text-[0.82rem]">افتح الدليل</Button></Link>
              <Link to="/leasing"><Button variant="outline-blue" className="h-9 w-full rounded-lg text-[0.82rem]">استفسر عن وحدة</Button></Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          6 · LEASING
          ═══════════════════════════════════════════════ */}
      <section className="py-7 md:py-9" style={{ background: "#F5F2EC" }}>
        <div className="container">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="grid items-start gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
              <div className="space-y-4">
                <div className="chapter-shell pt-4">
                  <p className="section-kicker">الفرصة التجارية</p>
                  <h2 className="section-title max-w-[20rem]">وحدتك في موقع مُثبت.</h2>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {availableByFloor.map((f) => (
                    <div key={f.id} className="rounded-lg border border-border bg-card px-3 py-3 text-center">
                      <p className="font-poppins text-[1.3rem] font-extrabold light-heading">{f.count}</p>
                      <p className="mt-0.5 text-[0.68rem] font-semibold light-muted">{f.label}</p>
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
                    <div key={p.label} className="flex items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-2">
                      <p.icon className="h-3.5 w-3.5 text-primary" />
                      <span className="text-[0.78rem] font-bold light-heading">{p.label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <Link to="/leasing"><Button variant="orange" className="h-9 rounded-lg px-5 font-bold text-[0.82rem]">استفسار التأجير</Button></Link>
                  <Link to="/map"><Button variant="outline-blue" className="h-9 rounded-lg px-5 text-[0.82rem]">الوحدات على الخريطة</Button></Link>
                </div>
              </div>

              {/* unit cards */}
              <div className="space-y-3">
                {homepageLeasingUnits.slice(0, 3).map((unit) => (
                  <Link key={unit.unit_id} to="/map" className="group flex flex-col rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:border-orange/25 hover:shadow-[var(--shadow-card)]">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[0.98rem] font-bold light-heading">وحدة {unit.unit_id}</p>
                        <p className="mt-0.5 text-[0.82rem] light-muted">{needCategoryLabels[unit.category]}</p>
                      </div>
                      <span className="rounded-full border border-orange/25 bg-orange/8 px-2.5 py-0.5 text-[0.68rem] font-bold text-orange">متاحة</span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div className="rounded-lg bg-secondary px-3 py-2.5">
                        <p className="text-[0.68rem] light-muted">الدور</p>
                        <p className="mt-0.5 text-[0.88rem] font-bold light-heading">{floorLabels[unit.floor_id]}</p>
                      </div>
                      <div className="rounded-lg bg-secondary px-3 py-2.5">
                        <p className="text-[0.68rem] light-muted">المساحة</p>
                        <p className="mt-0.5 text-[0.88rem] font-bold light-heading">{unit.area_m2} م²</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          7 · SPIN & WIN — compact
          ═══════════════════════════════════════════════ */}
      <section className="py-7 md:py-9" style={{ background: "#FAFAF8" }}>
        <div className="container">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
              <div className="grid lg:grid-cols-[1.4fr_0.6fr]">
                <div className="space-y-4 p-5 md:p-6">
                  <p className="section-kicker">حملة الافتتاح</p>
                  <h2 className="section-title max-w-[20rem]">افتتاح يكافئ من يحضر.</h2>

                  <div className="flex flex-wrap gap-5 border-t border-border pt-4">
                    {[
                      { n: "01", title: "استكشف", desc: "تعرّف على الأقسام." },
                      { n: "02", title: "شارك", desc: "سجّل واحفظ نتيجتك." },
                      { n: "03", title: "احضر واستلم", desc: "إثباتك يوم الافتتاح." },
                    ].map((s) => (
                      <div key={s.n} className="min-w-[6rem]">
                        <span className="font-poppins text-[0.66rem] font-bold text-primary">{s.n}</span>
                        <p className="mt-0.5 text-[0.84rem] font-bold light-heading">{s.title}</p>
                        <p className="mt-0.5 text-[0.76rem] leading-5 light-body">{s.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <Link to="/spin-win"><Button variant="cta" className="h-9 rounded-lg px-5 font-bold text-[0.82rem]"><Gift className="ml-2 h-4 w-4" />أدر واربح</Button></Link>
                    <Link to="/opening-day"><Button variant="outline-blue" className="h-9 rounded-lg px-5 text-[0.82rem]">تفاصيل الافتتاح</Button></Link>
                  </div>
                </div>

                <div className="hidden border-r border-border p-5 lg:flex lg:flex-col lg:items-center lg:justify-center" style={{ background: "#F5F2EC" }}>
                  <div className="rounded-lg border border-border bg-card p-4 text-center shadow-[var(--shadow-soft)]">
                    <p className="text-[0.74rem] font-bold light-muted">الافتتاح الكبير</p>
                    <p className="mt-1 text-[1.25rem] font-extrabold light-heading">1 مايو 2026</p>
                    <div className="mt-3"><CountdownTimer compact /></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="band-primary" />

      {/* ═══════════════════════════════════════════════
          8 · DIGITAL EXTENSION — minimal
          ═══════════════════════════════════════════════ */}
      <section className="heritage-deep relative overflow-hidden py-7 md:py-9">
        <div className="relative container max-w-3xl">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="mx-auto max-w-[26rem] text-center">
              <p className="section-kicker dark-kicker">التطوّر الرقمي</p>
              <h2 className="section-title dark-heading">نفس الوجهة — بأدوات رقمية.</h2>
            </div>

            <div className="mx-auto mt-5 grid max-w-2xl gap-2.5 sm:grid-cols-3">
              {[
                { n: "01", icon: Compass, label: "الدليل التفاعلي", desc: "خريطة لكل دور.", active: true },
                { n: "02", icon: ShoppingBag, label: "دليل المتاجر", desc: "كل علامة تجارية.", active: true },
                { n: "03", icon: Zap, label: "السوق الرقمي", desc: "تسوّق إلكتروني — قريبًا.", active: false },
              ].map((item) => (
                <div key={item.n} className="heritage-surface rounded-lg p-4 text-center">
                  <span className="font-poppins text-[0.62rem] font-bold dark-kicker">{item.n}</span>
                  <div className="mx-auto mt-2 mb-2 flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: item.active ? "#2D6BFF14" : "#ffffff08", border: `1px solid ${item.active ? "#2D6BFF30" : "#ffffff10"}` }}>
                    <item.icon className="h-4 w-4" style={{ color: item.active ? "#5B9AFF" : "#7C8BA1" }} />
                  </div>
                  <p className="text-[0.84rem] font-bold dark-heading">{item.label}</p>
                  <p className="mt-0.5 text-[0.76rem] leading-5 dark-muted">{item.desc}</p>
                  {item.active && (
                    <span className="mt-2 inline-flex rounded-full px-2 py-0.5 text-[0.62rem] font-bold" style={{ background: "#2D6BFF14", color: "#5B9AFF", border: "1px solid #2D6BFF25" }}>
                      متاح الآن
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-5 text-center">
              <Link to="/stores">
                <Button className="h-9 rounded-lg border px-5 text-[0.82rem] font-bold" style={{ borderColor: "#ffffff1A", background: "#ffffff0A", color: "#E2E8F0" }}>
                  استعرض دليل المتاجر
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          9 · FAQ
          ═══════════════════════════════════════════════ */}
      <section className="py-7 md:py-9" style={{ background: "#F5F2EC" }}>
        <div className="container max-w-5xl">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="grid items-start gap-6 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="lg:sticky lg:top-24">
                <div className="chapter-shell pt-4">
                  <p className="section-kicker">أسئلة شائعة</p>
                  <h2 className="text-[1.35rem] font-bold leading-[1.08] light-heading md:text-[1.6rem]">ما يجب معرفته</h2>
                </div>
                <p className="mt-2 text-[0.86rem] leading-7 light-body">أبرز الأسئلة قبل الزيارة.</p>
                <Link to="/faq" className="mt-4 inline-flex">
                  <Button variant="ghost" className="gap-1.5 px-0 font-bold text-primary hover:text-primary/80">جميع الأسئلة <ArrowLeft className="h-4 w-4" /></Button>
                </Link>
              </div>

              <Accordion type="single" collapsible defaultValue={faqItems[0]?.id} className="space-y-2">
                {faqItems.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id} className="overflow-hidden rounded-xl border border-border bg-card px-5">
                    <AccordionTrigger className="min-h-[3rem] py-3 text-right text-[0.9rem] font-bold light-heading hover:text-primary">
                      {faq.question_ar}
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 text-[0.86rem] leading-7 light-body">
                      {faq.answer_ar}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FINAL CTA
          ═══════════════════════════════════════════════ */}
      <section className="py-7 md:py-9" style={{ background: "#071326" }}>
        <div className="container max-w-[720px] text-center">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="h-[2px] w-5 rounded-full" style={{ background: "#CDBB9A" }} />
              <span className="font-poppins text-[0.58rem] font-bold tracking-[0.22em] uppercase dark-accent">ابدأ من هنا</span>
              <div className="h-[2px] w-5 rounded-full" style={{ background: "#CDBB9A" }} />
            </div>
            <h2 className="mx-auto max-w-[22rem] text-[1.2rem] font-bold leading-[1.15] md:text-[1.45rem] dark-heading">
              المول جاهز — والقرار بيدك.
            </h2>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Link to="/map">
                <Button variant="cta" className="h-9 rounded-lg px-5 text-[0.82rem] font-bold shadow-[var(--shadow-blue)]">
                  <Compass className="ml-2 h-4 w-4" /> استكشف الخريطة
                </Button>
              </Link>
              <Link to="/stores">
                <Button className="h-9 rounded-lg border px-5 text-[0.82rem] font-bold" style={{ borderColor: "#ffffff1A", background: "#ffffff0A", color: "#E2E8F0" }}>
                  تصفّح المتاجر
                </Button>
              </Link>
              <Link to="/leasing">
                <Button variant="orange" className="h-9 rounded-lg px-5 text-[0.82rem] font-bold">
                  <Phone className="ml-2 h-4 w-4" /> استفسار التأجير
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
