import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";

const Privacy = () => (
  <MainLayout>
    <SEOHead title="سياسة الخصوصية" titleEn="Privacy Policy" description="سياسة الخصوصية لمول البستان." descriptionEn="Mall Elbostan privacy policy." breadcrumbs={[{ name: "سياسة الخصوصية", url: "/privacy" }]} />
    <div className="container py-20 max-w-3xl">
      <h1 className="text-2xl font-bold text-gradient-blue mb-8 md:text-3xl">سياسة الخصوصية</h1>
      <div className="card-premium p-8 text-muted-foreground leading-relaxed space-y-4">
        <p>نحن في مول البستان نلتزم بحماية خصوصية زوارنا ومستخدمي موقعنا الإلكتروني.</p>
        <h2 className="text-lg font-bold text-foreground">جمع المعلومات</h2>
        <p>نقوم بجمع المعلومات التي تقدمها طوعاً عند ملء نماذج الاتصال أو التأجير أو المشاركة في فعالياتنا، بما في ذلك الاسم ورقم الهاتف والبريد الإلكتروني.</p>
        <h2 className="text-lg font-bold text-foreground">استخدام المعلومات</h2>
        <p>نستخدم المعلومات المقدمة للتواصل معك بخصوص استفساراتك أو طلباتك، ولتحسين خدماتنا وتجربة المستخدم.</p>
        <h2 className="text-lg font-bold text-foreground">حماية المعلومات</h2>
        <p>نتخذ إجراءات أمنية مناسبة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو الاستخدام غير القانوني.</p>
        <h2 className="text-lg font-bold text-foreground">التواصل</h2>
        <p>لأي استفسار حول سياسة الخصوصية، يرجى التواصل معنا عبر صفحة الاتصال.</p>
      </div>
    </div>
  </MainLayout>
);

export default Privacy;
