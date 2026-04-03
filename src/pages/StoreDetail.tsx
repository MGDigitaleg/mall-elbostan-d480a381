import { useMemo, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowLeft, Clock3, Globe, Layers3, Mail, MapPin,
  Phone, Store, ExternalLink, ShoppingBag, ChevronLeft,
  Tag, Building2, Compass, MessageCircle, Copy, Check,
  Share2, Star, ArrowUpLeft,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import fallbackCover from "@/assets/mall-interior.jpg";

/* ── Animations ── */
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } };
const stagger = { visible: { transition: { staggerChildren: 0.07 } } };
const fadeChild = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

/* ── Category context ── */
const categoryStory: Record<string, { title: string; desc: string; icon: typeof Tag }> = {
  "الهواتف والإكسسوارات": { title: "حلول اتصال واستخدام يومي", desc: "أجهزة، إكسسوارات، وتحديثات سريعة.", icon: Phone },
  "الكمبيوتر والأجهزة": { title: "أجهزة للعمل والأداء", desc: "حواسيب، ملحقات، وتجهيزات الإنتاجية.", icon: Layers3 },
  "الألعاب والترفيه": { title: "تجربة ألعاب متقدمة", desc: "عتاد وملحقات الترفيه الرقمي.", icon: Star },
  "الطباعة والتصوير": { title: "خدمات تدعم الأعمال", desc: "حلول الطباعة والتصوير.", icon: Layers3 },
  "الشبكات والحماية": { title: "بنية تقنية جاهزة", desc: "شبكات، أمن تقني، واتصال.", icon: Globe },
  "الصيانة والدعم الفني": { title: "خدمات دعم واستمرارية", desc: "صيانة ودعم فني متخصص.", icon: Compass },
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
    enabled: !!store?.id,
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
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-muted/30">
            <Store className="h-7 w-7 text-muted-foreground" />
          </div>
          <h1 className="mb-3 text-2xl font-bold text-foreground">المتجر غير موجود</h1>
          <p className="mb-6 text-sm text-muted-foreground">لم يتم العثور على المتجر المطلوب</p>
          <Link to="/stores"><Button variant="outline-blue">العودة لدليل المحلات</Button></Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <SEOHead
        title={store.name_ar}
        description={store.short_description_ar ?? `${store.name_ar} في مول البستان`}
        breadcrumbs={[{ name: "المحلات", url: "/stores" }, { name: store.name_ar, url: `/stores/${store.slug}` }]}
      />

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-1/3 h-[400px] w-[400px] rounded-full opacity-[0.07]"
               style={{ background: "radial-gradient(circle, hsl(var(--primary)), transparent 70%)" }} />
          <div className="absolute bottom-0 right-1/4 h-[300px] w-[500px] rounded-full opacity-[0.05]"
               style={{ background: "radial-gradient(circle, hsl(220 80% 55%), transparent 70%)" }} />
        </div>

        <div className="container relative max-w-6xl pb-14 pt-6 md:pb-20 md:pt-10">
          {/* Breadcrumb */}
          <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
                      className="mb-8 flex items-center gap-2 text-[0.74rem] font-medium">
            <Link to="/" className="text-white/30 transition-colors hover:text-white/55">الرئيسية</Link>
            <ChevronLeft className="h-3 w-3 text-white/20" />
            <Link to="/stores" className="text-white/30 transition-colors hover:text-white/55">المحلات</Link>
            <ChevronLeft className="h-3 w-3 text-white/20" />
            <span className="text-white/55">{store.name_ar}</span>
          </motion.nav>

          <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.85fr] lg:gap-14">
            {/* Left: Text content */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-5">
              {/* Logo + Name */}
              <div className="flex items-center gap-5">
                <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-2xl p-2.5"
                     style={{ background: "hsl(0 0% 100% / 0.06)", border: "1px solid hsl(0 0% 100% / 0.1)", boxShadow: "0 8px 32px hsl(220 60% 5% / 0.3)" }}>
                  {store.logo_url ? (
                    <img src={store.logo_url} alt={store.name_ar} className="h-full w-full rounded-xl object-contain" />
                  ) : (
                    <Store className="h-8 w-8 text-white/35" />
                  )}
                </div>
                <div>
                  <h1 className="text-[1.75rem] font-bold leading-[1.1] text-white md:text-[2.2rem]"
                      style={{ fontFamily: "var(--font-arabic-display)" }}>
                    {store.name_ar}
                  </h1>
                  {store.name_en && (
                    <p className="mt-1 font-poppins text-[0.82rem] font-medium tracking-wide text-white/25">{store.name_en}</p>
                  )}
                </div>
              </div>

              {/* Badge row */}
              <div className="flex flex-wrap items-center gap-2">
                {store.category && (
                  <span className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.72rem] font-semibold text-white/60"
                        style={{ background: "hsl(0 0% 100% / 0.06)", border: "1px solid hsl(0 0% 100% / 0.1)" }}>
                    <Tag className="h-3 w-3" />{store.category}
                  </span>
                )}
                {store.unit_code && (
                  <span className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.72rem] font-bold"
                        style={{ background: "hsl(var(--primary) / 0.12)", border: "1px solid hsl(var(--primary) / 0.25)", color: "hsl(var(--primary))" }}>
                    <Building2 className="h-3 w-3" />وحدة {store.unit_code}
                  </span>
                )}
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.72rem] font-semibold ${
                  store.status === "available"
                    ? "text-orange-300"
                    : "text-emerald-300"
                }`} style={{
                  background: store.status === "available" ? "hsl(25 95% 55% / 0.12)" : "hsl(155 70% 40% / 0.12)",
                  border: `1px solid ${store.status === "available" ? "hsl(25 95% 55% / 0.25)" : "hsl(155 70% 40% / 0.25)"}`,
                }}>
                  <div className={`h-1.5 w-1.5 rounded-full ${store.status === "available" ? "bg-orange-400" : "bg-emerald-400"}`} />
                  {store.status === "available" ? "فرصة متاحة" : "نشط"}
                </span>
              </div>

              {/* Description */}
              <p className="max-w-lg text-[0.88rem] leading-[1.9] text-white/40">
                {store.short_description_ar ?? "متجر ضمن منظومة مول البستان التقنية."}
              </p>

              {/* Hero CTAs */}
              <div className="flex flex-wrap gap-2.5 pt-2">
                {store.whatsapp && (
                  <a href={`https://wa.me/${store.whatsapp}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="cta" className="h-11 gap-2.5 rounded-xl px-6 text-[0.82rem] font-bold shadow-lg shadow-primary/20">
                      <MessageCircle className="h-4 w-4" />تواصل واتساب
                    </Button>
                  </a>
                )}
                {store.phone && (
                  <a href={`tel:${store.phone}`}>
                    <Button className="h-11 gap-2.5 rounded-xl px-6 text-[0.82rem] font-bold text-white transition-all"
                            style={{ background: "hsl(0 0% 100% / 0.08)", border: "1px solid hsl(0 0% 100% / 0.15)" }}>
                      <Phone className="h-4 w-4" />اتصل الآن
                    </Button>
                  </a>
                )}
                <Link to="/map">
                  <Button className="h-11 gap-2.5 rounded-xl px-6 text-[0.82rem] font-bold text-white/70 transition-all hover:text-white"
                          style={{ background: "hsl(0 0% 100% / 0.04)", border: "1px solid hsl(0 0% 100% / 0.1)" }}>
                    <Compass className="h-4 w-4" />الخريطة
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Right: Hero image */}
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.55, delay: 0.15 }}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl"
                   style={{ boxShadow: "0 12px 48px hsl(220 60% 5% / 0.5), 0 2px 8px hsl(220 60% 5% / 0.3)" }}>
                <img src={heroImage} alt={store.name_ar} className="h-full w-full object-cover" loading="eager" />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, hsl(222 44% 6% / 0.5), transparent 50%)" }} />
                {/* Share button overlay */}
                <button
                  onClick={() => {
                    navigator.share?.({ title: store.name_ar, url: window.location.href }).catch(() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("تم نسخ الرابط");
                    });
                  }}
                  className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl transition-all hover:scale-105"
                  style={{ background: "hsl(0 0% 0% / 0.4)", backdropFilter: "blur(12px)", border: "1px solid hsl(0 0% 100% / 0.15)" }}
                >
                  <Share2 className="h-4 w-4 text-white/80" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom wave transition */}
        <div className="h-px w-full" style={{ background: "linear-gradient(to left, transparent, hsl(var(--primary) / 0.2), transparent)" }} />
      </section>

      {/* ═══════════ CONTENT ═══════════ */}
      <div style={{ background: "hsl(var(--card))" }}>
        <div className="container max-w-6xl py-10 md:py-14">
          <div className="grid gap-7 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10">

            {/* ── Main column ── */}
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} className="space-y-6">

              {/* About section */}
              {(store.long_description_ar || store.short_description_ar) && (
                <motion.div variants={fadeChild}>
                  <div className="rounded-2xl border border-border bg-background p-6 md:p-7">
                    <div className="mb-4 flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "hsl(var(--primary) / 0.08)" }}>
                        <Store className="h-4 w-4 text-primary" />
                      </div>
                      <h2 className="text-[0.95rem] font-bold text-foreground" style={{ fontFamily: "var(--font-arabic-display)" }}>
                        عن {store.name_ar}
                      </h2>
                    </div>
                    <p className="text-[0.84rem] leading-[2.1] text-muted-foreground">
                      {store.long_description_ar ?? store.short_description_ar}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Category context */}
              {activeStory && (
                <motion.div variants={fadeChild}>
                  <div className="flex items-start gap-4 rounded-2xl p-5"
                       style={{ background: "hsl(var(--primary) / 0.04)", border: "1px solid hsl(var(--primary) / 0.1)" }}>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                         style={{ background: "hsl(var(--primary) / 0.1)" }}>
                      <activeStory.icon className="h-4.5 w-4.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[0.84rem] font-bold text-foreground">{activeStory.title}</p>
                      <p className="mt-1 text-[0.78rem] leading-relaxed text-muted-foreground">{activeStory.desc}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Gallery */}
              {gallery.length > 1 && (
                <motion.div variants={fadeChild}>
                  <div className="overflow-hidden rounded-2xl border border-border bg-background">
                    <div className="grid gap-1 p-1 sm:grid-cols-2">
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
                  <div className="overflow-hidden rounded-2xl border border-border bg-background">
                    <div className="flex items-center justify-between border-b border-border px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "hsl(var(--primary) / 0.08)" }}>
                          <ShoppingBag className="h-4 w-4 text-primary" />
                        </div>
                        <h2 className="text-[0.9rem] font-bold text-foreground">منتجات {store.name_ar}</h2>
                      </div>
                      <Link to="/products" className="flex items-center gap-1 text-[0.72rem] font-semibold text-primary transition-colors hover:text-primary/80">
                        عرض الكل <ChevronLeft className="h-3 w-3" />
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-3">
                      {storeProducts.map((product) => (
                        <Link key={product.id} to={`/products/${product.slug}`}
                              className="group flex flex-col bg-card p-3.5 transition-colors hover:bg-muted/30">
                          <div className="mb-2.5 aspect-square overflow-hidden rounded-xl border border-border bg-white">
                            {product.image_url ? (
                              <img src={product.image_url} alt={product.name_ar}
                                   className="h-full w-full object-contain p-2.5 transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <ShoppingBag className="h-6 w-6 text-muted-foreground/30" />
                              </div>
                            )}
                          </div>
                          <p className="text-[0.78rem] font-bold leading-snug text-foreground line-clamp-2">{product.name_ar}</p>
                          {product.brand && <p className="mt-0.5 text-[0.66rem] text-muted-foreground">{product.brand}</p>}
                          {product.price && (
                            <p className="mt-1.5 text-[0.8rem] font-bold text-primary">{product.price.toLocaleString("ar-EG")} ج.م</p>
                          )}
                        </Link>
                      ))}
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
                <div className="overflow-hidden rounded-2xl border border-border bg-background">
                  <div className="border-b border-border px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-[3px] w-4 rounded-full bg-primary" />
                      <h3 className="text-[0.82rem] font-bold text-foreground">معلومات سريعة</h3>
                    </div>
                  </div>
                  <div className="divide-y divide-border">
                    <InfoRow icon={Tag} label="الفئة" value={store.category ?? "متجر"} />
                    <InfoRow icon={Building2} label="الوحدة" value={store.unit_code ? `وحدة ${store.unit_code}` : "—"} highlight />
                    <InfoRow icon={MapPin} label="الموقع" value="مول البستان — القاهرة الجديدة" />
                    {store.opening_hours && <InfoRow icon={Clock3} label="ساعات العمل" value={store.opening_hours} />}
                  </div>
                </div>
              </motion.div>

              {/* Contact Card */}
              <StoreContactCard store={store} />

              {/* Related Stores */}
              {relatedStores && relatedStores.length > 0 && (
                <motion.div variants={fadeChild}>
                  <div className="overflow-hidden rounded-2xl border border-border bg-background">
                    <div className="border-b border-border px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-[3px] w-4 rounded-full" style={{ background: "hsl(var(--primary) / 0.5)" }} />
                        <h3 className="text-[0.82rem] font-bold text-foreground">متاجر مشابهة</h3>
                      </div>
                    </div>
                    <div className="divide-y divide-border">
                      {relatedStores.map((r) => (
                        <Link key={r.id} to={`/stores/${r.slug}`}
                              className="group flex items-center gap-3.5 px-5 py-3.5 transition-colors hover:bg-muted/20">
                          {r.logo_url ? (
                            <img src={r.logo_url} alt={r.name_ar}
                                 className="h-10 w-10 rounded-xl border border-border bg-white object-contain p-1.5 transition-transform duration-200 group-hover:scale-105"
                                 loading="lazy" />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-muted/30">
                              <Store className="h-4 w-4 text-muted-foreground/50" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-[0.8rem] font-bold text-foreground transition-colors group-hover:text-primary truncate">{r.name_ar}</p>
                            {r.unit_code && <p className="text-[0.66rem] text-muted-foreground">وحدة {r.unit_code}</p>}
                          </div>
                          <ArrowUpLeft className="h-3.5 w-3.5 text-muted-foreground/20 transition-all group-hover:text-primary/50 group-hover:-translate-y-0.5 group-hover:-translate-x-0.5" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Leasing CTA */}
              <motion.div variants={fadeChild}>
                <div className="relative overflow-hidden rounded-2xl p-6 text-center"
                     style={{ background: "var(--gradient-hero)", border: "1px solid hsl(var(--primary) / 0.15)" }}>
                  <div className="pointer-events-none absolute inset-0 opacity-30"
                       style={{ background: "radial-gradient(ellipse 60% 70% at 50% 100%, hsl(var(--primary) / 0.3), transparent)" }} />
                  <div className="relative">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl"
                         style={{ background: "hsl(0 0% 100% / 0.08)", border: "1px solid hsl(0 0% 100% / 0.12)" }}>
                      <Building2 className="h-5 w-5 text-white/60" />
                    </div>
                    <h3 className="mb-1.5 text-[0.95rem] font-bold text-white" style={{ fontFamily: "var(--font-arabic-display)" }}>
                      امتلك وحدتك
                    </h3>
                    <p className="mx-auto mb-5 max-w-[240px] text-[0.76rem] leading-relaxed text-white/35">
                      انضم لمنظومة التقنية في القاهرة الجديدة
                    </p>
                    <Link to="/leasing">
                      <Button variant="cta" className="h-10 w-full max-w-[200px] rounded-xl text-[0.8rem] font-bold shadow-lg shadow-primary/20">
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

function InfoRow({ icon: Icon, label, value, highlight }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center gap-3.5 px-5 py-3.5">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${highlight ? "bg-primary/10" : "bg-muted/40"}`}>
        <Icon className={`h-4 w-4 ${highlight ? "text-primary" : "text-muted-foreground"}`} />
      </div>
      <div className="min-w-0">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground/60">{label}</p>
        <p className="text-[0.84rem] font-bold text-foreground truncate">{value}</p>
      </div>
    </div>
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
      <div className="overflow-hidden rounded-2xl border border-border bg-background">
        <div className="border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="h-[3px] w-4 rounded-full" style={{ background: "hsl(155 70% 40%)" }} />
            <h3 className="text-[0.82rem] font-bold text-foreground">تواصل مع المتجر</h3>
          </div>
        </div>
        <div className="space-y-1.5 p-4">
          {store.phone && (
            <div className="flex items-center gap-2">
              <a href={`tel:${store.phone}`} className="flex-1">
                <Button variant="outline" className="h-10 w-full justify-start gap-2.5 rounded-xl text-[0.78rem]">
                  <Phone className="h-3.5 w-3.5 text-primary" />
                  <span dir="ltr" className="font-poppins">{store.phone}</span>
                </Button>
              </a>
              <Button variant="ghost" size="sm" onClick={copyPhone}
                      className="h-10 w-10 shrink-0 rounded-xl px-0 transition-colors">
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              </Button>
            </div>
          )}
          {store.whatsapp && (
            <a href={`https://wa.me/${store.whatsapp}`} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="h-10 w-full justify-start gap-2.5 rounded-xl text-[0.78rem]">
                <MessageCircle className="h-3.5 w-3.5 text-emerald-500" />
                واتساب
              </Button>
            </a>
          )}
          {store.email && (
            <a href={`mailto:${store.email}`}>
              <Button variant="outline" className="h-10 w-full justify-start gap-2.5 rounded-xl text-[0.78rem]">
                <Mail className="h-3.5 w-3.5 text-primary" />
                <span className="truncate">{store.email}</span>
              </Button>
            </a>
          )}
          {store.website && (
            <a href={store.website} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="h-10 w-full justify-start gap-2.5 rounded-xl text-[0.78rem]">
                <Globe className="h-3.5 w-3.5 text-primary" />
                <span className="flex-1 truncate text-right">{store.website.replace(/^https?:\/\//, "")}</span>
                <ExternalLink className="h-3 w-3 text-muted-foreground/40" />
              </Button>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default StoreDetail;
