import { motion } from "framer-motion";

const stagger = { visible: { transition: { staggerChildren: 0.08 } } };
const fadeChild = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const steps = [
  { n: "01", text: "اطّلع على الفعاليات وخطّط زيارتك." },
  { n: "02", text: "شارك في المكافآت واحتفظ بنتيجتك." },
  { n: "03", text: "تابع هذه الصفحة لمعرفة البرنامج النهائي." },
];

export function OpeningRoadmap() {
  return (
    <section className="section-ivory py-10 md:py-14">
      <div className="container max-w-[1200px]">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid gap-4 md:grid-cols-3"
        >
          {steps.map((item) => (
            <motion.div key={item.n} variants={fadeChild} className="card-architectural p-5">
              <span className="font-poppins text-xs font-bold text-primary">{item.n}</span>
              <p className="mt-3 text-sm leading-7 text-foreground">{item.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
