import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Store, Map, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SceneOpening } from "./scenes/SceneOpening";
import { SceneMeaning } from "./scenes/SceneMeaning";
import { SceneTransition } from "./scenes/SceneTransition";
import { SceneResolve } from "./scenes/SceneResolve";

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
      {/* Subtle grid texture — single layer, CSS only */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Back button */}
      <Link
        to="/"
        className="fixed top-5 right-5 z-50 flex items-center gap-1.5 rounded-full px-4 py-2 text-[0.72rem] font-medium transition-colors"
        style={{
          color: "#94A3B8",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <ArrowRight className="h-3 w-3" />
        العودة
      </Link>

      {/* Scenes */}
      <SceneOpening />
      <SceneMeaning />
      <SceneTransition />
      <SceneResolve />
    </div>
  );
}
