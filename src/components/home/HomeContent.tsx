import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Building2, HelpCircle, Layers, MapPin, Monitor, Shield, Smartphone, Store, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "@/components/CountdownTimer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MapTeaserPreview } from "@/components/home/MapTeaserPreview";
import { allMapUnits, availableMapUnits, exploreNeeds, floorMapData, homepageLeasingUnits, needCategoryDescriptions, needCategoryLabels, type NeedCategory } from "@/lib/floorMapData";
import heroImage from "@/assets/mall-exterior.jpg";
import interiorImage from "@/assets/mall-interior.jpg";
import facadeImage from "@/assets/mall-facade.jpg";

const categoryMeta: Record<NeedCategory, { icon: typeof Smartphone }> = {
  Accessories: { icon: Smartphone },
  Laptops: { icon: Monitor },
  Components: { icon: Monitor },
  Networking: { icon: Monitor },
  Maintenance: { icon: Wrench },
  "Security Systems": { icon: Shield },
};

const categorySupportLabels: Record<NeedCategory, string> = {
  Accessories: "احتياج يومي سريع",
  Laptops: "دراسة وعمل",
  Components: "أداء وتجميع",
  Networking: "حلول مكتبية",
  Maintenance: "خدمة مباشرة",
  "Security Systems": "مراقبة وحماية",
};

const mobileCategorySummaries: Record<NeedCategory, string> = {
  Accessories: "ملحقات سريعة وواضحة.",
  Laptops: "أجهزة للدراسة والعمل.",
  Components: "مكوّنات وتجميعات أداء.",
  Networking: "حلول شبكات للمكاتب.",
  Maintenance: "صيانة مباشرة وسريعة.",
  "Security Systems": "مراقبة وحماية واضحة.",
};

const fallbackFaqs = [
  { id: "faq-1", question_ar: "أين يقع مول البستان؟", answer_ar: "المشروع يخدم القاهرة الجديدة ومحيطها، ويمكنك متابعة صفحة التواصل للحصول على تفاصيل الوصول فور اعتمادها." },
  { id: "faq-2", question_ar: "متى الافتتاح؟", answer_ar: "الافتتاح المستهدف في 1 مايو 2026، مع تحديثات مستمرة على صفحة الافتتاح والحملة." },
  { id: "faq-3", question_ar: "هل توجد وحدات متاحة للتأجير؟", answer_ar: "نعم، ويمكنك مراجعة الخريطة التفاعلية وصفحة التأجير لمعرفة الوحدات المتاحة حاليًا." },
  { id: "faq-4", question_ar: "كيف أبحث عن متجر داخل المول؟", answer_ar: "من خلال الخريطة التفاعلية وصفحة المتاجر، مع إمكانية التصفية حسب الفئة والدور." },
  { id: "faq-5", question_ar: "هل يمكن متابعة المتاجر لاحقًا رقميًا؟", answer_ar: "هذا جزء من المرحلة التالية للمشروع، وسيتم تقديمه كامتداد رقمي مرتبط بالمتاجر المشاركة." },
  { id: "faq-6", question_ar: "كيف أتواصل للاستفسار التجاري؟", answer_ar: "يمكنك إرسال طلبك مباشرة من صفحة التأجير أو صفحة التواصل وسيتم متابعته من الفريق المختص." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (index: number) => ({
    opacity: 1, y: 0,
    transition: { delay: index * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

type HomeContentProps = {
  faqs: Array<{ id: string; question_ar: string; answer_ar: string }>;
  featuredStores: Array<{ id: string; name_ar: string; category: string | null; slug: string; logo_url: string | null; short_description_ar: string | null }>;
  upcomingEvents: Array<{ id: string; title_ar: string; description_ar: string | null; image_url: string | null; event_date: string | null }>;
};

export function HomeContent({ faqs, featuredStores, upcomingEvents }: HomeContentProps) {
  const totalUnits = allMapUnits.length;
  const availableUnits = availableMapUnits;
  const floorLabels = Object.fromEntries(floorMapData.map((floor) => [floor.id, floor.label]));
  const categoryStories = exploreNeeds.map((need) => ({
    key: need,
    name: needCategoryLabels[need],
    icon: categoryMeta[need].icon,
    desc: needCategoryDescriptions[need],
    supportLabel: categorySupportLabels[need],
  }));
  const faqItems = (faqs.length >= 6 ? faqs : fallbackFaqs).slice(0, 6);
  const launchEvent = upcomingEvents[0] ?? null;
  const availableByFloor = floorMapData.map((floor) => ({
    id: floor.id,
    label: floor.label,
    count: floor.units.filter((unit) => unit.status === "available").length,
  }));

  return (
    <>
      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section className="heritage-section relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        {/* Subtle architectural pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(0 0% 100%) 1px, transparent 0)', backgroundSize: '48px 48px' }} />

        <div className="relative mx-auto w-full max-w-7xl px-5 md:px-8 lg:px-12">
          <div className="grid min-h-[85vh] items-center gap-8 py-16 md:py-20 lg:grid-cols-2 lg:gap-12 lg:py-0">
            {/* Text — right side RTL */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="order-1 space-y-6 text-right lg:space-y-8">
              <div className="space-y-5">
                <div className="eyebrow-chip border-primary/30 bg-primary/10 text-[0.78rem] text-primary-foreground/80">
                  القاهرة الجديدة • افتتاح مايو 2026
                </div>
                <h1 className="text-[2.2rem] font-extrabold leading-[1.08] text-white md:text-[3.2rem] lg:text-[3.8rem]">
                  وجهة مصر الأولى
                  <br />
                  <span className="text-gradient-blue">للتكنولوجيا والإلكترونيات</span>
                </h1>
                <p className="max-w-[28rem] text-[1.05rem] leading-[1.85] text-white/65 md:text-lg lg:text-[1.15rem]">
                  مول البستان — تاريخ من الثقة في عالم التقنية، وتجربة تسوّق منظّمة تجمع أكثر من {totalUnits} متجرًا متخصصًا تحت سقف واحد.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link to="/map">
                  <Button variant="cta" size="lg" className="h-12 min-w-[12rem] rounded-xl px-7 text-[0.95rem]">
                    استكشف الخريطة
                    <ArrowLeft className="mr-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/leasing">
                  <Button size="lg" className="h-12 min-w-[12rem] rounded-xl border border-white/20 bg-white/10 px-7 text-[0.95rem] text-white backdrop-blur-sm hover:bg-white/15">
                    استفسر عن وحدة
                  </Button>
                </Link>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                {[
                  { value: `${floorMapData.length}`, label: "أدوار" },
                  { value: `${availableUnits.length}+`, label: "وحدة متاحة" },
                  { value: `${categoryStories.length}`, label: "فئات متخصصة" },
                ].map((stat) => (
                  <div key={stat.label} className="heritage-card px-4 py-4 text-center">
                    <p className="text-2xl font-bold text-white md:text-3xl">{stat.value}</p>
                    <p className="mt-1 text-[0.78rem] font-medium text-white/50">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Hero image */}
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.15 }} className="order-2 flex items-center justify-center">
              <div className="relative w-full max-w-[520px] lg:max-w-none">
                <div className="overflow-hidden rounded-2xl shadow-2xl lg:rounded-3xl">
                  <div className="image-shell aspect-[3/4] lg:aspect-[4/5]">
                    <img src={heroImage} alt="الواجهة الرئيسية لمول البستان" className="h-full w-full object-cover" loading="eager" />
                    <div className="image-wash absolute inset-0" />
                  </div>
                </div>
                {/* Floating interior preview */}
                <div className="absolute -bottom-4 -right-4 hidden w-[42%] overflow-hidden rounded-xl border-2 border-white/10 shadow-xl md:block lg:rounded-2xl">
                  <div className="image-shell aspect-[3/4]">
                    <img src={interiorImage} alt="مشهد داخلي من مول البستان" className="h-full w-full object-cover" loading="lazy" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ COUNTDOWN STRIP ═══════════════════════ */}
      <section className="border-b border-border bg-card py-6 md:py-8">
        <div className="container">
          <div className="flex flex-col items-center gap-3 md:flex-row md:justify-between">
            <div className="text-center md:text-right">
              <p className="text-sm font-semibold text-muted-foreground">العد التنازلي لافتتاح مول البستان</p>
            </div>
            <CountdownTimer compact />
          </div>
        </div>
      </section>

      {/* ═══════════════════════ LEGACY & IDENTITY ═══════════════════════ */}
      <section className="page-section">
        <div className="container">
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="order-2 lg:order-1">
              <div className="grid gap-3 md:grid-cols-[1fr_0.45fr]">
                <div className="image-shell aspect-[4/3] overflow-hidden rounded-2xl">
                  <img src={interiorImage} alt="داخل مول البستان" className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="image-shell hidden aspect-[3/5] overflow-hidden rounded-2xl md:block">
                  <img src={facadeImage} alt="واجهة مول البستان" className="h-full w-full object-cover" loading="lazy" />
                </div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} className="order-1 space-y-5 lg:order-2">
              <div className="chapter-shell pt-5">
                <p className="section-kicker">عن المول</p>
                <h2 className="section-title">تاريخ من الثقة في سوق التقنية المصري.</h2>
              </div>
              <p className="text-base leading-[1.9] text-muted-foreground md:text-lg md:leading-8">
                مول البستان ليس مجرد مركز تجاري — إنه وجهة تقنية بنت سمعتها على مدار سنوات من خدمة المستخدمين والتجار والشركات في سوق الإلكترونيات المصري.
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { icon: Building2, title: "هوية راسخة", desc: "حضور حقيقي في سوق التقنية." },
                  { icon: MapPin, title: "موقع استراتيجي", desc: "قلب القاهرة الجديدة." },
                  { icon: Layers, title: "تنظيم واضح", desc: "فئات متخصصة غير متداخلة." },
                ].map((item) => (
                  <div key={item.title} className="section-shell rounded-xl p-4">
                    <item.icon className="mb-3 h-5 w-5 text-primary" />
                    <p className="text-[0.95rem] font-bold text-foreground">{item.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
              <Link to="/about">
                <Button variant="ghost" className="mt-2 px-0 text-primary hover:text-primary/80">
                  اعرف المزيد عن المول
                  <ArrowLeft className="mr-1.5 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ CATEGORIES ═══════════════════════ */}
      <section className="section-soft page-section">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8 max-w-[36rem] md:mb-12">
            <p className="section-kicker">الفئات المتخصصة</p>
            <h2 className="section-title">ست فئات أساسية تغطي كل احتياج تقني.</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground md:text-lg">تصنيف واضح يسهّل الوصول للمتجر المناسب من أول خطوة.</p>
          </motion.div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoryStories.map((category, index) => (
              <motion.div key={category.key} custom={index} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <div className="group relative flex h-full min-h-[14rem] flex-col rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] transition-all duration-300 hover:border-primary/25 hover:shadow-[var(--shadow-elevated)]">
                  <div className="mb-5 flex items-start justify-between">
                    <div className="icon-shell h-12 w-12 rounded-xl p-3 transition-colors group-hover:bg-primary/5">
                      <category.icon className="h-full w-full" />
                    </div>
                    <span className="font-poppins text-sm font-medium text-muted-foreground/40">0{index + 1}</span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{category.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{mobileCategorySummaries[category.key]}</p>
                  <div className="mt-auto pt-5">
                    <span className="inline-flex items-center rounded-full border border-border bg-secondary px-3 py-1 text-[0.75rem] font-semibold text-muted-foreground">{category.supportLabel}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ INTERACTIVE MAP TEASER ═══════════════════════ */}
      <section className="page-section">
        <div className="container">
          <div className="grid items-start gap-8 lg:grid-cols-[2fr_3fr] lg:gap-10">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-5 lg:sticky lg:top-28">
              <div className="chapter-shell pt-5">
                <p className="section-kicker">الخريطة التفاعلية</p>
                <h2 className="section-title">دليل المول التفاعلي.</h2>
              </div>
              <p className="text-base leading-8 text-muted-foreground md:text-lg">
                كل وحدة ظاهرة بحالتها ومساحتها وموقعها — ابدأ الاستكشاف قبل الزيارة.
              </p>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { value: `${floorMapData.length}`, label: "أدوار" },
                  { value: `${availableUnits.length}`, label: "متاحة" },
                  { value: `${totalUnits}`, label: "إجمالي" },
                ].map((stat) => (
                  <div key={stat.label} className="section-shell rounded-xl px-4 py-3.5 text-center">
                    <p className="text-xl font-bold text-foreground">{stat.value}</p>
                    <p className="mt-0.5 text-[0.75rem] font-medium text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="grid gap-2.5 sm:grid-cols-2">
                <Link to="/map"><Button variant="cta" size="lg" className="h-12 w-full rounded-xl">افتح الدليل الكامل</Button></Link>
                <Link to="/leasing"><Button variant="outline-blue" size="lg" className="h-12 w-full rounded-xl">استفسر عن وحدة</Button></Link>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <MapTeaserPreview />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ LEASING ═══════════════════════ */}
      <section className="heritage-section page-section">
        <div className="container">
          <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-5">
              <p className="section-kicker">التأجير والاستثمار</p>
              <h2 className="section-title">فرصتك التجارية في أكبر وجهة تقنية.</h2>
              <p className="text-base leading-8 text-white/55 md:text-lg">
                وحدات متنوعة المساحات جاهزة للاستفسار — كل وحدة مرتبطة مباشرة بالخريطة التفاعلية وبيانات الدور والحالة.
              </p>
              <div className="grid grid-cols-3 gap-2.5">
                {availableByFloor.map((floor) => (
                  <div key={floor.id} className="heritage-card px-4 py-3.5 text-center">
                    <p className="text-lg font-bold text-white">{floor.count}</p>
                    <p className="mt-0.5 text-[0.75rem] text-white/45">{floor.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link to="/leasing"><Button variant="orange" size="lg" className="h-12 rounded-xl px-8">ابدأ استفسار التأجير</Button></Link>
                <Link to="/map"><Button size="lg" className="h-12 rounded-xl border border-white/20 bg-white/10 px-8 text-white hover:bg-white/15">شاهد على الخريطة</Button></Link>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="space-y-3">
              {homepageLeasingUnits.slice(0, 3).map((unit) => (
                <Link key={unit.unit_id} to="/map" className="heritage-card group flex flex-col p-5 transition-all hover:border-orange/40">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-bold text-white">وحدة {unit.unit_id}</p>
                      <p className="mt-1 text-sm text-white/50">{needCategoryLabels[unit.category]}</p>
                    </div>
                    <span className="rounded-full border border-orange/30 bg-orange/15 px-3 py-1 text-[0.75rem] font-semibold text-orange">متاحة</span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-white/5 px-3 py-2">
                      <p className="text-[0.72rem] text-white/40">الدور</p>
                      <p className="mt-0.5 text-sm font-semibold text-white">{floorLabels[unit.floor_id]}</p>
                    </div>
                    <div className="rounded-lg bg-white/5 px-3 py-2">
                      <p className="text-[0.72rem] text-white/40">المساحة</p>
                      <p className="mt-0.5 text-sm font-semibold text-white">{unit.area_m2} م²</p>
                    </div>
                  </div>
                </Link>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ OPENING DAY & CAMPAIGN ═══════════════════════ */}
      <section className="page-section">
        <div className="container">
          <div className="section-shell page-shell overflow-hidden">
            <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-5">
                <p className="section-kicker">الافتتاح والحملة</p>
                <h2 className="section-title">افتتاح كبير يستحق الحضور.</h2>
                <p className="text-base leading-8 text-muted-foreground md:text-lg">
                  {launchEvent?.description_ar ?? "يوم الافتتاح تجربة متكاملة — من الاستكشاف إلى المشاركة في الحملة الترويجية والحصول على مكافآت حصرية."}
                </p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { step: "01", title: "استكشف", desc: "ابدأ بالخريطة واعرف الوحدات." },
                    { step: "02", title: "شارك", desc: "جرّب أدر واربح واحفظ نتيجتك." },
                    { step: "03", title: "احضر", desc: "كمّل تجربتك يوم الافتتاح." },
                  ].map((item) => (
                    <div key={item.step} className="section-shell rounded-xl p-4">
                      <span className="font-poppins text-xs font-semibold text-primary">{item.step}</span>
                      <p className="mt-2 text-[0.95rem] font-bold text-foreground">{item.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link to="/spin-win"><Button variant="cta" size="lg" className="h-12 rounded-xl px-7">جرّب أدر واربح</Button></Link>
                  <Link to="/opening-day"><Button variant="outline-blue" size="lg" className="h-12 rounded-xl px-7">تفاصيل يوم الافتتاح</Button></Link>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="section-shell rounded-2xl p-6 text-center">
                  <p className="text-sm font-semibold text-muted-foreground">التاريخ المنتظر</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">{launchEvent?.event_date ?? "1 مايو 2026"}</p>
                  <div className="mt-5">
                    <CountdownTimer compact />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ MARKETPLACE VISION ═══════════════════════ */}
      <section id="marketplace" className="section-soft page-section">
        <div className="container max-w-5xl">
          <div className="text-center">
            <p className="section-kicker">الامتداد الرقمي</p>
            <h2 className="section-title mx-auto max-w-[30rem]">من المول إلى السوق الرقمي.</h2>
            <p className="mx-auto mt-4 max-w-[32rem] text-base leading-8 text-muted-foreground md:text-lg">
              الخطوة التالية بعد تثبيت التجربة الأساسية — سوق رقمي يمتد من المتاجر الموجودة داخل المول ليخدم المستخدمين عن بُعد.
            </p>
          </div>
          <div className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
            {[
              { step: "1", label: "الدليل التفاعلي" },
              { step: "2", label: "المتاجر والعروض" },
              { step: "3", label: "السوق الرقمي" },
            ].map((item, i) => (
              <div key={item.step} className={`section-shell rounded-xl p-5 text-center ${i === 2 ? "border-primary/20" : ""}`}>
                <span className="font-poppins text-2xl font-bold text-primary">{item.step}</span>
                <p className="mt-2 text-[0.95rem] font-bold text-foreground">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/stores"><Button variant="secondary" size="lg" className="h-12 rounded-xl px-8">استعرض المتاجر الحالية</Button></Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ FAQ ═══════════════════════ */}
      <section className="page-section">
        <div className="container max-w-5xl">
          <div className="grid items-start gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="lg:sticky lg:top-28">
              <div className="chapter-shell pt-5">
                <p className="section-kicker">الأسئلة الشائعة</p>
                <h2 className="text-[1.8rem] font-bold leading-[1.1] text-foreground md:text-[2.5rem]">
                  إجابات سريعة قبل الزيارة
                </h2>
              </div>
              <p className="mt-3 text-base leading-7 text-muted-foreground md:text-lg">الأسئلة الأكثر تكرارًا حول المول والتأجير والافتتاح.</p>
              <Link to="/faq" className="mt-4 inline-flex">
                <Button variant="ghost" className="px-0 text-primary hover:text-primary/80">
                  جميع الأسئلة
                  <ArrowLeft className="mr-1.5 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
            <Accordion type="single" collapsible defaultValue={faqItems[0]?.id} className="space-y-2.5">
              {faqItems.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} className="section-shell overflow-hidden rounded-xl px-5">
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
        </div>
      </section>
    </>
  );
}
