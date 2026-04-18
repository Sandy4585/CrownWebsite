"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { fadeInUp } from "@/lib/animations";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumbs: Breadcrumb[];
}

export function PageHero({ title, subtitle, breadcrumbs }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-bg pt-32 pb-16 sm:pt-36 sm:pb-20">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,var(--color-primary)_0%,transparent_50%)]" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-2 text-sm text-text-muted"
        >
          <Link href="/" className="transition-colors hover:text-primary">
            Home
          </Link>
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4" />
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="transition-colors hover:text-primary"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-primary">{crumb.label}</span>
              )}
            </span>
          ))}
        </motion.nav>

        <motion.h1
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="font-heading text-4xl font-bold text-text sm:text-5xl lg:text-6xl"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
            className="mt-4 max-w-2xl text-lg text-text-secondary"
          >
            {subtitle}
          </motion.p>
        )}

        <div className="mt-8 h-px w-full bg-gradient-to-r from-primary/50 via-primary/20 to-transparent" />
      </div>
    </section>
  );
}
