import { cn } from "@/lib/utils";
import logoImage from "@/assets/mol-al-bostan-wordmark.png";

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  subtitle?: string;
  align?: "start" | "center";
};

export function BrandLogo({ className, imageClassName, subtitle, align = "start" }: BrandLogoProps) {
  return (
    <div className={cn("flex flex-col gap-2", align === "center" ? "items-center text-center" : "items-start text-right", className)}>
      <img
        src={logoImage}
        alt="شعار مول البستان"
        className={cn("h-12 w-auto object-contain md:h-14", imageClassName)}
        loading="eager"
      />
      {subtitle ? <span className="text-[0.72rem] font-medium tracking-[0.18em] text-muted-foreground/90 uppercase">{subtitle}</span> : null}
    </div>
  );
}