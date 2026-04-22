CREATE TABLE public.indexing_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  source text NOT NULL DEFAULT 'manual',
  urls_submitted integer NOT NULL DEFAULT 0,
  url_list text[] NOT NULL DEFAULT '{}',
  results jsonb NOT NULL DEFAULT '[]',
  success boolean NOT NULL DEFAULT true,
  error_message text
);

ALTER TABLE public.indexing_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view indexing logs"
  ON public.indexing_logs
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Service can insert indexing logs"
  ON public.indexing_logs
  FOR INSERT
  WITH CHECK (true);