import { Button } from "@/components/ui/button";
import type { MallFloorId } from "@/lib/mallFloorGeometry";
import { mallFloors } from "@/lib/mallFloorGeometry";

type Props = {
  selected: MallFloorId;
  onChange: (id: MallFloorId) => void;
};

export function FloorTabs({ selected, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2 md:gap-2.5">
      {mallFloors.map((f) => (
        <Button
          key={f.id}
          variant={selected === f.id ? "default" : "outline"}
          onClick={() => onChange(f.id)}
          className="h-12 rounded-full px-[1.375rem] text-sm"
        >
          {f.label}
        </Button>
      ))}
    </div>
  );
}
