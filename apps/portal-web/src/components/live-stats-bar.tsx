"use client";

import { AnimatedCounter, FadeIn } from "@ojpp/ui";
import { DataPulse } from "./data-pulse";

interface LiveStatsBarProps {
  totalRecords: number;
  lastUpdated: string;
}

export function LiveStatsBar({ totalRecords, lastUpdated }: LiveStatsBarProps) {
  return (
    <FadeIn>
      <div className="flex items-center justify-center gap-3 border-b border-[var(--border)] px-4 py-1.5 sm:gap-5">
        <div className="flex items-center gap-2">
          <span className="kpi-value text-[0.5rem] tracking-[2px] text-[var(--text-ghost)]">
            DATA.POINTS
          </span>
          <span className="kpi-value text-xs font-bold text-[var(--accent)]">
            <AnimatedCounter to={totalRecords} duration={2} />
          </span>
        </div>
        <span className="kpi-value text-[0.5rem] text-[var(--text-ghost)]">{"/"}</span>
        <div className="flex items-center gap-2">
          <span className="kpi-value text-[0.5rem] tracking-[2px] text-[var(--text-ghost)]">
            SYNC
          </span>
          <span className="kpi-value text-[0.6rem] text-[var(--text-dim)]">{lastUpdated}</span>
        </div>
        <span className="kpi-value text-[0.5rem] text-[var(--text-ghost)]">{"/"}</span>
        <DataPulse color="var(--accent)" size={4} label="OPERATIONAL" />
      </div>
    </FadeIn>
  );
}
