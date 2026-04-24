CREATE TABLE public.social_monitored_merchants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  merchant_name TEXT NOT NULL,
  display_name TEXT,
  store_slug TEXT NOT NULL,
  branch_context TEXT NOT NULL DEFAULT 'new-cairo',
  opening_status TEXT,
  logo_url TEXT,
  monitoring_status TEXT NOT NULL DEFAULT 'monitoring_enabled',
  monitoring_enabled BOOLEAN NOT NULL DEFAULT true,
  keywords_ar TEXT[] NOT NULL DEFAULT '{}'::text[],
  keywords_en TEXT[] NOT NULL DEFAULT '{}'::text[],
  opening_keywords TEXT[] NOT NULL DEFAULT '{}'::text[],
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT social_monitored_merchants_store_unique UNIQUE (store_id),
  CONSTRAINT social_monitored_merchants_store_slug_unique UNIQUE (store_slug),
  CONSTRAINT social_monitored_merchants_monitoring_status_check CHECK (monitoring_status IN ('monitoring_enabled', 'monitoring_disabled'))
);

CREATE TABLE public.social_merchant_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  merchant_id UUID NOT NULL REFERENCES public.social_monitored_merchants(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  account_label TEXT,
  page_url TEXT NOT NULL,
  handle TEXT,
  source_external_id TEXT,
  import_mode TEXT NOT NULL DEFAULT 'connector',
  monitoring_enabled BOOLEAN NOT NULL DEFAULT true,
  check_interval_minutes INTEGER NOT NULL DEFAULT 60,
  source_config JSONB NOT NULL DEFAULT '{}'::jsonb,
  last_checked_at TIMESTAMP WITH TIME ZONE,
  last_detected_at TIMESTAMP WITH TIME ZONE,
  last_success_at TIMESTAMP WITH TIME ZONE,
  last_error TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT social_merchant_sources_platform_check CHECK (platform IN ('facebook', 'instagram', 'manual', 'other')),
  CONSTRAINT social_merchant_sources_import_mode_check CHECK (import_mode IN ('connector', 'manual_url', 'manual_upload', 'manual_draft', 'other')),
  CONSTRAINT social_merchant_sources_check_interval_check CHECK (check_interval_minutes >= 5),
  CONSTRAINT social_merchant_sources_unique UNIQUE (merchant_id, platform, page_url)
);

CREATE TABLE public.social_offer_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  branch_context TEXT NOT NULL DEFAULT 'new-cairo',
  monitoring_enabled BOOLEAN NOT NULL DEFAULT true,
  detection_threshold NUMERIC(5,2) NOT NULL DEFAULT 0.45,
  homepage_feature_limit INTEGER NOT NULL DEFAULT 4,
  schedule_cron TEXT NOT NULL DEFAULT '*/30 * * * *',
  global_keywords_ar TEXT[] NOT NULL DEFAULT ARRAY['البستان','مول البستان','افتتاح','فرع التجمع','فرع التجمع الخامس','عرض','خصم'],
  global_keywords_en TEXT[] NOT NULL DEFAULT ARRAY['elbostan','mall el bostan','opening','new branch','mall launch','offer','discount'],
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT social_offer_settings_branch_context_unique UNIQUE (branch_context),
  CONSTRAINT social_offer_settings_threshold_check CHECK (detection_threshold >= 0 AND detection_threshold <= 1),
  CONSTRAINT social_offer_settings_homepage_limit_check CHECK (homepage_feature_limit >= 0)
);

CREATE TABLE public.social_offer_intake (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  merchant_id UUID NOT NULL REFERENCES public.social_monitored_merchants(id) ON DELETE CASCADE,
  source_id UUID REFERENCES public.social_merchant_sources(id) ON DELETE SET NULL,
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  branch_context TEXT NOT NULL DEFAULT 'new-cairo',
  source_platform TEXT NOT NULL,
  source_post_id TEXT,
  source_post_url TEXT,
  source_caption TEXT,
  source_published_at TIMESTAMP WITH TIME ZONE,
  detected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  captured_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  source_thumbnail_url TEXT,
  media_assets JSONB NOT NULL DEFAULT '[]'::jsonb,
  curated_media_assets JSONB NOT NULL DEFAULT '[]'::jsonb,
  detected_keywords TEXT[] NOT NULL DEFAULT '{}'::text[],
  relevance_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  relevance_status TEXT NOT NULL DEFAULT 'detected',
  opening_related BOOLEAN NOT NULL DEFAULT false,
  review_status TEXT NOT NULL DEFAULT 'pending_review',
  publish_status TEXT NOT NULL DEFAULT 'draft',
  content_type TEXT NOT NULL DEFAULT 'opening_offer',
  offer_title TEXT,
  offer_subtitle TEXT,
  short_specs TEXT,
  current_price NUMERIC,
  old_price NUMERIC,
  currency TEXT NOT NULL DEFAULT 'EGP',
  category TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  published_deal_id UUID,
  duplicate_of UUID REFERENCES public.social_offer_intake(id) ON DELETE SET NULL,
  source_capture_method TEXT NOT NULL DEFAULT 'automatic',
  raw_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT social_offer_intake_source_platform_check CHECK (source_platform IN ('facebook', 'instagram', 'manual', 'other')),
  CONSTRAINT social_offer_intake_relevance_status_check CHECK (relevance_status IN ('detected', 'low_confidence', 'relevant', 'irrelevant')),
  CONSTRAINT social_offer_intake_review_status_check CHECK (review_status IN ('detected', 'pending_review', 'approved', 'rejected', 'duplicate', 'archived')),
  CONSTRAINT social_offer_intake_publish_status_check CHECK (publish_status IN ('draft', 'ready', 'published', 'expired')),
  CONSTRAINT social_offer_intake_content_type_check CHECK (content_type IN ('opening_offer', 'regular_offer', 'store_announcement', 'coming_soon_offer')),
  CONSTRAINT social_offer_intake_source_capture_method_check CHECK (source_capture_method IN ('automatic', 'manual_url', 'manual_upload', 'manual_draft')),
  CONSTRAINT social_offer_intake_relevance_score_check CHECK (relevance_score >= 0 AND relevance_score <= 1),
  CONSTRAINT social_offer_intake_source_post_unique UNIQUE (merchant_id, source_platform, source_post_id)
);

CREATE TABLE public.social_offer_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  intake_id UUID NOT NULL REFERENCES public.social_offer_intake(id) ON DELETE CASCADE,
  merchant_id UUID NOT NULL REFERENCES public.social_monitored_merchants(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL DEFAULT 'new_detected_post',
  title_ar TEXT NOT NULL,
  body_ar TEXT,
  thumbnail_url TEXT,
  action_url TEXT,
  unread BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  read_at TIMESTAMP WITH TIME ZONE,
  dismissed_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT social_offer_notifications_type_check CHECK (notification_type IN ('new_detected_post', 'pending_review', 'published', 'expired', 'system'))
);

CREATE TABLE public.social_offer_activity_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  intake_id UUID NOT NULL REFERENCES public.social_offer_intake(id) ON DELETE CASCADE,
  actor_user_id UUID,
  action_type TEXT NOT NULL,
  action_label_ar TEXT,
  note TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT social_offer_activity_log_action_type_check CHECK (action_type IN ('detected', 'reviewed', 'edited', 'approved', 'rejected', 'duplicate', 'archived', 'published', 'expired', 'notification_created'))
);

ALTER TABLE public.social_monitored_merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_merchant_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_offer_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_offer_intake ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_offer_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_offer_activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage monitored merchants"
ON public.social_monitored_merchants
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage merchant sources"
ON public.social_merchant_sources
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage social offer settings"
ON public.social_offer_settings
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage social offer intake"
ON public.social_offer_intake
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage social offer notifications"
ON public.social_offer_notifications
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage social offer activity logs"
ON public.social_offer_activity_log
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_social_monitored_merchants_branch_status
  ON public.social_monitored_merchants (branch_context, monitoring_status, monitoring_enabled);
CREATE INDEX idx_social_merchant_sources_merchant_platform
  ON public.social_merchant_sources (merchant_id, platform, monitoring_enabled);
CREATE INDEX idx_social_offer_settings_branch_context
  ON public.social_offer_settings (branch_context, monitoring_enabled);
CREATE INDEX idx_social_offer_intake_merchant_review
  ON public.social_offer_intake (merchant_id, review_status, publish_status);
CREATE INDEX idx_social_offer_intake_store_branch
  ON public.social_offer_intake (store_id, branch_context, opening_related);
CREATE INDEX idx_social_offer_intake_platform_detected_at
  ON public.social_offer_intake (source_platform, detected_at DESC);
CREATE INDEX idx_social_offer_intake_published_at
  ON public.social_offer_intake (published_at DESC);
CREATE INDEX idx_social_offer_notifications_unread_created
  ON public.social_offer_notifications (unread, created_at DESC);
CREATE INDEX idx_social_offer_activity_log_intake_created
  ON public.social_offer_activity_log (intake_id, created_at DESC);

CREATE OR REPLACE FUNCTION public.create_social_offer_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.review_status IN ('detected', 'pending_review') THEN
    INSERT INTO public.social_offer_notifications (
      intake_id,
      merchant_id,
      notification_type,
      title_ar,
      body_ar,
      thumbnail_url,
      action_url,
      unread
    ) VALUES (
      NEW.id,
      NEW.merchant_id,
      'new_detected_post',
      'منشور جديد بانتظار المراجعة',
      COALESCE(NEW.offer_title, NEW.source_caption, 'تم اكتشاف منشور جديد مرتبط بالمول أو عروض الافتتاح'),
      NEW.source_thumbnail_url,
      CONCAT('/admin/social-offers?post=', NEW.id::text),
      true
    );

    INSERT INTO public.social_offer_activity_log (
      intake_id,
      action_type,
      action_label_ar,
      note,
      payload
    ) VALUES (
      NEW.id,
      'notification_created',
      'إنشاء إشعار إداري',
      'تم إنشاء إشعار جديد لأن المنشور يحتاج مراجعة قبل النشر.',
      jsonb_build_object('review_status', NEW.review_status, 'source_platform', NEW.source_platform)
    );
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER social_monitored_merchants_set_updated_at
BEFORE UPDATE ON public.social_monitored_merchants
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER social_merchant_sources_set_updated_at
BEFORE UPDATE ON public.social_merchant_sources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER social_offer_settings_set_updated_at
BEFORE UPDATE ON public.social_offer_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER social_offer_intake_set_updated_at
BEFORE UPDATE ON public.social_offer_intake
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER social_offer_intake_create_notification
AFTER INSERT ON public.social_offer_intake
FOR EACH ROW
EXECUTE FUNCTION public.create_social_offer_notification();

INSERT INTO public.social_offer_settings (
  branch_context,
  monitoring_enabled,
  detection_threshold,
  homepage_feature_limit,
  schedule_cron,
  global_keywords_ar,
  global_keywords_en,
  admin_notes
)
VALUES (
  'new-cairo',
  true,
  0.45,
  4,
  '*/30 * * * *',
  ARRAY['البستان','مول البستان','افتتاح','فرع التجمع','فرع التجمع الخامس','عرض','خصم','مرتبط بافتتاح المول'],
  ARRAY['elbostan','mall el bostan','opening','new branch','new cairo branch','mall launch','offer','discount'],
  'الإعداد الافتراضي لمتابعة المتاجر الجديدة في فرع المول الجديد.'
)
ON CONFLICT (branch_context) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('offer-media', 'offer-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Offer media is publicly readable"
ON storage.objects
FOR SELECT
USING (bucket_id = 'offer-media');

CREATE POLICY "Admins can upload offer media"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'offer-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update offer media"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'offer-media' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'offer-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete offer media"
ON storage.objects
FOR DELETE
USING (bucket_id = 'offer-media' AND public.has_role(auth.uid(), 'admin'));