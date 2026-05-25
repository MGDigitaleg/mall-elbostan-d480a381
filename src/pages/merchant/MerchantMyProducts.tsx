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
import { Plus, Package, Pencil, Trash2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface Product {
  id: string;
  name_ar: string;
  slug: string;
  status: string;
  price: number | null;
  image_url: string | null;
  short_description_ar: string | null;
  brand: string | null;
  featured: boolean;
}

function slugify(s: string) {
  return s.trim().toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/gi, "-").replace(/^-+|-+$/g, "").slice(0, 80) || `p-${Date.now()}`;
}

export default function MerchantMyProducts() {
  const { loading, activeStore } = useRequireMerchant();
  const [rows, setRows] = useState<Product[]>([]);
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);

  const load = async () => {
    if (!activeStore) return;
    const { data } = await supabase
      .from("products")
      .select("id,name_ar,slug,status,price,image_url,short_description_ar,brand,featured")
      .eq("store_id", activeStore.id)
      .order("updated_at", { ascending: false });
    setRows((data ?? []) as Product[]);
  };

  useEffect(() => { void load(); }, [activeStore?.id]);

  if (loading || !activeStore) {
    return <MerchantShell><div className="text-sm text-muted-foreground">جاري التحميل…</div></MerchantShell>;
  }

  const openNew = () => setEditing({ status: "draft", name_ar: "", price: null, featured: false });

  const save = async () => {
    if (!editing?.name_ar) { toast.error("اسم المنتج مطلوب"); return; }
    setBusy(true);
    const payload: any = {
      store_id: activeStore.id,
      name_ar: editing.name_ar,
      slug: editing.slug || slugify(editing.name_ar),
      short_description_ar: editing.short_description_ar || null,
      brand: editing.brand || null,
      price: editing.price ?? null,
      image_url: editing.image_url || null,
      status: editing.status || "draft",
      featured: !!editing.featured,
    };
    let err;
    if ((editing as any).id) {
      ({ error: err } = await supabase.from("products").update(payload).eq("id", (editing as any).id));
    } else {
      ({ error: err } = await supabase.from("products").insert(payload));
    }
    setBusy(false);
    if (err) { toast.error(err.message); return; }
    toast.success("تم الحفظ");
    setEditing(null);
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm("حذف هذا المنتج نهائياً؟")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("تم الحذف");
    await load();
  };

  return (
    <MerchantShell>
      <AdminPageHeader
        title="منتجاتي"
        subtitle={`إدارة منتجات ${activeStore.name_ar}`}
        actions={<Button size="sm" className="gap-1" onClick={openNew}><Plus className="w-4 h-4" /> منتج جديد</Button>}
      />

      {rows.length === 0 ? (
        <AdminEmptyState
          icon={Package}
          title="لا توجد منتجات بعد"
          description="ابدأ بإضافة منتجاتك ليراها زوار مول البستان."
          action={<Button onClick={openNew} className="gap-1"><Plus className="w-4 h-4" /> منتج جديد</Button>}
        />
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-xs">
              <tr>
                <th className="text-right p-3">المنتج</th>
                <th className="text-right p-3">السعر</th>
                <th className="text-right p-3">الحالة</th>
                <th className="text-right p-3"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name_ar} className="w-10 h-10 rounded-md object-cover bg-secondary" />
                      ) : (
                        <div className="w-10 h-10 rounded-md bg-secondary grid place-items-center"><Package className="w-4 h-4 text-muted-foreground" /></div>
                      )}
                      <div>
                        <div className="font-bold text-foreground">{p.name_ar}</div>
                        <div className="text-xs text-muted-foreground">{p.brand ?? "—"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">{p.price != null ? `${p.price} ج.م` : "—"}</td>
                  <td className="p-3">
                    <AdminStatusBadge tone={p.status === "published" ? "success" : "warning"}>
                      {p.status === "published" ? "منشور" : p.status === "draft" ? "مسودة" : p.status}
                    </AdminStatusBadge>
                    {p.featured && <span className="mr-2"><AdminStatusBadge tone="info">مميّز</AdminStatusBadge></span>}
                  </td>
                  <td className="p-3 text-left">
                    <Button variant="ghost" size="sm" onClick={() => setEditing(p)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => remove(p.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent dir="rtl" className="max-w-2xl">
          <DialogHeader><DialogTitle>{(editing as any)?.id ? "تعديل منتج" : "منتج جديد"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <div><Label className="text-xs font-bold">اسم المنتج *</Label>
                  <Input value={editing.name_ar ?? ""} onChange={(e) => setEditing({ ...editing, name_ar: e.target.value })} /></div>
                <div><Label className="text-xs font-bold">العلامة التجارية</Label>
                  <Input value={editing.brand ?? ""} onChange={(e) => setEditing({ ...editing, brand: e.target.value })} /></div>
                <div><Label className="text-xs font-bold">السعر (ج.م)</Label>
                  <Input type="number" value={editing.price ?? ""} onChange={(e) => setEditing({ ...editing, price: e.target.value ? Number(e.target.value) : null })} dir="ltr" /></div>
                <div><Label className="text-xs font-bold">رابط الصورة</Label>
                  <Input value={editing.image_url ?? ""} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} dir="ltr" placeholder="https://…" /></div>
              </div>
              <div><Label className="text-xs font-bold">وصف مختصر</Label>
                <Textarea rows={3} value={editing.short_description_ar ?? ""} onChange={(e) => setEditing({ ...editing, short_description_ar: e.target.value })} /></div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div><Label className="text-xs font-bold">حالة النشر</Label>
                  <Select value={editing.status ?? "draft"} onValueChange={(v) => setEditing({ ...editing, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">مسودة</SelectItem>
                      <SelectItem value="published">منشور</SelectItem>
                      <SelectItem value="archived">مؤرشف</SelectItem>
                    </SelectContent>
                  </Select></div>
                <div className="flex items-end gap-2">
                  <label className="flex items-center gap-2 text-sm font-bold">
                    <input type="checkbox" checked={!!editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} />
                    طلب الإدراج كمميّز
                  </label>
                </div>
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
