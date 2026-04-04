import { useRef } from "react";

const meanings = [
  {
    phrase: "انزل البستان",
    meaning: "بداية البحث عن الخيارات المناسبة في عالم التقنية.",
  },
  {
    phrase: "لف البستان الأول",
    meaning: "المقارنة بين المحلات والأسعار قبل اتخاذ القرار.",
  },
  {
    phrase: "اسأل في البستان",
    meaning: "الرجوع إلى مكان ارتبط بالخبرة والثقة والمعرفة.",
  },
  {
    phrase: "أسعار البستان",
    meaning: "اسم صار عند كثيرين مرجعًا للمقارنة وتقدير السعر العادل.",
  },
];

function MeaningBlock({
  phrase,
  meaning,
  index,
}: {
  phrase: string;
  meaning: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className="echo-fade-up group py-5 border-b last:border-b-0"
      style={{
        borderColor: "rgba(255,255,255,0.05)",
        animationDelay: `${index * 150}ms`,
      }}
    >
      <p
        className="text-[1rem] md:text-[1.1rem] font-bold mb-1.5"
        style={{ color: "#CDBB9A" }}
      >
        {phrase}
      </p>
      <p
        className="text-[0.8rem] md:text-[0.85rem] leading-[1.9]"
        style={{ color: "#7C8BA1" }}
      >
        {meaning}
      </p>
    </div>
  );
}

export function SceneMeaning() {
  return (
    <section className="relative z-10 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-lg">
        {/* Heading */}
        <div className="echo-fade-up mb-3">
          <div className="flex items-center gap-3 mb-5">
            <div
              className="h-px w-8"
              style={{
                background:
                  "linear-gradient(to left, #CDBB9A40, transparent)",
              }}
            />
            <span
              className="text-[0.6rem] font-bold tracking-[0.15em] uppercase"
              style={{ color: "#CDBB9A" }}
            >
              صدى السوق
            </span>
          </div>
          <h2
            className="text-[1.3rem] md:text-[1.6rem] font-bold mb-4 leading-[1.3]"
            style={{ color: "#F1F5F9" }}
          >
            ماذا كان الناس يقصدون؟
          </h2>
          <p
            className="text-[0.82rem] leading-[1.95]"
            style={{ color: "#94A3B8" }}
          >
            هذه العبارات لم تكن أمثالًا فقط، بل اختصارًا لتجربة شراء مفهومة في
            مكان معروف.
          </p>
        </div>

        {/* Meaning blocks */}
        <div className="mt-10">
          {meanings.map((m, i) => (
            <MeaningBlock key={m.phrase} {...m} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
