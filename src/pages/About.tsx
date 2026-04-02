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
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
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

    {/* ═══════════ 1 · HERO ═══════════ */}
    <section className="relative overflow-hidden" style={{ background: "#071326" }}>
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 45% at 70% 50%, #2D6BFF06, transparent 65%)" }} />

      <div className="relative mx-auto w-full max-w-[1440px]">
        <div className="grid min-h-[50vh] items-center lg:grid-cols-[1.2fr_0.8fr]">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="order-1 space-y-4 px-6 py-10 md:px-12 lg:py-12 lg:pr-14 xl:pr-16"
          >
            <div className="flex items-center gap-3">
              <div className="h-[2px] w-8 rounded-full" style={{ background: "#CDBB9A" }} />
              <span className="font-poppins text-[0.58rem] font-bold tracking-[0.22em] uppercase" style={{ color: "#CDBB9A" }}>
                من نحن
              </span>
            </div>

            <h1 className="max-w-[18rem] text-[1.55rem] leading-[1.1] md:text-[1.85rem] lg:text-[2.1rem] dark-heading">
              المكان الذي
              <br />
              <span style={{ color: "#CDBB9A" }}>صنعه السوق.</span>
            </h1>

            <p className="max-w-[24rem] text-[0.88rem] leading-[1.85] dark-body">
              سيرة تجارية بدأت قبل أكثر من عقد — من يعرف سوق التقنية يعرف هذا العنوان.
            </p>

            <div className="flex flex-wrap gap-2">
              <Link to="/map">
                <Button variant="cta" className="h-9 rounded-lg px-5 text-[0.82rem] font-bold shadow-[var(--shadow-blue)]">
                  <Compass className="ml-2 h-4 w-4" />
                  استكشف الدليل
                </Button>
              </Link>
              <Link to="/stores">
                <Button className="h-9 rounded-lg border px-5 text-[0.82rem] font-semibold" style={{ borderColor: "#ffffff1F", background: "#ffffff0A", color: "#E2E8F0" }}>
                  تصفّح المتاجر
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative order-2 hidden self-center py-8 pe-6 lg:block xl:pe-8"
          >
            <div className="frame-geometric overflow-hidden">
              <img
                src={exteriorImage}
                alt="الواجهة الرئيسية لمول البستان — القاهرة الجديدة"
                className="aspect-[4/3] max-h-[280px] w-full object-cover object-[center_35%] img-grade-dark"
                loading="eager"
              />
            </div>
            <div className="mt-1.5 flex items-end justify-between">
              <div>
                <p className="font-poppins text-[0.54rem] font-bold tracking-[0.2em] uppercase" style={{ color: "#CDBB9A" }}>Mall Elbostan</p>
                <p className="mt-0.5 text-[0.72rem] font-bold dark-heading">القاهرة الجديدة — مصر</p>
              </div>
              <div className="rounded-md px-2 py-1" style={{ background: "#ffffff0D", border: "1px solid #ffffff14" }}>
                <p className="text-[0.62rem] font-bold dark-subheading">منذ 2010+</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* ═══════════ 2 · WHY THIS PLACE MATTERS ═══════════ */}
    <section className="py-7 md:py-9 overflow-hidden" style={{ background: "#FAFAF8" }}>
      <div className="container max-w-[1200px]">
        <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <div className="grid items-center gap-6 lg:grid-cols-[1fr_1fr] lg:gap-10">

            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-[0.55fr_0.45fr] gap-2">
                <div className="frame-cinematic overflow-hidden">
                  <img src={entranceImage} alt="مدخل المول" className="img-grade aspect-[4/5] max-h-[230px] w-full object-cover object-[center_35%]" loading="lazy" />
                </div>
                <div className="frame-heritage overflow-hidden">
                  <img src={facadeImage} alt="التفاصيل المعمارية" className="img-grade-arch aspect-[4/5] max-h-[230px] w-full object-cover object-[center_40%]" loading="lazy" />
                </div>
              </div>
            </div>

            <div className="order-1 space-y-3.5 lg:order-2">
              <div className="chapter-shell pt-4">
                <p className="section-kicker">لماذا هذا المول</p>
                <h2 className="section-title max-w-[20rem]">اسم يسبق التعريف.</h2>
              </div>

              <p className="text-[0.88rem] leading-[1.85] light-body max-w-[26rem]">
                مكانة بنتها سنوات من التعامل الموثوق — الزائر يعرف أنه سيجد ما يبحث عنه.
              </p>

              <div className="grid gap-2 sm:grid-cols-3">
                {[
                  { icon: Award, title: "إرث تجاري", desc: "أكثر من عقد." },
                  { icon: MapPin, title: "وجهة مقصودة", desc: "القاهرة الجديدة." },
                  { icon: Layers, title: "بنية دقيقة", desc: "مسار شراء منظّم." },
                ].map((c) => (
                  <div key={c.title} className="card-architectural rounded-lg p-3">
                    <c.icon className="mb-1.5 h-4 w-4 text-primary" />
                    <p className="text-[0.84rem] font-bold light-heading">{c.title}</p>
                    <p className="mt-0.5 text-[0.78rem] leading-5 light-body">{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* ═══════════ 3 · THE LEGACY ═══════════ */}
    <section className="heritage-deep py-7 md:py-9 relative overflow-hidden">
      <div className="relative container max-w-[1200px]">
        <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <div className="grid items-start gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
            <div className="space-y-4">
              <div>
                <p className="section-kicker dark-kicker">السيرة التجارية</p>
                <h2 className="section-title dark-heading max-w-[22rem]">مكانة صنعها التكرار.</h2>
              </div>

              <div className="space-y-2.5">
                {[
                  { icon: Building2, title: "وجهة راسخة", desc: "اسم يعرفه المشتري والتاجر." },
                  { icon: Users, title: "ثقة بالعودة", desc: "الزائر يعود لأنه وجد ما يحتاجه." },
                  { icon: Layers, title: "تغطية شاملة", desc: "من الأجهزة إلى الشبكات والمراقبة." },
                  { icon: Globe, title: "التجدد الرقمي", desc: "دليل تفاعلي وتجربة استكشاف رقمية." },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.4 }}
                    className="heritage-surface flex items-start gap-3 p-3.5"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ border: "1px solid #2D6BFF30", background: "#2D6BFF14" }}>
                      <item.icon className="h-4 w-4" style={{ color: "#5B9AFF" }} />
                    </div>
                    <div>
                      <p className="text-[0.88rem] font-bold dark-heading">{item.title}</p>
                      <p className="mt-0.5 text-[0.82rem] leading-6 dark-body">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="space-y-3 lg:sticky lg:top-24">
              <div className="frame-cinematic overflow-hidden">
                <img src={interiorImage} alt="المشهد الداخلي" className="img-grade-arch aspect-[16/9] max-h-[200px] w-full object-cover object-[center_50%]" loading="lazy" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, #071326CC 0%, transparent 30%)" }} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { v: "10+", l: "سنوات في السوق" },
                  { v: "50+", l: "وحدة تجارية" },
                  { v: "6", l: "أقسام متخصصة" },
                  { v: "3", l: "أدوار تجارية" },
                ].map((s) => (
                  <div key={s.l} className="heritage-surface rounded-lg px-3 py-3 text-center">
                    <p className="font-poppins text-[1.25rem] font-extrabold dark-heading">{s.v}</p>
                    <p className="mt-0.5 text-[0.68rem] font-semibold dark-muted">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* ═══════════ 4 · VISITOR EXPERIENCE ═══════════ */}
    <section className="py-7 md:py-9" style={{ background: "#F5F2EC" }}>
      <div className="container max-w-[1200px]">
        <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <div className="grid items-center gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
            <div className="space-y-3.5">
              <div className="chapter-shell pt-4">
                <p className="section-kicker">تجربة الاستكشاف</p>
                <h2 className="section-title max-w-[20rem]">زيارة مُنظّمة تبدأ قبل الوصول.</h2>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  { icon: Smartphone, title: "الهواتف والإكسسوارات", desc: "أجهزة وملحقاتها." },
                  { icon: Monitor, title: "أجهزة الكمبيوتر", desc: "أداء وإنتاجية." },
                  { icon: CircuitBoard, title: "المكوّنات والتجميع", desc: "قطع غيار احترافية." },
                  { icon: Shield, title: "الأنظمة الأمنية", desc: "كاميرات وحماية." },
                  { icon: Wrench, title: "الصيانة والدعم", desc: "دعم فني فوري." },
                  { icon: Globe, title: "الشبكات والطباعة", desc: "بنية رقمية وطباعة." },
                ].map((cat) => (
                  <div key={cat.title} className="flex items-start gap-2.5 rounded-lg border border-border bg-card p-3 transition-all hover:border-primary/15">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary text-primary">
                      <cat.icon className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="text-[0.84rem] font-bold light-heading">{cat.title}</p>
                      <p className="mt-0.5 text-[0.76rem] light-body">{cat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/stores">
                <Button variant="ghost" className="mt-1 gap-1.5 px-0 text-[0.84rem] font-bold text-primary hover:text-primary/80">
                  تصفّح المتاجر <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="space-y-2">
              <div className="frame-cinematic overflow-hidden">
                <img src={exteriorImage} alt="الواجهة الخارجية" className="img-grade-warm aspect-[16/9] max-h-[180px] w-full object-cover object-[center_40%]" loading="lazy" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center justify-center rounded-md border border-border bg-card p-2.5">
                  <div className="text-center">
                    <p className="font-poppins text-[1.1rem] font-extrabold light-heading">6</p>
                    <p className="mt-0.5 text-[0.64rem] font-bold light-muted">أقسام متخصصة</p>
                  </div>
                </div>
                <div className="frame-geometric overflow-hidden">
                  <img src={facadeImage} alt="التفاصيل المعمارية" className="img-grade-arch aspect-[4/3] max-h-[90px] w-full object-cover object-[center_45%]" loading="lazy" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* ═══════════ 5 · COMMERCIAL OPPORTUNITY ═══════════ */}
    <section className="py-7 md:py-9" style={{ background: "#FAFAF8" }}>
      <div className="container max-w-[1200px]">
        <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <div className="grid items-start gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
            <div className="space-y-3.5">
              <div className="chapter-shell pt-4">
                <p className="section-kicker">الموقع التجاري</p>
                <h2 className="section-title max-w-[22rem]">لماذا يختار التاجر المول.</h2>
              </div>

              <div className="space-y-2">
                {[
                  { icon: TrendingUp, title: "طلب متنامٍ", desc: "نمو مستمر في الطلب." },
                  { icon: Users, title: "جمهور بنيّة شراء", desc: "زائر يبحث عن حل محدد." },
                  { icon: Store, title: "حضور رقمي", desc: "كل وحدة على الدليل والخريطة." },
                  { icon: MapPin, title: "مسار واضح", desc: "من الخريطة للتأجير — خطوة." },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3 rounded-lg border border-border bg-card p-3.5 transition-all hover:shadow-[var(--shadow-card)]">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary text-primary">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[0.88rem] font-bold light-heading">{item.title}</p>
                      <p className="mt-0.5 text-[0.82rem] leading-6 light-body">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <Link to="/leasing">
                  <Button variant="orange" className="h-9 rounded-lg px-5 text-[0.82rem] font-bold">استفسار التأجير</Button>
                </Link>
                <Link to="/map">
                  <Button variant="outline-blue" className="h-9 rounded-lg px-5 text-[0.82rem]">الوحدات المتاحة</Button>
                </Link>
              </div>
            </div>

            <div className="space-y-3 lg:sticky lg:top-24">
              <div className="rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
                <p className="text-[0.82rem] font-bold light-muted">أرقام المول</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {[
                    { v: "3", l: "أدوار تجارية" },
                    { v: "50+", l: "وحدة تجارية" },
                    { v: "6", l: "فئات متخصصة" },
                    { v: "2026", l: "سنة الافتتاح الكبير" },
                  ].map((s) => (
                    <div key={s.l} className="rounded-lg border border-border bg-secondary/40 px-3 py-3 text-center">
                      <p className="font-poppins text-[1.3rem] font-extrabold light-heading">{s.v}</p>
                      <p className="mt-0.5 text-[0.68rem] font-semibold light-muted">{s.l}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="frame-heritage overflow-hidden">
                <img src={entranceImage} alt="المدخل" className="img-grade aspect-[16/9] max-h-[140px] w-full object-cover object-[center_35%]" loading="lazy" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    <div className="band-primary" />

    {/* ═══════════ 6 · DIGITAL FUTURE ═══════════ */}
    <section className="heritage-deep relative overflow-hidden py-7 md:py-9">
      <div className="relative container max-w-3xl">
        <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <div className="mx-auto max-w-[26rem] text-center">
            <p className="section-kicker dark-kicker">المرحلة التالية</p>
            <h2 className="section-title dark-heading">نفس الوجهة — بأدوات رقمية.</h2>
          </div>

          <div className="mx-auto mt-5 grid max-w-2xl gap-2.5 sm:grid-cols-3">
            {[
              { n: "01", icon: Compass, label: "الدليل التفاعلي", desc: "خريطة لكل دور.", active: true },
              { n: "02", icon: Store, label: "دليل المتاجر", desc: "كل علامة تجارية.", active: true },
              { n: "03", icon: Zap, label: "السوق الرقمي", desc: "تسوّق إلكتروني — قريبًا.", active: false },
            ].map((item) => (
              <div key={item.n} className="heritage-surface rounded-lg p-4 text-center">
                <span className="font-poppins text-[0.62rem] font-bold" style={{ color: "#CDBB9A" }}>{item.n}</span>
                <div className="mx-auto mt-2 mb-2 flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: item.active ? "#2D6BFF14" : "#ffffff08", border: `1px solid ${item.active ? "#2D6BFF30" : "#ffffff10"}` }}>
                  <item.icon className="h-4 w-4" style={{ color: item.active ? "#5B9AFF" : "#7C8BA1" }} />
                </div>
                <p className="text-[0.88rem] font-bold dark-heading">{item.label}</p>
                <p className="mt-0.5 text-[0.76rem] leading-5 dark-muted">{item.desc}</p>
                {item.active && (
                  <span className="mt-2 inline-flex rounded-full px-2 py-0.5 text-[0.62rem] font-bold" style={{ background: "#2D6BFF14", color: "#5B9AFF", border: "1px solid #2D6BFF25" }}>
                    متاح الآن
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Link to="/map">
              <Button variant="cta" className="h-9 rounded-lg px-5 text-[0.82rem] font-bold">افتح الدليل التفاعلي</Button>
            </Link>
            <Link to="/stores">
              <Button className="h-9 rounded-lg border px-5 text-[0.82rem] font-bold" style={{ borderColor: "#ffffff1A", background: "#ffffff0A", color: "#E2E8F0" }}>
                تصفّح المتاجر
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>

    {/* ═══════════ CLOSING CTA ═══════════ */}
    <section className="py-7 md:py-9" style={{ background: "#F5F2EC" }}>
      <div className="container max-w-[720px] text-center">
        <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-[2px] w-5 rounded-full" style={{ background: "#CDBB9A" }} />
            <span className="font-poppins text-[0.58rem] font-bold tracking-[0.22em] uppercase light-muted">ابدأ من هنا</span>
            <div className="h-[2px] w-5 rounded-full" style={{ background: "#CDBB9A" }} />
          </div>
          <h2 className="mx-auto max-w-[22rem] text-[1.2rem] font-bold leading-[1.15] md:text-[1.45rem] light-heading">
            المول جاهز — والقرار بيدك.
          </h2>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Link to="/map">
              <Button variant="cta" className="h-9 rounded-lg px-5 text-[0.82rem] font-bold">
                <Compass className="ml-2 h-4 w-4" /> الخريطة التفاعلية
              </Button>
            </Link>
            <Link to="/stores">
              <Button variant="secondary" className="h-9 rounded-lg px-5 text-[0.82rem] font-bold">دليل المتاجر</Button>
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
  </MainLayout>
);

export default About;
