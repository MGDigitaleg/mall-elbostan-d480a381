import type { MallFloorId } from "@/lib/mallFloorGeometry";
import { mallFloors } from "@/lib/mallFloorGeometry";

type Props = {
  selected: MallFloorId;
  onChange: (id: MallFloorId) => void;
};

export function FloorTabs({ selected, onChange }: Props) {
  return (
    <div className="flex gap-1.5 rounded-xl border border-border bg-secondary/50 p-1">
      {mallFloors.map((f) => (
        <button
          key={f.id}
          onClick={() => onChange(f.id)}
          className={`rounded-lg px-5 py-2.5 text-[0.82rem] font-semibold transition-all ${
            selected === f.id
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-card hover:text-foreground"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
