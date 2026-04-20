
-- 1. Remove the public INSERT policy on spin_sessions (edge function uses service role)
DROP POLICY IF EXISTS "Public can insert spin sessions" ON public.spin_sessions;

-- 2. Create atomic stock decrement function
CREATE OR REPLACE FUNCTION public.decrement_prize_stock(p_prize_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE updated int;
BEGIN
  UPDATE store_prizes
  SET remaining_stock = remaining_stock - 1
  WHERE id = p_prize_id AND remaining_stock > 0;
  GET DIAGNOSTICS updated = ROW_COUNT;
  RETURN updated > 0;
END;
$$;
