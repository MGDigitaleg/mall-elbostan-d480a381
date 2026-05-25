import { useEffect, useState } from "react";
import { useRequireMerchant } from "@/hooks/useMerchant";
import { MerchantShell } from "@/components/merchant/MerchantShell";
import { AdminPageHeader, AdminStatusBadge, AdminEmptyState } from "@/components/admin/AdminPrimitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Tag, Pencil, Trash2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

interface Deal {
  id: string;
  title_ar: string;
  is_live: boolean;
  featured: boolean;
  price_current: number | null;
  price_old: number | null;
  offer_badge_ar: string | null;
  image_primary: string | null;
  valid_from: string | null;
  valid_to: string | null;
  description_ar: string | null;
}

export default function MerchantMyOffers() {
  const { loading, activeStore } = useRequireMerchant();
  const [rows, setRows] = useState<Deal[]>([]);
  const [editing, setEditing] = useState<Partial<Deal> | null>(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    if (!activeStore) return;
    const { data } = await supabase
      .from("deals")
      .select("id,title_ar,is_live,featured,price_current,price_old,offer_badge_ar,image_primary,valid_from,valid_to,description_ar")
      .eq("store_id", activeStore.id)
      .order("updated_at", { ascending: false });
    setRows((data ?? []) as Deal[]);
  };

  useEffect(() => { void load(); }, [activeStore?.id]);

  if (loading || !activeStore) {
    return <MerchantShell><div className="text-sm text-muted-foreground">جاري التحميل…</div></MerchantShell>;
  }

  const openNew = () => setEditing({ title_ar: "", is_live: false, featured: false });

  const save = async () => {
    if (!editing?.title_ar) { toast.error("عنوان العرض مطلوب"); return; }
    setBusy(true);
    const payload: any = {
      store_id: activeStore.id,
      title_ar: editing.title_ar,
      description_ar: editing.description_ar || null,
      price_current: editing.price_current ?? null,
      price_old: editing.price_old ?? null,
      offer_badge_ar: editing.offer_badge_ar || null,
      image_primary: editing.image_primary || null,
      valid_from: editing.valid_from || null,
      valid_to: editing.valid_to || null,
      is_live: !!editing.is_live,
      featured: !!editing.featured,
    };
    let err;
    if ((editing as any).id) {
      ({ error: err } = await supabase.from("deals").update(payload).eq("id", (editing as any).id));
    } else {
      ({ error: err } = await supabase.from("deals").insert(payload));
    }
    setBusy(false);
    if (err) { toast.error(err.message); return; }
    toast.success("تم الحفظ");
    setEditing(null);
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm("حذف هذا العرض؟")) return;
    const { error } = await supabase.from("deals").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("تم الحذف");
    await load();
  };

  return (
    <MerchantShell>
      <AdminPageHeader
        title="عروضي"
        subtitle={`إدارة عروض ${activeStore.name_ar}`}
        actions={<Button size="sm" className="gap-1" onClick={openNew}><Plus className="w-4 h-4" /> عرض جديد</Button>}
      />

      {rows.length === 0 ? (
        <AdminEmptyState
          icon={Tag}
          title="لا توجد عروض بعد"
          description="أنشئ أول عرض ليظهر في صفحة العروض اليومية."
          action={<Button onClick={openNew} className="gap-1"><Plus className="w-4 h-4" /> عرض جديد</Button>}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {rows.map((d) => {
            const expired = d.valid_to && new Date(d.valid_to) < new Date();
            return (
              <div key={d.id} className="rounded-xl border border-border bg-card overflow-hidden flex flex-col">
                <div className="aspect-[4/3] bg-secondary relative">
                  {d.image_primary ? <img src={d.image_primary} alt={d.title_ar} className="w-full h-full object-cover" />
                    : <div className="grid place-items-center h-full"><Tag className="w-6 h-6 text-muted-foreground" /></div>}
                  <div className="absolute top-2 right-2 flex flex-col gap-1">
                    <AdminStatusBadge tone={d.is_live && !expired ? "success" : expired ? "danger" : "warning"}>
                      {expired ? "منتهي" : d.is_live ? "حيّ" : "مسودة"}
                    </AdminStatusBadge>
                    {d.featured && <AdminStatusBadge tone="info">مميّز</AdminStatusBadge>}
                  </div>
                </div>
                <div className="p-3 flex-1 flex flex-col">
                  <div className="font-bold text-foreground line-clamp-2">{d.title_ar}</div>
                  <div className="mt-1 text-sm">
                    {d.price_current != null && <span className="font-bold text-primary">{d.price_current} ج.م</span>}
                    {d.price_old != null && <span className="text-muted-foreground line-through mr-2 text-xs">{d.price_old}</span>}
                  </div>
                  <div className="mt-auto pt-3 flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => setEditing(d)} className="gap-1"><Pencil className="w-3.5 h-3.5" /> تعديل</Button>
                    <Button variant="ghost" size="sm" onClick={() => remove(d.id)} className="gap-1"><Trash2 className="w-3.5 h-3.5 text-red-500" /></Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent dir="rtl" className="max-w-2xl">
          <DialogHeader><DialogTitle>{(editing as any)?.id ? "تعديل عرض" : "عرض جديد"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div><Label className="text-xs font-bold">عنوان العرض *</Label>
                <Input value={editing.title_ar ?? ""} onChange={(e) => setEditing({ ...editing, title_ar: e.target.value })} /></div>
              <div><Label className="text-xs font-bold">الوصف</Label>
                <Textarea rows={3} value={editing.description_ar ?? ""} onChange={(e) => setEditing({ ...editing, description_ar: e.target.value })} /></div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div><Label className="text-xs font-bold">السعر الحالي</Label>
                  <Input type="number" value={editing.price_current ?? ""} dir="ltr" onChange={(e) => setEditing({ ...editing, price_current: e.target.value ? Number(e.target.value) : null })} /></div>
                <div><Label className="text-xs font-bold">السعر القديم</Label>
                  <Input type="number" value={editing.price_old ?? ""} dir="ltr" onChange={(e) => setEditing({ ...editing, price_old: e.target.value ? Number(e.target.value) : null })} /></div>
                <div><Label className="text-xs font-bold">نص الشارة</Label>
                  <Input value={editing.offer_badge_ar ?? ""} onChange={(e) => setEditing({ ...editing, offer_badge_ar: e.target.value })} placeholder="خصم ٢٠٪" /></div>
                <div><Label className="text-xs font-bold">رابط الصورة</Label>
                  <Input value={editing.image_primary ?? ""} dir="ltr" onChange={(e) => setEditing({ ...editing, image_primary: e.target.value })} /></div>
                <div><Label className="text-xs font-bold">يبدأ في</Label>
                  <Input type="datetime-local" value={editing.valid_from?.slice(0, 16) ?? ""} dir="ltr" onChange={(e) => setEditing({ ...editing, valid_from: e.target.value || null })} /></div>
                <div><Label className="text-xs font-bold">ينتهي في</Label>
                  <Input type="datetime-local" value={editing.valid_to?.slice(0, 16) ?? ""} dir="ltr" onChange={(e) => setEditing({ ...editing, valid_to: e.target.value || null })} /></div>
              </div>
              <div className="flex items-center gap-4 pt-2 border-t border-border">
                <label className="flex items-center gap-2 text-sm font-bold">
                  <input type="checkbox" checked={!!editing.is_live} onChange={(e) => setEditing({ ...editing, is_live: e.target.checked })} />
                  نشر العرض مباشرة
                </label>
                <label className="flex items-center gap-2 text-sm font-bold">
                  <input type="checkbox" checked={!!editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} />
                  طلب الإدراج كمميّز
                </label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditing(null)}>إلغاء</Button>
            <Button onClick={save} disabled={busy}>{busy ? "جارٍ الحفظ…" : "حفظ"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MerchantShell>
  );
}
