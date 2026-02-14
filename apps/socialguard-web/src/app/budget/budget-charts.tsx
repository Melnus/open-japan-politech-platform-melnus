"use client";

import { useInView } from "@ojpp/ui";
import { useRef } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/* ───── Stacked Area Chart ───── */

interface TrendChartProps {
  data: Record<string, number | string>[];
  categoryKeys: string[];
  colorMap: Record<string, string>;
}

export function BudgetTrendChart({ data, categoryKeys, colorMap }: TrendChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref}>
      {isInView && (
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={data}>
            <defs>
              {categoryKeys.map((key) => (
                <linearGradient key={key} id={`area-${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colorMap[key] ?? "#6B7280"} stopOpacity={0.7} />
                  <stop offset="100%" stopColor={colorMap[key] ?? "#6B7280"} stopOpacity={0.1} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 12, fill: "#6B7280" }}
              stroke="rgba(255,255,255,0.06)"
            />
            <YAxis
              tickFormatter={(v: number) =>
                v >= 10000 ? `${(v / 10000).toFixed(0)}兆` : `${v.toLocaleString()}億`
              }
              tick={{ fontSize: 12, fill: "#6B7280" }}
              stroke="rgba(255,255,255,0.06)"
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                value >= 10000
                  ? `${(value / 10000).toFixed(2)}兆円`
                  : `${value.toLocaleString()}億円`,
                name,
              ]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.1)",
                backgroundColor: "rgba(15, 23, 42, 0.95)",
                color: "#E5E7EB",
                boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
              }}
              itemStyle={{ color: "#D1D5DB" }}
              labelStyle={{ color: "#9CA3AF" }}
            />
            <Legend wrapperStyle={{ color: "#9CA3AF", fontSize: "12px" }} />
            {categoryKeys.map((key, i) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stackId="1"
                stroke={colorMap[key] ?? "#6B7280"}
                fill={`url(#area-${key})`}
                animationDuration={1200}
                animationBegin={i * 100}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

/* ───── Pie Chart ───── */

interface PieData {
  name: string;
  value: number;
  color: string;
}

export function BudgetPieChart({ data }: { data: PieData[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref}>
      {isInView && (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <defs>
              {data.map((d) => (
                <linearGradient key={d.name} id={`pie-${d.name}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={d.color} stopOpacity={1} />
                  <stop offset="100%" stopColor={d.color} stopOpacity={0.7} />
                </linearGradient>
              ))}
            </defs>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={140}
              dataKey="value"
              animationDuration={1000}
              animationBegin={300}
              label={({ name, percent }: { name: string; percent: number }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              labelLine={{ stroke: "#4B5563", strokeWidth: 1 }}
            >
              {data.map((d) => (
                <Cell
                  key={d.name}
                  fill={`url(#pie-${d.name})`}
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [
                value >= 10000
                  ? `${(value / 10000).toFixed(2)}兆円`
                  : `${value.toLocaleString()}億円`,
                "予算額",
              ]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.1)",
                backgroundColor: "rgba(15, 23, 42, 0.95)",
                color: "#E5E7EB",
                boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
              }}
              itemStyle={{ color: "#D1D5DB" }}
              labelStyle={{ color: "#9CA3AF" }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
