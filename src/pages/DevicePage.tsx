import { useParams, Link, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SEOHead, organizationLd } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Store as StoreIcon } from "lucide-react";
import { optimizeImageUrl } from "@/lib/imageUtils";
import { TenantLogo } from "@/components/TenantLogo";
import { DeviceBreadcrumb } from "@/components/devices/DeviceBreadcrumb";
import { DeviceRelatedGrid } from "@/components/devices/DeviceRelatedGrid";
import {
  resolveDevicePath,
  getClustersForPillar,
  getLongTailSiblings,
  priceTiers,
  type ResolvedDevice,
} from "@/lib/deviceTaxonomy";

const BASE_URL = "https://mallelbostan.com";

/** Extract a label/title-friendly string from a resolved device. */
function getMeta(resolved: ResolvedDevice) {
  if (resolved.level === "pillar") {
    const { pillar } = resolved;
    return {
      labelAr: pillar.labelAr,
      h1: `${pillar.labelAr} في مول البستان`,
      intro: pillar.longIntro,
      shortIntro: pillar.shortIntro,
      keywords: [pillar.labelAr, pillar.labelEn, "مول البستان", "القاهرة الجديدة"].join(", "),
      title: `${pillar.labelAr} — مول البستان، التجمع الخامس`,
      description: pillar.shortIntro,
      productKeywords: pillar.productKeywords,
      parentCategory: pillar.parentCategory,
      url: `/devices/${pillar.slug}`,
    };
  }
  if (resolved.level === "cluster") {
    const { pillar, cluster } = resolved;
    return {
      labelAr: cluster.labelAr,
      h1: `${cluster.labelAr} في مول البستان`,
      intro: `يضم مول البستان أكبر تجمّع متخصص في ${cluster.labelAr} في القاهرة الجديدة، حيث تجد أحدث الموديلات من العلامات التجارية الكبرى بضمان الوكيل الرسمي. تنوع الفئات السعرية وفِرق بيع متخصصة لمساعدتك في الاختيار المناسب لاحتياجك.`,
      shortIntro: `أكبر تجمّع لمحلات ${cluster.labelAr} في مول البستان — التجمع الخامس، القاهرة الجديدة.`,
      keywords: [cluster.labelAr, cluster.labelEn, pillar.labelAr, "مول البستان"].join(", "),
      title: `${cluster.labelAr} في مول البستان — أحدث الموديلات والأسعار`,
      description: `تصفّح ${cluster.labelAr} في مول البستان بالتجمع الخامس: أفضل الأسعار، ضمان معتمد، وأكبر مجموعة من العلامات التجارية في القاهرة الجديدة.`,
      productKeywords: cluster.productKeywords,
      parentCategory: pillar.parentCategory,
      url: `/devices/${pillar.slug}/${cluster.slug}`,
    };
  }
  // longtail
  const { pillar, cluster, longtail } = resolved;
  return {
    labelAr: longtail.labelAr,
    h1: `${longtail.labelAr} في مول البستان`,
    intro: `اكتشف ${longtail.labelAr} في مول البستان بالتجمع الخامس، القاهرة الجديدة. مجموعة مختارة من العلامات التجارية الموثوقة، بأسعار تنافسية وضمان معتمد. احصل على نصائح فِرق البيع المتخصصة لاختيار الجهاز الأنسب لاحتياجك.`,
    shortIntro: `${longtail.labelAr} — مجموعة مختارة في مول البستان، القاهرة الجديدة.`,
    keywords: [longtail.labelAr, cluster.labelAr, pillar.labelAr, "مول البستان"].join(", "),
    title: `${longtail.labelAr} — مول البستان، التجمع الخامس`,
    description: `تسوّق ${longtail.labelAr} في مول البستان بالتجمع الخامس بأفضل الأسعار وضمان معتمد. تصفّح المحلات والمنتجات والموقع داخل المول.`,
    productKeywords: longtail.productKeywords,
    parentCategory: pillar.parentCategory,
    url: `/devices/${pillar.slug}/${cluster.slug}/${longtail.slug}`,
  };
}

export default function DevicePage() {
  const { pillar: pillarSlug, cluster: clusterSlug, longtail: longtailSlug } = useParams();
  const resolved = resolveDevicePath(pillarSlug, clusterSlug, longtailSlug);

  if (!resolved) return <Navigate to="/stores" replace />;

  const meta = getMeta(resolved);
  const { productKeywords, parentCategory, labelAr, intro, url, title, description, keywords, h1 } = meta;

  // ── Stores in this category
  const { data: stores = [] } = useQuery({
    queryKey: ["device-page-stores", parentCategory],
    queryFn: async () => {
      const { data } = await supabase
        .from("stores")
        .select("id, slug, name_ar, name_en, logo_url, short_description_ar, category, unit_code")
        .eq("category", parentCategory)
        .neq("status", "hidden")
        .order("featured", { ascending: false })
        .limit(12);
      return data ?? [];
    },
  });

  // ── Related products (price-tier filtered for longtail/price pages)
  const priceUpperBound =
    resolved.level === "longtail" && resolved.longtail.modifierKind === "price"
      ? priceTiers.find((p) => p.slug === resolved.longtail.slug)?.upperBound
      : undefined;

  const { data: products = [] } = useQuery({
    queryKey: ["device-page-products", url, productKeywords, priceUpperBound],
    queryFn: async () => {
      if (!productKeywords.length) return [];
      const orFilter = productKeywords
        .flatMap((kw) => {
          const safe = kw.replace(/[%,()]/g, "").trim();
          if (!safe) return [];
          return [`name_ar.ilike.%${safe}%`, `brand.ilike.%${safe}%`];
        })
        .join(",");

      let q = supabase
        .from("products")
        .select("id, slug, name_ar, image_url, price, brand")
        .eq("status", "published")
        .not("image_url", "is", null)
        .or(orFilter)
        .limit(40);

      if (priceUpperBound && priceUpperBound !== Infinity) {
        q = q.lte("price", priceUpperBound);
      }

      const { data } = await q;
      const candidates = data ?? [];

      const scored = candidates.map((p) => {
        const hay = `${p.name_ar ?? ""} ${p.brand ?? ""}`.toLowerCase();
        let score = 0;
        for (const raw of productKeywords) {
          const kw = raw.toLowerCase().trim();
          if (!kw) continue;
          const isShortLatin = /^[a-z0-9]{1,3}$/.test(kw);
          if (isShortLatin) {
            const re = new RegExp(`(^|[^a-z0-9])${kw}([^a-z0-9]|$)`, "i");
            if (re.test(hay)) score += 2;
          } else if (hay.includes(kw)) {
            score += kw.length >= 5 ? 3 : 2;
          }
        }
        return { p, score };
      });

      return scored
        .filter((s) => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 12)
        .map((s) => s.p);
    },
  });

  // ── Build breadcrumbs
  const crumbs: { name: string; url: string }[] = [{ name: "الأجهزة", url: "/stores" }];
  const visualCrumbs: { labelAr: string; to?: string }[] = [];

  if (resolved.level === "pillar") {
    crumbs.push({ name: resolved.pillar.labelAr, url: `/devices/${resolved.pillar.slug}` });
    visualCrumbs.push({ labelAr: resolved.pillar.labelAr });
  } else if (resolved.level === "cluster") {
    crumbs.push({ name: resolved.pillar.labelAr, url: `/devices/${resolved.pillar.slug}` });
    crumbs.push({ name: resolved.cluster.labelAr, url });
    visualCrumbs.push(
      { labelAr: resolved.pillar.labelAr, to: `/devices/${resolved.pillar.slug}` },
      { labelAr: resolved.cluster.labelAr },
    );
  } else {
    crumbs.push({ name: resolved.pillar.labelAr, url: `/devices/${resolved.pillar.slug}` });
    crumbs.push({ name: resolved.cluster.labelAr, url: `/devices/${resolved.pillar.slug}/${resolved.cluster.slug}` });
    crumbs.push({ name: resolved.longtail.labelAr, url });
    visualCrumbs.push(
      { labelAr: resolved.pillar.labelAr, to: `/devices/${resolved.pillar.slug}` },
      { labelAr: resolved.cluster.labelAr, to: `/devices/${resolved.pillar.slug}/${resolved.cluster.slug}` },
      { labelAr: resolved.longtail.labelAr },
    );
  }

  // ── FAQ (templated, varies by level)
  const faq = [
    { q: `هل ${labelAr} متوفرة في مول البستان؟`, a: `نعم، تتوفر ${labelAr} في عدد من المحلات المتخصصة داخل مول البستان بالتجمع الخامس، القاهرة الجديدة.` },
    { q: `هل يوجد ضمان وكيل؟`, a: `تلتزم محلات المول ببيع منتجات أصلية بضمان معتمد من الوكيل الرسمي، مع توضيح مدة الضمان قبل الشراء.` },
    { q: `هل يمكنني مقارنة الأسعار في أكثر من محل؟`, a: `بالتأكيد، تعدد المحلات المتخصصة في المول يتيح للزائر مقارنة المواصفات والأسعار في زيارة واحدة.` },
    { q: `أين يقع مول البستان؟`, a: `مول البستان موجود في التجمع الخامس بالقاهرة الجديدة، ويفتتح فرعه الرئيسي رسمياً في مايو 2026.` },
  ];

  // ── Thin-content guard: noindex if no stores AND no products AND no siblings
  const siblings: { to: string; labelAr: string }[] = [];
  if (resolved.level === "pillar") {
    for (const c of getClustersForPillar(resolved.pillar.slug)) {
      siblings.push({ to: `/devices/${resolved.pillar.slug}/${c.slug}`, labelAr: c.labelAr });
    }
  } else if (resolved.level === "cluster") {
    // Show sibling clusters + a curated set of long-tail entries
    for (const c of getClustersForPillar(resolved.pillar.slug)) {
      if (c.slug !== resolved.cluster.slug) {
        siblings.push({ to: `/devices/${resolved.pillar.slug}/${c.slug}`, labelAr: c.labelAr });
      }
    }
    for (const lt of getLongTailSiblings(resolved.pillar.slug, resolved.cluster.slug).slice(0, 8)) {
      siblings.push({
        to: `/devices/${resolved.pillar.slug}/${resolved.cluster.slug}/${lt.slug}`,
        labelAr: lt.labelAr,
      });
    }
  } else {
    // Long-tail: show 8 sibling long-tails + parent cluster
    siblings.push({
      to: `/devices/${resolved.pillar.slug}/${resolved.cluster.slug}`,
      labelAr: `كل ${resolved.cluster.labelAr}`,
    });
    const sibs = getLongTailSiblings(resolved.pillar.slug, resolved.cluster.slug)
      .filter((lt) => lt.slug !== resolved.longtail.slug)
      .slice(0, 8);
    for (const lt of sibs) {
      siblings.push({
        to: `/devices/${resolved.pillar.slug}/${resolved.cluster.slug}/${lt.slug}`,
        labelAr: lt.labelAr,
      });
    }
  }

  const noindex =
    resolved.level === "longtail" && stores.length === 0 && products.length === 0 && siblings.length < 3;

  // ── Schemas
  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url: `${BASE_URL}${url}`,
    inLanguage: "ar-EG",
    isPartOf: { "@id": `${BASE_URL}/#website` },
    about: { "@type": "Thing", name: labelAr },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.slice(0, 10).map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Product",
          name: p.name_ar,
          url: `${BASE_URL}/products/${p.slug}`,
          image: p.image_url ?? undefined,
          ...(p.brand ? { brand: { "@type": "Brand", name: p.brand } } : {}),
          ...(p.price
            ? { offers: { "@type": "Offer", price: p.price, priceCurrency: "EGP", availability: "https://schema.org/InStock" } }
            : {}),
        },
      })),
    },
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <SEOHead
        title={title}
        description={description}
        keywords={keywords}
        breadcrumbs={crumbs}
        jsonLd={[collectionLd, faqLd, organizationLd]}
        noIndex={noindex}
      />

      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #071326 0%, #0D1F3C 50%, #071326 100%)" }}
      >
        <div className="container py-14 md:py-20">
          <div className="mb-6">
            <DeviceBreadcrumb items={[{ labelAr: "الأجهزة", to: "/stores" }, ...visualCrumbs]} />
          </div>
          <div className="flex flex-col items-start gap-5">
            <h1 className="font-arabic-display text-[clamp(1.9rem,4vw,3rem)] font-bold leading-tight text-white">
              {h1}
            </h1>
            <p className="max-w-3xl font-arabic text-[1.05rem] leading-relaxed text-white/75">
              {meta.shortIntro}
            </p>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-background">
        <div className="container py-12 md:py-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-5 font-arabic-display text-2xl font-semibold">نبذة عن {labelAr}</h2>
            <p className="font-arabic text-[1rem] leading-[1.95] text-foreground/85">{intro}</p>
          </div>
        </div>
      </section>

      {/* Stores */}
      {stores.length > 0 && (
        <section className="bg-muted/30">
          <div className="container py-12 md:py-16">
            <h2 className="mb-8 font-arabic-display text-2xl font-semibold">المحلات المتخصصة</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {stores.map((s) => (
                <Link
                  key={s.id}
                  to={`/stores/${s.slug}`}
                  className="group flex flex-col items-center gap-3 rounded-xl border bg-card p-4 transition-shadow hover:shadow-md"
                >
                  <TenantLogo src={s.logo_url} alt={s.name_ar} fallbackName={s.name_ar} size="md" rounded="lg" />
                  <span className="text-center font-arabic text-[0.85rem] font-medium leading-tight">{s.name_ar}</span>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button asChild variant="outline" className="font-arabic">
                <Link to={`/stores?category=${encodeURIComponent(parentCategory)}`}>
                  عرض كل محلات {parentCategory}
                  <ArrowLeft className="mr-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Products */}
      {products.length > 0 && (
        <section className="bg-background">
          <div className="container py-12 md:py-16">
            <h2 className="mb-8 font-arabic-display text-2xl font-semibold">منتجات مختارة</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {products.map((p) => (
                <Link
                  key={p.id}
                  to={`/products/${p.slug}`}
                  className="group overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden" style={{ background: "#F1F5F9" }}>
                    <img
                      src={optimizeImageUrl(p.image_url ?? "", 400)}
                      alt={p.name_ar}
                      loading="lazy"
                      className="h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="line-clamp-2 font-arabic text-[0.88rem] font-medium leading-snug">{p.name_ar}</h3>
                    {p.price && (
                      <div className="mt-2 font-arabic-display text-sm font-semibold text-primary">
                        {Number(p.price).toLocaleString("ar-EG")} ج.م
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Map CTA */}
      <section className="bg-muted/30">
        <div className="container py-12 md:py-14">
          <div className="mx-auto max-w-2xl rounded-2xl border bg-card p-8 text-center">
            <MapPin className="mx-auto mb-3 h-7 w-7 text-primary" />
            <h2 className="mb-2 font-arabic-display text-xl font-semibold">على الخريطة التفاعلية</h2>
            <p className="mb-5 font-arabic text-foreground/75">
              حدد موقع محلات {labelAr} بدقة داخل أدوار مول البستان.
            </p>
            <Button asChild size="lg" className="font-arabic">
              <Link to={`/map?category=${encodeURIComponent(parentCategory)}`}>
                افتح الخريطة
                <ArrowLeft className="mr-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Related */}
      <DeviceRelatedGrid title="صفحات ذات صلة" items={siblings} />

      {/* About mall */}
      <section className="bg-muted/30">
        <div className="container py-12 md:py-14">
          <div className="mx-auto max-w-3xl text-center">
            <StoreIcon className="mx-auto mb-3 h-7 w-7 text-primary" />
            <h2 className="mb-3 font-arabic-display text-xl font-semibold">عن مول البستان</h2>
            <p className="font-arabic text-foreground/80">
              مول البستان وجهة التقنية الأولى في القاهرة الجديدة، يضم أكثر من 150 محلاً متخصصاً على ثلاثة أدوار،
              ويفتتح فرع التجمع الخامس رسمياً في مايو 2026.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <Button asChild variant="outline" className="font-arabic">
                <Link to="/about">عن المول</Link>
              </Button>
              <Button asChild variant="outline" className="font-arabic">
                <Link to="/new-cairo-branch">فرع التجمع الخامس</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-background">
        <div className="container py-12 md:py-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 font-arabic-display text-2xl font-semibold">أسئلة شائعة</h2>
            <div className="space-y-4">
              {faq.map((f, i) => (
                <details key={i} className="group rounded-xl border bg-card p-5">
                  <summary className="cursor-pointer list-none font-arabic font-semibold text-foreground">
                    {f.q}
                  </summary>
                  <p className="mt-3 font-arabic text-[0.95rem] leading-relaxed text-foreground/80">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
