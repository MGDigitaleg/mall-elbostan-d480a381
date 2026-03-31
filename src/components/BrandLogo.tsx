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
      {subtitle ? <span className="text-[0.7rem] font-medium text-muted-foreground">{subtitle}</span> : null}
    </div>
  );
}