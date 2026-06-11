CREATE POLICY "Store managers can upload logo files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'logos' AND public.is_store_manager(auth.uid()));

CREATE POLICY "Store managers can update logo files"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'logos' AND public.is_store_manager(auth.uid()))
  WITH CHECK (bucket_id = 'logos' AND public.is_store_manager(auth.uid()));