import type { MallFloorId } from "@/lib/mallFloorGeometry";
import { mallFloors } from "@/lib/mallFloorGeometry";

type Props = {
  selected: MallFloorId;
  onChange: (id: MallFloorId) => void;
};

export function FloorTabs({ selected, onChange }: Props) {
  return (
    <div className="flex gap-0.5 rounded-xl p-1" style={{ background: "#F0EBE3", border: "1px solid #D8DEE8" }}>
      {mallFloors.map((f) => {
        const isActive = selected === f.id;
        return (
          <button
            key={f.id}
            onClick={() => onChange(f.id)}
            className={`relative rounded-lg px-5 py-2.5 text-[0.82rem] font-bold transition-all ${
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-foreground/60 hover:bg-card hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
