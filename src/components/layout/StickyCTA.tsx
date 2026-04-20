import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

type Props = {
  label: string;
  to?: string;
  onClick?: () => void;
  hint?: string;
};

/**
 * Sticky bottom CTA for high-conversion pages on mobile.
 * Sits above the MobileBottomNav (offset by 64px).
 */
export function StickyCTA({ label, to, onClick, hint }: Props) {
  const button = (
    <Button
      variant="cta"
      onClick={onClick}
      className="h-12 w-full rounded-xl text-[0.88rem] font-bold shadow-lg shadow-primary/25"
    >
      {label}
    </Button>
  );

  return (
    <div
      data-sticky-cta="true"
      className="fixed right-0 left-0 z-30 md:hidden px-4"
      style={{
        bottom: "calc(56px + env(safe-area-inset-bottom))",
        paddingBottom: 8,
      }}
    >
      <div
        className="rounded-2xl p-3"
        style={{
          background: "hsl(var(--card) / 0.97)",
          border: "1px solid hsl(var(--border) / 0.6)",
          boxShadow: "0 -4px 16px hsl(218 72% 9% / 0.08)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        {hint && (
          <p
            className="mb-1.5 text-center text-[0.68rem] font-medium"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            {hint}
          </p>
        )}
        {to ? <Link to={to}>{button}</Link> : button}
      </div>
    </div>
  );
}
