"use client";

import { AnimatePresence, motion, StaggerGrid, StaggerItem } from "@ojpp/ui";
import { useMemo, useState } from "react";

type SortKey = "income" | "expenditure" | "organizations" | "name";
type SortOrder = "asc" | "desc";

interface PartyCardData {
  id: string;
  name: string;
  color: string | null;
  organizationCount: number;
  totalIncome: string;
  totalExpenditure: string;
  formattedIncome: string;
  formattedExpenditure: string;
  incomeRatio: number;
  expenditureRatio: number;
}

interface PartyCardsProps {
  parties: PartyCardData[];
}

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "income", label: "収入順" },
  { key: "expenditure", label: "支出順" },
  { key: "organizations", label: "団体数順" },
  { key: "name", label: "名前順" },
];

export function PartyCards({ parties }: PartyCardsProps) {
  const [sortKey, setSortKey] = useState<SortKey>("income");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const sorted = useMemo(() => {
    const arr = [...parties];
    arr.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "income":
          cmp = Number(a.totalIncome) - Number(b.totalIncome);
          break;
        case "expenditure":
          cmp = Number(a.totalExpenditure) - Number(b.totalExpenditure);
          break;
        case "organizations":
          cmp = a.organizationCount - b.organizationCount;
          break;
        case "name":
          cmp = a.name.localeCompare(b.name, "ja");
          break;
      }
      return sortOrder === "desc" ? -cmp : cmp;
    });

    // Recalculate incomeRatio based on current sort
    const maxIncome = Math.max(...arr.map((p) => Number(p.totalIncome)), 1);
    return arr.map((p) => ({
      ...p,
      incomeRatio: Number(p.totalIncome) / maxIncome,
    }));
  }, [parties, sortKey, sortOrder]);

  const handleSortToggle = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder((o) => (o === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
  };

  return (
    <div>
      {/* Sort controls */}
      <div className="mb-8 flex flex-wrap items-center gap-2">
        <span className="mr-2 text-sm font-medium text-[#8b949e]">並び替え:</span>
        {SORT_OPTIONS.map((opt) => {
          const isActive = sortKey === opt.key;
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => handleSortToggle(opt.key)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "border border-[rgba(255,107,53,0.4)] bg-[rgba(255,107,53,0.12)] text-[#FF8C5A]"
                  : "border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-[#8b949e] hover:border-[rgba(255,255,255,0.15)] hover:text-[#c9d1d9]"
              }`}
            >
              {opt.label}
              {isActive && (
                <span className="text-xs">{sortOrder === "desc" ? "\u25BC" : "\u25B2"}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Party cards grid */}
      <StaggerGrid className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {sorted.map((party, index) => {
            const partyColor = party.color ?? "#6B7280";
            return (
              <StaggerItem key={party.id}>
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                >
                  <a href={`/parties/${party.id}`} className="block">
                    <motion.div
                      className="group relative overflow-hidden rounded-xl border transition-all duration-300"
                      style={{
                        background: `rgba(${hexToRgb(partyColor)}, 0.06)`,
                        borderColor: `rgba(${hexToRgb(partyColor)}, 0.2)`,
                      }}
                      whileHover={{
                        scale: 1.02,
                        boxShadow: `0 0 30px rgba(${hexToRgb(partyColor)}, 0.15)`,
                        transition: { duration: 0.2 },
                      }}
                    >
                      {/* Top accent bar */}
                      <div
                        className="h-1 w-full"
                        style={{
                          background: `linear-gradient(to right, ${partyColor}, ${partyColor}80)`,
                        }}
                      />
                      {/* Shimmer overlay on hover */}
                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                      <div className="p-6">
                        <div className="mb-4 flex items-center gap-3">
                          <div
                            className="h-4 w-4 rounded-full ring-2"
                            style={{
                              backgroundColor: partyColor,
                              boxShadow: `0 0 8px ${partyColor}60`,
                              outlineColor: `${partyColor}40`,
                            }}
                          />
                          <h3 className="text-lg font-bold text-white">{party.name}</h3>
                        </div>

                        <div className="space-y-3 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-[#8b949e]">団体数</span>
                            <span className="font-medium text-[#f0f0f0]">
                              {party.organizationCount}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[#8b949e]">総収入</span>
                            <span className="font-mono font-medium text-[#10B981]">
                              {party.formattedIncome}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[#8b949e]">総支出</span>
                            <span className="font-mono font-medium text-[#EF4444]">
                              {party.formattedExpenditure}
                            </span>
                          </div>
                        </div>

                        {/* Income bar relative to largest party */}
                        <div className="mt-4">
                          <div className="h-2 w-full overflow-hidden rounded-full bg-[rgba(255,255,255,0.06)]">
                            <motion.div
                              className="h-full rounded-full"
                              style={{
                                background: `linear-gradient(to right, ${partyColor}, ${partyColor}90)`,
                              }}
                              initial={{ width: "0%" }}
                              whileInView={{
                                width: `${Math.max(2, party.incomeRatio * 100)}%`,
                              }}
                              viewport={{ once: true }}
                              transition={{
                                duration: 0.8,
                                type: "spring",
                                stiffness: 60,
                                damping: 15,
                              }}
                            />
                          </div>
                          <p className="mt-1.5 text-xs text-[#6e7681]">
                            支出/収入比率: {party.expenditureRatio.toFixed(0)}%
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </a>
                </motion.div>
              </StaggerItem>
            );
          })}
        </AnimatePresence>
      </StaggerGrid>
    </div>
  );
}

/**
 * Convert hex color to r,g,b string for use in rgba()
 */
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "107, 114, 128";
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}
