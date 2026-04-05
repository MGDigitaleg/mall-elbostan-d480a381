import type { MallFloorId } from "@/lib/mallFloorGeometry";
import { mallFloors } from "@/lib/mallFloorGeometry";

type Props = {
  selected: MallFloorId;
  onChange: (id: MallFloorId) => void;
};

export function FloorTabs({ selected, onChange }: Props) {
  return (
    <div className="flex gap-0.5 rounded-xl p-1 bg-secondary border border-border">
      {mallFloors.map((f) => {
        const isActive = selected === f.id;
        return (
          <button
            key={f.id}
            onClick={() => onChange(f.id)}
            className={`relative rounded-lg px-5 py-2 text-[0.76rem] font-bold transition-all duration-200 ${
              isActive
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "text-muted-foreground hover:bg-card/80 hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
