import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Users, Layers, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/home/Reveal";

const REASONS = [
  { icon: Shield, title: "ثقة السوق", desc: "اسم معروف منذ ١٩٩٠ في سوق التقنية المصري.", color: "#2563EB" },
  { icon: Users, title: "تنوّع المحلات", desc: "+150 محل متخصص في كل فئات الإلكترونيات.", color: "#06B6D4" },
  { icon: Layers, title: "موقع استراتيجي", desc: "في قلب التجمع الخامس — يخدم مدينتي والرحاب.", color: "#10B981" },
  { icon: Clock, title: "تجربة متكاملة", desc: "خريطة تفاعلية، دليل رقمي، ومحلات متخصصة.", color: "#F97316" },
];

export function WhyElBostan() {
  return (
    <section
      className="bg-card dark:bg-background"
      style={{
        paddingTop: "clamp(22px, 2.8vw, 44px)",
        paddingBottom: "clamp(22px, 2.8vw, 44px)",
      }}
    >
      <div className="container">
        <Reveal>
          <div className="mx-auto max-w-[56rem]">
            <div className="text-center mb-5">
              <p className="section-kicker" style={{ fontSize: 11, marginBottom: 4 }}>لماذا مول البستان</p>
              <h2 className="section-title mx-auto max-w-md" style={{ fontFamily: "var(--font-arabic-display)", fontSize: "clamp(15px, 1.5vw, 20px)" }}>
                الوجهة الأولى للتقنية في القاهرة الجديدة.
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              {REASONS.map((r) => (
                <div key={r.title} className="flex flex-col items-start gap-2 rounded-xl border border-border/50 bg-background p-3 transition-all duration-200 hover:border-border hover:shadow-sm">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ background: `${r.color}08`, border: `1px solid ${r.color}15` }}>
                    <r.icon className="h-4 w-4" style={{ color: r.color }} />
                  </div>
                  <div>
                    <h3 className="text-[0.78rem] font-bold text-foreground">{r.title}</h3>
                    <p className="mt-0.5 text-[0.68rem] leading-[1.55] text-muted-foreground">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-center">
              <Link to="/about">
                <Button variant="outline-blue" className="h-9 rounded-xl px-5 text-[0.76rem] font-bold gap-1.5">
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
