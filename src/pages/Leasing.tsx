import { useState } from "react";
import { Building, CheckCircle2, MapPin, Store, Sparkles } from "lucide-react";
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
      <div className="container py-8 md:py-12">
        <div className="brand-shell mb-12 grid gap-8 overflow-hidden rounded-[2.4rem] px-6 py-8 md:px-8 md:py-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div className="space-y-5">
            <div className="eyebrow-chip">
              <Building className="h-4 w-4 text-orange" />
              فرص تجارية داخل وجهة تقنية متخصصة
            </div>
            <h1 className="text-4xl font-bold text-foreground md:text-5xl">التأجير والاستثمار داخل مول البستان</h1>
            <p className="max-w-2xl leading-8 text-muted-foreground">تمت إعادة تقديم صفحة التأجير كلغة عرض تجاري أوضح: صورة مكانية أفضل، نقاط قيمة أكثر إقناعًا، ومسار استفسار مباشر يساعد العلامات على فهم الفرصة داخل المشروع.</p>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: Store, title: "حضور تجاري متخصص" },
                { icon: MapPin, title: "موقع يخدم شرق القاهرة" },
                { icon: Sparkles, title: "إطلاق يبني الزخم" },
              ].map((item) => (
                <div key={item.title} className="soft-card rounded-[1.35rem] p-4">
                  <item.icon className="mb-3 h-6 w-6 text-primary" />
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="image-shell overflow-hidden rounded-[2rem] border border-border/70 shadow-[var(--shadow-elevated)]">
            <img src={facadeImage} alt="واجهة مول البستان الخارجية الداعمة لفرص التأجير والاستثمار" className="h-[340px] w-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/24 to-transparent" />
          </div>
        </div>

        <div className="mb-10 grid gap-4 md:grid-cols-3">
          {[
            { title: "عرض وحدات أوضح", desc: "وحدات متاحة مع مدخل سريع لفهم المواقع والمساحات والأنشطة المناسبة." },
            { title: "نبرة استثمارية موثوقة", desc: "الرسالة موجهة للعلامات والشركات بصورة أكثر احترافية وهدوءًا." },
            { title: "ربط بالخريطة", desc: "الانتقال من الاستفسار إلى فهم موضع الوحدة داخل المشروع في خطوة واحدة." },
          ].map((item) => (
            <div key={item.title} className="section-shell p-5">
              <h2 className="text-lg font-bold text-foreground">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="section-shell rounded-[1.9rem] p-8">
            <h2 className="mb-2 text-2xl font-bold">استفسر الآن</h2>
            <p className="mb-6 text-sm leading-7 text-muted-foreground">أدخل بياناتك الأساسية ليعود إليك الفريق بتفاصيل أوضح حول المساحات المتاحة وطبيعة الفرص التجارية المناسبة لنشاطك.</p>
            {submitted ? (
              <div className="py-10 text-center">
                <CheckCircle2 className="mx-auto mb-2 h-10 w-10 text-success" />
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
            <div className="section-shell p-6">
              <h2 className="mb-3 text-2xl font-bold">وحدات <span className="text-orange">مميزة متاحة</span></h2>
              <p className="text-sm leading-7 text-muted-foreground">استعرض عينة من الوحدات البارزة الآن، ثم انتقل مباشرة إلى الخريطة لفهم مواقعها داخل المشروع.</p>
            </div>
            {availableUnits && availableUnits.length > 0 ? (
              <div className="space-y-4">
                {availableUnits.map((unit) => (
                  <div key={unit.id} className="section-shell rounded-[1.5rem] border border-orange/25 p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-orange">وحدة {unit.unit_code}</h3>
                        {unit.area_sqm && <p className="text-sm text-muted-foreground">{unit.area_sqm} م²</p>}
                        {unit.activity_suggestion && <p className="text-sm text-muted-foreground">{unit.activity_suggestion}</p>}
                      </div>
                      {unit.price_note && <span className="rounded-full bg-orange/10 px-2 py-1 text-xs text-orange">{unit.price_note}</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="section-shell p-6 text-muted-foreground">سيتم عرض الوحدات المتاحة قريباً</div>
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
