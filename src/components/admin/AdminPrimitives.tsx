import { useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronDown, Filter, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export function AdminPageHeader({
  title, subtitle, actions,
}: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

const TONES = {
  neutral: "bg-secondary text-foreground border-border",
  success: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  danger: "bg-red-500/10 text-red-600 border-red-500/20",
  info: "bg-primary/10 text-primary border-primary/20",
} as const;

export function AdminStatusBadge({
  children, tone = "neutral", className,
}: { children: React.ReactNode; tone?: keyof typeof TONES; className?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.7rem] font-semibold",
      TONES[tone], className,
    )}>
      {children}
    </span>
  );
}

export function AdminEmptyState({
  icon: Icon, title, description, action,
}: { icon?: LucideIcon; title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-secondary/30 px-6 py-10 text-center">
      {Icon && <Icon className="w-8 h-8 text-muted-foreground mx-auto mb-3" />}
      <div className="font-bold text-foreground">{title}</div>
      {description && <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function AdminStatCard({
  label, value, hint, icon: Icon, tone = "neutral", loading,
}: {
  label: string; value: React.ReactNode; hint?: string;
  icon?: LucideIcon; tone?: keyof typeof TONES; loading?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 flex items-start gap-3">
      {Icon && (
        <div className={cn("w-9 h-9 rounded-lg grid place-items-center shrink-0", TONES[tone])}>
          <Icon className="w-4 h-4" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="text-[0.72rem] font-bold text-muted-foreground">{label}</div>
        {loading ? (
          <Skeleton className="h-6 w-16 mt-1" />
        ) : (
          <div className="text-xl font-bold text-foreground leading-tight mt-0.5">{value}</div>
        )}
        {hint && <div className="text-[0.7rem] text-muted-foreground mt-0.5">{hint}</div>}
      </div>
    </div>
  );
}

export function AdminSectionCard({
  title, action, children, className,
}: { title: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-xl border border-border bg-card", className)}>
      <header className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="font-bold text-foreground text-sm">{title}</h3>
        {action}
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}

/**
 * AdminFilterPanel — collapsible filter wrapper for admin pages.
 * Desktop: always open. Mobile: collapsed by default with summary chip + toggle.
 */
export function AdminFilterPanel({
  children,
  activeCount = 0,
  onReset,
  summary,
  className,
  defaultOpen = false,
}: {
  children: React.ReactNode;
  activeCount?: number;
  onReset?: () => void;
  summary?: React.ReactNode;
  className?: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={cn("rounded-xl border border-border bg-card mb-4 overflow-hidden", className)}>
      {/* Mobile toggle bar */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="md:hidden w-full flex items-center justify-between gap-2 px-3 py-2.5 text-sm font-bold border-b border-border bg-secondary/30"
        aria-expanded={open}
      >
        <span className="inline-flex items-center gap-2">
          <Filter className="w-4 h-4" />
          الفلاتر
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full bg-primary text-primary-foreground text-[0.65rem] font-bold">
              {activeCount}
            </span>
          )}
        </span>
        <ChevronDown className={cn("w-4 h-4 transition-transform", open && "rotate-180")} />
      </button>

      {/* Summary line on mobile when collapsed */}
      {!open && summary && (
        <div className="md:hidden px-3 py-2 text-xs text-muted-foreground border-b border-border">
          {summary}
        </div>
      )}

      <div className={cn("p-3 space-y-3", !open && "hidden md:block")}>
        {children}
        {activeCount > 0 && onReset && (
          <div className="flex md:hidden">
            <Button variant="ghost" size="sm" onClick={onReset} className="gap-1 text-xs">
              <X className="w-3.5 h-3.5" /> مسح كل الفلاتر ({activeCount})
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
