-- Extend units with geometry + presentation fields
ALTER TABLE public.units
  ADD COLUMN IF NOT EXISTS polygon text,
  ADD COLUMN IF NOT EXISTS label_x real,
  ADD COLUMN IF NOT EXISTS label_y real,
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS store_id uuid REFERENCES public.stores(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS visibility boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS name_ar text,
  ADD COLUMN IF NOT EXISTS name_en text;

-- Per-floor geometry config
ALTER TABLE public.floors
  ADD COLUMN IF NOT EXISTS shell_polygon text,
  ADD COLUMN IF NOT EXISTS corridor_polygon text,
  ADD COLUMN IF NOT EXISTS atrium_polygon text;

CREATE INDEX IF NOT EXISTS idx_units_floor_id ON public.units(floor_id);
CREATE INDEX IF NOT EXISTS idx_units_store_id ON public.units(store_id);