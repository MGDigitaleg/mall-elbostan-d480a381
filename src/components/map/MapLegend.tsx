import { Badge } from "@/components/ui/badge";

export function MapLegend() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="outline" className="h-8 rounded-full border-border px-3 text-foreground">مشغولة</Badge>
      <Badge variant="outline" className="h-8 rounded-full border-orange/50 px-3 text-orange">متاحة</Badge>
      <Badge variant="outline" className="h-8 rounded-full border-accent/50 px-3 text-accent">قريبًا</Badge>
    </div>
  );
}
