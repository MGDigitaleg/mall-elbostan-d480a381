import { Link } from "react-router-dom";
import { CountdownTimer } from "@/components/CountdownTimer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

/**
 * Mall Pulse Strip — fills the navy gap between QuickActions and WhyElBostan
 * with a 3-axis horizontal commercial strip: countdown, identity stats, spin CTA.
 */
export function MallPulseStrip() {
  return (
    <section
      className="relative"
      style={{
        background: "#071326",
        paddingTop: "clamp(36px, 5vw, 64px)",
        paddingBottom: "clamp(36px, 5vw, 64px)",
      }}
    >
      <div className="container">
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 rounded-2xl"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0) 100%)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {/* 1 · Countdown */}
          <div className="relative px-6 py-6 md:py-8 text-center md:border-l md:border-white/[0.08]">
            <p className="font-poppins text-[0.6rem] font-bold tracking-[0.18em] uppercase mb-1.5" style={{ color: "#60A5FA" }}>
              الافتتاح الرسمي
            </p>
            <p className="text-[0.78rem] font-bold mb-4" style={{ color: "#F1F5F9" }}>
              01 مايو 2026
            </p>
            <CountdownTimer compact />
          </div>

          {/* 2 · Identity stats */}
          <div className="relative px-6 py-6 md:py-8 text-center md:border-l md:border-white/[0.08]">
            <p className="font-poppins text-[0.6rem] font-bold tracking-[0.18em] uppercase mb-4" style={{ color: "#CDBB9A" }}>
              هوية المول
            </p>
            <div className="flex items-center justify-center gap-5 md:gap-7">
              {[
                { value: "+150", label: "محل تقني" },
                { value: "3", label: "أدوار" },
                { value: "10", label: "تخصصات" },
              ].map((s) => (
                <div key={s.label} className="flex flex-col items-center">
                  <span
                    className="font-poppins text-[1.5rem] md:text-[1.75rem] font-extrabold leading-none"
                    style={{ color: "#1F61FF" }}
                  >
                    {s.value}
                  </span>
                  <span className="mt-1.5 text-[0.68rem] md:text-[0.72rem]" style={{ color: "#94A3B8" }}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 3 · Spin & Win CTA */}
          <div className="relative px-6 py-6 md:py-8 text-center flex flex-col items-center justify-center">
            <span
              className="inline-flex items-center px-2.5 py-1 rounded-full text-[0.6rem] font-bold tracking-[0.1em] mb-3"
              style={{
                background: "rgba(31,97,255,0.12)",
                color: "#60A5FA",
                border: "1px solid rgba(31,97,255,0.25)",
              }}
            >
              حصري للزوار
            </span>
            <p className="text-[0.95rem] md:text-[1.05rem] font-bold mb-1" style={{ color: "#F8FAFC", fontFamily: "var(--font-arabic-display)" }}>
              جوائز يومية بانتظارك
            </p>
            <p className="text-[0.72rem] mb-4" style={{ color: "#94A3B8" }}>
              أدر العجلة واربح من محلات المول.
            </p>
            <Link to="/spin-win">
              <Button
                className="h-10 px-6 rounded-xl text-[0.82rem] font-bold gap-1.5"
                style={{ background: "#1F61FF", color: "#FFFFFF" }}
              >
                أدر الآن
                <ArrowLeft className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
