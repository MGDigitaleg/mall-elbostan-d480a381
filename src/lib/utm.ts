/**
 * UTM capture utility. Reads UTM params from URL, persists to sessionStorage
 * so they survive form navigations, and exposes a clean accessor.
 */
const KEY = "mb_utm_v1";
const PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

export type UtmParams = Partial<Record<(typeof PARAMS)[number], string>>;

export function captureUtmFromUrl(): UtmParams {
  if (typeof window === "undefined") return {};
  try {
    const url = new URL(window.location.href);
    const found: UtmParams = {};
    let any = false;
    for (const k of PARAMS) {
      const v = url.searchParams.get(k);
      if (v) { found[k] = v.slice(0, 120); any = true; }
    }
    if (any) {
      const existing = getStoredUtm();
      const merged = { ...existing, ...found };
      sessionStorage.setItem(KEY, JSON.stringify(merged));
      return merged;
    }
    return getStoredUtm();
  } catch {
    return {};
  }
}

export function getStoredUtm(): UtmParams {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function clearStoredUtm(): void {
  try { sessionStorage.removeItem(KEY); } catch { /* noop */ }
}
