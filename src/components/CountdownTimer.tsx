import { useCountdown } from "@/hooks/useCountdown";

const OPENING_DATE = new Date("2026-05-01T00:00:00+02:00");

interface CountdownBlockProps {
  value: number;
  label: string;
}

function CountdownBlock({ value, label }: CountdownBlockProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex h-[5.25rem] w-[4.75rem] items-center justify-center rounded-[1.125rem] border border-border bg-card md:h-[5.75rem] md:w-[5.25rem]">
        <span className="text-2xl md:text-[2rem] font-bold text-primary font-poppins">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-xs md:text-sm text-muted-foreground">{label}</span>
    </div>
  );
}

export function CountdownTimer() {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(OPENING_DATE);

  if (isExpired) {
    return (
      <div className="text-center">
        <p className="text-2xl font-bold text-success">المول مفتوح الآن</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-2.5 md:gap-3" dir="ltr">
      <CountdownBlock value={days} label="يوم" />
      <CountdownBlock value={hours} label="ساعة" />
      <CountdownBlock value={minutes} label="دقيقة" />
      <CountdownBlock value={seconds} label="ثانية" />
    </div>
  );
}
