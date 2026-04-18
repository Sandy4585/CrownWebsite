"use client";

import { motion } from "framer-motion";
import {
  Gem,
  Factory,
  BadgeCheck,
  CircleDollarSign,
  Recycle,
  FlaskConical,
} from "lucide-react";
import { industries } from "@/data/siteConfig";
import { SectionTitle } from "@/components/common/SectionTitle";
import { staggerContainer, fadeInUp } from "@/lib/animations";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Gem,
  Factory,
  BadgeCheck,
  CircleDollarSign,
  Recycle,
  FlaskConical,
};

export function IndustriesServed() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Industries We Serve"
          subtitle="Providing precision-engineered equipment to diverse segments of the precious metal industry"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {industries.map((industry) => {
            const Icon = iconMap[industry.icon] || Factory;
            return (
              <motion.div
                key={industry.title}
                variants={fadeInUp}
                className="group relative overflow-hidden rounded-xl border border-border bg-surface p-6 transition-all hover:border-primary/50"
              >
                <div className="absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-primary/5 transition-all group-hover:bg-primary/10" />
                <Icon className="mb-4 h-8 w-8 text-primary" />
                <h3 className="mb-2 font-heading text-lg font-semibold text-text">
                  {industry.title}
                </h3>
                <p className="text-sm text-text-secondary">
                  {industry.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
