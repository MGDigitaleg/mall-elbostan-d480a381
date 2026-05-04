import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead, buildWebPageLd } from "@/components/SEOHead";

const RewardTerms = () => (
  <MainLayout>
    <SEOHead title="شروط المكافآت" titleEn="Reward Terms" description="شروط وأحكام المكافآت والجوائز في مول البستان." descriptionEn="Reward terms and conditions at Mall Elbostan." breadcrumbs={[{ name: "شروط المكافآت", url: "/reward-terms" }]} jsonLd={buildWebPageLd({ name: "شروط المكافآت — مول البستان", description: "شروط وأحكام جوائز ومكافآت مول البستان.", url: "/reward-terms" })} />
    <div className="container py-20 max-w-3xl">
      <h1 className="text-2xl font-bold text-gradient-blue mb-8 md:text-3xl">شروط مكافآت أدر واربح — مول البستان</h1>
      <div className="card-premium p-8 text-muted-foreground leading-relaxed space-y-4">
        <h2 className="text-lg font-bold text-foreground">شروط المشاركة في أدر واربح</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>يحق لكل شخص المشاركة مرة واحدة فقط باستخدام رقم هاتف واحد</li>
          <li>يجب الحضور يوم الافتتاح لاستلام الجائزة</li>
          <li>يجب إظهار شاشة الفوز عند الاستلام</li>
          <li>يجب متابعة صفحات مول البستان الرسمية على مواقع التواصل الاجتماعي</li>
          <li>الجوائز غير قابلة للاستبدال النقدي</li>
          <li>تخضع الجوائز للتوافر ولا يمكن ضمان نوع محدد</li>
        </ul>
        <h2 className="text-lg font-bold text-foreground">صلاحية الجوائز</h2>
        <p>الجوائز صالحة فقط خلال فترة حملة الافتتاح. لا يمكن المطالبة بأي جائزة بعد انتهاء الحملة.</p>
        <h2 className="text-lg font-bold text-foreground">حق التعديل</h2>
        <p>تحتفظ إدارة مول البستان بالحق في تعديل أو إلغاء أي عرض أو جائزة دون إشعار مسبق.</p>
      </div>
    </div>
  </MainLayout>
);

export default RewardTerms;
