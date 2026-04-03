import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { Building2, Award, Users, Globe, MapPin, Phone, Mail, Clock, ExternalLink, ArrowLeft, Layers, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LocationMapSection, DOWNTOWN_LOCATION } from "@/components/location/LocationMapSection";
import { BranchHeroSlider } from "@/components/branch/BranchHeroSlider";

import downtownNightPolished from "@/assets/downtown-night-polished.jpg";
import downtownExteriorPolished from "@/assets/downtown-exterior-polished.jpg";
import downtownInterior1 from "@/assets/downtown-interior-1.jpg";
import downtownInterior2 from "@/assets/downtown-interior-2.jpg";
import downtownInterior3 from "@/assets/downtown-interior-3.jpg";

const heroSlides = [
  { src: downtownNightPolished, alt: "مول البستان — المنظر الليلي، وسط البلد" },
  { src: downtownExteriorPolished, alt: "الواجهة الرئيسية — مول البستان وسط البلد" },
  { src: downtownInterior1, alt: "داخل المول — الممرات الرئيسية" },
  { src: downtownInterior2, alt: "الطوابق الداخلية — مول البستان" },
  { src: downtownInterior3, alt: "المحلات الداخلية — مول البستان" },
];

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
      title={<>مول البستان — <span className="text-accent">وسط البلد</span></>}
      subtitle="حيث بدأت القصة — الوجهة التقنية الأعرق في مصر. إحدى مشروعات مجموعة العباسي."
    />

    {/* ═══════════ 2 · IDENTITY INTRO ═══════════ */}
    <section className="py-9 md:py-12 bg-card">
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
    <section className="py-8 md:py-10 bg-background">
      <div className="container max-w-5xl">
        <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Building2, title: "تأسيس 1990", desc: "أول مركز تقنية متخصص في مصر." },
              { icon: Award, title: "إرث تجاري", desc: "أكثر من ثلاثة عقود من الثقة." },
              { icon: Users, title: "مقصد التجار", desc: "وجهة التجار والمستوردين." },
              { icon: Globe, title: "جملة وتجزئة", desc: "استيراد وتوزيع وبيع مباشر." },
            ].map((c) => (
              <div key={c.title} className="rounded-lg border border-border bg-card p-4 transition-all hover:shadow-[var(--shadow-card)]">
                <c.icon className="mb-2 h-5 w-5 text-primary" />
                <p className="text-[0.88rem] font-bold text-foreground">{c.title}</p>
                <p className="mt-1 text-[0.8rem] leading-relaxed text-muted-foreground">{c.desc}</p>
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
              <div key={s.l} className="rounded-lg border border-border bg-card px-3 py-4 text-center">
                <p className="font-poppins text-[1.3rem] font-extrabold text-foreground">{s.v}</p>
                <p className="mt-1 text-[0.7rem] font-semibold text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>

    {/* ═══════════ 4 · LOCATION MAP ═══════════ */}
    <LocationMapSection {...DOWNTOWN_LOCATION} />

    {/* ═══════════ 5 · DOWNTOWN DIRECTORY TEASER ═══════════ */}
    <section className="py-9 md:py-12 bg-card">
      <div className="container max-w-5xl">
        <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <div className="grid items-center gap-6 lg:grid-cols-[1fr_0.8fr]">
            <div>
              <p className="section-kicker">دليل المحلات</p>
              <h2 className="section-title max-w-[20rem]">اسم يعرفه كل من دخل السوق.</h2>
              <p className="mt-3 text-[0.84rem] leading-[1.85] text-muted-foreground max-w-md">
                تصفّح دليل محلات فرع وسط البلد — تخصصات متنوعة من هواتف وكمبيوتر وقطع غيار وصيانة وشبكات تحت سقف واحد.
              </p>
              <div className="mt-4 flex flex-wrap gap-2.5">
                <Link to="/downtown-directory">
                  <Button variant="cta" className="h-9 rounded-lg px-5 text-[0.8rem] font-bold gap-1.5">
                    <Store className="h-3.5 w-3.5" /> تصفّح الدليل
                  </Button>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: Layers, title: "تخصصات متنوعة", desc: "كل ما يحتاجه السوق." },
                { icon: Award, title: "ثقة بالعودة", desc: "الاسم بُني بالتجربة." },
                { icon: Users, title: "مجتمع التجار", desc: "مئات التجار والفنيين." },
                { icon: Globe, title: "حركة مستمرة", desc: "زبائن من كل مصر." },
              ].map((item) => (
                <div key={item.title} className="rounded-lg border border-border bg-background p-3.5">
                  <item.icon className="h-4 w-4 text-primary mb-1.5" />
                  <p className="text-[0.8rem] font-bold text-foreground">{item.title}</p>
                  <p className="mt-0.5 text-[0.72rem] text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* ═══════════ 6 · SMALL GALLERY ═══════════ */}
    <section className="py-8 md:py-10 bg-background">
      <div className="container max-w-5xl">
        <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <p className="section-kicker mb-3">من داخل المول</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { src: downtownInterior2, alt: "الطوابق الداخلية" },
              { src: downtownInterior3, alt: "المحلات الداخلية" },
              { src: downtownExterior, alt: "الواجهة الرئيسية" },
            ].map((img, i) => (
              <div key={i} className="overflow-hidden rounded-lg">
                <img src={img.src} alt={img.alt} className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy" />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>

    {/* ═══════════ 7 · CTA ═══════════ */}
    <section className="heritage-deep py-10 md:py-14 relative overflow-hidden">
      <div className="container max-w-3xl relative text-center">
        <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <p className="section-kicker dark-kicker">معلومات الفرع</p>
          <h2 className="section-title dark-heading">تواصل مع مول البستان.</h2>

          <div className="mt-5 mx-auto max-w-md space-y-3 text-[0.84rem] text-navy-foreground/70 text-right">
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-primary shrink-0" />
              <span>شارع البستان، وسط البلد، القاهرة، مصر</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-primary shrink-0" />
              <span>الخط الساخن: <span className="font-poppins font-bold" dir="ltr">15215</span></span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-primary shrink-0" />
              <span className="font-poppins" dir="ltr">info@albostan-mall.com</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-primary shrink-0" />
              <span>يوميًا من الصباح حتى المساء</span>
            </div>
          </div>

          <p className="mt-4 text-[0.8rem] text-navy-foreground/60 max-w-sm mx-auto">
            إحدى مشروعات <strong className="text-navy-foreground/80">مجموعة العباسي</strong> — أكثر من 30 عامًا في تطوير وإدارة المنشآت التجارية المتخصصة.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2.5">
            <Link to="/contact">
              <Button variant="cta" className="h-9 rounded-lg px-5 text-[0.8rem] font-bold">تواصل معنا</Button>
            </Link>
            <Link to="/new-cairo-branch">
              <Button className="h-9 rounded-lg border px-5 text-[0.8rem] font-bold" style={{ borderColor: "hsl(var(--navy-foreground) / 0.15)", background: "hsl(var(--navy-foreground) / 0.05)", color: "hsl(var(--navy-foreground) / 0.85)" }}>
                فرع القاهرة الجديدة
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
            <a href="https://alabbasy-group.com/ar/index/" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" className="h-9 rounded-lg px-4 text-[0.8rem] gap-1.5" style={{ color: "hsl(var(--navy-foreground) / 0.6)" }}>
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
