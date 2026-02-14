"use client";

import { motion, useInView } from "@ojpp/ui";
import { useRef } from "react";

interface VoteCount {
  FOR: number;
  AGAINST: number;
  ABSTAIN: number;
  ABSENT: number;
}

export function VoteChart({ votes }: { votes: VoteCount }) {
  const total = votes.FOR + votes.AGAINST + votes.ABSTAIN + votes.ABSENT;
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  if (total === 0) {
    return <p className="text-sm text-[#8b949e]">投票データなし</p>;
  }

  const items = [
    {
      label: "賛成",
      count: votes.FOR,
      color: "bg-emerald-500",
      hex: "#22c55e",
      textColor: "text-emerald-400",
    },
    {
      label: "反対",
      count: votes.AGAINST,
      color: "bg-red-500",
      hex: "#ef4444",
      textColor: "text-red-400",
    },
    {
      label: "棄権",
      count: votes.ABSTAIN,
      color: "bg-yellow-500",
      hex: "#eab308",
      textColor: "text-yellow-400",
    },
    {
      label: "欠席",
      count: votes.ABSENT,
      color: "bg-gray-500",
      hex: "#6b7280",
      textColor: "text-gray-400",
    },
  ];

  return (
    <div ref={ref} className="space-y-4">
      {/* Individual bars like SVG design */}
      {items
        .filter((item) => item.count > 0)
        .map((item, i) => (
          <div key={item.label} className="flex items-center gap-3">
            <span className={`w-8 text-sm font-medium ${item.textColor}`}>{item.label}</span>
            <div className="relative flex-1">
              <div className="h-4 w-full overflow-hidden rounded-md bg-white/[0.06]">
                <motion.div
                  className="h-full rounded-md"
                  style={{ backgroundColor: item.hex }}
                  initial={{ width: "0%" }}
                  animate={isInView ? { width: `${(item.count / total) * 100}%` } : { width: "0%" }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.1,
                    type: "spring",
                    stiffness: 55,
                    damping: 14,
                  }}
                />
              </div>
            </div>
            <motion.span
              className={`min-w-[2.5rem] text-right text-sm font-semibold ${item.textColor}`}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              {item.count}
            </motion.span>
          </div>
        ))}

      {/* Legend dots */}
      <motion.div
        className="flex flex-wrap gap-4 pt-2 text-sm"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.8 }}
      >
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className={`h-3 w-3 rounded-full ${item.color}`} />
            <span className="text-[#8b949e]">
              {item.label}: {item.count}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
