# Sitemap × robots.txt × noIndex Audit
**Generated:** 2026-04-23

**Sources cross-checked:**
- `public/sitemap.xml` (static sitemap)
- `public/robots.txt`
- `supabase/functions/sitemap/index.ts` (dynamic edge function)
- `src/pages/**` (per-page `noIndex` flags)

---

## 1. Static sitemap.xml — 19 URLs

- /
- /about
- /contact
- /downtown-branch
- /downtown-directory
- /faq
- /join-marketplace
- /kz
- /leasing
- /map
- /market-echo
- /new-cairo-branch
- /opening-day
- /privacy
- /products
- /reward-terms
- /spin-win
- /stores
- /terms

---

## 2. Dynamic edge function STATIC_ROUTES — 19 URLs

_(The edge function adds DB-driven URLs on top: stores, products, blog, downtown merchants, kz_products.)_

- /
- /about
- /contact
- /downtown-branch
- /downtown-directory
- /faq
- /join-marketplace
- /kz
- /leasing
- /map
- /market-echo
- /new-cairo-branch
- /opening-day
- /privacy
- /products
- /reward-terms
- /spin-win
- /stores
- /terms

---

## 3. robots.txt rules

### Allow (22)
- /
- /stores
- /products
- /map
- /leasing
- /about
- /contact
- /blog
- /faq
- /careers
- /join-marketplace
- /opening-day
- /spin-win
- /daily-deals
- /new-cairo-branch
- /downtown-branch
- /downtown-directory
- /market-echo
- /kz
- /privacy
- /terms
- /reward-terms

### Disallow (9)
- /admin
- /admin/
- /spin-win/claim
- /countdown
- /kz/cart
- /kz/search
- /products?*
- /stores?*
- /kz/products?*

### Sitemap declarations (2)
- https://wrheltmgquyqqhscrpds.supabase.co/functions/v1/sitemap
- https://mallelbostan.com/sitemap.xml

---

## 4. Per-page `noIndex` flags — 7 pages

| File | Mode | Condition |
| --- | --- | --- |
| `src/pages/Blog.tsx` | conditional | `!isLoading && (!posts || posts.length === 0)` |
| `src/pages/Careers.tsx` | conditional | `!isLoading && (!jobs || jobs.length === 0)` |
| `src/pages/Countdown.tsx` | always | — |
| `src/pages/DailyDeals.tsx` | conditional | `!isExpired` |
| `src/pages/NotFound.tsx` | always | — |
| `src/pages/Products.tsx` | conditional | `hasActiveFilters` |
| `src/pages/Stores.tsx` | conditional | `!!search || !!selectedStatus` |

---

## 5. Drift detection

### URLs in static sitemap but NOT in dynamic edge sitemap (0)
_None — both sources agree._

### URLs in dynamic edge sitemap but NOT in static sitemap (0)
_None._

### Disallowed paths that also appear in a sitemap (0)
_None — robots.txt and sitemaps are consistent._

---

## 6. Summary

- ✅ 19 URLs in static sitemap
- ✅ 19 static URLs in dynamic edge sitemap (DB rows added on top)
- ✅ 9 disallow rules in robots.txt
- ✅ 7 pages with `noIndex` (always or conditional)
- ✅ 0 disallow / sitemap conflict(s)
- ✅ 0 static ↔ edge drift item(s)

### Verdict
**🟢 PASS** — sitemap.xml, the dynamic edge sitemap, and robots.txt are perfectly aligned.
