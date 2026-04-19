-- Campaign settings (singleton row)
CREATE TABLE public.campaign_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  paused_message_ar TEXT,
  paused_title_ar TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID
);

ALTER TABLE public.campaign_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Campaign settings are publicly readable"
ON public.campaign_settings FOR SELECT
USING (true);

CREATE POLICY "Only admins can manage campaign settings"
ON public.campaign_settings FOR ALL
USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_campaign_settings_updated_at
BEFORE UPDATE ON public.campaign_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.campaign_settings (key, is_active, paused_title_ar, paused_message_ar)
VALUES ('spin_win', true, 'الحملة قريباً', 'حملة "أدر واربح" غير مفعّلة حالياً. تابعنا على قنواتنا الرسمية لمعرفة موعد انطلاق الحملة.');