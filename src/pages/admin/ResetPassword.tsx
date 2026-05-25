import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

/**
 * Admin password reset target page.
 * Handles three states cleanly:
 *  1. Verifying recovery link
 *  2. Invalid/expired link → clear CTA back to login
 *  3. Ready → set new password form
 * After success the user is signed out so they can log in fresh.
 */
const AdminResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [state, setState] = useState<"verifying" | "ready" | "invalid" | "saving" | "done">("verifying");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for error hash in URL (Supabase appends error_code etc.)
    const hash = window.location.hash || "";
    if (hash.includes("error=") || hash.includes("error_code=")) {
      const params = new URLSearchParams(hash.replace(/^#/, ""));
      setError(params.get("error_description") || "الرابط غير صالح أو منتهي الصلاحية.");
      setState("invalid");
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setState("ready");
      }
    });

    // Fallback: if a session exists, allow the form (recovery already consumed)
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setState((s) => (s === "verifying" ? "ready" : s));
      } else {
        // give onAuthStateChange a moment, then mark invalid
        setTimeout(() => {
          setState((s) => (s === "verifying" ? "invalid" : s));
        }, 2500);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast({ title: "خطأ", description: "كلمة المرور يجب أن تكون 8 أحرف على الأقل", variant: "destructive" });
      return;
    }
    if (password !== confirm) {
      toast({ title: "خطأ", description: "كلمتا المرور غير متطابقتين", variant: "destructive" });
      return;
    }
    setState("saving");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setState("ready");
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
      return;
    }
    setState("done");
    toast({ title: "تم تحديث كلمة المرور", description: "تم تسجيل الخروج. سجّل دخولك بكلمة المرور الجديدة." });
    // Sign out so the user starts a clean session with the new password
    await supabase.auth.signOut();
    setTimeout(() => navigate("/admin/login"), 1500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="card-premium p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gradient-blue text-center mb-2">إعادة تعيين كلمة المرور</h1>
        <p className="text-sm text-muted-foreground text-center mb-6">
          اختر كلمة مرور جديدة للوحة التحكم
        </p>

        {state === "verifying" && (
          <div className="flex flex-col items-center gap-3 py-8 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin" />
            <p className="text-sm">جاري التحقق من رابط الاسترداد...</p>
          </div>
        )}

        {state === "invalid" && (
          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-destructive/10 grid place-items-center">
                <AlertCircle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="font-bold text-foreground">رابط غير صالح أو منتهي الصلاحية</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {error ?? "يبدو أن رابط إعادة التعيين انتهت صلاحيته أو سبق استخدامه."}
                </p>
              </div>
            </div>
            <Link to="/admin/login" className="block">
              <Button variant="cta" className="w-full">العودة لتسجيل الدخول</Button>
            </Link>
            <p className="text-[11px] text-center text-muted-foreground">
              يمكنك طلب رابط جديد عبر "نسيت كلمة المرور؟" في صفحة الدخول.
            </p>
          </div>
        )}

        {(state === "ready" || state === "saving") && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="كلمة المرور الجديدة (8 أحرف على الأقل)"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-secondary border-border"
              dir="ltr"
              autoComplete="new-password"
              minLength={8}
              required
              disabled={state === "saving"}
            />
            <Input
              placeholder="تأكيد كلمة المرور"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="bg-secondary border-border"
              dir="ltr"
              autoComplete="new-password"
              minLength={8}
              required
              disabled={state === "saving"}
            />
            <Button type="submit" variant="cta" className="w-full" disabled={state === "saving"}>
              {state === "saving" ? (
                <><Loader2 className="w-4 h-4 ml-1 animate-spin" /> جاري الحفظ...</>
              ) : (
                "حفظ كلمة المرور"
              )}
            </Button>
          </form>
        )}

        {state === "done" && (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 grid place-items-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="font-bold text-foreground">تم تحديث كلمة المرور</p>
            <p className="text-sm text-muted-foreground">جاري تحويلك إلى تسجيل الدخول...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminResetPassword;
