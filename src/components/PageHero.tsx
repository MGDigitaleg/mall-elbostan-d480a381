import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface HeroCTA {
  label: string;
  to: string;
  icon?: LucideIcon;
  variant?: "primary" | "secondary" | "orange";
}

interface PageHeroProps {
  /** Small uppercase kicker label */
  kicker: string;
  /** English kicker displayed alongside (optional) */
  kickerEn?: string;
  /** Main heading — ReactNode to allow spans */
  title: React.ReactNode;
  /** Short description */
  subtitle?: string;
  /** Up to 2 CTAs */
  ctas?: HeroCTA[];
  /** Optional right-side content (countdown, stats, image) */
  children?: React.ReactNode;
  /** Compact height for functional pages */
  compact?: boolean;
  /** Optional image for single-image heroes */
  image?: { src: string; alt: string };
}

/**
 * Unified page hero — dark navy overlay, consistent typography,
 * optional grid texture and ambient glow.
 * Design reference: Downtown branch hero system.
 */
export function PageHero({
  kicker,
  kickerEn,
  title,
  subtitle,
  ctas,
  children,
  compact = false,
  image,
}: PageHeroProps) {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(165deg, #071326 0%, #0B1B34 50%, #0D1F3C 100%)" }}
    >
      {/* Background image (if provided) */}
      {image && (
        <div className="absolute inset-0">
          <img
            src={image.src}
            alt={image.alt}
            className="h-full w-full object-cover img-grade-dark"
            loading="eager"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #071326 5%, #07132690 40%, #07132660 100%)" }} />
        </div>
      )}

      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute top-1/3 left-[15%] h-[400px] w-[400px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, #2563EB, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 right-[20%] h-[300px] w-[300px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, #CDBB9A, transparent 70%)" }}
        />
      </div>

      {/* Subtle grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: "linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-5 md:px-8 lg:px-14">
        <div
          className={`grid items-center gap-8 ${
            compact ? "py-10 md:py-12" : "py-14 md:py-16 lg:py-20"
          } ${children ? "lg:grid-cols-[1.1fr_0.9fr] lg:gap-12" : ""}`}
        >
          {/* Text column */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4"
          >
            {/* Kicker */}
            <div className="flex items-center gap-3">
              <div className="h-[2px] w-8 rounded-full" style={{ background: "#CDBB9A" }} />
              <span
                className="font-poppins text-[0.58rem] font-bold tracking-[0.22em] uppercase"
                style={{ color: "#CDBB9A" }}
              >
                {kickerEn ?? kicker}
              </span>
            </div>

            {/* Title */}
            <h1
              className={`max-w-[28rem] font-bold leading-[1.1] ${
                compact
                  ? "text-[1.3rem] md:text-[1.55rem]"
                  : "text-[1.55rem] md:text-[1.85rem] lg:text-[2.1rem]"
              }`}
              style={{ color: "#F8FAFC", fontFamily: "var(--font-arabic-display)" }}
            >
              {title}
            </h1>

            {/* Subtitle */}
            {subtitle && (
              <p
                className="max-w-[26rem] text-[0.86rem] leading-[1.85]"
                style={{ color: "#94A3B8" }}
              >
                {subtitle}
              </p>
            )}

            {/* CTAs */}
            {ctas && ctas.length > 0 && (
              <div className="flex flex-wrap gap-2.5 pt-1">
                {ctas.map((cta, i) => {
                  const Icon = cta.icon;
                  if (cta.variant === "orange") {
                    return (
                      <Link key={i} to={cta.to}>
                        <Button
                          className="h-10 gap-2 rounded-xl px-6 text-[0.82rem] font-bold shadow-lg"
                          style={{
                            background: "#F97316",
                            color: "#fff",
                            boxShadow: "0 4px 16px rgba(249,115,22,0.25)",
                          }}
                        >
                          {Icon && <Icon className="h-3.5 w-3.5" />}
                          {cta.label}
                        </Button>
                      </Link>
                    );
                  }
                  if (i === 0 || cta.variant === "primary") {
                    return (
                      <Link key={i} to={cta.to}>
                        <Button
                          variant="cta"
                          className="h-10 gap-2 rounded-xl px-6 text-[0.82rem] font-bold shadow-lg shadow-primary/20"
                        >
                          {Icon && <Icon className="h-3.5 w-3.5" />}
                          {cta.label}
                        </Button>
                      </Link>
                    );
                  }
                  return (
                    <Link key={i} to={cta.to}>
                      <Button
                        className="h-10 gap-2 rounded-xl border px-6 text-[0.82rem] font-semibold transition-colors hover:bg-white/[0.06]"
                        style={{
                          borderColor: "#ffffff18",
                          background: "#ffffff06",
                          color: "#CBD5E1",
                        }}
                      >
                        {Icon && <Icon className="h-3.5 w-3.5" />}
                        {cta.label}
                      </Button>
                    </Link>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Right-side slot */}
          {children && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
            >
              {children}
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        className="h-px w-full"
        style={{
          background: "linear-gradient(90deg, transparent 10%, #2D6BFF20, transparent 90%)",
        }}
      />
    </section>
  );
}
