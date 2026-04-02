export function MapLegend() {
  return (
    <div className="flex items-center gap-5">
      {[
        { fill: "#DDD8D0", stroke: "#9B9488", label: "مشغولة" },
        { fill: "#FDE4C4", stroke: "#E8740E", label: "متاحة" },
        { fill: "#C8E8F4", stroke: "#0A9AB8", label: "قريبًا" },
      ].map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span
            className="h-3 w-3 rounded-[3px]"
            style={{ background: item.fill, border: `1.5px solid ${item.stroke}` }}
          />
          <span className="text-[0.75rem] font-semibold text-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
