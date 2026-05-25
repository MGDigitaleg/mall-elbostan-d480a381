import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast({ title: "خطأ", description: "بيانات الدخول غير صحيحة", variant: "destructive" });
    } else {
      navigate("/admin");
    }
  };

  const handleForgot = async () => {
    if (!email) {
      toast({ title: "أدخل البريد الإلكتروني أولاً", variant: "destructive" });
      return;
    }
    setResetting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });
    setResetting(false);
    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    } else {
      toast({
        title: "تم إرسال الرابط",
        description: "تحقق من بريدك الإلكتروني لإعادة تعيين كلمة المرور",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="card-premium p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gradient-blue text-center mb-6">لوحة التحكم</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            placeholder="البريد الإلكتروني"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-secondary border-border"
            dir="ltr"
            autoComplete="email"
            required
          />
          <Input
            placeholder="كلمة المرور"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-secondary border-border"
            dir="ltr"
            autoComplete="current-password"
            required
          />
          <Button type="submit" variant="cta" className="w-full" disabled={loading}>
            {loading ? "جاري الدخول..." : "دخول"}
          </Button>
          <button
            type="button"
            onClick={handleForgot}
            disabled={resetting}
            className="block w-full text-center text-xs text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
          >
            {resetting ? "جاري الإرسال..." : "نسيت كلمة المرور؟"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
