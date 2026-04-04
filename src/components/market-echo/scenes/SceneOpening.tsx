import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Store, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const phrases = [
  "انزل البستان",
  "لف البستان الأول",
  "اسأل في البستان",
  "أسعار البستان",
];

const PHASE_DURATION = 2200; // ms per phrase
const FADE_DURATION = 600;

export function SceneOpening() {
  const [phase, setPhase] = useState(-1); // -1 = not started, 0-3 = phrases, 4 = reveal
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && phase === -1) {
          setPhase(0);
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, [phase]);

  useEffect(() => {
    if (phase < 0) return;
    if (phase < phrases.length) {
      setVisible(true);
      const t1 = setTimeout(() => setVisible(false), PHASE_DURATION - FADE_DURATION);
      const t2 = setTimeout(() => setPhase((p) => p + 1), PHASE_DURATION);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
    if (phase === phrases.length) {
      // final reveal
      const t = setTimeout(() => setVisible(true), 200);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const isReveal = phase >= phrases.length;
  const currentPhrase = phase >= 0 && phase < phrases.length ? phrases[phase] : null;

  return (
    <section
      ref={sectionRef}
      className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6"
    >
      {/* Faint ambient glow */}
      <div
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full opacity-[0.035]"
        style={{ background: "radial-gradient(circle, #2563EB, transparent 70%)" }}
      />

      {/* Ghost phrases that stay faintly */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-none">
        {phrases.map((p, i) => (
          <span
            key={p}
            className="text-[1.3rem] md:text-[1.6rem] font-bold transition-opacity duration-700"
            style={{
              color: "#CDBB9A",
              opacity: phase > i ? 0.06 : 0,
            }}
          >
            {p}
          </span>
        ))}
      </div>

      {/* Active phrase */}
      {currentPhrase && (
        <h2
          className="text-[2rem] md:text-[3rem] lg:text-[3.5rem] font-bold text-center transition-all duration-[600ms]"
          style={{
            color: "#CDBB9A",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            filter: visible ? "blur(0px)" : "blur(3px)",
          }}
        >
          {currentPhrase}
        </h2>
      )}

      {/* Final reveal */}
      <div
        className="max-w-xl text-center transition-all duration-[800ms]"
        style={{
          opacity: isReveal && visible ? 1 : 0,
          transform: isReveal && visible ? "translateY(0)" : "translateY(16px)",
        }}
      >
        <h2
          className="text-[1.6rem] md:text-[2.2rem] lg:text-[2.6rem] font-bold leading-[1.2]"
          style={{ color: "#F8FAFC" }}
        >
          الاسم الذي ظل يتردد{" "}
          <span style={{ color: "#CDBB9A" }}>في السوق.</span>
        </h2>

        <p
          className="mt-5 text-[0.85rem] md:text-[0.92rem] leading-[2] max-w-lg mx-auto"
          style={{ color: "#94A3B8" }}
        >
          ما كان الناس يرددونه قديمًا، لم يكن مجرد كلام عابر.
          <br />
          كان اسمًا ارتبط بالمقارنة والثقة ومعرفة المكان الصحيح.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3">
          <Link to="/stores">
            <Button
              variant="cta"
              className="h-11 rounded-xl px-7 text-[0.84rem] font-bold gap-2 shadow-lg shadow-primary/20"
            >
              <Store className="h-3.5 w-3.5" />
              استكشف دليل المحلات
              <ArrowLeft className="h-3.5 w-3.5" />
            </Button>
          </Link>
          <Link
            to="/"
            className="text-[0.72rem] transition-colors"
            style={{ color: "#64748B" }}
          >
            العودة إلى الموقع
          </Link>
        </div>
      </div>
    </section>
  );
}
