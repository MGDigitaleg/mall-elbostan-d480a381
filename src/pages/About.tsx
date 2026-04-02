import { motion } from "framer-motion";
import {
  ArrowLeft,
  Award,
  Building2,
  CircuitBoard,
  Compass,
  Globe,
  Layers,
  MapPin,
  Monitor,
  Phone,
  Shield,
  Smartphone,
  Store,
  TrendingUp,
  Users,
  Wrench,
  Zap,
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
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
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

    {/* ═══════════ 1 · HERO — IDENTITY STATEMENT ═══════════ */}
    <section className="relative overflow-hidden" style={{ background: "#071326" }}>
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 45% at 70% 50%, #2D6BFF06, transparent 65%)" }} />

      <div className="relative mx-auto w-full max-w-[1440px]">
        <div className="grid min-h-[58vh] items-center lg:grid-cols-[1.2fr_0.8fr]">
          {/* text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="order-1 space-y-5 px-6 py-12 md:px-12 lg:py-14 lg:pr-16 xl:pr-20"
          >
            <div className="flex items-center gap-3">
              <div className="h-[2px] w-10 rounded-full" style={{ background: "#CDBB9A" }} />
              <span className="font-poppins text-[0.62rem] font-bold tracking-[0.22em] uppercase" style={{ color: "#CDBB9A" }}>
                من نحن
              </span>
            </div>

            <h1 className="max-w-[20rem] text-[1.75rem] leading-[1.1] md:text-[2.2rem] lg:text-[2.5rem] dark-heading">
              المكان الذي
              <br />
              <span style={{ color: "#CDBB9A" }}>صنعه السوق.</span>
            </h1>

            <p className="max-w-[26rem] text-[0.95rem] leading-[1.9] dark-body">
              سيرة تجارية بدأت قبل أكثر من عقد — من يعرف سوق التقنية يعرف هذا العنوان.
            </p>

            <div className="flex flex-wrap gap-2.5">
              <Link to="/map">
                <Button variant="cta" className="h-11 rounded-lg px-6 text-[0.85rem] font-bold shadow-[var(--shadow-blue)]">
                  <Compass className="ml-2 h-4 w-4" />
                  استكشف دليل المول
                </Button>
              </Link>
              <Link to="/stores">
                <Button className="h-11 rounded-lg border px-6 text-[0.85rem] font-semibold" style={{ borderColor: "#ffffff1F", background: "#ffffff0A", color: "#E2E8F0" }}>
                  تصفّح المتاجر
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* image — restrained, not full-height bleed */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="relative order-2 hidden self-center py-10 pe-8 lg:block"
          >
            <div className="frame-geometric overflow-hidden">
              <img
                src={exteriorImage}
                alt="الواجهة الرئيسية لمول البستان — القاهرة الجديدة"
                className="aspect-[4/3] max-h-[360px] w-full object-cover object-[center_35%] img-grade-dark"
                loading="eager"
              />
            </div>
            <div className="mt-2 flex items-end justify-between">
              <div>
                <p className="font-poppins text-[0.58rem] font-bold tracking-[0.2em] uppercase" style={{ color: "#CDBB9A" }}>Mall Elbostan</p>
                <p className="mt-0.5 text-[0.78rem] font-bold dark-heading">القاهرة الجديدة — مصر</p>
              </div>
              <div className="rounded-md px-2.5 py-1.5" style={{ background: "#ffffff0D", border: "1px solid #ffffff14" }}>
                <p className="text-[0.66rem] font-bold dark-subheading">وجهة تقنية منذ 2010+</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* ═══════════ 2 · WHY THIS PLACE MATTERS ═══════════ */}
    <section className="page-section overflow-hidden" style={{ background: "#FAFAF8" }}>
      <div className="container max-w-[1200px]">
        <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">

            {/* editorial diptych — entrance (main) + facade (architectural detail) */}
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-[0.55fr_0.45fr] gap-2">
                <div className="frame-cinematic overflow-hidden">
                  <img src={entranceImage} alt="مدخل مول البستان" className="img-grade aspect-[4/5] max-h-[300px] w-full object-cover object-[center_35%]" loading="lazy" />
                </div>
                <div className="frame-heritage overflow-hidden">
                  <img src={facadeImage} alt="التفاصيل المعمارية" className="img-grade-arch aspect-[4/5] max-h-[300px] w-full object-cover object-[center_40%]" loading="lazy" />
                </div>
              </div>
              <div className="mt-1.5 h-[2px] w-12 rounded-full" style={{ background: "linear-gradient(90deg, #CDBB9A60, transparent)" }} />
            </div>

            {/* text */}
            <div className="order-1 space-y-4 lg:order-2">
              <div className="chapter-shell pt-5">
                <p className="section-kicker">لماذا هذا المول</p>
                <h2 className="section-title max-w-[24rem]">
                  اسم يسبق التعريف في سوق الإلكترونيات.
                </h2>
              </div>

              <p className="text-[1.02rem] leading-[2.1] light-body md:text-[1.06rem]">
                مكانة بنتها سنوات من التعامل الموثوق — الزائر يأتي لأنه يعلم أن ما يبحث عنه هنا.
              </p>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { icon: Award, title: "إرث تجاري", desc: "أكثر من عقد في السوق." },
                  { icon: MapPin, title: "وجهة مقصودة", desc: "القاهرة الجديدة والمحيط." },
                  { icon: Layers, title: "بنية دقيقة", desc: "تصنيف يختصر مسار الشراء." },
                ].map((c) => (
                  <div key={c.title} className="card-architectural rounded-xl p-4">
                    <c.icon className="mb-2 h-4 w-4 text-primary" />
                    <p className="text-[0.92rem] font-bold light-heading">{c.title}</p>
                    <p className="mt-1.5 text-[0.84rem] leading-7 light-body">{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* ═══════════ 3 · THE LEGACY — PROOF, NOT CLAIMS ═══════════ */}
    <section className="heritage-deep page-section relative overflow-hidden">
      <div className="relative container max-w-[1200px]">
        <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
            <div className="space-y-5">
              <div>
                <p className="section-kicker dark-kicker">السيرة التجارية</p>
                <h2 className="section-title dark-heading max-w-[26rem]">
                  مكانة صنعها التكرار — وليس الإعلان.
                </h2>
              </div>

              <p className="text-[1.02rem] leading-[2.1] dark-body md:text-[1.06rem]">
                آلاف الزيارات التي انتهت بشراء حقيقي — ومئات التجّار الذين اختاروا البقاء.
              </p>

              <div className="space-y-3">
                {[
                  {
                    icon: Building2, title: "وجهة راسخة",
                    desc: "اسم يعرفه المشتري والتاجر ويعود إليه بثقة.",
                  },
                  {
                    icon: Users, title: "ثقة بالعودة",
                    desc: "الزائر يعود لأنه وجد ما يحتاجه — والتاجر يبقى لأن جمهوره هنا.",
                  },
                  {
                    icon: Layers, title: "تغطية شاملة",
                    desc: "من الأجهزة المحمولة إلى الشبكات وأنظمة المراقبة.",
                  },
                  {
                    icon: Globe, title: "التجدد الرقمي",
                    desc: "دليل تفاعلي وتجربة استكشاف رقمية.",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.45 }}
                    className="heritage-surface flex items-start gap-3.5 p-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ border: "1px solid #2D6BFF30", background: "#2D6BFF14" }}>
                      <item.icon className="h-5 w-5" style={{ color: "#5B9AFF" }} />
                    </div>
                    <div>
                      <p className="text-[0.95rem] font-bold dark-heading">{item.title}</p>
                      <p className="mt-1 text-[0.88rem] leading-7 dark-body">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* editorial image + stats panel */}
             <div className="space-y-4 lg:sticky lg:top-24">
              {/* interior — cinematic vertical crop, architectural emphasis */}
              <div className="frame-cinematic overflow-hidden">
                <img src={interiorImage} alt="المشهد الداخلي لمول البستان" className="img-grade-arch aspect-[16/9] max-h-[260px] w-full object-cover object-[center_50%]" loading="lazy" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, #071326CC 0%, transparent 30%)" }} />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { v: "10+", l: "سنوات في السوق" },
                  { v: "50+", l: "وحدة تجارية" },
                  { v: "6", l: "أقسام متخصصة" },
                  { v: "3", l: "أدوار تجارية" },
                ].map((s) => (
                  <div key={s.l} className="heritage-surface rounded-xl px-4 py-4 text-center">
                    <p className="font-poppins text-[1.5rem] font-extrabold dark-heading">{s.v}</p>
                    <p className="mt-1 text-[0.76rem] font-semibold dark-muted">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* ═══════════ 4 · THE VISITOR EXPERIENCE ═══════════ */}
    <section className="page-section" style={{ background: "#F5F2EC" }}>
      <div className="container max-w-[1200px]">
        <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
           <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
            <div className="space-y-4">
              <div className="chapter-shell pt-5">
                <p className="section-kicker">تجربة الاستكشاف</p>
                <h2 className="section-title max-w-[24rem]">
                  زيارة مُنظّمة تبدأ قبل الوصول.
                </h2>
              </div>
              <p className="text-[1.02rem] leading-[2.1] light-body md:text-[1.06rem]">
                أقسام محددة، أدوار منطقية، وخريطة تفاعلية — تعرف وجهتك قبل أن تصل.
              </p>

              <div className="grid gap-2.5 sm:grid-cols-2">
                {[
                  { icon: Smartphone, title: "الهواتف والإكسسوارات", desc: "أجهزة محمولة وملحقاتها." },
                  { icon: Monitor, title: "أجهزة الكمبيوتر", desc: "أجهزة للأداء والإنتاجية." },
                  { icon: CircuitBoard, title: "المكوّنات والتجميع", desc: "قطع غيار وتجميعات احترافية." },
                  { icon: Shield, title: "الأنظمة الأمنية", desc: "كاميرات وحلول حماية." },
                  { icon: Wrench, title: "الصيانة والدعم", desc: "صيانة ودعم فني فوري." },
                  { icon: Globe, title: "الشبكات والطباعة", desc: "بنية رقمية وحلول طباعة." },
                ].map((cat) => (
                  <div key={cat.title} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/15 hover:shadow-[var(--shadow-card)]">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary text-primary">
                      <cat.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[0.9rem] font-bold light-heading">{cat.title}</p>
                      <p className="mt-0.5 text-[0.82rem] light-body">{cat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/stores">
                <Button variant="ghost" className="mt-1 gap-1.5 px-0 font-bold text-primary hover:text-primary/80">
                  تصفّح جميع المتاجر <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* single constrained image + stat chip */}
            <div className="space-y-2.5">
              <div className="frame-cinematic overflow-hidden">
                <img src={exteriorImage} alt="الواجهة الخارجية" className="img-grade-warm aspect-[16/9] max-h-[220px] w-full object-cover object-[center_40%]" loading="lazy" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center justify-center rounded-md border border-border bg-card p-3">
                  <div className="text-center">
                    <p className="font-poppins text-[1.2rem] font-extrabold light-heading">6</p>
                    <p className="mt-0.5 text-[0.68rem] font-bold light-muted">أقسام تقنية متخصصة</p>
                  </div>
                </div>
                <div className="frame-geometric overflow-hidden">
                  <img src={facadeImage} alt="التفاصيل المعمارية" className="img-grade-arch aspect-[4/3] max-h-[110px] w-full object-cover object-[center_45%]" loading="lazy" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* ═══════════ 5 · COMMERCIAL OPPORTUNITY ═══════════ */}
    <section className="page-section" style={{ background: "#FAFAF8" }}>
      <div className="container max-w-[1200px]">
        <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
           <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
            <div className="space-y-4">
              <div className="chapter-shell pt-5">
                <p className="section-kicker">الموقع التجاري</p>
                <h2 className="section-title max-w-[26rem]">
                  لماذا يختار التاجر مول البستان.
                </h2>
              </div>
              <p className="text-[1.02rem] leading-[2.1] light-body md:text-[1.06rem]">
                الميزة ليست الموقع فقط — بل الجمهور الذي يقصد المول بقرار شراء.
              </p>

              <div className="space-y-2.5">
                {[
                  { icon: TrendingUp, title: "طلب متنامٍ", desc: "نمو مستمر في الطلب على التقنية." },
                  { icon: Users, title: "جمهور بنيّة شراء", desc: "زائر يبحث عن حل تقني محدد." },
                  { icon: Store, title: "حضور رقمي", desc: "كل وحدة على الدليل والخريطة." },
                  { icon: MapPin, title: "مسار واضح", desc: "من الخريطة للتأجير — خطوة واحدة." },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:shadow-[var(--shadow-card)]">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary text-primary">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[0.95rem] font-bold light-heading">{item.title}</p>
                      <p className="mt-1 text-[0.88rem] leading-7 light-body">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link to="/leasing">
                  <Button variant="orange" size="lg" className="h-12 rounded-xl px-8 font-bold">ابدأ استفسار التأجير</Button>
                </Link>
                <Link to="/map">
                  <Button variant="outline-blue" size="lg" className="h-12 rounded-xl px-8">شاهد الوحدات المتاحة</Button>
                </Link>
              </div>
            </div>

            {/* stats panel */}
            <div className="space-y-4 lg:sticky lg:top-24">
               <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
                <p className="text-[0.88rem] font-bold light-muted">أرقام المول</p>
                <div className="mt-4 grid grid-cols-2 gap-2.5">
                  {[
                    { v: "3", l: "أدوار تجارية" },
                    { v: "50+", l: "وحدة تجارية" },
                    { v: "6", l: "فئات متخصصة" },
                    { v: "2026", l: "سنة الافتتاح الكبير" },
                  ].map((s) => (
                    <div key={s.l} className="rounded-xl border border-border bg-secondary/40 px-4 py-4 text-center">
                      <p className="font-poppins text-[1.6rem] font-extrabold light-heading">{s.v}</p>
                      <p className="mt-1 text-[0.76rem] font-semibold light-muted">{s.l}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="frame-heritage overflow-hidden">
                <img src={entranceImage} alt="مول البستان — المدخل" className="img-grade aspect-[16/9] max-h-[180px] w-full object-cover object-[center_35%]" loading="lazy" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    <div className="band-primary" />

    {/* ═══════════ 6 · DIGITAL FUTURE ═══════════ */}
    <section className="heritage-deep relative overflow-hidden py-10 md:py-14">
      <div className="relative container max-w-4xl">
        <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <div className="mx-auto max-w-[34rem] text-center">
            <p className="section-kicker dark-kicker">المرحلة التالية</p>
            <h2 className="section-title dark-heading">
              نفس الوجهة التي تعرفها — بأدوات رقمية تخدمك أبعد.
            </h2>
              <p className="mx-auto mt-5 text-[1.02rem] leading-8 dark-body">
                الدليل التفاعلي ودليل المتاجر يعملان الآن — والسوق الرقمي قادم.
              </p>
          </div>

          <div className="mx-auto mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
            {[
              { n: "01", icon: Compass, label: "الدليل التفاعلي", desc: "خريطة المول بكل وحداتها وحالاتها.", active: true },
              { n: "02", icon: Store, label: "دليل المتاجر", desc: "تصفّح المتاجر وفئاتها وتفاصيلها.", active: true },
              { n: "03", icon: Zap, label: "السوق الرقمي", desc: "تسوّق إلكتروني من متاجر المول — قريبًا.", active: false },
            ].map((item) => (
              <div key={item.n} className="heritage-surface rounded-xl p-5 text-center">
                <span className="font-poppins text-[0.7rem] font-bold" style={{ color: "#CDBB9A" }}>{item.n}</span>
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

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/map">
              <Button variant="cta" size="lg" className="h-12 rounded-xl px-8 font-bold">افتح الدليل التفاعلي</Button>
            </Link>
            <Link to="/stores">
              <Button size="lg" className="h-12 rounded-xl border px-8 font-bold" style={{ borderColor: "#ffffff1A", background: "#ffffff0A", color: "#E2E8F0" }}>
                تصفّح المتاجر
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>

    {/* ═══════════ CLOSING CTA ═══════════ */}
     <section className="py-10 md:py-12" style={{ background: "#F5F2EC" }}>
      <div className="container max-w-[900px] text-center">
        <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-[3px] w-8 rounded-full" style={{ background: "#CDBB9A" }} />
            <span className="font-poppins text-[0.68rem] font-bold tracking-[0.22em] uppercase light-muted">ابدأ من هنا</span>
            <div className="h-[3px] w-8 rounded-full" style={{ background: "#CDBB9A" }} />
          </div>
          <h2 className="mx-auto max-w-[28rem] text-[1.4rem] font-bold leading-[1.15] md:text-[1.8rem] light-heading">
            المول جاهز — والقرار بيدك.
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-[0.95rem] leading-7 light-body">
            كل أدوات القرار في مكان واحد.
          </p>
           <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/map">
              <Button variant="cta" size="lg" className="h-12 rounded-xl px-8 font-bold">
                <Compass className="ml-2 h-4 w-4" /> الخريطة التفاعلية
              </Button>
            </Link>
            <Link to="/stores">
              <Button variant="secondary" size="lg" className="h-12 rounded-xl px-8 font-bold">دليل المتاجر</Button>
            </Link>
            <Link to="/leasing">
              <Button variant="orange" size="lg" className="h-12 rounded-xl px-8 font-bold">
                <Phone className="ml-2 h-4 w-4" /> استفسر عن التأجير
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  </MainLayout>
);

export default About;
