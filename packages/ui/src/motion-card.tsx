"use client";

import { motion, useInView } from "motion/react";
import { type ReactNode, useRef } from "react";

interface MotionCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
  /** Use dark variant for dark-themed pages */
  variant?: "light" | "dark";
}

export function MotionCard({
  children,
  className = "",
  delay = 0,
  hover = true,
  variant = "light",
}: MotionCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const bgClass =
    variant === "dark"
      ? "rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] backdrop-blur-sm"
      : "rounded-xl border bg-white shadow-card";

  return (
    <motion.div
      ref={ref}
      className={`${bgClass} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.4,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={
        hover
          ? {
              y: -4,
              boxShadow:
                variant === "dark"
                  ? "0 10px 25px -5px rgb(0 0 0 / 0.3), 0 8px 10px -6px rgb(0 0 0 / 0.2)"
                  : "0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
              transition: { duration: 0.2 },
            }
          : undefined
      }
    >
      <div className="p-6">{children}</div>
    </motion.div>
  );
}
