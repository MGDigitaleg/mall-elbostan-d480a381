import { cn } from "@/lib/utils";
import logoImage from "@/assets/logo-header.svg";
import logoWhite from "@/assets/logo-white.svg";

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  subtitle?: string;
  align?: "start" | "center";
  framed?: boolean;
  variant?: "dark" | "light";
};

export function BrandLogo({ className, imageClassName, subtitle, align = "start", framed = false, variant = "dark" }: BrandLogoProps) {
  const src = variant === "light" ? logoWhite : logoImage;

  return (
    <div className={cn("flex flex-col gap-0.5", align === "center" ? "items-center text-center" : "items-start text-right", className)}>
      <div className={cn(framed && "brand-mark-frame logo-stage")}>
        <img
          src={src}
          alt="شعار مول البستان"
          width={176}
          height={66}
          className={cn("block h-[3.7rem] w-auto max-w-full object-contain md:h-[4.1rem]", imageClassName)}
          loading="eager"
        />
      </div>
      {subtitle ? <span className="text-[0.62rem] font-semibold tracking-[0.2em] text-muted-foreground uppercase">{subtitle}</span> : null}
    </div>
  );
}
