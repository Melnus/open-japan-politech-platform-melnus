"use client";

import { motion } from "motion/react";
import { type ReactNode, useCallback, useRef, useState } from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  /** Blur amount for glassmorphism (px) */
  blur?: number;
}

export function GlowCard({
  children,
  className = "",
  glowColor = "rgba(59, 130, 246, 0.35)",
  blur = 12,
}: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setGlowPosition({ x, y });
  }, []);

  const handleMouseEnter = useCallback(() => setIsHovering(true), []);
  const handleMouseLeave = useCallback(() => setIsHovering(false), []);

  return (
    <motion.div
      ref={cardRef}
      className={`relative overflow-hidden rounded-xl border border-white/20 ${className}`}
      style={{
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        background: "rgba(255, 255, 255, 0.05)",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{
        y: -6,
        boxShadow: `0 20px 40px -12px rgba(0, 0, 0, 0.15)`,
        transition: { duration: 0.25 },
      }}
    >
      {/* Glow effect layer */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: isHovering ? 1 : 0,
          background: `radial-gradient(600px circle at ${glowPosition.x}% ${glowPosition.y}%, ${glowColor}, transparent 40%)`,
        }}
        aria-hidden="true"
      />

      {/* Border glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-300"
        style={{
          opacity: isHovering ? 1 : 0,
          background: `radial-gradient(400px circle at ${glowPosition.x}% ${glowPosition.y}%, ${glowColor}, transparent 40%)`,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1px",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 p-6">{children}</div>
    </motion.div>
  );
}
