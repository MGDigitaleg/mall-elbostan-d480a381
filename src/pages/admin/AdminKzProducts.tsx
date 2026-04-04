import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useRequireAdmin } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { ArrowRight, Plus, Pencil, Trash2, Search, Eye, Package, Image as ImageIcon, ChevronDown, ChevronUp, ExternalLink, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

/* ── Types ── */
interface KzProduct {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  brand: string | null;
  category_id: string | null;
  product_type: string | null;
  condition: string | null;
  status: string;
  featured: boolean;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  kz_categories?: { name: string; slug: string } | null;
  kz_product_variants?: KzVariant[];
  kz_product_images?: KzImage[];
}

interface KzVariant {
  id: string;
  sku: string | null;
  price: number;
  compare_price: number | null;
  stock_qty: number;
  ram: string | null;
  storage: string | null;
  processor: string | null;
  color: string | null;
  variant_name: string | null;
  is_default: boolean;
}

interface KzImage {
  id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
}

interface KzCategory {
  id: string;
  name: string;
  slug: string;
}

/* ── Helpers ── */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/* ── Main Component ── */
const AdminKzProducts = () => {
  const { loading: authLoading } = useRequireAdmin();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<KzProduct | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  /* ── Product form state ── */
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formBrand, setFormBrand] = useState("");
  const [formCategoryId, setFormCategoryId] = useState("");
  const [formProductType, setFormProductType] = useState("");
  const [formCondition, setFormCondition] = useState("new");
  const [formStatus, setFormStatus] = useState("published");
  const [formFeatured, setFormFeatured] = useState(false);
  const [formDescription, setFormDescription] = useState("");
  const [formShortDesc, setFormShortDesc] = useState("");
  const [formSeoTitle, setFormSeoTitle] = useState("");
  const [formSeoDesc, setFormSeoDesc] = useState("");

  /* ── Variant form state ── */
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [editVariant, setEditVariant] = useState<KzVariant | null>(null);
  const [variantProductId, setVariantProductId] = useState("");
  const [vSku, setVSku] = useState("");
  const [vPrice, setVPrice] = useState("");
  const [vCompare, setVCompare] = useState("");
  const [vStock, setVStock] = useState("0");
  const [vRam, setVRam] = useState("");
  const [vStorage, setVStorage] = useState("");
  const [vProcessor, setVProcessor] = useState("");
  const [vColor, setVColor] = useState("");
  const [vName, setVName] = useState("");
  const [vDefault, setVDefault] = useState(false);

  /* ── Image form state ── */
  const [showImageForm, setShowImageForm] = useState(false);
  const [imageProductId, setImageProductId] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [imgAlt, setImgAlt] = useState("");
  const [imgSort, setImgSort] = useState("0");

  /* ── Queries ── */
  const { data: categories } = useQuery({
    queryKey: ["kz-admin-categories"],
    queryFn: async () => {
      const { data } = await supabase.from("kz_categories").select("id, name, slug").order("sort_order");
      return (data ?? []) as KzCategory[];
    },
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ["kz-admin-products"],
    queryFn: async () => {
      const { data } = await supabase
        .from("kz_products")
        .select("*, kz_categories(name, slug), kz_product_variants(*), kz_product_images(*)")
        .order("created_at", { ascending: false });
      return (data ?? []) as KzProduct[];
    },
  });

  const filtered = useMemo(() => {
    if (!products) return [];
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) => p.title.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q) || p.slug.includes(q)
    );
  }, [products, search]);

  /* ── Mutations ── */
  const saveProductMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title: formTitle,
        slug: formSlug || slugify(formTitle),
        brand: formBrand || null,
        category_id: formCategoryId || null,
        product_type: formProductType || null,
        condition: formCondition || "new",
        status: formStatus,
        featured: formFeatured,
        description: formDescription || null,
        short_description: formShortDesc || null,
        seo_title: formSeoTitle || null,
        seo_description: formSeoDesc || null,
      };
      if (editProduct) {
        const { error } = await supabase.from("kz_products").update(payload).eq("id", editProduct.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("kz_products").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kz-admin-products"] });
      setShowForm(false);
      toast({ title: "تم حفظ المنتج" });
    },
    onError: (e) => toast({ title: "خطأ", description: String(e), variant: "destructive" }),
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("kz_products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kz-admin-products"] });
      toast({ title: "تم حذف المنتج" });
    },
  });

  const saveVariantMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        product_id: variantProductId,
        sku: vSku || null,
        price: Number(vPrice) || 0,
        compare_price: vCompare ? Number(vCompare) : null,
        stock_qty: Number(vStock) || 0,
        ram: vRam || null,
        storage: vStorage || null,
        processor: vProcessor || null,
        color: vColor || null,
        variant_name: vName || null,
        is_default: vDefault,
      };
      if (editVariant) {
        const { error } = await supabase.from("kz_product_variants").update(payload).eq("id", editVariant.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("kz_product_variants").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kz-admin-products"] });
      setShowVariantForm(false);
      toast({ title: "تم حفظ المتغير" });
    },
    onError: (e) => toast({ title: "خطأ", description: String(e), variant: "destructive" }),
  });

  const deleteVariantMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("kz_product_variants").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kz-admin-products"] });
      toast({ title: "تم حذف المتغير" });
    },
  });

  const saveImageMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("kz_product_images").insert({
        product_id: imageProductId,
        image_url: imgUrl,
        alt_text: imgAlt || null,
        sort_order: Number(imgSort) || 0,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kz-admin-products"] });
      setShowImageForm(false);
      toast({ title: "تم إضافة الصورة" });
    },
    onError: (e) => toast({ title: "خطأ", description: String(e), variant: "destructive" }),
  });

  const deleteImageMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("kz_product_images").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kz-admin-products"] });
      toast({ title: "تم حذف الصورة" });
    },
  });

  /* ── Helpers ── */
  const openProductForm = (product?: KzProduct) => {
    if (product) {
      setEditProduct(product);
      setFormTitle(product.title);
      setFormSlug(product.slug);
      setFormBrand(product.brand ?? "");
      setFormCategoryId(product.category_id ?? "");
      setFormProductType(product.product_type ?? "");
      setFormCondition(product.condition ?? "new");
      setFormStatus(product.status);
      setFormFeatured(product.featured);
      setFormDescription(product.description ?? "");
      setFormShortDesc(product.short_description ?? "");
      setFormSeoTitle(product.seo_title ?? "");
      setFormSeoDesc(product.seo_description ?? "");
    } else {
      setEditProduct(null);
      setFormTitle(""); setFormSlug(""); setFormBrand(""); setFormCategoryId("");
      setFormProductType(""); setFormCondition("new"); setFormStatus("published");
      setFormFeatured(false); setFormDescription(""); setFormShortDesc("");
      setFormSeoTitle(""); setFormSeoDesc("");
    }
    setShowForm(true);
  };

  const openVariantForm = (productId: string, variant?: KzVariant) => {
    setVariantProductId(productId);
    if (variant) {
      setEditVariant(variant);
      setVSku(variant.sku ?? ""); setVPrice(String(variant.price)); setVCompare(variant.compare_price ? String(variant.compare_price) : "");
      setVStock(String(variant.stock_qty)); setVRam(variant.ram ?? ""); setVStorage(variant.storage ?? "");
      setVProcessor(variant.processor ?? ""); setVColor(variant.color ?? ""); setVName(variant.variant_name ?? "");
      setVDefault(variant.is_default);
    } else {
      setEditVariant(null);
      setVSku(""); setVPrice(""); setVCompare(""); setVStock("0"); setVRam(""); setVStorage("");
      setVProcessor(""); setVColor(""); setVName(""); setVDefault(false);
    }
    setShowVariantForm(true);
  };

  const openImageForm = (productId: string) => {
    setImageProductId(productId);
    setImgUrl(""); setImgAlt(""); setImgSort("0");
    setShowImageForm(true);
  };

  if (authLoading) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="text-primary hover:underline"><ArrowRight className="w-5 h-5" /></Link>
            <h1 className="text-xl font-bold text-foreground">منتجات Kasr Zero</h1>
            <Badge variant="secondary" className="text-[0.65rem]">{filtered.length} منتج</Badge>
          </div>
          <Button variant="cta" size="sm" onClick={() => openProductForm()}>
            <Plus className="w-4 h-4 ml-1" /> إضافة منتج
          </Button>
        </div>
      </header>

      <main className="container py-6">
        {/* Search */}
        <div className="relative mb-5 max-w-md">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="ابحث بالاسم أو الماركة..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-10 bg-secondary border-border"
          />
        </div>

        {/* Products list */}
        {isLoading ? (
          <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}</div>
        ) : (
          <div className="space-y-2">
            {filtered.map((product) => {
              const defaultVariant = product.kz_product_variants?.find((v) => v.is_default) ?? product.kz_product_variants?.[0];
              const variantCount = product.kz_product_variants?.length ?? 0;
              const imageCount = product.kz_product_images?.length ?? 0;
              const isExpanded = expandedId === product.id;

              return (
                <div key={product.id} className="rounded-xl border border-border bg-card overflow-hidden">
                  {/* Product row */}
                  <div className="flex items-center gap-3 p-3 cursor-pointer hover:bg-secondary/50 transition-colors" onClick={() => setExpandedId(isExpanded ? null : product.id)}>
                    {/* Thumbnail */}
                    <div className="h-12 w-12 shrink-0 rounded-lg border border-border bg-white overflow-hidden">
                      {product.kz_product_images?.[0] ? (
                        <img src={product.kz_product_images[0].image_url} alt="" className="h-full w-full object-contain p-0.5" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center"><Package className="h-5 w-5 text-muted-foreground/20" /></div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[0.82rem] font-bold text-foreground truncate">{product.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {product.brand && <span className="text-[0.68rem] text-muted-foreground">{product.brand}</span>}
                        {product.kz_categories && <Badge variant="outline" className="text-[0.6rem] py-0">{product.kz_categories.name}</Badge>}
                        <Badge variant={product.status === "published" ? "default" : "secondary"} className="text-[0.6rem] py-0">{product.status === "published" ? "منشور" : "مسودة"}</Badge>
                        {product.featured && <Badge className="text-[0.6rem] py-0 bg-amber-500/10 text-amber-600 border-amber-500/20">مميز</Badge>}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="hidden sm:flex items-center gap-3 text-[0.72rem] text-muted-foreground">
                      <span>{variantCount} متغير</span>
                      <span>{imageCount} صورة</span>
                      {defaultVariant && <span className="font-bold text-foreground">{Number(defaultVariant.price).toLocaleString("ar-EG")} ج.م</span>}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); openProductForm(product); }}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Link to={`/kz/products/${product.slug}`} target="_blank" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-3.5 w-3.5" /></Button>
                      </Link>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); if (confirm("حذف المنتج وجميع متغيراته وصوره؟")) deleteProductMutation.mutate(product.id); }}>
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  </div>

                  {/* Expanded: Variants + Images */}
                  {isExpanded && (
                    <div className="border-t border-border bg-secondary/30 p-4 space-y-4">
                      {/* Variants */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-[0.78rem] font-bold text-foreground">المتغيرات ({variantCount})</p>
                          <Button variant="outline" size="sm" className="h-7 text-[0.7rem] gap-1" onClick={() => openVariantForm(product.id)}>
                            <Plus className="h-3 w-3" /> إضافة متغير
                          </Button>
                        </div>
                        {product.kz_product_variants && product.kz_product_variants.length > 0 ? (
                          <div className="space-y-1.5">
                            {product.kz_product_variants.map((v) => (
                              <div key={v.id} className="flex items-center gap-3 rounded-lg border border-border bg-card p-2.5 text-[0.76rem]">
                                <div className="flex-1 min-w-0">
                                  <span className="font-semibold text-foreground">
                                    {v.variant_name || [v.ram, v.storage, v.processor, v.color].filter(Boolean).join(" / ") || v.sku || "افتراضي"}
                                  </span>
                                  {v.is_default && <Badge variant="outline" className="mr-2 text-[0.55rem] py-0">افتراضي</Badge>}
                                </div>
                                <span className="font-bold text-foreground">{Number(v.price).toLocaleString("ar-EG")} ج.م</span>
                                {v.compare_price && <span className="text-muted-foreground line-through text-[0.68rem]">{Number(v.compare_price).toLocaleString("ar-EG")}</span>}
                                <span className="text-muted-foreground">مخزون: {v.stock_qty}</span>
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openVariantForm(product.id, v)}><Pencil className="h-3 w-3" /></Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteVariantMutation.mutate(v.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[0.72rem] text-muted-foreground">لا توجد متغيرات</p>
                        )}
                      </div>

                      {/* Images */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-[0.78rem] font-bold text-foreground">الصور ({imageCount})</p>
                          <Button variant="outline" size="sm" className="h-7 text-[0.7rem] gap-1" onClick={() => openImageForm(product.id)}>
                            <Plus className="h-3 w-3" /> إضافة صورة
                          </Button>
                        </div>
                        {product.kz_product_images && product.kz_product_images.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {product.kz_product_images.sort((a, b) => a.sort_order - b.sort_order).map((img) => (
                              <div key={img.id} className="group relative h-16 w-16 rounded-lg border border-border bg-white overflow-hidden">
                                <img src={img.image_url} alt={img.alt_text ?? ""} className="h-full w-full object-contain p-0.5" />
                                <button
                                  onClick={() => deleteImageMutation.mutate(img.id)}
                                  className="absolute inset-0 flex items-center justify-center bg-destructive/80 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Trash2 className="h-4 w-4 text-white" />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[0.72rem] text-muted-foreground">لا توجد صور</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">لا توجد منتجات</p>}
          </div>
        )}
      </main>

      {/* ── Product Dialog ── */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-card border-border max-h-[85vh] overflow-y-auto max-w-lg">
          <DialogHeader><DialogTitle>{editProduct ? "تعديل منتج" : "إضافة منتج جديد"}</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); saveProductMutation.mutate(); }} className="space-y-3">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">العنوان *</label>
              <Input value={formTitle} onChange={(e) => { setFormTitle(e.target.value); if (!editProduct) setFormSlug(slugify(e.target.value)); }} className="bg-secondary border-border" required />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Slug</label>
              <Input value={formSlug} onChange={(e) => setFormSlug(e.target.value)} className="bg-secondary border-border" dir="ltr" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">الماركة</label>
                <Input value={formBrand} onChange={(e) => setFormBrand(e.target.value)} className="bg-secondary border-border" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">التصنيف</label>
                <select value={formCategoryId} onChange={(e) => setFormCategoryId(e.target.value)} className="h-9 w-full rounded-md border border-border bg-secondary px-3 text-sm">
                  <option value="">بدون تصنيف</option>
                  {categories?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">النوع</label>
                <Input value={formProductType} onChange={(e) => setFormProductType(e.target.value)} className="bg-secondary border-border" placeholder="laptop" dir="ltr" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">الحالة</label>
                <select value={formCondition} onChange={(e) => setFormCondition(e.target.value)} className="h-9 w-full rounded-md border border-border bg-secondary px-3 text-sm">
                  <option value="new">جديد</option>
                  <option value="used">مستعمل</option>
                  <option value="refurbished">مجدد</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">الحالة</label>
                <select value={formStatus} onChange={(e) => setFormStatus(e.target.value)} className="h-9 w-full rounded-md border border-border bg-secondary px-3 text-sm">
                  <option value="published">منشور</option>
                  <option value="draft">مسودة</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={formFeatured} onChange={(e) => setFormFeatured(e.target.checked)} id="featured" className="rounded" />
              <label htmlFor="featured" className="text-sm text-foreground">منتج مميز</label>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">وصف قصير</label>
              <Input value={formShortDesc} onChange={(e) => setFormShortDesc(e.target.value)} className="bg-secondary border-border" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">الوصف الكامل</label>
              <Textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} className="bg-secondary border-border min-h-[100px]" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">عنوان SEO</label>
              <Input value={formSeoTitle} onChange={(e) => setFormSeoTitle(e.target.value)} className="bg-secondary border-border" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">وصف SEO</label>
              <Input value={formSeoDesc} onChange={(e) => setFormSeoDesc(e.target.value)} className="bg-secondary border-border" />
            </div>
            <Button type="submit" variant="cta" className="w-full" disabled={saveProductMutation.isPending}>
              {saveProductMutation.isPending ? "جاري الحفظ..." : "حفظ المنتج"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Variant Dialog ── */}
      <Dialog open={showVariantForm} onOpenChange={setShowVariantForm}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader><DialogTitle>{editVariant ? "تعديل متغير" : "إضافة متغير"}</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); saveVariantMutation.mutate(); }} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">السعر *</label>
                <Input type="number" value={vPrice} onChange={(e) => setVPrice(e.target.value)} className="bg-secondary border-border" dir="ltr" required />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">سعر المقارنة</label>
                <Input type="number" value={vCompare} onChange={(e) => setVCompare(e.target.value)} className="bg-secondary border-border" dir="ltr" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">SKU</label>
                <Input value={vSku} onChange={(e) => setVSku(e.target.value)} className="bg-secondary border-border" dir="ltr" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">المخزون</label>
                <Input type="number" value={vStock} onChange={(e) => setVStock(e.target.value)} className="bg-secondary border-border" dir="ltr" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">RAM</label>
                <Input value={vRam} onChange={(e) => setVRam(e.target.value)} className="bg-secondary border-border" dir="ltr" placeholder="8 GB" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">التخزين</label>
                <Input value={vStorage} onChange={(e) => setVStorage(e.target.value)} className="bg-secondary border-border" dir="ltr" placeholder="256 GB" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">المعالج</label>
                <Input value={vProcessor} onChange={(e) => setVProcessor(e.target.value)} className="bg-secondary border-border" dir="ltr" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">اللون</label>
                <Input value={vColor} onChange={(e) => setVColor(e.target.value)} className="bg-secondary border-border" />
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">اسم المتغير</label>
              <Input value={vName} onChange={(e) => setVName(e.target.value)} className="bg-secondary border-border" placeholder="8 GB / 256 GB" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={vDefault} onChange={(e) => setVDefault(e.target.checked)} id="vdefault" className="rounded" />
              <label htmlFor="vdefault" className="text-sm text-foreground">متغير افتراضي</label>
            </div>
            <Button type="submit" variant="cta" className="w-full" disabled={saveVariantMutation.isPending}>
              {saveVariantMutation.isPending ? "جاري الحفظ..." : "حفظ المتغير"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Image Dialog ── */}
      <Dialog open={showImageForm} onOpenChange={setShowImageForm}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader><DialogTitle>إضافة صورة</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); saveImageMutation.mutate(); }} className="space-y-3">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">رابط الصورة *</label>
              <Input value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} className="bg-secondary border-border" dir="ltr" required placeholder="https://..." />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">النص البديل</label>
              <Input value={imgAlt} onChange={(e) => setImgAlt(e.target.value)} className="bg-secondary border-border" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">الترتيب</label>
              <Input type="number" value={imgSort} onChange={(e) => setImgSort(e.target.value)} className="bg-secondary border-border" dir="ltr" />
            </div>
            <Button type="submit" variant="cta" className="w-full" disabled={saveImageMutation.isPending}>
              {saveImageMutation.isPending ? "جاري الحفظ..." : "إضافة الصورة"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminKzProducts;
