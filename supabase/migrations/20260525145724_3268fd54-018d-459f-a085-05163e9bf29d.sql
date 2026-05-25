-- Helper: reviewer-or-admin
CREATE OR REPLACE FUNCTION public.can_review(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin'::app_role, 'reviewer'::app_role)
  )
$$;

-- Social offer intake: allow reviewers to SELECT + UPDATE (not delete)
DROP POLICY IF EXISTS "Reviewers can read social offer intake" ON public.social_offer_intake;
CREATE POLICY "Reviewers can read social offer intake"
ON public.social_offer_intake FOR SELECT
USING (public.can_review(auth.uid()));

DROP POLICY IF EXISTS "Reviewers can update social offer intake" ON public.social_offer_intake;
CREATE POLICY "Reviewers can update social offer intake"
ON public.social_offer_intake FOR UPDATE
USING (public.can_review(auth.uid()))
WITH CHECK (public.can_review(auth.uid()));

-- Notifications: reviewers can read+update (mark read/dismiss)
DROP POLICY IF EXISTS "Reviewers can read social offer notifications" ON public.social_offer_notifications;
CREATE POLICY "Reviewers can read social offer notifications"
ON public.social_offer_notifications FOR SELECT
USING (public.can_review(auth.uid()));

DROP POLICY IF EXISTS "Reviewers can update social offer notifications" ON public.social_offer_notifications;
CREATE POLICY "Reviewers can update social offer notifications"
ON public.social_offer_notifications FOR UPDATE
USING (public.can_review(auth.uid()))
WITH CHECK (public.can_review(auth.uid()));

-- Activity log: reviewers can read + insert (to log their actions)
DROP POLICY IF EXISTS "Reviewers can read activity log" ON public.social_offer_activity_log;
CREATE POLICY "Reviewers can read activity log"
ON public.social_offer_activity_log FOR SELECT
USING (public.can_review(auth.uid()));

DROP POLICY IF EXISTS "Reviewers can insert activity log" ON public.social_offer_activity_log;
CREATE POLICY "Reviewers can insert activity log"
ON public.social_offer_activity_log FOR INSERT
WITH CHECK (public.can_review(auth.uid()));

-- Deals: reviewers can read + update (to approve/reject offers in pipeline)
DROP POLICY IF EXISTS "Reviewers can read all deals" ON public.deals;
CREATE POLICY "Reviewers can read all deals"
ON public.deals FOR SELECT
USING (public.can_review(auth.uid()));

DROP POLICY IF EXISTS "Reviewers can update deals" ON public.deals;
CREATE POLICY "Reviewers can update deals"
ON public.deals FOR UPDATE
USING (public.can_review(auth.uid()))
WITH CHECK (public.can_review(auth.uid()));

-- Products: reviewers can read all + update for moderation
DROP POLICY IF EXISTS "Reviewers can read all products" ON public.products;
CREATE POLICY "Reviewers can read all products"
ON public.products FOR SELECT
USING (public.can_review(auth.uid()));

DROP POLICY IF EXISTS "Reviewers can update products" ON public.products;
CREATE POLICY "Reviewers can update products"
ON public.products FOR UPDATE
USING (public.can_review(auth.uid()))
WITH CHECK (public.can_review(auth.uid()));

-- Stores: reviewers can read (needed for store context in moderation UI)
DROP POLICY IF EXISTS "Reviewers can read all stores" ON public.stores;
CREATE POLICY "Reviewers can read all stores"
ON public.stores FOR SELECT
USING (public.can_review(auth.uid()));
