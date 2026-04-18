"use client";

import { motion, type Variants } from "framer-motion";
import { type ReactNode } from "react";

interface AnimateOnScrollProps {
  children: ReactNode;
  variants?: Variants;
  className?: string;
  delay?: number;
}

const defaultVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export function AnimateOnScroll({
  children,
  variants = defaultVariants,
  className,
  delay = 0,
}: AnimateOnScrollProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={variants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
