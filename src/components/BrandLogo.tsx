import { cn } from "@/lib/utils";
import logoImage from "@/assets/mol-al-bostan-wordmark.png";

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  subtitle?: string;
  align?: "start" | "center";
  framed?: boolean;
};

export function BrandLogo({ className, imageClassName, subtitle, align = "start", framed = false }: BrandLogoProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", align === "center" ? "items-center text-center" : "items-start text-right", className)}>
      <div className={cn(framed && "brand-mark-frame logo-stage")}>
        <img
          src={logoImage}
          alt="شعار مول البستان"
          className={cn("h-[4.3rem] w-auto object-contain md:h-[4.9rem]", imageClassName)}
          loading="eager"
        />
      </div>
      {subtitle ? <span className="text-[0.62rem] font-semibold tracking-[0.2em] text-muted-foreground uppercase">{subtitle}</span> : null}
    </div>
  );
}