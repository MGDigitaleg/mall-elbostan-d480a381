import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import {
  Mail, Phone, MapPin, CheckCircle2, MessageSquare,
  Building2, Handshake, Megaphone, Briefcase, ArrowLeft,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead, buildContactPageLd, buildHowToLd } from "@/components/SEOHead";
import { OFFICIAL_PHONE, OFFICIAL_WHATSAPP } from "@/lib/contactInfo";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PageHero } from "@/components/PageHero";

type InquiryType = "general" | "leasing" | "partnership" | "media" | "careers";

const INQUIRY_TYPES: { value: InquiryType; label: string; icon: typeof MessageSquare; desc: string }[] = [
  { value: "general", label: "استفسار عام", icon: MessageSquare, desc: "أسئلة عن المول" },
  { value: "leasing", label: "تأجير وحدة", icon: Building2, desc: "استفسار تجاري" },
  { value: "partnership", label: "شراكة", icon: Handshake, desc: "تعاون أو رعاية" },
  { value: "media", label: "إعلام", icon: Megaphone, desc: "تغطية أو بيانات" },
  { value: "careers", label: "توظيف", icon: Briefcase, desc: "فرص عمل" },
];

const LEAD_TYPE_MAP: Record<InquiryType, string> = {
  general: "contact",
  leasing: "leasing",
  partnership: "partnership",
  media: "media",
  careers: "careers",
};

const reveal = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

const Contact = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [inquiryType, setInquiryType] = useState<InquiryType>("general");
  const [form, setForm] = useState({ full_name: "", company: "", phone: "", email: "", message: "" });

  useEffect(() => {
    const inquiry = searchParams.get("inquiry");
    const message = searchParams.get("message");
    const company = searchParams.get("company");

    if (inquiry && inquiry in LEAD_TYPE_MAP) {
      setInquiryType(inquiry as InquiryType);
    }

    if (message || company) {
      setForm((current) => ({
        ...current,
        company: current.company || company || "",
        message: current.message || message || "",
      }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.phone.trim()) {
      toast({ title: "خطأ", description: "يرجى ملء الاسم ورقم الهاتف", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("leads").insert({
      lead_type: LEAD_TYPE_MAP[inquiryType],
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
    }
  };

  const inputCls = "h-10 w-full rounded-lg border border-border bg-background px-3.5 text-[0.84rem] font-medium text-foreground outline-none transition-colors focus:border-primary/40 focus:ring-2 focus:ring-primary/10";

  return (
    <MainLayout>
      <SEOHead
        title="تواصل مع مول البستان — استفسارات وشراكات"
        titleEn="Contact Mall Elbostan — Inquiries & Partnerships"
        description="تواصل مع فريق مول البستان في التجمع الخامس، القاهرة الجديدة. استفسارات عامة، تأجير وحدات تجارية، شراكات تقنية، أو فرص عمل. نرد خلال يوم عمل واحد."
        descriptionEn="Contact Mall Elbostan in New Cairo's Fifth Settlement. General inquiries, unit leasing, tech partnerships, or career opportunities. We respond within one business day."
        keywords="تواصل مول البستان, رقم مول البستان, عنوان مول البستان, تأجير وحدات, القاهرة الجديدة, التجمع الخامس, contact mall elbostan"
        breadcrumbs={[{ name: "تواصل معنا", url: "/contact" }]}
        jsonLd={[
          buildContactPageLd({ phone: OFFICIAL_PHONE || null, whatsapp: OFFICIAL_WHATSAPP, email: null }),
          buildHowToLd({
            name: "كيف تصل إلى مول البستان",
            description: "خطوات الوصول إلى مول البستان في التجمع الخامس بالقاهرة الجديدة.",
            totalTime: "PT20M",
            steps: [
              { name: "افتح خرائط جوجل", text: "اكتب «مول البستان التجمع الخامس» في تطبيق Google Maps." },
              { name: "اتجه إلى شارع التسعين", text: "توجّه إلى شارع التسعين الجنوبي بالقاهرة الجديدة." },
              { name: "ادخل البوابة الرئيسية", text: "ستجد البوابة الرئيسية للمول مع مواقف سيارات." },
            ],
          }),
        ]}
      />

      <PageHero
        kicker="تواصل معنا"
        kickerEn="Contact"
        title="تواصل مع فريق مول البستان"
        subtitle="استفسار، تأجير، أو تعاون — نرد خلال يوم عمل."
        compact
      />

      {/* ═══════════ INQUIRY TYPE SELECTOR ═══════════ */}
      <section className="py-4 md:py-5 bg-secondary dark:bg-background">
        <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8 lg:px-12">
          <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="mb-3">
              <h2 className="text-[0.95rem] font-extrabold light-heading md:text-[1.1rem]">ما نوع استفسارك؟</h2>
              <p className="mt-0.5 text-[0.78rem] light-muted">اختر النوع المناسب لتصل رسالتك للفريق المختص.</p>
            </div>

            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-5">
              {INQUIRY_TYPES.map((type) => {
                const isActive = inquiryType === type.value;
                return (
                  <button
                    key={type.value}
                    onClick={() => setInquiryType(type.value)}
                    className={`group rounded-lg border p-3 text-right transition-all ${
                      isActive
                        ? "border-primary bg-primary/[0.04] shadow-sm"
                        : "border-border bg-card hover:border-primary/20"
                    }`}
                  >
                    <type.icon className={`mb-1.5 h-3.5 w-3.5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                    <p className={`text-[0.78rem] font-bold ${isActive ? "text-primary" : "light-heading"}`}>{type.label}</p>
                    <p className="mt-0.5 text-[0.66rem] light-muted">{type.desc}</p>
                  </button>
                );
              })}
            </div>

            {inquiryType === "leasing" && (
              <div className="mt-2 flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2.5">
                <Building2 className="h-3.5 w-3.5 shrink-0 text-primary" />
                <p className="text-[0.78rem] light-body">
                  لاستفسار تأجير مفصّل —{" "}
                  <Link to="/leasing" className="font-bold text-primary hover:underline">صفحة التأجير</Link>
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ═══════════ FORM + CONTACT INFO ═══════════ */}
      <section className="py-5 md:py-7 bg-secondary dark:bg-background">
        <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8 lg:px-12">
          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">

            {/* ── Form ── */}
            <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="rounded-xl border border-border bg-card p-5 md:p-6" style={{ boxShadow: "var(--shadow-elevated)" }}>
                <div className="mb-3.5">
                  <h2 className="text-[0.95rem] font-extrabold light-heading md:text-[1.1rem]">أرسل رسالتك</h2>
                  <p className="mt-0.5 text-[0.76rem] light-muted">
                    {inquiryType === "general" && "اكتب سؤالك — سيصلك الرد في أقرب وقت."}
                    {inquiryType === "leasing" && "أرسل بياناتك وتفاصيل الوحدة المطلوبة."}
                    {inquiryType === "partnership" && "وضّح فكرة التعاون — الفريق سيراجعها."}
                    {inquiryType === "media" && "أرسل طلبك الإعلامي."}
                    {inquiryType === "careers" && "أرسل بياناتك والوظيفة المطلوبة."}
                  </p>
                </div>

                {submitted ? (
                  <div className="py-6 text-center">
                    <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-secondary">
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    </div>
                    <p className="text-[0.95rem] font-extrabold light-heading">تم إرسال رسالتك</p>
                    <p className="mt-1.5 text-[0.8rem] light-body">الفريق المختص سيتواصل معك خلال يوم عمل.</p>
                    <Button
                      variant="secondary"
                      className="mt-4 h-9 rounded-lg px-5 text-[0.8rem] font-bold"
                      onClick={() => { setSubmitted(false); setForm({ full_name: "", company: "", phone: "", email: "", message: "" }); }}
                    >
                      إرسال رسالة جديدة
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                      <label className="mb-1 block text-[0.72rem] font-bold light-heading">الاسم الكامل *</label>
                      <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required className={inputCls} />
                    </div>

                    {(inquiryType === "leasing" || inquiryType === "partnership") && (
                      <div>
                        <label className="mb-1 block text-[0.72rem] font-bold light-heading">اسم الشركة أو النشاط</label>
                        <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className={inputCls} />
                      </div>
                    )}

                    <div>
                      <label className="mb-1 block text-[0.72rem] font-bold light-heading">رقم الهاتف *</label>
                      <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required dir="ltr" className={inputCls} />
                    </div>

                    <div>
                      <label className="mb-1 block text-[0.72rem] font-bold light-heading">البريد الإلكتروني</label>
                      <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} dir="ltr" className={inputCls} />
                    </div>

                    <div>
                      <label className="mb-1 block text-[0.72rem] font-bold light-heading">رسالتك</label>
                      <textarea
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        rows={2}
                        className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-[0.84rem] font-medium text-foreground outline-none transition-colors focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                      />
                    </div>

                    <Button type="submit" variant="cta" className="h-10 w-full rounded-lg text-[0.84rem] font-bold" disabled={loading}>
                      {loading ? "جاري الإرسال..." : "إرسال"}
                    </Button>
                    <p className="text-center text-[0.66rem] light-muted">الرد خلال يوم عمل واحد</p>
                  </form>
                )}
              </div>
            </motion.div>

            {/* ── Contact info ── */}
            <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-2.5">
              {[
                { icon: MapPin, title: "الموقع", value: "القاهرة الجديدة، مصر", sub: "بالقرب من المدينتي والرحاب" },
                { icon: Phone, title: "الهاتف", value: "سيتم الإعلان قريباً", sub: "متاح أيام العمل" },
                { icon: Mail, title: "البريد", value: "سيتم الإعلان قريباً", sub: "للاستفسارات الرسمية" },
              ].map((item) => (
                <div key={item.title} className="rounded-lg border border-border bg-card p-3.5">
                  <div className="flex items-start gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary">
                      <item.icon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[0.68rem] font-bold uppercase tracking-wide light-muted">{item.title}</p>
                      <p className="mt-0.5 text-[0.84rem] font-bold light-heading">{item.value}</p>
                      <p className="text-[0.72rem] light-muted">{item.sub}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* WhatsApp */}
              <a
                href="https://wa.me/201000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 rounded-lg border border-border bg-card p-3.5 transition-all hover:border-primary/20 hover:shadow-sm"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: "hsl(142 70% 45% / 0.1)", border: "1px solid hsl(142 70% 45% / 0.15)" }}>
                  <MessageSquare className="h-3.5 w-3.5" style={{ color: "hsl(142 70% 45%)" }} />
                </div>
                <div>
                  <p className="text-[0.82rem] font-bold light-heading">واتساب — رد أسرع</p>
                  <p className="text-[0.72rem] light-muted">للأسئلة السريعة والمباشرة</p>
                </div>
                <ArrowLeft className="mr-auto h-3.5 w-3.5 light-muted" />
              </a>

              {/* Response expectations */}
              <div className="rounded-lg border border-border bg-card p-3.5">
                <p className="mb-2 text-[0.68rem] font-bold uppercase tracking-wide light-muted">بعد الإرسال</p>
                <div className="space-y-1.5">
                  {[
                    "رسالتك تصل مباشرة للفريق المختص.",
                    "الرد خلال يوم عمل واحد.",
                    "استفسارات التأجير تتحول للفريق التجاري تلقائياً.",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <p className="text-[0.76rem] leading-5 light-body">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map placeholder */}
              <div className="flex items-center justify-center rounded-lg border border-dashed border-border bg-card p-5">
                <div className="text-center">
                  <MapPin className="mx-auto h-4 w-4 light-muted" />
                  <p className="mt-1.5 text-[0.78rem] font-bold light-heading">خريطة الموقع</p>
                  <p className="mt-0.5 text-[0.7rem] light-muted">ستتم إضافتها عند توفر العنوان التفصيلي</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════ QUICK LINKS ═══════════ */}
      <section className="py-7 md:py-9" style={{ background: "#071326" }}>
        <div className="mx-auto w-full max-w-[900px] px-5 text-center">
          <div className="mb-3 flex items-center justify-center gap-2.5">
            <div className="h-[3px] w-7 rounded-full" style={{ background: "hsl(var(--heritage))" }} />
            <span className="font-poppins text-[0.56rem] font-bold uppercase tracking-[0.22em]" style={{ color: "hsl(var(--heritage))" }}>
              Quick Links
            </span>
            <div className="h-[3px] w-7 rounded-full" style={{ background: "hsl(var(--heritage))" }} />
          </div>
          <h2 className="text-[0.95rem] font-extrabold dark-heading md:text-[1.1rem]">قد تجد ما تبحث عنه هنا</h2>
          <div className="mt-4 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            {[
              { label: "التأجير", href: "/leasing" },
              { label: "الأسئلة الشائعة", href: "/faq" },
              { label: "دليل المحلات", href: "/stores" },
              { label: "الوظائف", href: "/careers" },
            ].map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="rounded-lg px-3 py-2.5 text-center text-[0.8rem] font-bold transition-all dark-heading hover:bg-white/[0.06]"
                style={{ border: "1px solid hsl(0 0% 100% / 0.08)" }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ LOCAL SEO SECTION ═══════════ */}
      <section className="bg-card dark:bg-background border-t border-border/30" style={{ paddingTop: "clamp(24px, 3vw, 40px)", paddingBottom: "clamp(24px, 3vw, 40px)" }}>
        <div className="container max-w-4xl">
          <h2 className="text-[0.92rem] font-bold text-foreground mb-3" style={{ fontFamily: "var(--font-arabic-display)" }}>
            الوصول إلى مول البستان
          </h2>
          <div className="text-[0.76rem] leading-[2.1] text-muted-foreground space-y-2">
            <p>
              <strong className="text-foreground">العنوان:</strong> شارع التسعين، التجمع الخامس، القاهرة الجديدة، مصر.
            </p>
            <p>
              <strong className="text-foreground">الموقع:</strong> يقع مول البستان في قلب التجمع الخامس ويخدم سكان القاهرة الجديدة، مدينتي، الرحاب، الشروق، والمناطق المحيطة.
            </p>
            <p>
              <strong className="text-foreground">الافتتاح:</strong> الافتتاح الرسمي لفرع القاهرة الجديدة في 15 مايو 2026.
              فرع وسط البلد يعمل منذ 1990.
            </p>
            <p>
              للمزيد، تصفّح{" "}
              <Link to="/about" className="text-primary font-semibold hover:underline">صفحة عن المول</Link> أو{" "}
              <Link to="/map" className="text-primary font-semibold hover:underline">الخريطة التفاعلية</Link>.
            </p>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Contact;
