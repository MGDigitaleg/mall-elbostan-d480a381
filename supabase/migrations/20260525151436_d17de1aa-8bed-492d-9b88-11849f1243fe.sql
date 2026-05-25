
-- 1. Add store_manager to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'store_manager';

COMMIT;
BEGIN;

-- 2. store_managers link table
CREATE TABLE IF NOT EXISTS public.store_managers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  store_id uuid NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  is_primary boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, store_id)
);

CREATE INDEX IF NOT EXISTS idx_store_managers_user ON public.store_managers(user_id);
CREATE INDEX IF NOT EXISTS idx_store_managers_store ON public.store_managers(store_id);

ALTER TABLE public.store_managers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage store_managers"
  ON public.store_managers FOR ALL
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Managers read their own assignments"
  ON public.store_managers FOR SELECT
  USING (user_id = auth.uid());

CREATE TRIGGER trg_store_managers_updated
  BEFORE UPDATE ON public.store_managers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Helper functions
CREATE OR REPLACE FUNCTION public.is_store_manager(_user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = 'store_manager'::public.app_role)
$$;

CREATE OR REPLACE FUNCTION public.manages_store(_user_id uuid, _store_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.store_managers
    WHERE user_id = _user_id AND store_id = _store_id)
$$;

CREATE OR REPLACE FUNCTION public.manager_store_ids(_user_id uuid)
RETURNS SETOF uuid
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT store_id FROM public.store_managers WHERE user_id = _user_id
$$;

-- 4. Scoped RLS policies

-- STORES
CREATE POLICY "Store managers read own store"
  ON public.stores FOR SELECT
  USING (public.manages_store(auth.uid(), id));

CREATE POLICY "Store managers update own store"
  ON public.stores FOR UPDATE
  USING (public.manages_store(auth.uid(), id))
  WITH CHECK (public.manages_store(auth.uid(), id));

-- PRODUCTS
CREATE POLICY "Store managers read own products"
  ON public.products FOR SELECT
  USING (store_id IS NOT NULL AND public.manages_store(auth.uid(), store_id));

CREATE POLICY "Store managers insert own products"
  ON public.products FOR INSERT
  WITH CHECK (store_id IS NOT NULL AND public.manages_store(auth.uid(), store_id));

CREATE POLICY "Store managers update own products"
  ON public.products FOR UPDATE
  USING (store_id IS NOT NULL AND public.manages_store(auth.uid(), store_id))
  WITH CHECK (store_id IS NOT NULL AND public.manages_store(auth.uid(), store_id));

CREATE POLICY "Store managers delete own products"
  ON public.products FOR DELETE
  USING (store_id IS NOT NULL AND public.manages_store(auth.uid(), store_id));

-- DEALS (offers)
CREATE POLICY "Store managers read own deals"
  ON public.deals FOR SELECT
  USING (store_id IS NOT NULL AND public.manages_store(auth.uid(), store_id));

CREATE POLICY "Store managers insert own deals"
  ON public.deals FOR INSERT
  WITH CHECK (store_id IS NOT NULL AND public.manages_store(auth.uid(), store_id));

CREATE POLICY "Store managers update own deals"
  ON public.deals FOR UPDATE
  USING (store_id IS NOT NULL AND public.manages_store(auth.uid(), store_id))
  WITH CHECK (store_id IS NOT NULL AND public.manages_store(auth.uid(), store_id));

CREATE POLICY "Store managers delete own deals"
  ON public.deals FOR DELETE
  USING (store_id IS NOT NULL AND public.manages_store(auth.uid(), store_id));

-- LEADS — scoped via metadata->>'store_id'
CREATE POLICY "Store managers read own store leads"
  ON public.leads FOR SELECT
  USING (
    (metadata->>'store_id') IS NOT NULL
    AND public.manages_store(auth.uid(), (metadata->>'store_id')::uuid)
  );

COMMIT;
