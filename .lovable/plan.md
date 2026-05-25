# Downtown Directory Verification System — Implementation Plan

## Approach

The project already has a working `downtown_merchants` table and admin page (`AdminDowntownMerchants.tsx`). Rather than creating a parallel `stores` table (which would fragment data), I'll **extend the existing table** with verification fields, then rebuild the admin UI around the verification workflow you described.

## 1. Database migration

Extend `downtown_merchants` with new verification columns:
- `detailed_specialisation`, `products_services`, `tech_related` (bool)
- `floor_unit_location`, `opening_hours`
- `current_status` (Open / Closed / Unclear / Needs Field Verification)
- `confidence_score` (1–5), `evidence_summary`
- `last_evidence_date`, `source_date_quality`
- `confirmed_by_team_at`, `last_manual_check_date`
- `show_verified_publicly` (bool, default false)
- `recommended_badge`, `notes_for_website_team`, `missing_data`
- `next_action`, `original_directory_presence`, `row_type`

Update `verification_status` to support the 7 statuses:
`VERIFIED_EXTERNAL`, `PARTIAL_EXTERNAL_MATCH`, `CONFLICT_CHECK`, `LISTED_ONLY`, `UNREVIEWED_LISTED_ONLY`, `EXTERNAL_VERIFIED_NOT_ON_SITE_LIST`, `EXTERNAL_DIRECTORY_CANDIDATE`.

Add a `downtown_directory_audit` table for status/badge change history (admin-only RLS).

## 2. Admin UI — `/admin/downtown-merchants` (rebuilt)

New tabbed layout:

**Tab: Dashboard**
- 7 KPI cards: Total / Verified External / Listed Only / Needs Verification / Conflicts / External Candidates / Tech-Related
- Quick links into queues

**Tab: Directory**
- Existing table, upgraded with:
  - Filter by verification_status, category, tech_related, floor, current_status
  - Search by name (AR/EN), phone, category
  - Inline status editor (dropdown per row)
  - CSV export
  - Color-coded badges (green/gray/amber/red/purple)

**Tab: Verification Queue**
- 4 grouped sections:
  - High-Priority Tech (seeded list: Technology Egypt, Compu Tec, …)
  - Needs Manual Verification (`UNREVIEWED_LISTED_ONLY` + `Needs Field Verification`)
  - Data Conflicts (`CONFLICT_CHECK`, `PARTIAL_EXTERNAL_MATCH`)
  - External Candidates Not on Site (`EXTERNAL_VERIFIED_NOT_ON_SITE_LIST`, `EXTERNAL_DIRECTORY_CANDIDATE`)

**Tab: Import**
- CSV upload accepting the 32 columns from your sheet
- Parses `نعم`/`لا` → bool, `غير مؤكد` → null (kept in notes)
- Duplicate name detection → flagged for review (no silent merge)
- Checkbox: "Overwrite confirmed records" (default off; protects rows with `confirmed_by_team_at`)
- Preview diff before commit

**Store detail editor** (modal, existing pattern extended)
- All new fields grouped: Basic / Content / Contact / Social / Media / Verification / Evidence / SEO / Publishing
- Evidence panel: Source 1/2/3 + evidence_summary read-only block
- "Mark as manually verified" button → sets `confirmed_by_team_at = now()`, `last_manual_check_date = today`
- Audit log panel showing status/badge changes

## 3. Public UI rules

Update `DowntownDirectory.tsx`, `DowntownMerchantDetail.tsx`, and any merchant cards:

**Badge logic:**
```
if (verification_status === 'VERIFIED_EXTERNAL'
    && show_verified_publicly
    && (last_manual_check_date || confirmed_by_team_at)) → "موثّق" green
else if (verification_status === 'LISTED_ONLY') → "مدرج" gray/blue
else if (verification_status === 'UNREVIEWED_LISTED_ONLY'
         || current_status === 'Needs Field Verification') → "قيد التحقق" amber
else → no public badge
```

**Hidden in public when null/unconfirmed:** phone, whatsapp, opening_hours.
**Hidden from public directory entirely:** `EXTERNAL_VERIFIED_NOT_ON_SITE_LIST`, `EXTERNAL_DIRECTORY_CANDIDATE`, `CONFLICT_CHECK` (admin-only).
**Filters added:** category, tech_related, floor, status.

Public detail route stays `/downtown-branch/stores/[slug]` (existing).

## 4. CSV seed

Copy the uploaded `el_bostan_downtown_seed_store_import_final.csv` into the import flow as a one-click "Load Downtown Seed" action so the 61 stores are populated with their evidence/status from your sheet.

## Technical details

- **Files to create:**
  - `src/components/admin/DowntownVerificationDashboard.tsx`
  - `src/components/admin/DowntownVerificationQueue.tsx`
  - `src/components/admin/DowntownCsvImporter.tsx`
  - `src/lib/downtownVerification.ts` (badge logic, status maps)
- **Files to edit:**
  - `src/pages/admin/AdminDowntownMerchants.tsx` (tabs + integrations)
  - `src/pages/DowntownDirectory.tsx` (public badge + filters)
  - `src/pages/DowntownMerchantDetail.tsx` (hide unconfirmed contact)
- **Migration:** single SQL adding columns + audit table + RLS (admins manage, public read active only).

## Out of scope for this iteration

- Separate `stores` table (extending existing avoids dual-write).
- Reworking the New Cairo branch directory (different data model).
- Email/notification triggers on status change (audit log only).

## Confirmation needed

This is a large change. Please confirm:
1. Extend `downtown_merchants` (recommended) vs create a new `stores` table?
2. Auto-load the 61-row CSV seed on first run, or leave as a manual import button?
