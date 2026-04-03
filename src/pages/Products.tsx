import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Search, ShoppingBag, Store, SlidersHorizontal, X, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

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
      case "featured":
      default:
        return sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
  }, [products, sortBy]);

  const activeFiltersCount = [selectedCategory !== "all", selectedStore !== "all", searchTerm.trim().length > 0].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedStore("all");
    setSearchTerm("");
    setSortBy("featured");
  };

  return (
    <MainLayout>
      <SEOHead
        title="المنتجات"
        titleEn="Products"
        description="تصفّح منتجات متاجر مول البستان — هواتف، أجهزة، إكسسوارات، وقطع غيار من العلامات التجارية المتوفرة في المول."
        descriptionEn="Browse products from Mall Elbostan stores — phones, devices, accessories, and components from the mall's brands."
        breadcrumbs={[{ name: "المنتجات", url: "/products" }]}
      />

      {/* Hero */}
      <section className="bg-primary">
        <div className="container py-10 md:py-14">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-[2px] w-8 rounded-full bg-accent" />
              <span className="font-poppins text-[0.58rem] font-bold tracking-[0.22em] uppercase text-accent">
                Marketplace
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground max-w-[22rem]">
              منتجات <span className="text-accent">مول البستان</span>
            </h1>
            <p className="mt-2 max-w-[28rem] text-[0.88rem] leading-[1.85] text-primary-foreground/70">
              تصفّح المنتجات المتوفرة من متاجر المول — اعثر على ما تحتاجه واطلبه مباشرة.
            </p>
            {/* Stats bar */}
            <div className="mt-5 flex items-center gap-5">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-foreground/10">
                  <ShoppingBag className="h-3.5 w-3.5 text-accent" />
                </div>
                <div>
                  <p className="font-poppins text-[0.95rem] font-bold text-primary-foreground">{products?.length ?? 0}</p>
                  <p className="text-[0.62rem] text-primary-foreground/50">منتج متوفر</p>
                </div>
              </div>
              <div className="h-6 w-px bg-primary-foreground/10" />
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-foreground/10">
                  <Store className="h-3.5 w-3.5 text-accent" />
                </div>
                <div>
                  <p className="font-poppins text-[0.95rem] font-bold text-primary-foreground">{stores?.length ?? 0}</p>
                  <p className="text-[0.62rem] text-primary-foreground/50">متجر مشارك</p>
                </div>
              </div>
              <div className="h-6 w-px bg-primary-foreground/10" />
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-foreground/10">
                  <Tag className="h-3.5 w-3.5 text-accent" />
                </div>
                <div>
                  <p className="font-poppins text-[0.95rem] font-bold text-primary-foreground">{categories?.length ?? 0}</p>
                  <p className="text-[0.62rem] text-primary-foreground/50">تصنيف</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-[60px] z-30 border-b border-border bg-card/95 backdrop-blur-sm md:top-[68px] xl:top-[72px]">
        <div className="container py-3">
          <div className="flex flex-col gap-3">
            {/* Row 1: Search + Sort */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative flex-1 min-w-[180px] max-w-[320px]">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ابحث عن منتج أو علامة تجارية..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 h-9 rounded-lg border-border bg-secondary text-[0.84rem]"
                />
              </div>

              {/* Store filter */}
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="h-9 rounded-lg border border-border bg-secondary px-3 text-[0.78rem] font-semibold text-foreground outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">جميع المتاجر</option>
                {stores?.map((s) => (
                  <option key={s.id} value={s.id}>{s.name_ar}</option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="h-9 rounded-lg border border-border bg-secondary px-3 text-[0.78rem] font-semibold text-foreground outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="featured">الأكثر تميزا</option>
                <option value="price_asc">السعر: الأقل أولا</option>
                <option value="price_desc">السعر: الأعلى أولا</option>
                <option value="newest">الأحدث</option>
              </select>

              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-destructive/30 bg-destructive/5 px-3 text-[0.76rem] font-semibold text-destructive transition-colors hover:bg-destructive/10"
                >
                  <X className="h-3 w-3" /> مسح الفلاتر ({activeFiltersCount})
                </button>
              )}
            </div>

            {/* Row 2: Category chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`inline-flex h-7 shrink-0 items-center rounded-full px-3 text-[0.72rem] font-semibold transition-colors ${
                  selectedCategory === "all" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                الكل
              </button>
              {categories?.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`inline-flex h-7 shrink-0 items-center rounded-full px-3 text-[0.72rem] font-semibold transition-colors ${
                    selectedCategory === cat.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat.name_ar}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8 md:py-10 bg-secondary/30">
        <div className="container">
          {/* Results count */}
          {!isLoading && products && products.length > 0 && (
            <p className="mb-4 text-[0.78rem] text-muted-foreground">
              عرض <span className="font-bold text-foreground font-poppins">{sortedProducts.length}</span> منتج
              {selectedCategory !== "all" && categories && (
                <> في <span className="font-semibold text-primary">{categories.find(c => c.id === selectedCategory)?.name_ar}</span></>
              )}
            </p>
          )}

          {isLoading ? (
            <div className="grid gap-px bg-border overflow-hidden rounded-xl border border-border grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-card p-3">
                  <div className="aspect-square rounded-lg bg-secondary mb-2.5" />
                  <div className="h-3.5 w-3/4 rounded bg-secondary mb-1.5" />
                  <div className="h-3 w-1/2 rounded bg-secondary" />
                </div>
              ))}
            </div>
          ) : sortedProducts.length > 0 ? (
            <div className="grid gap-px bg-border overflow-hidden rounded-xl border border-border grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {sortedProducts.map((product) => {
                const store = product.stores as { name_ar: string; slug: string; logo_url: string | null } | null;
                const category = product.product_categories as { name_ar: string; slug: string } | null;
                return (
                  <Link
                    key={product.id}
                    to={`/products/${product.slug}`}
                    className="group flex flex-col bg-card transition-colors hover:bg-muted/30"
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
                          <ShoppingBag className="h-7 w-7 text-muted-foreground/20" />
                        </div>
                      )}
                      {product.featured && (
                        <span className="absolute top-2 right-2 rounded-md bg-primary px-1.5 py-0.5 text-[0.58rem] font-bold text-primary-foreground">
                          مميز
                        </span>
                      )}
                      {product.brand && (
                        <span className="absolute bottom-2 left-2 rounded bg-foreground/5 px-1.5 py-0.5 text-[0.56rem] font-semibold text-muted-foreground backdrop-blur-sm">
                          {product.brand}
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex flex-1 flex-col justify-between p-2.5">
                      <div>
                        {category && (
                          <p className="mb-0.5 text-[0.6rem] font-semibold text-primary/70">{category.name_ar}</p>
                        )}
                        <h3 className="text-[0.78rem] font-bold text-foreground line-clamp-2 leading-snug">{product.name_ar}</h3>
                        {store && (
                          <p className="mt-1 flex items-center gap-1 text-[0.64rem] text-muted-foreground">
                            {store.logo_url ? (
                              <img src={store.logo_url} alt="" className="h-3 w-3 rounded-sm object-contain" />
                            ) : (
                              <Store className="h-2.5 w-2.5" />
                            )}
                            {store.name_ar}
                          </p>
                        )}
                      </div>
                      <div className="mt-2">
                        {product.price ? (
                          <p className="font-poppins text-[0.82rem] font-bold text-primary">
                            {Number(product.price).toLocaleString("ar-EG")} <span className="text-[0.62rem]">ج.م</span>
                          </p>
                        ) : product.price_note ? (
                          <p className="text-[0.68rem] font-semibold text-primary">{product.price_note}</p>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            /* Empty state */
            <div className="mx-auto max-w-2xl text-center py-14">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card">
                <ShoppingBag className="h-7 w-7 text-muted-foreground/40" />
              </div>
              {searchTerm || selectedCategory !== "all" || selectedStore !== "all" ? (
                <>
                  <h2 className="text-lg font-bold text-foreground">لا توجد نتائج مطابقة</h2>
                  <p className="mt-1.5 text-[0.88rem] text-muted-foreground">جرّب تعديل الفلاتر أو البحث بكلمات مختلفة.</p>
                  <Button variant="outline" className="mt-4 h-9 rounded-lg text-[0.78rem]" onClick={clearFilters}>
                    مسح جميع الفلاتر
                  </Button>
                </>
              ) : (
                <>
                  <h2 className="text-lg font-bold text-foreground">سوق مول البستان الرقمي</h2>
                  <p className="mt-2 text-[0.88rem] leading-[1.8] text-muted-foreground max-w-[26rem] mx-auto">
                    نعمل على بناء أول سوق رقمي يجمع منتجات متاجر المول في مكان واحد.
                    قريبًا ستتمكن من تصفّح المنتجات ومقارنتها والطلب مباشرة.
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-2.5">
                    <Link to="/stores">
                      <Button variant="cta" className="h-10 rounded-lg px-5">
                        <Store className="ml-2 h-4 w-4" /> تصفّح المتاجر
                      </Button>
                    </Link>
                    <Link to="/join-marketplace">
                      <Button variant="outline-blue" className="h-10 rounded-lg px-5">
                        انضم كتاجر
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default Products;
