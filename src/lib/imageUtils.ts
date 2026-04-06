/**
 * Optimizes image URLs for responsive delivery.
 * - Unsplash: rewrites w= param to match display size
 * - Local images: returns as-is (handled by build pipeline)
 */
export function optimizeImageUrl(url: string | null, displayWidth: number): string {
  if (!url) return "";
  
  // For retina displays, serve 1.5x the display size (capped at 600)
  const targetWidth = Math.min(Math.round(displayWidth * 1.5), 600);

  // Unsplash URLs: rewrite w= parameter
  if (url.includes("images.unsplash.com")) {
    const base = url.replace(/[?&]w=\d+/, "").replace(/[?&]q=\d+/, "");
    const separator = base.includes("?") ? "&" : "?";
    return `${base}${separator}w=${targetWidth}&q=60&auto=format`;
  }

  return url;
}

/**
 * Generate srcSet for Unsplash images
 */
export function unsplashSrcSet(url: string | null, sizes: number[]): string {
  if (!url || !url.includes("images.unsplash.com")) return "";
  
  const base = url.replace(/[?&]w=\d+/, "").replace(/[?&]q=\d+/, "").replace(/[?&]auto=\w+/, "");
  const separator = base.includes("?") ? "&" : "?";
  
  return sizes
    .map((w) => `${base}${separator}w=${w}&q=60&auto=format ${w}w`)
    .join(", ");
}
