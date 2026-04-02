import { motion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  CircuitBoard,
  Compass,
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
} from "lucide-react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import exteriorImage from "@/assets/mall-exterior.jpg";
import interiorImage from "@/assets/mall-interior.jpg";
import facadeImage from "@/assets/mall-facade.jpg";
import entranceImage from "@/assets/mall-entrance.jpg";

const sectionReveal = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const About = () => (
  <MainLayout>
    <SEOHead
      title="عن المول"
      titleEn="About"
      description="تعرف على مول البستان — الوجهة التقنية الأعرق في مصر. تاريخ من الثقة في سوق الإلكترونيات وتجربة تسوّق منظّمة في القاهرة الجديدة."
      descriptionEn="Learn about Mall Elbostan — Egypt's most established technology retail destination with a legacy of trust and organized shopping."
      breadcrumbs={[{ name: "عن المول", url: "/about" }]}
    />

    {/* ═══════════ 1 · HERO — WHO WE ARE ═══════════ */}
    <section className="heritage-section relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero" />
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, hsl(0 0% 100%) 0.8px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1400px] px-5 md:px-8 lg:px-14">
        <div className="grid min-h-[80vh] items-center gap-10 py-20 lg:grid-cols-2 lg:gap-16 lg:py-0">
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="order-1 space-y-6"
          >
            <span className="eyebrow-chip border-white/15 bg-white/8 text-[0.76rem] text-white/70">
              من نحن
            </span>

            <h1 className="max-w-[30rem] text-[2.2rem] font-extrabold leading-[1.06] text-white md:text-[3.2rem] lg:text-[3.8rem]">
              مول بنته الثقة
              <br className="hidden sm:block" />
              قبل أن يبنيه الحجر.
            </h1>

            <p className="max-w-[30rem] text-[1.05rem] leading-[2] text-white/55 md:text-[1.15rem]">
              مول البستان ليس مشروعًا يبدأ من الصفر — إنه امتداد لتاريخ تجاري حقيقي في سوق
              الإلكترونيات المصري. اليوم يتجدد رقميًا ومعماريًا بنفس المبادئ التي أسّسته:
              وضوح التعامل، تنظيم السوق، واحترام العلاقة بين التاجر والمشتري.
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              <Link to="/map">
                <Button variant="cta" size="lg" className="h-[3.25rem] rounded-xl px-7 text-[0.95rem] font-bold">
                  <Compass className="ml-2 h-[1.1rem] w-[1.1rem]" />
                  استكشف الخريطة
                </Button>
              </Link>
              <Link to="/stores">
                <Button size="lg" className="h-[3.25rem] rounded-xl border border-white/15 bg-white/8 px-7 text-[0.95rem] font-semibold text-white backdrop-blur-sm hover:bg-white/14">
                  تصفّح المتاجر
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.12 }}
            className="order-2 flex items-center justify-center"
          >
            <div className="relative w-full max-w-[480px] lg:max-w-none">
              <div className="overflow-hidden rounded-2xl ring-1 ring-white/10 lg:rounded-3xl">
                <div className="image-shell aspect-[3/4] lg:aspect-[4/5]">
                  <img src={exteriorImage} alt="الواجهة الرئيسية لمول البستان" className="h-full w-full object-cover" loading="eager" />
                  <div className="image-wash absolute inset-0" />
                </div>
              </div>
              <div className="absolute -bottom-5 -right-5 hidden w-[38%] overflow-hidden rounded-xl ring-1 ring-white/10 md:block lg:rounded-2xl">
                <div className="image-shell aspect-[3/4]">
                  <img src={facadeImage} alt="التفاصيل المعمارية لمول البستان" className="h-full w-full object-cover" loading="lazy" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* ═══════════ 2 · WHY MALL EL BOSTAN MATTERS ═══════════ */}
    <section className="page-section overflow-hidden">
      <div className="container max-w-[1200px]">
        <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="order-2 lg:order-1">
              <div className="grid gap-3 md:grid-cols-[1fr_0.48fr]">
                <div className="image-shell aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-border">
                  <img src={entranceImage} alt="مدخل مول البستان" className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="image-shell hidden aspect-[3/5] overflow-hidden rounded-2xl ring-1 ring-border md:block">
                  <img src={interiorImage} alt="الأتريوم الداخلي" className="h-full w-full object-cover" loading="lazy" />
                </div>
              </div>
            </div>

            <div className="order-1 space-y-6 lg:order-2">
              <div className="chapter-shell pt-6">
                <p className="section-kicker">لماذا مول البستان</p>
                <h2 className="section-title max-w-[26rem]">
                  ليس مجرد مول — بل وجهة اختارها السوق.
                </h2>
              </div>
              <p className="text-[1.02rem] leading-[2] text-muted-foreground md:text-[1.08rem]">
                في سوق ممتلئ بالخيارات، مول البستان يملك ما لا يُبنى بحملة إعلانية:
                سمعة تراكمت من سنوات التعامل الحقيقي. المشتري يعرفه لأنه وجد ما يحتاجه،
                والتاجر يثق به لأن الجمهور المناسب يأتي إليه.
              </p>
              <div className="space-y-4">
                {[
                  "سوق متخصص بالتقنية — لا مجمّع عام بلا هوية.",
                  "موقع يخدم منطقة طلب حقيقي ومتنامٍ في القاهرة الجديدة.",
                  "تجربة منظمة تختصر الطريق من الدخول إلى اتخاذ القرار.",
                ].map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <p className="text-[0.95rem] leading-7 text-foreground/80">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* ═══════════ 3 · LEGACY IN TECH RETAIL ═══════════ */}
    <section className="heritage-section page-section">
      <div className="container max-w-[1200px]">
        <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <div className="mx-auto mb-14 max-w-[36rem] text-center">
            <p className="section-kicker">سيرة تجارية</p>
            <h2 className="section-title">
              مكانة لم تُبنَ بالإعلان — بل بتكرار التجربة.
            </h2>
            <p className="mx-auto mt-4 max-w-[30rem] text-base leading-8 text-white/50 md:text-lg">
              مول البستان لم يحتج حملات ضخمة ليصبح معروفًا — الزوّار والتجار هم من صنعوا
              سمعته، صفقة بعد صفقة وزيارة بعد زيارة.
            </p>
          </div>

          {/* timeline-style legacy moments */}
          <div className="relative">
            {/* vertical line */}
            <div className="absolute right-1/2 top-0 hidden h-full w-px bg-white/10 lg:block" />

            <div className="space-y-8 lg:space-y-14">
              {[
                {
                  title: "وجهة راسخة",
                  desc: "اسم مألوف في سوق الإلكترونيات بالقاهرة الجديدة — يعرفه المشتري والتاجر على حد سواء ويعود إليه بثقة.",
                  icon: Building2,
                  align: "right" as const,
                },
                {
                  title: "تغطية شاملة",
                  desc: "من الأجهزة المحمولة والإكسسوارات إلى الشبكات وأنظمة المراقبة — طيف واسع من الاحتياج التقني في مكان واحد.",
                  icon: Layers,
                  align: "left" as const,
                },
                {
                  title: "ثقة تتجدد بالعودة",
                  desc: "الزائر يعود لأنه وجد ما يحتاجه بسرعة، والتاجر يبقى لأن الجمهور المستهدف يصل إليه فعلًا. دورة نجاح متكررة.",
                  icon: Users,
                  align: "right" as const,
                },
                {
                  title: "التجدد الرقمي",
                  desc: "المول يتجدد اليوم بدليل تفاعلي رقمي وتجربة استكشاف حديثة — بنفس القيم: وضوح، ثقة، ونظام.",
                  icon: Globe,
                  align: "left" as const,
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className={`flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-12 ${item.align === "left" ? "lg:flex-row-reverse" : ""}`}
                >
                  <div className={`flex-1 ${item.align === "left" ? "lg:text-left" : "lg:text-right"}`}>
                    <div className={`heritage-card inline-flex p-6 md:p-8 ${item.align === "left" ? "lg:ml-0 lg:mr-auto" : "lg:ml-auto lg:mr-0"}`}>
                      <div className="space-y-3">
                        <item.icon className="h-6 w-6 text-primary" />
                        <h3 className="text-[1.2rem] font-bold text-white md:text-xl">{item.title}</h3>
                        <p className="max-w-[22rem] text-[0.92rem] leading-7 text-white/45">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                  <div className="hidden w-px lg:block" /> {/* spacer for center line */}
                  <div className="hidden flex-1 lg:block" /> {/* empty side */}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* ═══════════ 4 · ORGANIZED VISITOR EXPERIENCE ═══════════ */}
    <section className="page-section">
      <div className="container max-w-[1200px]">
        <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
            <div className="space-y-6">
              <div className="chapter-shell pt-6">
                <p className="section-kicker">تجربة الزائر</p>
                <h2 className="section-title max-w-[24rem]">
                  زيارة منظّمة تبدأ قبل أن تدخل.
                </h2>
              </div>
              <p className="text-[1.02rem] leading-[2] text-muted-foreground md:text-[1.08rem]">
                المول مقسّم بتصنيف دقيق — فئات واضحة، أدوار منطقية، وخريطة تفاعلية تعرض كل
                وحدة بحالتها الفعلية. الزائر يعرف وجهته قبل أن يصل.
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { icon: Smartphone, title: "الهواتف والإكسسوارات", desc: "تشكيلة شاملة للأجهزة المحمولة وملحقاتها." },
                  { icon: Monitor, title: "أجهزة الكمبيوتر", desc: "أجهزة مكتبية ومحمولة للأداء والإنتاجية." },
                  { icon: CircuitBoard, title: "المكوّنات والتجميع", desc: "قطع غيار ومكوّنات لتجميعات احترافية." },
                  { icon: Shield, title: "الأنظمة الأمنية", desc: "كاميرات مراقبة وحلول حماية متكاملة." },
                  { icon: Wrench, title: "الصيانة والدعم", desc: "خدمة صيانة معتمدة ودعم فني فوري." },
                  { icon: Globe, title: "الشبكات والطباعة", desc: "بنية تحتية رقمية وحلول طباعة مهنية." },
                ].map((cat) => (
                  <div key={cat.title} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/15 hover:shadow-[var(--shadow-card)]">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary text-primary">
                      <cat.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[0.9rem] font-bold text-foreground">{cat.title}</p>
                      <p className="mt-0.5 text-[0.82rem] text-muted-foreground">{cat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/stores">
                <Button variant="ghost" className="mt-1 px-0 text-primary hover:text-primary/80">
                  تصفّح جميع المتاجر
                  <ArrowLeft className="mr-1.5 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              <div className="image-shell aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-border">
                <img src={interiorImage} alt="المشهد الداخلي المنظّم لمول البستان" className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="image-shell aspect-[4/3] overflow-hidden rounded-xl ring-1 ring-border">
                  <img src={facadeImage} alt="واجهة معمارية" className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="image-shell aspect-[4/3] overflow-hidden rounded-xl ring-1 ring-border">
                  <img src={entranceImage} alt="مدخل المول" className="h-full w-full object-cover" loading="lazy" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* ═══════════ 5 · COMMERCIAL OPPORTUNITY ═══════════ */}
    <section className="section-soft page-section">
      <div className="container max-w-[1200px]">
        <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
            <div className="space-y-6">
              <div className="chapter-shell pt-6">
                <p className="section-kicker">الفرصة التجارية</p>
                <h2 className="section-title max-w-[26rem]">
                  لماذا يختار التاجر مول البستان.
                </h2>
              </div>
              <p className="text-[1.02rem] leading-[2] text-muted-foreground md:text-[1.08rem]">
                الموقع وحده لا يكفي — ما يجعل المول فرصة تجارية حقيقية هو الجمهور المتخصص الذي يأتي
                إليه تحديدًا بحثًا عن التقنية. هذا يعني زيارات ذات نية شراء واضحة، وبيئة تجارية
                تدعم النشاط بدل أن تشتته.
              </p>

              <div className="space-y-3">
                {[
                  {
                    icon: TrendingUp,
                    title: "منطقة طلب متنامٍ",
                    desc: "القاهرة الجديدة ومحيطها تشهد نموًا مستمرًا في الطلب على التقنية.",
                  },
                  {
                    icon: Users,
                    title: "جمهور مستهدف ومتخصص",
                    desc: "الزائر يأتي للمول بحثًا عن الإلكترونيات تحديدًا — ليس للتنزه.",
                  },
                  {
                    icon: Store,
                    title: "حضور رقمي واضح لكل متجر",
                    desc: "كل وحدة ظاهرة بموقعها وفئتها على الخريطة التفاعلية والدليل الرقمي.",
                  },
                  {
                    icon: MapPin,
                    title: "استفسار مباشر وسريع",
                    desc: "من الخريطة إلى صفحة التأجير — مسار واحد واضح بدون تعقيد.",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:shadow-[var(--shadow-card)]">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary text-primary">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[0.95rem] font-bold text-foreground">{item.title}</p>
                      <p className="mt-1 text-[0.88rem] leading-7 text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link to="/leasing">
                  <Button variant="orange" size="lg" className="h-12 rounded-xl px-8 font-bold">
                    ابدأ استفسار التأجير
                  </Button>
                </Link>
                <Link to="/map">
                  <Button variant="outline-blue" size="lg" className="h-12 rounded-xl px-8">
                    شاهد الوحدات المتاحة
                  </Button>
                </Link>
              </div>
            </div>

            {/* stats panel */}
            <div className="space-y-5 lg:sticky lg:top-28">
              <div className="section-shell rounded-2xl p-7">
                <p className="text-sm font-semibold text-muted-foreground">أرقام المول</p>
                <div className="mt-5 grid grid-cols-2 gap-4">
                  {[
                    { v: "3", l: "أدوار" },
                    { v: "50+", l: "وحدة تجارية" },
                    { v: "6", l: "فئات متخصصة" },
                    { v: "2026", l: "سنة الافتتاح" },
                  ].map((s) => (
                    <div key={s.l} className="rounded-xl border border-border bg-secondary/40 px-4 py-4 text-center">
                      <p className="font-poppins text-2xl font-bold text-foreground">{s.v}</p>
                      <p className="mt-1 text-[0.78rem] text-muted-foreground">{s.l}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="image-shell aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-border">
                <img src={exteriorImage} alt="مول البستان من الخارج" className="h-full w-full object-cover" loading="lazy" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* ═══════════ 6 · NEXT CHAPTER: DIGITAL FUTURE ═══════════ */}
    <section className="heritage-section page-section">
      <div className="container max-w-[1000px]">
        <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <div className="text-center">
            <p className="section-kicker">الفصل التالي</p>
            <h2 className="section-title mx-auto max-w-[28rem]">
              من وجهة تقنية إلى تجربة رقمية متصلة.
            </h2>
            <p className="mx-auto mt-5 max-w-[34rem] text-base leading-8 text-white/50 md:text-lg">
              المول يتجدد — دليل تفاعلي يعرض كل وحدة وحالتها، ودليل متاجر رقمي يسهّل الاستكشاف
              قبل الزيارة. والمرحلة التالية: سوق رقمي يمتد من المتاجر ليخدم المستخدمين في أي مكان.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-[48rem] gap-5 sm:grid-cols-3">
            {[
              {
                n: "01",
                title: "الدليل التفاعلي",
                desc: "خريطة دقيقة لكل دور ووحدة وحالة — تعمل الآن.",
                active: true,
              },
              {
                n: "02",
                title: "دليل المتاجر",
                desc: "تصفّح واستكشف المتاجر وفئاتها وعروضها.",
                active: true,
              },
              {
                n: "03",
                title: "السوق الرقمي",
                desc: "تسوّق إلكتروني من متاجر المول — قريبًا.",
                active: false,
              },
            ].map((phase) => (
              <div
                key={phase.n}
                className={`heritage-card rounded-xl p-6 text-center transition-all ${phase.active ? "" : "border-primary/20"}`}
              >
                <span className={`font-poppins text-sm font-bold ${phase.active ? "text-primary" : "text-primary/50"}`}>
                  {phase.n}
                </span>
                <p className="mt-3 text-[1.02rem] font-bold text-white">{phase.title}</p>
                <p className="mt-2 text-[0.85rem] leading-6 text-white/40">{phase.desc}</p>
                {phase.active && (
                  <span className="mt-4 inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[0.72rem] font-semibold text-primary">
                    متاح الآن
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link to="/map">
              <Button variant="cta" size="lg" className="h-12 rounded-xl px-8">
                افتح الدليل التفاعلي
              </Button>
            </Link>
            <Link to="/stores">
              <Button size="lg" className="h-12 rounded-xl border border-white/15 bg-white/8 px-8 text-white hover:bg-white/14">
                تصفّح المتاجر
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>

    {/* ═══════════ CLOSING CTA ═══════════ */}
    <section className="page-section">
      <div className="container max-w-[800px] text-center">
        <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h2 className="text-[1.8rem] font-bold leading-[1.1] text-foreground md:text-[2.5rem]">
            ابدأ الآن — استكشف المول رقميًا.
          </h2>
          <p className="mx-auto mt-4 max-w-[28rem] text-base leading-8 text-muted-foreground md:text-lg">
            الخريطة التفاعلية، دليل المتاجر، وصفحة التأجير — كل ما تحتاجه لتبدأ.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/map">
              <Button variant="cta" size="lg" className="h-12 rounded-xl px-8 font-bold">
                <Compass className="ml-2 h-4 w-4" />
                الخريطة التفاعلية
              </Button>
            </Link>
            <Link to="/stores">
              <Button variant="secondary" size="lg" className="h-12 rounded-xl px-8">
                دليل المتاجر
              </Button>
            </Link>
            <Link to="/leasing">
              <Button variant="outline-blue" size="lg" className="h-12 rounded-xl px-8">
                فرص التأجير
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  </MainLayout>
);

export default About;
