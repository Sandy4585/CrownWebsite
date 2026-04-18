"use client";

import { motion } from "framer-motion";
import { ProductCard } from "./ProductCard";
import { EmptyState } from "@/components/common/EmptyState";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import type { Product } from "@/types";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <EmptyState
        title="No products found"
        description="No products found in this category. Please check back later or browse another category."
      />
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={fadeInUp}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}
