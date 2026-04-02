import { useState } from "react";
import { Briefcase, Upload, CheckCircle2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { LoadingGrid, EmptyState } from "@/components/ui/loading-states";

const Careers = () => {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ full_name: "", phone: "", email: "", message: "" });

  const { data: jobs, isLoading } = useQuery({
    queryKey: ["open-jobs"],
    queryFn: async () => {
      const { data } = await supabase.from("jobs").select("*").eq("status", "open").order("created_at", { ascending: false });
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
      lead_type: "careers",
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
      toast({ title: "تم الإرسال", description: "شكراً لتقديمك. سنتواصل معك قريباً!" });
    }
  };

  return (
    <MainLayout>
      <SEOHead title="الوظائف" titleEn="Careers" description="انضم لفريق عمل مول البستان - فرص وظيفية في قطاع التكنولوجيا والتجزئة." descriptionEn="Join Mall Elbostan's team - career opportunities in tech and retail." breadcrumbs={[{ name: "الوظائف", url: "/careers" }]} />
      <div className="container py-20">
        <div className="text-center mb-12">
          <Briefcase className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gradient-blue mb-4">فرص العمل</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">فرص مهنية في بيئة تجارية متخصصة — انضم لفريق مول البستان وكن جزءًا من وجهة تقنية رائدة.</p>
        </div>

        {isLoading ? <LoadingGrid count={3} /> : jobs && jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {jobs.map((job) => (
              <div key={job.id} className="card-premium p-6">
                <h3 className="font-bold text-lg text-foreground mb-2">{job.title_ar}</h3>
                {job.company_or_store && <p className="text-sm text-accent mb-2">{job.company_or_store}</p>}
                {job.job_type && <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{job.job_type}</span>}
                {job.description_ar && <p className="text-sm text-muted-foreground mt-3">{job.description_ar}</p>}
                {job.application_deadline && <p className="text-xs text-muted-foreground mt-2">آخر موعد: {new Date(job.application_deadline).toLocaleDateString("ar-EG")}</p>}
                <Button variant="outline-blue" size="sm" className="mt-4" onClick={() => setShowForm(true)}>تقدم الآن</Button>
              </div>
            ))}
          </div>
        ) : <EmptyState title="لا توجد وظائف شاغرة حالياً" description="تابعنا للتحديثات" />}

        {/* Application Form */}
        <div className="max-w-xl mx-auto">
          <Button variant="cta" className="w-full mb-6" onClick={() => setShowForm(!showForm)}>
            <Upload className="w-5 h-5 ml-2" /> أرسل سيرتك الذاتية
          </Button>
          {showForm && (
            <div className="card-premium p-8">
              {submitted ? (
                <div className="text-center py-6">
                  <CheckCircle2 className="w-10 h-10 text-success mx-auto mb-2" />
                  <p className="font-bold text-success">تم إرسال طلبك بنجاح!</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input placeholder="الاسم الكامل *" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="bg-secondary border-border" required />
                  <Input placeholder="رقم الهاتف *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="bg-secondary border-border" required dir="ltr" />
                  <Input placeholder="البريد الإلكتروني" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-secondary border-border" dir="ltr" />
                  <Textarea placeholder="نبذة عنك والوظيفة المطلوبة..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="bg-secondary border-border" rows={4} />
                  <Button type="submit" variant="cta" className="w-full" disabled={loading}>
                    {loading ? "جاري الإرسال..." : "إرسال الطلب"}
                  </Button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Careers;
