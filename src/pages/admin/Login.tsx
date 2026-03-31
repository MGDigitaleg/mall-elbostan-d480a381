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

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="card-premium p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gradient-blue text-center mb-6">لوحة التحكم</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <Input placeholder="البريد الإلكتروني" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-secondary border-border" dir="ltr" required />
          <Input placeholder="كلمة المرور" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-secondary border-border" dir="ltr" required />
          <Button type="submit" variant="cta" className="w-full" disabled={loading}>{loading ? "جاري الدخول..." : "دخول"}</Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
