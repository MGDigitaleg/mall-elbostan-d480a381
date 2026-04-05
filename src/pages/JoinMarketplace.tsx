import { useState } from "react";
import { motion } from "framer-motion";
import { Store, Globe, TrendingUp, ShoppingBag, Layers, Zap, CheckCircle2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const sectionReveal = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const JoinMarketplace = () => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ full_name: "", company: "", phone: "", email: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.phone.trim()) return;
    setSubmitting(true);
    const { error } = await supabase.from("leads").insert({
      lead_type: "marketplace",
      full_name: form.full_name,
      company: form.company || null,
      phone: form.phone,
      email: form.email || null,
      message: form.message || null,
      metadata: { source: "join-marketplace" },
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "خطأ", description: "حدث خطأ أثناء الإرسال", variant: "destructive" });
    } else {
      setSubmitted(true);
      toast({ title: "تم الإرسال بنجاح" });
    }
  };

  return (
    <MainLayout>
      <SEOHead
        title="انضم لسوق مول البستان"
        titleEn="Join Mall Elbostan Marketplace"
        description="اربط متجرك بسوق مول البستان الرقمي — اعرض منتجاتك لآلاف الزوار وزِد مبيعاتك."
        descriptionEn="Connect your store to Mall Elbostan's digital marketplace — showcase products to thousands of visitors."
        breadcrumbs={[{ name: "انضم للسوق", url: "/join-marketplace" }]}
      />

      {/* Hero */}
      <section style={{ background: "#071326" }}>
        <div className="container py-12 md:py-16">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-[2px] w-8 rounded-full" style={{ background: "#CDBB9A" }} />
              <span className="font-poppins text-[0.58rem] font-bold tracking-[0.22em] uppercase" style={{ color: "#CDBB9A" }}>
                Seller Program
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold dark-heading max-w-[26rem]">
              اعرض منتجاتك في <span style={{ color: "#CDBB9A" }}>سوق البستان الرقمي</span>
            </h1>
            <p className="mt-3 max-w-[28rem] text-[0.92rem] leading-[1.85] dark-body">
              وسّع نطاق وصولك — اربط متجرك بالمنصة الرقمية لمول البستان واستقبل طلبات جديدة.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-10 md:py-14 bg-secondary dark:bg-background">
        <div className="container max-w-5xl">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="chapter-shell pt-4 mb-8">
              <p className="section-kicker">لماذا تنضم</p>
              <h2 className="section-title max-w-[22rem]">فرصتك في السوق الرقمي.</h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: Globe, title: "وصول أوسع", desc: "منتجاتك تظهر لآلاف الزوار يوميًا على منصة مول البستان." },
                { icon: TrendingUp, title: "زيادة المبيعات", desc: "قناة بيع إضافية بدون تكاليف تسويق إضافية." },
                { icon: ShoppingBag, title: "كتالوج رقمي", desc: "اعرض منتجاتك بصور واضحة وأسعار محدّثة." },
                { icon: Store, title: "صفحة متجر مخصصة", desc: "صفحة خاصة بمتجرك على المنصة مع كل منتجاتك." },
                { icon: Layers, title: "تصنيف ذكي", desc: "منتجاتك تظهر ضمن الفئات المناسبة تلقائيًا." },
                { icon: Zap, title: "إدارة سهلة", desc: "أضف وحدّث منتجاتك بسهولة من لوحة التحكم." },
              ].map((b) => (
                <div key={b.title} className="rounded-xl border border-border bg-card p-5 transition-all hover:shadow-[var(--shadow-card)]">
                  <b.icon className="mb-3 h-5 w-5 text-primary" />
                  <p className="text-[0.92rem] font-bold text-foreground">{b.title}</p>
                  <p className="mt-1 text-[0.84rem] leading-7 text-muted-foreground">{b.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="heritage-deep py-10 md:py-14 relative overflow-hidden">
        <div className="relative container max-w-4xl">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="mb-8">
              <p className="section-kicker dark-kicker">كيف تنضم</p>
              <h2 className="section-title dark-heading">ثلاث خطوات فقط.</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { n: "01", title: "سجّل اهتمامك", desc: "أرسل بيانات متجرك عبر النموذج أدناه." },
                { n: "02", title: "ربط الكتالوج", desc: "فريقنا يساعدك في إضافة منتجاتك للمنصة." },
                { n: "03", title: "ابدأ البيع", desc: "منتجاتك تظهر للزوار وتبدأ في استقبال الطلبات." },
              ].map((step) => (
                <div key={step.n} className="heritage-surface rounded-lg p-5 text-center">
                  <span className="font-poppins text-[0.72rem] font-bold" style={{ color: "#CDBB9A" }}>{step.n}</span>
                  <p className="mt-2 text-[0.95rem] font-bold dark-heading">{step.title}</p>
                  <p className="mt-1 text-[0.84rem] leading-7 dark-body">{step.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-10 md:py-14 bg-secondary dark:bg-background">
        <div className="container max-w-xl">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500 mb-4" />
                <h2 className="text-xl font-bold text-foreground">تم استلام طلبك</h2>
                <p className="mt-2 text-[0.92rem] text-muted-foreground">سيتواصل معك فريقنا قريبًا لمناقشة تفاصيل الانضمام.</p>
                <Link to="/stores"><Button variant="outline-blue" className="mt-6">تصفّح المتاجر</Button></Link>
              </div>
            ) : (
              <>
                <div className="chapter-shell pt-4 mb-6 text-center">
                  <p className="section-kicker">سجّل الآن</p>
                  <h2 className="section-title">انضم لسوق مول البستان</h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">الاسم الكامل *</label>
                    <Input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="bg-card border-border" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">اسم المتجر / الشركة</label>
                    <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="bg-card border-border" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">رقم الهاتف *</label>
                    <Input required dir="ltr" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="bg-card border-border" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">البريد الإلكتروني</label>
                    <Input dir="ltr" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-card border-border" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">رسالة أو ملاحظات</label>
                    <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="bg-card border-border" rows={3} />
                  </div>
                  <Button type="submit" variant="cta" className="w-full h-11" disabled={submitting}>
                    {submitting ? "جاري الإرسال..." : "أرسل طلب الانضمام"}
                  </Button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

export default JoinMarketplace;
