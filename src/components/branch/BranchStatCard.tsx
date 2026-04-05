import { motion } from "framer-motion";
import { useCountUp } from "@/hooks/useCountUp";
import { parseStatValue } from "@/lib/statUtils";

interface BranchStatCardProps {
  value: string;
  label: string;
  index: number;
}

export function BranchStatCard({ value, label, index }: BranchStatCardProps) {
  const parsed = parseStatValue(value);
  const isNumeric = parsed.num > 0;

  const { ref, display, started } = useCountUp({
    end: parsed.num,
    prefix: parsed.prefix,
    suffix: parsed.suffix,
    duration: 2000,
    startOnView: true,
  });

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
