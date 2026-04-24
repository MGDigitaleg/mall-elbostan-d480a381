import { useEffect, useRef, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft, Sparkles, Check,
  Map as MapIcon, Store, ShoppingBag, Tag, Trophy, PartyPopper, Building2, Boxes,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { deviceCatalog } from "@/lib/deviceCatalog";
import { TechPlanetCatalog } from "@/components/home/TechPlanetCatalog";
import { TechPlanetDirectory } from "@/components/home/TechPlanetDirectory";


type Device = {
  Icon: LucideIcon;
  label: string;
  slug: string;
};

// Build orbit lists from the centralized device catalog so each icon
// always points at its dedicated SEO landing page (/devices/:slug).
// Auto-distributed by the `orbit` field on each entry — guarantees 100% coverage.
const META_KEYS = new Set(["seo"]);
const allDevices = Object.values(deviceCatalog).filter(
  (e: any) => e && typeof e === "object" && "slug" in e && !META_KEYS.has((e as any).slug),
);

const toDevice = (d: any): Device => ({ Icon: d.Icon, label: d.labelAr, slug: d.slug });

const innerOrbit: Device[] = allDevices.filter((d: any) => d.orbit === "inner").map(toDevice);
const middleOrbit: Device[] = allDevices.filter((d: any) => d.orbit === "middle").map(toDevice);
const outerOrbit: Device[] = allDevices.filter((d: any) => d.orbit === "outer").map(toDevice);

// Satellites — clickable links to mall experiences & sections
type Satellite = {
  Icon: LucideIcon;
  label: string;
  to: string;
  color: string;
};
const satellites: Satellite[] = [
  { Icon: MapIcon, label: "الخريطة التفاعلية", to: "/map", color: "#7DD3FC" },
  { Icon: Store, label: "دليل المحلات", to: "/stores", color: "#A78BFA" },
  { Icon: ShoppingBag, label: "كل المنتجات", to: "/products", color: "#60A5FA" },
  { Icon: Tag, label: "عروض اليوم", to: "/daily-deals", color: "#F97316" },
  { Icon: Trophy, label: "اربح بدورة", to: "/spin-win", color: "#FCD34D" },
  { Icon: PartyPopper, label: "يوم الافتتاح", to: "/opening-day", color: "#EC4899" },
  { Icon: Building2, label: "فرع وسط البلد", to: "/downtown-directory", color: "#CDBB9A" },
  { Icon: Boxes, label: "كسر زيرو", to: "/kz", color: "#06B6D4" },
];

// Clickable constellation stars — 8 prominent stars link to utility pages
const CONSTELLATION_LINKS: { to: string; title: string }[] = [
  { to: "/about", title: "عن مول البستان" },
  { to: "/leasing", title: "التأجير" },
  { to: "/contact", title: "تواصل معنا" },
  { to: "/faq", title: "الأسئلة الشائعة" },
  { to: "/blog", title: "المدوّنة" },
  { to: "/careers", title: "الوظائف" },
  { to: "/market-echo", title: "صدى السوق" },
  { to: "/join-marketplace", title: "انضم للسوق الرقمي" },
];

// Dev-only audit: ensure every catalog device lands on an orbit ring.
const computeOrbitAudit = () => {
  const orbitSlugs = [...innerOrbit, ...middleOrbit, ...outerOrbit].map((d) => d.slug);
  const seen = new Set<string>();
  const duplicates = orbitSlugs.filter((s) => (seen.has(s) ? true : (seen.add(s), false)));
  const catalogSlugs = Object.keys(deviceCatalog).filter((k) => !META_KEYS.has(k));
  const missing = catalogSlugs.filter((s) => !seen.has(s));
  return { missing, duplicates, catalogSlugs };
};

if (import.meta.env.DEV) {
  const { missing, duplicates, catalogSlugs } = computeOrbitAudit();
  if (missing.length || duplicates.length) {
    // eslint-disable-next-line no-console
    console.warn(
      `[TechPlanetSection] Audit — ${missing.length} missing · ${duplicates.length} duplicate`,
      { missing, duplicates },
    );
  } else {
    // eslint-disable-next-line no-console
    console.info(
      `[TechPlanetSection] ✓ All ${catalogSlugs.length} catalog devices mapped (${innerOrbit.length}/${middleOrbit.length}/${outerOrbit.length}).`,
    );
  }
}


type OrbitProps = {
  devices: Device[];
  radius: number;
  duration: number;
  iconSize: number;
  reverse?: boolean;
  active: boolean;
  reduce: boolean;
  paused: boolean;
  onHoverChange: (hovered: boolean) => void;
  iconColor: string;
};

const Orbit = ({
  devices, radius, duration, iconSize, reverse, active, reduce, paused, onHoverChange, iconColor,
}: OrbitProps) => {
  const playState = !active || reduce || paused ? "paused" : "running";
  const direction = reverse ? "reverse" : "normal";

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        willChange: "transform",
        animation: `tp-spin ${duration}s linear infinite`,
        animationPlayState: playState,
        animationDirection: direction,
      }}
    >
      {devices.map((d, i) => {
        const angle = (i / devices.length) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        return (
          <DeviceBadge
            key={`${d.label}-${i}`}
            device={d}
            x={x}
            y={y}
            size={iconSize}
            counterRotateDuration={duration}
            reverse={reverse}
            playState={playState}
            onHoverChange={onHoverChange}
            iconColor={iconColor}
          />
        );
      })}
    </div>
  );
};

const DeviceBadge = ({
  device, x, y, size, counterRotateDuration, reverse, playState, onHoverChange, iconColor,
}: {
  device: Device;
  x: number;
  y: number;
  size: number;
  counterRotateDuration: number;
  reverse?: boolean;
  playState: "running" | "paused";
  onHoverChange: (hovered: boolean) => void;
  iconColor: string;
}) => {
  const { Icon, label, slug } = device;
  // Counter-rotate in opposite direction of the orbit so icons stay upright
  const counterDirection = reverse ? "normal" : "reverse";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          to={`/devices/${slug}`}
          aria-label={label}
          onMouseEnter={() => onHoverChange(true)}
          onMouseLeave={() => onHoverChange(false)}
          onFocus={() => onHoverChange(true)}
          onBlur={() => onHoverChange(false)}
          className="absolute group focus:outline-none"
          style={{
            transform: `translate(${x}px, ${y}px)`,
            width: size,
            height: size,
            marginInlineStart: -size / 2,
            marginTop: -size / 2,
            insetInlineStart: "50%",
            top: "50%",
            ["--tp-icon" as string]: iconColor,
          }}
        >
          <div
            className="flex h-full w-full items-center justify-center rounded-xl border backdrop-blur-sm transition-all duration-300 group-hover:scale-[1.3] group-hover:border-[#FCD34D]/60"
            style={{
              borderColor: "rgba(205, 187, 154, 0.22)",
              background: "rgba(255, 255, 255, 0.04)",
              boxShadow: "0 4px 16px rgba(7, 19, 38, 0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
              willChange: "transform",
              animation: `tp-spin ${counterRotateDuration}s linear infinite`,
              animationDirection: counterDirection,
              animationPlayState: playState,
            }}
          >
            <Icon
              size={size * 0.5}
              strokeWidth={1.6}
              className="transition-colors duration-300 group-hover:text-[#FCD34D]"
              style={{ color: iconColor }}
            />
          </div>
        </Link>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        align="center"
        sideOffset={8}
        collisionPadding={12}
        avoidCollisions
        className="font-arabic text-[0.78rem] max-w-[60vw]"
      >
        <span className="flex items-center gap-1.5">
          {label}
          <ArrowLeft className="h-3 w-3 opacity-70" />
        </span>
      </TooltipContent>
    </Tooltip>
  );
};

type Intensity = "off" | "low" | "medium" | "high";
const INTENSITY_KEY = "tp-burst-intensity";
const INTENSITY_CONFIG: Record<Intensity, { channels: number; intervalMs: number; label: string }> = {
  off: { channels: 0, intervalMs: 0, label: "إيقاف" },
  low: { channels: 2, intervalMs: 4500, label: "منخفض" },
  medium: { channels: 4, intervalMs: 3000, label: "متوسط" },
  high: { channels: 7, intervalMs: 1600, label: "عالي" },
};

export const TechPlanetSection = () => {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [intensity, setIntensity] = useState<Intensity>(() => {
    if (typeof window === "undefined") return "medium";
    const v = window.localStorage.getItem(INTENSITY_KEY);
    return (v === "off" || v === "low" || v === "medium" || v === "high") ? v : "medium";
  });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsTriggerRef = useRef<HTMLButtonElement>(null);
  const settingsContainerRef = useRef<HTMLDivElement>(null);
  const settingsItemsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const [settingsFocusIndex, setSettingsFocusIndex] = useState(0);
  const [intensityAnnouncement, setIntensityAnnouncement] = useState("");

  // Close menu on outside click/touch
  useEffect(() => {
    if (!settingsOpen) return;
    const handlePointer = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (target && settingsContainerRef.current && !settingsContainerRef.current.contains(target)) {
        setSettingsOpen(false);
        // Return focus to the trigger so keyboard users keep their place
        requestAnimationFrame(() => settingsTriggerRef.current?.focus());
      }
    };
    document.addEventListener("pointerdown", handlePointer);
    return () => document.removeEventListener("pointerdown", handlePointer);
  }, [settingsOpen]);

  // Global Escape: close the menu and return focus to the trigger
  useEffect(() => {
    if (!settingsOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setSettingsOpen(false);
        requestAnimationFrame(() => settingsTriggerRef.current?.focus());
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [settingsOpen]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(INTENSITY_KEY, intensity);
    }
  }, [intensity]);

  // Focus first/active item when menu opens; restore focus to trigger on close
  useEffect(() => {
    if (settingsOpen) {
      const opts = Object.keys(INTENSITY_CONFIG) as Intensity[];
      const idx = Math.max(0, opts.indexOf(intensity));
      setSettingsFocusIndex(idx);
      requestAnimationFrame(() => settingsItemsRef.current[idx]?.focus());
    }
  }, [settingsOpen, intensity]);

  const handleSettingsTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setSettingsOpen(true);
    }
  };

  const handleSettingsMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const opts = Object.keys(INTENSITY_CONFIG) as Intensity[];
    if (e.key === "Escape") {
      e.preventDefault();
      setSettingsOpen(false);
      settingsTriggerRef.current?.focus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = (settingsFocusIndex + 1) % opts.length;
      setSettingsFocusIndex(next);
      settingsItemsRef.current[next]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = (settingsFocusIndex - 1 + opts.length) % opts.length;
      setSettingsFocusIndex(next);
      settingsItemsRef.current[next]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      setSettingsFocusIndex(0);
      settingsItemsRef.current[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      const last = opts.length - 1;
      setSettingsFocusIndex(last);
      settingsItemsRef.current[last]?.focus();
    } else if (e.key === "Tab") {
      setSettingsOpen(false);
    }
  };

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Curated 10-device set for mobile single orbit (balanced across categories)
  const mobileDevices = useMemo<Device[]>(
    () => {
      const wanted = ["laptops", "smartphones", "monitors", "headphones", "printers", "tablets", "smartwatches", "routers", "cameras", "macbook"];
      return wanted
        .map((s) => deviceCatalog[s])
        .filter(Boolean)
        .map((d: any) => ({ Icon: d.Icon, label: d.labelAr, slug: d.slug }));
    },
    [],
  );

  const sizes = useMemo(() => {
    if (isMobile) {
      // Single orbit, larger spacing, bigger icons for tap-friendliness
      return {
        stage: 340,
        core: 96,
        innerR: 130,
        middleR: 0,
        outerR: 0,
        satelliteR: 0,
        innerSize: 48,
        middleSize: 0,
        outerSize: 0,
        satelliteSize: 0,
        showMiddle: false,
        showOuter: false,
        showSatellites: false,
      };
    }
    return {
      stage: 880,
      core: 170,
      innerR: 145,
      middleR: 235,
      outerR: 335,
      satelliteR: 410,
      innerSize: 46,
      middleSize: 40,
      outerSize: 34,
      satelliteSize: 38,
      showMiddle: true,
      showOuter: true,
      showSatellites: true,
    };
  }, [isMobile]);

  const rings = [0, 1, 2];

  // Hovered orbit index (0=inner, 1=middle, 2=outer); pauses only that ring
  const [hoveredOrbit, setHoveredOrbit] = useState<number | null>(null);

  // Orbit definitions used to compute live device positions for energy bursts
  const innerDevices = isMobile ? mobileDevices : innerOrbit;
  const orbitDefs = useMemo(() => {
    const defs: { devices: Device[]; radius: number; duration: number; reverse: boolean }[] = [
      { devices: innerDevices, radius: sizes.innerR, duration: 18, reverse: false },
    ];
    if (sizes.showMiddle) defs.push({ devices: middleOrbit, radius: sizes.middleR, duration: 26, reverse: true });
    if (sizes.showOuter) defs.push({ devices: outerOrbit, radius: sizes.outerR, duration: 36, reverse: false });
    return defs;
  }, [sizes, innerDevices]);

  // Dynamic energy bursts — 4 channels that retarget every 3s to random devices
  type Burst = { id: number; orbitIdx: number; deviceIdx: number; startedAt: number };
  const [bursts, setBursts] = useState<Burst[]>([]);
  const burstIdRef = useRef(0);

  useEffect(() => {
    const cfg = INTENSITY_CONFIG[intensity];
    if (!active || reduce || cfg.channels === 0) {
      setBursts([]);
      return;
    }
    const pickBurst = (): Burst => {
      const orbitIdx = Math.floor(Math.random() * orbitDefs.length);
      const orbit = orbitDefs[orbitIdx];
      const deviceIdx = Math.floor(Math.random() * orbit.devices.length);
      burstIdRef.current += 1;
      return { id: burstIdRef.current, orbitIdx, deviceIdx, startedAt: performance.now() };
    };
    setBursts(Array.from({ length: cfg.channels }, pickBurst));
    const interval = setInterval(() => {
      setBursts((prev) => prev.map(() => pickBurst()));
    }, cfg.intervalMs);
    return () => clearInterval(interval);
  }, [active, reduce, orbitDefs, intensity]);

  // Animate burst endpoints in sync with orbit rotation
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!active || reduce) return;
    let raf = 0;
    const loop = () => {
      setTick((t) => (t + 1) % 100000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active, reduce]);

  const burstEndpoints = useMemo(() => {
    const now = performance.now() / 1000;
    return bursts.map((b) => {
      const orbit = orbitDefs[b.orbitIdx];
      if (!orbit) return { id: b.id, x: 0, y: 0 };
      const baseAngle = (b.deviceIdx / orbit.devices.length) * Math.PI * 2;
      const rotation = ((now / orbit.duration) * Math.PI * 2) * (orbit.reverse ? -1 : 1);
      const angle = baseAngle + rotation;
      return { id: b.id, x: Math.cos(angle) * orbit.radius, y: Math.sin(angle) * orbit.radius };
    });
    // tick forces recompute every frame
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bursts, orbitDefs, tick]);

  return (
    <TooltipProvider delayDuration={120}>
      <section
        ref={ref}
        aria-labelledby="tech-planet-title"
        className="relative overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 38%, #1B3470 0%, #0B1E48 22%, #050E2A 52%, #02060F 82%, #00030A 100%)",
          paddingTop: "clamp(56px, 7vw, 112px)",
          paddingBottom: "clamp(56px, 7vw, 112px)",
          minHeight: isMobile ? 580 : 760,
          contentVisibility: "auto",
          containIntrinsicSize: "auto 760px",
        }}
      >
        <style>{`
          @keyframes tp-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes tp-beam-rot { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes tp-beam-rot-rev { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
          @keyframes tp-nebula-pulse {
            0%,100% { opacity: 0.55; transform: translate(-50%,-50%) scale(1); }
            50% { opacity: 0.85; transform: translate(-50%,-50%) scale(1.08); }
          }
          @keyframes tp-twinkle {
            0%,100% { opacity: var(--tp-op,0.4); }
            50% { opacity: 0.05; }
          }
          @keyframes tp-shoot {
            0% { transform: translate(0,0) rotate(var(--tp-ang,-20deg)); opacity: 0; }
            10% { opacity: 1; }
            70% { opacity: 1; }
            100% { transform: translate(var(--tp-dx,-260px), var(--tp-dy,140px)) rotate(var(--tp-ang,-20deg)); opacity: 0; }
          }
          @keyframes tp-soon-pulse {
            0%,100% { box-shadow: 0 0 0 0 rgba(252,211,77,0.55), 0 0 18px rgba(252,211,77,0.35); }
            50% { box-shadow: 0 0 0 8px rgba(252,211,77,0), 0 0 28px rgba(252,211,77,0.6); }
          }
        `}</style>

        {/* Cosmic background layers */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* Deep nebula color wash (cyan + violet + gold ember) */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 18% 28%, rgba(125,211,252,0.18) 0%, transparent 42%), radial-gradient(circle at 82% 72%, rgba(167,139,250,0.20) 0%, transparent 45%), radial-gradient(circle at 50% 100%, rgba(252,211,77,0.10) 0%, transparent 55%)",
            }}
          />

          {/* Pulsing central nebula behind the orbits */}
          <div
            className="absolute left-1/2 top-1/2"
            style={{
              width: isMobile ? 460 : 720,
              height: isMobile ? 460 : 720,
              transform: "translate(-50%,-50%)",
              background:
                "radial-gradient(circle, rgba(96,165,250,0.35) 0%, rgba(167,139,250,0.22) 35%, rgba(7,19,38,0) 70%)",
              filter: "blur(30px)",
              animation: !reduce && active ? "tp-nebula-pulse 7s ease-in-out infinite" : undefined,
              willChange: "transform, opacity",
            }}
          />

          {/* Twin rotating conic light beams (counter-rotating) */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.22]"
            style={{
              width: "150%",
              height: "150%",
              background:
                "conic-gradient(from 0deg, transparent 0deg, rgba(125,211,252,0.45) 28deg, transparent 75deg, transparent 180deg, rgba(167,139,250,0.4) 215deg, transparent 270deg, transparent 360deg)",
              animation: !reduce && active ? "tp-beam-rot 60s linear infinite" : undefined,
              filter: "blur(50px)",
            }}
          />
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.14]"
            style={{
              width: "130%",
              height: "130%",
              background:
                "conic-gradient(from 90deg, transparent 0deg, rgba(252,211,77,0.30) 18deg, transparent 60deg, transparent 220deg, rgba(56,189,248,0.32) 250deg, transparent 300deg, transparent 360deg)",
              animation: !reduce && active ? "tp-beam-rot-rev 95s linear infinite" : undefined,
              filter: "blur(60px)",
            }}
          />

          {/* Vignette — tightens focus to the planet */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,3,10,0.65) 75%, rgba(0,3,10,0.98) 100%)",
            }}
          />

          {/* Stars layer — 90 stars; 8 of the largest are clickable constellation links */}
          <svg className="absolute inset-0 h-full w-full pointer-events-none" aria-hidden={false} role="presentation">
            {(() => {
              const stars = Array.from({ length: 90 });
              let prominentIdx = 0;
              return stars.map((_, i) => {
                const cx = (i * 53.7) % 100;
                const cy = (i * 31.3) % 100;
                const isProminent = i % 6 === 0;
                const r = isProminent ? 1.6 : i % 3 === 0 ? 1.1 : 0.7;
                const op = i % 4 === 0 ? 0.9 : i % 2 === 0 ? 0.6 : 0.32;
                const fill =
                  i % 9 === 0 ? "#FCD34D" :
                  i % 5 === 0 ? "#A78BFA" :
                  i % 3 === 0 ? "#7DD3FC" : "#E0F2FE";
                const twinkle = !reduce && active && i % 4 === 0;
                const twinkleStyle = twinkle ? {
                  ["--tp-op" as string]: String(op),
                  animation: `tp-twinkle ${3 + (i % 5)}s ease-in-out ${(i % 7) * 0.4}s infinite`,
                } : undefined;

                // First 8 prominent stars become navigation portals
                if (isProminent && prominentIdx < CONSTELLATION_LINKS.length) {
                  const link = CONSTELLATION_LINKS[prominentIdx];
                  prominentIdx += 1;
                  return (
                    <Link key={i} to={link.to} aria-label={link.title} style={{ pointerEvents: "auto" }}>
                      <g className="group cursor-pointer">
                        <title>{link.title}</title>
                        {/* Outer halo on hover */}
                        <circle
                          cx={`${cx}%`}
                          cy={`${cy}%`}
                          r={r * 5}
                          fill="#FCD34D"
                          opacity={0}
                          className="transition-opacity duration-300 group-hover:opacity-20 group-focus-visible:opacity-25"
                        />
                        <circle
                          cx={`${cx}%`}
                          cy={`${cy}%`}
                          r={r * 1.2}
                          fill={fill}
                          opacity={Math.min(1, op + 0.1)}
                          className="transition-all duration-300 group-hover:fill-[#FCD34D]"
                          style={twinkleStyle}
                        />
                      </g>
                    </Link>
                  );
                }

                return (
                  <circle
                    key={i}
                    cx={`${cx}%`}
                    cy={`${cy}%`}
                    r={r}
                    fill={fill}
                    opacity={op}
                    style={twinkleStyle}
                  />
                );
              });
            })()}
          </svg>

          {/* Shooting stars — 3 streaks at varied delays */}
          {!reduce && active && [0, 1, 2].map((i) => {
            const cfgs = [
              { top: "18%", left: "82%", dx: "-340px", dy: "180px", ang: "-28deg", dur: 7, delay: 1.2 },
              { top: "62%", left: "70%", dx: "-280px", dy: "120px", ang: "-22deg", dur: 9, delay: 4.5 },
              { top: "38%", left: "90%", dx: "-420px", dy: "230px", ang: "-30deg", dur: 11, delay: 7.8 },
            ];
            const c = cfgs[i];
            return (
              <span
                key={`shoot-${i}`}
                className="absolute"
                style={{
                  top: c.top,
                  left: c.left,
                  width: 120,
                  height: 1.5,
                  background: "linear-gradient(90deg, rgba(255,255,255,0.95), rgba(125,211,252,0.7) 40%, transparent)",
                  borderRadius: 999,
                  filter: "drop-shadow(0 0 6px rgba(125,211,252,0.8))",
                  ["--tp-dx" as string]: c.dx,
                  ["--tp-dy" as string]: c.dy,
                  ["--tp-ang" as string]: c.ang,
                  animation: `tp-shoot ${c.dur}s ease-in ${c.delay}s infinite`,
                  willChange: "transform, opacity",
                }}
              />
            );
          })}
        </div>


        {/* Energy intensity settings */}
        <div className="absolute end-4 top-4 z-20">
          <div className="relative" ref={settingsContainerRef}>
            <button
              ref={settingsTriggerRef}
              type="button"
              onClick={() => setSettingsOpen((v) => !v)}
              onKeyDown={handleSettingsTriggerKeyDown}
              aria-label="إعدادات شدة الطاقة"
              aria-haspopup="menu"
              aria-expanded={settingsOpen}
              className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-[0.72rem] font-arabic backdrop-blur-md transition-colors"
              style={{
                borderColor: "rgba(205,187,154,0.3)",
                background: "rgba(7,19,38,0.6)",
                color: "#CDBB9A",
              }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>شدة الطاقة: {reduce ? INTENSITY_CONFIG.off.label : INTENSITY_CONFIG[intensity].label}</span>
            </button>
            {settingsOpen && (
              <div
                role="menu"
                aria-label="شدة الطاقة"
                onKeyDown={handleSettingsMenuKeyDown}
                className="absolute end-0 mt-2 min-w-[180px] overflow-hidden rounded-lg border shadow-xl"
                style={{
                  borderColor: "rgba(205,187,154,0.25)",
                  background: "rgba(7,19,38,0.96)",
                  backdropFilter: "blur(8px)",
                }}
              >
                {reduce && (
                  <div
                    role="note"
                    className="px-3 py-2 text-right font-arabic text-[0.7rem]"
                    style={{ color: "rgba(205,187,154,0.85)", borderBottom: "1px solid rgba(205,187,154,0.18)" }}
                  >
                    تم إيقاف التأثيرات تلقائياً وفق إعدادات تقليل الحركة في النظام.
                  </div>
                )}
                {(Object.keys(INTENSITY_CONFIG) as Intensity[]).map((opt, i) => {
                  const effective = reduce ? "off" : intensity;
                  const isActive = effective === opt;
                  const disabled = reduce && opt !== "off";
                  return (
                    <button
                      key={opt}
                      ref={(el) => { settingsItemsRef.current[i] = el; }}
                      type="button"
                      role="menuitemradio"
                      aria-checked={isActive}
                      aria-disabled={disabled}
                      disabled={disabled}
                      tabIndex={settingsFocusIndex === i ? 0 : -1}
                      onClick={() => {
                        if (disabled) return;
                        setIntensity(opt);
                        setIntensityAnnouncement(`تم ضبط شدة الطاقة على ${INTENSITY_CONFIG[opt].label}`);
                        setSettingsOpen(false);
                        settingsTriggerRef.current?.focus();
                      }}
                      className="flex w-full items-center justify-between gap-2 px-3 py-2 text-right font-arabic text-[0.78rem] transition-colors hover:bg-white/[0.06] focus:bg-white/[0.08] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                      style={{ color: isActive ? "#CDBB9A" : "rgba(255,255,255,0.78)" }}
                    >
                      <span>{INTENSITY_CONFIG[opt].label}</span>
                      {isActive && <Check className="h-3.5 w-3.5" />}
                    </button>
                  );
                })}
              </div>
            )}
            {/* ARIA live region for screen-reader announcements */}
            <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
              {intensityAnnouncement}
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0">
          {Array.from({ length: 30 }).map((_, i) => {
            const top = (i * 37) % 100;
            const left = (i * 53) % 100;
            const delay = (i % 7) * 0.4;
            const dur = 6 + (i % 5);
            return (
              <motion.span
                key={i}
                className="absolute rounded-full"
                style={{
                  top: `${top}%`,
                  left: `${left}%`,
                  width: 2,
                  height: 2,
                  background: i % 3 === 0 ? "#CDBB9A" : "#60A5FA",
                  opacity: 0.35,
                  willChange: "transform, opacity",
                }}
                animate={
                  active && !reduce
                    ? { y: [0, -20, 0], opacity: [0.15, 0.5, 0.15] }
                    : { y: 0, opacity: 0.25 }
                }
                transition={{
                  repeat: Infinity,
                  duration: dur,
                  delay,
                  ease: "easeInOut",
                }}
              />
            );
          })}
        </div>

        <div className="container relative">
          <div className="mx-auto max-w-[44rem] text-center">
            <p
              className="font-arabic text-[0.72rem] uppercase tracking-[0.4em]"
              style={{ color: "#CDBB9A" }}
            >
              كوكب البستان
            </p>
            <h2
              id="tech-planet-title"
              className="mt-3 font-arabic-display text-[clamp(1.75rem,3.6vw,2.75rem)] font-semibold leading-tight text-white"
            >
              كل ما تحتاجه يدور حولك.
            </h2>
            <p
              className="mx-auto mt-4 max-w-[36rem] font-arabic text-[0.95rem] leading-relaxed"
              style={{ color: "rgba(255,255,255,0.72)" }}
            >
              من اللابتوب لشاشة الجيمنج، من الموبايل لكارت الشاشة — المول كله مركز واحد للتقنية في قلب القاهرة.
            </p>
          </div>

          <div
            className="relative mx-auto mt-10"
            style={{ width: sizes.stage, height: sizes.stage, maxWidth: "100%" }}
          >
            {!reduce && rings.map((i) => (
              <motion.div
                key={`ring-${i}`}
                className="absolute inset-0 rounded-full border"
                style={{
                  borderColor: "rgba(125, 211, 252, 0.22)",
                  willChange: "transform, opacity",
                }}
                animate={active ? { scale: [0.6, 1.6], opacity: [0.5, 0] } : { scale: 0.6, opacity: 0 }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  delay: i * 1.3,
                  ease: "easeOut",
                }}
              />
            ))}

            {[
              { r: sizes.innerR, color: "rgba(125, 211, 252, 0.18)" },
              { r: sizes.middleR, color: "rgba(96, 165, 250, 0.14)" },
              { r: sizes.outerR, color: "rgba(167, 139, 250, 0.16)" },
            ].filter((g) => g.r > 0).map((g, i) => (
              <div
                key={`guide-${i}`}
                className="pointer-events-none absolute rounded-full border"
                style={{
                  width: g.r * 2,
                  height: g.r * 2,
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  borderColor: g.color,
                  borderStyle: "dashed",
                }}
              />
            ))}

            <svg
              className="pointer-events-none absolute inset-0"
              viewBox={`-${sizes.stage / 2} -${sizes.stage / 2} ${sizes.stage} ${sizes.stage}`}
              style={{ width: "100%", height: "100%" }}
              aria-hidden
            >
              <defs>
                <linearGradient id="energyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7DD3FC" stopOpacity="0" />
                  <stop offset="35%" stopColor="#60A5FA" stopOpacity="0.95" />
                  <stop offset="70%" stopColor="#A78BFA" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#FCD34D" stopOpacity="0.95" />
                </linearGradient>
                <radialGradient id="burstHead">
                  <stop offset="0%" stopColor="#FCD34D" stopOpacity="1" />
                  <stop offset="100%" stopColor="#FCD34D" stopOpacity="0" />
                </radialGradient>
              </defs>
              {burstEndpoints.map((p) => (
                <g key={p.id}>
                  <motion.line
                    x1={0}
                    y1={0}
                    x2={p.x}
                    y2={p.y}
                    stroke="url(#energyGrad)"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    initial={{ opacity: 0, pathLength: 0 }}
                    animate={{ opacity: [0, 1, 1, 0], pathLength: [0, 1, 1, 1] }}
                    transition={{ duration: 2.8, ease: "easeOut", times: [0, 0.25, 0.75, 1] }}
                  />
                  <motion.circle
                    r={5}
                    fill="url(#burstHead)"
                    initial={{ cx: 0, cy: 0, opacity: 0 }}
                    animate={{ cx: p.x, cy: p.y, opacity: [0, 1, 0] }}
                    transition={{ duration: 1.2, ease: "easeOut", times: [0, 0.6, 1] }}
                  />
                </g>
              ))}
            </svg>

            <Orbit
              devices={innerDevices}
              radius={sizes.innerR}
              duration={18}
              iconSize={sizes.innerSize}
              active={active}
              reduce={reduce}
              paused={hoveredOrbit === 0}
              onHoverChange={(h) => setHoveredOrbit(h ? 0 : null)}
              iconColor="#7DD3FC"
            />
            {sizes.showMiddle && (
              <Orbit
                devices={middleOrbit}
                radius={sizes.middleR}
                duration={26}
                iconSize={sizes.middleSize}
                reverse
                active={active}
                reduce={reduce}
                paused={hoveredOrbit === 1}
                onHoverChange={(h) => setHoveredOrbit(h ? 1 : null)}
                iconColor="#60A5FA"
              />
            )}
            {sizes.showOuter && (
              <Orbit
                devices={outerOrbit}
                radius={sizes.outerR}
                duration={36}
                iconSize={sizes.outerSize}
                active={active}
                reduce={reduce}
                paused={hoveredOrbit === 2}
                onHoverChange={(h) => setHoveredOrbit(h ? 2 : null)}
                iconColor="#A78BFA"
              />
            )}

            <div
              className="absolute"
              style={{
                width: sizes.core,
                height: sizes.core,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(125,211,252,0.55) 0%, rgba(167,139,250,0.30) 40%, rgba(252,211,77,0.10) 65%, transparent 78%)",
                  filter: "blur(10px)",
                  willChange: "opacity, transform",
                }}
                animate={active && !reduce ? { scale: [1, 1.14, 1], opacity: [0.75, 1, 0.75] } : { scale: 1, opacity: 0.75 }}
                transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
              />

              <svg
                viewBox="0 0 100 100"
                className="relative z-10 h-full w-full"
                aria-hidden
              >
                <defs>
                  <linearGradient id="bldg" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1F61FF" />
                    <stop offset="100%" stopColor="#0D1F3C" />
                  </linearGradient>
                  <linearGradient id="bldgEdge" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#CDBB9A" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#CDBB9A" stopOpacity="0.2" />
                  </linearGradient>
                </defs>
                <polygon
                  points="30,12 70,12 88,30 88,70 70,88 30,88 12,70 12,30"
                  fill="url(#bldg)"
                  stroke="url(#bldgEdge)"
                  strokeWidth="1.2"
                />
                <line x1="14" y1="38" x2="86" y2="38" stroke="#CDBB9A" strokeOpacity="0.35" strokeWidth="0.6" />
                <line x1="14" y1="58" x2="86" y2="58" stroke="#CDBB9A" strokeOpacity="0.35" strokeWidth="0.6" />
                {[24, 38, 52, 66].map((y) =>
                  [26, 38, 50, 62, 74].map((x) => (
                    <rect
                      key={`w-${x}-${y}`}
                      x={x}
                      y={y}
                      width="6"
                      height="3"
                      fill="#CDBB9A"
                      opacity={(x + y) % 7 === 0 ? 0.85 : 0.4}
                    />
                  ))
                )}
                <rect x="46" y="80" width="8" height="8" fill="#CDBB9A" opacity="0.9" />
              </svg>

              <div
                className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
                style={{ bottom: -42 }}
              >
                <div
                  className="whitespace-nowrap rounded-full px-3.5 py-1 font-arabic-display text-[0.78rem] font-bold"
                  style={{
                    background: "rgba(7, 19, 38, 0.9)",
                    color: "#FCD34D",
                    border: "1px solid rgba(252,211,77,0.4)",
                    letterSpacing: "0.06em",
                  }}
                >
                  كوكب البستان
                </div>
                <div
                  className="whitespace-nowrap rounded-full px-2.5 py-0.5 font-arabic text-[0.62rem] font-bold tracking-[0.2em]"
                  style={{
                    background: "linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)",
                    color: "#071326",
                    animation: !reduce && active ? "tp-soon-pulse 2.6s ease-in-out infinite" : undefined,
                  }}
                >
                  قريباً
                </div>
              </div>
            </div>
          </div>

          <TechPlanetCatalog inner={innerOrbit} middle={middleOrbit} outer={outerOrbit} />

          <TechPlanetDirectory />

        </div>
      </section>
    </TooltipProvider>
  );
};

export default TechPlanetSection;
