-- Add prize_type and gating columns to store_prizes
ALTER TABLE public.store_prizes
  ADD COLUMN IF NOT EXISTS prize_type text NOT NULL DEFAULT 'instant',
  ADD COLUMN IF NOT EXISTS visitor_only boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_grand boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS grand_probability numeric NOT NULL DEFAULT 0;

-- Sanity constraint
ALTER TABLE public.store_prizes
  DROP CONSTRAINT IF EXISTS store_prizes_prize_type_check;
ALTER TABLE public.store_prizes
  ADD CONSTRAINT store_prizes_prize_type_check
  CHECK (prize_type IN ('instant','grand','visitor'));

-- Add visitor verification + token tracking to spin_sessions
ALTER TABLE public.spin_sessions
  ADD COLUMN IF NOT EXISTS visitor_verified boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS visitor_token text,
  ADD COLUMN IF NOT EXISTS prize_type text;

-- Visitor verification tokens (issued by staff or printed QR)
CREATE TABLE IF NOT EXISTS public.visitor_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text NOT NULL UNIQUE,
  method text NOT NULL DEFAULT 'staff_code',
  issued_by text,
  is_active boolean NOT NULL DEFAULT true,
  valid_from timestamptz NOT NULL DEFAULT now(),
  valid_to timestamptz,
  max_uses integer,
  used_count integer NOT NULL DEFAULT 0,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.visitor_verifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Only admins can manage visitor verifications" ON public.visitor_verifications;
CREATE POLICY "Only admins can manage visitor verifications"
  ON public.visitor_verifications
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP TRIGGER IF EXISTS visitor_verifications_updated_at ON public.visitor_verifications;
CREATE TRIGGER visitor_verifications_updated_at
  BEFORE UPDATE ON public.visitor_verifications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Generic "Mall El Bostan" store + competition_store to host general prizes
INSERT INTO public.stores (slug, name_ar, name_en, status, category, featured)
VALUES ('mall-elbostan-general', 'مول البستان', 'Mall El Bostan', 'hidden', 'mall', false)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.competition_stores (store_id, is_active, participation_note)
SELECT id, true, 'الجوائز العامة (قسائم خصم + الجائزة الكبرى + جائزة الزائرين)'
FROM public.stores
WHERE slug = 'mall-elbostan-general'
ON CONFLICT DO NOTHING;