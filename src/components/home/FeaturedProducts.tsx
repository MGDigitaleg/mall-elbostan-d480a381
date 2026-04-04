import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

const sectionReveal = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

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
    <section className="py-8 md:py-10 min-h-[320px]" style={{ background: "#FAFAF8", contain: "layout style" }}>
      <div className="container">
        <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="section-kicker">من المحلات</p>
              <h2 className="section-title">أحدث المنتجات.</h2>
            </div>
            <Link to="/products" className="hidden lg:inline-flex">
              <Button variant="ghost" className="gap-1.5 text-[0.78rem] font-bold text-primary hover:text-primary/80">
                عرض الكل <ArrowLeft className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          {hasProducts ? (
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {products.map((product) => {
                const store = (product as any).stores;
                return (
                  <Link
                    key={product.id}
                    to={`/products/${product.slug}`}
                    className="group flex flex-col rounded-xl border border-border bg-card overflow-hidden transition-all hover:shadow-md hover:border-primary/20"
                  >
                    {/* Image area */}
                    <div className="relative aspect-square overflow-hidden bg-white">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name_ar}
                          className="h-full w-full object-contain p-3.5 transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <ShoppingBag className="h-7 w-7 text-muted-foreground/15" />
                        </div>
                      )}

                      {store?.category && (
                        <span className="absolute top-2 right-2 rounded-lg bg-primary/90 px-2 py-0.5 text-[0.58rem] font-bold text-primary-foreground leading-tight backdrop-blur-sm">
                          {store.category}
                        </span>
                      )}
                    </div>

                    {/* Info area */}
                    <div className="flex flex-1 flex-col justify-between border-t border-border p-3">
                      <div>
                        <p className="text-[0.76rem] font-bold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                          {product.name_ar}
                        </p>

                        {store && (
                          <div className="mt-1.5 flex items-center gap-1.5">
                            {store.logo_url ? (
                              <img src={store.logo_url} alt={store.name_ar}
                                   className="h-4 w-4 rounded object-contain border border-border bg-white shrink-0" />
                            ) : (
                              <Store className="h-3 w-3 text-muted-foreground/40 shrink-0" />
                            )}
                            <span className="text-[0.64rem] font-semibold text-muted-foreground line-clamp-1">
                              {store.name_ar}
                            </span>
                          </div>
                        )}
                      </div>

                      {product.price ? (
                        <p className="mt-2.5 font-poppins text-[0.82rem] font-extrabold text-primary">
                          {Number(product.price).toLocaleString("ar-EG")} جم
                        </p>
                      ) : product.price_note ? (
                        <p className="mt-2.5 text-[0.7rem] font-bold text-primary">{product.price_note}</p>
                      ) : null}
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="p-6 md:p-8 text-center">
                <ShoppingBag className="mx-auto mb-3 h-8 w-8 text-primary/30" />
                <h3 className="text-[0.92rem] font-bold text-foreground">منتجات المحلات — قريبًا</h3>
                <p className="mx-auto mt-2 max-w-[24rem] text-[0.8rem] leading-[1.7] text-muted-foreground">
                  سوق رقمي يجمع منتجات محلات المول في مكان واحد.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <Link to="/products">
                    <Button variant="cta" className="h-10 rounded-xl px-6 text-[0.8rem]">
                      <ShoppingBag className="ml-1.5 h-3.5 w-3.5" /> تصفّح المنتجات
                    </Button>
                  </Link>
                  <Link to="/join-marketplace">
                    <Button variant="outline-blue" className="h-10 rounded-xl px-6 text-[0.8rem]">انضم كتاجر</Button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 flex justify-center lg:hidden">
            <Link to="/products">
              <Button variant="secondary" className="h-10 rounded-xl px-6 text-[0.8rem] font-bold">عرض جميع المنتجات</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
