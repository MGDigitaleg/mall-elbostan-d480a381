import { useState } from "react";
import { useRequireMerchant } from "@/hooks/useMerchant";
import { MerchantShell } from "@/components/merchant/MerchantShell";
import { AdminPageHeader } from "@/components/admin/AdminPrimitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail, KeyRound, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function MerchantAccount() {
  const { loading, user } = useRequireMerchant();
  const { signOut } = useAuth();
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [busy, setBusy] = useState(false);

  if (loading || !user) return <MerchantShell><div className="text-sm text-muted-foreground">جاري التحميل…</div></MerchantShell>;

  const changePassword = async () => {
    if (pwd.length < 8) { toast.error("كلمة السر يجب ٨ أحرف على الأقل"); return; }
    if (pwd !== pwd2) { toast.error("كلمتا السر غير متطابقتين"); return; }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pwd });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("تم تحديث كلمة السر");
    setPwd(""); setPwd2("");
  };

  return (
    <MerchantShell>
      <AdminPageHeader title="إعدادات الحساب" subtitle="إدارة بيانات الدخول الخاصة بك." />

      <div className="grid lg:grid-cols-2 gap-4 max-w-4xl">
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-bold text-foreground mb-3 flex items-center gap-1.5"><Mail className="w-4 h-4" /> الملف الشخصي</h2>
          <div className="space-y-2">
            <div><Label className="text-xs font-bold">البريد الإلكتروني</Label><Input value={user.email ?? ""} disabled dir="ltr" /></div>
            <div><Label className="text-xs font-bold">معرّف الحساب</Label><Input value={user.id} disabled dir="ltr" className="font-mono text-xs" /></div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-bold text-foreground mb-3 flex items-center gap-1.5"><KeyRound className="w-4 h-4" /> تغيير كلمة السر</h2>
          <div className="space-y-2">
            <div><Label className="text-xs font-bold">كلمة سر جديدة</Label><Input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} dir="ltr" /></div>
            <div><Label className="text-xs font-bold">تأكيد كلمة السر</Label><Input type="password" value={pwd2} onChange={(e) => setPwd2(e.target.value)} dir="ltr" /></div>
            <Button onClick={changePassword} disabled={busy} className="w-full mt-2">{busy ? "جارٍ التحديث…" : "حفظ كلمة السر"}</Button>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
          <h2 className="font-bold text-foreground mb-2">الدعم</h2>
          <p className="text-sm text-muted-foreground mb-3">
            لأي مساعدة بخصوص ربط متجر خارجي، إضافة منتجات، أو تعديل بيانات إدارية، يرجى التواصل مع فريق مول البستان.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline"><a href="mailto:support@mallelbostan.com" dir="ltr">support@mallelbostan.com</a></Button>
            <Button variant="ghost" onClick={signOut} className="gap-1"><LogOut className="w-4 h-4" /> تسجيل الخروج</Button>
          </div>
        </div>
      </div>
    </MerchantShell>
  );
}
