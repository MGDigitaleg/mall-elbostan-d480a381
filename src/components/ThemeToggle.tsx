import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

interface ThemeToggleProps {
  isTransparent?: boolean;
}

export function ThemeToggle({ isTransparent = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  const bg = isTransparent ? "rgba(255,255,255,0.08)" : "hsl(var(--card))";
  const border = isTransparent ? "rgba(255,255,255,0.12)" : "hsl(var(--border))";
  const color = isTransparent ? "#E2E8F0" : "hsl(var(--foreground))";

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-300 hover:scale-105"
      style={{ background: bg, border: `1px solid ${border}`, color }}
      aria-label={theme === "dark" ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"}
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
