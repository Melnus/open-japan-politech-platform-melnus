"use client";

import { motion } from "motion/react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  loading?: boolean;
  icon?: ReactNode;
}

const variants = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500/50",
  secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500/50",
  outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500/50",
  ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500/50",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  loading = false,
  icon,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...(props as Record<string, unknown>)}
    >
      {loading ? (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </motion.button>
  );
}
