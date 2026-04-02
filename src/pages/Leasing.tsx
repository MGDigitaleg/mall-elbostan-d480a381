import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Building2, CheckCircle2, Compass, Layers, MapPin, Phone, Shield, Store,
  Target, TrendingUp, Users,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import entranceImage from "@/assets/mall-entrance.jpg";

const reveal = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { visible: { transition: { staggerChildren: 0.06 } } };
const fadeChild = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

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
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(170deg, hsl(222 36% 7%) 0%, hsl(222 32% 11%) 100%)" }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 55% 50% at 70% 50%, hsl(24 85% 50% / 0.04), transparent 70%)" }} />

        <div className="relative mx-auto w-full max-w-[1400px] px-5 md:px-8 lg:px-12">
          <div className="grid min-h-[44vh] items-center gap-6 py-7 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 lg:py-0">
            <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-3.5">
              <div className="flex items-center gap-2.5">
                <div className="h-[3px] w-8 rounded-full" style={{ background: "hsl(var(--heritage))" }} />
                <span className="font-poppins text-[0.6rem] font-bold tracking-[0.22em] uppercase" style={{ color: "hsl(var(--heritage))" }}>
                  Commercial Leasing
                </span>
              </div>

              <h1 className="max-w-[26rem] text-[1.5rem] font-extrabold leading-[1.1] dark-heading md:text-[1.9rem] lg:text-[2.1rem]">
                وحدتك في الوجهة التي يقصدها الجمهور
              </h1>

              <p className="max-w-[28rem] text-[0.86rem] leading-[1.8] dark-body">
                جمهور متخصص، حركة مستمرة، وبنية جاهزة للتشغيل.
              </p>

              <div className="flex flex-wrap gap-2.5 pt-0.5">
                <a href="#inquiry">
                  <Button variant="orange" className="h-10 gap-2 rounded-xl px-6 font-bold text-[0.84rem]">
                    <Phone className="h-3.5 w-3.5" /> ابدأ الاستفسار
                  </Button>
                </a>
                <Link to="/map">
                  <Button className="h-10 gap-2 rounded-xl px-6 font-semibold text-[0.84rem]" style={{ border: "1px solid hsl(0 0% 100% / 0.12)", background: "hsl(0 0% 100% / 0.06)", color: "#E2E8F0" }}>
                    <Compass className="h-3.5 w-3.5" /> الخريطة التفاعلية
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-5 border-t pt-3.5" style={{ borderColor: "hsl(0 0% 100% / 0.08)" }}>
                {[
                  { v: "6+", l: "فئات تقنية" },
                  { v: "3", l: "أدوار تجارية" },
                  { v: "50+", l: "وحدة" },
                ].map((s, i) => (
                  <div key={s.l} className="flex items-center gap-5">
                    <div>
                      <p className="font-poppins text-[1.1rem] font-extrabold dark-heading">{s.v}</p>
                      <p className="text-[0.64rem] font-semibold dark-muted">{s.l}</p>
                    </div>
                    {i < 2 && <div className="h-5 w-px" style={{ background: "hsl(0 0% 100% / 0.08)" }} />}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Image */}
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.1 }} className="hidden lg:flex lg:items-center lg:justify-center">
              <div className="w-full max-w-[320px]">
                <div className="frame-heritage overflow-hidden">
                  <div className="image-shell img-wash-dark aspect-[3/4]" style={{ maxHeight: "340px" }}>
                    <img src={entranceImage} alt="مدخل مول البستان" className="img-grade-arch h-full w-full object-cover object-[center_35%]" loading="eager" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="band-primary" />

      {/* ═══════════ WHY LEASE HERE ═══════════ */}
      <section className="py-6 md:py-7" style={{ background: "#FAFAF8" }}>
        <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8 lg:px-12">
          <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }}>
            <div className="mb-4 flex items-center gap-2.5">
              <div className="h-[3px] w-7 rounded-full" style={{ background: "hsl(var(--heritage))" }} />
              <span className="font-poppins text-[0.58rem] font-bold uppercase tracking-[0.22em]" style={{ color: "hsl(var(--heritage))" }}>
                لماذا هنا
              </span>
            </div>
            <h2 className="max-w-[24rem] text-[1.15rem] font-extrabold leading-[1.1] light-heading md:text-[1.4rem]">
              لماذا تختار مول البستان
            </h2>
            <p className="mt-2 max-w-[32rem] text-[0.82rem] leading-[1.8] light-body">
              الزبون الذي يدخل يحمل قرار شراء — هذا ما يصنع الفرق.
            </p>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: MapPin, title: "موقع محوري", desc: "القاهرة الجديدة — حركة مرور مستهدفة." },
              { icon: Users, title: "جمهور بنيّة شراء", desc: "زوّار بقرار شراء واضح." },
              { icon: Layers, title: "منظومة متكاملة", desc: "ستة تخصصات تقنية تحت سقف واحد." },
              { icon: TrendingUp, title: "نمو مخطّط", desc: "التواجد المبكّر يمنحك أفضلية." },
            ].map((item) => (
              <motion.div key={item.title} variants={fadeChild} className="rounded-xl border border-border bg-card p-3.5">
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary">
                  <item.icon className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-[0.84rem] font-bold light-heading">{item.title}</h3>
                <p className="mt-1.5 text-[0.78rem] leading-6 light-body">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════ AUDIENCE & CATEGORY FIT ═══════════ */}
      <section className="py-6 md:py-7" style={{ background: "#F5F2EC" }}>
        <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8 lg:px-12">
          <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }}>
            <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-start">
              {/* Audience */}
              <div>
                <div className="mb-3 flex items-center gap-2.5">
                  <div className="h-[3px] w-6 rounded-full" style={{ background: "hsl(var(--heritage))" }} />
                  <span className="font-poppins text-[0.58rem] font-bold uppercase tracking-[0.22em]" style={{ color: "hsl(var(--heritage))" }}>
                    Audience Fit
                  </span>
                </div>
                <h2 className="max-w-[20rem] text-[1.05rem] font-extrabold leading-[1.1] light-heading md:text-[1.25rem]">
                  من يزور المول — ولماذا
                </h2>
                <p className="mt-2 max-w-[26rem] text-[0.8rem] leading-[1.8] light-body">
                  جمهور يقصد المول لأنه يحتاج منتجًا تقنيًا.
                </p>

                <div className="mt-4 space-y-1.5">
                  {[
                    { label: "طلاب الجامعات", sub: "لابتوب، إكسسوارات، طباعة" },
                    { label: "لاعبون ومحبّو التقنية", sub: "جيمينج، كمبيوتر، قطع غيار" },
                    { label: "أصحاب مشاريع", sub: "شبكات، أنظمة أمنية، صيانة" },
                    { label: "شركات ومؤسسات", sub: "أجهزة بالجملة، دعم فني" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-2.5 rounded-lg border border-border bg-card p-3">
                      <Target className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                      <div>
                        <p className="text-[0.82rem] font-bold light-heading">{item.label}</p>
                        <p className="mt-0.5 text-[0.72rem] light-muted">{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <div className="mb-3 flex items-center gap-2.5">
                  <div className="h-[3px] w-6 rounded-full" style={{ background: "hsl(var(--heritage))" }} />
                  <span className="font-poppins text-[0.58rem] font-bold uppercase tracking-[0.22em]" style={{ color: "hsl(var(--heritage))" }}>
                    Category Fit
                  </span>
                </div>
                <h2 className="max-w-[20rem] text-[1.05rem] font-extrabold leading-[1.1] light-heading md:text-[1.25rem]">
                  الفئات التي تحقق نتائج هنا
                </h2>
                <p className="mt-2 max-w-[26rem] text-[0.8rem] leading-[1.8] light-body">
                  كل فئة تدعم الأخرى وتُضاعف قيمة التجربة.
                </p>

                <div className="mt-4 grid grid-cols-2 gap-1.5">
                  {[
                    "الهواتف والإكسسوارات",
                    "الكمبيوتر والأجهزة",
                    "الألعاب والترفيه",
                    "الطباعة والتصوير",
                    "الصيانة والدعم الفني",
                    "الشبكات والأنظمة الأمنية",
                  ].map((cat) => (
                    <div key={cat} className="rounded-lg border border-border bg-card px-3 py-2.5 text-center">
                      <p className="text-[0.78rem] font-bold light-heading">{cat}</p>
                    </div>
                  ))}
                </div>

                <p className="mt-3 text-[0.76rem] leading-6 light-muted">
                  نشاطك يكمّل هذه الفئات؟ هذا هو الموقع.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ INQUIRY + AVAILABLE UNITS ═══════════ */}
      <section id="inquiry" className="py-7 md:py-9 scroll-mt-20" style={{ background: "#071326" }}>
        <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8 lg:px-12">
          <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.95fr_1.05fr]">

              {/* ── FORM ── */}
              <div className="rounded-xl p-5 md:p-6" style={{ background: "hsl(0 0% 100% / 0.04)", border: "1px solid hsl(0 0% 100% / 0.08)" }}>
                <div className="mb-1.5 flex items-center gap-2">
                  <div className="h-[3px] w-5 rounded-full" style={{ background: "hsl(var(--heritage))" }} />
                  <span className="font-poppins text-[0.58rem] font-bold uppercase tracking-[0.22em]" style={{ color: "hsl(var(--heritage))" }}>
                    Inquiry
                  </span>
                </div>
                <h2 className="mb-1 text-[1.1rem] font-extrabold dark-heading md:text-[1.25rem]">ابدأ استفسارك</h2>
                <p className="mb-4 text-[0.8rem] leading-6 dark-body">
                  أرسل بياناتك — فريق التأجير سيتواصل معك بتفاصيل الوحدات.
                </p>

                {submitted ? (
                  <div className="py-6 text-center">
                    <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: "hsl(152 69% 31% / 0.15)", border: "1px solid hsl(152 69% 31% / 0.2)" }}>
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    </div>
                    <p className="text-[0.95rem] font-extrabold dark-heading">تم إرسال طلبك</p>
                    <p className="mt-1.5 text-[0.8rem] dark-body">فريق التأجير سيتواصل معك بتفاصيل الوحدات المناسبة.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                      <label className="mb-1 block text-[0.72rem] font-bold dark-heading">الاسم الكامل *</label>
                      <FormInput value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} required />
                    </div>
                    <div>
                      <label className="mb-1 block text-[0.72rem] font-bold dark-heading">اسم الشركة أو النشاط</label>
                      <FormInput value={form.company} onChange={(v) => setForm({ ...form, company: v })} />
                    </div>
                    <div>
                      <label className="mb-1 block text-[0.72rem] font-bold dark-heading">رقم الهاتف *</label>
                      <FormInput value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required dir="ltr" />
                    </div>
                    <div>
                      <label className="mb-1 block text-[0.72rem] font-bold dark-heading">البريد الإلكتروني</label>
                      <FormInput value={form.email} onChange={(v) => setForm({ ...form, email: v })} type="email" dir="ltr" />
                    </div>
                    <div>
                      <label className="mb-1 block text-[0.72rem] font-bold dark-heading">رسالتك أو تفاصيل إضافية</label>
                      <textarea
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        rows={2}
                        className="w-full rounded-lg px-3.5 py-2.5 text-[0.84rem] outline-none transition-colors"
                        style={{ border: "1px solid hsl(0 0% 100% / 0.1)", background: "hsl(0 0% 100% / 0.05)", color: "#F8FAFC" }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = "hsl(var(--orange) / 0.35)"; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = "hsl(0 0% 100% / 0.1)"; }}
                      />
                    </div>
                    <Button type="submit" variant="orange" className="h-10 w-full rounded-xl text-[0.84rem] font-bold" disabled={loading}>
                      {loading ? "جاري الإرسال..." : "إرسال الطلب"}
                    </Button>
                    <p className="text-center text-[0.68rem] dark-muted">الرد خلال يوم عمل واحد</p>
                  </form>
                )}
              </div>

              {/* ── AVAILABLE UNITS ── */}
              <div className="space-y-4">
                <div>
                  <div className="mb-1.5 flex items-center gap-2">
                    <div className="h-[3px] w-5 rounded-full" style={{ background: "#E8740E" }} />
                    <span className="font-poppins text-[0.58rem] font-bold uppercase tracking-[0.22em]" style={{ color: "#E8740E" }}>
                      Available Units
                    </span>
                  </div>
                  <h2 className="mb-1 text-[1.1rem] font-extrabold dark-heading md:text-[1.25rem]">
                    وحدات <span style={{ color: "#E8740E" }}>متاحة الآن</span>
                  </h2>
                  <p className="text-[0.78rem] leading-6 dark-body">عيّنة من الوحدات البارزة — التفاصيل الكاملة على الخريطة.</p>
                </div>

                {availableUnits && availableUnits.length > 0 ? (
                  <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-2">
                    {availableUnits.map((unit) => (
                      <motion.div
                        key={unit.id}
                        variants={fadeChild}
                        className="rounded-lg p-3 transition-colors hover:bg-white/[0.06]"
                        style={{ background: "hsl(0 0% 100% / 0.04)", border: "1px solid hsl(0 0% 100% / 0.08)" }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-[0.86rem] font-bold" style={{ color: "#E8740E" }}>وحدة {unit.unit_code}</h3>
                            <div className="mt-0.5 flex flex-wrap gap-2.5 text-[0.78rem] dark-body">
                              {unit.area_sqm && <span>{unit.area_sqm} م²</span>}
                              {unit.activity_suggestion && (
                                <>
                                  <span className="dark-muted">—</span>
                                  <span>{unit.activity_suggestion}</span>
                                </>
                              )}
                            </div>
                          </div>
                          {unit.price_note && (
                            <span className="shrink-0 rounded-md px-2 py-0.5 text-[0.68rem] font-bold" style={{ border: "1px solid hsl(24 85% 50% / 0.2)", background: "hsl(24 85% 50% / 0.08)", color: "#E8740E" }}>
                              {unit.price_note}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <div className="rounded-lg border border-dashed p-5 text-center" style={{ borderColor: "hsl(0 0% 100% / 0.1)" }}>
                    <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: "hsl(24 85% 50% / 0.08)" }}>
                      <Store className="h-4 w-4" style={{ color: "#E8740E40" }} />
                    </div>
                    <p className="text-[0.82rem] font-bold dark-heading">الوحدات المتاحة ستظهر هنا قريبًا</p>
                    <p className="mt-0.5 text-[0.72rem] dark-muted">تابع الخريطة التفاعلية لأحدث التحديثات</p>
                  </div>
                )}

                <Link to="/map" className="block">
                  <Button variant="outline-blue" className="h-9 w-full gap-2 rounded-lg font-bold text-[0.82rem]">
                    <Compass className="h-3.5 w-3.5" /> عرض الخريطة التفاعلية
                  </Button>
                </Link>

                {/* Trust strip */}
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { icon: Shield, label: "عقود واضحة" },
                    { icon: Building2, label: "وحدات جاهزة" },
                    { icon: Phone, label: "رد سريع" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-1.5 rounded-lg px-2.5 py-2" style={{ background: "hsl(0 0% 100% / 0.04)", border: "1px solid hsl(0 0% 100% / 0.06)" }}>
                      <item.icon className="h-3 w-3 dark-muted" />
                      <span className="text-[0.7rem] font-bold dark-body">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ COMMERCIAL CONFIDENCE ═══════════ */}
      <section className="py-7 md:py-9" style={{ background: "#FAFAF8" }}>
        <div className="mx-auto w-full max-w-[1000px] px-5 md:px-8 lg:px-12 text-center">
          <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="mb-3 flex items-center justify-center gap-2.5">
              <div className="h-[3px] w-7 rounded-full" style={{ background: "hsl(var(--heritage))" }} />
              <span className="font-poppins text-[0.58rem] font-bold uppercase tracking-[0.22em]" style={{ color: "hsl(var(--heritage))" }}>
                Commercial Value
              </span>
              <div className="h-[3px] w-7 rounded-full" style={{ background: "hsl(var(--heritage))" }} />
            </div>

            <h2 className="mx-auto max-w-[22rem] text-[1.05rem] font-extrabold leading-[1.1] light-heading md:text-[1.25rem]">
              وجهة تجارية مبنية على طلب حقيقي
            </h2>
            <p className="mx-auto mt-2 max-w-[30rem] text-[0.82rem] leading-[1.8] light-body">
              بيئة تجارية منظّمة تخدم شريحة واضحة من السوق.
            </p>

            <div className="mx-auto mt-5 grid max-w-[42rem] gap-2 sm:grid-cols-3">
              {[
                { title: "موقع استراتيجي", desc: "القاهرة الجديدة — المدينتي والرحاب" },
                { title: "جمهور جاهز", desc: "زوار بنيّة شراء واضحة" },
                { title: "بنية جاهزة", desc: "وحدات قابلة للتشغيل الفوري" },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-border bg-card p-4 text-center">
                  <h3 className="text-[0.82rem] font-bold light-heading">{item.title}</h3>
                  <p className="mt-1.5 text-[0.76rem] leading-5 light-body">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-2.5">
              <a href="#inquiry">
                <Button variant="orange" className="h-9 gap-2 rounded-xl px-6 font-bold text-[0.82rem]">
                  <Phone className="h-3.5 w-3.5" /> ابدأ الاستفسار
                </Button>
              </a>
              <Link to="/contact">
                <Button variant="outline-blue" className="h-9 rounded-xl px-6 font-bold text-[0.82rem]">
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
      className="h-10 w-full rounded-lg px-3.5 text-[0.84rem] outline-none transition-colors"
      style={{ border: "1px solid hsl(0 0% 100% / 0.1)", background: "hsl(0 0% 100% / 0.05)", color: "#F8FAFC" }}
      onFocus={(e) => { e.currentTarget.style.borderColor = "hsl(var(--orange) / 0.35)"; }}
      onBlur={(e) => { e.currentTarget.style.borderColor = "hsl(0 0% 100% / 0.1)"; }}
    />
  );
}

export default Leasing;
