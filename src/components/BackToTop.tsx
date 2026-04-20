import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

type Props = {
  threshold?: number;
};

/**
 * Floating "Back to top" button. Appears once user scrolls past `threshold` (px).
 * Positioned bottom-left to avoid clashing with right-aligned UI on RTL pages.
 */
export function BackToTop({ threshold = 600 }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return (
    <button
      type="button"
      aria-label="الرجوع لأعلى"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-20 left-6 md:bottom-6 z-40 flex h-11 w-11 items-center justify-center rounded-full shadow-lg backdrop-blur-md transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-2 pointer-events-none"
      }`}
      style={{ border: "1px solid #2563EB55", background: "#0B1220E6", color: "#60A5FA" }}
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
}
