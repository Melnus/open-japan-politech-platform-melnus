"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface ArgumentNode {
  id: string;
  type: "CLAIM" | "PREMISE" | "EVIDENCE" | "REBUTTAL";
  content: string;
  confidence: number;
}

interface ArgumentEdge {
  sourceId: string;
  targetId: string;
  relation: "ATTACK" | "SUPPORT" | "UNDERCUT";
  weight: number;
}

interface ArgumentGraphViewProps {
  nodes: ArgumentNode[];
  edges: ArgumentEdge[];
  className?: string;
}

interface SimNode {
  id: string;
  type: ArgumentNode["type"];
  content: string;
  confidence: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const NODE_COLORS: Record<ArgumentNode["type"], string> = {
  CLAIM: "#6366f1",
  PREMISE: "#8b5cf6",
  EVIDENCE: "#22c55e",
  REBUTTAL: "#ef4444",
};

const EDGE_COLORS: Record<ArgumentEdge["relation"], string> = {
  ATTACK: "#ef4444",
  SUPPORT: "#22c55e",
  UNDERCUT: "#f97316",
};

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [128, 128, 128];
  return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
}

function truncate(text: string, maxLen: number): string {
  return text.length > maxLen ? `${text.slice(0, maxLen - 1)}\u2026` : text;
}

function drawDiamond(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(cx, cy - r);
  ctx.lineTo(cx + r, cy);
  ctx.lineTo(cx, cy + r);
  ctx.lineTo(cx - r, cy);
  ctx.closePath();
}

function drawHexagon(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function drawTriangle(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(cx, cy - r);
  ctx.lineTo(cx + r * 0.866, cy + r * 0.5);
  ctx.lineTo(cx - r * 0.866, cy + r * 0.5);
  ctx.closePath();
}

function drawNodeShape(
  ctx: CanvasRenderingContext2D,
  type: ArgumentNode["type"],
  cx: number,
  cy: number,
  r: number,
) {
  switch (type) {
    case "CLAIM":
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.closePath();
      break;
    case "PREMISE":
      drawDiamond(ctx, cx, cy, r);
      break;
    case "EVIDENCE":
      drawHexagon(ctx, cx, cy, r);
      break;
    case "REBUTTAL":
      drawTriangle(ctx, cx, cy, r);
      break;
  }
}

export function ArgumentGraphView({ nodes, edges, className }: ArgumentGraphViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const simNodesRef = useRef<SimNode[]>([]);
  const animRef = useRef<number>(0);
  const [size, setSize] = useState({ width: 800, height: 600 });

  // Resize
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

  // Initialize simulation nodes when input changes
  useEffect(() => {
    const w = size.width;
    const h = size.height;
    simNodesRef.current = nodes.map((n, i) => ({
      id: n.id,
      type: n.type,
      content: n.content,
      confidence: n.confidence,
      x: w / 2 + Math.cos((i / nodes.length) * Math.PI * 2) * w * 0.3,
      y: h / 2 + Math.sin((i / nodes.length) * Math.PI * 2) * h * 0.3,
      vx: 0,
      vy: 0,
    }));
  }, [nodes, size]);

  // Animation loop
  const renderFrame = useCallback(() => {
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
    const simNodes = simNodesRef.current;
    const nodeMap = new Map<string, SimNode>();
    for (const n of simNodes) nodeMap.set(n.id, n);

    // --- Force simulation step ---
    const repulsionStrength = 2000;
    const springLength = 120;
    const springStrength = 0.005;
    const centerGravity = 0.01;
    const damping = 0.9;

    // Reset forces
    for (const n of simNodes) {
      n.vx *= damping;
      n.vy *= damping;
    }

    // Repulsion (all pairs)
    for (let i = 0; i < simNodes.length; i++) {
      for (let j = i + 1; j < simNodes.length; j++) {
        const a = simNodes[i];
        const b = simNodes[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        let dist = Math.hypot(dx, dy);
        if (dist < 1) dist = 1;
        const force = repulsionStrength / (dist * dist);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        a.vx -= fx;
        a.vy -= fy;
        b.vx += fx;
        b.vy += fy;
      }
    }

    // Spring forces (edges)
    for (const edge of edges) {
      const src = nodeMap.get(edge.sourceId);
      const tgt = nodeMap.get(edge.targetId);
      if (!src || !tgt) continue;
      const dx = tgt.x - src.x;
      const dy = tgt.y - src.y;
      let dist = Math.hypot(dx, dy);
      if (dist < 1) dist = 1;
      const displacement = dist - springLength;
      const force = displacement * springStrength * edge.weight;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      src.vx += fx;
      src.vy += fy;
      tgt.vx -= fx;
      tgt.vy -= fy;
    }

    // Center gravity
    for (const n of simNodes) {
      n.vx += (w / 2 - n.x) * centerGravity;
      n.vy += (h / 2 - n.y) * centerGravity;
    }

    // Apply velocities
    for (const n of simNodes) {
      n.x += n.vx;
      n.y += n.vy;
      // Clamp to bounds
      const margin = 40;
      n.x = Math.max(margin, Math.min(w - margin, n.x));
      n.y = Math.max(margin, Math.min(h - margin, n.y));
    }

    // --- Drawing ---
    // Background
    ctx.fillStyle = "#0f0f23";
    ctx.fillRect(0, 0, w, h);

    // Edges
    for (const edge of edges) {
      const src = nodeMap.get(edge.sourceId);
      const tgt = nodeMap.get(edge.targetId);
      if (!src || !tgt) continue;

      const color = EDGE_COLORS[edge.relation];
      const [er, eg, eb] = hexToRgb(color);
      ctx.strokeStyle = `rgba(${er}, ${eg}, ${eb}, ${0.3 + edge.weight * 0.4})`;
      ctx.lineWidth = 1 + edge.weight;

      // Dash pattern by relation
      if (edge.relation === "ATTACK") {
        ctx.setLineDash([6, 4]);
      } else if (edge.relation === "UNDERCUT") {
        ctx.setLineDash([2, 3]);
      } else {
        ctx.setLineDash([]);
      }

      ctx.beginPath();
      ctx.moveTo(src.x, src.y);
      ctx.lineTo(tgt.x, tgt.y);
      ctx.stroke();

      // Arrowhead
      const angle = Math.atan2(tgt.y - src.y, tgt.x - src.x);
      const arrowLen = 8;
      const arrowX = tgt.x - Math.cos(angle) * 16;
      const arrowY = tgt.y - Math.sin(angle) * 16;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(
        arrowX - arrowLen * Math.cos(angle - 0.4),
        arrowY - arrowLen * Math.sin(angle - 0.4),
      );
      ctx.lineTo(
        arrowX - arrowLen * Math.cos(angle + 0.4),
        arrowY - arrowLen * Math.sin(angle + 0.4),
      );
      ctx.closePath();
      ctx.fillStyle = `rgba(${er}, ${eg}, ${eb}, ${0.5 + edge.weight * 0.3})`;
      ctx.fill();
    }
    ctx.setLineDash([]);

    // Nodes
    const nodeRadius = 14;
    for (const n of simNodes) {
      const color = NODE_COLORS[n.type];
      const [nr, ng, nb] = hexToRgb(color);

      // Glow
      ctx.shadowColor = `rgba(${nr}, ${ng}, ${nb}, 0.4)`;
      ctx.shadowBlur = 12;

      // Shape
      drawNodeShape(ctx, n.type, n.x, n.y, nodeRadius);
      ctx.fillStyle = `rgba(${nr}, ${ng}, ${nb}, ${0.3 + n.confidence * 0.7})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(${nr}, ${ng}, ${nb}, 0.8)`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.shadowBlur = 0;

      // Label
      ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
      ctx.font = "10px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(truncate(n.content, 16), n.x, n.y + nodeRadius + 4);
    }

    // Legend
    drawLegend(ctx, w, h);

    animRef.current = requestAnimationFrame(renderFrame);
  }, [size, edges]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(renderFrame);
    return () => cancelAnimationFrame(animRef.current);
  }, [renderFrame]);

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
      />
    </div>
  );
}

function drawLegend(ctx: CanvasRenderingContext2D, w: number, _h: number) {
  const lx = w - 200;
  const ly = 16;
  const lw = 184;
  const lh = 150;

  // Background
  ctx.fillStyle = "rgba(15, 15, 35, 0.88)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  roundRect(ctx, lx, ly, lw, lh, 6);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  ctx.font = "bold 11px system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText("Node Types", lx + 10, ly + 16);

  const nodeTypes: { type: ArgumentNode["type"]; label: string }[] = [
    { type: "CLAIM", label: "Claim" },
    { type: "PREMISE", label: "Premise" },
    { type: "EVIDENCE", label: "Evidence" },
    { type: "REBUTTAL", label: "Rebuttal" },
  ];

  nodeTypes.forEach((nt, i) => {
    const sy = ly + 34 + i * 18;
    const color = NODE_COLORS[nt.type];
    ctx.fillStyle = color;
    drawNodeShape(ctx, nt.type, lx + 20, sy, 6);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
    ctx.font = "10px system-ui, sans-serif";
    ctx.textBaseline = "middle";
    ctx.fillText(nt.label, lx + 34, sy);
  });

  // Edge types
  const edgeY = ly + 34 + 4 * 18 + 4;
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  ctx.font = "bold 11px system-ui, sans-serif";
  ctx.fillText("Edge Types", lx + 10, edgeY);

  const edgeTypes: { relation: ArgumentEdge["relation"]; label: string; dash: number[] }[] = [
    { relation: "SUPPORT", label: "Support", dash: [] },
    { relation: "ATTACK", label: "Attack", dash: [6, 4] },
    { relation: "UNDERCUT", label: "Undercut", dash: [2, 3] },
  ];

  edgeTypes.forEach((et, i) => {
    const sy = edgeY + 16 + i * 16;
    ctx.strokeStyle = EDGE_COLORS[et.relation];
    ctx.lineWidth = 2;
    ctx.setLineDash(et.dash);
    ctx.beginPath();
    ctx.moveTo(lx + 12, sy);
    ctx.lineTo(lx + 30, sy);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
    ctx.font = "10px system-ui, sans-serif";
    ctx.textBaseline = "middle";
    ctx.fillText(et.label, lx + 36, sy);
  });
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
