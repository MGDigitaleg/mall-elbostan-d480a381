import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Returns a map of `store slug → number of currently live opening offers`.
 * Used by the map's compact unit info drawer to surface offer counts per unit
 * (units are linked to slugs via `UNIT_TENANT_SLUGS`).
 *
 * The query is intentionally lightweight (slug-only projection) and cached by
 * react-query so multiple consumers on the same page share one network call.
 */
export function useUnitOffersCount() {
  return useQuery({
    queryKey: ["unit-offers-count", "opening-offers-2026"],
    staleTime: 5 * 60 * 1000,
    queryFn: async (): Promise<Record<string, number>> => {
      const { data, error } = await supabase
        .from("deals")
        .select("stores:store_id(slug)")
        .eq("is_live", true)
        .eq("campaign_key", "opening-offers-2026");

      if (error || !data) return {};

      const counts: Record<string, number> = {};
      for (const row of data as Array<{ stores: { slug: string | null } | null }>) {
        const slug = row.stores?.slug;
        if (!slug) continue;
        counts[slug] = (counts[slug] ?? 0) + 1;
      }
      return counts;
    },
  });
}
