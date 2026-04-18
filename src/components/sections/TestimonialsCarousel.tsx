"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { SectionTitle } from "@/components/common/SectionTitle";
import type { Testimonial } from "@/types";

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
}

export function TestimonialsCarousel({
  testimonials,
}: TestimonialsCarouselProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  if (testimonials.length === 0) return null;

  const testimonial = testimonials[current];

  return (
    <section className="py-20 lg:py-28 bg-surface">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="What Our Clients Say"
          subtitle="Trusted by jewellers and refiners across India"
        />

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border border-border bg-bg p-8 sm:p-12 text-center"
            >
              <Quote className="mx-auto mb-6 h-10 w-10 text-primary/40" />

              <p className="mb-8 text-lg leading-relaxed text-text-secondary italic sm:text-xl">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              <div className="mb-4 flex items-center justify-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < testimonial.rating
                        ? "fill-primary text-primary"
                        : "text-text-muted"
                    }`}
                  />
                ))}
              </div>

              <p className="font-heading text-lg font-semibold text-text">
                {testimonial.client_name}
              </p>
              {(testimonial.company || testimonial.location) && (
                <p className="text-sm text-text-muted">
                  {[testimonial.company, testimonial.location]
                    .filter(Boolean)
                    .join(" — ")}
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          {testimonials.length > 1 && (
            <>
              <button
                onClick={() =>
                  setCurrent(
                    (current - 1 + testimonials.length) % testimonials.length
                  )
                }
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 rounded-full border border-border bg-surface p-2 text-text-secondary transition-colors hover:border-primary hover:text-primary hidden sm:block"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() =>
                  setCurrent((current + 1) % testimonials.length)
                }
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 rounded-full border border-border bg-surface p-2 text-text-secondary transition-colors hover:border-primary hover:text-primary hidden sm:block"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              <div className="mt-6 flex items-center justify-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === current
                        ? "w-8 bg-primary"
                        : "w-2 bg-text-muted/30 hover:bg-text-muted/50"
                    }`}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
