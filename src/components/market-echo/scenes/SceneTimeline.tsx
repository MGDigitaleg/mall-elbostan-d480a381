import { useEffect, useRef, useState } from "react";

const milestones = [
  { year: "1990", label: "بداية الحضور" },
  { year: "", label: "سنوات المقارنة والثقة" },
  { year: "", label: "اتساع التخصصات" },
  { year: "", label: "الفرع الجديد" },
  { year: "2026", label: "الدليل الرقمي اليوم" },
];

export function SceneTimeline() {
  const ref = useRef<HTMLElement>(null);
  const [entered, setEntered] = useState(false);
  const [lineProgress, setLineProgress] = useState(0);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setEntered(true); },
      { threshold: 0.25 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!entered) return;
    let frame: number;
    const start = performance.now();
    const duration = 1800;
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      setLineProgress(progress);
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [entered]);

  return (
    <section
      ref={ref}
      className="relative z-10 px-6 py-20 md:py-28"
    >
      <div className="mx-auto max-w-xs">
        {/* Vertical line container */}
        <div className="relative pr-6">
          {/* Animated line */}
          <div
            className="absolute right-0 top-0 w-px"
            style={{
              height: `${lineProgress * 100}%`,
              background: "linear-gradient(to bottom, #2563EB40, #CDBB9A30, #2563EB20)",
              transition: "none",
            }}
          />

          {/* Milestones */}
          <div className="space-y-10">
            {milestones.map((m, i) => {
              const nodeProgress = i / (milestones.length - 1);
              const isRevealed = lineProgress >= nodeProgress;
              const isLast = i === milestones.length - 1;

              return (
                <div
                  key={i}
                  className="relative flex items-start gap-4 transition-all duration-[600ms]"
                  style={{
                    opacity: isRevealed ? 1 : 0,
                    transform: isRevealed ? "translateX(0)" : "translateX(-10px)",
                  }}
                >
                  {/* Dot */}
                  <div
                    className="absolute -right-6 top-1 h-2.5 w-2.5 -translate-x-1/2 rounded-full shrink-0"
                    style={{
                      background: isLast ? "#F97316" : "#2563EB",
                      boxShadow: isRevealed
                        ? isLast
                          ? "0 0 12px #F9731650"
                          : "0 0 10px #2563EB40"
                        : "none",
                    }}
                  />

                  <div>
                    {m.year && (
                      <span
                        className="text-[0.68rem] font-bold tracking-wider font-poppins"
                        style={{ color: isLast ? "#F97316" : "#60A5FA" }}
                      >
                        {m.year}
                      </span>
                    )}
                    <p
                      className="text-[0.88rem] font-bold leading-[1.6]"
                      style={{ color: "#E2E8F0" }}
                    >
                      {m.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
