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
    <section className="relative min-h-[82vh] overflow-hidden" style={{ background: "#071326" }}>
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 45% at 70% 50%, #2D6BFF06, transparent 65%)" }} />

      <div className="relative mx-auto w-full max-w-[1440px]">
        <div className="grid min-h-[82vh] items-center lg:grid-cols-2">
          {/* text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="order-1 space-y-7 px-6 py-20 md:px-12 lg:py-0 lg:pr-16 xl:pr-20"
          >
            <div className="flex items-center gap-3">
              <div className="h-[3px] w-12 rounded-full" style={{ background: "#CDBB9A" }} />
              <span className="font-poppins text-[0.7rem] font-bold tracking-[0.22em] uppercase" style={{ color: "#CDBB9A" }}>
                من نحن
              </span>
            </div>

            <h1 className="max-w-[22rem] text-[2.5rem] leading-[1.04] md:text-[3.4rem] lg:text-[4rem] dark-heading">
              المكان الذي
              <br />
              <span style={{ color: "#CDBB9A" }}>صنعه السوق.</span>
            </h1>

            <p className="max-w-[28rem] text-[1.02rem] leading-[2] md:text-[1.08rem] dark-body">
              مول البستان لم يُبنَ على وعد — بل على سيرة تجارية بدأت قبل أكثر من عقد.
              من اشترى جهازًا أو أصلح شاشة أو جهّز بنية تقنية في القاهرة الجديدة
              يعرف هذا العنوان. اليوم يتجدد — بنفس المصداقية التي أسّسته.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/map">
                <Button variant="cta" size="lg" className="h-[3.25rem] rounded-xl px-7 text-[0.95rem] font-bold shadow-[var(--shadow-blue)]">
                  <Compass className="ml-2 h-[1.05rem] w-[1.05rem]" />
                  استكشف دليل المول
                </Button>
              </Link>
              <Link to="/stores">
                <Button size="lg" className="h-[3.25rem] rounded-xl border px-7 text-[0.95rem] font-semibold" style={{ borderColor: "#ffffff1F", background: "#ffffff0A", color: "#E2E8F0" }}>
                  تصفّح المتاجر
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* image — edge-to-edge editorial */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative order-2 hidden h-[82vh] lg:block"
          >
            <img
              src={exteriorImage}
              alt="الواجهة الرئيسية لمول البستان — القاهرة الجديدة"
              className="h-full w-full object-cover img-grade-dark"
              loading="eager"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #071326 0%, #07132680 25%, transparent 55%)" }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #071326CC 0%, transparent 35%)" }} />

            {/* anchored info */}
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-8">
              <div>
                <p className="font-poppins text-[0.65rem] font-bold tracking-[0.2em] uppercase" style={{ color: "#CDBB9A" }}>Mall Elbostan</p>
                <p className="mt-1 text-[0.95rem] font-bold dark-heading">القاهرة الجديدة — مصر</p>
              </div>
              <div className="rounded-lg px-3.5 py-2" style={{ background: "#ffffff0D", border: "1px solid #ffffff14" }}>
                <p className="text-[0.72rem] font-bold dark-subheading">وجهة تقنية منذ 2010+</p>
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
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">

            {/* editorial diptych — entrance (main) + facade (architectural detail) */}
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-[0.6fr_0.4fr] gap-2.5">
                <div className="frame-cinematic overflow-hidden">
                  <img src={entranceImage} alt="مدخل مول البستان" className="img-grade aspect-[3/4] w-full object-cover object-[center_35%]" loading="lazy" />
                </div>
                <div className="frame-heritage overflow-hidden">
                  <img src={facadeImage} alt="التفاصيل المعمارية" className="img-grade-arch aspect-[3/4] w-full object-cover object-[center_40%]" loading="lazy" />
                </div>
              </div>
              <div className="mt-2 h-[2px] w-16 rounded-full" style={{ background: "linear-gradient(90deg, #CDBB9A60, transparent)" }} />
            </div>

            {/* text */}
            <div className="order-1 space-y-6 lg:order-2">
              <div className="chapter-shell pt-7">
                <p className="section-kicker">لماذا هذا المول</p>
                <h2 className="section-title max-w-[24rem]">
                  اسم يسبق التعريف في سوق الإلكترونيات.
                </h2>
              </div>

              <p className="text-[1.02rem] leading-[2.1] light-body md:text-[1.06rem]">
                في سوق تتكاثر فيه الخيارات، مول البستان يملك ما لا يُكتسب بالإعلان:
                مكانة بنتها سنوات من التعامل الموثوق. الزائر لا يأتي لأنه سمع عن المول —
                بل لأنه يعلم أن ما يبحث عنه متوفر هنا بالفعل.
              </p>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { icon: Award, title: "إرث تجاري", desc: "حضور مستمر في سوق التقنية منذ أكثر من عقد." },
                  { icon: MapPin, title: "وجهة مقصودة", desc: "يخدم القاهرة الجديدة ومدينتي والرحاب والمحيط." },
                  { icon: Layers, title: "بنية تجارية دقيقة", desc: "تصنيف واضح يختصر مسار الشراء." },
                ].map((c) => (
                  <div key={c.title} className="card-architectural rounded-xl p-5">
                    <c.icon className="mb-3 h-5 w-5 text-primary" />
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
          <div className="grid items-start gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div className="space-y-7">
              <div>
                <p className="section-kicker dark-kicker">السيرة التجارية</p>
                <h2 className="section-title dark-heading max-w-[26rem]">
                  مكانة صنعها التكرار — وليس الإعلان.
                </h2>
              </div>

              <p className="text-[1.02rem] leading-[2.1] dark-body md:text-[1.06rem]">
                مول البستان لا يحتاج أن يقنعك بوجوده — لأنك على الأغلب تعرفه بالفعل.
                ما بنى سمعته ليس حملات تسويقية — بل آلاف الزيارات التي انتهت بشراء حقيقي،
                ومئات التجّار الذين اختاروا البقاء في المكان لأن جمهورهم يصل إليهم فعلًا.
              </p>

              <div className="space-y-4">
                {[
                  {
                    icon: Building2, title: "وجهة راسخة",
                    desc: "اسم راسخ في سوق الإلكترونيات بالقاهرة الجديدة — يعرفه المشتري والتاجر ويعود إليه بثقة متجددة.",
                  },
                  {
                    icon: Users, title: "ثقة تتجدد بالعودة",
                    desc: "الزائر يعود لأنه وجد ما يحتاجه بسرعة — والتاجر يبقى لأن الجمهور المستهدف يصل إليه.",
                  },
                  {
                    icon: Layers, title: "تغطية تقنية شاملة",
                    desc: "من الأجهزة المحمولة إلى الشبكات وأنظمة المراقبة — طيف واسع من الاحتياج التقني في مكان واحد.",
                  },
                  {
                    icon: Globe, title: "التجدد الرقمي",
                    desc: "المول يتوسّع بدليل تفاعلي وتجربة استكشاف رقمية — بنفس القيم: وضوح، وثقة، ونظام.",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.45 }}
                    className="heritage-surface flex items-start gap-4 p-5"
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
            <div className="space-y-5 lg:sticky lg:top-28">
              {/* interior — cinematic vertical crop, architectural emphasis */}
              <div className="frame-cinematic overflow-hidden">
                <img src={interiorImage} alt="المشهد الداخلي لمول البستان" className="img-grade-arch aspect-[3/4] w-full object-cover object-[center_50%]" loading="lazy" />
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
          <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
            <div className="space-y-6">
              <div className="chapter-shell pt-7">
                <p className="section-kicker">تجربة الزائر</p>
                <h2 className="section-title max-w-[24rem]">
                  زيارة منظّمة تبدأ قبل ما تنزل.
                </h2>
              </div>
              <p className="text-[1.02rem] leading-[2.1] light-body md:text-[1.06rem]">
                المول مقسّم بتصنيف واضح — فئات محددة، أدوار منطقية، وخريطة تفاعلية
                بتعرضلك كل وحدة بحالتها الفعلية. تعرف وجهتك قبل ما توصل.
              </p>

              <div className="grid gap-2.5 sm:grid-cols-2">
                {[
                  { icon: Smartphone, title: "الهواتف والإكسسوارات", desc: "تشكيلة شاملة للأجهزة المحمولة وملحقاتها." },
                  { icon: Monitor, title: "أجهزة الكمبيوتر", desc: "أجهزة مكتبية ومحمولة للأداء والإنتاجية." },
                  { icon: CircuitBoard, title: "المكوّنات والتجميع", desc: "قطع غيار ومكوّنات لتجميعات احترافية." },
                  { icon: Shield, title: "الأنظمة الأمنية", desc: "كاميرات مراقبة وحلول حماية متكاملة." },
                  { icon: Wrench, title: "الصيانة والدعم", desc: "صيانة معتمدة ودعم فني فوري." },
                  { icon: Globe, title: "الشبكات والطباعة", desc: "بنية تحتية رقمية وحلول طباعة مهنية." },
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

            {/* structured diptych — exterior widescreen + facade detail */}
            <div className="space-y-2.5">
              <div className="frame-cinematic overflow-hidden">
                <img src={exteriorImage} alt="الواجهة الخارجية" className="img-grade-warm aspect-[16/9] w-full object-cover object-[center_40%]" loading="lazy" />
              </div>
              <div className="grid grid-cols-[0.55fr_0.45fr] gap-2.5">
                <div className="frame-geometric overflow-hidden">
                  <img src={facadeImage} alt="التفاصيل المعمارية" className="img-grade-arch aspect-[4/3] w-full object-cover object-[center_45%]" loading="lazy" />
                </div>
                <div className="flex items-center justify-center rounded-md border border-border bg-card p-4">
                  <div className="text-center">
                    <p className="font-poppins text-[1.4rem] font-extrabold light-heading">6</p>
                    <p className="mt-0.5 text-[0.72rem] font-bold light-muted">أقسام تقنية متخصصة</p>
                  </div>
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
          <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
            <div className="space-y-6">
              <div className="chapter-shell pt-7">
                <p className="section-kicker">الموقع التجاري</p>
                <h2 className="section-title max-w-[26rem]">
                  لماذا التاجر يختار مول البستان.
                </h2>
              </div>
              <p className="text-[1.02rem] leading-[2.1] light-body md:text-[1.06rem]">
                الموقع الجغرافي ميزة — لكن الميزة الحقيقية هي الجمهور المتخصص اللي بييجي المول
                عشان التقنية تحديدًا. كل زيارة وراها نية شراء — وده اللي بيخلّي الوحدة هنا
                أكتر من مجرد مساحة.
              </p>

              <div className="space-y-2.5">
                {[
                  { icon: TrendingUp, title: "منطقة طلب متنامٍ", desc: "القاهرة الجديدة ومحيطها بيشهدوا نمو مستمر في الطلب على التقنية." },
                  { icon: Users, title: "جمهور متخصص", desc: "الزائر بييجي للمول بحثًا عن الإلكترونيات — مش للتنزه." },
                  { icon: Store, title: "حضور رقمي واضح", desc: "كل وحدة ظاهرة بموقعها وفئتها على الخريطة والدليل." },
                  { icon: MapPin, title: "استفسار مباشر", desc: "من الخريطة لصفحة التأجير — مسار واحد واضح." },
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
            <div className="space-y-5 lg:sticky lg:top-28">
              <div className="rounded-2xl border border-border bg-card p-7 shadow-[var(--shadow-soft)]">
                <p className="text-[0.88rem] font-bold light-muted">أرقام المول</p>
                <div className="mt-5 grid grid-cols-2 gap-3">
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
                <img src={entranceImage} alt="مول البستان — المدخل" className="img-grade aspect-[4/3] w-full object-cover object-[center_35%]" loading="lazy" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    <div className="band-primary" />

    {/* ═══════════ 6 · DIGITAL FUTURE ═══════════ */}
    <section className="heritage-deep relative overflow-hidden py-16 md:py-24">
      <div className="relative container max-w-4xl">
        <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <div className="mx-auto max-w-[34rem] text-center">
            <p className="section-kicker dark-kicker">المرحلة التالية</p>
            <h2 className="section-title dark-heading">
              نفس المكان اللي تعرفه — بأدوات رقمية تخدمك أكتر.
            </h2>
            <p className="mx-auto mt-5 text-[1.02rem] leading-8 dark-body">
              المول اللي تعرفه أصبح متاح رقميًا. الدليل التفاعلي ودليل المتاجر
              يعملان الآن — والمرحلة الجاية هتوصّلك بالمنتجات مباشرة.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              { n: "01", icon: Compass, label: "الدليل التفاعلي", desc: "خريطة المول بكل وحداتها وحالاتها.", active: true },
              { n: "02", icon: Store, label: "دليل المتاجر", desc: "تصفّح المتاجر وفئاتها وتفاصيلها.", active: true },
              { n: "03", icon: Zap, label: "السوق الرقمي", desc: "تسوّق إلكتروني من متاجر المول — قريبًا.", active: false },
            ].map((item) => (
              <div key={item.n} className="heritage-surface rounded-xl p-6 text-center">
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

          <div className="mt-10 flex flex-wrap justify-center gap-3">
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
    <section className="py-16 md:py-20" style={{ background: "#F5F2EC" }}>
      <div className="container max-w-[900px] text-center">
        <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-[3px] w-8 rounded-full" style={{ background: "#CDBB9A" }} />
            <span className="font-poppins text-[0.68rem] font-bold tracking-[0.22em] uppercase light-muted">ابدأ من هنا</span>
            <div className="h-[3px] w-8 rounded-full" style={{ background: "#CDBB9A" }} />
          </div>
          <h2 className="mx-auto max-w-[28rem] text-[1.4rem] font-bold leading-[1.15] md:text-[1.8rem] light-heading">
            المول جاهز — دورك تستكشفه.
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-[0.95rem] leading-7 light-body">
            الدليل التفاعلي، دليل المتاجر، وصفحة التأجير — كل أدوات القرار في مكان واحد.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
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
