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
        <div className="brand-shell page-halo grid gap-8 overflow-hidden rounded-[2.7rem] px-6 py-8 md:px-8 md:py-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-10">
          <div className="space-y-6">
            <div className="eyebrow-chip">عن المشروع</div>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-foreground md:text-[3.6rem]">مول البستان بيتبني كعلامة تقنية مصرية شكلها راقٍ وحضورها واضح</h1>
            <p className="max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
              الفكرة مش مجرد مكان يجمع متاجر تقنية. الفكرة إن يبقى فيه مشروع له شخصية، لغة، وتجربة محترمة من أول الواجهة لحد طريقة
              الاستكشاف جوه الموقع والمول نفسه.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Layers3, title: "هوية معمارية واضحة", desc: "واجهة وشكل داخلي يخلّوا صورة المشروع ثابتة في ذهن الزائر من أول لحظة." },
                { icon: MapPin, title: "موقع يخدم شرق القاهرة", desc: "قربه من القاهرة الجديدة ومدينتي والرحاب يديه قيمة فعلية للحركة والزيارة." },
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
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">تجربة تقنية بطابع تجاري أهدى وأقوى</h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">رؤية المشروع ماشية على فكرة بسيطة: المكان لازم يبقى مقنع للزائر، ومفيد تجاريًا للعلامات، وقابل يتوسع رقميًا بعد كده.</p>
        </div>
        <div className="space-y-6 text-foreground/90 leading-relaxed">
          <p className="text-lg">مول البستان بيتقدّم بشكل يركّز على احتياجات جمهور التقنية فعلاً، من الزائر اللي بيدور على تجربة واضحة، لحد النشاط اللي محتاج مكان حضوره فيه باين ومحترم.</p>
          <p>الهدف هو إن التجربة على الأرض تبقى منظمة وسهلة، والهوية البصرية واللغوية تبقى على نفس المستوى، وبعدها ييجي الامتداد الرقمي كخطوة منطقية ومفهومة.</p>
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
          <p className="mb-1 text-xl font-bold text-foreground">من جوه كمان، المشروع شكله يدي ثقة</p>
          <p className="text-sm leading-7 text-muted-foreground">الأتريوم المتعدد الطوابق بيدّي إحساس أوضح بالحركة والعرض والوجود التجاري، وده جزء أساسي من قوة العلامة.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
          { icon: Store, title: "فئات ومتاجر مختارة", desc: "تنظيم مدروس يسهّل على الزائر يلاقي اللي محتاجه بسرعة وبصورة أرقى." },
          { icon: Sparkles, title: "افتتاح يبني الترقب", desc: "حملة إطلاق تخلي الناس تتابع المشروع بدافع حقيقي، مش مجرد إعلان عابر." },
          { icon: MapPin, title: "قيمة مكانية واضحة", desc: "الموقع يخدم مناطق الحركة والطلب في شرق القاهرة ويقوّي جدوى الزيارة والوجود التجاري." },
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