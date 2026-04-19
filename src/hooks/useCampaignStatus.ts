import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CampaignStatus {
  is_active: boolean;
  paused_title_ar: string | null;
  paused_message_ar: string | null;
}

export function useCampaignStatus(key: string = "spin_win") {
  return useQuery({
    queryKey: ["campaign_settings", key],
    queryFn: async (): Promise<CampaignStatus> => {
      const { data, error } = await supabase
        .from("campaign_settings")
        .select("is_active, paused_title_ar, paused_message_ar")
        .eq("key", key)
        .maybeSingle();
      if (error) throw error;
      return data ?? { is_active: true, paused_title_ar: null, paused_message_ar: null };
    },
    staleTime: 30_000,
  });
}
