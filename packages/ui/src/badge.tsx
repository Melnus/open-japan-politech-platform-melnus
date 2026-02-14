import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  dot?: boolean;
  className?: string;
  /** Use dark variant for dark-themed pages */
  theme?: "light" | "dark";
}

const lightVariants = {
  default: "bg-gray-100 text-gray-800",
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  danger: "bg-red-100 text-red-800",
  info: "bg-blue-100 text-blue-800",
};

const darkVariants = {
  default: "bg-[rgba(255,255,255,0.08)] text-[#c9d1d9]",
  success: "bg-[rgba(16,185,129,0.15)] text-[#3FB68B]",
  warning: "bg-[rgba(245,158,11,0.15)] text-[#F5A623]",
  danger: "bg-[rgba(239,68,68,0.15)] text-[#F87171]",
  info: "bg-[rgba(59,130,246,0.15)] text-[#60A5FA]",
};

const dotColors = {
  default: "bg-gray-500",
  success: "bg-green-500",
  warning: "bg-yellow-500",
  danger: "bg-red-500",
  info: "bg-blue-500",
};

export function Badge({
  children,
  variant = "default",
  dot = false,
  className = "",
  theme = "light",
}: BadgeProps) {
  const variantStyles = theme === "dark" ? darkVariants : lightVariants;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${variantStyles[variant]} ${className}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
}
