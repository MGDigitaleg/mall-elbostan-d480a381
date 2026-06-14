# Full Interactive Map Editor

Today the map's entire geometry (floor shells, corridors, atrium, every unit polygon, label position, area, status, and category) is hardcoded in `src/lib/mallFloorGeometry.ts` and `MallFloorMap.tsx`. The `floors` table exists (3 rows) and `units` is empty. This plan moves the geometry into the database and adds a visual editor so the map is fully manageable from the admin dashboard — add/move/resize units, manage floors, edit areas/labels/status/category, and assign which store sits in each unit.

## Goal
"Does this strengthen El Bostan as a place and a store ecosystem?" — Yes: the interactive map stays a core functional feature, now editable without code.

## 1. Database (migration)
Extend the existing `units` table to hold geometry and presentation:
- `polygon text` — SVG points string (`"x,y x,y ..."`)
- `label_x real`, `label_y real` — label/number anchor
- `category text` — map category (Accessories, Laptops, …)
- `store_id uuid references stores(id)` — which store occupies the unit (nullable)
- `is_featured boolean`, `sort_order int`, `visibility boolean default true`
- keep existing `unit_code`, `status`, `area_sqm`, `floor_id`, descriptions

Add a per-floor geometry config on `floors`:
- `shell_polygon text`, `corridor_polygon text`, `atrium_polygon text` (nullable; defaults fall back to shared constants)

Grants: `units`/`floors` already have policies. Add a content-manager write policy (`can_manage_content`) for insert/update/delete, keep public read. Add `updated_at` trigger.

Then **seed** `units` from the current hardcoded `mallFloorGeometry` data (all 3 floors) via the insert tool so nothing visually changes on launch.

## 2. Public map renders from DB
- New hook `useMapData()` fetching floors + units (+ joined store name/logo/category/contact) with React Query.
- Adapt `InteractiveMap.tsx` and `MallFloorMap.tsx` to consume DB rows mapped into the existing `MallUnit`/`MallFloor` shape. Keep the hardcoded data as a fallback if the DB is empty, so there is zero regression.
- Status colors, atrium, corridors, labels unchanged.

## 3. Admin visual editor (`/admin/map`)
New page `src/pages/admin/AdminMapEditor.tsx` (guarded by `useRequireAdmin` / content-manager), linked from Admin Settings:
- Floor tabs (ground / first / second).
- Interactive SVG canvas reusing the same viewBox and shell/atrium rendering:
  - **Select** a unit to edit its panel (code, area, status, category, assigned store, featured, visibility, description).
  - **Move** unit by dragging; **resize/reshape** by dragging polygon vertices; live coordinate readout.
  - **Add unit** (draws a default rectangle you then reshape) and **delete unit**.
  - Drag the label anchor to reposition the number/logo.
- Side panel form for the selected unit + store assignment (searchable dropdown of stores).
- Floor settings (label, sort order, optional shell/corridor/atrium polygons).
- **Save** writes via Supabase; optimistic local state with explicit Save/Discard so edits are deliberate.

## 4. Verification
- Seed parity: public map looks identical before/after the switch to DB.
- Editor round-trip: move a unit, save, reload public map, confirm new position.
- Build + existing map tests pass.

## Technical notes
- Coordinate space: editor and public map share viewBox `-20 -20 1040 1040`; pointer coords converted via `getScreenCTM().inverse()`.
- Reuse `tenantMapLookup` logic but drive it from `store_id` join going forward.
- No changes to spin/win highlight URLs — `highlight=<unit_code>` keeps working since codes persist.

This is a large change; I'll implement it in the order above (DB → public read → editor), verifying parity at each step.