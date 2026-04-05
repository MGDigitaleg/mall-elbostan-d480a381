import { useEffect, useRef, useState } from "react";
import { Store, Map, ShoppingBag } from "lucide-react";

const lines = [
  { icon: Store, text: "دليل محلات أوضح" },
  { icon: Map, text: "خريطة تعرفك مكان كل وحدة" },
  { icon: ShoppingBag, text: "منتجات أقرب لقرار الشراء" },
];

export function SceneMeaning() {
  const ref = useRef<HTMLElement>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setEntered(true); },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative z-10 px-6 py-24 md:py-32"
    >
      {/* Divider */}
      <div
        className="mx-auto mb-16 h-px max-w-xs"
        style={{ background: "linear-gradient(90deg, transparent, #CDBB9A15, transparent)" }}
      />

      <div className="mx-auto max-w-lg text-center">
        {/* Transition statement */}
        <h2
          className="text-[1.2rem] md:text-[1.5rem] font-bold leading-[1.4] transition-all duration-[700ms]"
          style={{
            color: "#F1F5F9",
            opacity: entered ? 1 : 0,
            transform: entered ? "translateY(0)" : "translateY(14px)",
          }}
        >
          ما كان الناس يقولونه قديماً،
          <br />
          <span style={{ color: "#CDBB9A" }}>نقدمه اليوم بشكل أوضح.</span>
        </h2>

        {/* Three lines */}
        <div className="mt-12 space-y-5">
          {lines.map((line, i) => (
            <div
              key={i}
              className="flex items-center gap-4 justify-center transition-all duration-[600ms]"
              style={{
                opacity: entered ? 1 : 0,
                transform: entered ? "translateY(0)" : "translateY(12px)",
                transitionDelay: `${0.3 + i * 0.2}s`,
              }}
            >
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                style={{
                  background: "rgba(205,187,154,0.06)",
                  border: "1px solid rgba(205,187,154,0.1)",
                }}
              >
                <line.icon className="h-3.5 w-3.5" style={{ color: "#CDBB9A" }} />
              </div>
              <p
                className="text-[0.88rem] md:text-[0.95rem] font-medium"
                style={{ color: "#CBD5E1" }}
              >
                {line.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
