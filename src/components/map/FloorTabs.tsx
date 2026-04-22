import type { MallFloorId } from "@/lib/mallFloorGeometry";
import { mallFloors } from "@/lib/mallFloorGeometry";

type Props = {
  selected: MallFloorId;
  onChange: (id: MallFloorId) => void;
};

export function FloorTabs({ selected, onChange }: Props) {
  return (
    <div className="flex gap-1 border-b border-border">
      {mallFloors.map((f) => {
        const isActive = selected === f.id;
        return (
          <button
            key={f.id}
            onClick={() => onChange(f.id)}
            className={`relative px-5 py-2.5 text-sm font-bold transition-colors duration-200 ${
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label}
            {isActive && (
              <span className="absolute inset-x-1 -bottom-px h-0.5 rounded-full bg-primary" />
            )}
          </button>
        );
      })}
    </div>
  );
}
