"use client";

import { AnimatedCounter, ScrollReveal } from "@ojpp/ui";

interface ScoreItem {
  label: string;
  value: number;
  suffix?: string;
}

interface PlatformScoreProps {
  items: ScoreItem[];
}

export function PlatformScore({ items }: PlatformScoreProps) {
  return (
    <ScrollReveal>
      <section className="mx-3 sm:mx-4">
        <div
          className="grid grid-cols-3 gap-px sm:grid-cols-6"
          style={{ background: "var(--border)" }}
        >
          {items.map((item, i) => (
            <div
              key={item.label}
              className="score-cell flex flex-col items-center justify-center bg-[var(--bg-raised)] px-3 py-3 sm:px-5"
              style={{ "--delay": `${i * 0.08}s` } as React.CSSProperties}
            >
              <span className="mono text-[0.45rem] tracking-[2.5px] text-[var(--text-ghost)]">
                {item.label}
              </span>
              <span className="kpi-value mt-1 text-lg font-bold text-[var(--text)] sm:text-xl">
                <AnimatedCounter to={item.value} duration={2.5} suffix={item.suffix} />
              </span>
            </div>
          ))}
        </div>
      </section>
    </ScrollReveal>
  );
}
