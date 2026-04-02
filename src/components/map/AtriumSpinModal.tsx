import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, MapPin, Store, Layers, X, Check, ArrowLeft } from "lucide-react";
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

export function AtriumSpinModal({ open, onClose, onWin, onViewOnMap, onExploreCategory }: Props) {
  const { toast } = useToast();
  const [step, setStep] = useState<"register" | "processing" | "result">("register");
  const [form, setForm] = useState({ full_name: "", phone: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [prize, setPrize] = useState<SpinReward | null>(null);
  const [sponsorStore, setSponsorStore] = useState<SpinWinResult["sponsorStore"]>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
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
    setStep("processing");

    // Simulate brief processing delay — editorial reveal, not casino spin
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
    }, 2400);
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

  const handleViewOnMap = () => { handleClose(); onViewOnMap?.(); };
  const handleExploreCategory = () => { handleClose(); onExploreCategory?.(); };

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
            style={{ border: "1px solid hsl(var(--border))", boxShadow: "0 24px 64px hsl(222 36% 6% / 0.28), 0 4px 20px hsl(222 36% 6% / 0.12)" }}
          >
            {/* Close */}
            <button
              onClick={handleClose}
              className="absolute left-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            {/* ── REGISTER — editorial form, premium ── */}
            {step === "register" && (
              <form onSubmit={handleSubmit} className="p-6 md:p-7">
                {/* Header */}
                <div className="mb-5">
                  <div className="mb-3 flex items-center gap-2.5">
                    <div className="h-[3px] w-6 rounded-full" style={{ background: "hsl(var(--heritage))" }} />
                    <span className="font-poppins text-[0.62rem] font-bold uppercase tracking-[0.22em]" style={{ color: "hsl(var(--heritage))" }}>
                      Rewards
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card" style={{ boxShadow: "var(--shadow-soft)" }}>
                      <Gift className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-[1rem] font-extrabold light-heading">مكافآت مول البستان</h2>
                      <p className="text-[0.74rem] light-muted">سجّل للحصول على مكافأة من متاجر المول</p>
                    </div>
                  </div>
                </div>

                <div className="mb-5 rounded-xl border border-border p-3.5" style={{ background: "hsl(var(--secondary) / 0.3)" }}>
                  <p className="text-[0.8rem] leading-6 light-body">
                    المكافآت مقدّمة من متاجر حقيقية داخل المول. بعد المشاركة، يظهر موقع المتجر الراعي مباشرة على الخريطة التفاعلية.
                  </p>
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
                  {loading ? "جاري التحميل..." : "شارك الآن"}
                </Button>
                <p className="mt-2 text-center text-[0.68rem] light-muted">
                  مشاركة واحدة لكل رقم هاتف — الاستلام يوم الافتتاح
                </p>
              </form>
            )}

            {/* ── PROCESSING — editorial reveal, not casino spin ── */}
            {step === "processing" && (
              <div className="px-6 py-16 text-center">
                {/* Minimal processing indicator */}
                <div className="relative mx-auto h-16 w-16">
                  <div className="absolute inset-0 rounded-2xl border border-border bg-secondary" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Gift className="h-6 w-6 text-primary animate-pulse" />
                  </div>
                  {/* Subtle ring */}
                  <div
                    className="absolute -inset-3 rounded-2xl border-2 border-primary/10 animate-pulse"
                    style={{ animationDuration: "2s" }}
                  />
                </div>

                <p className="mt-6 text-[0.95rem] font-bold light-heading">جاري تحديد مكافأتك...</p>
                <p className="mt-1.5 text-[0.8rem] light-muted">لحظات — يتم مطابقة بياناتك مع المتاجر المشاركة</p>
              </div>
            )}

            {/* ── RESULT — editorial, map-connected ── */}
            {step === "result" && (
              <div className="p-6 md:p-7">
                {prize ? (
                  <div className="space-y-4">
                    {/* Result header — restrained celebration */}
                    <div className="text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-secondary" style={{ boxShadow: "var(--shadow-card)" }}>
                        <Gift className="h-6 w-6 text-primary" />
                      </div>
                      <h2 className="mt-4 text-[1.05rem] font-extrabold light-heading">حصلت على مكافأة</h2>
                      <p className="mt-1 text-[0.92rem] font-bold text-primary">{prize.title_ar}</p>
                    </div>

                    {/* Sponsor store — linked to map */}
                    {sponsorStore && (
                      <div className="flex items-center gap-3 rounded-xl border border-border p-3.5" style={{ background: "hsl(var(--secondary) / 0.3)" }}>
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card">
                          <Store className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-[0.84rem] font-bold light-heading">{sponsorStore.name_ar}</p>
                          {sponsorStore.unit_code && (
                            <p className="font-poppins text-[0.72rem] light-muted">{sponsorStore.unit_code}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Claim rules */}
                    {prize.claim_rules_ar && (
                      <div className="rounded-xl border border-border p-4">
                        <p className="mb-2 text-[0.68rem] font-bold uppercase tracking-[0.15em] light-muted">كيفية الاستلام</p>
                        <p className="text-[0.84rem] leading-7 light-body">{prize.claim_rules_ar}</p>
                      </div>
                    )}

                    {/* Steps — clean, professional */}
                    <div className="space-y-1">
                      {[
                        "احفظ لقطة شاشة لهذه الصفحة كإثبات",
                        "أحضرها يوم الافتتاح لاستلام المكافأة",
                        "تابع صفحاتنا الرسمية على مواقع التواصل",
                      ].map((item) => (
                        <div key={item} className="flex items-center gap-2.5 rounded-lg px-3 py-2" style={{ background: "hsl(var(--secondary) / 0.3)" }}>
                          <Check className="h-3 w-3 shrink-0 text-primary" />
                          <span className="text-[0.78rem] light-body">{item}</span>
                        </div>
                      ))}
                    </div>

                    {/* Map-connected CTAs */}
                    <div className="space-y-2 pt-1">
                      {sponsorStore?.unit_code ? (
                        <Button variant="cta" className="h-11 w-full rounded-xl text-[0.88rem] font-bold" onClick={handleViewOnMap}>
                          <MapPin className="ml-2 h-4 w-4" />
                          شاهد المتجر على الخريطة
                        </Button>
                      ) : (
                        <Button variant="cta" className="h-11 w-full rounded-xl text-[0.88rem] font-bold" onClick={handleExploreCategory}>
                          <Layers className="ml-2 h-4 w-4" />
                          اكتشف المتاجر المشاركة
                        </Button>
                      )}
                      <button onClick={handleClose} className="flex w-full items-center justify-center gap-1.5 py-2 text-[0.78rem] font-semibold light-muted transition-colors hover:text-foreground">
                        <ArrowLeft className="h-3 w-3" />
                        العودة إلى الخريطة
                      </button>
                    </div>
                  </div>
                ) : (
                  /* No prize — graceful, not disappointing */
                  <div className="py-6 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-secondary">
                      <Gift className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h2 className="mt-4 text-[1.05rem] font-extrabold light-heading">شكرًا لمشاركتك</h2>
                    <p className="mx-auto mt-2 max-w-xs text-[0.86rem] leading-7 light-body">
                      لم تتوفر مكافأة هذه المرة — لكن عروض وفعاليات الافتتاح بانتظارك.
                    </p>
                    <Button variant="secondary" className="mt-5 h-10 w-full rounded-xl text-[0.86rem] font-bold" onClick={handleClose}>
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
