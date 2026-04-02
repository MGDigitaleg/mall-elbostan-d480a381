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
  Accessories: "تشكيلة واسعة من الملحقات والإكسسوارات لجميع الأجهزة.",
  Laptops: "أجهزة محمولة ومكتبية من العلامات الرائدة عالميًا.",
  Components: "قطع غيار ومكوّنات لأداء احترافي ومخصّص.",
  Networking: "بنية تحتية رقمية وحلول طباعة للمؤسسات والأفراد.",
  Maintenance: "مركز صيانة معتمد وخدمة دعم فني فورية.",
  "Security Systems": "أنظمة مراقبة وحلول أمنية متكاملة.",
};

/* ─── FAQ fallback ─── */
const fallbackFaqs = [
  { id: "faq-1", question_ar: "أين يقع مول البستان؟", answer_ar: "يقع المول في قلب القاهرة الجديدة، ضمن موقع استراتيجي يخدم مدينتي والرحاب والمناطق المحيطة. تفاصيل الوصول ستتوفر عبر صفحة التواصل." },
  { id: "faq-2", question_ar: "متى موعد الافتتاح الرسمي؟", answer_ar: "الافتتاح الكبير مقرر في 1 مايو 2026. تابع صفحة الافتتاح لمعرفة البرنامج الكامل والفعاليات المصاحبة." },
  { id: "faq-3", question_ar: "هل تتوفر وحدات تجارية للتأجير؟", answer_ar: "نعم، تتوفر وحدات متعددة المساحات والفئات. يمكنك استعراضها عبر الخريطة التفاعلية وتقديم استفسار مباشر من صفحة التأجير." },
  { id: "faq-4", question_ar: "كيف أجد متجرًا محددًا داخل المول؟", answer_ar: "استخدم الخريطة التفاعلية أو دليل المتاجر مع إمكانية التصفية حسب الفئة والدور والحالة — كل متجر مرتبط بموقعه الفعلي." },
  { id: "faq-5", question_ar: "هل سيتوفر تسوّق إلكتروني من متاجر المول؟", answer_ar: "السوق الرقمي مرحلة قادمة ضمن رؤية المول الشاملة — امتداد طبيعي من التجربة الفعلية إلى التسوّق عن بُعد." },
  { id: "faq-6", question_ar: "كيف أتقدم باستفسار تجاري أو شراكة؟", answer_ar: "من خلال صفحة التأجير أو صفحة التواصل — يصل طلبك مباشرة للفريق المختص ويتم الرد خلال أيام العمل." },
];

/* ─── animation helpers ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.09, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
};

const sectionReveal = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
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
export function HomeContent({ faqs, featuredStores, upcomingEvents }: HomeContentProps) {
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
  const launchEvent = upcomingEvents[0] ?? null;
  const availableByFloor = floorMapData.map((f) => ({
    id: f.id,
    label: f.label,
    count: f.units.filter((u) => u.status === "available").length,
  }));

  return (
    <>
      {/* ════════════════ 1 · HERO ════════════════ */}
      <section className="relative overflow-hidden bg-[hsl(222_44%_5%)]">
        {/* fine grid */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(0 0% 100% / 0.025) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100% / 0.025) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* radial glow — offset right for RTL visual weight */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 60% 55% at 75% 45%, hsl(220 68% 38% / 0.07), transparent 70%)",
          }}
        />
        {/* bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[hsl(222_44%_5%)] to-transparent" />

        <div className="relative mx-auto w-full max-w-[1400px] px-5 md:px-8 lg:px-14">
          <div className="grid min-h-[94vh] items-center gap-10 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20 lg:py-0">
            {/* ── text ── */}
            <motion.div
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="order-1 space-y-8"
            >
              <div className="flex items-center gap-3">
                <div className="h-px w-10 bg-primary/40" />
                <span className="text-[0.72rem] font-semibold tracking-[0.18em] text-white/35 uppercase" style={{ fontFamily: "var(--font-poppins)" }}>
                  القاهرة الجديدة — الافتتاح مايو 2026
                </span>
              </div>

              <h1 className="max-w-[34rem] text-[2.8rem] font-extrabold leading-[1.02] text-white md:text-[4rem] lg:text-[4.6rem]">
                وجهة التقنية
                <br className="hidden sm:block" />
                <span className="text-gradient-blue">التي بناها السوق</span>
              </h1>

              <p className="max-w-[30rem] text-[1rem] leading-[2.1] text-white/40 md:text-[1.12rem]">
                مول البستان عنوان أثبت مكانته في سوق الإلكترونيات المصري عبر سنوات من العمل المباشر
                مع التجار والمشترين. أكثر من {totalUnits} وحدة تجارية متخصصة تحت سقف واحد — في موقع
                صُنع ليخدم القرار لا التجوّل.
              </p>

              <div className="flex flex-wrap gap-3 pt-1">
                <Link to="/map">
                  <Button
                    variant="cta"
                    size="lg"
                    className="h-[3.4rem] min-w-[13rem] rounded-xl px-7 text-[0.95rem] font-bold shadow-[0_4px_20px_hsl(220_68%_38%/0.25)]"
                  >
                    <Compass className="ml-2 h-[1.1rem] w-[1.1rem]" />
                    استكشف الخريطة
                  </Button>
                </Link>
                <Link to="/stores">
                  <Button
                    size="lg"
                    className="h-[3.4rem] min-w-[11rem] rounded-xl border border-white/10 bg-white/5 px-7 text-[0.95rem] font-semibold text-white backdrop-blur-sm hover:bg-white/10"
                  >
                    تصفّح المتاجر
                  </Button>
                </Link>
                <Link to="/leasing">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="h-[3.4rem] px-5 text-[0.95rem] font-semibold text-white/40 hover:bg-white/5 hover:text-white"
                  >
                    فرص التأجير
                    <ArrowLeft className="mr-1.5 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {/* stats — tighter, more refined */}
              <div className="grid max-w-[28rem] grid-cols-3 gap-3 pt-3">
                {[
                  { v: `${floorMapData.length}`, l: "أدوار تجارية" },
                  { v: `${availableUnits.length}+`, l: "وحدة متاحة" },
                  { v: `${categoryStories.length}`, l: "فئات متخصصة" },
                ].map((s) => (
                  <div key={s.l} className="stat-block-dark px-4 py-3.5">
                    <p className="font-poppins text-[1.5rem] font-bold text-white">{s.v}</p>
                    <p className="mt-0.5 text-[0.68rem] font-medium text-white/28">{s.l}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ── hero image composite ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.12 }}
              className="order-2 flex items-center justify-center"
            >
              <div className="relative w-full max-w-[480px] lg:max-w-none">
                <div className="overflow-hidden rounded-2xl ring-1 ring-white/6 lg:rounded-3xl">
                  <div className="image-shell aspect-[3/4] lg:aspect-[4/5]">
                    <img
                      src={heroImage}
                      alt="الواجهة الرئيسية لمول البستان"
                      className="h-full w-full object-cover"
                      loading="eager"
                    />
                    <div className="image-wash absolute inset-0" />
                  </div>
                </div>
                {/* floating accent image */}
                <div className="absolute -bottom-5 -right-5 hidden w-[40%] overflow-hidden rounded-xl shadow-[var(--shadow-deep)] ring-1 ring-white/8 md:block lg:-bottom-6 lg:-right-6 lg:rounded-2xl">
                  <div className="image-shell aspect-[3/4]">
                    <img
                      src={interiorImage}
                      alt="المشهد الداخلي لمول البستان"
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── architectural band ── */}
      <div className="band-primary" />

      {/* ════════ countdown divider ════════ */}
      <section className="border-b border-border/60 bg-card py-4 md:py-5">
        <div className="container flex flex-col items-center gap-3 md:flex-row md:justify-between">
          <p className="text-[0.82rem] font-semibold text-muted-foreground">
            الافتتاح الكبير — العد التنازلي
          </p>
          <CountdownTimer compact />
        </div>
      </section>

      {/* ════════════════ 2 · HERITAGE & IDENTITY ════════════════ */}
      <section className="page-section overflow-hidden">
        <div className="container">
          <motion.div
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              {/* imagery */}
              <div className="order-2 lg:order-1">
                <div className="grid gap-3 md:grid-cols-[1fr_0.48fr]">
                  <div className="image-architectural overflow-hidden rounded-2xl">
                    <img
                      src={entranceImage}
                      alt="مدخل مول البستان"
                      className="aspect-[4/3] h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="image-architectural hidden overflow-hidden rounded-2xl md:block">
                    <img
                      src={facadeImage}
                      alt="واجهة معمارية لمول البستان"
                      className="aspect-[3/5] h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
              {/* text */}
              <div className="order-1 space-y-6 lg:order-2">
                <div className="chapter-shell pt-6">
                  <p className="section-kicker">الهوية والمكانة</p>
                  <h2 className="section-title max-w-[28rem]">
                    اسم لم يحتج حملات ليُعرف — بناه السوق نفسه.
                  </h2>
                </div>
                <p className="text-[1.05rem] leading-[2] text-muted-foreground md:text-lg">
                  مول البستان ليس مشروعًا يبحث عن جمهور — إنه وجهة بناها الجمهور بتكرار
                  الزيارة والثقة في التعامل. سنوات من الحضور المتواصل في سوق الإلكترونيات
                  جعلت منه مرجعًا حقيقيًا في القاهرة الجديدة.
                </p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { icon: Building2, title: "مكانة مبنية بالتكرار", desc: "ثقة تراكمية من سنوات التعامل المباشر." },
                    { icon: MapPin, title: "موقع يصنع الفارق", desc: "يخدم القاهرة الجديدة ومدينتي والرحاب." },
                    { icon: Layers, title: "تصنيف دقيق", desc: "فئات متخصصة تختصر المسار من الدخول للقرار." },
                  ].map((c) => (
                    <div key={c.title} className="card-architectural rounded-xl p-5 pr-7">
                      <c.icon className="mb-3 h-5 w-5 text-primary" />
                      <p className="text-[0.95rem] font-bold text-foreground">{c.title}</p>
                      <p className="mt-1.5 text-[0.85rem] leading-6 text-muted-foreground">{c.desc}</p>
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
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── architectural band ── */}
      <div className="band-primary" />

      {/* ════════════════ 3 · VALUE PROPOSITION ════════════════ */}
      <section className="heritage-deep page-section">
        <div className="container">
          <motion.div
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <div className="mx-auto mb-14 max-w-[40rem] text-center">
              <p className="section-kicker text-primary/50">القيمة الحقيقية</p>
              <h2 className="section-title text-white">
                مول مصمّم ليخدم — لا ليُبهر فقط.
              </h2>
              <p className="mx-auto mt-5 max-w-[32rem] text-[1.05rem] leading-8 text-white/40">
                سواء كنت مشتريًا يبحث عن منتج بعينه، أو تاجرًا يبحث عن موقع فعّال، أو مستثمرًا
                يقيّم فرصة — كل تفصيلة في المول مصمّمة لتقصير المسافة بين الدخول والقرار.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {[
                {
                  icon: Users,
                  title: "للمشترين والزوّار",
                  points: [
                    "تصنيف دقيق يوصّلك للمنتج المناسب بأقل وقت.",
                    "خريطة تفاعلية تكشف حالة كل وحدة قبل الوصول.",
                    "مكافآت وعروض مرتبطة بتجربة الزيارة الفعلية.",
                  ],
                },
                {
                  icon: Store,
                  title: "للتجار وأصحاب العلامات",
                  points: [
                    "حضور رقمي واضح لكل متجر في الدليل والخريطة.",
                    "جمهور متخصص يأتي بنية الشراء لا بنية التجوّل.",
                    "بيئة تجارية منظّمة ترفع من قيمة الموقع.",
                  ],
                },
                {
                  icon: TrendingUp,
                  title: "للمستثمرين والمستأجرين",
                  points: [
                    "وحدات متنوعة المساحات بحالة وتسعير شفّاف.",
                    "موقع تجاري في منطقة طلب حقيقي ومتنامٍ.",
                    "مسار استفسار مباشر من الخريطة لفريق التأجير.",
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
                  <div className="flex h-full flex-col rounded-2xl border border-white/6 bg-white/[0.03] p-7 backdrop-blur-sm">
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/8">
                      <card.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-[1.15rem] font-bold text-white">{card.title}</h3>
                    <ul className="mt-4 space-y-3">
                      {card.points.map((p) => (
                        <li key={p} className="flex items-start gap-2.5 text-[0.9rem] leading-7 text-white/42">
                          <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-primary/50" />
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

      {/* ════════════════ 4 · STORE DISCOVERY ════════════════ */}
      <section className="page-section">
        <div className="container">
          <motion.div
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <div className="mb-12 max-w-[36rem]">
              <p className="section-kicker">دليل الفئات</p>
              <h2 className="section-title">ست فئات تقنية تغطي كل احتياج حقيقي.</h2>
              <p className="mt-3 text-base leading-8 text-muted-foreground md:text-lg">
                ليس تصنيفًا عشوائيًا — كل فئة تمثل نمط شراء فعلي ومسار وصول مباشر.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categoryStories.map((cat, i) => (
                <motion.div
                  key={cat.key}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <div className="card-layered group flex h-full min-h-[12rem] flex-col p-6 transition-all duration-300 hover:shadow-[var(--shadow-elevated)]">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-secondary text-primary transition-colors group-hover:border-primary/20 group-hover:bg-primary/5">
                        <cat.icon className="h-5 w-5" />
                      </div>
                      <span className="font-poppins text-[0.8rem] font-medium text-muted-foreground/30">
                        0{i + 1}
                      </span>
                    </div>
                    <h3 className="text-[1.05rem] font-bold text-foreground">{cat.name}</h3>
                    <p className="mt-2 text-[0.88rem] leading-7 text-muted-foreground">{cat.brief}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* featured stores if available */}
            {featuredStores.length > 0 && (
              <div className="mt-10 card-layered p-6 md:p-8">
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-foreground">متاجر مميزة</h3>
                  <Link to="/stores">
                    <Button variant="ghost" size="sm" className="text-primary">
                      عرض الكل
                      <ArrowLeft className="mr-1 h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {featuredStores.slice(0, 6).map((store) => (
                    <Link
                      key={store.id}
                      to={`/stores/${store.slug}`}
                      className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/20 hover:shadow-[var(--shadow-card)]"
                    >
                      {store.logo_url ? (
                        <img src={store.logo_url} alt={store.name_ar} className="h-10 w-10 rounded-lg border border-border object-contain" />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary text-primary">
                          <Store className="h-4 w-4" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-bold text-foreground">{store.name_ar}</p>
                        {store.category && (
                          <p className="mt-0.5 text-[0.75rem] text-muted-foreground">{store.category}</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-10 flex justify-center">
              <Link to="/stores">
                <Button variant="secondary" size="lg" className="h-12 rounded-xl px-8 font-semibold">
                  تصفّح جميع المتاجر
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── divider ── */}
      <div className="section-divider container" />

      {/* ════════════════ 5 · INTERACTIVE MAP ════════════════ */}
      <section className="section-warm page-section">
        <div className="container">
          <motion.div
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <div className="grid items-start gap-10 lg:grid-cols-[2fr_3fr] lg:gap-12">
              {/* text panel */}
              <div className="space-y-6 lg:sticky lg:top-28">
                <div className="chapter-shell pt-6">
                  <p className="section-kicker">الدليل التفاعلي</p>
                  <h2 className="section-title">
                    كل وحدة ظاهرة — كل دور واضح — قبل أن تصل.
                  </h2>
                </div>
                <p className="text-base leading-8 text-muted-foreground md:text-lg">
                  الدليل التفاعلي يعرض المول كاملًا بأدواره ووحداته وحالاتها — متاح، مشغول، أو
                  قادم. أداة تخطيط حقيقية للزائر والتاجر على حد سواء.
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { v: `${floorMapData.length}`, l: "أدوار" },
                    { v: `${availableUnits.length}`, l: "متاحة" },
                    { v: `${totalUnits}`, l: "إجمالي الوحدات" },
                  ].map((s) => (
                    <div key={s.l} className="section-shell rounded-xl px-4 py-4 text-center">
                      <p className="text-xl font-bold text-foreground">{s.v}</p>
                      <p className="mt-0.5 text-[0.74rem] text-muted-foreground">{s.l}</p>
                    </div>
                  ))}
                </div>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  <Link to="/map">
                    <Button variant="cta" size="lg" className="h-12 w-full rounded-xl">
                      افتح الدليل الكامل
                    </Button>
                  </Link>
                  <Link to="/leasing">
                    <Button variant="outline-blue" size="lg" className="h-12 w-full rounded-xl">
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

      {/* ════════════════ 6 · LEASING ════════════════ */}
      <section className="heritage-section page-section">
        <div className="container">
          <motion.div
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
              {/* text */}
              <div className="space-y-6">
                <div className="chapter-shell border-primary/40 pt-6">
                  <p className="section-kicker">الفرصة التجارية</p>
                  <h2 className="section-title max-w-[26rem]">
                    موقعك في وجهة تقنية يأتي إليها الجمهور المناسب.
                  </h2>
                </div>
                <p className="text-base leading-8 text-white/42 md:text-lg">
                  ما يميز مول البستان ليس الموقع فقط — بل الجمهور الذي يقصده تحديدًا بحثًا عن
                  التقنية. وحدات بمساحات متعددة، حالات واضحة، واستفسار يصل للفريق المختص مباشرة.
                </p>

                {/* floor availability */}
                <div className="grid grid-cols-3 gap-3">
                  {availableByFloor.map((f) => (
                    <div key={f.id} className="rounded-xl border border-white/8 bg-white/[0.03] px-4 py-4 text-center">
                      <p className="text-xl font-bold text-white">{f.count}</p>
                      <p className="mt-0.5 text-[0.74rem] text-white/35">{f.label}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 pt-1">
                  <Link to="/leasing">
                    <Button variant="orange" size="lg" className="h-12 rounded-xl px-8 font-bold">
                      ابدأ استفسار التأجير
                    </Button>
                  </Link>
                  <Link to="/map">
                    <Button size="lg" className="h-12 rounded-xl border border-white/12 bg-white/6 px-8 text-white hover:bg-white/12">
                      شاهد الوحدات على الخريطة
                    </Button>
                  </Link>
                </div>
              </div>

              {/* unit cards */}
              <div className="space-y-3">
                {homepageLeasingUnits.slice(0, 3).map((unit) => (
                  <Link
                    key={unit.unit_id}
                    to="/map"
                    className="group flex flex-col rounded-xl border border-white/8 bg-white/[0.03] p-5 transition-all duration-200 hover:border-orange/30 hover:bg-white/[0.05]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-lg font-bold text-white">وحدة {unit.unit_id}</p>
                        <p className="mt-1 text-sm text-white/35">{needCategoryLabels[unit.category]}</p>
                      </div>
                      <span className="rounded-full border border-orange/25 bg-orange/12 px-3 py-1 text-[0.75rem] font-semibold text-orange">
                        متاحة
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2.5">
                      <div className="rounded-lg bg-white/5 px-3 py-2.5">
                        <p className="text-[0.72rem] text-white/30">الدور</p>
                        <p className="mt-0.5 text-sm font-semibold text-white">{floorLabels[unit.floor_id]}</p>
                      </div>
                      <div className="rounded-lg bg-white/5 px-3 py-2.5">
                        <p className="text-[0.72rem] text-white/30">المساحة</p>
                        <p className="mt-0.5 text-sm font-semibold text-white">{unit.area_m2} م²</p>
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
      <section className="page-section">
        <div className="container">
          <motion.div
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <div className="card-layered overflow-hidden">
              <div className="grid lg:grid-cols-[1.3fr_0.7fr]">
                {/* text */}
                <div className="space-y-5 p-7 md:p-10">
                  <p className="section-kicker">حملة الافتتاح</p>
                  <h2 className="section-title max-w-[26rem]">
                    افتتاح يُكافئ الحضور — لا مجرد احتفال.
                  </h2>
                  <p className="text-base leading-8 text-muted-foreground md:text-lg">
                    حملة أدر واربح مرتبطة بمتاجر حقيقية ومكافآت محددة — جزء أصيل من تجربة
                    الافتتاح الكبير، وليست عرضًا تسويقيًا عابرًا.
                  </p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      { step: "01", title: "استكشف", desc: "ابدأ من الدليل التفاعلي." },
                      { step: "02", title: "شارك", desc: "أدر العجلة واحفظ نتيجتك." },
                      { step: "03", title: "احضر", desc: "استلم مكافأتك يوم الافتتاح." },
                    ].map((s) => (
                      <div key={s.step} className="card-architectural rounded-xl p-4 pr-6">
                        <span className="font-poppins text-xs font-bold text-primary">{s.step}</span>
                        <p className="mt-2 text-[0.92rem] font-bold text-foreground">{s.title}</p>
                        <p className="mt-1 text-[0.82rem] text-muted-foreground">{s.desc}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3 pt-1">
                    <Link to="/spin-win">
                      <Button variant="cta" size="lg" className="h-12 rounded-xl px-7">
                        <Gift className="ml-2 h-4 w-4" />
                        جرّب أدر واربح
                      </Button>
                    </Link>
                    <Link to="/opening-day">
                      <Button variant="outline-blue" size="lg" className="h-12 rounded-xl px-7">
                        تفاصيل يوم الافتتاح
                      </Button>
                    </Link>
                  </div>
                </div>
                {/* side panel */}
                <div className="hidden border-r border-border bg-secondary/40 p-8 lg:flex lg:flex-col lg:items-center lg:justify-center lg:text-center">
                  <div className="section-shell rounded-2xl p-6">
                    <p className="text-sm font-semibold text-muted-foreground">التاريخ المنتظر</p>
                    <p className="mt-2 text-2xl font-bold text-foreground">
                      {launchEvent?.event_date ?? "1 مايو 2026"}
                    </p>
                    <div className="mt-5">
                      <CountdownTimer compact />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── divider ── */}
      <div className="section-divider container" />

      {/* ════════════════ 8 · FUTURE VISION ════════════════ */}
      <section className="section-warm page-section">
        <div className="container max-w-5xl text-center">
          <motion.div
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <p className="section-kicker">المرحلة التالية</p>
            <h2 className="section-title mx-auto max-w-[30rem]">
              من وجهة تقنية راسخة إلى سوق رقمي بلا حدود.
            </h2>
            <p className="mx-auto mt-4 max-w-[34rem] text-base leading-8 text-muted-foreground md:text-lg">
              المنتج الأساسي يعمل الآن — الدليل التفاعلي ودليل المتاجر. المرحلة القادمة
              تفتح سوقًا رقميًا يمتد من المتاجر الفعلية ليصل لأي مستخدم في أي مكان.
            </p>

            <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
              {[
                { n: "1", label: "الدليل التفاعلي", desc: "خريطة المول كاملة — تعمل الآن.", active: true },
                { n: "2", label: "المتاجر والعروض", desc: "استكشاف وتصفّح بالفئة والعرض.", active: true },
                { n: "3", label: "السوق الرقمي", desc: "تسوّق إلكتروني مباشر — قريبًا.", active: false },
              ].map((item) => (
                <div
                  key={item.n}
                  className={`card-layered rounded-xl p-6 transition-all ${!item.active ? "border-primary/15" : ""}`}
                >
                  <span className={`font-poppins text-3xl font-bold ${item.active ? "text-primary/70" : "text-primary/30"}`}>
                    {item.n}
                  </span>
                  <p className="mt-3 text-[1rem] font-bold text-foreground">{item.label}</p>
                  <p className="mt-1.5 text-[0.85rem] text-muted-foreground">{item.desc}</p>
                  {item.active && (
                    <span className="mt-3 inline-flex rounded-full border border-primary/15 bg-primary/5 px-2.5 py-0.5 text-[0.68rem] font-semibold text-primary">
                      متاح الآن
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link to="/stores">
                <Button variant="secondary" size="lg" className="h-12 rounded-xl px-8">
                  استعرض المتاجر الحالية
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════ 9 · FAQ ════════════════ */}
      <section className="page-section">
        <div className="container max-w-5xl">
          <motion.div
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <div className="grid items-start gap-10 lg:grid-cols-[0.85fr_1.15fr]">
              <div className="lg:sticky lg:top-28">
                <div className="chapter-shell pt-6">
                  <p className="section-kicker">أسئلة شائعة</p>
                  <h2 className="text-[1.8rem] font-bold leading-[1.08] text-foreground md:text-[2.5rem]">
                    <HelpCircle className="ml-2 hidden h-6 w-6 text-primary md:inline-block" />
                    أسئلة متكررة
                  </h2>
                </div>
                <p className="mt-3 text-base leading-8 text-muted-foreground md:text-lg">
                  ما يحتاج الزائر والتاجر معرفته قبل الزيارة أو الاستفسار.
                </p>
                <Link to="/faq" className="mt-4 inline-flex">
                  <Button variant="ghost" className="px-0 text-primary hover:text-primary/80">
                    جميع الأسئلة
                    <ArrowLeft className="mr-1.5 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <Accordion type="single" collapsible defaultValue={faqItems[0]?.id} className="space-y-2.5">
                {faqItems.map((faq) => (
                  <AccordionItem
                    key={faq.id}
                    value={faq.id}
                    className="card-layered overflow-hidden rounded-xl px-5"
                  >
                    <AccordionTrigger className="min-h-[4rem] py-4 text-right text-[0.95rem] font-semibold text-foreground hover:text-primary md:text-base">
                      {faq.question_ar}
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 text-sm leading-7 text-muted-foreground md:text-base md:leading-8">
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
