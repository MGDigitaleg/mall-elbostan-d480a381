import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Clock3, Globe, Layers3, Mail, MapPin, Phone, Store, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import fallbackCover from "@/assets/mall-interior.jpg";

const categoryStory: Record<string, { title: string; description: string }> = {
  "الهواتف والإكسسوارات": {
    title: "حلول اتصال واستخدام يومي",
    description: "هذه الفئة تخدم الزوار الباحثين عن أجهزة الهواتف، الإكسسوارات، والتحديثات السريعة داخل وجهة تقنية موثوقة.",
  },
  "الكمبيوتر والأجهزة": {
    title: "أجهزة للعمل والدراسة والأداء",
    description: "فئة تركّز على الحواسيب، الملحقات، وتجهيزات الإنتاجية والأداء ضمن تجربة عرض أكثر احترافية.",
  },
  "الألعاب والترفيه": {
    title: "تجربة ألعاب أكثر حضورًا",
    description: "تجمع هذه الفئة بين العتاد، الملحقات، ومنتجات الترفيه الرقمي في سياق تقني أكثر جاذبية وتنظيمًا.",
  },
  "الطباعة والتصوير": {
    title: "خدمات وأجهزة تدعم الأعمال",
    description: "تعكس هذه الفئة الاحتياجات العملية للطلاب والأعمال عبر حلول الطباعة، التصوير، والخدمات المرتبطة بها.",
  },
  "الشبكات والحماية": {
    title: "بنية تقنية أكثر جاهزية",
    description: "فئة مناسبة للحلول التي تخدم الشبكات، الأمن التقني، وتجهيزات الاتصال للمستخدمين والشركات.",
  },
  "الصيانة والدعم الفني": {
    title: "خدمات دعم واستمرارية",
    description: "وجود الصيانة والدعم الفني ضمن المول يعزّز الثقة ويمنح تجربة شراء أكثر اكتمالًا واستمرارية.",
  },
};

const heroText = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } };
const heroImageAnim = { hidden: { opacity: 0, scale: 0.97 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6, delay: 0.1 } } };
const sectionReveal = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };
const fadeChild = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

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
        .select("id, slug, name_ar, logo_url")
        .eq("category", store.category)
        .neq("id", store.id)
        .neq("status", "hidden")
        .limit(3);
      return data ?? [];
    },
    enabled: !!store?.category && !!store?.id,
  });

  const gallery = useMemo(() => {
    if (!store?.gallery || !Array.isArray(store.gallery)) return [];
    return store.gallery.filter((item): item is string => typeof item === "string");
  }, [store?.gallery]);

  const activeStory = store?.category ? categoryStory[store.category] : null;
  const heroImage = store?.cover_image_url ?? gallery[0] ?? fallbackCover;

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container max-w-5xl py-24">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr]">
            <div className="space-y-5">
              <div className="h-6 w-32 animate-pulse rounded bg-muted" />
              <div className="h-10 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
            </div>
            <div className="aspect-[4/3] animate-pulse rounded-lg bg-muted" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!store) {
    return (
      <MainLayout>
        <div className="container max-w-5xl py-24 text-center">
          <div className="card-editorial mx-auto max-w-md p-10">
            <Store className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
            <h1 className="mb-3 text-2xl font-bold text-foreground">المتجر غير موجود</h1>
            <p className="mb-6 text-sm text-muted-foreground">لم يتم العثور على المتجر المطلوب ضمن دليل مول البستان</p>
            <Link to="/stores"><Button variant="outline-blue">العودة لدليل المتاجر</Button></Link>
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
        breadcrumbs={[{ name: "المتاجر", url: "/stores" }, { name: store.name_ar, url: `/stores/${store.slug}` }]}
      />

      {/* ── Hero Band ── */}
      <section className="heritage-section">
        <div className="container max-w-6xl px-5 pb-12 pt-8 md:px-8 md:pb-16 md:pt-10">
          {/* Breadcrumb */}
          <Link to="/stores" className="mb-8 inline-flex items-center gap-1.5 text-[0.8rem] font-medium transition-colors" style={{ color: 'hsl(var(--primary) / 0.6)' }}>
            <ArrowLeft className="h-3.5 w-3.5" /> العودة لدليل المتاجر
          </Link>

          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Text */}
            <motion.div variants={heroText} initial="hidden" animate="visible" className="space-y-6">
              <div className="flex items-center gap-5">
                {store.logo_url ? (
                  <div className="heritage-surface flex h-20 w-20 items-center justify-center p-2">
                    <img src={store.logo_url} alt={store.name_ar} className="h-full w-full rounded object-contain" />
                  </div>
                ) : (
                  <div className="heritage-surface flex h-20 w-20 items-center justify-center">
                    <Store className="h-8 w-8" style={{ color: 'hsl(var(--primary) / 0.5)' }} />
                  </div>
                )}
                <div>
                  <h1 className="text-[2.4rem] font-bold leading-[1.05] md:text-[3.2rem]" style={{ color: 'hsl(var(--navy-foreground))' }}>
                    {store.name_ar}
                  </h1>
                  {store.name_en && (
                    <p className="mt-1.5 font-poppins text-sm font-medium" style={{ color: 'hsl(0 0% 100% / 0.4)' }}>
                      {store.name_en}
                    </p>
                  )}
                </div>
              </div>

              {store.category && (
                <span className="eyebrow-chip" style={{ borderColor: 'hsl(var(--primary) / 0.2)', background: 'hsl(var(--primary) / 0.08)', color: 'hsl(200 60% 70%)' }}>
                  {store.category}
                </span>
              )}

              <p className="max-w-xl text-base leading-[1.9]" style={{ color: 'hsl(0 0% 100% / 0.55)' }}>
                {store.short_description_ar ?? "صفحة تفصيلية تقدّم هذا المتجر ضمن تجربة مول البستان التقنية، مع عرض أوضح للفئة، بيانات التواصل، ومسار الزيارة داخل المنظومة."}
              </p>

              <div className="flex flex-wrap gap-3 pt-1">
                <Link to="/map">
                  <Button variant="outline-blue" size="lg" className="gap-2">
                    <MapPin className="h-4 w-4" /> موقعه على الخريطة
                  </Button>
                </Link>
                {store.whatsapp && (
                  <a href={`https://wa.me/${store.whatsapp}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="cta" size="lg">تواصل عبر واتساب</Button>
                  </a>
                )}
              </div>
            </motion.div>

            {/* Hero Image */}
            <motion.div variants={heroImageAnim} initial="hidden" animate="visible" className="image-architectural aspect-[4/3] overflow-hidden shadow-[var(--shadow-deep)]">
              <img src={heroImage} alt={store.name_ar} className="h-full w-full object-cover object-center" loading="eager" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, hsl(222 44% 6% / 0.4), transparent 50%)' }} />
              {store.unit_code && (
                <div className="absolute bottom-4 left-4 glass-warm rounded-md px-3 py-1.5">
                  <span className="text-xs font-semibold text-foreground">وحدة {store.unit_code}</span>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Compact info strip ── */}
      <div className="border-b border-border">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-2 divide-x divide-border md:grid-cols-4" style={{ direction: 'ltr' }}>
            <InfoCell label="الفئة" value={store.category ?? "متجر داخل المول"} />
            <InfoCell label="الحالة" value={store.status === "available" ? "فرصة متاحة" : "ضمن المنظومة"} />
            <InfoCell label="الوحدة" value={store.unit_code ?? "—"} />
            <InfoCell label="الموقع" value="مول البستان" />
          </div>
        </div>
      </div>

      {/* ── Content Grid ── */}
      <div className="container max-w-6xl py-10 md:py-14">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Main column */}
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} className="space-y-8">
            {/* About */}
            <motion.div variants={fadeChild}>
            <article className="card-editorial p-6 md:p-8">
              <div className="chapter-shell">
                <p className="section-kicker">عن المتجر</p>
                <h2 className="mb-4 text-xl font-bold text-foreground md:text-2xl">قراءة أوضح لدور المتجر داخل المنظومة</h2>
              </div>
              <p className="text-[0.95rem] leading-[2] text-muted-foreground">
                {store.long_description_ar ?? store.short_description_ar ?? "سيتم تحديث وصف هذا المتجر قريبًا بمحتوى تفصيلي يوضح نوع المنتجات أو الخدمات التي يقدّمها داخل مول البستان."}
              </p>
            </article>
            </motion.div>

            {/* Category Story */}
            {activeStory && (
              <motion.div variants={fadeChild}>
              <article className="card-architectural p-6 md:p-8">
                <div className="flex items-start gap-3">
                  <Layers3 className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="section-kicker">سرد الفئة</p>
                    <h2 className="mb-3 text-xl font-bold text-foreground">{activeStory.title}</h2>
                    <p className="text-[0.95rem] leading-[2] text-muted-foreground">{activeStory.description}</p>
                  </div>
                </div>
              </article>
              </motion.div>
            )}

            {/* Gallery */}
            {gallery.length > 1 && (
              <motion.div variants={fadeChild}>
              <section className="editorial-panel p-6 md:p-8">
                <p className="section-kicker">معرض بصري</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {gallery.slice(0, 4).map((image, index) => (
                    <div key={`${image}-${index}`} className="image-architectural aspect-[4/3]">
                      <img src={image} alt={`${store.name_ar} ${index + 1}`} className="h-full w-full object-cover" loading="lazy" />
                    </div>
                  ))}
                </div>
              </section>
              </motion.div>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} className="space-y-6">
            {/* Contact Card */}
            <aside className="card-editorial p-6 md:p-8">
              <p className="section-kicker">معلومات الاتصال</p>
              <h3 className="mb-5 text-lg font-bold text-foreground">تواصل مع المتجر أو قم بزيارته</h3>
              <div className="space-y-4">
                {store.phone && <ContactRow icon={Phone} text={store.phone} dir="ltr" />}
                {store.email && <ContactRow icon={Mail} text={store.email} />}
                {store.website && (
                  <a href={store.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-primary">
                    <span className="icon-shell h-8 w-8"><Globe className="h-3.5 w-3.5" /></span>
                    <span className="truncate">{store.website}</span>
                    <ExternalLink className="mr-auto h-3 w-3 shrink-0 text-primary" />
                  </a>
                )}
                {store.opening_hours && <ContactRow icon={Clock3} text={store.opening_hours} />}
                {store.unit_code && <ContactRow icon={MapPin} text={`وحدة ${store.unit_code}`} />}
              </div>
            </aside>

            {/* Related Stores */}
            {relatedStores && relatedStores.length > 0 && (
              <aside className="section-shell p-6 md:p-8">
                <p className="section-kicker">متاجر مرتبطة</p>
                <h3 className="mb-4 text-lg font-bold text-foreground">اكتشف متاجر أخرى ضمن نفس الفئة</h3>
                <div className="space-y-2.5">
                  {relatedStores.map((related) => (
                    <Link
                      key={related.id}
                      to={`/stores/${related.slug}`}
                      className="card-premium flex items-center gap-3 p-3.5 transition-all hover:shadow-[var(--shadow-elevated)]"
                    >
                      {related.logo_url ? (
                        <img src={related.logo_url} alt={related.name_ar} className="h-11 w-11 rounded-md object-cover" loading="lazy" />
                      ) : (
                        <div className="icon-shell h-11 w-11"><Store className="h-4.5 w-4.5" /></div>
                      )}
                      <span className="flex-1 text-sm font-semibold text-foreground">{related.name_ar}</span>
                      <ArrowLeft className="h-3.5 w-3.5 text-primary" />
                    </Link>
                  ))}
                </div>
              </aside>
            )}

            {/* CTA */}
            <div className="card-layered p-6 text-center md:p-8">
              <p className="section-kicker">هل تريد وحدة مجاورة؟</p>
              <h3 className="mb-3 text-lg font-bold text-foreground">امتلك أو أجّر وحدتك في مول البستان</h3>
              <p className="mx-auto mb-5 max-w-xs text-sm text-muted-foreground">انضم لمنظومة التقنية الأولى في القاهرة الجديدة</p>
              <Link to="/leasing">
                <Button variant="cta" size="lg" className="w-full">استعلم عن الوحدات المتاحة</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

/* ── Helper components ── */

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-5 py-4 text-center" style={{ direction: 'rtl' }}>
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-bold text-foreground">{value}</p>
    </div>
  );
}

function ContactRow({ icon: Icon, text, dir }: { icon: React.ComponentType<{ className?: string }>; text: string; dir?: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-muted-foreground">
      <span className="icon-shell h-8 w-8"><Icon className="h-3.5 w-3.5" /></span>
      <span dir={dir}>{text}</span>
    </div>
  );
}

export default StoreDetail;
