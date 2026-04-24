
-- Create private bucket for leasing inquiry attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('leasing-docs', 'leasing-docs', false)
ON CONFLICT (id) DO NOTHING;

-- Anyone (including anonymous visitors) can upload into the inquiries/ prefix
CREATE POLICY "Anyone can upload leasing inquiry docs"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'leasing-docs'
  AND (storage.foldername(name))[1] = 'inquiries'
);

-- Only admins can read or manage uploaded leasing documents
CREATE POLICY "Admins can read leasing docs"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'leasing-docs'
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete leasing docs"
ON storage.objects
FOR DELETE
TO public
USING (
  bucket_id = 'leasing-docs'
  AND has_role(auth.uid(), 'admin'::app_role)
);
