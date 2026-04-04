import { Link } from "react-router-dom";
import { ArrowLeft, Building2, MapPin, Store, Clock, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

import dt1 from "@/assets/downtown-hero-1.jpg";
import dt2 from "@/assets/downtown-hero-2.jpg";
import dt3 from "@/assets/downtown-hero-3.jpg";
import dt4 from "@/assets/downtown-hero-4.jpg";

const dtPhotos = [dt1, dt2, dt3, dt4];

export function DowntownTeaser() {
  const { data: count } = useQuery({
    queryKey: ["downtown-merchants-count"],
    queryFn: async () => {
      const { count } = await supabase
        .from("downtown_merchants")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true);
      return count ?? 0;
    },
  });

  const merchantCount = count ?? 30;

  return (
    <section className="relative overflow-hidden py-10 md:py-14" style={{ background: "linear-gradient(160deg, #1A1408 0%, #2A1F0E 40%, #1A1408 100%)" }}>
      {/* Decorative glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.06]" style={{ background: "radial-gradient(circle, #CDBB9A 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, #D4A853 0%, transparent 70%)" }} />
      </div>

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            {/* Right: Content */}
            <div className="space-y-4">
              {/* Kicker */}
              <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1" style={{ background: "#CDBB9A14", border: "1px solid #CDBB9A25" }}>
                <Landmark className="h-3 w-3" style={{ color: "#CDBB9A" }} />
                <span className="text-[0.68rem] font-bold" style={{ color: "#CDBB9A" }}>الفرع التاريخي</span>
              </div>

              <h2 className="text-[1.2rem] md:text-[1.45rem] font-bold leading-[1.2]" style={{ fontFamily: "var(--font-arabic-display)", color: "#F5F0E8" }}>
                فرع وسط البلد — منذ ١٩٩٠.
              </h2>

              <p className="text-[0.84rem] leading-[1.7] max-w-[30rem]" style={{ color: "#A89E8C" }}>
                الفرع الذي عرّف جيلًا كاملًا على عالم التقنية — في شارع البستان بباب اللوق.
              </p>

              {/* Stats row */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: "#ffffff06", border: "1px solid #ffffff0D" }}>
                  <Store className="h-3.5 w-3.5" style={{ color: "#CDBB9A" }} />
                  <span className="text-[0.8rem] font-bold" style={{ color: "#F5F0E8" }}>{merchantCount}+ محل</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: "#ffffff06", border: "1px solid #ffffff0D" }}>
                  <Clock className="h-3.5 w-3.5" style={{ color: "#CDBB9A" }} />
                  <span className="text-[0.8rem] font-bold" style={{ color: "#F5F0E8" }}>منذ 1990</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: "#ffffff06", border: "1px solid #ffffff0D" }}>
                  <MapPin className="h-3.5 w-3.5" style={{ color: "#CDBB9A" }} />
                  <span className="text-[0.8rem]" style={{ color: "#A89E8C" }}>باب اللوق، وسط البلد</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-2.5 pt-2">
                <Link to="/downtown-directory">
                  <Button variant="cta" className="h-10 rounded-lg px-6 text-[0.8rem] font-bold shadow-[var(--shadow-blue)]">
                    دليل المحلات <ArrowLeft className="mr-1 h-3.5 w-3.5" />
                  </Button>
                </Link>
                <Link to="/downtown-branch">
                  <Button className="h-10 rounded-lg border px-5 text-[0.8rem] font-bold" style={{ borderColor: "#CDBB9A30", background: "#CDBB9A0A", color: "#CDBB9A" }}>
                    <Building2 className="ml-1.5 h-3.5 w-3.5" /> عن الفرع
                  </Button>
                </Link>
              </div>
            </div>

            {/* Left: Photo mosaic */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-2 md:gap-2.5">
                {dtPhotos.map((src, i) => (
                  <div
                    key={i}
                    className={`relative overflow-hidden rounded-xl ${
                      i === 0 ? "aspect-[4/3]" : i === 1 ? "aspect-square" : i === 2 ? "aspect-square" : "aspect-[4/3]"
                    }`}
                    style={{ border: "1px solid #ffffff0A" }}
                  >
                    <img
                      src={src}
                      alt={`مول البستان وسط البلد - صورة ${i + 1}`}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #1A140850 0%, transparent 60%)" }} />
                  </div>
                ))}
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1.5 backdrop-blur-md" style={{ background: "#1A1408E6", border: "1px solid #CDBB9A30" }}>
                <p className="text-center text-[0.72rem] font-bold" style={{ color: "#CDBB9A" }}>
                  أكثر من 30 عاما من الثقة
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
