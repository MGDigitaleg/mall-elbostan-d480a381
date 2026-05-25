
ALTER TABLE public.spin_sessions
  ADD COLUMN IF NOT EXISTS utm_source text,
  ADD COLUMN IF NOT EXISTS utm_medium text,
  ADD COLUMN IF NOT EXISTS utm_campaign text,
  ADD COLUMN IF NOT EXISTS utm_content text;

CREATE TABLE IF NOT EXISTS public.qr_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name_ar text NOT NULL,
  description_ar text,
  destination_path text NOT NULL DEFAULT '/spin-win',
  utm_source text NOT NULL DEFAULT 'qr',
  utm_medium text NOT NULL DEFAULT 'qr',
  utm_campaign text NOT NULL,
  utm_content text,
  placement text,
  is_active boolean NOT NULL DEFAULT true,
  scan_count integer NOT NULL DEFAULT 0,
  lead_count integer NOT NULL DEFAULT 0,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.qr_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active QR campaigns are publicly readable"
  ON public.qr_campaigns FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins manage qr_campaigns"
  ON public.qr_campaigns FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER set_qr_campaigns_updated_at
  BEFORE UPDATE ON public.qr_campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
