-- 1) Audit logs table
CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name text NOT NULL,
  action text NOT NULL CHECK (action IN ('INSERT','UPDATE','DELETE')),
  row_id text,
  actor_id uuid,
  old_data jsonb,
  new_data jsonb,
  changed_columns text[],
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_logs_table_created ON public.audit_logs(table_name, created_at DESC);
CREATE INDEX idx_audit_logs_created ON public.audit_logs(created_at DESC);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can read audit logs"
  ON public.audit_logs FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete audit logs"
  ON public.audit_logs FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 2) Generic audit trigger function
CREATE OR REPLACE FUNCTION public.audit_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_old jsonb;
  v_new jsonb;
  v_row_id text;
  v_changed text[];
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_old := to_jsonb(OLD);
    v_new := NULL;
    v_row_id := COALESCE((v_old->>'id'), NULL);
  ELSIF TG_OP = 'INSERT' THEN
    v_old := NULL;
    v_new := to_jsonb(NEW);
    v_row_id := COALESCE((v_new->>'id'), NULL);
  ELSE
    v_old := to_jsonb(OLD);
    v_new := to_jsonb(NEW);
    v_row_id := COALESCE((v_new->>'id'), NULL);
    SELECT array_agg(key) INTO v_changed
    FROM jsonb_each(v_new)
    WHERE v_new->key IS DISTINCT FROM v_old->key;
  END IF;

  INSERT INTO public.audit_logs(table_name, action, row_id, actor_id, old_data, new_data, changed_columns)
  VALUES (TG_TABLE_NAME, TG_OP, v_row_id, auth.uid(), v_old, v_new, v_changed);

  RETURN COALESCE(NEW, OLD);
END;
$$;

-- 3) Attach to main content tables
DO $$
DECLARE
  t text;
  tables text[] := ARRAY[
    'stores','products','deals','blog_posts','faqs','events','jobs',
    'downtown_merchants','site_settings','campaign_settings','rewards',
    'store_prizes','competition_stores','floors','units','product_categories',
    'kz_products','kz_categories','social_offer_settings','social_monitored_merchants'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS audit_%I ON public.%I', t, t);
    EXECUTE format('CREATE TRIGGER audit_%I AFTER INSERT OR UPDATE OR DELETE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.audit_trigger()', t, t);
  END LOOP;
END $$;

-- 4) Schema introspection functions (admin-only)
CREATE OR REPLACE FUNCTION public.admin_list_tables()
RETURNS TABLE(table_name text, row_count bigint, has_rls boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;

  RETURN QUERY
  SELECT
    c.relname::text AS table_name,
    c.reltuples::bigint AS row_count,
    c.relrowsecurity AS has_rls
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public' AND c.relkind = 'r'
  ORDER BY c.relname;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_list_columns(p_table text)
RETURNS TABLE(column_name text, data_type text, is_nullable text, column_default text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;

  RETURN QUERY
  SELECT c.column_name::text, c.data_type::text, c.is_nullable::text, c.column_default::text
  FROM information_schema.columns c
  WHERE c.table_schema = 'public' AND c.table_name = p_table
  ORDER BY c.ordinal_position;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_list_policies(p_table text)
RETURNS TABLE(policy_name text, cmd text, roles text[], qual text, with_check text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;

  RETURN QUERY
  SELECT p.policyname::text, p.cmd::text, p.roles::text[], p.qual::text, p.with_check::text
  FROM pg_policies p
  WHERE p.schemaname = 'public' AND p.tablename = p_table
  ORDER BY p.policyname;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_browse_table(p_table text, p_limit int DEFAULT 100)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
DECLARE
  v_exists boolean;
  v_result jsonb;
  v_limit int;
BEGIN
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;

  SELECT EXISTS(
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relname = p_table AND c.relkind = 'r'
  ) INTO v_exists;

  IF NOT v_exists THEN
    RAISE EXCEPTION 'table not found';
  END IF;

  v_limit := LEAST(GREATEST(COALESCE(p_limit, 100), 1), 500);

  EXECUTE format('SELECT COALESCE(jsonb_agg(t), ''[]''::jsonb) FROM (SELECT * FROM public.%I LIMIT %s) t', p_table, v_limit)
  INTO v_result;

  RETURN v_result;
END;
$$;