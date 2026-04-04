import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  ShoppingBag,
  Store,
  X,
  Tag,
  ArrowLeft,
  SlidersHorizontal,
  Compass,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/PageHero";

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStore, setSelectedStore] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"featured" | "price_asc" | "price_desc" | "newest">("featured");

  const { data: categories } = useQuery({
    queryKey: ["product_categories"],
    queryFn: async () => {
      const { data } = await supabase.from("product_categories").select("*").order("sort_order");
      return data ?? [];
    },
  });

  const { data: stores } = useQuery({
    queryKey: ["product_stores"],
    queryFn: async () => {
      const { data } = await supabase
        .from("stores")
        .select("id, name_ar, slug, logo_url")
        .neq("status", "hidden")
        .order("name_ar");
      return data ?? [];
    },
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", selectedCategory, selectedStore, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select("*, stores(name_ar, slug, logo_url), product_categories(name_ar, slug)")
        .eq("status", "published");
      if (selectedCategory !== "all") query = query.eq("category_id", selectedCategory);
      if (selectedStore !== "all") query = query.eq("store_id", selectedStore);
      if (searchTerm.trim()) query = query.or(`name_ar.ilike.%${searchTerm}%,name_en.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%`);
      const { data } = await query;
      return data ?? [];
    },
  });

  const sortedProducts = useMemo(() => {
    if (!products) return [];
    const sorted = [...products];
    switch (sortBy) {
      case "price_asc":
        return sorted.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
      case "price_desc":
        return sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
      case "newest":
        return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      default:
        return sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
  }, [products, sortBy]);

  const hasActiveFilters = selectedCategory !== "all" || selectedStore !== "all" || searchTerm.trim().length > 0;

  const clearFilters = useCallback(() => {
    setSelectedCategory("all");
    setSelectedStore("all");
    setSearchTerm("");
    setSortBy("featured");
  }, []);

  return (
    <MainLayout>
      <SEOHead
        title="المنتجات"
        titleEn="Products"
        description="تصفّح منتجات محلات مول البستان — هواتف، أجهزة، إكسسوارات، وقطع غيار من العلامات التجارية المتوفرة في المول."
        descriptionEn="Browse products from Mall Elbostan stores — phones, devices, accessories, and components."
        breadcrumbs={[{ name: "المنتجات", url: "/products" }]}
      />

      {/* ═══════════ HERO ═══════════ */}
      <PageHero
        kicker="منتجات المحلات"
        kickerEn="Products"
        title={<>منتجات <span style={{ color: "#CDBB9A" }}>محلات المول.</span></>}
        subtitle="تصفّح المنتجات المتوفرة واطلبها مباشرة من المحلات."
        ctas={[
          { label: "تصفّح المنتجات", to: "#products", icon: Search },
          { label: "دليل المحلات", to: "/stores", icon: Store },
        ]}
        compact
      >
      </PageHero>

      <div className="band-primary" />

      {/* ═══════════ PRODUCTS SECTION ═══════════ */}
      <section id="products" className="heritage-deep py-7 md:py-9 scroll-mt-20">
        <div className="container max-w-[1200px]">

          {/* Sticky filter bar */}
          <div className="sticky top-14 z-20 -mx-1 mb-5 rounded-xl px-1 py-3 backdrop-blur-xl" style={{ background: "#0B1220E8" }}>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "#475569" }} />
                <input
                  type="text"
                  placeholder="ابحث عن منتج أو علامة تجارية..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-10 w-full rounded-lg pr-10 pl-4 text-[0.84rem] outline-none transition-all focus:ring-1"
                  style={{ border: "1px solid #ffffff12", background: "#ffffff08", color: "#F8FAFC" }}
                />
              </div>

              {/* Dropdowns */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedStore}
                  onChange={(e) => setSelectedStore(e.target.value)}
                  className="h-9 rounded-lg px-3 text-[0.76rem] font-semibold outline-none"
                  style={{ border: "1px solid #ffffff12", background: "#ffffff08", color: "#CBD5E1" }}
                >
                  <option value="all">جميع المحلات</option>
                  {stores?.map((s) => (
                    <option key={s.id} value={s.id}>{s.name_ar}</option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="h-9 rounded-lg px-3 text-[0.76rem] font-semibold outline-none"
                  style={{ border: "1px solid #ffffff12", background: "#ffffff08", color: "#CBD5E1" }}
                >
                  <option value="featured">الأكثر تميزا</option>
                  <option value="price_asc">السعر: الأقل</option>
                  <option value="price_desc">السعر: الأعلى</option>
                  <option value="newest">الأحدث</option>
                </select>
              </div>
            </div>

            {/* Category chips */}
            <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
              <ChipButton active={selectedCategory === "all"} onClick={() => setSelectedCategory("all")}>الكل</ChipButton>
              {categories?.map((cat) => (
                <ChipButton key={cat.id} active={selectedCategory === cat.id} onClick={() => setSelectedCategory(cat.id)}>
                  {cat.name_ar}
                </ChipButton>
              ))}
            </div>

            {/* Active filter summary */}
            {hasActiveFilters && (
              <div className="mt-2.5 flex items-center gap-2 text-[0.72rem]" style={{ color: "#64748B" }}>
                <span>نتائج البحث: {sortedProducts.length} منتج</span>
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 rounded-md px-2 py-0.5 transition-colors hover:text-white"
                  style={{ border: "1px solid #ffffff12", background: "#ffffff06" }}
                >
                  <X className="h-3 w-3" /> مسح الفلاتر
                </button>
              </div>
            )}
          </div>

          {/* Products grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="rounded-xl overflow-hidden" style={{ border: "1px solid #ffffff0C", background: "#ffffff05" }}>
                  <Skeleton className="aspect-square w-full rounded-none bg-[#ffffff08]" />
                  <div className="p-3 space-y-2">
                    <Skeleton className="h-2 w-12 bg-[#ffffff06]" />
                    <Skeleton className="h-3 w-full bg-[#ffffff08]" />
                    <Skeleton className="h-3 w-3/4 bg-[#ffffff08]" />
                    <div className="flex items-center gap-1.5 pt-1">
                      <Skeleton className="h-3.5 w-3.5 rounded-sm bg-[#ffffff06]" />
                      <Skeleton className="h-2.5 w-16 bg-[#ffffff06]" />
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <Skeleton className="h-4 w-14 bg-[#ffffff08]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : sortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {sortedProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          ) : (
            <EmptyState hasFilters={hasActiveFilters} onClear={clearFilters} />
          )}
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="py-7 md:py-9" style={{ background: "hsl(var(--background))" }}>
        <div className="container max-w-[1200px]">
          <div className="rounded-xl border border-border bg-card p-6 md:p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="section-kicker">انضم للمحلات</p>
                <h2 className="section-title max-w-[20rem]">اعرض منتجاتك في سوق المول.</h2>
                <p className="mt-1 max-w-[22rem] text-[0.82rem] leading-[1.7] light-body">
                  أضف منتجاتك وأوصل لعملاء جدد.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link to="/join-marketplace">
                  <Button variant="cta" className="h-9 gap-1.5 rounded-lg px-5 text-[0.82rem] font-bold">
                    انضم كتاجر
                  </Button>
                </Link>
                <Link to="/stores">
                  <Button variant="outline-blue" className="h-9 rounded-lg px-5 text-[0.82rem]">دليل المحلات</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

/* ══════════════════════════════════════════════════════════
   Sub-components
   ══════════════════════════════════════════════════════════ */

function ChipButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.72rem] font-bold transition-all"
      style={active
        ? { border: "1px solid #2D6BFF50", background: "#2D6BFF22", color: "#5B9AFF" }
        : { border: "1px solid #ffffff12", background: "#ffffff06", color: "#94A3B8" }
      }
    >
      {children}
    </button>
  );
}

type ProductRow = {
  id: string;
  slug: string;
  name_ar: string;
  name_en: string | null;
  price: number | null;
  price_note: string | null;
  image_url: string | null;
  brand: string | null;
  featured: boolean;
  stores: { name_ar: string; slug: string; logo_url: string | null } | null;
  product_categories: { name_ar: string; slug: string } | null;
};

function ProductCard({ product, index }: { product: ProductRow; index: number }) {
  const store = product.stores;
  const category = product.product_categories;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.02, 0.2), duration: 0.3 }}
    >
      <Link
        to={`/products/${product.slug}`}
        className="group flex flex-col rounded-xl overflow-hidden transition-all duration-200"
        style={{ border: "1px solid #ffffff0C", background: "#ffffff05" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "#2D6BFF30";
          e.currentTarget.style.background = "#ffffff0A";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "#ffffff0C";
          e.currentTarget.style.background = "#ffffff05";
        }}
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-white">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name_ar}
              className="h-full w-full object-contain p-3 transition-transform duration-200 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ShoppingBag className="h-7 w-7" style={{ color: "#CBD5E130" }} />
            </div>
          )}

          {/* Badges */}
          {product.featured && (
            <span
              className="absolute top-2 right-2 rounded-md px-1.5 py-0.5 text-[0.58rem] font-bold"
              style={{ background: "#2D6BFF", color: "#fff" }}
            >
              مميز
            </span>
          )}
          {product.brand && (
            <span
              className="absolute bottom-2 left-2 rounded px-1.5 py-0.5 text-[0.56rem] font-semibold backdrop-blur-sm"
              style={{ background: "#00000050", color: "#E2E8F0" }}
            >
              {product.brand}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col justify-between p-3">
          <div>
            {category && (
              <p className="mb-1 text-[0.6rem] font-semibold" style={{ color: "#5B9AFF" }}>{category.name_ar}</p>
            )}
            <h3 className="text-[0.8rem] font-bold leading-snug line-clamp-2 transition-colors group-hover:text-primary" style={{ color: "#F8FAFC" }}>
              {product.name_ar}
            </h3>
            {store && (
              <p className="mt-1.5 flex items-center gap-1.5 text-[0.66rem]" style={{ color: "#64748B" }}>
                {store.logo_url ? (
                  <img src={store.logo_url} alt="" className="h-3.5 w-3.5 rounded-sm bg-white object-contain" />
                ) : (
                  <Store className="h-3 w-3" />
                )}
                {store.name_ar}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="mt-2.5 flex items-center justify-between">
            {product.price ? (
              <p className="font-poppins text-[0.88rem] font-bold" style={{ color: "#F8FAFC" }}>
                {Number(product.price).toLocaleString("ar-EG")}
                <span className="mr-0.5 text-[0.62rem]" style={{ color: "#64748B" }}>ج.م</span>
              </p>
            ) : product.price_note ? (
              <p className="text-[0.7rem] font-semibold" style={{ color: "#5B9AFF" }}>{product.price_note}</p>
            ) : (
              <span className="text-[0.66rem]" style={{ color: "#475569" }}>اسأل عن السعر</span>
            )}
            <ArrowLeft className="h-3.5 w-3.5 opacity-0 transition-all group-hover:opacity-100 group-hover:-translate-x-0.5" style={{ color: "#5B9AFF" }} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function EmptyState({ hasFilters, onClear }: { hasFilters: boolean; onClear: () => void }) {
  return (
    <div className="heritage-surface rounded-xl p-8 text-center md:p-12">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: "#2D6BFF14", border: "1px solid #2D6BFF30" }}>
        <ShoppingBag className="h-5 w-5" style={{ color: "#5B9AFF" }} />
      </div>
      {hasFilters ? (
        <>
          <h3 className="mt-4 text-[1rem] font-bold dark-heading">لا توجد نتائج مطابقة</h3>
          <p className="mx-auto mt-1.5 max-w-xs text-[0.82rem] leading-6 dark-body">
            جرّب تعديل الفلاتر أو البحث بكلمات مختلفة.
          </p>
          <button onClick={onClear} className="mt-4 rounded-lg px-5 py-2 text-[0.82rem] font-bold transition-all" style={{ border: "1px solid #ffffff18", background: "#ffffff0A", color: "#CBD5E1" }}>
            إعادة ضبط الفلاتر
          </button>
        </>
      ) : (
        <>
          <h3 className="mt-4 text-[1rem] font-bold dark-heading">سوق مول البستان الرقمي</h3>
          <p className="mx-auto mt-2 max-w-sm text-[0.82rem] leading-6 dark-body">
            نعمل على بناء أول سوق رقمي يجمع منتجات محلات المول في مكان واحد.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Link to="/stores">
              <Button variant="cta" className="h-9 gap-1.5 rounded-lg px-5 text-[0.82rem] font-bold">
                <Store className="h-3.5 w-3.5" /> تصفّح المحلات
              </Button>
            </Link>
            <Link to="/join-marketplace">
              <Button variant="outline-blue" className="h-9 rounded-lg px-5 text-[0.82rem]">انضم كتاجر</Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default Products;
