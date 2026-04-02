import { useState, useEffect } from "react";
import { Gift, Sparkles, Copy, Check, MapPin, FileText, Store, Clock, ChevronLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { SpinPrizeResult } from "@/components/map/AtriumSpinModal";

/* ─── Processing stage animation helpers ─── */
const PROCESSING_STAGES = [
  { text: "جاري اختيار المتجر المشارك...", icon: Store },
  { text: "تحديد المكافأة المتاحة...", icon: Gift },
  { text: "تأكيد النتيجة...", icon: Sparkles },
];

function ProcessingView() {
  const [stageIdx, setStageIdx] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStageIdx(1), 900);
    const t2 = setTimeout(() => setStageIdx(2), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const stage = PROCESSING_STAGES[stageIdx];
  const Icon = stage.icon;

  return (
    <motion.div
      key="processing"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center py-16 gap-8"
    >
      {/* Animated orb */}
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
        <div className="absolute -inset-3 rounded-full bg-primary/10 animate-pulse" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="relative w-24 h-24 rounded-full bg-gradient-blue flex items-center justify-center shadow-lg shadow-primary/30"
        >
          <Icon className="w-10 h-10 text-primary-foreground" />
        </motion.div>
      </div>

      {/* Progress steps */}
      <div className="flex gap-2 items-center">
        {PROCESSING_STAGES.map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.8, opacity: 0.3 }}
            animate={{
              scale: i <= stageIdx ? 1 : 0.8,
              opacity: i <= stageIdx ? 1 : 0.3,
              backgroundColor: i <= stageIdx ? "hsl(var(--primary))" : "hsl(var(--muted))",
            }}
            className="w-2.5 h-2.5 rounded-full"
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={stageIdx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="text-lg font-bold text-foreground"
        >
          {stage.text}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
}

const SpinWin = () => {
  const { toast } = useToast();
  const [step, setStep] = useState<"register" | "processing" | "result">("register");
  const [form, setForm] = useState({ full_name: "", phone: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ won: boolean; result?: SpinPrizeResult; message?: string } | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);

  const handleSpin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.phone.trim()) {
      toast({ title: "خطأ", description: "يرجى ملء الاسم ورقم الهاتف", variant: "destructive" });
      return;
    }

    setLoading(true);
    setStep("processing");

    try {
      const { data, error } = await supabase.functions.invoke("spin", {
        body: {
          full_name: form.full_name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim() || null,
        },
      });

      if (error) throw error;

      if (data?.error) {
        toast({ title: "تنبيه", description: data.error, variant: "destructive" });
        setStep("register");
        setLoading(false);
        return;
      }

      await new Promise((r) => setTimeout(r, 2800));
      setResult({ won: data.won, result: data.result, message: data.message });
      setStep("result");
    } catch {
      toast({ title: "خطأ", description: "حدث خطأ — حاول مرة أخرى", variant: "destructive" });
      setStep("register");
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    if (!result?.result?.claim_code) return;
    navigator.clipboard.writeText(result.result.claim_code);
    setCodeCopied(true);
    toast({ title: "تم النسخ" });
    setTimeout(() => setCodeCopied(false), 2000);
  };

  return (
    <MainLayout>
      <SEOHead
        title="أدر واربح"
        titleEn="Spin & Win"
        description="شارك في لعبة أدر واربح واحصل على جوائز فورية من متاجر مول البستان"
        descriptionEn="Spin the wheel and win prizes at Mall Elbostan"
        breadcrumbs={[{ name: "أدر واربح", url: "/spin-win" }]}
      />

      {/* Hero header */}
      <section className="relative overflow-hidden bg-navy py-16 md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(var(--primary)/0.15)_0%,_transparent_70%)]" />
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary-foreground text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>حملة الافتتاح الكبير</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-navy-foreground mb-4 tracking-tight">
              أدر واربح
            </h1>
            <p className="text-navy-foreground/70 text-base md:text-lg max-w-lg mx-auto leading-relaxed">
              سجّل بياناتك — النظام يختار متجرًا مشاركًا ومكافأة عشوائية لك.
              <br />
              مشاركة واحدة يوميًا لكل رقم هاتف.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main content */}
      <section className="container py-12 md:py-16 max-w-xl">
        <AnimatePresence mode="wait">
          {/* ── Registration Form ── */}
          {step === "register" && (
            <motion.form
              key="register"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleSpin}
              className="card-premium p-6 md:p-8 space-y-5 text-right"
            >
              <div className="text-center mb-2">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-3">
                  <Gift className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-lg font-bold text-foreground">سجّل بياناتك للمشاركة</h2>
              </div>

              <div className="space-y-3">
                <Input
                  placeholder="الاسم الكامل *"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  className="bg-secondary/50 border-border h-12"
                  required
                />
                <Input
                  placeholder="رقم الهاتف *"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="bg-secondary/50 border-border h-12"
                  required
                  dir="ltr"
                />
                <Input
                  placeholder="البريد الإلكتروني (اختياري)"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="bg-secondary/50 border-border h-12"
                  dir="ltr"
                />
              </div>

              <Button type="submit" variant="cta" className="w-full h-12 text-base font-bold" disabled={loading}>
                {loading ? "جاري التحميل..." : "ابدأ الآن"}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                بالمشاركة أنت توافق على{" "}
                <Link to="/reward-terms" className="text-primary hover:underline">الشروط والأحكام</Link>
              </p>
            </motion.form>
          )}

          {/* ── Processing ── */}
          {step === "processing" && <ProcessingView />}

          {/* ── Result ── */}
          {step === "result" && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="card-premium overflow-hidden"
            >
              {result.won && result.result ? (
                <>
                  {/* Prize header banner */}
                  <div className="bg-gradient-blue p-6 md:p-8 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.1)_0%,_transparent_50%)]" />
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.2 }}
                      className="relative"
                    >
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm mb-4">
                        <Gift className="h-8 w-8 text-white" />
                      </div>
                      <p className="text-white/80 text-sm font-medium mb-1">حصلت على مكافأة</p>
                      <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                        {result.result.prize.name_ar}
                      </h2>
                    </motion.div>
                  </div>

                  <div className="p-6 md:p-8 space-y-4">
                    {/* Store info */}
                    {result.result.store?.name_ar && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-center gap-4 bg-secondary/50 p-4 rounded-xl"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                          <Store className="h-5 w-5 text-primary" />
                        </div>
                        <div className="text-right flex-1">
                          <p className="text-xs text-muted-foreground">المتجر الراعي</p>
                          <p className="font-bold text-foreground">{result.result.store.name_ar}</p>
                        </div>
                        {result.result.store.unit_code && (
                          <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded-md">
                            {result.result.store.unit_code}
                          </span>
                        )}
                      </motion.div>
                    )}

                    {/* Claim code */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="border-2 border-dashed border-primary/30 bg-primary/5 p-5 rounded-xl text-center"
                    >
                      <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">رمز الاستلام</p>
                      <p className="font-mono text-2xl md:text-3xl font-extrabold text-foreground tracking-[0.15em] mb-3">
                        {result.result.claim_code}
                      </p>
                      <button
                        onClick={copyCode}
                        className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                      >
                        {codeCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {codeCopied ? "تم النسخ" : "نسخ الرمز"}
                      </button>
                    </motion.div>

                    {/* Redemption rules */}
                    {result.result.prize.redemption_rules_ar && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-secondary/50 p-4 rounded-xl"
                      >
                        <p className="font-bold text-foreground text-sm mb-1.5 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-primary" />
                          كيفية الاستلام
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {result.result.prize.redemption_rules_ar}
                        </p>
                      </motion.div>
                    )}

                    {/* Expiry */}
                    {result.result.expires_at && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>
                          صالح حتى{" "}
                          {new Date(result.result.expires_at).toLocaleDateString("ar-EG", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </motion.div>
                    )}

                    {/* Actions */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="flex gap-3 pt-2"
                    >
                      <Link to={`/map?highlight=${encodeURIComponent(result.result?.store?.unit_code ?? '')}&prize=${encodeURIComponent(result.result?.prize?.name_ar ?? '')}&store=${encodeURIComponent(result.result?.store?.name_ar ?? '')}`} className="flex-1">
                        <Button variant="cta" className="w-full h-11 gap-2">
                          <MapPin className="w-4 h-4" />
                          شاهد المتجر على الخريطة
                        </Button>
                      </Link>
                      <Link to="/reward-terms">
                        <Button variant="outline" className="h-11 px-4">
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                      </Link>
                    </motion.div>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-5">
                    <Sparkles className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-3">شكرًا لمشاركتك</h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {result.message ?? "لم تتوفر مكافأة هذه المرة — جرّب مرة أخرى غدًا."}
                  </p>
                  <Link to="/">
                    <Button variant="outline">العودة للرئيسية</Button>
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* How it works - visible only on register */}
        {step === "register" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10"
          >
            <h3 className="text-center text-sm font-bold text-muted-foreground uppercase tracking-wider mb-6">
              كيف تعمل المسابقة
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: "01", title: "سجّل بياناتك", desc: "الاسم ورقم الهاتف" },
                { icon: "02", title: "النظام يختار", desc: "متجر ومكافأة عشوائيًا" },
                { icon: "03", title: "استلم مكافأتك", desc: "من المتجر بالرمز" },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-extrabold text-sm mb-2">
                    {s.icon}
                  </div>
                  <p className="text-sm font-bold text-foreground">{s.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </section>
    </MainLayout>
  );
};

export default SpinWin;
