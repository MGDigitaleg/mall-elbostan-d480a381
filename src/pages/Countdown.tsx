import { SEOHead } from "@/components/SEOHead";
import { CountdownTimer } from "@/components/CountdownTimer";
import { BrandLogo } from "@/components/BrandLogo";
import ogCountdown from "@/assets/og-countdown.jpg";

const Countdown = () => {
  return (
    <>
      <SEOHead
        title="قريباً — الافتتاح الكبير"
        titleEn="Coming Soon — Grand Opening"
        description="مول البستان — أكبر وجهة تقنية متخصصة في القاهرة الجديدة. الافتتاح الكبير ١ مايو ٢٠٢٦."
        descriptionEn="Mall Elbostan — the biggest tech destination in New Cairo. Grand opening May 1, 2026."
        ogImage={ogCountdown}
      />

      <div
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4"
        style={{
          background: "linear-gradient(145deg, hsl(222 47% 8%), hsl(222 47% 11%), hsl(220 40% 14%))",
        }}
      >
        {/* Ambient glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 40%, hsl(var(--primary) / 0.08), transparent 70%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-10 text-center max-w-2xl">
          {/* Logo */}
          <BrandLogo variant="light" className="h-14 md:h-20" />

          {/* Heading */}
          <div className="space-y-5">
            <p
              className="font-poppins text-[0.65rem] font-bold tracking-[0.25em] uppercase"
              style={{ color: "hsl(var(--primary))" }}
            >
              ١ مايو ٢٠٢٦
            </p>
            <h1
              className="text-3xl md:text-5xl font-bold leading-[1.35]"
              style={{ color: "#F8FAFC" }}
            >
              الافتتاح الكبير
              <span className="block mt-3 text-primary">قريباً جداً</span>
            </h1>
            <p
              className="text-sm md:text-base max-w-md mx-auto leading-relaxed"
              style={{ color: "hsl(220 14% 55%)" }}
            >
              أكبر وجهة تقنية متخصصة في القاهرة الجديدة — أكثر من 150 وحدة تجارية في انتظارك.
            </p>
          </div>

          {/* Countdown */}
          <div
            className="w-full max-w-lg rounded-2xl p-1"
            style={{
              background: "linear-gradient(135deg, hsl(222 60% 30% / 0.4), hsl(220 40% 18% / 0.3))",
            }}
          >
            <div
              className="rounded-[14px] px-6 py-8 md:px-10 md:py-10"
              style={{
                background: "linear-gradient(145deg, hsl(220 45% 12% / 0.95), hsl(222 50% 10% / 0.9))",
                backdropFilter: "blur(20px)",
                border: "1px solid hsl(220 40% 25% / 0.3)",
              }}
            >
              <CountdownTimer />
            </div>
          </div>
        </div>

        {/* Bottom subtle line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(to right, transparent, hsl(var(--primary) / 0.2), transparent)" }}
        />
      </div>
    </>
  );
};

export default Countdown;
