"use client";

import { useEffect, useRef } from "react";

interface GradientMeshBackgroundProps {
  colors?: string[];
  speed?: number;
  className?: string;
}

interface Blob {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

function hexToRgba(hex: string, alpha: number): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return `rgba(100, 100, 255, ${alpha})`;
  return `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})`;
}

export function GradientMeshBackground({
  colors = ["#3b82f6", "#8b5cf6", "#06b6d4"],
  speed = 1,
  className = "",
}: GradientMeshBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    // Initialize blobs
    const blobs: Blob[] = colors.map((color, i) => ({
      x: width * (0.25 + i * 0.25),
      y: height * (0.3 + (i % 2) * 0.4),
      vx: (0.3 + Math.random() * 0.4) * speed * (i % 2 === 0 ? 1 : -1),
      vy: (0.2 + Math.random() * 0.3) * speed * (i % 2 === 0 ? -1 : 1),
      radius: Math.min(width, height) * (0.3 + Math.random() * 0.15),
      color,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Update blob positions
      for (const blob of blobs) {
        blob.x += blob.vx;
        blob.y += blob.vy;

        // Bounce off edges with padding
        const pad = blob.radius * 0.3;
        if (blob.x < -pad || blob.x > width + pad) blob.vx *= -1;
        if (blob.y < -pad || blob.y > height + pad) blob.vy *= -1;
      }

      // Draw blobs with radial gradients
      ctx.globalCompositeOperation = "lighter";
      for (const blob of blobs) {
        const gradient = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.radius);
        gradient.addColorStop(0, hexToRgba(blob.color, 0.4));
        gradient.addColorStop(0.5, hexToRgba(blob.color, 0.15));
        gradient.addColorStop(1, hexToRgba(blob.color, 0));
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [colors, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 h-full w-full ${className}`}
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    />
  );
}
