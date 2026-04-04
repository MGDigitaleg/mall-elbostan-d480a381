import { Link } from "react-router-dom";
import { Store, Map, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SceneCTA() {
  return (
    <section className="relative z-10 flex flex-col items-center justify-center px-6 pb-20 pt-8">
      <div className="flex flex-col items-center gap-3">
        <Link to="/stores">
          <Button
            className="h-11 rounded-xl px-7 text-[0.84rem] font-bold gap-2 shadow-lg"
            style={{
              background: "hsl(var(--primary))",
              color: "#fff",
              boxShadow: "0 0 20px rgba(37,99,235,0.2)",
            }}
          >
            <Store className="h-3.5 w-3.5" />
            استكشف دليل المحلات
            <ArrowLeft className="h-3.5 w-3.5" />
          </Button>
        </Link>

        <div className="flex items-center gap-4 mt-1">
          <Link
            to="/"
            className="text-[0.72rem] font-medium transition-colors hover:text-white/70"
            style={{ color: "#64748B" }}
          >
            العودة إلى الموقع
          </Link>
          <span style={{ color: "#334155" }}>|</span>
          <Link
            to="/map"
            className="flex items-center gap-1.5 text-[0.72rem] font-medium transition-colors hover:text-white/70"
            style={{ color: "#64748B" }}
          >
            <Map className="h-3 w-3" />
            افتح الخريطة التفاعلية
          </Link>
        </div>
      </div>

      {/* Bottom line */}
      <div
        className="mt-16 h-px w-12 mx-auto"
        style={{ background: "linear-gradient(90deg, transparent, #CDBB9A12, transparent)" }}
      />
    </section>
  );
}
