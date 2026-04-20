import { Link } from "react-router-dom";
import { ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/home/Reveal";

import dtHero from "@/assets/downtown-hero-night-clean2.webp";

export function DowntownTeaser() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(170deg, #0C0A06 0%, #1A150C 35%, #0F0D08 100%)",
      }}
    >
      <div className="container relative">
        <Reveal rootMargin="-80px" offset={14}>
          <div
            className="grid lg:grid-cols-[1.15fr_1fr] items-stretch overflow-hidden rounded-2xl"
            style={{
              border: "1px solid rgba(255,255,255,0.06)",
              marginBlock: "clamp(32px, 4vw, 56px)",
            }}
          >
            {/* Image — fills its grid cell */}
            <div className="relative min-h-[220px] lg:min-h-[320px]">
              <img
                src={dtHero}
                alt="مول البستان — المبنى التاريخي ليلاً في وسط البلد"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                width={1264}
                height={752}
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
              <div
                className="absolute inset-0 lg:hidden"
                style={{ background: "linear-gradient(to top, #0C0A06 0%, transparent 60%)" }}
              />
              {/* Location pin — mobile only, overlaid on image */}
              <div className="absolute bottom-3 right-3 flex items-center gap-1 lg:hidden">
                <MapPin className="h-3 w-3" style={{ color: "#CDBB9A70" }} />
                <span className="text-[0.6rem]" style={{ color: "#CDBB9A50" }}>
                  باب اللوق، القاهرة
                </span>
              </div>
            </div>

            {/* Content */}
            <div
              className="flex flex-col justify-center"
              style={{
                padding: "clamp(20px, 3vw, 40px) clamp(20px, 3vw, 40px)",
                background: "linear-gradient(170deg, #13100A 0%, #0F0D08 100%)",
              }}
            >
              <p
                className="text-[0.68rem] font-semibold tracking-[0.04em] mb-3"
                style={{ color: "#CDBB9A" }}
              >
                الفرع التاريخي
              </p>

              <h2
                className="text-[1.05rem] md:text-[1.25rem] font-bold leading-[1.2]"
                style={{ fontFamily: "var(--font-arabic-display)", color: "#F5F0E8" }}
              >
                مول البستان — وسط البلد
              </h2>

              <p
                className="mt-2 text-[0.78rem] leading-[1.7] max-w-[26rem]"
                style={{ color: "#9E9486" }}
              >
                الاسم الذي عرفه السوق لسنوات، وما زال مرجعاً معروفاً في عالم التقنية بوسط القاهرة.
              </p>

              {/* Heritage facts */}
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                {[
                  "منذ 1990",
                  "أكثر من 30 عاماً من الثقة",
                  "باب اللوق، القاهرة",
                ].map((fact, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div
                      className="h-1 w-1 shrink-0 rounded-full"
                      style={{ background: i === 2 ? "#CDBB9A" : "#CDBB9A60" }}
                    />
                    <span
                      className="text-[0.72rem] font-medium"
                      style={{ color: "#C4B8A4" }}
                    >
                      {fact}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Link to="/downtown-directory">
                  <Button
                    variant="cta"
                    className="h-9 rounded-xl px-5 text-[0.75rem] font-bold shadow-lg shadow-primary/15"
                  >
                    دليل محلات وسط البلد
                    <ArrowLeft className="mr-1.5 h-3 w-3" />
                  </Button>
                </Link>
                <Link
                  to="/downtown-branch"
                  className="text-[0.7rem] font-semibold transition-colors hover:opacity-80"
                  style={{ color: "#CDBB9A80" }}
                >
                  اعرف أكثر عن الفرع
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
