/**
 * Centralized platform statistics — two scopes:
 * 1. Global (entire Mall El Bostan ecosystem)
 * 2. Branch-specific (Downtown / New Cairo)
 */

export const GLOBAL_STATS = {
  shops: 460,
  products: 100_000,
  branches: 2,
  yearFounded: 1990,
  yearsInMarket: new Date().getFullYear() - 1990,
} as const;

export const DOWNTOWN_STATS = {
  shops: 400,
  floors: 10,
  yearFounded: 1990,
} as const;

export const NEW_CAIRO_STATS = {
  shops: 60,
  floors: 3,
  categories: 10,
} as const;

/* ── Formatted labels for UI ── */

export const GLOBAL_STAT_CARDS = [
  { value: "+460", label: "محلًا" },
  { value: "+100 ألف", label: "منتج" },
  { value: "آلاف", label: "التصنيفات" },
  { value: "فرعان", label: "رئيسيان" },
] as const;

export const DOWNTOWN_STAT_CARDS = [
  { value: "+400", label: "محل" },
  { value: "10", label: "أدوار" },
  { value: "+30", label: "عامًا في السوق" },
  { value: "1990", label: "سنة التأسيس" },
] as const;

export const NEW_CAIRO_STAT_CARDS = [
  { value: "+60", label: "محل" },
  { value: "10", label: "فئات تقنية" },
  { value: "3", label: "أدوار" },
  { value: "سوق", label: "منتجات رقمي" },
] as const;
