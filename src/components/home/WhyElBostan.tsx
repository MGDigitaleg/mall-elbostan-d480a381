import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Users, Layers, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/home/Reveal";

const REASONS = [
  { icon: Shield, title: "ثقة السوق", desc: "اسم معروف منذ أكثر من ٣٠ عاماً في سوق التقنية المصري.", color: "#2563EB" },
  { icon: Users, title: "تنوّع المحلات", desc: "أكثر من ١٥٠ محل متخصص في كل فئات الإلكترونيات والتقنية.", color: "#06B6D4" },
  { icon: Layers, title: "موقع استراتيجي", desc: "في قلب التجمع الخامس، يخدم مدينتي والرحاب والمناطق المحيطة.", color: "#10B981" },
  { icon: Clock, title: "تجربة متكاملة", desc: "خريطة تفاعلية، دليل رقمي، ومحلات متخصصة في مكان واحد.", color: "#F97316" },
];

export function WhyElBostan() {
  return (
    <section
      className="relative bg-card dark:bg-background"
      style={{
        paddingTop: "clamp(56px, 7vw, 112px)",
        paddingBottom: "clamp(56px, 7vw, 112px)",
      }}
    >
      <div className="container">
        <Reveal>
          <div className="mx-auto max-w-[60rem]">
            <div className="text-center mb-10 md:mb-12">
              <p className="section-kicker" style={{ fontSize: 11, marginBottom: 10 }}>لماذا مول البستان</p>
              <h2 className="section-title mx-auto max-w-lg" style={{ fontFamily: "var(--font-arabic-display)", fontSize: "clamp(18px, 1.8vw, 26px)" }}>
                الوجهة الأولى للتقنية في القاهرة الجديدة.
              </h2>
              <p className="mt-3 text-[0.84rem] leading-[1.75] text-muted-foreground max-w-md mx-auto">
                اسم بناه التجار والزبائن — ليس الإعلانات.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
              {REASONS.map((r) => (
                <div
                  key={r.title}
                  className="group flex items-start gap-4 rounded-2xl border border-border/40 bg-background p-5 md:p-6 transition-all duration-300 hover:border-border/70 hover:shadow-[var(--shadow-card)]"
                >
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105"
                    style={{
                      background: `${r.color}08`,
                      border: `1px solid ${r.color}12`,
                      boxShadow: `0 4px 12px ${r.color}06`,
                    }}
                  >
                    <r.icon className="h-5 w-5" style={{ color: r.color }} />
                  </div>
                  <div>
                    <h3 className="text-[0.9rem] font-bold text-foreground" style={{ letterSpacing: "-0.01em" }}>{r.title}</h3>
                    <p className="mt-1.5 text-[0.78rem] leading-[1.7] text-muted-foreground">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <Link to="/about">
                <Button variant="outline-blue" className="h-10 rounded-xl px-6 text-[0.8rem] font-bold gap-1.5">
                  عن مول البستان <ArrowLeft className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
