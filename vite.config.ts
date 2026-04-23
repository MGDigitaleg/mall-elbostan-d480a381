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
 * Build-time check: warns if the Google Search Console verification
 * meta tag is still missing or contains the placeholder value.
 */
function gscVerificationCheck(): Plugin {
  return {
    name: "gsc-verification-check",
    enforce: "post",
    transformIndexHtml(html) {
      const match = html.match(/<meta\s+name=["']google-site-verification["']\s+content=["']([^"']+)["']/i);
      if (!match) {
        console.warn(
          "\n⚠️  GSC WARNING: No <meta name=\"google-site-verification\"> tag found in index.html.\n" +
          "   Google Search Console verification will NOT work until you add it.\n"
        );
      } else if (match[1] === "YOUR_CODE" || match[1].length < 10) {
        console.warn(
          "\n⚠️  GSC WARNING: google-site-verification contains a placeholder value (\"" + match[1] + "\").\n" +
          "   Replace it with your real verification code before launching.\n"
        );
      }
      return html;
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
  plugins: [react(), heroImagePreload(), asyncCssPlugin(), gscVerificationCheck(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
}));
