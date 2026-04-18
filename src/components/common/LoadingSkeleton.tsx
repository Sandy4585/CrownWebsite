import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="gold-shimmer aspect-[4/3] w-full" />
      <div className="p-5">
        <div className="gold-shimmer mb-3 h-6 w-3/4 rounded" />
        <div className="gold-shimmer mb-2 h-4 w-full rounded" />
        <div className="gold-shimmer mb-4 h-4 w-2/3 rounded" />
        <div className="flex items-center justify-between">
          <div className="gold-shimmer h-6 w-24 rounded" />
          <div className="gold-shimmer h-9 w-28 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("gold-shimmer rounded", className)} />;
}
