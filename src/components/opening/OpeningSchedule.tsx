import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";
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
    <section className="heritage-deep page-section">
      <div className="container max-w-[1200px]">
        <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          {/* Header */}
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: "hsl(var(--primary) / 0.08)", border: "1px solid hsl(var(--primary) / 0.15)" }}>
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="section-kicker">البرنامج</p>
              <h2 className="section-title" style={{ color: "#F8FAFC" }}>جدول الفعاليات</h2>
            </div>
          </div>

          {isLoading ? (
            <LoadingGrid count={3} />
          ) : events.length > 0 ? (
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <motion.div key={event.id} variants={fadeChild} className="heritage-surface overflow-hidden rounded-xl">
                  {event.image_url && (
                    <div className="aspect-[16/9] overflow-hidden">
                      <img src={event.image_url} alt={event.title_ar} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy" />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="mb-2 text-[0.95rem] font-bold" style={{ color: "#F8FAFC" }}>{event.title_ar}</h3>
                    {event.description_ar && (
                      <p className="mb-3 text-[0.82rem] leading-7" style={{ color: "hsl(220 15% 68%)" }}>{event.description_ar}</p>
                    )}
                    <div className="flex items-center gap-3 text-[0.72rem] font-semibold text-primary/70">
                      {event.start_time && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {event.start_time}
                        </span>
                      )}
                      {event.event_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {event.event_date}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="heritage-surface rounded-xl p-10 text-center">
              <Calendar className="mx-auto mb-3 h-8 w-8 text-primary/40" />
              <p className="text-[0.95rem] font-semibold" style={{ color: "#F8FAFC" }}>برنامج الفعاليات قيد الإعداد</p>
              <p className="mx-auto mt-1 max-w-xs text-sm" style={{ color: "hsl(220 12% 60%)" }}>سيُعلن مع اقتراب موعد الافتتاح</p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
