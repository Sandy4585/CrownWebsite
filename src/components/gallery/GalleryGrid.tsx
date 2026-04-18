"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/common/EmptyState";
import type { GalleryImage } from "@/types";

const categories = [
  { value: "all", label: "All" },
  { value: "installations", label: "Installations" },
  { value: "factory", label: "Factory" },
  { value: "products", label: "Products" },
  { value: "events", label: "Events" },
];

interface GalleryGridProps {
  images: GalleryImage[];
}

export function GalleryGrid({ images }: GalleryGridProps) {
  const [filter, setFilter] = useState("all");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const filtered =
    filter === "all" ? images : images.filter((img) => img.category === filter);

  return (
    <>
      {/* Filter Tabs */}
      <div className="mb-10 flex flex-wrap gap-3">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setFilter(cat.value)}
            className={cn(
              "rounded-lg px-5 py-2.5 text-sm font-medium transition-all",
              filter === cat.value
                ? "gold-gradient text-bg"
                : "border border-border bg-surface text-text-secondary hover:border-primary/50 hover:text-text"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No images yet"
          description="Gallery images will appear here once uploaded."
        />
      ) : (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {filtered.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="mb-4 break-inside-avoid cursor-pointer overflow-hidden rounded-xl border border-border bg-surface transition-all hover:border-primary/50"
              onClick={() => setLightboxIdx(i)}
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={img.image_url}
                  alt={img.title || "Gallery image"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              {img.title && (
                <div className="p-3">
                  <p className="text-sm font-medium text-text">{img.title}</p>
                  {img.description && (
                    <p className="mt-1 text-xs text-text-muted">
                      {img.description}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
            onClick={() => setLightboxIdx(null)}
          >
            <button
              onClick={() => setLightboxIdx(null)}
              className="absolute top-6 right-6 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>

            {filtered.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIdx(
                      (lightboxIdx - 1 + filtered.length) % filtered.length
                    );
                  }}
                  className="absolute left-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
                  aria-label="Previous"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIdx((lightboxIdx + 1) % filtered.length);
                  }}
                  className="absolute right-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
                  aria-label="Next"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            <div
              className="relative max-h-[85vh] max-w-[85vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={filtered[lightboxIdx].image_url}
                alt={filtered[lightboxIdx].title || "Gallery image"}
                width={1200}
                height={900}
                className="rounded-lg object-contain"
              />
              {filtered[lightboxIdx].title && (
                <p className="mt-4 text-center text-lg text-white">
                  {filtered[lightboxIdx].title}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
