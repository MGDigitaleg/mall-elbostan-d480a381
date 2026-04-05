import { Link } from "react-router-dom";
import { ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

import dtHero from "@/assets/downtown-hero-night-restored.webp";

const sectionReveal = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

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
    <section
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(170deg, #0C0A06 0%, #1A150C 35%, #0F0D08 100%)",
        paddingTop: "clamp(52px, 7vw, 112px)",
        paddingBottom: "clamp(52px, 7vw, 112px)",
      }}
    >
      {/* Subtle warm glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #CDBB9A 0%, transparent 70%)" }}
        />
      </div>

      <div className="container relative">
        <motion.div
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <div className="grid gap-8 lg:gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            {/* Right: Content */}
            <div className="order-2 lg:order-1">
              <p
                className="text-[0.72rem] font-semibold tracking-[0.04em] mb-4"
                style={{ color: "#CDBB9A" }}
              >
                الفرع التاريخي
              </p>

              <h2
                className="text-[1.15rem] md:text-[1.4rem] font-bold leading-[1.2]"
                style={{ fontFamily: "var(--font-arabic-display)", color: "#F5F0E8" }}
              >
                مول البستان — وسط البلد
              </h2>

              <p
                className="mt-3 text-[0.84rem] leading-[1.8] max-w-[28rem]"
                style={{ color: "#9E9486" }}
              >
                الاسم الذي عرفه السوق لسنوات، وما زال مرجعًا معروفًا في عالم التقنية بوسط القاهرة.
              </p>

              {/* Heritage facts */}
              <div className="mt-6 space-y-3">
                {[
                  "منذ 1990",
                  "أكثر من 30 عامًا من الثقة",
                  "باب اللوق — وسط البلد، القاهرة",
                ].map((fact, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: i === 2 ? "#CDBB9A" : "#CDBB9A60" }}
                    />
                    <span
                      className="text-[0.8rem] font-medium"
                      style={{ color: "#C4B8A4" }}
                    >
                      {fact}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link to="/downtown-directory">
                  <Button
                    variant="cta"
                    className="h-10 rounded-xl px-6 text-[0.8rem] font-bold shadow-lg shadow-primary/15"
                  >
                    دليل محلات وسط البلد
                    <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                  </Button>
                </Link>
                <Link
                  to="/downtown-branch"
                  className="text-[0.76rem] font-semibold transition-colors hover:opacity-80"
                  style={{ color: "#CDBB9A80" }}
                >
                  اعرف أكثر عن الفرع
                </Link>
              </div>
            </div>

            {/* Left: Single hero image */}
            <div className="order-1 lg:order-2">
              <div
                className="overflow-hidden rounded-2xl"
                style={{ border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div className="aspect-[3/4] relative">
                  <img
                    src={dtHero}
                    alt="مول البستان — المبنى التاريخي ليلًا في وسط البلد"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, #0C0A0650 0%, transparent 40%)" }}
                  />
                </div>
              </div>

              {/* Subtle location pin */}
              <div className="mt-3 flex items-center justify-end gap-1.5">
                <MapPin className="h-3 w-3" style={{ color: "#CDBB9A50" }} />
                <span className="text-[0.64rem]" style={{ color: "#CDBB9A40" }}>
                  باب اللوق، القاهرة
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
