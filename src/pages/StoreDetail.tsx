import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowLeft, Clock3, Globe, Layers3, Mail, MapPin,
  Phone, Store, ExternalLink, ShoppingBag, ChevronLeft,
  Tag, Building2, Compass, MessageCircle, Copy, Check,
} from "lucide-react";
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import fallbackCover from "@/assets/mall-interior.jpg";

/* ── Animations ── */
const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } } };
const stagger = { visible: { transition: { staggerChildren: 0.06 } } };
const fadeChild = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

/* ── Category context ── */
const categoryStory: Record<string, { title: string; desc: string }> = {
  "الهواتف والإكسسوارات": { title: "حلول اتصال واستخدام يومي", desc: "أجهزة، إكسسوارات، وتحديثات سريعة." },
  "الكمبيوتر والأجهزة": { title: "أجهزة للعمل والأداء", desc: "حواسيب، ملحقات، وتجهيزات الإنتاجية." },
  "الألعاب والترفيه": { title: "تجربة ألعاب متقدمة", desc: "عتاد وملحقات الترفيه الرقمي." },
  "الطباعة والتصوير": { title: "خدمات تدعم الأعمال", desc: "حلول الطباعة والتصوير." },
  "الشبكات والحماية": { title: "بنية تقنية جاهزة", desc: "شبكات، أمن تقني، واتصال." },
  "الصيانة والدعم الفني": { title: "خدمات دعم واستمرارية", desc: "صيانة ودعم فني متخصص." },
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
        .select("id, slug, name_ar, logo_url, category, unit_code")
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
        <div style={{ background: "hsl(var(--navy))" }}>
          <div className="container max-w-6xl py-20">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="h-5 w-28 animate-pulse rounded bg-white/10" />
                <div className="h-10 w-3/4 animate-pulse rounded bg-white/10" />
                <div className="h-4 w-full animate-pulse rounded bg-white/8" />
              </div>
              <div className="aspect-[4/3] animate-pulse rounded-xl bg-white/8" />
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
          <Store className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
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
        <div className="pointer-events-none absolute inset-0 opacity-25"
             style={{ background: "radial-gradient(ellipse 50% 60% at 75% 40%, hsl(222 100% 59% / 0.15), transparent)" }} />

        <div className="container relative max-w-6xl pb-12 pt-6 md:pb-16 md:pt-8">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-1.5 text-[0.76rem] font-medium text-white/35">
            <Link to="/stores" className="transition-colors hover:text-white/60">المحلات</Link>
            <ChevronLeft className="h-3 w-3" />
            <span className="text-white/55">{store.name_ar}</span>
          </nav>

          <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.9fr] lg:gap-12">
            {/* Text */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] p-2">
                  {store.logo_url ? (
                    <img src={store.logo_url} alt={store.name_ar} className="h-full w-full rounded-lg object-contain" />
                  ) : (
                    <Store className="h-7 w-7 text-white/40" />
                  )}
                </div>
                <div>
                  <h1 className="text-[1.6rem] font-bold leading-[1.15] text-white md:text-[2rem]" style={{ fontFamily: "var(--font-arabic-display)" }}>
                    {store.name_ar}
                  </h1>
                  {store.name_en && <p className="mt-0.5 font-poppins text-[0.8rem] font-medium text-white/30">{store.name_en}</p>}
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {store.category && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[0.72rem] font-semibold text-white/65">
                    <Tag className="h-3 w-3" />{store.category}
                  </span>
                )}
                {store.unit_code && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[0.72rem] font-bold text-primary-foreground">
                    <Building2 className="h-3 w-3" />وحدة {store.unit_code}
                  </span>
                )}
                <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[0.72rem] font-semibold ${
                  store.status === "available"
                    ? "border border-orange/25 bg-orange/10 text-orange-foreground"
                    : "border border-success/20 bg-success/10 text-success-foreground"
                }`}>
                  <div className={`h-1.5 w-1.5 rounded-full ${store.status === "available" ? "bg-orange" : "bg-success"}`} />
                  {store.status === "available" ? "فرصة متاحة" : "نشط"}
                </span>
              </div>

              <p className="max-w-md text-[0.86rem] leading-[1.85] text-white/45">
                {store.short_description_ar ?? "متجر ضمن منظومة مول البستان التقنية."}
              </p>

              {/* Hero CTAs */}
              <div className="flex flex-wrap gap-2.5 pt-1">
                {store.whatsapp && (
                  <a href={`https://wa.me/${store.whatsapp}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="cta" className="h-10 gap-2 rounded-xl px-5 text-[0.8rem] font-bold">
                      <MessageCircle className="h-4 w-4" />تواصل واتساب
                    </Button>
                  </a>
                )}
                {store.phone && (
                  <a href={`tel:${store.phone}`}>
                    <Button className="h-10 gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-5 text-[0.8rem] font-bold text-white hover:bg-white/10">
                      <Phone className="h-4 w-4" />اتصل الآن
                    </Button>
                  </a>
                )}
                <Link to="/map">
                  <Button variant="outline-blue" className="h-10 gap-2 rounded-xl border-white/15 bg-white/[0.04] px-5 text-[0.8rem] text-white hover:bg-white/10">
                    <Compass className="h-4 w-4" />الخريطة
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Hero image */}
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-[0_8px_40px_hsl(218_72%_9%/0.5)]">
                <img src={heroImage} alt={store.name_ar} className="h-full w-full object-cover" loading="eager" />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, hsl(222 44% 6% / 0.4), transparent 50%)" }} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════ CONTENT ═══════════ */}
      <div style={{ background: "hsl(var(--card))" }}>
        <div className="container max-w-6xl py-8 md:py-12">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-8">

            {/* ── Main ── */}
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} className="space-y-5">

              {/* About */}
              {(store.long_description_ar || store.short_description_ar) && (
                <motion.div variants={fadeChild}>
                  <div className="rounded-xl border border-border bg-background p-5 md:p-6">
                    <h2 className="mb-3 text-[0.95rem] font-bold text-foreground" style={{ fontFamily: "var(--font-arabic-display)" }}>
                      عن {store.name_ar}
                    </h2>
                    <p className="text-[0.84rem] leading-[2] text-muted-foreground">
                      {store.long_description_ar ?? store.short_description_ar}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Category context */}
              {activeStory && (
                <motion.div variants={fadeChild}>
                  <div className="flex items-start gap-3 rounded-xl border border-primary/12 bg-primary/[0.03] p-5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Layers3 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-[0.82rem] font-bold text-foreground">{activeStory.title}</p>
                      <p className="mt-0.5 text-[0.78rem] leading-relaxed text-muted-foreground">{activeStory.desc}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Gallery */}
              {gallery.length > 1 && (
                <motion.div variants={fadeChild}>
                  <div className="rounded-xl border border-border bg-background overflow-hidden">
                    <div className="grid gap-0.5 sm:grid-cols-2">
                      {gallery.slice(0, 4).map((image, i) => (
                        <div key={`${image}-${i}`} className="aspect-[4/3] overflow-hidden">
                          <img src={image} alt={`${store.name_ar} ${i + 1}`} className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" loading="lazy" />
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Store Products */}
              {storeProducts && storeProducts.length > 0 && (
                <motion.div variants={fadeChild}>
                  <div className="rounded-xl border border-border bg-background overflow-hidden">
                    <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
                      <h2 className="text-[0.88rem] font-bold text-foreground">منتجات {store.name_ar}</h2>
                      <Link to="/products" className="flex items-center gap-1 text-[0.72rem] font-semibold text-primary hover:text-primary/80">
                        عرض الكل <ChevronLeft className="h-3 w-3" />
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-3">
                      {storeProducts.map((product) => (
                        <Link key={product.id} to={`/products/${product.slug}`} className="group flex flex-col bg-card p-3 transition-colors hover:bg-muted/20">
                          <div className="mb-2 aspect-square overflow-hidden rounded-lg border border-border bg-white">
                            {product.image_url ? (
                              <img src={product.image_url} alt={product.name_ar} className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                            ) : (
                              <div className="flex h-full items-center justify-center"><ShoppingBag className="h-6 w-6 text-muted-foreground/30" /></div>
                            )}
                          </div>
                          <p className="text-[0.76rem] font-bold text-foreground leading-snug line-clamp-2">{product.name_ar}</p>
                          {product.brand && <p className="mt-0.5 text-[0.65rem] text-muted-foreground">{product.brand}</p>}
                          {product.price && (
                            <p className="mt-1 text-[0.78rem] font-bold text-primary">{product.price.toLocaleString("ar-EG")} ج.م</p>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* ── Sidebar ── */}
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} className="space-y-5 lg:sticky lg:top-24 lg:self-start">

              {/* Quick Info Card */}
              <motion.div variants={fadeChild}>
                <div className="rounded-xl border border-border bg-background overflow-hidden">
                  <div className="border-b border-border px-5 py-3.5">
                    <h3 className="text-[0.85rem] font-bold text-foreground">معلومات سريعة</h3>
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
                  <div className="rounded-xl border border-border bg-background overflow-hidden">
                    <div className="border-b border-border px-5 py-3.5">
                      <h3 className="text-[0.85rem] font-bold text-foreground">متاجر مشابهة</h3>
                    </div>
                    <div className="divide-y divide-border">
                      {relatedStores.map((r) => (
                        <Link key={r.id} to={`/stores/${r.slug}`} className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-muted/20">
                          {r.logo_url ? (
                            <img src={r.logo_url} alt={r.name_ar} className="h-9 w-9 rounded-lg border border-border object-contain p-1" loading="lazy" />
                          ) : (
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-muted/40">
                              <Store className="h-3.5 w-3.5 text-muted-foreground/50" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-[0.8rem] font-bold text-foreground truncate">{r.name_ar}</p>
                            {r.unit_code && <p className="text-[0.65rem] text-muted-foreground">وحدة {r.unit_code}</p>}
                          </div>
                          <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground/30" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Leasing CTA */}
              <motion.div variants={fadeChild}>
                <div className="rounded-xl border border-primary/15 p-5 text-center" style={{ background: "var(--gradient-hero)" }}>
                  <Building2 className="mx-auto mb-2 h-6 w-6 text-white/50" />
                  <h3 className="mb-1 text-[0.92rem] font-bold text-white" style={{ fontFamily: "var(--font-arabic-display)" }}>
                    امتلك وحدتك
                  </h3>
                  <p className="mx-auto mb-4 max-w-[220px] text-[0.74rem] text-white/40">
                    انضم لمنظومة التقنية في القاهرة الجديدة
                  </p>
                  <Link to="/leasing">
                    <Button variant="cta" className="h-9 w-full max-w-[180px] rounded-xl text-[0.78rem] font-bold">
                      استعلم الآن
                    </Button>
                  </Link>
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
    <div className="flex items-center gap-3 px-5 py-3">
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${highlight ? "bg-primary/10" : "bg-muted/50"}`}>
        <Icon className={`h-3.5 w-3.5 ${highlight ? "text-primary" : "text-muted-foreground"}`} />
      </div>
      <div className="min-w-0">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground/60">{label}</p>
        <p className="text-[0.82rem] font-bold text-foreground truncate">{value}</p>
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
      <div className="rounded-xl border border-border bg-background overflow-hidden">
        <div className="border-b border-border px-5 py-3.5">
          <h3 className="text-[0.85rem] font-bold text-foreground">تواصل مع المتجر</h3>
        </div>
        <div className="space-y-1 p-4">
          {store.phone && (
            <div className="flex items-center gap-2">
              <a href={`tel:${store.phone}`} className="flex-1">
                <Button variant="outline" className="h-10 w-full justify-start gap-2 rounded-lg text-[0.78rem]">
                  <Phone className="h-3.5 w-3.5 text-primary" />
                  <span dir="ltr" className="font-poppins">{store.phone}</span>
                </Button>
              </a>
              <Button variant="ghost" size="sm" onClick={copyPhone} className="h-10 w-10 shrink-0 rounded-lg px-0">
                {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
              </Button>
            </div>
          )}
          {store.whatsapp && (
            <a href={`https://wa.me/${store.whatsapp}`} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="h-10 w-full justify-start gap-2 rounded-lg text-[0.78rem]">
                <MessageCircle className="h-3.5 w-3.5 text-success" />
                واتساب
              </Button>
            </a>
          )}
          {store.email && (
            <a href={`mailto:${store.email}`}>
              <Button variant="outline" className="h-10 w-full justify-start gap-2 rounded-lg text-[0.78rem]">
                <Mail className="h-3.5 w-3.5 text-primary" />
                <span className="truncate">{store.email}</span>
              </Button>
            </a>
          )}
          {store.website && (
            <a href={store.website} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="h-10 w-full justify-start gap-2 rounded-lg text-[0.78rem]">
                <Globe className="h-3.5 w-3.5 text-primary" />
                <span className="truncate flex-1 text-right">{store.website.replace(/^https?:\/\//, "")}</span>
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
