import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

/**
 * Injects a <link rel="preload"> for the LCP hero image into the built HTML.
 * Vite hashes asset filenames, so we scan the output bundle for the hero image
 * and inject the preload tag at build time so the browser discovers it immediately.
 */
function heroImagePreload(): Plugin {
  return {
    name: "hero-image-preload",
    enforce: "post",
    transformIndexHtml(html, ctx) {
      if (!ctx.bundle) return html;
      const preloads: string[] = [];
      for (const [fileName] of Object.entries(ctx.bundle)) {
        if (fileName.match(/downtown-hero-1.*\.webp$/) || fileName.match(/downtown-hero-night-clean2.*\.webp$/)) {
          preloads.push(`<link rel="preload" as="image" href="/${fileName}" fetchpriority="high" />`);
        }
      }
      if (preloads.length) {
        return html.replace("</head>", `    ${preloads.join("\n    ")}\n  </head>`);
      }
      return html;
    },
  };
}

/**
 * Converts Vite-injected CSS <link> tags to async-loading pattern
 * so the inline skeleton can paint immediately (improving FCP).
 * The skeleton uses inline styles, so it doesn't need the main CSS.
 */
function asyncCssPlugin(): Plugin {
  return {
    name: "async-css",
    enforce: "post",
    transformIndexHtml(html) {
      // Convert <link rel="stylesheet" href="/assets/index-*.css"> to async
      return html.replace(
        /<link rel="stylesheet"(?: crossorigin)? href="(\/assets\/[^"]+\.css)">/g,
        `<link rel="stylesheet" href="$1" media="print" onload="this.media='all'" /><noscript><link rel="stylesheet" href="$1" /></noscript>`
      );
    },
  };
}

/**
 * Injects the Google Search Console verification meta tag into index.html
 * at build time, reading the code from the VITE_GSC_VERIFICATION env var.
 *
 * Usage:
 *   - Set VITE_GSC_VERIFICATION=your_real_code in your env (e.g. .env.local
 *     or Lovable project env vars), then rebuild. The tag is added/updated
 *     automatically — no need to hand-edit index.html.
 *   - If the env var is not set, the build prints a warning and leaves the
 *     existing (commented) placeholder in index.html untouched.
 */
function gscVerificationInject(): Plugin {
  return {
    name: "gsc-verification-inject",
    enforce: "post",
    transformIndexHtml(html) {
      const code = (process.env.VITE_GSC_VERIFICATION ?? "").trim();
      const tagRegex = /<meta\s+name=["']google-site-verification["']\s+content=["']([^"']*)["']\s*\/?>/i;
      const existing = html.match(tagRegex);

      if (!code) {
        if (existing && existing[1] && existing[1] !== "REPLACE_WITH_REAL_CODE" && existing[1].length >= 10) {
          // A real tag is already hard-coded in index.html — leave it.
          return html;
        }
        console.warn(
          "\n⚠️  GSC: VITE_GSC_VERIFICATION is not set.\n" +
          "   Set it in your project env vars (or .env.local) to inject the\n" +
          "   <meta name=\"google-site-verification\"> tag automatically.\n"
        );
        return html;
      }

      const tag = `<meta name="google-site-verification" content="${code}" />`;

      if (existing) {
        // Replace any existing (live) tag with the env value.
        return html.replace(tagRegex, tag);
      }

      // No live tag found — inject right after <head>.
      // (The commented-out placeholder in index.html stays as documentation.)
      return html.replace(/<head>/i, `<head>\n    ${tag}`);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), heroImagePreload(), asyncCssPlugin(), gscVerificationInject(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react-dom") || id.includes("scheduler")) return "vendor-react-dom";
            if (id.includes("/react/") || id.includes("react-router")) return "vendor-react";
            if (id.includes("@supabase") || id.includes("@tanstack")) return "vendor-data";
            if (id.includes("framer-motion")) return "vendor-motion";
            if (id.includes("@radix-ui")) return "vendor-radix";
            if (id.includes("lucide-react")) return "vendor-icons";
          }
        },
      },
    },
  },
}));
