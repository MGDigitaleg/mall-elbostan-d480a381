import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, UserPlus, ShieldCheck, ChevronRight, History } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { syncSpinHistory } from "@/lib/spinHistory";

const SpinAccount = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  // If already authenticated, sync and bounce to /spin-win.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        syncSpinHistory().finally(() => navigate("/spin-win", { replace: true }));
      }
    });
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email.trim() || form.password.length < 6) {
      toast({ title: "بيانات غير مكتملة", description: "البريد الإلكتروني وكلمة مرور لا تقل عن ٦ خانات.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        const redirectUrl = `${window.location.origin}/spin-win`;
        const { error } = await supabase.auth.signUp({
          email: form.email.trim(),
          password: form.password,
          options: { emailRedirectTo: redirectUrl },
        });
        if (error) throw error;
        toast({ title: "تم إنشاء الحساب", description: "تم تسجيل الدخول تلقائياً." });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email.trim(),
          password: form.password,
        });
        if (error) throw error;
        toast({ title: "تم تسجيل الدخول" });
      }
      // Merge any local-only attempts with the cloud
      await syncSpinHistory();
      navigate("/spin-win", { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "حدث خطأ غير متوقع";
      toast({
        title: "تعذّر إكمال العملية",
        description: message.includes("Invalid login")
          ? "البريد أو كلمة المرور غير صحيحة"
          : message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <SEOHead
        title="حسابي — أدر واربح"
        titleEn="My Account — Spin & Win"
        description="سجّل الدخول لمزامنة سجل محاولاتك في Spin & Win عبر جميع أجهزتك."
        descriptionEn="Sign in to sync your Spin & Win attempts across devices."
        breadcrumbs={[{ name: "أدر واربح", url: "/spin-win" }, { name: "حسابي", url: "/spin-win/account" }]}
      />

      <section className="bg-navy py-14 md:py-20">
        <div className="container text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-navy-foreground text-sm font-medium mb-5">
            <History className="w-4 h-4" />
            <span>مزامنة سجل المحاولات</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-navy-foreground mb-3 tracking-tight">
            احفظ جوائزك على حسابك
          </h1>
          <p className="text-navy-foreground/70 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            سجّل الدخول لتظهر جميع محاولاتك ورموز استلام الجوائز على أي جهاز تستخدمه.
          </p>
        </div>
      </section>

      <section className="bg-background py-10 md:py-14">
        <div className="container">
          <form
            onSubmit={onSubmit}
            dir="rtl"
            className="card-premium p-6 md:p-8 space-y-5 text-right max-w-md mx-auto"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                  mode === "login" ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground"
                }`}
              >
                تسجيل الدخول
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                  mode === "signup" ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground"
                }`}
              >
                إنشاء حساب
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">البريد الإلكتروني</label>
              <Input
                type="email"
                dir="ltr"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="example@email.com"
                className="bg-secondary/50 border-border h-12 text-left"
                maxLength={120}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">كلمة المرور</label>
              <Input
                type="password"
                dir="ltr"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="٦ خانات على الأقل"
                className="bg-secondary/50 border-border h-12 text-left"
                minLength={6}
                maxLength={72}
                required
              />
            </div>

            <Button type="submit" variant="cta" className="w-full h-12 text-base font-bold" disabled={loading}>
              {loading ? "جاري المعالجة..." : mode === "login" ? (
                <span className="inline-flex items-center gap-2"><LogIn className="w-4 h-4" /> تسجيل الدخول</span>
              ) : (
                <span className="inline-flex items-center gap-2"><UserPlus className="w-4 h-4" /> إنشاء الحساب</span>
              )}
            </Button>

            <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/15 text-[11px] text-muted-foreground leading-relaxed">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <p>
                نستخدم حسابك فقط لمزامنة سجل محاولات Spin & Win. لا نشارك بياناتك مع أي طرف.
              </p>
            </div>

            <Link
              to="/spin-win"
              className="flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              المتابعة بدون تسجيل
              <ChevronRight className="w-3 h-3" />
            </Link>
          </form>
        </div>
      </section>
    </MainLayout>
  );
};

export default SpinAccount;
