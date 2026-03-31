import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { motion } from "framer-motion";
import interiorImage from "@/assets/mall-interior.jpg";
import exteriorImage from "@/assets/mall-exterior.jpg";

const About = () => (
  <MainLayout>
    <SEOHead title="عن المول" titleEn="About" description="تعرف على مول البستان - أكبر مول متخصص في التكنولوجيا بالقاهرة الجديدة." descriptionEn="Learn about Mall Elbostan - Egypt's largest technology mall." breadcrumbs={[{ name: "عن المول", url: "/about" }]} />

    {/* Hero */}
    <section className="relative min-h-[40vh] flex items-end overflow-hidden">
      <div className="absolute inset-0">
        <img src={exteriorImage} alt="مبنى مول البستان من الخارج" className="w-full h-full object-cover object-[center_30%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
      </div>
      <div className="container relative z-10 pb-12 pt-32">
        <h1 className="text-4xl md:text-5xl font-bold">عن <span className="text-gradient-blue">مول البستان</span></h1>
      </div>
    </section>

    <div className="container py-16 max-w-5xl">
      <div className="space-y-6 text-foreground/90 leading-relaxed mb-16">
        <p className="text-lg">مول البستان هو وجهة التكنولوجيا الأولى في منطقة القاهرة الجديدة، مدينتي، والرحاب. يجمع المول بين أفضل العلامات التجارية العالمية في عالم التكنولوجيا والإلكترونيات تحت سقف واحد.</p>
        <p>بموقعه الاستراتيجي ومساحاته التجارية المتنوعة، يقدم مول البستان تجربة تسوق فريدة تجمع بين التنوع والجودة والأسعار التنافسية.</p>
      </div>

      {/* Interior showcase */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative rounded-2xl overflow-hidden mb-16"
      >
        <img src={interiorImage} alt="الأتريوم الداخلي لمول البستان" className="w-full h-[400px] md:h-[500px] object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute bottom-0 right-0 p-8">
          <p className="text-foreground font-bold text-xl mb-1">تصميم معماري فاخر</p>
          <p className="text-muted-foreground text-sm">أتريوم مركزي متعدد الطوابق بتشطيبات عالمية</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "موقع استراتيجي", desc: "في قلب القاهرة الجديدة بالقرب من مدينتي والرحاب" },
          { title: "تنوع فريد", desc: "أقسام متعددة تغطي جميع احتياجاتك التقنية" },
          { title: "خدمة متميزة", desc: "فريق عمل محترف لخدمتك وتوجيهك" },
        ].map((item) => (
          <div key={item.title} className="card-premium p-6">
            <h3 className="font-bold text-primary mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </MainLayout>
);

export default About;
