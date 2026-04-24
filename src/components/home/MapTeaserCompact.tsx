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
        className="grid items-center gap-5 px-5 py-5 md:grid-cols-[auto_1fr_auto] md:gap-6 md:px-7 md:py-6"
        style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.04) 0%, transparent 70%)" }}
      >
        {/* Identity */}
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl"
            style={{ background: "hsl(var(--primary) / 0.1)", border: "1px solid hsl(var(--primary) / 0.18)" }}
          >
            <Compass className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="section-kicker mb-0.5">الدليل التفاعلي</p>
            <h2 className="text-[1rem] md:text-[1.1rem] font-bold text-foreground leading-tight">
              خريطة المول كاملة بين يديك.
            </h2>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 md:gap-3 md:border-x md:border-border/50 md:px-5">
          {[
            { value: totalUnits, label: "وحدة" },
            { value: availableCount, label: "متاحة" },
            { value: floorsCount, label: "أدوار" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg border border-border/50 bg-background/60 px-2.5 py-2 text-center">
              <p className="font-poppins text-[1rem] font-extrabold text-primary leading-none">{stat.value}</p>
              <p className="mt-1 text-[0.66rem] font-semibold text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link to="/map" className="md:justify-self-end">
          <Button variant="cta" className="h-10 w-full rounded-xl px-5 text-[0.82rem] font-bold gap-1.5 md:w-auto">
            افتح الخريطة الكاملة <ArrowLeft className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
