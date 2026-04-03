import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import {
  Store,
  ExternalLink,
  ShoppingBag,
  ArrowRight,
  Tag,
  Phone,
  MessageCircle,
  ChevronLeft,
  Package,
} from "lucide-react";
import { motion } from "framer-motion";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select(
          "*, stores(name_ar, slug, logo_url, phone, whatsapp, short_description_ar, category, unit_code), product_categories(name_ar, slug)",
        )
        .eq("slug", slug!)
        .eq("status", "published")
        .single();
      return data;
    },
    enabled: !!slug,
  });

  const { data: relatedProducts } = useQuery({
    queryKey: ["related-products", product?.store_id, product?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("id, name_ar, slug, price, price_note, image_url")
        .eq("store_id", product!.store_id!)
        .eq("status", "published")
        .neq("id", product!.id)
        .limit(4);
      return data ?? [];
    },
    enabled: !!product?.store_id,
  });

  const galleryImages: string[] = (() => {
    if (!product) return [];
    const imgs: string[] = [];
    if (product.image_url) imgs.push(product.image_url);
    if (product.gallery && Array.isArray(product.gallery)) {
      for (const g of product.gallery) {
        if (typeof g === "string" && g !== product.image_url) imgs.push(g);
      }
    }
    return imgs;
  })();

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">جاري التحميل...</div>
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
          <ShoppingBag className="h-12 w-12 text-muted-foreground/30" />
          <p className="text-lg font-bold text-foreground">المنتج غير موجود</p>
          <Link to="/products">
            <Button variant="outline-blue">العودة للمنتجات</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const store = product.stores as Record<string, string> | null;
  const category = product.product_categories as Record<string, string> | null;

  return (
    <MainLayout>
      <SEOHead
        title={product.name_ar}
        titleEn={product.name_en ?? undefined}
        description={product.short_description_ar ?? `${product.name_ar} — متوفر في مول البستان`}
        breadcrumbs={[
          { name: "المنتجات", url: "/products" },
          { name: product.name_ar, url: `/products/${slug}` },
        ]}
      />

      {/* ═══════════ BREADCRUMB ═══════════ */}
      <div className="border-b border-border bg-background">
        <div className="container max-w-6xl py-2.5">
          <div className="flex items-center gap-1.5 text-[0.72rem]">
            <Link to="/products" className="font-medium text-muted-foreground transition-colors hover:text-primary">
              المنتجات
            </Link>
            {category && (
              <>
                <ChevronLeft className="h-3 w-3 text-muted-foreground/50" />
                <Link
                  to={`/products?category=${category.slug}`}
                  className="font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  {category.name_ar}
                </Link>
              </>
            )}
            <ChevronLeft className="h-3 w-3 text-muted-foreground/50" />
            <span className="font-bold text-foreground">{product.name_ar}</span>
          </div>
        </div>
      </div>

      {/* ═══════════ MAIN ═══════════ */}
      <section className="py-7 md:py-10 bg-card">
        <div className="container max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
            {/* ── Image ── */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
              <div className="overflow-hidden rounded-xl border border-border bg-white">
                <div className="flex aspect-square items-center justify-center p-4 md:p-6">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name_ar} className="h-full w-full object-contain" />
                  ) : (
                    <ShoppingBag className="h-16 w-16 text-border/30" />
                  )}
                </div>
              </div>

              {galleryImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {galleryImages.map((img, i) => (
                    <div
                      key={i}
                      className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-white ${i === 0 ? "border-primary border-2" : "border-border"}`}
                    >
                      <img src={img} alt={`${product.name_ar} ${i + 1}`} className="h-full w-full object-contain p-1" />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* ── Details ── */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col gap-4"
            >
              {category && (
                <div>
                  <span className="inline-flex items-center gap-1 rounded-md border border-primary/20 bg-primary/8 px-2 py-0.5 text-[0.66rem] font-bold text-primary">
                    <Tag className="h-2.5 w-2.5" />
                    {category.name_ar}
                  </span>
                </div>
              )}

              <h1 className="text-[1.15rem] font-bold leading-tight text-foreground md:text-[1.35rem]" style={{ fontFamily: "var(--font-arabic-display)" }}>
                {product.name_ar}
              </h1>

              {product.brand && (
                <p className="text-[0.78rem] text-muted-foreground">
                  العلامة التجارية: <span className="font-bold text-foreground/80">{product.brand}</span>
                </p>
              )}

              {(product.price || product.price_note) && (
                <div className="rounded-lg border border-border bg-white px-4 py-3">
                  <p className="text-[0.68rem] font-medium text-muted-foreground">السعر</p>
                  {product.price ? (
                    <p className="font-poppins text-[1.5rem] font-extrabold text-foreground">
                      {Number(product.price).toLocaleString("ar-EG")}{" "}
                      <span className="text-[0.78rem] font-bold text-muted-foreground">ج.م</span>
                    </p>
                  ) : null}
                  {product.price_note && (
                    <p className="mt-0.5 text-[0.74rem] text-muted-foreground">{product.price_note}</p>
                  )}
                </div>
              )}

              {product.short_description_ar && (
                <p className="text-[0.84rem] leading-[1.75] text-foreground/75">{product.short_description_ar}</p>
              )}

              {product.sku && (
                <p className="text-[0.72rem] text-muted-foreground/60">
                  رمز المنتج: <span className="font-poppins font-semibold">{product.sku}</span>
                </p>
              )}

              {/* CTAs */}
              <div className="flex flex-wrap gap-2.5 pt-1">
                {product.external_buy_url && (
                  <a href={product.external_buy_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="cta" className="h-10 rounded-lg px-6 text-[0.8rem] font-bold gap-1.5">
                      <ExternalLink className="h-3.5 w-3.5" />
                      اطلب الآن
                    </Button>
                  </a>
                )}
                {store?.whatsapp && (
                  <a href={`https://wa.me/${store.whatsapp}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline-blue" className="h-10 rounded-lg px-5 text-[0.8rem] gap-1.5">
                      <MessageCircle className="h-3.5 w-3.5" />
                      استفسر عبر واتساب
                    </Button>
                  </a>
                )}
                {store?.phone && (
                  <a href={`tel:${store.phone}`}>
                    <Button variant="ghost" className="h-10 rounded-lg px-4 text-[0.8rem] text-foreground/70 gap-1.5">
                      <Phone className="h-3.5 w-3.5" />
                      اتصل بالمحل
                    </Button>
                  </a>
                )}
              </div>

              {/* Store card */}
              {store && (
                <Link
                  to={`/stores/${store.slug}`}
                  className="group mt-2 block rounded-xl border border-border bg-white transition-all hover:shadow-sm"
                >
                  <div className="flex items-center gap-3 p-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-secondary">
                      {store.logo_url ? (
                        <img src={store.logo_url} alt={store.name_ar} className="h-9 w-9 object-contain" />
                      ) : (
                        <Store className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[0.82rem] font-bold text-foreground">{store.name_ar}</p>
                      <div className="flex items-center gap-2 text-[0.68rem] text-muted-foreground">
                        {store.category && <span>{store.category}</span>}
                        {store.unit_code && (
                          <>
                            {store.category && <span className="text-border">|</span>}
                            <span>وحدة {store.unit_code}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 rotate-180 text-muted-foreground/50 transition-transform group-hover:-translate-x-0.5" />
                  </div>
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════ LONG DESCRIPTION ═══════════ */}
      {product.long_description_ar && (
        <section className="border-t border-border bg-white">
          <div className="container max-w-6xl py-7 md:py-9">
            <div className="max-w-3xl">
              <div className="mb-3 flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                <h2 className="text-[1rem] font-bold text-foreground" style={{ fontFamily: "var(--font-arabic-display)" }}>
                  تفاصيل المنتج
                </h2>
              </div>
              <div className="text-[0.84rem] leading-[1.85] whitespace-pre-line text-foreground/70">
                {product.long_description_ar}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════ RELATED PRODUCTS ═══════════ */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="border-t border-border bg-background py-7 md:py-9">
          <div className="container max-w-6xl">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="section-kicker">من نفس المحل</p>
                <h2 className="section-title mt-1">منتجات ذات صلة</h2>
              </div>
              {store && (
                <Link to={`/stores/${store.slug}`}>
                  <Button variant="ghost" className="gap-1 text-[0.76rem] font-bold text-primary">
                    عرض المحل
                    <ArrowRight className="h-3 w-3 rotate-180" />
                  </Button>
                </Link>
              )}
            </div>

            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4">
              {relatedProducts.map((rp) => (
                <Link
                  key={rp.id}
                  to={`/products/${rp.slug}`}
                  className="group flex flex-col bg-white transition-colors hover:bg-secondary/40"
                >
                  <div className="flex aspect-square items-center justify-center p-3">
                    {rp.image_url ? (
                      <img
                        src={rp.image_url}
                        alt={rp.name_ar}
                        className="h-full w-full object-contain transition-transform group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <ShoppingBag className="h-6 w-6 text-border/40" />
                    )}
                  </div>
                  <div className="border-t border-border p-2.5">
                    <p className="text-[0.74rem] font-bold leading-snug text-foreground line-clamp-2">{rp.name_ar}</p>
                    {rp.price ? (
                      <p className="mt-1 font-poppins text-[0.78rem] font-bold text-primary">
                        {Number(rp.price).toLocaleString("ar-EG")} ج.م
                      </p>
                    ) : rp.price_note ? (
                      <p className="mt-1 text-[0.68rem] font-semibold text-primary">{rp.price_note}</p>
                    ) : null}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </MainLayout>
  );
};

export default ProductDetail;
