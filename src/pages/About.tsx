import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { motion } from "framer-motion";
import { Layers3, MapPin, Store, Sparkles } from "lucide-react";
import interiorImage from "@/assets/mall-interior.jpg";
import exteriorImage from "@/assets/mall-exterior.jpg";

const About = () => (
  <MainLayout>
    <SEOHead title="عن المول" titleEn="About" description="تعرف على مول البستان - أكبر مول متخصص في التكنولوجيا بالقاهرة الجديدة." descriptionEn="Learn about Mall Elbostan - Egypt's largest technology mall." breadcrumbs={[{ name: "عن المول", url: "/about" }]} />

    <section className="pb-16">
      <div className="container">
        <div className="brand-shell grid gap-8 overflow-hidden rounded-[2.4rem] px-6 py-8 md:px-8 md:py-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div className="space-y-5">
            <div className="eyebrow-chip">عن المشروع</div>
            <h1 className="text-4xl font-bold leading-tight text-foreground md:text-5xl">مول البستان بيتبني كعلامة تقنية مصرية واضحة ومختلفة</h1>
            <p className="max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
              مول البستان مش مجرد مكان فيه محلات تقنية. الفكرة من البداية إنه يبقى مشروع له شخصية واضحة، يجمع التجربة على الأرض
              مع حضور تجاري قوي ومسار رقمي يكبر بعدين بشكل طبيعي.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Layers3, title: "شخصية مكانية واضحة", desc: "العمارة الداخلية والخارجية بتدي للمشروع حضور يبان من أول نظرة." },
                { icon: MapPin, title: "موقع يخدم شرق القاهرة", desc: "قريب من مناطق الحركة والطلب في القاهرة الجديدة ومدينتي والرحاب." },
              ].map((item) => (
                <div key={item.title} className="soft-card rounded-[1.4rem] p-5">
                  <item.icon className="mb-3 h-8 w-8 text-primary" />
                  <h2 className="text-lg font-bold text-foreground">{item.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="image-shell overflow-hidden rounded-[2rem] border border-border/70 shadow-[var(--shadow-elevated)]">
            <img src={exteriorImage} alt="الواجهة المعمارية لمول البستان" className="h-[420px] w-full object-cover object-[center_30%]" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/28 via-transparent to-background/10" />
          </div>
        </div>
      </div>
    </section>

    <div className="container max-w-6xl py-4 md:py-8">
      <div className="mb-16 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="section-shell p-6 md:p-8">
          <p className="section-kicker">رؤية المول</p>
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">تجربة تقنية بطابع تجاري أهدى وأقوى</h2>
        </div>
        <div className="space-y-6 text-foreground/90 leading-relaxed">
          <p className="text-lg">مول البستان بيتقدّم بشكل يركّز على احتياجات جمهور التقنية فعلاً، من الناس اللي بتدور على أجهزة وإكسسوارات لحد الأنشطة اللي محتاجة مكان حضورها فيه باين ومحترم.</p>
          <p>الهدف هو جمع مكان حقيقي مقنع، تنظيم واضح للفئات والمتاجر، وتجربة رقمية بعدين تكمل العلاقة بين المستخدم والعلامات بعد الزيارة.</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="section-shell relative mb-16 overflow-hidden rounded-[2rem] p-3 shadow-[var(--shadow-elevated)]"
      >
        <img src={interiorImage} alt="الأتريوم الداخلي لمول البستان" className="h-[360px] w-full rounded-[1.5rem] object-cover md:h-[460px]" />
        <div className="absolute inset-3 rounded-[1.5rem] bg-gradient-to-t from-foreground/32 to-transparent" />
        <div className="glass absolute bottom-8 right-8 max-w-md rounded-[1.4rem] p-5">
          <p className="mb-1 text-xl font-bold text-foreground">تجربة داخلية تدي ثقة في المشروع</p>
          <p className="text-sm leading-7 text-muted-foreground">الأتريوم المتعدد الطوابق بيحوّل صورة العلامة لمكان حقيقي يشد الزوار ويقوّي حضور المتاجر.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
          { icon: Store, title: "فئات ومتاجر مختارة", desc: "تجميعة مدروسة تخلي تجربة الزائر أوضح وأسهل من أول زيارة." },
          { icon: Sparkles, title: "افتتاح يبني الحماس", desc: "حملة افتتاح تخلي الناس تتابع المشروع قبل ما يفتح بشكل فعلي." },
          { icon: MapPin, title: "موقع يخدم الحركة", desc: "وصول مناسب لفئات مختلفة من الزوار والشركات والباحثين عن حلول تقنية." },
        ].map((item) => (
          <div key={item.title} className="section-shell p-6">
            <item.icon className="mb-4 h-8 w-8 text-primary" />
            <h3 className="mb-2 font-bold text-foreground">{item.title}</h3>
            <p className="text-sm leading-7 text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </MainLayout>
);

export default About;
