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
        {/* Section header */}
        <div className="mb-12 flex items-center justify-center gap-3">
          <div
            className="h-px w-10"
            style={{ background: "linear-gradient(to left, #CDBB9A40, transparent)" }}
          />
          <p
            className="text-[0.7rem] font-bold tracking-[0.15em] uppercase"
            style={{ color: "#CDBB9A" }}
          >
            رحلة عبر الزمن
          </p>
          <div
            className="h-px w-10"
            style={{ background: "linear-gradient(to right, #CDBB9A40, transparent)" }}
          />
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
          {/* Central line */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-6 md:right-1/2 top-0 bottom-0 w-px origin-top"
            style={{
              background:
                "linear-gradient(to bottom, transparent, #CDBB9A30, #2563EB30, #CDBB9A30, transparent)",
            }}
          />

          <div className="space-y-8 md:space-y-10">
            {timelineEvents.map((event, i) => {
              const isEven = i % 2 === 0;
              return (
                <motion.div
                  key={event.year}
                  initial={{ opacity: 0, x: isEven ? 30 : -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{
                    duration: 0.55,
                    delay: i * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`relative flex items-start gap-4 md:gap-0 ${
                    isEven
                      ? "md:flex-row-reverse md:text-right"
                      : "md:flex-row md:text-right"
                  }`}
                >
                  {/* Dot */}
                  <div
                    className="absolute right-[18px] md:right-1/2 md:-translate-x-[-50%] top-1 z-10 h-3 w-3 rounded-full shrink-0"
                    style={{
                      background:
                        i === timelineEvents.length - 1
                          ? "#F97316"
                          : "#2563EB",
                      boxShadow:
                        i === timelineEvents.length - 1
                          ? "0 0 12px #F9731660"
                          : "0 0 10px #2563EB50",
                    }}
                  />

                  {/* Content card — always on left of the line on mobile, alternating on desktop */}
                  <div
                    className={`mr-10 md:mr-0 md:w-[calc(50%-2rem)] ${
                      isEven ? "md:mr-auto md:ml-0 md:pr-8" : "md:ml-auto md:mr-0 md:pr-8"
                    }`}
                  >
                    <div
                      className="group rounded-xl p-4 transition-all duration-300"
                      style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#CDBB9A22";
                        e.currentTarget.style.background = "rgba(205,187,154,0.04)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                        e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                      }}
                    >
                      <span
                        className="text-[0.72rem] font-bold tracking-wider"
                        style={{
                          color:
                            i === timelineEvents.length - 1
                              ? "#F97316"
                              : "#60A5FA",
                        }}
                      >
                        {event.year}
                      </span>
                      <p
                        className="mt-1 text-[0.92rem] font-bold"
                        style={{
                          color: "#F1F5F9",
                          fontFamily: "var(--font-arabic-display)",
                        }}
                      >
                        {event.title}
                      </p>
                      <p
                        className="mt-1.5 text-[0.76rem] leading-[1.85]"
                        style={{ color: "#7C8BA1" }}
                      >
                        {event.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
