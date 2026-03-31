import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";

const About = () => (
  <MainLayout>
    <SEOHead title="عن المول" description="تعرف على مول البستان - أكبر مول متخصص في التكنولوجيا بالقاهرة الجديدة." />
    <div className="container py-20 max-w-4xl">
      <h1 className="text-4xl font-bold text-gradient-blue mb-8">عن مول البستان</h1>
      <div className="space-y-6 text-foreground/90 leading-relaxed">
        <p>مول البستان هو وجهة التكنولوجيا الأولى في منطقة القاهرة الجديدة، مدينتي، والرحاب. يجمع المول بين أفضل العلامات التجارية العالمية في عالم التكنولوجيا والإلكترونيات تحت سقف واحد.</p>
        <p>بموقعه الاستراتيجي ومساحاته التجارية المتنوعة، يقدم مول البستان تجربة تسوق فريدة تجمع بين التنوع والجودة والأسعار التنافسية.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
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
    </div>
  </MainLayout>
);

export default About;
