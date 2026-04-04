import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Search, ShoppingBag, Cpu, Smartphone, Monitor, Laptop, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";

const KzHome = () => {
  const { data: featuredProducts, isLoading: loadingFeatured } = useQuery({
    queryKey: ["kz-featured-products"],
    queryFn: async () => {
      const { data } = await supabase
        .from("kz_products")
        .select("*, kz_product_variants!inner(price, compare_price, stock_qty, is_default), kz_product_images(image_url, sort_order)")
        .eq("status", "published")
        .eq("featured", true)
        .eq("kz_product_variants.is_default", true)
        .limit(8);
      return data ?? [];
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["kz-categories"],
    queryFn: async () => {
      const { data } = await supabase
        .from("kz_categories")
        .select("*")
        .is("parent_id", null)
        .order("sort_order");
      return data ?? [];
    },
  });

  const categoryIcons: Record<string, typeof Cpu> = {
    laptops: Laptop,
    phones: Smartphone,
    monitors: Monitor,
    accessories: Headphones,
  };

  return (
    <MainLayout>
      <SEOHead
        title="Kasr Zero - متجر الإلكترونيات والتكنولوجيا"
        titleEn="Kasr Zero - Electronics & Technology Store"
        description="تسوّق أحدث الأجهزة الإلكترونية — لابتوبات، هواتف، شاشات، إكسسوارات وأكثر. أسعار تنافسية وجودة مضمونة."
        descriptionEn="Shop the latest electronics — laptops, phones, monitors, accessories and more."
      />

      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24" style={{ background: "linear-gradient(135deg, #071326 0%, #0d1f3c 50%, #071326 100%)" }}>
        <div className="absolute inset-0 opacity-10" style={{ background: "radial-gradient(ellipse at 30% 40%, hsl(var(--primary) / 0.4), transparent 60%)" }} />
        <div className="container relative">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[0.72rem] font-bold" style={{ background: "hsl(var(--primary) / 0.12)", border: "1px solid hsl(var(--primary) / 0.25)", color: "hsl(var(--primary))" }}>
              <Cpu className="h-3.5 w-3.5" /> Kasr Zero
            </div>
            <h1 className="text-[1.8rem] font-extrabold leading-tight md:text-[2.8rem]" style={{ color: "#F8FAFC" }}>
              وجهتك لعالم <span className="bg-gradient-to-l from-[#2D6BFF] to-[#60A5FA] bg-clip-text text-transparent">التكنولوجيا.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-[0.92rem] leading-[1.8]" style={{ color: "#94A3B8" }}>
              أحدث الأجهزة الإلكترونية بأسعار تنافسية — لابتوبات، هواتف، شاشات، وإكسسوارات.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/products?shop_name=kasr-zero">
                <Button className="h-11 gap-2 rounded-xl px-6 text-[0.88rem] font-bold" style={{ background: "hsl(var(--primary))", color: "#fff" }}>
                  <ShoppingBag className="h-4 w-4" /> تصفّح المنتجات
                </Button>
              </Link>
              <Link to="/products?shop_name=kasr-zero">
                <Button variant="outline" className="h-11 gap-2 rounded-xl px-6 text-[0.88rem]" style={{ borderColor: "#ffffff20", background: "#ffffff08", color: "#CBD5E1" }}>
                  <Search className="h-4 w-4" /> ابحث عن منتج
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <section className="py-10 md:py-14" style={{ background: "hsl(var(--background))" }}>
          <div className="container max-w-[1200px]">
            <div className="mb-6">
              <p className="text-[0.72rem] font-bold uppercase tracking-wider text-primary">التصنيفات</p>
              <h2 className="mt-1 text-[1.2rem] font-extrabold text-foreground">تصفّح حسب الفئة</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {categories.map((cat) => {
                const Icon = categoryIcons[cat.slug] ?? Cpu;
                return (
                  <Link
                    key={cat.id}
                    to={`/products?store=kasr-zero`}
                    className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/20 hover:shadow-md"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: "hsl(var(--primary) / 0.08)" }}>
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[0.84rem] font-bold text-foreground group-hover:text-primary transition-colors">{cat.name}</p>
                    </div>
                    <ArrowLeft className="h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:-translate-x-1" />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-10 md:py-14" style={{ background: "#FAFAF8" }}>
        <div className="container max-w-[1200px]">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-[0.72rem] font-bold uppercase tracking-wider text-primary">منتجات مميزة</p>
              <h2 className="mt-1 text-[1.2rem] font-extrabold text-foreground">الأكثر طلبًا</h2>
            </div>
            <Link to="/products?store=kasr-zero" className="flex items-center gap-1.5 text-[0.78rem] font-bold text-primary hover:underline">
              عرض الكل <ArrowLeft className="h-3.5 w-3.5" />
            </Link>
          </div>

          {loadingFeatured ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                  <Skeleton className="aspect-square w-full" />
                  <div className="p-3 space-y-2">
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProducts && featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {featuredProducts.map((product: any) => {
                const variant = product.kz_product_variants?.[0];
                const image = product.kz_product_images?.sort((a: any, b: any) => a.sort_order - b.sort_order)?.[0];
                return (
                  <Link
                    key={product.id}
                    to={`/kz/products/${product.slug}`}
                    className="group rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-primary/20 hover:shadow-md"
                  >
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
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card p-8 text-center">
              <ShoppingBag className="mx-auto mb-3 h-8 w-8 text-muted-foreground/30" />
              <p className="text-[0.88rem] font-bold text-foreground">قريبًا</p>
              <p className="mt-1 text-[0.78rem] text-muted-foreground">نعمل على إضافة المنتجات — تابعنا</p>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default KzHome;
