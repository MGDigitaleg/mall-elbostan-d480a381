import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, MapPin, Store, Layers, X, Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export type SpinReward = {
  id: string;
  title_ar: string;
  reward_type: string;
  claim_rules_ar: string | null;
  sponsor_store_id: string | null;
  stock: number;
  probability_weight: number;
};

export type SpinWinResult = {
  reward: SpinReward;
  sponsorStore: {
    id: string;
    name_ar: string;
    category: string | null;
    unit_code: string | null;
    floor_id: string | null;
  } | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onWin?: (result: SpinWinResult | null) => void;
  onViewOnMap?: () => void;
  onExploreCategory?: () => void;
};

// Premium wheel segments — restrained palette, not casino
const WHEEL_SEGMENTS = [
  { label: "خصم متجر",    color: "hsl(222 40% 28%)" },
  { label: "هدية مجانية",  color: "hsl(222 35% 35%)" },
  { label: "قسيمة شراء",  color: "hsl(222 40% 24%)" },
  { label: "عرض حصري",    color: "hsl(222 35% 32%)" },
  { label: "زيارة مميّزة", color: "hsl(222 40% 26%)" },
  { label: "مكافأة",       color: "hsl(222 35% 30%)" },
];

export function AtriumSpinModal({ open, onClose, onWin, onViewOnMap, onExploreCategory }: Props) {
  const { toast } = useToast();
  const [step, setStep] = useState<"register" | "spinning" | "result">("register");
  const [form, setForm] = useState({ full_name: "", phone: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [prize, setPrize] = useState<SpinReward | null>(null);
  const [sponsorStore, setSponsorStore] = useState<SpinWinResult["sponsorStore"]>(null);
  const [rotation, setRotation] = useState(0);

  const { data: rewards } = useQuery({
    queryKey: ["active-rewards"],
    queryFn: async () => {
      const { data } = await supabase.from("rewards").select("*").eq("is_active", true);
      return (data ?? []) as SpinReward[];
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
    const available = rewards.filter((r) => r.stock > 0);
    if (available.length === 0) return null;
    const totalWeight = available.reduce((sum, r) => sum + r.probability_weight, 0);
    let random = Math.random() * totalWeight;
    for (const reward of available) {
      random -= reward.probability_weight;
      if (random <= 0) return reward;
    }
    return available[available.length - 1];
  }, [rewards]);

  const resolveSponsorStore = async (storeId: string): Promise<SpinWinResult["sponsorStore"]> => {
    const { data } = await supabase
      .from("stores")
      .select("id, name_ar, category, unit_code, floor_id")
      .eq("id", storeId)
      .maybeSingle();
    return data ?? null;
  };

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

        let resolved: SpinWinResult["sponsorStore"] = null;
        if (won?.sponsor_store_id) {
          resolved = await resolveSponsorStore(won.sponsor_store_id);
          setSponsorStore(resolved);
        }

        setStep("result");
        onWin?.(won ? { reward: won, sponsorStore: resolved } : null);
      }
    }, 3800);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep("register");
      setForm({ full_name: "", phone: "", email: "" });
      setPrize(null);
      setSponsorStore(null);
    }, 300);
  };

  const handleViewOnMap = () => {
    handleClose();
    onViewOnMap?.();
  };

  const handleExploreCategory = () => {
    handleClose();
    onExploreCategory?.();
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
            onClick={handleClose}
            className="fixed inset-0 z-50"
            style={{ background: "hsl(222 36% 6% / 0.75)", backdropFilter: "blur(8px)" }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 16 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-4 top-[8vh] z-50 mx-auto max-w-[460px] max-h-[84vh] overflow-y-auto rounded-2xl bg-card md:inset-x-auto"
            style={{ border: "1px solid hsl(var(--border))", boxShadow: "0 20px 60px hsl(222 36% 6% / 0.3), 0 4px 16px hsl(222 36% 6% / 0.15)" }}
          >
            {/* Close */}
            <button
              onClick={handleClose}
              className="absolute left-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            {/* ── REGISTER — clean form, premium feel ── */}
            {step === "register" && (
              <form onSubmit={handleSpin} className="p-6 md:p-7">
                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: "hsl(222 58% 42% / 0.08)", border: "1px solid hsl(222 58% 42% / 0.12)" }}>
                      <Gift className="h-5 w-5" style={{ color: "hsl(222 58% 42%)" }} />
                    </div>
                    <div>
                      <h2 className="text-[0.95rem] font-bold text-foreground">مكافآت مول البستان</h2>
                      <p className="text-[0.72rem] text-muted-foreground">سجّل للحصول على مكافأة حقيقية</p>
                    </div>
                  </div>

                  <div className="rounded-xl p-3.5" style={{ background: "hsl(222 36% 96%)", border: "1px solid hsl(222 30% 90%)" }}>
                    <p className="text-[0.78rem] leading-6 text-muted-foreground">
                      المكافآت مقدّمة من متاجر المول. بعد الفوز، يظهر موقع المتجر مباشرة على الخريطة التفاعلية.
                    </p>
                  </div>
                </div>

                {/* Form fields */}
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-[0.75rem] font-semibold text-foreground">الاسم الكامل *</label>
                    <Input
                      value={form.full_name}
                      onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                      className="h-10 rounded-lg border-border bg-background"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[0.75rem] font-semibold text-foreground">رقم الهاتف *</label>
                    <Input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="h-10 rounded-lg border-border bg-background"
                      required
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[0.75rem] font-semibold text-foreground">البريد الإلكتروني <span className="text-muted-foreground font-normal">(اختياري)</span></label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="h-10 rounded-lg border-border bg-background"
                      dir="ltr"
                    />
                  </div>
                </div>

                <Button type="submit" variant="cta" className="mt-5 h-11 w-full rounded-xl text-[0.88rem] font-bold" disabled={loading}>
                  {loading ? "جاري التحميل..." : "أدر العجلة"}
                </Button>
                <p className="mt-2 text-center text-[0.68rem] text-muted-foreground">
                  مشاركة واحدة لكل رقم هاتف — الاستلام يوم الافتتاح
                </p>
              </form>
            )}

            {/* ── SPINNING — restrained, branded wheel ── */}
            {step === "spinning" && (
              <div className="px-6 py-12 text-center">
                <div className="relative mx-auto h-48 w-48">
                  {/* Outer ring */}
                  <div className="absolute inset-0 rounded-full" style={{ border: "2px solid hsl(222 30% 80%)" }} />

                  <svg
                    viewBox="0 0 200 200"
                    className="h-full w-full"
                    style={{
                      transform: `rotate(${rotation}deg)`,
                      transition: "transform 3.8s cubic-bezier(0.17, 0.67, 0.12, 0.99)",
                    }}
                  >
                    {WHEEL_SEGMENTS.map((seg, i) => {
                      const segAngle = 360 / WHEEL_SEGMENTS.length;
                      const angle = segAngle * i;
                      const rad1 = (angle * Math.PI) / 180;
                      const rad2 = ((angle + segAngle) * Math.PI) / 180;
                      const x1 = 100 + 88 * Math.cos(rad1);
                      const y1 = 100 + 88 * Math.sin(rad1);
                      const x2 = 100 + 88 * Math.cos(rad2);
                      const y2 = 100 + 88 * Math.sin(rad2);
                      const midRad = ((angle + segAngle / 2) * Math.PI) / 180;
                      const tx = 100 + 54 * Math.cos(midRad);
                      const ty = 100 + 54 * Math.sin(midRad);
                      return (
                        <g key={i}>
                          <path
                            d={`M100,100 L${x1},${y1} A88,88 0 0,1 ${x2},${y2} Z`}
                            fill={seg.color}
                            stroke="hsl(222 30% 18%)"
                            strokeWidth="0.5"
                          />
                          <text
                            x={tx} y={ty}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="hsl(0 0% 90%)"
                            fontSize="6.5"
                            fontWeight="600"
                            transform={`rotate(${angle + segAngle / 2}, ${tx}, ${ty})`}
                          >
                            {seg.label}
                          </text>
                        </g>
                      );
                    })}
                    {/* Center hub */}
                    <circle cx="100" cy="100" r="14" fill="hsl(0 0% 97%)" />
                    <circle cx="100" cy="100" r="10" fill="hsl(222 36% 11%)" />
                    <circle cx="100" cy="100" r="3.5" fill="hsl(222 58% 42%)" />
                  </svg>

                  {/* Pointer — subtle, architectural */}
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2">
                    <div className="h-3.5 w-3.5 rotate-45 rounded-[2px]" style={{ background: "hsl(222 36% 11%)" }} />
                  </div>
                </div>

                <p className="mt-7 text-[0.95rem] font-bold text-foreground">جاري تحديد مكافأتك...</p>
                <p className="mt-1 text-[0.78rem] text-muted-foreground">لحظات</p>
              </div>
            )}

            {/* ── RESULT — premium, map-connected ── */}
            {step === "result" && (
              <div className="p-6 md:p-7">
                {prize ? (
                  <div className="space-y-4">
                    {/* Success header */}
                    <div className="text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: "hsl(222 58% 42% / 0.08)", border: "1px solid hsl(222 58% 42% / 0.12)" }}>
                        <Gift className="h-6 w-6" style={{ color: "hsl(222 58% 42%)" }} />
                      </div>
                      <h2 className="mt-3 text-lg font-bold text-foreground">مبروك — ربحت مكافأة</h2>
                      <p className="mt-1 text-[0.92rem] font-bold" style={{ color: "hsl(222 58% 42%)" }}>{prize.title_ar}</p>
                    </div>

                    {/* Sponsor store — if linked */}
                    {sponsorStore && (
                      <div className="flex items-center gap-3 rounded-xl p-3.5" style={{ background: "hsl(222 36% 96%)", border: "1px solid hsl(222 30% 90%)" }}>
                        <Store className="h-4 w-4 shrink-0" style={{ color: "hsl(222 58% 42%)" }} />
                        <div>
                          <p className="text-[0.82rem] font-bold text-foreground">{sponsorStore.name_ar}</p>
                          {sponsorStore.unit_code && (
                            <p className="font-poppins text-[0.7rem] text-muted-foreground">{sponsorStore.unit_code}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Claim rules */}
                    {prize.claim_rules_ar && (
                      <div className="rounded-xl p-3.5" style={{ background: "hsl(var(--secondary) / 0.4)", border: "1px solid hsl(var(--border))" }}>
                        <p className="text-[0.7rem] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">كيفية الاستلام</p>
                        <p className="text-[0.82rem] leading-7 text-foreground">{prize.claim_rules_ar}</p>
                      </div>
                    )}

                    {/* Steps — clean checklist */}
                    <div className="space-y-1.5">
                      {[
                        "احفظ لقطة شاشة لهذه الصفحة",
                        "أحضرها يوم الافتتاح لاستلام المكافأة",
                        "تابع صفحاتنا الرسمية على مواقع التواصل",
                      ].map((item) => (
                        <div key={item} className="flex items-center gap-2 text-[0.75rem] text-muted-foreground">
                          <Check className="h-3 w-3 shrink-0" style={{ color: "hsl(222 58% 42%)" }} />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    {/* Map-aware CTAs */}
                    <div className="space-y-2 pt-1">
                      {sponsorStore?.unit_code ? (
                        <Button variant="cta" className="h-10 w-full rounded-xl text-[0.85rem] font-bold" onClick={handleViewOnMap}>
                          <MapPin className="ml-2 h-4 w-4" />
                          شاهد المتجر على الخريطة
                        </Button>
                      ) : (
                        <Button variant="cta" className="h-10 w-full rounded-xl text-[0.85rem] font-bold" onClick={handleExploreCategory}>
                          <Layers className="ml-2 h-4 w-4" />
                          اكتشف المتاجر المشاركة
                        </Button>
                      )}
                      <button onClick={handleClose} className="w-full text-center text-[0.75rem] text-muted-foreground hover:text-foreground transition-colors py-1">
                        إغلاق
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: "hsl(var(--secondary) / 0.6)", border: "1px solid hsl(var(--border))" }}>
                      <Gift className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h2 className="mt-4 text-lg font-bold text-foreground">شكرًا لمشاركتك</h2>
                    <p className="mx-auto mt-2 max-w-xs text-[0.85rem] leading-7 text-muted-foreground">
                      لم يحالفك الحظ هذه المرة — لكن هناك عروض وفعاليات بانتظارك يوم الافتتاح.
                    </p>
                    <Button variant="secondary" className="mt-5 h-10 w-full rounded-xl text-[0.85rem]" onClick={handleClose}>
                      العودة إلى الخريطة
                    </Button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
