"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Compact LivingCanvas for the BroadListening hero card.
 * Fewer particles, emerald palette, optimized for card-sized container.
 */

interface Particle {
  x: number;
  y: number;
  px: number;
  py: number;
  speed: number;
  hue: number;
  life: number;
  maxLife: number;
}

function noise2D(x: number, y: number, t: number): number {
  return (
    Math.sin(x * 0.8 + t) * Math.cos(y * 0.6 + t * 0.7) * 0.5 +
    Math.sin(x * 1.6 + y * 0.9 + t * 1.3) * 0.3 +
    Math.cos(x * 0.3 - y * 1.2 + t * 0.5) * 0.2
  );
}

function flowAngle(x: number, y: number, t: number, scale: number): number {
  return noise2D(x * scale, y * scale, t) * Math.PI * 2;
}

const HUES = [160, 155, 170, 145, 175, 180];

export function BroadListeningCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const animationRef = useRef<number>(0);
  const timeRef = useRef(0);
  const sizeRef = useRef({ w: 0, h: 0 });

  const spawnParticle = useCallback((w: number, h: number): Particle => {
    const x = Math.random() * w;
    const y = Math.random() * h;
    return {
      x,
      y,
      px: x,
      py: y,
      speed: 0.4 + Math.random() * 1.2,
      hue: HUES[Math.floor(Math.random() * HUES.length)],
      life: 0,
      maxLife: 80 + Math.random() * 300,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const PARTICLE_COUNT = 300;
    const dpr = window.devicePixelRatio || 1;

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      sizeRef.current = { w, h };
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "rgba(14, 14, 24, 1)";
      ctx.fillRect(0, 0, w, h);
      particlesRef.current = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particlesRef.current.push(spawnParticle(w, h));
      }
    }

    resize();
    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(canvas);

    function handleMouseMove(e: MouseEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true };
    }
    function handleMouseLeave() {
      mouseRef.current = { ...mouseRef.current, active: false };
    }
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    function render() {
      if (!canvas || !ctx) return;
      const { w, h } = sizeRef.current;
      if (w === 0 || h === 0) {
        animationRef.current = requestAnimationFrame(render);
        return;
      }

      timeRef.current += 0.003;
      const t = timeRef.current;

      // Trail fade — blends with card bg
      ctx.fillStyle = "rgba(14, 14, 24, 0.045)";
      ctx.fillRect(0, 0, w, h);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      ctx.lineWidth = 0.7;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.px = p.x;
        p.py = p.y;

        let angle = flowAngle(p.x, p.y, t, 0.004);

        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150 && dist > 0) {
            const influence = (150 - dist) / 150;
            const curlAngle = Math.atan2(dy, dx) + Math.PI * 0.5;
            angle += (curlAngle - angle) * influence * 0.6;
            p.speed = Math.min(p.speed + influence * 0.2, 2.5);
          }
        }

        p.x += Math.cos(angle) * p.speed;
        p.y += Math.sin(angle) * p.speed;
        p.life++;

        if (p.x < -10 || p.x > w + 10 || p.y < -10 || p.y > h + 10 || p.life > p.maxLife) {
          Object.assign(p, spawnParticle(w, h));
          continue;
        }

        const lifeRatio = p.life / p.maxLife;
        const fadeIn = Math.min(p.life / 15, 1);
        const fadeOut = lifeRatio > 0.8 ? 1 - (lifeRatio - 0.8) / 0.2 : 1;
        const alpha = fadeIn * fadeOut * 0.55;

        const sat = 65 + Math.sin(t + p.hue) * 15;
        const light = 60 + Math.sin(t * 2 + p.hue * 0.1) * 10;
        ctx.strokeStyle = `hsla(${p.hue}, ${sat}%, ${light}%, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(p.px, p.py);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }

      // Occasional bright node
      if (Math.random() < 0.025) {
        const nx = Math.random() * w;
        const ny = Math.random() * h;
        const nh = HUES[Math.floor(Math.random() * HUES.length)];
        const grad = ctx.createRadialGradient(nx, ny, 0, nx, ny, 10);
        grad.addColorStop(0, `hsla(${nh}, 80%, 70%, 0.4)`);
        grad.addColorStop(1, `hsla(${nh}, 80%, 70%, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(nx, ny, 10, 0, Math.PI * 2);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(render);
    }

    animationRef.current = requestAnimationFrame(render);

    return () => {
      resizeObserver.disconnect();
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationRef.current);
    };
  }, [spawnParticle]);

  return <canvas ref={canvasRef} className={`absolute inset-0 h-full w-full ${className ?? ""}`} />;
}
