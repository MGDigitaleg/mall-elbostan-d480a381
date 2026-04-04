import { Link } from "react-router-dom";
import { Calendar, Gift, MapPin, Sparkles, Clock, ChevronLeft } from "lucide-react";
import { CountdownTimer } from "@/components/CountdownTimer";
import { PageHero } from "@/components/PageHero";

export function OpeningHero() {
  return (
    <PageHero
      kicker="١ مايو ٢٠٢٦"
      kickerEn="Opening Day"
      title={<>الافتتاح الكبير<span className="block mt-1 text-primary">خطّط لزيارتك.</span></>}
      subtitle="الموعد، الفعاليات، والمكافآت — كل التفاصيل هنا."
      ctas={[
        { label: "أدر واربح", to: "/spin-win", icon: Sparkles },
        { label: "الخريطة التفاعلية", to: "/map", icon: MapPin },
      ]}
    >
      {/* Countdown panel */}
      <div className="rounded-2xl p-1" style={{ background: "linear-gradient(135deg, hsl(222 60% 30% / 0.4), hsl(220 40% 18% / 0.3))" }}>
        <div className="rounded-[14px] p-6 md:p-8" style={{ background: "linear-gradient(145deg, hsl(220 45% 12% / 0.95), hsl(222 50% 10% / 0.9))", backdropFilter: "blur(20px)", border: "1px solid hsl(220 40% 25% / 0.3)" }}>
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "hsl(var(--primary) / 0.1)" }}>
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-poppins text-[0.6rem] font-bold tracking-[0.2em] uppercase" style={{ color: "hsl(220 14% 50%)" }}>
                  العد التنازلي
                </p>
                <p className="text-[0.82rem] font-bold" style={{ color: "#F8FAFC" }}>حتى الافتتاح</p>
              </div>
            </div>
            <div className="h-2 w-2 rounded-full animate-pulse" style={{ background: "hsl(var(--primary))" }} />
          </div>

          <CountdownTimer />

          {/* Mini info strip */}
          <div className="mt-6 grid grid-cols-2 gap-2">
            <Link to="/spin-win" className="flex items-center justify-between rounded-xl px-3.5 py-2.5 transition-all hover:bg-white/[0.04]"
                  style={{ background: "hsl(0 0% 100% / 0.02)", border: "1px solid hsl(0 0% 100% / 0.06)" }}>
              <div className="flex items-center gap-2">
                <Gift className="h-3.5 w-3.5 text-primary" />
                <span className="text-[0.7rem] font-bold" style={{ color: "hsl(220 14% 72%)" }}>أدر واربح</span>
              </div>
              <ChevronLeft className="h-3 w-3" style={{ color: "hsl(220 14% 45%)" }} />
            </Link>
            <Link to="/map" className="flex items-center justify-between rounded-xl px-3.5 py-2.5 transition-all hover:bg-white/[0.04]"
                  style={{ background: "hsl(0 0% 100% / 0.02)", border: "1px solid hsl(0 0% 100% / 0.06)" }}>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span className="text-[0.7rem] font-bold" style={{ color: "hsl(220 14% 72%)" }}>الخريطة</span>
              </div>
              <ChevronLeft className="h-3 w-3" style={{ color: "hsl(220 14% 45%)" }} />
            </Link>
          </div>
        </div>
      </div>
    </PageHero>
  );
}
