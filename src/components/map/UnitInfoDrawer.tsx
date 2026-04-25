import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, Navigation, Tag, X } from "lucide-react";
import { TenantLogo } from "@/components/TenantLogo";
import { cn } from "@/lib/utils";
import type { MallUnit, MallUnitStatus } from "@/lib/mallFloorGeometry";
import { floorLabelsAr, statusLabelsAr } from "@/lib/mallFloorGeometry";
import {
  UNIT_TENANT_LOGOS,
  UNIT_TENANT_NAMES,
  UNIT_TENANT_SLUGS,
} from "@/lib/tenantMapLookup";

type Props = {
  unit: MallUnit | null;
  /** Map of store slug → number of currently live opening offers. */
  offersBySlug?: Record<string, number>;
  /** Clears the active selection and (visually) returns the map to overview. */
  onClear: () => void;
  /** Optional CTA: scrolls/opens the full details surface (sticky card / mobile sheet). */
  onViewDetails?: () => void;
  className?: string;
};

const STATUS_TONE: Record<
  MallUnitStatus,
  { dot: string; chipBg: string; chipText: string; border: string }
> = {
  occupied: {
    dot: "bg-emerald-500",
    chipBg: "bg-emerald-500/10",
    chipText: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-500/25",
  },
  available: {
    dot: "bg-orange",
    chipBg: "bg-orange/10",
    chipText: "text-orange dark:text-orange-foreground",
    border: "border-orange/25",
  },
  coming_soon: {
    dot: "bg-cyan-500",
    chipBg: "bg-cyan-500/10",
    chipText: "text-cyan-700 dark:text-cyan-400",
    border: "border-cyan-500/25",
  },
};

/**
 * Compact, slide-up unit info bar that anchors to the bottom of the map.
 * Shows the unit's name, status, and opening-offers count, plus a clear button
 * to deselect the unit and visually return to the overview.
 *
 * Designed to be lightweight: it does not duplicate the full UnitDetailsCard.
 * For full details, the consumer can pass `onViewDetails` to scroll/open the
 * existing details surface.
 */
export function UnitInfoDrawer({
  unit,
  offersBySlug,
  onClear,
  onViewDetails,
  className,
}: Props) {
  return (
    <AnimatePresence>
      {unit && (
        <motion.div
          key={unit.id}
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          dir="rtl"
          role="region"
          aria-label={`معلومات الوحدة ${unit.code}`}
          className={cn(
            "absolute bottom-3 start-3 end-3 z-20 mx-auto max-w-[640px] rounded-2xl border border-border bg-card/95 backdrop-blur-md shadow-[0_12px_32px_rgba(0,0,0,0.18)]",
            className,
          )}
        >
          <UnitInfoBody
            unit={unit}
            offersBySlug={offersBySlug}
            onClear={onClear}
            onViewDetails={onViewDetails}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function UnitInfoBody({
  unit,
  offersBySlug,
  onClear,
  onViewDetails,
}: {
  unit: MallUnit;
  offersBySlug?: Record<string, number>;
  onClear: () => void;
  onViewDetails?: () => void;
}) {
  const tenantName = UNIT_TENANT_NAMES[unit.id];
  const tenantLogo = UNIT_TENANT_LOGOS[unit.id];
  const tenantSlug = UNIT_TENANT_SLUGS[unit.id];
  const tone = STATUS_TONE[unit.status];

  const isOccupied = unit.status === "occupied" && tenantName;
  const displayName = isOccupied
    ? tenantName
    : unit.status === "available"
      ? "وحدة متاحة للإيجار"
      : "وحدة قريباً";

  const offersCount = tenantSlug ? offersBySlug?.[tenantSlug] ?? 0 : 0;

  return (
    <div className="flex items-center gap-2.5 p-2.5 sm:p-3">
      {/* Logo / status indicator */}
      {tenantLogo ? (
        <TenantLogo
          src={tenantLogo}
          alt={tenantName ?? unit.code}
          size="sm"
          rounded="lg"
          className="shrink-0"
        />
      ) : (
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border bg-background",
            tone.border,
          )}
          aria-hidden="true"
        >
          <MapPin className={cn("h-5 w-5", tone.chipText)} />
        </div>
      )}

      {/* Name + meta */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="truncate text-[0.86rem] font-bold text-foreground">{displayName}</p>
          <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-[0.62rem] font-semibold text-muted-foreground">
            {unit.code}
          </span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[0.7rem]">
          {/* Status pill */}
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 font-semibold",
              tone.chipBg,
              tone.chipText,
              tone.border,
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", tone.dot)} />
            {statusLabelsAr[unit.status]}
          </span>
          {/* Floor */}
          <span className="text-muted-foreground">{floorLabelsAr[unit.floor]}</span>
          {/* Offers count */}
          {isOccupied && tenantSlug && (
            <Link
              to={`/daily-deals?merchant=${tenantSlug}`}
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 font-semibold transition-colors",
                offersCount > 0
                  ? "border-primary/30 bg-primary/10 text-primary hover:bg-primary/15"
                  : "border-border bg-muted text-muted-foreground pointer-events-none opacity-70",
              )}
              aria-label={
                offersCount > 0
                  ? `عرض ${offersCount} عروض في ${tenantName}`
                  : "لا توجد عروض حالياً"
              }
            >
              <Tag className="h-3 w-3" />
              {offersCount > 0 ? `${offersCount} ${offersCount === 1 ? "عرض" : "عروض"}` : "لا عروض"}
            </Link>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1.5">
        {isOccupied && tenantSlug && (
          <Link
            to={`/stores/${tenantSlug}`}
            className="hidden h-8 items-center gap-1 rounded-lg border border-border bg-background px-2.5 text-[0.72rem] font-bold text-foreground transition-colors hover:border-primary/40 hover:text-primary sm:inline-flex"
          >
            صفحة المتجر
            <ArrowLeft className="h-3 w-3" />
          </Link>
        )}
        {onViewDetails && (
          <button
            type="button"
            onClick={onViewDetails}
            className="inline-flex h-8 items-center rounded-lg bg-primary px-2.5 text-[0.72rem] font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            تفاصيل
          </button>
        )}
        <button
          type="button"
          onClick={onClear}
          aria-label="إلغاء الاختيار والعودة إلى نظرة عامة"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:border-orange/40 hover:text-orange"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
