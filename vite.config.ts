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
      // Only in build mode where ctx.bundle exists
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

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), heroImagePreload(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
}));
