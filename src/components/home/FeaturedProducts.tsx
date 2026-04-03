import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function FeaturedProducts() {
  const { data: products } = useQuery({
    queryKey: ["featured-products-home"],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("id, name_ar, slug, price, price_note, image_url, brand, category_id, store_id, stores(name_ar, slug)")
        .eq("status", "published")
        .eq("featured", true)
        .limit(12);
      return data ?? [];
    },
  });

  const hasProducts = products && products.length > 0;

  return (
    <section className="py-7 md:py-9" style={{ background: "#FAFAF8" }}>
      <div className="container">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="section-kicker">منتجات مميزة</p>
            <h2 className="section-title">أحدث المنتجات من محلات المول.</h2>
          </div>
          <Link to="/products" className="hidden lg:inline-flex">
            <Button variant="ghost" className="gap-1 text-[0.78rem] font-bold text-primary">
              عرض الكل <ArrowLeft className="h-3 w-3" />
            </Button>
          </Link>
        </div>

        {hasProducts ? (
          <div className="grid gap-px bg-border overflow-hidden rounded-lg border border-border grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {products.map((product) => {
              const store = (product as any).stores;
              return (
                <Link
                  key={product.id}
                  to={`/products/${product.slug}`}
                  className="group flex flex-col bg-card transition-colors hover:bg-muted/30"
                >
                  {product.image_url ? (
                    <div className="aspect-square overflow-hidden bg-white">
                      <img src={product.image_url} alt={product.name_ar} className="h-full w-full object-contain p-3 transition-transform duration-200 group-hover:scale-105" loading="lazy" />
                    </div>
                  ) : (
                    <div className="flex aspect-square items-center justify-center bg-secondary/50">
                      <ShoppingBag className="h-6 w-6 text-muted-foreground/25" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col justify-between p-2.5">
                    <div>
                      <p className="text-[0.75rem] font-bold light-heading line-clamp-2 leading-snug">{product.name_ar}</p>
                      {store && (
                        <p className="mt-0.5 flex items-center gap-1 text-[0.62rem] light-muted">
                          <Store className="h-2.5 w-2.5" /> {store.name_ar}
                        </p>
                      )}
                    </div>
                    {product.price ? (
                      <p className="mt-1.5 font-poppins text-[0.78rem] font-bold text-primary">
                        {Number(product.price).toLocaleString("ar-EG")} جم
                      </p>
                    ) : product.price_note ? (
                      <p className="mt-1.5 text-[0.68rem] font-semibold text-primary">{product.price_note}</p>
                    ) : null}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card p-6 text-center md:p-8">
            <ShoppingBag className="mx-auto mb-3 h-8 w-8 text-primary/40" />
            <h3 className="text-[0.9rem] font-bold light-heading">سوق المنتجات قادم قريبا</h3>
            <p className="mx-auto mt-1.5 max-w-[22rem] text-[0.78rem] leading-[1.65] light-body">
              منصة رقمية تجمع منتجات محلات المول.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2.5">
              <Link to="/products">
                <Button variant="cta" className="h-9 rounded-lg px-5 text-[0.76rem]">
                  <ShoppingBag className="ml-1 h-3.5 w-3.5" /> تصفّح المنتجات
                </Button>
              </Link>
              <Link to="/join-marketplace">
                <Button variant="outline-blue" className="h-9 rounded-lg px-5 text-[0.76rem]">انضم كتاجر</Button>
              </Link>
            </div>
          </div>
        )}

        <div className="mt-3 flex justify-center lg:hidden">
          <Link to="/products">
            <Button variant="secondary" className="h-9 rounded-lg px-5 text-[0.78rem] font-bold">عرض جميع المنتجات</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
