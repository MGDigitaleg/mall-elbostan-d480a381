import { cn } from "@/lib/utils";
import logoImage from "@/assets/mol-al-bostan-wordmark.png";

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  subtitle?: string;
};

export function BrandLogo({ className, imageClassName, subtitle }: BrandLogoProps) {
  return (
    <div className={cn("flex flex-col items-start gap-1", className)}>
      <img
        src={logoImage}
        alt="شعار مول البستان"
        className={cn("h-10 w-auto object-contain", imageClassName)}
        loading="eager"
      />
      {subtitle ? <span className="text-[0.72rem] font-medium tracking-[0.08em] text-muted-foreground/90">{subtitle}</span> : null}
    </div>
  );
}