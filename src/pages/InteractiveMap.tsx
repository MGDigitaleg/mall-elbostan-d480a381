import { useMemo, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Building2,
  Compass,
  Layers,
  MapPin,
  Phone,
  TrendingUp,
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { MallFloorMap } from "@/components/map/MallFloorMap";
import { MapFilters } from "@/components/map/MapFilters";
import { FloorTabs } from "@/components/map/FloorTabs";
import { UnitDetailsCard, type ActiveRewardContext } from "@/components/map/UnitDetailsCard";
import { MapLegend } from "@/components/map/MapLegend";
import { AtriumSpinModal, type SpinWinResult } from "@/components/map/AtriumSpinModal";
import { AtriumHubModal, DEFAULT_ATRIUM_CONFIG, type AtriumConfig } from "@/components/map/AtriumHubModal";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  mallFloors,
  allMallUnits,
  availableMallUnits,
  floorLabelsAr,
  type MallFloorId,
  type MallUnit,
  type MallUnitStatus,
  type MallCategory,
} from "@/lib/mallFloorGeometry";

const storeCategoryToMapCategory: Record<string, MallCategory> = {
  "phones": "Accessories",
  "accessories": "Accessories",
  "computers": "Laptops",
  "laptops": "Laptops",
  "gaming": "Components",
  "components": "Components",
  "printing": "Networking",
  "networking": "Networking",
  "maintenance": "Maintenance",
  "security": "Security Systems",
};

function resolveMapCategory(storeCategory: string | null): MallCategory | null {
  if (!storeCategory) return null;
  const lower = storeCategory.toLowerCase();
  for (const [key, val] of Object.entries(storeCategoryToMapCategory)) {
    if (lower.includes(key)) return val;
  }
  return null;
}

const InteractiveMap = () => {
  const isMobile = useIsMobile();
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedFloor, setSelectedFloor] = useState<MallFloorId>("ground");
  const [statusFilter, setStatusFilter] = useState<"all" | MallUnitStatus>("all");
  const [categoryFilter, setCategoryFilter] = useState<"all" | MallCategory>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<MallUnit | null>(null);
  const [spinModalOpen, setSpinModalOpen] = useState(false);
  const [hubModalOpen, setHubModalOpen] = useState(false);
  const [highlightedUnitIds, setHighlightedUnitIds] = useState<Set<string>>(new Set());
  const [activeRewardCtx, setActiveRewardCtx] = useState<ActiveRewardContext | undefined>();
  const [lastWinResult, setLastWinResult] = useState<SpinWinResult | null>(null);

  const [atriumConfig] = useState<AtriumConfig>(DEFAULT_ATRIUM_CONFIG);

  const handleAtriumClick = useCallback(() => { setHubModalOpen(true); }, []);
  const handleOpenSpinWheel = useCallback(() => { setSpinModalOpen(true); }, []);

  const handleHubFilterCategory = useCallback((cat: MallCategory) => {
    setCategoryFilter(cat);
    const matchingIds = new Set(allMallUnits.filter((u) => u.category === cat && u.status === "occupied").map((u) => u.id));
    setHighlightedUnitIds(matchingIds);
    scrollToMap();
    setTimeout(() => setHighlightedUnitIds(new Set()), 12000);
  }, []);

  const clearRewardState = useCallback(() => {
    setHighlightedUnitIds(new Set());
    setActiveRewardCtx(undefined);
    setLastWinResult(null);
  }, []);

  const scrollToMap = useCallback(() => {
    setTimeout(() => { mapRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }, 200);
  }, []);

  const handleSpinWin = useCallback((result: SpinWinResult | null) => {
    if (!result) return;
    setLastWinResult(result);
    const { reward, sponsorStore } = result;

    if (sponsorStore?.unit_code) {
      const unitCode = sponsorStore.unit_code;
      const targetUnit = allMallUnits.find((u) => u.code === unitCode);
      if (targetUnit) {
        setSelectedFloor(targetUnit.floor);
        setSelectedUnit(targetUnit);
        setHighlightedUnitIds(new Set([targetUnit.id]));
        setActiveRewardCtx({ reward, storeName: sponsorStore.name_ar });
      } else {
        const occupiedIds = new Set(mallFloors.flatMap((f) => f.units.filter((u) => u.status === "occupied").map((u) => u.id)));
        setHighlightedUnitIds(occupiedIds);
        setActiveRewardCtx({ reward, storeName: sponsorStore.name_ar });
      }
    } else {
      const mapCat = resolveMapCategory(sponsorStore?.category ?? null);
      if (mapCat) {
        const matchingIds = new Set(allMallUnits.filter((u) => u.category === mapCat && u.status === "occupied").map((u) => u.id));
        setHighlightedUnitIds(matchingIds);
        setCategoryFilter(mapCat);
        setActiveRewardCtx({ reward, isCategory: true });
      } else {
        const occupiedIds = new Set(mallFloors.flatMap((f) => f.units.filter((u) => u.status === "occupied").map((u) => u.id)));
        setHighlightedUnitIds(occupiedIds);
        setActiveRewardCtx({ reward, isCategory: true });
      }
    }
    setTimeout(() => clearRewardState(), 15000);
  }, [clearRewardState]);

  const handleViewOnMap = useCallback(() => { scrollToMap(); }, [scrollToMap]);
  const handleExploreCategory = useCallback(() => { scrollToMap(); }, [scrollToMap]);

  const floor = useMemo(() => mallFloors.find((f) => f.id === selectedFloor) ?? mallFloors[0], [selectedFloor]);

  const filteredUnits = useMemo(() => {
    return floor.units.filter((unit) => {
      const q = searchTerm.trim().toLowerCase();
      const matchSearch = q.length === 0 || unit.code.toLowerCase().includes(q) || unit.name.includes(q);
      const matchStatus = availableOnly ? unit.status === "available" : statusFilter === "all" || unit.status === statusFilter;
      const matchCat = categoryFilter === "all" || unit.category === categoryFilter;
      return matchSearch && matchStatus && matchCat;
    });
  }, [floor.units, searchTerm, statusFilter, categoryFilter, availableOnly]);

  const mutedUnitIds = useMemo(() => {
    const filtered = new Set(filteredUnits.map((u) => u.id));
    return new Set(floor.units.filter((u) => !filtered.has(u.id)).map((u) => u.id));
  }, [filteredUnits, floor.units]);

  const activeUnit = selectedUnit && selectedUnit.floor === selectedFloor ? selectedUnit : null;
  const floorAvailable = floor.units.filter((u) => u.status === "available").length;
  const floorOccupied = floor.units.filter((u) => u.status === "occupied").length;
  const floorComingSoon = floor.units.filter((u) => u.status === "coming_soon").length;

  const handleFloorChange = (id: MallFloorId) => { setSelectedFloor(id); setSelectedUnit(null); };

  return (
    <MainLayout>
      <SEOHead
        title="الدليل التفاعلي"
        titleEn="Interactive Directory"
        description="دليل تفاعلي معماري لمول البستان مع بحث وفلاتر ووحدات متاحة للتأجير في القاهرة الجديدة."
        descriptionEn="Architectural interactive directory for Mall Elbostan with search, filters, and leasing units."
        breadcrumbs={[{ name: "الخريطة", url: "/map" }]}
      />

      {/* ═══════════ HERO — minimal, operational ═══════════ */}
      <section style={{ background: "#071326" }}>
        <div className="mx-auto w-full max-w-[1440px] px-5 md:px-8 lg:px-12">
          <div className="py-3.5 md:py-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div className="md:text-right">
                <p className="font-poppins text-[0.52rem] font-bold tracking-[0.28em] uppercase" style={{ color: "#94A3B8" }}>
                  Interactive Directory
                </p>
                <h1 className="mt-0.5 text-[1.1rem] leading-[1.15] md:text-[1.3rem]" style={{ color: "#F8FAFC" }}>
                  الدليل التفاعلي لمول البستان
                </h1>
                <p className="mt-0.5 max-w-[22rem] text-[0.74rem] leading-5" style={{ color: "#94A3B8" }}>
                  تنقّل بين الأدوار، حدد حالة كل وحدة، واستفسر مباشرة.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {[
                  { v: `${mallFloors.length}`, l: "أدوار" },
                  { v: `${allMallUnits.length}`, l: "وحدة" },
                  { v: `${availableMallUnits.length}`, l: "متاحة", highlight: true },
                ].map((s, i) => (
                  <div key={s.l} className="flex items-center gap-3">
                    <div className="text-center">
                      <span className="font-poppins text-[0.95rem] font-extrabold" style={{ color: s.highlight ? "#E8740E" : "#F8FAFC" }}>{s.v}</span>
                      <p className="text-[0.54rem] font-semibold" style={{ color: "#64748B" }}>{s.l}</p>
                    </div>
                    {i < 2 && <div className="h-3.5 w-px" style={{ background: "#1E293B" }} />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ CONTROL BAR ═══════════ */}
      <section className="sticky top-[60px] z-30 border-b bg-card/95 backdrop-blur-sm md:top-[68px] xl:top-[72px]" style={{ borderColor: "#D8DEE8" }}>
        <div className="mx-auto w-full max-w-[1440px] px-5 md:px-8 lg:px-12">
          <div className="flex flex-wrap items-center justify-between gap-2 py-2">
            <FloorTabs selected={selectedFloor} onChange={handleFloorChange} />

            <div className="flex items-center gap-2.5">
              <MapLegend />
              <div className="hidden items-center gap-1.5 text-[0.7rem] md:flex" style={{ borderRight: "1px solid #D8DEE8", paddingRight: "8px" }}>
                <span className="font-bold" style={{ color: "#334155" }}>{floor.units.length}</span>
                <span style={{ color: "#64748B" }}>وحدة</span>
                <span className="mx-0.5 h-3 w-px bg-border" />
                <span className="font-bold" style={{ color: "#E8740E" }}>{floorAvailable}</span>
                <span style={{ color: "#64748B" }}>متاحة</span>
                {floorComingSoon > 0 && (
                  <>
                    <span className="mx-0.5 h-3 w-px bg-border" />
                    <span className="font-bold" style={{ color: "#0A9AB8" }}>{floorComingSoon}</span>
                    <span style={{ color: "#64748B" }}>قريبًا</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="pb-2">
            <MapFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              categoryFilter={categoryFilter}
              onCategoryChange={setCategoryFilter}
              availableOnly={availableOnly}
              onAvailableOnlyChange={setAvailableOnly}
            />
          </div>
        </div>
      </section>

      {/* ═══════════ MAP + DETAILS PANEL ═══════════ */}
      <section className="py-2 md:py-2.5" style={{ background: "#F5F2EC" }}>
        <div className="mx-auto w-full max-w-[1440px] px-5 md:px-8 lg:px-12">
          <div className="grid gap-2.5 lg:grid-cols-[1fr_320px] lg:items-start">
            <div ref={mapRef}>
              <MallFloorMap
                floor={floor}
                selectedUnitId={activeUnit?.id ?? null}
                mutedUnitIds={mutedUnitIds}
                onSelectUnit={setSelectedUnit}
                onAtriumClick={handleAtriumClick}
                atriumConfig={atriumConfig}
                highlightedUnitIds={highlightedUnitIds}
              />
            </div>

            {!isMobile && (
              <aside className="lg:sticky lg:top-[150px]">
                <UnitDetailsCard unit={activeUnit} rewardContext={activeRewardCtx} />
              </aside>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════ AVAILABLE UNITS ═══════════ */}
      <section className="py-3.5 md:py-4" style={{ background: "#FAFAF8", borderTop: "1px solid #D8DEE8" }}>
        <div className="mx-auto w-full max-w-[1440px] px-5 md:px-8 lg:px-12">
          <div className="mb-2.5 flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="font-poppins text-[0.52rem] font-bold uppercase tracking-[0.25em]" style={{ color: "#B85C08" }}>Available Units</p>
              <h2 className="mt-0.5 text-[0.9rem] font-bold leading-tight md:text-[1.05rem]" style={{ color: "#0F172A" }}>
                {floorLabelsAr[selectedFloor]} — {floorAvailable} وحدة متاحة
              </h2>
            </div>
            <Link to="/leasing">
              <Button variant="orange" size="sm" className="h-8 rounded-lg px-4 text-[0.74rem] font-bold">
                <Phone className="ml-1.5 h-3 w-3" /> استفسر الآن
              </Button>
            </Link>
          </div>

          {filteredUnits.filter((u) => u.status === "available").length > 0 ? (
            <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
              {filteredUnits.filter((u) => u.status === "available").map((unit) => (
                <button
                  key={unit.id}
                  onClick={() => { setSelectedUnit(unit); mapRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }}
                  className={`group rounded-lg border p-2.5 text-right transition-all duration-150 ${
                    activeUnit?.id === unit.id
                      ? "border-[#E8740E] shadow-[0_0_0_1px_#E8740E44]"
                      : "border-border bg-card hover:border-[#E8740E]/30"
                  }`}
                  style={activeUnit?.id === unit.id ? { background: "#FEF3E2" } : {}}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[0.82rem] font-bold" style={{ color: "#0F172A" }}>{unit.code}</p>
                    <span className="text-[0.66rem] font-bold" style={{ color: "#B85C08" }}>{unit.area} م²</span>
                  </div>
                  <p className="mt-0.5 text-[0.66rem] font-medium" style={{ color: "#64748B" }}>{floorLabelsAr[unit.floor]}</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border bg-card px-5 py-3.5 text-center">
              <p className="text-[0.78rem] font-semibold" style={{ color: "#64748B" }}>لا توجد وحدات متاحة ضمن الفلاتر الحالية.</p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════ CTA STRIP ═══════════ */}
      <section className="py-6 md:py-7" style={{ background: "#071326" }}>
        <div className="mx-auto max-w-[640px] px-5 text-center">
          <p className="font-poppins text-[0.52rem] font-bold tracking-[0.28em] uppercase" style={{ color: "#64748B" }}>Commercial Leasing</p>
          <h2 className="mt-1 text-[0.98rem] font-bold md:text-[1.15rem]" style={{ color: "#F8FAFC" }}>تبحث عن وحدة تجارية في موقع فعّال؟</h2>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <Link to="/leasing">
              <Button variant="orange" className="h-9 rounded-lg px-5 text-[0.8rem] font-bold">
                <Phone className="ml-2 h-3.5 w-3.5" /> استفسار التأجير
              </Button>
            </Link>
            <Link to="/stores">
              <Button className="h-9 rounded-lg border px-5 text-[0.8rem] font-bold" style={{ borderColor: "#1E293B", background: "transparent", color: "#CBD5E1" }}>
                تصفّح المتاجر
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Mobile drawer ── */}
      <Drawer open={isMobile && !!activeUnit} onOpenChange={(open) => !open && setSelectedUnit(null)}>
        <DrawerContent className="max-h-[85vh] rounded-t-2xl border-border bg-card">
          <DrawerHeader className="border-b border-border text-right">
            <DrawerTitle>{activeUnit ? `وحدة ${activeUnit.code}` : "تفاصيل الوحدة"}</DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-auto p-3">
            {activeUnit && <UnitDetailsCard unit={activeUnit} rewardContext={activeRewardCtx} />}
          </div>
        </DrawerContent>
      </Drawer>

      {/* ── Atrium Hub Modal ── */}
      <AtriumHubModal
        open={hubModalOpen}
        onClose={() => setHubModalOpen(false)}
        config={atriumConfig}
        onOpenSpinWheel={handleOpenSpinWheel}
        onFilterCategory={handleHubFilterCategory}
      />

      {/* ── Atrium Spin Modal ── */}
      <AtriumSpinModal
        open={spinModalOpen}
        onClose={() => setSpinModalOpen(false)}
        onWin={handleSpinWin}
        onViewOnMap={handleViewOnMap}
        onExploreCategory={handleExploreCategory}
      />
    </MainLayout>
  );
};

export default InteractiveMap;
