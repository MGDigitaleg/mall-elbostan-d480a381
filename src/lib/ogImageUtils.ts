/**
 * Generates a fallback OG image URL for stores/products without images.
 * Uses the og-image edge function to create branded PNG OG images.
 * PNG is the default format for maximum compatibility across social platforms
 * (Facebook, Twitter/X, WhatsApp, LinkedIn, Telegram).
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export function getOgImageUrl(
  title: string,
  type: "store" | "product",
  category?: string | null,
  format: "png" | "svg" = "png",
): string {
  const params = new URLSearchParams({ title, type, format });
  if (category) params.set("category", category);
  return `${SUPABASE_URL}/functions/v1/og-image?${params.toString()}`;
}

/**
 * Returns the best available OG image for a store.
 * Priority: logo_url → cover_image_url → generated PNG fallback
 */
export function getStoreOgImage(store: {
  name_ar: string;
  logo_url?: string | null;
  cover_image_url?: string | null;
  category?: string | null;
}): string {
  return store.logo_url || store.cover_image_url || getOgImageUrl(store.name_ar, "store", store.category);
}

/**
 * Returns the best available OG image for a product.
 * Priority: image_url → generated PNG fallback
 */
export function getProductOgImage(product: {
  name_ar: string;
  image_url?: string | null;
  category_name?: string | null;
}): string {
  return product.image_url || getOgImageUrl(product.name_ar, "product", product.category_name);
}
