/**
 * Offer card skeleton — mirrors the OpeningOfferCard (compact) layout
 * so users perceive the same shape they're about to see.
 *
 * Uses semantic tokens (bg-muted, border-border) and a subtle shimmer.
 */
type Props = { compact?: boolean };

export function OfferCardSkeleton({ compact = true }: Props) {
  const aspectClass = compact ? "aspect-[16/10]" : "aspect-[4/3]";
  const bodyPadClass = compact ? "p-3" : "p-4 md:p-5";

  return (
    <article
      aria-hidden="true"
      className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-card)]"
    >
      {/* Image */}
      <div
        className={`relative ${aspectClass} overflow-hidden border-b border-border/60 bg-gradient-to-br from-secondary/45 via-background to-muted/30`}
      >
        <div className="skeleton-shimmer absolute inset-0" />
        <span className="absolute left-2 top-2 h-5 w-14 rounded-lg bg-muted/80" />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-2">
          <span className="h-4 w-20 rounded-full bg-background/80" />
          <span className="h-4 w-12 rounded-full bg-background/80" />
        </div>
        <div className="absolute inset-x-0 bottom-0 p-2">
          <div className="flex items-center gap-2 rounded-2xl border border-border/70 bg-background/92 px-2.5 py-1.5">
            <span className="h-7 w-7 rounded-lg bg-muted" />
            <div className="flex-1 space-y-1">
              <span className="block h-2.5 w-24 rounded bg-muted" />
              <span className="block h-2 w-16 rounded bg-muted/70" />
            </div>
            <span className="h-4 w-14 rounded-lg bg-muted/70" />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className={`flex flex-1 flex-col ${bodyPadClass}`}>
        <div className="mb-2 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-1.5">
            <span className="block h-2.5 w-16 rounded bg-muted/70" />
            <span className="block h-3.5 w-3/4 rounded bg-muted" />
            <span className="block h-3.5 w-2/3 rounded bg-muted" />
          </div>
          <span className="h-10 w-12 shrink-0 rounded-xl bg-muted/70" />
        </div>

        <div className="mt-1 space-y-1.5">
          <span className="block h-2.5 w-full rounded bg-muted/60" />
          <span className="block h-2.5 w-5/6 rounded bg-muted/60" />
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <span className="h-4 w-16 rounded-full bg-muted/70" />
          <span className="h-4 w-20 rounded-full bg-muted/60" />
        </div>

        {/* Price block */}
        <div className="mt-3 rounded-2xl border border-border/60 bg-secondary/35 p-2.5">
          <div className="flex items-end justify-between gap-3">
            <div className="space-y-1.5">
              <span className="block h-4 w-20 rounded bg-muted" />
              <span className="block h-2.5 w-14 rounded bg-muted/60" />
            </div>
            <span className="h-5 w-14 rounded-full bg-muted/70" />
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-3 space-y-1.5">
          <span className="block h-9 w-full rounded-xl bg-muted/80" />
          <span className="block h-9 w-full rounded-xl bg-muted/60" />
        </div>
      </div>
    </article>
  );
}

type GridProps = { count?: number; compact?: boolean };

export function OfferCardSkeletonGrid({ count = 8, compact = true }: GridProps) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      aria-label="جاري تحميل العروض"
      className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {Array.from({ length: count }).map((_, i) => (
        <OfferCardSkeleton key={i} compact={compact} />
      ))}
      <span className="sr-only">جاري تحميل العروض…</span>
    </div>
  );
}

export function OfferHeroSkeleton() {
  return (
    <div className="space-y-3" aria-hidden="true">
      {/* Spotlight strip placeholder */}
      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card p-4 shadow-[var(--shadow-soft)]">
        <div className="skeleton-shimmer absolute inset-0" />
        <div className="flex items-center gap-3">
          <span className="h-12 w-12 rounded-xl bg-muted" />
          <div className="flex-1 space-y-2">
            <span className="block h-3.5 w-1/3 rounded bg-muted" />
            <span className="block h-2.5 w-1/2 rounded bg-muted/70" />
          </div>
          <span className="h-9 w-24 rounded-xl bg-muted/80" />
        </div>
      </div>

      {/* Filter bar placeholder */}
      <div className="flex items-center gap-1.5 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className="h-7 w-20 shrink-0 rounded-full bg-muted/70" />
        ))}
      </div>
    </div>
  );
}
