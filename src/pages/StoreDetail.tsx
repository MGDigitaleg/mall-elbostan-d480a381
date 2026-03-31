import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Clock3, Globe, Layers3, Mail, MapPin, Phone, Store } from "lucide-react";
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

  if (isLoading) return <MainLayout><div className="container py-20 text-center text-muted-foreground">جاري التحميل...</div></MainLayout>;
  if (!store) return <MainLayout><div className="container py-20 text-center"><h1 className="mb-4 text-2xl font-bold text-foreground">المتجر غير موجود</h1><Link to="/stores"><Button variant="outline-blue">العودة للمتاجر</Button></Link></div></MainLayout>;

  return (
    <MainLayout>
      <SEOHead title={store.name_ar} description={store.short_description_ar ?? `${store.name_ar} في مول البستان`} breadcrumbs={[{ name: "المتاجر", url: "/stores" }, { name: store.name_ar, url: `/stores/${store.slug}` }]} />
      <div className="container max-w-6xl py-8 md:py-12">
        <Link to="/stores" className="mb-6 flex items-center gap-1 text-sm text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> العودة لدليل المتاجر
        </Link>

        <section className="brand-shell overflow-hidden rounded-[2.6rem] px-6 py-8 md:px-8 md:py-10">
          <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
            <div className="space-y-5">
              <div className="flex items-center gap-5">
                {store.logo_url ? (
                  <img src={store.logo_url} alt={store.name_ar} className="h-24 w-24 rounded-[1.4rem] object-cover shadow-[var(--shadow-soft)]" />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-[1.4rem] bg-primary/10 shadow-[var(--shadow-soft)]"><Store className="h-10 w-10 text-primary" /></div>
                )}
                <div>
                  <h1 className="text-4xl font-black text-foreground md:text-5xl">{store.name_ar}</h1>
                  {store.name_en && <p className="mt-2 font-poppins text-base text-muted-foreground">{store.name_en}</p>}
                  {store.category && <span className="mt-3 inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">{store.category}</span>}
                </div>
              </div>

              <p className="max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                {store.short_description_ar ?? "صفحة تفصيلية تقدّم هذا المتجر ضمن تجربة مول البستان التقنية، مع عرض أوضح للفئة، بيانات التواصل، ومسار الزيارة داخل المنظومة."}
              </p>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="soft-card p-4">
                  <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">الفئة</p>
                  <p className="mt-2 text-base font-bold text-foreground">{store.category ?? "متجر داخل المول"}</p>
                </div>
                <div className="soft-card p-4">
                  <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">حالة الظهور</p>
                  <p className="mt-2 text-base font-bold text-foreground">{store.status === "available" ? "فرصة متاحة" : "متجر ضمن المنظومة"}</p>
                </div>
                <div className="soft-card p-4">
                  <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">المسار التالي</p>
                  <p className="mt-2 text-base font-bold text-foreground">الخريطة أو التواصل</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link to="/map"><Button variant="outline-blue" size="lg">استكشف موقعه على الخريطة</Button></Link>
                {store.whatsapp ? (
                  <a href={`https://wa.me/${store.whatsapp}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="cta" size="lg">تواصل عبر واتساب</Button>
                  </a>
                ) : null}
              </div>
            </div>

            <div className="section-shell overflow-hidden rounded-[2.2rem] p-3 shadow-[var(--shadow-elevated)]">
              <div className="image-shell aspect-[16/11] overflow-hidden rounded-[1.8rem]">
                <img src={heroImage} alt={store.name_ar} className="h-full w-full object-cover object-center" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/28 via-transparent to-background/10" />
              </div>
              <div className="glass absolute bottom-7 right-7 max-w-xs rounded-[1.4rem] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Store Profile</p>
                <p className="mt-2 text-base font-bold text-foreground">صفحة متجر مصممة لتكون امتدادًا متناسقًا لهوية Mall Elbostan</p>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <section className="section-shell p-6 md:p-8">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="section-kicker">عن المتجر</p>
                  <h2 className="text-2xl font-bold text-foreground">قراءة أوضح لدور المتجر داخل المنظومة</h2>
                </div>
                <Layers3 className="h-5 w-5 text-primary" />
              </div>
              <p className="text-base leading-8 text-muted-foreground">
                {store.long_description_ar ?? store.short_description_ar ?? "سيتم تحديث وصف هذا المتجر قريبًا بمحتوى تفصيلي يوضح نوع المنتجات أو الخدمات التي يقدّمها داخل مول البستان."}
              </p>
            </section>

            {activeStory ? (
              <section className="section-shell p-6 md:p-8">
                <p className="section-kicker">سرد الفئة</p>
                <h2 className="text-2xl font-bold text-foreground">{activeStory.title}</h2>
                <p className="mt-4 text-base leading-8 text-muted-foreground">{activeStory.description}</p>
              </section>
            ) : null}

            {gallery.length > 1 ? (
              <section className="section-shell p-6 md:p-8">
                <p className="section-kicker">معرض بصري</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {gallery.slice(0, 4).map((image, index) => (
                    <div key={`${image}-${index}`} className="image-shell aspect-[4/3] rounded-[1.4rem]">
                      <img src={image} alt={`${store.name_ar} ${index + 1}`} className="h-full w-full object-cover" loading="lazy" />
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          <div className="space-y-6">
            <section className="section-shell p-6 md:p-8">
              <p className="section-kicker">معلومات المتجر</p>
              <h2 className="mb-4 text-2xl font-bold text-foreground">معلومات الاتصال والزيارة</h2>
              <div className="space-y-4 text-muted-foreground">
                {store.phone ? <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> <span dir="ltr">{store.phone}</span></p> : null}
                {store.email ? <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> {store.email}</p> : null}
                {store.website ? <p className="flex items-center gap-2"><Globe className="h-4 w-4 text-primary" /> <a href={store.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{store.website}</a></p> : null}
                {store.opening_hours ? <p className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-primary" /> {store.opening_hours}</p> : null}
                {store.unit_code ? <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> وحدة {store.unit_code}</p> : null}
              </div>
            </section>

            {relatedStores && relatedStores.length > 0 ? (
              <section className="section-shell p-6 md:p-8">
                <p className="section-kicker">متاجر مرتبطة</p>
                <h2 className="mb-4 text-2xl font-bold text-foreground">اكتشف متاجر أخرى ضمن نفس الفئة</h2>
                <div className="space-y-3">
                  {relatedStores.map((related) => (
                    <Link key={related.id} to={`/stores/${related.slug}`} className="flex items-center justify-between rounded-[1.2rem] border border-border/70 bg-card/70 p-4 transition-colors hover:border-primary/30 hover:bg-card">
                      <div className="flex items-center gap-3">
                        {related.logo_url ? (
                          <img src={related.logo_url} alt={related.name_ar} className="h-12 w-12 rounded-[0.9rem] object-cover" loading="lazy" />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-[0.9rem] bg-primary/10"><Store className="h-5 w-5 text-primary" /></div>
                        )}
                        <span className="font-semibold text-foreground">{related.name_ar}</span>
                      </div>
                      <ArrowLeft className="h-4 w-4 text-primary" />
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default StoreDetail;
