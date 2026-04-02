import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Store, ExternalLink, ShoppingBag, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("*, stores(name_ar, slug, logo_url, phone, whatsapp), product_categories(name_ar, slug)")
        .eq("slug", slug!)
        .eq("status", "published")
        .single();
      return data;
    },
    enabled: !!slug,
  });

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
          <Link to="/products"><Button variant="outline-blue">العودة للمنتجات</Button></Link>
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

      <section className="py-8 md:py-12" style={{ background: "#FAFAF8" }}>
        <div className="container max-w-5xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[0.78rem] text-muted-foreground mb-6">
            <Link to="/products" className="hover:text-foreground transition-colors">المنتجات</Link>
            {category && (
              <>
                <ArrowRight className="h-3 w-3 rotate-180" />
                <span>{category.name_ar}</span>
              </>
            )}
            <ArrowRight className="h-3 w-3 rotate-180" />
            <span className="text-foreground font-semibold">{product.name_ar}</span>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
            {/* Image */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="aspect-square flex items-center justify-center bg-secondary">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name_ar} className="h-full w-full object-cover" />
                ) : (
                  <ShoppingBag className="h-16 w-16 text-muted-foreground/20" />
                )}
              </div>
            </motion.div>

            {/* Details */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
              {category && (
                <span className="text-[0.74rem] font-semibold text-primary">{category.name_ar}</span>
              )}
              <h1 className="text-xl md:text-2xl font-bold text-foreground">{product.name_ar}</h1>

              {product.brand && (
                <p className="text-[0.84rem] text-muted-foreground">العلامة التجارية: <span className="font-semibold text-foreground">{product.brand}</span></p>
              )}

              {product.price && (
                <div className="rounded-lg border border-border bg-card px-4 py-3">
                  <p className="text-[0.74rem] text-muted-foreground">السعر</p>
                  <p className="font-poppins text-2xl font-extrabold text-foreground">{Number(product.price).toLocaleString("ar-EG")} <span className="text-[0.84rem]">ج.م</span></p>
                  {product.price_note && <p className="mt-1 text-[0.78rem] text-muted-foreground">{product.price_note}</p>}
                </div>
              )}

              {product.short_description_ar && (
                <p className="text-[0.92rem] leading-[1.8] text-muted-foreground">{product.short_description_ar}</p>
              )}

              <div className="flex flex-wrap gap-2.5">
                {product.external_buy_url && (
                  <a href={product.external_buy_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="cta" className="h-10 rounded-lg px-5">
                      <ExternalLink className="ml-2 h-4 w-4" /> اطلب الآن
                    </Button>
                  </a>
                )}
                {store?.whatsapp && (
                  <a href={`https://wa.me/${store.whatsapp}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline-blue" className="h-10 rounded-lg px-5">استفسر عبر واتساب</Button>
                  </a>
                )}
              </div>

              {/* Store card */}
              {store && (
                <Link to={`/stores/${store.slug}`} className="block rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/15 hover:shadow-sm mt-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary">
                      {store.logo_url ? (
                        <img src={store.logo_url} alt={store.name_ar} className="h-8 w-8 object-contain" />
                      ) : (
                        <Store className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="text-[0.88rem] font-bold text-foreground">{store.name_ar}</p>
                      <p className="text-[0.74rem] text-muted-foreground">عرض صفحة المتجر</p>
                    </div>
                  </div>
                </Link>
              )}
            </motion.div>
          </div>

          {/* Long description */}
          {product.long_description_ar && (
            <div className="mt-10 rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg font-bold text-foreground mb-3">تفاصيل المنتج</h2>
              <div className="text-[0.92rem] leading-[1.85] text-muted-foreground whitespace-pre-line">{product.long_description_ar}</div>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default ProductDetail;
