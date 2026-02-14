"use client";

import { motion, useInView } from "@ojpp/ui";
import { useRef } from "react";

interface YearData {
  year: number;
  segments: {
    label: string;
    value: number;
    color: string;
  }[];
  total: number;
}

interface StackedBarChartProps {
  data: YearData[];
  maxValue: number;
  latestTotal?: string;
  changePercent?: string;
}

export function StackedBarChart({
  data,
  maxValue,
  latestTotal,
  changePercent,
}: StackedBarChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  const chartHeight = 200;
  const barGap = 8;

  return (
    <div ref={ref} className="relative">
      <div className="flex items-end gap-1 justify-between" style={{ height: chartHeight + 40 }}>
        {data.map((yearData, yearIdx) => {
          const totalHeight = (yearData.total / maxValue) * chartHeight;
          let currentY = 0;

          return (
            <div key={yearData.year} className="flex flex-1 flex-col items-center gap-1">
              {/* Stacked segments */}
              <div
                className="relative flex w-full max-w-[40px] flex-col-reverse items-stretch"
                style={{ height: totalHeight }}
              >
                {yearData.segments.map((seg, segIdx) => {
                  const segHeight = (seg.value / yearData.total) * totalHeight;
                  const y = currentY;
                  currentY += segHeight;

                  return (
                    <motion.div
                      key={seg.label}
                      className="w-full rounded-sm"
                      style={{
                        backgroundColor: seg.color,
                        opacity: 0.65 + segIdx * 0.1,
                        minHeight: segHeight > 2 ? undefined : 2,
                      }}
                      initial={{ height: 0 }}
                      animate={isInView ? { height: segHeight } : { height: 0 }}
                      transition={{
                        duration: 0.8,
                        delay: yearIdx * 0.08 + segIdx * 0.05,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                    />
                  );
                })}
              </div>
              {/* Year label */}
              <span className="mt-1 text-[10px] text-gray-500">{yearData.year}</span>
            </div>
          );
        })}

        {/* Latest total annotation */}
        {latestTotal && (
          <div className="absolute -right-2 top-0 flex flex-col items-end">
            <span className="text-sm font-semibold text-emerald-400">{latestTotal}</span>
            {changePercent && <span className="text-xs text-gray-500">{changePercent}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
