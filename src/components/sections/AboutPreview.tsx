"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";

export function AboutPreview() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-primary">
              About Us
            </span>
            <h2 className="font-heading text-3xl font-bold text-text sm:text-4xl">
              India&apos;s Trusted Partner in{" "}
              <span className="gold-gradient-text">Precious Metal Refining</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-text-secondary">
              Since {siteConfig.company.foundedYear}, Crown Consultants has been
              at the forefront of gold and silver refinery equipment
              manufacturing. Based in Chennai, we design, manufacture, and install
              precision-engineered refining plants, hallmarking laboratory setups,
              and pollution control systems for clients across India.
            </p>
            <p className="mt-4 text-base leading-relaxed text-text-muted">
              From turnkey refinery installations to BIS/NABL approved
              hallmarking centres, our end-to-end solutions have powered over 500
              successful projects, earning the trust of jewellers, refiners, and
              entrepreneurs nationwide.
            </p>
            <Link
              href="/about"
              className="group mt-8 inline-flex items-center gap-2 text-base font-semibold text-primary transition-colors hover:text-primary-light"
            >
              Learn More About Us
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-surface">
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-surface to-bg">
                <div className="text-center">
                  <span className="font-heading text-6xl font-bold gold-gradient-text">
                    {siteConfig.company.foundedYear}
                  </span>
                  <p className="mt-2 text-text-secondary">
                    Established
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-2xl border border-primary/20 bg-primary/5" />
            <div className="absolute -top-4 -left-4 h-20 w-20 rounded-xl border border-primary/20 bg-primary/5" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
