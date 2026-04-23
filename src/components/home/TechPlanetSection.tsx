import { useEffect, useRef, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  Laptop, Smartphone, Monitor, Cpu, Headphones, Keyboard,
  HardDrive, Mouse, Camera, Gamepad2, Printer, Router,
  Tablet, Watch, Speaker, MemoryStick, Webcam, Cable, Zap, Wifi,
  ArrowLeft, type LucideIcon,
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

const innerOrbit: Device[] = [
  { Icon: Laptop, label: "لابتوبات", category: "laptops" },
  { Icon: Smartphone, label: "هواتف ذكية", category: "phones" },
  { Icon: Monitor, label: "شاشات", category: "monitors" },
  { Icon: Cpu, label: "معالجات", category: "components" },
  { Icon: Headphones, label: "سماعات", category: "audio" },
  { Icon: Keyboard, label: "لوحات مفاتيح", category: "accessories" },
];

const middleOrbit: Device[] = [
  { Icon: HardDrive, label: "تخزين", category: "storage" },
  { Icon: Mouse, label: "ماوس", category: "accessories" },
  { Icon: Camera, label: "كاميرات", category: "cameras" },
  { Icon: Gamepad2, label: "جيمنج", category: "gaming" },
  { Icon: Printer, label: "طابعات", category: "printers" },
  { Icon: Router, label: "راوترات", category: "networking" },
];

const outerOrbit: Device[] = [
  { Icon: Tablet, label: "تابلت", category: "tablets" },
  { Icon: Watch, label: "ساعات ذكية", category: "wearables" },
  { Icon: Speaker, label: "سبيكر", category: "audio" },
  { Icon: MemoryStick, label: "رامات", category: "components" },
  { Icon: Webcam, label: "ويب كام", category: "cameras" },
  { Icon: Cable, label: "كابلات", category: "accessories" },
  { Icon: Zap, label: "شواحن", category: "accessories" },
  { Icon: Wifi, label: "شبكات", category: "networking" },
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
          to={`/stores?category=${category}`}
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
      <TooltipContent side="top" className="font-arabic text-[0.78rem]">
        {label}
      </TooltipContent>
    </Tooltip>
  );
};

export const TechPlanetSection = () => {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  const sizes = useMemo(() => {
    if (isMobile) {
      return {
        stage: 380,
        core: 96,
        innerR: 110,
        middleR: 0,
        outerR: 0,
        innerSize: 36,
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
  const orbitDefs = useMemo(() => {
    const defs: { devices: Device[]; radius: number; duration: number; reverse: boolean }[] = [
      { devices: innerOrbit, radius: sizes.innerR, duration: 18, reverse: false },
    ];
    if (sizes.showMiddle) defs.push({ devices: middleOrbit, radius: sizes.middleR, duration: 26, reverse: true });
    if (sizes.showOuter) defs.push({ devices: outerOrbit, radius: sizes.outerR, duration: 36, reverse: false });
    return defs;
  }, [sizes]);

  // Dynamic energy bursts — 4 channels that retarget every 3s to random devices
  type Burst = { id: number; orbitIdx: number; deviceIdx: number; startedAt: number };
  const [bursts, setBursts] = useState<Burst[]>([]);
  const burstIdRef = useRef(0);

  useEffect(() => {
    if (!active || reduce) {
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
    // Seed 4 channels
    setBursts([pickBurst(), pickBurst(), pickBurst(), pickBurst()]);
    const interval = setInterval(() => {
      setBursts((prev) => prev.map(() => pickBurst()));
    }, 3000);
    return () => clearInterval(interval);
  }, [active, reduce, orbitDefs]);

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
              devices={innerOrbit}
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
