import { useState } from "react";
import { motion } from "framer-motion";
import { HelpCircle, ChevronDown } from "lucide-react";

const reveal = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const faqs = [
  { q: "متى موعد الافتتاح؟", a: "يوم ١ مايو ٢٠٢٦ — ساعات العمل الرسمية ستُعلن مع اقتراب الموعد." },
  { q: "كيف أشارك في أدر واربح؟", a: "ادخل صفحة أدر واربح، سجّل ببياناتك، وأدر العجلة. كل رقم هاتف له فرصة واحدة." },
  { q: "هل يمكن استلام الجائزة بدون حضور؟", a: "لا — يجب الحضور شخصيًا يوم الافتتاح وإبراز شاشة الفوز للاستلام." },
  { q: "أين يقع مول البستان؟", a: "التجمع الخامس، القاهرة الجديدة — بالقرب من مدينتي والرحاب. زُر صفحة الفرع للموقع الدقيق." },
  { q: "هل يوجد مواقف سيارات؟", a: "نعم، جراج متعدد الطوابق بسعة كبيرة." },
  { q: "كيف أتواصل مع الإدارة؟", a: "من صفحة تواصل معنا أو عبر واتساب في أسفل الموقع." },
];

export function OpeningFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-12 md:py-16" style={{ background: "hsl(38 25% 96%)" }}>
      <div className="container max-w-[860px]">
        <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          {/* Header */}
          <div className="mb-10 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                 style={{ background: "hsl(var(--primary) / 0.06)", border: "1px solid hsl(var(--primary) / 0.12)" }}>
              <HelpCircle className="h-5 w-5 text-primary" />
            </div>
            <p className="font-poppins text-[0.56rem] font-bold uppercase tracking-[0.25em] text-primary">أسئلة شائعة</p>
            <h2 className="mt-1.5 text-[1.15rem] font-bold md:text-[1.35rem] text-foreground mx-auto max-w-[22rem]"
                style={{ fontFamily: "var(--font-arabic-display)" }}>
              كل ما تحتاج معرفته قبل الافتتاح
            </h2>
          </div>

          {/* FAQ Items */}
          <div className="space-y-2.5">
            {faqs.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={i}
                  className="overflow-hidden rounded-xl border transition-all"
                  style={{
                    background: isOpen ? "hsl(0 0% 100%)" : "hsl(0 0% 100% / 0.7)",
                    borderColor: isOpen ? "hsl(var(--primary) / 0.15)" : "hsl(220 20% 88%)",
                    boxShadow: isOpen ? "0 4px 16px hsl(220 30% 10% / 0.06)" : "none",
                  }}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="flex w-full items-center gap-4 px-5 py-4 text-right transition-colors hover:bg-primary/[0.02]"
                  >
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-poppins text-[0.68rem] font-bold transition-colors"
                      style={{
                        background: isOpen ? "hsl(var(--primary) / 0.1)" : "hsl(220 20% 95%)",
                        color: isOpen ? "hsl(var(--primary))" : "hsl(220 15% 50%)",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 text-[0.88rem] font-bold text-foreground">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className="h-4 w-4 shrink-0 transition-transform duration-300"
                      style={{
                        color: isOpen ? "hsl(var(--primary))" : "hsl(220 14% 55%)",
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    />
                  </button>
                  <div
                    className="grid transition-all duration-300"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 pr-16 text-[0.84rem] leading-[1.9] text-muted-foreground">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
