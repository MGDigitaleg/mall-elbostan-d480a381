import { motion } from "framer-motion";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { LoadingGrid } from "@/components/ui/loading-states";

const reveal = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };
const fadeChild = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

interface Event {
  id: string;
  title_ar: string;
  description_ar?: string | null;
  image_url?: string | null;
  start_time?: string | null;
  event_date?: string | null;
}

interface Props {
  events: Event[];
  isLoading: boolean;
}

export function OpeningSchedule({ events, isLoading }: Props) {
  return (
    <section className="relative overflow-hidden py-12 md:py-16" style={{ background: "linear-gradient(165deg, #050E1C 0%, #0B1B34 40%, #0D1F3C 100%)" }}>
      {/* Subtle ambient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/3 top-0 h-[300px] w-[400px] rounded-full opacity-[0.04]"
             style={{ background: "radial-gradient(circle, hsl(var(--primary)), transparent 70%)" }} />
      </div>

      <div className="relative container max-w-[1200px]">
        <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          {/* Header */}
          <div className="mb-10 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: "hsl(var(--primary) / 0.1)", border: "1px solid hsl(var(--primary) / 0.2)" }}>
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-poppins text-[0.56rem] font-bold uppercase tracking-[0.25em] text-primary/70">فعاليات الافتتاح</p>
              <h2 className="text-[1.15rem] font-bold md:text-[1.35rem]" style={{ color: "#F8FAFC", fontFamily: "var(--font-arabic-display)" }}>جدول اليوم</h2>
            </div>
          </div>

          {isLoading ? (
            <LoadingGrid count={3} />
          ) : events.length > 0 ? (
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <motion.div key={event.id} variants={fadeChild}
                  className="group overflow-hidden rounded-xl transition-all hover:shadow-xl"
                  style={{ background: "hsl(220 45% 12% / 0.8)", border: "1px solid hsl(220 40% 22% / 0.4)", backdropFilter: "blur(12px)" }}
                >
                  {event.image_url && (
                    <div className="aspect-[16/9] overflow-hidden">
                      <img src={event.image_url} alt={event.title_ar} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="mb-2 text-[0.95rem] font-bold" style={{ color: "#F8FAFC" }}>{event.title_ar}</h3>
                    {event.description_ar && (
                      <p className="mb-3 text-[0.82rem] leading-[1.8]" style={{ color: "hsl(220 15% 65%)" }}>{event.description_ar}</p>
                    )}
                    <div className="flex items-center gap-3 text-[0.72rem] font-semibold">
                      {event.start_time && (
                        <span className="flex items-center gap-1.5 rounded-lg px-2.5 py-1" style={{ background: "hsl(var(--primary) / 0.08)", color: "hsl(var(--primary))" }}>
                          <Clock className="h-3 w-3" /> {event.start_time}
                        </span>
                      )}
                      {event.event_date && (
                        <span className="flex items-center gap-1.5 rounded-lg px-2.5 py-1" style={{ background: "hsl(0 0% 100% / 0.04)", color: "hsl(220 14% 60%)" }}>
                          <Calendar className="h-3 w-3" /> {event.event_date}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="rounded-xl p-12 text-center" style={{ background: "hsl(220 45% 12% / 0.6)", border: "1px solid hsl(220 40% 22% / 0.3)" }}>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: "hsl(var(--primary) / 0.08)" }}>
                <Calendar className="h-7 w-7 text-primary/50" />
              </div>
               <p className="text-[1rem] font-bold" style={{ color: "#F8FAFC" }}>البرنامج قيد الإعداد</p>
              <p className="mx-auto mt-2 max-w-xs text-[0.84rem] leading-relaxed" style={{ color: "hsl(220 12% 58%)" }}>
                سيُعلن مع اقتراب الافتتاح — تابع هذه الصفحة.
              </p>
              <Link to="/contact" className="mt-4 inline-flex items-center gap-1.5 text-[0.78rem] font-bold text-primary transition-all hover:gap-2.5">
                تواصل معنا <ArrowLeft className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
