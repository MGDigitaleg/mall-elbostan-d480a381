import { useState } from "react";
import { Gift, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import type { SpinPrizeResult } from "@/components/map/AtriumSpinModal";

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
      <SEOHead title="أدر واربح" titleEn="Spin & Win" description="شارك في لعبة أدر واربح واحصل على جوائز فورية من متاجر مول البستان" descriptionEn="Spin the wheel and win prizes at Mall Elbostan" breadcrumbs={[{ name: "أدر واربح", url: "/spin-win" }]} />
      <div className="container py-20 max-w-2xl text-center">
        <h1 className="text-2xl font-bold text-gradient-blue mb-4 md:text-3xl">أدر واربح</h1>
        <p className="text-muted-foreground mb-10">سجّل بياناتك — النظام يختار متجرًا مشاركًا ومكافأة عشوائية لك. مشاركة واحدة يوميًا.</p>

        {step === "register" && (
          <form onSubmit={handleSpin} className="card-premium p-8 space-y-4 text-right">
            <Input placeholder="الاسم الكامل *" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="bg-secondary border-border" required />
            <Input placeholder="رقم الهاتف *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="bg-secondary border-border" required dir="ltr" />
            <Input placeholder="البريد الإلكتروني (اختياري)" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-secondary border-border" dir="ltr" />
            <Button type="submit" variant="cta" className="w-full text-lg" disabled={loading}>
              {loading ? "جاري التحميل..." : "أدر العجلة"}
            </Button>
            <p className="text-xs text-muted-foreground text-center">يمكنك المشاركة مرة واحدة يوميًا</p>
          </form>
        )}

        {step === "processing" && (
          <div className="py-10">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-blue flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-white animate-pulse" />
            </div>
            <p className="text-lg font-bold text-foreground mt-8 animate-pulse">جاري اختيار المتجر والمكافأة...</p>
          </div>
        )}

        {step === "result" && result && (
          <div className="card-premium p-8 text-right">
            {result.won && result.result ? (
              <>
                <div className="text-center mb-6">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                    <Gift className="h-7 w-7 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mt-4">حصلت على مكافأة</h2>
                  <p className="text-xl font-bold text-primary mt-2">{result.result.prize.name_ar}</p>
                </div>

                {result.result.store?.name_ar && (
                  <div className="bg-secondary/50 p-4 rounded-lg mb-4">
                    <p className="text-sm text-muted-foreground">المتجر الراعي</p>
                    <p className="font-bold text-foreground">{result.result.store.name_ar}</p>
                    {result.result.store.unit_code && <p className="text-sm text-muted-foreground">{result.result.store.unit_code}</p>}
                  </div>
                )}

                <div className="bg-primary/5 border-2 border-primary/20 p-4 rounded-lg mb-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">رمز الاستلام</p>
                  <p className="font-mono text-2xl font-extrabold text-foreground tracking-widest">{result.result.claim_code}</p>
                  <button onClick={copyCode} className="mt-2 text-sm text-primary hover:underline">
                    {codeCopied ? "تم النسخ" : "نسخ الرمز"}
                  </button>
                </div>

                {result.result.prize.redemption_rules_ar && (
                  <div className="bg-secondary/50 p-4 rounded-lg mb-4">
                    <p className="font-bold text-foreground mb-2">كيفية الاستلام:</p>
                    <p className="text-sm text-muted-foreground">{result.result.prize.redemption_rules_ar}</p>
                  </div>
                )}

                {result.result.expires_at && (
                  <p className="text-xs text-muted-foreground mb-4">
                    صالح حتى {new Date(result.result.expires_at).toLocaleDateString("ar-EG", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                )}

                <div className="flex gap-2 mt-4">
                  <Link to="/map" className="flex-1">
                    <Button variant="cta" className="w-full">شاهد المتجر على الخريطة</Button>
                  </Link>
                  <Link to="/reward-terms" className="flex-1">
                    <Button variant="outline" className="w-full">الشروط والأحكام</Button>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-foreground mb-4">شكرًا لمشاركتك</h2>
                  <p className="text-muted-foreground">{result.message ?? "لم تتوفر مكافأة هذه المرة — جرّب مرة أخرى غدًا."}</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default SpinWin;
