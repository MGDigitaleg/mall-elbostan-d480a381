
REVOKE EXECUTE ON FUNCTION public.notify_indexing_ping(jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.trigger_ping_blog_post() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.trigger_ping_store() FROM PUBLIC, anon, authenticated;
