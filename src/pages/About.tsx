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

    <section className="pb-10 md:pb-12">
      <div className="container">
        <div className="brand-shell page-halo grid gap-5 overflow-hidden rounded-[2.2rem] px-5 py-5 md:px-7 md:py-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:px-9">
          <div className="space-y-4">
            <div className="eyebrow-chip">عن المشروع</div>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-foreground md:text-[3rem]">مول البستان مشروع تقني بهوية أوضح وتنظيم أسهل.</h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              هذه الصفحة تشرح الفكرة، موقع القيمة، وكيف ترتبط التجربة المعمارية بالزيارة والاستفسار التجاري.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { icon: Layers3, title: "الهوية", desc: "مشروع موجه بوضوح للفئات التقنية." },
                { icon: MapPin, title: "الموقع", desc: "يخدم شرق القاهرة ومناطق الطلب المحيطة." },
                { icon: Store, title: "الوظيفة", desc: "يربط الاستكشاف الفعلي بالقرار التجاري بسرعة." },
              ].map((item) => (
                <div key={item.title} className="editorial-panel rounded-[1.35rem] p-4">
                  <item.icon className="icon-shell mb-3 h-10 w-10 p-2.5" />
                  <h2 className="text-base font-bold text-foreground">{item.title}</h2>
                  <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{item.desc}</p>
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

          <div className="image-shell overflow-hidden rounded-[2rem] border border-border/70 shadow-[var(--shadow-elevated)]">
            <img src={exteriorImage} alt="الواجهة المعمارية لمول البستان" className="h-[380px] w-full object-cover object-[center_30%]" />
            <div className="image-wash absolute inset-0" />
          </div>
        </div>
      </div>
    </section>

    <div className="container max-w-6xl py-4 md:py-8">
      <div className="mb-12 grid gap-4 lg:grid-cols-3 lg:items-start">
        {[
          { title: "رؤية المول", desc: "تقديم وجهة تقنية مفهومة من أول نظرة دون تشتيت أو مبالغة في الرسائل." },
          { title: "للزائر", desc: "وصول أسرع للفئات والمتاجر ومسار أوضح قبل الزيارة وأثناءها." },
          { title: "للنشاط التجاري", desc: "عرض أوضح للموقع والوحدة مع انتقال مباشر إلى الاستفسار التجاري." },
        ].map((item) => (
          <div key={item.title} className="section-shell rounded-[1.6rem] p-5 md:p-6">
            <p className="text-lg font-bold text-foreground">{item.title}</p>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="section-shell relative mb-12 overflow-hidden rounded-[2rem] p-3 shadow-[var(--shadow-elevated)]"
      >
        <div className="grid gap-3 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
          <img src={interiorImage} alt="الأتريوم الداخلي لمول البستان" className="h-[320px] w-full rounded-[1.4rem] object-cover md:h-[400px]" />
          <div className="rounded-[1.4rem] border border-border/80 bg-card/90 p-5 md:p-6">
            <p className="text-sm font-semibold text-muted-foreground">التجربة المعمارية</p>
            <p className="mt-2 text-2xl font-bold text-foreground">المشهد الداخلي يدعم الحركة والعرض بدل أن ينافسهما.</p>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">الهدف ليس الإبهار فقط، بل تقديم بيئة أوضح للفئات والمتاجر والزائر من أول مرور.</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
          { icon: Store, title: "فئات أوضح", desc: "تصنيف مباشر يسهّل فهم طبيعة المتاجر والخدمات." },
          { icon: Sparkles, title: "حملة أكثر انضباطًا", desc: "الافتتاح والحملة الترويجية جزء من مسار واحد واضح." },
          { icon: MapPin, title: "ارتباط بالمكان", desc: "التجربة الرقمية تدعم الزيارة الفعلية ولا تنفصل عنها." },
        ].map((item) => (
          <div key={item.title} className="section-shell p-5">
            <item.icon className="icon-shell mb-3 h-11 w-11 p-2.5" />
            <h3 className="mb-2 font-bold text-foreground">{item.title}</h3>
            <p className="text-sm leading-7 text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </MainLayout>
);

export default About;