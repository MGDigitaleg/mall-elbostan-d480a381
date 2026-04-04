import { Link } from "react-router-dom";
import { ArrowLeft, Store } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SceneResolve() {
  return (
    <section className="relative z-10 flex min-h-[50vh] flex-col items-center justify-center px-6 py-20 md:py-28">
      {/* Faint glow */}
      <div
        className="pointer-events-none absolute bottom-1/4 left-1/2 -translate-x-1/2 h-[350px] w-[350px] rounded-full opacity-[0.025]"
        style={{ background: "radial-gradient(circle, #CDBB9A, transparent 70%)" }}
      />

      <div className="echo-fade-up max-w-lg text-center">
        <h2
          className="text-[1.2rem] md:text-[1.5rem] font-bold leading-[1.35] mb-4"
          style={{ color: "#F1F5F9" }}
        >
          مول البستان —{" "}
          <span style={{ color: "#CDBB9A" }}>اسم قديم، وتجربة أوضح.</span>
        </h2>
        <p
          className="text-[0.82rem] leading-[2] max-w-md mx-auto"
          style={{ color: "#7C8BA1" }}
        >
          ما كان الناس يعرفونه بالسمعة، نعيد تقديمه اليوم بشكل أنظم، وأسرع،
          وأقرب للقرار.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/">
            <Button
              variant="cta"
              className="h-11 rounded-xl px-7 text-[0.84rem] font-bold gap-2 shadow-lg shadow-primary/20"
            >
              العودة إلى الرئيسية
              <ArrowLeft className="h-3.5 w-3.5" />
            </Button>
          </Link>
          <Link to="/stores">
            <Button
              variant="outline"
              className="h-11 rounded-xl px-6 text-[0.82rem] font-bold gap-2 border-white/10 bg-white/[0.02] text-slate-300 hover:bg-white/[0.05] hover:text-white"
            >
              <Store className="h-3.5 w-3.5" />
              استكشف دليل المحلات
            </Button>
          </Link>
        </div>
      </div>

      {/* Bottom line */}
      <div
        className="mt-16 h-px w-16 mx-auto"
        style={{
          background: "linear-gradient(90deg, transparent, #CDBB9A18, transparent)",
        }}
      />
    </section>
  );
}
