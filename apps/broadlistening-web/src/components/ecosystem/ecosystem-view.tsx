"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface OpinionNode {
  id: string;
  x: number;
  y: number;
  fitness: number;
  supportCount: number;
  clusterId: string;
  content: string;
  pheromoneIntensity: number;
}

interface ClusterRegion {
  id: string;
  label: string;
  centerX: number;
  centerY: number;
  radius: number;
  color: string;
}

interface EcosystemViewProps {
  opinions: OpinionNode[];
  clusters: ClusterRegion[];
  className?: string;
}

interface Tooltip {
  x: number;
  y: number;
  content: string;
  fitness: number;
  supportCount: number;
}

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [128, 128, 128];
  return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
}

export function EcosystemView({ opinions, clusters, className }: EcosystemViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);
  const [size, setSize] = useState({ width: 800, height: 600 });

  // Resize handler
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setSize({ width: Math.floor(width), height: Math.floor(height) });
        }
      }
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Mouse hover for tooltip
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const dpr = window.devicePixelRatio || 1;
      const padding = 60;
      const drawW = size.width - padding * 2;
      const drawH = size.height - padding * 2;

      for (const op of opinions) {
        const cx = padding + op.x * drawW;
        const cy = padding + op.y * drawH;
        const r = Math.max(4, Math.min(20, op.supportCount * 2)) / dpr + 4;
        const dx = mx - cx / dpr;
        const dy = my - cy / dpr;
        if (dx * dx + dy * dy < r * r * 4) {
          setTooltip({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            content: op.content,
            fitness: op.fitness,
            supportCount: op.supportCount,
          });
          return;
        }
      }
      setTooltip(null);
    },
    [opinions, size],
  );

  // Main render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size.width * dpr;
    canvas.height = size.height * dpr;
    ctx.scale(dpr, dpr);

    const w = size.width;
    const h = size.height;
    const padding = 60;
    const drawW = w - padding * 2;
    const drawH = h - padding * 2;

    // Background
    ctx.fillStyle = "#0f0f23";
    ctx.fillRect(0, 0, w, h);

    // Contour lines (fitness landscape)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
    ctx.lineWidth = 0.5;
    const contourLevels = 12;
    for (let level = 0; level < contourLevels; level++) {
      const yOffset = padding + (level / contourLevels) * drawH;
      ctx.beginPath();
      for (let px = 0; px <= drawW; px += 2) {
        const x = padding + px;
        const wave =
          Math.sin(px * 0.015 + level * 0.8) * 15 + Math.cos(px * 0.008 + level * 1.2) * 10;
        const y = yOffset + wave;
        if (px === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Cluster regions (radial gradients)
    for (const cluster of clusters) {
      const cx = padding + cluster.centerX * drawW;
      const cy = padding + cluster.centerY * drawH;
      const r = cluster.radius * Math.min(drawW, drawH);
      const [cr, cg, cb] = hexToRgb(cluster.color);

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, 0.15)`);
      grad.addColorStop(0.6, `rgba(${cr}, ${cg}, ${cb}, 0.06)`);
      grad.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // Cluster label
      ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, 0.5)`;
      ctx.font = "11px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(cluster.label, cx, cy - r - 6);
    }

    // Build cluster color map
    const clusterColorMap = new Map<string, string>();
    for (const c of clusters) {
      clusterColorMap.set(c.id, c.color);
    }

    // Pheromone trails (connect opinions with similar cluster and high pheromone)
    const trailOpinions = opinions.filter((o) => o.pheromoneIntensity > 0.3);
    for (let i = 0; i < trailOpinions.length; i++) {
      for (let j = i + 1; j < trailOpinions.length; j++) {
        const a = trailOpinions[i];
        const b = trailOpinions[j];
        if (a.clusterId !== b.clusterId) continue;
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist > 0.3) continue;

        const ax = padding + a.x * drawW;
        const ay = padding + a.y * drawH;
        const bx = padding + b.x * drawW;
        const by = padding + b.y * drawH;
        const intensity = Math.min(a.pheromoneIntensity, b.pheromoneIntensity);

        const color = clusterColorMap.get(a.clusterId) || "#ffffff";
        const [tr, tg, tb] = hexToRgb(color);

        ctx.strokeStyle = `rgba(${tr}, ${tg}, ${tb}, ${intensity * 0.3})`;
        ctx.lineWidth = intensity * 2;
        ctx.shadowColor = `rgba(${tr}, ${tg}, ${tb}, ${intensity * 0.5})`;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        // Curved trail
        const mx = (ax + bx) / 2 + (Math.random() - 0.5) * 20;
        const my = (ay + by) / 2 + (Math.random() - 0.5) * 20;
        ctx.quadraticCurveTo(mx, my, bx, by);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    }

    // Opinion nodes
    for (const op of opinions) {
      const cx = padding + op.x * drawW;
      const cy = padding + op.y * drawH;
      const radius = Math.max(4, Math.min(20, op.supportCount * 2));
      const color = clusterColorMap.get(op.clusterId) || "#8b949e";
      const [nr, ng, nb] = hexToRgb(color);
      const alpha = 0.3 + op.fitness * 0.7;

      // Glow
      ctx.shadowColor = `rgba(${nr}, ${ng}, ${nb}, ${alpha * 0.6})`;
      ctx.shadowBlur = radius * 1.5;

      // Fill
      ctx.fillStyle = `rgba(${nr}, ${ng}, ${nb}, ${alpha})`;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // Border
      ctx.strokeStyle = `rgba(${nr}, ${ng}, ${nb}, ${alpha * 0.8})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.shadowBlur = 0;
    }

    // Legend
    const legendX = w - 180;
    const legendY = 20;
    ctx.fillStyle = "rgba(15, 15, 35, 0.85)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;
    roundRect(ctx, legendX, legendY, 160, 90, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.font = "bold 11px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Ecosystem View", legendX + 10, legendY + 18);

    ctx.font = "10px system-ui, sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillText("Size = support count", legendX + 10, legendY + 36);
    ctx.fillText("Opacity = fitness", legendX + 10, legendY + 52);
    ctx.fillText("Color = cluster", legendX + 10, legendY + 68);
    ctx.fillText("Trails = pheromone links", legendX + 10, legendY + 84);
  }, [opinions, clusters, size]);

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full ${className ?? ""}`}
      style={{ minHeight: 400 }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: size.width, height: size.height }}
        className="block"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTooltip(null)}
      />
      {tooltip && (
        <div
          className="pointer-events-none absolute z-10 max-w-xs rounded-lg border border-white/10 bg-[#1a1a2e]/95 px-3 py-2 text-xs text-white shadow-xl backdrop-blur-sm"
          style={{ left: tooltip.x + 12, top: tooltip.y - 10 }}
        >
          <p className="mb-1 leading-snug">{tooltip.content}</p>
          <div className="flex gap-3 text-[10px] text-white/50">
            <span>Fitness: {tooltip.fitness.toFixed(2)}</span>
            <span>Support: {tooltip.supportCount}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
