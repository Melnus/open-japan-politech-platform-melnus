"use client";

import { AnimatedCounter, StaggerItem } from "@ojpp/ui";
import { getServiceUrl, type ServiceDefinition } from "@/lib/constants";
import { DataPulse } from "./data-pulse";

interface KpiData {
  label: string;
  value: number;
  suffix?: string;
}

interface ServiceCardProps {
  service: ServiceDefinition;
  kpis: KpiData[];
  heroValue?: number;
  heroSuffix?: string;
  heroLabel?: string;
}

export function ServiceCard({ service, kpis, heroValue, heroSuffix, heroLabel }: ServiceCardProps) {
  const maxKpi = Math.max(...kpis.map((k) => k.value), 1);
  const href = getServiceUrl(service);

  return (
    <StaggerItem className={service.gridSpan === 2 ? "sm:col-span-2" : ""}>
      <a
        href={href}
        target={href.startsWith("http://localhost") ? undefined : "_blank"}
        rel={href.startsWith("http://localhost") ? undefined : "noopener noreferrer"}
        className="svc-glow-card block h-full border border-[var(--border)] bg-[var(--bg-card)] p-5 pl-7"
        style={{ "--svc-color": service.color } as React.CSSProperties}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="mono text-xs font-bold tracking-[3px]" style={{ color: service.color }}>
              {service.name}
            </h3>
            <p className="mt-0.5 text-[0.65rem] text-[var(--text-dim)]">{service.nameJa}</p>
          </div>
          <DataPulse color={service.color} size={4} />
        </div>

        {/* Hero stat */}
        {heroValue !== undefined && (
          <div className="mt-4 min-w-0 overflow-hidden">
            <p
              className="kpi-value number-glow text-4xl font-bold sm:text-5xl"
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
        <div className="mt-4 space-y-2.5">
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
                        background: service.color,
                        width: `${pct}%`,
                      } as React.CSSProperties
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="mono text-[0.5rem] text-[var(--text-ghost)]">
            {href.startsWith("http://localhost") ? `:${service.port}` : service.name.toLowerCase()}
          </span>
          <span
            className="mono text-[0.55rem] font-bold tracking-[1.5px] transition-colors"
            style={{ color: service.color }}
          >
            {"OPEN →"}
          </span>
        </div>
      </a>
    </StaggerItem>
  );
}
