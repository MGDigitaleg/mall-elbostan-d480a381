import type { LucideIcon } from "lucide-react";

/** Mall-wide store categories (must match `stores.category` Arabic values). */
export const CAT = {
  phones: "الهواتف والإكسسوارات",
  computers: "الكمبيوتر والأجهزة",
  gaming: "الألعاب والترفيه",
  networking: "الشبكات والأنظمة الأمنية",
  printing: "الطباعة والتصوير",
  maintenance: "الصيانة والدعم الفني",
} as const;

export type CategoryValue = typeof CAT[keyof typeof CAT];
export type Orbit = "inner" | "middle" | "outer";

export interface DeviceFAQ { q: string; a: string; }

export interface DeviceEntry {
  slug: string;
  labelAr: string;
  labelEn: string;
  Icon: LucideIcon;
  parentCategory: CategoryValue;
  orbit: Orbit;
  /** Keywords used to match products by name/brand for the related products section */
  productKeywords: string[];
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
  /** Long-form intro paragraph (Fusha) — 200–280 words target */
  intro: string;
  faq: DeviceFAQ[];
  /** Slugs of related device pages for internal linking */
  relatedSlugs: string[];
  /** Optional metadata for generated entries — used for breadcrumbs and related sections */
  brand?: string;       // e.g. "Dell", "Apple"
  useCase?: string;     // e.g. "gaming", "students"
  baseSlug?: string;    // root slug this variant derives from (e.g. "laptops")
  /** True for generated entries; false/undefined for hand-written ones */
  generated?: boolean;
}
