"use client";

import { motion, useInView } from "@ojpp/ui";
import { useRef } from "react";

interface DarkStatCardProps {
  label: string;
  value: string;
  index?: number;
}

export function DarkStatCard({ label, value, index = 0 }: DarkStatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      className="dark-card-accent px-5 py-4"
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: index * 0.08,
      }}
    >
      <p className="text-xs text-gray-400 mb-1.5">{label}</p>
      <motion.p
        className="text-xl font-bold tracking-tight text-emerald-400"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 12,
          delay: index * 0.08 + 0.1,
        }}
      >
        {value}
      </motion.p>
    </motion.div>
  );
}
