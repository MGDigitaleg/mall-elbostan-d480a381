
ALTER TABLE public.stores
  ADD COLUMN IF NOT EXISTS lifecycle_status text NOT NULL DEFAULT 'draft';

-- Validation trigger (enum-like)
CREATE OR REPLACE FUNCTION public.validate_store_lifecycle_status()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.lifecycle_status NOT IN ('draft','pending','opening_soon','active','inactive','archived') THEN
    RAISE EXCEPTION 'invalid lifecycle_status: %', NEW.lifecycle_status;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS stores_validate_lifecycle_status ON public.stores;
CREATE TRIGGER stores_validate_lifecycle_status
BEFORE INSERT OR UPDATE OF lifecycle_status ON public.stores
FOR EACH ROW EXECUTE FUNCTION public.validate_store_lifecycle_status();

-- Backfill once
UPDATE public.stores
SET lifecycle_status = CASE
  WHEN opening_status = 'opening_soon' THEN 'opening_soon'
  WHEN status = 'leased' THEN 'active'
  WHEN status = 'hidden' THEN 'draft'
  ELSE 'pending'
END
WHERE lifecycle_status = 'draft';

CREATE INDEX IF NOT EXISTS idx_stores_lifecycle_status ON public.stores(lifecycle_status);
CREATE INDEX IF NOT EXISTS idx_stores_branch_context ON public.stores(branch_context);
