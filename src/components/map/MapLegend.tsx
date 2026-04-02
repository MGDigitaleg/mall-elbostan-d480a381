export function MapLegend() {
  return (
    <div className="flex items-center gap-4">
      {[
        { fill: "#B5AC9D", stroke: "#8B8174", label: "مشغولة" },
        { fill: "#F97316", stroke: "#F97316", label: "متاحة" },
        { fill: "#06B6D4", stroke: "#06B6D4", label: "قريبًا" },
      ].map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <span
            className="h-3.5 w-3.5 rounded"
            style={{ background: item.fill, border: `1.5px solid ${item.stroke}`, opacity: item.label === "مشغولة" ? 0.7 : 1 }}
          />
          <span className="text-[0.78rem] font-semibold text-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
