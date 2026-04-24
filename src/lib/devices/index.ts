/**
 * Devices module — merges the hand-written `manualCatalog` with all generated entries.
 * The merged result is exported as the canonical `deviceCatalog` consumed across the app.
 *
 * Manual entries always win on slug collisions (single source of truth for hero categories).
 */

import type { DeviceEntry } from "./types";
import { generateAllEntries } from "./generator";
import { manualCatalog } from "./manual";

export * from "./types";

function buildCatalog(): Record<string, DeviceEntry> {
  const merged: Record<string, DeviceEntry> = {};

  // 1) Generated entries first (so manual ones override on collision)
  for (const e of generateAllEntries()) {
    if (!merged[e.slug]) merged[e.slug] = e;
  }
  // 2) Manual entries take priority — they keep their hand-tuned content
  for (const [slug, entry] of Object.entries(manualCatalog)) {
    merged[slug] = entry as DeviceEntry;
  }

  return merged;
}

export const deviceCatalog: Record<string, DeviceEntry> = buildCatalog();

export const allDeviceSlugs: string[] = Object.keys(deviceCatalog);

export function getDeviceBySlug(slug: string): DeviceEntry | undefined {
  return deviceCatalog[slug];
}

/** Manual (hero) slugs — used by Tech Planet orbits to keep the visual ring uncluttered. */
export const manualSlugs: string[] = Object.keys(manualCatalog);

if (typeof window !== "undefined" && (import.meta as any).env?.DEV) {
  // Dev-only audit log (kept tiny, no spam in production)
  // eslint-disable-next-line no-console
  console.info(
    `[deviceCatalog] ${allDeviceSlugs.length} entries (${manualSlugs.length} manual + ${allDeviceSlugs.length - manualSlugs.length} generated)`,
  );
}
