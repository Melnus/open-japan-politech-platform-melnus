"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

interface GradientCardProps {
  children: ReactNode;
  className?: string;
  gradientFrom?: string;
  gradientTo?: string;
  href?: string;
  /** Use dark variant for dark-themed pages */
  variant?: "light" | "dark";
  /** Custom gradient color for top border (CSS color string) */
  accentColor?: string;
}

export function GradientCard({
  children,
  className = "",
  gradientFrom = "from-blue-500",
  gradientTo = "to-indigo-600",
  href,
  variant = "light",
  accentColor,
}: GradientCardProps) {
  const bgClass =
    variant === "dark"
      ? "group relative overflow-hidden rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] backdrop-blur-sm"
      : "group relative overflow-hidden rounded-xl bg-white shadow-card";

  const cardContent = (
    <motion.div
      className={`${bgClass} ${className}`}
      whileHover={{
        scale: 1.02,
        boxShadow:
          variant === "dark"
            ? `0 0 24px ${accentColor ? accentColor + "33" : "rgba(255,107,53,0.15)"}`
            : "0 0 20px rgb(59 130 246 / 0.15)",
        transition: { duration: 0.2 },
      }}
    >
      {accentColor ? (
        <div
          className="absolute inset-x-0 top-0 h-1"
          style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}88)` }}
        />
      ) : (
        <div
          className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${gradientFrom} ${gradientTo}`}
        />
      )}
      {/* Shimmer overlay on hover */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      <div className="p-6">{children}</div>
    </motion.div>
  );

  if (href) {
    return <a href={href}>{cardContent}</a>;
  }
  return cardContent;
}
