import { Skeleton } from "@/components/ui/skeleton";

export function LoadingCard() {
  return (
    <div className="card-premium p-6 space-y-4">
      <Skeleton className="h-40 w-full rounded-md bg-muted" />
      <Skeleton className="h-5 w-3/4 bg-muted" />
      <Skeleton className="h-4 w-1/2 bg-muted" />
    </div>
  );
}

export function LoadingGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <LoadingCard key={i} />
      ))}
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="text-center py-20">
      <p className="text-xl font-semibold text-muted-foreground">{title}</p>
      {description && <p className="text-sm text-muted-foreground mt-2">{description}</p>}
    </div>
  );
}
