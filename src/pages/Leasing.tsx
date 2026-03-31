import { useState } from "react";
import { Building, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import facadeImage from "@/assets/mall-facade.jpg";

const Leasing = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ full_name: "", company: "", phone: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const { data: availableUnits } = useQuery({
    queryKey: ["available-units"],
    queryFn: async () => {
      const { data } = await supabase.from("units").select("*").eq("status", "available").eq("featured", true).limit(6);
      return data ?? [];
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.phone.trim()) {
      toast({ title: "خطأ", description: "يرجى ملء الاسم ورقم الهاتف", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("leads").insert({
      lead_type: "leasing",
      full_name: form.full_name.trim(),
      company: form.company.trim() || null,
      phone: form.phone.trim(),
      email: form.email.trim() || null,
      message: form.message.trim() || null,
    });
    setLoading(false);
    if (error) {
      toast({ title: "خطأ", description: "حدث خطأ. حاول مرة أخرى.", variant: "destructive" });
    } else {
      setSubmitted(true);
      toast({ title: "تم الإرسال", description: "سنتواصل معك في أقرب وقت!" });
    }
  };

  return (
    <MainLayout>
      <SEOHead title="التأجير" titleEn="Leasing" description="احجز وحدتك التجارية في مول البستان - مساحات تجارية بأسعار تنافسية في القاهرة الجديدة." descriptionEn="Lease your commercial space at Mall Elbostan - competitive prices in New Cairo." breadcrumbs={[{ name: "التأجير", url: "/leasing" }]} />
      <div className="container py-16 md:py-20">
        <div className="mb-12 grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-3 rounded-full border border-border bg-card px-4 py-2 shadow-[var(--shadow-soft)]">
              <Building className="h-4 w-4 text-orange" />
              <span className="text-sm font-medium text-muted-foreground">فرص تجارية داخل وجهة تقنية متخصصة</span>
            </div>
            <h1 className="text-4xl font-bold text-foreground md:text-5xl">التأجير والاستثمار داخل مول البستان</h1>
            <p className="max-w-2xl leading-8 text-muted-foreground">صفحة مخصصة للعلامات والأنشطة التي تبحث عن حضور داخل مول تقني حديث، مع رحلة أوضح للاستفسار، عرض الوحدات، وفهم طبيعة الفرص التجارية داخل المشروع.</p>
          </div>
          <div className="image-shell overflow-hidden rounded-[1.75rem] border border-border/70 shadow-[var(--shadow-elevated)]">
            <img src={facadeImage} alt="واجهة مول البستان الخارجية الداعمة لفرص التأجير والاستثمار" className="h-[280px] w-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="surface-panel rounded-[1.75rem] p-8">
            <h2 className="text-2xl font-bold mb-2">استفسر الآن</h2>
            <p className="mb-6 text-sm leading-7 text-muted-foreground">املأ البيانات الأساسية وسيتواصل معك الفريق بمزيد من التفاصيل حول المساحات المتاحة وخيارات النشاط المناسبة.</p>
            {submitted ? (
              <div className="text-center py-10">
                <CheckCircle2 className="w-10 h-10 text-success mx-auto mb-2" />
                <p className="text-lg font-bold text-success">تم إرسال طلبك بنجاح</p>
                <p className="text-muted-foreground mt-2">سنتواصل معك في أقرب وقت ممكن</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input placeholder="الاسم الكامل *" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="border-border bg-background" required />
                <Input placeholder="اسم الشركة" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="border-border bg-background" />
                <Input placeholder="رقم الهاتف *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="border-border bg-background" required dir="ltr" />
                <Input placeholder="البريد الإلكتروني" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="border-border bg-background" dir="ltr" />
                <Textarea placeholder="رسالتك أو تفاصيل إضافية..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="border-border bg-background" rows={4} />
                <Button type="submit" variant="orange" className="w-full" disabled={loading}>
                  {loading ? "جاري الإرسال..." : "إرسال الطلب"}
                </Button>
              </form>
            )}
          </div>

          <div className="space-y-6">
            <div className="soft-card p-6">
              <h2 className="mb-3 text-2xl font-bold">وحدات <span className="text-orange">مميزة متاحة</span></h2>
              <p className="text-sm leading-7 text-muted-foreground">استعرض عينة من الوحدات البارزة الآن، ثم انتقل مباشرة إلى الخريطة لفهم مواقعها داخل المشروع.</p>
            </div>
            {availableUnits && availableUnits.length > 0 ? (
              <div className="space-y-4">
                {availableUnits.map((unit) => (
                  <div key={unit.id} className="surface-panel rounded-2xl p-4 border border-orange/25">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-orange">وحدة {unit.unit_code}</h3>
                        {unit.area_sqm && <p className="text-sm text-muted-foreground">{unit.area_sqm} م²</p>}
                        {unit.activity_suggestion && <p className="text-sm text-muted-foreground">{unit.activity_suggestion}</p>}
                      </div>
                      {unit.price_note && <span className="text-xs text-orange bg-orange/10 px-2 py-1 rounded">{unit.price_note}</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="soft-card p-6 text-muted-foreground">سيتم عرض الوحدات المتاحة قريباً</div>
            )}
            <Link to="/map" className="block mt-6">
              <Button variant="outline-blue" className="w-full">عرض الخريطة التفاعلية</Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Leasing;
