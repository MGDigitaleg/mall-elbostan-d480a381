import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { Building2, Award, Users, Globe, MapPin, Phone, Mail, Clock, ExternalLink, ArrowLeft, Layers, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LocationMapSection, DOWNTOWN_LOCATION } from "@/components/location/LocationMapSection";
import { BranchHeroSlider } from "@/components/branch/BranchHeroSlider";

import downtownHero1 from "@/assets/downtown-hero-1.jpg";
import downtownHero5 from "@/assets/downtown-hero-5.jpg";
import downtownHero6 from "@/assets/downtown-hero-6.jpg";
import downtownHero7 from "@/assets/downtown-hero-7.jpg";
import downtownHero8 from "@/assets/downtown-hero-8.jpg";

/* 3 distinct slides: wide exterior, street angle, interior corridor */
const heroSlides = [
  { src: downtownHero1, alt: "واجهة مول البستان التجاري — وسط البلد" },
  { src: downtownHero5, alt: "مول البستان — الواجهة الرئيسية نهاراً" },
  { src: downtownHero6, alt: "داخل المول — محلات التقنية والإلكترونيات" },
];

const sectionReveal = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const DowntownBranch = () => (
  <MainLayout>
    <SEOHead
      title="فرع وسط البلد"
      titleEn="Downtown Branch"
      description="مول البستان وسط البلد — الفرع الأصلي منذ 1990. وجهة مصر التقنية التاريخية في قلب القاهرة."
      descriptionEn="Mall Elbostan Downtown — the original branch since 1990."
      breadcrumbs={[{ name: "فرع وسط البلد", url: "/downtown-branch" }]}
    />

    {/* ═══════════ 1 · HERO ═══════════ */}
    <BranchHeroSlider
      slides={heroSlides}
      kicker="الفرع الأصلي — منذ 1990"
      title={<>مول البستان — <span style={{ color: "#60A5FA" }}>وسط البلد</span></>}
      subtitle="حيث بدأت القصة — الوجهة التقنية الأعرق في مصر. إحدى مشروعات مجموعة العباسي."
    />

    {/* ═══════════ 2 · IDENTITY INTRO ═══════════ */}
    <section className="py-10 md:py-14" style={{ background: "#FAFAF8" }}>
      <div className="container max-w-5xl">
        <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <div className="max-w-2xl mx-auto text-center">
            <p className="section-kicker">البداية</p>
            <h2 className="section-title">المكان الذي اختاره السوق.</h2>
            <p className="mt-3 text-[0.86rem] leading-[1.85] text-muted-foreground max-w-xl mx-auto">
              منذ 1990، أثبت مول البستان مكانته كوجهة أولى للتقنية والإلكترونيات في مصر.
              لم يُبنَ الاسم بالإعلان — بل بثقة التجار والزبائن على مدار أكثر من ثلاثة عقود.
            </p>
          </div>
        </motion.div>
      </div>
    </section>

    {/* ═══════════ 3 · QUICK FACTS ═══════════ */}
    <section className="relative overflow-hidden py-12 md:py-16" style={{ background: "linear-gradient(160deg, #071326 0%, #0D1F3C 50%, #071326 100%)" }}>
      {/* Decorative */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, #2563EB 0%, transparent 70%)" }} />
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      <div className="container relative max-w-5xl">
        <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Building2, title: "تأسيس 1990", desc: "أول مركز تقنية متخصص في مصر.", color: "#2563EB" },
              { icon: Award, title: "إرث تجاري", desc: "أكثر من ثلاثة عقود من الثقة.", color: "#06B6D4" },
              { icon: Users, title: "مقصد التجار", desc: "وجهة التجار والمستوردين.", color: "#F97316" },
              { icon: Globe, title: "جملة وتجزئة", desc: "استيراد وتوزيع وبيع مباشر.", color: "#10B981" },
            ].map((c) => (
              <div
                key={c.title}
                className="rounded-2xl p-5 transition-all hover:bg-white/[0.04]"
                style={{ background: "#ffffff05", border: "1px solid #ffffff0D" }}
              >
                <div
                  className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: `${c.color}15`, border: `1px solid ${c.color}28` }}
                >
                  <c.icon className="h-5 w-5" style={{ color: c.color }} />
                </div>
                <p className="text-[0.88rem] font-bold" style={{ color: "#F1F5F9" }}>{c.title}</p>
                <p className="mt-1 text-[0.8rem] leading-relaxed" style={{ color: "#94A3B8" }}>{c.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {[
              { v: "1990", l: "سنة التأسيس" },
              { v: "30+", l: "عامًا في السوق" },
              { v: "مئات", l: "التجار والعلامات" },
              { v: "ملايين", l: "الزوار عبر السنين" },
            ].map((s) => (
              <div
                key={s.l}
                className="rounded-xl px-4 py-5 text-center"
                style={{ background: "#ffffff06", border: "1px solid #ffffff0D" }}
              >
                <p className="font-poppins text-[1.4rem] font-extrabold" style={{ color: "#F8FAFC" }}>{s.v}</p>
                <p className="mt-1 text-[0.72rem] font-semibold" style={{ color: "#7C8BA1" }}>{s.l}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>

    {/* ═══════════ 4 · GALLERY MOSAIC ═══════════ */}
    <section className="py-10 md:py-14" style={{ background: "#FAFAF8" }}>
      <div className="container max-w-5xl">
        <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <p className="section-kicker mb-4">من داخل المول</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="col-span-2 row-span-2 overflow-hidden rounded-2xl">
              <img src={downtownHero6} alt="محلات التقنية من الداخل" className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy" />
            </div>
            <div className="overflow-hidden rounded-2xl">
              <img src={downtownHero7} alt="ممرات المول الداخلية" className="aspect-square w-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy" />
            </div>
            <div className="overflow-hidden rounded-2xl">
              <img src={downtownHero8} alt="محلات الكمبيوتر" className="aspect-square w-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy" />
            </div>
            <div className="overflow-hidden rounded-2xl">
              <img src={downtownHero3} alt="واجهة المول" className="aspect-square w-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy" />
            </div>
            <div className="overflow-hidden rounded-2xl">
              <img src={downtownHero4} alt="المول عند الغروب" className="aspect-square w-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* ═══════════ 5 · DOWNTOWN DIRECTORY TEASER ═══════════ */}
    <section className="relative overflow-hidden py-10 md:py-14" style={{ background: "linear-gradient(160deg, #071326 0%, #0D1F3C 50%, #071326 100%)" }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-[20%] w-[400px] h-[400px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, #CDBB9A, transparent 70%)" }} />
      </div>

      <div className="container relative max-w-5xl">
        <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.8fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-4" style={{ background: "#CDBB9A14", border: "1px solid #CDBB9A25" }}>
                <Store className="h-3 w-3" style={{ color: "#CDBB9A" }} />
                <span className="text-[0.66rem] font-bold" style={{ color: "#CDBB9A" }}>دليل المحلات</span>
              </div>
              <h2 className="text-[1.2rem] md:text-[1.4rem] font-bold leading-[1.15] max-w-[20rem]" style={{ fontFamily: "var(--font-arabic-display)", color: "#F8FAFC" }}>
                اسم يعرفه كل من دخل السوق.
              </h2>
              <p className="mt-3 text-[0.84rem] leading-[1.85] max-w-md" style={{ color: "#94A3B8" }}>
                تصفّح دليل محلات فرع وسط البلد — تخصصات متنوعة من هواتف وكمبيوتر وقطع غيار وصيانة وشبكات تحت سقف واحد.
              </p>
              <div className="mt-5">
                <Link to="/downtown-directory">
                  <Button variant="cta" className="h-10 rounded-xl px-6 text-[0.82rem] font-bold gap-1.5 shadow-lg shadow-primary/20">
                    <Store className="h-3.5 w-3.5" /> تصفّح الدليل
                  </Button>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { icon: Layers, title: "تخصصات متنوعة", desc: "كل ما يحتاجه السوق.", color: "#2563EB" },
                { icon: Award, title: "ثقة بالعودة", desc: "الاسم بُني بالتجربة.", color: "#06B6D4" },
                { icon: Users, title: "مجتمع التجار", desc: "مئات التجار والفنيين.", color: "#F97316" },
                { icon: Globe, title: "حركة مستمرة", desc: "زبائن من كل مصر.", color: "#10B981" },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl p-4 transition-all hover:bg-white/[0.04]"
                  style={{ background: "#ffffff05", border: "1px solid #ffffff0D" }}
                >
                  <div
                    className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{ background: `${item.color}15`, border: `1px solid ${item.color}28` }}
                  >
                    <item.icon className="h-4 w-4" style={{ color: item.color }} />
                  </div>
                  <p className="text-[0.82rem] font-bold" style={{ color: "#F1F5F9" }}>{item.title}</p>
                  <p className="mt-0.5 text-[0.72rem]" style={{ color: "#7C8BA1" }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* ═══════════ 6 · LOCATION MAP ═══════════ */}
    <LocationMapSection {...DOWNTOWN_LOCATION} />

    {/* ═══════════ 7 · CTA ═══════════ */}
    <section className="relative overflow-hidden py-14 md:py-20" style={{ background: "linear-gradient(160deg, #071326 0%, #0D1F3C 50%, #071326 100%)" }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full opacity-[0.05]" style={{ background: "radial-gradient(circle, #2563EB 0%, transparent 70%)" }} />
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      <div className="container relative max-w-[740px] text-center">
        <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          {/* Divider accent */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 rounded-full" style={{ background: "linear-gradient(to left, #CDBB9A, transparent)" }} />
            <span className="font-poppins text-[0.6rem] font-bold tracking-[0.22em] uppercase" style={{ color: "#CDBB9A" }}>معلومات الفرع</span>
            <div className="h-px w-12 rounded-full" style={{ background: "linear-gradient(to right, #CDBB9A, transparent)" }} />
          </div>

          <h2 className="text-[1.2rem] md:text-[1.5rem] font-bold leading-[1.15]" style={{ fontFamily: "var(--font-arabic-display)", color: "#F8FAFC" }}>
            تواصل مع مول البستان.
          </h2>

          {/* Contact cards */}
          <div className="mt-6 mx-auto max-w-md grid grid-cols-2 gap-2.5">
            {[
              { icon: MapPin, label: "العنوان", value: "شارع البستان، وسط البلد، القاهرة", color: "#2563EB" },
              { icon: Phone, label: "الخط الساخن", value: "15215", color: "#06B6D4", dir: "ltr" as const },
              { icon: Mail, label: "البريد", value: "info@albostan-mall.com", color: "#F97316", dir: "ltr" as const },
              { icon: Clock, label: "المواعيد", value: "يوميًا من الصباح حتى المساء", color: "#10B981" },
            ].map((c) => (
              <div
                key={c.label}
                className="rounded-xl p-4 text-right"
                style={{ background: "#ffffff05", border: "1px solid #ffffff0D" }}
              >
                <div
                  className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ background: `${c.color}15`, border: `1px solid ${c.color}28` }}
                >
                  <c.icon className="h-4 w-4" style={{ color: c.color }} />
                </div>
                <p className="text-[0.68rem] font-semibold" style={{ color: "#7C8BA1" }}>{c.label}</p>
                <p className={`mt-0.5 text-[0.8rem] font-bold ${c.dir === "ltr" ? "font-poppins" : ""}`} dir={c.dir} style={{ color: "#F1F5F9" }}>
                  {c.value}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-5 text-[0.8rem] max-w-sm mx-auto" style={{ color: "#7C8BA1" }}>
            إحدى مشروعات <strong style={{ color: "#CBD5E1" }}>مجموعة العباسي</strong> — أكثر من 30 عامًا في تطوير وإدارة المنشآت التجارية المتخصصة.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-2.5">
            <Link to="/contact">
              <Button variant="cta" className="h-10 rounded-xl px-6 text-[0.82rem] font-bold shadow-lg shadow-primary/20">تواصل معنا</Button>
            </Link>
            <Link to="/new-cairo-branch">
              <Button
                className="h-10 rounded-xl border px-5 text-[0.82rem] font-bold transition-colors hover:bg-white/[0.06] gap-1.5"
                style={{ borderColor: "#ffffff18", background: "#ffffff06", color: "#CBD5E1" }}
              >
                فرع القاهرة الجديدة <ArrowLeft className="h-3.5 w-3.5" />
              </Button>
            </Link>
            <a href="https://alabbasy-group.com/ar/index/" target="_blank" rel="noopener noreferrer">
              <Button
                className="h-10 rounded-xl border px-4 text-[0.82rem] gap-1.5 transition-colors hover:bg-white/[0.06]"
                style={{ borderColor: "#ffffff10", background: "transparent", color: "#7C8BA1" }}
              >
                <ExternalLink className="h-3.5 w-3.5" /> مجموعة العباسي
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  </MainLayout>
);

export default DowntownBranch;
