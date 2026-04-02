import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { MapPin, Clock, Phone, Building2, Award, Users, Globe, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const sectionReveal = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const DowntownBranch = () => (
  <MainLayout>
    <SEOHead
      title="فرع وسط البلد"
      titleEn="Downtown Branch"
      description="مول البستان وسط البلد — الفرع الأصلي منذ 1990. وجهة مصر التقنية التاريخية في قلب القاهرة."
      descriptionEn="Mall Elbostan Downtown — the original branch since 1990. Egypt's historic technology destination in the heart of Cairo."
      breadcrumbs={[{ name: "فرع وسط البلد", url: "/downtown-branch" }]}
    />

    {/* Hero */}
    <section className="relative min-h-[44vh] flex items-end overflow-hidden" style={{ background: "#071326" }}>
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 60%, #2D6BFF08, transparent 70%)" }} />
      <div className="container relative z-10 pb-12 pt-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-[2px] w-8 rounded-full" style={{ background: "#CDBB9A" }} />
            <span className="font-poppins text-[0.58rem] font-bold tracking-[0.22em] uppercase" style={{ color: "#CDBB9A" }}>
              الفرع الأصلي — منذ 1990
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold dark-heading max-w-[28rem]">
            مول البستان <span style={{ color: "#CDBB9A" }}>وسط البلد</span>
          </h1>
          <p className="mt-3 max-w-[28rem] text-[0.92rem] leading-[1.85] dark-body">
            حيث بدأت القصة — الوجهة التقنية الأعرق في مصر، في قلب القاهرة التاريخي.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Origin Story */}
    <section className="py-10 md:py-14" style={{ background: "#FAFAF8" }}>
      <div className="container max-w-4xl">
        <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <div className="chapter-shell pt-4 mb-6">
            <p className="section-kicker">البداية</p>
            <h2 className="section-title max-w-[22rem]">حيث وُلدت الثقة.</h2>
          </div>

          <div className="space-y-4 text-[0.92rem] leading-[1.85] light-body max-w-[36rem]">
            <p>
              في عام 1990، افتتح مول البستان أبوابه في وسط البلد ليصبح أول مركز تجاري متخصص في الإلكترونيات والتقنية في مصر.
              منذ ذلك الحين، بنى المول سمعة راسخة كمرجع موثوق للمتسوقين والتجار على حد سواء.
            </p>
            <p>
              ارتبط الاسم بالاستيراد، والتجارة، والصيانة، والتوزيع — ليصبح عنوانًا لا يحتاج تعريفًا في سوق التقنية المصري.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mt-8">
            {[
              { icon: Building2, title: "تأسيس 1990", desc: "أول مركز تقنية متخصص في مصر." },
              { icon: Award, title: "إرث تجاري", desc: "أكثر من ثلاثة عقود من الثقة." },
              { icon: Users, title: "مقصد التجار", desc: "وجهة التجار والمستوردين." },
              { icon: Globe, title: "سوق الجملة والتجزئة", desc: "استيراد وتوزيع وبيع مباشر." },
            ].map((c) => (
              <div key={c.title} className="card-architectural rounded-lg p-4">
                <c.icon className="mb-2 h-5 w-5 text-primary" />
                <p className="text-[0.88rem] font-bold light-heading">{c.title}</p>
                <p className="mt-1 text-[0.8rem] leading-6 light-body">{c.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>

    {/* Market Reputation */}
    <section className="heritage-deep py-10 md:py-14 relative overflow-hidden">
      <div className="relative container max-w-4xl">
        <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <div className="mb-6">
            <p className="section-kicker dark-kicker">السمعة السوقية</p>
            <h2 className="section-title dark-heading max-w-[22rem]">اسم يعرفه كل من دخل السوق.</h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { icon: Layers, title: "تخصصات متنوعة", desc: "هواتف، كمبيوتر، قطع غيار، طباعة، شبكات، وأنظمة مراقبة — كل ما يحتاجه السوق تحت سقف واحد." },
              { icon: Award, title: "ثقة بالعودة", desc: "الزبون الذي يشتري مرة يعود عشرات المرات. هذا ما بنى الاسم." },
              { icon: Users, title: "مجتمع التجار", desc: "مئات التجار والفنيين بنوا أعمالهم داخل المول وأصبحوا جزءًا من هويته." },
              { icon: Globe, title: "حركة مستمرة", desc: "وسط البلد يعني حركة دائمة — زبائن من كل أنحاء مصر يقصدون هذا العنوان." },
            ].map((item) => (
              <div key={item.title} className="heritage-surface rounded-lg p-4">
                <item.icon className="mb-2 h-5 w-5" style={{ color: "#5B9AFF" }} />
                <p className="text-[0.92rem] font-bold dark-heading">{item.title}</p>
                <p className="mt-1 text-[0.84rem] leading-7 dark-body">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
            {[
              { v: "1990", l: "سنة التأسيس" },
              { v: "30+", l: "عامًا في السوق" },
              { v: "مئات", l: "التجار والعلامات" },
              { v: "ملايين", l: "الزوار عبر السنين" },
            ].map((s) => (
              <div key={s.l} className="heritage-surface rounded-lg px-3 py-4 text-center">
                <p className="font-poppins text-[1.3rem] font-extrabold dark-heading">{s.v}</p>
                <p className="mt-1 text-[0.7rem] font-semibold dark-muted">{s.l}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>

    {/* Branch Info */}
    <section className="py-10 md:py-14" style={{ background: "#FAFAF8" }}>
      <div className="container max-w-4xl">
        <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="surface-panel rounded-[1.75rem] p-8">
            <h2 className="text-xl font-bold text-foreground mb-6">معلومات الفرع</h2>
            <div className="space-y-4 text-muted-foreground">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <div><strong className="text-foreground">العنوان:</strong> وسط البلد — القاهرة</div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary shrink-0" />
                <div><strong className="text-foreground">مواعيد العمل:</strong> يوميًا من الصباح حتى المساء</div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <div><strong className="text-foreground">للاستفسار:</strong> تواصل معنا عبر صفحة الاتصال</div>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/contact">
                <Button variant="outline-blue">تواصل معنا</Button>
              </Link>
              <Link to="/new-cairo-branch">
                <Button variant="cta">فرع القاهرة الجديدة</Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  </MainLayout>
);

export default DowntownBranch;
