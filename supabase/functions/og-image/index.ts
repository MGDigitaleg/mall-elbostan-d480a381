import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { initialize, svg2png } from "https://esm.sh/svg2png-wasm@0.6.1";

/**
 * Dynamic OG Image Generator — v3 (Arabic RTL + embedded font)
 * Renders branded 1200×630 PNG OG images with proper Arabic shaping.
 * Embeds IBM Plex Sans Arabic for correct glyph rendering in resvg/svg2png-wasm.
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

/* ── Font + WASM + Logo initialization (cold start) ── */

let wasmReady = false;
let fontRegularB64 = "";
let fontBoldB64 = "";
let fontRegularBuf: Uint8Array | null = null;
let fontBoldBuf: Uint8Array | null = null;
let logoPngB64 = "";

// IBM Plex Sans Arabic from Google Fonts — static TTF URLs
const FONT_REGULAR_URL =
  "https://fonts.gstatic.com/s/ibmplexsansarabic/v12/Qw3CZRtWPQCuHme67tEYUIx3Kh0PHR9N6YNe3PC5PadA.ttf";
const FONT_BOLD_URL =
  "https://fonts.gstatic.com/s/ibmplexsansarabic/v12/Qw3VZRtWPQCuHme67tEYUIx3Kh0PHR9N6Ys43PWrfidA.ttf";

// Official brand logo from storage
const LOGO_URL =
  "https://wrheltmgquyqqhscrpds.supabase.co/storage/v1/object/public/logos/brand/og-logo-white.png";

function bufToBase64(buf: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < buf.length; i++) {
    binary += String.fromCharCode(buf[i]);
  }
  return btoa(binary);
}

async function ensureReady() {
  if (wasmReady) return;

  // Fetch WASM + fonts + logo in parallel
  const [wasmRes, regRes, boldRes, logoRes] = await Promise.all([
    fetch("https://esm.sh/svg2png-wasm@0.6.1/svg2png_wasm_bg.wasm"),
    fetch(FONT_REGULAR_URL),
    fetch(FONT_BOLD_URL),
    fetch(LOGO_URL),
  ]);

  await initialize(wasmRes);

  fontRegularBuf = new Uint8Array(await regRes.arrayBuffer());
  fontBoldBuf = new Uint8Array(await boldRes.arrayBuffer());
  fontRegularB64 = bufToBase64(fontRegularBuf);
  fontBoldB64 = bufToBase64(fontBoldBuf);

  if (logoRes.ok) {
    const logoBuf = new Uint8Array(await logoRes.arrayBuffer());
    logoPngB64 = bufToBase64(logoBuf);
  }

  wasmReady = true;
}

/* ── SVG generation with embedded Arabic font + RTL layout ── */

function generateSvg(title: string, type: string, category?: string): string {
  const isProduct = type === "product";
  const escapedTitle = escapeXml(truncate(title, 45));
  const escapedCategory = category ? escapeXml(truncate(category, 30)) : "";
  const typeLabel = isProduct ? "منتج في مول البستان" : "محل في مول البستان";

  const bgColor = "#071326";
  const primaryBlue = "#1F61FF";
  const accentCyan = "#06B6D4";
  const textWhite = "#F8FAFC";
  const textMuted = "#94A3B8";

  // RTL layout: text anchored to the right
  const textRight = 1120;
  const accentBarX = 1125;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <style>
      @font-face {
        font-family: 'PlexAr';
        font-weight: 400;
        src: url('data:font/truetype;base64,${fontRegularB64}') format('truetype');
      }
      @font-face {
        font-family: 'PlexAr';
        font-weight: 700;
        src: url('data:font/truetype;base64,${fontBoldB64}') format('truetype');
      }
    </style>
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

  <!-- Accent bar (right side for RTL) -->
  <rect x="${accentBarX}" y="200" width="5" height="120" rx="2.5" fill="url(#accent)"/>

  <!-- Type label (RTL, right-aligned) -->
  <text x="${textRight}" y="235" font-family="PlexAr, system-ui, sans-serif" font-size="22" font-weight="400" fill="${textMuted}" text-anchor="end" xml:lang="ar">${escapeXml(typeLabel)}</text>

  <!-- Title (RTL, right-aligned, bold) -->
  <text x="${textRight}" y="300" font-family="PlexAr, system-ui, sans-serif" font-size="48" font-weight="700" fill="${textWhite}" text-anchor="end" xml:lang="ar">${escapedTitle}</text>

  <!-- Category badge -->
  ${escapedCategory ? (() => {
    // Estimate width: Arabic chars ~18px at font-size 18
    const estWidth = escapedCategory.length * 16 + 40;
    const badgeX = textRight - estWidth;
    return `
  <rect x="${badgeX}" y="325" width="${estWidth}" height="38" rx="19" fill="${primaryBlue}" opacity="0.2"/>
  <text x="${textRight - 22}" y="351" font-family="PlexAr, system-ui, sans-serif" font-size="18" font-weight="400" fill="${accentCyan}" text-anchor="end" xml:lang="ar">${escapedCategory}</text>`;
  })() : ""}

  <!-- Official brand logo (left side for RTL layout) -->
  ${logoPngB64 ? `<image x="60" y="220" width="220" height="130" href="data:image/png;base64,${logoPngB64}" opacity="0.12"/>` : ""}

  <!-- Bottom bar -->
  <rect x="0" y="560" width="1200" height="70" fill="${bgColor}" opacity="0.6"/>
  <rect x="0" y="558" width="1200" height="2" fill="url(#accent)" opacity="0.4"/>

  <!-- Brand name bottom-right (RTL) -->
  <text x="${textRight}" y="600" font-family="PlexAr, system-ui, sans-serif" font-size="20" font-weight="700" fill="${textWhite}" text-anchor="end" xml:lang="ar">مول البستان</text>

  <!-- Domain bottom-left (LTR) -->
  <text x="80" y="600" font-family="system-ui, -apple-system, sans-serif" font-size="16" fill="${textMuted}">mallelbostan.com</text>

  <!-- Type badge bottom-left -->
  <rect x="80" y="573" width="${isProduct ? 130 : 110}" height="30" rx="15" fill="${primaryBlue}" opacity="0.3"/>
  <text x="${isProduct ? 145 : 135}" y="594" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="${accentCyan}" text-anchor="middle">${isProduct ? "Product" : "Store"}</text>
</svg>`;
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
    const v = url.searchParams.get("v"); // cache-bust param (ignored in logic, forces new CDN entry)
    const maxAge = Math.min(Math.max(parseInt(url.searchParams.get("max_age") || "604800", 10) || 604800, 60), 2592000);
    const cacheControl = `public, max-age=${maxAge}, s-maxage=${maxAge}${maxAge >= 604800 ? ", immutable" : ""}`;

    await ensureReady();

    const svgString = generateSvg(title, type, category);

    // Return SVG if explicitly requested
    if (format === "svg") {
      return new Response(svgString, {
        headers: {
          ...corsHeaders,
          "Content-Type": "image/svg+xml; charset=utf-8",
          "Cache-Control": cacheControl,
        },
      });
    }

    // Default: convert to PNG with embedded fonts
    try {
      const fonts: Uint8Array[] = [];
      if (fontRegularBuf) fonts.push(fontRegularBuf);
      if (fontBoldBuf) fonts.push(fontBoldBuf);

      const pngBytes: Uint8Array = await svg2png(svgString, {
        width: 1200,
        height: 630,
        fonts,
      });

      return new Response(pngBytes.buffer as ArrayBuffer, {
        headers: {
          ...corsHeaders,
          "Content-Type": "image/png",
          "Cache-Control": cacheControl,
        },
      });
    } catch (_pngErr) {
      // Fallback: return SVG
      return new Response(svgString, {
        headers: {
          ...corsHeaders,
          "Content-Type": "image/svg+xml; charset=utf-8",
          "Cache-Control": cacheControl,
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
