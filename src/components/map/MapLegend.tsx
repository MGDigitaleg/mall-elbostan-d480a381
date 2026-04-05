export function MapLegend() {
  return (
    <div className="flex items-center gap-3.5">
      {[
        { fill: "#E2DDD5", stroke: "#9B9488", label: "مشغولة", darkFill: "#2A2826", darkStroke: "#6B6358" },
        { fill: "#FDE4C4", stroke: "#E8740E", label: "متاحة", darkFill: "#2A1D0D", darkStroke: "#E8740E" },
        { fill: "#C8E8F4", stroke: "#0A9AB8", label: "قريباً", darkFill: "#0D1F2A", darkStroke: "#0A9AB8" },
      ].map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span
            className="h-3.5 w-3.5 rounded dark:hidden"
            style={{ background: item.fill, border: `2px solid ${item.stroke}`, boxShadow: `0 0 0 1px ${item.stroke}20` }}
          />
          <span
            className="hidden h-3.5 w-3.5 rounded dark:block"
            style={{ background: item.darkFill, border: `2px solid ${item.darkStroke}`, boxShadow: `0 0 0 1px ${item.darkStroke}30` }}
          />
          <span className="text-[0.74rem] font-bold text-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
