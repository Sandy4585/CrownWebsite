"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl border border-border bg-surface">
        <span className="text-6xl text-text-muted">📦</span>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div
          className="group relative aspect-square cursor-zoom-in overflow-hidden rounded-2xl border border-border bg-surface"
          onClick={() => setLightboxOpen(true)}
        >
          <Image
            src={images[current]}
            alt={`${productName} - Image ${current + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 60vw"
            priority
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/20">
            <ZoomIn className="h-8 w-8 text-white opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                  i === current
                    ? "border-primary"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <Image
                  src={img}
                  alt={`${productName} thumbnail ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 right-6 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
              aria-label="Close lightbox"
            >
              <X className="h-6 w-6" />
            </button>

            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrent(
                      (current - 1 + images.length) % images.length
                    );
                  }}
                  className="absolute left-4 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrent((current + 1) % images.length);
                  }}
                  className="absolute right-4 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
                  aria-label="Next image"
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
                src={images[current]}
                alt={`${productName} - Image ${current + 1}`}
                width={1200}
                height={900}
                className="rounded-lg object-contain"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
