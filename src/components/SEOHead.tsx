import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { OFFICIAL_PHONE } from "@/lib/contactInfo";

const BASE_URL = "https://mallelbostan.com";

interface SEOHeadProps {
  title: string;
  description: string;
  titleEn?: string;
  descriptionEn?: string;
  ogImage?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  ogImageAlt?: string;
  type?: "website" | "article";
  keywords?: string;
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  twitterCard?: "summary" | "summary_large_image";
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  breadcrumbs?: { name: string; url: string }[];
  noIndex?: boolean;
  /** Topical tags emitted as og/article tags + appended to keywords. Useful for store, category, and collection pages. */
  tags?: string[];
}

export function SEOHead({
  title,
  description,
  titleEn,
  descriptionEn,
  ogImage,
  ogImageWidth,
  ogImageHeight,
  ogImageAlt,
  type = "website",
  keywords,
  articlePublishedTime,
  articleModifiedTime,
  twitterCard = "summary_large_image",
  jsonLd,
  breadcrumbs,
  noIndex,
  tags,
}: SEOHeadProps) {
  const cleanTags = (tags ?? [])
    .map((t) => (t ?? "").trim())
    .filter((t, i, a) => t.length > 0 && a.indexOf(t) === i)
    .slice(0, 12);
  const mergedKeywords = (() => {
    if (cleanTags.length === 0) return keywords;
    if (!keywords) return cleanTags.join(", ");
    return `${keywords}, ${cleanTags.join(", ")}`;
  })();
  const location = useLocation();
  const fullTitle = `${title} | مول البستان`;
  const canonical = `${BASE_URL}${location.pathname}`;
  const ogImg = ogImage ?? `${BASE_URL}/og-default.jpg`;
  const ogW = ogImageWidth ?? 1200;
  const ogH = ogImageHeight ?? 630;
  const ogAlt = ogImageAlt ?? fullTitle;

  // Trim description to ≤160 chars at last whole word for optimal SERP display
  const trimmedDescription = (() => {
    if (!description) return description;
    if (description.length <= 160) return description;
    const cut = description.slice(0, 157);
    const lastSpace = cut.lastIndexOf(" ");
    return `${(lastSpace > 80 ? cut.slice(0, lastSpace) : cut).trim()}…`;
  })();
  const trimmedDescriptionEn = (() => {
    if (!descriptionEn) return descriptionEn;
    if (descriptionEn.length <= 160) return descriptionEn;
    const cut = descriptionEn.slice(0, 157);
    const lastSpace = cut.lastIndexOf(" ");
    return `${(lastSpace > 80 ? cut.slice(0, lastSpace) : cut).trim()}…`;
  })();

  const breadcrumbLd = breadcrumbs
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "الرئيسية", item: BASE_URL },
          ...breadcrumbs.map((b, i) => ({
            "@type": "ListItem",
            position: i + 2,
            name: b.name,
            item: `${BASE_URL}${b.url}`,
          })),
        ],
      }
    : null;

  const allJsonLd = [
    ...(jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []),
    ...(breadcrumbLd ? [breadcrumbLd] : []),
  ];

  return (
    <Helmet prioritizeSeoTags>
      <html lang="ar" dir="rtl" />
      <body dir="rtl" />
      <title>{fullTitle}</title>
      <meta name="description" content={trimmedDescription} />
      <link rel="canonical" href={canonical} />
      {/* robots meta is set below in the SEO crawler hints block */}
      {mergedKeywords && <meta name="keywords" content={mergedKeywords} />}
      <meta name="author" content="مول البستان" />
      <meta name="theme-color" content="#071326" media="(prefers-color-scheme: dark)" />
      <meta name="theme-color" content="#1F61FF" media="(prefers-color-scheme: light)" />

      {/* Alternate language hints */}
      <link rel="alternate" hrefLang="ar-EG" href={canonical} />
      <link rel="alternate" hrefLang="x-default" href={canonical} />
      {titleEn && <meta name="title" lang="en" content={`${titleEn} | Mall Elbostan`} />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={trimmedDescriptionEn ?? trimmedDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImg} />
      <meta property="og:image:width" content={String(ogW)} />
      <meta property="og:image:height" content={String(ogH)} />
      <meta property="og:image:alt" content={ogAlt} />
      <meta property="og:image:type" content={ogImg.endsWith(".svg") ? "image/svg+xml" : ogImg.endsWith(".jpg") || ogImg.endsWith(".jpeg") ? "image/jpeg" : "image/png"} />
      <meta property="og:locale" content="ar_EG" />
      <meta property="og:locale:alternate" content="en_US" />
      <meta property="og:site_name" content="مول البستان" />

      {/* Article meta for blog posts */}
      {type === "article" && articlePublishedTime && (
        <meta property="article:published_time" content={articlePublishedTime} />
      )}
      {type === "article" && articleModifiedTime && (
        <meta property="article:modified_time" content={articleModifiedTime} />
      )}

      {/* Topical tags — boost social previews & Google discovery for store/category/collection pages */}
      {cleanTags.map((t) => (
        <meta key={`og-tag-${t}`} property={type === "article" ? "article:tag" : "og:tag"} content={t} />
      ))}
      {cleanTags.map((t) => (
        <meta key={`tag-${t}`} name="tag" content={t} />
      ))}

      {/* Geo targeting — improves local SEO for Egypt / Cairo */}
      <meta name="geo.region" content="EG-C" />
      <meta name="geo.placename" content="القاهرة الجديدة" />
      <meta name="geo.position" content="30.03;31.46" />
      <meta name="ICBM" content="30.03, 31.46" />

      {/* Facebook business contact data */}
      <meta property="business:contact_data:locality" content="القاهرة الجديدة" />
      <meta property="business:contact_data:region" content="القاهرة" />
      <meta property="business:contact_data:country_name" content="Egypt" />

      {/* Search engine crawler hints */}
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"} />
      <meta name="googlebot" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      <meta name="bingbot" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      <meta name="format-detection" content="telephone=yes" />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={trimmedDescriptionEn ?? trimmedDescription} />
      <meta name="twitter:image" content={ogImg} />
      <meta name="twitter:image:alt" content={ogAlt} />

      {/* JSON-LD — `prioritizeSeoTags` hoists these near the top of <head> so crawlers get them before render-blocking work.
          `</` is escaped to prevent HTML parser bailout if the payload ever contains a literal closing tag. */}
      {allJsonLd.map((ld, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(ld).replace(/</g, "\\u003c")}
        </script>
      ))}
    </Helmet>
  );
}

// ─── Reusable JSON-LD schemas ───

/**
 * Build the Organization JSON-LD with a runtime phone override.
 * Pass the value from `useSitePhone()` to inject the admin-controlled phone live.
 * Falls back to the build-time OFFICIAL_PHONE constant if no override is given.
 */
export function buildOrganizationLd(phoneOverride?: string) {
  const phone = (phoneOverride ?? OFFICIAL_PHONE).trim();
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ElectronicsStore"],
    "@id": `${BASE_URL}/#organization`,
    name: "مول البستان",
    alternateName: ["Mall Elbostan", "El Bostan Mall"],
    description: "أكبر مول متخصص في الكمبيوتر والموبايلات والإلكترونيات في القاهرة الجديدة — أكثر من 150 محل للابتوبات، هواتف، جيمنج، إكسسوارات، وصيانة بالتجمع الخامس.",
    url: BASE_URL,
    logo: `${BASE_URL}/og-default.jpg`,
    image: `${BASE_URL}/og-default.jpg`,
    ...(phone ? { telephone: phone } : {}),
    priceRange: "$$",
    currenciesAccepted: "EGP",
    paymentAccepted: "Cash, Credit Card",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "10:00",
        closes: "22:00",
      },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "شارع التسعين، التجمع الخامس",
      addressLocality: "القاهرة الجديدة",
      addressRegion: "القاهرة",
      postalCode: "11835",
      addressCountry: "EG",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 30.03,
      longitude: 31.46,
    },
    areaServed: [
      { "@type": "City", name: "القاهرة الجديدة" },
      { "@type": "City", name: "مدينتي" },
      { "@type": "City", name: "الرحاب" },
      { "@type": "City", name: "القاهرة" },
    ],
    hasMap: `${BASE_URL}/map`,
    foundingDate: "1990",
    keywords: "مول كمبيوتر, محلات موبايلات, لابتوب, جيمنج, إلكترونيات, القاهرة الجديدة, التجمع الخامس",
    sameAs: [
      "https://www.facebook.com/mallelbostan",
      "https://www.instagram.com/mallelbostan",
      "https://www.youtube.com/@mallelbostan",
      "https://www.tiktok.com/@mallelbostan",
      "https://mallelbostan.com",
    ],
  };
}

/** Static export kept for backward compatibility with existing imports. */
export const organizationLd = buildOrganizationLd();

export const shoppingCenterLd = {
  "@context": "https://schema.org",
  "@type": "ShoppingCenter",
  "@id": `${BASE_URL}/#mall`,
  name: "مول البستان",
  alternateName: ["Mall Elbostan", "El Bostan Mall"],
  description: "مول البستان — أكبر مول متخصص في الكمبيوتر والموبايلات والإلكترونيات في التجمع الخامس، القاهرة الجديدة. أكثر من 150 محل تجاري متخصص على 3 أدوار.",
  url: BASE_URL,
  logo: `${BASE_URL}/og-default.jpg`,
  image: `${BASE_URL}/og-default.jpg`,
  foundingDate: "1990",
  address: {
    "@type": "PostalAddress",
    streetAddress: "شارع التسعين، التجمع الخامس",
    addressLocality: "القاهرة الجديدة",
    addressRegion: "القاهرة",
    postalCode: "11835",
    addressCountry: "EG",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 30.03,
    longitude: 31.46,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "10:00",
      closes: "22:00",
    },
  ],
  hasMap: `${BASE_URL}/map`,
  containsPlace: [
    { "@type": "Store", name: "محلات الهواتف والإكسسوارات", url: `${BASE_URL}/stores?category=${encodeURIComponent("الهواتف والإكسسوارات")}` },
    { "@type": "Store", name: "محلات الكمبيوتر واللابتوبات", url: `${BASE_URL}/stores?category=${encodeURIComponent("الكمبيوتر والأجهزة")}` },
    { "@type": "Store", name: "محلات الألعاب والجيمنج", url: `${BASE_URL}/stores?category=${encodeURIComponent("الألعاب والترفيه")}` },
    { "@type": "Store", name: "الشبكات والأنظمة الأمنية", url: `${BASE_URL}/stores?category=${encodeURIComponent("الشبكات والأنظمة الأمنية")}` },
    { "@type": "Store", name: "الطباعة والتصوير", url: `${BASE_URL}/stores?category=${encodeURIComponent("الطباعة والتصوير")}` },
    { "@type": "Store", name: "الصيانة والدعم الفني", url: `${BASE_URL}/stores?category=${encodeURIComponent("الصيانة والدعم الفني")}` },
  ],
};

/** Category directory — schema.org/ItemList for category landing pages */
export function buildCategoryListLd(categories: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "أقسام مول البستان",
    numberOfItems: categories.length,
    itemListElement: categories.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      url: `${BASE_URL}${c.url}`,
    })),
  };
}

export const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  name: "مول البستان",
  alternateName: "Mall Elbostan",
  url: BASE_URL,
  inLanguage: ["ar", "en"],
  publisher: { "@id": `${BASE_URL}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/products?q={search_term}`,
    },
    "query-input": "required name=search_term",
  },
};

export function buildFaqLd(faqs: { question_ar: string; answer_ar: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question_ar,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer_ar,
      },
    })),
  };
}

export function buildEventLd(events: { title_ar: string; event_date?: string | null; start_time?: string | null; description_ar?: string | null }[]) {
  return events.map((e) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.title_ar,
    startDate: e.event_date ?? "2026-05-15",
    location: {
      "@type": "Place",
      name: "مول البستان",
      address: { "@type": "PostalAddress", addressLocality: "القاهرة الجديدة", addressCountry: "EG" },
    },
    description: e.description_ar ?? "",
    organizer: { "@type": "Organization", name: "مول البستان", url: BASE_URL },
  }));
}

/** Store detail — schema.org/Store */
/** Map store categories to schema.org types */
function storeSchemaType(category?: string | null): string {
  if (!category) return "Store";
  if (category.includes("كمبيوتر") || category.includes("لابتوب")) return "ComputerStore";
  if (category.includes("هواتف") || category.includes("موبايل") || category.includes("إلكترونيات") || category.includes("ألعاب") || category.includes("شبكات")) return "ElectronicsStore";
  return "Store";
}

export function buildStoreLd(store: {
  name_ar: string;
  name_en?: string | null;
  short_description_ar?: string | null;
  category?: string | null;
  phone?: string | null;
  slug: string;
  logo_url?: string | null;
  opening_hours?: string | null;
  unit_code?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": storeSchemaType(store.category),
    name: store.name_ar,
    alternateName: store.name_en ?? undefined,
    description: store.short_description_ar ?? `${store.name_ar} — محل ${store.category ?? "تكنولوجيا"} في مول البستان، التجمع الخامس، القاهرة الجديدة`,
    url: `${BASE_URL}/stores/${store.slug}`,
    image: store.logo_url ?? undefined,
    telephone: store.phone ?? undefined,
    department: store.category ?? undefined,
    ...(store.opening_hours ? { openingHours: store.opening_hours } : {
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "10:00",
        closes: "22:00",
      },
    }),
    containedInPlace: {
      "@type": "ShoppingCenter",
      "@id": `${BASE_URL}/#mall`,
      name: "مول البستان",
      url: BASE_URL,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "شارع التسعين، التجمع الخامس",
      addressLocality: "القاهرة الجديدة",
      addressRegion: "القاهرة",
      addressCountry: "EG",
    },
  };
}

/** Stores directory — schema.org/ItemList */
export function buildStoreListLd(stores: { name_ar: string; slug: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "دليل محلات مول البستان",
    numberOfItems: stores.length,
    itemListElement: stores.slice(0, 30).map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.name_ar,
      url: `${BASE_URL}/stores/${s.slug}`,
    })),
  };
}

/** Product detail — schema.org/Product (enhanced) */
export function buildProductLd(product: {
  name_ar: string;
  slug: string;
  price?: number | null;
  image_url?: string | null;
  brand?: string | null;
  sku?: string | null;
  short_description_ar?: string | null;
  store_name?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name_ar,
    description: product.short_description_ar ?? product.name_ar,
    url: `${BASE_URL}/products/${product.slug}`,
    image: product.image_url ?? undefined,
    ...(product.brand ? { brand: { "@type": "Brand", name: product.brand } } : {}),
    ...(product.sku ? { sku: product.sku } : {}),
    ...(product.price
      ? {
          offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: "EGP",
            availability: "https://schema.org/InStock",
            ...(product.store_name
              ? { seller: { "@type": "Organization", name: product.store_name } }
              : {}),
          },
        }
      : {}),
  };
}

/** Products directory — schema.org/ItemList */
export function buildProductListLd(products: { name_ar: string; slug: string; price?: number | null; image_url?: string | null }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "منتجات مول البستان",
    numberOfItems: products.length,
    itemListElement: products.slice(0, 30).map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: p.name_ar,
        url: `${BASE_URL}/products/${p.slug}`,
        image: p.image_url ?? undefined,
        ...(p.price ? { offers: { "@type": "Offer", price: p.price, priceCurrency: "EGP", availability: "https://schema.org/InStock" } } : {}),
      },
    })),
  };
}

/** Job posting — schema.org/JobPosting */
export function buildJobPostingLd(jobs: {
  title_ar: string;
  description_ar?: string | null;
  company_or_store?: string | null;
  job_type?: string | null;
  application_deadline?: string | null;
}[]) {
  return jobs.map((j) => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: j.title_ar,
    description: j.description_ar ?? j.title_ar,
    datePosted: new Date().toISOString().slice(0, 10),
    validThrough: j.application_deadline ?? undefined,
    employmentType: j.job_type === "full-time" ? "FULL_TIME" : j.job_type === "part-time" ? "PART_TIME" : undefined,
    hiringOrganization: {
      "@type": "Organization",
      name: j.company_or_store ?? "مول البستان",
      sameAs: BASE_URL,
    },
    jobLocation: {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: "القاهرة الجديدة", addressCountry: "EG" },
    },
  }));
}

/** Blog post — schema.org/BlogPosting */
export function buildBlogPostLd(post: {
  title_ar: string;
  excerpt_ar?: string | null;
  content_ar?: string | null;
  cover_image_url?: string | null;
  published_at?: string | null;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title_ar,
    description: post.excerpt_ar ?? "",
    image: post.cover_image_url ?? undefined,
    datePublished: post.published_at ?? undefined,
    url: `${BASE_URL}/blog/${post.slug}`,
    author: { "@type": "Organization", name: "مول البستان", url: BASE_URL },
    publisher: {
      "@type": "Organization",
      name: "مول البستان",
      url: BASE_URL,
    },
  };
}

/** Blog listing — schema.org/CollectionPage */
export function buildBlogListLd(posts: { title_ar: string; slug: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "مدونة مول البستان",
    url: `${BASE_URL}/blog`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: posts.length,
      itemListElement: posts.slice(0, 20).map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: p.title_ar,
        url: `${BASE_URL}/blog/${p.slug}`,
      })),
    },
  };
}

// ──────────────────────────────────────────────────────────────────────
// Extended schema.org builders — coverage for every page type
// ──────────────────────────────────────────────────────────────────────

/** Generic WebPage — for static legal/info pages (Privacy, Terms, Reward Terms). */
export function buildWebPageLd(opts: { name: string; description: string; url: string; inLanguage?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: opts.name,
    description: opts.description,
    url: `${BASE_URL}${opts.url}`,
    inLanguage: opts.inLanguage ?? "ar",
    isPartOf: { "@id": `${BASE_URL}/#website` },
    about: { "@id": `${BASE_URL}/#mall` },
    publisher: { "@id": `${BASE_URL}/#organization` },
  };
}

/** ContactPage with multiple ContactPoint nodes (sales, leasing, support). */
export function buildContactPageLd(opts: { phone?: string | null; whatsapp?: string | null; email?: string | null }) {
  const contactPoints: Record<string, unknown>[] = [];
  if (opts.phone) {
    contactPoints.push({
      "@type": "ContactPoint",
      telephone: opts.phone,
      contactType: "customer service",
      areaServed: "EG",
      availableLanguage: ["Arabic", "English"],
    });
  }
  if (opts.whatsapp) {
    contactPoints.push({
      "@type": "ContactPoint",
      telephone: opts.whatsapp.startsWith("+") ? opts.whatsapp : `+${opts.whatsapp}`,
      contactType: "sales",
      areaServed: "EG",
      availableLanguage: ["Arabic", "English"],
    });
  }
  if (opts.email) {
    contactPoints.push({
      "@type": "ContactPoint",
      email: opts.email,
      contactType: "customer support",
      availableLanguage: ["Arabic", "English"],
    });
  }
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "تواصل مع مول البستان",
    url: `${BASE_URL}/contact`,
    isPartOf: { "@id": `${BASE_URL}/#website` },
    about: { "@id": `${BASE_URL}/#organization` },
    mainEntity: {
      "@id": `${BASE_URL}/#organization`,
      contactPoint: contactPoints,
    },
  };
}

/** AboutPage referencing the organization. */
export function buildAboutPageLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "عن مول البستان",
    url: `${BASE_URL}/about`,
    isPartOf: { "@id": `${BASE_URL}/#website` },
    mainEntity: { "@id": `${BASE_URL}/#organization` },
  };
}

/** CollectionPage + ItemList — for directory / category landing pages. */
export function buildCollectionPageLd(opts: {
  name: string;
  description?: string;
  url: string;
  items: { name: string; url: string; image?: string | null }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: opts.name,
    description: opts.description,
    url: `${BASE_URL}${opts.url}`,
    isPartOf: { "@id": `${BASE_URL}/#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: opts.items.length,
      itemListElement: opts.items.slice(0, 50).map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: it.name,
        url: it.url.startsWith("http") ? it.url : `${BASE_URL}${it.url}`,
        ...(it.image ? { image: it.image } : {}),
      })),
    },
  };
}

/** Branch — Place / LocalBusiness for a specific physical branch. */
export function buildBranchLd(branch: {
  id: string;
  nameAr: string;
  nameEn?: string;
  url: string;
  streetAddress: string;
  addressLocality: string;
  latitude: number;
  longitude: number;
  telephone?: string;
  image?: string;
  description?: string;
  foundingDate?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ShoppingCenter"],
    "@id": `${BASE_URL}${branch.url}#branch`,
    branchOf: { "@id": `${BASE_URL}/#organization` },
    name: branch.nameAr,
    alternateName: branch.nameEn,
    description: branch.description,
    url: `${BASE_URL}${branch.url}`,
    image: branch.image,
    telephone: branch.telephone,
    foundingDate: branch.foundingDate,
    address: {
      "@type": "PostalAddress",
      streetAddress: branch.streetAddress,
      addressLocality: branch.addressLocality,
      addressRegion: "القاهرة",
      addressCountry: "EG",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: branch.latitude,
      longitude: branch.longitude,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "10:00",
        closes: "22:00",
      },
    ],
  };
}

/** RealEstateListing — for available leasing units. */
export function buildRealEstateListingLd(units: {
  unit_code: string;
  area_sqm?: number | null;
  description_ar?: string | null;
  status?: string | null;
}[]) {
  const available = units.filter((u) => u.status === "available");
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "وحدات تجارية متاحة للإيجار في مول البستان",
    numberOfItems: available.length,
    itemListElement: available.slice(0, 30).map((u, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "RealEstateListing",
        name: `وحدة ${u.unit_code} — مول البستان`,
        description: u.description_ar ?? `وحدة تجارية للإيجار بمساحة ${u.area_sqm ?? "—"} م²`,
        url: `${BASE_URL}/leasing#${u.unit_code}`,
        ...(u.area_sqm
          ? {
              floorSize: { "@type": "QuantitativeValue", value: u.area_sqm, unitCode: "MTK" },
            }
          : {}),
        address: {
          "@type": "PostalAddress",
          streetAddress: "شارع التسعين، التجمع الخامس",
          addressLocality: "القاهرة الجديدة",
          addressCountry: "EG",
        },
      },
    })),
  };
}

/** Single Offer schema (for OfferDetail). */
export function buildOfferLd(offer: {
  title_ar: string;
  description_ar?: string | null;
  price_current?: number | null;
  price_old?: number | null;
  currency?: string | null;
  image_primary?: string | null;
  valid_from?: string | null;
  valid_to?: string | null;
  store_name?: string | null;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Offer",
    name: offer.title_ar,
    description: offer.description_ar ?? offer.title_ar,
    url: `${BASE_URL}${offer.url}`,
    image: offer.image_primary ?? undefined,
    ...(offer.price_current
      ? {
          price: offer.price_current,
          priceCurrency: offer.currency ?? "EGP",
          availability: "https://schema.org/InStock",
        }
      : {}),
    ...(offer.valid_from ? { validFrom: offer.valid_from } : {}),
    ...(offer.valid_to ? { priceValidUntil: offer.valid_to.slice(0, 10) } : {}),
    ...(offer.store_name
      ? { seller: { "@type": "Organization", name: offer.store_name } }
      : {}),
    eligibleRegion: { "@type": "Country", name: "Egypt" },
  };
}

/** Service schema — for marketplace / leasing service pages. */
export function buildServiceLd(opts: { name: string; description: string; url: string; serviceType?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    url: `${BASE_URL}${opts.url}`,
    serviceType: opts.serviceType ?? opts.name,
    provider: { "@id": `${BASE_URL}/#organization` },
    areaServed: { "@type": "Country", name: "Egypt" },
  };
}

/** SiteNavigationElement — improves Sitelinks display in Google results. */
export function buildSiteNavLd() {
  const links = [
    { name: "الرئيسية", url: "/" },
    { name: "المحلات", url: "/stores" },
    { name: "المنتجات", url: "/products" },
    { name: "الخريطة التفاعلية", url: "/map" },
    { name: "العروض", url: "/daily-deals" },
    { name: "الأقسام", url: "/devices" },
    { name: "تأجير وحدة", url: "/leasing" },
    { name: "فرع وسط البلد", url: "/downtown-branch" },
    { name: "فرع القاهرة الجديدة", url: "/new-cairo-branch" },
    { name: "عن المول", url: "/about" },
    { name: "تواصل معنا", url: "/contact" },
    { name: "المدونة", url: "/blog" },
  ];
  return {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    name: links.map((l) => l.name),
    url: links.map((l) => `${BASE_URL}${l.url}`),
  };
}

/** SpeakableSpecification — marks H1/intro for Google Assistant voice search. */
export function buildSpeakableLd(cssSelectors: string[] = ["h1", "[data-speakable]"]) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: cssSelectors,
    },
  };
}

/** SearchResultsPage — for in-site search pages (e.g. /kz/search). */
export function buildSearchResultsLd(opts: { url: string; query: string; results: { name: string; url: string; image?: string | null; price?: number | null }[] }) {
  return {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    name: `نتائج البحث: ${opts.query}`,
    url: `${BASE_URL}${opts.url}`,
    isPartOf: { "@id": `${BASE_URL}/#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: opts.results.length,
      itemListElement: opts.results.slice(0, 30).map((r, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: r.url.startsWith("http") ? r.url : `${BASE_URL}${r.url}`,
        name: r.name,
        ...(r.image ? { image: r.image } : {}),
      })),
    },
  };
}

/** Generic Product builder used by Kasr Zero (with variant data). */
export function buildKzProductLd(product: {
  title: string;
  slug: string;
  brand?: string | null;
  short_description?: string | null;
  description?: string | null;
  image?: string | null;
  sku?: string | null;
  price?: number | null;
  compare_price?: number | null;
  currency?: string;
  in_stock?: boolean;
  condition?: string | null;
}) {
  const itemCondition =
    product.condition === "used"
      ? "https://schema.org/UsedCondition"
      : product.condition === "refurbished"
      ? "https://schema.org/RefurbishedCondition"
      : "https://schema.org/NewCondition";
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.short_description ?? product.description?.replace(/<[^>]+>/g, "").slice(0, 300) ?? product.title,
    url: `${BASE_URL}/kz/products/${product.slug}`,
    image: product.image ?? undefined,
    ...(product.brand ? { brand: { "@type": "Brand", name: product.brand } } : {}),
    ...(product.sku ? { sku: product.sku } : {}),
    ...(product.price
      ? {
          offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: product.currency ?? "EGP",
            availability: product.in_stock === false ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
            itemCondition,
            url: `${BASE_URL}/kz/products/${product.slug}`,
            seller: { "@type": "Organization", name: "Kasr Zero" },
            ...(product.compare_price && product.compare_price > (product.price ?? 0)
              ? { priceSpecification: { "@type": "PriceSpecification", price: product.price, priceCurrency: product.currency ?? "EGP" } }
              : {}),
          },
        }
      : {}),
  };
}

/** Promotional Event — for campaigns like Spin & Win. */
export function buildPromoEventLd(opts: { name: string; description: string; url: string; startDate?: string; endDate?: string; image?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: opts.name,
    description: opts.description,
    url: `${BASE_URL}${opts.url}`,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
    startDate: opts.startDate ?? "2026-05-01",
    endDate: opts.endDate ?? "2026-12-31",
    image: opts.image,
    location: [
      {
        "@type": "Place",
        name: "مول البستان — التجمع الخامس",
        address: { "@type": "PostalAddress", streetAddress: "شارع التسعين، التجمع الخامس", addressLocality: "القاهرة الجديدة", addressCountry: "EG" },
      },
      { "@type": "VirtualLocation", url: `${BASE_URL}${opts.url}` },
    ],
    organizer: { "@id": `${BASE_URL}/#organization` },
    offers: {
      "@type": "Offer",
      price: 0,
      priceCurrency: "EGP",
      availability: "https://schema.org/InStock",
      url: `${BASE_URL}${opts.url}`,
      validFrom: opts.startDate ?? "2026-05-01",
    },
  };
}

/** Bundle the three core entities (Organization + ShoppingCenter + WebSite) into one @graph payload. */
export function buildCoreGraphLd(phoneOverride?: string, extra: Record<string, unknown>[] = []) {
  return {
    "@context": "https://schema.org",
    "@graph": [buildOrganizationLd(phoneOverride), shoppingCenterLd, websiteLd, ...extra],
  };
}


// ──────────────────────────────────────────────────────────────────────
// Phase-2 schema builders — extended coverage
// ──────────────────────────────────────────────────────────────────────

/** ImageObject — for hero & product images */
export function buildImageObjectLd(opts: {
  url: string; caption?: string; width?: number; height?: number; license?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    contentUrl: opts.url,
    url: opts.url,
    ...(opts.caption ? { caption: opts.caption, name: opts.caption } : {}),
    ...(opts.width ? { width: opts.width } : {}),
    ...(opts.height ? { height: opts.height } : {}),
    license: opts.license ?? `${BASE_URL}/terms`,
    creditText: "Mall El Bostan",
    creator: { "@id": `${BASE_URL}/#organization` },
    copyrightNotice: "© Mall El Bostan",
  };
}

/** VideoObject — for hero/promo videos */
export function buildVideoObjectLd(v: {
  name: string; description: string; thumbnailUrl: string; uploadDate: string;
  contentUrl?: string; embedUrl?: string; duration?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: v.name,
    description: v.description,
    thumbnailUrl: v.thumbnailUrl,
    uploadDate: v.uploadDate,
    ...(v.contentUrl ? { contentUrl: v.contentUrl } : {}),
    ...(v.embedUrl ? { embedUrl: v.embedUrl } : {}),
    ...(v.duration ? { duration: v.duration } : {}),
    publisher: { "@id": `${BASE_URL}/#organization` },
  };
}

/** MerchantReturnPolicy — Google Shopping requirement */
export function buildMerchantReturnPolicyLd() {
  return {
    "@type": "MerchantReturnPolicy",
    applicableCountry: "EG",
    returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: 14,
    returnMethod: "https://schema.org/ReturnByMail",
    returnFees: "https://schema.org/FreeReturn",
  };
}

/** OfferShippingDetails — Google Shopping enrichment */
export function buildShippingDetailsLd() {
  return {
    "@type": "OfferShippingDetails",
    shippingRate: { "@type": "MonetaryAmount", value: 0, currency: "EGP" },
    shippingDestination: { "@type": "DefinedRegion", addressCountry: "EG" },
    deliveryTime: {
      "@type": "ShippingDeliveryTime",
      handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "DAY" },
      transitTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 5, unitCode: "DAY" },
    },
  };
}

/** QAPage — for single-question pages */
export function buildQAPageLd(opts: { question: string; answer: string; url: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "QAPage",
    mainEntity: {
      "@type": "Question",
      name: opts.question,
      text: opts.question,
      answerCount: 1,
      acceptedAnswer: { "@type": "Answer", text: opts.answer, url: `${BASE_URL}${opts.url}` },
    },
  };
}

/** HowTo — directions to mall, picking gear etc. */
export function buildHowToLd(opts: {
  name: string; description: string;
  steps: { name: string; text: string }[];
  totalTime?: string; estimatedCost?: { value: number; currency: string };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: opts.name,
    description: opts.description,
    ...(opts.totalTime ? { totalTime: opts.totalTime } : {}),
    ...(opts.estimatedCost
      ? { estimatedCost: { "@type": "MonetaryAmount", value: opts.estimatedCost.value, currency: opts.estimatedCost.currency } }
      : {}),
    step: opts.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

/** Brand schema — brand landing pages */
export function buildBrandLd(opts: { name: string; logo?: string; url?: string; sameAs?: string[] }) {
  return {
    "@context": "https://schema.org",
    "@type": "Brand",
    name: opts.name,
    ...(opts.logo ? { logo: opts.logo } : {}),
    ...(opts.url ? { url: opts.url } : {}),
    ...(opts.sameAs ? { sameAs: opts.sameAs } : {}),
  };
}

/** OfferCatalog — for store catalog grouping */
export function buildOfferCatalogLd(opts: {
  storeName: string;
  storeUrl: string;
  items: { name: string; url: string; price?: number | null; image?: string | null }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: `كتالوج ${opts.storeName}`,
    url: `${BASE_URL}${opts.storeUrl}`,
    itemListElement: opts.items.slice(0, 50).map((p) => ({
      "@type": "Offer",
      url: `${BASE_URL}${p.url}`,
      itemOffered: {
        "@type": "Product",
        name: p.name,
        ...(p.image ? { image: p.image } : {}),
      },
      ...(p.price ? { price: p.price, priceCurrency: "EGP" } : {}),
    })),
  };
}

/** Amenity features — for Place / ShoppingCenter */
export function buildAmenityFeatures() {
  const amenities = [
    { name: "مواقف سيارات", value: true },
    { name: "Wi-Fi مجاني", value: true },
    { name: "مصاعد كهربائية", value: true },
    { name: "سلالم متحركة", value: true },
    { name: "دورات مياه", value: true },
    { name: "صراف آلي (ATM)", value: true },
    { name: "مسجد", value: true },
    { name: "تكييف مركزي", value: true },
    { name: "أمن 24/7", value: true },
    { name: "كاميرات مراقبة", value: true },
  ];
  return amenities.map((a) => ({
    "@type": "LocationFeatureSpecification",
    name: a.name,
    value: a.value,
  }));
}

/** AggregateOffer — when one product is sold by multiple stores */
export function buildAggregateOfferLd(opts: {
  lowPrice: number; highPrice: number; offerCount: number; currency?: string;
}) {
  return {
    "@type": "AggregateOffer",
    priceCurrency: opts.currency ?? "EGP",
    lowPrice: opts.lowPrice,
    highPrice: opts.highPrice,
    offerCount: opts.offerCount,
    availability: "https://schema.org/InStock",
  };
}

/** Map schema — for /map page */
export function buildMapLd(opts: { name: string; url: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Map",
    name: opts.name,
    url: `${BASE_URL}${opts.url}`,
    mapType: "https://schema.org/VenueMap",
    about: { "@id": `${BASE_URL}/#mall` },
  };
}

/** Place — enhanced public venue */
export function buildPlaceLd(opts: {
  name: string; url: string; latitude: number; longitude: number; image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Place",
    name: opts.name,
    url: `${BASE_URL}${opts.url}`,
    ...(opts.image ? { image: opts.image } : {}),
    geo: { "@type": "GeoCoordinates", latitude: opts.latitude, longitude: opts.longitude },
    publicAccess: true,
    smokingAllowed: false,
    amenityFeature: buildAmenityFeatures(),
    isAccessibleForFree: true,
  };
}

/** NewsArticle — for news-style blog posts */
export function buildNewsArticleLd(post: {
  title_ar: string; excerpt_ar?: string | null; cover_image_url?: string | null;
  published_at?: string | null; updated_at?: string | null; slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title_ar,
    description: post.excerpt_ar ?? "",
    image: post.cover_image_url ?? undefined,
    datePublished: post.published_at ?? undefined,
    dateModified: post.updated_at ?? post.published_at ?? undefined,
    url: `${BASE_URL}/blog/${post.slug}`,
    inLanguage: "ar",
    author: { "@type": "Organization", name: "مول البستان", url: BASE_URL },
    publisher: {
      "@type": "Organization",
      name: "مول البستان",
      url: BASE_URL,
      logo: { "@type": "ImageObject", url: `${BASE_URL}/og-default.jpg`, width: 1200, height: 630 },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}/blog/${post.slug}` },
  };
}

/** Dataset — catalog metadata for crawlers / future Merchant Center */
export function buildDatasetLd(opts: { name: string; description: string; url: string; itemCount?: number }) {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: opts.name,
    description: opts.description,
    url: `${BASE_URL}${opts.url}`,
    creator: { "@id": `${BASE_URL}/#organization` },
    license: `${BASE_URL}/terms`,
    inLanguage: "ar",
    keywords: ["كتالوج", "منتجات", "محلات", "مول البستان", "إلكترونيات", "كمبيوتر", "موبايل"],
    ...(opts.itemCount ? { variableMeasured: `${opts.itemCount} عنصر` } : {}),
  };
}

/** Enhanced Event — for opening day / promotional campaigns */
export function buildEventEnhancedLd(opts: {
  name: string; description: string; url: string;
  startDate: string; endDate?: string; image?: string;
  performer?: string; sponsor?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: opts.name,
    description: opts.description,
    url: `${BASE_URL}${opts.url}`,
    startDate: opts.startDate,
    ...(opts.endDate ? { endDate: opts.endDate } : {}),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    isAccessibleForFree: true,
    image: opts.image,
    location: {
      "@type": "Place",
      name: "مول البستان — التجمع الخامس",
      address: {
        "@type": "PostalAddress",
        streetAddress: "شارع التسعين، التجمع الخامس",
        addressLocality: "القاهرة الجديدة",
        addressRegion: "القاهرة",
        addressCountry: "EG",
      },
      geo: { "@type": "GeoCoordinates", latitude: 30.03, longitude: 31.46 },
    },
    organizer: { "@id": `${BASE_URL}/#organization` },
    ...(opts.performer ? { performer: { "@type": "Organization", name: opts.performer } } : {}),
    ...(opts.sponsor && opts.sponsor.length > 0
      ? { sponsor: opts.sponsor.map((s) => ({ "@type": "Organization", name: s })) }
      : {}),
    offers: {
      "@type": "Offer",
      price: 0,
      priceCurrency: "EGP",
      availability: "https://schema.org/InStock",
      url: `${BASE_URL}${opts.url}`,
      validFrom: opts.startDate,
    },
  };
}

/** Build a Product LD with full Shopping enrichment (return policy + shipping) */
export function buildProductRichLd(product: Parameters<typeof buildProductLd>[0]) {
  const base = buildProductLd(product) as Record<string, unknown>;
  const offers = base.offers as Record<string, unknown> | undefined;
  if (offers) {
    offers.shippingDetails = buildShippingDetailsLd();
    offers.hasMerchantReturnPolicy = buildMerchantReturnPolicyLd();
  }
  return base;
}
