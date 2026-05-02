import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead, buildWebPageLd } from "@/components/SEOHead";

const Terms = () => (
  <MainLayout>
    <SEOHead
      title="الشروط والأحكام"
      titleEn="Terms & Conditions"
      description="الشروط والأحكام لاستخدام موقع مول البستان."
      descriptionEn="Terms and conditions of Mall Elbostan website."
      breadcrumbs={[{ name: "الشروط والأحكام", url: "/terms" }]}
      jsonLd={buildWebPageLd({ name: "الشروط والأحكام — مول البستان", description: "شروط استخدام موقع مول البستان.", url: "/terms" })}
    />
    <div className="container py-20 max-w-3xl">
      <h1 className="text-2xl font-bold text-gradient-blue mb-8 md:text-3xl">الشروط والأحكام</h1>
      <div className="card-premium p-8 text-muted-foreground leading-relaxed space-y-4">
        <p>باستخدام موقع مول البستان الإلكتروني، فإنك توافق على الالتزام بهذه الشروط والأحكام.</p>
        <h2 className="text-lg font-bold text-foreground">استخدام الموقع</h2>
        <p>يُسمح باستخدام هذا الموقع للأغراض المشروعة فقط. يُحظر أي استخدام يخالف القوانين المصرية أو يضر بمصالح المول.</p>
        <h2 className="text-lg font-bold text-foreground">المحتوى</h2>
        <p>جميع المحتويات المنشورة على الموقع هي ملك لمول البستان ولا يجوز نسخها أو إعادة نشرها دون إذن مسبق.</p>
        <h2 className="text-lg font-bold text-foreground">المسؤولية</h2>
        <p>نسعى لتقديم معلومات دقيقة ومحدثة، لكننا لا نتحمل المسؤولية عن أي أخطاء أو سهو في المحتوى.</p>
        <h2 className="text-lg font-bold text-foreground">التعديلات</h2>
        <p>نحتفظ بالحق في تعديل هذه الشروط في أي وقت. يُنصح بمراجعة هذه الصفحة بانتظام.</p>
      </div>
    </div>
  </MainLayout>
);

export default Terms;
