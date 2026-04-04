import { Link } from "react-router-dom";
import { Store, Map, ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const pillars = [
  {
    icon: Store,
    title: "دليل المحلات",
    desc: "وصول أوضح إلى كل محل وتخصصه.",
    link: "/stores",
    cta: "استكشف دليل المحلات",
  },
  {
    icon: Map,
    title: "الخريطة التفاعلية",
    desc: "معرفة مكان الوحدة وحالتها قبل الزيارة.",
    link: "/map",
    cta: "افتح الخريطة",
  },
  {
    icon: ShoppingBag,
    title: "منتجات المحلات",
    desc: "تصفح المنتجات المعروضة بشكل أقرب للواقع.",
    link: "/products",
    cta: "تصفح المنتجات",
  },
];

export function SceneTransition() {
  return (
    <section className="relative z-10 px-6 py-24 md:py-32">
      {/* Faint divider glow */}
      <div
        className="mx-auto mb-16 h-px max-w-xs"
        style={{
          background:
            "linear-gradient(90deg, transparent, #CDBB9A20, transparent)",
        }}
      />

      <div className="mx-auto max-w-2xl text-center echo-fade-up">
        <h2
          className="text-[1.3rem] md:text-[1.6rem] font-bold leading-[1.3] mb-4"
          style={{ color: "#F1F5F9" }}
        >
          واليوم، تتحول هذه الذاكرة إلى تجربة{" "}
          <span style={{ color: "#CDBB9A" }}>أوضح.</span>
        </h2>
        <p
          className="text-[0.82rem] leading-[1.95] max-w-lg mx-auto"
          style={{ color: "#94A3B8" }}
        >
          من اسم يتردد في السوق، إلى تجربة رقمية تساعدك على معرفة المحلات،
          ومواقعها، وما تعرضه، بشكل أسرع وأوضح.
        </p>
      </div>

      {/* Pillars */}
      <div className="mx-auto mt-14 grid max-w-2xl grid-cols-1 sm:grid-cols-3 gap-6">
        {pillars.map((p, i) => (
          <div
            key={p.title}
            className="echo-fade-up flex flex-col items-center text-center p-5"
            style={{ animationDelay: `${i * 120}ms` }}
          >
            <div
              className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg"
              style={{
                background: "rgba(205,187,154,0.06)",
                border: "1px solid rgba(205,187,154,0.1)",
              }}
            >
              <p.icon className="h-4 w-4" style={{ color: "#CDBB9A" }} />
            </div>
            <h3
              className="text-[0.92rem] font-bold mb-1.5"
              style={{ color: "#F1F5F9" }}
            >
              {p.title}
            </h3>
            <p
              className="text-[0.76rem] leading-[1.85]"
              style={{ color: "#7C8BA1" }}
            >
              {p.desc}
            </p>
          </div>
        ))}
      </div>

      {/* CTA row */}
      <div className="mx-auto mt-12 flex flex-wrap justify-center gap-3 max-w-2xl">
        {pillars.map((p) => (
          <Link key={p.link} to={p.link}>
            <Button
              variant="outline"
              className="h-10 rounded-xl px-5 text-[0.78rem] font-bold gap-2 border-white/10 bg-white/[0.02] text-slate-300 hover:bg-white/[0.05] hover:text-white"
            >
              {p.cta}
              <ArrowLeft className="h-3 w-3" />
            </Button>
          </Link>
        ))}
      </div>
    </section>
  );
}
