
-- Store webhook secret + project URL in a settings function for trigger use
CREATE OR REPLACE FUNCTION public.notify_indexing_ping(_urls jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  webhook_secret text;
  function_url text := 'https://wrheltmgquyqqhscrpds.supabase.co/functions/v1/ping-indexing';
BEGIN
  -- Read secret from vault if available, else from custom GUC
  BEGIN
    SELECT decrypted_secret INTO webhook_secret
    FROM vault.decrypted_secrets
    WHERE name = 'INDEXING_WEBHOOK_SECRET'
    LIMIT 1;
  EXCEPTION WHEN OTHERS THEN
    webhook_secret := NULL;
  END;

  IF webhook_secret IS NULL THEN
    RAISE NOTICE 'INDEXING_WEBHOOK_SECRET not found in vault, skipping ping';
    RETURN;
  END IF;

  PERFORM net.http_post(
    url := function_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'X-Webhook-Secret', webhook_secret
    ),
    body := jsonb_build_object('urls', _urls)
  );
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'ping-indexing call failed: %', SQLERRM;
END;
$$;

-- Trigger function for blog_posts
CREATE OR REPLACE FUNCTION public.trigger_ping_blog_post()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.published_at IS NOT NULL AND NEW.published_at <= now() THEN
    PERFORM public.notify_indexing_ping(
      jsonb_build_array('https://www.mallelbostan.com/blog/' || NEW.slug)
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger function for stores
CREATE OR REPLACE FUNCTION public.trigger_ping_store()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'published' THEN
    PERFORM public.notify_indexing_ping(
      jsonb_build_array('https://www.mallelbostan.com/stores/' || NEW.slug)
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS ping_indexing_on_blog_post ON public.blog_posts;
CREATE TRIGGER ping_indexing_on_blog_post
AFTER INSERT OR UPDATE OF published_at, slug, title_ar, content_ar
ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.trigger_ping_blog_post();

DROP TRIGGER IF EXISTS ping_indexing_on_store ON public.stores;
CREATE TRIGGER ping_indexing_on_store
AFTER INSERT OR UPDATE OF status, slug, name_ar, long_description_ar
ON public.stores
FOR EACH ROW
EXECUTE FUNCTION public.trigger_ping_store();

-- Store the secret in vault for the trigger to read
SELECT vault.create_secret('PLACEHOLDER_WILL_BE_REPLACED', 'INDEXING_WEBHOOK_SECRET', 'Webhook secret for ping-indexing edge function')
WHERE NOT EXISTS (SELECT 1 FROM vault.secrets WHERE name = 'INDEXING_WEBHOOK_SECRET');
