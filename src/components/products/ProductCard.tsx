"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="group overflow-hidden rounded-xl border border-border bg-surface transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
    >
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-surface-elevated">
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-4xl text-text-muted">📦</span>
            </div>
          )}
          {product.is_featured && (
            <span className="absolute top-3 left-3 rounded-full gold-gradient px-3 py-1 text-xs font-semibold text-bg">
              Featured
            </span>
          )}
        </div>

        <div className="p-5">
          <h3 className="mb-2 font-heading text-lg font-semibold text-text line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          {product.short_description && (
            <p className="mb-4 text-sm text-text-secondary line-clamp-2">
              {product.short_description}
            </p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-primary">
              {product.is_price_visible && product.price_display
                ? product.price_display
                : "Request Quote"}
            </span>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-text-secondary group-hover:text-primary transition-colors">
              View Details
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
