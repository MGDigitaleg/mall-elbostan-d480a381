import { Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { optimizeImageUrl } from "@/lib/imageUtils";

/**
 * TenantLogo — Unified logo display component for all tenant branding.
 * 
 * Rules enforced:
 * - object-contain: never crops or distorts logos
 * - Consistent padding inside the container
 * - White background container for logo visibility
 * - Explicit width/height to prevent CLS
 * - Optimized image delivery for Supabase Storage URLs
 * - Graceful fallback for missing logos:
 *   1. If `fallbackName` provided → shows initials on a themed background
 *   2. Otherwise → generic Store icon
 * - Supports size variants for different contexts
 */

export type TenantLogoSize = "xs" | "sm" | "md" | "lg" | "xl";

interface TenantLogoProps {
  /** Logo image URL (from DB logo_url or registry path) */
  src: string | null | undefined;
  /** Alt text — typically the store's Arabic name */
  alt: string;
  /** Fallback display name — used for initials when no logo */
  fallbackName?: string;
  /** Size variant */
  size?: TenantLogoSize;
  /** Additional class names for the outer container */
  className?: string;
  /** Whether to show on a dark context (adjusts container styling) */
  darkContext?: boolean;
  /** Rounded corners variant */
  rounded?: "md" | "lg" | "xl" | "2xl";
  /** Override loading behavior (default: lazy) */
  loading?: "lazy" | "eager";
}

const sizeConfig: Record<TenantLogoSize, { container: string; icon: string; padding: number; fontSize: string; px: number }> = {
  xs: { container: "h-8 w-8", icon: "h-3.5 w-3.5", padding: 2, fontSize: "0.55rem", px: 32 },
  sm: { container: "h-11 w-11", icon: "h-4 w-4", padding: 2, fontSize: "0.65rem", px: 44 },
  md: { container: "h-14 w-14", icon: "h-6 w-6", padding: 3, fontSize: "0.75rem", px: 56 },
  lg: { container: "h-20 w-20", icon: "h-8 w-8", padding: 4, fontSize: "0.95rem", px: 80 },
  xl: { container: "h-24 w-24", icon: "h-10 w-10", padding: 5, fontSize: "1.1rem", px: 96 },
};

const roundedMap: Record<string, string> = {
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
};

/** Generate up to 2 initials from an Arabic or English name */
function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2);
  return (words[0][0] + words[1][0]).toUpperCase();
}

/** Deterministic background color from name */
const FALLBACK_COLORS = [
  "hsl(220 70% 25%)",
  "hsl(200 65% 28%)",
  "hsl(250 55% 30%)",
  "hsl(180 50% 25%)",
  "hsl(340 45% 28%)",
  "hsl(160 50% 24%)",
  "hsl(30 55% 30%)",
  "hsl(270 45% 28%)",
];

function getColorForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
  }
  return FALLBACK_COLORS[Math.abs(hash) % FALLBACK_COLORS.length];
}

export function TenantLogo({
  src,
  alt,
  fallbackName,
  size = "md",
  className,
  darkContext = false,
  rounded = "xl",
  loading = "lazy",
}: TenantLogoProps) {
  const config = sizeConfig[size];
  const roundedClass = roundedMap[rounded] ?? "rounded-xl";
  const displayName = fallbackName || alt;

  // Has a valid logo source
  if (src) {
    const optimizedSrc = optimizeImageUrl(src, config.px);

    return (
      <div
        className={cn(
          "flex shrink-0 items-center justify-center overflow-hidden",
          "bg-white dark:bg-white/95",
          roundedClass,
          config.container,
          className
        )}
        style={{ padding: config.padding }}
      >
        <img
          src={optimizedSrc}
          alt={`شعار ${alt} — محل في مول البستان`}
          width={config.px}
          height={config.px}
          className="h-full w-full object-contain"
          loading={loading}
          decoding="async"
        />
      </div>
    );
  }

  // Fallback: name-based initials
  if (displayName && displayName !== "?") {
    return (
      <div
        className={cn(
          "flex shrink-0 items-center justify-center overflow-hidden select-none",
          roundedClass,
          config.container,
          className
        )}
        style={{
          background: getColorForName(displayName),
          padding: config.padding,
        }}
        role="img"
        aria-label={`شعار ${displayName} — محل في مول البستان`}
        title={displayName}
      >
        <span
          className="font-bold leading-none text-white/90"
          style={{
            fontSize: config.fontSize,
            fontFamily: "var(--font-arabic-display), sans-serif",
            letterSpacing: "-0.02em",
          }}
        >
          {getInitials(displayName)}
        </span>
      </div>
    );
  }

  // Final fallback: generic icon
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden",
        "bg-white dark:bg-white/95",
        roundedClass,
        config.container,
        className
      )}
      style={{ padding: config.padding }}
      role="img"
      aria-label="شعار محل في مول البستان"
    >
      <Store
        className={cn(
          config.icon,
          darkContext
            ? "text-[#5B9AFF]"
            : "text-muted-foreground/30"
        )}
      />
    </div>
  );
}
