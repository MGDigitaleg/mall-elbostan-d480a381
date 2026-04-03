export function MapLegend() {
  return (
    <div className="flex items-center gap-3.5">
      {[
        { fill: "#E2DDD5", stroke: "#9B9488", label: "مشغولة" },
        { fill: "#FDE4C4", stroke: "#E8740E", label: "متاحة" },
        { fill: "#C8E8F4", stroke: "#0A9AB8", label: "قريبًا" },
      ].map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span
            className="h-3.5 w-3.5 rounded"
            style={{ background: item.fill, border: `2px solid ${item.stroke}`, boxShadow: `0 0 0 1px ${item.stroke}20` }}
          />
          <span className="text-[0.74rem] font-bold" style={{ color: "#334155" }}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
