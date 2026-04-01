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

    <section className="relative overflow-hidden bg-card pb-2 pt-4 md:pb-8 md:pt-8 lg:pb-16 lg:pt-12">
      <div className="relative mx-auto w-full max-w-7xl px-4 md:px-8 lg:px-12 xl:px-16">
        <div className="grid min-h-[auto] gap-4 py-3.5 md:gap-6 lg:grid-cols-2 lg:items-center lg:gap-8 lg:min-h-[70vh] lg:py-0">
          {/* Text block — right side in RTL */}
          <div className="order-1 space-y-3 text-right lg:space-y-5">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="eyebrow-chip mb-3 text-[0.72rem] md:mb-4 md:text-sm">عن المشروع</div>
              <h1 className="text-[1.7rem] font-black leading-[1.05] text-foreground md:text-[3rem] lg:text-[3.4rem]">
                مول البستان مشروع تقني بهوية أوضح وتنظيم أسهل.
              </h1>
              <p className="mt-2.5 max-w-[20rem] text-[0.92rem] font-semibold leading-[1.4] text-foreground/90 md:mt-3 md:max-w-[30rem] md:text-[1.3rem] lg:max-w-[26rem] lg:text-[1.25rem]">
                هذه الصفحة تشرح الفكرة، موقع القيمة، وكيف ترتبط التجربة المعمارية بالزيارة والاستفسار التجاري.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }} className="space-y-3 lg:space-y-4">
              <div className="rounded-[1rem] border border-border bg-background px-3 py-3 md:rounded-[1.25rem] md:px-4 md:py-3.5 lg:px-5 lg:py-4">
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { icon: Layers3, title: "الهوية", desc: "مشروع موجه بوضوح للفئات التقنية." },
                    { icon: MapPin, title: "الموقع", desc: "يخدم شرق القاهرة ومناطق الطلب المحيطة." },
                    { icon: Store, title: "الوظيفة", desc: "يربط الاستكشاف الفعلي بالقرار التجاري بسرعة." },
                  ].map((item) => (
                    <div key={item.title} className="flex min-h-[3.5rem] flex-col items-center justify-center rounded-xl border border-border/60 bg-card px-2 py-3 text-center md:min-h-[5rem] md:px-3 md:py-4 lg:min-h-[5.5rem]">
                      <item.icon className="mb-1.5 h-5 w-5 text-primary md:h-6 md:w-6" />
                      <p className="text-[0.72rem] font-bold text-foreground md:text-sm">{item.title}</p>
                      <p className="mt-0.5 text-[0.6rem] leading-4 text-muted-foreground md:text-xs md:leading-5">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Link to="/stores" className="inline-flex">
                <Button variant="cta" size="lg" className="h-11 min-w-[11rem] rounded-[1rem] px-6">
                  استكشف المتاجر
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Image block — left side in RTL, 85% height centered */}
          <motion.div initial={{ opacity: 0, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45 }} className="order-2 flex w-full items-center justify-center">
            <div className="relative mx-auto w-[85%] lg:w-[85%]">
              <div className="section-shell overflow-hidden rounded-2xl p-1.5 md:rounded-[1.75rem] lg:p-2">
                <div className="image-shell aspect-[3/4] overflow-hidden rounded-xl bg-card md:rounded-2xl">
                  <img src={exteriorImage} alt="الواجهة المعمارية لمول البستان" className="h-full w-full object-cover object-[center_30%]" loading="eager" />
                </div>
              </div>
            </div>
          </motion.div>
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