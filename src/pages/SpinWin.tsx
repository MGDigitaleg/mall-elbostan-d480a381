import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

const SpinWin = () => {
  const { toast } = useToast();
  const [step, setStep] = useState<"register" | "spinning" | "result">("register");
  const [form, setForm] = useState({ full_name: "", phone: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [prize, setPrize] = useState<{ title_ar: string; claim_rules_ar: string | null } | null>(null);
  const [rotation, setRotation] = useState(0);

  const { data: rewards } = useQuery({
    queryKey: ["active-rewards"],
    queryFn: async () => {
      const { data } = await supabase.from("rewards").select("*").eq("is_active", true);
      return data ?? [];
    },
  });

  const hashPhone = async (phone: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(phone.trim());
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
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

  const handleSpin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.phone.trim()) {
      toast({ title: "خطأ", description: "يرجى ملء الاسم ورقم الهاتف", variant: "destructive" });
      return;
    }

    setLoading(true);
    const phoneHash = await hashPhone(form.phone);

    // Check if already participated
    const { data: existing } = await supabase.from("spin_entries").select("id").eq("phone_hash", phoneHash).maybeSingle();
    if (existing) {
      toast({ title: "تنبيه", description: "لقد شاركت بالفعل! يمكن لكل رقم المشاركة مرة واحدة فقط.", variant: "destructive" });
      setLoading(false);
      return;
    }

    const won = pickWeightedPrize();
    setStep("spinning");
    setRotation((prev) => prev + 1800 + Math.random() * 720);

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
        if (error.code === "23505") {
          toast({ title: "تنبيه", description: "لقد شاركت بالفعل!", variant: "destructive" });
          setStep("register");
        } else {
          toast({ title: "خطأ", description: "حدث خطأ. حاول مرة أخرى.", variant: "destructive" });
          setStep("register");
        }
      } else {
        setPrize(won ? { title_ar: won.title_ar, claim_rules_ar: won.claim_rules_ar } : null);
        setStep("result");
      }
    }, 4500);
  };

  return (
    <MainLayout>
      <SEOHead title="أدر واربح" description="شارك في لعبة أدر واربح واحصل على جوائز فورية من مول البستان يوم الافتتاح!" />
      <div className="container py-20 max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-gradient-blue mb-4">🎡 أدر واربح</h1>
        <p className="text-muted-foreground mb-10">سجّل بياناتك وأدر العجلة للفوز بجوائز قيّمة يوم الافتتاح!</p>

        {step === "register" && (
          <form onSubmit={handleSpin} className="card-premium p-8 space-y-4 text-right">
            <Input placeholder="الاسم الكامل *" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="bg-secondary border-border" required />
            <Input placeholder="رقم الهاتف *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="bg-secondary border-border" required dir="ltr" />
            <Input placeholder="البريد الإلكتروني (اختياري)" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-secondary border-border" dir="ltr" />
            <Button type="submit" variant="cta" className="w-full text-lg" disabled={loading}>
              {loading ? "جاري التحميل..." : "أدر العجلة! 🎡"}
            </Button>
            <p className="text-xs text-muted-foreground text-center">يمكنك المشاركة مرة واحدة فقط</p>
          </form>
        )}

        {step === "spinning" && (
          <div className="py-10">
            <div className="w-48 h-48 mx-auto rounded-full bg-gradient-blue flex items-center justify-center transition-transform duration-[4500ms] ease-out" style={{ transform: `rotate(${rotation}deg)` }}>
              <span className="text-6xl">🎡</span>
            </div>
            <p className="text-lg font-bold text-foreground mt-8 animate-pulse">جاري الدوران...</p>
          </div>
        )}

        {step === "result" && (
          <div className="card-premium p-8">
            {prize ? (
              <>
                <p className="text-5xl mb-4">🎉</p>
                <h2 className="text-2xl font-bold text-success mb-4">مبروك! لقد فزت!</h2>
                <p className="text-xl font-bold text-foreground mb-4">{prize.title_ar}</p>
                {prize.claim_rules_ar && (
                  <div className="bg-secondary/50 p-4 rounded-lg text-sm text-muted-foreground mt-4 text-right">
                    <p className="font-bold text-foreground mb-2">كيفية الاستلام:</p>
                    <p>{prize.claim_rules_ar}</p>
                  </div>
                )}
                <div className="bg-accent/10 p-4 rounded-lg mt-4 text-sm text-accent">
                  <p>📸 احفظ لقطة شاشة لهذه الصفحة</p>
                  <p>📅 أحضرها يوم الافتتاح لاستلام جائزتك</p>
                  <p>📱 تابع صفحاتنا الرسمية على مواقع التواصل</p>
                </div>
              </>
            ) : (
              <>
                <p className="text-5xl mb-4">😊</p>
                <h2 className="text-2xl font-bold text-foreground mb-4">شكراً لمشاركتك!</h2>
                <p className="text-muted-foreground">لم يحالفك الحظ هذه المرة، لكن لا تقلق — هناك عروض وفعاليات رائعة بانتظارك يوم الافتتاح!</p>
              </>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default SpinWin;
