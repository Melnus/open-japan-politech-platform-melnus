"use client";

/* ── 39 data nodes across Japan ── */
const NODES = [
  /* Hokkaido */
  { x: 75, y: 5, s: 2.2 },
  { x: 80, y: 3, s: 1.2 },
  { x: 83, y: 8, s: 1.0 },
  { x: 70, y: 8, s: 2.5 },
  { x: 77, y: 12, s: 1.5 },
  { x: 82, y: 15, s: 1.3 },
  /* Tohoku */
  { x: 68, y: 18, s: 1.8 },
  { x: 64, y: 22, s: 2.0 },
  { x: 70, y: 24, s: 1.2 },
  { x: 62, y: 27, s: 1.5 },
  { x: 57, y: 18, s: 1.3 },
  /* Kanto — Tokyo cluster */
  { x: 65, y: 35, s: 1.8 },
  { x: 60, y: 32, s: 1.5 },
  { x: 67, y: 38, s: 5.0 } /* Tokyo — largest */,
  { x: 62, y: 38, s: 2.5 },
  { x: 70, y: 36, s: 1.8 },
  { x: 58, y: 35, s: 1.2 },
  /* Chubu */
  { x: 56, y: 36, s: 1.8 },
  { x: 52, y: 40, s: 2.0 },
  { x: 48, y: 38, s: 1.5 },
  { x: 54, y: 42, s: 1.3 },
  /* Kansai — Osaka cluster */
  { x: 50, y: 44, s: 3.8 } /* Osaka */,
  { x: 46, y: 42, s: 2.2 },
  { x: 44, y: 46, s: 1.5 },
  { x: 52, y: 47, s: 1.2 },
  /* Chugoku */
  { x: 38, y: 48, s: 2.0 },
  { x: 34, y: 46, s: 1.5 },
  { x: 30, y: 50, s: 1.3 },
  /* Shikoku */
  { x: 42, y: 54, s: 1.8 },
  { x: 38, y: 56, s: 1.2 },
  { x: 46, y: 52, s: 1.0 },
  /* Kyushu — Fukuoka cluster */
  { x: 26, y: 56, s: 3.0 } /* Fukuoka */,
  { x: 24, y: 60, s: 1.8 },
  { x: 28, y: 63, s: 1.5 },
  { x: 22, y: 65, s: 1.2 },
  { x: 20, y: 70, s: 1.0 },
  /* Okinawa */
  { x: 14, y: 86, s: 1.8 },
  { x: 10, y: 90, s: 1.0 },
  { x: 18, y: 82, s: 0.8 },
];

/* ── Connections forming the backbone ── */
const EDGES: [number, number][] = [
  /* Hokkaido internal */
  [0, 1],
  [0, 3],
  [1, 2],
  [3, 4],
  [4, 5],
  /* Hokkaido → Tohoku */
  [3, 6],
  /* Tohoku internal */
  [6, 7],
  [6, 8],
  [7, 9],
  [7, 10],
  /* Tohoku → Kanto */
  [9, 11],
  [9, 12],
  /* Kanto internal */
  [11, 12],
  [11, 13],
  [12, 14],
  [13, 14],
  [13, 15],
  [14, 16],
  /* Kanto → Chubu */
  [16, 17],
  [14, 18],
  /* Chubu internal */
  [17, 18],
  [18, 19],
  [18, 20],
  /* Chubu → Kansai */
  [20, 21],
  [19, 21],
  /* Kansai internal */
  [21, 22],
  [21, 23],
  [21, 24],
  /* Kansai → Chugoku */
  [22, 25],
  /* Chugoku internal */
  [25, 26],
  [26, 27],
  /* Kansai → Shikoku */
  [23, 28],
  /* Shikoku internal */
  [28, 29],
  [28, 30],
  /* Chugoku → Kyushu */
  [27, 31],
  /* Kyushu internal */
  [31, 32],
  [32, 33],
  [33, 34],
  [34, 35],
  /* Kyushu → Okinawa */
  [35, 36],
  [36, 37],
  /* Cross connections for density */
  [25, 28],
  [30, 21],
  [11, 15],
  [22, 30],
  [36, 38],
];

/* Rainbow palette for connections */
const RAINBOW = [
  "#b4ff39",
  "#ff2d7b",
  "#3b82f6",
  "#ff6b35",
  "#a855f7",
  "#06d6d6",
  "#fbbf24",
  "#34d399",
];

export function JapanMap() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="h-full w-auto"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Japan data network map"
    >
      <defs>
        <radialGradient id="node-glow-g">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.7" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="node-glow-pink">
          <stop offset="0%" stopColor="var(--neon-pink)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="var(--neon-pink)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="node-glow-blue">
          <stop offset="0%" stopColor="var(--neon-blue)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--neon-blue)" stopOpacity="0" />
        </radialGradient>
        <filter id="map-glow">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Connections — rainbow colored dashed lines with animation */}
      {EDGES.map(([a, b], i) => {
        const color = RAINBOW[i % RAINBOW.length];
        const na = NODES[a];
        const nb = NODES[b];
        const dx = nb.x - na.x;
        const dy = nb.y - na.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        return (
          <line
            key={`e-${a}-${b}`}
            x1={na.x}
            y1={na.y}
            x2={nb.x}
            y2={nb.y}
            stroke={color}
            strokeWidth="0.18"
            opacity="0.25"
            strokeDasharray="1.5 1.5"
            style={{
              animation: `dash-flow ${1.5 + len / 30}s linear infinite`,
              animationDelay: `${i * -0.15}s`,
            }}
          />
        );
      })}

      {/* Data nodes */}
      {NODES.map((node, i) => {
        const glowId = i === 13 ? "node-glow-pink" : i === 21 ? "node-glow-blue" : "node-glow-g";
        const fillColor =
          i === 13
            ? "var(--neon-pink)"
            : i === 21
              ? "var(--neon-blue)"
              : RAINBOW[i % RAINBOW.length];
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: static node positions
          <g key={`n-${i}`}>
            {/* Outer glow */}
            <circle
              cx={node.x}
              cy={node.y}
              r={node.s * 2.2}
              fill={`url(#${glowId})`}
              className="data-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
            {/* Core dot */}
            <circle
              cx={node.x}
              cy={node.y}
              r={node.s * 0.4}
              fill={fillColor}
              opacity={node.s >= 3 ? 0.95 : 0.6}
              filter={node.s >= 3 ? "url(#map-glow)" : undefined}
            />
          </g>
        );
      })}

      {/* Pulse rings — Tokyo */}
      <circle
        cx={67}
        cy={38}
        r={6}
        fill="none"
        stroke="var(--neon-pink)"
        strokeWidth="0.25"
        opacity="0.3"
      >
        <animate attributeName="r" values="4;10;4" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0.02;0.4" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle
        cx={67}
        cy={38}
        r={4}
        fill="none"
        stroke="var(--neon-pink)"
        strokeWidth="0.15"
        opacity="0.2"
      >
        <animate attributeName="r" values="3;8;3" dur="3s" begin="0.5s" repeatCount="indefinite" />
        <animate
          attributeName="opacity"
          values="0.3;0.01;0.3"
          dur="3s"
          begin="0.5s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Pulse rings — Osaka */}
      <circle
        cx={50}
        cy={44}
        r={5}
        fill="none"
        stroke="var(--neon-blue)"
        strokeWidth="0.2"
        opacity="0.2"
      >
        <animate attributeName="r" values="3;8;3" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0.02;0.3" dur="4s" repeatCount="indefinite" />
      </circle>

      {/* Pulse rings — Fukuoka */}
      <circle cx={26} cy={56} r={4} fill="none" stroke="#a855f7" strokeWidth="0.18" opacity="0.2">
        <animate attributeName="r" values="2;6;2" dur="3.5s" repeatCount="indefinite" />
        <animate
          attributeName="opacity"
          values="0.25;0.02;0.25"
          dur="3.5s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Pulse rings — Sapporo */}
      <circle
        cx={70}
        cy={8}
        r={3}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="0.15"
        opacity="0.15"
      >
        <animate attributeName="r" values="2;5;2" dur="4.5s" repeatCount="indefinite" />
        <animate
          attributeName="opacity"
          values="0.2;0.02;0.2"
          dur="4.5s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}
