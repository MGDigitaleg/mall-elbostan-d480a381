ALTER POLICY "Anyone can submit leads"
ON public.leads
WITH CHECK (
  char_length(trim(full_name)) > 0
  AND char_length(trim(lead_type)) > 0
);

ALTER POLICY "Spin entries are insert-only for public"
ON public.spin_entries
WITH CHECK (
  char_length(trim(full_name)) > 0
  AND char_length(trim(phone)) > 0
  AND char_length(trim(phone_hash)) > 0
);