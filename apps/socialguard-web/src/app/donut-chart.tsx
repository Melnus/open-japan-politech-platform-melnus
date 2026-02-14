"use client";

import { useInView } from "@ojpp/ui";
import { useRef } from "react";

interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  segments: DonutSegment[];
  total: number;
  centerLabel: string;
  centerSub: string;
}

export function DonutChart({ segments, total, centerLabel, centerSub }: DonutChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeWidth = 18;

  // Calculate stroke-dasharray for each segment
  let cumulativeOffset = 0;
  const segmentData = segments.map((seg, i) => {
    const fraction = seg.value / total;
    const dashLength = fraction * circumference;
    const gapLength = circumference - dashLength;
    const offset = -cumulativeOffset;
    cumulativeOffset += dashLength;
    return {
      ...seg,
      dashArray: `${dashLength} ${gapLength}`,
      dashOffset: offset,
      opacity: 0.9 - i * 0.08,
      delay: i * 0.15,
    };
  });

  return (
    <div ref={ref} className="flex flex-col items-center gap-6">
      {/* Legend row */}
      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2">
            <span
              className="inline-block h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: seg.color }}
            />
            <span className="text-xs text-gray-400">
              {seg.label}{" "}
              <span className="text-gray-500">
                {seg.value >= 10000
                  ? `${(seg.value / 10000).toFixed(1)}兆`
                  : `${seg.value.toLocaleString()}億`}
              </span>
            </span>
          </div>
        ))}
      </div>

      {/* SVG Donut */}
      <div className="relative">
        <svg width="200" height="200" viewBox="0 0 200 200">
          {segmentData.map((seg) => (
            <circle
              key={seg.label}
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={seg.dashArray}
              strokeDashoffset={seg.dashOffset}
              opacity={seg.opacity}
              strokeLinecap="butt"
              transform="rotate(-90 100 100)"
              className={isInView ? "animate-donut-draw" : ""}
              style={{
                animationDelay: `${seg.delay}s`,
                transition: "stroke-dashoffset 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              }}
            />
          ))}
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-white">{centerLabel}</span>
          <span className="text-xs text-gray-400">{centerSub}</span>
        </div>
      </div>
    </div>
  );
}
