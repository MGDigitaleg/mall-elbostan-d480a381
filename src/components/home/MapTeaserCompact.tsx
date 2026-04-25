import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mallFloors } from "@/lib/mallFloorGeometry";

/**
 * Compact homepage map teaser — directs users to the full /map page.
 * Replaces the heavier MapTeaserPreview on the homepage to reduce density,
 * since the interactive map has its own dedicated page.
 */
export function MapTeaserCompact() {
  const totalUnits = useMemo(
    () => mallFloors.reduce((sum, f) => sum + f.units.length, 0),
    [],
  );
  const availableCount = useMemo(
    () => mallFloors.reduce((sum, f) => sum + f.units.filter((u) => u.status === "available").length, 0),
    [],
  );
  const floorsCount = mallFloors.length;

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card dark:bg-secondary shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
      <div
        className="grid items-center gap-3 px-4 py-3.5 md:grid-cols-[auto_1fr_auto] md:gap-5 md:px-6 md:py-4"
        style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.04) 0%, transparent 70%)" }}
      >
        {/* Identity */}
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{ background: "hsl(var(--primary) / 0.1)", border: "1px solid hsl(var(--primary) / 0.18)" }}
          >
            <Compass className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="section-kicker mb-0" style={{ fontSize: 10 }}>الدليل التفاعلي</p>
            <h2 className="text-[0.9rem] md:text-[1rem] font-bold text-foreground leading-tight">
              خريطة المول كاملة بين يديك.
            </h2>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-1.5 md:gap-2 md:border-x md:border-border/50 md:px-4">
          {[
            { value: totalUnits, label: "وحدة" },
            { value: availableCount, label: "متاحة" },
            { value: floorsCount, label: "أدوار" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-md border border-border/50 bg-background/60 px-2 py-1.5 text-center">
              <p className="font-poppins text-[0.86rem] font-extrabold text-primary leading-none">{stat.value}</p>
              <p className="mt-0.5 text-[0.6rem] font-semibold text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link to="/map" className="md:justify-self-end">
          <Button variant="cta" className="h-9 w-full rounded-lg px-4 text-[0.76rem] font-bold gap-1.5 md:w-auto">
            افتح الخريطة <ArrowLeft className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
