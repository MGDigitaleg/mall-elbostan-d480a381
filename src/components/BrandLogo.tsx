import { cn } from "@/lib/utils";
import logoDark from "@/assets/logo-brand-dark.webp";
import logoWhite from "@/assets/logo-brand-white-sm.webp";

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  subtitle?: string;
  align?: "start" | "center";
  framed?: boolean;
  variant?: "dark" | "light";
  /** true = above-the-fold (eager + high priority); false = lazy */
  priority?: boolean;
};

export function BrandLogo({ className, imageClassName, subtitle, align = "start", framed = false, variant = "dark", priority = true }: BrandLogoProps) {
  const src = variant === "light" ? logoWhite : logoDark;

  const imgProps = {
    src,
    alt: "شعار مول البستان",
    width: 600,
    height: 349,
    loading: (priority ? "eager" : "lazy") as "eager" | "lazy",
    decoding: (priority ? "sync" : "async") as "sync" | "async",
    fetchPriority: (priority ? "high" : "auto") as "high" | "auto",
    draggable: false,
    className: cn("block h-auto w-auto object-contain", imageClassName),
  };

  return (
    <div className={cn("flex flex-col gap-0.5", align === "center" ? "items-center text-center" : "items-start text-right", className)}>
      {framed ? (
        <div className="brand-mark-frame logo-stage">
          <img {...imgProps} />
        </div>
      ) : (
        <img {...imgProps} />
      )}
      {subtitle ? <span className="text-[0.62rem] font-semibold tracking-[0.2em] text-muted-foreground uppercase">{subtitle}</span> : null}
    </div>
  );
}
