"use client";

import { useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════
   Mini Visualizations for Home Page
   How It Works + Core Science animated illustrations
   All Canvas 2D for consistent, high-quality rendering
   ═══════════════════════════════════════════════════ */

// ─── Helpers ───

function setupCanvas(canvas: HTMLCanvasElement): CanvasRenderingContext2D | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);
  return ctx;
}

function hexToRgb(hex: string): [number, number, number] {
  const c = hex.replace("#", "");
  return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)];
}

// ═══════════════════════════════════════════════════
// HOW IT WORKS — Step Visualizations
// ═══════════════════════════════════════════════════

/** Step 1: Opinion organisms entering an ecosystem — Canvas animated */
export function OpinionBubbles({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = setupCanvas(canvas);
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const W = rect.width;
    const H = rect.height;

    const COLORS = {
      support: "#22d3ee",
      oppose: "#fb7185",
      neutral: "#94a3b8",
      evidence: "#34d399",
      question: "#a78bfa",
    };

    const opinions = [
      { text: "少子化の原因は経済的不安", color: COLORS.support, size: 38 },
      { text: "賛成", color: COLORS.support, size: 22 },
      { text: "もっとデータを", color: COLORS.question, size: 30 },
      { text: "反対", color: COLORS.oppose, size: 24 },
      { text: "AI規制は必要", color: COLORS.evidence, size: 34 },
      { text: "教育改革を", color: COLORS.neutral, size: 26 },
      { text: "具体策が見えない", color: COLORS.oppose, size: 32 },
      { text: "中立", color: COLORS.neutral, size: 18 },
      { text: "エビデンスベース", color: COLORS.evidence, size: 28 },
      { text: "地方分権で解決", color: COLORS.support, size: 25 },
      { text: "現実的でない", color: COLORS.oppose, size: 20 },
    ];

    interface Organism {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      text: string;
      color: string;
      rgb: [number, number, number];
      phase: number;
      entered: boolean;
      entryProgress: number;
    }

    const organisms: Organism[] = opinions.map((o, i) => {
      const angle = (i / opinions.length) * Math.PI * 2 + Math.random() * 0.5;
      const dist = Math.max(W, H) * 0.7;
      return {
        x: W / 2 + Math.cos(angle) * dist,
        y: H / 2 + Math.sin(angle) * dist,
        vx: 0,
        vy: 0,
        radius: o.size,
        text: o.text,
        color: o.color,
        rgb: hexToRgb(o.color),
        phase: Math.random() * Math.PI * 2,
        entered: false,
        entryProgress: 0,
      };
    });

    // Target positions — evenly distributed
    const targets = opinions.map((_, i) => {
      const cols = 4;
      const rows = Math.ceil(opinions.length / cols);
      const col = i % cols;
      const row = Math.floor(i / cols);
      const cellW = W / cols;
      const cellH = H / rows;
      return {
        x: cellW * (col + 0.5) + (Math.random() - 0.5) * cellW * 0.3,
        y: cellH * (row + 0.5) + (Math.random() - 0.5) * cellH * 0.3,
      };
    });

    let t = 0;
    let animId: number;

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);

      // Staggered entry
      for (let i = 0; i < organisms.length; i++) {
        const o = organisms[i];
        const entryStart = i * 12;
        if (t > entryStart && o.entryProgress < 1) {
          o.entryProgress = Math.min(1, o.entryProgress + 0.025);
        }

        if (o.entryProgress > 0) {
          const ease = 1 - (1 - o.entryProgress) ** 3;
          const target = targets[i];
          const floatX = Math.sin(t * 0.015 + o.phase) * 8;
          const floatY = Math.cos(t * 0.012 + o.phase * 1.4) * 6;

          o.x += (target.x + floatX - o.x) * 0.04 * ease;
          o.y += (target.y + floatY - o.y) * 0.04 * ease;

          const alpha = ease;
          const r = o.radius * (0.5 + ease * 0.5);

          // Glow
          const glowGrad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, r * 2);
          glowGrad.addColorStop(0, `rgba(${o.rgb[0]},${o.rgb[1]},${o.rgb[2]},${0.08 * alpha})`);
          glowGrad.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(o.x, o.y, r * 2, 0, Math.PI * 2);
          ctx.fillStyle = glowGrad;
          ctx.fill();

          // Membrane
          ctx.beginPath();
          ctx.arc(o.x, o.y, r, 0, Math.PI * 2);
          const memGrad = ctx.createRadialGradient(o.x - r * 0.3, o.y - r * 0.3, 0, o.x, o.y, r);
          memGrad.addColorStop(0, `rgba(${o.rgb[0]},${o.rgb[1]},${o.rgb[2]},${0.12 * alpha})`);
          memGrad.addColorStop(0.7, `rgba(${o.rgb[0]},${o.rgb[1]},${o.rgb[2]},${0.05 * alpha})`);
          memGrad.addColorStop(1, `rgba(${o.rgb[0]},${o.rgb[1]},${o.rgb[2]},${0.02 * alpha})`);
          ctx.fillStyle = memGrad;
          ctx.fill();

          // Border
          ctx.strokeStyle = `rgba(${o.rgb[0]},${o.rgb[1]},${o.rgb[2]},${0.2 * alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Text
          if (r > 14) {
            ctx.fillStyle = `rgba(255,255,255,${0.6 * alpha})`;
            const fontSize = Math.max(7, Math.min(11, r / 3.2));
            ctx.font = `500 ${fontSize}px system-ui, sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            const maxWidth = r * 1.6;
            const txt = o.text.length > 8 ? `${o.text.slice(0, 8)}…` : o.text;
            ctx.fillText(txt, o.x, o.y, maxWidth);
          }
        }
      }

      // Connection lines between nearby organisms
      ctx.lineWidth = 0.5;
      for (let i = 0; i < organisms.length; i++) {
        if (organisms[i].entryProgress < 0.5) continue;
        for (let j = i + 1; j < organisms.length; j++) {
          if (organisms[j].entryProgress < 0.5) continue;
          const dx = organisms[i].x - organisms[j].x;
          const dy = organisms[i].y - organisms[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            const a = (1 - dist / 100) * 0.1;
            ctx.strokeStyle = `rgba(255,255,255,${a})`;
            ctx.beginPath();
            ctx.moveTo(organisms[i].x, organisms[i].y);
            ctx.lineTo(organisms[j].x, organisms[j].y);
            ctx.stroke();
          }
        }
      }

      t++;
      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return <canvas ref={canvasRef} className={className} style={{ width: "100%", height: "100%" }} />;
}

/** Step 2: Argument structure graph — Canvas animated nodes and edges */
export function ArgumentMiniGraph({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = setupCanvas(canvas);
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const W = rect.width;
    const H = rect.height;

    const TYPES = {
      CLAIM: { color: "#22d3ee", shape: "circle" as const, label: "Claim" },
      PREMISE: { color: "#a78bfa", shape: "rounded" as const, label: "Premise" },
      EVIDENCE: { color: "#34d399", shape: "diamond" as const, label: "Evidence" },
      REBUTTAL: { color: "#fb7185", shape: "hexagon" as const, label: "Rebuttal" },
    };

    interface GraphNode {
      id: string;
      type: keyof typeof TYPES;
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      size: number;
      phase: number;
    }

    const nodes: GraphNode[] = [
      {
        id: "c1",
        type: "CLAIM",
        x: 0,
        y: 0,
        targetX: W * 0.5,
        targetY: H * 0.12,
        size: 20,
        phase: 0,
      },
      {
        id: "p1",
        type: "PREMISE",
        x: 0,
        y: 0,
        targetX: W * 0.25,
        targetY: H * 0.38,
        size: 16,
        phase: 1.2,
      },
      {
        id: "p2",
        type: "PREMISE",
        x: 0,
        y: 0,
        targetX: W * 0.72,
        targetY: H * 0.36,
        size: 16,
        phase: 2.4,
      },
      {
        id: "e1",
        type: "EVIDENCE",
        x: 0,
        y: 0,
        targetX: W * 0.12,
        targetY: H * 0.62,
        size: 13,
        phase: 3.1,
      },
      {
        id: "e2",
        type: "EVIDENCE",
        x: 0,
        y: 0,
        targetX: W * 0.38,
        targetY: H * 0.65,
        size: 13,
        phase: 4.0,
      },
      {
        id: "r1",
        type: "REBUTTAL",
        x: 0,
        y: 0,
        targetX: W * 0.82,
        targetY: H * 0.6,
        size: 15,
        phase: 5.2,
      },
      {
        id: "c2",
        type: "CLAIM",
        x: 0,
        y: 0,
        targetX: W * 0.55,
        targetY: H * 0.85,
        size: 17,
        phase: 6.0,
      },
    ];

    // Initialize positions at center
    for (const n of nodes) {
      n.x = W / 2 + (Math.random() - 0.5) * 40;
      n.y = H / 2 + (Math.random() - 0.5) * 40;
    }

    const edges = [
      { from: "p1", to: "c1", type: "support" as const },
      { from: "p2", to: "c1", type: "support" as const },
      { from: "e1", to: "p1", type: "support" as const },
      { from: "e2", to: "p1", type: "support" as const },
      { from: "r1", to: "p2", type: "attack" as const },
      { from: "c2", to: "r1", type: "support" as const },
    ];

    const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));

    // Pulse particles along edges
    const pulses = edges.map(() => ({
      progress: Math.random(),
      speed: 0.003 + Math.random() * 0.004,
    }));

    let t = 0;
    let animId: number;

    function drawShape(
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      shape: string,
      color: string,
      alpha: number,
    ) {
      const [r, g, b] = hexToRgb(color);

      // Outer glow
      const glowGrad = ctx.createRadialGradient(x, y, 0, x, y, size * 2.5);
      glowGrad.addColorStop(0, `rgba(${r},${g},${b},${0.15 * alpha})`);
      glowGrad.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(x, y, size * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = glowGrad;
      ctx.fill();

      ctx.beginPath();
      if (shape === "circle") {
        ctx.arc(x, y, size, 0, Math.PI * 2);
      } else if (shape === "rounded") {
        const s = size * 0.9;
        ctx.moveTo(x - s, y - s * 0.6);
        ctx.arcTo(x + s, y - s * 0.6, x + s, y + s * 0.6, 4);
        ctx.arcTo(x + s, y + s * 0.6, x - s, y + s * 0.6, 4);
        ctx.arcTo(x - s, y + s * 0.6, x - s, y - s * 0.6, 4);
        ctx.arcTo(x - s, y - s * 0.6, x + s, y - s * 0.6, 4);
      } else if (shape === "diamond") {
        const s = size;
        ctx.moveTo(x, y - s);
        ctx.lineTo(x + s * 0.8, y);
        ctx.lineTo(x, y + s);
        ctx.lineTo(x - s * 0.8, y);
      } else if (shape === "hexagon") {
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i - Math.PI / 6;
          const px = x + Math.cos(angle) * size;
          const py = y + Math.sin(angle) * size;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
      }
      ctx.closePath();

      // Fill gradient
      const fillGrad = ctx.createRadialGradient(x - size * 0.3, y - size * 0.3, 0, x, y, size);
      fillGrad.addColorStop(0, `rgba(${r},${g},${b},${0.25 * alpha})`);
      fillGrad.addColorStop(1, `rgba(${r},${g},${b},${0.08 * alpha})`);
      ctx.fillStyle = fillGrad;
      ctx.fill();

      ctx.strokeStyle = `rgba(${r},${g},${b},${0.4 * alpha})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);

      // Move nodes toward targets with gentle float
      for (const n of nodes) {
        const floatX = Math.sin(t * 0.008 + n.phase) * 4;
        const floatY = Math.cos(t * 0.006 + n.phase * 1.3) * 3;
        n.x += (n.targetX + floatX - n.x) * 0.03;
        n.y += (n.targetY + floatY - n.y) * 0.03;
      }

      // Draw edges
      for (let i = 0; i < edges.length; i++) {
        const e = edges[i];
        const from = nodeMap[e.from];
        const to = nodeMap[e.to];
        const isAttack = e.type === "attack";
        const color = isAttack ? "#fb7185" : "#34d399";
        const [r, g, b] = hexToRgb(color);

        // Edge line
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.strokeStyle = `rgba(${r},${g},${b},0.2)`;
        ctx.lineWidth = 1.5;
        if (isAttack) {
          ctx.setLineDash([4, 4]);
        } else {
          ctx.setLineDash([]);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Arrow at midpoint
        const mx = (from.x + to.x) / 2;
        const my = (from.y + to.y) / 2;
        const angle = Math.atan2(to.y - from.y, to.x - from.x);
        const arrowSize = 5;
        ctx.beginPath();
        ctx.moveTo(mx + Math.cos(angle) * arrowSize, my + Math.sin(angle) * arrowSize);
        ctx.lineTo(mx + Math.cos(angle + 2.5) * arrowSize, my + Math.sin(angle + 2.5) * arrowSize);
        ctx.lineTo(mx + Math.cos(angle - 2.5) * arrowSize, my + Math.sin(angle - 2.5) * arrowSize);
        ctx.closePath();
        ctx.fillStyle = `rgba(${r},${g},${b},0.35)`;
        ctx.fill();

        // Pulse particle along edge
        const p = pulses[i];
        p.progress = (p.progress + p.speed) % 1;
        const px = from.x + (to.x - from.x) * p.progress;
        const py = from.y + (to.y - from.y) * p.progress;
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},0.7)`;
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw nodes
      for (const n of nodes) {
        const typeInfo = TYPES[n.type];
        drawShape(ctx, n.x, n.y, n.size, typeInfo.shape, typeInfo.color, 1);

        // Label below
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.font = "bold 8px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(typeInfo.label, n.x, n.y + n.size + 6);
      }

      // Legend in top-right
      const legendX = W - 90;
      let legendY = 14;
      ctx.font = "7px system-ui, sans-serif";
      for (const [, info] of Object.entries(TYPES)) {
        const [r, g, b] = hexToRgb(info.color);
        ctx.fillStyle = `rgba(${r},${g},${b},0.5)`;
        ctx.fillRect(legendX, legendY - 4, 8, 8);
        ctx.fillStyle = "rgba(255,255,255,0.2)";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(info.label, legendX + 12, legendY);
        legendY += 13;
      }

      t++;
      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return <canvas ref={canvasRef} className={className} style={{ width: "100%", height: "100%" }} />;
}

/** Step 3: Self-organizing consensus — Canvas animated clustering */
export function ConvergenceDots({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = setupCanvas(canvas);
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const W = rect.width;
    const H = rect.height;

    const CLUSTER_COLORS = ["#22d3ee", "#34d399", "#a78bfa"];
    const CLUSTER_LABELS = ["経済", "教育", "環境"];
    const centers = [
      { x: W * 0.22, y: H * 0.35 },
      { x: W * 0.72, y: H * 0.3 },
      { x: W * 0.48, y: H * 0.72 },
    ];

    interface Dot {
      x: number;
      y: number;
      homeX: number;
      homeY: number;
      scatterX: number;
      scatterY: number;
      cluster: number;
      color: string;
      rgb: [number, number, number];
      size: number;
      phase: number;
    }

    const dots: Dot[] = Array.from({ length: 72 }, (_, i) => {
      const cluster = i % 3;
      const c = centers[cluster];
      const angle = Math.random() * Math.PI * 2;
      const homeDist = 8 + Math.random() * 28;
      const scatterDist = 40 + Math.random() * 120;
      return {
        x: W / 2 + (Math.random() - 0.5) * W * 0.8,
        y: H / 2 + (Math.random() - 0.5) * H * 0.8,
        homeX: c.x + Math.cos(angle) * homeDist,
        homeY: c.y + Math.sin(angle) * homeDist,
        scatterX: c.x + Math.cos(angle) * scatterDist + (Math.random() - 0.5) * 80,
        scatterY: c.y + Math.sin(angle) * scatterDist + (Math.random() - 0.5) * 80,
        cluster,
        color: CLUSTER_COLORS[cluster],
        rgb: hexToRgb(CLUSTER_COLORS[cluster]),
        size: 1.5 + Math.random() * 2.5,
        phase: Math.random() * Math.PI * 2,
      };
    });

    let t = 0;
    let animId: number;

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);

      // Phase: 0→0.4 scatter, 0.4→0.8 converge, 0.8→1.0 hold
      const cycleLen = 480;
      const cycleT = (t % cycleLen) / cycleLen;
      let convergeFactor: number;
      if (cycleT < 0.3) {
        convergeFactor = 0; // scattered
      } else if (cycleT < 0.7) {
        convergeFactor = (cycleT - 0.3) / 0.4; // converging
        convergeFactor = convergeFactor * convergeFactor * (3 - 2 * convergeFactor); // smoothstep
      } else {
        convergeFactor = 1; // converged
      }

      // Draw cluster regions when converged
      if (convergeFactor > 0.3) {
        for (let ci = 0; ci < 3; ci++) {
          const c = centers[ci];
          const [r, g, b] = hexToRgb(CLUSTER_COLORS[ci]);
          const radius = 50 * convergeFactor;
          const grad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, radius);
          grad.addColorStop(0, `rgba(${r},${g},${b},${0.06 * convergeFactor})`);
          grad.addColorStop(0.6, `rgba(${r},${g},${b},${0.02 * convergeFactor})`);
          grad.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(c.x, c.y, radius, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();

          // Cluster boundary
          if (convergeFactor > 0.6) {
            ctx.beginPath();
            ctx.arc(c.x, c.y, 38, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${r},${g},${b},${(0.12 * (convergeFactor - 0.6)) / 0.4})`;
            ctx.lineWidth = 0.8;
            ctx.setLineDash([3, 5]);
            ctx.stroke();
            ctx.setLineDash([]);
          }

          // Cluster label
          if (convergeFactor > 0.8) {
            const labelAlpha = (convergeFactor - 0.8) / 0.2;
            ctx.fillStyle = `rgba(${r},${g},${b},${0.5 * labelAlpha})`;
            ctx.font = "bold 10px system-ui, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(CLUSTER_LABELS[ci], c.x, c.y - 46);
          }
        }
      }

      // Draw and move dots
      for (const dot of dots) {
        const targetX = dot.homeX * convergeFactor + dot.scatterX * (1 - convergeFactor);
        const targetY = dot.homeY * convergeFactor + dot.scatterY * (1 - convergeFactor);
        const floatX = Math.sin(t * 0.01 + dot.phase) * (3 - convergeFactor * 2);
        const floatY = Math.cos(t * 0.008 + dot.phase * 1.3) * (3 - convergeFactor * 2);

        dot.x += (targetX + floatX - dot.x) * 0.04;
        dot.y += (targetY + floatY - dot.y) * 0.04;

        // Clamp
        dot.x = Math.max(4, Math.min(W - 4, dot.x));
        dot.y = Math.max(4, Math.min(H - 4, dot.y));

        const [r, g, b] = dot.rgb;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${0.5 + convergeFactor * 0.3})`;
        ctx.shadowColor = dot.color;
        ctx.shadowBlur = 4 + convergeFactor * 4;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw inter-dot connections within clusters when converging
      if (convergeFactor > 0.5) {
        const connAlpha = (convergeFactor - 0.5) * 0.15;
        ctx.lineWidth = 0.4;
        for (let i = 0; i < dots.length; i++) {
          for (let j = i + 1; j < dots.length; j++) {
            if (dots[i].cluster !== dots[j].cluster) continue;
            const dx = dots[i].x - dots[j].x;
            const dy = dots[i].y - dots[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 35) {
              const [r, g, b] = dots[i].rgb;
              ctx.strokeStyle = `rgba(${r},${g},${b},${connAlpha * (1 - dist / 35)})`;
              ctx.beginPath();
              ctx.moveTo(dots[i].x, dots[i].y);
              ctx.lineTo(dots[j].x, dots[j].y);
              ctx.stroke();
            }
          }
        }
      }

      // Shannon diversity indicator
      const diversityVal = 1.09 - convergeFactor * 0.3;
      ctx.fillStyle = `rgba(255,255,255,0.15)`;
      ctx.font = "bold 9px monospace";
      ctx.textAlign = "right";
      ctx.textBaseline = "top";
      ctx.fillText(`H = ${diversityVal.toFixed(2)}`, W - 12, 10);
      ctx.fillStyle = `rgba(255,255,255,0.08)`;
      ctx.font = "7px monospace";
      ctx.fillText("Shannon Diversity", W - 12, 22);

      // Phase indicator
      const phaseLabel =
        convergeFactor < 0.3 ? "OPEN" : convergeFactor < 0.8 ? "CONVERGING" : "CONSENSUS";
      const phaseColor =
        convergeFactor < 0.3
          ? "rgba(52,211,153,0.4)"
          : convergeFactor < 0.8
            ? "rgba(251,191,36,0.4)"
            : "rgba(34,211,238,0.5)";
      ctx.fillStyle = phaseColor;
      ctx.font = "bold 8px monospace";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText(phaseLabel, 10, 10);

      t++;
      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return <canvas ref={canvasRef} className={className} style={{ width: "100%", height: "100%" }} />;
}

// ═══════════════════════════════════════════════════
// CORE SCIENCE — Animated Graphs
// ═══════════════════════════════════════════════════

/** Fitness landscape: f = R · ln(1+S) · P — animated logarithmic curve */
export function FitnessCurveGraph({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = setupCanvas(canvas);
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const W = rect.width;
    const H = rect.height;

    const pad = { left: 45, right: 20, top: 20, bottom: 35 };
    const gW = W - pad.left - pad.right;
    const gH = H - pad.top - pad.bottom;

    let t = 0;
    let animId: number;

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = "rgba(255,255,255,0.04)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= 5; i++) {
        const x = pad.left + (gW / 5) * i;
        const y = pad.top + (gH / 5) * i;
        ctx.beginPath();
        ctx.moveTo(x, pad.top);
        ctx.lineTo(x, pad.top + gH);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(pad.left, y);
        ctx.lineTo(pad.left + gW, y);
        ctx.stroke();
      }

      // Axes
      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad.left, pad.top + gH);
      ctx.lineTo(pad.left + gW, pad.top + gH);
      ctx.moveTo(pad.left, pad.top + gH);
      ctx.lineTo(pad.left, pad.top);
      ctx.stroke();

      // Animated curve: f = 0.7 * ln(1 + S) * 0.8
      const progress = Math.min((t % 180) / 120, 1);
      const maxPx = gW * progress;

      // Glow trail
      ctx.beginPath();
      ctx.strokeStyle = "rgba(34, 211, 238, 0.6)";
      ctx.lineWidth = 2.5;
      ctx.shadowColor = "rgba(34, 211, 238, 0.4)";
      ctx.shadowBlur = 12;

      const maxS = 50;
      const maxF = 0.7 * Math.log(1 + maxS) * 0.8;

      for (let px = 0; px <= maxPx; px++) {
        const S = (px / gW) * maxS;
        const f = 0.7 * Math.log(1 + S) * 0.8;
        const cx = pad.left + px;
        const cy = pad.top + gH - (f / maxF) * gH;
        if (px === 0) ctx.moveTo(cx, cy);
        else ctx.lineTo(cx, cy);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Fill area under curve
      if (maxPx > 1) {
        ctx.beginPath();
        for (let px = 0; px <= maxPx; px++) {
          const S = (px / gW) * maxS;
          const f = 0.7 * Math.log(1 + S) * 0.8;
          const cx = pad.left + px;
          const cy = pad.top + gH - (f / maxF) * gH;
          if (px === 0) ctx.moveTo(cx, cy);
          else ctx.lineTo(cx, cy);
        }
        ctx.lineTo(pad.left + maxPx, pad.top + gH);
        ctx.lineTo(pad.left, pad.top + gH);
        ctx.closePath();
        const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + gH);
        grad.addColorStop(0, "rgba(34, 211, 238, 0.08)");
        grad.addColorStop(1, "rgba(34, 211, 238, 0.01)");
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Moving point
      if (progress > 0) {
        const S = (maxPx / gW) * maxS;
        const f = 0.7 * Math.log(1 + S) * 0.8;
        const cx = pad.left + maxPx;
        const cy = pad.top + gH - (f / maxF) * gH;
        ctx.beginPath();
        ctx.arc(cx, cy, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#22d3ee";
        ctx.shadowColor = "#22d3ee";
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Labels
      ctx.fillStyle = "rgba(255,255,255,0.2)";
      ctx.font = "9px monospace";
      ctx.textAlign = "center";
      ctx.fillText("Support (S)", pad.left + gW / 2, H - 5);
      ctx.save();
      ctx.translate(10, pad.top + gH / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText("Fitness (f)", 0, 0);
      ctx.restore();

      // Axis ticks
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      for (let i = 0; i <= 5; i++) {
        const v = (maxS / 5) * i;
        const x = pad.left + (gW / 5) * i;
        ctx.fillText(String(Math.round(v)), x, pad.top + gH + 4);
      }

      t++;
      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return <canvas ref={canvasRef} className={className} style={{ width: "100%", height: "100%" }} />;
}

/** Pheromone decay: I(t) = I₀ · e^{-λt} — animated exponential decay */
export function DecayCurveGraph({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = setupCanvas(canvas);
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const W = rect.width;
    const H = rect.height;

    const pad = { left: 45, right: 20, top: 20, bottom: 35 };
    const gW = W - pad.left - pad.right;
    const gH = H - pad.top - pad.bottom;

    let t = 0;
    let animId: number;

    // Multiple decay curves with different λ
    const curves = [
      { lambda: 0.02, color: "#22d3ee", label: "λ=0.02" },
      { lambda: 0.05, color: "#34d399", label: "λ=0.05" },
      { lambda: 0.1, color: "#a78bfa", label: "λ=0.10" },
    ];

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = "rgba(255,255,255,0.04)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= 5; i++) {
        const x = pad.left + (gW / 5) * i;
        const y = pad.top + (gH / 5) * i;
        ctx.beginPath();
        ctx.moveTo(x, pad.top);
        ctx.lineTo(x, pad.top + gH);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(pad.left, y);
        ctx.lineTo(pad.left + gW, y);
        ctx.stroke();
      }

      // Axes
      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad.left, pad.top + gH);
      ctx.lineTo(pad.left + gW, pad.top + gH);
      ctx.moveTo(pad.left, pad.top + gH);
      ctx.lineTo(pad.left, pad.top);
      ctx.stroke();

      const progress = Math.min((t % 200) / 140, 1);
      const maxT = 100; // time units

      for (const curve of curves) {
        const maxPx = gW * progress;
        const [r, g, b] = hexToRgb(curve.color);

        ctx.beginPath();
        ctx.strokeStyle = `rgba(${r},${g},${b},0.6)`;
        ctx.lineWidth = 2;
        ctx.shadowColor = `rgba(${r},${g},${b},0.25)`;
        ctx.shadowBlur = 8;

        for (let px = 0; px <= maxPx; px++) {
          const tVal = (px / gW) * maxT;
          const I = Math.exp(-curve.lambda * tVal);
          const cx = pad.left + px;
          const cy = pad.top + gH - I * gH;
          if (px === 0) ctx.moveTo(cx, cy);
          else ctx.lineTo(cx, cy);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Pulse point
        const pulsePos = (t * 0.8) % (gW * 0.9);
        if (pulsePos <= maxPx) {
          const tVal = (pulsePos / gW) * maxT;
          const I = Math.exp(-curve.lambda * tVal);
          const cx = pad.left + pulsePos;
          const cy = pad.top + gH - I * gH;
          ctx.beginPath();
          ctx.arc(cx, cy, 3, 0, Math.PI * 2);
          ctx.fillStyle = curve.color;
          ctx.shadowColor = curve.color;
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // Legend
      ctx.font = "8px monospace";
      curves.forEach((c, i) => {
        const [r, g, b] = hexToRgb(c.color);
        ctx.fillStyle = `rgba(${r},${g},${b},0.5)`;
        ctx.fillRect(pad.left + gW - 65, pad.top + 8 + i * 14, 8, 8);
        ctx.fillStyle = "rgba(255,255,255,0.25)";
        ctx.textAlign = "left";
        ctx.fillText(c.label, pad.left + gW - 52, pad.top + 15 + i * 14);
      });

      // Labels
      ctx.fillStyle = "rgba(255,255,255,0.2)";
      ctx.font = "9px monospace";
      ctx.textAlign = "center";
      ctx.fillText("Time (t)", pad.left + gW / 2, H - 5);
      ctx.save();
      ctx.translate(10, pad.top + gH / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText("Intensity I(t)", 0, 0);
      ctx.restore();

      t++;
      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return <canvas ref={canvasRef} className={className} style={{ width: "100%", height: "100%" }} />;
}

/** Shannon diversity: H = -Σ pᵢ·ln(pᵢ) — animated bar chart */
export function DiversityBarsGraph({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = setupCanvas(canvas);
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const W = rect.width;
    const H = rect.height;

    const pad = { left: 30, right: 20, top: 30, bottom: 40 };
    const gW = W - pad.left - pad.right;
    const gH = H - pad.top - pad.bottom;

    const clusters = [
      { label: "C₁", size: 35, color: "#22d3ee" },
      { label: "C₂", size: 28, color: "#34d399" },
      { label: "C₃", size: 18, color: "#a78bfa" },
      { label: "C₄", size: 12, color: "#fbbf24" },
      { label: "C₅", size: 7, color: "#fb7185" },
    ];

    const total = clusters.reduce((s, c) => s + c.size, 0);
    const maxSize = Math.max(...clusters.map((c) => c.size));
    const H_diversity = -clusters.reduce((s, c) => {
      const p = c.size / total;
      return s + p * Math.log(p);
    }, 0);

    let t = 0;
    let animId: number;

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = "rgba(255,255,255,0.04)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= 4; i++) {
        const y = pad.top + (gH / 4) * i;
        ctx.beginPath();
        ctx.moveTo(pad.left, y);
        ctx.lineTo(pad.left + gW, y);
        ctx.stroke();
      }

      // Axes
      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad.left, pad.top + gH);
      ctx.lineTo(pad.left + gW, pad.top + gH);
      ctx.stroke();

      // Animate bar growth
      const growth = Math.min(t / 60, 1);
      const eased = 1 - (1 - growth) ** 3; // ease-out cubic

      const barW = (gW / clusters.length) * 0.65;
      const gap = gW / clusters.length;

      for (let i = 0; i < clusters.length; i++) {
        const c = clusters[i];
        const barH = (c.size / maxSize) * gH * eased;
        const x = pad.left + gap * i + (gap - barW) / 2;
        const y = pad.top + gH - barH;
        const [r, g, b] = hexToRgb(c.color);

        // Bar glow
        const grad = ctx.createLinearGradient(x, y, x, pad.top + gH);
        grad.addColorStop(0, `rgba(${r},${g},${b},0.5)`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0.12)`);
        ctx.fillStyle = grad;
        ctx.shadowColor = `rgba(${r},${g},${b},0.25)`;
        ctx.shadowBlur = 8;

        // Rounded top
        const rr = Math.min(barW / 2, 4);
        ctx.beginPath();
        ctx.moveTo(x + rr, y);
        ctx.lineTo(x + barW - rr, y);
        ctx.arcTo(x + barW, y, x + barW, y + rr, rr);
        ctx.lineTo(x + barW, pad.top + gH);
        ctx.lineTo(x, pad.top + gH);
        ctx.lineTo(x, y + rr);
        ctx.arcTo(x, y, x + rr, y, rr);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;

        // Count label
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.font = "bold 10px monospace";
        ctx.textAlign = "center";
        if (barH > 20) {
          ctx.fillText(String(Math.round(c.size * eased)), x + barW / 2, y - 6);
        }

        // Cluster label
        ctx.fillStyle = "rgba(255,255,255,0.25)";
        ctx.font = "9px monospace";
        ctx.fillText(c.label, x + barW / 2, pad.top + gH + 14);
      }

      // Shannon H value — large display
      const displayH = (H_diversity * eased).toFixed(2);
      ctx.fillStyle = "rgba(139, 92, 246, 0.7)";
      ctx.font = "bold 14px monospace";
      ctx.textAlign = "right";
      ctx.shadowColor = "rgba(139, 92, 246, 0.4)";
      ctx.shadowBlur = 8;
      ctx.fillText(`H = ${displayH}`, W - pad.right, pad.top + 10);
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(255,255,255,0.15)";
      ctx.font = "8px monospace";
      ctx.fillText("Shannon Diversity", W - pad.right, pad.top + 24);

      // Oscillating highlight on bars
      const highlightIdx = Math.floor((t / 30) % clusters.length);
      const hc = clusters[highlightIdx];
      const hx = pad.left + gap * highlightIdx + (gap - barW) / 2;
      const hBarH = (hc.size / maxSize) * gH * eased;
      const hy = pad.top + gH - hBarH;
      const [hr, hg, hb] = hexToRgb(hc.color);
      ctx.strokeStyle = `rgba(${hr},${hg},${hb},0.3)`;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.rect(hx - 2, hy - 2, barW + 4, hBarH + 2);
      ctx.stroke();
      ctx.setLineDash([]);

      t++;
      if (t > 300) t = 0;
      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return <canvas ref={canvasRef} className={className} style={{ width: "100%", height: "100%" }} />;
}
