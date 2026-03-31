import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { motion } from "framer-motion";
import interiorImage from "@/assets/mall-interior.jpg";
import exteriorImage from "@/assets/mall-exterior.jpg";

const About = () => (
  <MainLayout>
    <SEOHead title="عن المول" titleEn="About" description="تعرف على مول البستان - أكبر مول متخصص في التكنولوجيا بالقاهرة الجديدة." descriptionEn="Learn about Mall Elbostan - Egypt's largest technology mall." breadcrumbs={[{ name: "عن المول", url: "/about" }]} />

    <section className="relative min-h-[34vh] overflow-hidden pt-12">
      <div className="absolute inset-0">
        <img src={exteriorImage} alt="مبنى مول البستان من الخارج" className="w-full h-full object-cover object-[center_30%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/66 via-foreground/16 to-transparent" />
      </div>
      <div className="container relative z-10 flex min-h-[34vh] items-end pb-10 pt-28">
        <div className="surface-panel max-w-2xl rounded-[1.75rem] p-6 md:p-8">
          <p className="section-kicker mb-2">عن المشروع</p>
          <h1 className="text-4xl md:text-5xl font-bold">عن <span className="text-gradient-blue">مول البستان</span></h1>
          <p className="mt-4 text-base leading-8 text-muted-foreground">وجهة تقنية حديثة صُممت لتجمع العلامات المتخصصة، الزوار، وفرص النمو التجاري ضمن تجربة أكثر وضوحًا وأناقة.</p>
        </div>
      </div>
    </section>

    <div className="container max-w-5xl py-16 md:py-20">
      <div className="mb-16 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="soft-card p-6 md:p-8">
          <p className="section-kicker">رؤية المول</p>
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">تجربة تقنية بمستوى تجاري أرقى</h2>
        </div>
        <div className="space-y-6 text-foreground/90 leading-relaxed">
          <p className="text-lg">مول البستان هو وجهة التكنولوجيا الأولى في منطقة القاهرة الجديدة، مدينتي، والرحاب. يجمع المول بين أفضل العلامات التجارية العالمية في عالم التكنولوجيا والإلكترونيات تحت سقف واحد.</p>
          <p>بموقعه الاستراتيجي ومساحاته التجارية المتنوعة، يقدم مول البستان تجربة تسوق فريدة تجمع بين التنوع والجودة والأسعار التنافسية.</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative mb-16 overflow-hidden rounded-[1.75rem] border border-border/70 shadow-[var(--shadow-elevated)]"
      >
        <img src={interiorImage} alt="الأتريوم الداخلي لمول البستان" className="w-full h-[360px] md:h-[460px] object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/48 to-transparent" />
        <div className="absolute bottom-0 right-0 p-8">
          <p className="mb-1 text-xl font-bold text-background">تصميم معماري فاخر</p>
          <p className="text-sm text-background/80">أتريوم مركزي متعدد الطوابق بتشطيبات عالمية</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "موقع استراتيجي", desc: "في قلب القاهرة الجديدة بالقرب من مدينتي والرحاب" },
          { title: "تنوع فريد", desc: "أقسام متعددة تغطي جميع احتياجاتك التقنية" },
          { title: "خدمة متميزة", desc: "فريق عمل محترف لخدمتك وتوجيهك" },
        ].map((item) => (
          <div key={item.title} className="soft-card p-6">
            <h3 className="font-bold text-primary mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </MainLayout>
);

export default About;
