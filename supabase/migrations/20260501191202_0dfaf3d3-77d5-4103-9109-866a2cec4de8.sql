UPDATE public.campaign_settings
SET is_active = false,
    paused_title_ar = 'المسابقة غير مفعّلة حالياً',
    paused_message_ar = 'حملة "أدر واربح" متوقفة مؤقتاً. تابعنا على قنواتنا الرسمية لمعرفة موعد إعادة التفعيل.',
    updated_at = now()
WHERE key = 'spin_win';