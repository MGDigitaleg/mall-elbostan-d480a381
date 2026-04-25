import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Users, Layers, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/home/Reveal";

/**
 * "Why Mall Elbostan" — each card now has ONE primary destination so the
 * whole card is a meaningful internal link instead of a decorative tile.
 */
const REASONS: {
  icon: typeof Shield;
  title: string;
  desc: string;
  color: string;
  to: string;
  cta: string;
}[] = [
  {
    icon: Shield,
    title: "ثقة السوق",
    desc: "اسم معروف منذ ١٩٩٠ في سوق التقنية المصري.",
    color: "#2563EB",
    to: "/about",
    cta: "تعرّف على القصة",
  },
  {
    icon: Users,
    title: "تنوّع المحلات",
    desc: "+150 محل متخصص في كل فئات الإلكترونيات.",
    color: "#06B6D4",
    to: "/stores",
    cta: "تصفّح المحلات",
  },
  {
    icon: Layers,
    title: "موقع استراتيجي",
    desc: "في قلب التجمع الخامس — يخدم مدينتي والرحاب.",
    color: "#10B981",
    to: "/new-cairo-branch",
    cta: "فرع التجمع",
  },
  {
    icon: Clock,
    title: "تجربة متكاملة",
    desc: "خريطة تفاعلية، دليل رقمي، ومحلات متخصصة.",
    color: "#F97316",
    to: "/map",
    cta: "افتح الخريطة",
  },
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
                <Link
                  key={r.title}
                  to={r.to}
                  aria-label={`${r.title} — ${r.cta}`}
                  className="group flex flex-col items-start gap-2 rounded-xl border border-border/50 bg-background p-3 transition-all duration-200 hover:border-primary/40 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: `${r.color}08`, border: `1px solid ${r.color}15` }}
                  >
                    <r.icon className="h-4 w-4" style={{ color: r.color }} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[0.78rem] font-bold text-foreground transition-colors group-hover:text-primary">
                      {r.title}
                    </h3>
                    <p className="mt-0.5 text-[0.68rem] leading-[1.55] text-muted-foreground">{r.desc}</p>
                    <span className="mt-1.5 inline-flex items-center gap-1 text-[0.62rem] font-bold text-primary opacity-80 transition-opacity group-hover:opacity-100">
                      {r.cta}
                      <ArrowLeft className="h-2.5 w-2.5" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
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
