import { PackageOpen } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({
  title = "No items found",
  description = "There are no items to display at the moment.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <PackageOpen className="mb-4 h-16 w-16 text-text-muted" />
      <h3 className="mb-2 text-xl font-semibold text-text">{title}</h3>
      <p className="text-text-secondary">{description}</p>
    </div>
  );
}
