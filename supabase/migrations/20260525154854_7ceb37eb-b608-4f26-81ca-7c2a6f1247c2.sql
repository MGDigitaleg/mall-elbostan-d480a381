-- Lock down admin-only SECURITY DEFINER functions to service_role + postgres only.
-- These all have internal has_role() checks too, but defense-in-depth: don't even
-- let anon/authenticated invoke them through PostgREST.

REVOKE EXECUTE ON FUNCTION public.admin_list_tables() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.admin_list_columns(text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.admin_list_policies(text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.admin_browse_table(text, integer) FROM PUBLIC, anon, authenticated;

-- Internal helpers — only triggers / service role should invoke these.
REVOKE EXECUTE ON FUNCTION public.notify_indexing_ping(jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.decrement_prize_stock(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.audit_trigger() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.trigger_ping_blog_post() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.trigger_ping_store() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.validate_store_lifecycle_status() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.create_social_offer_notification() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
