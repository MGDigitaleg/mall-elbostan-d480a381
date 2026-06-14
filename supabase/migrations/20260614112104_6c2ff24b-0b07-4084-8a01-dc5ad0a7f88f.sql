ALTER TABLE public.units DROP CONSTRAINT IF EXISTS units_status_check;
ALTER TABLE public.units ADD CONSTRAINT units_status_check
  CHECK (status = ANY (ARRAY['occupied'::text,'available'::text,'coming_soon'::text,'hidden'::text]));