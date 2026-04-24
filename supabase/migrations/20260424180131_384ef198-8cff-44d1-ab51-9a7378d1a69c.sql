ALTER TABLE public.social_offer_settings
ADD COLUMN IF NOT EXISTS schedule_secret TEXT NOT NULL DEFAULT gen_random_uuid()::text,
ADD COLUMN IF NOT EXISTS last_run_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_run_status TEXT,
ADD COLUMN IF NOT EXISTS last_run_error TEXT;

ALTER TABLE public.social_offer_settings
DROP CONSTRAINT IF EXISTS social_offer_settings_last_run_status_check;

ALTER TABLE public.social_offer_settings
ADD CONSTRAINT social_offer_settings_last_run_status_check
CHECK (last_run_status IS NULL OR last_run_status IN ('idle', 'running', 'success', 'error'));