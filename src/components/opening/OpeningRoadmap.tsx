import { motion } from "framer-motion";
import { CheckCircle, ArrowLeft } from "lucide-react";

const stagger = { visible: { transition: { staggerChildren: 0.12 } } };
const fadeChild = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } } };

const steps = [
  { n: "01", title: "تصفّح الفعاليات", text: "اطّلع على جدول يوم الافتتاح واختر ما يناسبك.", color: "hsl(var(--primary))" },
  { n: "02", title: "شارك في أدر واربح", text: "أدر العجلة واحتفظ بنتيجتك — المكافأة بانتظارك يوم الافتتاح.", color: "hsl(25 95% 55%)" },
  { n: "03", title: "تابع هذه الصفحة", text: "البرنامج النهائي وآخر التحديثات ستُضاف هنا أولاً.", color: "hsl(190 85% 40%)" },
];

export function OpeningRoadmap() {
  return (
    <section className="py-10 md:py-14 bg-secondary dark:bg-background">
      <div className="container max-w-[1200px]">
        <div className="mb-6 text-center">
          <p className="font-poppins text-[0.56rem] font-bold uppercase tracking-[0.25em] text-primary">قبل الزيارة</p>
          <h2 className="mt-1.5 text-[1.1rem] font-bold md:text-[1.25rem] text-foreground" style={{ fontFamily: "var(--font-arabic-display)" }}>
            جهّز نفسك في ثلاث خطوات
          </h2>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid gap-4 md:grid-cols-3"
        >
          {steps.map((item, i) => (
            <motion.div
              key={item.n}
              variants={fadeChild}
              className="group relative rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:border-primary/20"
            >
              {/* Step number accent */}
              <div className="flex items-center justify-between mb-4">
                <span className="font-poppins text-[2rem] font-extrabold leading-none" style={{ color: `${item.color}15` }}>{item.n}</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${item.color}10` }}>
                  <CheckCircle className="h-4 w-4" style={{ color: item.color }} />
                </div>
              </div>
              <h3 className="text-[0.92rem] font-bold text-foreground mb-2">{item.title}</h3>
              <p className="text-[0.82rem] leading-[1.8] text-muted-foreground">{item.text}</p>

              {/* Connector line (not on last) */}
              {i < steps.length - 1 && (
                <ArrowLeft className="absolute left-[-18px] top-1/2 hidden h-4 w-4 -translate-y-1/2 text-muted-foreground/20 md:block" />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
