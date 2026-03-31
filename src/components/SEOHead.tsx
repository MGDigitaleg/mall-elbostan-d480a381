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
