"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

interface CategoryFilterProps {
  categories: Category[];
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || "all";

  const handleFilter = (slug: string) => {
    if (slug === "all") {
      router.push("/products", { scroll: false });
    } else {
      router.push(`/products?category=${slug}`, { scroll: false });
    }
  };

  return (
    <div className="mb-10 flex flex-wrap gap-3">
      <button
        onClick={() => handleFilter("all")}
        className={cn(
          "rounded-lg px-5 py-2.5 text-sm font-medium transition-all",
          activeCategory === "all"
            ? "gold-gradient text-bg"
            : "border border-border bg-surface text-text-secondary hover:border-primary/50 hover:text-text"
        )}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleFilter(cat.slug)}
          className={cn(
            "rounded-lg px-5 py-2.5 text-sm font-medium transition-all",
            activeCategory === cat.slug
              ? "gold-gradient text-bg"
              : "border border-border bg-surface text-text-secondary hover:border-primary/50 hover:text-text"
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
