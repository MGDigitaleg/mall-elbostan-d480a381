import { Link } from "react-router-dom";
import { ArrowLeft, Tag, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { trackOffersCtaClick } from "@/lib/analytics";

type CommonProps = {
  to: string;
  label: string;
  icon?: LucideIcon;
  className?: string;
  showArrow?: boolean;
  /** Where this CTA is rendered (e.g. "home_deals_teaser"). Used for analytics. */
  placement?: string;
};

/**
 * زر CTA رئيسي (برتقالي) لصفحات وأقسام عروض الافتتاح.
 * تصميم موحّد لإعادة الاستخدام عبر كل سكاشن العروض.
 */
export function OffersPrimaryCta({
  to,
  label,
  icon: Icon = Tag,
  className,
  showArrow = true,
  placement = "unknown",
}: CommonProps) {
  return (
    <Link
      to={to}
      className="inline-flex shrink-0"
      onClick={() => trackOffersCtaClick("primary", placement, to, label)}
    >
      <Button
        className={cn(
          "h-9 rounded-xl px-4 text-[0.76rem] font-bold gap-1.5 whitespace-nowrap",
          className,
        )}
        style={{
          background: "#F97316",
          color: "#FFFFFF",
          boxShadow: "0 8px 20px -8px rgba(249,115,22,0.55)",
        }}
      >
        <Icon className="h-3.5 w-3.5 shrink-0" />
        <span>{label}</span>
        {showArrow && <ArrowLeft className="h-3.5 w-3.5 shrink-0" />}
      </Button>
    </Link>
  );
}

/**
 * زر CTA ثانوي (شفاف) لصفحات وأقسام عروض الافتتاح.
 * يُفضّل إخفاؤه على الموبايل بتمرير hiddenOnMobile لتجنّب التكرار البصري.
 */
export function OffersSecondaryCta({
  to,
  label,
  className,
  showArrow = true,
  hiddenOnMobile = false,
  placement = "unknown",
}: CommonProps & { hiddenOnMobile?: boolean }) {
  return (
    <Link
      to={to}
      className={cn(
        "shrink-0",
        hiddenOnMobile ? "hidden lg:inline-flex" : "inline-flex",
      )}
      onClick={() => trackOffersCtaClick("secondary", placement, to, label)}
    >
      <Button
        variant="ghost"
        className={cn(
          "h-9 rounded-xl px-3 gap-1.5 text-[0.76rem] font-bold whitespace-nowrap hover:bg-white/[0.06]",
          className,
        )}
        style={{ color: "#93C5FD" }}
      >
        <span>{label}</span>
        {showArrow && <ArrowLeft className="h-3.5 w-3.5 shrink-0" />}
      </Button>
    </Link>
  );
}

/**
 * حاوية موحّدة لأزرار CTA في RTL مع منع الالتفاف والقصّ.
 */
export function OffersCtaGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      dir="rtl"
      className={cn(
        "flex flex-row flex-nowrap items-center gap-2 sm:gap-2.5",
        className,
      )}
    >
      {children}
    </div>
  );
}
