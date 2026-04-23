CREATE TABLE public.site_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site settings are publicly readable"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage site settings"
  ON public.site_settings FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

INSERT INTO public.site_settings (key, value) VALUES ('official_phone', '') ON CONFLICT DO NOTHING;