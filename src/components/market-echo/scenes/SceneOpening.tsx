import { useEffect, useRef, useState } from "react";

export function SceneOpening() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6"
    >
      {/* Label */}
      <div
        className="absolute top-8 right-8 flex items-center gap-3 transition-all duration-[800ms]"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(-8px)",
        }}
      >
        <div
          className="h-px w-8"
          style={{ background: "linear-gradient(to left, #CDBB9A30, transparent)" }}
        />
        <span
          className="text-[0.6rem] font-bold tracking-[0.2em] uppercase"
          style={{ color: "#CDBB9A" }}
        >
          صدى السوق
        </span>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-[900ms]"
        style={{ opacity: visible ? 0.3 : 0 }}
      >
        <div className="h-8 w-px echo-scroll-line" style={{ background: "linear-gradient(to bottom, #CDBB9A40, transparent)" }} />
      </div>
    </section>
  );
}
