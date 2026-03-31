import { motion } from "framer-motion";
import { ArrowLeft, Layers3, MapPin, Sparkles, Store } from "lucide-react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import interiorImage from "@/assets/mall-interior.jpg";
import exteriorImage from "@/assets/mall-exterior.jpg";

const About = () => (
  <MainLayout>
    <SEOHead title="عن المول" titleEn="About" description="تعرف على رؤية مول البستان كوجهة تقنية مصرية راقية في القاهرة الجديدة." descriptionEn="Learn about Mall Elbostan as a premium Egyptian technology mall in New Cairo." breadcrumbs={[{ name: "عن المول", url: "/about" }]} />

    <section className="pb-16">
      <div className="container">
        <div className="brand-shell page-halo grid gap-7 overflow-hidden rounded-[2.5rem] px-5 py-6 md:px-8 md:py-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-10">
          <div className="space-y-5">
            <div className="eyebrow-chip">عن المشروع</div>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-foreground md:text-[3.3rem]">مول البستان علامة تقنية مصرية بتجربة أوضح وحضور أهدأ</h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              المشروع لا يقدّم مجرد مجموعة متاجر، بل وجهة تقنية بهوية واضحة وتجربة أسهل في الاستكشاف.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Layers3, title: "هوية معمارية واضحة", desc: "واجهة ومشهد داخلي يثبتان شخصية المشروع." },
                { icon: MapPin, title: "موقع يخدم شرق القاهرة", desc: "قريب من مناطق الحركة والطلب الأساسية." },
              ].map((item) => (
                <div key={item.title} className="editorial-panel rounded-[1.5rem] p-5">
                  <item.icon className="icon-shell mb-4 h-11 w-11 p-2.5" />
                  <h2 className="text-lg font-bold text-foreground">{item.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
            <Link to="/stores" className="inline-flex">
              <Button variant="cta" size="lg" className="rounded-xl px-7">
                استكشف المتاجر
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="image-shell overflow-hidden rounded-[2.2rem] border border-border/70 shadow-[var(--shadow-elevated)]">
            <img src={exteriorImage} alt="الواجهة المعمارية لمول البستان" className="h-[420px] w-full object-cover object-[center_30%]" />
            <div className="image-wash absolute inset-0" />
          </div>
        </div>
      </div>
    </section>

    <div className="container max-w-6xl py-4 md:py-8">
      <div className="mb-16 grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
        <div className="section-shell p-6 md:p-8">
          <p className="section-kicker">رؤية المول</p>
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">تجربة تقنية أوضح للزائر والعلامة</h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">المكان مصمم ليكون مقنعًا للزائر ومفيدًا تجاريًا للعلامات من البداية.</p>
        </div>
        <div className="space-y-6 text-foreground/90 leading-relaxed">
          <p className="text-lg">مول البستان يركّز على جمهور التقنية بتجربة مرتبة وواضحة، من أول النظرة إلى سهولة الوصول للمعلومة.</p>
          <p>الهدف أن تكون التجربة على الأرض والموقع بنفس الدرجة من الوضوح والاتساق.</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="section-shell relative mb-16 overflow-hidden rounded-[2.2rem] p-3 shadow-[var(--shadow-elevated)]"
      >
        <img src={interiorImage} alt="الأتريوم الداخلي لمول البستان" className="h-[360px] w-full rounded-[1.5rem] object-cover md:h-[460px]" />
        <div className="image-wash absolute inset-3 rounded-[1.5rem]" />
        <div className="glass absolute bottom-8 right-8 max-w-md rounded-[1.4rem] p-5">
          <p className="mb-1 text-xl font-bold text-foreground">المشهد الداخلي يعزّز ثقة التجربة</p>
          <p className="text-sm leading-7 text-muted-foreground">تنظيم بصري يدعم الحركة والعرض ويعكس حضورًا تجاريًا أكثر نضجًا.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
          { icon: Store, title: "فئات ومتاجر مختارة", desc: "تنظيم مدروس يسهّل الوصول للفئة المناسبة." },
          { icon: Sparkles, title: "افتتاح يبني الترقب", desc: "حملة إطلاق مختصرة وواضحة تشجع على المتابعة." },
          { icon: MapPin, title: "قيمة مكانية واضحة", desc: "الموقع يدعم الزيارة والحضور التجاري في شرق القاهرة." },
        ].map((item) => (
          <div key={item.title} className="section-shell p-6">
            <item.icon className="icon-shell mb-4 h-11 w-11 p-2.5" />
            <h3 className="mb-2 font-bold text-foreground">{item.title}</h3>
            <p className="text-sm leading-7 text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </MainLayout>
);

export default About;