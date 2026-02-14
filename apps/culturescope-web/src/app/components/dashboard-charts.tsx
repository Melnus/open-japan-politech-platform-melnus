"use client";

import { useInView } from "@ojpp/ui";
import { useRef } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/* ---------- Types ---------- */

interface TotalByYear {
  year: string;
  amount: number;
}

interface CategoryBreakdown {
  category: string;
  label: string;
  amount: number;
  percentage: number;
}

interface DashboardChartsProps {
  totalByYear: TotalByYear[];
  categoryBreakdown: CategoryBreakdown[];
}

/* ---------- Helpers ---------- */

function formatAmount(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}兆`;
  if (value >= 100) return `${Math.round(value / 100)}億`;
  return `${value}百万`;
}

/* ---------- Amber gradient palette for bars ---------- */

const BAR_COLORS = [
  "#F59E0B",
  "#FBBF24",
  "#FCD34D",
  "#FDE68A",
  "#FEF3C7",
  "#D97706",
  "#B45309",
  "#92400E",
  "#78350F",
  "#F97316",
  "#FB923C",
];

/* ---------- Custom Tooltip ---------- */

function DarkTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-zinc-900/95 px-4 py-3 shadow-xl backdrop-blur-sm">
      <p className="mb-1 text-sm font-bold text-white">{label}年度</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-xs text-amber-400">
          {entry.name}: {formatAmount(entry.value)} ({entry.value.toLocaleString()}百万円)
        </p>
      ))}
    </div>
  );
}

/* ---------- Component ---------- */

export function DashboardCharts({ totalByYear, categoryBreakdown }: DashboardChartsProps) {
  const areaRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const isAreaInView = useInView(areaRef, { once: true, margin: "-40px" });
  const isBarInView = useInView(barRef, { once: true, margin: "-40px" });

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      {/* ====== Area Chart (3 cols) ====== */}
      <div ref={areaRef} className="glass-card p-6 lg:col-span-3">
        <h3 className="mb-6 text-base font-semibold text-white">文化庁予算推移（億円）</h3>
        <div
          className="transition-all duration-700"
          style={{
            opacity: isAreaInView ? 1 : 0,
            transform: isAreaInView ? "translateY(0)" : "translateY(16px)",
          }}
        >
          {totalByYear.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={totalByYear} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradientAmberDark" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  vertical={false}
                />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 11, fill: "#71717a" }}
                  axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#71717a" }}
                  tickFormatter={(v: number) => formatAmount(v)}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<DarkTooltip />} />
                <Area
                  type="monotone"
                  dataKey="amount"
                  name="予算総額"
                  stroke="#F59E0B"
                  strokeWidth={2.5}
                  fill="url(#gradientAmberDark)"
                  dot={{ r: 4, fill: "#F59E0B", stroke: "none" }}
                  activeDot={{ r: 6, fill: "#F59E0B", stroke: "#fff", strokeWidth: 2 }}
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[280px] items-center justify-center text-sm text-zinc-600">
              データなし
            </div>
          )}
        </div>
      </div>

      {/* ====== Horizontal Bar Chart (2 cols) ====== */}
      <div ref={barRef} className="glass-card p-6 lg:col-span-2">
        <h3 className="mb-6 text-base font-semibold text-white">分野別内訳</h3>
        <div
          className="space-y-4 transition-all duration-700"
          style={{
            opacity: isBarInView ? 1 : 0,
            transform: isBarInView ? "translateY(0)" : "translateY(16px)",
          }}
        >
          {categoryBreakdown.length > 0 ? (
            categoryBreakdown.map((cat, i) => (
              <div key={cat.category}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-xs text-zinc-300">{cat.label}</span>
                  <span className="text-xs font-medium text-zinc-400">
                    {formatAmount(cat.amount)}
                  </span>
                </div>
                <div className="relative h-3 w-full overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: isBarInView ? `${cat.percentage}%` : "0%",
                      backgroundColor: BAR_COLORS[i % BAR_COLORS.length],
                      opacity: 1 - i * 0.08,
                      transitionDelay: `${i * 80}ms`,
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="flex h-[240px] items-center justify-center text-sm text-zinc-600">
              データなし
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
