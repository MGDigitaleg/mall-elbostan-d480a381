import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead, buildKzProductLd } from "@/components/SEOHead";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingBag, ShoppingCart, CheckCircle, XCircle, ChevronLeft, ChevronRight, ArrowLeft, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useKzCart } from "@/hooks/useKzCart";
import { toast } from "@/hooks/use-toast";
import { sanitizeHtml } from "@/lib/sanitizeHtml";

const KzProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [justAdded, setJustAdded] = useState(false);
  const { addItem, totalItems } = useKzCart();

  const { data: product, isLoading } = useQuery({
    queryKey: ["kz-product", slug],
    queryFn: async () => {
      const { data } = await supabase
        .from("kz_products")
        .select("*, kz_product_variants(*), kz_product_images(*), kz_product_specs(*), kz_categories(name, slug)")
        .eq("slug", slug!)
        .eq("status", "published")
        .single();
      return data;
    },
    enabled: !!slug,
  });

  const { data: relatedProducts } = useQuery({
    queryKey: ["kz-related", product?.category_id],
    queryFn: async () => {
      const { data } = await supabase
        .from("kz_products")
        .select("*, kz_product_variants(price, compare_price, is_default), kz_product_images(image_url, sort_order)")
        .eq("status", "published")
        .eq("category_id", product!.category_id!)
        .neq("id", product!.id)
        .limit(4);
      return data ?? [];
    },
    enabled: !!product?.category_id,
  });

  const variants = useMemo(() => product?.kz_product_variants?.sort((a: any, b: any) => (b.is_default ? 1 : 0) - (a.is_default ? 1 : 0)) ?? [], [product]);
  const images = useMemo(() => product?.kz_product_images?.sort((a: any, b: any) => a.sort_order - b.sort_order) ?? [], [product]);
  const specs = useMemo(() => product?.kz_product_specs?.sort((a: any, b: any) => a.sort_order - b.sort_order) ?? [], [product]);

  const selectedVariant = variants[selectedVariantIdx];
  const inStock = selectedVariant?.stock_qty > 0;

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container max-w-[1200px] py-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <Skeleton className="aspect-square w-full rounded-xl" />
            <div className="space-y-4"><Skeleton className="h-8 w-3/4" /><Skeleton className="h-6 w-1/2" /><Skeleton className="h-20 w-full" /></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="container py-20 text-center">
          <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
          <h1 className="text-[1.2rem] font-bold text-foreground">المنتج غير موجود</h1>
          <Link to="/products" className="mt-4 inline-flex items-center gap-1.5 text-[0.84rem] font-bold text-primary hover:underline">
            العودة للمنتجات <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <SEOHead
        title={product.seo_title || product.title}
        titleEn={product.title}
        description={product.seo_description || product.short_description || product.title}
        ogImage={images[0]?.image_url ?? undefined}
        breadcrumbs={[
          { name: "المنتجات", url: "/products" },
          { name: "Kasr Zero", url: "/products?store=kasr-zero" },
          { name: product.title, url: `/kz/products/${product.slug}` },
        ]}
        jsonLd={buildKzProductLd({
          title: product.title,
          slug: product.slug,
          brand: product.brand,
          short_description: product.short_description,
          description: product.description,
          image: images[0]?.image_url ?? null,
          sku: selectedVariant?.sku ?? null,
          price: selectedVariant?.price ?? null,
          compare_price: selectedVariant?.compare_price ?? null,
          in_stock: inStock,
          condition: product.condition,
        })}
      />

      <section className="py-6 md:py-8" style={{ background: "hsl(var(--background))" }}>
        <div className="container max-w-[1200px]">
          {/* Breadcrumb */}
          <nav className="mb-5 flex items-center gap-1.5 text-[0.72rem] text-muted-foreground">
            <Link to="/products" className="hover:text-primary">المنتجات</Link>
            <ChevronLeft className="h-3 w-3" />
            <Link to="/products?store=kasr-zero" className="hover:text-primary">Kasr Zero</Link>
            <ChevronLeft className="h-3 w-3" />
            <span className="text-foreground font-medium truncate max-w-[200px]">{product.title}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Image Gallery */}
            <div>
              <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-card dark:bg-muted/20">
                {images.length > 0 ? (
                  <img src={images[selectedImageIdx]?.image_url} alt={images[selectedImageIdx]?.alt_text || product.title} className="h-full w-full object-contain p-4" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center"><ShoppingBag className="h-12 w-12 text-muted-foreground/20" /></div>
                )}
                {images.length > 1 && (
                  <>
                    <button onClick={() => setSelectedImageIdx(i => Math.max(0, i - 1))} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-border bg-card/80 p-1.5 backdrop-blur-sm hover:bg-card" disabled={selectedImageIdx === 0}>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    <button onClick={() => setSelectedImageIdx(i => Math.min(images.length - 1, i + 1))} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-border bg-card/80 p-1.5 backdrop-blur-sm hover:bg-card" disabled={selectedImageIdx === images.length - 1}>
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
              {images.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {images.map((img: any, i: number) => (
                    <button key={img.id} onClick={() => setSelectedImageIdx(i)} className={`shrink-0 h-16 w-16 rounded-lg border-2 overflow-hidden bg-card dark:bg-muted/20 transition-all ${i === selectedImageIdx ? "border-primary" : "border-border hover:border-primary/30"}`}>
                      <img src={img.image_url} alt="" className="h-full w-full object-contain p-1" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              {product.brand && <p className="text-[0.72rem] font-bold uppercase tracking-wider text-primary">{product.brand}</p>}
              <h1 className="mt-1 text-[1.3rem] font-extrabold leading-tight text-foreground md:text-[1.6rem]">{product.title}</h1>

              {product.kz_categories && (
                <Link to={`/products?store=kasr-zero`}>
                  <Badge variant="secondary" className="mt-2 text-[0.65rem]">{product.kz_categories.name}</Badge>
                </Link>
              )}

              {/* Price */}
              {selectedVariant && (
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="font-poppins text-[1.6rem] font-extrabold text-foreground">{Number(selectedVariant.price).toLocaleString("ar-EG")} <span className="text-[0.8rem]">ج.م</span></span>
                  {selectedVariant.compare_price && selectedVariant.compare_price > selectedVariant.price && (
                    <span className="font-poppins text-[1rem] text-muted-foreground line-through">{Number(selectedVariant.compare_price).toLocaleString("ar-EG")} ج.م</span>
                  )}
                </div>
              )}

              {/* Stock */}
              <div className="mt-3 flex items-center gap-2">
                {inStock ? (
                  <span className="flex items-center gap-1 text-[0.78rem] font-semibold text-success"><CheckCircle className="h-4 w-4" /> متوفر</span>
                ) : (
                  <span className="flex items-center gap-1 text-[0.78rem] font-semibold text-destructive"><XCircle className="h-4 w-4" /> غير متوفر</span>
                )}
                {product.condition && product.condition !== "new" && (
                  <Badge variant="outline" className="text-[0.6rem]">{product.condition === "used" ? "مستعمل" : product.condition === "refurbished" ? "مجدد" : product.condition}</Badge>
                )}
              </div>

              {/* Variant Selector */}
              {variants.length > 1 && (
                <div className="mt-5">
                  <p className="mb-2 text-[0.78rem] font-bold text-foreground">اختر الموديل</p>
                  <div className="flex flex-wrap gap-2">
                    {variants.map((v: any, i: number) => (
                      <button key={v.id} onClick={() => { setSelectedVariantIdx(i); }} className={`rounded-lg border px-3 py-2 text-[0.76rem] font-semibold transition-all ${i === selectedVariantIdx ? "border-primary bg-primary/5 text-primary" : "border-border bg-card text-foreground hover:border-primary/30"}`}>
                        {v.variant_name || [v.ram, v.storage, v.processor, v.color].filter(Boolean).join(" / ") || `موديل ${i + 1}`}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Variant specs */}
              {selectedVariant && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedVariant.ram && <Badge variant="outline" className="text-[0.65rem]">RAM: {selectedVariant.ram}</Badge>}
                  {selectedVariant.storage && <Badge variant="outline" className="text-[0.65rem]">تخزين: {selectedVariant.storage}</Badge>}
                  {selectedVariant.processor && <Badge variant="outline" className="text-[0.65rem]">معالج: {selectedVariant.processor}</Badge>}
                  {selectedVariant.color && <Badge variant="outline" className="text-[0.65rem]">اللون: {selectedVariant.color}</Badge>}
                  {selectedVariant.sku && <Badge variant="outline" className="text-[0.65rem]">SKU: {selectedVariant.sku}</Badge>}
                </div>
              )}

              {/* Add to Cart */}
              {selectedVariant && (
                <div className="mt-5 flex items-center gap-3">
                  <Button
                    variant="cta"
                    className="h-11 flex-1 gap-2 text-[0.88rem]"
                    disabled={!inStock || justAdded}
                    onClick={() => {
                      addItem({
                        productId: product.id,
                        slug: product.slug,
                        variantId: selectedVariant.id,
                        title: product.title,
                        variantName: selectedVariant.variant_name || [selectedVariant.ram, selectedVariant.storage, selectedVariant.processor, selectedVariant.color].filter(Boolean).join(" / ") || "",
                        price: Number(selectedVariant.price),
                        imageUrl: images[0]?.image_url ?? null,
                      });
                      setJustAdded(true);
                      toast({ title: "تمت الإضافة للسلة" });
                      setTimeout(() => setJustAdded(false), 2000);
                    }}
                  >
                    {justAdded ? <><Check className="h-4 w-4" /> تمت الإضافة</> : <><ShoppingCart className="h-4 w-4" /> أضف للسلة</>}
                  </Button>
                  {totalItems > 0 && (
                    <Link to="/kz/cart">
                      <Button variant="outline" className="h-11 gap-2 text-[0.82rem]">
                        <ShoppingBag className="h-4 w-4" />
                        السلة ({totalItems})
                      </Button>
                    </Link>
                  )}
                </div>
              )}

              {/* Short Description */}
              {product.short_description && (
                <p className="mt-5 text-[0.84rem] leading-[1.8] text-muted-foreground">{product.short_description}</p>
              )}
              {product.description && (
                <div className="mt-4 rounded-xl border border-border bg-card p-4">
                  <p className="mb-2 text-[0.78rem] font-bold text-foreground">الوصف</p>
                  <div
                    className="prose prose-sm max-w-none text-[0.82rem] leading-[1.9] text-muted-foreground [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-1.5 [&_th]:border [&_th]:border-border [&_th]:px-3 [&_th]:py-1.5 [&_th]:bg-secondary/50 [&_th]:text-foreground [&_th]:font-semibold [&_strong]:text-foreground [&_h4]:text-foreground [&_h4]:mt-4 [&_h4]:mb-2 [&_h4]:text-[0.88rem]"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description) }}
                  />
                </div>
              )}

              {/* Specs */}
              {specs.length > 0 && (
                <div className="mt-5">
                  <p className="mb-3 text-[0.78rem] font-bold text-foreground">المواصفات</p>
                  <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
                    {specs.map((spec: any) => (
                      <div key={spec.id} className="flex text-[0.78rem]">
                        <span className="w-[40%] shrink-0 bg-secondary/50 px-4 py-2.5 font-semibold text-foreground">{spec.spec_name}</span>
                        <span className="flex-1 px-4 py-2.5 text-muted-foreground">{spec.spec_value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts && relatedProducts.length > 0 && (
            <div className="mt-12">
              <h2 className="mb-5 text-[1.1rem] font-extrabold text-foreground">منتجات مشابهة</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {relatedProducts.map((rp: any) => {
                  const rv = rp.kz_product_variants?.find((v: any) => v.is_default) ?? rp.kz_product_variants?.[0];
                  const ri = rp.kz_product_images?.sort((a: any, b: any) => a.sort_order - b.sort_order)?.[0];
                  return (
                    <Link key={rp.id} to={`/kz/products/${rp.slug}`} className="group rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-primary/20 hover:shadow-md">
                      <div className="aspect-square overflow-hidden bg-card dark:bg-muted/20">
                        {ri ? <img src={ri.image_url} alt={rp.title} className="h-full w-full object-contain p-3 transition-transform group-hover:scale-105" loading="lazy" /> : <div className="flex h-full w-full items-center justify-center"><ShoppingBag className="h-6 w-6 text-muted-foreground/20" /></div>}
                      </div>
                      <div className="p-3">
                        <p className="text-[0.76rem] font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">{rp.title}</p>
                        {rv && <p className="mt-1 font-poppins text-[0.84rem] font-bold text-foreground">{Number(rv.price).toLocaleString("ar-EG")} ج.م</p>}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default KzProductDetail;
