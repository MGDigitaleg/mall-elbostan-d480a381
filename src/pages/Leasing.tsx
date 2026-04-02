import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, CheckCircle2, Compass, MapPin, Phone, Shield, Store, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import facadeImage from "@/assets/mall-facade.jpg";

const reveal = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };
const fadeChild = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

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
      <SEOHead
        title="التأجير"
        titleEn="Leasing"
        description="استفسر عن الوحدات التجارية في مول البستان داخل وجهة تقنية مصرية راقية."
        descriptionEn="Enquire about commercial units at Mall Elbostan, a premium Egyptian technology mall."
        breadcrumbs={[{ name: "التأجير", url: "/leasing" }]}
      />

      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(170deg, hsl(222 36% 7%) 0%, hsl(222 32% 11%) 100%)" }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 55% 50% at 70% 50%, hsl(24 85% 50% / 0.04), transparent 70%)" }} />

        <div className="relative mx-auto w-full max-w-[1400px] px-5 md:px-8 lg:px-14">
          <div className="grid min-h-[60vh] items-center gap-10 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14 lg:py-0">
            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-[2px] w-8" style={{ background: "hsl(24 85% 50% / 0.5)" }} />
                <span className="font-poppins text-[0.72rem] font-semibold tracking-[0.2em] uppercase" style={{ color: "hsl(220 50% 68%)" }}>
                  فرص تجارية
                </span>
              </div>

              <h1 className="max-w-[26rem] text-[2.2rem] font-extrabold leading-[1.04] text-white md:text-[3rem] lg:text-[3.4rem]">
                فرص تجارية في وجهة يقصدها الجمهور المناسب
              </h1>

              <p className="max-w-[28rem] text-[0.95rem] leading-[2]" style={{ color: "hsl(220 14% 72%)" }}>
                اطّلع على الوحدات المتاحة، قيّم الموقع، وابدأ استفسارك بخطوة واحدة مباشرة.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 pt-1">
                <a href="#inquiry">
                  <Button variant="orange" size="lg" className="h-12 gap-2 rounded-xl px-7 font-bold">
                    <Phone className="h-4 w-4" /> ابدأ الاستفسار
                  </Button>
                </a>
                <Link to="/map">
                  <Button size="lg" className="h-12 gap-2 rounded-xl border border-white/12 bg-white/6 px-7 font-semibold text-white hover:bg-white/12">
                    <Compass className="h-4 w-4" /> الخريطة التفاعلية
                  </Button>
                </Link>
              </div>

              {/* inline stats bar */}
              <div className="flex items-center gap-6 border-t border-white/8 pt-5">
                {[
                  { v: "6+", l: "فئات تقنية" },
                  { v: "3", l: "أدوار" },
                  { v: "50+", l: "وحدة متاحة" },
                ].map((s, i) => (
                  <div key={s.l} className="flex items-center gap-5">
                    <div>
                      <p className="font-poppins text-[1.4rem] font-bold text-white">{s.v}</p>
                      <p className="text-[0.7rem] font-medium" style={{ color: "hsl(220 14% 58%)" }}>{s.l}</p>
                    </div>
                    {i < 2 && <div className="h-7 w-px" style={{ background: "hsl(0 0% 100% / 0.08)" }} />}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* image */}
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }} className="hidden lg:flex lg:items-center lg:justify-center">
              <div className="w-full max-w-[400px]">
                <div className="editorial-frame-dark overflow-hidden rounded-2xl">
                  <div className="image-shell img-wash-dark aspect-[3/4]">
                    <img src={facadeImage} alt="واجهة مول البستان" className="img-grade-dark h-full w-full object-cover" loading="eager" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="band-primary" />

      {/* ═══ VALUE STRIP ═══ */}
      <section className="section-ivory py-10 md:py-14">
        <div className="container max-w-[1200px]">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} className="grid gap-4 md:grid-cols-3">
            {[
              { icon: Building2, title: "وحدات واضحة المعالم", desc: "حالة كل وحدة ظاهرة بالمساحة والموقع." },
              { icon: Shield, title: "معلومات بلا مبالغة", desc: "بيانات مختصرة تساعدك على تقييم الفرصة." },
              { icon: Compass, title: "ربط مباشر بالخريطة", desc: "من الوحدة لموقعها الفعلي بضغطة واحدة." },
            ].map((item) => (
              <motion.div key={item.title} variants={fadeChild} className="card-architectural p-5">
                <div className="mb-3 icon-shell h-9 w-9">
                  <item.icon className="h-4 w-4" />
                </div>
                <h2 className="text-[0.95rem] font-bold text-foreground">{item.title}</h2>
                <p className="mt-2 text-[0.85rem] leading-7 text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ INQUIRY + UNITS ═══ */}
      <section id="inquiry" className="heritage-deep page-section scroll-mt-20">
        <div className="container max-w-[1200px]">
          <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.95fr_1.05fr]">
              {/* Form */}
              <div className="heritage-surface p-7 md:p-8">
                <p className="section-kicker" style={{ color: "hsl(var(--orange) / 0.7)" }}>استفسار</p>
                <h2 className="mb-2 text-2xl font-bold text-white">ابدأ استفسارك الآن</h2>
                <p className="mb-6 text-sm leading-7" style={{ color: "hsl(220 15% 70%)" }}>
                  أرسل بياناتك الأساسية وسيتواصل معك فريق التأجير بمعلومات تفصيلية عن الوحدات المناسبة.
                </p>

                {submitted ? (
                  <div className="py-10 text-center">
                    <CheckCircle2 className="mx-auto mb-3 h-12 w-12 text-success" />
                    <p className="text-lg font-bold text-white">تم إرسال طلبك بنجاح</p>
                    <p className="mt-2 text-sm" style={{ color: "hsl(220 15% 70%)" }}>هنرجع لك في أقرب وقت</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <FormInput placeholder="الاسم الكامل *" value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} required />
                    <FormInput placeholder="اسم الشركة" value={form.company} onChange={(v) => setForm({ ...form, company: v })} />
                    <FormInput placeholder="رقم الهاتف *" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required dir="ltr" />
                    <FormInput placeholder="البريد الإلكتروني" value={form.email} onChange={(v) => setForm({ ...form, email: v })} type="email" dir="ltr" />
                    <textarea
                      placeholder="رسالتك أو تفاصيل إضافية..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={4}
                      className="w-full rounded-lg px-4 py-3 text-sm text-white outline-none transition-colors"
                      style={{ border: "1px solid hsl(0 0% 100% / 0.08)", background: "hsl(0 0% 100% / 0.04)" }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = "hsl(var(--orange) / 0.35)"; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = "hsl(0 0% 100% / 0.08)"; }}
                    />
                    <Button type="submit" variant="orange" className="w-full h-12 rounded-xl font-bold" disabled={loading}>
                      {loading ? "جاري الإرسال..." : "إرسال الطلب"}
                    </Button>
                  </form>
                )}
              </div>

              {/* Units */}
              <div className="space-y-5">
                <div>
                  <p className="section-kicker" style={{ color: "hsl(var(--orange) / 0.7)" }}>وحدات مميزة</p>
                  <h2 className="mb-1 text-2xl font-bold text-white">وحدات <span className="text-orange">متاحة الآن</span></h2>
                  <p className="text-sm leading-7" style={{ color: "hsl(220 12% 62%)" }}>عينة من الوحدات البارزة — تابع التفاصيل على الخريطة.</p>
                </div>

                {availableUnits && availableUnits.length > 0 ? (
                  <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-3">
                    {availableUnits.map((unit) => (
                      <motion.div key={unit.id} variants={fadeChild} className="heritage-surface p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-bold text-orange">وحدة {unit.unit_code}</h3>
                            <div className="mt-1 flex flex-wrap gap-3 text-sm" style={{ color: "hsl(220 15% 70%)" }}>
                              {unit.area_sqm && <span>{unit.area_sqm} م²</span>}
                              {unit.activity_suggestion && <span>{unit.activity_suggestion}</span>}
                            </div>
                          </div>
                          {unit.price_note && (
                            <span className="shrink-0 rounded-full px-2.5 py-1 text-[0.72rem] font-semibold text-orange" style={{ border: "1px solid hsl(var(--orange) / 0.2)", background: "hsl(var(--orange) / 0.08)" }}>
                              {unit.price_note}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <div className="heritage-surface p-8 text-center">
                    <Store className="mx-auto mb-3 h-7 w-7" style={{ color: "hsl(var(--orange) / 0.4)" }} />
                    <p className="text-sm font-semibold text-white">سيتم عرض الوحدات المتاحة قريبًا</p>
                  </div>
                )}

                <Link to="/map" className="block">
                  <Button variant="outline-blue" className="h-11 w-full gap-2 rounded-xl">
                    <Compass className="h-4 w-4" /> عرض الخريطة التفاعلية
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ WHY LEASING ═══ */}
      <section className="page-section">
        <div className="container max-w-[900px] text-center">
          <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="section-kicker">لماذا مول البستان</p>
            <h2 className="section-title mx-auto max-w-[24rem]">وجهة تجارية مبنية على الطلب الحقيقي</h2>
            <p className="mx-auto mt-4 max-w-[32rem] text-[0.95rem] leading-[2] text-muted-foreground">
              أكثر من 50 وحدة تجارية في موقع يخدم القاهرة الجديدة والمدن المحيطة — مع جمهور تقني جاهز ومستوى حركة مرتفع.
            </p>

            <div className="mx-auto mt-8 grid max-w-[40rem] gap-4 sm:grid-cols-3">
              {[
                { title: "موقع استراتيجي", desc: "في قلب القاهرة الجديدة بالقرب من المدينتي والرحاب" },
                { title: "جمهور متخصص", desc: "طلاب ومهنيون وشركات في قطاع التقنية" },
                { title: "بنية تحتية جاهزة", desc: "وحدات مجهزة وجاهزة للتشغيل الفوري" },
              ].map((item) => (
                <div key={item.title} className="card-editorial p-5 text-center">
                  <h3 className="text-sm font-bold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-[0.82rem] leading-6 text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>

            <Link to="/contact" className="mt-8 inline-block">
              <Button variant="outline-blue" size="lg" className="h-12 rounded-xl px-8">تواصل مع فريق التأجير</Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

/* ── Dark form input ── */
function FormInput({ placeholder, value, onChange, required, type = "text", dir }: { placeholder: string; value: string; onChange: (v: string) => void; required?: boolean; type?: string; dir?: string }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      dir={dir}
      className="h-12 w-full rounded-lg px-4 text-sm text-white outline-none transition-colors"
      style={{ border: "1px solid hsl(0 0% 100% / 0.08)", background: "hsl(0 0% 100% / 0.04)" }}
      onFocus={(e) => { e.currentTarget.style.borderColor = "hsl(var(--orange) / 0.35)"; }}
      onBlur={(e) => { e.currentTarget.style.borderColor = "hsl(0 0% 100% / 0.08)"; }}
    />
  );
}

export default Leasing;
