import { useState } from "react";
import { Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import entranceImage from "@/assets/mall-entrance.jpg";

const Contact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ full_name: "", phone: "", email: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.phone.trim()) {
      toast({ title: "خطأ", description: "يرجى ملء الاسم ورقم الهاتف", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("leads").insert({
      lead_type: "contact",
      full_name: form.full_name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || null,
      message: form.message.trim() || null,
    });
    setLoading(false);
    if (error) {
      toast({ title: "خطأ", description: "حدث خطأ. حاول مرة أخرى.", variant: "destructive" });
    } else {
      setSubmitted(true);
    }
  };

  return (
    <MainLayout>
      <SEOHead title="تواصل معنا" titleEn="Contact Us" description="تواصل مع فريق مول البستان - استفسارات، شراكات، إعلام." descriptionEn="Get in touch with Mall Elbostan team." breadcrumbs={[{ name: "تواصل معنا", url: "/contact" }]} />
      <div className="container py-8 md:py-12">
        <div className="brand-shell mb-12 grid max-w-6xl gap-8 overflow-hidden rounded-[2.4rem] px-6 py-8 md:px-8 md:py-10 lg:mx-auto lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div className="space-y-5">
            <div className="eyebrow-chip">تواصل معنا</div>
            <h1 className="text-4xl font-bold text-foreground md:text-5xl">تواصل مباشر مع فريق مول البستان</h1>
            <p className="max-w-2xl leading-8 text-muted-foreground">استفسارات المشروع، الشراكات، أو فرص التعاون — أرسل رسالتك هنا ويتابعها الفريق المختص مباشرة.</p>
          </div>
          <div className="image-shell overflow-hidden rounded-[2rem] border border-border/70 shadow-[var(--shadow-elevated)]">
            <img src={entranceImage} alt="مدخل مول البستان" className="h-[320px] w-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
          </div>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="section-shell p-8">
            <h2 className="mb-6 text-2xl font-bold">أرسل رسالة</h2>
            {submitted ? (
              <div className="py-10 text-center"><CheckCircle2 className="mx-auto mb-2 h-10 w-10 text-success" /><p className="font-bold text-success">تم إرسال رسالتك بنجاح</p><p className="mt-2 text-muted-foreground">سنتواصل معك قريباً</p></div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input placeholder="الاسم الكامل *" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="bg-background border-border" required />
                <Input placeholder="رقم الهاتف *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="bg-background border-border" required dir="ltr" />
                <Input placeholder="البريد الإلكتروني" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-background border-border" dir="ltr" />
                <Textarea placeholder="رسالتك..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="bg-background border-border" rows={5} />
                <Button type="submit" variant="cta" className="w-full" disabled={loading}>{loading ? "جاري الإرسال..." : "إرسال"}</Button>
              </form>
            )}
          </div>
          <div className="space-y-6">
            <div className="section-shell p-6"><MapPin className="mb-2 h-6 w-6 text-primary" /><h3 className="mb-1 font-bold">الموقع</h3><p className="text-sm text-muted-foreground">القاهرة الجديدة، مصر</p></div>
            <div className="section-shell p-6"><Phone className="mb-2 h-6 w-6 text-primary" /><h3 className="mb-1 font-bold">الهاتف</h3><p className="text-sm text-muted-foreground">سيتم الإعلان قريباً</p></div>
            <div className="section-shell p-6"><Mail className="mb-2 h-6 w-6 text-primary" /><h3 className="mb-1 font-bold">البريد الإلكتروني</h3><p className="text-sm text-muted-foreground">سيتم الإعلان قريباً</p></div>
            <div className="section-shell flex h-48 items-center justify-center p-6 text-muted-foreground"><MapPin className="ml-2 h-5 w-5" />خريطة الموقع ستتم إضافتها عند توفر بيانات العنوان التفصيلية</div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Contact;
