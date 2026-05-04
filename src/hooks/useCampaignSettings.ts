import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CampaignSettings {
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  headline_ar: string | null;
  headline_en: string | null;
  subtitle_ar: string | null;
  subtitle_en: string | null;
  description_ar: string | null;
  description_en: string | null;
  cta_label_ar: string | null;
  cta_label_en: string | null;
  paused_title_ar: string | null;
  paused_message_ar: string | null;
  languages: string[];
}

const DEFAULTS: CampaignSettings = {
  is_active: true,
  starts_at: null,
  ends_at: null,
  headline_ar: null,
  headline_en: null,
  subtitle_ar: null,
  subtitle_en: null,
  description_ar: null,
  description_en: null,
  cta_label_ar: null,
  cta_label_en: null,
  paused_title_ar: null,
  paused_message_ar: null,
  languages: ["ar-EG"],
};

export function useCampaignSettings(key: string = "spin_win") {
  return useQuery({
    queryKey: ["spin-win-campaign", key],
    queryFn: async (): Promise<CampaignSettings> => {
      const { data, error } = await supabase
        .from("campaign_settings")
        .select(
          "is_active, starts_at, ends_at, headline_ar, headline_en, subtitle_ar, subtitle_en, description_ar, description_en, cta_label_ar, cta_label_en, paused_title_ar, paused_message_ar, languages"
        )
        .eq("key", key)
        .maybeSingle();
      if (error) throw error;
      if (!data) return DEFAULTS;
      return { ...DEFAULTS, ...(data as Partial<CampaignSettings>) };
    },
    staleTime: 60_000,
  });
}
