import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  CircuitBoard,
  Compass,
  Gift,
  Globe,
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
  Phone,
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
  Accessories: "ملحقات وإكسسوارات لجميع الأجهزة.",
  Laptops: "أجهزة من العلامات الرائدة عالميًا.",
  Components: "قطع غيار ومكوّنات احترافية.",
  Networking: "بنية تحتية رقمية وحلول شبكات.",
  Maintenance: "صيانة معتمدة ودعم فني فوري.",
  "Security Systems": "أنظمة مراقبة وحلول أمنية.",
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
  hidden: { opacity: 0, y: 22 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

const sectionReveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
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
  const availableUnits = availableMapUnits;
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
      {/* ════════════════ 1 · HERO ════════════════ */}
      <section className="relative overflow-hidden" style={{ background: "#071326" }}>
        {/* Subtle architectural grain */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 70% 45%, #2D6BFF0F, transparent 65%)" }} />

        <div className="relative mx-auto w-full max-w-[1400px] px-5 md:px-8 lg:px-14">
          <div className="grid min-h-[94vh] items-center gap-10 py-20 lg:grid-cols-2 lg:gap-20 lg:py-0">

            {/* text block */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="order-1 space-y-7"
            >
              {/* kicker with bronze accent line */}
              <div className="flex items-center gap-3">
                <div className="h-[3px] w-10 rounded-full" style={{ background: "hsl(30 22% 48%)" }} />
                <span className="font-poppins text-[0.72rem] font-bold tracking-[0.2em] uppercase dark-accent">
                  وجهة تقنية راسخة منذ سنوات
                </span>
              </div>

              <h1 className="max-w-[26rem] text-[2.8rem] leading-[1.02] md:text-[3.8rem] lg:text-[4.4rem] dark-heading">
                المكان الذي يعرفه
                <br />
                <span className="dark-heading">كل من دخل السوق.</span>
              </h1>

              <p className="max-w-[28rem] text-[1.02rem] leading-[2] md:text-[1.1rem] dark-body">
                مول البستان — وجهة تجارية راسخة في القاهرة الجديدة.
                أكثر من {totalUnits} وحدة تخدم سوق الإلكترونيات والتقنية منذ سنوات.
              </p>

              {/* CTA pair */}
              <div className="flex flex-wrap gap-3">
                <Link to="/map">
                  <Button variant="cta" size="lg" className="h-[3.2rem] min-w-[12rem] rounded-xl px-8 text-[0.95rem] font-bold shadow-[var(--shadow-blue)]">
                    <Compass className="ml-2 h-[1.1rem] w-[1.1rem]" />
                    استكشف الخريطة
                  </Button>
                </Link>
                <Link to="/stores">
                  <Button size="lg" className="h-[3.2rem] min-w-[9.5rem] rounded-xl border px-8 text-[0.95rem] font-semibold backdrop-blur-sm" style={{ borderColor: "hsl(0 0% 100% / 0.12)", background: "hsl(0 0% 100% / 0.06)", color: "hsl(38 14% 92%)" }}>
                    تصفّح المتاجر
                  </Button>
                </Link>
              </div>

              {/* stats bar — anchored, high contrast */}
              <div className="flex items-center gap-6 pt-6" style={{ borderTop: "1px solid hsl(0 0% 100% / 0.1)" }}>
                {[
                  { v: `${totalUnits}+`, l: "وحدة تجارية" },
                  { v: `${floorMapData.length}`, l: "أدوار تجارية" },
                  { v: `${categoryStories.length}`, l: "أقسام متخصصة" },
                ].map((s, i) => (
                  <div key={s.l} className="flex items-center gap-5">
                    <div>
                      <p className="font-poppins text-[1.6rem] font-extrabold dark-heading">{s.v}</p>
                      <p className="text-[0.72rem] font-semibold dark-muted">{s.l}</p>
                    </div>
                    {i < 2 && <div className="h-8 w-px" style={{ background: "hsl(0 0% 100% / 0.1)" }} />}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* image composition — large editorial shot + detail crop */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.75, delay: 0.1 }}
              className="order-2 hidden lg:block"
            >
              <div className="relative mx-auto max-w-[480px]">
                {/* main image */}
                <div className="overflow-hidden rounded-2xl" style={{ border: "1px solid hsl(0 0% 100% / 0.08)", boxShadow: "0 28px 72px hsl(222 34% 4% / 0.55)" }}>
                  <div className="aspect-[3/4]">
                    <img src={heroImage} alt="الواجهة الرئيسية لمول البستان" className="h-full w-full object-cover img-grade-dark" loading="eager" />
                  </div>
                  {/* bottom info overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-6" style={{ background: "linear-gradient(to top, #071326E6, #07132666 60%, transparent)" }}>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="font-poppins text-[0.68rem] font-bold tracking-[0.18em] uppercase dark-accent">Mall Elbostan</p>
                        <p className="mt-0.5 text-[0.85rem] font-semibold dark-heading">القاهرة الجديدة</p>
                      </div>
                      <div className="rounded-lg px-3 py-1.5" style={{ background: "hsl(0 0% 100% / 0.08)", border: "1px solid hsl(0 0% 100% / 0.1)" }}>
                        <p className="text-[0.68rem] font-bold dark-heading">Est. 2010+</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* detail crop — interior */}
                <div className="absolute -bottom-5 -right-5 w-[34%]">
                  <div className="overflow-hidden rounded-xl" style={{ border: "1px solid hsl(0 0% 100% / 0.1)", boxShadow: "0 16px 40px hsl(222 34% 4% / 0.55)" }}>
                    <div className="aspect-square">
                      <img src={interiorImage} alt="المتاجر من الداخل" className="h-full w-full object-cover img-grade-dark" loading="lazy" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* countdown bar */}
      <section className="border-b border-border/50 bg-card py-4">
        <div className="container flex flex-col items-center gap-3 md:flex-row md:justify-between">
          <p className="text-[0.85rem] font-bold text-foreground">الافتتاح الكبير — العد التنازلي</p>
          <CountdownTimer compact />
        </div>
      </section>

      {/* ════════════════ 2 · HERITAGE / LEGACY ════════════════ */}
      <section className="page-section overflow-hidden" style={{ background: "var(--gradient-ivory)" }}>
        <div className="container">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
              {/* text */}
              <div className="order-1 space-y-6">
                <div className="chapter-shell pt-7">
                  <p className="section-kicker">تاريخ ومكانة</p>
                  <h2 className="section-title max-w-[24rem]">اسم يعرفه السوق قبل أن تسأل عنه.</h2>
                </div>
                <p className="text-[1.04rem] leading-[2] text-foreground md:text-[1.1rem]" style={{ opacity: 0.8 }}>
                  مول البستان ليس افتتاحًا جديدًا — إنه وجهة تجارية عرفها سوق الإلكترونيات في
                  القاهرة الجديدة منذ سنوات. مكان يأتي إليه الناس لأنهم يعرفونه ويثقون فيه —
                  واليوم يتجدد معماريًا ورقميًا بنفس القيم.
                </p>

                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { icon: Building2, title: "وجهة راسخة", desc: "سنوات من الحضور التجاري الحقيقي." },
                    { icon: MapPin, title: "معلم تجاري", desc: "يقصده سكان القاهرة الجديدة ومدينتي." },
                    { icon: Layers, title: "سوق منظّم", desc: "تصنيف واضح يختصر وقت البحث." },
                  ].map((c) => (
                    <div key={c.title} className="card-architectural rounded-xl p-4">
                      <c.icon className="mb-2.5 h-[1.15rem] w-[1.15rem] text-primary" />
                      <p className="text-[0.92rem] font-bold text-foreground">{c.title}</p>
                      <p className="mt-1 text-[0.84rem] leading-6 text-muted-foreground">{c.desc}</p>
                    </div>
                  ))}
                </div>

                <Link to="/about">
                  <Button variant="ghost" className="mt-2 px-0 text-primary hover:text-primary/80">
                    تعرّف على قصة المول <ArrowLeft className="mr-1.5 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {/* imagery */}
              <div className="order-2">
                <div className="grid gap-3 md:grid-cols-[1.3fr_0.55fr]">
                  <div className="editorial-frame overflow-hidden rounded-2xl">
                    <img src={entranceImage} alt="مدخل مول البستان" className="img-grade aspect-[4/3] h-full w-full object-cover object-[center_35%]" loading="lazy" />
                  </div>
                  <div className="editorial-frame hidden overflow-hidden rounded-2xl md:block">
                    <img src={facadeImage} alt="تفاصيل الواجهة المعمارية" className="img-grade aspect-[2/3] h-full w-full object-cover object-[center_40%]" loading="lazy" />
                  </div>
                </div>
                <div className="mt-4 h-[3px] w-20 rounded-full" style={{ background: "linear-gradient(90deg, hsl(30 22% 48% / 0.4), transparent)" }} />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="band-primary" />

      {/* ════════════════ 3 · VALUE PROPOSITION ════════════════ */}
      <section className="heritage-deep page-section relative overflow-hidden">
        <div className="relative container">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="mb-12 max-w-[34rem]">
              <p className="section-kicker dark-kicker">لماذا مول البستان</p>
              <h2 className="section-title dark-heading">مكان يعرف جمهوره — وجمهوره يعرفه.</h2>
              <p className="mt-4 text-[1.02rem] leading-8 dark-body">
                المول الذي يأتي إليه المشترون بنية الشراء، والتجار بثقة في الموقع.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  icon: Users, title: "للمشترين والزوّار",
                  points: [
                    "تصنيف دقيق يوصّلك للمنتج بأقل وقت.",
                    "خريطة تكشف حالة كل وحدة قبل الوصول.",
                    "مكافآت مرتبطة بتجربة الزيارة الفعلية.",
                  ],
                },
                {
                  icon: Store, title: "للتجار وأصحاب العلامات",
                  points: [
                    "حضور رقمي واضح في الدليل والخريطة.",
                    "جمهور يأتي بنية الشراء لا التجوّل.",
                    "بيئة تجارية منظّمة ترفع قيمة الموقع.",
                  ],
                },
                {
                  icon: TrendingUp, title: "للمستثمرين والمستأجرين",
                  points: [
                    "وحدات متنوعة بحالة وتسعير شفّاف.",
                    "موقع في منطقة طلب حقيقي ومتنامٍ.",
                    "استفسار مباشر من الخريطة لفريق التأجير.",
                  ],
                },
              ].map((card, i) => (
                <motion.div key={card.title} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <div className="heritage-surface flex h-full flex-col p-6">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg" style={{ border: "1px solid hsl(220 50% 42% / 0.25)", background: "hsl(220 50% 42% / 0.1)" }}>
                      <card.icon className="h-4.5 w-4.5 dark-kicker" />
                    </div>
                    <h3 className="text-[1.05rem] font-bold dark-heading">{card.title}</h3>
                    <ul className="mt-3 space-y-2.5">
                      {card.points.map((p) => (
                        <li key={p} className="flex items-start gap-2.5 text-[0.88rem] leading-7 dark-body">
                          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "hsl(220 55% 55% / 0.5)" }} />
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

      {/* ════════════════ 4 · CATEGORIES ════════════════ */}
      <section className="section-ivory page-section">
        <div className="container">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="mb-10 max-w-[32rem]">
              <p className="section-kicker">أقسام المول</p>
              <h2 className="section-title">كل قسم يمثل سوقًا قائمًا بذاته.</h2>
              <p className="mt-3 text-[1rem] leading-8 text-muted-foreground">ستة أقسام متخصصة — كل قسم يضم متاجر ومنتجات يعرفها السوق.</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categoryStories.map((cat, i) => (
                <motion.div key={cat.key} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <Link to="/stores" className="block">
                    <div className="group flex h-full items-start gap-4 rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/20 hover:shadow-[var(--shadow-elevated)]">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary text-primary transition-colors group-hover:border-primary/20 group-hover:bg-primary/5">
                        <cat.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-baseline justify-between gap-2">
                          <h3 className="text-[0.95rem] font-bold text-foreground">{cat.name}</h3>
                          <span className="font-poppins text-[0.72rem] font-bold text-muted-foreground/40">0{i + 1}</span>
                        </div>
                        <p className="mt-1 text-[0.84rem] leading-6 text-muted-foreground">{cat.brief}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {featuredStores.length > 0 && (
              <div className="mt-10 rounded-xl border border-border bg-card p-6 md:p-8">
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="text-[1rem] font-bold text-foreground">متاجر مميزة</h3>
                  <Link to="/stores">
                    <Button variant="ghost" size="sm" className="text-[0.82rem] text-primary">
                      عرض الكل <ArrowLeft className="mr-1 h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {featuredStores.slice(0, 6).map((store) => (
                    <Link key={store.id} to={`/stores/${store.slug}`} className="flex items-center gap-3.5 rounded-lg border border-border p-3.5 transition-all hover:border-primary/15 hover:shadow-sm">
                      {store.logo_url ? (
                        <img src={store.logo_url} alt={store.name_ar} className="h-10 w-10 rounded-lg border border-border object-contain" />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary text-primary">
                          <Store className="h-4 w-4" />
                        </div>
                      )}
                      <div>
                        <p className="text-[0.9rem] font-bold text-foreground">{store.name_ar}</p>
                        {store.category && <p className="mt-0.5 text-[0.72rem] text-muted-foreground">{store.category}</p>}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-center">
              <Link to="/stores">
                <Button variant="secondary" size="lg" className="h-12 rounded-xl px-8 font-bold">تصفّح جميع المتاجر</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="band-primary" />

      {/* ════════════════ 5 · MAP PREVIEW ════════════════ */}
      <section className="section-sand page-section">
        <div className="container">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="mb-10 grid items-end gap-6 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="section-kicker">دليل المول</p>
                <h2 className="section-title max-w-[28rem]">اعرف مكان كل متجر — قبل أن تصل.</h2>
                <p className="mt-3 text-[1rem] leading-8 text-muted-foreground">
                  الدليل التفاعلي يعرض المول كما هو فعليًا — الأدوار والمتاجر والوحدات المتاحة.
                </p>
              </div>
              <div className="hidden lg:flex lg:gap-2.5">
                <Link to="/map"><Button variant="cta" size="lg" className="h-12 rounded-xl px-8 text-[0.9rem]">افتح الدليل الكامل</Button></Link>
                <Link to="/leasing"><Button variant="outline-blue" size="lg" className="h-12 rounded-xl px-8 text-[0.9rem]">استفسر عن وحدة</Button></Link>
              </div>
            </div>

            <MapTeaserPreview />

            <div className="mt-6 grid gap-2.5 sm:grid-cols-2 lg:hidden">
              <Link to="/map"><Button variant="cta" size="lg" className="h-12 w-full rounded-xl text-[0.9rem]">افتح الدليل الكامل</Button></Link>
              <Link to="/leasing"><Button variant="outline-blue" size="lg" className="h-12 w-full rounded-xl text-[0.9rem]">استفسر عن وحدة</Button></Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════ 6 · LEASING ════════════════ */}
      <section className="section-stone page-section">
        <div className="container">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
              <div className="space-y-6">
                <div className="chapter-shell border-primary/40 pt-7">
                  <p className="section-kicker">التأجير والاستثمار</p>
                  <h2 className="section-title max-w-[22rem]">وحدتك في مكان يقصده الناس فعلًا.</h2>
                </div>
                <p className="text-[1rem] leading-8 text-foreground md:text-[1.06rem]" style={{ opacity: 0.75 }}>
                  مول البستان ليس موقعًا جديدًا يحتاج إثبات — إنه وجهة مثبتة بحركة
                  تجارية حقيقية. وحدات جاهزة بمساحات مختلفة واستفسار مباشر.
                </p>

                <div className="grid grid-cols-3 gap-3">
                  {availableByFloor.map((f) => (
                    <div key={f.id} className="rounded-xl border border-border bg-card px-3.5 py-4 text-center">
                      <p className="font-poppins text-2xl font-extrabold text-foreground">{f.count}</p>
                      <p className="mt-1 text-[0.74rem] font-semibold text-muted-foreground">{f.label}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { icon: MapPin, label: "موقع استراتيجي" },
                    { icon: Users, label: "جمهور متخصص" },
                    { icon: TrendingUp, label: "طلب متنامٍ" },
                    { icon: Layers, label: "أقسام منظّمة" },
                  ].map((p) => (
                    <div key={p.label} className="flex items-center gap-2.5 rounded-lg border border-border bg-card px-4 py-3">
                      <p.icon className="h-4 w-4 text-primary" />
                      <span className="text-[0.86rem] font-bold text-foreground">{p.label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Link to="/leasing"><Button variant="orange" size="lg" className="h-12 rounded-xl px-8 font-bold">ابدأ استفسار التأجير</Button></Link>
                  <Link to="/map"><Button variant="outline-blue" size="lg" className="h-12 rounded-xl px-8">شاهد الوحدات</Button></Link>
                </div>
              </div>

              {/* unit cards */}
              <div className="space-y-3">
                {homepageLeasingUnits.slice(0, 3).map((unit) => (
                  <Link key={unit.unit_id} to="/map" className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-orange/25 hover:shadow-[var(--shadow-card)]">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[1.05rem] font-bold text-foreground">وحدة {unit.unit_id}</p>
                        <p className="mt-0.5 text-[0.84rem] text-muted-foreground">{needCategoryLabels[unit.category]}</p>
                      </div>
                      <span className="rounded-full border border-orange/25 bg-orange/8 px-2.5 py-0.5 text-[0.72rem] font-bold text-orange">متاحة</span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div className="rounded-lg bg-secondary px-3 py-2.5">
                        <p className="text-[0.72rem] text-muted-foreground">الدور</p>
                        <p className="mt-0.5 text-[0.9rem] font-bold text-foreground">{floorLabels[unit.floor_id]}</p>
                      </div>
                      <div className="rounded-lg bg-secondary px-3 py-2.5">
                        <p className="text-[0.72rem] text-muted-foreground">المساحة</p>
                        <p className="mt-0.5 text-[0.9rem] font-bold text-foreground">{unit.area_m2} م²</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════ 7 · ENGAGEMENT / OPENING ════════════════ */}
      <section className="page-section" style={{ background: "var(--gradient-ivory)" }}>
        <div className="container">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-elevated)]">
              <div className="grid lg:grid-cols-[1.4fr_0.6fr]">
                <div className="space-y-6 p-6 md:p-8">
                  <p className="section-kicker">حملة الافتتاح</p>
                  <h2 className="section-title max-w-[22rem]">افتتاح يُكافئ الحضور.</h2>
                  <p className="text-[1rem] leading-8 text-muted-foreground md:text-[1.04rem]">
                    مكافآت حقيقية من متاجر المول — مرتبطة بموقعها على الخريطة
                    وقابلة للاستلام يوم الافتتاح.
                  </p>

                  <div className="flex flex-wrap gap-6 border-t border-border pt-6">
                    {[
                      { n: "01", title: "استكشف", desc: "ابدأ من دليل المول." },
                      { n: "02", title: "شارك", desc: "أدر العجلة واحفظ نتيجتك." },
                      { n: "03", title: "احضر", desc: "استلم مكافأتك يوم الافتتاح." },
                    ].map((s) => (
                      <div key={s.n} className="min-w-[7.5rem]">
                        <span className="font-poppins text-[0.72rem] font-bold text-primary">{s.n}</span>
                        <p className="mt-1 text-[0.92rem] font-bold text-foreground">{s.title}</p>
                        <p className="mt-0.5 text-[0.82rem] text-muted-foreground">{s.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <Link to="/spin-win"><Button variant="cta" size="lg" className="h-12 rounded-xl px-8"><Gift className="ml-2 h-4 w-4" />جرّب أدر واربح</Button></Link>
                    <Link to="/opening-day"><Button variant="outline-blue" size="lg" className="h-12 rounded-xl px-8">تفاصيل الافتتاح</Button></Link>
                  </div>
                </div>

                <div className="hidden border-r border-border/50 p-6 lg:flex lg:flex-col lg:items-center lg:justify-center" style={{ background: "hsl(var(--secondary) / 0.3)" }}>
                  <div className="rounded-xl border border-border bg-card p-6 text-center shadow-[var(--shadow-soft)]">
                    <p className="text-[0.82rem] font-bold text-muted-foreground">الافتتاح الكبير</p>
                    <p className="mt-2 text-2xl font-extrabold text-foreground">1 مايو 2026</p>
                    <div className="mt-4"><CountdownTimer compact /></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="band-primary" />

      {/* ════════════════ 8 · DIGITAL EXTENSION ════════════════ */}
      <section className="heritage-deep relative overflow-hidden py-16 md:py-20">
        <div className="relative container max-w-4xl">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="mx-auto max-w-[32rem] text-center">
              <p className="section-kicker dark-kicker">الامتداد الرقمي</p>
              <h2 className="section-title dark-heading">نفس المكان — بأدوات جديدة تخدمك أكثر.</h2>
              <p className="mx-auto mt-4 text-[1rem] leading-8 dark-body">
                المول الذي تعرفه أصبح متاحًا رقميًا. دليل المتاجر والخريطة التفاعلية يعملان الآن.
              </p>
            </div>

            <div className="mx-auto mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
              {[
                { n: "1", icon: Compass, label: "دليل المول", desc: "خريطة تفاعلية كاملة.", active: true },
                { n: "2", icon: ShoppingBag, label: "المتاجر والعروض", desc: "تصفّح واكتشف.", active: true },
                { n: "3", icon: Zap, label: "التسوّق عن بُعد", desc: "اشترِ أينما كنت.", active: false },
              ].map((item) => (
                <div key={item.n} className="heritage-surface rounded-xl p-5 text-center">
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: item.active ? "hsl(220 50% 42% / 0.12)" : "hsl(220 15% 25% / 0.3)", border: `1px solid ${item.active ? "hsl(220 50% 42% / 0.25)" : "hsl(220 15% 25% / 0.3)"}` }}>
                    <item.icon className="h-[1.15rem] w-[1.15rem]" style={{ color: item.active ? "hsl(220 55% 62%)" : "hsl(220 10% 48%)" }} />
                  </div>
                  <p className="text-[0.95rem] font-bold dark-heading">{item.label}</p>
                  <p className="mt-1 text-[0.84rem] dark-muted">{item.desc}</p>
                  {item.active && (
                    <span className="mt-3 inline-flex rounded-full px-2.5 py-0.5 text-[0.68rem] font-bold" style={{ background: "hsl(220 50% 42% / 0.12)", color: "hsl(220 55% 62%)", border: "1px solid hsl(220 50% 42% / 0.2)" }}>
                      متاح الآن
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link to="/stores">
                <Button size="lg" className="h-12 rounded-xl border px-8 text-[0.92rem] font-bold" style={{ borderColor: "hsl(0 0% 100% / 0.12)", background: "hsl(0 0% 100% / 0.07)", color: "hsl(38 14% 92%)" }}>
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
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="grid items-start gap-8 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="lg:sticky lg:top-28">
                <div className="chapter-shell pt-7">
                  <p className="section-kicker">أسئلة شائعة</p>
                  <h2 className="text-[1.85rem] font-bold leading-[1.06] text-foreground md:text-[2.5rem]">أسئلة متكررة</h2>
                </div>
                <p className="mt-3 text-[1rem] leading-8 text-muted-foreground">ما يحتاج الزائر والتاجر معرفته قبل الزيارة.</p>
                <Link to="/faq" className="mt-4 inline-flex">
                  <Button variant="ghost" className="px-0 text-primary hover:text-primary/80">جميع الأسئلة <ArrowLeft className="mr-1.5 h-4 w-4" /></Button>
                </Link>
              </div>

              <Accordion type="single" collapsible defaultValue={faqItems[0]?.id} className="space-y-2.5">
                {faqItems.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id} className="overflow-hidden rounded-xl border border-border bg-card px-5">
                    <AccordionTrigger className="min-h-[3.5rem] py-4 text-right text-[0.95rem] font-bold text-foreground hover:text-primary">
                      {faq.question_ar}
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 text-[0.9rem] leading-7 text-muted-foreground">
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
