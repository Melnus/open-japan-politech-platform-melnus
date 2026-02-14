"use client";

import { motion, useInView } from "@ojpp/ui";
import { useRef } from "react";

interface VoteData {
  billTitle: string;
  forCount: number;
  againstCount: number;
  abstainCount: number;
  partyBreakdown?: { name: string; color: string; voted: "for" | "against" }[];
}

export function DashboardVotePanel({ vote }: { vote: VoteData }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const total = vote.forCount + vote.againstCount + vote.abstainCount;

  const bars = [
    {
      label: "賛成",
      count: vote.forCount,
      color: "bg-gradient-to-r from-indigo-500 to-violet-500",
      textColor: "text-emerald-400",
      countColor: "text-indigo-300",
    },
    {
      label: "反対",
      count: vote.againstCount,
      color: "bg-red-500/60",
      textColor: "text-red-400",
      countColor: "text-red-300",
    },
    {
      label: "棄権",
      count: vote.abstainCount,
      color: "bg-yellow-500/50",
      textColor: "text-yellow-400",
      countColor: "text-yellow-300",
    },
  ];

  return (
    <div ref={ref} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-6">
      <h3 className="mb-1 text-base font-semibold text-white">投票結果</h3>
      <p className="mb-6 text-sm text-[#8b949e]">{vote.billTitle}</p>

      <div className="space-y-5">
        {bars.map((bar, i) => (
          <div key={bar.label} className="flex items-center gap-3">
            <span className={`w-8 text-sm font-medium ${bar.textColor}`}>{bar.label}</span>
            <div className="relative flex-1">
              <div className="h-4 w-full overflow-hidden rounded-md bg-white/[0.06]">
                <motion.div
                  className={`h-full rounded-md ${bar.color}`}
                  initial={{ width: "0%" }}
                  animate={
                    isInView
                      ? { width: total > 0 ? `${(bar.count / total) * 100}%` : "0%" }
                      : { width: "0%" }
                  }
                  transition={{
                    duration: 0.9,
                    delay: i * 0.12,
                    type: "spring",
                    stiffness: 50,
                    damping: 14,
                  }}
                />
              </div>
            </div>
            <motion.span
              className={`min-w-[2.5rem] text-right text-sm font-semibold ${bar.countColor}`}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              {bar.count}
            </motion.span>
          </div>
        ))}
      </div>

      {vote.partyBreakdown && vote.partyBreakdown.length > 0 && (
        <motion.div
          className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/5 pt-4"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          <span className="text-xs text-[#8b949e]">政党別:</span>
          {vote.partyBreakdown.map((party) => (
            <div key={party.name} className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: party.color }} />
              <span className="text-xs text-[#ccc]">
                {party.name} {party.voted === "for" ? "\u2713" : "\u2717"}
              </span>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
