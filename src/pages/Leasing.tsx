import { useState } from "react";
import { ArrowLeft, Building, CheckCircle2, Compass, MapPin, Store, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import facadeImage from "@/assets/mall-facade.jpg";

const sectionReveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

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

      {/* ═══════════ HERO ═══════════ */}
      <section className="heritage-section relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: "linear-gradient(hsl(0 0% 100% / 0.02) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100% / 0.02) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        <div className="relative mx-auto w-full max-w-[1400px] px-5 md:px-8 lg:px-14">
          <div className="grid min-h-[60vh] items-center gap-10 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:py-0">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="accent-line bg-orange/50" />
                <span className="text-[0.76rem] font-semibold tracking-[0.14em] text-white/40 uppercase" style={{ fontFamily: "var(--font-poppins)" }}>
                  فرص تجارية
                </span>
              </div>

              <h1 className="max-w-[30rem] text-[2rem] font-extrabold leading-[1.06] text-white md:text-[3rem] lg:text-[3.6rem]">
                فرص تجارية في وجهة يقصدها الجمهور المناسب
              </h1>

              <p className="max-w-[28rem] text-[1rem] leading-[2] text-white/42 md:text-[1.1rem]">
                اطّلع على الوحدات المتاحة، قيّم الموقع، وابدأ استفسارك بخطوة واحدة مباشرة.
              </p>

              <div className="grid max-w-[28rem] grid-cols-3 gap-3 pt-2">
                {[
                  { icon: Store, v: "6+", l: "فئات تقنية" },
                  { icon: MapPin, v: "3", l: "أدوار" },
                  { icon: TrendingUp, v: "50+", l: "وحدة متاحة" },
                ].map((s) => (
                  <div key={s.l} className="rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-center">
                    <s.icon className="mx-auto mb-1 h-4 w-4 text-orange/60" />
                    <p className="font-poppins text-lg font-bold text-white">{s.v}</p>
                    <p className="text-[0.7rem] text-white/30">{s.l}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <a href="#inquiry">
                  <Button variant="orange" size="lg" className="h-12 rounded-xl px-7 font-bold">
                    ابدأ الاستفسار
                  </Button>
                </a>
                <Link to="/map">
                  <Button size="lg" className="h-12 rounded-xl border border-white/12 bg-white/6 px-7 font-semibold text-white hover:bg-white/12">
                    <Compass className="ml-2 h-4 w-4" />
                    الخريطة التفاعلية
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="hidden lg:flex items-center justify-center"
            >
              <div className="image-architectural overflow-hidden rounded-2xl">
                <img src={facadeImage} alt="واجهة مول البستان" className="aspect-[4/5] w-full max-w-[440px] object-cover" loading="eager" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════ VALUE STRIP ═══════════ */}
      <section className="border-b border-border bg-card py-8">
        <div className="container max-w-[1200px]">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { title: "وحدات واضحة المعالم", desc: "حالة كل وحدة ظاهرة بالمساحة والموقع." },
              { title: "معلومات بلا مبالغة", desc: "بيانات مختصرة تساعدك على تقييم الفرصة." },
              { title: "ربط مباشر بالخريطة", desc: "من الوحدة لموقعها الفعلي بضغطة واحدة." },
            ].map((item) => (
              <div key={item.title} className="card-architectural rounded-xl p-5 pr-7">
                <h2 className="text-[0.95rem] font-bold text-foreground">{item.title}</h2>
                <p className="mt-2 text-[0.85rem] leading-7 text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ INQUIRY + UNITS ═══════════ */}
      <section id="inquiry" className="page-section scroll-mt-20">
        <div className="container max-w-[1200px]">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="card-layered rounded-2xl p-8">
                <h2 className="mb-2 text-2xl font-bold">ابدأ استفسارك الآن</h2>
                <p className="mb-6 text-sm leading-7 text-muted-foreground">أرسل بياناتك الأساسية وسيتواصل معك فريق التأجير بمعلومات تفصيلية عن الوحدات المناسبة.</p>
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
                <div className="card-layered p-6">
                  <h2 className="mb-3 text-2xl font-bold">وحدات <span className="text-orange">مميزة متاحة</span></h2>
                  <p className="text-sm leading-7 text-muted-foreground">عينة من الوحدات البارزة، ثم يمكنك متابعة التفاصيل على الخريطة.</p>
                </div>
                {availableUnits && availableUnits.length > 0 ? (
                  <div className="space-y-3">
                    {availableUnits.map((unit) => (
                      <div key={unit.id} className="card-architectural rounded-xl border-orange/15 p-5 pr-7">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-bold text-orange">وحدة {unit.unit_code}</h3>
                            {unit.area_sqm && <p className="text-sm text-muted-foreground">{unit.area_sqm} م²</p>}
                            {unit.activity_suggestion && <p className="text-sm text-muted-foreground">{unit.activity_suggestion}</p>}
                          </div>
                          {unit.price_note && <span className="rounded-full bg-orange/8 px-2.5 py-1 text-xs font-semibold text-orange">{unit.price_note}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="card-layered p-6 text-muted-foreground">سيتم عرض الوحدات المتاحة قريباً</div>
                )}
                <Link to="/map" className="block">
                  <Button variant="outline-blue" className="w-full rounded-xl">عرض الخريطة التفاعلية</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Leasing;
