import { cn } from "@/lib/utils";

export function GoldDivider({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-px w-full gold-gradient opacity-30",
        className
      )}
    />
  );
}
