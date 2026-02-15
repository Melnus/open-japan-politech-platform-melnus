"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Flow Field Canvas — 計算機自然
 * Particles trace paths through a noise field,
 * creating generative art trails (à la Zach Lieberman / ShaderToy).
 * Not simulating nature — revealing the beauty of computation itself.
 */

interface Particle {
  x: number;
  y: number;
  px: number; // previous x
  py: number; // previous y
  speed: number;
  hue: number;
  life: number;
  maxLife: number;
}

interface Props {
  className?: string;
  particleCount?: number;
  interactive?: boolean;
  palette?: "cyan" | "warm" | "mono";
}

// Simple noise function (multiple octaves of sin for organic flow)
function noise2D(x: number, y: number, t: number): number {
  return (
    Math.sin(x * 0.8 + t) * Math.cos(y * 0.6 + t * 0.7) * 0.5 +
    Math.sin(x * 1.6 + y * 0.9 + t * 1.3) * 0.3 +
    Math.cos(x * 0.3 - y * 1.2 + t * 0.5) * 0.2
  );
}

function flowAngle(x: number, y: number, t: number, scale: number): number {
  const n = noise2D(x * scale, y * scale, t);
  return n * Math.PI * 2;
}

const PALETTES = {
  cyan: [185, 170, 200, 190, 160],
  warm: [320, 340, 20, 45, 280],
  mono: [0, 0, 0, 0, 0], // grayscale via saturation
};

export function LivingCanvas({
  className,
  particleCount = 800,
  interactive = true,
  palette = "cyan",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const animationRef = useRef<number>(0);
  const timeRef = useRef(0);
  const sizeRef = useRef({ w: 0, h: 0 });

  const hues = PALETTES[palette];

  const spawnParticle = useCallback(
    (w: number, h: number): Particle => {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const isMono = palette === "mono";
      return {
        x,
        y,
        px: x,
        py: y,
        speed: 0.5 + Math.random() * 1.5,
        hue: isMono ? 0 : hues[Math.floor(Math.random() * hues.length)],
        life: 0,
        maxLife: 100 + Math.random() * 400,
      };
    },
    [hues, palette],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      sizeRef.current = { w, h };

      // Clear and reinitialize
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.fillStyle = "#050505";
      ctx?.fillRect(0, 0, w, h);

      // Reinit particles
      particlesRef.current = [];
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push(spawnParticle(w, h));
      }
    }

    resize();

    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(canvas);

    function handleMouseMove(e: MouseEvent) {
      if (!canvas || !interactive) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    }

    function handleMouseLeave() {
      mouseRef.current = { ...mouseRef.current, active: false };
    }

    if (interactive) {
      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("mouseleave", handleMouseLeave);
    }

    function render() {
      if (!canvas || !ctx) return;
      const { w, h } = sizeRef.current;
      if (w === 0 || h === 0) {
        animationRef.current = requestAnimationFrame(render);
        return;
      }

      timeRef.current += 0.003;
      const t = timeRef.current;

      // Fade trails — this creates the beautiful trail effect
      ctx.fillStyle = "rgba(5, 5, 5, 0.04)";
      ctx.fillRect(0, 0, w, h);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const isMono = palette === "mono";
      const noiseScale = 0.003;

      ctx.lineWidth = 0.8;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Store previous position
        p.px = p.x;
        p.py = p.y;

        // Get flow angle from noise field
        let angle = flowAngle(p.x, p.y, t, noiseScale);

        // Mouse influence — curl around mouse position
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200 && dist > 0) {
            const influence = (200 - dist) / 200;
            // Curl effect — perpendicular to radial direction
            const curlAngle = Math.atan2(dy, dx) + Math.PI * 0.5;
            angle += (curlAngle - angle) * influence * 0.6;
            p.speed = Math.min(p.speed + influence * 0.3, 3);
          }
        }

        // Move
        p.x += Math.cos(angle) * p.speed;
        p.y += Math.sin(angle) * p.speed;
        p.life++;

        // Respawn if out of bounds or life expired
        if (p.x < -10 || p.x > w + 10 || p.y < -10 || p.y > h + 10 || p.life > p.maxLife) {
          const spawned = spawnParticle(w, h);
          Object.assign(p, spawned);
          continue;
        }

        // Draw line from previous to current position
        const lifeRatio = p.life / p.maxLife;
        const fadeIn = Math.min(p.life / 20, 1);
        const fadeOut = lifeRatio > 0.8 ? 1 - (lifeRatio - 0.8) / 0.2 : 1;
        const alpha = fadeIn * fadeOut * 0.65;

        if (isMono) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        } else {
          const sat = 60 + Math.sin(t + p.hue) * 20;
          const light = 65 + Math.sin(t * 2 + p.hue * 0.1) * 15;
          ctx.strokeStyle = `hsla(${p.hue}, ${sat}%, ${light}%, ${alpha})`;
        }

        ctx.beginPath();
        ctx.moveTo(p.px, p.py);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }

      // Occasional bright nodes at intersections
      if (Math.random() < 0.02) {
        const nodeX = Math.random() * w;
        const nodeY = Math.random() * h;
        const nodeHue = isMono ? 0 : hues[Math.floor(Math.random() * hues.length)];
        const grad = ctx.createRadialGradient(nodeX, nodeY, 0, nodeX, nodeY, 8);
        if (isMono) {
          grad.addColorStop(0, "rgba(255, 255, 255, 0.5)");
          grad.addColorStop(1, "rgba(255, 255, 255, 0)");
        } else {
          grad.addColorStop(0, `hsla(${nodeHue}, 80%, 75%, 0.45)`);
          grad.addColorStop(1, `hsla(${nodeHue}, 80%, 75%, 0)`);
        }
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(nodeX, nodeY, 8, 0, Math.PI * 2);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(render);
    }

    animationRef.current = requestAnimationFrame(render);

    return () => {
      resizeObserver.disconnect();
      if (interactive) {
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseleave", handleMouseLeave);
      }
      cancelAnimationFrame(animationRef.current);
    };
  }, [particleCount, spawnParticle, interactive, palette, hues]);

  return <canvas ref={canvasRef} className={`absolute inset-0 h-full w-full ${className ?? ""}`} />;
}
