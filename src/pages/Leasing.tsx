import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Building2, CheckCircle2, Compass, Layers, MapPin, Phone, Shield, Store,
  Target, TrendingUp, Users, Ruler, ArrowUpLeft, Upload, FileText, X,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { StickyCTA } from "@/components/layout/StickyCTA";
import { SEOHead, buildRealEstateListingLd, buildServiceLd, buildFaqLd, buildHowToLd } from "@/components/SEOHead";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { trackLeadSubmit, trackEvent } from "@/lib/analytics";
import entranceImage from "@/assets/mall-entrance.webp";

const reveal = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { visible: { transition: { staggerChildren: 0.07 } } };
const fadeChild = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

const SPACE_TYPES = [
  { value: "kiosk", label: "كشك (حتى 15م²)" },
  { value: "small", label: "محل صغير (15–40م²)" },
  { value: "medium", label: "محل متوسط (40–80م²)" },
  { value: "large", label: "محل كبير (80–150م²)" },
  { value: "anchor", label: "وحدة رئيسية (+150م²)" },
] as const;

const BUDGET_RANGES = [
  { value: "under_15k", label: "أقل من 15,000 ج.م/شهرياً" },
  { value: "15_30k", label: "15,000 – 30,000 ج.م" },
  { value: "30_60k", label: "30,000 – 60,000 ج.م" },
  { value: "60_100k", label: "60,000 – 100,000 ج.م" },
  { value: "above_100k", label: "أكثر من 100,000 ج.م" },
  { value: "discuss", label: "نتفق حسب الوحدة" },
] as const;

const ALLOWED_DOC_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_DOC_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_DOC_COUNT = 3;

const leasingSchema = z.object({
  full_name: z.string().trim().min(2, "الاسم قصير جداً").max(100, "الاسم طويل جداً"),
  company: z.string().trim().max(120, "اسم الشركة طويل").optional().or(z.literal("")),
  phone: z.string().trim().min(7, "رقم هاتف غير صالح").max(20, "رقم هاتف غير صالح"),
  email: z.string().trim().email("بريد إلكتروني غير صالح").max(255).optional().or(z.literal("")),
  space_type: z.string().min(1, "اختر نوع المساحة"),
  budget_range: z.string().min(1, "اختر الميزانية"),
  message: z.string().trim().max(1000, "الرسالة طويلة جداً").optional().or(z.literal("")),
});

const Leasing = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    company: "",
    phone: "",
    email: "",
    space_type: "",
    budget_range: "",
    message: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: availableUnits } = useQuery({
    queryKey: ["available-units"],
    queryFn: async () => {
      const { data } = await supabase.from("units").select("*").eq("status", "available").eq("featured", true).limit(6);
      return data ?? [];
    },
  });

  const handleFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const next = [...files];
    for (const f of Array.from(incoming)) {
      if (next.length >= MAX_DOC_COUNT) {
        toast({ title: "حد المرفقات", description: `الحد الأقصى ${MAX_DOC_COUNT} ملفات`, variant: "destructive" });
        break;
      }
      if (!ALLOWED_DOC_TYPES.includes(f.type)) {
        toast({ title: "نوع غير مدعوم", description: `${f.name}: مسموح PDF/Word/صور`, variant: "destructive" });
        continue;
      }
      if (f.size > MAX_DOC_SIZE) {
        toast({ title: "حجم كبير", description: `${f.name}: الحد الأقصى 5MB`, variant: "destructive" });
        continue;
      }
      next.push(f);
    }
    setFiles(next);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (idx: number) => setFiles(files.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = leasingSchema.safeParse(form);
    if (!parsed.success) {
      toast({ title: "بيانات ناقصة", description: parsed.error.issues[0]?.message ?? "تحقق من الحقول", variant: "destructive" });
      return;
    }
    setLoading(true);

    // Upload attachments first (best-effort; failures logged into metadata)
    const uploaded: { name: string; path: string; size: number; type: string }[] = [];
    const uploadErrors: string[] = [];
    if (files.length > 0) {
      const inquiryId = crypto.randomUUID();
      for (const f of files) {
        const safeName = f.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `inquiries/${inquiryId}/${Date.now()}-${safeName}`;
        const { error: upErr } = await supabase.storage.from("leasing-docs").upload(path, f, {
          contentType: f.type,
          upsert: false,
        });
        if (upErr) {
          uploadErrors.push(`${f.name}: ${upErr.message}`);
        } else {
          uploaded.push({ name: f.name, path, size: f.size, type: f.type });
        }
      }
    }

    const { error } = await supabase.from("leads").insert({
      lead_type: "leasing",
      full_name: form.full_name.trim(),
      company: form.company.trim() || null,
      phone: form.phone.trim(),
      email: form.email.trim() || null,
      message: form.message.trim() || null,
      metadata: {
        source: "leasing_page",
        space_type: form.space_type,
        budget_range: form.budget_range,
        attachments: uploaded,
        attachment_errors: uploadErrors,
      },
    });
    setLoading(false);
    if (error) {
      trackEvent("lead_submit_error", { lead_type: "leasing", source: "leasing_page" });
      toast({ title: "خطأ", description: "حدث خطأ. حاول مرة أخرى.", variant: "destructive" });
      return;
    }
    trackLeadSubmit("leasing", {
      source: "leasing_page",
      placement: "leasing_inquiry_form",
      has_company: Boolean(form.company.trim()),
      has_email: Boolean(form.email.trim()),
      has_message: Boolean(form.message.trim()),
      space_type: form.space_type,
      budget_range: form.budget_range,
      attachments_count: uploaded.length,
    });
    setSubmitted(true);
    toast({ title: "تم الإرسال", description: "هنرجع لك في أقرب وقت." });
  };

  return (
    <MainLayout>
      <SEOHead
        title="التأجير"
        titleEn="Leasing"
        description="وحدات تجارية للإيجار في مول البستان القاهرة الجديدة — موقع استراتيجي في التجمع الخامس لمحلات التكنولوجيا والإلكترونيات."
        descriptionEn="Commercial units for lease at Mall Elbostan, a premium technology destination in New Cairo."
        keywords="وحدات تجارية للايجار, ايجار محل مول, القاهرة الجديدة, التجمع الخامس, مول تكنولوجيا, commercial leasing"
        breadcrumbs={[{ name: "التأجير", url: "/leasing" }]}
        jsonLd={[
          buildServiceLd({ name: "تأجير وحدات تجارية في مول البستان", description: "وحدات تجارية متنوعة للإيجار في مول البستان — أكشاك، محلات صغيرة ومتوسطة وكبيرة، ووحدات رئيسية.", url: "/leasing", serviceType: "Commercial Real Estate Leasing" }),
          ...(availableUnits && availableUnits.length > 0 ? [buildRealEstateListingLd(availableUnits)] : []),
          buildHowToLd({
            name: "كيفية حجز وحدة تجارية في مول البستان",
            description: "خطوات بسيطة لحجز وحدتك التجارية داخل مول البستان بالتجمع الخامس.",
            totalTime: "PT1D",
            steps: [
              { name: "اختر الوحدة", text: "تصفح الوحدات المتاحة على الخريطة التفاعلية وحدّد الوحدة المناسبة لنشاطك." },
              { name: "أرسل الاستفسار", text: "املأ نموذج الاستفسار بالمعلومات الأساسية عن نشاطك ومتطلباتك." },
              { name: "تواصل فريق التأجير", text: "نتواصل معك خلال يوم عمل واحد لمناقشة الشروط وتفاصيل الوحدة." },
              { name: "المعاينة والتعاقد", text: "ترتيب زيارة معاينة للوحدة، ثم استكمال إجراءات التعاقد والتسليم." },
            ],
          }),
          buildFaqLd([
            { question_ar: "ما هي مساحات الوحدات المتاحة؟", answer_ar: "تتراوح الوحدات بين أكشاك صغيرة ومحلات متوسطة ووحدات رئيسية كبيرة لتناسب مختلف الأنشطة التقنية." },
            { question_ar: "ما المستندات المطلوبة للحجز؟", answer_ar: "السجل التجاري، البطاقة الضريبية، وصورة بطاقة الرقم القومي للمستأجر، إضافة إلى نبذة عن النشاط." },
            { question_ar: "هل تتوفر مرافق وخدمات داخل المول؟", answer_ar: "نعم، يوفر المول مواقف سيارات، تكييف مركزي، أمن 24/7، وWi-Fi، وكاميرات مراقبة، إضافة إلى صيانة دائمة." },
            { question_ar: "كم يستغرق الرد على الاستفسار؟", answer_ar: "نلتزم بالرد على جميع الاستفسارات خلال يوم عمل واحد." },
            { question_ar: "هل يمكن معاينة الوحدة قبل التعاقد؟", answer_ar: "بالتأكيد، نرتب زيارة معاينة على الطبيعة قبل استكمال إجراءات التعاقد." },
          ]),
        ]}
      />

      {/* ═══════════ HERO ═══════════ */}
      <PageHero
        kicker="التأجير التجاري"
        kickerEn="Commercial Leasing"
        title={<>وحدتك في المول الذي يقصده المشتري.</>}
        subtitle="جمهور بنيّة شراء، حركة مستمرة، وبنية جاهزة."
        ctas={[
          { label: "ابدأ الاستفسار", to: "#inquiry", icon: Phone, variant: "orange" },
          { label: "الخريطة التفاعلية", to: "/map", icon: Compass },
        ]}
        image={{ src: entranceImage, alt: "مدخل مول البستان" }}
      >
        {/* Stats */}
        <div className="flex items-center gap-3 lg:justify-end">
          {[
            { v: "6+", l: "فئات تقنية", color: "hsl(0 0% 97%)" },
            { v: "3", l: "أدوار تجارية", color: "hsl(0 0% 97%)" },
            { v: "50+", l: "وحدة", color: "hsl(25 95% 55%)" },
          ].map((s) => (
            <div key={s.l} className="rounded-xl px-4 py-3 text-center"
                 style={{ background: "hsl(0 0% 100% / 0.04)", border: "1px solid hsl(0 0% 100% / 0.08)" }}>
              <p className="font-poppins text-[1.15rem] font-extrabold" style={{ color: s.color }}>{s.v}</p>
              <p className="mt-0.5 text-[0.58rem] font-semibold" style={{ color: "hsl(220 15% 45%)" }}>{s.l}</p>
            </div>
          ))}
        </div>
      </PageHero>

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
                 لماذا البستان.
               </h2>
               <p className="mt-2 max-w-[32rem] text-[0.84rem] leading-[1.85] text-muted-foreground">
                 الزبون الذي يدخل يحمل قرار شراء — هذا ما يصنع الفرق.
              </p>
            </div>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }}
                      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: MapPin, title: "موقع محوري", desc: "في قلب التجمع الخامس." },
              { icon: Users, title: "جمهور بنيّة شراء", desc: "زائر يبحث عن منتج محدد." },
              { icon: Layers, title: "ستة تخصصات", desc: "فئات تقنية تكمّل بعضها." },
              { icon: TrendingUp, title: "التواجد المبكّر", desc: "أفضلية للأوائل." },
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
                  جمهور يقصد المول لأنه يحتاج منتجاً تقنياً.
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
                    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-[0.72rem] font-bold" style={{ color: "hsl(220 20% 80%)" }}>نوع المساحة *</label>
                        <FormSelect
                          value={form.space_type}
                          onChange={(v) => setForm({ ...form, space_type: v })}
                          placeholder="اختر نوع المساحة"
                          options={SPACE_TYPES.map((o) => ({ value: o.value, label: o.label }))}
                          required
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[0.72rem] font-bold" style={{ color: "hsl(220 20% 80%)" }}>الميزانية الشهرية *</label>
                        <FormSelect
                          value={form.budget_range}
                          onChange={(v) => setForm({ ...form, budget_range: v })}
                          placeholder="اختر الميزانية"
                          options={BUDGET_RANGES.map((o) => ({ value: o.value, label: o.label }))}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-[0.72rem] font-bold" style={{ color: "hsl(220 20% 80%)" }}>رسالتك أو تفاصيل إضافية</label>
                      <textarea
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        rows={3}
                        maxLength={1000}
                        className="w-full rounded-xl px-4 py-3 text-[0.84rem] outline-none transition-all"
                        style={{ border: "1px solid hsl(0 0% 100% / 0.1)", background: "hsl(0 0% 100% / 0.05)", color: "hsl(0 0% 97%)" }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = "hsl(25 85% 50% / 0.4)"; e.currentTarget.style.boxShadow = "0 0 0 3px hsl(25 85% 50% / 0.08)"; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = "hsl(0 0% 100% / 0.1)"; e.currentTarget.style.boxShadow = "none"; }}
                      />
                    </div>

                    {/* Documents upload */}
                    <div>
                      <label className="mb-1.5 block text-[0.72rem] font-bold" style={{ color: "hsl(220 20% 80%)" }}>
                        مستندات داعمة (اختياري — PDF/Word/صور، حتى 5MB لكل ملف)
                      </label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,image/jpeg,image/png,image/webp"
                        onChange={(e) => handleFiles(e.target.files)}
                        className="sr-only"
                        id="leasing-docs-input"
                      />
                      <label
                        htmlFor="leasing-docs-input"
                        className="flex cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-3 text-[0.78rem] font-bold transition-all hover:brightness-110"
                        style={{ border: "1px dashed hsl(0 0% 100% / 0.18)", background: "hsl(0 0% 100% / 0.03)", color: "hsl(220 20% 80%)" }}
                      >
                        <Upload className="h-3.5 w-3.5" />
                        رفع مستندات ({files.length}/{MAX_DOC_COUNT})
                      </label>

                      {files.length > 0 && (
                        <ul className="mt-2 space-y-1.5">
                          {files.map((f, i) => (
                            <li
                              key={`${f.name}-${i}`}
                              className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-[0.74rem]"
                              style={{ background: "hsl(0 0% 100% / 0.04)", border: "1px solid hsl(0 0% 100% / 0.08)", color: "hsl(220 20% 85%)" }}
                            >
                              <span className="flex min-w-0 items-center gap-2">
                                <FileText className="h-3.5 w-3.5 shrink-0" style={{ color: "hsl(25 85% 60%)" }} />
                                <span className="truncate">{f.name}</span>
                                <span className="shrink-0 text-[0.66rem]" style={{ color: "hsl(220 15% 55%)" }}>
                                  {(f.size / 1024).toFixed(0)} KB
                                </span>
                              </span>
                              <button
                                type="button"
                                onClick={() => removeFile(i)}
                                aria-label={`حذف ${f.name}`}
                                className="flex h-6 w-6 items-center justify-center rounded-md transition-colors hover:bg-white/10"
                                style={{ color: "hsl(220 15% 65%)" }}
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
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
                    <p className="text-[0.85rem] font-bold" style={{ color: "hsl(0 0% 97%)" }}>الوحدات المتاحة ستظهر هنا قريباً</p>
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
      <StickyCTA label="استفسر عن وحدة" to="#leasing-form" hint="رد خلال يوم عمل واحد" />
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

/* ── Dark form select ── */
function FormSelect({
  value, onChange, options, placeholder, required,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  required?: boolean;
}) {
  return (
    <select
      dir="rtl"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className="h-11 w-full cursor-pointer appearance-none rounded-xl px-4 text-[0.84rem] outline-none transition-all"
      style={{
        border: "1px solid hsl(0 0% 100% / 0.1)",
        background: "hsl(0 0% 100% / 0.05)",
        color: value ? "hsl(0 0% 97%)" : "hsl(220 15% 55%)",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left 14px center",
        paddingLeft: "36px",
      }}
      onFocus={(e) => { e.currentTarget.style.borderColor = "hsl(25 85% 50% / 0.4)"; e.currentTarget.style.boxShadow = "0 0 0 3px hsl(25 85% 50% / 0.08)"; }}
      onBlur={(e) => { e.currentTarget.style.borderColor = "hsl(0 0% 100% / 0.1)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <option value="" disabled style={{ background: "#0B1220", color: "#94A3B8" }}>{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value} style={{ background: "#0B1220", color: "#F8FAFC" }}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export default Leasing;
