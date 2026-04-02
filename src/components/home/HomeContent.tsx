import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  CircuitBoard,
  Compass,
  Gift,
  Globe,
  HelpCircle,
  Layers,
  MapPin,
  Monitor,
  Shield,
  Smartphone,
  Store,
  TrendingUp,
  Users,
  Wrench,
  ShoppingBag,
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

/* ─── category icon map ─── */
const categoryMeta: Record<NeedCategory, { icon: typeof Smartphone }> = {
  Accessories: { icon: Smartphone },
  Laptops: { icon: Monitor },
  Components: { icon: CircuitBoard },
  Networking: { icon: Globe },
  Maintenance: { icon: Wrench },
  "Security Systems": { icon: Shield },
};

const categoryBriefs: Record<NeedCategory, string> = {
  Accessories: "ملحقات وإكسسوارات لجميع الأجهزة.",
  Laptops: "أجهزة من العلامات الرائدة عالميًا.",
  Components: "قطع غيار ومكوّنات احترافية.",
  Networking: "بنية تحتية رقمية وحلول شبكات.",
  Maintenance: "صيانة معتمدة ودعم فني فوري.",
  "Security Systems": "أنظمة مراقبة وحلول أمنية.",
};

/* ─── FAQ fallback ─── */
const fallbackFaqs = [
  { id: "faq-1", question_ar: "أين يقع مول البستان؟", answer_ar: "يقع المول في قلب القاهرة الجديدة، ضمن موقع استراتيجي يخدم مدينتي والرحاب والمناطق المحيطة. تفاصيل الوصول ستتوفر عبر صفحة التواصل." },
  { id: "faq-2", question_ar: "متى موعد الافتتاح الرسمي؟", answer_ar: "الافتتاح الكبير مقرر في 1 مايو 2026. تابع صفحة الافتتاح لمعرفة البرنامج الكامل والفعاليات المصاحبة." },
  { id: "faq-3", question_ar: "هل تتوفر وحدات تجارية للتأجير؟", answer_ar: "نعم، تتوفر وحدات متعددة المساحات والفئات. يمكنك استعراضها عبر الخريطة التفاعلية وتقديم استفسار مباشر من صفحة التأجير." },
  { id: "faq-4", question_ar: "كيف أجد متجرًا محددًا داخل المول؟", answer_ar: "استخدم الخريطة التفاعلية أو دليل المتاجر مع إمكانية التصفية حسب الفئة والدور والحالة." },
  { id: "faq-5", question_ar: "هل سيتوفر تسوّق إلكتروني من متاجر المول؟", answer_ar: "السوق الرقمي مرحلة قادمة ضمن رؤية المول الشاملة — امتداد طبيعي من التجربة الفعلية إلى التسوّق عن بُعد." },
  { id: "faq-6", question_ar: "كيف أتقدم باستفسار تجاري أو شراكة؟", answer_ar: "من خلال صفحة التأجير أو صفحة التواصل — يصل طلبك مباشرة للفريق المختص ويتم الرد خلال أيام العمل." },
];

/* ─── animation helpers ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

const sectionReveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

/* ─── types ─── */
type HomeContentProps = {
  faqs: Array<{ id: string; question_ar: string; answer_ar: string }>;
  featuredStores: Array<{
    id: string;
    name_ar: string;
    category: string | null;
    slug: string;
    logo_url: string | null;
    short_description_ar: string | null;
  }>;
  upcomingEvents: Array<{
    id: string;
    title_ar: string;
    description_ar: string | null;
    image_url: string | null;
    event_date: string | null;
  }>;
};

/* ═══════════════════════════════════════════════════════════════
   HOME CONTENT
   ═══════════════════════════════════════════════════════════════ */
export function HomeContent({ faqs, featuredStores }: HomeContentProps) {
  const totalUnits = allMapUnits.length;
  const availableUnits = availableMapUnits;
  const floorLabels = Object.fromEntries(floorMapData.map((f) => [f.id, f.label]));
  const categoryStories = exploreNeeds.map((need) => ({
    key: need,
    name: needCategoryLabels[need],
    icon: categoryMeta[need].icon,
    brief: categoryBriefs[need],
  }));
  const faqItems = (faqs.length >= 5 ? faqs : fallbackFaqs).slice(0, 6);
  const availableByFloor = floorMapData.map((f) => ({
    id: f.id,
    label: f.label,
    count: f.units.filter((u) => u.status === "available").length,
  }));

  return (
    <>
      {/* ════════════════ 1 · HERO ════════════════ */}
      <section className="relative overflow-hidden" style={{ background: "hsl(222 36% 7%)" }}>
        {/* ambient glow — very restrained */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 55% 50% at 75% 45%, hsl(222 58% 42% / 0.06), transparent 65%)" }} />
        <div className="absolute inset-x-0 bottom-0 h-32" style={{ background: "linear-gradient(to top, hsl(222 36% 7%), transparent)" }} />

        <div className="relative mx-auto w-full max-w-[1400px] px-5 md:px-8 lg:px-14">
          <div className="grid min-h-[94vh] items-center gap-10 py-20 lg:grid-cols-2 lg:gap-14 lg:py-0">
            {/* ── text column ── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
              className="order-1 space-y-6"
            >
              {/* kicker */}
              <div className="flex items-center gap-3">
                <div className="h-[2px] w-8" style={{ background: "hsl(222 58% 55% / 0.45)" }} />
                <span className="font-poppins text-[0.7rem] font-semibold tracking-[0.22em] uppercase" style={{ color: "hsl(220 45% 65%)" }}>
                  القاهرة الجديدة — منذ سنوات في خدمة السوق
                </span>
              </div>

              {/* headline */}
              <h1 className="max-w-[30rem] text-[2.5rem] font-extrabold leading-[1.06] text-white md:text-[3.6rem] lg:text-[4.2rem]">
                المكان الذي يعرفه
                <br />
                <span className="text-gradient-blue">كل من دخل السوق</span>
              </h1>

              {/* lead */}
              <p className="max-w-[28rem] text-[0.98rem] leading-[2] md:text-[1.06rem]" style={{ color: "hsl(220 14% 70%)" }}>
                مول البستان وجهة تجارية راسخة في القاهرة الجديدة — أكثر من {totalUnits} وحدة
                متخصصة ومكانة بناها التجار والزوّار بالتكرار والثقة عبر السنوات.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                <Link to="/map">
                  <Button
                    variant="cta"
                    size="lg"
                    className="h-[3.1rem] min-w-[11.5rem] rounded-xl px-7 text-[0.92rem] font-bold shadow-[0_4px_20px_hsl(222_58%_42%/0.2)]"
                  >
                    <Compass className="ml-2 h-[1.05rem] w-[1.05rem]" />
                    استكشف الخريطة
                  </Button>
                </Link>
                <Link to="/stores">
                  <Button
                    size="lg"
                    className="h-[3.1rem] min-w-[9.5rem] rounded-xl border border-white/10 bg-white/5 px-7 text-[0.92rem] font-semibold text-white backdrop-blur-sm hover:bg-white/10"
                  >
                    تصفّح المتاجر
                  </Button>
                </Link>
              </div>

              {/* stats — clean inline */}
              <div className="flex items-center gap-5 border-t pt-5" style={{ borderColor: "hsl(0 0% 100% / 0.07)" }}>
                {[
                  { v: `${floorMapData.length}`, l: "أدوار تجارية" },
                  { v: `${totalUnits}+`, l: "وحدة تجارية" },
                  { v: `${categoryStories.length}`, l: "فئات متخصصة" },
                ].map((s, i) => (
                  <div key={s.l} className="flex items-center gap-4">
                    <div>
                      <p className="font-poppins text-[1.5rem] font-bold text-white">{s.v}</p>
                      <p className="text-[0.7rem] font-medium" style={{ color: "hsl(220 14% 55%)" }}>{s.l}</p>
                    </div>
                    {i < 2 && <div className="h-7 w-px" style={{ background: "hsl(0 0% 100% / 0.07)" }} />}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ── image column — editorial composition ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.75, delay: 0.12 }}
              className="order-2 hidden lg:block"
            >
              <div className="relative mx-auto max-w-[480px]">
                {/* primary — tall architectural frame */}
                <div className="overflow-hidden rounded-2xl" style={{ border: "1px solid hsl(0 0% 100% / 0.06)" }}>
                  <div className="aspect-[3/4]">
                    <img
                      src={heroImage}
                      alt="الواجهة الرئيسية لمول البستان"
                      className="h-full w-full object-cover"
                      loading="eager"
                      style={{ filter: "brightness(0.88) contrast(1.06)" }}
                    />
                  </div>
                </div>

                {/* detail crop — anchored bottom-right */}
                <div className="absolute -bottom-5 -right-5 w-[34%]">
                  <div className="overflow-hidden rounded-xl shadow-[0_8px_24px_hsl(222_36%_6%/0.4)]" style={{ border: "1px solid hsl(0 0% 100% / 0.08)" }}>
                    <div className="aspect-square">
                      <img
                        src={interiorImage}
                        alt="المشهد الداخلي"
                        className="h-full w-full object-cover"
                        loading="lazy"
                        style={{ filter: "brightness(0.85) contrast(1.05)" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── countdown strip ── */}
      <section className="border-b border-border/60 bg-card py-4 md:py-5">
        <div className="container flex flex-col items-center gap-3 md:flex-row md:justify-between">
          <p className="text-[0.8rem] font-semibold text-muted-foreground">
            الافتتاح الكبير — العد التنازلي
          </p>
          <CountdownTimer compact />
        </div>
      </section>

      {/* ════════════════ 2 · HERITAGE & LEGACY ════════════════ */}
      <section className="page-section overflow-hidden" style={{ background: "var(--gradient-ivory)" }}>
        <div className="container">
          <motion.div
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
              {/* text — right side in RTL */}
              <div className="order-1 space-y-5">
                <div className="chapter-shell pt-6">
                  <p className="section-kicker">الهوية والمكانة</p>
                  <h2 className="section-title max-w-[26rem]">
                    اسم لم يحتج حملات ليُعرف.
                  </h2>
                </div>
                <p className="max-w-[34rem] text-[1rem] leading-[2] text-muted-foreground md:text-[1.06rem]">
                  مول البستان ليس مشروعًا يبحث عن جمهور — إنه وجهة بناها الجمهور بالثقة
                  والتكرار. سنوات من الحضور المتواصل في سوق الإلكترونيات جعلت منه مرجعًا
                  حقيقيًا في القاهرة الجديدة.
                </p>

                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { icon: Building2, title: "مكانة تراكمية", desc: "ثقة بُنيت بالتعامل لا بالإعلان." },
                    { icon: MapPin, title: "موقع استراتيجي", desc: "يخدم القاهرة الجديدة ومدينتي والرحاب." },
                    { icon: Layers, title: "تصنيف دقيق", desc: "كل فئة تختصر المسار للقرار." },
                  ].map((c) => (
                    <div key={c.title} className="card-architectural rounded-xl p-4">
                      <c.icon className="mb-2.5 h-4.5 w-4.5 text-primary" />
                      <p className="text-[0.88rem] font-bold text-foreground">{c.title}</p>
                      <p className="mt-1 text-[0.8rem] leading-6 text-muted-foreground">{c.desc}</p>
                    </div>
                  ))}
                </div>

                <Link to="/about">
                  <Button variant="ghost" className="mt-1 px-0 text-primary hover:text-primary/80">
                    تعرّف على قصة المول
                    <ArrowLeft className="mr-1.5 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {/* imagery — editorial asymmetric pair */}
              <div className="order-2">
                <div className="grid gap-3 md:grid-cols-[1.2fr_0.6fr]">
                  <div className="overflow-hidden rounded-2xl" style={{ border: "1px solid hsl(var(--border))" }}>
                    <img
                      src={entranceImage}
                      alt="مدخل مول البستان"
                      className="aspect-[4/3] h-full w-full object-cover object-[center_35%]"
                      loading="lazy"
                      style={{ filter: "brightness(0.92) contrast(1.04)" }}
                    />
                  </div>
                  <div className="hidden overflow-hidden rounded-2xl md:block" style={{ border: "1px solid hsl(var(--border))" }}>
                    <img
                      src={facadeImage}
                      alt="تفاصيل الواجهة المعمارية"
                      className="aspect-[2/3] h-full w-full object-cover object-[center_40%]"
                      loading="lazy"
                      style={{ filter: "brightness(0.9) contrast(1.04)" }}
                    />
                  </div>
                </div>
                {/* subtle bronze bar */}
                <div className="mt-3 h-[2px] w-16 rounded-full" style={{ background: "linear-gradient(90deg, hsl(30 20% 52% / 0.3), transparent)" }} />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── thin architectural divider ── */}
      <div className="band-primary" />

      {/* ════════════════ 3 · VALUE PROPOSITION ════════════════ */}
      <section className="heritage-deep page-section relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.012]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, hsl(0 0% 100%) 0.5px, transparent 0)", backgroundSize: "28px 28px" }} />
        <div className="relative container">
          <motion.div
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {/* header — left-aligned, tighter */}
            <div className="mb-10 max-w-[34rem]">
              <p className="section-kicker" style={{ color: "hsl(220 55% 62%)" }}>القيمة الحقيقية</p>
              <h2 className="section-title text-white">
                مول مصمّم ليخدم — لا ليُبهر فقط.
              </h2>
              <p className="mt-3 max-w-[30rem] text-[0.95rem] leading-8" style={{ color: "hsl(220 12% 65%)" }}>
                سواء كنت مشتريًا أو تاجرًا أو مستثمرًا — كل تفصيلة مصمّمة
                لتقصير المسافة بين الدخول والقرار.
              </p>
            </div>

            {/* 3 audience columns — tighter copy */}
            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  icon: Users,
                  title: "للمشترين",
                  points: [
                    "تصنيف دقيق يوصّلك للمنتج بأقل وقت.",
                    "خريطة تكشف حالة كل وحدة قبل الوصول.",
                    "مكافآت مرتبطة بتجربة الزيارة.",
                  ],
                },
                {
                  icon: Store,
                  title: "للتجار",
                  points: [
                    "حضور رقمي واضح في الدليل والخريطة.",
                    "جمهور يأتي بنية الشراء لا التجوّل.",
                    "بيئة تجارية منظّمة ترفع قيمة الموقع.",
                  ],
                },
                {
                  icon: TrendingUp,
                  title: "للمستثمرين",
                  points: [
                    "وحدات متنوعة بحالة وتسعير شفّاف.",
                    "موقع في منطقة طلب حقيقي ومتنامٍ.",
                    "استفسار مباشر من الخريطة لفريق التأجير.",
                  ],
                },
              ].map((card, i) => (
                <motion.div
                  key={card.title}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <div className="heritage-surface flex h-full flex-col p-6">
                    <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg" style={{ border: "1px solid hsl(220 60% 48% / 0.18)", background: "hsl(220 60% 48% / 0.07)" }}>
                      <card.icon className="h-4 w-4" style={{ color: "hsl(220 60% 62%)" }} />
                    </div>
                    <h3 className="text-[1.02rem] font-bold text-white">{card.title}</h3>
                    <ul className="mt-3 space-y-2.5">
                      {card.points.map((p) => (
                        <li key={p} className="flex items-start gap-2.5 text-[0.84rem] leading-7" style={{ color: "hsl(220 12% 66%)" }}>
                          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "hsl(220 60% 55% / 0.4)" }} />
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

      {/* ════════════════ 4 · CATEGORIES — light, scannable ════════════════ */}
      <section className="section-ivory page-section">
        <div className="container">
          <motion.div
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <div className="mb-10 max-w-[34rem]">
              <p className="section-kicker">دليل الفئات</p>
              <h2 className="section-title">ست فئات تقنية تغطي كل احتياج.</h2>
              <p className="mt-3 text-[0.95rem] leading-8 text-muted-foreground md:text-[1.02rem]">
                كل فئة تمثل نمط شراء فعلي ومسار وصول مباشر.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categoryStories.map((cat, i) => (
                <motion.div
                  key={cat.key}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <Link to="/stores" className="block">
                    <div className="group flex h-full items-start gap-4 rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/15 hover:shadow-[var(--shadow-card)]">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary text-primary transition-colors group-hover:border-primary/20 group-hover:bg-primary/5">
                        <cat.icon className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <div className="flex items-baseline justify-between gap-2">
                          <h3 className="text-[0.95rem] font-bold text-foreground">{cat.name}</h3>
                          <span className="font-poppins text-[0.72rem] font-medium text-muted-foreground/35">0{i + 1}</span>
                        </div>
                        <p className="mt-1 text-[0.82rem] leading-6 text-muted-foreground">{cat.brief}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* featured stores — inline list, not separate block */}
            {featuredStores.length > 0 && (
              <div className="mt-8 rounded-xl border border-border bg-card p-5 md:p-7">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-[0.95rem] font-bold text-foreground">متاجر مميزة</h3>
                  <Link to="/stores">
                    <Button variant="ghost" size="sm" className="text-primary text-[0.82rem]">
                      عرض الكل <ArrowLeft className="mr-1 h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
                <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                  {featuredStores.slice(0, 6).map((store) => (
                    <Link
                      key={store.id}
                      to={`/stores/${store.slug}`}
                      className="flex items-center gap-3.5 rounded-lg border border-border/60 p-3.5 transition-all hover:border-primary/15 hover:shadow-sm"
                    >
                      {store.logo_url ? (
                        <img src={store.logo_url} alt={store.name_ar} className="h-9 w-9 rounded-lg border border-border object-contain" />
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary text-primary">
                          <Store className="h-3.5 w-3.5" />
                        </div>
                      )}
                      <div>
                        <p className="text-[0.85rem] font-bold text-foreground">{store.name_ar}</p>
                        {store.category && (
                          <p className="mt-0.5 text-[0.72rem] text-muted-foreground">{store.category}</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-center">
              <Link to="/stores">
                <Button variant="secondary" size="lg" className="h-11 rounded-xl px-8 font-semibold">
                  تصفّح جميع المتاجر
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── thin divider ── */}
      <div className="band-primary" />

      {/* ════════════════ 5 · INTERACTIVE MAP — the operational core ════════════════ */}
      <section className="section-sand page-section">
        <div className="container">
          <motion.div
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {/* section header — full width, establishing */}
            <div className="mb-8 max-w-[36rem]">
              <p className="section-kicker">الدليل التفاعلي</p>
              <h2 className="section-title">
                كل وحدة ظاهرة — كل دور واضح — قبل أن تصل.
              </h2>
              <p className="mt-3 text-[0.95rem] leading-8 text-muted-foreground md:text-[1.02rem]">
                ليست خريطة عرض — بل أداة تخطيط حقيقية للزائر والتاجر.
                اكتشف المتاجر بالفئة، تحقق من الوحدات المتاحة، وقدّم استفسارك مباشرة.
              </p>
            </div>

            <div className="grid items-start gap-8 lg:grid-cols-[2fr_3fr] lg:gap-12">
              {/* sidebar — stats + CTAs */}
              <div className="space-y-5 lg:sticky lg:top-28">
                {/* quick stats */}
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { v: `${floorMapData.length}`, l: "أدوار" },
                    { v: `${availableUnits.length}`, l: "متاحة" },
                    { v: `${totalUnits}`, l: "إجمالي" },
                  ].map((s) => (
                    <div key={s.l} className="rounded-xl border border-border bg-card px-3 py-3.5 text-center">
                      <p className="font-poppins text-lg font-bold text-foreground">{s.v}</p>
                      <p className="mt-0.5 text-[0.7rem] text-muted-foreground">{s.l}</p>
                    </div>
                  ))}
                </div>

                {/* how it works — minimal */}
                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="mb-3 text-[0.78rem] font-semibold text-muted-foreground">كيف يعمل الدليل</p>
                  <div className="space-y-2">
                    {[
                      "اختر الدور لعرض وحداته",
                      "اضغط على وحدة لمعرفة تفاصيلها",
                      "الوحدات المتاحة باللون البرتقالي",
                    ].map((step, idx) => (
                      <div key={step} className="flex items-center gap-2.5 text-[0.82rem] text-muted-foreground">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md font-poppins text-[0.65rem] font-bold text-primary" style={{ background: "hsl(222 58% 42% / 0.07)", border: "1px solid hsl(222 58% 42% / 0.12)" }}>
                          {idx + 1}
                        </span>
                        {step}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-2.5 sm:grid-cols-2">
                  <Link to="/map">
                    <Button variant="cta" size="lg" className="h-11 w-full rounded-xl text-[0.88rem]">
                      افتح الدليل الكامل
                    </Button>
                  </Link>
                  <Link to="/leasing">
                    <Button variant="outline-blue" size="lg" className="h-11 w-full rounded-xl text-[0.88rem]">
                      استفسر عن وحدة
                    </Button>
                  </Link>
                </div>
              </div>

              {/* map preview */}
              <div>
                <MapTeaserPreview />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════ 6 · LEASING — business-grade ════════════════ */}
      <section className="section-stone page-section">
        <div className="container">
          <motion.div
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
              {/* text */}
              <div className="space-y-5">
                <div className="chapter-shell border-primary/40 pt-6">
                  <p className="section-kicker">الفرصة التجارية</p>
                  <h2 className="section-title max-w-[24rem]">
                    موقعك في وجهة يقصدها الجمهور المناسب.
                  </h2>
                </div>
                <p className="max-w-[32rem] text-[0.95rem] leading-8 text-muted-foreground md:text-[1.02rem]">
                  ما يميز مول البستان ليس الموقع فقط — بل الجمهور الذي يقصده تحديدًا
                  بحثًا عن التقنية. وحدات بمساحات متعددة واستفسار يصل للفريق مباشرة.
                </p>

                {/* floor availability — compact */}
                <div className="grid grid-cols-3 gap-2.5">
                  {availableByFloor.map((f) => (
                    <div key={f.id} className="rounded-xl border border-border bg-card px-3 py-3.5 text-center">
                      <p className="font-poppins text-lg font-bold text-foreground">{f.count}</p>
                      <p className="mt-0.5 text-[0.7rem] text-muted-foreground">{f.label}</p>
                    </div>
                  ))}
                </div>

                {/* key selling points */}
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { icon: MapPin, label: "موقع استراتيجي" },
                    { icon: Users, label: "جمهور متخصص" },
                    { icon: TrendingUp, label: "طلب متنامٍ" },
                    { icon: Layers, label: "فئات منظّمة" },
                  ].map((point) => (
                    <div key={point.label} className="flex items-center gap-2.5 rounded-lg border border-border/60 bg-card px-3.5 py-2.5">
                      <point.icon className="h-3.5 w-3.5 text-primary" />
                      <span className="text-[0.82rem] font-semibold text-foreground">{point.label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 pt-1">
                  <Link to="/leasing">
                    <Button variant="orange" size="lg" className="h-11 rounded-xl px-7 font-bold">
                      ابدأ استفسار التأجير
                    </Button>
                  </Link>
                  <Link to="/map">
                    <Button variant="outline-blue" size="lg" className="h-11 rounded-xl px-7">
                      شاهد الوحدات
                    </Button>
                  </Link>
                </div>
              </div>

              {/* unit cards — cleaner */}
              <div className="space-y-2.5">
                {homepageLeasingUnits.slice(0, 3).map((unit) => (
                  <Link
                    key={unit.unit_id}
                    to="/map"
                    className="group flex flex-col rounded-xl border border-border bg-card p-4.5 transition-all duration-200 hover:border-orange/25 hover:shadow-[var(--shadow-card)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[1rem] font-bold text-foreground">وحدة {unit.unit_id}</p>
                        <p className="mt-0.5 text-[0.82rem] text-muted-foreground">{needCategoryLabels[unit.category]}</p>
                      </div>
                      <span className="rounded-full border border-orange/20 bg-orange/10 px-2.5 py-0.5 text-[0.72rem] font-semibold text-orange">
                        متاحة
                      </span>
                    </div>
                    <div className="mt-2.5 grid grid-cols-2 gap-2">
                      <div className="rounded-lg bg-secondary px-3 py-2">
                        <p className="text-[0.68rem] text-muted-foreground">الدور</p>
                        <p className="mt-0.5 text-[0.85rem] font-semibold text-foreground">{floorLabels[unit.floor_id]}</p>
                      </div>
                      <div className="rounded-lg bg-secondary px-3 py-2">
                        <p className="text-[0.68rem] text-muted-foreground">المساحة</p>
                        <p className="mt-0.5 text-[0.85rem] font-semibold text-foreground">{unit.area_m2} م²</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════ 7 · ENGAGEMENT / SPIN & WIN ════════════════ */}
      <section className="page-section" style={{ background: "var(--gradient-ivory)" }}>
        <div className="container">
          <motion.div
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="grid lg:grid-cols-[1.4fr_0.6fr]">
                {/* text content */}
                <div className="space-y-5 p-6 md:p-8">
                  <p className="section-kicker">حملة الافتتاح</p>
                  <h2 className="section-title max-w-[24rem]">
                    افتتاح يُكافئ الحضور.
                  </h2>
                  <p className="max-w-[30rem] text-[0.95rem] leading-8 text-muted-foreground md:text-[1.02rem]">
                    مكافآت حقيقية من متاجر المول — مرتبطة بموقعها على الخريطة وقابلة
                    للاستلام يوم الافتتاح.
                  </p>

                  {/* steps — horizontal, not cards */}
                  <div className="flex flex-wrap gap-5 border-t border-border/60 pt-5">
                    {[
                      { n: "01", title: "استكشف", desc: "ابدأ من الدليل التفاعلي." },
                      { n: "02", title: "شارك", desc: "أدر العجلة واحفظ نتيجتك." },
                      { n: "03", title: "احضر", desc: "استلم مكافأتك يوم الافتتاح." },
                    ].map((s) => (
                      <div key={s.n} className="min-w-[8rem]">
                        <span className="font-poppins text-[0.7rem] font-bold text-primary">{s.n}</span>
                        <p className="mt-1 text-[0.88rem] font-bold text-foreground">{s.title}</p>
                        <p className="mt-0.5 text-[0.78rem] text-muted-foreground">{s.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3 pt-1">
                    <Link to="/spin-win">
                      <Button variant="cta" size="lg" className="h-11 rounded-xl px-7">
                        <Gift className="ml-2 h-4 w-4" />
                        جرّب أدر واربح
                      </Button>
                    </Link>
                    <Link to="/opening-day">
                      <Button variant="outline-blue" size="lg" className="h-11 rounded-xl px-7">
                        تفاصيل الافتتاح
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* side — countdown panel */}
                <div className="hidden border-r border-border/60 p-6 lg:flex lg:flex-col lg:items-center lg:justify-center" style={{ background: "hsl(var(--secondary) / 0.35)" }}>
                  <div className="rounded-xl border border-border bg-card p-5 text-center">
                    <p className="text-[0.78rem] font-semibold text-muted-foreground">الافتتاح الكبير</p>
                    <p className="mt-2 text-xl font-bold text-foreground">1 مايو 2026</p>
                    <div className="mt-4">
                      <CountdownTimer compact />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── thin divider ── */}
      <div className="band-primary" />

      {/* ════════════════ 8 · FUTURE DIGITAL VISION ════════════════ */}
      <section className="heritage-deep page-section relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.01]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, hsl(0 0% 100%) 0.5px, transparent 0)", backgroundSize: "24px 24px" }} />
        <div className="relative container max-w-5xl">
          <motion.div
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <div className="mx-auto max-w-[34rem] text-center">
              <p className="section-kicker" style={{ color: "hsl(220 55% 62%)" }}>المرحلة التالية</p>
              <h2 className="section-title text-white">
                من وجهة تقنية راسخة إلى سوق رقمي.
              </h2>
              <p className="mx-auto mt-3 max-w-[30rem] text-[0.95rem] leading-8" style={{ color: "hsl(220 12% 65%)" }}>
                الأساس يعمل الآن — الدليل التفاعلي ودليل المتاجر. المرحلة القادمة
                تفتح سوقًا رقميًا يصل لأي مستخدم في أي مكان.
              </p>
            </div>

            {/* timeline — 3 phases, clear progression */}
            <div className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
              {[
                { n: "1", icon: Compass, label: "الدليل التفاعلي", desc: "خريطة المول كاملة.", active: true },
                { n: "2", icon: ShoppingBag, label: "المتاجر والعروض", desc: "استكشاف وتصفّح مباشر.", active: true },
                { n: "3", icon: Zap, label: "السوق الرقمي", desc: "تسوّق إلكتروني — قريبًا.", active: false },
              ].map((item) => (
                <div
                  key={item.n}
                  className="heritage-surface rounded-xl p-5 text-center"
                  style={!item.active ? { borderColor: "hsl(220 60% 48% / 0.12)" } : undefined}
                >
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: item.active ? "hsl(220 60% 48% / 0.1)" : "hsl(220 20% 30% / 0.3)", border: `1px solid ${item.active ? "hsl(220 60% 48% / 0.2)" : "hsl(220 20% 30% / 0.3)"}` }}>
                    <item.icon className="h-4.5 w-4.5" style={{ color: item.active ? "hsl(220 60% 62%)" : "hsl(220 12% 50%)" }} />
                  </div>
                  <p className="text-[0.95rem] font-bold text-white">{item.label}</p>
                  <p className="mt-1 text-[0.82rem]" style={{ color: "hsl(220 12% 60%)" }}>{item.desc}</p>
                  {item.active && (
                    <span className="mt-3 inline-flex rounded-full px-2.5 py-0.5 text-[0.65rem] font-semibold" style={{ background: "hsl(220 60% 48% / 0.1)", color: "hsl(220 60% 62%)", border: "1px solid hsl(220 60% 48% / 0.15)" }}>
                      متاح الآن
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link to="/stores">
                <Button size="lg" className="h-11 rounded-xl border border-white/10 bg-white/5 px-8 text-[0.9rem] font-semibold text-white hover:bg-white/10">
                  استعرض المتاجر الحالية
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════ 9 · FAQ ════════════════ */}
      <section className="page-section" style={{ background: "var(--gradient-ivory)" }}>
        <div className="container max-w-5xl">
          <motion.div
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <div className="grid items-start gap-8 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="lg:sticky lg:top-28">
                <div className="chapter-shell pt-6">
                  <p className="section-kicker">أسئلة شائعة</p>
                  <h2 className="text-[1.7rem] font-bold leading-[1.1] text-foreground md:text-[2.3rem]">
                    أسئلة متكررة
                  </h2>
                </div>
                <p className="mt-3 text-[0.95rem] leading-8 text-muted-foreground">
                  ما يحتاج الزائر والتاجر معرفته قبل الزيارة أو الاستفسار.
                </p>
                <Link to="/faq" className="mt-4 inline-flex">
                  <Button variant="ghost" className="px-0 text-primary hover:text-primary/80">
                    جميع الأسئلة
                    <ArrowLeft className="mr-1.5 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <Accordion type="single" collapsible defaultValue={faqItems[0]?.id} className="space-y-2">
                {faqItems.map((faq) => (
                  <AccordionItem
                    key={faq.id}
                    value={faq.id}
                    className="overflow-hidden rounded-xl border border-border bg-card px-5"
                  >
                    <AccordionTrigger className="min-h-[3.5rem] py-3.5 text-right text-[0.92rem] font-semibold text-foreground hover:text-primary md:text-[0.95rem]">
                      {faq.question_ar}
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 text-[0.88rem] leading-7 text-muted-foreground">
                      {faq.answer_ar}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
