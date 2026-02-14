"use client";

import { motion, useInView } from "@ojpp/ui";
import { useRef } from "react";

/* ---------- Types ---------- */

interface PartyResult {
  seatsWon: number;
  party: {
    name: string;
    shortName: string | null;
    color: string | null;
  };
}

interface MajorityLine {
  seats: number;
  label: string;
}

/* ---------- Individual Horizontal Bar Chart (SVG preview style) ---------- */

/**
 * Renders each party as a separate horizontal bar row,
 * matching the SVG preview design with dark background.
 */
export function SeatBarChart({
  results,
  totalSeats,
  majorityLine,
  maxBarWidth = 600,
}: {
  results: PartyResult[];
  totalSeats: number;
  majorityLine?: MajorityLine;
  maxBarWidth?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  // Filter to parties with seats and compute scale
  const partiesWithSeats = results.filter((r) => r.seatsWon > 0);
  const maxSeats = partiesWithSeats.length > 0 ? partiesWithSeats[0].seatsWon : 1;

  // Determine dark/light text per party color
  function textColorForBg(color: string | null): string {
    if (!color) return "white";
    // Light backgrounds need dark text
    const lightColors = ["#F5DEB3", "#F4B400", "#FFEB3B", "#FFC107", "#CDDC39"];
    if (lightColors.some((c) => color.toUpperCase().startsWith(c.slice(0, 4).toUpperCase()))) {
      return "#1a1a2e";
    }
    return "white";
  }

  // Majority line position as percentage of the bar container
  const majorityPct = majorityLine ? (majorityLine.seats / maxSeats) * 100 : null;

  return (
    <div ref={ref} className="relative">
      {/* Bar rows */}
      <div className="flex flex-col gap-3">
        {partiesWithSeats.map((r, i) => {
          const barPct = (r.seatsWon / maxSeats) * 100;
          const textColor = textColorForBg(r.party.color);

          return (
            <motion.div
              key={r.party.name}
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{
                duration: 0.4,
                delay: i * 0.08,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              {/* Party label */}
              <div className="w-24 shrink-0 text-right sm:w-32">
                <span className="text-xs font-medium text-slate-400 sm:text-sm">
                  {r.party.shortName || r.party.name}
                </span>
              </div>

              {/* Bar container */}
              <div className="relative flex-1">
                <motion.div
                  className="flex h-8 items-center rounded-md px-3 sm:h-9"
                  style={{
                    backgroundColor: r.party.color || "#6B7280",
                    color: textColor,
                    minWidth: "2px",
                  }}
                  initial={{ width: "0%" }}
                  animate={isInView ? { width: `${barPct}%` } : { width: "0%" }}
                  transition={{
                    duration: 1.0,
                    delay: i * 0.08 + 0.2,
                    type: "spring",
                    stiffness: 60,
                    damping: 12,
                  }}
                >
                  <motion.span
                    className="whitespace-nowrap text-xs font-bold sm:text-sm"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: i * 0.08 + 0.6 }}
                  >
                    {r.seatsWon}
                  </motion.span>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Majority line overlay */}
      {majorityLine && majorityPct != null && (
        <div
          className="pointer-events-none absolute top-0 bottom-0 z-10"
          style={{
            /* offset for left label column: gap(1rem) + label width */
            left: `calc(${24 * 4 + 16}px + ${majorityPct}% * (100% - ${24 * 4 + 16}px) / 100%)`,
          }}
        >
          {/* We use a simpler positioning with CSS calc relative to bar area */}
        </div>
      )}
    </div>
  );
}

/* ---------- Majority Line (standalone overlay) ---------- */

export function MajorityLineOverlay({
  majoritySeats,
  maxSeats,
  label,
  labelOffset,
}: {
  majoritySeats: number;
  maxSeats: number;
  label: string;
  labelOffset?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const pct = (majoritySeats / maxSeats) * 100;

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0" style={{ left: labelOffset }}>
      <div className="absolute top-0 bottom-0" style={{ left: `${pct}%` }}>
        <motion.div
          className="h-full border-l-2 border-dashed border-amber-400/60"
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          style={{ transformOrigin: "top" }}
        />
        <motion.span
          className="absolute -top-7 left-1 whitespace-nowrap rounded-sm bg-amber-400/20 px-2 py-0.5 text-[10px] font-semibold text-amber-400 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.2 }}
        >
          {label}
        </motion.span>
      </div>
    </div>
  );
}

/* ---------- Coalition Stacked Bar ---------- */

interface CoalitionData {
  ruling: { seats: number; label: string; parties: string };
  opposition: { seats: number; label: string };
  totalSeats: number;
  isMajority: boolean;
}

export function CoalitionStackedBar({ data }: { data: CoalitionData }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  const rulingPct = (data.ruling.seats / data.totalSeats) * 100;
  const oppPct = (data.opposition.seats / data.totalSeats) * 100;

  return (
    <div ref={ref}>
      {/* Stacked bar */}
      <div className="relative flex h-9 w-full overflow-hidden rounded-lg bg-white/5">
        {/* Ruling coalition */}
        <motion.div
          className="flex items-center justify-center"
          style={{ backgroundColor: "rgba(232, 49, 43, 0.8)" }}
          initial={{ width: "0%" }}
          animate={isInView ? { width: `${rulingPct}%` } : { width: "0%" }}
          transition={{
            duration: 1.0,
            delay: 0.2,
            type: "spring",
            stiffness: 60,
            damping: 12,
          }}
        >
          <span className="whitespace-nowrap text-xs font-semibold text-white">
            {data.ruling.label}
          </span>
        </motion.div>

        {/* Opposition */}
        <motion.div
          className="flex items-center justify-center"
          style={{ backgroundColor: "rgba(30, 136, 229, 0.6)" }}
          initial={{ width: "0%" }}
          animate={isInView ? { width: `${oppPct}%` } : { width: "0%" }}
          transition={{
            duration: 1.0,
            delay: 0.4,
            type: "spring",
            stiffness: 60,
            damping: 12,
          }}
        >
          <span className="whitespace-nowrap text-xs font-semibold text-white">
            {data.opposition.label}
          </span>
        </motion.div>
      </div>

      {/* Summary text */}
      <motion.div
        className="mt-3 space-y-1"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.8 }}
      >
        <p className="text-sm font-medium text-amber-400">
          {data.isMajority ? "与党過半数" : "少数与党（過半数割れ）"}
        </p>
        <p className="text-xs text-slate-500">
          {data.ruling.parties} = {data.ruling.seats} / {data.totalSeats}
        </p>
      </motion.div>
    </div>
  );
}

/* ---------- Election Selector ---------- */

export function ElectionSelector({
  elections,
  selectedId,
  onSelect,
}: {
  elections: { id: string; name: string; chamber: string; date: string }[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {elections.map((e) => {
        const isSelected = e.id === selectedId;
        return (
          <button
            key={e.id}
            type="button"
            onClick={() => onSelect(e.id)}
            className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
              isSelected
                ? "bg-white/10 text-white shadow-lg shadow-white/5"
                : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
            }`}
          >
            {isSelected && (
              <motion.div
                layoutId="election-selector-pill"
                className="absolute inset-0 rounded-lg border border-white/10 bg-white/10"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">{e.name}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Legacy SeatBar (backward compat for detail pages) ---------- */

export function SeatBar({
  results,
  totalSeats,
  majorityLine,
  height = "h-12",
}: {
  results: PartyResult[];
  totalSeats: number;
  majorityLine?: { seats: number; label: string };
  height?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref}>
      {/* Stacked bar with spring animation */}
      <div className="relative">
        <div className={`flex ${height} w-full overflow-hidden rounded-lg`}>
          {results.map((r, i) => (
            <motion.div
              key={i}
              className="flex items-center justify-center text-xs font-bold text-white"
              style={{
                backgroundColor: r.party.color || "#6B7280",
                minWidth: r.seatsWon > 0 ? "2px" : "0",
              }}
              initial={{ width: "0%" }}
              animate={
                isInView ? { width: `${(r.seatsWon / totalSeats) * 100}%` } : { width: "0%" }
              }
              transition={{
                duration: 0.8,
                delay: i * 0.06,
                type: "spring",
                stiffness: 60,
                damping: 15,
              }}
              title={`${r.party.name}: ${r.seatsWon}議席`}
            >
              {r.seatsWon >= totalSeats * 0.05 ? (
                <span className="truncate px-1">
                  {r.party.shortName || r.party.name} {r.seatsWon}
                </span>
              ) : null}
            </motion.div>
          ))}
        </div>
        {/* Majority line with draw-in animation */}
        {majorityLine && (
          <div
            className="absolute top-0 bottom-0 z-10 flex flex-col items-center"
            style={{ left: `${(majorityLine.seats / totalSeats) * 100}%` }}
          >
            <motion.div
              className="h-full border-l-2 border-dashed border-gray-800/70"
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              style={{ transformOrigin: "top" }}
            />
            <motion.span
              className="absolute -top-6 whitespace-nowrap rounded bg-gray-800 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8 }}
            >
              {majorityLine.label}
            </motion.span>
          </div>
        )}
      </div>
      {/* Legend with fade-in */}
      <motion.div
        className="mt-3 flex flex-wrap gap-2"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.6 }}
      >
        {results
          .filter((r) => r.seatsWon > 0)
          .map((r, i) => (
            <span key={i} className="inline-flex items-center gap-1 text-xs">
              <span
                className="inline-block h-3 w-3 rounded-sm"
                style={{ backgroundColor: r.party.color || "#6B7280" }}
              />
              {r.party.shortName || r.party.name} {r.seatsWon}
            </span>
          ))}
      </motion.div>
    </div>
  );
}
