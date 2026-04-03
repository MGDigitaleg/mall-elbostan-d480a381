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
        .select("id, name_ar, slug, price, price_note, image_url, brand, category_id, store_id, stores(name_ar, slug, logo_url, category)")
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
          <div className="grid gap-2.5 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {products.map((product) => {
              const store = (product as any).stores;
              return (
                <Link
                  key={product.id}
                  to={`/products/${product.slug}`}
                  className="group flex flex-col rounded-lg border border-border bg-card overflow-hidden transition-all hover:shadow-[var(--shadow-card)] hover:border-primary/20"
                >
                  {/* Image area */}
                  <div className="relative aspect-square overflow-hidden bg-white">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name_ar}
                        className="h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ShoppingBag className="h-6 w-6 text-muted-foreground/20" />
                      </div>
                    )}

                    {/* Category badge */}
                    {store?.category && (
                      <span className="absolute top-1.5 right-1.5 rounded-md bg-primary/90 px-1.5 py-0.5 text-[0.56rem] font-bold text-primary-foreground leading-tight backdrop-blur-sm">
                        {store.category}
                      </span>
                    )}
                  </div>

                  {/* Info area */}
                  <div className="flex flex-1 flex-col justify-between border-t border-border p-2.5">
                    <div>
                      <p className="text-[0.74rem] font-bold light-heading line-clamp-2 leading-snug">
                        {product.name_ar}
                      </p>

                      {/* Store row with logo */}
                      {store && (
                        <div className="mt-1.5 flex items-center gap-1.5">
                          {store.logo_url ? (
                            <img
                              src={store.logo_url}
                              alt={store.name_ar}
                              className="h-4 w-4 rounded object-contain border border-border bg-white shrink-0"
                            />
                          ) : (
                            <Store className="h-3 w-3 text-muted-foreground/50 shrink-0" />
                          )}
                          <span className="text-[0.62rem] font-semibold text-muted-foreground line-clamp-1">
                            {store.name_ar}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Price */}
                    {product.price ? (
                      <p className="mt-2 font-poppins text-[0.8rem] font-extrabold text-primary">
                        {Number(product.price).toLocaleString("ar-EG")} جم
                      </p>
                    ) : product.price_note ? (
                      <p className="mt-2 text-[0.68rem] font-bold text-primary">{product.price_note}</p>
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
