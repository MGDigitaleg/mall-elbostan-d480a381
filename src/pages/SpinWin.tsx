import { useEffect, useState } from "react";
import { Gift, Sparkles, Copy, Check, MapPin, FileText, Store, Clock, ChevronLeft, Trophy, Crown, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { PrizeWheel, type WheelSegment } from "@/components/spin/PrizeWheel";
import { StoreRing } from "@/components/spin/StoreRing";
import { ClaimQRCode } from "@/components/spin/ClaimQRCode";
import { FloorTabs } from "@/components/map/FloorTabs";
import type { MallFloorId } from "@/lib/mallFloorGeometry";
import type { SpinPrizeResult } from "@/components/map/AtriumSpinModal";

/* ─── 8 visible wheel segments (visual only — backend decides outcome) ─── */
const WHEEL_SEGMENTS: WheelSegment[] = [
  { id: "v25", label: "خصم ٢٥ جنيه", tone: "primary" },
  { id: "v20", label: "خصم ٢٠ جنيه", tone: "secondary" },
  { id: "v15", label: "خصم ١٥ جنيه", tone: "primary" },
  { id: "wipe", label: "منظف شاشة", tone: "secondary" },
  { id: "cable", label: "واقي كابل", tone: "primary" },
  { id: "holder", label: "حامل موبايل", tone: "secondary" },
  { id: "retry", label: "حاول مرة أخرى", tone: "primary" },
  { id: "voucher", label: "مفاجأة فاخرة", tone: "accent" },
];

/** Map a server prize to a wheel segment index (visual landing). */
function pickSegmentIndex(prizeNameAr: string | undefined, isGrand: boolean | undefined): number {
  if (isGrand) return 7; // "مفاجأة فاخرة"
  if (!prizeNameAr) return 6;
  if (prizeNameAr.includes("25")) return 0;
  if (prizeNameAr.includes("20")) return 1;
  if (prizeNameAr.includes("15")) return 2;
  if (prizeNameAr.includes("شاشة")) return 3;
  if (prizeNameAr.includes("كابل")) return 4;
  if (prizeNameAr.includes("حامل")) return 5;
  if (prizeNameAr.includes("١٠٠٠") || prizeNameAr.includes("1000")) return 7;
  return 6;
}

type SpinResponse = {
  won: boolean;
  result?: SpinPrizeResult & {
    prize_type?: "instant" | "grand" | "visitor";
    is_grand?: boolean;
    visitor_only?: boolean;
  };
  message?: string;
};

const SpinWin = () => {
  const { toast } = useToast();
  const [step, setStep] = useState<"register" | "spinning" | "result">("register");
  const [form, setForm] = useState({ full_name: "", phone: "", email: "", visitor_token: "" });
  const [showVisitorField, setShowVisitorField] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [floorId, setFloorId] = useState<MallFloorId>("ground");
  const [result, setResult] = useState<SpinResponse | null>(null);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);

  // Responsive wheel/ring sizing for small viewports
  const [viewportW, setViewportW] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  useEffect(() => {
    const onResize = () => setViewportW(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const isNarrow = viewportW < 480;
  const wheelSize = isNarrow ? 240 : 320;
  const ringThickness = isNarrow ? 60 : 88;

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.phone.trim()) {
      toast({ title: "بيانات ناقصة", description: "يرجى ملء الاسم ورقم الهاتف", variant: "destructive" });
      return;
    }
    if (!agreeTerms) {
      toast({ title: "الشروط والأحكام", description: "يرجى الموافقة على الشروط للمتابعة", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("spin", {
        body: {
          full_name: form.full_name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim() || null,
          visitor_token: form.visitor_token.trim() || null,
        },
      });

      if (error) throw error;
      if (data?.error) {
        toast({ title: "تنبيه", description: data.error, variant: "destructive" });
        setLoading(false);
        return;
      }

      const idx = data.won
        ? pickSegmentIndex(data.result?.prize?.name_ar, data.result?.is_grand)
        : 6;
      setResult(data);
      setTargetIndex(idx);
      setStep("spinning");
    } catch {
      toast({ title: "خطأ", description: "حدث خطأ — حاول مرة أخرى", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSettled = () => {
    setStep("result");
  };

  const copyCode = () => {
    if (!result?.result?.claim_code) return;
    navigator.clipboard.writeText(result.result.claim_code);
    setCodeCopied(true);
    toast({ title: "تم نسخ الرمز" });
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const isGrand = result?.result?.is_grand === true;
  const isVisitor = result?.result?.visitor_only === true;

  return (
    <MainLayout>
      <SEOHead
        title="أدر واربح"
        titleEn="Spin & Win"
        description="لف العجلة واربح جوائز فورية + الجائزة الكبرى من مول البستان — التجمع"
        descriptionEn="Spin the wheel at Mall Elbostan – New Cairo and win instant prizes."
        breadcrumbs={[{ name: "أدر واربح", url: "/spin-win" }]}
      />

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden bg-navy py-14 md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(var(--primary)/0.18)_0%,_transparent_70%)]" />
        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-navy-foreground text-sm font-medium mb-5">
              <Sparkles className="w-4 h-4" />
              <span>حملة افتتاح مول البستان — التجمع</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-navy-foreground mb-4 tracking-tight">
              لف العجلة واربح
            </h1>
            <p className="text-navy-foreground/70 text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-6">
              جوائز فورية وفرصة للفوز بالجائزة الكبرى داخل فرع التجمع.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/10 border border-card/20 text-navy-foreground text-xs md:text-sm font-semibold">
                <Trophy className="w-3.5 h-3.5" />
                أكثر من ١٠٠٠ جائزة
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/10 border border-card/20 text-navy-foreground text-xs md:text-sm font-semibold">
                <Crown className="w-3.5 h-3.5" />
                مفاجآت فاخرة في انتظارك
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange/15 border border-orange/30 text-navy-foreground text-xs md:text-sm font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                جائزة خاصة لزوار الفرع
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Main ─── */}
      <section className="container py-10 md:py-14">
        <AnimatePresence mode="wait">
          {/* Registration */}
          {step === "register" && (
            <motion.form
              key="register"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleStart}
              className="card-premium p-6 md:p-8 space-y-5 text-right max-w-xl mx-auto"
            >
              <div className="text-center mb-2">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-3">
                  <Gift className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-lg font-bold text-foreground">سجّل بياناتك للمشاركة</h2>
                <p className="text-xs text-muted-foreground mt-1">مشاركة واحدة لكل رقم هاتف يومياً.</p>
              </div>

              <div className="space-y-3">
                <Input
                  placeholder="الاسم الكامل *"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  className="bg-secondary/50 border-border h-12"
                  maxLength={100}
                  required
                />
                <Input
                  placeholder="رقم الهاتف *"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="bg-secondary/50 border-border h-12"
                  maxLength={20}
                  required
                  dir="ltr"
                />
                <Input
                  placeholder="البريد الإلكتروني (اختياري)"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="bg-secondary/50 border-border h-12"
                  maxLength={120}
                  dir="ltr"
                />

                {/* Visitor token (collapsible) */}
                <div className="pt-1">
                  {!showVisitorField ? (
                    <button
                      type="button"
                      onClick={() => setShowVisitorField(true)}
                      className="text-xs text-primary hover:underline font-semibold inline-flex items-center gap-1.5"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      عندي كود زائر من الفرع
                    </button>
                  ) : (
                    <div className="space-y-1.5 bg-primary/5 border border-primary/20 rounded-xl p-3">
                      <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                        كود الزائر
                      </label>
                      <Input
                        placeholder="مثال: BOSTAN-VISITOR-XXXX"
                        value={form.visitor_token}
                        onChange={(e) => setForm({ ...form, visitor_token: e.target.value.toUpperCase() })}
                        className="bg-card border-border h-11 font-mono text-sm"
                        dir="ltr"
                      />
                      <p className="text-[11px] text-muted-foreground">
                        يمنحك فرصة للفوز بالجائزة الخاصة لزوار الفرع.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-2 text-xs text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-border accent-primary"
                />
                <span>
                  أوافق على{" "}
                  <Link to="/reward-terms" className="text-primary hover:underline">الشروط والأحكام</Link>
                  {" "}الخاصة بالمسابقة.
                </span>
              </label>

              <Button type="submit" variant="cta" className="w-full h-12 text-base font-bold" disabled={loading}>
                {loading ? "جاري التحضير..." : "ابدأ الآن"}
              </Button>
            </motion.form>
          )}

          {/* Spinning + Wheel */}
          {step === "spinning" && (
            <motion.div
              key="spinning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-3xl mx-auto"
            >
              <div className="flex justify-center mb-6">
                <FloorTabs selected={floorId} onChange={setFloorId} />
              </div>

              <div className="relative flex items-center justify-center">
                {/* Outer store ring */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <StoreRing floorId={floorId} innerSize={wheelSize} ringThickness={ringThickness} />
                </div>

                {/* Inner wheel */}
                <div className="relative z-10">
                  <PrizeWheel
                    segments={WHEEL_SEGMENTS}
                    spinning={true}
                    targetIndex={targetIndex}
                    onSettled={handleSettled}
                    size={wheelSize}
                  />
                </div>
              </div>

              <p className="text-center mt-8 text-sm text-muted-foreground">
                جاري تحديد جائزتك...
              </p>
            </motion.div>
          )}

          {/* Result */}
          {step === "result" && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="card-premium overflow-hidden max-w-xl mx-auto"
            >
              {result.won && result.result ? (
                <>
                  {/* Banner */}
                  <div className={`p-6 md:p-8 text-center relative overflow-hidden ${
                    isGrand
                      ? "bg-gradient-to-br from-navy via-navy to-primary"
                      : isVisitor
                        ? "bg-gradient-to-br from-orange via-orange to-orange/80"
                        : "bg-gradient-blue"
                  }`}>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.12)_0%,_transparent_55%)]" />
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.15 }}
                      className="relative"
                    >
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm mb-4">
                        {isGrand ? <Crown className="h-8 w-8 text-white" /> : <Gift className="h-8 w-8 text-white" />}
                      </div>
                      <p className="text-white/85 text-sm font-medium mb-1">
                        {isGrand ? "الجائزة الكبرى" : isVisitor ? "جائزة خاصة لزوار الفرع" : "مبروك! حصلت على"}
                      </p>
                      <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                        {result.result.prize.name_ar}
                      </h2>
                    </motion.div>
                  </div>

                  <div className="p-6 md:p-8 space-y-4 text-right">
                    {/* Claim code + QR */}
                    <div className="border-2 border-dashed border-primary/30 bg-primary/5 p-5 rounded-xl text-center">
                      <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">رمز الاستلام</p>
                      <div className="mb-3 flex justify-center">
                        <ClaimQRCode
                          value={result.result.qr_data || result.result.claim_code}
                          claimCode={result.result.claim_code}
                          size={140}
                        />
                      </div>
                      <p className="font-mono text-xl md:text-2xl font-extrabold text-foreground tracking-[0.15em] mb-2">
                        {result.result.claim_code}
                      </p>
                      <button
                        onClick={copyCode}
                        className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                      >
                        {codeCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {codeCopied ? "تم النسخ" : "نسخ الرمز"}
                      </button>
                      <p className="mt-2 text-[0.7rem] text-muted-foreground">
                        أظهر الـ QR لموظف المتجر للتحقق والاستلام
                      </p>
                    </div>

                    {/* Sponsor store (if any) */}
                    {result.result.store?.name_ar && !isGrand && !isVisitor && (
                      <div className="flex items-center gap-4 bg-secondary/50 p-4 rounded-xl">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                          <Store className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground">الجائزة من</p>
                          <p className="font-bold text-foreground">{result.result.store.name_ar}</p>
                        </div>
                      </div>
                    )}

                    {/* Redemption rules */}
                    {result.result.prize.redemption_rules_ar && (
                      <div className="bg-secondary/50 p-4 rounded-xl">
                        <p className="font-bold text-foreground text-sm mb-1.5 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-primary" />
                          كيفية الاستلام
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {result.result.prize.redemption_rules_ar}
                        </p>
                      </div>
                    )}

                    {result.result.expires_at && (
                      <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        <span>
                          صالح حتى{" "}
                          {new Date(result.result.expires_at).toLocaleDateString("ar-EG", {
                            day: "numeric", month: "long", year: "numeric",
                          })}
                        </span>
                      </div>
                    )}

                    <div className="flex gap-3 pt-2">
                      <Link to="/map" className="flex-1">
                        <Button variant="cta" className="w-full h-11 gap-2">
                          <MapPin className="w-4 h-4" />
                          خريطة المول
                        </Button>
                      </Link>
                      <Link to="/reward-terms">
                        <Button variant="outline" className="h-11 px-4">
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-5">
                    <Sparkles className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-3">شكراً لمشاركتك</h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {result.message ?? "لم تتوفر مكافأة هذه المرة — جرّب مرة أخرى غداً."}
                  </p>
                  <Link to="/"><Button variant="outline">العودة للرئيسية</Button></Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Prize legend (visible on register only) */}
        {step === "register" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12 max-w-3xl mx-auto"
          >
            <h3 className="text-center text-sm font-bold text-muted-foreground uppercase tracking-wider mb-6">
              مجموعات الجوائز
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card-premium p-5 text-right">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-3">
                  <Gift className="h-5 w-5 text-primary" />
                </div>
                <h4 className="font-bold text-foreground mb-1">الجوائز الفورية</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  أكثر من ١٠٠٠ جائزة: قسائم خصم، منظفات شاشة، حوامل موبايل، وواقيات كابل.
                </p>
              </div>
              <div className="card-premium p-5 text-right">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-3">
                  <Crown className="h-5 w-5 text-primary" />
                </div>
                <h4 className="font-bold text-foreground mb-1">مفاجآت فاخرة</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  جائزة كبرى نادرة جداً تنتظر أحد المحظوظين خلال الحملة.
                </p>
              </div>
              <div className="card-premium p-5 text-right border-orange/30">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange/10 mb-3">
                  <ShieldCheck className="h-5 w-5 text-orange" />
                </div>
                <h4 className="font-bold text-foreground mb-1">جائزة الزائرين</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  متاحة فقط لزوار الفرع المتحقق منهم عبر كود الزائر من الموظفين.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick terms */}
        {step === "register" && (
          <div className="mt-10 max-w-3xl mx-auto bg-secondary/40 border border-border rounded-xl p-5 text-right">
            <h4 className="font-bold text-foreground text-sm mb-3">شروط مختصرة</h4>
            <ul className="space-y-1.5 text-xs text-muted-foreground leading-relaxed list-disc pr-5">
              <li>المشاركة مرة واحدة لكل رقم هاتف يومياً.</li>
              <li>جائزة الزائرين متاحة فقط للزوار المتحقق منهم داخل الفرع.</li>
              <li>الجوائز تخضع للتوافر — قد تنفد بعض الفئات قبل غيرها.</li>
              <li>تحتفظ إدارة المول بحق التحقق من أهلية الفائز.</li>
              <li>لا يمكن استبدال الجوائز بقيمة نقدية.</li>
            </ul>
          </div>
        )}
      </section>
    </MainLayout>
  );
};

export default SpinWin;
