-- 1) spin_history: remove client INSERT and DELETE (handled server-side via service role)
DROP POLICY IF EXISTS "Users can insert their own spin history" ON public.spin_history;
DROP POLICY IF EXISTS "Users can delete their own spin history" ON public.spin_history;
REVOKE INSERT, DELETE ON public.spin_history FROM anon, authenticated;

-- 2) stores: hide internal operational columns from anonymous visitors
REVOKE SELECT (
  admin_notes,
  external_store_type,
  external_store_url,
  external_store_handle,
  sync_mode,
  sync_status,
  last_sync_at,
  last_sync_error,
  import_products,
  import_offers,
  sync_log,
  sync_notes,
  last_sync_result,
  pending_verification,
  lifecycle_status,
  connector_enabled
) ON public.stores FROM anon;