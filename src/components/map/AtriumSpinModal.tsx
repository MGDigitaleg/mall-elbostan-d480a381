import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, MapPin, Store, X, Check, ArrowLeft, Copy, QrCode, Clock, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ClaimQRCode } from "@/components/spin/ClaimQRCode";
import { TenantLogo } from "@/components/TenantLogo";

/* ─── Types ─── */
export type SpinPrizeResult = {
  claim_code: string;
  qr_data: string;
  expires_at: string;
  prize: {
    id: string;
    name_ar: string;
    name_en: string | null;
    category: string | null;
    image_url: string | null;
    redemption_rules_ar: string | null;
  };
  store: {
    id: string | null;
    name_ar: string | null;
    unit_code: string | null;
    floor_id: string | null;
    category: string | null;
    logo_url: string | null;
    slug: string | null;
  };
};

export type SpinWinResult = {
  won: boolean;
  result?: SpinPrizeResult;
  message?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onWin?: (result: SpinWinResult) => void;
  onViewOnMap?: (unitCode: string) => void;
};

type Step = "register" | "processing" | "result";

export function AtriumSpinModal({ open, onClose, onWin, onViewOnMap }: Props) {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("register");
  const [form, setForm] = useState({ full_name: "", phone: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SpinWinResult | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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
        if (data.already_spun) {
          toast({ title: "تنبيه", description: data.error, variant: "destructive" });
          setStep("register");
        } else {
          toast({ title: "خطأ", description: data.error, variant: "destructive" });
          setStep("register");
        }
        setLoading(false);
        return;
      }

      // Delay for processing animation
      await new Promise((r) => setTimeout(r, 2800));

      const spinResult: SpinWinResult = {
        won: data.won,
        result: data.result,
        message: data.message,
      };

      setResult(spinResult);
      setStep("result");
      onWin?.(spinResult);
    } catch (err) {
      console.error("Spin error:", err);
      toast({ title: "خطأ", description: "حدث خطأ — حاول مرة أخرى", variant: "destructive" });
      setStep("register");
    } finally {
      setLoading(false);
    }
  };

  const copyClaimCode = useCallback(() => {
    if (!result?.result?.claim_code) return;
    navigator.clipboard.writeText(result.result.claim_code);
    setCodeCopied(true);
    toast({ title: "تم النسخ", description: "تم نسخ رمز الاستلام" });
    setTimeout(() => setCodeCopied(false), 2000);
  }, [result, toast]);

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep("register");
      setForm({ full_name: "", phone: "", email: "" });
      setResult(null);
      setCodeCopied(false);
    }, 300);
  };

  const handleViewOnMap = () => {
    if (result?.result?.store?.unit_code) {
      handleClose();
      onViewOnMap?.(result.result.store.unit_code);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={step !== "processing" ? handleClose : undefined}
            className="fixed inset-0 z-50"
            style={{ background: "hsl(222 36% 6% / 0.75)", backdropFilter: "blur(8px)" }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 16 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-4 top-[6vh] z-50 mx-auto max-w-[480px] max-h-[88vh] overflow-y-auto rounded-2xl bg-card md:inset-x-auto"
            style={{ border: "1px solid hsl(var(--border))", boxShadow: "0 24px 64px hsl(222 36% 6% / 0.28)" }}
          >
            {/* Close */}
            {step !== "processing" && (
              <button
                onClick={handleClose}
                className="absolute left-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}

            {/* ── REGISTER ── */}
            {step === "register" && (
              <form onSubmit={handleSubmit} className="p-6 md:p-7">
                <div className="mb-5">
                  <div className="mb-3 flex items-center gap-2.5">
                    <div className="h-[3px] w-6 rounded-full" style={{ background: "hsl(var(--heritage))" }} />
                    <span className="font-poppins text-[0.62rem] font-bold uppercase tracking-[0.22em]" style={{ color: "hsl(var(--heritage))" }}>
                      Spin & Win
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card" style={{ boxShadow: "var(--shadow-soft)" }}>
                      <Gift className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-[1rem] font-extrabold light-heading">أدر واربح</h2>
                      <p className="text-[0.74rem] light-muted">سجّل بياناتك — النظام يختار متجر ومكافأة لك</p>
                    </div>
                  </div>
                </div>

                {/* How it works */}
                <div className="mb-5 rounded-xl border border-border p-3.5" style={{ background: "hsl(var(--secondary) / 0.3)" }}>
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.12em] light-muted mb-2">كيف يعمل النظام</p>
                  <div className="space-y-2">
                    {[
                      { n: "1", t: "يتم اختيار متجر مشارك عشوائياً" },
                      { n: "2", t: "يتم اختيار مكافأة من مكافآت المتجر" },
                      { n: "3", t: "تحصل على رمز استلام فريد وكود QR" },
                    ].map((s) => (
                      <div key={s.n} className="flex items-center gap-2.5">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-primary/10 font-poppins text-[0.6rem] font-bold text-primary">{s.n}</span>
                        <span className="text-[0.78rem] light-body">{s.t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form fields */}
                <div className="space-y-3">
                  <div>
                    <label className="mb-1.5 block text-[0.76rem] font-bold light-heading">الاسم الكامل *</label>
                    <Input
                      value={form.full_name}
                      onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                      className="h-10 rounded-lg border-border bg-background text-[0.88rem]"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[0.76rem] font-bold light-heading">رقم الهاتف *</label>
                    <Input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="h-10 rounded-lg border-border bg-background text-[0.88rem]"
                      required
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[0.76rem] font-bold light-heading">
                      البريد الإلكتروني <span className="font-normal light-muted">(اختياري)</span>
                    </label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="h-10 rounded-lg border-border bg-background text-[0.88rem]"
                      dir="ltr"
                    />
                  </div>
                </div>

                <Button type="submit" variant="cta" className="mt-5 h-11 w-full rounded-xl text-[0.88rem] font-bold" disabled={loading}>
                  أدر العجلة
                </Button>
                <p className="mt-2 text-center text-[0.68rem] light-muted">
                  مشاركة واحدة يومياً لكل رقم هاتف
                </p>
              </form>
            )}

            {/* ── PROCESSING ── */}
            {step === "processing" && (
              <div className="px-6 py-16 text-center">
                <div className="relative mx-auto h-20 w-20">
                  {/* Stage indicators */}
                  <div className="absolute inset-0 rounded-2xl border border-border bg-secondary" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Gift className="h-7 w-7 text-primary animate-pulse" />
                  </div>
                  <div className="absolute -inset-4 rounded-3xl border-2 border-primary/10 animate-pulse" style={{ animationDuration: "2s" }} />
                  <div className="absolute -inset-8 rounded-3xl border border-primary/5 animate-pulse" style={{ animationDuration: "3s" }} />
                </div>

                <div className="mt-8 space-y-3">
                  <p className="text-[0.95rem] font-bold light-heading">جاري اختيار المتجر والمكافأة...</p>
                  <div className="mx-auto max-w-[280px] space-y-2">
                    <ProcessingStep label="اختيار متجر مشارك" delay={0} />
                    <ProcessingStep label="اختيار المكافأة" delay={1.2} />
                    <ProcessingStep label="إنشاء رمز الاستلام" delay={2.2} />
                  </div>
                </div>
              </div>
            )}

            {/* ── RESULT ── */}
            {step === "result" && result && (
              <div className="p-6 md:p-7">
                {result.won && result.result ? (
                  <WinResult
                    data={result.result}
                    onViewOnMap={handleViewOnMap}
                    onCopyCode={copyClaimCode}
                    codeCopied={codeCopied}
                    onClose={handleClose}
                  />
                ) : (
                  <NoWinResult message={result.message} onClose={handleClose} />
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── Processing step animation ── */
function ProcessingStep({ label, delay }: { label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="flex items-center gap-2.5 rounded-lg px-3 py-2"
      style={{ background: "hsl(var(--secondary) / 0.4)" }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 0.3, duration: 0.2 }}
        className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10"
      >
        <Check className="h-2.5 w-2.5 text-primary" />
      </motion.div>
      <span className="text-[0.78rem] light-body">{label}</span>
    </motion.div>
  );
}

/* ── Win result card ── */
function WinResult({
  data,
  onViewOnMap,
  onCopyCode,
  codeCopied,
  onClose,
}: {
  data: SpinPrizeResult;
  onViewOnMap: () => void;
  onCopyCode: () => void;
  codeCopied: boolean;
  onClose: () => void;
}) {
  const expiryDate = data.expires_at
    ? new Date(data.expires_at).toLocaleDateString("ar-EG", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-secondary" style={{ boxShadow: "var(--shadow-card)" }}>
          <Gift className="h-6 w-6 text-primary" />
        </div>
        <h2 className="mt-4 text-[1.05rem] font-extrabold light-heading">حصلت على مكافأة</h2>
        <p className="mt-1 text-[0.92rem] font-bold text-primary">{data.prize.name_ar}</p>
      </div>

      {/* Store info */}
      {data.store?.name_ar && (
        <div className="flex items-center gap-3 rounded-xl border border-border p-3.5" style={{ background: "hsl(var(--secondary) / 0.3)" }}>
          <TenantLogo src={data.store.logo_url} alt={data.store.name_ar ?? ""} fallbackName={data.store.name_ar ?? undefined} size="xs" rounded="lg" />
          <div>
            <p className="text-[0.84rem] font-bold light-heading">{data.store.name_ar}</p>
            {data.store.unit_code && (
              <p className="font-poppins text-[0.72rem] light-muted">{data.store.unit_code}</p>
            )}
          </div>
        </div>
      )}

      {/* Claim code + QR — prominent */}
      <div className="rounded-xl border-2 border-primary/20 p-4 text-center" style={{ background: "hsl(var(--primary) / 0.04)" }}>
        <div className="flex items-center justify-center gap-2 mb-3">
          <QrCode className="h-3.5 w-3.5 text-primary" />
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.15em] text-primary">رمز الاستلام</p>
        </div>
        <div className="mb-3 flex justify-center">
          <ClaimQRCode
            value={data.qr_data || data.claim_code}
            claimCode={data.claim_code}
            size={128}
          />
        </div>
        <p className="font-poppins text-[1.2rem] font-extrabold tracking-[0.15em] light-heading">{data.claim_code}</p>
        <button
          onClick={onCopyCode}
          className="mt-2 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[0.72rem] font-bold text-primary transition-colors hover:bg-primary/10"
        >
          {codeCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {codeCopied ? "تم النسخ" : "نسخ الرمز"}
        </button>
      </div>

      {/* Prize image */}
      {data.prize.image_url && (
        <div className="rounded-xl border border-border overflow-hidden">
          <img src={data.prize.image_url} alt={data.prize.name_ar} className="w-full h-32 object-cover" />
        </div>
      )}

      {/* Redemption rules */}
      {data.prize.redemption_rules_ar && (
        <div className="rounded-xl border border-border p-4">
          <p className="mb-2 text-[0.68rem] font-bold uppercase tracking-[0.15em] light-muted">كيفية الاستلام</p>
          <p className="text-[0.84rem] leading-7 light-body">{data.prize.redemption_rules_ar}</p>
        </div>
      )}

      {/* Validity & steps */}
      <div className="space-y-1.5">
        {expiryDate && (
          <div className="flex items-center gap-2.5 rounded-lg px-3 py-2" style={{ background: "hsl(var(--secondary) / 0.3)" }}>
            <Clock className="h-3 w-3 shrink-0 text-muted-foreground" />
            <span className="text-[0.78rem] light-body">صالح حتى {expiryDate}</span>
          </div>
        )}
        {[
          "أحضر رمز الاستلام أو كود QR للمتجر",
          "موظف المتجر يتحقق من الرمز ويسلّمك المكافأة",
          "احفظ لقطة شاشة كإثبات احتياطي",
        ].map((item) => (
          <div key={item} className="flex items-center gap-2.5 rounded-lg px-3 py-2" style={{ background: "hsl(var(--secondary) / 0.3)" }}>
            <Check className="h-3 w-3 shrink-0 text-primary" />
            <span className="text-[0.78rem] light-body">{item}</span>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div className="space-y-2 pt-1">
        {data.store?.unit_code && (
          <Button variant="cta" className="h-11 w-full rounded-xl text-[0.88rem] font-bold" onClick={onViewOnMap}>
            <MapPin className="ml-2 h-4 w-4" />
            شاهد المتجر على الخريطة
          </Button>
        )}
        <button onClick={onClose} className="flex w-full items-center justify-center gap-1.5 py-2 text-[0.78rem] font-semibold light-muted transition-colors hover:text-foreground">
          <ArrowLeft className="h-3 w-3" />
          العودة إلى الخريطة
        </button>
      </div>
    </div>
  );
}

/* ── No win ── */
function NoWinResult({ message, onClose }: { message?: string; onClose: () => void }) {
  return (
    <div className="py-6 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-secondary">
        <Gift className="h-6 w-6 text-muted-foreground" />
      </div>
      <h2 className="mt-4 text-[1.05rem] font-extrabold light-heading">شكراً لمشاركتك</h2>
      <p className="mx-auto mt-2 max-w-xs text-[0.86rem] leading-7 light-body">
        {message ?? "لم تتوفر مكافأة هذه المرة — لكن عروض الافتتاح بانتظارك. جرّب مرة أخرى غداً."}
      </p>
      <Button variant="secondary" className="mt-5 h-10 w-full rounded-xl text-[0.86rem] font-bold" onClick={onClose}>
        العودة إلى الخريطة
      </Button>
    </div>
  );
}
