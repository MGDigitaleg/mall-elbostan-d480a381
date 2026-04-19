import { useEffect, useMemo, useState } from "react";
import { mallFloors, type MallFloorId } from "@/lib/mallFloorGeometry";
import { supabase } from "@/integrations/supabase/client";
import { optimizeImageUrl } from "@/lib/imageUtils";
import { Store as StoreIcon } from "lucide-react";

type Props = {
  floorId: MallFloorId;
  innerSize: number; // diameter of the inner wheel in px
  ringThickness?: number; // px
};

type StoreRow = {
  unit_code: string | null;
  name_ar: string;
  logo_url: string | null;
};

const FLOOR_PREFIX: Record<MallFloorId, string> = {
  ground: "G-",
  first: "F-",
  second: "S-",
};

/**
 * Decorative outer ring — uses real tenant logos (logo_url) joined by unit_code.
 * Falls back to the Arabic name initial if no logo. Stores remain context, not prizes.
 */
export function StoreRing({ floorId, innerSize, ringThickness = 92 }: Props) {
  const floor = useMemo(() => mallFloors.find((f) => f.id === floorId), [floorId]);
  const geometryUnits = floor?.units ?? [];
  const [storeMap, setStoreMap] = useState<Record<string, StoreRow>>({});

  useEffect(() => {
    let cancelled = false;
    const prefix = FLOOR_PREFIX[floorId];
    (async () => {
      const { data } = await supabase
        .from("stores")
        .select("unit_code, name_ar, logo_url")
        .eq("status", "leased")
        .ilike("unit_code", `${prefix}%`);
      if (cancelled || !data) return;
      const map: Record<string, StoreRow> = {};
      data.forEach((s) => {
        if (s.unit_code) map[s.unit_code] = s as StoreRow;
      });
      setStoreMap(map);
    })();
    return () => {
      cancelled = true;
    };
  }, [floorId]);

  const total = innerSize + ringThickness * 2;
  const center = total / 2;
  const trackRadius = innerSize / 2 + ringThickness / 2;

  // Prefer geometry units that have a matching real store, then fill with the rest.
  const enriched = geometryUnits.map((u) => ({
    geo: u,
    store: storeMap[u.code] ?? null,
  }));
  const withStore = enriched.filter((e) => e.store);
  const fallback = enriched.filter((e) => !e.store);
  const visible = [...withStore, ...fallback].slice(0, 14);
  const count = Math.max(visible.length, 1);
  const angleStep = 360 / count;

  return (
    <div
      className="relative mx-auto"
      style={{ width: total, height: total }}
      aria-hidden="true"
    >
      {/* Subtle dashed track */}
      <svg
        width={total}
        height={total}
        className="absolute inset-0"
        viewBox={`0 0 ${total} ${total}`}
      >
        <circle
          cx={center}
          cy={center}
          r={trackRadius}
          fill="none"
          stroke="hsl(var(--primary) / 0.18)"
          strokeWidth={1}
          strokeDasharray="4 6"
        />
      </svg>

      {/* Tenant badges */}
      {visible.map(({ geo, store }, i) => {
        const angle = (i * angleStep - 90) * (Math.PI / 180);
        const x = center + trackRadius * Math.cos(angle);
        const y = center + trackRadius * Math.sin(angle);
        const displayName = store?.name_ar ?? geo.name;
        const logo = store?.logo_url ?? null;
        const initial = (displayName || geo.code).trim().charAt(0);

        return (
          <div
            key={geo.id}
            className="absolute flex flex-col items-center gap-1"
            style={{
              left: x,
              top: y,
              transform: "translate(-50%, -50%)",
              width: 64,
            }}
            title={displayName}
          >
            <div className="h-9 w-9 rounded-full bg-card border border-border shadow-sm flex items-center justify-center overflow-hidden">
              {logo ? (
                <img
                  src={optimizeImageUrl(logo, { width: 64, quality: 85 })}
                  alt={displayName}
                  className="h-full w-full object-contain p-0.5"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : store ? (
                <span className="text-[10px] font-extrabold text-foreground/85">{initial}</span>
              ) : (
                <StoreIcon className="h-3.5 w-3.5 text-muted-foreground/60" />
              )}
            </div>
            <span className="text-[9px] font-semibold text-muted-foreground text-center leading-tight line-clamp-1 max-w-[64px]">
              {displayName}
            </span>
          </div>
        );
      })}
    </div>
  );
}
