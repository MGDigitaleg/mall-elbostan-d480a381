import { useRef } from "react";
import { motion } from "framer-motion";
// SEOHead imported below with organizationLd
import {
  ArrowLeft,
  Award,
  Building2,
  Compass,
  Layers,
  MapPin,
  ShoppingBag,
  Store,
  Users,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead, organizationLd } from "@/components/SEOHead";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { BranchStatCard } from "@/components/branch/BranchStatCard";
import { useCountUp } from "@/hooks/useCountUp";
import { parseStatValue } from "@/lib/statUtils";
import aboutDowntownCard from "@/assets/about-downtown-card.webp";
import aboutNewCairoCard from "@/assets/about-newcairo-card.webp";

const sectionReveal = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const About = () => (
  <MainLayout>
    <SEOHead
      title="عن مول البستان — أقدم وأكبر مول تكنولوجيا في مصر منذ 1990"
      titleEn="About Mall Elbostan — Egypt's Oldest & Largest Tech Mall Since 1990"
      description="تعرف على مول البستان — أول مول متخصص في الكمبيوتر والإلكترونيات في مصر منذ 1990. فرعان في وسط البلد والتجمع الخامس، أكثر من 150 محل، وخريطة تفاعلية."
      descriptionEn="Learn about Mall Elbostan — Egypt's first specialized technology mall since 1990. Two branches, 150+ stores, and an interactive floor map."
      keywords="عن مول البستان, تاريخ مول البستان, مول تكنولوجيا مصر, أقدم مول إلكترونيات, القاهرة الجديدة, وسط البلد"
      breadcrumbs={[{ name: "عن المول", url: "/about" }]}
    />

    {/* ═══════════ 1 · HERO ═══════════ */}
    <PageHero
      kicker="من نحن"
      kickerEn="About Us"
      title={<>اسم <span style={{ color: "#CDBB9A" }}>يعرفه السوق.</span></>}
      subtitle="بدأ من وسط البلد، ويستمر اليوم في القاهرة الجديدة — نفس الثقة، وتجربة أوضح."
      ctas={[
        { label: "استكشف الخريطة", to: "/map", icon: Compass },
        { label: "فرع وسط البلد", to: "/downtown-branch" },
        { label: "فرع القاهرة الجديدة", to: "/new-cairo-branch" },
      ]}
      image={{ src: aboutDowntownCard, alt: "الواجهة الرئيسية لمول البستان — وسط البلد ليلاً" }}
    />

    {/* ═══════════ 2 · TWO BRANCHES ═══════════ */}
    <section className="py-8 md:py-10 bg-secondary dark:bg-background">
      <div className="container max-w-[1100px]">
        <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <div className="text-center mb-6">
            <p className="section-kicker">اسم واحد — فرعان</p>
            <h2 className="section-title mx-auto max-w-[24rem]">كل فرع يخدم مرحلة مختلفة من التجربة.</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Downtown Card */}
            <div className="group rounded-2xl border border-border bg-card overflow-hidden transition-shadow hover:shadow-[var(--shadow-card)]">
              <div className="overflow-hidden">
                <img
                  src={aboutDowntownCard}
                  alt="مول البستان — وسط البلد"
                  className="aspect-[16/9] max-h-[180px] w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
                  loading="lazy"
                />
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-5 items-center rounded-full px-2.5 text-[0.62rem] font-bold bg-[#CDBB9A20] text-[#9A8866] border border-[#CDBB9A30] dark:bg-[#CDBB9A15] dark:text-[#CDBB9A] dark:border-[#CDBB9A25]">
                    الأصل
                  </span>
                  <span className="font-poppins text-[0.7rem] font-semibold text-muted-foreground">منذ 1990</span>
                </div>
                <h3 className="text-[1.05rem] font-bold light-heading">فرع وسط البلد</h3>
                <p className="text-[0.84rem] leading-[1.75] light-body max-w-[22rem]">
                  المرجع الذي بناه السوق المصري على مدار ثلاثة عقود. مئات التجار، خبرات متراكمة، ووجهة معروفة في عالم الإلكترونيات.
                </p>
                <Link to="/downtown-branch">
                    <Button variant="ghost" className="gap-1.5 px-0 text-[0.82rem] font-bold text-primary hover:text-primary/80">
                     اكتشف فرع وسط البلد <ArrowLeft className="h-3.5 w-3.5" />
                   </Button>
                </Link>
              </div>
            </div>

            {/* New Cairo Card */}
            <div className="group rounded-2xl border border-border bg-card overflow-hidden transition-shadow hover:shadow-[var(--shadow-card)]">
              <div className="overflow-hidden">
                <img
                  src={aboutNewCairoCard}
                  alt="مول البستان — القاهرة الجديدة من الداخل"
                  className="aspect-[16/9] max-h-[180px] w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
                  loading="lazy"
                />
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-5 items-center rounded-full px-2.5 text-[0.62rem] font-bold" style={{ background: "hsl(var(--primary) / 0.08)", color: "hsl(var(--primary))", border: "1px solid hsl(var(--primary) / 0.15)" }}>
                    الامتداد
                  </span>
                  <span className="font-poppins text-[0.7rem] font-semibold text-muted-foreground">2026</span>
                </div>
                <h3 className="text-[1.05rem] font-bold light-heading">فرع القاهرة الجديدة</h3>
                <p className="text-[0.84rem] leading-[1.75] light-body max-w-[22rem]">
                  نفس الاسم مع خريطة تفاعلية ودليل رقمي، في موقع يخدم مدينتي والرحاب والتجمع الخامس. تنظيم أوضح وتجربة حديثة.
                </p>
                <Link to="/new-cairo-branch">
                    <Button variant="ghost" className="gap-1.5 px-0 text-[0.82rem] font-bold text-primary hover:text-primary/80">
                     اكتشف فرع القاهرة الجديدة <ArrowLeft className="h-3.5 w-3.5" />
                   </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* ═══════════ 2.5 · PLATFORM STATS ═══════════ */}
    <section className="relative overflow-hidden py-8 md:py-10" style={{ background: "linear-gradient(135deg, hsl(218, 55%, 8%) 0%, hsl(218, 50%, 12%) 50%, hsl(218, 45%, 10%) 100%)" }}>
      {/* Ambient accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-[15%] -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, #2563EB, transparent 70%)" }} />
        <div className="absolute top-1/2 right-[15%] -translate-y-1/2 w-[300px] h-[300px] rounded-full opacity-[0.03]" style={{ background: "radial-gradient(circle, #CDBB9A, transparent 70%)" }} />
      </div>
      {/* Grid texture */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />

      <div className="relative container max-w-[900px]">
        <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <div className="text-center mb-6">
            <p className="text-[0.62rem] font-bold tracking-[0.18em] uppercase mb-2 text-[#CDBB9A]">المنظومة بالأرقام</p>
            <h2 className="text-[1.3rem] md:text-[1.5rem] font-bold text-[#F8FAFC]">
              أكبر من مول — <span className="text-primary">منظومة تقنية متكاملة.</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: "+460", label: "محلاً", sub: "عبر فرعين رئيسيين" },
              { value: "+100 ألف", label: "منتج", sub: "في كل فئات التقنية" },
              { value: "آلاف", label: "التصنيفات", sub: "تغطية واسعة ومتخصصة" },
              { value: "فرعان", label: "رئيسيان", sub: "وسط البلد والتجمع" },
            ].map((stat, i) => (
              <BranchStatCard key={stat.label} value={stat.value} label={stat.label} sub={stat.sub} index={i} variant="about" />
            ))}
          </div>
        </motion.div>
      </div>
    </section>

    <section className="heritage-deep py-7 md:py-9 relative overflow-hidden">
      <div className="relative container max-w-[900px]">
        <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <div className="text-center mb-6">
            <p className="section-kicker dark-kicker">المسار</p>
            <h2 className="section-title dark-heading">محطات بنت الاسم.</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { year: "1990", label: "البداية", desc: "افتتاح مول البستان في وسط البلد." },
              { year: "2000+", label: "سنوات الثقة", desc: "المول يصبح مرجعاً في سوق الإلكترونيات." },
              { year: "2024", label: "التحول الرقمي", desc: "إطلاق الدليل التفاعلي وسوق المنتجات." },
              { year: "2026", label: "القاهرة الجديدة", desc: "فرع جديد بتجربة منظمة وحديثة." },
            ].map((item, i) => (
              <TimelineCountCard key={item.year} item={item} index={i} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>

    {/* ═══════════ 4 · WHY EL BOSTAN ═══════════ */}
    <section className="py-7 md:py-9 bg-secondary dark:bg-background">
      <div className="container max-w-[900px]">
        <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <div className="text-center mb-5">
            <p className="section-kicker">لماذا البستان</p>
            <h2 className="section-title mx-auto max-w-[20rem]">ما يميّز المكان.</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Award, title: "اسم معروف", desc: "أكثر من 30 عاماً و+460 محلاً عبر فرعين." },
              { icon: Layers, title: "+100 ألف منتج", desc: "آلاف التصنيفات الفرعية تحت سقف واحد." },
              { icon: Store, title: "محلات متخصصة", desc: "تجّار بخبرة حقيقية في كل فئة تقنية." },
              { icon: MapPin, title: "فرعان رئيسيان", desc: "وسط البلد والقاهرة الجديدة." },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-border bg-card p-4 text-center transition-all hover:shadow-[var(--shadow-card)]">
                <div className="mx-auto mb-2.5 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-secondary text-primary">
                  <item.icon className="h-4.5 w-4.5" />
                </div>
                <p className="text-[0.88rem] font-bold light-heading">{item.title}</p>
                <p className="mt-1 text-[0.76rem] leading-[1.6] light-body">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>

    {/* ═══════════ 5 · FROM MARKET TO PLATFORM ═══════════ */}
    <section className="heritage-deep relative overflow-hidden py-7 md:py-9">
      <div className="relative container max-w-[820px]">
        <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <div className="text-center mb-5">
            <p className="section-kicker dark-kicker">الأدوات الرقمية</p>
            <h2 className="section-title dark-heading">من المول إلى المنصة.</h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { icon: Compass, label: "الخريطة التفاعلية", desc: "تصفّح كل دور ومحل بسهولة.", to: "/map" },
              { icon: ShoppingBag, label: "منتجات المحلات", desc: "تصفّح المنتجات من كل المحلات.", to: "/products" },
              { icon: Users, label: "دليل المحلات", desc: "تعرّف على كل محل وتخصصه.", to: "/stores" },
            ].map((item) => (
              <Link key={item.label} to={item.to} className="heritage-surface rounded-xl p-5 text-center group transition-all border border-transparent hover:border-primary/20">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/[0.08] border border-primary/[0.15]">
                  <item.icon className="h-4.5 w-4.5 text-primary" />
                </div>
                <p className="text-[0.88rem] font-bold dark-heading">{item.label}</p>
                <p className="mt-1 text-[0.76rem] leading-[1.6] dark-muted">{item.desc}</p>
                <span className="mt-2.5 inline-flex items-center gap-1 text-[0.76rem] font-bold text-primary group-hover:gap-2 transition-all">
                  استكشف <ArrowLeft className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </section>

    {/* ═══════════ 6 · CLOSING CTA ═══════════ */}
    <section className="py-7 md:py-9 bg-secondary dark:bg-background">
      <div className="container max-w-[720px] text-center">
        <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-[2px] w-5 rounded-full bg-[#CDBB9A]" />
            <span className="font-poppins text-[0.58rem] font-bold tracking-[0.22em] uppercase text-muted-foreground">ابدأ من هنا</span>
            <div className="h-[2px] w-5 rounded-full bg-[#CDBB9A]" />
          </div>
          <h2 className="mx-auto max-w-[22rem] text-[1.2rem] font-bold leading-[1.15] md:text-[1.45rem] light-heading">
            ابدأ من هنا.
          </h2>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Link to="/map">
              <Button variant="cta" className="h-9 rounded-lg px-5 text-[0.82rem] font-bold">
                <Compass className="ml-2 h-4 w-4" /> استكشف الخريطة
              </Button>
            </Link>
            <Link to="/products">
              <Button variant="secondary" className="h-9 rounded-lg px-5 text-[0.82rem] font-bold">منتجات المحلات</Button>
            </Link>
            <Link to="/downtown-branch">
              <Button variant="outline-blue" className="h-9 rounded-lg px-5 text-[0.82rem] font-bold">فرع وسط البلد</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  </MainLayout>
);

export default About;

function TimelineCountCard({ item, index }: { item: { year: string; label: string; desc: string }; index: number }) {
  const parsed = parseStatValue(item.year);
  const isNumeric = parsed.num > 0;

  const { ref, display } = useCountUp({
    end: parsed.num,
    prefix: parsed.prefix,
    suffix: parsed.suffix,
    duration: 1800,
    startOnView: true,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="heritage-surface rounded-xl p-4 text-center"
    >
      <p
        ref={ref as React.Ref<HTMLParagraphElement>}
        className="font-poppins text-[1.4rem] font-extrabold dark-heading"
      >
        {isNumeric ? display : item.year}
      </p>
      <p className="mt-1 text-[0.82rem] font-bold" style={{ color: "#CDBB9A" }}>{item.label}</p>
      <p className="mt-1.5 text-[0.76rem] leading-[1.6] dark-muted">{item.desc}</p>
    </motion.div>
  );
}
