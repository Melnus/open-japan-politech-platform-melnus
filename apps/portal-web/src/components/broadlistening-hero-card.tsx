"use client";

import { AnimatedCounter, StaggerItem } from "@ojpp/ui";
import { getServiceUrl, type ServiceDefinition } from "@/lib/constants";
import { BroadListeningCanvas } from "./broadlistening-canvas";
import { DataPulse } from "./data-pulse";

interface KpiData {
  label: string;
  value: number;
  suffix?: string;
}

interface BroadListeningHeroCardProps {
  service: ServiceDefinition;
  kpis: KpiData[];
  heroValue?: number;
  heroSuffix?: string;
  heroLabel?: string;
}

const SAMPLE_OPINIONS = [
  "少子化対策の抜本的見直しが必要",
  "教育無償化の範囲を拡大すべき",
  "デジタル民主主義の推進",
  "地方分権の強化を求む",
  "気候変動への具体的行動計画",
  "社会保障制度の持続可能性",
  "市民参加型の政策立案",
  "オープンデータの活用推進",
  "多様性を尊重する社会制度",
  "次世代への投資拡大",
  "透明性のある政治資金",
  "科学技術政策の充実",
];

export function BroadListeningHeroCard({
  service,
  kpis,
  heroValue,
  heroSuffix,
  heroLabel,
}: BroadListeningHeroCardProps) {
  const maxKpi = Math.max(...kpis.map((k) => k.value), 1);
  const href = getServiceUrl(service);

  return (
    <StaggerItem className="sm:col-span-2">
      <a
        href={href}
        target={href.startsWith("http://localhost") ? undefined : "_blank"}
        rel={href.startsWith("http://localhost") ? undefined : "noopener noreferrer"}
        className="bl-hero-card group relative block h-full overflow-hidden border border-[var(--border)] bg-[var(--bg-card)]"
        style={{ "--svc-color": service.color, minHeight: "400px" } as React.CSSProperties}
      >
        {/* Particle flow field background */}
        <div className="absolute inset-0 z-0">
          <BroadListeningCanvas />
        </div>

        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[var(--bg-card)] via-[var(--bg-card)]/60 to-transparent" />
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[var(--bg-card)]/80 to-transparent" />

        {/* Floating opinion fragments */}
        <div className="absolute inset-0 z-[2] overflow-hidden pointer-events-none">
          {SAMPLE_OPINIONS.map((op, i) => (
            <span
              key={op}
              className="bl-floating-opinion absolute whitespace-nowrap"
              style={{
                top: `${8 + (i % 6) * 15}%`,
                left: `${30 + (i % 5) * 12}%`,
                fontSize: `${6 + (i % 4) * 2}px`,
                opacity: 0.08 + (i % 5) * 0.03,
                animationDelay: `${i * -2.5}s`,
                animationDuration: `${18 + (i % 4) * 6}s`,
                color: service.color,
              }}
            >
              {op}
            </span>
          ))}
        </div>

        {/* Content layer */}
        <div className="relative z-[3] flex h-full flex-col p-5 pl-7">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3
                  className="mono text-sm font-bold tracking-[3px]"
                  style={{ color: service.color }}
                >
                  {service.name}
                </h3>
                <span
                  className="bl-badge mono rounded-sm px-1.5 py-0.5 text-[0.5rem] font-bold tracking-[1px]"
                  style={{
                    background: `${service.color}18`,
                    color: service.color,
                    border: `1px solid ${service.color}30`,
                  }}
                >
                  ECOSYSTEM
                </span>
              </div>
              <p className="mt-0.5 text-[0.7rem] text-[var(--text-dim)]">{service.nameJa}</p>
            </div>
            <DataPulse color={service.color} size={5} label="LIVE" />
          </div>

          {/* Description */}
          <p className="mt-3 max-w-md text-xs leading-relaxed text-[var(--text-dim)]">
            {service.description}
          </p>

          {/* Spacer to push content down */}
          <div className="flex-1" />

          {/* Hero stat + KPIs row */}
          <div className="flex items-end gap-8">
            {/* Hero stat */}
            {heroValue !== undefined && (
              <div className="min-w-0 shrink-0">
                <p
                  className="kpi-value bl-hero-number text-5xl font-bold sm:text-6xl"
                  style={{ color: service.color }}
                >
                  <AnimatedCounter to={heroValue} duration={2.5} suffix={heroSuffix} />
                </p>
                {heroLabel && (
                  <p className="mono mt-1 text-[0.5rem] tracking-[2px] text-[var(--text-ghost)]">
                    {heroLabel}
                  </p>
                )}
              </div>
            )}

            {/* KPI bars */}
            <div className="flex-1 space-y-2.5">
              {kpis.map((kpi, i) => {
                const pct = Math.round((kpi.value / maxKpi) * 100);
                return (
                  <div key={kpi.label}>
                    <div className="flex items-baseline justify-between">
                      <span className="mono text-[0.5rem] tracking-[1.5px] text-[var(--text-dim)]">
                        {kpi.label}
                      </span>
                      <span className="kpi-value text-xs font-bold text-[var(--text)]">
                        <AnimatedCounter to={kpi.value} duration={2} suffix={kpi.suffix} />
                      </span>
                    </div>
                    <div className="bar-track mt-1">
                      <div
                        className="progress-bar"
                        style={
                          {
                            "--delay": `${0.3 + i * 0.15}s`,
                            background: `linear-gradient(90deg, ${service.color}, ${service.color}88)`,
                            width: `${pct}%`,
                          } as React.CSSProperties
                        }
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between">
            <span className="mono text-[0.5rem] text-[var(--text-ghost)]">
              {href.startsWith("http://localhost")
                ? `:${service.port}`
                : service.name.toLowerCase().replace(" β", "")}
            </span>
            <span
              className="mono text-[0.6rem] font-bold tracking-[2px] transition-all group-hover:tracking-[4px]"
              style={{ color: service.color }}
            >
              {"EXPLORE ECOSYSTEM →"}
            </span>
          </div>
        </div>

        {/* Left accent bar (animated) */}
        <div
          className="bl-accent-bar absolute left-0 top-0 h-full w-[3px] transition-all duration-500 group-hover:w-[5px]"
          style={{
            background: `linear-gradient(180deg, transparent, ${service.color}, ${service.color}, transparent)`,
            boxShadow: `0 0 12px ${service.color}`,
          }}
        />
      </a>
    </StaggerItem>
  );
}
