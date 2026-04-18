"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, PhoneCall } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";

const PARTICLE_POSITIONS = [
  { top: 5, left: 12 }, { top: 15, left: 78 }, { top: 22, left: 35 },
  { top: 8, left: 55 }, { top: 40, left: 8 }, { top: 35, left: 90 },
  { top: 50, left: 25 }, { top: 45, left: 65 }, { top: 60, left: 45 },
  { top: 55, left: 82 }, { top: 70, left: 15 }, { top: 68, left: 58 },
  { top: 75, left: 38 }, { top: 80, left: 72 }, { top: 85, left: 5 },
  { top: 28, left: 48 }, { top: 92, left: 30 }, { top: 18, left: 92 },
  { top: 62, left: 70 }, { top: 88, left: 55 },
];

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg">
      {/* Gradient overlays */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,168,76,0.15)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(201,168,76,0.08)_0%,transparent_50%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg to-transparent" />
      </div>

      {/* Gold particle dots — fixed positions to avoid hydration mismatch */}
      <div className="absolute inset-0 overflow-hidden">
        {PARTICLE_POSITIONS.map((pos, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-primary/30"
            style={{
              top: `${pos.top}%`,
              left: `${pos.left}%`,
            }}
            animate={{
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + (i % 5) * 0.4,
              repeat: Infinity,
              delay: (i % 7) * 0.3,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-32 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Trusted Manufacturer Since {siteConfig.company.foundedYear}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-heading text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl"
        >
          <span className="gold-gradient-text">CROWN</span>
          <br />
          <span className="text-text">CONSULTANTS</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-6 max-w-3xl text-lg text-text-secondary sm:text-xl lg:text-2xl"
        >
          {siteConfig.company.tagline}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mx-auto mt-4 max-w-2xl text-base text-text-muted"
        >
          {siteConfig.company.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 rounded-lg gold-gradient px-8 py-4 text-base font-semibold text-bg transition-all hover:shadow-xl hover:shadow-primary/20"
          >
            Explore Products
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg border border-primary/50 px-8 py-4 text-base font-semibold text-primary transition-all hover:bg-primary/10"
          >
            <PhoneCall className="h-5 w-5" />
            Free Consultation
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
