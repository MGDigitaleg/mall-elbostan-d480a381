import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Search, Filter, ShoppingBag, Store, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: categories } = useQuery({
    queryKey: ["product_categories"],
    queryFn: async () => {
      const { data } = await supabase.from("product_categories").select("*").order("sort_order");
      return data ?? [];
    },
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", selectedCategory, searchTerm],
    queryFn: async () => {
      let query = supabase.from("products").select("*, stores(name_ar, slug, logo_url), product_categories(name_ar, slug)").eq("status", "published").order("featured", { ascending: false });
      if (selectedCategory !== "all") query = query.eq("category_id", selectedCategory);
      if (searchTerm.trim()) query = query.or(`name_ar.ilike.%${searchTerm}%,name_en.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%`);
      const { data } = await query;
      return data ?? [];
    },
  });

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
      <section style={{ background: "#071326" }}>
        <div className="container py-10 md:py-14">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-[2px] w-8 rounded-full" style={{ background: "#CDBB9A" }} />
              <span className="font-poppins text-[0.58rem] font-bold tracking-[0.22em] uppercase" style={{ color: "#CDBB9A" }}>
                Marketplace
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold dark-heading max-w-[22rem]">
              منتجات <span style={{ color: "#CDBB9A" }}>مول البستان</span>
            </h1>
            <p className="mt-2 max-w-[28rem] text-[0.88rem] leading-[1.85] dark-body">
              تصفّح المنتجات المتوفرة من متاجر المول — اعثر على ما تحتاجه واطلبه مباشرة.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-[60px] z-30 border-b bg-card/95 backdrop-blur-sm md:top-[68px] xl:top-[72px]" style={{ borderColor: "#D8DEE8" }}>
        <div className="container py-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-[320px]">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث عن منتج أو علامة تجارية..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 h-9 rounded-lg border-border bg-secondary text-[0.84rem]"
              />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`inline-flex h-8 items-center rounded-lg px-3 text-[0.78rem] font-semibold transition-colors ${
                  selectedCategory === "all" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                الكل
              </button>
              {categories?.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`inline-flex h-8 items-center rounded-lg px-3 text-[0.78rem] font-semibold transition-colors ${
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
      <section className="py-8 md:py-10" style={{ background: "#FAFAF8" }}>
        <div className="container">
          {isLoading ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-xl border border-border bg-card p-4">
                  <div className="aspect-square rounded-lg bg-secondary mb-3" />
                  <div className="h-4 w-2/3 rounded bg-secondary mb-2" />
                  <div className="h-3 w-1/2 rounded bg-secondary" />
                </div>
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product: Record<string, unknown>) => {
                const store = product.stores as Record<string, string> | null;
                const category = product.product_categories as Record<string, string> | null;
                return (
                  <Link
                    key={product.id as string}
                    to={`/products/${product.slug}`}
                    className="group rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:border-primary/20 hover:shadow-[var(--shadow-card)]"
                  >
                    <div className="aspect-square rounded-lg bg-secondary mb-3 overflow-hidden flex items-center justify-center">
                      {product.image_url ? (
                        <img src={product.image_url as string} alt={product.name_ar as string} className="h-full w-full object-cover" loading="lazy" />
                      ) : (
                        <ShoppingBag className="h-8 w-8 text-muted-foreground/30" />
                      )}
                    </div>
                    {category && (
                      <span className="text-[0.68rem] font-semibold text-primary">{category.name_ar}</span>
                    )}
                    <h3 className="mt-1 text-[0.92rem] font-bold text-foreground line-clamp-2">{product.name_ar as string}</h3>
                    {product.price && (
                      <p className="mt-1 font-poppins text-[0.95rem] font-extrabold text-foreground">{Number(product.price).toLocaleString("ar-EG")} ج.م</p>
                    )}
                    {store && (
                      <div className="mt-2 flex items-center gap-1.5">
                        <Store className="h-3 w-3 text-muted-foreground" />
                        <span className="text-[0.74rem] text-muted-foreground">{store.name_ar}</span>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          ) : (
            /* Empty state — marketplace teaser */
            <div className="mx-auto max-w-2xl text-center py-12">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-secondary">
                <ShoppingBag className="h-7 w-7 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-bold text-foreground">سوق مول البستان الرقمي</h2>
              <p className="mt-2 text-[0.92rem] leading-[1.8] text-muted-foreground max-w-[26rem] mx-auto">
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
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default Products;
