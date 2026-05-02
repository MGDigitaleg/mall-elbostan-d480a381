-- 1) Tighten leasing-docs upload policy: require UUID subfolder + allowed extension
DROP POLICY IF EXISTS "Anyone can upload leasing inquiry docs" ON storage.objects;

CREATE POLICY "Anyone can upload leasing inquiry docs (constrained)"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'leasing-docs'
  AND (storage.foldername(name))[1] = 'inquiries'
  -- Require a valid UUID as the second path segment
  AND (storage.foldername(name))[2] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
  -- Restrict to safe document/image extensions
  AND lower(name) ~ '\.(pdf|jpg|jpeg|png|webp|doc|docx)$'
  -- Defense-in-depth: bound the path depth to exactly inquiries/<uuid>/<filename>
  AND array_length(storage.foldername(name), 1) = 2
);

-- 2) Reduce SECURITY DEFINER linter noise: trigger-only function does not need PUBLIC EXECUTE
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM authenticated;