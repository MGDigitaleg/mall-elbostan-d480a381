import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "text-summary", "json-summary", "lcov"],
      reportsDirectory: "./coverage",
      // Always include SEOHead even if a focused run skipped touching it,
      // so CI thresholds reflect true coverage.
      include: ["src/components/SEOHead.tsx"],
      // Hard floor for SEOHead — bumping intentionally is fine, drops fail CI.
      thresholds: {
        "src/components/SEOHead.tsx": {
          lines: 80,
          statements: 80,
          functions: 85,
          branches: 70,
        },
      },
    },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
