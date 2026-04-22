import { useMemo, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowUpLeft, Clock3, Globe, Layers3, Mail, MapPin,
  Phone, Store, ExternalLink, ShoppingBag, ChevronLeft,
  Tag, Building2, Compass, MessageCircle, Copy, Check,
  Share2, Shield, Monitor, Gamepad2, Sparkles,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead, buildStoreLd } from "@/components/SEOHead";
import { getStoreOgImage, getStoreOgAlt, OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT } from "@/lib/ogImageUtils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { TenantLogo } from "@/components/TenantLogo";
import { getVerifiedLogoUrl } from "@/lib/tenantLogoRegistry";
import fallbackCover from "@/assets/mall-interior.webp";

/* ── Animations ── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };
const fadeChild = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

/* ── Category context ── */
const categoryStory: Record<string, { title: string; desc: string; icon: typeof Tag; color: string }> = {
  "الهواتف والإكسسوارات": { title: "حلول اتصال واستخدام يومي", desc: "أجهزة، إكسسوارات، وتحديثات سريعة تلبي احتياجاتك اليومية.", icon: Phone, color: "217 91% 60%" },
  "الكمبيوتر والأجهزة": { title: "أجهزة للعمل والأداء", desc: "حواسيب، ملحقات، وتجهيزات الإنتاجية والعمل الاحترافي.", icon: Monitor, color: "262 83% 58%" },
  "الألعاب والترفيه": { title: "تجربة ألعاب متقدمة", desc: "عتاد وملحقات الترفيه الرقمي للاعبين المحترفين.", icon: Gamepad2, color: "142 71% 45%" },
  "الطباعة والتصوير": { title: "خدمات تدعم الأعمال", desc: "حلول الطباعة والتصوير لكل احتياجات مشروعك.", icon: Layers3, color: "25 95% 53%" },
  "الشبكات والحماية": { title: "بنية تقنية جاهزة", desc: "شبكات، أمن تقني، واتصال مستقر لعملك.", icon: Shield, color: "199 89% 48%" },
  "الصيانة والدعم الفني": { title: "خدمات دعم واستمرارية", desc: "صيانة ودعم فني متخصص على يد خبراء.", icon: Compass, color: "340 75% 55%" },
};

const StoreDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: store, isLoading } = useQuery({
    queryKey: ["store", slug],
    queryFn: async () => {
      const { data } = await supabase.from("stores").select("*").eq("slug", slug!).maybeSingle();
      return data;
    },
    enabled: !!slug,
  });

  const { data: relatedStores } = useQuery({
    queryKey: ["related-stores", store?.category, store?.id],
    queryFn: async () => {
      if (!store?.category) return [];
      const { data } = await supabase
        .from("stores")
        .select("id, slug, name_ar, logo_url, category, unit_code, short_description_ar")
        .eq("category", store.category)
        .neq("id", store.id)
        .neq("status", "hidden")
        .limit(4);
      return data ?? [];
    },
    enabled: !!store?.category && !!store?.id,
  });

  const isKzStore = store?.slug === "kasr-zero";

  const { data: storeProducts } = useQuery({
    queryKey: ["store-products", store?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("id, name_ar, slug, price, price_note, image_url, brand")
        .eq("store_id", store!.id)
        .eq("status", "published")
        .limit(6);
      return data ?? [];
    },
    enabled: !!store?.id && !isKzStore,
  });

  const { data: kzProducts } = useQuery({
    queryKey: ["kz-store-products"],
    queryFn: async () => {
      const { data } = await supabase
        .from("kz_products")
        .select("id, title, slug, kz_product_variants(price, compare_price, is_default), kz_product_images(image_url, sort_order)")
        .eq("status", "published")
        .limit(6);
      return data ?? [];
    },
    enabled: isKzStore,
  });

  const gallery = useMemo(() => {
    if (!store?.gallery || !Array.isArray(store.gallery)) return [];
    return store.gallery.filter((item): item is string => typeof item === "string");
  }, [store?.gallery]);

  const activeStory = store?.category ? categoryStory[store.category] : null;
  const heroImage = store?.cover_image_url ?? gallery[0] ?? fallbackCover;

  /* ── Loading ── */
  if (isLoading) {
    return (
      <MainLayout>
        <div style={{ background: "var(--gradient-hero)" }}>
          <div className="container max-w-6xl py-20">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="h-5 w-28 animate-pulse rounded-lg" style={{ background: "hsl(0 0% 100% / 0.08)" }} />
                <div className="h-10 w-3/4 animate-pulse rounded-lg" style={{ background: "hsl(0 0% 100% / 0.08)" }} />
                <div className="h-4 w-full animate-pulse rounded-lg" style={{ background: "hsl(0 0% 100% / 0.06)" }} />
                <div className="h-4 w-2/3 animate-pulse rounded-lg" style={{ background: "hsl(0 0% 100% / 0.06)" }} />
              </div>
              <div className="aspect-[4/3] animate-pulse rounded-2xl" style={{ background: "hsl(0 0% 100% / 0.06)" }} />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  /* ── Not found ── */
  if (!store) {
    return (
      <MainLayout>
        <div className="container max-w-5xl py-24 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-muted/30">
            <Store className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="mb-3 text-2xl font-bold text-foreground">المتجر غير موجود</h1>
          <p className="mb-6 text-sm text-muted-foreground">لم يتم العثور على المتجر المطلوب</p>
          <Link to="/stores"><Button variant="outline-blue">العودة لدليل المحلات</Button></Link>
        </div>
      </MainLayout>
    );
  }

  const storyColor = activeStory?.color ?? "var(--primary)";

  return (
    <MainLayout>
      <SEOHead
        title={`${store.name_ar} — محل ${store.category ?? "تكنولوجيا"} في مول البستان`}
        description={store.short_description_ar ?? `${store.name_ar} — محل ${store.category ?? "تكنولوجيا وإلكترونيات"} في مول البستان، التجمع الخامس، القاهرة الجديدة. تصفّح المنتجات وتواصل مباشرة.`}
        ogImage={getStoreOgImage(store)}
        ogImageWidth={OG_IMAGE_WIDTH}
        ogImageHeight={OG_IMAGE_HEIGHT}
        ogImageAlt={getStoreOgAlt(store.name_ar, store.category)}
        keywords={`${store.name_ar}, ${store.name_en ?? ''}, ${store.category ?? 'تكنولوجيا'}, مول البستان, التجمع الخامس, القاهرة الجديدة, محل ${store.category ?? 'إلكترونيات'}`}
        breadcrumbs={[{ name: "المحلات", url: "/stores" }, { name: store.name_ar, url: `/stores/${store.slug}` }]}
        jsonLd={buildStoreLd(store)}
      />

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <img src={heroImage} alt={`${store.name_ar} — غلاف المحل`} className="h-full w-full object-cover" loading="eager" decoding="async" style={{ filter: "saturate(0.6) brightness(0.35) contrast(1.1)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, hsla(218, 55%, 7%, 0.75) 0%, hsla(218, 55%, 7%, 0.92) 60%, hsla(218, 55%, 7%, 0.98) 100%)" }} />
        </div>

        {/* Ambient decorative elements */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-1/3 h-[500px] w-[500px] rounded-full opacity-[0.08]"
               style={{ background: `radial-gradient(circle, hsl(${storyColor}), transparent 70%)` }} />
          <div className="absolute bottom-0 right-1/4 h-[350px] w-[550px] rounded-full opacity-[0.05]"
               style={{ background: "radial-gradient(circle, hsl(220 80% 55%), transparent 70%)" }} />
          <div className="absolute inset-0 opacity-[0.015]"
               style={{ backgroundImage: "linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
        </div>

        <div className="container relative max-w-6xl pb-14 pt-6 md:pb-20 md:pt-10">
          {/* Breadcrumb */}
          <motion.nav initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                      className="mb-8 flex items-center gap-2 text-[0.74rem] font-medium">
            <Link to="/" className="text-white/30 transition-colors hover:text-white/55">الرئيسية</Link>
            <ChevronLeft className="h-3 w-3 text-white/20" />
            <Link to="/stores" className="text-white/30 transition-colors hover:text-white/55">المحلات</Link>
            <ChevronLeft className="h-3 w-3 text-white/20" />
            <span className="text-white/60">{store.name_ar}</span>
          </motion.nav>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="max-w-2xl space-y-6">
            {/* Logo + Name */}
            <div className="flex items-center gap-5">
              <div
                    className="flex shrink-0 items-center justify-center rounded-2xl backdrop-blur-sm"
                    style={{
                      background: "linear-gradient(145deg, hsl(0 0% 100% / 0.1), hsl(0 0% 100% / 0.04))",
                      border: "1px solid hsl(0 0% 100% / 0.14)",
                      boxShadow: "0 8px 32px hsl(220 60% 5% / 0.4), inset 0 1px 0 hsl(0 0% 100% / 0.08)",
                      padding: 6,
                    }}>
                <TenantLogo
                  src={getVerifiedLogoUrl(store.slug, store.logo_url)}
                  alt={store.name_ar}
                  fallbackName={store.name_ar}
                  size="lg"
                  rounded="xl"
                  darkContext
                />
              </div>
              <div>
                <h1 className="text-[1.85rem] font-bold leading-[1.1] text-white md:text-[2.5rem]"
                    style={{ fontFamily: "var(--font-arabic-display)" }}>
                  {store.name_ar}
                </h1>
                {store.name_en && (
                  <p className="mt-1.5 font-poppins text-[0.85rem] font-medium tracking-wider text-white/25">{store.name_en}</p>
                )}
              </div>
            </div>

            {/* Badge row */}
            <div className="flex flex-wrap items-center gap-2">
              {store.category && (
                <span className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.72rem] font-semibold backdrop-blur-sm"
                      style={{
                        background: `hsl(${storyColor} / 0.12)`,
                        border: `1px solid hsl(${storyColor} / 0.22)`,
                        color: `hsl(${storyColor})`,
                      }}>
                  <Tag className="h-3 w-3" />{store.category}
                </span>
              )}
              {store.unit_code && (
                <span className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.72rem] font-bold backdrop-blur-sm"
                      style={{ background: "hsl(var(--primary) / 0.12)", border: "1px solid hsl(var(--primary) / 0.22)", color: "hsl(var(--primary))" }}>
                  <Building2 className="h-3 w-3" />وحدة {store.unit_code}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.72rem] font-semibold backdrop-blur-sm"
                    style={{
                      background: store.status === "available" ? "hsl(25 95% 55% / 0.12)" : "hsl(155 70% 40% / 0.12)",
                      border: `1px solid ${store.status === "available" ? "hsl(25 95% 55% / 0.22)" : "hsl(155 70% 40% / 0.22)"}`,
                      color: store.status === "available" ? "hsl(25 95% 70%)" : "hsl(155 70% 65%)",
                    }}>
                <div className="h-1.5 w-1.5 rounded-full animate-pulse"
                     style={{ background: store.status === "available" ? "hsl(25 95% 55%)" : "hsl(155 70% 50%)",
                              boxShadow: `0 0 6px ${store.status === "available" ? "hsl(25 95% 55% / 0.5)" : "hsl(155 70% 40% / 0.5)"}` }} />
                {store.status === "available" ? "فرصة متاحة" : "نشط"}
              </span>
              {store.featured && (
                <span className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[0.66rem] font-bold backdrop-blur-sm"
                      style={{ background: "hsl(45 93% 47% / 0.12)", border: "1px solid hsl(45 93% 47% / 0.2)", color: "hsl(45 93% 65%)" }}>
                  <Sparkles className="h-2.5 w-2.5" />مميّز
                </span>
              )}
            </div>

            {/* Description */}
            {(store.short_description_ar || store.long_description_ar) && (
              <p className="max-w-lg text-[0.88rem] leading-[2] text-white/40">
                {store.short_description_ar ?? "متجر ضمن منظومة مول البستان التقنية."}
              </p>
            )}

            {/* Hero CTAs */}
            <div className="flex flex-wrap gap-2.5 pt-1">
              {store.whatsapp && (
                <a href={`https://wa.me/${store.whatsapp}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="cta" className="h-11 gap-2 rounded-xl px-6 text-[0.82rem] font-bold shadow-lg shadow-primary/25">
                    <MessageCircle className="h-4 w-4" />تواصل واتساب
                  </Button>
                </a>
              )}
              {store.phone && (
                <a href={`tel:${store.phone}`}>
                  <Button className="h-11 gap-2 rounded-xl px-6 text-[0.82rem] font-bold text-white transition-all hover:bg-white/12"
                          style={{ background: "hsl(0 0% 100% / 0.08)", border: "1px solid hsl(0 0% 100% / 0.15)" }}>
                    <Phone className="h-4 w-4" />اتصل الآن
                  </Button>
                </a>
              )}
              <ShareButton name={store.name_ar} />
            </div>
          </motion.div>
        </div>

        {/* Bottom accent */}
        <div className="h-px w-full" style={{ background: "linear-gradient(to left, transparent, hsl(var(--primary) / 0.25), transparent)" }} />
      </section>

      {/* ═══════════ CONTENT ═══════════ */}
      <div style={{ background: "hsl(var(--background))" }}>
        <div className="container max-w-6xl py-10 md:py-14">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">

            {/* ── Main column ── */}
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} className="space-y-6">

              {/* About section */}
              {(store.long_description_ar || store.short_description_ar) && (
                <motion.div variants={fadeChild}>
                  <div className="rounded-2xl border border-border/70 bg-card p-6 md:p-8 shadow-[var(--shadow-card)]">
                    <div className="mb-5 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl"
                           style={{ background: `hsl(${storyColor} / 0.08)`, border: `1px solid hsl(${storyColor} / 0.12)` }}>
                        <Store className="h-5 w-5" style={{ color: `hsl(${storyColor})` }} />
                      </div>
                      <div>
                        <h2 className="text-[1rem] font-bold text-foreground" style={{ fontFamily: "var(--font-arabic-display)" }}>
                          عن {store.name_ar}
                        </h2>
                        {store.name_en && (
                          <p className="text-[0.68rem] font-medium text-muted-foreground/60 font-poppins">{store.name_en}</p>
                        )}
                      </div>
                    </div>
                    <p className="text-[0.86rem] leading-[2.2] text-muted-foreground">
                      {store.long_description_ar ?? store.short_description_ar}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Category context */}
              {activeStory && (
                <motion.div variants={fadeChild}>
                  <div className="flex items-start gap-4 rounded-2xl border p-5 md:p-6 shadow-[var(--shadow-soft)]"
                       style={{
                         background: `linear-gradient(135deg, hsl(${storyColor} / 0.03), hsl(${storyColor} / 0.01))`,
                         borderColor: `hsl(${storyColor} / 0.12)`,
                       }}>
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                         style={{ background: `hsl(${storyColor} / 0.08)`, border: `1px solid hsl(${storyColor} / 0.15)` }}>
                      <activeStory.icon className="h-5 w-5" style={{ color: `hsl(${storyColor})` }} />
                    </div>
                    <div>
                      <p className="text-[0.88rem] font-bold text-foreground">{activeStory.title}</p>
                      <p className="mt-1.5 text-[0.8rem] leading-[1.8] text-muted-foreground">{activeStory.desc}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Gallery */}
              {gallery.length > 1 && (
                <motion.div variants={fadeChild}>
                  <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-card)]">
                    <div className="border-b border-border px-5 py-4">
                      <h2 className="text-[0.88rem] font-bold text-foreground">معرض الصور</h2>
                    </div>
                    <div className="grid gap-1.5 p-2 sm:grid-cols-2">
                      {gallery.slice(0, 4).map((image, i) => (
                        <div key={`${image}-${i}`} className="aspect-[4/3] overflow-hidden rounded-xl">
                          <img src={image} alt={`${store.name_ar} ${i + 1}`}
                               className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy" />
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Store Products */}
              {storeProducts && storeProducts.length > 0 && (
                <motion.div variants={fadeChild}>
                  <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-card)]">
                    <div className="flex items-center justify-between border-b border-border px-5 py-4 md:px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/8">
                          <ShoppingBag className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h2 className="text-[0.92rem] font-bold text-foreground">منتجات المتجر</h2>
                          <p className="text-[0.66rem] text-muted-foreground">{storeProducts.length} منتج متوفر</p>
                        </div>
                      </div>
                      <Link to="/products"
                            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-[0.72rem] font-semibold text-primary transition-colors hover:bg-primary/5">
                        عرض الكل <ChevronLeft className="h-3 w-3" />
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-3">
                      {storeProducts.map((product) => (
                        <Link key={product.id} to={`/products/${product.slug}`}
                              className="group flex flex-col bg-card p-4 transition-colors hover:bg-muted/20">
                          <div className="mb-3 aspect-square overflow-hidden rounded-xl border border-border bg-white dark:bg-muted/30">
                            {product.image_url ? (
                              <img src={product.image_url} alt={product.name_ar}
                                   className="h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <ShoppingBag className="h-7 w-7 text-muted-foreground/20" />
                              </div>
                            )}
                          </div>
                          <p className="text-[0.8rem] font-bold leading-snug text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                            {product.name_ar}
                          </p>
                          {product.brand && <p className="mt-1 text-[0.68rem] text-muted-foreground">{product.brand}</p>}
                          {product.price && (
                            <p className="mt-2 text-[0.84rem] font-bold text-primary">{product.price.toLocaleString("ar-EG")} ج.م</p>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* KZ Products (Kasr Zero e-commerce) */}
              {isKzStore && kzProducts && kzProducts.length > 0 && (
                <motion.div variants={fadeChild}>
                  <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-card)]">
                    <div className="flex items-center justify-between border-b border-border px-5 py-4 md:px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/8">
                          <ShoppingBag className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h2 className="text-[0.92rem] font-bold text-foreground">منتجات المتجر</h2>
                          <p className="text-[0.66rem] text-muted-foreground">{kzProducts.length} منتج متوفر</p>
                        </div>
                      </div>
                      <Link to="/products?shop_name=kasr-zero"
                            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-[0.72rem] font-semibold text-primary transition-colors hover:bg-primary/5">
                        تصفح المتجر <ChevronLeft className="h-3 w-3" />
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-3">
                      {kzProducts.map((kp: any) => {
                        const defaultVar = kp.kz_product_variants?.find((v: any) => v.is_default) ?? kp.kz_product_variants?.[0];
                        const mainImg = kp.kz_product_images?.sort((a: any, b: any) => a.sort_order - b.sort_order)?.[0];
                        return (
                          <Link key={kp.id} to={`/products/${kp.slug}`}
                                className="group flex flex-col bg-card p-4 transition-colors hover:bg-muted/20">
                            <div className="mb-3 aspect-square overflow-hidden rounded-xl border border-border bg-white dark:bg-muted/30">
                              {mainImg ? (
                                <img src={mainImg.image_url} alt={kp.title}
                                     className="h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                              ) : (
                                <div className="flex h-full items-center justify-center">
                                  <ShoppingBag className="h-7 w-7 text-muted-foreground/20" />
                                </div>
                              )}
                            </div>
                            <p className="text-[0.8rem] font-bold leading-snug text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                              {kp.title}
                            </p>
                            {defaultVar && (
                              <p className="mt-2 text-[0.84rem] font-bold text-primary">
                                {Number(defaultVar.price).toLocaleString("ar-EG")} ج.م
                              </p>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* ── Sidebar ── */}
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }}
                        className="space-y-5 lg:sticky lg:top-24 lg:self-start">

              {/* Quick Info Card */}
              <motion.div variants={fadeChild}>
                <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-premium)]">
                  <div className="border-b border-border px-5 py-4" style={{ background: "linear-gradient(135deg, hsl(var(--card)), hsl(var(--background)))" }}>
                    <div className="flex items-center gap-2.5">
                      <div className="h-[3px] w-5 rounded-full bg-primary" />
                      <h3 className="text-[0.85rem] font-bold text-foreground">معلومات المتجر</h3>
                    </div>
                  </div>
                  <div className="divide-y divide-border/60">
                    <InfoRow icon={Tag} label="الفئة" value={store.category ?? "متجر"} color={storyColor} />
                    <InfoRow icon={Building2} label="الوحدة" value={store.unit_code ? `وحدة ${store.unit_code}` : "—"} highlight />
                    <InfoRow icon={MapPin} label="الموقع" value="مول البستان — القاهرة الجديدة" />
                    {store.opening_hours && <InfoRow icon={Clock3} label="ساعات العمل" value={store.opening_hours} />}
                    <InfoRow
                      icon={store.status === "available" ? Tag : Check}
                      label="الحالة"
                      value={store.status === "available" ? "متاح للإيجار" : store.status === "leased" ? "مؤجر - نشط" : "قريباً"}
                      status={store.status === "available" ? "orange" : "green"}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Contact Card */}
              <StoreContactCard store={store} />

              {/* Map Quick Link */}
              <motion.div variants={fadeChild}>
                <Link to="/map" className="group block">
                  <div className="flex items-center gap-4 rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-soft)] transition-all hover:border-primary/20 hover:shadow-[var(--shadow-card)]">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors"
                         style={{ background: "hsl(var(--primary) / 0.06)", border: "1px solid hsl(var(--primary) / 0.1)" }}>
                      <Compass className="h-5 w-5 text-primary transition-transform duration-300 group-hover:rotate-45" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[0.84rem] font-bold text-foreground">اعرض الموقع على الخريطة</p>
                      <p className="text-[0.7rem] text-muted-foreground">خريطة تفاعلية لمول البستان</p>
                    </div>
                    <ArrowUpLeft className="h-4 w-4 text-muted-foreground/30 transition-all group-hover:text-primary/50 group-hover:-translate-y-0.5 group-hover:-translate-x-0.5" />
                  </div>
                </Link>
              </motion.div>

              {/* Related Stores */}
              {relatedStores && relatedStores.length > 0 && (
                <motion.div variants={fadeChild}>
                  <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-card)]">
                    <div className="border-b border-border px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="h-[3px] w-5 rounded-full" style={{ background: `hsl(${storyColor} / 0.6)` }} />
                        <h3 className="text-[0.85rem] font-bold text-foreground">متاجر مشابهة</h3>
                      </div>
                    </div>
                    <div className="divide-y divide-border/60">
                      {relatedStores.map((r) => (
                        <Link key={r.id} to={`/stores/${r.slug}`}
                              className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/20">
                          <div className="transition-transform duration-200 group-hover:scale-105">
                            <TenantLogo
                              src={getVerifiedLogoUrl(r.slug, r.logo_url)}
                              alt={r.name_ar}
                              fallbackName={r.name_ar}
                              size="md"
                              rounded="xl"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[0.82rem] font-bold text-foreground transition-colors group-hover:text-primary truncate">{r.name_ar}</p>
                            <div className="mt-0.5 flex items-center gap-2">
                              {r.unit_code && (
                                <span className="text-[0.66rem] text-muted-foreground">وحدة {r.unit_code}</span>
                              )}
                            </div>
                          </div>
                          <ArrowUpLeft className="h-4 w-4 shrink-0 text-muted-foreground/20 transition-all group-hover:text-primary/50 group-hover:-translate-y-0.5 group-hover:-translate-x-0.5" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Leasing CTA */}
              <motion.div variants={fadeChild}>
                <div className="relative overflow-hidden rounded-2xl p-7 text-center"
                     style={{ background: "var(--gradient-hero)", border: "1px solid hsl(var(--primary) / 0.18)" }}>
                  <div className="pointer-events-none absolute inset-0 opacity-30"
                       style={{ background: "radial-gradient(ellipse 60% 70% at 50% 100%, hsl(var(--primary) / 0.3), transparent)" }} />
                  <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
                       style={{ backgroundImage: "linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                  <div className="relative">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl"
                         style={{ background: "hsl(0 0% 100% / 0.08)", border: "1px solid hsl(0 0% 100% / 0.12)" }}>
                      <Building2 className="h-6 w-6 text-white/60" />
                    </div>
                    <h3 className="mb-2 text-[1.05rem] font-bold text-white" style={{ fontFamily: "var(--font-arabic-display)" }}>
                      امتلك وحدتك في البستان
                    </h3>
                    <p className="mx-auto mb-6 max-w-[260px] text-[0.78rem] leading-relaxed text-white/35">
                      انضم لمنظومة التقنية الأولى في القاهرة الجديدة واحجز مكانك الآن
                    </p>
                    <Link to="/leasing">
                      <Button variant="cta" className="h-11 w-full max-w-[220px] rounded-xl text-[0.84rem] font-bold shadow-lg shadow-primary/25">
                        استعلم الآن
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

/* ═══════════════════════════════════════════════
   Helper components
   ═══════════════════════════════════════════════ */

function InfoRow({ icon: Icon, label, value, highlight, color, status }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  highlight?: boolean;
  color?: string;
  status?: "green" | "orange";
}) {
  return (
    <div className="flex items-center gap-3.5 px-5 py-3.5 transition-colors hover:bg-muted/10">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
        status === "green" ? "bg-emerald-500/10"
          : status === "orange" ? "bg-orange-500/10"
            : highlight ? "bg-primary/8"
              : "bg-muted/30"
      }`}>
        <Icon className={`h-4 w-4 ${
          status === "green" ? "text-emerald-500"
            : status === "orange" ? "text-orange-500"
              : highlight ? "text-primary"
                : "text-muted-foreground"
        }`} />
      </div>
      <div className="min-w-0">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground/50">{label}</p>
        <p className={`text-[0.82rem] font-bold truncate ${
          status === "green" ? "text-emerald-600" : status === "orange" ? "text-orange-600" : "text-foreground"
        }`}>{value}</p>
      </div>
    </div>
  );
}

function ShareButton({ name }: { name: string }) {
  return (
    <button
      onClick={() => {
        navigator.share?.({ title: name, url: window.location.href }).catch(() => {
          navigator.clipboard.writeText(window.location.href);
          toast.success("تم نسخ الرابط");
        });
      }}
      className="flex h-11 items-center gap-2 rounded-xl px-5 text-[0.82rem] font-bold text-white/60 transition-all hover:text-white hover:bg-white/8"
      style={{ background: "hsl(0 0% 100% / 0.04)", border: "1px solid hsl(0 0% 100% / 0.1)" }}
    >
      <Share2 className="h-4 w-4" />مشاركة
    </button>
  );
}

function StoreContactCard({ store }: { store: { phone?: string | null; email?: string | null; website?: string | null; whatsapp?: string | null } }) {
  const [copied, setCopied] = useState(false);
  const hasContact = store.phone || store.email || store.website || store.whatsapp;

  const copyPhone = useCallback(() => {
    if (!store.phone) return;
    navigator.clipboard.writeText(store.phone).then(() => {
      setCopied(true);
      toast.success("تم نسخ الرقم");
      setTimeout(() => setCopied(false), 2000);
    });
  }, [store.phone]);

  if (!hasContact) return null;

  return (
    <motion.div variants={fadeChild}>
      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-card)]">
        <div className="border-b border-border px-5 py-4" style={{ background: "linear-gradient(135deg, hsl(155 70% 45% / 0.03), transparent)" }}>
          <div className="flex items-center gap-2.5">
            <div className="h-[3px] w-5 rounded-full" style={{ background: "hsl(155 70% 45%)" }} />
            <h3 className="text-[0.85rem] font-bold text-foreground">تواصل مع المتجر</h3>
          </div>
        </div>
        <div className="space-y-2 p-4">
          {store.whatsapp && (
            <a href={`https://wa.me/${store.whatsapp}`} target="_blank" rel="noopener noreferrer" className="block">
              <div className="flex items-center gap-3 rounded-xl border border-emerald-500/15 bg-emerald-500/5 px-4 py-3 transition-all hover:border-emerald-500/25 hover:bg-emerald-500/8 hover:shadow-sm">
                <MessageCircle className="h-4 w-4 text-emerald-500" />
                <span className="flex-1 text-[0.8rem] font-semibold text-foreground">تواصل عبر واتساب</span>
                <ExternalLink className="h-3 w-3 text-emerald-500/40" />
              </div>
            </a>
          )}
          {store.phone && (
            <div className="flex items-center gap-2">
              <a href={`tel:${store.phone}`} className="flex-1">
                <div className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 transition-all hover:border-primary/20 hover:bg-muted/20">
                  <Phone className="h-4 w-4 text-primary" />
                  <span dir="ltr" className="flex-1 font-poppins text-[0.8rem] font-semibold text-foreground">{store.phone}</span>
                </div>
              </a>
              <button onClick={copyPhone}
                      className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl border border-border transition-all hover:bg-muted/30">
                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
              </button>
            </div>
          )}
          {store.email && (
            <a href={`mailto:${store.email}`} className="block">
              <div className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 transition-all hover:border-primary/20 hover:bg-muted/20">
                <Mail className="h-4 w-4 text-primary" />
                <span className="flex-1 truncate text-[0.8rem] font-semibold text-foreground">{store.email}</span>
              </div>
            </a>
          )}
          {store.website && (
            <a href={store.website} target="_blank" rel="noopener noreferrer" className="block">
              <div className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 transition-all hover:border-primary/20 hover:bg-muted/20">
                <Globe className="h-4 w-4 text-primary" />
                <span className="flex-1 truncate text-[0.8rem] font-semibold text-foreground">{store.website.replace(/^https?:\/\//, "")}</span>
                <ExternalLink className="h-3 w-3 text-muted-foreground/40" />
              </div>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default StoreDetail;
