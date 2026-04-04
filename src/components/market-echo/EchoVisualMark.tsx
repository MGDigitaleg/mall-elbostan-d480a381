import { motion } from "framer-motion";
import { Cpu, Wifi, Monitor, Smartphone, Headphones, HardDrive } from "lucide-react";

const orbitIcons = [
  { Icon: Monitor, angle: 0, delay: 0 },
  { Icon: Smartphone, angle: 60, delay: 0.15 },
  { Icon: Headphones, angle: 120, delay: 0.3 },
  { Icon: HardDrive, angle: 180, delay: 0.45 },
  { Icon: Wifi, angle: 240, delay: 0.6 },
  { Icon: Cpu, angle: 300, delay: 0.75 },
];

export function EchoVisualMark({ isVisible }: { isVisible: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={isVisible ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 1, delay: 2.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto flex items-center justify-center"
      style={{ width: 220, height: 220 }}
    >
      {/* Outer ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          border: "1px solid rgba(205,187,154,0.1)",
        }}
        animate={isVisible ? { rotate: 360 } : {}}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />

      {/* Middle ring */}
      <div
        className="absolute rounded-full"
        style={{
          width: 160,
          height: 160,
          border: "1px dashed rgba(37,99,235,0.12)",
        }}
      />

      {/* Inner glow */}
      <div
        className="absolute rounded-full"
        style={{
          width: 90,
          height: 90,
          background: "radial-gradient(circle, rgba(37,99,235,0.08), transparent 70%)",
        }}
      />

      {/* Center icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={isVisible ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6, delay: 2.6, type: "spring", stiffness: 200 }}
        className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{
          background: "linear-gradient(135deg, rgba(37,99,235,0.15), rgba(205,187,154,0.1))",
          border: "1px solid rgba(205,187,154,0.15)",
          boxShadow: "0 0 30px rgba(37,99,235,0.1)",
        }}
      >
        <Cpu className="h-7 w-7" style={{ color: "#CDBB9A" }} />
      </motion.div>

      {/* Orbiting icons */}
      {orbitIcons.map(({ Icon, angle, delay }, i) => {
        const radius = 95;
        const rad = (angle * Math.PI) / 180;
        const x = Math.cos(rad) * radius;
        const y = Math.sin(rad) * radius;

        return (
          <motion.div
            key={i}
            className="absolute flex h-9 w-9 items-center justify-center rounded-xl"
            style={{
              left: `calc(50% + ${x}px - 18px)`,
              top: `calc(50% + ${y}px - 18px)`,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{
              duration: 0.4,
              delay: 2.8 + delay,
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            whileHover={{
              scale: 1.2,
              borderColor: "rgba(205,187,154,0.2)",
              background: "rgba(205,187,154,0.06)",
            }}
          >
            <Icon className="h-4 w-4" style={{ color: "#60A5FA" }} />
          </motion.div>
        );
      })}

      {/* Pulse ring animation */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 220,
          height: 220,
          border: "1px solid rgba(37,99,235,0.08)",
        }}
        animate={
          isVisible
            ? { scale: [1, 1.15, 1], opacity: [0.3, 0, 0.3] }
            : {}
        }
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
