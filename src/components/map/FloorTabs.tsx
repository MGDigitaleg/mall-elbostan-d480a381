import { useCallback, useRef } from "react";
import type { MallFloorId } from "@/lib/mallFloorGeometry";
import { mallFloors } from "@/lib/mallFloorGeometry";

type Props = {
  selected: MallFloorId;
  onChange: (id: MallFloorId) => void;
};

export function FloorTabs({ selected, onChange }: Props) {
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, idx: number) => {
      let next = idx;
      if (e.key === "ArrowLeft") next = (idx + 1) % mallFloors.length;
      else if (e.key === "ArrowRight") next = (idx - 1 + mallFloors.length) % mallFloors.length;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = mallFloors.length - 1;
      else return;

      e.preventDefault();
      onChange(mallFloors[next].id);
      tabsRef.current[next]?.focus();
    },
    [onChange],
  );

  return (
    <div role="tablist" aria-label="اختيار الدور" className="flex gap-2 border-b border-border bg-muted/30 px-2 pt-2">
      {mallFloors.map((f, i) => {
        const isActive = selected === f.id;
        return (
          <button
            key={f.id}
            ref={(el) => { tabsRef.current[i] = el; }}
            role="tab"
            id={`floor-tab-${f.id}`}
            aria-selected={isActive}
            aria-controls={`floor-panel-${f.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(f.id)}
            onKeyDown={(e) => handleKeyDown(e, i)}
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
