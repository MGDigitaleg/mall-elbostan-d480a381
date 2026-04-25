/**
 * Shared analytics helper — fires events to GA4 (gtag) and GTM (dataLayer).
 *
 * Use `trackEvent` at all conversion points so we have a single, consistent
 * naming scheme and can replay events to multiple destinations later.
 *
 * Event naming convention: snake_case, action-oriented (verb_noun).
 * Always include `source` and `placement` when applicable.
 */

type AnalyticsParams = Record<string, unknown>;

type WindowWithAnalytics = Window & {
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
};

/** Fire a tracking event to GA4 + GTM dataLayer. Safe on SSR / when GA isn't loaded. */
export function trackEvent(name: string, params: AnalyticsParams = {}): void {
  if (typeof window === "undefined") return;
  const w = window as WindowWithAnalytics;

  const payload = {
    event_category: "engagement",
    timestamp: Date.now(),
    ...params,
  };

  try {
    if (typeof w.gtag === "function") {
      w.gtag("event", name, payload);
    }
    if (Array.isArray(w.dataLayer)) {
      w.dataLayer.push({ event: name, ...payload });
    }
    // Dev-only console echo for easier debugging in DebugView
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.debug("[analytics]", name, payload);
    }
  } catch {
    /* never break the UI for analytics */
  }
}

/** Track a successful lead submission (leasing, contact, marketplace, etc.). */
export function trackLeadSubmit(leadType: string, params: AnalyticsParams = {}): void {
  trackEvent("lead_submit", { lead_type: leadType, ...params });
}

/** Track a Spin & Win attempt (form submitted, regardless of win/lose). */
export function trackSpinSubmit(params: AnalyticsParams = {}): void {
  trackEvent("spin_win_submit", { source: "spin_win_page", ...params });
}

/** Track a Spin & Win result (after the wheel settles). */
export function trackSpinResult(won: boolean, params: AnalyticsParams = {}): void {
  trackEvent("spin_win_result", { won, ...params });
}

/** Track an internal SEO link click (category intros, map SEO text, homepage footer). */
export function trackSeoLinkClick(
  section: "stores_intro" | "map_seo" | "homepage_seo",
  linkType: "store" | "category" | "page" | "map_pin",
  label: string,
  destination: string,
): void {
  trackEvent("seo_link_click", {
    section,
    link_type: linkType,
    link_label: label,
    link_destination: destination,
  });
}

/**
 * Track a click on an offers CTA (primary/secondary) anywhere on the site.
 * Used to measure conversion from homepage teaser → /daily-deals page.
 */
export function trackOffersCtaClick(
  ctaType: "primary" | "secondary",
  placement: string,
  destination: string,
  label: string,
): void {
  trackEvent("offers_cta_click", {
    cta_type: ctaType,
    placement,
    link_destination: destination,
    link_label: label,
  });
}
