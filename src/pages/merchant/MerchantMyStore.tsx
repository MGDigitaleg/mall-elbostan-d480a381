import { useEffect, useState } from "react";
import { useRequireMerchant } from "@/hooks/useMerchant";
import { MerchantShell } from "@/components/merchant/MerchantShell";
import { AdminPageHeader, AdminStatusBadge } from "@/components/admin/AdminPrimitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Save, Lock } from "lucide-react";
import { LIFECYCLE_META } from "@/lib/storeLifecycle";

export default function MerchantMyStore() {
  const { loading, activeStore, refetch } = useRequireMerchant();
  const [form, setForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (activeStore) {
      setForm({
        display_name: activeStore.name_ar,
        short_description_ar: activeStore.short_description_ar ?? "",
        phone: activeStore.phone ?? "",
        whatsapp: activeStore.whatsapp ?? "",
        hotline: activeStore.hotline ?? "",
        email: activeStore.email ?? "",
        website: activeStore.website ?? "",
        opening_hours: activeStore.opening_hours ?? "",
      });
    }
  }, [activeStore?.id]);

  if (loading || !activeStore || !form) {
    return <MerchantShell><div className="text-sm text-muted-foreground">جاري التحميل…</div></MerchantShell>;
  }

  const setField = (k: string, v: string) => setForm((f: any) => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("stores").update({
      short_description_ar: form.short_description_ar || null,
      phone: form.phone || null,
      whatsapp: form.whatsapp || null,
      hotline: form.hotline || null,
      email: form.email || null,
      website: form.website || null,
      opening_hours: form.opening_hours || null,
    }).eq("id", activeStore.id);
    setSaving(false);
    if (error) { toast.error("تعذر الحفظ: " + error.message); return; }
    toast.success("تم حفظ بيانات المتجر");
    await refetch();
  };

  const lc = LIFECYCLE_META[activeStore.lifecycle_status as keyof typeof LIFECYCLE_META];

  return (
    <MerchantShell>
      <AdminPageHeader
        title="بيانات متجري"
        subtitle="حدّث المعلومات الظاهرة لزوار مول البستان."
        actions={
          <Button onClick={save} disabled={saving} size="sm" className="gap-1">
            <Save className="w-4 h-4" /> {saving ? "جارٍ الحفظ…" : "حفظ"}
          </Button>
        }
      />

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Section title="المعلومات الأساسية">
            <Field label="الاسم المعروض">
              <Input value={form.display_name} disabled />
              <Hint>للتعديل يرجى التواصل مع إدارة المول.</Hint>
            </Field>
            <Field label="وصف مختصر بالعربية">
              <Textarea
                rows={4}
                value={form.short_description_ar}
                onChange={(e) => setField("short_description_ar", e.target.value)}
                placeholder="عرّف الزوار بمتجرك بإيجاز…"
              />
            </Field>
          </Section>

          <Section title="معلومات التواصل">
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="رقم الهاتف"><Input value={form.phone} onChange={(e) => setField("phone", e.target.value)} dir="ltr" /></Field>
              <Field label="واتساب"><Input value={form.whatsapp} onChange={(e) => setField("whatsapp", e.target.value)} dir="ltr" /></Field>
              <Field label="الخط الساخن"><Input value={form.hotline} onChange={(e) => setField("hotline", e.target.value)} dir="ltr" placeholder="مثال: 16280" /></Field>
              <Field label="البريد الإلكتروني"><Input type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} dir="ltr" /></Field>
              <Field label="الموقع الإلكتروني"><Input value={form.website} onChange={(e) => setField("website", e.target.value)} dir="ltr" /></Field>
            </div>
            <Field label="مواعيد العمل">
              <Input value={form.opening_hours} onChange={(e) => setField("opening_hours", e.target.value)} placeholder="مثال: السبت – الخميس 10ص – 11م" />
            </Field>
          </Section>
        </div>

        <aside className="space-y-4">
          <Section title="إعدادات إدارية" icon={<Lock className="w-3.5 h-3.5" />}>
            <ReadOnly label="الفرع" value={activeStore.branch_context ?? "—"} />
            <ReadOnly label="الطابق" value={activeStore.floor_label ?? "—"} />
            <ReadOnly label="رقم الوحدة" value={activeStore.unit_label ?? "—"} />
            <ReadOnly label="التصنيف" value={activeStore.category ?? "—"} />
            <div className="pt-2 border-t border-border">
              <div className="text-[0.7rem] font-bold text-muted-foreground mb-1">حالة الدورة</div>
              <AdminStatusBadge tone={(lc?.tone ?? "neutral") as any}>{lc?.label ?? activeStore.lifecycle_status}</AdminStatusBadge>
              <div className="text-[0.7rem] font-bold text-muted-foreground mt-3 mb-1">حالة النشر</div>
              <AdminStatusBadge tone={activeStore.status === "published" ? "success" : "warning"}>
                {activeStore.status === "published" ? "منشور" : "غير منشور"}
              </AdminStatusBadge>
            </div>
            <Hint>هذه الحقول تُدار من قِبل فريق مول البستان. لطلب أي تغيير، يرجى مراسلتنا.</Hint>
          </Section>
        </aside>
      </div>
    </MerchantShell>
  );
}

function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-3">
      <h2 className="font-bold text-foreground flex items-center gap-1.5">{icon}{title}</h2>
      {children}
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-bold">{label}</Label>
      {children}
    </div>
  );
}
function Hint({ children }: { children: React.ReactNode }) {
  return <p className="text-[0.7rem] text-muted-foreground mt-1">{children}</p>;
}
function ReadOnly({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm border-b border-border/60 pb-1.5 last:border-0">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="font-bold text-foreground">{value}</span>
    </div>
  );
}
