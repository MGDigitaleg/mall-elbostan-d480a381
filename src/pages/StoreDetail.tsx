import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowLeft, Clock3, Globe, Layers3, Mail, MapPin,
  Phone, Store, ExternalLink, ShoppingBag, ChevronLeft,
  Tag, Building2, Compass, MessageCircle,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import fallbackCover from "@/assets/mall-interior.jpg";

/* ── Animations ── */
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } };
const fadeScale = { hidden: { opacity: 0, scale: 0.96 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.55, delay: 0.08 } } };
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };
const fadeChild = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

/* ── Category context ── */
const categoryStory: Record<string, { title: string; description: string }> = {
  "الهواتف والإكسسوارات": {
    title: "حلول اتصال واستخدام يومي",
    description: "أجهزة الهواتف، الإكسسوارات، والتحديثات السريعة داخل وجهة تقنية موثوقة.",
  },
  "الكمبيوتر والأجهزة": {
    title: "أجهزة للعمل والدراسة والأداء",
    description: "حواسيب، ملحقات، وتجهيزات الإنتاجية ضمن تجربة عرض احترافية.",
  },
  "الألعاب والترفيه": {
    title: "تجربة ألعاب أكثر حضورًا",
    description: "عتاد، ملحقات، ومنتجات الترفيه الرقمي في سياق تقني منظّم.",
  },
  "الطباعة والتصوير": {
    title: "خدمات وأجهزة تدعم الأعمال",
    description: "حلول الطباعة والتصوير للطلاب والأعمال.",
  },
  "الشبكات والحماية": {
    title: "بنية تقنية أكثر جاهزية",
    description: "حلول الشبكات، الأمن التقني، وتجهيزات الاتصال.",
  },
  "الصيانة والدعم الفني": {
    title: "خدمات دعم واستمرارية",
    description: "صيانة ودعم فني يعزّز الثقة ويكمل تجربة الشراء.",
  },
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
        .select("id, slug, name_ar, logo_url, category")
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
  const hasContact = store?.phone || store?.email || store?.website || store?.opening_hours || store?.whatsapp;

  /* ── Loading skeleton ── */
  if (isLoading) {
    return (
      <MainLayout>
        <div className="bg-[hsl(var(--navy))]">
          <div className="container max-w-6xl px-5 py-20 md:px-8">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="h-5 w-28 animate-pulse rounded bg-white/10" />
                <div className="h-10 w-3/4 animate-pulse rounded bg-white/10" />
                <div className="h-4 w-full animate-pulse rounded bg-white/8" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-white/8" />
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
          <div className="card-editorial mx-auto max-w-md p-10">
            <Store className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
            <h1 className="mb-3 text-2xl font-bold text-foreground">المتجر غير موجود</h1>
            <p className="mb-6 text-sm text-muted-foreground">لم يتم العثور على المتجر المطلوب</p>
            <Link to="/stores"><Button variant="outline-blue">العودة لدليل المحلات</Button></Link>
          </div>
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

      {/* ════════════════════════════════════════════════
          HERO — Full-width immersive band
         ════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
        {/* Subtle ambient glow */}
        <div className="pointer-events-none absolute inset-0 opacity-30"
             style={{ background: 'radial-gradient(ellipse 60% 50% at 80% 50%, hsl(222 100% 59% / 0.12), transparent)' }} />

        <div className="container relative max-w-6xl px-5 pb-14 pt-8 md:px-8 md:pb-20 md:pt-10">
          {/* Breadcrumb */}
          <Link to="/stores" className="mb-8 inline-flex items-center gap-1.5 text-[0.78rem] font-medium text-white/40 transition-colors hover:text-white/70">
            <ArrowLeft className="h-3.5 w-3.5" /> العودة لدليل المحلات
          </Link>

          <div className="grid items-center gap-10 lg:grid-cols-2">
            {/* ── Text column ── */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-5">
              {/* Brand identity */}
              <div className="flex items-center gap-4">
                <div className="relative flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] p-2 backdrop-blur-sm">
                  {store.logo_url ? (
                    <img src={store.logo_url} alt={store.name_ar} className="h-full w-full rounded-lg object-contain" />
                  ) : (
                    <Store className="h-7 w-7 text-white/40" />
                  )}
                </div>
                <div className="min-w-0">
                  <h1 className="text-[1.75rem] font-bold leading-[1.1] text-white md:text-[2.2rem]" style={{ fontFamily: 'var(--font-arabic-display)' }}>
                    {store.name_ar}
                  </h1>
                  {store.name_en && (
                    <p className="mt-1 font-poppins text-sm font-medium tracking-wide text-white/35">{store.name_en}</p>
                  )}
                </div>
              </div>

              {/* Category + Unit badges */}
              <div className="flex flex-wrap items-center gap-2">
                {store.category && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-1.5 text-[0.75rem] font-semibold text-white/70 backdrop-blur-sm">
                    <Tag className="h-3 w-3" />
                    {store.category}
                  </span>
                )}
                {store.unit_code && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-1.5 text-[0.75rem] font-semibold text-white/70 backdrop-blur-sm">
                    <Building2 className="h-3 w-3" />
                    وحدة {store.unit_code}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="max-w-lg text-[0.9rem] leading-[1.9] text-white/50">
                {store.short_description_ar ?? "متجر ضمن منظومة مول البستان التقنية."}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Link to="/map">
                  <Button variant="outline-blue" size="lg" className="gap-2 border-white/15 bg-white/[0.06] text-white hover:bg-white/10">
                    <Compass className="h-4 w-4" /> موقعه على الخريطة
                  </Button>
                </Link>
                {store.whatsapp && (
                  <a href={`https://wa.me/${store.whatsapp}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="cta" size="lg" className="gap-2">
                      <MessageCircle className="h-4 w-4" /> تواصل واتساب
                    </Button>
                  </a>
                )}
              </div>
            </motion.div>

            {/* ── Hero image ── */}
            <motion.div variants={fadeScale} initial="hidden" animate="visible" className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-[0_8px_40px_hsl(218_72%_9%/0.5)]">
                <img src={heroImage} alt={store.name_ar} className="h-full w-full object-cover object-center" loading="eager" />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, hsl(222 44% 6% / 0.45), transparent 55%)' }} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          QUICK STATS — Elevated info strip
         ════════════════════════════════════════════════ */}
      <div className="relative z-10 border-b border-border" style={{ background: 'hsl(var(--card))' }}>
        <div className="container max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4">
            <StatCell icon={Tag} label="الفئة" value={store.category ?? "متجر"} />
            <StatCell icon={Building2} label="الوحدة" value={store.unit_code ?? "—"} highlight />
            <StatCell
              icon={store.status === "available" ? Compass : Store}
              label="الحالة"
              value={store.status === "available" ? "فرصة متاحة" : "ضمن المنظومة"}
            />
            <StatCell icon={MapPin} label="الموقع" value="مول البستان" />
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════
          CONTENT GRID
         ════════════════════════════════════════════════ */}
      <div className="container max-w-6xl py-10 md:py-14">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">

          {/* ── Main column ── */}
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} className="space-y-7">

            {/* About */}
            <motion.div variants={fadeChild}>
              <article className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
                <div className="border-b border-border px-6 py-4 md:px-8 md:py-5">
                  <p className="section-kicker">عن المتجر</p>
                  <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: 'var(--font-arabic-display)' }}>
                    نبذة عن {store.name_ar}
                  </h2>
                </div>
                <div className="px-6 py-5 md:px-8 md:py-6">
                  <p className="text-[0.9rem] leading-[2] text-muted-foreground">
                    {store.long_description_ar ?? store.short_description_ar ?? "سيتم تحديث وصف هذا المتجر قريبًا."}
                  </p>
                </div>
              </article>
            </motion.div>

            {/* Category Story */}
            {activeStory && (
              <motion.div variants={fadeChild}>
                <article className="overflow-hidden rounded-xl border border-primary/15 bg-primary/[0.03]">
                  <div className="flex items-start gap-4 px-6 py-5 md:px-8 md:py-6">
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Layers3 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="mb-1 text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-primary/60">سرد الفئة</p>
                      <h2 className="mb-2 text-base font-bold text-foreground">{activeStory.title}</h2>
                      <p className="text-[0.85rem] leading-[1.8] text-muted-foreground">{activeStory.description}</p>
                    </div>
                  </div>
                </article>
              </motion.div>
            )}

            {/* Gallery */}
            {gallery.length > 1 && (
              <motion.div variants={fadeChild}>
                <section className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
                  <div className="border-b border-border px-6 py-4 md:px-8 md:py-5">
                    <p className="section-kicker">معرض بصري</p>
                  </div>
                  <div className="grid gap-1 p-1 sm:grid-cols-2">
                    {gallery.slice(0, 4).map((image, index) => (
                      <div key={`${image}-${index}`} className="aspect-[4/3] overflow-hidden">
                        <img
                          src={image}
                          alt={`${store.name_ar} ${index + 1}`}
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </section>
              </motion.div>
            )}

            {/* Store Products */}
            {storeProducts && storeProducts.length > 0 && (
              <motion.div variants={fadeChild}>
                <section className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
                  <div className="flex items-center justify-between border-b border-border px-6 py-4 md:px-8 md:py-5">
                    <div>
                      <p className="section-kicker">منتجات المتجر</p>
                      <h2 className="text-lg font-bold text-foreground">منتجات متاحة في {store.name_ar}</h2>
                    </div>
                    <Link to="/products" className="flex items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-primary/80">
                      عرض الكل <ChevronLeft className="h-3 w-3" />
                    </Link>
                  </div>
                  <div className="grid gap-px bg-border sm:grid-cols-2">
                    {storeProducts.map((product) => (
                      <Link
                        key={product.id}
                        to={`/products/${product.slug}`}
                        className="flex items-center gap-4 bg-card p-4 transition-colors hover:bg-muted/30 md:p-5"
                      >
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name_ar} className="h-16 w-16 rounded-xl border border-border object-cover" loading="lazy" />
                        ) : (
                          <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-border bg-muted/50">
                            <ShoppingBag className="h-6 w-6 text-muted-foreground/50" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-foreground truncate">{product.name_ar}</p>
                          {product.brand && (
                            <p className="mt-0.5 text-[0.7rem] font-medium text-muted-foreground">{product.brand}</p>
                          )}
                          {product.price && (
                            <p className="mt-1 text-sm font-bold text-primary">
                              {product.price.toLocaleString("ar-EG")} ج.م
                            </p>
                          )}
                        </div>
                        <ChevronLeft className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                      </Link>
                    ))}
                  </div>
                </section>
              </motion.div>
            )}
          </motion.div>

          {/* ── Sidebar ── */}
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} className="space-y-6">

            {/* Contact Card */}
            {hasContact && (
              <motion.div variants={fadeChild}>
                <aside className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
                  <div className="border-b border-border px-6 py-4">
                    <p className="section-kicker">معلومات الاتصال</p>
                    <h3 className="text-base font-bold text-foreground">تواصل مع المتجر</h3>
                  </div>
                  <div className="divide-y divide-border">
                    {store.phone && <ContactItem icon={Phone} label="هاتف" value={store.phone} dir="ltr" />}
                    {store.email && <ContactItem icon={Mail} label="بريد إلكتروني" value={store.email} />}
                    {store.website && (
                      <a href={store.website} target="_blank" rel="noopener noreferrer"
                         className="flex items-center gap-3 px-6 py-3.5 transition-colors hover:bg-muted/30">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/8">
                          <Globe className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70">موقع إلكتروني</p>
                          <p className="truncate text-sm font-medium text-foreground">{store.website}</p>
                        </div>
                        <ExternalLink className="h-3.5 w-3.5 shrink-0 text-primary/50" />
                      </a>
                    )}
                    {store.opening_hours && <ContactItem icon={Clock3} label="ساعات العمل" value={store.opening_hours} />}
                    {store.unit_code && <ContactItem icon={MapPin} label="الوحدة" value={`وحدة ${store.unit_code}`} />}
                  </div>
                </aside>
              </motion.div>
            )}

            {/* Related Stores */}
            {relatedStores && relatedStores.length > 0 && (
              <motion.div variants={fadeChild}>
                <aside className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
                  <div className="border-b border-border px-6 py-4">
                    <p className="section-kicker">متاجر مشابهة</p>
                    <h3 className="text-base font-bold text-foreground">ضمن نفس الفئة</h3>
                  </div>
                  <div className="divide-y divide-border">
                    {relatedStores.map((related) => (
                      <Link
                        key={related.id}
                        to={`/stores/${related.slug}`}
                        className="flex items-center gap-3 px-6 py-3.5 transition-colors hover:bg-muted/30"
                      >
                        {related.logo_url ? (
                          <img src={related.logo_url} alt={related.name_ar} className="h-10 w-10 rounded-lg border border-border object-contain p-1" loading="lazy" />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted/40">
                            <Store className="h-4 w-4 text-muted-foreground/60" />
                          </div>
                        )}
                        <span className="flex-1 text-sm font-semibold text-foreground">{related.name_ar}</span>
                        <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground/40" />
                      </Link>
                    ))}
                  </div>
                </aside>
              </motion.div>
            )}

            {/* CTA — Leasing */}
            <motion.div variants={fadeChild}>
              <div className="relative overflow-hidden rounded-xl border border-primary/20" style={{ background: 'var(--gradient-hero)' }}>
                <div className="pointer-events-none absolute inset-0 opacity-20"
                     style={{ background: 'radial-gradient(circle at 30% 70%, hsl(222 100% 59% / 0.3), transparent 60%)' }} />
                <div className="relative px-6 py-8 text-center md:px-8">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                    <Building2 className="h-6 w-6 text-white/70" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-white" style={{ fontFamily: 'var(--font-arabic-display)' }}>
                    امتلك وحدتك في مول البستان
                  </h3>
                  <p className="mx-auto mb-5 max-w-[260px] text-[0.8rem] leading-relaxed text-white/45">
                    انضم لمنظومة التقنية الأولى في القاهرة الجديدة
                  </p>
                  <Link to="/leasing">
                    <Button variant="cta" size="lg" className="w-full max-w-[220px]">استعلم الآن</Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

/* ═══════════════════════════════════════════════
   Helper components
   ═══════════════════════════════════════════════ */

function StatCell({ icon: Icon, label, value, highlight }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-center gap-3 border-l border-border px-5 py-4 first:border-l-0" style={{ direction: 'rtl' }}>
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${highlight ? 'bg-primary/10' : 'bg-muted/60'}`}>
        <Icon className={`h-3.5 w-3.5 ${highlight ? 'text-primary' : 'text-muted-foreground'}`} />
      </div>
      <div className="min-w-0">
        <p className="text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70">{label}</p>
        <p className="text-sm font-bold text-foreground truncate">{value}</p>
      </div>
    </div>
  );
}

function ContactItem({ icon: Icon, label, value, dir }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; dir?: string }) {
  return (
    <div className="flex items-center gap-3 px-6 py-3.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/8">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70">{label}</p>
        <p className="text-sm font-medium text-foreground" dir={dir}>{value}</p>
      </div>
    </div>
  );
}

export default StoreDetail;
