import { motion } from "framer-motion";
import { Users } from "lucide-react";

const reveal = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };
const fadeChild = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

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
    <section className="page-section">
      <div className="container max-w-[1200px]">
        <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <div className="mb-8 flex items-center gap-3">
            <div className="icon-shell h-10 w-10">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="section-kicker">شخصيات مرتقبة</p>
              <h2 className="section-title">الضيوف والشخصيات</h2>
            </div>
          </div>

          {guests.length > 0 ? (
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {guests.map((guest) => (
                <motion.div key={guest.id} variants={fadeChild} className="card-editorial p-6 text-center">
                  {guest.image_url && (
                    <img
                      src={guest.image_url}
                      alt={guest.title_ar}
                      className="mx-auto mb-4 h-20 w-20 rounded-full border-2 border-border object-cover"
                      loading="lazy"
                    />
                  )}
                  <h3 className="font-bold text-foreground">{guest.title_ar}</h3>
                  {guest.speaker_or_guest && <p className="mt-1 text-sm text-accent">{guest.speaker_or_guest}</p>}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="section-shell p-8 text-center">
              <Users className="mx-auto mb-3 h-7 w-7 text-muted-foreground" />
              <p className="text-sm font-semibold text-foreground">تفاصيل الضيوف قيد التأكيد</p>
              <p className="mx-auto mt-1 max-w-xs text-[0.82rem] text-muted-foreground">ستتوفر قريبًا مع اقتراب الافتتاح</p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
