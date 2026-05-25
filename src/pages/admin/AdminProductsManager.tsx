import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useRequireAdmin } from "@/hooks/useAuth";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminPageHeader, AdminStatusBadge, AdminEmptyState, AdminStatCard } from "@/components/admin/AdminPrimitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  ShoppingBag, Search, Plus, Pencil, Copy, Archive, Star, StarOff,
  Eye, EyeOff, Trash2, ExternalLink,
} from "lucide-react";

type Status = "draft" | "published" | "archived" | "hidden";

const STATUS_TONE: Record<string, "success" | "warning" | "neutral" | "info"> = {
  published: "success",
  draft: "warning",
  archived: "neutral",
  hidden: "neutral",
};

const STATUS_LABEL: Record<string, string> = {
  published: "منشور",
  draft: "مسودة",
  archived: "مؤرشف",
  hidden: "مخفي",
};

export default function AdminProductsManager() {
  const { loading: authLoading } = useRequireAdmin();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");

  const { data: products, isLoading } = useQuery({
    queryKey: ["admin-products-manager"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id,name_ar,name_en,slug,brand,price,status,featured,image_url,store_id,updated_at")
        .order("updated_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      return data ?? [];
    },
  });

  const filtered = useMemo(() => {
    let list = products ?? [];
    if (statusFilter !== "all") list = list.filter((p) => p.status === statusFilter);
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((p) =>
        [p.name_ar, p.name_en, p.slug, p.brand].filter(Boolean).some((v) => String(v).toLowerCase().includes(q)),
      );
    }
    return list;
  }, [products, search, statusFilter]);

  const counts = useMemo(() => {
    const c = { all: products?.length ?? 0, published: 0, draft: 0, archived: 0, featured: 0 };
    (products ?? []).forEach((p) => {
      if (p.status === "published") c.published++;
      if (p.status === "draft") c.draft++;
      if (p.status === "archived") c.archived++;
      if (p.featured) c.featured++;
    });
    return c;
  }, [products]);

  const updateMut = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Record<string, unknown> }) => {
      const { error } = await supabase.from("products").update(patch as never).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products-manager"] });
      toast({ title: "تم التحديث" });
    },
    onError: (e: Error) => toast({ title: "خطأ", description: e.message, variant: "destructive" }),
  });

  const duplicateMut = useMutation({
    mutationFn: async (id: string) => {
      const { data: src, error: e1 } = await supabase.from("products").select("*").eq("id", id).single();
      if (e1 || !src) throw e1 ?? new Error("not found");
      const { id: _id, created_at, updated_at, ...rest } = src as Record<string, unknown>;
      const copy = {
        ...rest,
        name_ar: `${rest.name_ar} (نسخة)`,
        slug: `${rest.slug}-copy-${Date.now().toString(36)}`,
        status: "draft",
        featured: false,
      };
      const { error } = await supabase.from("products").insert(copy as never);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products-manager"] });
      toast({ title: "تم النسخ كمسودة" });
    },
    onError: (e: Error) => toast({ title: "خطأ", description: e.message, variant: "destructive" }),
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products-manager"] });
      toast({ title: "تم الحذف" });
    },
    onError: (e: Error) => toast({ title: "خطأ", description: e.message, variant: "destructive" }),
  });

  if (authLoading) return null;

  return (
    <AdminShell>
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <AdminPageHeader
          title="المنتجات"
          subtitle="إدارة كتالوج المنتجات: النشر، التمييز، النسخ، والأرشفة"
          actions={
            <Link to="/admin/products/legacy">
              <Button variant="outline" size="sm" className="gap-1">
                <Plus className="w-4 h-4" /> منتج جديد
              </Button>
            </Link>
          }
        />

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
          <AdminStatCard label="إجمالي" value={counts.all} icon={ShoppingBag} loading={isLoading} />
          <AdminStatCard label="منشورة" value={counts.published} tone="success" loading={isLoading} />
          <AdminStatCard label="مسودات" value={counts.draft} tone="warning" loading={isLoading} />
          <AdminStatCard label="مؤرشفة" value={counts.archived} loading={isLoading} />
          <AdminStatCard label="مميّزة" value={counts.featured} tone="info" loading={isLoading} />
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="flex flex-wrap items-center gap-2 p-3 border-b border-border">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="بحث بالاسم، slug، أو العلامة..."
                className="pr-9"
              />
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              {(["all", "published", "draft", "archived", "hidden"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${
                    statusFilter === s
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-secondary text-foreground border-border hover:bg-secondary/70"
                  }`}
                >
                  {s === "all" ? "الكل" : STATUS_LABEL[s]}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">جارٍ التحميل…</div>
          ) : filtered.length === 0 ? (
            <div className="p-6">
              <AdminEmptyState
                icon={ShoppingBag}
                title="لا توجد منتجات مطابقة"
                description="جرّب تغيير عوامل التصفية أو أضف منتجاً جديداً."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/40 text-xs text-muted-foreground">
                  <tr>
                    <th className="text-right px-3 py-2 font-bold">المنتج</th>
                    <th className="text-right px-3 py-2 font-bold">العلامة</th>
                    <th className="text-right px-3 py-2 font-bold">السعر</th>
                    <th className="text-right px-3 py-2 font-bold">الحالة</th>
                    <th className="text-right px-3 py-2 font-bold">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id} className="border-t border-border hover:bg-secondary/30">
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-9 h-9 rounded-md bg-secondary overflow-hidden shrink-0">
                            {p.image_url && (
                              <img src={p.image_url} alt="" className="w-full h-full object-cover" loading="lazy" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-foreground truncate flex items-center gap-1">
                              {p.featured && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
                              {p.name_ar}
                            </div>
                            <div className="text-[0.7rem] text-muted-foreground truncate">{p.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">{p.brand ?? "—"}</td>
                      <td className="px-3 py-2 font-semibold">{p.price ? `${p.price} ج.م` : "—"}</td>
                      <td className="px-3 py-2">
                        <AdminStatusBadge tone={STATUS_TONE[p.status] ?? "neutral"}>
                          {STATUS_LABEL[p.status] ?? p.status}
                        </AdminStatusBadge>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1 flex-wrap">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 px-2"
                            title={p.status === "published" ? "إلغاء النشر" : "نشر"}
                            onClick={() =>
                              updateMut.mutate({
                                id: p.id,
                                patch: { status: p.status === "published" ? "draft" : "published" },
                              })
                            }
                          >
                            {p.status === "published" ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 px-2"
                            title={p.featured ? "إزالة التمييز" : "تمييز"}
                            onClick={() => updateMut.mutate({ id: p.id, patch: { featured: !p.featured } })}
                          >
                            {p.featured ? <StarOff className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 px-2"
                            title="نسخ"
                            onClick={() => duplicateMut.mutate(p.id)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 px-2"
                            title="أرشفة"
                            onClick={() => updateMut.mutate({ id: p.id, patch: { status: "archived" } })}
                          >
                            <Archive className="w-4 h-4" />
                          </Button>
                          <Link to={`/admin/products/legacy`} title="تحرير">
                            <Button size="sm" variant="ghost" className="h-8 px-2">
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </Link>
                          {p.status === "published" && p.slug && (
                            <a href={`/products/${p.slug}`} target="_blank" rel="noreferrer" title="معاينة">
                              <Button size="sm" variant="ghost" className="h-8 px-2">
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            </a>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 px-2 text-destructive hover:text-destructive"
                            title="حذف"
                            onClick={() => {
                              if (confirm(`حذف ${p.name_ar}؟`)) deleteMut.mutate(p.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
