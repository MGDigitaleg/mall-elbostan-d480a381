-- Fix 1: Scope store-manager logo upload/update policies to the manager's own store.
-- Logo files are stored under a top-level folder equal to the store id (see merchant upload code).
DROP POLICY IF EXISTS "Store managers can upload logo files" ON storage.objects;
DROP POLICY IF EXISTS "Store managers can update logo files" ON storage.objects;

CREATE POLICY "Store managers can upload logo files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'logos'
  AND is_store_manager(auth.uid())
  AND (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
  AND manages_store(auth.uid(), ((storage.foldername(name))[1])::uuid)
);

CREATE POLICY "Store managers can update logo files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'logos'
  AND is_store_manager(auth.uid())
  AND (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
  AND manages_store(auth.uid(), ((storage.foldername(name))[1])::uuid)
)
WITH CHECK (
  bucket_id = 'logos'
  AND is_store_manager(auth.uid())
  AND (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
  AND manages_store(auth.uid(), ((storage.foldername(name))[1])::uuid)
);

-- Fix 2: Hide internal operational store columns from anonymous (and signed-in non-privileged) readers
-- by revoking column-level SELECT on those fields. Public/published reads continue to work for
-- customer-facing columns; admins/editors/managers read full rows via table-level grants.
REVOKE SELECT (
  sync_log, sync_status, last_sync_at, last_sync_error, last_sync_result,
  admin_notes, external_store_handle, external_store_url, external_store_type,
  sync_mode, sync_notes, pending_verification, lifecycle_status,
  connector_enabled, import_products, import_offers
) ON public.stores FROM anon;
