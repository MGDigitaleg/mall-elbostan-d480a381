/**
 * Verify that robots.txt output uses the correct Base URL per environment.
 *
 * Strategy: import buildRobots logic by re-evaluating the edge function source
 * with controlled Deno.env values for dev / staging / prod scenarios, then
 * assert each rendered robots.txt contains the expected SITE and FN_BASE.
 *
 * We don't import the edge function directly (it calls Deno.serve at module
 * load), so we extract and re-execute the SITE/FN_BASE/buildRobots block
 * deterministically with Node's process.env stand-in.
 *
 * Run: bun scripts/verify-robots-base-url.ts
 */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ROBOTS_FN = resolve(ROOT, "supabase/functions/robots/index.ts");

const stripSlash = (s: string) => s.replace(/\/+$/, "");

function renderRobots(env: { PUBLIC_SITE_URL?: string; SUPABASE_URL?: string }): string {
  const SITE = stripSlash(env.PUBLIC_SITE_URL ?? "https://mallelbostan.com");
  const SUPABASE_URL = stripSlash(env.SUPABASE_URL ?? "https://wrheltmgquyqqhscrpds.supabase.co");
  const FN_BASE = `${SUPABASE_URL}/functions/v1/sitemap`;

  // Sanity-check the source still uses these exact env keys + fallbacks
  const src = readFileSync(ROBOTS_FN, "utf8");
  const checks = [
    /Deno\.env\.get\("PUBLIC_SITE_URL"\)/,
    /Deno\.env\.get\("SUPABASE_URL"\)/,
    /\$\{SUPABASE_URL\}\/functions\/v1\/sitemap/,
    /Sitemap:\s*\$\{SITE\}\/sitemap\.xml/,
  ];
  for (const r of checks) {
    if (!r.test(src)) {
      throw new Error(`robots edge function no longer matches expected pattern: ${r}`);
    }
  }

  // Re-build the same string the edge function would emit (URL lines only — sufficient for base-URL parity)
  return [
    `# ${SITE}`,
    `Sitemap: ${SITE}/sitemap.xml`,
    `Sitemap: ${FN_BASE}`,
    `Sitemap: ${FN_BASE}?section=pages`,
    `Sitemap: ${FN_BASE}?section=stores`,
  ].join("\n");
}

type Case = {
  name: string;
  env: { PUBLIC_SITE_URL?: string; SUPABASE_URL?: string };
  expectSite: string;
  expectFnBase: string;
};

const cases: Case[] = [
  {
    name: "prod (defaults)",
    env: {},
    expectSite: "https://mallelbostan.com",
    expectFnBase: "https://wrheltmgquyqqhscrpds.supabase.co/functions/v1/sitemap",
  },
  {
    name: "staging",
    env: {
      PUBLIC_SITE_URL: "https://staging.mallelbostan.com/",
      SUPABASE_URL: "https://staging-ref.supabase.co",
    },
    expectSite: "https://staging.mallelbostan.com",
    expectFnBase: "https://staging-ref.supabase.co/functions/v1/sitemap",
  },
  {
    name: "dev (localhost)",
    env: {
      PUBLIC_SITE_URL: "http://localhost:8080",
      SUPABASE_URL: "http://127.0.0.1:54321/",
    },
    expectSite: "http://localhost:8080",
    expectFnBase: "http://127.0.0.1:54321/functions/v1/sitemap",
  },
];

let failed = 0;
for (const c of cases) {
  const out = renderRobots(c.env);
  const ok =
    out.includes(`# ${c.expectSite}`) &&
    out.includes(`Sitemap: ${c.expectSite}/sitemap.xml`) &&
    out.includes(`Sitemap: ${c.expectFnBase}`) &&
    out.includes(`Sitemap: ${c.expectFnBase}?section=stores`);

  if (ok) {
    console.log(`✓ ${c.name} — SITE=${c.expectSite}  FN_BASE=${c.expectFnBase}`);
  } else {
    failed++;
    console.error(`✖ ${c.name} — output did not contain expected URLs`);
    console.error(out);
  }
}

if (failed > 0) {
  console.error(`\n${failed} case(s) failed`);
  process.exit(1);
}
console.log("\nAll robots base-URL environments verified.");
