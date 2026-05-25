## Phase 2 — El Bostan Admin Finalization

Status: A ✅ • B ✅ • C ✅ • D ⏳ • E ⏳ • F partial (csvExport ✅, dashboard cockpit ⏳)

Scope: refine and unify the existing admin into a production-grade ops dashboard. No rewrites from zero. Build in 6 sequenced batches so each ships verifiable value.

---

### Batch A — Unify shell across real admin pages
Wrap these existing pages in `AdminShell` + new primitives (`AdminPageHeader`, `AdminStatCard`, `AdminSectionCard`, `AdminStatusBadge`, `AdminEmptyState`):
- `/admin/stores`, `/admin/stores/:id`
- `/admin/products`, `/admin/offers`, `/admin/deals`, `/admin/social-offers`
- `/admin/leads`, `/admin/spin-winners`
- `/admin/users`, `/admin/roles`, `/admin/settings`

Normalize: page header pattern, filters bar, status chips (draft/pending/active/expired/archived), empty states, mobile-responsive tables (card fallback under md).

### Batch B — Advanced tenant/store management
- Store list: filters (branch, category, status, featured, opening_status), search, bulk actions (publish/unpublish/feature/archive), CSV export.
- Store statuses enum: `draft | pending | opening_soon | active | inactive | archived` (migrate `stores.lifecycle_status` if missing; else map to existing `status`).
- Store detail page tabs: Identity • Location/Map • Products • Offers • Social Sources • External Store • Publish • Activity.
- Quick actions: publish, feature, archive, open public page, copy slug.

### Batch C — External store wiring
Reuse existing `stores.external_store_*` and `sync_*` columns. Add admin UI:
- Connection card per store with: `external_store_type` (none|shopify|woocommerce|manual|custom), URL, handle, sync_mode (manual|scheduled|webhook-ready), toggles `import_products` / `import_offers`, `last_sync_at`, `sync_status` badge, sync log preview.
- Architecture: connector registry in `src/lib/externalConnectors.ts` so new platforms plug in without UI changes.
- No fake automation — only "Mark sync attempted" + manual upload path for Phase 2.

### Batch D — Products & offers workflows
- Products manager: filters (store, category, status, featured), bulk publish/archive/duplicate, image preview column, inline status toggle.
- Offers pipeline: extend existing kanban with Rejected column, convert-from-social action, duplicate action, attach related product picker, pricing validation, expiry warnings.
- Social intake: explicit Approve→Convert wizard that creates a `deals` row in draft state. Never auto-publishes.

### Batch E — Security, roles, account control
- Reset password flow audit: ensure `/reset-password` route exists, `resetPasswordForEmail` uses correct redirect.
- Add `reviewer` role to `app_role` enum (keep admin/editor; reserve `super_admin` if not present — verify before migration).
- Invite admin user (already in `admin-manage-user` — surface as primary CTA), disable/enable user toggle, last_sign_in_at column in users list.
- Role-aware sidebar (already partially in place — extend to hide actions, not just nav).

### Batch F — Ops tools + cockpit polish
- CSV export utility `src/lib/csvExport.ts`; wire into spin-winners, leads, stores, products, offers.
- Dashboard home upgrade: pending review widget (social intake + draft offers + pending stores), expiring offers (next 7d), opening-soon stores, recent edge function errors, sync issues, recent audit log.
- Mobile: collapsible filters, sticky action bar, table→card fallback components in `AdminPrimitives`.

---

### Technical notes
- Migrations needed only if: `lifecycle_status` enum missing on stores, `reviewer` role missing. Verify with `read_query` first.
- No new core dependencies. Reuse `@tanstack/react-query`, `lucide-react`, shadcn.
- Keep all copy in Fusha Arabic, use 'محلات' not 'متاجر', no emojis.
- All status colors via existing `AdminStatusBadge` tones.

### Out of scope (defer to Phase 3)
- Real webhook receivers for Shopify/Woo.
- Scheduled background sync workers.
- Full QR/UTM campaign builder UI (architecture readiness only).
- Reviewer-specific dashboards.

### Execution order
A → B → C → D → E → F. Each batch is independently verifiable in preview before moving on. I'll start with Batch A on your approval.
