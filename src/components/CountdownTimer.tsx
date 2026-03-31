import { useCountdown } from "@/hooks/useCountdown";

const OPENING_DATE = new Date("2026-05-01T00:00:00+02:00");

interface CountdownBlockProps {
  value: number;
  label: string;
}

function CountdownBlock({ value, label }: CountdownBlockProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-secondary border border-border flex items-center justify-center">
        <span className="text-2xl md:text-3xl font-bold text-primary font-poppins">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-xs md:text-sm text-muted-foreground mt-2">{label}</span>
    </div>
  );
}

export function CountdownTimer() {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(OPENING_DATE);

  if (isExpired) {
    return (
      <div className="text-center">
        <p className="text-2xl font-bold text-success">🎉 المول مفتوح الآن!</p>
      </div>
    );
  }

  return (
    <div className="flex gap-3 md:gap-4 justify-center" dir="ltr">
      <CountdownBlock value={days} label="يوم" />
      <CountdownBlock value={hours} label="ساعة" />
      <CountdownBlock value={minutes} label="دقيقة" />
      <CountdownBlock value={seconds} label="ثانية" />
    </div>
  );
}
