"use client";

import { useInView } from "@ojpp/ui";
import { useRef } from "react";
import {
  Bar,
  BarChart,
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

const COLORS = [
  "#FF6B35",
  "#FFAD80",
  "#F7931E",
  "#FFD4B8",
  "#FF8C5A",
  "#E5550F",
  "#FFC299",
  "#CC4400",
];

interface YearlyData {
  year: number;
  totalIncome: string | number;
  totalExpenditure: string | number;
}

export function YearlyBarChart({ data }: { data: YearlyData[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  const chartData = data.map((d) => ({
    year: `${d.year}年`,
    収入: Number(d.totalIncome) / 100_000_000,
    支出: Number(d.totalExpenditure) / 100_000_000,
  }));

  return (
    <div ref={ref}>
      {isInView && (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF6B35" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#F7931E" stopOpacity={0.7} />
              </linearGradient>
              <linearGradient id="expenditureGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF8C5A" stopOpacity={0.7} />
                <stop offset="100%" stopColor="#FFAD80" stopOpacity={0.5} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 12, fill: "#8b949e" }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              tickLine={{ stroke: "rgba(255,255,255,0.1)" }}
            />
            <YAxis
              tickFormatter={(v: number) => `${v.toFixed(0)}億`}
              tick={{ fontSize: 12, fill: "#8b949e" }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              tickLine={{ stroke: "rgba(255,255,255,0.1)" }}
            />
            <Tooltip
              formatter={(value: number) => [`${value.toFixed(1)}億円`]}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid rgba(255,107,53,0.2)",
                backgroundColor: "#1a1a2e",
                color: "#f0f0f0",
              }}
              labelStyle={{ color: "#8b949e" }}
            />
            <Legend wrapperStyle={{ color: "#8b949e" }} />
            <Bar
              dataKey="収入"
              fill="url(#incomeGradient)"
              radius={[4, 4, 0, 0]}
              animationDuration={1200}
              animationBegin={200}
            />
            <Bar
              dataKey="支出"
              fill="url(#expenditureGradient)"
              radius={[4, 4, 0, 0]}
              animationDuration={1200}
              animationBegin={400}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

interface PieData {
  name: string;
  value: number;
}

export function CategoryPieChart({ data }: { data: PieData[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref}>
      {isInView && (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              dataKey="value"
              animationDuration={1000}
              animationBegin={300}
              label={({ name, percent }: { name: string; percent: number }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`${(value / 100_000_000).toFixed(1)}億円`]}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid rgba(255,107,53,0.2)",
                backgroundColor: "#1a1a2e",
                color: "#f0f0f0",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

interface PartyBarData {
  name: string;
  color: string;
  totalIncome: string | number;
  totalExpenditure: string | number;
}

export function PartyComparisonChart({ data }: { data: PartyBarData[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  const chartData = data.map((d) => ({
    name: d.name,
    収入: Number(d.totalIncome) / 100_000_000,
    支出: Number(d.totalExpenditure) / 100_000_000,
  }));

  return (
    <div ref={ref}>
      {isInView && (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 80 }}>
            <defs>
              <linearGradient id="incomeGradientH" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#FF6B35" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#F7931E" stopOpacity={0.7} />
              </linearGradient>
              <linearGradient id="expenditureGradientH" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#FF8C5A" stopOpacity={0.7} />
                <stop offset="100%" stopColor="#FFAD80" stopOpacity={0.5} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis
              type="number"
              tickFormatter={(v: number) => `${v.toFixed(0)}億`}
              tick={{ fontSize: 12, fill: "#8b949e" }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              tickLine={{ stroke: "rgba(255,255,255,0.1)" }}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={80}
              tick={{ fontSize: 12, fill: "#8b949e" }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              tickLine={{ stroke: "rgba(255,255,255,0.1)" }}
            />
            <Tooltip
              formatter={(value: number) => [`${value.toFixed(1)}億円`]}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid rgba(255,107,53,0.2)",
                backgroundColor: "#1a1a2e",
                color: "#f0f0f0",
              }}
              labelStyle={{ color: "#8b949e" }}
            />
            <Legend wrapperStyle={{ color: "#8b949e" }} />
            <Bar
              dataKey="収入"
              fill="url(#incomeGradientH)"
              radius={[0, 4, 4, 0]}
              animationDuration={1200}
              animationBegin={200}
            />
            <Bar
              dataKey="支出"
              fill="url(#expenditureGradientH)"
              radius={[0, 4, 4, 0]}
              animationDuration={1200}
              animationBegin={400}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
