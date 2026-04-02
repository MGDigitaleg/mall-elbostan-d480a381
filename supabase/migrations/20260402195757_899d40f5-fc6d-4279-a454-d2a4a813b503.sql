
-- ═══════════════════════════════════════════════════════════
-- COMPETITION STORES — stores participating in Spin & Win
-- ═══════════════════════════════════════════════════════════
CREATE TABLE public.competition_stores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  is_active boolean NOT NULL DEFAULT true,
  participation_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(store_id)
);

ALTER TABLE public.competition_stores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active competition stores are publicly readable"
  ON public.competition_stores FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Only admins can manage competition stores"
  ON public.competition_stores FOR ALL
  TO public
  USING (public.has_role(auth.uid(), 'admin'));

-- ═══════════════════════════════════════════════════════════
-- STORE PRIZES — prizes offered by each participating store
-- ═══════════════════════════════════════════════════════════
CREATE TABLE public.store_prizes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_store_id uuid NOT NULL REFERENCES public.competition_stores(id) ON DELETE CASCADE,
  name_ar text NOT NULL,
  name_en text,
  category text,
  image_url text,
  total_quantity integer NOT NULL DEFAULT 0,
  remaining_stock integer NOT NULL DEFAULT 0,
  probability_weight integer NOT NULL DEFAULT 1,
  active_from timestamptz,
  active_to timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  redemption_rules_ar text,
  redemption_rules_en text,
  validity_days integer DEFAULT 30,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.store_prizes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active store prizes are publicly readable"
  ON public.store_prizes FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Only admins can manage store prizes"
  ON public.store_prizes FOR ALL
  TO public
  USING (public.has_role(auth.uid(), 'admin'));

-- ═══════════════════════════════════════════════════════════
-- SPIN SESSIONS — one spin per phone per day
-- ═══════════════════════════════════════════════════════════
CREATE TABLE public.spin_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  phone text NOT NULL,
  email text,
  phone_hash text NOT NULL,
  spin_date date NOT NULL DEFAULT CURRENT_DATE,
  competition_store_id uuid REFERENCES public.competition_stores(id),
  prize_id uuid REFERENCES public.store_prizes(id),
  claim_code text UNIQUE,
  qr_data text,
  claim_status text NOT NULL DEFAULT 'pending',
  expires_at timestamptz,
  redeemed_at timestamptz,
  redeemed_by text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(phone_hash, spin_date)
);

ALTER TABLE public.spin_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert spin sessions"
  ON public.spin_sessions FOR INSERT
  TO public
  WITH CHECK (
    char_length(TRIM(BOTH FROM full_name)) > 0
    AND char_length(TRIM(BOTH FROM phone)) > 0
    AND char_length(TRIM(BOTH FROM phone_hash)) > 0
  );

CREATE POLICY "Only admins can read spin sessions"
  ON public.spin_sessions FOR SELECT
  TO public
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update spin sessions"
  ON public.spin_sessions FOR UPDATE
  TO public
  USING (public.has_role(auth.uid(), 'admin'));

-- ═══════════════════════════════════════════════════════════
-- Enable realtime for spin_sessions for live admin dashboard
-- ═══════════════════════════════════════════════════════════
ALTER PUBLICATION supabase_realtime ADD TABLE public.spin_sessions;
