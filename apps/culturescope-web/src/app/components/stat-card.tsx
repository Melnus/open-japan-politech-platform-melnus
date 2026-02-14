"use client";

import { motion, useInView } from "@ojpp/ui";
import { useCallback, useEffect, useRef, useState } from "react";

interface StatCardProps {
  label: string;
  value: string;
  /** Numeric part to animate (e.g. 1250 for "1,250億") */
  numericValue?: number;
  prefix?: string;
  suffix?: string;
  subtext?: string;
  subtextColor?: "amber" | "green" | "red" | "zinc";
  delay?: number;
}

function easeOutQuart(t: number): number {
  return 1 - (1 - t) ** 4;
}

function useCountUp(end: number, duration: number, shouldStart: boolean) {
  const [count, setCount] = useState(0);

  const animate = useCallback(() => {
    const startTime = performance.now();
    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      setCount(Math.round(easedProgress * end));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [end, duration]);

  useEffect(() => {
    if (shouldStart && end > 0) {
      animate();
    }
  }, [shouldStart, end, animate]);

  return count;
}

export function StatCard({
  label,
  value,
  numericValue,
  prefix = "",
  suffix = "",
  subtext,
  subtextColor = "zinc",
  delay = 0,
}: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const count = useCountUp(numericValue ?? 0, 2000, isInView);

  const subtextColors = {
    amber: "text-amber-400",
    green: "text-green-400",
    red: "text-red-400",
    zinc: "text-zinc-500",
  };

  const displayValue = numericValue != null ? `${prefix}${count.toLocaleString()}${suffix}` : value;

  return (
    <motion.div
      ref={ref}
      className="glass-card-amber px-5 py-5"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay,
      }}
    >
      <p className="text-xs font-medium tracking-wide text-zinc-400">{label}</p>
      <p className="mt-2 text-2xl font-bold tracking-tight text-amber-400">{displayValue}</p>
      {subtext && (
        <p className={`mt-1 text-xs font-medium ${subtextColors[subtextColor]}`}>{subtext}</p>
      )}
    </motion.div>
  );
}
