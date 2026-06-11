-- Allow content managers (admins + editors) to upload/update/delete logo & cover files,
-- not just admins, so the store editor upload works for all content roles.
DROP POLICY IF EXISTS "Admins can upload logo files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update logo files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete logo files" ON storage.objects;

CREATE POLICY "Content managers can upload logo files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'logos' AND public.can_manage_content(auth.uid()));

CREATE POLICY "Content managers can update logo files"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'logos' AND public.can_manage_content(auth.uid()))
  WITH CHECK (bucket_id = 'logos' AND public.can_manage_content(auth.uid()));

CREATE POLICY "Content managers can delete logo files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'logos' AND public.can_manage_content(auth.uid()));