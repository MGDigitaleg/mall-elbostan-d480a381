CREATE TABLE public.spin_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  won BOOLEAN NOT NULL DEFAULT false,
  prize_name_ar TEXT,
  claim_code TEXT,
  is_grand BOOLEAN NOT NULL DEFAULT false,
  is_visitor BOOLEAN NOT NULL DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE,
  client_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_spin_history_user_created ON public.spin_history(user_id, created_at DESC);
CREATE UNIQUE INDEX idx_spin_history_dedup ON public.spin_history(user_id, client_id) WHERE client_id IS NOT NULL;

ALTER TABLE public.spin_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own spin history"
ON public.spin_history FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own spin history"
ON public.spin_history FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own spin history"
ON public.spin_history FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all spin history"
ON public.spin_history FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));