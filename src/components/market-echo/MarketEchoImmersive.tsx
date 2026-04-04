import { Link } from "react-router-dom";
import { ArrowRight, Store, Map, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SceneOpening } from "./scenes/SceneOpening";
import { ScenePhraseReveal } from "./scenes/ScenePhraseReveal";
import { SceneEchoes } from "./scenes/SceneEchoes";
import { SceneMeaning } from "./scenes/SceneMeaning";
import { SceneTimeline } from "./scenes/SceneTimeline";
import { SceneFinal } from "./scenes/SceneFinal";
import { SceneCTA } from "./scenes/SceneCTA";

export function MarketEchoImmersive() {
  return (
    <div
      className="relative min-h-screen text-white"
      dir="rtl"
      style={{
        background: "linear-gradient(160deg, #060E1C 0%, #0A1628 40%, #071326 100%)",
        fontFamily: "var(--font-arabic-display)",
      }}
    >
      {/* Grid texture — CSS only */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.012]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Single ambient glow — fixed, CSS only */}
      <div
        className="pointer-events-none fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
        style={{
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(37,99,235,0.04), transparent 70%)",
        }}
      />

      {/* Back button */}
      <Link
        to="/"
        className="fixed top-5 right-5 z-50 flex items-center gap-1.5 rounded-full px-4 py-2 text-[0.72rem] font-medium transition-colors hover:text-white/80"
        style={{
          color: "#94A3B8",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <ArrowRight className="h-3 w-3" />
        العودة
      </Link>

      {/* 7 Scenes */}
      <SceneOpening />
      <ScenePhraseReveal />
      <SceneEchoes />
      <SceneMeaning />
      <SceneTimeline />
      <SceneFinal />
      <SceneCTA />
    </div>
  );
}
