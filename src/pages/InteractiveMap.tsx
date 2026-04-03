import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import {
  Building2,
  Compass,
  Layers,
  MapPin,
  Phone,
  TrendingUp,
  Users,
  ArrowUpLeft,
  Ruler,
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

/* ── Animations ── */
const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } } };

const InteractiveMap = () => {
  const isMobile = useIsMobile();
  const [searchParams, setSearchParams] = useSearchParams();
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

  // Auto-highlight unit from URL params
  useEffect(() => {
    const highlightCode = searchParams.get("highlight");
    const prizeName = searchParams.get("prize");
    const storeName = searchParams.get("store");
    if (!highlightCode) return;

    const targetUnit = allMallUnits.find((u) => u.code === highlightCode);
    if (targetUnit) {
      setSelectedFloor(targetUnit.floor);
      setSelectedUnit(targetUnit);
      setHighlightedUnitIds(new Set([targetUnit.id]));
      setActiveRewardCtx({ prizeName: prizeName ?? undefined, storeName: storeName ?? undefined });
      setTimeout(() => mapRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 500);
      setTimeout(() => {
        setHighlightedUnitIds(new Set());
        setActiveRewardCtx(undefined);
      }, 15000);
    }
    setSearchParams({}, { replace: true });
  }, []);

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

  const handleSpinWin = useCallback((result: SpinWinResult) => {
    if (!result.won || !result.result) return;
    setLastWinResult(result);
    const { result: spinData } = result;
    const store = spinData.store;
    const prizeName = spinData.prize.name_ar;

    if (store?.unit_code) {
      const targetUnit = allMallUnits.find((u) => u.code === store.unit_code);
      if (targetUnit) {
        setSelectedFloor(targetUnit.floor);
        setSelectedUnit(targetUnit);
        setHighlightedUnitIds(new Set([targetUnit.id]));
        setActiveRewardCtx({ prizeName, storeName: store.name_ar ?? undefined });
      } else {
        const occupiedIds = new Set(mallFloors.flatMap((f) => f.units.filter((u) => u.status === "occupied").map((u) => u.id)));
        setHighlightedUnitIds(occupiedIds);
        setActiveRewardCtx({ prizeName, storeName: store.name_ar ?? undefined });
      }
    } else {
      const mapCat = resolveMapCategory(store?.category ?? null);
      if (mapCat) {
        const matchingIds = new Set(allMallUnits.filter((u) => u.category === mapCat && u.status === "occupied").map((u) => u.id));
        setHighlightedUnitIds(matchingIds);
        setCategoryFilter(mapCat);
        setActiveRewardCtx({ prizeName, isCategory: true });
      } else {
        const occupiedIds = new Set(mallFloors.flatMap((f) => f.units.filter((u) => u.status === "occupied").map((u) => u.id)));
        setHighlightedUnitIds(occupiedIds);
        setActiveRewardCtx({ prizeName, isCategory: true });
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

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        {/* Ambient glows */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-1/4 top-0 h-[300px] w-[400px] rounded-full opacity-[0.06]"
               style={{ background: "radial-gradient(circle, hsl(var(--primary)), transparent 70%)" }} />
          <div className="absolute bottom-0 left-1/3 h-[200px] w-[350px] rounded-full opacity-[0.04]"
               style={{ background: "radial-gradient(circle, hsl(220 80% 55%), transparent 70%)" }} />
        </div>

        <div className="relative mx-auto w-full max-w-[1440px] px-5 md:px-8 lg:px-12">
          <div className="py-5 md:py-7">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <motion.div variants={fadeUp} initial="hidden" animate="visible" className="md:text-right">
                <p className="font-poppins text-[0.56rem] font-bold tracking-[0.3em] uppercase"
                   style={{ color: "hsl(var(--primary))" }}>
                  Interactive Directory
                </p>
                <h1 className="mt-1.5 text-[1.25rem] font-bold leading-[1.2] md:text-[1.5rem]"
                    style={{ color: "hsl(0 0% 97%)", fontFamily: "var(--font-arabic-display)" }}>
                  الدليل التفاعلي لمول البستان
                </h1>
                <p className="mt-1.5 max-w-[24rem] text-[0.78rem] leading-[1.7]" style={{ color: "hsl(220 15% 55%)" }}>
                  تنقّل بين الأدوار، حدد حالة كل وحدة، واستفسر مباشرة.
                </p>
              </motion.div>

              {/* Stats capsules */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4 }}
                          className="flex items-center gap-1">
                {[
                  { v: `${mallFloors.length}`, l: "أدوار", color: "hsl(0 0% 97%)" },
                  { v: `${allMallUnits.length}`, l: "وحدة", color: "hsl(0 0% 97%)" },
                  { v: `${availableMallUnits.length}`, l: "متاحة", color: "hsl(25 95% 55%)" },
                ].map((s, i) => (
                  <div key={s.l} className="flex items-center gap-1">
                    <div className="rounded-xl px-4 py-2.5 text-center"
                         style={{ background: "hsl(0 0% 100% / 0.04)", border: "1px solid hsl(0 0% 100% / 0.08)" }}>
                      <span className="font-poppins text-[1.1rem] font-extrabold" style={{ color: s.color }}>{s.v}</span>
                      <p className="mt-0.5 text-[0.56rem] font-semibold" style={{ color: "hsl(220 15% 45%)" }}>{s.l}</p>
                    </div>
                    {i < 2 && <div className="mx-0.5 h-5 w-px" style={{ background: "hsl(0 0% 100% / 0.06)" }} />}
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="h-px w-full" style={{ background: "linear-gradient(to left, transparent, hsl(var(--primary) / 0.25), transparent)" }} />
      </section>

      {/* ═══════════ CONTROL BAR ═══════════ */}
      <section className="sticky top-[56px] z-30 border-b bg-card/[0.97] backdrop-blur-xl md:top-[64px] xl:top-[68px]"
               style={{ borderColor: "hsl(220 20% 88%)", boxShadow: "0 1px 3px hsl(220 30% 10% / 0.04)" }}>
        <div className="mx-auto w-full max-w-[1440px] px-5 md:px-8 lg:px-12">
          <div className="flex flex-wrap items-center justify-between gap-2 py-2.5">
            <FloorTabs selected={selectedFloor} onChange={handleFloorChange} />

            <div className="flex items-center gap-3">
              <MapLegend />
              {/* Floor stats strip */}
              <div className="hidden items-center gap-2 rounded-lg px-3 py-1.5 text-[0.7rem] md:flex"
                   style={{ background: "hsl(220 20% 96%)", border: "1px solid hsl(220 20% 90%)" }}>
                <span className="font-bold text-foreground">{floor.units.length}</span>
                <span className="text-muted-foreground">وحدة</span>
                <span className="h-3 w-px" style={{ background: "hsl(220 20% 88%)" }} />
                <span className="font-bold" style={{ color: "hsl(25 95% 50%)" }}>{floorAvailable}</span>
                <span className="text-muted-foreground">متاحة</span>
                {floorComingSoon > 0 && (
                  <>
                    <span className="h-3 w-px" style={{ background: "hsl(220 20% 88%)" }} />
                    <span className="font-bold" style={{ color: "hsl(190 85% 40%)" }}>{floorComingSoon}</span>
                    <span className="text-muted-foreground">قريبًا</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="pb-2.5">
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
      <section className="py-3 md:py-4" style={{ background: "hsl(38 25% 95%)" }}>
        <div className="mx-auto w-full max-w-[1440px] px-5 md:px-8 lg:px-12">
          <div className="grid gap-4 lg:grid-cols-[1fr_320px] lg:items-start">
            <div ref={mapRef} className="overflow-hidden rounded-2xl border bg-white shadow-sm" style={{ borderColor: "hsl(220 20% 88%)" }}>
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
              <aside className="lg:sticky lg:top-[160px] space-y-3">
                <UnitDetailsCard unit={activeUnit} rewardContext={activeRewardCtx} />

                {/* Floor summary card */}
                <div className="rounded-xl border bg-card p-4" style={{ borderColor: "hsl(220 20% 88%)" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-[3px] w-4 rounded-full bg-primary" />
                    <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                      {floorLabelsAr[selectedFloor]}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-2.5 text-center">
                    {[
                      { v: floorOccupied, l: "مشغولة", color: "hsl(220 15% 25%)" },
                      { v: floorAvailable, l: "متاحة", color: "hsl(25 95% 50%)" },
                      { v: floorComingSoon, l: "قريبًا", color: "hsl(190 85% 40%)" },
                    ].map((s) => (
                      <div key={s.l} className="rounded-lg py-2.5" style={{ background: "hsl(220 20% 97%)" }}>
                        <p className="font-poppins text-[1rem] font-extrabold" style={{ color: s.color }}>{s.v}</p>
                        <p className="mt-0.5 text-[0.54rem] font-semibold text-muted-foreground">{s.l}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════ AVAILABLE UNITS GRID ═══════════ */}
      <section className="py-5 md:py-6" style={{ background: "hsl(0 0% 99%)", borderTop: "1px solid hsl(220 20% 90%)" }}>
        <div className="mx-auto w-full max-w-[1440px] px-5 md:px-8 lg:px-12">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-poppins text-[0.56rem] font-bold uppercase tracking-[0.25em]"
                 style={{ color: "hsl(25 85% 45%)" }}>Available Units</p>
              <h2 className="mt-1 text-[1rem] font-bold leading-tight md:text-[1.1rem] text-foreground"
                  style={{ fontFamily: "var(--font-arabic-display)" }}>
                {floorLabelsAr[selectedFloor]} — {floorAvailable} وحدة متاحة
              </h2>
            </div>
            <Link to="/leasing">
              <Button variant="orange" size="sm" className="h-9 rounded-xl px-5 text-[0.76rem] font-bold shadow-sm">
                <Phone className="ml-1.5 h-3.5 w-3.5" /> استفسر الآن
              </Button>
            </Link>
          </div>

          {filteredUnits.filter((u) => u.status === "available").length > 0 ? (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
              {filteredUnits.filter((u) => u.status === "available").map((unit) => (
                <button
                  key={unit.id}
                  onClick={() => { setSelectedUnit(unit); mapRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }}
                  className={`group rounded-xl border p-3.5 text-right transition-all duration-200 ${
                    activeUnit?.id === unit.id
                      ? "border-orange-400 shadow-[0_0_0_1px_hsl(25_95%_55%/0.3)]"
                      : "border-border bg-card hover:border-orange-300 hover:shadow-sm"
                  }`}
                  style={activeUnit?.id === unit.id ? { background: "hsl(35 100% 97%)" } : {}}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[0.85rem] font-bold text-foreground">{unit.code}</p>
                    <span className="flex items-center gap-1 text-[0.68rem] font-bold" style={{ color: "hsl(25 85% 40%)" }}>
                      <Ruler className="h-3 w-3" />
                      {unit.area} م²
                    </span>
                  </div>
                  <p className="mt-1 text-[0.68rem] font-medium text-muted-foreground">{floorLabelsAr[unit.floor]}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="flex items-center gap-1 rounded-md px-2 py-0.5 text-[0.6rem] font-bold"
                          style={{ background: "hsl(35 100% 95%)", color: "hsl(25 85% 40%)", border: "1px solid hsl(25 95% 55% / 0.2)" }}>
                      <div className="h-1.5 w-1.5 rounded-full" style={{ background: "hsl(25 95% 55%)" }} />
                      متاحة
                    </span>
                    <ArrowUpLeft className="h-3.5 w-3.5 text-muted-foreground/30 transition-all group-hover:text-primary group-hover:-translate-y-0.5 group-hover:-translate-x-0.5" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-card px-6 py-5 text-center">
              <Compass className="mx-auto mb-2 h-6 w-6 text-muted-foreground/30" />
              <p className="text-[0.8rem] font-semibold text-muted-foreground">لا توجد وحدات متاحة ضمن الفلاتر الحالية.</p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════ COMMERCIAL OPPORTUNITY ═══════════ */}
      <section className="py-8 md:py-10" style={{ background: "hsl(38 25% 95%)" }}>
        <div className="mx-auto w-full max-w-[1440px] px-5 md:px-8 lg:px-12">
          <div className="grid items-start gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}
                        className="space-y-5">
              <div>
                <p className="font-poppins text-[0.56rem] font-bold uppercase tracking-[0.25em]" style={{ color: "hsl(var(--primary))" }}>
                  الفرصة التجارية
                </p>
                <h2 className="mt-1.5 text-[1.1rem] font-bold leading-tight md:text-[1.3rem] text-foreground"
                    style={{ fontFamily: "var(--font-arabic-display)" }}>
                  وحدتك في موقع مُثبت.
                </h2>
              </div>
              <p className="text-[0.86rem] leading-[1.8] max-w-[28rem] text-muted-foreground">
                وحدات متعددة المساحات — في مكان يعرفه السوق ويقصده.
              </p>

              {/* Floor availability cards */}
              <div className="grid grid-cols-3 gap-2.5">
                {mallFloors.map((f) => {
                  const avail = f.units.filter((u) => u.status === "available").length;
                  return (
                    <div key={f.id} className="rounded-xl border border-border bg-card px-4 py-3.5 text-center transition-all hover:shadow-sm">
                      <p className="font-poppins text-[1.2rem] font-extrabold text-foreground">{avail}</p>
                      <p className="mt-0.5 text-[0.66rem] font-semibold text-muted-foreground">{f.label}</p>
                    </div>
                  );
                })}
              </div>

              {/* Value props */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: MapPin, label: "موقع مقصود" },
                  { icon: Users, label: "جمهور بنيّة شراء" },
                  { icon: TrendingUp, label: "طلب متنامٍ" },
                  { icon: Layers, label: "تصنيف دقيق" },
                ].map((p) => (
                  <div key={p.label} className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-3.5 py-2.5 transition-all hover:border-primary/20">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: "hsl(var(--primary) / 0.08)" }}>
                      <p.icon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-[0.8rem] font-bold text-foreground">{p.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <Link to="/leasing">
                  <Button variant="orange" className="h-11 rounded-xl px-6 font-bold text-[0.84rem] shadow-md shadow-orange-500/15">
                    استفسار التأجير
                  </Button>
                </Link>
                <Link to="/stores">
                  <Button variant="outline-blue" className="h-11 rounded-xl px-6 text-[0.84rem] font-bold">
                    تصفّح المتاجر
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Featured available units */}
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.45, delay: 0.1 }}
                        className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-[3px] w-4 rounded-full" style={{ background: "hsl(25 95% 55%)" }} />
                <p className="text-[0.72rem] font-bold tracking-[0.14em] uppercase text-muted-foreground">وحدات مميزة</p>
              </div>
              {availableMallUnits.slice(0, 3).map((unit) => (
                <button
                  key={unit.id}
                  onClick={() => { setSelectedFloor(unit.floor); setSelectedUnit(unit); mapRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }}
                  className="group flex w-full flex-col rounded-xl border border-border bg-card p-4.5 text-right transition-all duration-200 hover:border-orange-300/40 hover:shadow-md hover:shadow-orange-500/5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[0.92rem] font-bold text-foreground">وحدة {unit.code}</p>
                      <p className="mt-0.5 text-[0.78rem] text-muted-foreground">{unit.category ?? ""}</p>
                    </div>
                    <span className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-[0.66rem] font-bold"
                          style={{ background: "hsl(35 100% 95%)", color: "hsl(25 85% 40%)", border: "1px solid hsl(25 95% 55% / 0.2)" }}>
                      <div className="h-1.5 w-1.5 rounded-full" style={{ background: "hsl(25 95% 55%)" }} />
                      متاحة
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="rounded-lg py-2.5 px-3" style={{ background: "hsl(220 20% 97%)" }}>
                      <p className="text-[0.62rem] text-muted-foreground">الدور</p>
                      <p className="mt-0.5 text-[0.86rem] font-bold text-foreground">{floorLabelsAr[unit.floor]}</p>
                    </div>
                    <div className="rounded-lg py-2.5 px-3" style={{ background: "hsl(220 20% 97%)" }}>
                      <p className="text-[0.62rem] text-muted-foreground">المساحة</p>
                      <p className="mt-0.5 text-[0.86rem] font-bold text-foreground">{unit.area} م²</p>
                    </div>
                  </div>
                </button>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════ FINAL CTA ═══════════ */}
      <section className="relative overflow-hidden py-8 md:py-10" style={{ background: "var(--gradient-hero)" }}>
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[500px] rounded-full opacity-[0.06]"
               style={{ background: "radial-gradient(circle, hsl(var(--primary)), transparent 70%)" }} />
        </div>
        <div className="relative mx-auto max-w-[640px] px-5 text-center">
          <p className="font-poppins text-[0.56rem] font-bold tracking-[0.3em] uppercase" style={{ color: "hsl(220 15% 45%)" }}>
            Commercial Leasing
          </p>
          <h2 className="mt-2 text-[1.05rem] font-bold md:text-[1.25rem]"
              style={{ color: "hsl(0 0% 97%)", fontFamily: "var(--font-arabic-display)" }}>
            تبحث عن وحدة تجارية في موقع فعّال؟
          </h2>
          <p className="mx-auto mt-2 max-w-[320px] text-[0.78rem] leading-relaxed" style={{ color: "hsl(220 15% 50%)" }}>
            وحدات متنوعة المساحات في قلب القاهرة الجديدة
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link to="/leasing">
              <Button variant="orange" className="h-11 rounded-xl px-6 text-[0.84rem] font-bold shadow-lg shadow-orange-500/20">
                <Phone className="ml-2 h-4 w-4" /> استفسار التأجير
              </Button>
            </Link>
            <Link to="/stores">
              <Button className="h-11 rounded-xl px-6 text-[0.84rem] font-bold transition-all"
                      style={{ background: "hsl(0 0% 100% / 0.06)", border: "1px solid hsl(0 0% 100% / 0.12)", color: "hsl(220 20% 80%)" }}>
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
        onViewOnMap={(unitCode: string) => {
          const targetUnit = allMallUnits.find((u) => u.code === unitCode);
          if (targetUnit) {
            setSelectedFloor(targetUnit.floor);
            setSelectedUnit(targetUnit);
            setHighlightedUnitIds(new Set([targetUnit.id]));
            scrollToMap();
          }
        }}
      />
    </MainLayout>
  );
};

export default InteractiveMap;
