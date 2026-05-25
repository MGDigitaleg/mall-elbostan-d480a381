import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface MerchantStore {
  id: string;
  slug: string;
  name_ar: string;
  name_en: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  status: string;
  lifecycle_status: string;
  short_description_ar: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  website: string | null;
  opening_hours: string | null;
  external_store_type: string;
  external_store_url: string | null;
  external_store_handle: string | null;
  sync_status: string;
  gallery: any;
  category: string | null;
  floor_label: string | null;
  unit_label: string | null;
  branch_context: string | null;
  featured: boolean;
}

interface MerchantState {
  loading: boolean;
  user: ReturnType<typeof useAuth>["user"];
  stores: MerchantStore[];
  activeStore: MerchantStore | null;
  setActiveStoreId: (id: string) => void;
  isStoreManager: boolean;
  isAdmin: boolean;
  refetch: () => Promise<void>;
}

export function useMerchant(): MerchantState {
  const { user, loading: authLoading, roles, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stores, setStores] = useState<MerchantStore[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const isStoreManager = roles.includes("store_manager" as any);

  const load = async () => {
    if (!user) {
      setStores([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    // Load store assignments
    const { data: links } = await supabase
      .from("store_managers" as any)
      .select("store_id, is_primary")
      .eq("user_id", user.id);

    const ids = ((links ?? []) as any[]).map((l) => l.store_id);
    if (ids.length === 0) {
      setStores([]);
      setLoading(false);
      return;
    }

    const { data: rows } = await supabase
      .from("stores")
      .select(
        "id,slug,name_ar,name_en,logo_url,cover_image_url,status,lifecycle_status,short_description_ar,phone,whatsapp,email,website,opening_hours,external_store_type,external_store_url,external_store_handle,sync_status,gallery,category,floor_label,unit_label,branch_context,featured"
      )
      .in("id", ids);

    const list = (rows ?? []) as unknown as MerchantStore[];
    setStores(list);
    const primary = (links as any[])?.find((l) => l.is_primary)?.store_id;
    setActiveId((prev) => prev ?? primary ?? list[0]?.id ?? null);
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading) void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user?.id]);

  const activeStore = stores.find((s) => s.id === activeId) ?? null;

  return {
    loading: authLoading || loading,
    user,
    stores,
    activeStore,
    setActiveStoreId: setActiveId,
    isStoreManager,
    isAdmin,
    refetch: load,
  };
}

export function useRequireMerchant() {
  const m = useMerchant();
  const navigate = useNavigate();

  useEffect(() => {
    if (m.loading) return;
    if (!m.user) {
      navigate("/admin/login");
      return;
    }
    // Admins are allowed to preview; store managers must have a store
    if (!m.isAdmin && !m.isStoreManager) {
      navigate("/admin/login");
      return;
    }
    if (m.isStoreManager && m.stores.length === 0 && !m.isAdmin) {
      // No store assigned — still render shell, page handles empty state
    }
  }, [m.loading, m.user, m.isAdmin, m.isStoreManager, m.stores.length, navigate]);

  return m;
}
