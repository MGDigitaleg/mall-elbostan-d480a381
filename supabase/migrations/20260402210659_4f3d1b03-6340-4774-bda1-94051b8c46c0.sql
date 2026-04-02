CREATE TABLE public.downtown_merchants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar text NOT NULL,
  name_en text,
  category text DEFAULT 'الكمبيوتر والأجهزة',
  floor text,
  unit_number text,
  phone text,
  address text DEFAULT '18 شارع البستان، باب اللوق، القاهرة',
  logo_url text,
  website text,
  social_url text,
  source_url text,
  verification_status text NOT NULL DEFAULT 'needs_review',
  source_notes text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.downtown_merchants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Downtown merchants are publicly readable"
  ON public.downtown_merchants FOR SELECT TO public
  USING (is_active = true);

CREATE POLICY "Only admins can manage downtown merchants"
  ON public.downtown_merchants FOR ALL TO public
  USING (has_role(auth.uid(), 'admin'::app_role));