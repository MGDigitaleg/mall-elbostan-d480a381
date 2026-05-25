
-- Extend downtown_merchants with verification workflow fields
ALTER TABLE public.downtown_merchants
  ADD COLUMN IF NOT EXISTS detailed_specialisation text,
  ADD COLUMN IF NOT EXISTS products_services text,
  ADD COLUMN IF NOT EXISTS tech_related boolean,
  ADD COLUMN IF NOT EXISTS floor_unit_location text,
  ADD COLUMN IF NOT EXISTS opening_hours text,
  ADD COLUMN IF NOT EXISTS current_status text,
  ADD COLUMN IF NOT EXISTS confidence_score integer,
  ADD COLUMN IF NOT EXISTS evidence_summary text,
  ADD COLUMN IF NOT EXISTS last_evidence_date text,
  ADD COLUMN IF NOT EXISTS source_date_quality text,
  ADD COLUMN IF NOT EXISTS confirmed_by_team_at timestamptz,
  ADD COLUMN IF NOT EXISTS last_manual_check_date date,
  ADD COLUMN IF NOT EXISTS show_verified_publicly boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS recommended_badge text,
  ADD COLUMN IF NOT EXISTS notes_for_website_team text,
  ADD COLUMN IF NOT EXISTS missing_data text,
  ADD COLUMN IF NOT EXISTS next_action text,
  ADD COLUMN IF NOT EXISTS original_directory_presence text,
  ADD COLUMN IF NOT EXISTS row_type text;

CREATE INDEX IF NOT EXISTS idx_dm_verification_status ON public.downtown_merchants(verification_status);
CREATE INDEX IF NOT EXISTS idx_dm_current_status ON public.downtown_merchants(current_status);
CREATE INDEX IF NOT EXISTS idx_dm_tech_related ON public.downtown_merchants(tech_related);

-- Audit trail
CREATE TABLE IF NOT EXISTS public.downtown_directory_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL,
  actor_id uuid,
  action text NOT NULL,
  field text,
  old_value text,
  new_value text,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dda_merchant ON public.downtown_directory_audit(merchant_id, created_at DESC);

ALTER TABLE public.downtown_directory_audit ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins read audit" ON public.downtown_directory_audit;
CREATE POLICY "Admins read audit" ON public.downtown_directory_audit
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins insert audit" ON public.downtown_directory_audit;
CREATE POLICY "Admins insert audit" ON public.downtown_directory_audit
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
