"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { type ReactNode, useRef } from "react";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  gradientFrom?: string;
  gradientTo?: string;
  children?: ReactNode;
}

export function HeroSection({
  title,
  subtitle,
  gradientFrom = "from-blue-600",
  gradientTo = "to-indigo-700",
  children,
}: HeroSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <section
      ref={ref}
      className={`relative overflow-hidden bg-gradient-to-br ${gradientFrom} ${gradientTo} py-16 pb-20 text-white`}
    >
      {/* Parallax dot grid */}
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          y: bgY,
        }}
      />
      {/* Glow pulse line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <div className="relative mx-auto max-w-7xl px-6">
        <motion.h2
          className="mb-3 text-4xl font-bold tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {title}
        </motion.h2>
        <motion.p
          className="mb-8 max-w-2xl text-lg text-white/80"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {subtitle}
        </motion.p>
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}
