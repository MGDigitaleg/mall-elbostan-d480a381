import { useEffect, useRef, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  Laptop, Smartphone, Monitor, Cpu, Headphones, Keyboard,
  HardDrive, Mouse, Camera, Gamepad2, Printer, Router,
  Tablet, Watch, Speaker, MemoryStick, Webcam, Cable, Zap, Wifi, Wrench,
  ArrowLeft, Sparkles, Check, type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";

type Device = {
  Icon: LucideIcon;
  label: string;
  category: string;
};

// Category slugs MUST match existing values in the `stores.category` column.
// Verified DB categories (Arabic): الهواتف والإكسسوارات · الكمبيوتر والأجهزة ·
// الألعاب والترفيه · الشبكات والأنظمة الأمنية · الطباعة والتصوير · الصيانة والدعم الفني
const CAT = {
  phones: "الهواتف والإكسسوارات",
  computers: "الكمبيوتر والأجهزة",
  gaming: "الألعاب والترفيه",
  networking: "الشبكات والأنظمة الأمنية",
  printing: "الطباعة والتصوير",
  maintenance: "الصيانة والدعم الفني",
} as const;

const innerOrbit: Device[] = [
  { Icon: Laptop, label: "لابتوبات", category: CAT.computers },
  { Icon: Smartphone, label: "هواتف ذكية", category: CAT.phones },
  { Icon: Monitor, label: "شاشات", category: CAT.computers },
  { Icon: Cpu, label: "معالجات", category: CAT.computers },
  { Icon: Headphones, label: "سماعات", category: CAT.phones },
  { Icon: Keyboard, label: "لوحات مفاتيح", category: CAT.computers },
];

const middleOrbit: Device[] = [
  { Icon: HardDrive, label: "تخزين", category: CAT.computers },
  { Icon: Mouse, label: "ماوس", category: CAT.computers },
  { Icon: Camera, label: "كاميرات", category: CAT.printing },
  { Icon: Gamepad2, label: "جيمنج", category: CAT.gaming },
  { Icon: Printer, label: "طابعات", category: CAT.printing },
  { Icon: Router, label: "راوترات", category: CAT.networking },
];

const outerOrbit: Device[] = [
  { Icon: Tablet, label: "تابلت", category: CAT.phones },
  { Icon: Watch, label: "ساعات ذكية", category: CAT.phones },
  { Icon: Speaker, label: "سبيكر", category: CAT.phones },
  { Icon: MemoryStick, label: "رامات", category: CAT.computers },
  { Icon: Webcam, label: "ويب كام", category: CAT.printing },
  { Icon: Cable, label: "كابلات", category: CAT.phones },
  { Icon: Zap, label: "شواحن", category: CAT.phones },
  { Icon: Wifi, label: "شبكات", category: CAT.networking },
];

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
};

const Orbit = ({
  devices, radius, duration, iconSize, reverse, active, reduce, paused, onHoverChange,
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
          />
        );
      })}
    </div>
  );
};

const DeviceBadge = ({
  device, x, y, size, counterRotateDuration, reverse, playState, onHoverChange,
}: {
  device: Device;
  x: number;
  y: number;
  size: number;
  counterRotateDuration: number;
  reverse?: boolean;
  playState: "running" | "paused";
  onHoverChange: (hovered: boolean) => void;
}) => {
  const { Icon, label, category } = device;
  // Counter-rotate in opposite direction of the orbit so icons stay upright
  const counterDirection = reverse ? "normal" : "reverse";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          to={`/stores?category=${encodeURIComponent(category)}`}
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
          }}
        >
          <div
            className="flex h-full w-full items-center justify-center rounded-xl border backdrop-blur-sm transition-transform duration-300 group-hover:scale-[1.3]"
            style={{
              borderColor: "rgba(205, 187, 154, 0.25)",
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
              className="text-[#60A5FA] transition-colors duration-300 group-hover:text-[#CDBB9A]"
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
        {label}
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

  // Close menu on outside click/touch
  useEffect(() => {
    if (!settingsOpen) return;
    const handlePointer = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (target && settingsContainerRef.current && !settingsContainerRef.current.contains(target)) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener("pointerdown", handlePointer);
    return () => document.removeEventListener("pointerdown", handlePointer);
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

  // Curated 8-device set for mobile single orbit (one per category, balanced)
  const mobileDevices = useMemo<Device[]>(() => [
    { Icon: Laptop, label: "لابتوبات", category: CAT.computers },
    { Icon: Smartphone, label: "هواتف ذكية", category: CAT.phones },
    { Icon: Monitor, label: "شاشات", category: CAT.computers },
    { Icon: Gamepad2, label: "جيمنج", category: CAT.gaming },
    { Icon: Headphones, label: "سماعات", category: CAT.phones },
    { Icon: Printer, label: "طباعة", category: CAT.printing },
    { Icon: Wrench, label: "صيانة", category: CAT.maintenance },
    { Icon: Router, label: "شبكات", category: CAT.networking },
  ], []);

  const sizes = useMemo(() => {
    if (isMobile) {
      // Single orbit, larger spacing, bigger icons for tap-friendliness
      return {
        stage: 340,
        core: 96,
        innerR: 130,
        middleR: 0,
        outerR: 0,
        innerSize: 48,
        middleSize: 0,
        outerSize: 0,
        showMiddle: false,
        showOuter: false,
      };
    }
    return {
      stage: 620,
      core: 150,
      innerR: 140,
      middleR: 220,
      outerR: 295,
      innerSize: 44,
      middleSize: 44,
      outerSize: 44,
      showMiddle: true,
      showOuter: true,
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
            "linear-gradient(160deg, #071326 0%, #0D1F3C 50%, #071326 100%)",
          paddingTop: "clamp(56px, 7vw, 112px)",
          paddingBottom: "clamp(56px, 7vw, 112px)",
          minHeight: isMobile ? 580 : 720,
          contentVisibility: "auto",
          containIntrinsicSize: "auto 720px",
        }}
      >
        <style>{`@keyframes tp-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

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
                  borderColor: "rgba(96, 165, 250, 0.18)",
                  willChange: "transform, opacity",
                }}
                animate={active ? { scale: [0.6, 1.6], opacity: [0.45, 0] } : { scale: 0.6, opacity: 0 }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  delay: i * 1.3,
                  ease: "easeOut",
                }}
              />
            ))}

            {[sizes.innerR, sizes.middleR, sizes.outerR].filter(Boolean).map((r, i) => (
              <div
                key={`guide-${i}`}
                className="pointer-events-none absolute rounded-full border"
                style={{
                  width: r * 2,
                  height: r * 2,
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  borderColor: "rgba(205, 187, 154, 0.08)",
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
                  <stop offset="0%" stopColor="#60A5FA" stopOpacity="0" />
                  <stop offset="40%" stopColor="#2563EB" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#CDBB9A" stopOpacity="0.9" />
                </linearGradient>
                <radialGradient id="burstHead">
                  <stop offset="0%" stopColor="#CDBB9A" stopOpacity="1" />
                  <stop offset="100%" stopColor="#CDBB9A" stopOpacity="0" />
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
                    "radial-gradient(circle, rgba(37,99,235,0.55) 0%, rgba(37,99,235,0.15) 45%, transparent 70%)",
                  filter: "blur(8px)",
                  willChange: "opacity, transform",
                }}
                animate={active && !reduce ? { scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] } : { scale: 1, opacity: 0.7 }}
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
                className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 font-arabic-display text-[0.7rem] font-semibold"
                style={{
                  bottom: -28,
                  background: "rgba(7, 19, 38, 0.85)",
                  color: "#CDBB9A",
                  border: "1px solid rgba(205,187,154,0.3)",
                  letterSpacing: "0.05em",
                }}
              >
                مول البستان
              </div>
            </div>
          </div>

          <div className="mt-16 grid gap-6 text-center sm:grid-cols-3">
            {[
              { v: "+150", l: "محل" },
              { v: "3", l: "أدوار" },
              { v: "10", l: "فئات تقنية" },
            ].map((s) => (
              <div
                key={s.l}
                className="rounded-xl border px-4 py-5"
                style={{
                  borderColor: "rgba(205,187,154,0.18)",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                <div
                  className="font-arabic-display text-[1.6rem] font-bold"
                  style={{ color: "#CDBB9A" }}
                >
                  {s.v}
                </div>
                <div
                  className="mt-1 font-arabic text-[0.85rem]"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  {s.l}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Button
              asChild
              size="lg"
              className="font-arabic"
              style={{
                background: "#1F61FF",
                color: "white",
              }}
            >
              <Link to="/stores">
                استكشف الفئات
                <ArrowLeft className="mr-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </TooltipProvider>
  );
};

export default TechPlanetSection;
