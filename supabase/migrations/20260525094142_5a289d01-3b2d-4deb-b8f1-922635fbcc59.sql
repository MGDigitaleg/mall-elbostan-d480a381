-- Phase 2: Store/tenant management upgrades
ALTER TABLE public.stores
  ADD COLUMN IF NOT EXISTS display_name text,
  ADD COLUMN IF NOT EXISTS floor_label text,
  ADD COLUMN IF NOT EXISTS unit_label text,
  ADD COLUMN IF NOT EXISTS admin_notes text,
  ADD COLUMN IF NOT EXISTS external_store_type text NOT NULL DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS external_store_url text,
  ADD COLUMN IF NOT EXISTS external_store_handle text,
  ADD COLUMN IF NOT EXISTS sync_mode text NOT NULL DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS sync_status text NOT NULL DEFAULT 'idle',
  ADD COLUMN IF NOT EXISTS last_sync_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS last_sync_error text,
  ADD COLUMN IF NOT EXISTS import_products boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS import_offers boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS sync_log jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Constrain external_store_type to known values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'stores_external_store_type_check'
  ) THEN
    ALTER TABLE public.stores
      ADD CONSTRAINT stores_external_store_type_check
      CHECK (external_store_type IN ('none','manual','website','shopify','woocommerce','other'));
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'stores_sync_mode_check'
  ) THEN
    ALTER TABLE public.stores
      ADD CONSTRAINT stores_sync_mode_check
      CHECK (sync_mode IN ('manual','scheduled','webhook'));
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'stores_sync_status_check'
  ) THEN
    ALTER TABLE public.stores
      ADD CONSTRAINT stores_sync_status_check
      CHECK (sync_status IN ('idle','queued','running','success','error','disabled'));
  END IF;
END$$;

CREATE INDEX IF NOT EXISTS idx_stores_external_type ON public.stores(external_store_type);
CREATE INDEX IF NOT EXISTS idx_stores_sync_status ON public.stores(sync_status);