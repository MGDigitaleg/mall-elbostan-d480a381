import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, MapPin, ArrowLeft, X, Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type Reward = {
  id: string;
  title_ar: string;
  reward_type: string;
  claim_rules_ar: string | null;
  sponsor_store_id: string | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onWin?: (reward: Reward | null) => void;
};

const WHEEL_SEGMENTS = [
  { label: "خصم متجر", color: "hsl(221 83% 53%)" },
  { label: "هدية مجانية", color: "hsl(192 91% 36%)" },
  { label: "قسيمة شراء", color: "hsl(221 83% 48%)" },
  { label: "عرض حصري", color: "hsl(192 91% 42%)" },
  { label: "زيارة مميّزة", color: "hsl(221 83% 58%)" },
  { label: "مفاجأة", color: "hsl(192 91% 32%)" },
];

export function AtriumSpinModal({ open, onClose, onWin }: Props) {
  const { toast } = useToast();
  const [step, setStep] = useState<"intro" | "register" | "spinning" | "result">("intro");
  const [form, setForm] = useState({ full_name: "", phone: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [prize, setPrize] = useState<Reward | null>(null);
  const [rotation, setRotation] = useState(0);

  const { data: rewards } = useQuery({
    queryKey: ["active-rewards"],
    queryFn: async () => {
      const { data } = await supabase.from("rewards").select("*").eq("is_active", true);
      return (data ?? []) as Reward[];
    },
    enabled: open,
  });

  const hashPhone = async (phone: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(phone.trim());
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  const pickWeightedPrize = useCallback(() => {
    if (!rewards || rewards.length === 0) return null;
    const available = rewards.filter((r: { stock: number }) => r.stock > 0);
    if (available.length === 0) return null;
    const totalWeight = available.reduce((sum: number, r: { probability_weight: number }) => sum + r.probability_weight, 0);
    let random = Math.random() * totalWeight;
    for (const reward of available) {
      random -= (reward as { probability_weight: number }).probability_weight;
      if (random <= 0) return reward;
    }
    return available[available.length - 1];
  }, [rewards]);

  const handleSpin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.phone.trim()) {
      toast({ title: "خطأ", description: "يرجى ملء الاسم ورقم الهاتف", variant: "destructive" });
      return;
    }

    setLoading(true);
    const phoneHash = await hashPhone(form.phone);

    const { data: existing } = await supabase.from("spin_entries").select("id").eq("phone_hash", phoneHash).maybeSingle();
    if (existing) {
      toast({ title: "تنبيه", description: "لقد شاركت بالفعل. يمكن لكل رقم المشاركة مرة واحدة.", variant: "destructive" });
      setLoading(false);
      return;
    }

    const won = pickWeightedPrize();
    setStep("spinning");
    setRotation((prev) => prev + 1440 + Math.random() * 720);

    setTimeout(async () => {
      const { error } = await supabase.from("spin_entries").insert({
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || null,
        prize_id: won?.id ?? null,
        phone_hash: phoneHash,
      });

      setLoading(false);
      if (error) {
        toast({ title: "خطأ", description: error.code === "23505" ? "لقد شاركت بالفعل!" : "حدث خطأ. حاول مرة أخرى.", variant: "destructive" });
        setStep("register");
      } else {
        setPrize(won);
        setStep("result");
        onWin?.(won);
      }
    }, 3800);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep("intro");
      setForm({ full_name: "", phone: "", email: "" });
      setPrize(null);
    }, 300);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-foreground/60 backdrop-blur-sm"
          />

          {/* modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-4 top-[10vh] z-50 mx-auto max-w-[480px] overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-elevated)] md:inset-x-auto"
          >
            {/* close button */}
            <button
              onClick={handleClose}
              className="absolute left-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/80 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            {/* ── INTRO ── */}
            {step === "intro" && (
              <div className="p-8 text-center">
                {/* atrium icon */}
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 ring-1 ring-primary/15">
                  <Gift className="h-9 w-9 text-primary" />
                </div>

                <h2 className="mt-6 text-xl font-bold text-foreground md:text-2xl">
                  مركز العروض والمكافآت
                </h2>
                <p className="mx-auto mt-3 max-w-xs text-[0.9rem] leading-7 text-muted-foreground">
                  من قلب الأتريوم — اكتشف مكافآت حصرية من متاجر مول البستان. سجّل وأدر العجلة للفوز.
                </p>

                <div className="mx-auto mt-6 grid max-w-[280px] gap-2">
                  {[
                    "خصومات من متاجر حقيقية",
                    "هدايا وإكسسوارات مجانية",
                    "قسائم شراء فورية",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 rounded-lg border border-border bg-secondary/30 px-3 py-2 text-[0.78rem]">
                      <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                      <span className="text-foreground">{item}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => setStep("register")}
                  variant="cta"
                  className="mt-7 h-12 w-full rounded-xl px-8 text-[0.95rem] font-bold"
                >
                  سجّل وابدأ
                </Button>

                <p className="mt-3 text-[0.7rem] text-muted-foreground">
                  مشاركة واحدة لكل رقم هاتف — الاستلام يوم الافتتاح
                </p>
              </div>
            )}

            {/* ── REGISTER ── */}
            {step === "register" && (
              <form onSubmit={handleSpin} className="p-8">
                <div className="mb-6 text-center">
                  <h2 className="text-lg font-bold text-foreground">سجّل بياناتك</h2>
                  <p className="mt-1 text-[0.82rem] text-muted-foreground">
                    أدخل بياناتك للمشاركة في عجلة المكافآت
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-[0.78rem] font-semibold text-foreground">الاسم الكامل *</label>
                    <Input
                      value={form.full_name}
                      onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                      className="h-11 rounded-lg border-border bg-secondary/40"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[0.78rem] font-semibold text-foreground">رقم الهاتف *</label>
                    <Input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="h-11 rounded-lg border-border bg-secondary/40"
                      required
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[0.78rem] font-semibold text-foreground">البريد الإلكتروني (اختياري)</label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="h-11 rounded-lg border-border bg-secondary/40"
                      dir="ltr"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="cta"
                  className="mt-6 h-12 w-full rounded-xl font-bold"
                  disabled={loading}
                >
                  {loading ? "جاري التحميل..." : "أدر العجلة"}
                </Button>

                <button
                  type="button"
                  onClick={() => setStep("intro")}
                  className="mt-3 w-full text-center text-[0.78rem] text-muted-foreground hover:text-foreground"
                >
                  رجوع
                </button>
              </form>
            )}

            {/* ── SPINNING ── */}
            {step === "spinning" && (
              <div className="px-8 py-14 text-center">
                {/* Wheel */}
                <div className="relative mx-auto h-52 w-52">
                  {/* outer ring */}
                  <div className="absolute inset-0 rounded-full border-[3px] border-primary/20" />

                  {/* spinning wheel */}
                  <svg
                    viewBox="0 0 200 200"
                    className="h-full w-full"
                    style={{
                      transform: `rotate(${rotation}deg)`,
                      transition: "transform 3.8s cubic-bezier(0.17, 0.67, 0.12, 0.99)",
                    }}
                  >
                    {WHEEL_SEGMENTS.map((seg, i) => {
                      const angle = (360 / WHEEL_SEGMENTS.length) * i;
                      const rad1 = (angle * Math.PI) / 180;
                      const rad2 = ((angle + 360 / WHEEL_SEGMENTS.length) * Math.PI) / 180;
                      const x1 = 100 + 90 * Math.cos(rad1);
                      const y1 = 100 + 90 * Math.sin(rad1);
                      const x2 = 100 + 90 * Math.cos(rad2);
                      const y2 = 100 + 90 * Math.sin(rad2);
                      const midAngle = angle + 360 / WHEEL_SEGMENTS.length / 2;
                      const midRad = (midAngle * Math.PI) / 180;
                      const tx = 100 + 55 * Math.cos(midRad);
                      const ty = 100 + 55 * Math.sin(midRad);
                      return (
                        <g key={i}>
                          <path
                            d={`M100,100 L${x1},${y1} A90,90 0 0,1 ${x2},${y2} Z`}
                            fill={seg.color}
                            stroke="hsl(0 0% 100% / 0.15)"
                            strokeWidth="0.5"
                          />
                          <text
                            x={tx}
                            y={ty}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="white"
                            fontSize="7"
                            fontWeight="600"
                            transform={`rotate(${midAngle}, ${tx}, ${ty})`}
                          >
                            {seg.label}
                          </text>
                        </g>
                      );
                    })}
                    {/* center */}
                    <circle cx="100" cy="100" r="16" fill="hsl(0 0% 100%)" />
                    <circle cx="100" cy="100" r="12" fill="hsl(222 47% 11%)" />
                    <circle cx="100" cy="100" r="4" fill="hsl(221 83% 53%)" />
                  </svg>

                  {/* pointer */}
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2">
                    <div className="h-4 w-4 rotate-45 rounded-sm bg-foreground shadow-md" />
                  </div>
                </div>

                <p className="mt-8 text-lg font-bold text-foreground">جاري الدوران...</p>
                <p className="mt-1 text-[0.82rem] text-muted-foreground">لحظات وتعرف مكافأتك</p>
              </div>
            )}

            {/* ── RESULT ── */}
            {step === "result" && (
              <div className="p-8 text-center">
                {prize ? (
                  <>
                    {/* success icon */}
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
                      <Gift className="h-7 w-7 text-primary" />
                    </div>

                    <h2 className="mt-5 text-xl font-bold text-foreground">مبروك!</h2>
                    <p className="mt-2 text-lg font-bold text-primary">{prize.title_ar}</p>

                    {prize.claim_rules_ar && (
                      <div className="mx-auto mt-5 max-w-sm rounded-xl border border-border bg-secondary/30 p-4 text-right">
                        <p className="text-[0.72rem] font-semibold uppercase tracking-widest text-muted-foreground">كيفية الاستلام</p>
                        <p className="mt-2 text-[0.85rem] leading-7 text-foreground">{prize.claim_rules_ar}</p>
                      </div>
                    )}

                    <div className="mx-auto mt-4 max-w-sm space-y-1.5">
                      {[
                        "احفظ لقطة شاشة لهذه الصفحة",
                        "أحضرها يوم الافتتاح لاستلام جائزتك",
                        "تابع صفحاتنا الرسمية على مواقع التواصل",
                      ].map((item) => (
                        <div key={item} className="flex items-center gap-2 text-[0.78rem] text-muted-foreground">
                          <Check className="h-3 w-3 shrink-0 text-primary" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex flex-col gap-2">
                      <Button
                        variant="cta"
                        className="h-11 w-full rounded-xl font-bold"
                        onClick={handleClose}
                      >
                        <MapPin className="ml-2 h-4 w-4" />
                        شاهد المتجر على الخريطة
                      </Button>
                      <button
                        onClick={handleClose}
                        className="text-[0.78rem] text-muted-foreground hover:text-foreground"
                      >
                        إغلاق
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary ring-1 ring-border">
                      <Gift className="h-7 w-7 text-muted-foreground" />
                    </div>
                    <h2 className="mt-5 text-xl font-bold text-foreground">شكرًا لمشاركتك</h2>
                    <p className="mx-auto mt-2 max-w-xs text-[0.9rem] leading-7 text-muted-foreground">
                      لم يحالفك الحظ هذه المرة — لكن هناك عروض وفعاليات بانتظارك يوم الافتتاح.
                    </p>
                    <Button
                      variant="secondary"
                      className="mt-6 h-11 w-full rounded-xl"
                      onClick={handleClose}
                    >
                      العودة إلى الخريطة
                    </Button>
                  </>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
