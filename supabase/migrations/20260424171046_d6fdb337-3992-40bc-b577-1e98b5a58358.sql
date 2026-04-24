ALTER TABLE public.deals
ADD COLUMN IF NOT EXISTS campaign_key text NOT NULL DEFAULT 'general',
ADD COLUMN IF NOT EXISTS brand text,
ADD COLUMN IF NOT EXISTS model text,
ADD COLUMN IF NOT EXISTS specs_short_ar text,
ADD COLUMN IF NOT EXISTS price_current numeric,
ADD COLUMN IF NOT EXISTS price_old numeric,
ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'EGP',
ADD COLUMN IF NOT EXISTS offer_badge_ar text,
ADD COLUMN IF NOT EXISTS image_primary text,
ADD COLUMN IF NOT EXISTS source_link text,
ADD COLUMN IF NOT EXISTS source_type text,
ADD COLUMN IF NOT EXISTS verified boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS opening_status text NOT NULL DEFAULT 'standard',
ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;

ALTER TABLE public.stores
ADD COLUMN IF NOT EXISTS is_opening_participant boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS branch_context text,
ADD COLUMN IF NOT EXISTS opening_status text,
ADD COLUMN IF NOT EXISTS pending_verification boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_deals_campaign_key ON public.deals (campaign_key);
CREATE INDEX IF NOT EXISTS idx_deals_opening_status ON public.deals (opening_status);
CREATE INDEX IF NOT EXISTS idx_deals_sort_order ON public.deals (sort_order);
CREATE INDEX IF NOT EXISTS idx_stores_opening_participant ON public.stores (is_opening_participant);
CREATE INDEX IF NOT EXISTS idx_stores_branch_context ON public.stores (branch_context);