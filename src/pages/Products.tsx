import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  ShoppingBag,
  Store,
  X,
  ArrowLeft,
  SlidersHorizontal,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHero } from "@/components/PageHero";

/* ══════════════════════════════════════════════
   Unified product type for display
   ══════════════════════════════════════════════ */
type UnifiedProduct = {
  id: string;
  slug: string;
  name: string;
  price: number | null;
  priceNote: string | null;
  comparePrice: number | null;
  imageUrl: string | null;
  brand: string | null;
  featured: boolean;
  storeName: string | null;
  storeSlug: string | null;
  storeLogo: string | null;
  categoryName: string | null;
  source: "mall" | "kz";
  createdAt: string;
};

const Products = () => {
  const [searchParams] = useSearchParams();
  const initialStore = searchParams.get("store") ?? "all";
  const initialCategory = searchParams.get("category") ?? "all";

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStore, setSelectedStore] = useState(initialStore);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState<"featured" | "price_asc" | "price_desc" | "newest">("featured");
  const [showFilters, setShowFilters] = useState(false);

  /* ── Fetch mall products ── */
  const { data: mallProducts, isLoading: loadingMall } = useQuery({
    queryKey: ["unified-mall-products"],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("id, slug, name_ar, price, price_note, image_url, brand, featured, created_at, store_id, stores(name_ar, slug, logo_url), product_categories(name_ar)")
        .eq("status", "published");
      return data ?? [];
    },
  });

  /* ── Fetch KZ products ── */
  const { data: kzProducts, isLoading: loadingKz } = useQuery({
    queryKey: ["unified-kz-products"],
    queryFn: async () => {
      const { data } = await supabase
        .from("kz_products")
        .select("id, slug, title, brand, featured, created_at, category_id, kz_product_variants(price, compare_price, is_default), kz_product_images(image_url, sort_order), kz_categories(name)")
        .eq("status", "published");
      return data ?? [];
    },
  });

  /* ── Fetch store list for filter ── */
  const { data: storeList } = useQuery({
    queryKey: ["product-store-list"],
    queryFn: async () => {
      const { data } = await supabase
        .from("stores")
        .select("id, name_ar, slug, logo_url")
        .neq("status", "hidden")
        .order("name_ar");
      return data ?? [];
    },
  });

  /* ── Fetch category lists ── */
  const { data: mallCategories } = useQuery({
    queryKey: ["product_categories"],
    queryFn: async () => {
      const { data } = await supabase.from("product_categories").select("id, name_ar, slug").order("sort_order");
      return data ?? [];
    },
  });

  const { data: kzCategories } = useQuery({
    queryKey: ["kz-all-categories-unified"],
    queryFn: async () => {
      const { data } = await supabase.from("kz_categories").select("id, name, slug").order("sort_order");
      return data ?? [];
    },
  });

  const isLoading = loadingMall || loadingKz;

  /* ── Normalize into unified list ── */
  const allProducts: UnifiedProduct[] = useMemo(() => {
    const unified: UnifiedProduct[] = [];

    // Kasr Zero store info
    const kzStore = storeList?.find(s => s.slug === "kasr-zero");

    // Mall products
    if (mallProducts) {
      for (const p of mallProducts) {
        const store = (p as any).stores;
        const cat = (p as any).product_categories;
        unified.push({
          id: p.id,
          slug: p.slug,
          name: p.name_ar,
          price: p.price ? Number(p.price) : null,
          priceNote: p.price_note,
          comparePrice: null,
          imageUrl: p.image_url,
          brand: p.brand,
          featured: p.featured,
          storeName: store?.name_ar ?? null,
          storeSlug: store?.slug ?? null,
          storeLogo: store?.logo_url ?? null,
          categoryName: cat?.name_ar ?? null,
          source: "mall",
          createdAt: p.created_at,
        });
      }
    }

    // KZ products
    if (kzProducts) {
      for (const p of kzProducts as any[]) {
        const defaultVariant = p.kz_product_variants?.find((v: any) => v.is_default) ?? p.kz_product_variants?.[0];
        const firstImage = p.kz_product_images?.sort((a: any, b: any) => a.sort_order - b.sort_order)?.[0];
        unified.push({
          id: p.id,
          slug: p.slug,
          name: p.title,
          price: defaultVariant ? Number(defaultVariant.price) : null,
          priceNote: null,
          comparePrice: defaultVariant?.compare_price ? Number(defaultVariant.compare_price) : null,
          imageUrl: firstImage?.image_url ?? null,
          brand: p.brand,
          featured: p.featured,
          storeName: kzStore?.name_ar ?? "كسر زيرو",
          storeSlug: kzStore?.slug ?? "kasr-zero",
          storeLogo: kzStore?.logo_url ?? null,
          categoryName: p.kz_categories?.name ?? null,
          source: "kz",
          createdAt: p.created_at,
        });
      }
    }

    return unified;
  }, [mallProducts, kzProducts, storeList]);

  /* ── Build merged category list ── */
  const mergedCategories = useMemo(() => {
    const cats: { id: string; label: string }[] = [];
    const seen = new Set<string>();
    if (mallCategories) {
      for (const c of mallCategories) {
        if (!seen.has(c.name_ar)) { seen.add(c.name_ar); cats.push({ id: `mall:${c.id}`, label: c.name_ar }); }
      }
    }
    if (kzCategories) {
      for (const c of kzCategories) {
        if (!seen.has(c.name)) { seen.add(c.name); cats.push({ id: `kz:${c.id}`, label: c.name }); }
      }
    }
    return cats;
  }, [mallCategories, kzCategories]);

  /* ── Filter & Sort ── */
  const filteredProducts = useMemo(() => {
    let list = allProducts;

    // Store filter
    if (selectedStore !== "all") {
      list = list.filter(p => p.storeSlug === selectedStore);
    }

    // Category filter
    if (selectedCategory !== "all") {
      const catLabel = mergedCategories.find(c => c.id === selectedCategory)?.label;
      if (catLabel) {
        list = list.filter(p => p.categoryName === catLabel);
      }
    }

    // Search
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.storeName?.toLowerCase().includes(q)
      );
    }

    // Sort
    const sorted = [...list];
    switch (sortBy) {
      case "price_asc": return sorted.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
      case "price_desc": return sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
      case "newest": return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      default: return sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
  }, [allProducts, selectedStore, selectedCategory, searchTerm, sortBy, mergedCategories]);

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
        description="تصفّح جميع منتجات مول البستان — هواتف، أجهزة، لابتوبات، إكسسوارات، وقطع غيار من جميع المحلات."
        descriptionEn="Browse all products from Mall Elbostan stores — phones, devices, laptops, accessories, and components."
        breadcrumbs={[{ name: "المنتجات", url: "/products" }]}
      />

      {/* ═══════════ HERO ═══════════ */}
      <PageHero
        kicker="سوق المول"
        kickerEn="Marketplace"
        title={<>جميع <span style={{ color: "#CDBB9A" }}>المنتجات.</span></>}
        subtitle="تصفّح منتجات جميع محلات المول في مكان واحد — ابحث، قارن، واطلب مباشرة."
        ctas={[
          { label: "تصفّح المنتجات", to: "#products", icon: Search },
          { label: "دليل المحلات", to: "/stores", icon: Store },
        ]}
        compact
      />

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
              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={selectedStore}
                  onChange={(e) => setSelectedStore(e.target.value)}
                  className="h-9 rounded-lg px-3 text-[0.76rem] font-semibold outline-none"
                  style={{ border: "1px solid #ffffff12", background: "#ffffff08", color: "#CBD5E1" }}
                >
                  <option value="all">جميع المحلات</option>
                  {storeList?.map((s) => (
                    <option key={s.id} value={s.slug}>{s.name_ar}</option>
                  ))}
                </select>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="h-9 rounded-lg px-3 text-[0.76rem] font-semibold outline-none"
                  style={{ border: "1px solid #ffffff12", background: "#ffffff08", color: "#CBD5E1" }}
                >
                  <option value="all">جميع الفئات</option>
                  {mergedCategories.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="h-9 rounded-lg px-3 text-[0.76rem] font-semibold outline-none"
                  style={{ border: "1px solid #ffffff12", background: "#ffffff08", color: "#CBD5E1" }}
                >
                  <option value="featured">الأكثر تميزًا</option>
                  <option value="price_asc">السعر: الأقل</option>
                  <option value="price_desc">السعر: الأعلى</option>
                  <option value="newest">الأحدث</option>
                </select>
              </div>
            </div>

            {/* Active filter summary */}
            {hasActiveFilters && (
              <div className="mt-2.5 flex items-center gap-2 text-[0.72rem]" style={{ color: "#64748B" }}>
                <span>نتائج البحث: {filteredProducts.length} منتج</span>
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 rounded-md px-2 py-0.5 transition-colors hover:text-white"
                  style={{ border: "1px solid #ffffff12", background: "#ffffff06" }}
                >
                  <X className="h-3 w-3" /> مسح الفلاتر
                </button>
              </div>
            )}

            {!hasActiveFilters && (
              <div className="mt-2 text-[0.72rem]" style={{ color: "#475569" }}>
                {allProducts.length} منتج من {storeList?.length ?? 0} محل
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
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filteredProducts.map((product, i) => (
                <ProductCard key={`${product.source}-${product.id}`} product={product} index={i} />
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

function ProductCard({ product, index }: { product: UnifiedProduct; index: number }) {
  const detailPath = product.source === "kz"
    ? `/kz/products/${product.slug}`
    : `/products/${product.slug}`;

  const hasDiscount = product.comparePrice && product.comparePrice > (product.price ?? 0);
  const discountPct = hasDiscount
    ? Math.round(((product.comparePrice! - product.price!) / product.comparePrice!) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.02, 0.2), duration: 0.3 }}
    >
      <Link
        to={detailPath}
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
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-contain p-3 transition-transform duration-200 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ShoppingBag className="h-7 w-7" style={{ color: "#CBD5E130" }} />
            </div>
          )}

          {/* Badges */}
          {product.featured && !hasDiscount && (
            <span
              className="absolute top-2 right-2 rounded-md px-1.5 py-0.5 text-[0.58rem] font-bold"
              style={{ background: "#2D6BFF", color: "#fff" }}
            >
              مميز
            </span>
          )}
          {hasDiscount && (
            <span className="absolute top-2 right-2 rounded-md px-1.5 py-0.5 text-[0.58rem] font-bold bg-destructive text-white">
              خصم {discountPct}%
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
            {product.categoryName && (
              <p className="mb-1 text-[0.6rem] font-semibold" style={{ color: "#5B9AFF" }}>{product.categoryName}</p>
            )}
            <h3 className="text-[0.8rem] font-bold leading-snug line-clamp-2 transition-colors group-hover:text-primary" style={{ color: "#F8FAFC" }}>
              {product.name}
            </h3>
            {product.storeName && (
              <p className="mt-1.5 flex items-center gap-1.5 text-[0.66rem]" style={{ color: "#64748B" }}>
                {product.storeLogo ? (
                  <img src={product.storeLogo} alt="" className="h-3.5 w-3.5 rounded-sm bg-white object-contain" />
                ) : (
                  <Store className="h-3 w-3" />
                )}
                {product.storeName}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="mt-2.5 flex items-center justify-between">
            {product.price ? (
              <div className="flex items-center gap-1.5">
                <p className="font-poppins text-[0.88rem] font-bold" style={{ color: "#F8FAFC" }}>
                  {Number(product.price).toLocaleString("ar-EG")}
                  <span className="mr-0.5 text-[0.62rem]" style={{ color: "#64748B" }}>ج.م</span>
                </p>
                {hasDiscount && (
                  <span className="font-poppins text-[0.62rem] line-through" style={{ color: "#64748B" }}>
                    {Number(product.comparePrice!).toLocaleString("ar-EG")}
                  </span>
                )}
              </div>
            ) : product.priceNote ? (
              <p className="text-[0.7rem] font-semibold" style={{ color: "#5B9AFF" }}>{product.priceNote}</p>
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
                <Store className="ml-1.5 h-3.5 w-3.5" /> دليل المحلات
              </Button>
            </Link>
            <Link to="/join-marketplace">
              <Button className="h-9 rounded-lg border px-5 text-[0.82rem] font-bold" style={{ borderColor: "#ffffff18", background: "#ffffff08", color: "#E2E8F0" }}>
                انضم كتاجر
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default Products;
