"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Trophy, Factory, MapPin, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Trophy,
  Factory,
  MapPin,
  ShieldCheck,
};

function CountUp({ target, suffix = "" }: { target: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  const numericPart = parseInt(target.replace(/[^0-9]/g, ""), 10);
  const isNumeric = !isNaN(numericPart);

  useEffect(() => {
    if (!isInView || !isNumeric) return;
    let start = 0;
    const duration = 2000;
    const step = duration / numericPart;
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= numericPart) clearInterval(timer);
    }, Math.max(step, 16));
    return () => clearInterval(timer);
  }, [isInView, numericPart, isNumeric]);

  if (!isNumeric) {
    return <span ref={ref}>{target}</span>;
  }

  return (
    <span ref={ref}>
      {count}
      {target.includes("+") ? "+" : ""}
      {suffix}
    </span>
  );
}

export function StatsBar() {
  return (
    <section className="relative z-10 -mt-12 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="grid grid-cols-2 gap-4 rounded-2xl border border-primary/20 bg-surface/80 p-6 backdrop-blur-xl sm:p-8 lg:grid-cols-4 lg:gap-8"
      >
        {siteConfig.stats.map((stat, i) => {
          const Icon = iconMap[stat.icon] || Trophy;
          return (
            <div key={i} className="flex flex-col items-center text-center">
              <Icon className="mb-2 h-6 w-6 text-primary" />
              <span className="font-heading text-2xl font-bold text-text sm:text-3xl">
                <CountUp target={stat.value} />
              </span>
              <span className="mt-1 text-sm text-text-secondary">
                {stat.label}
              </span>
            </div>
          );
        })}
      </motion.div>
    </section>
  );
}
