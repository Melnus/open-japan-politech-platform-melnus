"use client";

import { useMemo } from "react";

/**
 * OpinionStream — キネティックタイポグラフィ v3 バキバキ Edition
 * 極端なサイズ差（text-[5px]〜text-6xl）、多彩なフォント、
 * グリッチエフェクト、微回転、アウトライン、流体的。
 * CSS animations only → GPU accelerated.
 */

interface Opinion {
  content: string;
  stance?: string;
  fitness?: number;
}

interface Props {
  opinions: Opinion[];
  lanes?: number;
  className?: string;
  density?: "sparse" | "normal" | "dense";
}

// Deterministic hash → stable random styles across re-renders
function hash(s: string, seed: number): number {
  let h = seed;
  for (let i = 0; i < Math.min(s.length, 20); i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

const STANCE_COLORS: Record<string, string> = {
  FOR: "text-emerald-400",
  AGAINST: "text-rose-400",
  NEUTRAL: "text-white",
};

// Extreme weighted: tons of tiny, some medium, rare huge
const SIZE_POOL = [
  "text-[5px]",
  "text-[5px]",
  "text-[6px]",
  "text-[6px]",
  "text-[7px]",
  "text-[7px]",
  "text-[8px]",
  "text-[8px]",
  "text-[8px]",
  "text-[9px]",
  "text-[9px]",
  "text-[10px]",
  "text-[10px]",
  "text-[10px]",
  "text-xs",
  "text-xs",
  "text-xs",
  "text-xs",
  "text-sm",
  "text-sm",
  "text-sm",
  "text-base",
  "text-base",
  "text-lg",
  "text-lg",
  "text-xl",
  "text-2xl",
  "text-3xl",
  "text-4xl",
  "text-5xl",
  "text-6xl",
];

const WEIGHT_POOL = [
  "font-thin",
  "font-extralight",
  "font-light",
  "font-light",
  "font-normal",
  "font-normal",
  "font-normal",
  "font-medium",
  "font-medium",
  "font-semibold",
  "font-bold",
  "font-extrabold",
  "font-black",
];

const FONT_POOL = [
  "inherit",
  "inherit",
  "inherit",
  "Georgia, 'Noto Serif JP', serif",
  "Georgia, 'Yu Mincho', serif",
  "'Courier New', 'Fira Code', monospace",
  "'Courier New', monospace",
  "Impact, 'Hiragino Kaku Gothic ProN', sans-serif",
  "'Palatino Linotype', 'Yu Mincho', serif",
  "system-ui, -apple-system, sans-serif",
  "'Times New Roman', 'Noto Serif JP', serif",
  "'Trebuchet MS', 'Hiragino Sans', sans-serif",
];

interface StyledOpinion extends Opinion {
  size: string;
  weight: string;
  font: string;
  isItalic: boolean;
  isUppercase: boolean;
  itemOpacity: number;
  truncLen: number;
  rotation: number;
  isGlitch: boolean;
  glitchType: string;
  isOutline: boolean;
  letterSpacing: string;
}

interface LaneConfig {
  opinions: StyledOpinion[];
  speed: number;
  direction: "left" | "right";
  blur: boolean;
  py: string;
}

export function OpinionStream({ opinions, lanes = 12, className, density = "normal" }: Props) {
  const laneData = useMemo(() => {
    if (opinions.length === 0) return [] as LaneConfig[];

    const result: LaneConfig[] = [];
    const shuffled = [...opinions].sort(() => Math.random() - 0.5);
    const perLaneBase = density === "dense" ? 12 : density === "sparse" ? 4 : 8;

    for (let i = 0; i < lanes; i++) {
      const start = Math.floor((i / lanes) * shuffled.length);
      const perLane = Math.max(perLaneBase, Math.ceil(shuffled.length / lanes));
      const laneOpinions: StyledOpinion[] = [];

      for (let j = 0; j < perLane; j++) {
        const op = shuffled[(start + j) % shuffled.length];
        const h = hash(op.content, i * 1000 + j);

        const size = SIZE_POOL[h % SIZE_POOL.length];
        const weight = WEIGHT_POOL[(h >> 3) % WEIGHT_POOL.length];
        const font = FONT_POOL[(h >> 5) % FONT_POOL.length];
        const isItalic = h % 9 === 0;
        const isUppercase = h % 13 === 0;
        const itemOpacity = 0.18 + (h % 60) / 85;
        // Multiple glitch types: standard, chromatic, scan, heavy
        const glitchType =
          h % 19 === 0
            ? "glitch-text"
            : h % 23 === 0
              ? "glitch-chromatic"
              : h % 29 === 0
                ? "glitch-scan"
                : h % 37 === 0
                  ? "glitch-heavy"
                  : "";
        const isGlitch = glitchType !== "";
        const isOutline = h % 31 === 0;

        // Subtle rotation for some items
        const rotation = h % 7 === 0 ? ((h % 5) - 2) * 0.8 : 0;

        // Letter spacing variation
        const lsOptions = ["normal", "0.05em", "-0.03em", "0.1em", "0.2em", "-0.05em"];
        const letterSpacing = lsOptions[(h >> 8) % lsOptions.length];

        // Truncation: huge text = fewer chars
        let truncLen: number;
        if (size.includes("6xl")) truncLen = 10;
        else if (size.includes("5xl")) truncLen = 14;
        else if (size.includes("4xl")) truncLen = 16;
        else if (size.includes("3xl")) truncLen = 18;
        else if (size.includes("2xl")) truncLen = 22;
        else if (size.includes("xl")) truncLen = 30;
        else if (size.includes("lg")) truncLen = 40;
        else if (size.includes("base")) truncLen = 50;
        else if (size.includes("sm")) truncLen = 60;
        else truncLen = 90;

        laneOpinions.push({
          ...op,
          size,
          weight,
          font,
          isItalic,
          isUppercase,
          itemOpacity,
          truncLen,
          rotation,
          isGlitch,
          glitchType,
          isOutline,
          letterSpacing,
        });
      }

      const centerDist = Math.abs(i - lanes / 2) / (lanes / 2);
      const speed = 8 + centerDist * 65 + Math.random() * 15;
      const blur = centerDist > 0.85;
      const py = centerDist < 0.25 ? "py-3" : centerDist < 0.5 ? "py-1.5" : "py-0.5";

      result.push({
        opinions: laneOpinions,
        speed,
        direction: i % 2 === 0 ? "left" : "right",
        blur,
        py,
      });
    }

    return result;
  }, [opinions, lanes, density]);

  if (opinions.length === 0) return null;

  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      {/* Gradient masks for fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-40 z-10 bg-gradient-to-r from-[#050505] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-40 z-10 bg-gradient-to-l from-[#050505] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 z-10 bg-gradient-to-b from-[#050505] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 z-10 bg-gradient-to-t from-[#050505] to-transparent" />

      <div className="flex flex-col justify-center h-full">
        {laneData.map((lane, laneIdx) => (
          <div
            key={laneIdx}
            className={`flex items-center whitespace-nowrap ${lane.py}`}
            style={{ filter: lane.blur ? "blur(1.5px)" : "none" }}
          >
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className={`opinion-lane flex items-baseline gap-4 shrink-0 stream-anim-${lane.direction}`}
                style={
                  {
                    "--stream-duration": `${lane.speed}s`,
                    "--stream-delay": copy === 0 ? "0s" : `-${lane.speed / 2}s`,
                  } as React.CSSProperties
                }
              >
                {lane.opinions.map((op, opIdx) => {
                  const stanceColor =
                    STANCE_COLORS[op.stance ?? "NEUTRAL"] ?? STANCE_COLORS.NEUTRAL;
                  const text =
                    op.content.length > op.truncLen
                      ? `${op.content.slice(0, op.truncLen)}…`
                      : op.content;

                  return (
                    <span
                      key={`${copy}-${opIdx}`}
                      className={`${op.size} ${op.weight} ${stanceColor} shrink-0 px-2 select-none cursor-default transition-all duration-300 hover:scale-110 hover:!opacity-100 ${op.glitchType}`}
                      style={{
                        fontFamily: op.font,
                        fontStyle: op.isItalic ? "italic" : "normal",
                        textTransform: op.isUppercase ? "uppercase" : "none",
                        opacity: op.itemOpacity,
                        letterSpacing: op.letterSpacing,
                        transform: op.rotation ? `rotate(${op.rotation}deg)` : "none",
                        WebkitTextStroke: op.isOutline ? "0.5px currentColor" : "none",
                        color: op.isOutline ? "transparent" : undefined,
                        WebkitTextFillColor: op.isOutline ? "transparent" : undefined,
                      }}
                      title={op.content}
                    >
                      {text}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
