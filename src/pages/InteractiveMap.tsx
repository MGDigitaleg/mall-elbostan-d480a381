import { useMemo, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Building2,
  Compass,
  Layers,
  MapPin,
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

const sectionReveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

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

      {/* ═══════════ COMPACT HERO ═══════════ */}
      <section className="relative overflow-hidden" style={{ background: "hsl(222 38% 6%)" }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 45% at 50% 50%, hsl(222 58% 38% / 0.06), transparent 70%)" }} />
        <div className="relative mx-auto w-full max-w-[1400px] px-5 md:px-8 lg:px-14">
          <div className="py-10 md:py-14">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto max-w-[40rem] text-center"
            >
              <div className="mx-auto mb-3 flex items-center justify-center gap-3">
                <div className="h-[3px] w-8 rounded-full" style={{ background: "hsl(30 22% 48%)" }} />
                <span className="font-poppins text-[0.7rem] font-bold tracking-[0.22em] uppercase dark-accent">
                  الدليل التفاعلي
                </span>
                <div className="h-[3px] w-8 rounded-full" style={{ background: "hsl(30 22% 48%)" }} />
              </div>

              <h1 className="mt-4 text-[1.8rem] leading-[1.04] md:text-[2.4rem] lg:text-[2.8rem] dark-heading">
                دليل المول التفاعلي
              </h1>
              <p className="mx-auto mt-4 max-w-[26rem] text-[0.9rem] leading-[1.9] dark-body">
                تنقّل بين الأدوار، حدد حالة كل وحدة، وانتقل مباشرة للتأجير أو تفاصيل المتجر.
              </p>

              {/* inline stats */}
              <div className="mt-6 flex items-center justify-center gap-7">
                {[
                  { icon: Building2, v: `${mallFloors.length}`, l: "أدوار" },
                  { icon: Layers, v: `${allMallUnits.length}`, l: "وحدة" },
                  { icon: TrendingUp, v: `${availableMallUnits.length}`, l: "متاحة" },
                ].map((s, i) => (
                  <div key={s.l} className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <s.icon className="h-3.5 w-3.5 dark-kicker" />
                      <span className="font-poppins text-[1.1rem] font-extrabold dark-heading">{s.v}</span>
                      <span className="text-[0.74rem] font-semibold dark-muted">{s.l}</span>
                    </div>
                    {i < 2 && <div className="h-5 w-px" style={{ background: "hsl(0 0% 100% / 0.1)" }} />}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════ CONTROL PANEL ═══════════ */}
      <section className="border-b border-border bg-card py-3.5">
        <div className="container max-w-[1400px]">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <FloorTabs selected={selectedFloor} onChange={handleFloorChange} />
            <div className="flex items-center gap-5">
              <MapLegend />
              <div className="hidden items-center gap-3 text-[0.78rem] md:flex" style={{ borderRight: "1px solid hsl(var(--border))", paddingRight: "14px" }}>
                <span className="font-semibold text-muted-foreground">{floor.units.length} وحدة</span>
                <span className="h-3 w-px bg-border" />
                <span className="font-bold" style={{ color: "#E8740E" }}>{floorAvailable} متاحة</span>
                <span className="h-3 w-px bg-border" />
                <span className="font-semibold text-muted-foreground">{floorOccupied} مشغولة</span>
              </div>
            </div>
          </div>

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
      </section>

      {/* ═══════════ MAP + DETAILS PANEL ═══════════ */}
      <section className="section-ivory py-5 md:py-6">
        <div className="container max-w-[1400px]">
          <div className="grid gap-5 lg:grid-cols-[1fr_340px] lg:items-start">
            {/* Map */}
            <motion.div
              ref={mapRef}
              variants={sectionReveal}
              initial="hidden"
              animate="visible"
            >
              <MallFloorMap
                floor={floor}
                selectedUnitId={activeUnit?.id ?? null}
                mutedUnitIds={mutedUnitIds}
                onSelectUnit={setSelectedUnit}
                onAtriumClick={handleAtriumClick}
                atriumConfig={atriumConfig}
                highlightedUnitIds={highlightedUnitIds}
              />
            </motion.div>

            {/* Details panel */}
            {!isMobile && (
              <aside className="lg:sticky lg:top-20">
                <UnitDetailsCard unit={activeUnit} rewardContext={activeRewardCtx} />
              </aside>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════ AVAILABLE UNITS ═══════════ */}
      <section className="py-8" style={{ background: "hsl(var(--background))" }}>
        <div className="container max-w-[1400px]">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }}>
            <div className="mb-5 flex items-end justify-between">
              <div className="flex items-center gap-3">
                <div className="h-[3px] w-6 rounded-full" style={{ background: "#E8740E" }} />
                <div>
                  <p className="text-[0.72rem] font-bold uppercase tracking-widest text-muted-foreground">الوحدات المتاحة</p>
                  <h2 className="text-lg font-bold text-foreground md:text-xl">
                    {floorLabelsAr[selectedFloor]} — {floorAvailable} وحدة متاحة
                  </h2>
                </div>
              </div>
              <Link to="/leasing">
                <Button variant="outline-blue" size="sm" className="hidden rounded-xl px-5 text-[0.82rem] md:inline-flex">
                  صفحة التأجير
                </Button>
              </Link>
            </div>

            {filteredUnits.filter((u) => u.status === "available").length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredUnits.filter((u) => u.status === "available").map((unit) => (
                  <button
                    key={unit.id}
                    onClick={() => { setSelectedUnit(unit); mapRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }}
                    className={`group rounded-xl border bg-card p-4 text-right transition-all hover:shadow-[var(--shadow-card)] ${
                      activeUnit?.id === unit.id
                        ? "border-[#E8740E] shadow-[0_0_0_1px_#E8740E]"
                        : "border-border hover:border-[#E8740E]/30"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[0.95rem] font-bold text-foreground">وحدة {unit.code}</p>
                        <p className="mt-0.5 text-[0.78rem] text-muted-foreground">{floorLabelsAr[unit.floor]}</p>
                      </div>
                      <span
                        className="rounded-full px-2.5 py-0.5 text-[0.68rem] font-bold"
                        style={{ background: "hsl(24 90% 95%)", border: "1px solid hsl(24 85% 78%)", color: "hsl(24 85% 35%)" }}
                      >
                        متاحة
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-[0.8rem]">
                      <span className="font-semibold text-muted-foreground">{unit.area} م²</span>
                      <span className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100" style={{ color: "#E8740E" }}>
                        <MapPin className="h-3 w-3" />
                        عرض على الخريطة
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-card px-6 py-10 text-center">
                <p className="text-sm font-semibold text-muted-foreground">لا توجد وحدات متاحة ضمن الفلاتر الحالية.</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ═══════════ CTA STRIP ═══════════ */}
      <section className="py-12" style={{ background: "hsl(222 38% 6%)" }}>
        <div className="container max-w-[900px] text-center">
          <h2 className="text-lg font-bold md:text-xl dark-heading">تبحث عن وحدة تجارية في موقع فعّال؟</h2>
          <p className="mx-auto mt-2 max-w-sm text-[0.88rem] dark-body">
            من الخريطة مباشرة لصفحة التأجير — استفسر الآن وابدأ حوارًا مع الفريق.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/leasing">
              <Button variant="orange" size="lg" className="h-12 rounded-xl px-8 font-bold">
                ابدأ استفسار التأجير
              </Button>
            </Link>
            <Link to="/stores">
              <Button size="lg" className="h-12 rounded-xl border px-8 font-bold" style={{ borderColor: "hsl(0 0% 100% / 0.12)", background: "hsl(0 0% 100% / 0.07)", color: "hsl(38 14% 92%)" }}>
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
          <div className="overflow-y-auto p-4">
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
