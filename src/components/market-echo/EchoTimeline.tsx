import { motion } from "framer-motion";

const timelineEvents = [
  {
    year: "١٩٩٠",
    title: "البداية",
    desc: "افتتاح مول البستان في وسط البلد كأول وجهة متخصصة في الإلكترونيات والتقنية بالقاهرة.",
  },
  {
    year: "١٩٩٥",
    title: "بداية الانتشار",
    desc: "أصبح المول مرجعًا أساسيًا لكل من يبحث عن أجهزة الكمبيوتر وقطع الغيار في مصر.",
  },
  {
    year: "٢٠٠٠",
    title: "عصر الإنترنت",
    desc: "مع انتشار الإنترنت، تحوّل البستان إلى مركز لخدمات الشبكات وتجميع الأجهزة.",
  },
  {
    year: "٢٠٠٥",
    title: "توسع التشكيلة",
    desc: "دخول الموبايلات والإكسسوارات الذكية ضمن عروض المحلات وتنوّع التجار.",
  },
  {
    year: "٢٠١٠",
    title: "الجيل الجديد",
    desc: "جيل جديد من رواد الأعمال والتجار يبدأ رحلته من داخل البستان.",
  },
  {
    year: "٢٠١٥",
    title: "ثقة السوق",
    desc: "اسم البستان يصبح مرادفًا للثقة والسعر العادل في سوق التقنية المصري.",
  },
  {
    year: "٢٠٢٠",
    title: "التحول الرقمي",
    desc: "بدء التخطيط لنقل تجربة البستان إلى العالم الرقمي مع الحفاظ على الهوية.",
  },
  {
    year: "٢٠٢٦",
    title: "فرع القاهرة الجديدة",
    desc: "افتتاح فرع القاهرة الجديدة بتجربة حديثة تجمع بين إرث ٣٥ سنة وأحدث التقنيات.",
  },
];

function TimelineCard({
  event,
  index,
  isLast,
}: {
  event: (typeof timelineEvents)[number];
  index: number;
  isLast: boolean;
}) {
  const isRight = index % 2 === 0; // RTL: even = right side, odd = left side

  return (
    <div className="relative md:grid md:grid-cols-[1fr_auto_1fr] md:gap-0">
      {/* Right-side content (even indices) */}
      <div className={`hidden md:block ${isRight ? "" : ""}`}>
        {isRight ? (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.55, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-start pr-8"
          >
            <CardContent event={event} index={index} isLast={isLast} />
          </motion.div>
        ) : (
          <div />
        )}
      </div>

      {/* Center line + dot */}
      <div className="absolute right-6 md:relative md:right-auto flex flex-col items-center">
        <div
          className="z-10 h-3.5 w-3.5 rounded-full shrink-0 ring-4"
          style={{
            background: isLast ? "#F97316" : "#2563EB",
            boxShadow: isLast ? "0 0 16px #F9731660" : "0 0 14px #2563EB40",
            ringColor: isLast ? "rgba(249,115,22,0.1)" : "rgba(37,99,235,0.1)",
          }}
        />
        {!isLast && (
          <div
            className="w-px flex-1 min-h-[3rem]"
            style={{
              background: "linear-gradient(to bottom, #CDBB9A25, #2563EB15)",
            }}
          />
        )}
      </div>

      {/* Left-side content (odd indices) */}
      <div className={`hidden md:block ${!isRight ? "" : ""}`}>
        {!isRight ? (
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.55, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-end pl-8"
          >
            <CardContent event={event} index={index} isLast={isLast} />
          </motion.div>
        ) : (
          <div />
        )}
      </div>

      {/* Mobile: always on the left of the line */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-30px" }}
        transition={{ duration: 0.5, delay: index * 0.06 }}
        className="mr-10 md:hidden pb-6"
      >
        <CardContent event={event} index={index} isLast={isLast} />
      </motion.div>
    </div>
  );
}

function CardContent({
  event,
  index,
  isLast,
}: {
  event: (typeof timelineEvents)[number];
  index: number;
  isLast: boolean;
}) {
  return (
    <div
      className="group max-w-sm rounded-xl p-4 transition-all duration-300 cursor-default"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = isLast ? "#F9731630" : "#CDBB9A22";
        e.currentTarget.style.background = isLast
          ? "rgba(249,115,22,0.04)"
          : "rgba(205,187,154,0.04)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
        e.currentTarget.style.background = "rgba(255,255,255,0.02)";
      }}
    >
      <span
        className="text-[0.72rem] font-bold tracking-wider"
        style={{ color: isLast ? "#F97316" : "#60A5FA" }}
      >
        {event.year}
      </span>
      <p
        className="mt-1 text-[0.92rem] font-bold"
        style={{ color: "#F1F5F9", fontFamily: "var(--font-arabic-display)" }}
      >
        {event.title}
      </p>
      <p className="mt-1.5 text-[0.76rem] leading-[1.85]" style={{ color: "#7C8BA1" }}>
        {event.desc}
      </p>
    </div>
  );
}

export function EchoTimeline() {
  return (
    <div className="container mt-20 lg:mt-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-4xl"
      >
        {/* Header */}
        <div className="mb-10 flex items-center justify-center gap-3">
          <div className="h-px w-10" style={{ background: "linear-gradient(to left, #CDBB9A40, transparent)" }} />
          <p className="text-[0.7rem] font-bold tracking-[0.15em] uppercase" style={{ color: "#CDBB9A" }}>
            رحلة عبر الزمن
          </p>
          <div className="h-px w-10" style={{ background: "linear-gradient(to right, #CDBB9A40, transparent)" }} />
        </div>

        <motion.h3
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center text-[1.3rem] md:text-[1.6rem] font-bold mb-14"
          style={{ color: "#F8FAFC", fontFamily: "var(--font-arabic-display)" }}
        >
          ٣٥ سنة من الثقة
          <span style={{ color: "#CDBB9A" }}> والتطور</span>
        </motion.h3>

        {/* Timeline */}
        <div className="relative">
          {timelineEvents.map((event, i) => (
            <TimelineCard
              key={event.year}
              event={event}
              index={i}
              isLast={i === timelineEvents.length - 1}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
