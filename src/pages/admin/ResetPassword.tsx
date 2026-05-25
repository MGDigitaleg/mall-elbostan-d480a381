import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

/**
 * Admin password reset target page.
 * Supabase redirects here from the recovery email with a `type=recovery`
 * hash. We wait for the SIGNED_IN / PASSWORD_RECOVERY event, then let the
 * admin set a new password.
 */
const AdminResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setReady(true);
      }
    });
    // Fallback: if a session already exists (recovery link consumed), allow form
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
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
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "تم تحديث كلمة المرور", description: "يمكنك الآن استخدام لوحة التحكم" });
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="card-premium p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gradient-blue text-center mb-2">إعادة تعيين كلمة المرور</h1>
        <p className="text-sm text-muted-foreground text-center mb-6">
          اختر كلمة مرور جديدة للوحة التحكم
        </p>
        {!ready ? (
          <p className="text-center text-muted-foreground text-sm">جاري التحقق من رابط الاسترداد...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="كلمة المرور الجديدة"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-secondary border-border"
              dir="ltr"
              autoComplete="new-password"
              minLength={8}
              required
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
            />
            <Button type="submit" variant="cta" className="w-full" disabled={loading}>
              {loading ? "جاري الحفظ..." : "حفظ كلمة المرور"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminResetPassword;
