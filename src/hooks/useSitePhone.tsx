import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { OFFICIAL_PHONE as FALLBACK_PHONE } from "@/lib/contactInfo";

interface SitePhoneCtx {
  phone: string;
  loading: boolean;
  refresh: () => Promise<void>;
}

const Ctx = createContext<SitePhoneCtx>({ phone: "", loading: true, refresh: async () => {} });

const STORAGE_KEY = "mall-bostan-official-phone";

export function SitePhoneProvider({ children }: { children: ReactNode }) {
  const [phone, setPhone] = useState<string>(() => {
    // Boot synchronously from cache so JSON-LD/footer render with the number on first paint
    if (typeof window === "undefined") return FALLBACK_PHONE.trim();
    return localStorage.getItem(STORAGE_KEY) ?? FALLBACK_PHONE.trim();
  });
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "official_phone")
      .maybeSingle();
    const v = (data?.value ?? "").trim();
    setPhone(v);
    if (typeof window !== "undefined") {
      if (v) localStorage.setItem(STORAGE_KEY, v);
      else localStorage.removeItem(STORAGE_KEY);
    }
    setLoading(false);
  };

  useEffect(() => {
    void refresh();
    // Live updates across tabs after admin saves
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setPhone(e.newValue ?? "");
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return <Ctx.Provider value={{ phone, loading, refresh }}>{children}</Ctx.Provider>;
}

export function useSitePhone() {
  return useContext(Ctx);
}
