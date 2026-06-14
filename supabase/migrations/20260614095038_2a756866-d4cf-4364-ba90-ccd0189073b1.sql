UPDATE public.stores
SET
  whatsapp = NULLIF(regexp_replace(whatsapp, '[^0-9]', '', 'g'), ''),
  phone = NULLIF(regexp_replace(phone, '[^0-9+]', '', 'g'), '')
WHERE whatsapp ~ '[^0-9]' OR phone ~ '[^0-9+]';