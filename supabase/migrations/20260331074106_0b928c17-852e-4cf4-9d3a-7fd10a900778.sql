
-- Admin roles FIRST
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE POLICY "Users can read their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Only admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 1. Floors
CREATE TABLE public.floors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.floors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Floors are publicly readable" ON public.floors FOR SELECT USING (true);
CREATE POLICY "Only admins can manage floors" ON public.floors FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_floors_updated_at BEFORE UPDATE ON public.floors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. Stores
CREATE TABLE public.stores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  category TEXT,
  floor_id UUID REFERENCES public.floors(id),
  unit_code TEXT,
  status TEXT NOT NULL DEFAULT 'hidden' CHECK (status IN ('leased', 'available', 'hidden')),
  short_description_ar TEXT,
  short_description_en TEXT,
  long_description_ar TEXT,
  long_description_en TEXT,
  logo_url TEXT,
  cover_image_url TEXT,
  gallery JSONB DEFAULT '[]'::jsonb,
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  website TEXT,
  opening_hours TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  map_x REAL,
  map_y REAL,
  map_area_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published stores are publicly readable" ON public.stores FOR SELECT USING (status != 'hidden');
CREATE POLICY "Only admins can manage stores" ON public.stores FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE INDEX idx_stores_floor ON public.stores(floor_id);
CREATE INDEX idx_stores_status ON public.stores(status);
CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON public.stores FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Units
CREATE TABLE public.units (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  floor_id UUID REFERENCES public.floors(id),
  unit_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('leased', 'available', 'reserved', 'hidden')),
  area_sqm REAL,
  activity_suggestion TEXT,
  price_note TEXT,
  map_area_id TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  description_ar TEXT,
  description_en TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Non-hidden units are publicly readable" ON public.units FOR SELECT USING (status != 'hidden');
CREATE POLICY "Only admins can manage units" ON public.units FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_units_updated_at BEFORE UPDATE ON public.units FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Events
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title_ar TEXT NOT NULL,
  title_en TEXT,
  description_ar TEXT,
  description_en TEXT,
  event_date DATE,
  start_time TIME,
  end_time TIME,
  category TEXT,
  speaker_or_guest TEXT,
  image_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Events are publicly readable" ON public.events FOR SELECT USING (true);
CREATE POLICY "Only admins can manage events" ON public.events FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. Rewards
CREATE TABLE public.rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title_ar TEXT NOT NULL,
  title_en TEXT,
  reward_type TEXT NOT NULL CHECK (reward_type IN ('discount', 'gift', 'voucher')),
  sponsor_store_id UUID REFERENCES public.stores(id),
  stock INTEGER NOT NULL DEFAULT 0,
  probability_weight INTEGER NOT NULL DEFAULT 1,
  active_from TIMESTAMPTZ,
  active_to TIMESTAMPTZ,
  claim_rules_ar TEXT,
  claim_rules_en TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active rewards are publicly readable" ON public.rewards FOR SELECT USING (is_active = true);
CREATE POLICY "Only admins can manage rewards" ON public.rewards FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_rewards_updated_at BEFORE UPDATE ON public.rewards FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Spin Entries
CREATE TABLE public.spin_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  prize_id UUID REFERENCES public.rewards(id),
  won_at TIMESTAMPTZ DEFAULT now(),
  claim_status TEXT NOT NULL DEFAULT 'pending' CHECK (claim_status IN ('pending', 'claimed', 'expired')),
  social_follow_confirmed BOOLEAN NOT NULL DEFAULT false,
  opening_day_verified BOOLEAN NOT NULL DEFAULT false,
  phone_hash TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.spin_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Spin entries are insert-only for public" ON public.spin_entries FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admins can read spin entries" ON public.spin_entries FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- 7. Deals
CREATE TABLE public.deals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title_ar TEXT NOT NULL,
  title_en TEXT,
  description_ar TEXT,
  description_en TEXT,
  store_id UUID REFERENCES public.stores(id),
  valid_from TIMESTAMPTZ,
  valid_to TIMESTAMPTZ,
  promo_code TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  is_live BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Live deals are publicly readable" ON public.deals FOR SELECT USING (is_live = true);
CREATE POLICY "Only admins can manage deals" ON public.deals FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON public.deals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 8. Jobs
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title_ar TEXT NOT NULL,
  title_en TEXT,
  company_or_store TEXT,
  description_ar TEXT,
  description_en TEXT,
  job_type TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed', 'draft')),
  apply_email TEXT,
  application_deadline DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Open jobs are publicly readable" ON public.jobs FOR SELECT USING (status = 'open');
CREATE POLICY "Only admins can manage jobs" ON public.jobs FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 9. Blog Posts
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title_ar TEXT NOT NULL,
  title_en TEXT,
  excerpt_ar TEXT,
  excerpt_en TEXT,
  content_ar TEXT,
  content_en TEXT,
  cover_image_url TEXT,
  category TEXT,
  published_at TIMESTAMPTZ,
  featured BOOLEAN NOT NULL DEFAULT false,
  seo_title_ar TEXT,
  seo_title_en TEXT,
  seo_description_ar TEXT,
  seo_description_en TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published posts are publicly readable" ON public.blog_posts FOR SELECT USING (published_at IS NOT NULL AND published_at <= now());
CREATE POLICY "Only admins can manage posts" ON public.blog_posts FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 10. Leads
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_type TEXT NOT NULL CHECK (lead_type IN ('leasing', 'contact', 'partnership', 'media', 'careers')),
  full_name TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  email TEXT,
  message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit leads" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admins can read leads" ON public.leads FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- 11. FAQs
CREATE TABLE public.faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_ar TEXT NOT NULL,
  answer_ar TEXT NOT NULL,
  question_en TEXT,
  answer_en TEXT,
  category TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "FAQs are publicly readable" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "Only admins can manage faqs" ON public.faqs FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON public.faqs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
