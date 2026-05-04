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
      // Baseline thresholds — locked to the current SEOHead suite so any
      // future drop fails CI. Raise these whenever coverage improves.
      thresholds: {
        "src/components/SEOHead.tsx": {
          lines: 58,
          statements: 58,
          functions: 41,
          branches: 65,
        },
      },
    },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
