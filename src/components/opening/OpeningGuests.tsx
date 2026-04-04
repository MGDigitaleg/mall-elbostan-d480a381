import { motion } from "framer-motion";
import { Users, Star } from "lucide-react";

const reveal = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };
const fadeChild = { hidden: { opacity: 0, y: 14, scale: 0.97 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45 } } };

interface Guest {
  id: string;
  title_ar: string;
  image_url?: string | null;
  speaker_or_guest?: string | null;
}

interface Props {
  guests: Guest[];
}

export function OpeningGuests({ guests }: Props) {
  return (
    <section className="relative overflow-hidden py-12 md:py-16" style={{ background: "linear-gradient(165deg, #071326 0%, #0D1F3C 100%)" }}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-1/4 bottom-0 h-[250px] w-[350px] rounded-full opacity-[0.04]"
             style={{ background: "radial-gradient(circle, hsl(var(--primary)), transparent 70%)" }} />
      </div>

      <div className="relative container max-w-[1200px]">
        <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <div className="mb-10 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: "hsl(var(--primary) / 0.1)", border: "1px solid hsl(var(--primary) / 0.2)" }}>
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-poppins text-[0.56rem] font-bold uppercase tracking-[0.25em] text-primary/70">ضيوف الافتتاح</p>
              <h2 className="text-[1.15rem] font-bold md:text-[1.35rem]" style={{ color: "#F8FAFC", fontFamily: "var(--font-arabic-display)" }}>شخصيات مدعوة</h2>
            </div>
          </div>

          {guests.length > 0 ? (
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {guests.map((guest) => (
                <motion.div key={guest.id} variants={fadeChild}
                  className="group rounded-xl p-6 text-center transition-all hover:shadow-xl"
                  style={{ background: "hsl(220 45% 12% / 0.7)", border: "1px solid hsl(220 40% 22% / 0.4)" }}
                >
                  {guest.image_url ? (
                    <img
                      src={guest.image_url}
                      alt={guest.title_ar}
                      className="mx-auto mb-4 h-24 w-24 rounded-2xl border-2 object-cover transition-transform group-hover:scale-105"
                      style={{ borderColor: "hsl(var(--primary) / 0.2)" }}
                      loading="lazy"
                    />
                  ) : (
                    <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-2xl" style={{ background: "hsl(var(--primary) / 0.08)", border: "1px solid hsl(var(--primary) / 0.15)" }}>
                      <Star className="h-8 w-8 text-primary/40" />
                    </div>
                  )}
                  <h3 className="text-[0.92rem] font-bold" style={{ color: "#F8FAFC" }}>{guest.title_ar}</h3>
                  {guest.speaker_or_guest && (
                    <p className="mt-1 text-[0.76rem] font-semibold text-primary/70">{guest.speaker_or_guest}</p>
                  )}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="rounded-xl p-12 text-center" style={{ background: "hsl(220 45% 12% / 0.6)", border: "1px solid hsl(220 40% 22% / 0.3)" }}>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: "hsl(var(--primary) / 0.08)" }}>
                <Users className="h-7 w-7 text-primary/40" />
              </div>
               <p className="text-[1rem] font-bold" style={{ color: "#F8FAFC" }}>قائمة الضيوف قيد التأكيد</p>
              <p className="mx-auto mt-2 max-w-xs text-[0.84rem]" style={{ color: "hsl(220 12% 58%)" }}>ستُحدّث مع اقتراب الافتتاح.</p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
