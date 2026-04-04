import { useState, useMemo, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ShoppingBag, X, SlidersHorizontal, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type SortOption = "newest" | "price_asc" | "price_desc" | "featured";

const KzProducts = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "";
  const initialBrand = searchParams.get("brand") ?? "";

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [selectedCondition, setSelectedCondition] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [showFilters, setShowFilters] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ["kz-all-categories"],
    queryFn: async () => {
      const { data } = await supabase.from("kz_categories").select("*").order("sort_order");
      return data ?? [];
    },
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ["kz-products-all"],
    queryFn: async () => {
      const { data } = await supabase
        .from("kz_products")
        .select("*, kz_product_variants(price, compare_price, stock_qty, is_default, ram, storage, processor), kz_product_images(image_url, sort_order), kz_categories(name, slug)")
        .eq("status", "published");
      return data ?? [];
    },
  });

  const brands = useMemo(() => [...new Set(products?.map(p => p.brand).filter(Boolean) ?? [])].sort(), [products]);
  const conditions = useMemo(() => [...new Set(products?.map(p => p.condition).filter(Boolean) ?? [])], [products]);

  const filtered = useMemo(() => {
    if (!products) return [];
    return products
      .filter((p: any) => {
        const q = search.trim().toLowerCase();
        const matchSearch = !q || p.title.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q);
        const matchCategory = !selectedCategory || p.kz_categories?.slug === selectedCategory;
        const matchBrand = !selectedBrand || p.brand === selectedBrand;
        const matchCondition = !selectedCondition || p.condition === selectedCondition;
        return matchSearch && matchCategory && matchBrand && matchCondition;
      })
      .sort((a: any, b: any) => {
        const aVariant = a.kz_product_variants?.find((v: any) => v.is_default) ?? a.kz_product_variants?.[0];
        const bVariant = b.kz_product_variants?.find((v: any) => v.is_default) ?? b.kz_product_variants?.[0];
        switch (sortBy) {
          case "price_asc": return (aVariant?.price ?? Infinity) - (bVariant?.price ?? Infinity);
          case "price_desc": return (bVariant?.price ?? 0) - (aVariant?.price ?? 0);
          case "newest": return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          default: return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        }
      });
  }, [products, search, selectedCategory, selectedBrand, selectedCondition, sortBy]);

  const hasFilters = !!search || !!selectedCategory || !!selectedBrand || !!selectedCondition;
  const clearFilters = useCallback(() => {
    setSearch(""); setSelectedCategory(""); setSelectedBrand(""); setSelectedCondition(""); setSortBy("featured");
  }, []);

  return (
    <MainLayout>
      <SEOHead
        title="جميع المنتجات - Kasr Zero"
        titleEn="All Products - Kasr Zero"
        description="تصفّح جميع منتجات Kasr Zero — لابتوبات، هواتف، شاشات، إكسسوارات بأفضل الأسعار."
        breadcrumbs={[{ name: "Kasr Zero", url: "/kz" }, { name: "المنتجات", url: "/kz/products" }]}
      />

      {/* Header */}
      <section className="py-8 md:py-10" style={{ background: "linear-gradient(135deg, #071326 0%, #0d1f3c 100%)" }}>
        <div className="container max-w-[1200px]">
          <h1 className="text-[1.4rem] font-extrabold md:text-[1.8rem]" style={{ color: "#F8FAFC" }}>جميع المنتجات</h1>
          <p className="mt-1 text-[0.84rem]" style={{ color: "#94A3B8" }}>{filtered.length} منتج متاح</p>
        </div>
      </section>

      <section className="py-6 md:py-8" style={{ background: "hsl(var(--background))" }}>
        <div className="container max-w-[1200px]">
          {/* Search & Sort Bar */}
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text" placeholder="ابحث عن منتج أو براند..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 w-full rounded-xl border border-border bg-card pr-10 pl-4 text-[0.84rem] outline-none transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="h-9 rounded-lg border border-border bg-card px-3 text-[0.76rem] font-semibold outline-none"
              >
                <option value="featured">الأكثر تميزًا</option>
                <option value="newest">الأحدث</option>
                <option value="price_asc">السعر: الأقل</option>
                <option value="price_desc">السعر: الأعلى</option>
              </select>
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="gap-1.5 text-[0.76rem]">
                <SlidersHorizontal className="h-3.5 w-3.5" /> فلاتر
              </Button>
            </div>
          </div>

          {/* Filters panel */}
          {showFilters && (
            <div className="mb-5 rounded-xl border border-border bg-card p-4 space-y-3">
              <div>
                <p className="mb-1.5 text-[0.72rem] font-bold text-muted-foreground">التصنيف</p>
                <div className="flex flex-wrap gap-1.5">
                  <FilterChip active={!selectedCategory} onClick={() => setSelectedCategory("")}>الكل</FilterChip>
                  {categories?.map(c => <FilterChip key={c.id} active={selectedCategory === c.slug} onClick={() => setSelectedCategory(selectedCategory === c.slug ? "" : c.slug)}>{c.name}</FilterChip>)}
                </div>
              </div>
              <div>
                <p className="mb-1.5 text-[0.72rem] font-bold text-muted-foreground">الماركة</p>
                <div className="flex flex-wrap gap-1.5">
                  <FilterChip active={!selectedBrand} onClick={() => setSelectedBrand("")}>الكل</FilterChip>
                  {brands.map(b => <FilterChip key={b} active={selectedBrand === b} onClick={() => setSelectedBrand(selectedBrand === b ? "" : b!)}>{b}</FilterChip>)}
                </div>
              </div>
              {conditions.length > 0 && (
                <div>
                  <p className="mb-1.5 text-[0.72rem] font-bold text-muted-foreground">الحالة</p>
                  <div className="flex flex-wrap gap-1.5">
                    <FilterChip active={!selectedCondition} onClick={() => setSelectedCondition("")}>الكل</FilterChip>
                    {conditions.map(c => <FilterChip key={c} active={selectedCondition === c} onClick={() => setSelectedCondition(selectedCondition === c ? "" : c!)}>{c === "new" ? "جديد" : c === "used" ? "مستعمل" : c === "refurbished" ? "مجدد" : c}</FilterChip>)}
                  </div>
                </div>
              )}
            </div>
          )}

          {hasFilters && (
            <div className="mb-4 flex items-center gap-2">
              <span className="text-[0.78rem] text-muted-foreground">{filtered.length} نتيجة</span>
              <button onClick={clearFilters} className="flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-[0.72rem] font-semibold text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-3 w-3" /> مسح الفلاتر
              </button>
            </div>
          )}

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                  <Skeleton className="aspect-square w-full" />
                  <div className="p-3 space-y-2"><Skeleton className="h-3 w-3/4" /><Skeleton className="h-4 w-1/2" /></div>
                </div>
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {filtered.map((product: any) => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card p-8 text-center">
              <ShoppingBag className="mx-auto mb-3 h-8 w-8 text-muted-foreground/30" />
              <p className="text-[0.88rem] font-bold text-foreground">{hasFilters ? "لا توجد نتائج" : "لا توجد منتجات بعد"}</p>
              {hasFilters && (
                <button onClick={clearFilters} className="mt-3 rounded-lg border border-border px-5 py-2 text-[0.82rem] font-bold text-foreground hover:bg-secondary transition-colors">
                  إعادة ضبط الفلاتر
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`rounded-lg px-3 py-1.5 text-[0.72rem] font-medium transition-all ${active ? "bg-primary text-primary-foreground shadow-sm" : "border border-border bg-card text-muted-foreground hover:bg-secondary"}`}>
      {children}
    </button>
  );
}

function ProductCard({ product }: { product: any }) {
  const variant = product.kz_product_variants?.find((v: any) => v.is_default) ?? product.kz_product_variants?.[0];
  const image = product.kz_product_images?.sort((a: any, b: any) => a.sort_order - b.sort_order)?.[0];
  const inStock = variant?.stock_qty > 0;

  return (
    <Link to={`/kz/products/${product.slug}`} className="group rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-primary/20 hover:shadow-md">
      <div className="relative aspect-square overflow-hidden bg-white">
        {image ? (
          <img src={image.image_url} alt={product.title} className="h-full w-full object-contain p-3 transition-transform group-hover:scale-105" loading="lazy" />
        ) : (
          <div className="flex h-full w-full items-center justify-center"><ShoppingBag className="h-8 w-8 text-muted-foreground/20" /></div>
        )}
        {variant?.compare_price && variant.compare_price > variant.price && (
          <span className="absolute top-2 right-2 rounded-md bg-destructive px-1.5 py-0.5 text-[0.6rem] font-bold text-white">
            خصم {Math.round(((variant.compare_price - variant.price) / variant.compare_price) * 100)}%
          </span>
        )}
        {!inStock && <span className="absolute top-2 left-2 rounded-md bg-muted px-1.5 py-0.5 text-[0.6rem] font-bold text-muted-foreground">نفذ</span>}
      </div>
      <div className="p-3">
        <p className="text-[0.78rem] font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">{product.title}</p>
        {product.brand && <p className="mt-0.5 text-[0.65rem] text-muted-foreground">{product.brand}</p>}
        <div className="mt-2 flex items-center gap-2">
          {variant && (
            <>
              <span className="font-poppins text-[0.92rem] font-bold text-foreground">{Number(variant.price).toLocaleString("ar-EG")} ج.م</span>
              {variant.compare_price && variant.compare_price > variant.price && (
                <span className="font-poppins text-[0.7rem] text-muted-foreground line-through">{Number(variant.compare_price).toLocaleString("ar-EG")}</span>
              )}
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

export default KzProducts;
