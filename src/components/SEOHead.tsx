import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const BASE_URL = "https://mallelbostan.com";

interface SEOHeadProps {
  title: string;
  description: string;
  titleEn?: string;
  descriptionEn?: string;
  ogImage?: string;
  type?: "website" | "article";
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
  type = "website",
  jsonLd,
  breadcrumbs,
  noIndex,
}: SEOHeadProps) {
  const location = useLocation();
  const fullTitle = `${title} | مول البستان`;
  const canonical = `${BASE_URL}${location.pathname}`;
  const ogImg = ogImage ?? `${BASE_URL}/og-default.jpg`;

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

      {/* Alternate language hints */}
      <link rel="alternate" hrefLang="ar" href={canonical} />
      {titleEn && <meta name="title" lang="en" content={`${titleEn} | Mall Elbostan`} />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={descriptionEn ?? description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImg} />
      <meta property="og:locale" content="ar_EG" />
      <meta property="og:site_name" content="مول البستان" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={descriptionEn ?? description} />
      <meta name="twitter:image" content={ogImg} />

      {/* JSON-LD */}
      {allJsonLd.map((ld, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(ld)}
        </script>
      ))}
    </Helmet>
  );
}

// Reusable JSON-LD schemas
export const organizationLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "مول البستان",
  alternateName: "Mall Elbostan",
  description: "وجهة التكنولوجيا الأولى في القاهرة الجديدة - أكبر مول متخصص في التكنولوجيا والإلكترونيات",
  url: BASE_URL,
  address: {
    "@type": "PostalAddress",
    addressLocality: "القاهرة الجديدة",
    addressRegion: "القاهرة",
    addressCountry: "EG",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 30.03,
    longitude: 31.46,
  },
  openingDatePlanned: "2026-05-01",
  sameAs: [],
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
export function buildStoreLd(store: {
  name_ar: string;
  name_en?: string | null;
  short_description_ar?: string | null;
  category?: string | null;
  phone?: string | null;
  slug: string;
  logo_url?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    name: store.name_ar,
    alternateName: store.name_en ?? undefined,
    description: store.short_description_ar ?? `${store.name_ar} في مول البستان`,
    url: `${BASE_URL}/stores/${store.slug}`,
    image: store.logo_url ?? undefined,
    telephone: store.phone ?? undefined,
    department: store.category ?? undefined,
    containedInPlace: {
      "@type": "ShoppingCenter",
      name: "مول البستان",
      url: BASE_URL,
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
