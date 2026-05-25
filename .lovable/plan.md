## El Bostan Admin — Production Finalization Plan

This is a large, multi-phase refactor. To ship it safely without breaking the public site or the 30+ existing admin modules, I'll deliver it in 4 sequential phases. Each phase is independently shippable and verifiable.

---

### Phase 1 — Dashboard Home + Shell (UI/UX foundation)

Replace the flat icon-wall dashboard with a real operational home.

- New `AdminShell` layout: persistent left sidebar (grouped nav: Overview, Content, Stores & Tenants, Offers, Spin, SEO, System, Settings), top bar with role badge + global search + sign out, mobile drawer.
- New **Dashboard Home** (`/admin`) with:
  - KPI strip: stores (total / active / opening-soon), products (published / draft), offers (live / expiring 7d), pending social posts, leads (7d).
  - **Pending review queue** (social offers + draft offers + draft products) — top of page, actionable rows.
  - **Recent activity** from `audit_logs` (last 20).
  - **Alerts**: integration health (edge fn errors 24h), launch readiness summary, expiring offers.
  - **Quick actions**: New Store, New Offer, Review Social Posts, Publish queue.
- Standardized admin primitives (used everywhere going forward):
  - `AdminPageHeader`, `AdminStatusBadge`, `AdminEmptyState`, `AdminTableSkeleton`, `AdminFilters`, `AdminDataTable`.

### Phase 2 — Stores / Tenants Management

Replace generic CRUD with a real tenant console.

- Schema additions on `stores`:
  - `display_name`, `floor`, `unit`, `admin_notes`
  - external commerce fields: `external_store_type` (shopify/woocommerce/manual/website/none), `external_store_url`, `external_store_handle`, `sync_mode` (manual/scheduled/webhook), `sync_status`, `last_sync_at`, `import_products`, `import_offers`
  - status enum widened: draft / pending / opening_soon / active / inactive / archived
- New pages:
  - `/admin/stores` — filterable list (branch, category, status, featured), search, bulk publish/archive, status badges.
  - `/admin/stores/:id` — tenant detail with tabs: **Identity**, **Location & Map**, **External Store**, **Products**, **Offers**, **Social Sources**, **Activity**. Edit forms per tab, publish/archive actions.
- Extensible integration model: `external_store_type` drives which fields/connectors appear; safe no-op when type=`none`. Architecture ready for future product/offer sync workers.

### Phase 3 — Products, Offers, Social Review

- **Products admin** rebuilt on `AdminDataTable`: filters (store/category/status/featured), inline publish/feature/duplicate/archive, detail edit page with image manager, SEO fields, store/category assignment.
- **Offers admin**: pipeline view (pending / approved / published / expired / rejected), create-from-scratch + create-from-intake conversion, link to store/product, homepage-teaser toggle.
- **Social Offer Review**: tighten existing `/admin/social-offers` with clearer queue, one-click approve→draft offer (already partially exists). Confirm no auto-publish path.

### Phase 4 — Admin Users / Roles / Publishing / Settings

- **`/admin/users`** (super_admin + admin only):
  - List admins (joined from `user_roles` + auth.users via edge function using service role).
  - Invite admin (edge function: creates auth user + role row + sends password reset email).
  - Assign / change role (admin, editor, reviewer; super_admin role added to enum).
  - Enable/disable (sets role to none + revokes sessions).
  - Force password reset (edge function triggers reset email).
  - Last login from `auth.users.last_sign_in_at`.
- **Role guards**: `useRequireRole(['admin','super_admin'])` hook; sidebar items filtered by role; protected route wrapper.
- **Settings hub** (`/admin/settings`): consolidates contact settings, branch defaults, social monitoring settings, offer behavior, SEO utilities — into one tabbed page (links to existing pages where useful, no duplication).
- **Publishing control**: standardize `draft / published / archived` actions + "last edited by/at" surfaced on all content edit pages.

---

### Technical notes

- All new tables/columns via migrations with RLS (`has_role` / `can_manage_content`).
- New edge functions: `admin-invite-user`, `admin-reset-user-password`, `admin-set-user-role`, `admin-disable-user` — all gated by `has_role(auth.uid(),'super_admin'|'admin')` server-side.
- No credentials in code. Invites use Supabase's built-in password reset / invite emails.
- Mobile: sidebar collapses to drawer, tables fall back to card lists < 768px.
- Existing routes/pages preserved; old `Dashboard.tsx` becomes a legacy redirect to the new `/admin` home.

---

### Scope confirmation

Given the size (~15-25 new/rewritten files per phase, 3-4 migrations, 4 edge functions), I recommend shipping **Phase 1 first**, you review, then I continue Phase 2 → 3 → 4. Otherwise we risk a single massive change that's hard to QA.

**Approve this plan to start Phase 1 (Dashboard Home + Admin Shell)?** Or tell me to plow through all 4 phases in one go.
