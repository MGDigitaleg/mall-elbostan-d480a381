import { motion } from "framer-motion";
import { Gamepad2, Clock } from "lucide-react";

const reveal = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };
const fadeChild = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

interface Competition {
  id: string;
  title_ar: string;
  description_ar?: string | null;
  start_time?: string | null;
}

interface Props {
  competitions: Competition[];
}

export function OpeningGaming({ competitions }: Props) {
  return (
    <section className="section-soft page-section">
      <div className="container max-w-[1200px]">
        <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <div className="mb-8 flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ background: "hsl(var(--orange) / 0.06)", border: "1px solid hsl(var(--orange) / 0.15)" }}
            >
              <Gamepad2 className="h-5 w-5 text-orange" />
            </div>
            <div>
              <p className="section-kicker">المنافسة</p>
              <h2 className="section-title">مسابقات الألعاب</h2>
            </div>
          </div>

          {competitions.length > 0 ? (
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {competitions.map((comp) => (
                <motion.div
                  key={comp.id}
                  variants={fadeChild}
                  className="card-architectural p-6"
                  style={{ borderColor: "hsl(var(--orange) / 0.15)" }}
                >
                  <h3 className="mb-2 text-lg font-bold text-orange">{comp.title_ar}</h3>
                  {comp.description_ar && <p className="text-[0.85rem] leading-7 text-muted-foreground">{comp.description_ar}</p>}
                  {comp.start_time && (
                    <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-orange">
                      <Clock className="h-3 w-3" /> {comp.start_time}
                    </p>
                  )}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="section-shell p-8 text-center">
              <Gamepad2 className="mx-auto mb-3 h-7 w-7 text-orange" />
              <p className="text-sm font-semibold text-foreground">تفاصيل المسابقات قيد الإعداد</p>
              <p className="mx-auto mt-1 max-w-xs text-[0.82rem] text-muted-foreground">ستُعلن مع اقتراب الافتتاح</p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
