import { useState } from "react";
import { ArrowLeft, Building, CheckCircle2, MapPin, Sparkles, Store } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import facadeImage from "@/assets/mall-facade.jpg";

const Leasing = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ full_name: "", company: "", phone: "", email: "", message: "" });

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
      return;
    }

    setSubmitted(true);
    toast({ title: "تم الإرسال", description: "هنرجع لك في أقرب وقت." });
  };

  return (
    <MainLayout>
      <SEOHead title="التأجير" titleEn="Leasing" description="استفسر عن الوحدات التجارية في مول البستان داخل وجهة تقنية مصرية راقية." descriptionEn="Enquire about commercial units at Mall Elbostan, a premium Egyptian technology mall." breadcrumbs={[{ name: "التأجير", url: "/leasing" }]} />
      <div className="container py-8 md:py-12">
        <section className="brand-shell page-halo mb-12 grid gap-7 overflow-hidden rounded-[2.5rem] px-5 py-6 md:px-8 md:py-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:px-10">
          <div className="space-y-5">
            <div className="eyebrow-chip">
              <Building className="h-4 w-4 text-orange" />
              فرص تجارية داخل وجهة تقنية متخصصة
            </div>
            <h1 className="max-w-3xl text-4xl font-bold text-foreground md:text-[3.3rem]">فرص تجارية في وجهة يقصدها الجمهور المناسب</h1>
            <p className="max-w-2xl leading-7 text-muted-foreground">اطّلع على الوحدات المتاحة، قيّم الموقع، وابدأ استفسارك بخطوة واحدة مباشرة.</p>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: Store, title: "جمهور متخصص بالتقنية" },
                { icon: MapPin, title: "موقع في منطقة طلب فعلي" },
                { icon: Sparkles, title: "افتتاح يرفع الحركة والزخم" },
              ].map((item) => (
                <div key={item.title} className="editorial-panel rounded-[1.4rem] p-4">
                  <item.icon className="icon-shell mb-3 h-10 w-10 p-2.5" />
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                </div>
              ))}
            </div>
            <Link to="/map" className="inline-flex">
              <Button variant="outline-blue" size="lg" className="rounded-xl px-7">
                شوف الوحدات على الخريطة
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="image-shell overflow-hidden rounded-[2rem] border border-border/70 shadow-[var(--shadow-elevated)]">
            <img src={facadeImage} alt="واجهة مول البستان الخارجية الداعمة لفرص التأجير والاستثمار" className="h-[340px] w-full object-cover object-center" />
            <div className="image-wash absolute inset-0" />
          </div>
        </section>

        <section className="mb-10 grid gap-4 md:grid-cols-3">
            {[
              { title: "وحدات واضحة المعالم", desc: "حالة كل وحدة ظاهرة بالمساحة والموقع." },
              { title: "معلومات بلا مبالغة", desc: "بيانات مختصرة تساعدك على تقييم الفرصة." },
              { title: "ربط مباشر بالخريطة", desc: "من الوحدة لموقعها الفعلي بضغطة واحدة." },
          ].map((item) => (
            <div key={item.title} className="section-shell p-5 md:p-6">
              <h2 className="text-lg font-bold text-foreground">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="section-shell rounded-[2rem] p-8">
            <h2 className="mb-2 text-2xl font-bold">ابدأ استفسارك</h2>
            <p className="mb-6 text-sm leading-7 text-muted-foreground">أرسل بياناتك الأساسية، وسيتواصل معك الفريق بمعلومات أوضح عن الوحدات المناسبة.</p>
            {submitted ? (
              <div className="py-10 text-center">
                <CheckCircle2 className="mx-auto mb-2 h-10 w-10 text-success" />
                <p className="text-lg font-bold text-success">تم إرسال طلبك بنجاح</p>
                <p className="mt-2 text-muted-foreground">هنرجع لك في أقرب وقت</p>
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
               <p className="text-sm leading-7 text-muted-foreground">عينة من الوحدات البارزة، ثم يمكنك متابعة التفاصيل على الخريطة.</p>
            </div>
            {availableUnits && availableUnits.length > 0 ? (
              <div className="space-y-4">
                {availableUnits.map((unit) => (
                  <div key={unit.id} className="editorial-panel rounded-[1.6rem] border border-orange/20 p-5">
                    <div className="flex items-start justify-between gap-4">
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
            <Link to="/map" className="block">
              <Button variant="outline-blue" className="w-full">عرض الخريطة التفاعلية</Button>
            </Link>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Leasing;