"use client";

import { motion } from "framer-motion";
import {
  Wrench,
  ShieldCheck,
  Settings,
  MapPin,
  Headphones,
  IndianRupee,
} from "lucide-react";
import { whyChooseUs } from "@/data/siteConfig";
import { SectionTitle } from "@/components/common/SectionTitle";
import { staggerContainer, fadeInUp } from "@/lib/animations";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Wrench,
  ShieldCheck,
  Settings,
  MapPin,
  Headphones,
  IndianRupee,
};

export function WhyChooseUs() {
  return (
    <section className="py-20 lg:py-28 bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Why Choose Crown Consultants"
          subtitle="Decades of expertise delivering reliable refinery solutions across India"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {whyChooseUs.map((item) => {
            const Icon = iconMap[item.icon] || Wrench;
            return (
              <motion.div
                key={item.title}
                variants={fadeInUp}
                className="group rounded-xl border border-border bg-bg p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
              >
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-heading text-lg font-semibold text-text">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-text-secondary">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
