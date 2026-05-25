ALTER TABLE public.stores
  ADD COLUMN IF NOT EXISTS connector_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS sync_notes text,
  ADD COLUMN IF NOT EXISTS last_sync_result text;

CREATE INDEX IF NOT EXISTS idx_stores_external_type ON public.stores(external_store_type);
CREATE INDEX IF NOT EXISTS idx_stores_sync_status ON public.stores(sync_status);