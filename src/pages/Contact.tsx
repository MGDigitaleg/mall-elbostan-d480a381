import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

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
      <div className="container py-20">
        <h1 className="text-4xl font-bold text-gradient-blue mb-8 text-center">تواصل معنا</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div className="card-premium p-8">
            <h2 className="text-2xl font-bold mb-6">أرسل رسالة</h2>
            {submitted ? (
              <div className="text-center py-10"><p className="text-2xl mb-2">✅</p><p className="font-bold text-success">تم إرسال رسالتك بنجاح!</p><p className="text-muted-foreground mt-2">سنتواصل معك قريباً</p></div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input placeholder="الاسم الكامل *" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="bg-secondary border-border" required />
                <Input placeholder="رقم الهاتف *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="bg-secondary border-border" required dir="ltr" />
                <Input placeholder="البريد الإلكتروني" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-secondary border-border" dir="ltr" />
                <Textarea placeholder="رسالتك..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="bg-secondary border-border" rows={5} />
                <Button type="submit" variant="cta" className="w-full" disabled={loading}>{loading ? "جاري الإرسال..." : "إرسال"}</Button>
              </form>
            )}
          </div>
          <div className="space-y-6">
            <div className="card-premium p-6"><MapPin className="w-6 h-6 text-primary mb-2" /><h3 className="font-bold mb-1">الموقع</h3><p className="text-sm text-muted-foreground">القاهرة الجديدة، مصر</p></div>
            <div className="card-premium p-6"><Phone className="w-6 h-6 text-primary mb-2" /><h3 className="font-bold mb-1">الهاتف</h3><p className="text-sm text-muted-foreground">سيتم الإعلان قريباً</p></div>
            <div className="card-premium p-6"><Mail className="w-6 h-6 text-primary mb-2" /><h3 className="font-bold mb-1">البريد الإلكتروني</h3><p className="text-sm text-muted-foreground">سيتم الإعلان قريباً</p></div>
            <div className="card-premium p-6 h-48 flex items-center justify-center text-muted-foreground">📍 خريطة Google Maps - سيتم إضافتها</div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Contact;
