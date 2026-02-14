"use client";

import { motion, useInView } from "@ojpp/ui";
import { useRef, useState } from "react";

interface PrefectureData {
  id: string;
  name: string;
  code: string;
  region: string | null;
  stats: Record<string, { value: number; unit: string }>;
}

interface Props {
  data: PrefectureData[];
  indicators: string[];
  categories: string[];
  categoryLabels: Record<string, string>;
  year: number;
}

function getHeatColor(value: number, min: number, max: number): string {
  if (max === min) return "bg-emerald-900/30 text-emerald-300";
  const ratio = (value - min) / (max - min);
  if (ratio < 0.25) return "bg-emerald-900/20 text-emerald-400/70";
  if (ratio < 0.5) return "bg-emerald-900/30 text-emerald-300";
  if (ratio < 0.75) return "bg-emerald-800/40 text-emerald-200";
  return "bg-emerald-700/50 text-emerald-100 font-semibold";
}

export function PrefectureTable({ data, indicators, categoryLabels, year }: Props) {
  const [selectedIndicator, setSelectedIndicator] = useState<string>(indicators[0] ?? "");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  // Get min/max for heatmap
  const values = data
    .map((d) => d.stats[selectedIndicator]?.value)
    .filter((v): v is number => v != null);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const unit = data.find((d) => d.stats[selectedIndicator])?.stats[selectedIndicator]?.unit ?? "";

  // Sort data
  const sortedData = [...data].sort((a, b) => {
    const aVal = a.stats[selectedIndicator]?.value ?? 0;
    const bVal = b.stats[selectedIndicator]?.value ?? 0;
    return sortDir === "desc" ? bVal - aVal : aVal - bVal;
  });

  return (
    <div ref={ref} className="space-y-6">
      {/* Filter controls */}
      <div className="flex flex-wrap items-center gap-4">
        <label className="text-sm font-medium text-gray-400">
          指標:
          <select
            value={selectedIndicator}
            onChange={(e) => setSelectedIndicator(e.target.value)}
            className="ml-2 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-gray-200 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            {indicators.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={() => setSortDir(sortDir === "desc" ? "asc" : "desc")}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-slate-900 px-4 py-2 text-sm text-gray-300 shadow-sm transition-all hover:bg-slate-800 hover:border-emerald-500/30"
        >
          <svg
            className="h-4 w-4 text-emerald-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {sortDir === "desc" ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
              />
            )}
          </svg>
          {sortDir === "desc" ? "高い順" : "低い順"}
        </button>
        <span className="text-xs text-gray-600">
          {year}年度 | {data.length}都道府県
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl dark-card dark-scrollbar">
        <table className="w-full text-left text-sm dark-table">
          <thead>
            <tr>
              <th className="px-5 py-4 font-medium w-12">#</th>
              <th className="px-5 py-4 font-medium">都道府県</th>
              <th className="px-5 py-4 font-medium">地方</th>
              <th className="px-5 py-4 text-right font-medium">
                {selectedIndicator} ({unit})
              </th>
              <th className="px-5 py-4 font-medium w-48">分布</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((pref, i) => {
              const stat = pref.stats[selectedIndicator];
              const value = stat?.value ?? 0;
              const barWidth = max > 0 ? (value / max) * 100 : 0;

              return (
                <motion.tr
                  key={pref.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.3, delay: Math.min(i * 0.02, 0.8) }}
                >
                  <td className="px-5 py-3 text-gray-600 text-xs">{i + 1}</td>
                  <td className="px-5 py-3 font-medium text-gray-200">{pref.name}</td>
                  <td className="px-5 py-3 text-gray-500 text-xs">{pref.region ?? "-"}</td>
                  <td className="px-5 py-3 text-right">
                    <span
                      className={`inline-block rounded px-2 py-0.5 text-xs ${getHeatColor(value, min, max)}`}
                    >
                      {value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="h-3 w-full rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                        initial={{ width: "0%" }}
                        animate={isInView ? { width: `${barWidth}%` } : { width: "0%" }}
                        transition={{
                          duration: 0.8,
                          delay: Math.min(i * 0.02, 0.8) + 0.2,
                          type: "spring",
                          stiffness: 60,
                          damping: 15,
                        }}
                      />
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
