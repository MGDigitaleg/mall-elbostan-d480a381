import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRequireAdmin } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useSitePhone } from "@/hooks/useSitePhone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowRight, Phone, Save, RotateCcw } from "lucide-react";

const STORAGE_KEY = "mall-bostan-official-phone";

const AdminContactSettings = () => {
  const { loading: authLoading } = useRequireAdmin();
  const { phone: livePhone, refresh } = useSitePhone();
  const [value, setValue] = useState("");
  const [initial, setInitial] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setValue(livePhone);
    setInitial(livePhone);
  }, [livePhone]);

  const isValid = value.trim() === "" || /^\+?[0-9\s\-()]{6,20}$/.test(value.trim());
  const dirty = value.trim() !== initial.trim();

  const handleSave = async () => {
    if (!isValid) {
      toast.error("الصيغة غير صحيحة. استخدم أرقاماً فقط مع + اختياري.");
      return;
    }
    setSaving(true);
    const cleaned = value.trim().replace(/\s+/g, "");
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key: "official_phone", value: cleaned, updated_at: new Date().toISOString() });
    if (error) {
      toast.error("تعذّر الحفظ: " + error.message);
      setSaving(false);
      return;
    }
    // Update localStorage so JSON-LD + Footer pick it up instantly across tabs
    if (cleaned) localStorage.setItem(STORAGE_KEY, cleaned);
    else localStorage.removeItem(STORAGE_KEY);
    await refresh();
    setInitial(cleaned);
    setValue(cleaned);
    toast.success(cleaned ? "تم تحديث الرقم في الفوتر و JSON-LD" : "تم مسح الرقم — الفوتر سيعود لزر واتساب");
    setSaving(false);
  };

  const handleReset = () => setValue(initial);

  if (authLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">جاري التحميل...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="glass sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin">
              <Button variant="ghost" size="sm">
                <ArrowRight className="w-4 h-4 ml-1" />
                لوحة التحكم
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-gradient-blue">إعدادات التواصل</h1>
          </div>
        </div>
      </header>

      <main className="container py-10 max-w-2xl space-y-6">
        <section className="card-premium p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">رقم الهاتف الرسمي</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                يظهر فوراً في الفوتر و JSON-LD (telephone) عند الحفظ
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="phone" className="text-sm">الرقم بصيغة دولية (E.164)</Label>
              <Input
                id="phone"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="+20225750000"
                dir="ltr"
                className="mt-2 font-mono text-base"
                disabled={saving}
              />
              <p className="text-xs text-muted-foreground mt-2">
                مثال: <span dir="ltr" className="font-mono">+20225750000</span> · اتركه فارغاً لإخفاء الرقم.
              </p>
              {!isValid && (
                <p className="text-xs text-red-500 mt-1.5">صيغة غير صحيحة — استخدم أرقاماً فقط مع + اختياري في البداية.</p>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button onClick={handleSave} disabled={!dirty || !isValid || saving}>
                <Save className="w-4 h-4 ml-2" />
                {saving ? "جاري الحفظ..." : "حفظ وتحديث الموقع"}
              </Button>
              <Button variant="ghost" onClick={handleReset} disabled={!dirty || saving}>
                <RotateCcw className="w-4 h-4 ml-2" />
                إلغاء
              </Button>
            </div>
          </div>
        </section>

        <section className="card-premium p-6">
          <h3 className="text-sm font-bold text-foreground mb-3">الحالة الحالية</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">يظهر في الفوتر:</dt>
              <dd className="font-mono text-foreground" dir="ltr">{livePhone || "— (واتساب الإدارة)"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">JSON-LD telephone:</dt>
              <dd className="font-mono text-foreground" dir="ltr">{livePhone || "— (محذوف من schema)"}</dd>
            </div>
          </dl>
        </section>
      </main>
    </div>
  );
};

export default AdminContactSettings;
