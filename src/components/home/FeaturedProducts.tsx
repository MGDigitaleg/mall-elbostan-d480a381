import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpLeft, ShoppingBag, Store, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { optimizeImageUrl, unsplashSrcSet } from "@/lib/imageUtils";

const sectionReveal = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const CATEGORIES = [
  "الكل",
  "الهواتف والإكسسوارات",
  "الكمبيوتر والأجهزة",
  "الألعاب والترفيه",
  "الشبكات والأنظمة الأمنية",
  "الطباعة والتصوير",
  "الصيانة والدعم الفني",
] as const;

type SortTab = "latest" | "featured";

export function FeaturedProducts() {
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [sortTab, setSortTab] = useState<SortTab>("latest");

  const { data: products, isLoading } = useQuery({
    queryKey: ["home-products-full"],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select(
          "id, name_ar, slug, price, price_note, image_url, brand, category_id, store_id, featured, created_at, stores(name_ar, slug, logo_url, category)"
        )
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(48);
      return data ?? [];
    },
  });

  const filtered = useMemo(() => {
    if (!products) return [];
    let list = [...products];

    if (activeCategory !== "الكل") {
      list = list.filter((p) => {
        const store = (p as any).stores;
        return store?.category === activeCategory;
      });
    }

    if (sortTab === "featured") {
      list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return list.slice(0, 12);
  }, [products, activeCategory, sortTab]);

  const hasProducts = !isLoading && filtered.length > 0;
  const storeCount = useMemo(() => {
    if (!products) return 0;
    return new Set(products.map((p) => p.store_id).filter(Boolean)).size;
  }, [products]);

  return (
    <section
      className="min-h-[420px] bg-card dark:bg-background"
      style={{
        contain: "layout style",
        paddingTop: "clamp(52px, 7vw, 112px)",
        paddingBottom: "clamp(52px, 7vw, 112px)",
      }}
    >
      <div className="container">
        <motion.div
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {/* Header */}
          <div className="mb-2">
            <p className="section-kicker">من محلات المول</p>
            <h2 className="section-title">أحدث المنتجات من محلات المول.</h2>
            <p className="mt-1.5 text-[0.82rem] leading-[1.7] text-muted-foreground max-w-md">
              تصفح أحدث ما أضافته محلات مول البستان في مكان واحد.
            </p>
          </div>

          {/* Sort tabs */}
          <div className="mt-5 mb-4 flex flex-wrap items-center gap-2">
            {(
              [
                { key: "latest" as SortTab, label: "الأحدث" },
                { key: "featured" as SortTab, label: "مميز" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSortTab(tab.key)}
                className={`rounded-lg px-3.5 py-1.5 text-[0.74rem] font-bold transition-all duration-200 ${
                  sortTab === tab.key
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-card border border-border/70 text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                {tab.label}
              </button>
            ))}

            <div className="h-4 w-px bg-border/60 mx-1 hidden sm:block" />

            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-lg px-3 py-1.5 text-[0.7rem] font-semibold transition-all duration-200 ${
                    activeCategory === cat
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "bg-card border border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col rounded-2xl border border-border bg-card overflow-hidden"
                >
                  <Skeleton className="aspect-square w-full" />
                  <div className="p-3.5 space-y-2.5">
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-5 w-1/3 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          ) : hasProducts ? (
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
              {filtered.map((product) => {
                const store = (product as any).stores;
                const isFeatured = product.featured;

                return (
                  <article
                    key={product.id}
                    className="group relative flex flex-col rounded-2xl border border-border/70 bg-card dark:bg-secondary overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/[0.06] hover:border-primary/15"
                  >
                    {/* Stretched primary product link — wraps image + title */}
                    <Link
                      to={`/products/${product.slug}`}
                      className="flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-2xl"
                      aria-label={`عرض تفاصيل ${product.name_ar}`}
                    >
                      {/* Image */}
                      <div className="relative aspect-square overflow-hidden bg-muted/30 dark:bg-muted/20">
                        {product.image_url ? (
                          <img
                            src={optimizeImageUrl(product.image_url, 250)}
                            srcSet={unsplashSrcSet(product.image_url, [250, 500]) || undefined}
                            sizes="(max-width: 640px) 45vw, 250px"
                            alt={product.name_ar}
                            className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <ShoppingBag className="h-8 w-8 text-muted-foreground/8" />
                          </div>
                        )}

                        {/* Category chip */}
                        {store?.category && (
                          <span className="absolute top-2.5 right-2.5 rounded-lg bg-foreground/75 px-2 py-0.5 text-[0.58rem] font-bold text-white leading-tight backdrop-blur-sm">
                            {store.category}
                          </span>
                        )}

                        {/* Featured badge */}
                        {isFeatured && (
                          <span className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-lg bg-primary/90 px-2 py-0.5 text-[0.56rem] font-bold text-white leading-tight backdrop-blur-sm">
                            <Sparkles className="h-2.5 w-2.5" />
                            مميز
                          </span>
                        )}
                      </div>

                      {/* Title + price (still part of product link) */}
                      <div className="flex flex-col border-t border-border/50 px-3 pt-3 md:px-3.5 md:pt-3.5">
                        <p className="text-[0.8rem] font-bold text-foreground line-clamp-2 leading-[1.45] group-hover:text-primary transition-colors">
                          {product.name_ar}
                        </p>
                        {product.price ? (
                          <p className="mt-2 font-poppins text-[0.88rem] font-extrabold text-primary">
                            {Number(product.price).toLocaleString("ar-EG")} جم
                          </p>
                        ) : product.price_note ? (
                          <p className="mt-2 text-[0.72rem] font-bold text-primary">
                            {product.price_note}
                          </p>
                        ) : null}
                      </div>
                    </Link>

                    {/* Separate store link — sibling, NOT nested inside product link */}
                    {store?.slug && (
                      <Link
                        to={`/stores/${store.slug}`}
                        className="relative z-10 mx-3 mt-2 mb-3 md:mx-3.5 flex items-center justify-between gap-2 rounded-lg border border-border/60 bg-muted/30 px-2.5 py-1.5 text-muted-foreground transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        aria-label={`زيارة محل ${store.name_ar}`}
                      >
                        <span className="flex min-w-0 items-center gap-1.5">
                          {store.logo_url ? (
                            <img
                              src={store.logo_url}
                              alt=""
                              className="h-4 w-4 rounded object-contain border border-border bg-card shrink-0"
                              loading="lazy"
                            />
                          ) : (
                            <Store className="h-3 w-3 shrink-0" />
                          )}
                          <span className="text-[0.66rem] font-semibold line-clamp-1">{store.name_ar}</span>
                        </span>
                        <ArrowUpLeft className="h-3 w-3 shrink-0 opacity-60 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                      </Link>
                    )}
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="p-8 md:p-10 text-center">
                <ShoppingBag className="mx-auto mb-3 h-9 w-9 text-primary/20" />
                <h3 className="text-[0.92rem] font-bold text-foreground">
                  منتجات المحلات — قريباً
                </h3>
                <p className="mx-auto mt-2 max-w-[22rem] text-[0.8rem] leading-[1.7] text-muted-foreground">
                  سوق رقمي يجمع منتجات محلات المول في مكان واحد.
                </p>
                <Link to="/products" className="mt-5 inline-flex">
                  <Button
                    variant="cta"
                    className="h-10 rounded-xl px-6 text-[0.82rem]"
                  >
                    <ShoppingBag className="ml-1.5 h-3.5 w-3.5" /> تصفّح
                    المنتجات
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-7 flex flex-col items-center gap-3">
            <Link to="/products">
              <Button
                variant="cta"
                className="h-11 rounded-xl px-7 text-[0.82rem] font-bold gap-1.5"
              >
                عرض كل المنتجات
                <ArrowLeft className="h-3.5 w-3.5" />
              </Button>
            </Link>
            {!isLoading && products && products.length > 0 && (
              <p className="text-[0.68rem] text-muted-foreground">
                {products.length}+ منتج من {storeCount} محل
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
