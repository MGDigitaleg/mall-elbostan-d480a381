UPDATE storage.buckets SET public = true WHERE id = 'logos';

CREATE POLICY "Public read access for logos" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'logos');