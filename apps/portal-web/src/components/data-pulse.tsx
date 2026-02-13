"use client";

interface DataPulseProps {
  color?: string;
  size?: number;
  label?: string;
}

export function DataPulse({ color = "var(--accent)", size = 6, label = "LIVE" }: DataPulseProps) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="relative flex" style={{ width: size, height: size }}>
        <span
          className="pulse-ring absolute inset-0 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span
          className="data-pulse relative inline-flex rounded-full"
          style={{ width: size, height: size, backgroundColor: color }}
        />
      </span>
      {label && (
        <span className="kpi-value" style={{ color, fontSize: "0.55rem", letterSpacing: "2.5px" }}>
          {label}
        </span>
      )}
    </span>
  );
}
