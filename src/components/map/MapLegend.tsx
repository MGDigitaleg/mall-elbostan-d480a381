export function MapLegend() {
  return (
    <div className="flex items-center gap-3">
      {[
        { color: "bg-[#CEC5B6]", border: "border-[#8B8174]", label: "مشغولة" },
        { color: "bg-[#FDE8D0]", border: "border-orange", label: "متاحة" },
        { color: "bg-[#D4EDF7]", border: "border-accent", label: "قريبًا" },
      ].map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span className={`h-3 w-3 rounded-sm border ${item.border} ${item.color}`} />
          <span className="text-[0.72rem] font-medium text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
