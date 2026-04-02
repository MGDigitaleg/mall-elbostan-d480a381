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
  Accessories: "ملحقات وإكسسوارات لجميع الأجهزة — من أغطية الهواتف لشواحن الأجهزة.",
  Laptops: "أجهزة من العلامات الرائدة عالميًا — للعمل والدراسة والإبداع.",
  Components: "قطع غيار ومكوّنات احترافية — لكل من يبني أو يُحدّث جهازه.",
  Networking: "بنية تحتية رقمية وحلول شبكات — للمنازل والشركات.",
  Maintenance: "صيانة معتمدة ودعم فني فوري — بمتخصصين يعرفهم السوق.",
  "Security Systems": "أنظمة مراقبة وحلول أمنية — من الكاميرا للنظام المتكامل.",
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
      {/* ════════════════════════════════════════════════════════════
          1 · HERO — full-screen immersive with editorial image
          ════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen overflow-hidden" style={{ background: "#071326" }}>
        {/* subtle radial warmth */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 55% 50% at 72% 48%, #2D6BFF08, transparent 70%)" }} />

        <div className="relative mx-auto w-full max-w-[1440px]">
          <div className="grid min-h-screen items-center lg:grid-cols-2">

            {/* ── text column ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="order-1 space-y-8 px-6 py-20 md:px-12 lg:py-0 lg:pr-16 xl:pr-20"
            >
              {/* heritage kicker */}
              <div className="flex items-center gap-3">
                <div className="h-[3px] w-12 rounded-full" style={{ background: "#CDBB9A" }} />
                <span className="font-poppins text-[0.7rem] font-bold tracking-[0.22em] uppercase dark-accent">
                  وجهة تقنية راسخة في القاهرة الجديدة
                </span>
              </div>

              <h1 className="max-w-[24rem] text-[2.6rem] leading-[1.04] md:text-[3.6rem] lg:text-[4.2rem] dark-heading">
                المكان الذي بناه
                <br />
                <span style={{ color: "#CDBB9A" }}>تكرار الثقة.</span>
              </h1>

              <p className="max-w-[30rem] text-[1.02rem] leading-[2] md:text-[1.08rem] dark-body">
                مول البستان لم يصنع اسمه من حملة إعلانية — بل من آلاف الزيارات التي
                انتهت بقرار شراء حقيقي. من يعرف سوق الإلكترونيات في القاهرة الجديدة
                يعرف هذا المكان. اليوم يتوسّع رقميًا — بنفس المصداقية التي بدأ بها.
              </p>

              {/* CTA pair */}
              <div className="flex flex-wrap gap-3">
                <Link to="/map">
                  <Button variant="cta" size="lg" className="h-[3.4rem] min-w-[13rem] rounded-xl px-8 text-[0.95rem] font-bold shadow-[var(--shadow-blue)]">
                    <Compass className="ml-2 h-[1.15rem] w-[1.15rem]" />
                    استكشف دليل المول
                  </Button>
                </Link>
                <Link to="/stores">
                  <Button size="lg" className="h-[3.4rem] min-w-[10rem] rounded-xl border px-8 text-[0.95rem] font-semibold" style={{ borderColor: "#ffffff1F", background: "#ffffff0A", color: "#E2E8F0" }}>
                    تصفّح المتاجر
                  </Button>
                </Link>
              </div>

              {/* stats — anchored authority strip */}
              <div className="flex items-center gap-8 pt-7" style={{ borderTop: "1px solid #ffffff14" }}>
                {[
                  { v: `${totalUnits}+`, l: "وحدة تجارية" },
                  { v: `${floorMapData.length}`, l: "أدوار تجارية" },
                  { v: `${categoryStories.length}`, l: "أقسام متخصصة" },
                ].map((s, i) => (
                  <div key={s.l} className="flex items-center gap-7">
                    <div>
                      <p className="font-poppins text-[1.7rem] font-extrabold dark-heading">{s.v}</p>
                      <p className="text-[0.72rem] font-semibold dark-muted">{s.l}</p>
                    </div>
                    {i < 2 && <div className="h-9 w-px" style={{ background: "#ffffff14" }} />}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ── image column — editorial architectural composition ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="relative order-2 hidden h-screen lg:block"
            >
              {/* full-bleed hero — exterior, cropped for geometry */}
              <img
                src={heroImage}
                alt="الواجهة الرئيسية لمول البستان — القاهرة الجديدة"
                className="h-full w-full object-cover object-[center_30%] img-grade-dark"
                loading="eager"
              />
              {/* editorial gradient overlay */}
              <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #071326 0%, #07132680 25%, transparent 55%)" }} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #071326CC 0%, transparent 35%)" }} />

              {/* bottom info bar — anchored to image */}
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-8">
                <div>
                  <p className="font-poppins text-[0.65rem] font-bold tracking-[0.2em] uppercase dark-accent">Mall Elbostan</p>
                  <p className="mt-1 text-[0.95rem] font-bold dark-heading">القاهرة الجديدة — مصر</p>
                </div>
                <div className="rounded-lg px-3.5 py-2" style={{ background: "#ffffff0D", border: "1px solid #ffffff14" }}>
                  <p className="text-[0.72rem] font-bold dark-subheading">وجهة تقنية منذ 2010+</p>
                </div>
              </div>

              {/* architectural detail inset — interior, square symmetry crop */}
              <div className="absolute bottom-14 left-8 w-[26%]">
                <div className="frame-heritage overflow-hidden" style={{ boxShadow: "0 20px 50px #07132680" }}>
                  <img src={interiorImage} alt="التفاصيل الداخلية" className="aspect-[1/1] w-full object-cover object-[center_45%] img-grade-dark" loading="lazy" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── countdown strip ── */}
      <section className="border-b border-border bg-card py-4">
        <div className="container flex flex-col items-center gap-3 md:flex-row md:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <p className="text-[0.88rem] font-bold text-foreground">الافتتاح الكبير — 1 مايو 2026</p>
          </div>
          <CountdownTimer compact />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          2 · HERITAGE & IDENTITY — why this place matters
          ════════════════════════════════════════════════════════════ */}
      <section className="page-section overflow-hidden" style={{ background: "#FAFAF8" }}>
        <div className="container">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">

              {/* text */}
              <div className="order-1 space-y-7">
                <div className="chapter-shell pt-7">
                  <p className="section-kicker">مكانة وتاريخ</p>
                  <h2 className="section-title max-w-[22rem]">اسم يسبق التعريف في سوق التقنية.</h2>
                </div>

                <p className="text-[1.04rem] leading-[2.1] light-body md:text-[1.08rem]">
                  في سوق تتنافس فيه عشرات الوجهات، مول البستان يملك ما لا يُشترى:
                  سمعة بنتها سنوات من التعامل المباشر. الزائر لا يأتي لأنه رأى إعلانًا —
                  يأتي لأنه يعرف أن ما يبحث عنه سيجده هنا، بالسعر والجودة التي يتوقعها.
                </p>

                {/* trust signals */}
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { icon: Award, title: "إرث سوقي", desc: "حضور تجاري يمتد لأكثر من عقد كامل." },
                    { icon: MapPin, title: "وجهة مقصودة", desc: "يخدم القاهرة الجديدة ومدينتي والرحاب." },
                    { icon: Layers, title: "هيكل تجاري دقيق", desc: "تصنيف واضح يختصر مسار الشراء." },
                  ].map((c) => (
                    <div key={c.title} className="card-architectural rounded-xl p-5">
                      <c.icon className="mb-3 h-5 w-5 text-primary" />
                      <p className="text-[0.95rem] font-bold light-heading">{c.title}</p>
                      <p className="mt-1.5 text-[0.86rem] leading-7 light-body">{c.desc}</p>
                    </div>
                  ))}
                </div>

                <Link to="/about">
                  <Button variant="ghost" className="mt-2 gap-1.5 px-0 text-[0.92rem] font-bold text-primary hover:text-primary/80">
                    تعرّف على القصة الكاملة <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {/* editorial diptych — facade main + entrance detail */}
              <div className="order-2">
                <div className="grid grid-cols-[1.3fr_0.7fr] gap-2.5">
                  {/* main — facade, architectural geometry crop */}
                  <div className="frame-geometric overflow-hidden">
                    <img src={facadeImage} alt="الواجهة المعمارية لمول البستان" className="img-grade-arch aspect-[3/4] w-full object-cover object-[center_35%]" loading="lazy" />
                  </div>
                  {/* detail — entrance, vertical symmetry */}
                  <div className="flex flex-col gap-2.5">
                    <div className="frame-diptych flex-1 overflow-hidden">
                      <img src={entranceImage} alt="مدخل مول البستان" className="img-grade-warm h-full w-full object-cover object-[50%_30%]" loading="lazy" />
                    </div>
                    {/* heritage accent strip */}
                    <div className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2.5">
                      <div className="h-[3px] w-5 rounded-full" style={{ background: "#CDBB9A" }} />
                      <span className="text-[0.7rem] font-bold light-muted">بنية معمارية مميزة</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          3 · VALUE PROPOSITION — who benefits and why
          ════════════════════════════════════════════════════════════ */}
      <section className="heritage-deep page-section relative overflow-hidden">
        <div className="relative container">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="mb-14 max-w-[36rem]">
              <p className="section-kicker dark-kicker">القيمة الحقيقية</p>
              <h2 className="section-title dark-heading">ليس مجرد موقع — وجهة يقصدها جمهور بنيّة شراء واضحة.</h2>
              <p className="mt-5 text-[1.04rem] leading-[2] dark-body">
                ما يميّز المول ليس مساحته بل طبيعة زوّاره: مشترٍ يعرف ما يريد،
                وتاجر يثق في الموقع لأن حركته مبنية على طلب حقيقي لا موسمي.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {[
                {
                  icon: Users, title: "للمشتري والزائر",
                  lead: "مسار أقصر للمنتج الصحيح بالسعر المناسب.",
                  points: [
                    "تصنيف تجاري دقيق يوصلك لما تبحث عنه مباشرة.",
                    "خريطة تفاعلية تكشف كل وحدة بحالتها الفعلية قبل الزيارة.",
                    "مكافآت حقيقية مرتبطة بمتاجر فعلية داخل المول.",
                  ],
                },
                {
                  icon: Store, title: "للتاجر وصاحب العلامة",
                  lead: "حضور تجاري في موقع يصل إليه الجمهور المستهدف فعلًا.",
                  points: [
                    "ظهور مباشر في الدليل التفاعلي والخريطة التجارية.",
                    "جمهور متخصص يدخل المول بقرار شراء محدد.",
                    "بيئة منظّمة ترفع من قيمة كل وحدة تجارية.",
                  ],
                },
                {
                  icon: TrendingUp, title: "للمستثمر والمستأجر",
                  lead: "وحدة في مكان أثبت حركته التجارية عمليًا.",
                  points: [
                    "وحدات متنوعة بمساحات وتصنيفات وأسعار شفّافة.",
                    "موقع في منطقة طلب حقيقي ومتنامٍ سنويًا.",
                    "استفسار مباشر من الخريطة لفريق التأجير.",
                  ],
                },
              ].map((card, i) => (
                <motion.div key={card.title} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <div className="heritage-surface flex h-full flex-col p-7">
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl" style={{ border: "1px solid #2D6BFF30", background: "#2D6BFF14" }}>
                      <card.icon className="h-5 w-5 dark-kicker" />
                    </div>
                    <h3 className="text-[1.08rem] font-bold dark-heading">{card.title}</h3>
                    <p className="mt-2 text-[0.88rem] font-semibold dark-subheading">{card.lead}</p>
                    <ul className="mt-4 space-y-3 flex-1">
                      {card.points.map((p) => (
                        <li key={p} className="flex items-start gap-2.5 text-[0.88rem] leading-7 dark-body">
                          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "#5B9AFF60" }} />
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

      {/* ════════════════════════════════════════════════════════════
          4 · CATEGORIES — what you'll find here
          ════════════════════════════════════════════════════════════ */}
      <section className="page-section" style={{ background: "#F5F2EC" }}>
        <div className="container">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="mb-12 max-w-[34rem]">
              <p className="section-kicker">التصنيف التجاري</p>
              <h2 className="section-title">ستة أسواق متخصصة تحت سقف واحد.</h2>
              <p className="mt-4 text-[1rem] leading-8 light-body">
                كل قسم يمثّل تخصصًا تقنيًا مستقلًا — بمتاجره وجمهوره
                وحركته الخاصة. اختر ما يناسبك وابدأ الاستكشاف.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categoryStories.map((cat, i) => (
                <motion.div key={cat.key} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <Link to="/stores" className="block">
                    <div className="group flex h-full items-start gap-4 rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:border-primary/20 hover:shadow-[var(--shadow-elevated)]">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary text-primary transition-colors group-hover:border-primary/20 group-hover:bg-primary/5">
                        <cat.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <h3 className="text-[0.98rem] font-bold light-heading">{cat.name}</h3>
                          <span className="font-poppins text-[0.68rem] font-bold light-meta">0{i + 1}</span>
                        </div>
                        <p className="mt-1.5 text-[0.86rem] leading-7 light-body">{cat.brief}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {featuredStores.length > 0 && (
              <div className="mt-12 rounded-2xl border border-border bg-card p-6 md:p-8">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-[1.05rem] font-bold light-heading">علامات رائدة داخل المول</h3>
                  <Link to="/stores">
                    <Button variant="ghost" size="sm" className="gap-1 text-[0.84rem] font-bold text-primary">
                      عرض الكل <ArrowLeft className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {featuredStores.slice(0, 6).map((store) => (
                    <Link key={store.id} to={`/stores/${store.slug}`} className="flex items-center gap-3.5 rounded-xl border border-border p-4 transition-all hover:border-primary/15 hover:shadow-sm">
                      {store.logo_url ? (
                        <img src={store.logo_url} alt={store.name_ar} className="h-11 w-11 rounded-lg border border-border object-contain" />
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-secondary text-primary">
                          <Store className="h-4.5 w-4.5" />
                        </div>
                      )}
                      <div>
                        <p className="text-[0.92rem] font-bold light-heading">{store.name_ar}</p>
                        {store.category && <p className="mt-0.5 text-[0.74rem] light-muted">{store.category}</p>}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-10 flex justify-center">
              <Link to="/stores">
                <Button variant="secondary" size="lg" className="h-12 rounded-xl px-8 text-[0.92rem] font-bold">تصفّح جميع المتاجر</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="band-primary" />

      {/* ════════════════════════════════════════════════════════════
          5 · MAP PREVIEW — the operational core
          ════════════════════════════════════════════════════════════ */}
      <section className="page-section" style={{ background: "#FAFAF8" }}>
        <div className="container">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="mb-10 grid items-end gap-6 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="section-kicker">الخريطة التجارية</p>
                <h2 className="section-title max-w-[28rem]">استكشف المول بالكامل — قبل أن تصل.</h2>
                <p className="mt-4 text-[1rem] leading-8 light-body">
                  الدليل التفاعلي يعرض كل دور بوحداته وحالاتها الفعلية.
                  تعرف ما هو متاح وما هو مشغول وما هو قادم — برابط مباشر للتأجير أو تفاصيل المتجر.
                </p>
              </div>
              <div className="hidden lg:flex lg:gap-2.5">
                <Link to="/map"><Button variant="cta" size="lg" className="h-12 rounded-xl px-8 text-[0.92rem] font-bold">افتح الدليل الكامل</Button></Link>
                <Link to="/leasing"><Button variant="outline-blue" size="lg" className="h-12 rounded-xl px-8 text-[0.92rem]">استفسر عن وحدة</Button></Link>
              </div>
            </div>

            <MapTeaserPreview />

            <div className="mt-6 grid gap-2.5 sm:grid-cols-2 lg:hidden">
              <Link to="/map"><Button variant="cta" size="lg" className="h-12 w-full rounded-xl text-[0.92rem]">افتح الدليل الكامل</Button></Link>
              <Link to="/leasing"><Button variant="outline-blue" size="lg" className="h-12 w-full rounded-xl text-[0.92rem]">استفسر عن وحدة</Button></Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          6 · LEASING — commercial opportunity
          ════════════════════════════════════════════════════════════ */}
      <section className="page-section" style={{ background: "#F5F2EC" }}>
        <div className="container">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="grid items-start gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
              <div className="space-y-7">
                <div className="chapter-shell pt-7">
                  <p className="section-kicker">فرص التأجير والاستثمار</p>
                  <h2 className="section-title max-w-[24rem]">وحدتك في مكان مثبت تجاريًا — مش تجربة جديدة.</h2>
                </div>
                <p className="text-[1.02rem] leading-[2.1] light-body md:text-[1.06rem]">
                  مول البستان مش موقع جديد بيحتاج إثبات — ده مكان الناس بتيجيله بالفعل.
                  وحدات بمساحات مختلفة، في موقع الطلب عليه حقيقي، واستفسار مباشر
                  من الخريطة لفريق التأجير.
                </p>

                {/* floor availability */}
                <div className="grid grid-cols-3 gap-3">
                  {availableByFloor.map((f) => (
                    <div key={f.id} className="rounded-xl border border-border bg-card px-4 py-5 text-center">
                      <p className="font-poppins text-[1.8rem] font-extrabold light-heading">{f.count}</p>
                      <p className="mt-1 text-[0.76rem] font-semibold light-muted">{f.label}</p>
                    </div>
                  ))}
                </div>

                {/* trust chips */}
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { icon: MapPin, label: "موقع استراتيجي" },
                    { icon: Users, label: "جمهور متخصص" },
                    { icon: TrendingUp, label: "طلب متنامٍ" },
                    { icon: Layers, label: "أقسام منظّمة" },
                  ].map((p) => (
                    <div key={p.label} className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-4 py-3.5">
                      <p.icon className="h-4 w-4 text-primary" />
                      <span className="text-[0.88rem] font-bold light-heading">{p.label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 pt-3">
                  <Link to="/leasing"><Button variant="orange" size="lg" className="h-12 rounded-xl px-8 font-bold">ابدأ استفسار التأجير</Button></Link>
                  <Link to="/map"><Button variant="outline-blue" size="lg" className="h-12 rounded-xl px-8">شاهد الوحدات على الخريطة</Button></Link>
                </div>
              </div>

              {/* unit cards */}
              <div className="space-y-3.5">
                {homepageLeasingUnits.slice(0, 3).map((unit) => (
                  <Link key={unit.unit_id} to="/map" className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-orange/25 hover:shadow-[var(--shadow-card)]">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[1.05rem] font-bold light-heading">وحدة {unit.unit_id}</p>
                        <p className="mt-0.5 text-[0.86rem] light-muted">{needCategoryLabels[unit.category]}</p>
                      </div>
                      <span className="rounded-full border border-orange/25 bg-orange/8 px-3 py-1 text-[0.72rem] font-bold text-orange">متاحة</span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2.5">
                      <div className="rounded-lg bg-secondary px-3.5 py-3">
                        <p className="text-[0.72rem] light-muted">الدور</p>
                        <p className="mt-0.5 text-[0.92rem] font-bold light-heading">{floorLabels[unit.floor_id]}</p>
                      </div>
                      <div className="rounded-lg bg-secondary px-3.5 py-3">
                        <p className="text-[0.72rem] light-muted">المساحة</p>
                        <p className="mt-0.5 text-[0.92rem] font-bold light-heading">{unit.area_m2} م²</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          7 · OPENING / ENGAGEMENT — spin & win
          ════════════════════════════════════════════════════════════ */}
      <section className="page-section" style={{ background: "#FAFAF8" }}>
        <div className="container">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-elevated)]">
              <div className="grid lg:grid-cols-[1.4fr_0.6fr]">
                <div className="space-y-6 p-7 md:p-10">
                  <p className="section-kicker">حملة الافتتاح الكبير</p>
                  <h2 className="section-title max-w-[24rem]">افتتاح يكافئ الحضور — مش مجرد عروض.</h2>
                  <p className="text-[1rem] leading-8 light-body md:text-[1.04rem]">
                    مكافآت حقيقية من متاجر المول — كل مكافأة مرتبطة بمتجر حقيقي
                    وموقعه ظاهر على الخريطة. شارك قبل الافتتاح واستلم يوم الزيارة.
                  </p>

                  <div className="flex flex-wrap gap-8 border-t border-border pt-7">
                    {[
                      { n: "01", title: "استكشف", desc: "ابدأ من دليل المول وتعرّف على المتاجر." },
                      { n: "02", title: "شارك", desc: "أدر العجلة واحفظ نتيجتك." },
                      { n: "03", title: "احضر", desc: "استلم مكافأتك يوم الافتتاح." },
                    ].map((s) => (
                      <div key={s.n} className="min-w-[8rem]">
                        <span className="font-poppins text-[0.74rem] font-bold text-primary">{s.n}</span>
                        <p className="mt-1.5 text-[0.95rem] font-bold light-heading">{s.title}</p>
                        <p className="mt-1 text-[0.84rem] leading-6 light-body">{s.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3 pt-3">
                    <Link to="/spin-win"><Button variant="cta" size="lg" className="h-12 rounded-xl px-8 font-bold"><Gift className="ml-2 h-4 w-4" />جرّب أدر واربح</Button></Link>
                    <Link to="/opening-day"><Button variant="outline-blue" size="lg" className="h-12 rounded-xl px-8">تفاصيل يوم الافتتاح</Button></Link>
                  </div>
                </div>

                <div className="hidden border-r border-border p-8 lg:flex lg:flex-col lg:items-center lg:justify-center" style={{ background: "#F5F2EC" }}>
                  <div className="rounded-xl border border-border bg-card p-7 text-center shadow-[var(--shadow-soft)]">
                    <p className="text-[0.84rem] font-bold light-muted">الافتتاح الكبير</p>
                    <p className="mt-2 text-[1.7rem] font-extrabold light-heading">1 مايو 2026</p>
                    <div className="mt-5"><CountdownTimer compact /></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="band-primary" />

      {/* ════════════════════════════════════════════════════════════
          8 · DIGITAL EXTENSION — the future layer
          ════════════════════════════════════════════════════════════ */}
      <section className="heritage-deep relative overflow-hidden py-16 md:py-24">
        <div className="relative container max-w-4xl">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="mx-auto max-w-[34rem] text-center">
              <p className="section-kicker dark-kicker">الامتداد الرقمي</p>
              <h2 className="section-title dark-heading">نفس المكان اللي تعرفه — بأدوات رقمية تخدمك أكثر.</h2>
              <p className="mx-auto mt-5 text-[1.02rem] leading-8 dark-body">
                المول اللي تعرفه أصبح متاح رقميًا. دليل المتاجر والخريطة التفاعلية
                يعملان الآن — والمرحلة الجاية هتوصّلك بالمنتجات مباشرة.
              </p>
            </div>

            <div className="mx-auto mt-12 grid max-w-2xl gap-4 sm:grid-cols-3">
              {[
                { n: "01", icon: Compass, label: "الدليل التفاعلي", desc: "خريطة كاملة لكل دور ووحدة.", active: true },
                { n: "02", icon: ShoppingBag, label: "دليل المتاجر", desc: "تصفّح المتاجر وتفاصيلها.", active: true },
                { n: "03", icon: Zap, label: "السوق الرقمي", desc: "تسوّق إلكتروني — قريبًا.", active: false },
              ].map((item) => (
                <div key={item.n} className="heritage-surface rounded-xl p-6 text-center">
                  <span className="font-poppins text-[0.7rem] font-bold dark-kicker">{item.n}</span>
                  <div className="mx-auto mt-3 mb-3 flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: item.active ? "#2D6BFF14" : "#ffffff08", border: `1px solid ${item.active ? "#2D6BFF30" : "#ffffff10"}` }}>
                    <item.icon className="h-5 w-5" style={{ color: item.active ? "#5B9AFF" : "#7C8BA1" }} />
                  </div>
                  <p className="text-[0.98rem] font-bold dark-heading">{item.label}</p>
                  <p className="mt-1.5 text-[0.86rem] leading-6 dark-muted">{item.desc}</p>
                  {item.active && (
                    <span className="mt-4 inline-flex rounded-full px-3 py-1 text-[0.7rem] font-bold" style={{ background: "#2D6BFF14", color: "#5B9AFF", border: "1px solid #2D6BFF25" }}>
                      متاح الآن
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link to="/stores">
                <Button size="lg" className="h-12 rounded-xl border px-8 text-[0.95rem] font-bold" style={{ borderColor: "#ffffff1A", background: "#ffffff0A", color: "#E2E8F0" }}>
                  استعرض المتاجر الحالية
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          9 · FAQ
          ════════════════════════════════════════════════════════════ */}
      <section className="page-section" style={{ background: "#F5F2EC" }}>
        <div className="container max-w-5xl">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="lg:sticky lg:top-28">
                <div className="chapter-shell pt-7">
                  <p className="section-kicker">أسئلة شائعة</p>
                  <h2 className="text-[1.85rem] font-bold leading-[1.06] light-heading md:text-[2.5rem]">أسئلة متكررة</h2>
                </div>
                <p className="mt-4 text-[1rem] leading-8 light-body">ما يحتاج الزائر والتاجر يعرفه قبل الزيارة.</p>
                <Link to="/faq" className="mt-5 inline-flex">
                  <Button variant="ghost" className="gap-1.5 px-0 font-bold text-primary hover:text-primary/80">جميع الأسئلة <ArrowLeft className="h-4 w-4" /></Button>
                </Link>
              </div>

              <Accordion type="single" collapsible defaultValue={faqItems[0]?.id} className="space-y-2.5">
                {faqItems.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id} className="overflow-hidden rounded-xl border border-border bg-card px-6">
                    <AccordionTrigger className="min-h-[3.5rem] py-4 text-right text-[0.95rem] font-bold light-heading hover:text-primary">
                      {faq.question_ar}
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 text-[0.9rem] leading-7 light-body">
                      {faq.answer_ar}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          FINAL CTA STRIP
          ════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-20" style={{ background: "#071326" }}>
        <div className="container max-w-[900px] text-center">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-[3px] w-8 rounded-full" style={{ background: "#CDBB9A" }} />
              <span className="font-poppins text-[0.68rem] font-bold tracking-[0.22em] uppercase dark-accent">ابدأ من هنا</span>
              <div className="h-[3px] w-8 rounded-full" style={{ background: "#CDBB9A" }} />
            </div>
            <h2 className="mx-auto max-w-[28rem] text-[1.4rem] font-bold leading-[1.2] md:text-[1.8rem] dark-heading">
              المول جاهز — دورك تستكشفه.
            </h2>
            <p className="mx-auto mt-4 max-w-sm text-[0.95rem] leading-7 dark-body">
              سواء بتدوّر على منتج، عايز تأجّر وحدة، أو حابب تعرف إيه في المول — ابدأ من هنا.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/map">
                <Button variant="cta" size="lg" className="h-[3.2rem] rounded-xl px-8 text-[0.95rem] font-bold shadow-[var(--shadow-blue)]">
                  <Compass className="ml-2 h-4.5 w-4.5" /> استكشف الخريطة
                </Button>
              </Link>
              <Link to="/stores">
                <Button size="lg" className="h-[3.2rem] rounded-xl border px-8 text-[0.95rem] font-bold" style={{ borderColor: "#ffffff1A", background: "#ffffff0A", color: "#E2E8F0" }}>
                  تصفّح المتاجر
                </Button>
              </Link>
              <Link to="/leasing">
                <Button variant="orange" size="lg" className="h-[3.2rem] rounded-xl px-8 text-[0.95rem] font-bold">
                  <Phone className="ml-2 h-4 w-4" /> استفسر عن التأجير
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
