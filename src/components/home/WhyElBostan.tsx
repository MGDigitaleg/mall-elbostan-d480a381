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
      className="bg-card dark:bg-background"
      style={{
        paddingTop: "clamp(48px, 6vw, 96px)",
        paddingBottom: "clamp(48px, 6vw, 96px)",
      }}
    >
      <div className="container">
        <Reveal>
          <div className="mx-auto max-w-[56rem]">
            <div className="text-center mb-8">
              <p className="section-kicker" style={{ fontSize: 11, marginBottom: 6 }}>لماذا مول البستان</p>
              <h2 className="section-title mx-auto max-w-md" style={{ fontFamily: "var(--font-arabic-display)", fontSize: "clamp(16px, 1.6vw, 22px)" }}>
                الوجهة الأولى للتقنية في القاهرة الجديدة.
              </h2>
              <p className="mt-2 text-[0.82rem] leading-[1.7] text-muted-foreground max-w-md mx-auto">
                اسم بناه التجار والزبائن — ليس الإعلانات.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {REASONS.map((r) => (
                <div key={r.title} className="flex items-start gap-3.5 rounded-xl border border-border/50 bg-background p-4 transition-all duration-200 hover:border-border hover:shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: `${r.color}08`, border: `1px solid ${r.color}15` }}>
                    <r.icon className="h-4 w-4" style={{ color: r.color }} />
                  </div>
                  <div>
                    <h3 className="text-[0.84rem] font-bold text-foreground">{r.title}</h3>
                    <p className="mt-1 text-[0.74rem] leading-[1.6] text-muted-foreground">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <Link to="/about">
                <Button variant="outline-blue" className="h-9 rounded-xl px-5 text-[0.78rem] font-bold gap-1.5">
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
