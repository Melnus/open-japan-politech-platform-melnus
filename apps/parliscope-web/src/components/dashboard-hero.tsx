"use client";

import { motion, useScroll, useTransform } from "@ojpp/ui";
import { useRef } from "react";

export function DashboardHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <section ref={ref} className="relative overflow-hidden pb-20 pt-16">
      {/* Animated dot grid background */}
      <motion.div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          y: bgY,
        }}
      />

      {/* Glow pulse line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent"
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Gradient accent orbs */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-64 w-64 rounded-full bg-indigo-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-0 h-64 w-64 rounded-full bg-violet-600/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.h1
          className="mb-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          議会を、すべての人に開く
        </motion.h1>
        <motion.p
          className="max-w-2xl text-base text-[#8b949e] sm:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.15,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          全法案・全議員・全投票データをリアルタイムに可視化
        </motion.p>
      </div>
    </section>
  );
}
