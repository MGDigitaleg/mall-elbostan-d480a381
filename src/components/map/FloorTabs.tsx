import type { MallFloorId } from "@/lib/mallFloorGeometry";
import { mallFloors } from "@/lib/mallFloorGeometry";

type Props = {
  selected: MallFloorId;
  onChange: (id: MallFloorId) => void;
};

export function FloorTabs({ selected, onChange }: Props) {
  return (
    <div className="flex gap-2 border-b border-border bg-muted/30 px-2 pt-2">
      {mallFloors.map((f) => {
        const isActive = selected === f.id;
        return (
          <button
            key={f.id}
            onClick={() => onChange(f.id)}
            className={`relative rounded-t-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 md:px-6 md:text-base ${
              isActive
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <span className="relative z-10">{f.label}</span>
            {isActive && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 bg-primary" />
            )}
          </button>
        );
      })}
    </div>
  );
}
