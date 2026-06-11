import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useRequireAdmin } from "@/hooks/useAuth";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminPageHeader, AdminStatusBadge, AdminEmptyState, AdminStatCard } from "@/components/admin/AdminPrimitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel,
  DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { downloadCsv } from "@/lib/csvExport";
import {
  ShoppingBag, Search, Plus, Pencil, Copy, Archive, Star, StarOff,
  Eye, EyeOff, Trash2, ExternalLink, Download, MoreHorizontal, X,
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
  const [storeFilter, setStoreFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [featuredFilter, setFeaturedFilter] = useState<"all" | "featured" | "not">("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const { data: products, isLoading } = useQuery({
    queryKey: ["admin-products-manager"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id,name_ar,name_en,slug,brand,price,status,featured,image_url,store_id,category_id,updated_at")
        .order("updated_at", { ascending: false })
        .limit(800);
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: stores } = useQuery({
    queryKey: ["admin-products-stores"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stores")
        .select("id,name_ar,slug")
        .order("name_ar");
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["admin-products-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_categories")
        .select("id,name_ar")
        .order("name_ar");
      if (error) throw error;
      return data ?? [];
    },
  });

  const storeMap = useMemo(
    () => Object.fromEntries((stores ?? []).map((s) => [s.id, s.name_ar])),
    [stores],
  );
  const categoryMap = useMemo(
    () => Object.fromEntries((categories ?? []).map((c) => [c.id, c.name_ar])),
    [categories],
  );

  const filtered = useMemo(() => {
    let list = products ?? [];
    if (statusFilter !== "all") list = list.filter((p) => p.status === statusFilter);
    if (storeFilter !== "all") list = list.filter((p) => p.store_id === storeFilter);
    if (categoryFilter !== "all") list = list.filter((p) => p.category_id === categoryFilter);
    if (featuredFilter === "featured") list = list.filter((p) => p.featured);
    if (featuredFilter === "not") list = list.filter((p) => !p.featured);
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((p) =>
        [p.name_ar, p.name_en, p.slug, p.brand].filter(Boolean).some((v) => String(v).toLowerCase().includes(q)),
      );
    }
    return list;
  }, [products, search, statusFilter, storeFilter, categoryFilter, featuredFilter]);

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

  const bulkUpdate = async (patch: Record<string, unknown>, label: string) => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    const { error } = await supabase.from("products").update(patch as never).in("id", ids);
    if (error) {
      toast({ title: "خطأ في التعديل الجماعي", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: label, description: `تم تطبيق التغيير على ${ids.length} منتج` });
    setSelected(new Set());
    qc.invalidateQueries({ queryKey: ["admin-products-manager"] });
  };

  const bulkDelete = async () => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    const { error } = await supabase.from("products").delete().in("id", ids);
    if (error) {
      toast({ title: "تعذّر الحذف", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "تم الحذف", description: `حذف ${ids.length} منتج` });
    setSelected(new Set());
    qc.invalidateQueries({ queryKey: ["admin-products-manager"] });
  };

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

  const allOnPageSelected = filtered.length > 0 && filtered.every((p) => selected.has(p.id));
  const toggleAll = () => {
    if (allOnPageSelected) {
      const next = new Set(selected);
      filtered.forEach((p) => next.delete(p.id));
      setSelected(next);
    } else {
      const next = new Set(selected);
      filtered.forEach((p) => next.add(p.id));
      setSelected(next);
    }
  };
  const toggleOne = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const exportSelected = () => {
    const rows = (filtered.length > 0 ? filtered : products ?? []).filter(
      (p) => selected.size === 0 || selected.has(p.id),
    );
    downloadCsv(`products-${new Date().toISOString().slice(0, 10)}.csv`, rows, [
      { header: "id", value: (r) => r.id },
      { header: "name_ar", value: (r) => r.name_ar },
      { header: "slug", value: (r) => r.slug },
      { header: "brand", value: (r) => r.brand ?? "" },
      { header: "price", value: (r) => r.price ?? "" },
      { header: "status", value: (r) => STATUS_LABEL[r.status] ?? r.status },
      { header: "featured", value: (r) => (r.featured ? "نعم" : "لا") },
      { header: "store", value: (r) => storeMap[r.store_id ?? ""] ?? "" },
      { header: "category", value: (r) => categoryMap[r.category_id ?? ""] ?? "" },
      { header: "updated_at", value: (r) => r.updated_at },
    ]);
  };

  if (authLoading) return null;

  return (
    <AdminShell>
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <AdminPageHeader
          title="المنتجات"
          subtitle="إدارة كتالوج المنتجات: النشر، التمييز، النسخ، الأرشفة، والإجراءات الجماعية"
          actions={
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1" onClick={exportSelected}>
                <Download className="w-4 h-4" /> تصدير CSV
              </Button>
              <Link to="/admin/products/legacy">
                <Button size="sm" className="gap-1">
                  <Plus className="w-4 h-4" /> منتج جديد
                </Button>
              </Link>
            </div>
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

            <Select value={storeFilter} onValueChange={setStoreFilter}>
              <SelectTrigger className="w-[160px] h-9"><SelectValue placeholder="المتجر" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل المحلات</SelectItem>
                {(stores ?? []).map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.name_ar}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[160px] h-9"><SelectValue placeholder="الفئة" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الفئات</SelectItem>
                {(categories ?? []).map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name_ar}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={featuredFilter} onValueChange={(v: typeof featuredFilter) => setFeaturedFilter(v)}>
              <SelectTrigger className="w-[140px] h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">التمييز: الكل</SelectItem>
                <SelectItem value="featured">مميّز فقط</SelectItem>
                <SelectItem value="not">غير مميّز</SelectItem>
              </SelectContent>
            </Select>

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

          {selected.size > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-primary/5 border-b border-primary/20">
              <div className="text-sm font-semibold text-foreground">
                محدد: <span className="text-primary">{selected.size}</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Button size="sm" variant="outline" onClick={() => bulkUpdate({ status: "published" }, "نُشر")}>
                  <Eye className="w-3.5 h-3.5 ml-1" /> نشر
                </Button>
                <Button size="sm" variant="outline" onClick={() => bulkUpdate({ status: "draft" }, "إلى مسودة")}>
                  <EyeOff className="w-3.5 h-3.5 ml-1" /> إلغاء نشر
                </Button>
                <Button size="sm" variant="outline" onClick={() => bulkUpdate({ featured: true }, "تمييز")}>
                  <Star className="w-3.5 h-3.5 ml-1" /> تمييز
                </Button>
                <Button size="sm" variant="outline" onClick={() => bulkUpdate({ featured: false }, "إزالة تمييز")}>
                  <StarOff className="w-3.5 h-3.5 ml-1" /> إزالة تمييز
                </Button>
                <Button size="sm" variant="outline" onClick={() => bulkUpdate({ status: "archived" }, "أرشفة")}>
                  <Archive className="w-3.5 h-3.5 ml-1" /> أرشفة
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline" className="gap-1">
                      <MoreHorizontal className="w-3.5 h-3.5" /> المزيد
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>إجراءات جماعية</DropdownMenuLabel>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>تعيين فئة</DropdownMenuSubTrigger>
                      <DropdownMenuSubContent className="max-h-72 overflow-y-auto">
                        {(categories ?? []).map((c) => (
                          <DropdownMenuItem
                            key={c.id}
                            onClick={() => bulkUpdate({ category_id: c.id }, `تعيين فئة: ${c.name_ar}`)}
                          >
                            {c.name_ar}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>تعيين محل</DropdownMenuSubTrigger>
                      <DropdownMenuSubContent className="max-h-72 overflow-y-auto">
                        {(stores ?? []).map((s) => (
                          <DropdownMenuItem
                            key={s.id}
                            onClick={() => bulkUpdate({ store_id: s.id }, `تعيين محل: ${s.name_ar}`)}
                          >
                            {s.name_ar}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={exportSelected}>
                      <Download className="w-4 h-4 ml-2" /> تصدير المحدد CSV
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/5">
                      <Trash2 className="w-3.5 h-3.5 ml-1" /> حذف
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent dir="rtl">
                    <AlertDialogHeader>
                      <AlertDialogTitle>حذف {selected.size} منتج؟</AlertDialogTitle>
                      <AlertDialogDescription>
                        هذا الإجراء غير قابل للتراجع. سيتم حذف المنتجات نهائياً من قاعدة البيانات.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>إلغاء</AlertDialogCancel>
                      <AlertDialogAction onClick={bulkDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        تأكيد الحذف
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>
                  <X className="w-3.5 h-3.5 ml-1" /> إلغاء التحديد
                </Button>
              </div>
            </div>
          )}

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
                    <th className="w-8 px-3 py-2">
                      <Checkbox checked={allOnPageSelected} onCheckedChange={toggleAll} aria-label="تحديد الكل" />
                    </th>
                    <th className="text-right px-3 py-2 font-bold">المنتج</th>
                    <th className="text-right px-3 py-2 font-bold">المحل</th>
                    <th className="text-right px-3 py-2 font-bold">الفئة</th>
                    <th className="text-right px-3 py-2 font-bold">السعر</th>
                    <th className="text-right px-3 py-2 font-bold">الحالة</th>
                    <th className="text-right px-3 py-2 font-bold">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr
                      key={p.id}
                      className={`border-t border-border hover:bg-secondary/30 ${selected.has(p.id) ? "bg-primary/5" : ""}`}
                    >
                      <td className="px-3 py-2">
                        <Checkbox
                          checked={selected.has(p.id)}
                          onCheckedChange={() => toggleOne(p.id)}
                          aria-label={`تحديد ${p.name_ar}`}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-20 h-20 rounded-lg border border-border bg-white overflow-hidden shrink-0 flex items-center justify-center">
                            {p.image_url ? (
                              <img src={p.image_url} alt={p.name_ar} className="w-full h-full object-contain p-1" loading="lazy" />
                            ) : (
                              <span className="text-[0.6rem] text-muted-foreground">لا صورة</span>
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
                      <td className="px-3 py-2 text-muted-foreground text-xs">{storeMap[p.store_id ?? ""] ?? "—"}</td>
                      <td className="px-3 py-2 text-muted-foreground text-xs">{categoryMap[p.category_id ?? ""] ?? "—"}</td>
                      <td className="px-3 py-2 font-semibold">{p.price ? `${p.price} ج.م` : "—"}</td>
                      <td className="px-3 py-2">
                        <AdminStatusBadge tone={STATUS_TONE[p.status] ?? "neutral"}>
                          {STATUS_LABEL[p.status] ?? p.status}
                        </AdminStatusBadge>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1 flex-wrap">
                          <Button
                            size="sm" variant="ghost" className="h-8 px-2"
                            title={p.status === "published" ? "إلغاء النشر" : "نشر"}
                            onClick={() => updateMut.mutate({
                              id: p.id,
                              patch: { status: p.status === "published" ? "draft" : "published" },
                            })}
                          >
                            {p.status === "published" ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                          <Button
                            size="sm" variant="ghost" className="h-8 px-2"
                            title={p.featured ? "إزالة التمييز" : "تمييز"}
                            onClick={() => updateMut.mutate({ id: p.id, patch: { featured: !p.featured } })}
                          >
                            {p.featured ? <StarOff className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                          </Button>
                          <Button
                            size="sm" variant="ghost" className="h-8 px-2"
                            title="نسخ" onClick={() => duplicateMut.mutate(p.id)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm" variant="ghost" className="h-8 px-2"
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
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm" variant="ghost"
                                className="h-8 px-2 text-destructive hover:text-destructive" title="حذف"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent dir="rtl">
                              <AlertDialogHeader>
                                <AlertDialogTitle>حذف {p.name_ar}؟</AlertDialogTitle>
                                <AlertDialogDescription>
                                  لا يمكن التراجع عن هذا الإجراء.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteMut.mutate(p.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  حذف
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
