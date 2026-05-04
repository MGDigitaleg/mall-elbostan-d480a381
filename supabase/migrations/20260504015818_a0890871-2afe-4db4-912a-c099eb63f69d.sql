
-- Helper: any content-management role check
CREATE OR REPLACE FUNCTION public.can_manage_content(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin'::app_role, 'editor'::app_role)
  )
$$;

-- Add editor management policies on content tables (admin-only policies remain in place)
CREATE POLICY "Editors can manage stores"
  ON public.stores FOR ALL
  USING (public.can_manage_content(auth.uid()))
  WITH CHECK (public.can_manage_content(auth.uid()));

CREATE POLICY "Editors can manage deals"
  ON public.deals FOR ALL
  USING (public.can_manage_content(auth.uid()))
  WITH CHECK (public.can_manage_content(auth.uid()));

CREATE POLICY "Editors can manage blog posts"
  ON public.blog_posts FOR ALL
  USING (public.can_manage_content(auth.uid()))
  WITH CHECK (public.can_manage_content(auth.uid()));

CREATE POLICY "Editors can manage jobs"
  ON public.jobs FOR ALL
  USING (public.can_manage_content(auth.uid()))
  WITH CHECK (public.can_manage_content(auth.uid()));

CREATE POLICY "Editors can manage faqs"
  ON public.faqs FOR ALL
  USING (public.can_manage_content(auth.uid()))
  WITH CHECK (public.can_manage_content(auth.uid()));

CREATE POLICY "Editors can manage events"
  ON public.events FOR ALL
  USING (public.can_manage_content(auth.uid()))
  WITH CHECK (public.can_manage_content(auth.uid()));

CREATE POLICY "Editors can manage products"
  ON public.products FOR ALL
  USING (public.can_manage_content(auth.uid()))
  WITH CHECK (public.can_manage_content(auth.uid()));

CREATE POLICY "Editors can manage product categories"
  ON public.product_categories FOR ALL
  USING (public.can_manage_content(auth.uid()))
  WITH CHECK (public.can_manage_content(auth.uid()));

CREATE POLICY "Editors can manage downtown merchants"
  ON public.downtown_merchants FOR ALL
  USING (public.can_manage_content(auth.uid()))
  WITH CHECK (public.can_manage_content(auth.uid()));

CREATE POLICY "Editors can manage rewards"
  ON public.rewards FOR ALL
  USING (public.can_manage_content(auth.uid()))
  WITH CHECK (public.can_manage_content(auth.uid()));

CREATE POLICY "Editors can manage store prizes"
  ON public.store_prizes FOR ALL
  USING (public.can_manage_content(auth.uid()))
  WITH CHECK (public.can_manage_content(auth.uid()));

CREATE POLICY "Editors can manage competition stores"
  ON public.competition_stores FOR ALL
  USING (public.can_manage_content(auth.uid()))
  WITH CHECK (public.can_manage_content(auth.uid()));

CREATE POLICY "Editors can manage campaign settings"
  ON public.campaign_settings FOR ALL
  USING (public.can_manage_content(auth.uid()))
  WITH CHECK (public.can_manage_content(auth.uid()));

CREATE POLICY "Editors can manage floors"
  ON public.floors FOR ALL
  USING (public.can_manage_content(auth.uid()))
  WITH CHECK (public.can_manage_content(auth.uid()));
