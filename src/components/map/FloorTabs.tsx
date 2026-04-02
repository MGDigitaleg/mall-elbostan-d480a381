import type { MallFloorId } from "@/lib/mallFloorGeometry";
import { mallFloors } from "@/lib/mallFloorGeometry";

type Props = {
  selected: MallFloorId;
  onChange: (id: MallFloorId) => void;
};

export function FloorTabs({ selected, onChange }: Props) {
  return (
    <div className="flex gap-px rounded-lg p-0.5" style={{ background: "#E2E8F0", border: "1px solid #CBD5E1" }}>
      {mallFloors.map((f) => {
        const isActive = selected === f.id;
        return (
          <button
            key={f.id}
            onClick={() => onChange(f.id)}
            className={`relative rounded-md px-4 py-1.5 text-[0.74rem] font-bold transition-all ${
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-foreground/50 hover:bg-card hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
