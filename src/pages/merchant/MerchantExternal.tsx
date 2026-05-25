import { useEffect, useState } from "react";
import { useRequireMerchant } from "@/hooks/useMerchant";
import { MerchantShell } from "@/components/merchant/MerchantShell";
import { AdminPageHeader, AdminStatusBadge } from "@/components/admin/AdminPrimitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Save, Plug } from "lucide-react";

const TYPES: Array<{ value: string; label: string }> = [
  { value: "none", label: "بدون متجر خارجي" },
  { value: "shopify", label: "Shopify" },
  { value: "woocommerce", label: "WooCommerce" },
  { value: "manual_catalog", label: "كتالوج يدوي" },
  { value: "custom_website", label: "موقع مخصص" },
];

export default function MerchantExternal() {
  const { loading, activeStore, refetch } = useRequireMerchant();
  const [form, setForm] = useState<any>(null);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (activeStore) {
      setForm({
        external_store_type: activeStore.external_store_type ?? "none",
        external_store_url: activeStore.external_store_url ?? "",
        external_store_handle: activeStore.external_store_handle ?? "",
      });
    }
  }, [activeStore?.id]);

  if (loading || !activeStore || !form) {
    return <MerchantShell><div className="text-sm text-muted-foreground">جاري التحميل…</div></MerchantShell>;
  }

  const save = async () => {
    setBusy(true);
    const { error } = await supabase.from("stores").update({
      external_store_type: form.external_store_type,
      external_store_url: form.external_store_url || null,
      external_store_handle: form.external_store_handle || null,
    }).eq("id", activeStore.id);
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("تم حفظ إعدادات المتجر الخارجي");
    await refetch();
  };

  return (
    <MerchantShell>
      <AdminPageHeader
        title="المتجر الخارجي"
        subtitle="اربط متجرك على Shopify أو WooCommerce أو موقعك الخاص ليتمكن زوار البستان من الانتقال إليه."
        actions={<Button onClick={save} disabled={busy} size="sm" className="gap-1"><Save className="w-4 h-4" /> حفظ</Button>}
      />

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 space-y-3">
          <div>
            <Label className="text-xs font-bold">نوع المتجر الخارجي</Label>
            <Select value={form.external_store_type} onValueChange={(v) => setForm({ ...form, external_store_type: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          {form.external_store_type !== "none" && (
            <>
              <div>
                <Label className="text-xs font-bold">رابط المتجر / الموقع</Label>
                <Input dir="ltr" value={form.external_store_url} onChange={(e) => setForm({ ...form, external_store_url: e.target.value })} placeholder="https://yourstore.com" />
              </div>
              <div>
                <Label className="text-xs font-bold">المعرّف / الـ Handle (اختياري)</Label>
                <Input dir="ltr" value={form.external_store_handle} onChange={(e) => setForm({ ...form, external_store_handle: e.target.value })} placeholder="my-shop" />
              </div>
              <div>
                <Label className="text-xs font-bold">ملاحظات لفريق المول (اختياري)</Label>
                <Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="مثلاً: تفاصيل تقنية أو طلب مزامنة" />
              </div>
            </>
          )}
        </div>

        <aside className="rounded-xl border border-border bg-card p-5 space-y-3">
          <div className="flex items-center gap-2"><Plug className="w-4 h-4 text-primary" /><h3 className="font-bold">حالة الاتصال</h3></div>
          <div className="text-sm flex items-center justify-between border-b border-border/60 pb-2">
            <span className="text-muted-foreground">النوع الحالي</span>
            <AdminStatusBadge tone={activeStore.external_store_type !== "none" ? "success" : "neutral"}>
              {TYPES.find((t) => t.value === activeStore.external_store_type)?.label ?? activeStore.external_store_type}
            </AdminStatusBadge>
          </div>
          <div className="text-sm flex items-center justify-between border-b border-border/60 pb-2">
            <span className="text-muted-foreground">المزامنة</span>
            <AdminStatusBadge tone={activeStore.sync_status === "ok" ? "success" : activeStore.sync_status === "error" ? "danger" : "neutral"}>
              {activeStore.sync_status || "idle"}
            </AdminStatusBadge>
          </div>
          <p className="text-[0.72rem] text-muted-foreground">
            ربط حسابات المزامنة الكاملة (Shopify Admin API … إلخ) يتم من قِبل فريق المول. أنت تستطيع تحديث الرابط العام فقط.
          </p>
        </aside>
      </div>
    </MerchantShell>
  );
}
