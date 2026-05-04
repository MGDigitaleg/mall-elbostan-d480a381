import { useEffect, useRef, useState } from "react";

export function ScenePhraseReveal() {
  const ref = useRef<HTMLElement>(null);
  const [entered, setEntered] = useState(false);
  const [wordIndex, setWordIndex] = useState(-1);
  const [supportVisible, setSupportVisible] = useState(false);

  const words = ["لو", "محتار،", "انزل", "البستان."];
  const support = "لم تكن جملة عابرة، بل بداية طريق يعرفه كل من أراد أن يشتري بثقة.";

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting && !entered) setEntered(true); },
      { threshold: 0.4 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [entered]);

  useEffect(() => {
    if (!entered) return;
    let i = 0;
    const interval = setInterval(() => {
      setWordIndex(i);
      i++;
      if (i >= words.length) {
        clearInterval(interval);
        setTimeout(() => setSupportVisible(true), 600);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [entered]);

  return (
    <section
      ref={ref}
      className="relative z-10 flex min-h-[80vh] flex-col items-center justify-center px-6"
    >
      {/* Main phrase — word by word */}
      <h2 className="text-center leading-[1.25]">
        {words.map((word, i) => (
          <span
            key={i}
            className="inline-block mx-[0.18em] text-[2rem] md:text-[3rem] lg:text-[3.6rem] font-bold transition-all duration-[600ms]"
            style={{
              color: i === 3 ? "#CDBB9A" : "#F8FAFC",
              opacity: wordIndex >= i ? 1 : 0,
              transform: wordIndex >= i ? "translateY(0)" : "translateY(14px)",
              filter: wordIndex >= i ? "blur(0px)" : "blur(4px)",
            }}
          >
            {word}
          </span>
        ))}
      </h1>

      {/* Supporting line */}
      <p
        className="mt-6 max-w-md text-center text-[0.82rem] md:text-[0.88rem] leading-[2] transition-all duration-[800ms]"
        style={{
          color: "#94A3B8",
          opacity: supportVisible ? 1 : 0,
          transform: supportVisible ? "translateY(0)" : "translateY(10px)",
        }}
      >
        {support}
      </p>
    </section>
  );
}
