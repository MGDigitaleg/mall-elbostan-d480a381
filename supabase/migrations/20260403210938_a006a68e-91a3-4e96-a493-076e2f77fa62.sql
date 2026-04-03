
-- Add new columns to downtown_merchants for expanded directory schema
ALTER TABLE public.downtown_merchants
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS branch text NOT NULL DEFAULT 'downtown',
  ADD COLUMN IF NOT EXISTS address_en text,
  ADD COLUMN IF NOT EXISTS category_secondary text,
  ADD COLUMN IF NOT EXISTS summary_ar text,
  ADD COLUMN IF NOT EXISTS summary_en text,
  ADD COLUMN IF NOT EXISTS products_services_ar text,
  ADD COLUMN IF NOT EXISTS products_services_en text,
  ADD COLUMN IF NOT EXISTS whatsapp text,
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS facebook_url text,
  ADD COLUMN IF NOT EXISTS instagram_url text,
  ADD COLUMN IF NOT EXISTS tiktok_url text,
  ADD COLUMN IF NOT EXISTS google_maps_url text,
  ADD COLUMN IF NOT EXISTS cover_image_url text,
  ADD COLUMN IF NOT EXISTS verification_notes text,
  ADD COLUMN IF NOT EXISTS source_1_label text,
  ADD COLUMN IF NOT EXISTS source_1_url text,
  ADD COLUMN IF NOT EXISTS source_2_label text,
  ADD COLUMN IF NOT EXISTS source_2_url text,
  ADD COLUMN IF NOT EXISTS source_3_label text,
  ADD COLUMN IF NOT EXISTS source_3_url text,
  ADD COLUMN IF NOT EXISTS is_marketplace_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS seo_title_ar text,
  ADD COLUMN IF NOT EXISTS seo_meta_description_ar text,
  ADD COLUMN IF NOT EXISTS seo_title_en text,
  ADD COLUMN IF NOT EXISTS seo_meta_description_en text,
  ADD COLUMN IF NOT EXISTS keywords_ar text,
  ADD COLUMN IF NOT EXISTS keywords_en text,
  ADD COLUMN IF NOT EXISTS last_verified_at timestamptz;

-- Generate slugs for existing rows that don't have one
UPDATE public.downtown_merchants
SET slug = lower(replace(replace(replace(COALESCE(name_en, name_ar), ' ', '-'), '''', ''), '.', ''))
WHERE slug IS NULL;

-- Make slug unique and not null after backfill
ALTER TABLE public.downtown_merchants ALTER COLUMN slug SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_downtown_merchants_slug ON public.downtown_merchants(slug);
CREATE INDEX IF NOT EXISTS idx_downtown_merchants_branch ON public.downtown_merchants(branch);
CREATE INDEX IF NOT EXISTS idx_downtown_merchants_category ON public.downtown_merchants(category);
