import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Store,
  ExternalLink,
  ShoppingBag,
  ShoppingCart,
  ArrowRight,
  Tag,
  Phone,
  MessageCircle,
  ChevronLeft,
  Package,
  CheckCircle,
  XCircle,
  ChevronRight,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";
import { useKzCart } from "@/hooks/useKzCart";
import { toast } from "@/hooks/use-toast";

/* ══════════════════════════════════════════════════════════
   Unified Product Detail — handles both mall & KZ products
   ══════════════════════════════════════════════════════════ */

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [justAdded, setJustAdded] = useState(false);
  const { addItem, totalItems } = useKzCart();

  /* ── Try mall product first ── */
  const { data: mallProduct, isLoading: loadingMall } = useQuery({
    queryKey: ["product-mall", slug],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("*, stores(name_ar, slug, logo_url, phone, whatsapp, short_description_ar, category, unit_code), product_categories(name_ar, slug)")
        .eq("slug", slug!)
        .eq("status", "published")
        .maybeSingle();
      return data;
    },
    enabled: !!slug,
  });

  /* ── Try KZ product ── */
  const { data: kzProduct, isLoading: loadingKz } = useQuery({
    queryKey: ["product-kz", slug],
    queryFn: async () => {
      const { data } = await supabase
        .from("kz_products")
        .select("*, kz_product_variants(*), kz_product_images(*), kz_product_specs(*), kz_categories(name, slug)")
        .eq("slug", slug!)
        .eq("status", "published")
        .maybeSingle();
      return data;
    },
    enabled: !!slug,
  });

  const isLoading = loadingMall || loadingKz;
  const isKz = !mallProduct && !!kzProduct;
  const product = mallProduct || kzProduct;

  /* ── Related products ── */
  const { data: relatedMallProducts } = useQuery({
    queryKey: ["related-mall-products", mallProduct?.store_id, mallProduct?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("id, name_ar, slug, price, price_note, image_url")
        .eq("store_id", mallProduct!.store_id!)
        .eq("status", "published")
        .neq("id", mallProduct!.id)
        .limit(4);
      return data ?? [];
    },
    enabled: !!mallProduct?.store_id,
  });

  const { data: relatedKzProducts } = useQuery({
    queryKey: ["related-kz-products", kzProduct?.category_id, kzProduct?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("kz_products")
        .select("*, kz_product_variants(price, compare_price, is_default), kz_product_images(image_url, sort_order)")
        .eq("status", "published")
        .eq("category_id", kzProduct!.category_id!)
        .neq("id", kzProduct!.id)
        .limit(4);
      return data ?? [];
    },
    enabled: !!kzProduct?.category_id,
  });

  /* ── KZ data ── */
  const variants = useMemo(() => kzProduct?.kz_product_variants?.sort((a: any, b: any) => (b.is_default ? 1 : 0) - (a.is_default ? 1 : 0)) ?? [], [kzProduct]);
  const kzImages = useMemo(() => kzProduct?.kz_product_images?.sort((a: any, b: any) => a.sort_order - b.sort_order) ?? [], [kzProduct]);
  const specs = useMemo(() => kzProduct?.kz_product_specs?.sort((a: any, b: any) => a.sort_order - b.sort_order) ?? [], [kzProduct]);
  const selectedVariant = variants[selectedVariantIdx];
  const inStock = selectedVariant?.stock_qty > 0;

  /* ── Mall gallery ── */
  const mallGallery: string[] = useMemo(() => {
    if (!mallProduct) return [];
    const imgs: string[] = [];
    if (mallProduct.image_url) imgs.push(mallProduct.image_url);
    if (mallProduct.gallery && Array.isArray(mallProduct.gallery)) {
      for (const g of mallProduct.gallery) {
        if (typeof g === "string" && g !== mallProduct.image_url) imgs.push(g);
      }
    }
    return imgs;
  }, [mallProduct]);

  /* ── Loading ── */
  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">جاري التحميل...</div>
        </div>
      </MainLayout>
    );
  }

  /* ── Not found ── */
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

  /* ══════════════════════════════════════════
     KZ Product Detail
     ══════════════════════════════════════════ */
  if (isKz && kzProduct) {
    return (
      <MainLayout>
        <SEOHead
          title={kzProduct.seo_title || kzProduct.title}
          titleEn={kzProduct.title}
          description={kzProduct.seo_description || kzProduct.short_description || kzProduct.title}
          breadcrumbs={[
            { name: "المنتجات", url: "/products" },
            { name: kzProduct.title, url: `/products/${kzProduct.slug}` },
          ]}
        />

        <section className="py-6 md:py-8" style={{ background: "hsl(var(--background))" }}>
          <div className="container max-w-[1200px]">
            {/* Breadcrumb */}
            <nav className="mb-5 flex items-center gap-1.5 text-[0.72rem] text-muted-foreground">
              <Link to="/products" className="hover:text-primary">المنتجات</Link>
              <ChevronLeft className="h-3 w-3" />
              <Link to="/products?shop_name=kasr-zero" className="hover:text-primary">Kasr Zero</Link>
              <ChevronLeft className="h-3 w-3" />
              <span className="text-foreground font-medium truncate max-w-[200px]">{kzProduct.title}</span>
            </nav>

            <div className="grid gap-8 lg:grid-cols-2">
              {/* Image Gallery */}
              <div>
                <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-[hsl(210_40%_96.1%)]">
                  {kzImages.length > 0 ? (
                    <img src={kzImages[selectedImageIdx]?.image_url} alt={kzImages[selectedImageIdx]?.alt_text || kzProduct.title} className="h-full w-full object-contain p-[clamp(10px,3%,18px)]" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center"><ShoppingBag className="h-12 w-12 text-muted-foreground/20" /></div>
                  )}
                  {kzImages.length > 1 && (
                    <>
                      <button onClick={() => setSelectedImageIdx(i => Math.max(0, i - 1))} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-border bg-card/80 p-1.5 backdrop-blur-sm hover:bg-card" disabled={selectedImageIdx === 0}>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                      <button onClick={() => setSelectedImageIdx(i => Math.min(kzImages.length - 1, i + 1))} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-border bg-card/80 p-1.5 backdrop-blur-sm hover:bg-card" disabled={selectedImageIdx === kzImages.length - 1}>
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
                {kzImages.length > 1 && (
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                    {kzImages.map((img: any, i: number) => (
                      <button key={img.id} onClick={() => setSelectedImageIdx(i)} className={`shrink-0 h-16 w-16 rounded-lg border-2 overflow-hidden bg-white transition-all ${i === selectedImageIdx ? "border-primary" : "border-border hover:border-primary/30"}`}>
                        <img src={img.image_url} alt="" className="h-full w-full object-contain p-1" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div>
                {kzProduct.brand && <p className="text-[0.72rem] font-bold uppercase tracking-wider text-primary">{kzProduct.brand}</p>}
                <h1 className="mt-1 text-[1.3rem] font-extrabold leading-tight text-foreground md:text-[1.6rem]">{kzProduct.title}</h1>

                {kzProduct.kz_categories && (
                  <Link to={`/products?shop_name=kasr-zero`}>
                    <Badge variant="secondary" className="mt-2 text-[0.65rem]">{(kzProduct.kz_categories as any).name}</Badge>
                  </Link>
                )}

                {selectedVariant && (
                  <div className="mt-4 flex items-baseline gap-3">
                    <span className="font-poppins text-[1.6rem] font-extrabold text-foreground">{Number(selectedVariant.price).toLocaleString("ar-EG")} <span className="text-[0.8rem]">ج.م</span></span>
                    {selectedVariant.compare_price && selectedVariant.compare_price > selectedVariant.price && (
                      <span className="font-poppins text-[1rem] text-muted-foreground line-through">{Number(selectedVariant.compare_price).toLocaleString("ar-EG")} ج.م</span>
                    )}
                  </div>
                )}

                <div className="mt-3 flex items-center gap-2">
                  {inStock ? (
                    <span className="flex items-center gap-1 text-[0.78rem] font-semibold text-success"><CheckCircle className="h-4 w-4" /> متوفر</span>
                  ) : (
                    <span className="flex items-center gap-1 text-[0.78rem] font-semibold text-destructive"><XCircle className="h-4 w-4" /> غير متوفر</span>
                  )}
                  {kzProduct.condition && kzProduct.condition !== "new" && (
                    <Badge variant="outline" className="text-[0.6rem]">{kzProduct.condition === "used" ? "مستعمل" : kzProduct.condition === "refurbished" ? "مجدد" : kzProduct.condition}</Badge>
                  )}
                </div>

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

                {selectedVariant && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedVariant.ram && <Badge variant="outline" className="text-[0.65rem]">RAM: {selectedVariant.ram}</Badge>}
                    {selectedVariant.storage && <Badge variant="outline" className="text-[0.65rem]">تخزين: {selectedVariant.storage}</Badge>}
                    {selectedVariant.processor && <Badge variant="outline" className="text-[0.65rem]">معالج: {selectedVariant.processor}</Badge>}
                    {selectedVariant.color && <Badge variant="outline" className="text-[0.65rem]">اللون: {selectedVariant.color}</Badge>}
                    {selectedVariant.sku && <Badge variant="outline" className="text-[0.65rem]">SKU: {selectedVariant.sku}</Badge>}
                  </div>
                )}

                {selectedVariant && (
                  <div className="mt-5 flex items-center gap-3">
                    <Button
                      variant="cta"
                      className="h-11 flex-1 gap-2 text-[0.88rem]"
                      disabled={!inStock || justAdded}
                      onClick={() => {
                        addItem({
                          productId: kzProduct.id,
                          slug: kzProduct.slug,
                          variantId: selectedVariant.id,
                          title: kzProduct.title,
                          variantName: selectedVariant.variant_name || [selectedVariant.ram, selectedVariant.storage, selectedVariant.processor, selectedVariant.color].filter(Boolean).join(" / ") || "",
                          price: Number(selectedVariant.price),
                          imageUrl: kzImages[0]?.image_url ?? null,
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

                {kzProduct.short_description && (
                  <p className="mt-5 text-[0.84rem] leading-[1.8] text-muted-foreground">{kzProduct.short_description}</p>
                )}
                {kzProduct.description && (
                  <div className="mt-4 rounded-xl border border-border bg-card p-4">
                    <p className="mb-2 text-[0.78rem] font-bold text-foreground">الوصف</p>
                    <div
                      className="prose prose-sm max-w-none text-[0.82rem] leading-[1.9] text-muted-foreground [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-1.5 [&_th]:border [&_th]:border-border [&_th]:px-3 [&_th]:py-1.5 [&_th]:bg-secondary/50 [&_th]:text-foreground [&_th]:font-semibold [&_strong]:text-foreground [&_h4]:text-foreground [&_h4]:mt-4 [&_h4]:mb-2 [&_h4]:text-[0.88rem]"
                      dangerouslySetInnerHTML={{ __html: kzProduct.description }}
                    />
                  </div>
                )}

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

            {/* Related KZ Products */}
            {relatedKzProducts && relatedKzProducts.length > 0 && (
              <div className="mt-12">
                <h2 className="mb-5 text-[1.1rem] font-extrabold text-foreground">منتجات مشابهة</h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {relatedKzProducts.map((rp: any) => {
                    const rv = rp.kz_product_variants?.find((v: any) => v.is_default) ?? rp.kz_product_variants?.[0];
                    const ri = rp.kz_product_images?.sort((a: any, b: any) => a.sort_order - b.sort_order)?.[0];
                    return (
                      <Link key={rp.id} to={`/products/${rp.slug}`} className="group rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-primary/20 hover:shadow-md">
                        <div className="aspect-square overflow-hidden bg-white">
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
  }

  /* ══════════════════════════════════════════
     Mall Product Detail
     ══════════════════════════════════════════ */
  const store = mallProduct?.stores as Record<string, string> | null;
  const category = mallProduct?.product_categories as Record<string, string> | null;

  return (
    <MainLayout>
      <SEOHead
        title={mallProduct!.name_ar}
        titleEn={mallProduct!.name_en ?? undefined}
        description={mallProduct!.short_description_ar ?? `${mallProduct!.name_ar} — متوفر في مول البستان`}
        breadcrumbs={[
          { name: "المنتجات", url: "/products" },
          { name: mallProduct!.name_ar, url: `/products/${slug}` },
        ]}
      />

      {/* Breadcrumb */}
      <div className="border-b border-border bg-background">
        <div className="container max-w-6xl py-2.5">
          <div className="flex items-center gap-1.5 text-[0.72rem]">
            <Link to="/products" className="font-medium text-muted-foreground transition-colors hover:text-primary">المنتجات</Link>
            {category && (
              <>
                <ChevronLeft className="h-3 w-3 text-muted-foreground/50" />
                <Link to={`/products?section=${category.name_ar}`} className="font-medium text-muted-foreground transition-colors hover:text-primary">
                  {category.name_ar}
                </Link>
              </>
            )}
            <ChevronLeft className="h-3 w-3 text-muted-foreground/50" />
            <span className="font-bold text-foreground">{mallProduct!.name_ar}</span>
          </div>
        </div>
      </div>

      {/* Main */}
      <section className="py-7 md:py-10 bg-card">
        <div className="container max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
            {/* Image */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
              <div className="overflow-hidden rounded-xl border border-border bg-white">
                <div className="flex aspect-square items-center justify-center p-4 md:p-6">
                  {mallProduct!.image_url ? (
                    <img src={mallProduct!.image_url} alt={mallProduct!.name_ar} className="h-full w-full object-contain" />
                  ) : (
                    <ShoppingBag className="h-16 w-16 text-border/30" />
                  )}
                </div>
              </div>
              {mallGallery.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {mallGallery.map((img, i) => (
                    <div key={i} className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-white ${i === 0 ? "border-primary border-2" : "border-border"}`}>
                      <img src={img} alt={`${mallProduct!.name_ar} ${i + 1}`} className="h-full w-full object-contain p-1" />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Details */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col gap-4">
              {category && (
                <div>
                  <span className="inline-flex items-center gap-1 rounded-md border border-primary/20 bg-primary/8 px-2 py-0.5 text-[0.66rem] font-bold text-primary">
                    <Tag className="h-2.5 w-2.5" />
                    {category.name_ar}
                  </span>
                </div>
              )}
              <h1 className="text-[1.15rem] font-bold leading-tight text-foreground md:text-[1.35rem]" style={{ fontFamily: "var(--font-arabic-display)" }}>
                {mallProduct!.name_ar}
              </h1>
              {mallProduct!.brand && (
                <p className="text-[0.78rem] text-muted-foreground">
                  العلامة التجارية: <span className="font-bold text-foreground/80">{mallProduct!.brand}</span>
                </p>
              )}
              {(mallProduct!.price || mallProduct!.price_note) && (
                <div className="rounded-lg border border-border bg-white px-4 py-3">
                  <p className="text-[0.68rem] font-medium text-muted-foreground">السعر</p>
                  {mallProduct!.price ? (
                    <p className="font-poppins text-[1.5rem] font-extrabold text-foreground">
                      {Number(mallProduct!.price).toLocaleString("ar-EG")}{" "}
                      <span className="text-[0.78rem] font-bold text-muted-foreground">ج.م</span>
                    </p>
                  ) : null}
                  {mallProduct!.price_note && (
                    <p className="mt-0.5 text-[0.74rem] text-muted-foreground">{mallProduct!.price_note}</p>
                  )}
                </div>
              )}
              {mallProduct!.short_description_ar && (
                <p className="text-[0.84rem] leading-[1.75] text-foreground/75">{mallProduct!.short_description_ar}</p>
              )}
              {mallProduct!.sku && (
                <p className="text-[0.72rem] text-muted-foreground/60">
                  رمز المنتج: <span className="font-poppins font-semibold">{mallProduct!.sku}</span>
                </p>
              )}
              <div className="flex flex-wrap gap-2.5 pt-1">
                {mallProduct!.external_buy_url && (
                  <a href={mallProduct!.external_buy_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="cta" className="h-10 rounded-lg px-6 text-[0.8rem] font-bold gap-1.5">
                      <ExternalLink className="h-3.5 w-3.5" /> اطلب الآن
                    </Button>
                  </a>
                )}
                {store?.whatsapp && (
                  <a href={`https://wa.me/${store.whatsapp}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline-blue" className="h-10 rounded-lg px-5 text-[0.8rem] gap-1.5">
                      <MessageCircle className="h-3.5 w-3.5" /> استفسر عبر واتساب
                    </Button>
                  </a>
                )}
                {store?.phone && (
                  <a href={`tel:${store.phone}`}>
                    <Button variant="ghost" className="h-10 rounded-lg px-4 text-[0.8rem] text-foreground/70 gap-1.5">
                      <Phone className="h-3.5 w-3.5" /> اتصل بالمحل
                    </Button>
                  </a>
                )}
              </div>
              {store && (
                <Link to={`/stores/${store.slug}`} className="group mt-2 block rounded-xl border border-border bg-white transition-all hover:shadow-sm">
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

      {/* Long description */}
      {mallProduct!.long_description_ar && (
        <section className="border-t border-border bg-white">
          <div className="container max-w-6xl py-7 md:py-9">
            <div className="max-w-3xl">
              <div className="mb-3 flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                <h2 className="text-[1rem] font-bold text-foreground" style={{ fontFamily: "var(--font-arabic-display)" }}>تفاصيل المنتج</h2>
              </div>
              <div className="text-[0.84rem] leading-[1.85] whitespace-pre-line text-foreground/70">
                {mallProduct!.long_description_ar}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related mall products */}
      {relatedMallProducts && relatedMallProducts.length > 0 && (
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
                    عرض المحل <ArrowRight className="h-3 w-3 rotate-180" />
                  </Button>
                </Link>
              )}
            </div>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4">
              {relatedMallProducts.map((rp) => (
                <Link key={rp.id} to={`/products/${rp.slug}`} className="group flex flex-col bg-white transition-colors hover:bg-secondary/40">
                  <div className="flex aspect-square items-center justify-center p-3">
                    {rp.image_url ? (
                      <img src={rp.image_url} alt={rp.name_ar} className="h-full w-full object-contain transition-transform group-hover:scale-105" loading="lazy" />
                    ) : (
                      <ShoppingBag className="h-6 w-6 text-border/40" />
                    )}
                  </div>
                  <div className="border-t border-border p-2.5">
                    <p className="text-[0.74rem] font-bold leading-snug text-foreground line-clamp-2">{rp.name_ar}</p>
                    {rp.price ? (
                      <p className="mt-1 font-poppins text-[0.78rem] font-bold text-primary">{Number(rp.price).toLocaleString("ar-EG")} ج.م</p>
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
