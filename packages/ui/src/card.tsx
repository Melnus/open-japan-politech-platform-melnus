import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
  hover?: boolean;
  animate?: boolean;
  /** Use dark variant for dark-themed pages */
  variant?: "light" | "dark";
}

export function Card({
  children,
  className = "",
  padding = "md",
  hover = false,
  animate = false,
  variant = "light",
}: CardProps) {
  const paddingClass = { sm: "p-4", md: "p-6", lg: "p-8" }[padding];
  const hoverClass = hover
    ? variant === "dark"
      ? "transition-all duration-300 hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)] hover:shadow-lg hover:shadow-indigo-500/5"
      : "transition-all duration-300 hover:shadow-card-hover hover:scale-[1.01]"
    : "";
  const animateClass = animate ? "animate-fade-in" : "";
  const variantClass =
    variant === "dark"
      ? "rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] backdrop-blur-sm"
      : "rounded-xl border bg-white shadow-card";
  return (
    <div className={`${variantClass} ${paddingClass} ${hoverClass} ${animateClass} ${className}`}>
      {children}
    </div>
  );
}
