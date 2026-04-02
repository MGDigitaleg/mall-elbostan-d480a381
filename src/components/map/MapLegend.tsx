export function MapLegend() {
  return (
    <div className="flex items-center gap-3">
      {[
        { fill: "#E2DDD5", stroke: "#9B9488", label: "مشغولة" },
        { fill: "#FDE4C4", stroke: "#E8740E", label: "متاحة" },
        { fill: "#C8E8F4", stroke: "#0A9AB8", label: "قريبًا" },
      ].map((item) => (
        <div key={item.label} className="flex items-center gap-1">
          <span
            className="h-3 w-3 rounded-sm"
            style={{ background: item.fill, border: `1.5px solid ${item.stroke}` }}
          />
          <span className="text-[0.72rem] font-bold" style={{ color: "#334155" }}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
