import { useEffect, useRef, useState } from "react";

export function SceneFinal() {
  const ref = useRef<HTMLElement>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setEntered(true); },
      { threshold: 0.4 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative z-10 flex min-h-[50vh] flex-col items-center justify-center px-6 py-16"
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute bottom-1/3 left-1/2 -translate-x-1/2 rounded-full"
        style={{
          width: 400,
          height: 400,
          background: "radial-gradient(circle, rgba(205,187,154,0.03), transparent 70%)",
        }}
      />

      <div className="max-w-lg text-center">
        <h2
          className="text-[1.4rem] md:text-[1.8rem] lg:text-[2.2rem] font-bold leading-[1.3] transition-all duration-[800ms]"
          style={{
            color: "#F8FAFC",
            opacity: entered ? 1 : 0,
            transform: entered ? "translateY(0)" : "translateY(14px)",
          }}
        >
          من البستان{" "}
          <span style={{ color: "#CDBB9A" }}>تعرف السوق.</span>
        </h2>

        <p
          className="mt-5 text-[0.82rem] md:text-[0.88rem] leading-[2] max-w-sm mx-auto transition-all duration-[800ms]"
          style={{
            color: "#94A3B8",
            opacity: entered ? 1 : 0,
            transform: entered ? "translateY(0)" : "translateY(10px)",
            transitionDelay: "0.3s",
          }}
        >
          واليوم تعرفه أسرع عبر دليل المحلات والخريطة والمنتجات.
        </p>
      </div>
    </section>
  );
}
