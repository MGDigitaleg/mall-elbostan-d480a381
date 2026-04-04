import { useEffect, useRef, useState } from "react";

const echoes = [
  { text: "لفّ البستان الأول", x: "8%", y: "15%", size: "2.4rem", delay: 0 },
  { text: "اسأل في البستان", x: "52%", y: "45%", size: "2rem", delay: 1.2 },
  { text: "من البستان تعرف السوق", x: "18%", y: "72%", size: "1.8rem", delay: 2.4 },
];

export function SceneEchoes() {
  const ref = useRef<HTMLElement>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setEntered(true); },
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative z-10 min-h-[70vh] overflow-hidden"
    >
      {echoes.map((echo, i) => (
        <span
          key={i}
          className="absolute select-none font-bold whitespace-nowrap pointer-events-none echo-drift"
          style={{
            left: echo.x,
            top: echo.y,
            fontSize: echo.size,
            color: "#CDBB9A",
            opacity: entered ? 0.06 : 0,
            filter: "blur(1.5px)",
            transition: `opacity 900ms ${echo.delay}s, filter 900ms ${echo.delay}s`,
            animationDelay: `${echo.delay + 1}s`,
          }}
          aria-hidden="true"
        >
          {echo.text}
        </span>
      ))}
    </section>
  );
}
