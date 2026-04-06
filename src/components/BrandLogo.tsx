import { cn } from "@/lib/utils";
import logoDark from "@/assets/logo-brand-dark.png";
import logoWhite from "@/assets/logo-brand-white.png";

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  subtitle?: string;
  align?: "start" | "center";
  framed?: boolean;
  variant?: "dark" | "light";
};

export function BrandLogo({ className, imageClassName, subtitle, align = "start", framed = false, variant = "dark" }: BrandLogoProps) {
  const src = variant === "light" ? logoWhite : logoDark;

  return (
    <div className={cn("flex flex-col gap-0.5", align === "center" ? "items-center text-center" : "items-start text-right", className)}>
      {framed ? (
        <div className="brand-mark-frame logo-stage">
          <img
            src={src}
            alt="شعار مول البستان"
            className={cn("block h-auto w-auto object-contain", imageClassName)}
            loading="eager"
            draggable={false}
          />
        </div>
      ) : (
        <img
          src={src}
          alt="شعار مول البستان"
          className={cn("block h-auto w-auto object-contain", imageClassName)}
          loading="eager"
          draggable={false}
        />
      )}
      {subtitle ? <span className="text-[0.62rem] font-semibold tracking-[0.2em] text-muted-foreground uppercase">{subtitle}</span> : null}
    </div>
  );
}
