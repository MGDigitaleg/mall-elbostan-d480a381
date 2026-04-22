import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { initialize, svg2png } from "https://esm.sh/svg2png-wasm@0.6.1";

/**
 * Dynamic OG Image Generator
 * Generates branded 1200×630 OG images as PNG (default) or SVG.
 * PNG is rendered server-side via svg2png-wasm for full social platform compatibility.
 * Usage: /og-image?title=...&type=store|product&category=...&format=png|svg
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max - 1) + "…" : text;
}

function generateSvg(title: string, type: string, category?: string): string {
  const isProduct = type === "product";
  const escapedTitle = escapeXml(truncate(title, 50));
  const escapedCategory = category ? escapeXml(truncate(category, 30)) : "";
  const typeLabel = isProduct ? "منتج في مول البستان" : "محل في مول البستان";

  const bgColor = "#071326";
  const primaryBlue = "#1F61FF";
  const accentCyan = "#06B6D4";
  const textWhite = "#F8FAFC";
  const textMuted = "#94A3B8";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${bgColor}"/>
      <stop offset="100%" stop-color="#0F1D32"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${primaryBlue}"/>
      <stop offset="100%" stop-color="${accentCyan}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.7" cy="0.3" r="0.6">
      <stop offset="0%" stop-color="${primaryBlue}" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="${primaryBlue}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>

  <!-- Grid pattern -->
  <g opacity="0.03">
    ${Array.from({ length: 19 }, (_, i) => `<line x1="${(i + 1) * 64}" y1="0" x2="${(i + 1) * 64}" y2="630" stroke="${textWhite}" stroke-width="1"/>`).join("")}
    ${Array.from({ length: 9 }, (_, i) => `<line x1="0" y1="${(i + 1) * 64}" x2="1200" y2="${(i + 1) * 64}" stroke="${textWhite}" stroke-width="1"/>`).join("")}
  </g>

  <!-- Accent bar -->
  <rect x="80" y="200" width="5" height="120" rx="2.5" fill="url(#accent)"/>

  <!-- Type label -->
  <text x="105" y="230" font-family="system-ui, -apple-system, sans-serif" font-size="22" fill="${textMuted}" direction="rtl" text-anchor="start">${escapeXml(typeLabel)}</text>

  <!-- Title -->
  <text x="105" y="290" font-family="system-ui, -apple-system, sans-serif" font-size="52" font-weight="700" fill="${textWhite}" direction="rtl" text-anchor="start">${escapedTitle}</text>

  <!-- Category -->
  ${escapedCategory ? `
  <rect x="105" y="320" width="${escapedCategory.length * 14 + 32}" height="36" rx="18" fill="${primaryBlue}" opacity="0.2"/>
  <text x="121" y="345" font-family="system-ui, -apple-system, sans-serif" font-size="18" fill="${accentCyan}" direction="rtl" text-anchor="start">${escapedCategory}</text>
  ` : ""}

  <!-- Icon -->
  <g transform="translate(${isProduct ? 900 : 920}, ${isProduct ? 160 : 180})" opacity="0.08">
    ${isProduct
      ? `<rect x="0" y="0" width="200" height="200" rx="24" fill="none" stroke="${textWhite}" stroke-width="4"/>
         <rect x="60" y="30" width="80" height="140" rx="12" fill="none" stroke="${textWhite}" stroke-width="3"/>
         <circle cx="100" cy="145" r="8" fill="none" stroke="${textWhite}" stroke-width="3"/>`
      : `<rect x="0" y="20" width="180" height="160" rx="16" fill="none" stroke="${textWhite}" stroke-width="4"/>
         <rect x="40" y="0" width="100" height="40" rx="8" fill="none" stroke="${textWhite}" stroke-width="3"/>
         <line x1="0" y1="80" x2="180" y2="80" stroke="${textWhite}" stroke-width="3"/>`
    }
  </g>

  <!-- Bottom bar -->
  <rect x="0" y="560" width="1200" height="70" fill="${bgColor}" opacity="0.6"/>
  <rect x="0" y="558" width="1200" height="2" fill="url(#accent)" opacity="0.4"/>

  <!-- Brand name bottom -->
  <text x="80" y="600" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="600" fill="${textWhite}" direction="rtl" text-anchor="start">مول البستان</text>
  <text x="230" y="600" font-family="system-ui, -apple-system, sans-serif" font-size="16" fill="${textMuted}">mallelbostan.com</text>

  <!-- Type badge bottom-right -->
  <rect x="980" y="578" width="${isProduct ? 130 : 110}" height="30" rx="15" fill="${primaryBlue}" opacity="0.3"/>
  <text x="${isProduct ? 1045 : 1035}" y="599" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="${accentCyan}" text-anchor="middle">${isProduct ? "Product" : "Store"}</text>
</svg>`;
}

/* ── Initialize WASM once at cold start ── */
let wasmReady = false;

async function ensureWasm() {
  if (wasmReady) return;
  const wasmRes = await fetch(
    "https://esm.sh/svg2png-wasm@0.6.1/svg2png_wasm_bg.wasm"
  );
  await initialize(wasmRes);
  wasmReady = true;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const title = url.searchParams.get("title") || "مول البستان";
    const type = url.searchParams.get("type") || "store";
    const category = url.searchParams.get("category") || undefined;
    const format = url.searchParams.get("format") || "png";

    const svgString = generateSvg(title, type, category);

    // Return SVG if explicitly requested
    if (format === "svg") {
      return new Response(svgString, {
        headers: {
          ...corsHeaders,
          "Content-Type": "image/svg+xml",
          "Cache-Control": "public, max-age=604800, immutable",
        },
      });
    }

    // Default: convert to PNG
    try {
      await ensureWasm();
      const pngBytes: Uint8Array = await svg2png(svgString, {
        width: 1200,
        height: 630,
      });

      return new Response(pngBytes, {
        headers: {
          ...corsHeaders,
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=604800, immutable",
        },
      });
    } catch (_pngErr) {
      // Fallback: return SVG if PNG conversion fails
      return new Response(svgString, {
        headers: {
          ...corsHeaders,
          "Content-Type": "image/svg+xml",
          "Cache-Control": "public, max-age=604800, immutable",
          "X-OG-Fallback": "svg",
        },
      });
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
