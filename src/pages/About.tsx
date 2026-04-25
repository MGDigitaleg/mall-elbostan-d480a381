import { motion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  Compass,
} from "lucide-react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead, buildOrganizationLd } from "@/components/SEOHead";
import { useSitePhone } from "@/hooks/useSitePhone";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { BranchStatCard } from "@/components/branch/BranchStatCard";
import aboutDowntownCard from "@/assets/about-downtown-card.webp";
import aboutNewCairoCard from "@/assets/about-newcairo-card.webp";

const sectionReveal = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const About = () => {
  const { phone } = useSitePhone();
  const organizationLd = buildOrganizationLd(phone);
  return (
  <MainLayout>
    <SEOHead
      title="عن مول البستان — أقدم وأكبر مول تكنولوجيا في مصر منذ 1990"
      titleEn="About Mall Elbostan — Egypt's Oldest & Largest Tech Mall Since 1990"
      description="تعرف على مول البستان — أول مول متخصص في الكمبيوتر والإلكترونيات في مصر منذ 1990. فرعان في وسط البلد والتجمع الخامس، أكثر من 150 محل، وخريطة تفاعلية."
      descriptionEn="Learn about Mall Elbostan — Egypt's first specialized technology mall since 1990. Two branches, 150+ stores, and an interactive floor map."
      keywords="عن مول البستان, تاريخ مول البستان, مول تكنولوجيا مصر, أقدم مول إلكترونيات, القاهرة الجديدة, وسط البلد"
      breadcrumbs={[{ name: "عن المول", url: "/about" }]}
      jsonLd={organizationLd}
    />

    {/* ═══════════ 1 · HERO (compact, no image — branch cards below carry imagery) ═══════════ */}
    <PageHero
      kicker="من نحن"
      kickerEn="About Us"
      title={<>اسم <span style={{ color: "#CDBB9A" }}>يعرفه السوق.</span></>}
      subtitle="من وسط البلد إلى القاهرة الجديدة — نفس الثقة، تجربة أوضح."
      compact
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

    {/* ═══════════ 3 · WHY MALL ELBOSTAN — consolidated value block (merged with timeline highlights) ═══════════ */}
    <section className="py-7 md:py-9 bg-secondary dark:bg-background">
      <div className="container max-w-[980px]">
        <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <div className="text-center mb-5">
            <p className="section-kicker">حول الوجهة</p>
            <h2 className="section-title mx-auto max-w-[26rem]">لماذا مول البستان؟</h2>
          </div>

          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-[var(--shadow-card)]">
            <div className="grid divide-y divide-border md:divide-y-0 md:divide-x md:divide-x-reverse md:grid-cols-2">
              {[
                {
                  icon: Building2,
                  title: "إرث منذ 1990 — منظومة متكاملة",
                  body: (
                    <>
                      <strong className="text-foreground">مول البستان</strong> هو أول مول متخصص في الكمبيوتر والإلكترونيات في مصر منذ عام 1990. أكثر من 460 محلاً عبر فرعين، بتغطية تقنية تشمل{" "}
                      <Link to="/stores?category=الكمبيوتر والأجهزة" className="text-primary font-semibold hover:underline">الكمبيوتر</Link>،{" "}
                      <Link to="/stores?category=الهواتف والإكسسوارات" className="text-primary font-semibold hover:underline">الهواتف</Link>،{" "}
                      <Link to="/stores?category=الألعاب والترفيه" className="text-primary font-semibold hover:underline">الجيمنج</Link>،{" "}
                      و<Link to="/stores?category=الصيانة والدعم الفني" className="text-primary font-semibold hover:underline">الصيانة</Link>.
                    </>
                  ),
                },
                {
                  icon: Compass,
                  title: "تجربة منظمة في موقع مركزي",
                  body: (
                    <>
                      فرع القاهرة الجديدة يخدم <strong className="text-foreground">التجمع</strong>،{" "}
                      <strong className="text-foreground">مدينتي</strong> و<strong className="text-foreground">الرحاب</strong>، مع{" "}
                      <Link to="/map" className="text-primary font-semibold hover:underline">خريطة تفاعلية</Link> و
                      <Link to="/products" className="text-primary font-semibold hover:underline"> كتالوج منتجات</Link> لمقارنة الأسعار قبل الزيارة.
                    </>
                  ),
                },
              ].map((card) => (
                <div key={card.title} className="flex gap-4 p-5 md:p-6">
                  <div className="shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-secondary text-primary">
                      <card.icon className="h-4.5 w-4.5" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[0.95rem] font-bold light-heading mb-1.5">{card.title}</h3>
                    <p className="text-[0.82rem] leading-[1.85] light-body">{card.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* (Removed "From market to platform" — overlapped with the Why-block links and the closing CTA) */}

    {/* ═══════════ 6 · CLOSING CTA ═══════════ */}
    <section className="py-5 md:py-7 bg-secondary dark:bg-background">
      <div className="container max-w-[720px] text-center">
        <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h2 className="mx-auto max-w-[22rem] text-[1.1rem] md:text-[1.3rem] font-bold leading-[1.15] light-heading">
            ابدأ من هنا.
          </h2>
          <p className="mt-2.5 text-[0.82rem] leading-[1.7] text-muted-foreground max-w-[26rem] mx-auto">
            ابدأ تجربة المول من الخريطة التفاعلية — كل المحلات والفئات في مكان واحد.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Link to="/map">
              <Button variant="cta" className="h-10 rounded-lg px-6 text-[0.86rem] font-bold">
                <Compass className="ml-2 h-4 w-4" /> استكشف الخريطة التفاعلية
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  </MainLayout>
  );
};

export default About;
