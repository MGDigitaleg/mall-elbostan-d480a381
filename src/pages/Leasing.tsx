import { useState } from "react";
import { Building } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

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
      <SEOHead title="التأجير" description="احجز وحدتك التجارية في مول البستان - مساحات تجارية بأسعار تنافسية في القاهرة الجديدة." />
      <div className="container py-20">
        <div className="text-center mb-12">
          <Building className="w-16 h-16 text-orange mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gradient-blue mb-4">التأجير</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">انضم إلى أكبر تجمع تقني في القاهرة الجديدة. مساحات تجارية متنوعة بأسعار تنافسية وموقع استراتيجي في قلب مدينتي.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div className="card-premium p-8">
            <h2 className="text-2xl font-bold mb-6">استفسر الآن</h2>
            {submitted ? (
              <div className="text-center py-10">
                <p className="text-2xl mb-2">✅</p>
                <p className="text-lg font-bold text-success">تم إرسال طلبك بنجاح</p>
                <p className="text-muted-foreground mt-2">سنتواصل معك في أقرب وقت ممكن</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input placeholder="الاسم الكامل *" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="bg-secondary border-border" required />
                <Input placeholder="اسم الشركة" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="bg-secondary border-border" />
                <Input placeholder="رقم الهاتف *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="bg-secondary border-border" required dir="ltr" />
                <Input placeholder="البريد الإلكتروني" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-secondary border-border" dir="ltr" />
                <Textarea placeholder="رسالتك أو تفاصيل إضافية..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="bg-secondary border-border" rows={4} />
                <Button type="submit" variant="orange" className="w-full" disabled={loading}>
                  {loading ? "جاري الإرسال..." : "إرسال الطلب"}
                </Button>
              </form>
            )}
          </div>

          {/* Featured Units */}
          <div>
            <h2 className="text-2xl font-bold mb-6">وحدات <span className="text-orange">مميزة متاحة</span></h2>
            {availableUnits && availableUnits.length > 0 ? (
              <div className="space-y-4">
                {availableUnits.map((unit) => (
                  <div key={unit.id} className="card-premium p-4 border-orange/30">
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
              <p className="text-muted-foreground">سيتم عرض الوحدات المتاحة قريباً</p>
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
