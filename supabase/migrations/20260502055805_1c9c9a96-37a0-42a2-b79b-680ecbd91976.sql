-- 1. Restrict decrement_prize_stock to service role only
REVOKE EXECUTE ON FUNCTION public.decrement_prize_stock(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.decrement_prize_stock(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.decrement_prize_stock(uuid) FROM authenticated;

-- 2. Tighten indexing_logs INSERT: only service role should write logs.
DROP POLICY IF EXISTS "Service can insert indexing logs" ON public.indexing_logs;
-- No INSERT policy for anon/authenticated — service role bypasses RLS.

-- 3. Hide apply_email column on jobs from anon/authenticated.
-- Public SELECT policy still allows reading the row, but column-level GRANT
-- limits which columns are returned for non-admin roles.
REVOKE SELECT ON public.jobs FROM anon, authenticated;
GRANT SELECT (id, title_ar, title_en, company_or_store, status, job_type,
              description_en, description_ar, application_deadline,
              created_at, updated_at)
  ON public.jobs TO anon, authenticated;
-- Admins use service role / dashboards, which bypass column grants.