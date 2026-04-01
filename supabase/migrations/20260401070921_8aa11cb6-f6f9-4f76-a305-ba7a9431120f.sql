CREATE TABLE IF NOT EXISTS public.tenant_logo_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_key TEXT NOT NULL UNIQUE,
  tenant_provided_name TEXT NOT NULL,
  normalized_display_name TEXT NOT NULL,
  units TEXT[] NOT NULL DEFAULT '{}',
  asset_type TEXT,
  source_file_name TEXT,
  source_file_path TEXT,
  raw_file_path TEXT,
  review_file_path TEXT,
  final_file_path TEXT,
  review_status TEXT NOT NULL DEFAULT 'Missing',
  reviewer_notes TEXT,
  final_export_name TEXT,
  final_export_path TEXT,
  background_removal_needed BOOLEAN NOT NULL DEFAULT false,
  crop_needed BOOLEAN NOT NULL DEFAULT false,
  transparent_export_ready BOOLEAN NOT NULL DEFAULT false,
  square_artboard_ready BOOLEAN NOT NULL DEFAULT false,
  safe_margin_applied BOOLEAN NOT NULL DEFAULT false,
  approved_for_final_export BOOLEAN NOT NULL DEFAULT false,
  requested_source_type TEXT,
  last_follow_up_note TEXT,
  execution_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT tenant_logo_assets_review_status_check CHECK (
    review_status IN ('Confirmed', 'Needs Cleanup', 'Needs Better Source', 'Missing', 'Pending Confirmation')
  )
);

ALTER TABLE public.tenant_logo_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view tenant logo assets"
ON public.tenant_logo_assets
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can create tenant logo assets"
ON public.tenant_logo_assets
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update tenant logo assets"
ON public.tenant_logo_assets
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete tenant logo assets"
ON public.tenant_logo_assets
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS update_tenant_logo_assets_updated_at ON public.tenant_logo_assets;
CREATE TRIGGER update_tenant_logo_assets_updated_at
BEFORE UPDATE ON public.tenant_logo_assets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Admins can view logo files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'logos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can upload logo files"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'logos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update logo files"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'logos' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'logos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete logo files"
ON storage.objects
FOR DELETE
USING (bucket_id = 'logos' AND public.has_role(auth.uid(), 'admin'));

INSERT INTO public.tenant_logo_assets (
  brand_key,
  tenant_provided_name,
  normalized_display_name,
  units,
  asset_type,
  review_status,
  reviewer_notes,
  final_export_name,
  final_export_path,
  background_removal_needed,
  crop_needed,
  transparent_export_ready,
  square_artboard_ready,
  safe_margin_applied,
  approved_for_final_export,
  requested_source_type,
  last_follow_up_note,
  execution_note
)
VALUES
  ('static', 'ستاتيك', 'ستاتيك', ARRAY['G-1'], NULL, 'Missing', 'No source file uploaded yet.', 'Static.png', '/logos/final/G-1_Static.png', false, false, false, false, false, false, 'Official logo file or readable storefront photo', 'Awaiting first source from tenant or onsite capture.', 'No confirmed source asset yet.'),
  ('sharaf', 'شرف', 'شرف', ARRAY['G-2'], NULL, 'Missing', 'No source file uploaded yet.', 'Sharaf.png', '/logos/final/G-2_Sharaf.png', false, false, false, false, false, false, 'Official logo file or readable storefront photo', 'Awaiting first source from tenant or onsite capture.', 'Await storefront photo or vendor file.'),
  ('2b', '2B', '2B', ARRAY['G-3'], 'Confirmed source logo', 'Needs Cleanup', 'Source is available but still needs cleanup before final export.', '2B.png', '/logos/final/G-3_2B.png', true, true, false, false, false, false, NULL, 'Source received and queued for cleanup.', 'Isolate the wordmark on a transparent square artboard.'),
  ('go-plus', 'Go plus', 'Go Plus', ARRAY['G-5'], NULL, 'Missing', 'No source file uploaded yet.', 'Go-Plus.png', '/logos/final/G-5_Go-Plus.png', false, false, false, false, false, false, 'Official logo file or readable storefront photo', 'Awaiting first source from tenant or onsite capture.', 'Need official logo file before cleanup/export.'),
  ('al-hoda', 'الهدى', 'الهدى', ARRAY['G-7'], 'Confirmed source logo', 'Needs Cleanup', 'Confirmed source needs transparent cleanup.', 'Al-Hoda.png', '/logos/final/G-7_Al-Hoda.png', true, true, false, false, false, false, NULL, 'Source received and queued for cleanup.', 'Remove background noise and keep original proportions.'),
  ('al-sahaba', 'الصحابة', 'الصحابة', ARRAY['G-8'], NULL, 'Missing', 'No source file uploaded yet.', 'Al-Sahaba.png', '/logos/final/G-8_Al-Sahaba.png', false, false, false, false, false, false, 'Official logo file or readable storefront photo', 'Awaiting first source from tenant or onsite capture.', 'Source asset not received yet.'),
  ('red-line', 'ريد لاين', 'ريد لاين', ARRAY['G-9'], NULL, 'Missing', 'No source file uploaded yet.', 'Red-Line.png', '/logos/final/G-9_Red-Line.png', false, false, false, false, false, false, 'Official logo file or readable storefront photo', 'Awaiting first source from tenant or onsite capture.', 'Need storefront capture or original logo file.'),
  ('egypt-laptop', 'ايجيبت لاب توب', 'Egypt Laptop', ARRAY['G-10'], 'Confirmed source logo', 'Needs Cleanup', 'Confirmed source exists and needs final transparent export.', 'Egypt-Laptop.png', '/logos/final/G-10_Egypt-Laptop.png', true, true, false, false, false, false, NULL, 'Source received and queued for cleanup.', 'Standardize margins and export transparent PNG.'),
  ('print-show', 'برنت شو', 'برنت شو', ARRAY['G-12'], NULL, 'Missing', 'No source file uploaded yet.', 'Print-Show.png', '/logos/final/G-12_Print-Show.png', false, false, false, false, false, false, 'Official logo file or readable storefront photo', 'Awaiting first source from tenant or onsite capture.', 'Logo still unresolved.'),
  ('hk', 'HK', 'HK', ARRAY['G-13'], NULL, 'Missing', 'No source file uploaded yet.', 'HK.png', '/logos/final/G-13_HK.png', false, false, false, false, false, false, 'Official logo file or readable storefront photo', 'Awaiting first source from tenant or onsite capture.', 'Need a readable shopfront or vendor-supplied mark.'),
  ('wifi', 'Wifi', 'WiFi', ARRAY['G-14'], NULL, 'Missing', 'No source file uploaded yet.', 'WiFi.png', '/logos/final/G-14_WiFi.png', false, false, false, false, false, false, 'Official logo file or readable storefront photo', 'Awaiting first source from tenant or onsite capture.', 'No confirmed logo file yet.'),
  ('kareem-store', 'كريم ستور', 'Kareem Store', ARRAY['G-15','G-16'], 'Confirmed Kareem Store source logo', 'Pending Confirmation', 'Shared brand family is assumed for both units until naming is reconfirmed.', 'Kareem-Store.png', '/logos/final/G-15_Kareem-Store.png', true, true, false, false, false, false, NULL, 'Need quick confirmation that G-15 and G-16 share the same final logo.', 'Use one family mark for G-15 and G-16 until storefront naming is reconfirmed.'),
  ('kasr-zero', 'كسر زيرو', 'كسر زيرو', ARRAY['G-17'], 'Confirmed source logo', 'Needs Cleanup', 'Source is available but needs cleanup before export.', 'Kasr-Zero.png', '/logos/final/G-17_Kasr-Zero.png', true, true, false, false, false, false, NULL, 'Source received and queued for cleanup.', 'Tight crop and remove any opaque background.'),
  ('infinity', 'انفينتي', 'Infinity', ARRAY['F-4'], 'Confirmed source logo', 'Needs Cleanup', 'Source is available but needs cleanup before export.', 'Infinity.png', '/logos/final/F-4_Infinity.png', true, true, false, false, false, false, NULL, 'Source received and queued for cleanup.', 'Preserve thin strokes and normalize artboard spacing.'),
  ('express-home', 'اكسبريس هوم', 'اكسبريس هوم', ARRAY['F-6'], NULL, 'Missing', 'No source file uploaded yet.', 'Express-Home.png', '/logos/final/F-6_Express-Home.png', false, false, false, false, false, false, 'Official logo file or readable storefront photo', 'Awaiting first source from tenant or onsite capture.', 'Keep separate from XPRS until brand confirmation arrives.'),
  ('el-badr', 'البدر', 'El Badr', ARRAY['F-7','F-8','F-9'], 'Confirmed shared El Badr logo', 'Confirmed', 'Shared master logo is approved for all three units.', 'El-Badr.png', '/logos/final/F-7_El-Badr.png', false, false, true, true, true, true, NULL, 'Shared logo confirmed for all three units.', 'Apply the same cleaned master file across F-7, F-8, and F-9.'),
  ('time-tech', 'تايم تك', 'Time Tech', ARRAY['F-10'], 'Uploaded PDF reference', 'Needs Better Source', 'PDF reference exists, but a cleaner extract is still required.', 'Time-Tech.png', '/logos/final/F-10_Time-Tech.png', true, true, false, false, false, false, 'Clean vector export or higher-resolution logo file', 'Use uploaded PDF as the current main reference until a cleaner source arrives.', 'Extract the clean vector/text mark from the PDF before final PNG export.'),
  ('prime-technology', 'برايم تكنولوجي', 'Prime Technology', ARRAY['F-11'], 'Confirmed source logo', 'Needs Cleanup', 'Source is available but needs cleanup before export.', 'Prime-Technology.png', '/logos/final/F-11_Prime-Technology.png', true, true, false, false, false, false, NULL, 'Source received and queued for cleanup.', 'Center the full lockup and keep a consistent safe margin.'),
  ('digital-plus', 'ديجيتال بلس', 'Digital Plus', ARRAY['F-13'], 'Available banner asset', 'Needs Better Source', 'Use the cleanest possible extraction from the available banner asset.', 'Digital-Plus.png', '/logos/final/F-13_Digital-Plus.png', true, true, false, false, false, false, 'Cleaner standalone logo file if available', 'Banner asset is the current source; extract the cleanest usable mark.', 'Extract the cleanest logo from the banner asset and remove banner-only noise.'),
  ('spark', 'سبارك', 'Spark', ARRAY['F-14'], NULL, 'Missing', 'No source file uploaded yet.', 'Spark.png', '/logos/final/F-14_Spark.png', false, false, false, false, false, false, 'Official logo file or readable storefront photo', 'Awaiting first source from tenant or onsite capture.', 'No approved logo file available.'),
  ('games-to-egypt', 'Games to Egypt', 'Games to Egypt', ARRAY['F-15'], NULL, 'Missing', 'No source file uploaded yet.', 'Games-to-Egypt.png', '/logos/final/F-15_Games-to-Egypt.png', false, false, false, false, false, false, 'Official logo file or readable storefront photo', 'Awaiting first source from tenant or onsite capture.', 'Await official brand asset before adding to the directory.'),
  ('xprs', 'Xprs', 'XPRS', ARRAY['F-17'], 'Confirmed XPRS text logo', 'Needs Cleanup', 'Use the text logo only and avoid the standalone X symbol.', 'XPRS.png', '/logos/final/F-17_XPRS.png', true, true, false, false, false, false, NULL, 'Text logo confirmed as the preferred source.', 'Use the text logo only; avoid the standalone green X symbol.'),
  ('info-max', 'info max', 'Info Max', ARRAY['S-1'], NULL, 'Missing', 'No source file uploaded yet.', 'Info-Max.png', '/logos/final/S-1_Info-Max.png', false, false, false, false, false, false, 'Official logo file or readable storefront photo', 'Awaiting first source from tenant or onsite capture.', 'Logo not available in the current asset set.'),
  ('mix-apex', 'مكس اند ابكس', 'Mix & Apex', ARRAY['S-5'], 'Confirmed source logo', 'Needs Cleanup', 'Source is available but needs cleanup before export.', 'Mix-and-Apex.png', '/logos/final/S-5_Mix-and-Apex.png', true, true, false, false, false, false, NULL, 'Source received and queued for cleanup.', 'Balance the dual-name lockup and preserve original aspect ratio.'),
  ('i7', 'i7', 'i7', ARRAY['S-6'], NULL, 'Missing', 'No source file uploaded yet.', 'i7.png', '/logos/final/S-6_i7.png', false, false, false, false, false, false, 'Official logo file or readable storefront photo', 'Awaiting first source from tenant or onsite capture.', 'Need official source before directory export.'),
  ('compu-marts', 'سوق الكمبيوتر', 'سوق الكمبيوتر / Compu Marts', ARRAY['S-7','S-8','S-9'], 'Confirmed clean blue logo source', 'Needs Cleanup', 'Use the clean blue version and prepare one master file for all three units.', 'Compu-Marts.png', '/logos/final/S-7_Compu-Marts.png', true, true, false, false, false, false, NULL, 'Blue shared logo source is confirmed for the three repeated units.', 'Use the clean blue version for S-7, S-8, and S-9.'),
  ('quick-fix', 'كويك فيكس', 'Quick Fix', ARRAY['S-10'], 'Confirmed source logo', 'Needs Cleanup', 'Source is available but needs cleanup before export.', 'Quick-Fix.png', '/logos/final/S-10_Quick-Fix.png', true, true, false, false, false, false, NULL, 'Source received and queued for cleanup.', 'Standardize artboard size and remove extra framing.')
ON CONFLICT (brand_key) DO UPDATE SET
  tenant_provided_name = EXCLUDED.tenant_provided_name,
  normalized_display_name = EXCLUDED.normalized_display_name,
  units = EXCLUDED.units,
  asset_type = EXCLUDED.asset_type,
  review_status = EXCLUDED.review_status,
  reviewer_notes = EXCLUDED.reviewer_notes,
  final_export_name = EXCLUDED.final_export_name,
  final_export_path = EXCLUDED.final_export_path,
  background_removal_needed = EXCLUDED.background_removal_needed,
  crop_needed = EXCLUDED.crop_needed,
  transparent_export_ready = EXCLUDED.transparent_export_ready,
  square_artboard_ready = EXCLUDED.square_artboard_ready,
  safe_margin_applied = EXCLUDED.safe_margin_applied,
  approved_for_final_export = EXCLUDED.approved_for_final_export,
  requested_source_type = EXCLUDED.requested_source_type,
  last_follow_up_note = EXCLUDED.last_follow_up_note,
  execution_note = EXCLUDED.execution_note;