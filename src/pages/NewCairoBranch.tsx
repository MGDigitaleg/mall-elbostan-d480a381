import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";

const NewCairoBranch = () => (
  <MainLayout>
    <SEOHead title="فرع القاهرة الجديدة" description="مول البستان - فرع القاهرة الجديدة. الموقع والتفاصيل." />
    <div className="container py-20 max-w-4xl">
      <h1 className="text-4xl font-bold text-gradient-blue mb-8">فرع القاهرة الجديدة</h1>
      <div className="space-y-6 text-foreground/90 leading-relaxed">
        <p>يقع فرع القاهرة الجديدة في موقع استراتيجي يخدم سكان القاهرة الجديدة ومدينتي والرحاب والمناطق المحيطة.</p>
        <div className="card-premium p-8 mt-8">
          <h2 className="text-xl font-bold text-foreground mb-4">معلومات الفرع</h2>
          <div className="space-y-3 text-muted-foreground">
            <p>📍 <strong>العنوان:</strong> سيتم الإعلان عنه قريباً</p>
            <p>🕐 <strong>مواعيد العمل:</strong> سيتم الإعلان عنها عند الافتتاح</p>
            <p>📞 <strong>للاستفسار:</strong> تواصل معنا عبر صفحة الاتصال</p>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
);

export default NewCairoBranch;
