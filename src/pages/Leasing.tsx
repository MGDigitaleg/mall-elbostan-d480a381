import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Building2, CheckCircle2, Compass, Layers, MapPin, Phone, Shield, Store,
  Target, TrendingUp, Users, Ruler, ArrowUpLeft,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import entranceImage from "@/assets/mall-entrance.jpg";

const reveal = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { visible: { transition: { staggerChildren: 0.07 } } };
const fadeChild = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

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
        description="استفسر عن الوحدات التجارية في مول البستان — وجهة تقنية راسخة في القاهرة الجديدة."
        descriptionEn="Enquire about commercial units at Mall Elbostan, a trusted technology destination in New Cairo."
        breadcrumbs={[{ name: "التأجير", url: "/leasing" }]}
      />

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        {/* Ambient glows */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-0 top-0 h-[400px] w-[500px] rounded-full opacity-[0.05]"
               style={{ background: "radial-gradient(circle, hsl(25 85% 50%), transparent 70%)" }} />
          <div className="absolute bottom-0 left-1/4 h-[300px] w-[400px] rounded-full opacity-[0.04]"
               style={{ background: "radial-gradient(circle, hsl(var(--primary)), transparent 70%)" }} />
        </div>

        <div className="relative mx-auto w-full max-w-[1400px] px-5 md:px-8 lg:px-12">
          <div className="grid min-h-[48vh] items-center gap-8 py-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 lg:py-0">
            <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-5">
              <div className="flex items-center gap-2.5">
                <div className="h-[3px] w-8 rounded-full" style={{ background: "hsl(25 85% 50%)" }} />
                <span className="font-poppins text-[0.6rem] font-bold tracking-[0.25em] uppercase" style={{ color: "hsl(25 85% 50%)" }}>
                  Commercial Leasing
                </span>
              </div>

              <h1 className="max-w-[28rem] text-[1.6rem] font-extrabold leading-[1.1] md:text-[2rem] lg:text-[2.3rem]"
                  style={{ color: "hsl(0 0% 97%)", fontFamily: "var(--font-arabic-display)" }}>
                وحدتك في الوجهة التي يقصدها الجمهور
              </h1>

              <p className="max-w-[30rem] text-[0.88rem] leading-[1.85]" style={{ color: "hsl(220 15% 55%)" }}>
                جمهور متخصص، حركة مستمرة، وبنية جاهزة للتشغيل.
              </p>

              <div className="flex flex-wrap gap-3 pt-1">
                <a href="#inquiry">
                  <Button variant="orange" className="h-11 gap-2.5 rounded-xl px-6 font-bold text-[0.84rem] shadow-lg shadow-orange-500/20">
                    <Phone className="h-4 w-4" /> ابدأ الاستفسار
                  </Button>
                </a>
                <Link to="/map">
                  <Button className="h-11 gap-2.5 rounded-xl px-6 font-semibold text-[0.84rem] transition-all"
                          style={{ border: "1px solid hsl(0 0% 100% / 0.12)", background: "hsl(0 0% 100% / 0.06)", color: "hsl(220 20% 88%)" }}>
                    <Compass className="h-4 w-4" /> الخريطة التفاعلية
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-1.5 pt-2">
                {[
                  { v: "6+", l: "فئات تقنية", color: "hsl(0 0% 97%)" },
                  { v: "3", l: "أدوار تجارية", color: "hsl(0 0% 97%)" },
                  { v: "50+", l: "وحدة", color: "hsl(25 95% 55%)" },
                ].map((s, i) => (
                  <div key={s.l} className="flex items-center gap-1.5">
                    <div className="rounded-xl px-4 py-3 text-center"
                         style={{ background: "hsl(0 0% 100% / 0.04)", border: "1px solid hsl(0 0% 100% / 0.08)" }}>
                      <p className="font-poppins text-[1.15rem] font-extrabold" style={{ color: s.color }}>{s.v}</p>
                      <p className="mt-0.5 text-[0.58rem] font-semibold" style={{ color: "hsl(220 15% 45%)" }}>{s.l}</p>
                    </div>
                    {i < 2 && <div className="h-5 w-px" style={{ background: "hsl(0 0% 100% / 0.06)" }} />}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Image */}
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.15 }}
                        className="hidden lg:flex lg:items-center lg:justify-center">
              <div className="w-full max-w-[340px]">
                <div className="relative overflow-hidden rounded-2xl"
                     style={{ boxShadow: "0 12px 48px hsl(220 60% 5% / 0.5)" }}>
                  <div className="aspect-[3/4]" style={{ maxHeight: "380px" }}>
                    <img src={entranceImage} alt="مدخل مول البستان" className="h-full w-full object-cover object-[center_35%]" loading="eager" />
                  </div>
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, hsl(222 44% 6% / 0.5), transparent 50%)" }} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="h-px w-full" style={{ background: "linear-gradient(to left, transparent, hsl(25 85% 50% / 0.3), transparent)" }} />
      </section>

      {/* ═══════════ WHY LEASE HERE ═══════════ */}
      <section className="py-8 md:py-10" style={{ background: "hsl(0 0% 99%)" }}>
        <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8 lg:px-12">
          <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }}>
            <div className="mb-6">
              <p className="font-poppins text-[0.56rem] font-bold uppercase tracking-[0.25em]" style={{ color: "hsl(var(--primary))" }}>
                لماذا هنا
              </p>
              <h2 className="mt-1.5 max-w-[24rem] text-[1.2rem] font-extrabold leading-[1.15] text-foreground md:text-[1.45rem]"
                  style={{ fontFamily: "var(--font-arabic-display)" }}>
                لماذا تختار مول البستان
              </h2>
              <p className="mt-2 max-w-[32rem] text-[0.84rem] leading-[1.85] text-muted-foreground">
                الزبون الذي يدخل يحمل قرار شراء — هذا ما يصنع الفرق.
              </p>
            </div>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }}
                      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: MapPin, title: "موقع محوري", desc: "القاهرة الجديدة — حركة مرور مستهدفة." },
              { icon: Users, title: "جمهور بنيّة شراء", desc: "زوّار بقرار شراء واضح." },
              { icon: Layers, title: "منظومة متكاملة", desc: "ستة تخصصات تقنية تحت سقف واحد." },
              { icon: TrendingUp, title: "نمو مخطّط", desc: "التواجد المبكّر يمنحك أفضلية." },
            ].map((item) => (
              <motion.div key={item.title} variants={fadeChild}
                          className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/20 hover:shadow-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
                     style={{ background: "hsl(var(--primary) / 0.08)" }}>
                  <item.icon className="h-4.5 w-4.5 text-primary" />
                </div>
                <h3 className="text-[0.88rem] font-bold text-foreground">{item.title}</h3>
                <p className="mt-2 text-[0.8rem] leading-[1.7] text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════ AUDIENCE & CATEGORY FIT ═══════════ */}
      <section className="py-8 md:py-10" style={{ background: "hsl(38 25% 95%)" }}>
        <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8 lg:px-12">
          <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }}>
            <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-start">
              {/* Audience */}
              <div>
                <p className="font-poppins text-[0.56rem] font-bold uppercase tracking-[0.25em]" style={{ color: "hsl(var(--primary))" }}>
                  Audience Fit
                </p>
                <h2 className="mt-1.5 max-w-[22rem] text-[1.1rem] font-extrabold leading-[1.15] text-foreground md:text-[1.3rem]"
                    style={{ fontFamily: "var(--font-arabic-display)" }}>
                  من يزور المول — ولماذا
                </h2>
                <p className="mt-2 max-w-[28rem] text-[0.82rem] leading-[1.85] text-muted-foreground">
                  جمهور يقصد المول لأنه يحتاج منتجًا تقنيًا.
                </p>

                <div className="mt-5 space-y-2">
                  {[
                    { label: "طلاب الجامعات", sub: "لابتوب، إكسسوارات، طباعة" },
                    { label: "لاعبون ومحبّو التقنية", sub: "جيمينج، كمبيوتر، قطع غيار" },
                    { label: "أصحاب مشاريع", sub: "شبكات، أنظمة أمنية، صيانة" },
                    { label: "شركات ومؤسسات", sub: "أجهزة بالجملة، دعم فني" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-3 rounded-xl border border-border bg-card p-3.5 transition-all hover:border-primary/15">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                           style={{ background: "hsl(var(--primary) / 0.08)" }}>
                        <Target className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <div>
                        <p className="text-[0.84rem] font-bold text-foreground">{item.label}</p>
                        <p className="mt-0.5 text-[0.74rem] text-muted-foreground">{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <p className="font-poppins text-[0.56rem] font-bold uppercase tracking-[0.25em]" style={{ color: "hsl(var(--primary))" }}>
                  Category Fit
                </p>
                <h2 className="mt-1.5 max-w-[22rem] text-[1.1rem] font-extrabold leading-[1.15] text-foreground md:text-[1.3rem]"
                    style={{ fontFamily: "var(--font-arabic-display)" }}>
                  الفئات التي تحقق نتائج هنا
                </h2>
                <p className="mt-2 max-w-[28rem] text-[0.82rem] leading-[1.85] text-muted-foreground">
                  كل فئة تدعم الأخرى وتُضاعف قيمة التجربة.
                </p>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  {[
                    "الهواتف والإكسسوارات",
                    "الكمبيوتر والأجهزة",
                    "الألعاب والترفيه",
                    "الطباعة والتصوير",
                    "الصيانة والدعم الفني",
                    "الشبكات والأنظمة الأمنية",
                  ].map((cat) => (
                    <div key={cat} className="rounded-xl border border-border bg-card px-4 py-3 text-center transition-all hover:border-primary/15 hover:shadow-sm">
                      <p className="text-[0.8rem] font-bold text-foreground">{cat}</p>
                    </div>
                  ))}
                </div>

                <p className="mt-4 text-[0.78rem] leading-[1.7] text-muted-foreground">
                  نشاطك يكمّل هذه الفئات؟ هذا هو الموقع.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ INQUIRY + AVAILABLE UNITS ═══════════ */}
      <section id="inquiry" className="scroll-mt-20 py-10 md:py-12" style={{ background: "var(--gradient-hero)" }}>
        <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8 lg:px-12">
          <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.95fr_1.05fr]">

              {/* ── FORM ── */}
              <div className="rounded-2xl p-6 md:p-7"
                   style={{ background: "hsl(0 0% 100% / 0.04)", border: "1px solid hsl(0 0% 100% / 0.08)", boxShadow: "0 8px 32px hsl(220 60% 5% / 0.2)" }}>
                <div className="mb-2 flex items-center gap-2">
                  <div className="h-[3px] w-5 rounded-full" style={{ background: "hsl(25 85% 50%)" }} />
                  <span className="font-poppins text-[0.56rem] font-bold uppercase tracking-[0.25em]" style={{ color: "hsl(25 85% 50%)" }}>
                    Inquiry
                  </span>
                </div>
                <h2 className="mb-1.5 text-[1.15rem] font-extrabold md:text-[1.3rem]"
                    style={{ color: "hsl(0 0% 97%)", fontFamily: "var(--font-arabic-display)" }}>
                  ابدأ استفسارك
                </h2>
                <p className="mb-5 text-[0.82rem] leading-[1.7]" style={{ color: "hsl(220 15% 55%)" }}>
                  أرسل بياناتك — فريق التأجير سيتواصل معك بتفاصيل الوحدات.
                </p>

                {submitted ? (
                  <div className="py-8 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
                         style={{ background: "hsl(152 69% 31% / 0.15)", border: "1px solid hsl(152 69% 31% / 0.2)" }}>
                      <CheckCircle2 className="h-6 w-6" style={{ color: "hsl(152 69% 40%)" }} />
                    </div>
                    <p className="text-[1rem] font-extrabold" style={{ color: "hsl(0 0% 97%)" }}>تم إرسال طلبك</p>
                    <p className="mt-2 text-[0.82rem]" style={{ color: "hsl(220 15% 55%)" }}>
                      فريق التأجير سيتواصل معك بتفاصيل الوحدات المناسبة.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3.5">
                    <div>
                      <label className="mb-1.5 block text-[0.72rem] font-bold" style={{ color: "hsl(220 20% 80%)" }}>الاسم الكامل *</label>
                      <FormInput value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} required />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[0.72rem] font-bold" style={{ color: "hsl(220 20% 80%)" }}>اسم الشركة أو النشاط</label>
                      <FormInput value={form.company} onChange={(v) => setForm({ ...form, company: v })} />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[0.72rem] font-bold" style={{ color: "hsl(220 20% 80%)" }}>رقم الهاتف *</label>
                      <FormInput value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required dir="ltr" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[0.72rem] font-bold" style={{ color: "hsl(220 20% 80%)" }}>البريد الإلكتروني</label>
                      <FormInput value={form.email} onChange={(v) => setForm({ ...form, email: v })} type="email" dir="ltr" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[0.72rem] font-bold" style={{ color: "hsl(220 20% 80%)" }}>رسالتك أو تفاصيل إضافية</label>
                      <textarea
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        rows={3}
                        className="w-full rounded-xl px-4 py-3 text-[0.84rem] outline-none transition-all"
                        style={{ border: "1px solid hsl(0 0% 100% / 0.1)", background: "hsl(0 0% 100% / 0.05)", color: "hsl(0 0% 97%)" }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = "hsl(25 85% 50% / 0.4)"; e.currentTarget.style.boxShadow = "0 0 0 3px hsl(25 85% 50% / 0.08)"; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = "hsl(0 0% 100% / 0.1)"; e.currentTarget.style.boxShadow = "none"; }}
                      />
                    </div>
                    <Button type="submit" variant="orange" className="h-11 w-full rounded-xl text-[0.86rem] font-bold shadow-lg shadow-orange-500/20" disabled={loading}>
                      {loading ? "جاري الإرسال..." : "إرسال الطلب"}
                    </Button>
                    <p className="text-center text-[0.7rem]" style={{ color: "hsl(220 15% 50%)" }}>الرد خلال يوم عمل واحد</p>
                  </form>
                )}
              </div>

              {/* ── AVAILABLE UNITS ── */}
              <div className="space-y-5">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <div className="h-[3px] w-5 rounded-full" style={{ background: "hsl(25 95% 55%)" }} />
                    <span className="font-poppins text-[0.56rem] font-bold uppercase tracking-[0.25em]" style={{ color: "hsl(25 95% 55%)" }}>
                      Available Units
                    </span>
                  </div>
                  <h2 className="mb-1.5 text-[1.15rem] font-extrabold md:text-[1.3rem]"
                      style={{ color: "hsl(0 0% 97%)", fontFamily: "var(--font-arabic-display)" }}>
                    وحدات <span style={{ color: "hsl(25 95% 55%)" }}>متاحة الآن</span>
                  </h2>
                  <p className="text-[0.8rem] leading-[1.7]" style={{ color: "hsl(220 15% 55%)" }}>
                    عيّنة من الوحدات البارزة — التفاصيل الكاملة على الخريطة.
                  </p>
                </div>

                {availableUnits && availableUnits.length > 0 ? (
                  <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-2.5">
                    {availableUnits.map((unit) => (
                      <motion.div
                        key={unit.id}
                        variants={fadeChild}
                        className="group rounded-xl p-4 transition-all hover:bg-white/[0.06]"
                        style={{ background: "hsl(0 0% 100% / 0.04)", border: "1px solid hsl(0 0% 100% / 0.08)" }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-[0.88rem] font-bold" style={{ color: "hsl(25 95% 55%)" }}>وحدة {unit.unit_code}</h3>
                            <div className="mt-1 flex flex-wrap items-center gap-3 text-[0.78rem]" style={{ color: "hsl(220 15% 60%)" }}>
                              {unit.area_sqm && (
                                <span className="flex items-center gap-1">
                                  <Ruler className="h-3 w-3" />{unit.area_sqm} م²
                                </span>
                              )}
                              {unit.activity_suggestion && (
                                <span>{unit.activity_suggestion}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {unit.price_note && (
                              <span className="shrink-0 rounded-lg px-2.5 py-1 text-[0.68rem] font-bold"
                                    style={{ border: "1px solid hsl(25 85% 50% / 0.2)", background: "hsl(25 85% 50% / 0.08)", color: "hsl(25 95% 55%)" }}>
                                {unit.price_note}
                              </span>
                            )}
                            <ArrowUpLeft className="h-3.5 w-3.5 text-white/15 transition-all group-hover:text-white/40 group-hover:-translate-y-0.5 group-hover:-translate-x-0.5" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <div className="rounded-xl border border-dashed p-6 text-center" style={{ borderColor: "hsl(0 0% 100% / 0.1)" }}>
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl"
                         style={{ background: "hsl(25 85% 50% / 0.08)", border: "1px solid hsl(25 85% 50% / 0.12)" }}>
                      <Store className="h-5 w-5" style={{ color: "hsl(25 95% 55% / 0.5)" }} />
                    </div>
                    <p className="text-[0.85rem] font-bold" style={{ color: "hsl(0 0% 97%)" }}>الوحدات المتاحة ستظهر هنا قريبًا</p>
                    <p className="mt-1 text-[0.74rem]" style={{ color: "hsl(220 15% 50%)" }}>تابع الخريطة التفاعلية لأحدث التحديثات</p>
                  </div>
                )}

                <Link to="/map" className="block">
                  <Button variant="outline-blue" className="h-10 w-full gap-2.5 rounded-xl font-bold text-[0.84rem]"
                          style={{ borderColor: "hsl(0 0% 100% / 0.12)", color: "hsl(220 20% 80%)" }}>
                    <Compass className="h-4 w-4" /> عرض الخريطة التفاعلية
                  </Button>
                </Link>

                {/* Trust strip */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { icon: Shield, label: "عقود واضحة" },
                    { icon: Building2, label: "وحدات جاهزة" },
                    { icon: Phone, label: "رد سريع" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2 rounded-xl px-3 py-2.5"
                         style={{ background: "hsl(0 0% 100% / 0.04)", border: "1px solid hsl(0 0% 100% / 0.06)" }}>
                      <item.icon className="h-3.5 w-3.5" style={{ color: "hsl(220 15% 50%)" }} />
                      <span className="text-[0.72rem] font-bold" style={{ color: "hsl(220 20% 75%)" }}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ COMMERCIAL CONFIDENCE ═══════════ */}
      <section className="py-10 md:py-12" style={{ background: "hsl(0 0% 99%)" }}>
        <div className="mx-auto w-full max-w-[1000px] px-5 md:px-8 lg:px-12 text-center">
          <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="font-poppins text-[0.56rem] font-bold uppercase tracking-[0.25em]" style={{ color: "hsl(var(--primary))" }}>
              Commercial Value
            </p>

            <h2 className="mx-auto mt-2 max-w-[24rem] text-[1.1rem] font-extrabold leading-[1.15] text-foreground md:text-[1.3rem]"
                style={{ fontFamily: "var(--font-arabic-display)" }}>
              وجهة تجارية مبنية على طلب حقيقي
            </h2>
            <p className="mx-auto mt-2.5 max-w-[32rem] text-[0.84rem] leading-[1.85] text-muted-foreground">
              بيئة تجارية منظّمة تخدم شريحة واضحة من السوق.
            </p>

            <div className="mx-auto mt-7 grid max-w-[44rem] gap-3 sm:grid-cols-3">
              {[
                { title: "موقع استراتيجي", desc: "القاهرة الجديدة — المدينتي والرحاب" },
                { title: "جمهور جاهز", desc: "زوار بنيّة شراء واضحة" },
                { title: "بنية جاهزة", desc: "وحدات قابلة للتشغيل الفوري" },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-border bg-card p-5 text-center transition-all hover:shadow-sm">
                  <h3 className="text-[0.86rem] font-bold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-[0.78rem] leading-[1.7] text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <a href="#inquiry">
                <Button variant="orange" className="h-11 gap-2.5 rounded-xl px-6 font-bold text-[0.84rem] shadow-md shadow-orange-500/15">
                  <Phone className="h-4 w-4" /> ابدأ الاستفسار
                </Button>
              </a>
              <Link to="/contact">
                <Button variant="outline-blue" className="h-11 rounded-xl px-6 font-bold text-[0.84rem]">
                  تواصل مع الفريق
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

/* ── Dark form input ── */
function FormInput({ value, onChange, required, type = "text", dir }: { value: string; onChange: (v: string) => void; required?: boolean; type?: string; dir?: string }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      dir={dir}
      className="h-11 w-full rounded-xl px-4 text-[0.84rem] outline-none transition-all"
      style={{ border: "1px solid hsl(0 0% 100% / 0.1)", background: "hsl(0 0% 100% / 0.05)", color: "hsl(0 0% 97%)" }}
      onFocus={(e) => { e.currentTarget.style.borderColor = "hsl(25 85% 50% / 0.4)"; e.currentTarget.style.boxShadow = "0 0 0 3px hsl(25 85% 50% / 0.08)"; }}
      onBlur={(e) => { e.currentTarget.style.borderColor = "hsl(0 0% 100% / 0.1)"; e.currentTarget.style.boxShadow = "none"; }}
    />
  );
}

export default Leasing;
