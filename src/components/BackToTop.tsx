import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

type Props = {
  threshold?: number;
};

/**
 * Floating "Back to top" button. Appears once user scrolls past `threshold` (px).
 * Positioned bottom-left to avoid clashing with right-aligned UI on RTL pages.
 * On mobile, automatically lifts above any StickyCTA card to prevent overlap.
 */
export function BackToTop({ threshold = 600 }: Props) {
  const [visible, setVisible] = useState(false);
  const [stickyOffset, setStickyOffset] = useState<number | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  // Detect StickyCTA presence on mobile and measure its height dynamically.
  useEffect(() => {
    if (!isMobile) {
      setStickyOffset(null);
      return;
    }

    const measure = () => {
      const el = document.querySelector<HTMLElement>("[data-sticky-cta]");
      if (!el) {
        setStickyOffset(null);
        return;
      }
      // StickyCTA is already positioned 56px above viewport bottom (above MobileBottomNav).
      // Lift BackToTop above the CTA card with a 12px gap.
      const h = el.getBoundingClientRect().height;
      setStickyOffset(Math.round(h + 48 + 12));
    };

    measure();

    const observer = new MutationObserver(measure);
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [isMobile]);

  // Mobile: clear the bottom nav (~56px) + safe-area, or sit above StickyCTA when present.
  // Desktop: comfortable margin.
  const bottom = isMobile
    ? stickyOffset !== null
      ? `calc(${stickyOffset}px + env(safe-area-inset-bottom))`
      : "calc(72px + env(safe-area-inset-bottom))"
    : "24px";

  return (
    <button
      type="button"
      aria-label="الرجوع لأعلى"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed left-4 md:left-6 z-40 flex h-11 w-11 items-center justify-center rounded-full shadow-lg backdrop-blur-md transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-2 pointer-events-none"
      }`}
      style={{
        bottom,
        border: "1px solid #2563EB55",
        background: "#0B1220E6",
        color: "#60A5FA",
      }}
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
}
