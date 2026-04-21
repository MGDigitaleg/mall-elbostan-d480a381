import { Store } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * TenantLogo — Unified logo display component for all tenant branding.
 * 
 * Rules enforced:
 * - object-contain: never crops or distorts logos
 * - Consistent padding inside the container
 * - White background container for logo visibility
 * - Graceful fallback for missing logos (Store icon)
 * - Supports size variants for different contexts
 */

export type TenantLogoSize = "xs" | "sm" | "md" | "lg" | "xl";

interface TenantLogoProps {
  /** Logo image URL (from DB logo_url or registry path) */
  src: string | null | undefined;
  /** Alt text — typically the store's Arabic name */
  alt: string;
  /** Size variant */
  size?: TenantLogoSize;
  /** Additional class names for the outer container */
  className?: string;
  /** Whether to show on a dark context (adjusts container styling) */
  darkContext?: boolean;
  /** Rounded corners variant */
  rounded?: "md" | "lg" | "xl" | "2xl";
}

const sizeConfig: Record<TenantLogoSize, { container: string; icon: string; padding: number }> = {
  xs: { container: "h-8 w-8", icon: "h-3.5 w-3.5", padding: 2 },
  sm: { container: "h-10 w-10", icon: "h-4 w-4", padding: 2 },
  md: { container: "h-14 w-14", icon: "h-6 w-6", padding: 3 },
  lg: { container: "h-20 w-20", icon: "h-8 w-8", padding: 4 },
  xl: { container: "h-24 w-24", icon: "h-10 w-10", padding: 5 },
};

const roundedMap: Record<string, string> = {
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
};

export function TenantLogo({
  src,
  alt,
  size = "md",
  className,
  darkContext = false,
  rounded = "xl",
}: TenantLogoProps) {
  const config = sizeConfig[size];
  const roundedClass = roundedMap[rounded] ?? "rounded-xl";

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
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-contain"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <Store
          className={cn(
            config.icon,
            darkContext
              ? "text-[#5B9AFF]"
              : "text-muted-foreground/30"
          )}
        />
      )}
    </div>
  );
}
