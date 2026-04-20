import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/**
 * Lightweight CSS-based reveal-on-scroll wrapper.
 * Replaces framer-motion `motion.div` reveal animations to reduce JS bundle.
 * Uses IntersectionObserver + CSS opacity/translate transition.
 */
type Props = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Margin (in px) for IO rootMargin. Negative pulls trigger inwards. */
  rootMargin?: string;
  /** Delay in ms before transition starts. */
  delay?: number;
  /** Initial Y offset in px. */
  offset?: number;
  as?: "div" | "section" | "article";
};

export function Reveal({
  children,
  className = "",
  style,
  rootMargin = "-60px",
  delay = 0,
  offset = 14,
  as: Tag = "div",
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Respect reduced motion: show immediately.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  const mergedStyle: CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : `translateY(${offset}px)`,
    transition: `opacity 450ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 450ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
    willChange: visible ? undefined : "opacity, transform",
    ...style,
  };

  return (
    <Tag ref={ref as never} className={className} style={mergedStyle}>
      {children}
    </Tag>
  );
}
