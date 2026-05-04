ALTER TABLE public.campaign_settings
  ADD COLUMN IF NOT EXISTS starts_at timestamptz,
  ADD COLUMN IF NOT EXISTS ends_at timestamptz,
  ADD COLUMN IF NOT EXISTS headline_ar text,
  ADD COLUMN IF NOT EXISTS headline_en text,
  ADD COLUMN IF NOT EXISTS subtitle_ar text,
  ADD COLUMN IF NOT EXISTS subtitle_en text,
  ADD COLUMN IF NOT EXISTS description_ar text,
  ADD COLUMN IF NOT EXISTS description_en text,
  ADD COLUMN IF NOT EXISTS cta_label_ar text,
  ADD COLUMN IF NOT EXISTS cta_label_en text,
  ADD COLUMN IF NOT EXISTS languages text[] NOT NULL DEFAULT ARRAY['ar-EG','en'];