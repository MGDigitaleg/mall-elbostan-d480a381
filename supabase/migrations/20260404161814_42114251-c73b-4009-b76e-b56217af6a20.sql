
-- ═══════════════════════════════════════════
-- Kasr Zero Ecommerce Schema
-- ═══════════════════════════════════════════

-- 1. Categories
CREATE TABLE public.kz_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  image TEXT,
  parent_id UUID REFERENCES public.kz_categories(id) ON DELETE SET NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.kz_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "kz_categories_public_read" ON public.kz_categories
  FOR SELECT TO public USING (true);

CREATE POLICY "kz_categories_admin_all" ON public.kz_categories
  FOR ALL TO public USING (public.has_role(auth.uid(), 'admin'));

-- 2. Products
CREATE TABLE public.kz_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  brand TEXT,
  category_id UUID REFERENCES public.kz_categories(id) ON DELETE SET NULL,
  product_type TEXT,
  condition TEXT DEFAULT 'new',
  status TEXT NOT NULL DEFAULT 'draft',
  featured BOOLEAN NOT NULL DEFAULT false,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.kz_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "kz_products_public_read" ON public.kz_products
  FOR SELECT TO public USING (status = 'published');

CREATE POLICY "kz_products_admin_all" ON public.kz_products
  FOR ALL TO public USING (public.has_role(auth.uid(), 'admin'));

-- 3. Product Variants
CREATE TABLE public.kz_product_variants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.kz_products(id) ON DELETE CASCADE,
  sku TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  compare_price NUMERIC,
  stock_qty INTEGER NOT NULL DEFAULT 0,
  ram TEXT,
  storage TEXT,
  processor TEXT,
  color TEXT,
  variant_name TEXT,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.kz_product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "kz_variants_public_read" ON public.kz_product_variants
  FOR SELECT TO public USING (
    EXISTS (SELECT 1 FROM public.kz_products WHERE id = product_id AND status = 'published')
  );

CREATE POLICY "kz_variants_admin_all" ON public.kz_product_variants
  FOR ALL TO public USING (public.has_role(auth.uid(), 'admin'));

-- 4. Product Images
CREATE TABLE public.kz_product_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.kz_products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.kz_product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "kz_images_public_read" ON public.kz_product_images
  FOR SELECT TO public USING (
    EXISTS (SELECT 1 FROM public.kz_products WHERE id = product_id AND status = 'published')
  );

CREATE POLICY "kz_images_admin_all" ON public.kz_product_images
  FOR ALL TO public USING (public.has_role(auth.uid(), 'admin'));

-- 5. Product Specs
CREATE TABLE public.kz_product_specs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.kz_products(id) ON DELETE CASCADE,
  spec_name TEXT NOT NULL,
  spec_value TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.kz_product_specs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "kz_specs_public_read" ON public.kz_product_specs
  FOR SELECT TO public USING (
    EXISTS (SELECT 1 FROM public.kz_products WHERE id = product_id AND status = 'published')
  );

CREATE POLICY "kz_specs_admin_all" ON public.kz_product_specs
  FOR ALL TO public USING (public.has_role(auth.uid(), 'admin'));

-- Indexes for performance
CREATE INDEX idx_kz_products_slug ON public.kz_products(slug);
CREATE INDEX idx_kz_products_category ON public.kz_products(category_id);
CREATE INDEX idx_kz_products_status ON public.kz_products(status);
CREATE INDEX idx_kz_products_brand ON public.kz_products(brand);
CREATE INDEX idx_kz_products_featured ON public.kz_products(featured);
CREATE INDEX idx_kz_variants_product ON public.kz_product_variants(product_id);
CREATE INDEX idx_kz_images_product ON public.kz_product_images(product_id);
CREATE INDEX idx_kz_specs_product ON public.kz_product_specs(product_id);
CREATE INDEX idx_kz_categories_slug ON public.kz_categories(slug);
CREATE INDEX idx_kz_categories_parent ON public.kz_categories(parent_id);
