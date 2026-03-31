import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from "react-router-dom";

const InteractiveMap = () => {
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "leased" | "available">("all");
  const [selectedItem, setSelectedItem] = useState<{ type: "store" | "unit"; data: Record<string, unknown> } | null>(null);

  const { data: floors } = useQuery({
    queryKey: ["floors"],
    queryFn: async () => {
      const { data } = await supabase.from("floors").select("*").order("sort_order");
      return data ?? [];
    },
  });

  const { data: stores } = useQuery({
    queryKey: ["stores-map"],
    queryFn: async () => {
      const { data } = await supabase.from("stores").select("*").neq("status", "hidden");
      return data ?? [];
    },
  });

  const { data: units } = useQuery({
    queryKey: ["units-map"],
    queryFn: async () => {
      const { data } = await supabase.from("units").select("*").neq("status", "hidden");
      return data ?? [];
    },
  });

  const activeFloor = selectedFloor ?? floors?.[0]?.id ?? null;

  const filteredStores = useMemo(() => {
    return stores?.filter((s) => {
      const matchFloor = !activeFloor || s.floor_id === activeFloor;
      const matchFilter = filter === "all" || s.status === filter;
      return matchFloor && matchFilter;
    }) ?? [];
  }, [stores, activeFloor, filter]);

  const filteredUnits = useMemo(() => {
    return units?.filter((u) => {
      const matchFloor = !activeFloor || u.floor_id === activeFloor;
      const matchFilter = filter === "all" || filter === "available" ? u.status === "available" : false;
      return matchFloor && matchFilter;
    }) ?? [];
  }, [units, activeFloor, filter]);

  return (
    <MainLayout>
      <SEOHead title="الخريطة التفاعلية" titleEn="Interactive Map" description="تصفح خريطة مول البستان واعثر على المتاجر والوحدات المتاحة." descriptionEn="Browse Mall Elbostan's interactive floor map." breadcrumbs={[{ name: "الخريطة", url: "/map" }]} />
      <div className="container py-20">
        <h1 className="text-4xl font-bold text-gradient-blue mb-8">الخريطة التفاعلية</h1>

        {/* Floor Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {floors?.map((floor) => (
            <Button key={floor.id} variant={activeFloor === floor.id ? "default" : "outline"} size="sm" onClick={() => setSelectedFloor(floor.id)}>
              {floor.name_ar}
            </Button>
          ))}
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          <Badge variant={filter === "all" ? "default" : "outline"} className="cursor-pointer" onClick={() => setFilter("all")}>الكل</Badge>
          <Badge variant={filter === "leased" ? "default" : "outline"} className="cursor-pointer" onClick={() => setFilter("leased")}>المؤجرة</Badge>
          <Badge variant={filter === "available" ? "default" : "outline"} className="cursor-pointer bg-orange text-orange-foreground" onClick={() => setFilter("available")}>متاحة</Badge>
        </div>

        {/* Legend */}
        <div className="flex gap-4 mb-8 text-sm">
          <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-primary inline-block" /> مؤجرة</span>
          <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-orange inline-block" /> متاحة</span>
          <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-accent inline-block" /> خدمات</span>
        </div>

        {/* Map Grid (SVG-ready placeholder) */}
        <div className="card-premium p-6 min-h-[400px]">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filteredStores.map((store) => (
              <button
                key={store.id}
                onClick={() => setSelectedItem({ type: "store", data: store as unknown as Record<string, unknown> })}
                className="p-4 rounded-lg bg-primary/20 border border-primary/30 hover:border-primary transition-colors text-center"
              >
                <p className="text-xs font-bold text-foreground truncate">{store.name_ar}</p>
                <p className="text-[10px] text-muted-foreground">{store.unit_code}</p>
              </button>
            ))}
            {filteredUnits.map((unit) => (
              <button
                key={unit.id}
                onClick={() => setSelectedItem({ type: "unit", data: unit as unknown as Record<string, unknown> })}
                className="p-4 rounded-lg bg-orange/20 border border-orange/30 hover:border-orange transition-colors text-center"
              >
                <p className="text-xs font-bold text-orange">متاح</p>
                <p className="text-[10px] text-muted-foreground">{unit.unit_code}</p>
              </button>
            ))}
          </div>

          {filteredStores.length === 0 && filteredUnits.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <p>لم يتم إضافة بيانات لهذا الطابق بعد</p>
            </div>
          )}
        </div>

        {/* Detail Dialog */}
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>
                {selectedItem?.type === "store"
                  ? (selectedItem.data.name_ar as string)
                  : `وحدة ${selectedItem?.data.unit_code as string}`}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 text-sm text-muted-foreground">
              {selectedItem?.type === "store" ? (
                <>
                  <p>{selectedItem.data.short_description_ar as string}</p>
                  {selectedItem.data.category && <p>الفئة: {selectedItem.data.category as string}</p>}
                  <Link to={`/stores/${selectedItem.data.slug as string}`}>
                    <Button variant="cta" size="sm" className="mt-2">عرض التفاصيل</Button>
                  </Link>
                </>
              ) : (
                <>
                  {selectedItem?.data.area_sqm && <p>المساحة: {selectedItem.data.area_sqm as number} م²</p>}
                  {selectedItem?.data.activity_suggestion && <p>النشاط المقترح: {selectedItem.data.activity_suggestion as string}</p>}
                  {selectedItem?.data.description_ar && <p>{selectedItem.data.description_ar as string}</p>}
                  <Link to="/leasing">
                    <Button variant="orange" size="sm" className="mt-2">استفسر عن هذه الوحدة</Button>
                  </Link>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default InteractiveMap;
