"use client";

import { motion, useInView } from "@ojpp/ui";
import { useRef } from "react";

interface BillItem {
  id: string;
  title: string;
  sessionNumber: number;
  status: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; bar: string }> = {
  ENACTED: {
    label: "成立",
    color: "text-emerald-400",
    bg: "bg-emerald-500/15",
    bar: "bg-emerald-500",
  },
  COMMITTEE: {
    label: "審議中",
    color: "text-yellow-400",
    bg: "bg-yellow-500/15",
    bar: "bg-yellow-500",
  },
  PLENARY: {
    label: "審議中",
    color: "text-yellow-400",
    bg: "bg-yellow-500/15",
    bar: "bg-yellow-500",
  },
  PASSED_LOWER: {
    label: "衆院可決",
    color: "text-yellow-400",
    bg: "bg-yellow-500/15",
    bar: "bg-yellow-500",
  },
  PASSED_UPPER: {
    label: "参院可決",
    color: "text-yellow-400",
    bg: "bg-yellow-500/15",
    bar: "bg-yellow-500",
  },
  SUBMITTED: {
    label: "提出",
    color: "text-blue-400",
    bg: "bg-blue-500/15",
    bar: "bg-blue-500",
  },
  REJECTED: {
    label: "廃案",
    color: "text-red-400",
    bg: "bg-red-500/15",
    bar: "bg-red-500",
  },
  WITHDRAWN: {
    label: "撤回",
    color: "text-red-400",
    bg: "bg-red-500/15",
    bar: "bg-red-500",
  },
};

export function DashboardBillsPanel({ bills }: { bills: BillItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-base font-semibold text-white">最新法案</h3>
        <a
          href="/bills"
          className="text-xs text-indigo-400 transition-colors hover:text-indigo-300"
        >
          すべて見る →
        </a>
      </div>

      <div className="space-y-1">
        {bills.map((bill, i) => {
          const config = STATUS_CONFIG[bill.status] ?? {
            label: bill.status,
            color: "text-gray-400",
            bg: "bg-gray-500/15",
            bar: "bg-gray-500",
          };

          return (
            <motion.a
              key={bill.id}
              href={`/bills/${bill.id}`}
              className="group flex items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-white/[0.04]"
              initial={{ opacity: 0, x: -12 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{
                duration: 0.4,
                delay: i * 0.08,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              {/* Status color bar */}
              <div className={`h-10 w-1 shrink-0 rounded-full ${config.bar}`} />

              {/* Bill info */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white group-hover:text-indigo-300">
                  {bill.title}
                </p>
                <p className="mt-0.5 text-xs text-[#8b949e]">
                  第{bill.sessionNumber}回国会 — {config.label}
                </p>
              </div>

              {/* Status badge */}
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-medium ${config.bg} ${config.color}`}
              >
                {config.label}
              </span>
            </motion.a>
          );
        })}
      </div>
    </div>
  );
}
