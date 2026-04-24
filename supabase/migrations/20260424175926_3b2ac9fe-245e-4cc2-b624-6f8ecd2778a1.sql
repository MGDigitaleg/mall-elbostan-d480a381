UPDATE storage.buckets
SET public = false
WHERE id = 'offer-media';

DROP POLICY IF EXISTS "Offer media is publicly readable" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload offer media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update offer media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete offer media" ON storage.objects;

CREATE POLICY "Admins can view offer media"
ON storage.objects
FOR SELECT
USING (bucket_id = 'offer-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can upload offer media"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'offer-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update offer media"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'offer-media' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'offer-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete offer media"
ON storage.objects
FOR DELETE
USING (bucket_id = 'offer-media' AND public.has_role(auth.uid(), 'admin'));