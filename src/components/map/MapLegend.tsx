import { cn } from "@/lib/utils";
import type { MallUnitStatus } from "@/lib/mallFloorGeometry";

type Props = {
  /** When provided, the legend becomes interactive and toggles the status filter. */
  activeStatus?: "all" | MallUnitStatus;
  onStatusChange?: (status: "all" | MallUnitStatus) => void;
};

const items: { status: MallUnitStatus; fill: string; stroke: string; darkFill: string; darkStroke: string; label: string }[] = [
  { status: "occupied",    fill: "#E2DDD5", stroke: "#9B9488", darkFill: "#2A2826", darkStroke: "#6B6358", label: "مشغولة" },
  { status: "available",   fill: "#FDE4C4", stroke: "#E8740E", darkFill: "#2A1D0D", darkStroke: "#E8740E", label: "متاحة" },
  { status: "coming_soon", fill: "#C8E8F4", stroke: "#0A9AB8", darkFill: "#0D1F2A", darkStroke: "#0A9AB8", label: "قريباً" },
];

export function MapLegend({ activeStatus, onStatusChange }: Props = {}) {
  const interactive = typeof onStatusChange === "function";

  return (
    <div className="flex items-center gap-2 md:gap-2.5">
      {items.map((item) => {
        const isActive = activeStatus === item.status;
        const isDimmed = interactive && activeStatus && activeStatus !== "all" && !isActive;

        const swatch = (
          <>
            <span
              className="h-3 w-3 rounded dark:hidden"
              style={{ background: item.fill, border: `2px solid ${item.stroke}` }}
            />
            <span
              className="hidden h-3 w-3 rounded dark:block"
              style={{ background: item.darkFill, border: `2px solid ${item.darkStroke}` }}
            />
            <span className="text-[0.72rem] font-bold text-foreground">{item.label}</span>
          </>
        );

        if (!interactive) {
          return (
            <div key={item.label} className="flex items-center gap-1.5">
              {swatch}
            </div>
          );
        }

        return (
          <button
            key={item.label}
            type="button"
            onClick={() => onStatusChange!(isActive ? "all" : item.status)}
            aria-pressed={isActive}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-2.5 py-1 transition-all",
              isActive
                ? "border-primary/40 bg-primary/10 shadow-sm"
                : "border-border bg-background/60 hover:bg-muted/60",
              isDimmed && "opacity-50"
            )}
          >
            {swatch}
          </button>
        );
      })}
      {interactive && activeStatus && activeStatus !== "all" && (
        <button
          type="button"
          onClick={() => onStatusChange!("all")}
          className="rounded-full border border-border bg-background/60 px-2 py-1 text-[0.62rem] font-bold text-muted-foreground transition-colors hover:text-foreground"
        >
          إعادة
        </button>
      )}
    </div>
  );
}
