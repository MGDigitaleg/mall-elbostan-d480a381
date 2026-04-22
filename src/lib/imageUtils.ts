/**
 * Optimizes image URLs for responsive delivery.
 * - Unsplash: rewrites w= param to match display size (capped at 1080)
 * - Supabase Storage: appends render/image transform params
 * - Local images: returns as-is (handled by build pipeline)
 */
export function optimizeImageUrl(url: string | null, displayWidth: number): string {
  if (!url) return "";

  // For retina displays, serve 1.5x the display size (capped at 1080)
  const targetWidth = Math.min(Math.round(displayWidth * 1.5), 1080);

  // Unsplash URLs: rewrite w= parameter
  if (url.includes("images.unsplash.com")) {
    const base = url.replace(/[?&]w=\d+/, "").replace(/[?&]q=\d+/, "");
    const separator = base.includes("?") ? "&" : "?";
    return `${base}${separator}w=${targetWidth}&q=60&auto=format`;
  }

  // Supabase Storage: use render/image transform API
  if (url.includes(".supabase.co/storage/v1/object/")) {
    const renderUrl = url.replace(
      "/storage/v1/object/",
      "/storage/v1/render/image/"
    );
    const separator = renderUrl.includes("?") ? "&" : "?";
    return `${renderUrl}${separator}width=${targetWidth}&quality=75&format=webp`;
  }

  return url;
}

/**
 * Generate srcSet for Unsplash or Supabase Storage images across multiple breakpoints.
 */
export function responsiveSrcSet(url: string | null, sizes: number[] = [200, 400, 640, 828]): string {
  if (!url) return "";

  // Unsplash
  if (url.includes("images.unsplash.com")) {
    const base = url.replace(/[?&]w=\d+/, "").replace(/[?&]q=\d+/, "").replace(/[?&]auto=\w+/, "");
    const separator = base.includes("?") ? "&" : "?";
    return sizes.map((w) => `${base}${separator}w=${w}&q=60&auto=format ${w}w`).join(", ");
  }

  // Supabase Storage
  if (url.includes(".supabase.co/storage/v1/object/")) {
    const renderUrl = url.replace("/storage/v1/object/", "/storage/v1/render/image/");
    const separator = renderUrl.includes("?") ? "&" : "?";
    return sizes.map((w) => `${renderUrl}${separator}width=${w}&quality=75&format=webp ${w}w`).join(", ");
  }

  return "";
}

/** @deprecated Use responsiveSrcSet instead */
export const unsplashSrcSet = responsiveSrcSet;
