import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Mail, Phone, MapPin, CheckCircle2, MessageSquare,
  Building2, Handshake, Megaphone, Briefcase, ArrowLeft,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type InquiryType = "general" | "leasing" | "partnership" | "media" | "careers";

const INQUIRY_TYPES: { value: InquiryType; label: string; icon: typeof MessageSquare; desc: string }[] = [
  { value: "general", label: "استفسار عام", icon: MessageSquare, desc: "أسئلة عن المول أو المتاجر" },
  { value: "leasing", label: "تأجير وحدة", icon: Building2, desc: "استفسار تجاري عن الوحدات" },
  { value: "partnership", label: "شراكة", icon: Handshake, desc: "تعاون تجاري أو رعاية" },
  { value: "media", label: "إعلام وصحافة", icon: Megaphone, desc: "تغطية أو طلب بيانات" },
  { value: "careers", label: "توظيف", icon: Briefcase, desc: "فرص عمل في المول" },
];

const LEAD_TYPE_MAP: Record<InquiryType, string> = {
  general: "contact",
  leasing: "leasing",
  partnership: "partnership",
  media: "media",
  careers: "careers",
};

const reveal = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const Contact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [inquiryType, setInquiryType] = useState<InquiryType>("general");
  const [form, setForm] = useState({ full_name: "", company: "", phone: "", email: "", message: "" });

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

  return (
    <MainLayout>
      <SEOHead
        title="تواصل معنا"
        titleEn="Contact Us"
        description="تواصل مع فريق مول البستان — استفسارات، تأجير، شراكات، أو إعلام."
        descriptionEn="Get in touch with Mall Elbostan team for inquiries, leasing, partnerships, or media."
        breadcrumbs={[{ name: "تواصل معنا", url: "/contact" }]}
      />

      {/* ═══════════ HERO ═══════════ */}
      <section style={{ background: "#071326" }}>
        <div className="mx-auto w-full max-w-[1400px] px-5 md:px-8 lg:px-14">
          <div className="py-8 md:py-11">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <p className="font-poppins text-[0.62rem] font-bold uppercase tracking-[0.28em]" style={{ color: "#64748B" }}>Contact</p>
              <h1 className="mt-2 max-w-[22rem] text-[1.5rem] font-extrabold leading-[1.1] md:text-[1.85rem] lg:text-[2.15rem]" style={{ color: "#F8FAFC" }}>
                تواصل مع فريق مول البستان
              </h1>
              <p className="mt-2 max-w-[30rem] text-[0.86rem] leading-[1.9]" style={{ color: "#94A3B8" }}>
                استفسار، تأجير، أو تعاون — الفريق جاهز.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, #1E3A5F, transparent)" }} />

      {/* ═══════════ INQUIRY TYPE SELECTOR ═══════════ */}
      <section className="py-8 md:py-10" style={{ background: "#FAFAF8" }}>
        <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8 lg:px-14">
          <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="mb-5">
              <h2 className="text-[1.1rem] font-extrabold light-heading md:text-[1.3rem]">ما نوع استفسارك؟</h2>
              <p className="mt-1 text-[0.84rem] light-muted">اختر النوع المناسب لتصل رسالتك مباشرة للفريق المختص.</p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
              {INQUIRY_TYPES.map((type) => {
                const isActive = inquiryType === type.value;
                return (
                  <button
                    key={type.value}
                    onClick={() => setInquiryType(type.value)}
                    className={`group rounded-xl border p-4 text-right transition-all ${
                      isActive
                        ? "border-primary bg-primary/[0.04] shadow-sm"
                        : "border-border bg-card hover:border-primary/20 hover:shadow-sm"
                    }`}
                  >
                    <type.icon className={`mb-2 h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                    <p className={`text-[0.84rem] font-bold ${isActive ? "text-primary" : "light-heading"}`}>{type.label}</p>
                    <p className="mt-0.5 text-[0.7rem] light-muted">{type.desc}</p>
                  </button>
                );
              })}
            </div>

            {inquiryType === "leasing" && (
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3">
                <Building2 className="h-4 w-4 shrink-0 text-primary" />
                <p className="text-[0.82rem] light-body">
                  لاستفسار تأجير مفصّل مع عرض الوحدات المتاحة —{" "}
                  <Link to="/leasing" className="font-bold text-primary hover:underline">
                    صفحة التأجير المتخصصة
                  </Link>
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ═══════════ FORM + CONTACT INFO ═══════════ */}
      <section className="py-8 md:py-12" style={{ background: "#F5F2EC" }}>
        <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8 lg:px-14">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">

            {/* ── Form ── */}
            <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="rounded-2xl border border-border bg-card p-6 md:p-8" style={{ boxShadow: "var(--shadow-elevated)" }}>
                <div className="mb-5">
                  <h2 className="text-[1.1rem] font-extrabold light-heading md:text-[1.3rem]">أرسل رسالتك</h2>
                  <p className="mt-1 text-[0.82rem] light-muted">
                    {inquiryType === "general" && "اكتب سؤالك أو ملاحظتك — سيصلك الرد في أقرب وقت."}
                    {inquiryType === "leasing" && "أرسل بياناتك وتفاصيل الوحدة التي تبحث عنها."}
                    {inquiryType === "partnership" && "وضّح فكرة التعاون — الفريق التجاري سيراجعها ويتواصل معك."}
                    {inquiryType === "media" && "أرسل طلبك الإعلامي وسنوفر لك البيانات المطلوبة."}
                    {inquiryType === "careers" && "أرسل بياناتك والوظيفة التي تبحث عنها."}
                  </p>
                </div>

                {submitted ? (
                  <div className="py-10 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-secondary">
                      <CheckCircle2 className="h-7 w-7 text-success" />
                    </div>
                    <p className="text-[1.05rem] font-extrabold light-heading">تم إرسال رسالتك</p>
                    <p className="mt-2 text-[0.86rem] light-body">الفريق المختص سيتواصل معك خلال يوم عمل.</p>
                    <Button
                      variant="secondary"
                      className="mt-5 h-10 rounded-xl px-6 font-bold"
                      onClick={() => { setSubmitted(false); setForm({ full_name: "", company: "", phone: "", email: "", message: "" }); }}
                    >
                      إرسال رسالة جديدة
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3.5">
                    <div>
                      <label className="mb-1.5 block text-[0.76rem] font-bold light-heading">الاسم الكامل *</label>
                      <input
                        value={form.full_name}
                        onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                        required
                        className="h-11 w-full rounded-lg border border-border bg-background px-4 text-[0.88rem] font-medium text-foreground outline-none transition-colors focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                      />
                    </div>

                    {(inquiryType === "leasing" || inquiryType === "partnership") && (
                      <div>
                        <label className="mb-1.5 block text-[0.76rem] font-bold light-heading">اسم الشركة أو النشاط</label>
                        <input
                          value={form.company}
                          onChange={(e) => setForm({ ...form, company: e.target.value })}
                          className="h-11 w-full rounded-lg border border-border bg-background px-4 text-[0.88rem] font-medium text-foreground outline-none transition-colors focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                        />
                      </div>
                    )}

                    <div>
                      <label className="mb-1.5 block text-[0.76rem] font-bold light-heading">رقم الهاتف *</label>
                      <input
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        required
                        dir="ltr"
                        className="h-11 w-full rounded-lg border border-border bg-background px-4 text-[0.88rem] font-medium text-foreground outline-none transition-colors focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-[0.76rem] font-bold light-heading">البريد الإلكتروني</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        dir="ltr"
                        className="h-11 w-full rounded-lg border border-border bg-background px-4 text-[0.88rem] font-medium text-foreground outline-none transition-colors focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-[0.76rem] font-bold light-heading">رسالتك</label>
                      <textarea
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        rows={4}
                        className="w-full rounded-lg border border-border bg-background px-4 py-3 text-[0.88rem] font-medium text-foreground outline-none transition-colors focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                      />
                    </div>

                    <Button type="submit" variant="cta" className="h-12 w-full rounded-xl text-[0.9rem] font-bold" disabled={loading}>
                      {loading ? "جاري الإرسال..." : "إرسال"}
                    </Button>
                    <p className="text-center text-[0.7rem] light-muted">الرد المتوقع خلال يوم عمل واحد</p>
                  </form>
                )}
              </div>
            </motion.div>

            {/* ── Contact info + context ── */}
            <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-4">
              {/* Contact cards */}
              {[
                { icon: MapPin, title: "الموقع", value: "القاهرة الجديدة، مصر", sub: "بالقرب من المدينتي والرحاب" },
                { icon: Phone, title: "الهاتف", value: "سيتم الإعلان قريبًا", sub: "متاح أيام العمل" },
                { icon: Mail, title: "البريد الإلكتروني", value: "سيتم الإعلان قريبًا", sub: "للاستفسارات الرسمية" },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary">
                      <item.icon className="h-4.5 w-4.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[0.76rem] font-bold uppercase tracking-wide light-muted">{item.title}</p>
                      <p className="mt-0.5 text-[0.92rem] font-bold light-heading">{item.value}</p>
                      <p className="mt-0.5 text-[0.78rem] light-muted">{item.sub}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/201000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/20 hover:shadow-sm"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{ background: "hsl(142 70% 45% / 0.1)", border: "1px solid hsl(142 70% 45% / 0.15)" }}>
                  <MessageSquare className="h-4.5 w-4.5" style={{ color: "hsl(142 70% 45%)" }} />
                </div>
                <div>
                  <p className="text-[0.9rem] font-bold light-heading">واتساب — رد أسرع</p>
                  <p className="mt-0.5 text-[0.78rem] light-muted">للأسئلة السريعة والاستفسارات المباشرة</p>
                </div>
                <ArrowLeft className="mr-auto h-4 w-4 light-muted" />
              </a>

              {/* Response expectations */}
              <div className="rounded-xl border border-border bg-card p-5">
                <p className="mb-3 text-[0.76rem] font-bold uppercase tracking-wide light-muted">ماذا تتوقع بعد الإرسال</p>
                <div className="space-y-2">
                  {[
                    "رسالتك تصل مباشرة للفريق المختص حسب نوع الاستفسار.",
                    "الرد المتوقع خلال يوم عمل واحد.",
                    "استفسارات التأجير تتحول لفريق التأجير تلقائيًا.",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <p className="text-[0.82rem] leading-6 light-body">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map placeholder */}
              <div className="flex items-center justify-center rounded-xl border border-dashed border-border bg-card p-8">
                <div className="text-center">
                  <MapPin className="mx-auto h-5 w-5 light-muted" />
                  <p className="mt-2 text-[0.82rem] font-bold light-heading">خريطة الموقع</p>
                  <p className="mt-1 text-[0.76rem] light-muted">ستتم إضافتها عند توفر بيانات العنوان التفصيلية</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════ QUICK LINKS ═══════════ */}
      <section className="py-10 md:py-12" style={{ background: "#071326" }}>
        <div className="mx-auto w-full max-w-[900px] px-5 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="h-[3px] w-8 rounded-full" style={{ background: "hsl(var(--heritage))" }} />
            <span className="font-poppins text-[0.62rem] font-bold uppercase tracking-[0.22em]" style={{ color: "hsl(var(--heritage))" }}>
              Quick Links
            </span>
            <div className="h-[3px] w-8 rounded-full" style={{ background: "hsl(var(--heritage))" }} />
          </div>
          <h2 className="text-[1.1rem] font-extrabold dark-heading md:text-[1.3rem]">قد تجد ما تبحث عنه هنا</h2>
          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { label: "التأجير", href: "/leasing" },
              { label: "الأسئلة الشائعة", href: "/faq" },
              { label: "دليل المتاجر", href: "/stores" },
              { label: "الوظائف", href: "/careers" },
            ].map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="rounded-xl px-4 py-3.5 text-center text-[0.86rem] font-bold transition-all dark-heading hover:bg-white/[0.06]"
                style={{ border: "1px solid hsl(0 0% 100% / 0.08)" }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Contact;
