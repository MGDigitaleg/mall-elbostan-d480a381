CREATE TABLE public.edge_function_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  function_name text NOT NULL,
  status text NOT NULL DEFAULT 'success',
  status_code integer,
  duration_ms integer,
  method text,
  path text,
  request_summary jsonb DEFAULT '{}'::jsonb,
  error_message text,
  error_stack text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_edge_function_logs_created_at ON public.edge_function_logs (created_at DESC);
CREATE INDEX idx_edge_function_logs_function ON public.edge_function_logs (function_name, created_at DESC);
CREATE INDEX idx_edge_function_logs_status ON public.edge_function_logs (status, created_at DESC);

ALTER TABLE public.edge_function_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can read edge function logs"
  ON public.edge_function_logs FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete edge function logs"
  ON public.edge_function_logs FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));
