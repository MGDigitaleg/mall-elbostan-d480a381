import { useParams, Link, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SEOHead, organizationLd } from "@/components/SEOHead";
import { getDeviceBySlug, deviceCatalog } from "@/lib/deviceCatalog";
import { TenantLogo } from "@/components/TenantLogo";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Store as StoreIcon } from "lucide-react";
import { optimizeImageUrl } from "@/lib/imageUtils";

const BASE_URL = "https://mallelbostan.com";

export default function DeviceCategory() {
  const { slug = "" } = useParams();
  const device = getDeviceBySlug(slug);

  if (!device) return <Navigate to="/stores" replace />;

  const { Icon, labelAr, labelEn, parentCategory, intro, faq, relatedSlugs, productKeywords, seo } = device;

  // Stores in this category
  const { data: stores = [] } = useQuery({
    queryKey: ["device-stores", parentCategory],
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

  // Related products (text-match on name/brand for keywords)
  const { data: products = [] } = useQuery({
    queryKey: ["device-products", slug, productKeywords],
    queryFn: async () => {
      const orFilter = productKeywords
        .map((kw) => `name_ar.ilike.%${kw}%,brand.ilike.%${kw}%`)
        .join(",");
      const { data } = await supabase
        .from("products")
        .select("id, slug, name_ar, image_url, price, brand")
        .eq("status", "published")
        .not("image_url", "is", null)
        .or(orFilter)
        .limit(8);
      return data ?? [];
    },
  });

  const breadcrumbs = [
    { name: "الأجهزة", url: `/stores` },
    { name: labelAr, url: `/devices/${slug}` },
  ];

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: seo.title,
    description: seo.description,
    url: `${BASE_URL}/devices/${slug}`,
    inLanguage: "ar-EG",
    isPartOf: { "@id": `${BASE_URL}/#website` },
    about: { "@type": "Thing", name: labelAr, alternateName: labelEn },
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
          ...(p.price ? { offers: { "@type": "Offer", price: p.price, priceCurrency: "EGP", availability: "https://schema.org/InStock" } } : {}),
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
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        breadcrumbs={breadcrumbs}
        jsonLd={[collectionLd, faqLd, organizationLd]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(160deg, #071326 0%, #0D1F3C 50%, #071326 100%)" }}>
        <div className="container py-14 md:py-20">
          <nav aria-label="مسار التنقل" className="mb-6 font-arabic text-[0.78rem] text-white/60">
            <Link to="/" className="hover:text-white">الرئيسية</Link>
            <span className="mx-2">▸</span>
            <Link to="/stores" className="hover:text-white">الأجهزة</Link>
            <span className="mx-2">▸</span>
            <span className="text-white">{labelAr}</span>
          </nav>
          <div className="flex flex-col items-start gap-5">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl border"
              style={{ borderColor: "rgba(205,187,154,0.3)", background: "rgba(255,255,255,0.04)" }}
            >
              <Icon size={32} className="text-[#CDBB9A]" strokeWidth={1.6} />
            </div>
            <h1 className="font-arabic-display text-[clamp(1.9rem,4vw,3rem)] font-bold leading-tight text-white">
              {labelAr} في مول البستان
            </h1>
            <p className="max-w-3xl font-arabic text-[1.05rem] leading-relaxed text-white/75">
              أكبر تجمّع متخصص في {labelAr} بالقاهرة الجديدة — تصفّح المحلات والمنتجات وموقعها داخل المول.
            </p>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-background">
        <div className="container py-12 md:py-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-5 font-arabic-display text-2xl font-semibold">نبذة عن قسم {labelAr}</h2>
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
            <h2 className="mb-8 font-arabic-display text-2xl font-semibold">منتجات مختارة من {labelAr}</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {products.map((p) => (
                <Link
                  key={p.id}
                  to={`/products/${p.slug}`}
                  className="group overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden" style={{ background: "#F1F5F9" }}>
                    <img
                      src={optimizeImageUrl(p.image_url ?? "", { width: 400 })}
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
            <p className="mb-5 font-arabic text-foreground/75">حدد موقع محلات {labelAr} بدقة داخل أدوار مول البستان.</p>
            <Button asChild size="lg" className="font-arabic">
              <Link to={`/map?category=${encodeURIComponent(parentCategory)}`}>
                افتح الخريطة
                <ArrowLeft className="mr-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Related categories */}
      {relatedSlugs.length > 0 && (
        <section className="bg-background">
          <div className="container py-12 md:py-16">
            <h2 className="mb-6 font-arabic-display text-2xl font-semibold">فئات ذات صلة</h2>
            <div className="flex flex-wrap gap-3">
              {relatedSlugs
                .map((rs) => deviceCatalog[rs])
                .filter(Boolean)
                .map((r) => (
                  <Link
                    key={r.slug}
                    to={`/devices/${r.slug}`}
                    className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 font-arabic text-sm transition-colors hover:bg-muted"
                  >
                    <r.Icon size={16} />
                    {r.labelAr}
                  </Link>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* About mall */}
      <section className="bg-muted/30">
        <div className="container py-12 md:py-14">
          <div className="mx-auto max-w-3xl text-center">
            <StoreIcon className="mx-auto mb-3 h-7 w-7 text-primary" />
            <h2 className="mb-3 font-arabic-display text-xl font-semibold">عن مول البستان</h2>
            <p className="font-arabic text-foreground/80">
              مول البستان هو الوجهة الأولى للتقنية في القاهرة الجديدة، يضم أكثر من 150 محلاً متخصصاً على ثلاثة أدوار،
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
            <h2 className="mb-6 font-arabic-display text-2xl font-semibold">أسئلة شائعة عن {labelAr}</h2>
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
