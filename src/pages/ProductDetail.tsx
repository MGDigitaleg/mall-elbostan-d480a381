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
  Ruler,
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

  /* ── Related products from same store ── */
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

  /* ── Gallery images ── */
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

      {/* ═══════════ BREADCRUMB BAR ═══════════ */}
      <div style={{ background: "#F5F2EC", borderBottom: "1px solid #D8DEE8" }}>
        <div className="container max-w-6xl py-2.5">
          <div className="flex items-center gap-1.5 text-[0.72rem]">
            <Link
              to="/products"
              className="font-medium transition-colors hover:text-primary"
              style={{ color: "#64748B" }}
            >
              المنتجات
            </Link>
            {category && (
              <>
                <ChevronLeft className="h-3 w-3" style={{ color: "#94A3B8" }} />
                <Link
                  to={`/products?category=${category.slug}`}
                  className="font-medium transition-colors hover:text-primary"
                  style={{ color: "#64748B" }}
                >
                  {category.name_ar}
                </Link>
              </>
            )}
            <ChevronLeft className="h-3 w-3" style={{ color: "#94A3B8" }} />
            <span className="font-bold" style={{ color: "#0F172A" }}>
              {product.name_ar}
            </span>
          </div>
        </div>
      </div>

      {/* ═══════════ MAIN PRODUCT SECTION ═══════════ */}
      <section className="py-7 md:py-10" style={{ background: "#FAFAF8" }}>
        <div className="container max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
            {/* ── Image column ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              {/* Main image */}
              <div
                className="overflow-hidden rounded-xl"
                style={{ border: "1px solid #D8DEE8", background: "#FFFFFF" }}
              >
                <div className="flex aspect-square items-center justify-center p-4 md:p-6">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name_ar}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <ShoppingBag className="h-16 w-16" style={{ color: "#D8DEE820" }} />
                  )}
                </div>
              </div>

              {/* Gallery thumbnails */}
              {galleryImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {galleryImages.map((img, i) => (
                    <div
                      key={i}
                      className="h-16 w-16 shrink-0 overflow-hidden rounded-lg"
                      style={{
                        border: i === 0 ? "2px solid #2D6BFF" : "1px solid #D8DEE8",
                        background: "#FFFFFF",
                      }}
                    >
                      <img
                        src={img}
                        alt={`${product.name_ar} ${i + 1}`}
                        className="h-full w-full object-contain p-1"
                      />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* ── Details column ── */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col gap-4"
            >
              {/* Category badge */}
              {category && (
                <div>
                  <span
                    className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[0.66rem] font-bold"
                    style={{
                      background: "#2D6BFF12",
                      color: "#2D6BFF",
                      border: "1px solid #2D6BFF20",
                    }}
                  >
                    <Tag className="h-2.5 w-2.5" />
                    {category.name_ar}
                  </span>
                </div>
              )}

              {/* Title */}
              <h1
                className="text-[1.15rem] font-bold leading-tight md:text-[1.35rem]"
                style={{ color: "#0F172A", fontFamily: "var(--font-arabic-display)" }}
              >
                {product.name_ar}
              </h1>

              {/* Brand */}
              {product.brand && (
                <p className="text-[0.78rem]" style={{ color: "#64748B" }}>
                  العلامة التجارية:{" "}
                  <span className="font-bold" style={{ color: "#334155" }}>
                    {product.brand}
                  </span>
                </p>
              )}

              {/* Price card */}
              {(product.price || product.price_note) && (
                <div
                  className="rounded-lg px-4 py-3"
                  style={{ background: "#FFFFFF", border: "1px solid #D8DEE8" }}
                >
                  <p className="text-[0.68rem] font-medium" style={{ color: "#64748B" }}>
                    السعر
                  </p>
                  {product.price ? (
                    <p className="font-poppins text-[1.5rem] font-extrabold" style={{ color: "#0F172A" }}>
                      {Number(product.price).toLocaleString("ar-EG")}{" "}
                      <span className="text-[0.78rem] font-bold" style={{ color: "#64748B" }}>
                        ج.م
                      </span>
                    </p>
                  ) : null}
                  {product.price_note && (
                    <p className="mt-0.5 text-[0.74rem]" style={{ color: "#64748B" }}>
                      {product.price_note}
                    </p>
                  )}
                </div>
              )}

              {/* Short description */}
              {product.short_description_ar && (
                <p
                  className="text-[0.84rem] leading-[1.75]"
                  style={{ color: "#334155" }}
                >
                  {product.short_description_ar}
                </p>
              )}

              {/* SKU */}
              {product.sku && (
                <p className="text-[0.72rem]" style={{ color: "#94A3B8" }}>
                  رمز المنتج: <span className="font-poppins font-semibold">{product.sku}</span>
                </p>
              )}

              {/* CTAs */}
              <div className="flex flex-wrap gap-2.5 pt-1">
                {product.external_buy_url && (
                  <a href={product.external_buy_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="cta" className="h-10 rounded-lg px-6 text-[0.8rem] font-bold">
                      <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                      اطلب الآن
                    </Button>
                  </a>
                )}
                {store?.whatsapp && (
                  <a
                    href={`https://wa.me/${store.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline-blue" className="h-10 rounded-lg px-5 text-[0.8rem]">
                      <MessageCircle className="ml-1.5 h-3.5 w-3.5" />
                      استفسر عبر واتساب
                    </Button>
                  </a>
                )}
                {store?.phone && (
                  <a href={`tel:${store.phone}`}>
                    <Button variant="ghost" className="h-10 rounded-lg px-4 text-[0.8rem]" style={{ color: "#334155" }}>
                      <Phone className="ml-1.5 h-3.5 w-3.5" />
                      اتصل بالمحل
                    </Button>
                  </a>
                )}
              </div>

              {/* ── Store card ── */}
              {store && (
                <Link
                  to={`/stores/${store.slug}`}
                  className="group mt-2 block rounded-xl transition-all hover:shadow-sm"
                  style={{ border: "1px solid #D8DEE8", background: "#FFFFFF" }}
                >
                  <div className="flex items-center gap-3 p-3.5">
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg"
                      style={{ background: "#F8FAFC", border: "1px solid #D8DEE8" }}
                    >
                      {store.logo_url ? (
                        <img
                          src={store.logo_url}
                          alt={store.name_ar}
                          className="h-9 w-9 object-contain"
                        />
                      ) : (
                        <Store className="h-4 w-4" style={{ color: "#2D6BFF" }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[0.82rem] font-bold" style={{ color: "#0F172A" }}>
                        {store.name_ar}
                      </p>
                      <div className="flex items-center gap-2 text-[0.68rem]" style={{ color: "#64748B" }}>
                        {store.category && <span>{store.category}</span>}
                        {store.unit_code && (
                          <>
                            {store.category && <span style={{ color: "#D8DEE8" }}>|</span>}
                            <span>وحدة {store.unit_code}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <ArrowRight
                      className="h-4 w-4 shrink-0 rotate-180 transition-transform group-hover:-translate-x-0.5"
                      style={{ color: "#94A3B8" }}
                    />
                  </div>
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════ LONG DESCRIPTION ═══════════ */}
      {product.long_description_ar && (
        <section style={{ background: "#FFFFFF", borderTop: "1px solid #D8DEE8" }}>
          <div className="container max-w-6xl py-7 md:py-9">
            <div className="max-w-3xl">
              <div className="mb-3 flex items-center gap-2">
                <Package className="h-4 w-4" style={{ color: "#2D6BFF" }} />
                <h2
                  className="text-[1rem] font-bold"
                  style={{ color: "#0F172A", fontFamily: "var(--font-arabic-display)" }}
                >
                  تفاصيل المنتج
                </h2>
              </div>
              <div
                className="text-[0.84rem] leading-[1.85] whitespace-pre-line"
                style={{ color: "#334155" }}
              >
                {product.long_description_ar}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════ RELATED PRODUCTS ═══════════ */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section
          className="py-7 md:py-9"
          style={{ background: "#F5F2EC", borderTop: "1px solid #D8DEE8" }}
        >
          <div className="container max-w-6xl">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p
                  className="text-[0.6rem] font-bold uppercase tracking-[0.18em]"
                  style={{ color: "#CDBB9A" }}
                >
                  من نفس المحل
                </p>
                <h2
                  className="mt-1 text-[1rem] font-bold"
                  style={{ color: "#0F172A", fontFamily: "var(--font-arabic-display)" }}
                >
                  منتجات ذات صلة
                </h2>
              </div>
              {store && (
                <Link to={`/stores/${store.slug}`}>
                  <Button
                    variant="ghost"
                    className="gap-1 text-[0.76rem] font-bold text-primary"
                  >
                    عرض المحل
                    <ArrowRight className="h-3 w-3 rotate-180" />
                  </Button>
                </Link>
              )}
            </div>

            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border sm:grid-cols-4" style={{ borderColor: "#D8DEE8", background: "#D8DEE8" }}>
              {relatedProducts.map((rp) => (
                <Link
                  key={rp.id}
                  to={`/products/${rp.slug}`}
                  className="group flex flex-col transition-colors hover:bg-muted/30"
                  style={{ background: "#FFFFFF" }}
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
                      <ShoppingBag className="h-6 w-6" style={{ color: "#D8DEE830" }} />
                    )}
                  </div>
                  <div className="border-t p-2.5" style={{ borderColor: "#D8DEE8" }}>
                    <p
                      className="text-[0.74rem] font-bold leading-snug line-clamp-2"
                      style={{ color: "#0F172A" }}
                    >
                      {rp.name_ar}
                    </p>
                    {rp.price ? (
                      <p className="mt-1 font-poppins text-[0.78rem] font-bold text-primary">
                        {Number(rp.price).toLocaleString("ar-EG")} ج.م
                      </p>
                    ) : rp.price_note ? (
                      <p className="mt-1 text-[0.68rem] font-semibold text-primary">
                        {rp.price_note}
                      </p>
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
