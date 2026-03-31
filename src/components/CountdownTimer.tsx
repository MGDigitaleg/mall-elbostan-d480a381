import { useCountdown } from "@/hooks/useCountdown";

const OPENING_DATE = new Date("2026-05-01T00:00:00+02:00");

interface CountdownBlockProps {
  compact?: boolean;
  value: number;
  label: string;
}

function CountdownBlock({ value, label, compact = false }: CountdownBlockProps) {
  return (
    <div className="flex flex-col items-center gap-1.5 md:gap-2">
      <div className={`flex items-center justify-center border border-border bg-card ${compact ? "h-[4rem] w-[3.45rem] rounded-[0.95rem] md:h-[4.3rem] md:w-[3.7rem]" : "h-[5.25rem] w-[4.75rem] rounded-[1.125rem] md:h-[5.75rem] md:w-[5.25rem]"}`}>
        <span className={`font-bold text-primary font-poppins ${compact ? "text-[1.22rem] md:text-[1.45rem]" : "text-2xl md:text-[2rem]"}`}>
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className={`${compact ? "text-[0.68rem] md:text-xs" : "text-xs md:text-sm"} text-muted-foreground`}>{label}</span>
    </div>
  );
}

export function CountdownTimer({ compact = false }: { compact?: boolean }) {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(OPENING_DATE);

  if (isExpired) {
    return (
      <div className="text-center">
        <p className="text-2xl font-bold text-success">المول مفتوح الآن</p>
      </div>
    );
  }

  return (
    <div className={`flex justify-center ${compact ? "gap-1.5 md:gap-2" : "gap-2.5 md:gap-3"}`} dir="ltr">
      <CountdownBlock value={days} label="يوم" compact={compact} />
      <CountdownBlock value={hours} label="ساعة" compact={compact} />
      <CountdownBlock value={minutes} label="دقيقة" compact={compact} />
      <CountdownBlock value={seconds} label="ثانية" compact={compact} />
    </div>
  );
}
