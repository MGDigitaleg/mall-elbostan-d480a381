import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Tag, Store, ArrowUpLeft, X, MapPin } from "lucide-react";
import { TenantLogo } from "@/components/TenantLogo";
import type { MallUnit, MallUnitStatus } from "@/lib/mallFloorGeometry";
import { categoryLabelsAr, floorLabelsAr, statusLabelsAr } from "@/lib/mallFloorGeometry";
import { UNIT_TENANT_LOGOS, UNIT_TENANT_NAMES, UNIT_TENANT_SLUGS } from "@/lib/tenantMapLookup";

type Props = {
  unit: MallUnit | null;
  onClose: () => void;
  /** Optional: opens the full details panel/sidebar (e.g. scroll into view) */
  onExpand?: () => void;
};

const statusDot: Record<MallUnitStatus, string> = {
  occupied: "bg-emerald-500",
  available: "bg-orange",
  coming_soon: "bg-cyan-500",
};

/**
 * Floating quick preview panel anchored to the bottom of the map container.
 * Shows unit/store identity, floor, category, status, and quick contact actions
 * without leaving the map context.
 */
export function MapQuickPreview({ unit, onClose, onExpand }: Props) {
  return (
    <AnimatePresence>
      {unit && (
        <motion.div
          key={unit.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute inset-x-2 bottom-2 z-20 mx-auto flex justify-center md:inset-x-auto md:bottom-3 md:left-1/2 md:-translate-x-1/2"
        >
          <div className="pointer-events-auto w-full max-w-[460px] rounded-2xl border border-border bg-card/95 p-3 shadow-lg backdrop-blur-md md:p-3.5">
            {(() => {
              const tenantSlug = UNIT_TENANT_SLUGS[unit.id];
              const tenantName = UNIT_TENANT_NAMES[unit.id];
              const tenantLogo = UNIT_TENANT_LOGOS[unit.id];
              const isOccupied = unit.status === "occupied";
              const storeHref = tenantSlug ? `/stores/${tenantSlug}` : "/stores";
              const displayName = (isOccupied && tenantName) || unit.code;

              return (
                <div className="flex items-start gap-3">
                  {/* Logo / placeholder */}
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border bg-muted/40">
                    {isOccupied && tenantLogo ? (
                      <TenantLogo
                        src={tenantLogo}
                        alt={tenantName ?? unit.code}
                        fallbackName={tenantName ?? undefined}
                        className="h-full w-full"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card ${statusDot[unit.status]}`}
                      aria-label={statusLabelsAr[unit.status]}
                    />
                  </div>

                  {/* Identity + meta */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-[0.92rem] font-bold leading-tight text-foreground">
                          {displayName}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-1">
                          <span className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/40 px-1.5 py-0.5 text-[0.6rem] font-semibold text-foreground/80">
                            <Building2 className="h-2.5 w-2.5" />
                            {floorLabelsAr[unit.floor]}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/40 px-1.5 py-0.5 text-[0.6rem] font-semibold text-foreground/80">
                            <Tag className="h-2.5 w-2.5" />
                            {categoryLabelsAr[unit.category]}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/30 px-1.5 py-0.5 text-[0.6rem] font-semibold text-muted-foreground">
                            {unit.code}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={onClose}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
                        aria-label="إغلاق المعاينة"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="mt-2.5 flex items-center gap-1.5">
                      {isOccupied ? (
                        <Link
                          to={storeHref}
                          className="flex h-8 flex-1 items-center justify-center gap-1 rounded-lg bg-primary px-2.5 text-[0.72rem] font-bold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
                        >
                          <Store className="h-3 w-3" />
                          صفحة المتجر
                        </Link>
                      ) : unit.status === "available" ? (
                        <Link
                          to="/leasing"
                          className="flex h-8 flex-1 items-center justify-center gap-1 rounded-lg bg-orange px-2.5 text-[0.72rem] font-bold text-white shadow-sm transition-opacity hover:opacity-90"
                        >
                          استفسر عن الوحدة
                        </Link>
                      ) : (
                        <span className="flex h-8 flex-1 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 px-2.5 text-[0.72rem] font-semibold text-muted-foreground">
                          قريباً
                        </span>
                      )}
                      {onExpand && (
                        <button
                          onClick={onExpand}
                          className="flex h-8 items-center justify-center gap-1 rounded-lg border border-border bg-background px-2.5 text-[0.7rem] font-bold text-foreground transition-colors hover:bg-muted/40"
                          aria-label="عرض كل التفاصيل"
                        >
                          <ArrowUpLeft className="h-3 w-3" />
                          التفاصيل
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
