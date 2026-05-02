import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead, buildCollectionPageLd } from "@/components/SEOHead";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingBag, ArrowLeft, ChevronLeft } from "lucide-react";

const KzCategory = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: category } = useQuery({
    queryKey: ["kz-category", slug],
    queryFn: async () => {
      const { data } = await supabase.from("kz_categories").select("*").eq("slug", slug!).single();
      return data;
    },
    enabled: !!slug,
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ["kz-category-products", category?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("kz_products")
        .select("*, kz_product_variants(price, compare_price, stock_qty, is_default), kz_product_images(image_url, sort_order)")
        .eq("status", "published")
        .eq("category_id", category!.id)
        .order("featured", { ascending: false });
      return data ?? [];
    },
    enabled: !!category?.id,
  });

  const { data: subcategories } = useQuery({
    queryKey: ["kz-subcategories", category?.id],
    queryFn: async () => {
      const { data } = await supabase.from("kz_categories").select("*").eq("parent_id", category!.id).order("sort_order");
      return data ?? [];
    },
    enabled: !!category?.id,
  });

  return (
    <MainLayout>
      <SEOHead
        title={category ? `${category.name} - Kasr Zero` : "تصنيف - Kasr Zero"}
        description={category ? `تسوّق ${category.name} من Kasr Zero بأفضل الأسعار` : ""}
        breadcrumbs={[
          { name: "Kasr Zero", url: "/kz" },
          { name: "المنتجات", url: "/kz/products" },
          ...(category ? [{ name: category.name, url: `/kz/category/${category.slug}` }] : []),
        ]}
        jsonLd={category && products && products.length > 0 ? buildCollectionPageLd({
          name: `${category.name} — Kasr Zero`,
          description: `منتجات ${category.name} من Kasr Zero`,
          url: `/kz/category/${category.slug}`,
          items: products.map((p: any) => {
            const img = p.kz_product_images?.sort((a: any, b: any) => a.sort_order - b.sort_order)?.[0];
            return { name: p.title, url: `/kz/products/${p.slug}`, image: img?.image_url ?? null };
          }),
        }) : undefined}
        noIndex={!isLoading && (!products || products.length === 0)}
      />

      <section className="py-8 md:py-10" style={{ background: "linear-gradient(135deg, #071326 0%, #0d1f3c 100%)" }}>
        <div className="container max-w-[1200px]">
          <nav className="mb-3 flex items-center gap-1.5 text-[0.72rem]" style={{ color: "#64748B" }}>
            <Link to="/kz" className="hover:text-primary">الرئيسية</Link>
            <ChevronLeft className="h-3 w-3" />
            <Link to="/kz/products" className="hover:text-primary">المنتجات</Link>
            <ChevronLeft className="h-3 w-3" />
            <span style={{ color: "#F8FAFC" }}>{category?.name ?? "..."}</span>
          </nav>
          <h1 className="text-[1.4rem] font-extrabold md:text-[1.8rem]" style={{ color: "#F8FAFC" }}>{category?.name ?? "تصنيف"}</h1>
          <p className="mt-1 text-[0.84rem]" style={{ color: "#94A3B8" }}>{products?.length ?? 0} منتج</p>
        </div>
      </section>

      <section className="py-6 md:py-8" style={{ background: "hsl(var(--background))" }}>
        <div className="container max-w-[1200px]">
          {/* Subcategories */}
          {subcategories && subcategories.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {subcategories.map(sub => (
                <Link key={sub.id} to={`/kz/category/${sub.slug}`} className="rounded-lg border border-border bg-card px-4 py-2 text-[0.78rem] font-semibold text-foreground hover:border-primary/20 hover:shadow-sm transition-all">
                  {sub.name}
                </Link>
              ))}
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                  <Skeleton className="aspect-square w-full" /><div className="p-3 space-y-2"><Skeleton className="h-3 w-3/4" /><Skeleton className="h-4 w-1/2" /></div>
                </div>
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((product: any) => {
                const variant = product.kz_product_variants?.find((v: any) => v.is_default) ?? product.kz_product_variants?.[0];
                const image = product.kz_product_images?.sort((a: any, b: any) => a.sort_order - b.sort_order)?.[0];
                return (
                  <Link key={product.id} to={`/kz/products/${product.slug}`} className="group rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-primary/20 hover:shadow-md">
                    <div className="relative aspect-square overflow-hidden bg-card dark:bg-muted/20">
                      {image ? <img src={image.image_url} alt={product.title} className="h-full w-full object-contain p-3 transition-transform group-hover:scale-105" loading="lazy" /> : <div className="flex h-full w-full items-center justify-center"><ShoppingBag className="h-8 w-8 text-muted-foreground/20" /></div>}
                      {variant?.compare_price && variant.compare_price > variant.price && (
                        <span className="absolute top-2 right-2 rounded-md bg-destructive px-1.5 py-0.5 text-[0.6rem] font-bold text-white">خصم {Math.round(((variant.compare_price - variant.price) / variant.compare_price) * 100)}%</span>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-[0.78rem] font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">{product.title}</p>
                      {product.brand && <p className="mt-0.5 text-[0.65rem] text-muted-foreground">{product.brand}</p>}
                      {variant && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="font-poppins text-[0.92rem] font-bold text-foreground">{Number(variant.price).toLocaleString("ar-EG")} ج.م</span>
                          {variant.compare_price && variant.compare_price > variant.price && (
                            <span className="font-poppins text-[0.7rem] text-muted-foreground line-through">{Number(variant.compare_price).toLocaleString("ar-EG")}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card p-8 text-center">
              <ShoppingBag className="mx-auto mb-3 h-8 w-8 text-muted-foreground/30" />
              <p className="text-[0.88rem] font-bold text-foreground">لا توجد منتجات في هذا التصنيف</p>
              <Link to="/kz/products" className="mt-3 inline-flex items-center gap-1.5 text-[0.82rem] font-bold text-primary hover:underline">
                تصفح جميع المنتجات <ArrowLeft className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default KzCategory;
