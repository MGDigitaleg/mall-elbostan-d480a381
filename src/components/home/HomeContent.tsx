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
      {/* ════════════════ 1 · HERO ════════════════
          Split composition: text left (RTL right), image right.
          Dark midnight, but the image is big and authoritative.
      */}
      <section className="relative overflow-hidden" style={{ background: "hsl(222 30% 8%)" }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 45% at 72% 48%, hsl(222 50% 40% / 0.05), transparent 60%)" }} />

        <div className="relative mx-auto w-full max-w-[1400px] px-5 md:px-8 lg:px-14">
          <div className="grid min-h-[92vh] items-center gap-10 py-20 lg:grid-cols-2 lg:gap-16 lg:py-0">

            {/* text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="order-1 space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="h-[2px] w-8" style={{ background: "hsl(30 20% 52% / 0.5)" }} />
                <span className="font-poppins text-[0.72rem] font-semibold tracking-[0.18em] uppercase" style={{ color: "hsl(30 18% 62%)" }}>
                  وجهة راسخة في القاهرة الجديدة
                </span>
              </div>

              <h1 className="max-w-[28rem] text-[2.6rem] font-extrabold leading-[1.04] md:text-[3.6rem] lg:text-[4.2rem]" style={{ color: "hsl(38 14% 95%)" }}>
                المكان الذي يعرفه
                <br />
                <span style={{ color: "hsl(38 14% 95%)" }}>كل من دخل السوق</span>
              </h1>

              <p className="max-w-[28rem] text-[1rem] leading-[2] md:text-[1.08rem]" style={{ color: "hsl(220 10% 68%)" }}>
                مول البستان وجهة تجارية راسخة — أكثر من {totalUnits} وحدة
                متخصصة ومكانة بناها التجار والزوّار عبر السنوات.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link to="/map">
                  <Button variant="cta" size="lg" className="h-[3.1rem] min-w-[11.5rem] rounded-xl px-7 text-[0.92rem] font-bold shadow-[0_4px_20px_hsl(222_58%_42%/0.2)]">
                    <Compass className="ml-2 h-[1.05rem] w-[1.05rem]" />
                    استكشف الخريطة
                  </Button>
                </Link>
                <Link to="/stores">
                  <Button size="lg" className="h-[3.1rem] min-w-[9.5rem] rounded-xl border px-7 text-[0.92rem] font-semibold backdrop-blur-sm" style={{ borderColor: "hsl(0 0% 100% / 0.1)", background: "hsl(0 0% 100% / 0.06)", color: "hsl(38 14% 92%)" }}>
                    تصفّح المتاجر
                  </Button>
                </Link>
              </div>

              {/* stats */}
              <div className="flex items-center gap-5 pt-5" style={{ borderTop: "1px solid hsl(0 0% 100% / 0.08)" }}>
                {[
                  { v: `${totalUnits}+`, l: "وحدة تجارية" },
                  { v: `${floorMapData.length}`, l: "أدوار" },
                  { v: `${categoryStories.length}`, l: "أقسام" },
                ].map((s, i) => (
                  <div key={s.l} className="flex items-center gap-4">
                    <div>
                      <p className="font-poppins text-[1.5rem] font-bold" style={{ color: "hsl(38 14% 95%)" }}>{s.v}</p>
                      <p className="text-[0.7rem] font-medium" style={{ color: "hsl(220 10% 52%)" }}>{s.l}</p>
                    </div>
                    {i < 2 && <div className="h-7 w-px" style={{ background: "hsl(0 0% 100% / 0.08)" }} />}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* image — large, authoritative architectural shot */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.75, delay: 0.1 }}
              className="order-2 hidden lg:block"
            >
              <div className="relative mx-auto max-w-[500px]">
                <div className="overflow-hidden rounded-2xl" style={{ border: "1px solid hsl(0 0% 100% / 0.07)", boxShadow: "0 24px 64px hsl(222 30% 6% / 0.5)" }}>
                  <div className="aspect-[3/4]">
                    <img src={heroImage} alt="الواجهة الرئيسية لمول البستان" className="h-full w-full object-cover" loading="eager" style={{ filter: "contrast(1.08) saturate(0.82) brightness(0.88)" }} />
                  </div>
                  {/* bottom info bar — anchored inside the image */}
                  <div className="absolute inset-x-0 bottom-0 p-5" style={{ background: "linear-gradient(to top, hsl(222 30% 6% / 0.85), transparent)" }}>
                    <p className="font-poppins text-[0.68rem] font-semibold tracking-[0.15em] uppercase" style={{ color: "hsl(30 18% 62%)" }}>Mall Elbostan</p>
                    <p className="mt-0.5 text-[0.82rem]" style={{ color: "hsl(38 14% 80%)" }}>القاهرة الجديدة</p>
                  </div>
                </div>

                {/* detail crop — small interior shot */}
                <div className="absolute -bottom-4 -right-4 w-[32%]">
                  <div className="overflow-hidden rounded-xl" style={{ border: "1px solid hsl(0 0% 100% / 0.1)", boxShadow: "0 12px 32px hsl(222 30% 6% / 0.5)" }}>
                    <div className="aspect-square">
                      <img src={interiorImage} alt="الداخل" className="h-full w-full object-cover" loading="lazy" style={{ filter: "contrast(1.06) saturate(0.78) brightness(0.85)" }} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* countdown */}
      <section className="border-b border-border/50 bg-card py-4">
        <div className="container flex flex-col items-center gap-3 md:flex-row md:justify-between">
          <p className="text-[0.82rem] font-semibold text-foreground">الافتتاح الكبير — العد التنازلي</p>
          <CountdownTimer compact />
        </div>
      </section>

      {/* ════════════════ 2 · HERITAGE / LEGACY ════════════════
          Light section. Strong imagery on the left, text on the right.
          This section should feel like "we are an established destination."
      */}
      <section className="page-section overflow-hidden" style={{ background: "var(--gradient-ivory)" }}>
        <div className="container">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
              {/* text */}
              <div className="order-1 space-y-5">
                <div className="chapter-shell pt-6">
                  <p className="section-kicker">تاريخ ومكانة</p>
                  <h2 className="section-title max-w-[24rem]">اسم يعرفه السوق قبل أن تسأل عنه.</h2>
                </div>
                <p className="text-[1.02rem] leading-[2] text-foreground/75 md:text-[1.08rem]">
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
                      <c.icon className="mb-2 h-[1.1rem] w-[1.1rem] text-primary" />
                      <p className="text-[0.9rem] font-bold text-foreground">{c.title}</p>
                      <p className="mt-1 text-[0.82rem] leading-6 text-foreground/60">{c.desc}</p>
                    </div>
                  ))}
                </div>

                <Link to="/about">
                  <Button variant="ghost" className="mt-1 px-0 text-primary hover:text-primary/80">
                    تعرّف على قصة المول <ArrowLeft className="mr-1.5 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {/* imagery — large entrance + narrow facade */}
              <div className="order-2">
                <div className="grid gap-3 md:grid-cols-[1.3fr_0.55fr]">
                  <div className="editorial-frame overflow-hidden rounded-2xl">
                    <img src={entranceImage} alt="مدخل مول البستان" className="img-grade aspect-[4/3] h-full w-full object-cover object-[center_35%]" loading="lazy" />
                  </div>
                  <div className="editorial-frame hidden overflow-hidden rounded-2xl md:block">
                    <img src={facadeImage} alt="تفاصيل الواجهة المعمارية" className="img-grade aspect-[2/3] h-full w-full object-cover object-[center_40%]" loading="lazy" />
                  </div>
                </div>
                <div className="mt-3 h-[2px] w-16 rounded-full" style={{ background: "linear-gradient(90deg, hsl(30 20% 52% / 0.35), transparent)" }} />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="band-primary" />

      {/* ════════════════ 3 · VALUE PROPOSITION ════════════════
          Dark section. Three audience columns.
          Text must be clearly readable — not gray-on-dark.
      */}
      <section className="heritage-deep page-section relative overflow-hidden">
        <div className="relative container">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="mb-10 max-w-[32rem]">
              <p className="section-kicker" style={{ color: "hsl(220 50% 58%)" }}>لماذا مول البستان</p>
              <h2 className="section-title" style={{ color: "hsl(38 14% 93%)" }}>مكان يعرف جمهوره — وجمهوره يعرفه.</h2>
              <p className="mt-3 text-[0.98rem] leading-8" style={{ color: "hsl(220 10% 62%)" }}>
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
                    <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg" style={{ border: "1px solid hsl(220 50% 45% / 0.2)", background: "hsl(220 50% 45% / 0.08)" }}>
                      <card.icon className="h-4 w-4" style={{ color: "hsl(220 50% 58%)" }} />
                    </div>
                    <h3 className="text-[1.02rem] font-bold" style={{ color: "hsl(38 14% 92%)" }}>{card.title}</h3>
                    <ul className="mt-3 space-y-2.5">
                      {card.points.map((p) => (
                        <li key={p} className="flex items-start gap-2.5 text-[0.86rem] leading-7" style={{ color: "hsl(220 10% 62%)" }}>
                          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "hsl(220 50% 50% / 0.4)" }} />
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

      {/* ════════════════ 4 · CATEGORIES ════════════════
          Light. Higher-density cards with icon + text side by side.
      */}
      <section className="section-ivory page-section">
        <div className="container">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="mb-10 max-w-[32rem]">
              <p className="section-kicker">أقسام المول</p>
              <h2 className="section-title">كل قسم يمثل سوقًا قائمًا بذاته.</h2>
              <p className="mt-3 text-[0.98rem] leading-8 text-foreground/65">ستة أقسام متخصصة — كل قسم يضم متاجر ومنتجات يعرفها السوق.</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categoryStories.map((cat, i) => (
                <motion.div key={cat.key} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <Link to="/stores" className="block">
                    <div className="group flex h-full items-start gap-4 rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/20 hover:shadow-[var(--shadow-elevated)]">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary text-primary transition-colors group-hover:border-primary/20 group-hover:bg-primary/5">
                        <cat.icon className="h-[1.1rem] w-[1.1rem]" />
                      </div>
                      <div>
                        <div className="flex items-baseline justify-between gap-2">
                          <h3 className="text-[0.95rem] font-bold text-foreground">{cat.name}</h3>
                          <span className="font-poppins text-[0.72rem] font-medium text-foreground/25">0{i + 1}</span>
                        </div>
                        <p className="mt-1 text-[0.84rem] leading-6 text-foreground/60">{cat.brief}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {featuredStores.length > 0 && (
              <div className="mt-8 rounded-xl border border-border bg-card p-5 md:p-7">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-[0.95rem] font-bold text-foreground">متاجر مميزة</h3>
                  <Link to="/stores">
                    <Button variant="ghost" size="sm" className="text-[0.82rem] text-primary">
                      عرض الكل <ArrowLeft className="mr-1 h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
                <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                  {featuredStores.slice(0, 6).map((store) => (
                    <Link key={store.id} to={`/stores/${store.slug}`} className="flex items-center gap-3.5 rounded-lg border border-border/60 p-3.5 transition-all hover:border-primary/15 hover:shadow-sm">
                      {store.logo_url ? (
                        <img src={store.logo_url} alt={store.name_ar} className="h-9 w-9 rounded-lg border border-border object-contain" />
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary text-primary">
                          <Store className="h-3.5 w-3.5" />
                        </div>
                      )}
                      <div>
                        <p className="text-[0.88rem] font-bold text-foreground">{store.name_ar}</p>
                        {store.category && <p className="mt-0.5 text-[0.72rem] text-foreground/50">{store.category}</p>}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-center">
              <Link to="/stores">
                <Button variant="secondary" size="lg" className="h-11 rounded-xl px-8 font-semibold">تصفّح جميع المتاجر</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="band-primary" />

      {/* ════════════════ 5 · MAP PREVIEW ════════════════
          Warm sand background. The map is the hero of this section.
          Stronger framing and more space allocated to the map.
      */}
      <section className="section-sand page-section">
        <div className="container">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            {/* header — establishes context */}
            <div className="mb-10 grid items-end gap-6 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="section-kicker">دليل المول</p>
                <h2 className="section-title max-w-[28rem]">اعرف مكان كل متجر — قبل أن تصل.</h2>
                <p className="mt-3 text-[0.98rem] leading-8 text-foreground/65">
                  الدليل التفاعلي يعرض المول كما هو فعليًا — الأدوار والمتاجر والوحدات المتاحة.
                </p>
              </div>
              <div className="hidden lg:flex lg:gap-2.5">
                <Link to="/map"><Button variant="cta" size="lg" className="h-11 rounded-xl px-7 text-[0.88rem]">افتح الدليل الكامل</Button></Link>
                <Link to="/leasing"><Button variant="outline-blue" size="lg" className="h-11 rounded-xl px-7 text-[0.88rem]">استفسر عن وحدة</Button></Link>
              </div>
            </div>

            {/* map — full width, the star of the section */}
            <MapTeaserPreview />

            {/* mobile CTAs */}
            <div className="mt-6 grid gap-2.5 sm:grid-cols-2 lg:hidden">
              <Link to="/map"><Button variant="cta" size="lg" className="h-11 w-full rounded-xl text-[0.88rem]">افتح الدليل الكامل</Button></Link>
              <Link to="/leasing"><Button variant="outline-blue" size="lg" className="h-11 w-full rounded-xl text-[0.88rem]">استفسر عن وحدة</Button></Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════ 6 · LEASING ════════════════
          Light stone background. Business-grade.
      */}
      <section className="section-stone page-section">
        <div className="container">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
              <div className="space-y-5">
                <div className="chapter-shell border-primary/40 pt-6">
                  <p className="section-kicker">التأجير والاستثمار</p>
                  <h2 className="section-title max-w-[22rem]">وحدتك في مكان يقصده الناس فعلًا.</h2>
                </div>
                <p className="text-[0.98rem] leading-8 text-foreground/70 md:text-[1.04rem]">
                  مول البستان ليس موقعًا جديدًا يحتاج إثبات — إنه وجهة مثبتة بحركة
                  تجارية حقيقية. وحدات جاهزة بمساحات مختلفة واستفسار مباشر.
                </p>

                <div className="grid grid-cols-3 gap-2.5">
                  {availableByFloor.map((f) => (
                    <div key={f.id} className="rounded-xl border border-border bg-card px-3 py-3.5 text-center">
                      <p className="font-poppins text-xl font-bold text-foreground">{f.count}</p>
                      <p className="mt-0.5 text-[0.72rem] font-medium text-foreground/55">{f.label}</p>
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
                    <div key={p.label} className="flex items-center gap-2.5 rounded-lg border border-border/60 bg-card px-3.5 py-2.5">
                      <p.icon className="h-3.5 w-3.5 text-primary" />
                      <span className="text-[0.84rem] font-semibold text-foreground">{p.label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 pt-1">
                  <Link to="/leasing"><Button variant="orange" size="lg" className="h-11 rounded-xl px-7 font-bold">ابدأ استفسار التأجير</Button></Link>
                  <Link to="/map"><Button variant="outline-blue" size="lg" className="h-11 rounded-xl px-7">شاهد الوحدات</Button></Link>
                </div>
              </div>

              {/* unit cards */}
              <div className="space-y-2.5">
                {homepageLeasingUnits.slice(0, 3).map((unit) => (
                  <Link key={unit.unit_id} to="/map" className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-orange/25 hover:shadow-[var(--shadow-card)]">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[1.02rem] font-bold text-foreground">وحدة {unit.unit_id}</p>
                        <p className="mt-0.5 text-[0.84rem] text-foreground/60">{needCategoryLabels[unit.category]}</p>
                      </div>
                      <span className="rounded-full border border-orange/20 bg-orange/10 px-2.5 py-0.5 text-[0.72rem] font-semibold text-orange">متاحة</span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div className="rounded-lg bg-secondary px-3 py-2">
                        <p className="text-[0.7rem] text-foreground/50">الدور</p>
                        <p className="mt-0.5 text-[0.88rem] font-semibold text-foreground">{floorLabels[unit.floor_id]}</p>
                      </div>
                      <div className="rounded-lg bg-secondary px-3 py-2">
                        <p className="text-[0.7rem] text-foreground/50">المساحة</p>
                        <p className="mt-0.5 text-[0.88rem] font-semibold text-foreground">{unit.area_m2} م²</p>
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
                <div className="space-y-5 p-6 md:p-8">
                  <p className="section-kicker">حملة الافتتاح</p>
                  <h2 className="section-title max-w-[22rem]">افتتاح يُكافئ الحضور.</h2>
                  <p className="text-[0.98rem] leading-8 text-foreground/65 md:text-[1.04rem]">
                    مكافآت حقيقية من متاجر المول — مرتبطة بموقعها على الخريطة
                    وقابلة للاستلام يوم الافتتاح.
                  </p>

                  <div className="flex flex-wrap gap-6 border-t border-border/50 pt-5">
                    {[
                      { n: "01", title: "استكشف", desc: "ابدأ من دليل المول." },
                      { n: "02", title: "شارك", desc: "أدر العجلة واحفظ نتيجتك." },
                      { n: "03", title: "احضر", desc: "استلم مكافأتك يوم الافتتاح." },
                    ].map((s) => (
                      <div key={s.n} className="min-w-[7.5rem]">
                        <span className="font-poppins text-[0.72rem] font-bold text-primary">{s.n}</span>
                        <p className="mt-1 text-[0.9rem] font-bold text-foreground">{s.title}</p>
                        <p className="mt-0.5 text-[0.8rem] text-foreground/55">{s.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3 pt-1">
                    <Link to="/spin-win"><Button variant="cta" size="lg" className="h-11 rounded-xl px-7"><Gift className="ml-2 h-4 w-4" />جرّب أدر واربح</Button></Link>
                    <Link to="/opening-day"><Button variant="outline-blue" size="lg" className="h-11 rounded-xl px-7">تفاصيل الافتتاح</Button></Link>
                  </div>
                </div>

                <div className="hidden border-r border-border/50 p-6 lg:flex lg:flex-col lg:items-center lg:justify-center" style={{ background: "hsl(var(--secondary) / 0.3)" }}>
                  <div className="rounded-xl border border-border bg-card p-5 text-center shadow-[var(--shadow-soft)]">
                    <p className="text-[0.8rem] font-semibold text-foreground/60">الافتتاح الكبير</p>
                    <p className="mt-2 text-xl font-bold text-foreground">1 مايو 2026</p>
                    <div className="mt-4"><CountdownTimer compact /></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="band-primary" />

      {/* ════════════════ 8 · DIGITAL EXTENSION ════════════════
          Dark, but shorter. Not a "future vision" — a natural digital extension.
      */}
      <section className="heritage-deep relative overflow-hidden py-16 md:py-20">
        <div className="relative container max-w-4xl">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="mx-auto max-w-[32rem] text-center">
              <p className="section-kicker" style={{ color: "hsl(220 50% 58%)" }}>الامتداد الرقمي</p>
              <h2 className="section-title" style={{ color: "hsl(38 14% 93%)" }}>نفس المكان — بأدوات جديدة تخدمك أكثر.</h2>
              <p className="mx-auto mt-3 text-[0.98rem] leading-8" style={{ color: "hsl(220 10% 60%)" }}>
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
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: item.active ? "hsl(220 50% 45% / 0.1)" : "hsl(220 15% 25% / 0.3)", border: `1px solid ${item.active ? "hsl(220 50% 45% / 0.2)" : "hsl(220 15% 25% / 0.3)"}` }}>
                    <item.icon className="h-[1.1rem] w-[1.1rem]" style={{ color: item.active ? "hsl(220 50% 58%)" : "hsl(220 10% 48%)" }} />
                  </div>
                  <p className="text-[0.95rem] font-bold" style={{ color: "hsl(38 14% 92%)" }}>{item.label}</p>
                  <p className="mt-1 text-[0.84rem]" style={{ color: "hsl(220 10% 58%)" }}>{item.desc}</p>
                  {item.active && (
                    <span className="mt-3 inline-flex rounded-full px-2.5 py-0.5 text-[0.68rem] font-semibold" style={{ background: "hsl(220 50% 45% / 0.1)", color: "hsl(220 50% 58%)", border: "1px solid hsl(220 50% 45% / 0.15)" }}>
                      متاح الآن
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link to="/stores">
                <Button size="lg" className="h-11 rounded-xl border px-8 text-[0.9rem] font-semibold" style={{ borderColor: "hsl(0 0% 100% / 0.1)", background: "hsl(0 0% 100% / 0.06)", color: "hsl(38 14% 90%)" }}>
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
                <div className="chapter-shell pt-6">
                  <p className="section-kicker">أسئلة شائعة</p>
                  <h2 className="text-[1.75rem] font-bold leading-[1.08] text-foreground md:text-[2.4rem]">أسئلة متكررة</h2>
                </div>
                <p className="mt-3 text-[0.98rem] leading-8 text-foreground/65">ما يحتاج الزائر والتاجر معرفته قبل الزيارة.</p>
                <Link to="/faq" className="mt-4 inline-flex">
                  <Button variant="ghost" className="px-0 text-primary hover:text-primary/80">جميع الأسئلة <ArrowLeft className="mr-1.5 h-4 w-4" /></Button>
                </Link>
              </div>

              <Accordion type="single" collapsible defaultValue={faqItems[0]?.id} className="space-y-2">
                {faqItems.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id} className="overflow-hidden rounded-xl border border-border bg-card px-5">
                    <AccordionTrigger className="min-h-[3.5rem] py-3.5 text-right text-[0.95rem] font-semibold text-foreground hover:text-primary">
                      {faq.question_ar}
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 text-[0.9rem] leading-7 text-foreground/65">
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
