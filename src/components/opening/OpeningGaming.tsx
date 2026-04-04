import { motion } from "framer-motion";
import { Gamepad2, Clock, Trophy } from "lucide-react";

const reveal = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };
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
    <section className="py-12 md:py-16" style={{ background: "hsl(38 25% 96%)" }}>
      <div className="container max-w-[1200px]">
        <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <div className="mb-10 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl"
                 style={{ background: "hsl(25 95% 55% / 0.08)", border: "1px solid hsl(25 95% 55% / 0.15)" }}>
              <Gamepad2 className="h-5 w-5" style={{ color: "hsl(25 95% 50%)" }} />
            </div>
            <div>
              <p className="font-poppins text-[0.56rem] font-bold uppercase tracking-[0.25em]" style={{ color: "hsl(25 85% 45%)" }}>جيمنج</p>
              <h2 className="text-[1.15rem] font-bold md:text-[1.35rem] text-foreground" style={{ fontFamily: "var(--font-arabic-display)" }}>بطولات ومسابقات</h2>
            </div>
          </div>

          {competitions.length > 0 ? (
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {competitions.map((comp) => (
                <motion.div
                  key={comp.id}
                  variants={fadeChild}
                  className="group rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:border-orange-300/30"
                  style={{ borderColor: "hsl(25 95% 55% / 0.12)" }}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-[1rem] font-bold" style={{ color: "hsl(25 85% 40%)" }}>{comp.title_ar}</h3>
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: "hsl(25 95% 55% / 0.08)" }}>
                      <Trophy className="h-4 w-4" style={{ color: "hsl(25 95% 50%)" }} />
                    </div>
                  </div>
                  {comp.description_ar && <p className="text-[0.85rem] leading-[1.8] text-muted-foreground">{comp.description_ar}</p>}
                  {comp.start_time && (
                    <div className="mt-4 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[0.72rem] font-bold"
                         style={{ background: "hsl(25 95% 55% / 0.06)", color: "hsl(25 85% 40%)", border: "1px solid hsl(25 95% 55% / 0.12)" }}>
                      <Clock className="h-3 w-3" /> {comp.start_time}
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: "hsl(25 95% 55% / 0.06)" }}>
                <Gamepad2 className="h-7 w-7" style={{ color: "hsl(25 85% 45%)" }} />
              </div>
              <p className="text-[0.95rem] font-bold text-foreground">تفاصيل المسابقات قيد الإعداد</p>
              <p className="mx-auto mt-2 max-w-xs text-[0.82rem] text-muted-foreground">ستُعلن مع اقتراب الافتتاح — تابع هذه الصفحة</p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
