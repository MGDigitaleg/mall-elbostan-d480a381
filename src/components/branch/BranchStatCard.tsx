import { motion } from "framer-motion";
import { useCountUp } from "@/hooks/useCountUp";
import { parseStatValue } from "@/lib/statUtils";

interface BranchStatCardProps {
  value: string;
  label: string;
  sub?: string;
  index: number;
  variant?: "branch" | "about";
}

export function BranchStatCard({ value, label, sub, index, variant = "branch" }: BranchStatCardProps) {
  const parsed = parseStatValue(value);
  const isNumeric = parsed.num > 0;

  const { ref, display, started } = useCountUp({
    end: parsed.num,
    prefix: parsed.prefix,
    suffix: parsed.suffix,
    duration: variant === "about" ? 2200 : 2000,
    startOnView: true,
  });

  if (variant === "about") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1, duration: 0.45 }}
        className="relative rounded-2xl p-5 text-center overflow-hidden"
        style={{ background: "hsla(220, 45%, 13%, 0.8)", border: "1px solid hsla(0, 0%, 100%, 0.06)", boxShadow: "0 4px 24px hsla(220, 60%, 5%, 0.3)" }}
      >
        <div className="absolute inset-0 opacity-[0.03]" style={{ background: "linear-gradient(135deg, #2563EB, transparent 60%)" }} />
        <div
          className="absolute inset-0 transition-opacity duration-1000 rounded-2xl"
          style={{ opacity: started ? 0.06 : 0, boxShadow: "inset 0 0 30px hsla(38, 30%, 70%, 0.3)" }}
        />
        <p
          ref={ref as React.Ref<HTMLParagraphElement>}
          className="relative font-poppins text-[1.6rem] md:text-[1.9rem] font-extrabold leading-none"
          style={{ color: "#F8FAFC" }}
        >
          {isNumeric ? display : value}
        </p>
        <p className="relative mt-1.5 text-[0.88rem] font-bold" style={{ color: "#CDBB9A" }}>
          {label}
        </p>
        {sub && (
          <p className="relative mt-1 text-[0.7rem] leading-[1.5]" style={{ color: "#94A3B8" }}>
            {sub}
          </p>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="rounded-xl px-4 py-5 text-center transition-all duration-1000"
      style={{
        background: started ? "hsla(38, 30%, 70%, 0.06)" : "#ffffff06",
        border: `1px solid ${started ? "hsla(38, 30%, 70%, 0.1)" : "#ffffff0D"}`,
      }}
    >
      <p
        ref={ref as React.Ref<HTMLParagraphElement>}
        className="font-poppins text-[1.4rem] font-extrabold"
        style={{ color: "#F8FAFC" }}
      >
        {isNumeric ? display : value}
      </p>
      <p className="mt-1 text-[0.72rem] font-semibold" style={{ color: "#7C8BA1" }}>{label}</p>
    </motion.div>
  );
}
