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
}: SEOHeadProps) {
  const location = useLocation();
  const fullTitle = `${title} | مول البستان`;
  const canonical = `${BASE_URL}${location.pathname}`;
  const ogImg = ogImage ?? `${BASE_URL}/og-default.jpg`;
  const ogW = ogImageWidth ?? 1200;
  const ogH = ogImageHeight ?? 630;
  const ogAlt = ogImageAlt ?? fullTitle;

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
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content="مول البستان" />

      {/* Alternate language hints */}
      <link rel="alternate" hrefLang="ar-EG" href={canonical} />
      <link rel="alternate" hrefLang="x-default" href={canonical} />
      {titleEn && <meta name="title" lang="en" content={`${titleEn} | Mall Elbostan`} />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={descriptionEn ?? description} />
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

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={descriptionEn ?? description} />
      <meta name="twitter:image" content={ogImg} />
      <meta name="twitter:image:alt" content={ogAlt} />

      {/* JSON-LD */}
      {allJsonLd.map((ld, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(ld)}
        </script>
      ))}
    </Helmet>
  );
}

// ─── Reusable JSON-LD schemas ───

export const organizationLd = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "ElectronicsStore"],
  "@id": `${BASE_URL}/#organization`,
  name: "مول البستان",
  alternateName: ["Mall Elbostan", "El Bostan Mall"],
  description: "أكبر مول متخصص في الكمبيوتر والموبايلات والإلكترونيات في القاهرة الجديدة — أكثر من 150 محل للابتوبات، هواتف، جيمنج، إكسسوارات، وصيانة بالتجمع الخامس.",
  url: BASE_URL,
  logo: `${BASE_URL}/og-default.jpg`,
  image: `${BASE_URL}/og-default.jpg`,
  ...(OFFICIAL_PHONE.trim() ? { telephone: OFFICIAL_PHONE.trim() } : {}),
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
    startDate: e.event_date ?? "2026-05-01",
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
