import { test, expect } from "../playwright-fixture";

/**
 * Smoke / E2E test for the production homepage.
 *
 * Verifies that https://www.mallelbostan.com/ loads without:
 *   - any uncaught page errors
 *   - any console.error messages
 *   - any failed network requests (HTTP >= 400 or net::ERR_*)
 *
 * The page must also expose its main H1 so we know hydration succeeded.
 */

const PROD_URL = "https://www.mallelbostan.com/";

// Noise we intentionally ignore — third-party scripts and well-known
// non-fatal warnings that don't represent a real production regression.
const IGNORED_CONSOLE_PATTERNS: RegExp[] = [
  /Download the React DevTools/i,
  /\[vite\]/i,
  /lovable\.js/i,
  /gpteng\.co/i,
  /Failed to load resource: the server responded with a status of 404.*favicon/i,
];

const IGNORED_REQUEST_PATTERNS: RegExp[] = [
  /favicon\.ico$/i,
  /lovable\.js/i,
  /gpteng\.co/i,
  /google-analytics\.com/i,
  /googletagmanager\.com/i,
  /doubleclick\.net/i,
  /facebook\.(com|net)/i,
];

test.describe("Production homepage smoke", () => {
  test("loads without console errors or failed network requests", async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    const failedRequests: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() !== "error") return;
      const text = msg.text();
      if (IGNORED_CONSOLE_PATTERNS.some((p) => p.test(text))) return;
      consoleErrors.push(text);
    });

    page.on("pageerror", (err) => {
      pageErrors.push(err.message);
    });

    page.on("requestfailed", (req) => {
      const url = req.url();
      if (IGNORED_REQUEST_PATTERNS.some((p) => p.test(url))) return;
      const failure = req.failure()?.errorText ?? "unknown";
      failedRequests.push(`${req.method()} ${url} -> ${failure}`);
    });

    page.on("response", (res) => {
      const url = res.url();
      if (IGNORED_REQUEST_PATTERNS.some((p) => p.test(url))) return;
      const status = res.status();
      // Ignore 3xx redirects and OPTIONS preflights
      if (status >= 400) {
        failedRequests.push(`HTTP ${status} ${url}`);
      }
    });

    const response = await page.goto(PROD_URL, {
      waitUntil: "domcontentloaded",
      timeout: 45_000,
    });

    expect(response, "navigation response should exist").not.toBeNull();
    expect(response!.ok(), `homepage HTTP status ${response!.status()}`).toBe(true);

    // Wait for the page to be visually ready — the SEO H1 is present
    // (sr-only on mobile, visible on desktop) once HomeContent mounts.
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 15_000 });

    // Give the app a brief idle moment so deferred fetches/lazy chunks
    // have a chance to surface any runtime errors.
    await page.waitForLoadState("networkidle", { timeout: 20_000 }).catch(() => {
      /* networkidle isn't critical — continue with assertions */
    });

    expect(pageErrors, `Uncaught page errors:\n${pageErrors.join("\n")}`).toHaveLength(0);
    expect(consoleErrors, `Console errors:\n${consoleErrors.join("\n")}`).toHaveLength(0);
    expect(failedRequests, `Failed network requests:\n${failedRequests.join("\n")}`).toHaveLength(0);
  });

  test("has the expected document title and lang=ar direction", async ({ page }) => {
    await page.goto(PROD_URL, { waitUntil: "domcontentloaded", timeout: 45_000 });

    await expect(page).toHaveTitle(/مول البستان|Mall Elbostan/i);

    const html = page.locator("html");
    await expect(html).toHaveAttribute("dir", "rtl");
    await expect(html).toHaveAttribute("lang", /ar/i);
  });
});
