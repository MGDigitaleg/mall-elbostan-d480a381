import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Store, Map } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ─── constants ─── */
const EASE = "cubic-bezier(0.22,1,0.36,1)";

/* ─── useReveal hook ─── */
function useReveal(threshold = 0.25) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ═══════════════════════════════════════════════
   BACK BUTTON
   ═══════════════════════════════════════════════ */
function BackButton() {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 600); return () => clearTimeout(t); }, []);
  return (
    <Link
      to="/"
      className="fixed z-50 flex items-center gap-1.5 select-none"
      style={{
        top: 28, right: 28, height: 46, paddingInline: 18,
        borderRadius: 999,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.10)",
        color: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
        fontSize: 13, fontWeight: 600,
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(-8px)",
        transition: `opacity 650ms ${EASE}, transform 650ms ${EASE}`,
      }}
    >
      <ArrowRight className="h-3.5 w-3.5" />
      العودة
    </Link>
  );
}

/* ═══════════════════════════════════════════════
   SCENE 1 — Opening Silence
   ═══════════════════════════════════════════════ */
function SceneOpening() {
  const [step, setStep] = useState(0);
  const words = ["الاسم", "الذي", "ظل", "يتردد", "في", "السوق."];

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 800),   // title start
      setTimeout(() => setStep(2), 1600),  // support
      setTimeout(() => setStep(3), 2200),  // CTA
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <section
      className="relative flex flex-col items-center justify-center px-5 md:px-8 lg:px-16"
      style={{ minHeight: "100svh", paddingTop: "12svh" }}
    >
      {/* Label */}
      <span
        className="mb-6 block text-center"
        style={{
          fontSize: 14, fontWeight: 600, letterSpacing: "0.06em",
          color: "#D9C8A2",
          opacity: step >= 1 ? 1 : 0,
          transition: `opacity 850ms ${EASE}`,
        }}
      >
        صدى السوق
      </span>

      {/* Title — word by word */}
      <h1 className="text-center leading-[1.08] font-[800] text-[34px] md:text-[54px] lg:text-[72px]">
        {words.map((w, i) => (
          <span
            key={i}
            className="inline-block mx-[0.12em]"
            style={{
              color: i === words.length - 1 ? "#D9C8A2" : "rgba(255,255,255,0.96)",
              opacity: step >= 1 ? 1 : 0,
              transform: step >= 1 ? "translateY(0) blur(0)" : "translateY(14px)",
              filter: step >= 1 ? "blur(0px)" : "blur(4px)",
              transition: `opacity 650ms ${EASE} ${i * 120}ms, transform 650ms ${EASE} ${i * 120}ms, filter 650ms ${EASE} ${i * 120}ms`,
            }}
          >
            {w}
          </span>
        ))}
      </h1>

      {/* Supporting text */}
      <div
        className="mt-8 max-w-lg text-center"
        style={{
          fontSize: 18, lineHeight: 1.9,
          color: "rgba(255,255,255,0.72)",
          opacity: step >= 2 ? 1 : 0,
          transform: step >= 2 ? "translateY(0)" : "translateY(10px)",
          transition: `opacity 850ms ${EASE}, transform 850ms ${EASE}`,
        }}
      >
        <p>ما كان الناس يرددونه قديمًا، لم يكن مجرد كلام عابر.</p>
        <p className="mt-1">كان اسمًا ارتبط بالمقارنة والثقة ومعرفة المكان الصحيح.</p>
      </div>

      {/* CTAs */}
      <div
        className="mt-10 flex flex-col items-center gap-3"
        style={{
          opacity: step >= 3 ? 1 : 0,
          transform: step >= 3 ? "translateY(0)" : "translateY(10px)",
          transition: `opacity 850ms ${EASE}, transform 850ms ${EASE}`,
        }}
      >
        <Link to="/stores">
          <Button
            className="h-[54px] rounded-full px-8 text-[0.88rem] font-bold gap-2 echo-pulse-once"
            style={{ background: "#1D5CFF", color: "#fff" }}
          >
            <Store className="h-4 w-4" />
            استكشف دليل المحلات
          </Button>
        </Link>
        <Link
          to="/"
          className="text-[13px] font-medium"
          style={{ color: "rgba(255,255,255,0.42)" }}
        >
          العودة إلى الموقع
        </Link>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   SCENE 2 — Market Echoes
   ═══════════════════════════════════════════════ */
const echoPhrases = [
  { text: "انزل البستان", x: "10%", y: "22%", delay: 0.6 },
  { text: "لفّ البستان الأول", x: "55%", y: "38%", delay: 2.0 },
  { text: "اسأل في البستان", x: "15%", y: "60%", delay: 3.6 },
  { text: "من البستان تعرف السوق", x: "48%", y: "75%", delay: 5.2 },
];

function SceneEchoes() {
  const { ref, visible } = useReveal(0.15);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden px-5 md:px-8 lg:px-16"
      style={{ minHeight: "92svh" }}
    >
      {/* Heading */}
      <div className="relative z-10 mx-auto max-w-[760px] pt-20 md:pt-28">
        <span
          className="block mb-4"
          style={{
            fontSize: 14, fontWeight: 600, letterSpacing: "0.06em",
            color: "#D9C8A2",
            opacity: visible ? 1 : 0,
            transition: `opacity 850ms ${EASE}`,
          }}
        >
          ماذا كان الناس يقصدون؟
        </span>
        <p
          className="max-w-lg"
          style={{
            fontSize: 18, lineHeight: 1.9,
            color: "rgba(255,255,255,0.72)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(10px)",
            transition: `opacity 850ms ${EASE} 200ms, transform 850ms ${EASE} 200ms`,
          }}
        >
          هذه العبارات لم تكن أمثالًا فقط، بل اختصارًا لتجربة شراء مفهومة في مكان معروف.
        </p>
      </div>

      {/* Floating echo phrases */}
      {echoPhrases.map((p, i) => (
        <span
          key={i}
          className="absolute select-none pointer-events-none font-bold whitespace-nowrap echo-drift hidden md:block"
          style={{
            left: p.x, top: p.y,
            fontSize: 40,
            color: "#D9C8A2",
            opacity: visible ? 0.08 : 0,
            filter: "blur(1.5px)",
            transition: `opacity 1200ms ${EASE} ${p.delay}s`,
            animationDelay: `${p.delay + 1}s`,
          }}
          aria-hidden="true"
        >
          {p.text}
        </span>
      ))}
      {/* Mobile: only show 2 phrases */}
      {echoPhrases.slice(0, 2).map((p, i) => (
        <span
          key={`m${i}`}
          className="absolute select-none pointer-events-none font-bold whitespace-nowrap echo-drift md:hidden"
          style={{
            left: i === 0 ? "5%" : "40%",
            top: i === 0 ? "50%" : "68%",
            fontSize: 28,
            color: "#D9C8A2",
            opacity: visible ? 0.08 : 0,
            filter: "blur(1.5px)",
            transition: `opacity 1200ms ${EASE} ${p.delay}s`,
          }}
          aria-hidden="true"
        >
          {p.text}
        </span>
      ))}
    </section>
  );
}

/* ═══════════════════════════════════════════════
   SCENE 3 — Translation to Present
   ═══════════════════════════════════════════════ */
const presentItems = [
  "دليل محلات أوضح",
  "خريطة تعرفك مكان كل وحدة",
  "منتجات أقرب لقرار الشراء",
];

function ScenePresent() {
  const { ref, visible } = useReveal(0.25);

  return (
    <section
      ref={ref}
      className="flex flex-col items-center justify-center px-5 md:px-8 lg:px-16"
      style={{ minHeight: "76svh" }}
    >
      <div className="mx-auto max-w-[760px] text-center">
        <h2
          className="text-[28px] md:text-[34px] lg:text-[40px] font-[800] leading-[1.15]"
          style={{
            color: "rgba(255,255,255,0.96)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(14px)",
            transition: `opacity 850ms ${EASE}, transform 850ms ${EASE}`,
          }}
        >
          ما كان الناس يقولونه قديمًا، نقدمه اليوم بشكل أوضح.
        </h2>

        <div className="mt-12 flex flex-col items-center gap-6">
          {presentItems.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(10px)",
                transition: `opacity 650ms ${EASE} ${400 + i * 180}ms, transform 650ms ${EASE} ${400 + i * 180}ms`,
              }}
            >
              <div
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ background: "#1D5CFF", boxShadow: "0 0 10px rgba(29,92,255,0.5)" }}
              />
              <span
                className="text-[17px] md:text-[18px] font-semibold"
                style={{ color: "rgba(255,255,255,0.88)", lineHeight: 1.9 }}
              >
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   SCENE 4 — Timeline of Trust
   ═══════════════════════════════════════════════ */
const timelineStops = [
  { year: "1990", title: "البداية", desc: "افتتاح مول البستان في وسط البلد كواحدة من الواجهات المعروفة في تجارة التقنية بالقاهرة." },
  { year: "", title: "بداية الانتشار", desc: "أصبح الاسم مرجعًا أساسيًا لكل من يبحث عن أجهزة الكمبيوتر وقطع الغيار في مصر." },
  { year: "", title: "عصر الإنترنت", desc: "مع تغير السوق، ظل البستان حاضرًا في المقارنة والسؤال وبناء الثقة." },
  { year: "", title: "توسع التخصصات", desc: "دخلت فئات جديدة مثل الهواتف والإكسسوارات والطباعة والشبكات والدعم الفني." },
  { year: "", title: "ثقة السوق", desc: "ارتبط الاسم عند كثيرين بالخبرة والمقارنة ومعرفة السعر العادل." },
  { year: "2026", title: "الفرع الجديد", desc: "الامتداد إلى القاهرة الجديدة بتجربة أحدث، وخريطة أوضح، ودليل رقمي متكامل.", isNew: true },
];

function SceneTimeline() {
  const { ref, visible } = useReveal(0.1);
  const [lineProgress, setLineProgress] = useState(0);

  useEffect(() => {
    if (!visible) return;
    let frame: number;
    const start = performance.now();
    const dur = 1400;
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      setLineProgress(p);
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [visible]);

  return (
    <section
      ref={ref}
      className="px-5 md:px-8 lg:px-16 py-20 md:py-28"
      style={{ minHeight: "180svh" }}
    >
      <div className="mx-auto max-w-[1280px]">
        {/* Header */}
        <div className="mb-16 text-center">
          <span
            className="block mb-4"
            style={{
              fontSize: 14, fontWeight: 600, letterSpacing: "0.06em",
              color: "#D9C8A2",
              opacity: visible ? 1 : 0,
              transition: `opacity 850ms ${EASE}`,
            }}
          >
            رحلة عبر الزمن
          </span>
          <h2
            className="text-[28px] md:text-[34px] lg:text-[40px] font-[800] leading-[1.15]"
            style={{
              color: "rgba(255,255,255,0.96)",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(14px)",
              transition: `opacity 850ms ${EASE} 200ms, transform 850ms ${EASE} 200ms`,
            }}
          >
            35 سنة من الثقة والتطور
          </h2>
        </div>

        {/* Desktop timeline — cards on alternating sides */}
        <div className="hidden md:block relative">
          {/* Center line */}
          <div
            className="absolute left-1/2 top-0 -translate-x-1/2"
            style={{
              width: 2,
              height: `${lineProgress * 100}%`,
              background: "linear-gradient(to bottom, rgba(29,92,255,0.9), rgba(29,92,255,0.4))",
            }}
          />
          {/* Base line */}
          <div
            className="absolute left-1/2 top-0 -translate-x-1/2 h-full"
            style={{ width: 2, background: "rgba(255,255,255,0.10)" }}
          />

          <div className="relative" style={{ paddingBottom: 40 }}>
            {timelineStops.map((stop, i) => {
              const nodePos = i / (timelineStops.length - 1);
              const revealed = lineProgress >= nodePos;
              const isRight = i % 2 === 0;

              return (
                <div
                  key={i}
                  className="relative flex items-start"
                  style={{ marginBottom: i < timelineStops.length - 1 ? 180 : 0 }}
                >
                  {/* Node dot */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 rounded-full z-10"
                    style={{
                      width: 10, height: 10, top: 22,
                      background: stop.isNew ? "#F97316" : "#1D5CFF",
                      boxShadow: revealed
                        ? stop.isNew ? "0 0 14px #F9731650" : "0 0 12px rgba(29,92,255,0.5)"
                        : "none",
                      opacity: revealed ? 1 : 0,
                      transition: `opacity 400ms ${EASE}`,
                    }}
                  />

                  {/* Card */}
                  <div
                    className={`w-[320px] ${isRight ? "mr-auto pr-12" : "ml-auto pl-12"}`}
                    style={{
                      [isRight ? "marginRight" : "marginLeft"]: "calc(50% + 24px)",
                      [isRight ? "marginLeft" : "marginRight"]: "auto",
                      opacity: revealed ? 1 : 0,
                      transform: revealed ? "translateY(0)" : "translateY(16px)",
                      transition: `opacity 650ms ${EASE} ${i * 100}ms, transform 650ms ${EASE} ${i * 100}ms`,
                    }}
                  >
                    <div
                      className="p-[22px_24px] min-h-[116px]"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 20,
                      }}
                    >
                      {stop.year && (
                        <span
                          className="text-[13px] font-bold tracking-wider font-poppins"
                          style={{ color: stop.isNew ? "#F97316" : "#1D5CFF" }}
                        >
                          {stop.year}
                        </span>
                      )}
                      <h3
                        className="text-[17px] font-bold mt-1"
                        style={{ color: "rgba(255,255,255,0.96)" }}
                      >
                        {stop.year ? `${stop.year} — ${stop.title}` : stop.title}
                      </h3>
                      <p
                        className="mt-2 text-[15px] leading-[1.8]"
                        style={{ color: "rgba(255,255,255,0.60)" }}
                      >
                        {stop.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile timeline — single column */}
        <div className="md:hidden relative pr-6">
          {/* Vertical line */}
          <div
            className="absolute right-0 top-0"
            style={{
              width: 2,
              height: `${lineProgress * 100}%`,
              background: "linear-gradient(to bottom, rgba(29,92,255,0.9), rgba(29,92,255,0.4))",
            }}
          />
          <div
            className="absolute right-0 top-0 h-full"
            style={{ width: 2, background: "rgba(255,255,255,0.10)" }}
          />

          <div className="space-y-12">
            {timelineStops.map((stop, i) => {
              const nodePos = i / (timelineStops.length - 1);
              const revealed = lineProgress >= nodePos;

              return (
                <div key={i} className="relative">
                  {/* Node */}
                  <div
                    className="absolute -right-6 top-3 -translate-x-1/2 rounded-full"
                    style={{
                      width: 10, height: 10,
                      background: stop.isNew ? "#F97316" : "#1D5CFF",
                      opacity: revealed ? 1 : 0,
                      transition: `opacity 400ms ${EASE}`,
                    }}
                  />
                  <div
                    className="p-[18px_20px]"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 16,
                      opacity: revealed ? 1 : 0,
                      transform: revealed ? "translateX(0)" : "translateX(-10px)",
                      transition: `opacity 650ms ${EASE}, transform 650ms ${EASE}`,
                    }}
                  >
                    <h3
                      className="text-[16px] font-bold"
                      style={{ color: "rgba(255,255,255,0.96)" }}
                    >
                      {stop.year ? `${stop.year} — ${stop.title}` : stop.title}
                    </h3>
                    <p
                      className="mt-2 text-[14px] leading-[1.8]"
                      style={{ color: "rgba(255,255,255,0.60)" }}
                    >
                      {stop.desc}
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

/* ═══════════════════════════════════════════════
   SCENE 5 — Final Statement + Stats
   ═══════════════════════════════════════════════ */
const stats = [
  { value: "+1000", label: "منتج" },
  { value: "6", label: "أقسام متخصصة" },
  { value: "+30", label: "سنة حضور" },
  { value: "35", label: "سنة من الثقة" },
];

function SceneFinal() {
  const { ref, visible } = useReveal(0.25);

  return (
    <section
      ref={ref}
      className="flex flex-col items-center justify-center px-5 md:px-8 lg:px-16"
      style={{ minHeight: "72svh" }}
    >
      <span
        className="block mb-4 text-center"
        style={{
          fontSize: 14, fontWeight: 600, letterSpacing: "0.06em",
          color: "#D9C8A2",
          opacity: visible ? 1 : 0,
          transition: `opacity 850ms ${EASE}`,
        }}
      >
        البستان بالأرقام
      </span>

      <h2
        className="text-center text-[28px] md:text-[34px] lg:text-[40px] font-[800] leading-[1.15]"
        style={{
          color: "rgba(255,255,255,0.96)",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(14px)",
          transition: `opacity 850ms ${EASE} 200ms, transform 850ms ${EASE} 200ms`,
        }}
      >
        من البستان <span style={{ color: "#D9C8A2" }}>تعرف السوق.</span>
      </h2>

      <p
        className="mt-5 text-center max-w-md"
        style={{
          fontSize: 18, lineHeight: 1.9,
          color: "rgba(255,255,255,0.72)",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(10px)",
          transition: `opacity 850ms ${EASE} 400ms, transform 850ms ${EASE} 400ms`,
        }}
      >
        واليوم تعرفه أسرع عبر دليل المحلات والخريطة والمنتجات.
      </p>

      {/* Stats grid */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center"
            style={{
              width: "clamp(140px, 20vw, 180px)",
              height: 120,
              borderRadius: 18,
              background: "rgba(255,255,255,0.035)",
              border: "1px solid rgba(255,255,255,0.08)",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(12px)",
              transition: `opacity 650ms ${EASE} ${600 + i * 150}ms, transform 650ms ${EASE} ${600 + i * 150}ms`,
            }}
          >
            <span
              className="text-[24px] md:text-[28px] font-[800] font-poppins"
              style={{ color: "#1D5CFF" }}
            >
              {s.value}
            </span>
            <span
              className="mt-1 text-[13px] font-semibold"
              style={{ color: "rgba(255,255,255,0.60)" }}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   SCENE 6 — Exit CTA
   ═══════════════════════════════════════════════ */
function SceneCTA() {
  const { ref, visible } = useReveal(0.3);

  return (
    <section
      ref={ref}
      className="flex flex-col items-center justify-center px-5 md:px-8 lg:px-16 pb-20"
      style={{ minHeight: "56svh" }}
    >
      <span
        className="block mb-4 text-center"
        style={{
          fontSize: 14, fontWeight: 600, letterSpacing: "0.06em",
          color: "#D9C8A2",
          opacity: visible ? 1 : 0,
          transition: `opacity 850ms ${EASE}`,
        }}
      >
        ابدأ من هنا
      </span>

      <h2
        className="text-center text-[28px] md:text-[34px] lg:text-[40px] font-[800] leading-[1.15]"
        style={{
          color: "rgba(255,255,255,0.96)",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(14px)",
          transition: `opacity 850ms ${EASE} 200ms, transform 850ms ${EASE} 200ms`,
        }}
      >
        المول جاهز — والقرار بيدك.
      </h2>

      <p
        className="mt-4 text-center max-w-md"
        style={{
          fontSize: 18, lineHeight: 1.9,
          color: "rgba(255,255,255,0.72)",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(10px)",
          transition: `opacity 850ms ${EASE} 400ms, transform 850ms ${EASE} 400ms`,
        }}
      >
        استكشف، قارن، ثم اختر المسار الأنسب لك.
      </p>

      {/* CTA row */}
      <div
        className="mt-10 flex flex-col md:flex-row items-center gap-3"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(10px)",
          transition: `opacity 850ms ${EASE} 600ms, transform 850ms ${EASE} 600ms`,
        }}
      >
        <Link to="/stores">
          <Button
            className="h-[54px] rounded-full px-8 text-[0.88rem] font-bold gap-2 echo-pulse-once"
            style={{ background: "#1D5CFF", color: "#fff" }}
          >
            <Store className="h-4 w-4" />
            استكشف دليل المحلات
          </Button>
        </Link>

        <Link to="/map">
          <Button
            variant="outline"
            className="h-[54px] rounded-full px-7 text-[0.84rem] font-bold gap-2"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.88)",
            }}
          >
            <Map className="h-4 w-4" />
            افتح الخريطة التفاعلية
          </Button>
        </Link>

        <Link
          to="/"
          className="mt-1 md:mt-0 text-[13px] font-medium"
          style={{ color: "rgba(255,255,255,0.42)" }}
        >
          العودة إلى الموقع
        </Link>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   MAIN WRAPPER
   ═══════════════════════════════════════════════ */
export function MarketEchoImmersive() {
  return (
    <div
      className="relative min-h-screen text-white"
      dir="rtl"
      style={{
        background: "linear-gradient(170deg, #04152F 0%, #071B44 40%, #04152F 100%)",
        fontFamily: "var(--font-arabic-display)",
      }}
    >
      {/* Grid texture — small 88px */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-100"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "88px 88px",
          animation: "echoGridIn 1600ms cubic-bezier(0.22,1,0.36,1) forwards",
          opacity: 0,
        }}
      />
      {/* Grid texture — large 352px */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-100"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "352px 352px",
          animation: "echoGridIn 1600ms cubic-bezier(0.22,1,0.36,1) forwards",
          opacity: 0,
        }}
      />

      {/* Single subtle ambient glow */}
      <div
        className="pointer-events-none fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
        style={{
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(29,92,255,0.06), transparent 70%)",
        }}
      />

      <BackButton />

      <div className="relative z-10">
        <SceneOpening />
        <SceneEchoes />
        <ScenePresent />
        <SceneTimeline />
        <SceneFinal />
        <SceneCTA />
      </div>
    </div>
  );
}
