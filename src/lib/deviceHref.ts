/**
 * Maps legacy single-segment device slugs (e.g. "laptops", "smartphones")
 * to the new hierarchical taxonomy paths (/devices/{pillar}/{cluster}).
 *
 * Returns the new path when a matching cluster exists in `deviceTaxonomy`,
 * otherwise falls back to the legacy `/devices/{slug}` route which
 * `DeviceCategory.tsx` still supports.
 */
import { clusters } from "@/lib/deviceTaxonomy";

const clusterIndex = new Map<string, { pillar: string; cluster: string }>();
for (const c of clusters) {
  clusterIndex.set(c.slug, { pillar: c.pillarSlug, cluster: c.slug });
}

// A few catalog slugs don't share the cluster slug 1:1 — map them explicitly.
const ALIASES: Record<string, string> = {
  cpus: "pc-components",
  speakers: "headphones", // closest audio cluster
  cables: "chargers",
  "external-storage": "storage",
  "power-adapters": "chargers",
  accessories: "phone-cases",
  "smart-lighting": "intercoms",
  "office-supplies": "scanners",
  earbuds: "earbuds",
  // Catalog → closest taxonomy cluster (so every card hits DevicePage)
  printers: "all-in-one-printers",
  networking: "routers",
  televisions: "monitors",
  ups: "pc-components",
};

export function resolveDeviceHref(slug: string): string {
  const direct = clusterIndex.get(slug);
  if (direct) return `/devices/${direct.pillar}/${direct.cluster}`;

  const aliasTarget = ALIASES[slug];
  if (aliasTarget) {
    const aliased = clusterIndex.get(aliasTarget);
    if (aliased) return `/devices/${aliased.pillar}/${aliased.cluster}`;
  }

  // Legacy single-segment fallback (still served by DeviceCategory.tsx)
  return `/devices/${slug}`;
}
