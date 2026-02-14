"use client";

import { AnimatePresence, motion, useInView } from "@ojpp/ui";
import { useRef, useState } from "react";
import { CoalitionStackedBar, SeatBarChart } from "./seat-bar";

/* ---------- Types ---------- */

interface PartyResult {
  id: string;
  seatsWon: number;
  districtSeats: number | null;
  proportionalSeats: number | null;
  totalVotes: bigint | null;
  voteShare: number | null;
  party: {
    id: string;
    name: string;
    shortName: string | null;
    color: string | null;
  };
}

interface ElectionData {
  id: string;
  name: string;
  chamber: "HOUSE_OF_REPRESENTATIVES" | "HOUSE_OF_COUNCILLORS";
  date: string;
  totalSeats: number;
  districtSeats: number | null;
  proportionalSeats: number | null;
  turnout: number | null;
  results: PartyResult[];
}

/* ---------- Helpers ---------- */

function chamberLabel(chamber: string): string {
  return chamber === "HOUSE_OF_REPRESENTATIVES" ? "衆議院" : "参議院";
}

function getMajorityLine(totalSeats: number) {
  const majority = Math.floor(totalSeats / 2) + 1;
  return { seats: majority, label: `過半数 ${majority}` };
}

// Known ruling coalition parties (LDP + Komeito as default)
const RULING_PARTY_NAMES = ["自由民主党", "公明党"];

function computeCoalition(results: PartyResult[], totalSeats: number) {
  let rulingSeats = 0;
  const rulingPartyNames: string[] = [];

  for (const r of results) {
    if (RULING_PARTY_NAMES.some((name) => r.party.name.includes(name))) {
      rulingSeats += r.seatsWon;
      rulingPartyNames.push(`${r.party.shortName || r.party.name}${r.seatsWon}`);
    }
  }

  const totalWon = results.reduce((s, r) => s + r.seatsWon, 0);
  const oppSeats = totalWon - rulingSeats;
  const majority = Math.floor(totalSeats / 2) + 1;

  return {
    ruling: {
      seats: rulingSeats,
      label: `与党 ${rulingSeats}`,
      parties: rulingPartyNames.join(" + "),
    },
    opposition: {
      seats: oppSeats,
      label: `野党 ${oppSeats}`,
    },
    totalSeats,
    isMajority: rulingSeats >= majority,
  };
}

/* ---------- Main View Component ---------- */

export function SeatChartView({ elections }: { elections: ElectionData[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const election = elections[selectedIndex];

  if (!election) return null;

  const majorityLine = getMajorityLine(election.totalSeats);
  const coalition = computeCoalition(election.results, election.totalSeats);
  const totalWon = election.results.reduce((s, r) => s + r.seatsWon, 0);

  return (
    <div className="min-h-screen">
      {/* Election Tabs */}
      {elections.length > 1 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {elections.map((e, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={e.id}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`relative overflow-hidden rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                  isSelected ? "text-white" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="election-tab"
                    className="absolute inset-0 rounded-lg border border-white/10 bg-white/10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{e.name}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Animated election content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={election.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Title Block */}
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {chamberLabel(election.chamber)} 議席構成
            </h1>
            <p className="mt-3 text-sm text-slate-500">
              {election.name}｜定数 {election.totalSeats}
              {election.turnout != null && (
                <span className="ml-3">投票率 {election.turnout.toFixed(2)}%</span>
              )}
            </p>
          </div>

          {/* Main grid: Bars + Coalition panel */}
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* Left: Seat bars */}
            <div className="relative pt-8">
              <SeatBarChart
                results={election.results}
                totalSeats={election.totalSeats}
                majorityLine={majorityLine}
              />

              {totalWon < election.totalSeats && (
                <p className="mt-6 text-xs text-slate-600">
                  ※ 表示議席合計 {totalWon} / 定数 {election.totalSeats}
                  （欠員・諸派を含まない場合があります）
                </p>
              )}
            </div>

            {/* Right: Coalition panel */}
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-6 lg:mt-8">
              <h2 className="mb-5 text-base font-semibold text-white">与野党勢力</h2>
              <CoalitionStackedBar data={coalition} />

              {/* Stats mini grid */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-white/[0.04] p-3">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">総定数</p>
                  <p className="mt-1 text-xl font-bold tabular-nums text-white">
                    {election.totalSeats}
                  </p>
                </div>
                <div className="rounded-lg bg-white/[0.04] p-3">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">過半数</p>
                  <p className="mt-1 text-xl font-bold tabular-nums text-amber-400">
                    {majorityLine.seats}
                  </p>
                </div>
                {election.districtSeats != null && (
                  <div className="rounded-lg bg-white/[0.04] p-3">
                    <p className="text-[10px] uppercase tracking-wider text-slate-500">選挙区</p>
                    <p className="mt-1 text-xl font-bold tabular-nums text-white">
                      {election.districtSeats}
                    </p>
                  </div>
                )}
                {election.proportionalSeats != null && (
                  <div className="rounded-lg bg-white/[0.04] p-3">
                    <p className="text-[10px] uppercase tracking-wider text-slate-500">比例代表</p>
                    <p className="mt-1 text-xl font-bold tabular-nums text-white">
                      {election.proportionalSeats}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Detailed party table */}
          <PartyDetailTable election={election} majorityLine={majorityLine} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ---------- Party Detail Table ---------- */

function PartyDetailTable({
  election,
  majorityLine,
}: {
  election: ElectionData;
  majorityLine: { seats: number; label: string };
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  const partiesWithSeats = election.results.filter((r) => r.seatsWon > 0);
  const totalWon = partiesWithSeats.reduce((s, r) => s + r.seatsWon, 0);

  function formatVotes(votes: bigint | string | null): string {
    if (votes == null) return "-";
    const n = typeof votes === "bigint" ? Number(votes) : Number(votes);
    if (isNaN(n)) return String(votes);
    return new Intl.NumberFormat("ja-JP").format(n);
  }

  return (
    <motion.div
      ref={ref}
      className="mt-10 overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02]"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="border-b border-white/[0.06] px-6 py-4">
        <h2 className="text-base font-semibold text-white">政党別獲得議席</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] text-xs text-slate-500">
              <th className="px-6 py-3 font-medium">#</th>
              <th className="px-6 py-3 font-medium">政党</th>
              <th className="px-6 py-3 text-right font-medium">獲得議席</th>
              {election.districtSeats != null && (
                <th className="px-6 py-3 text-right font-medium">選挙区</th>
              )}
              {election.proportionalSeats != null && (
                <th className="px-6 py-3 text-right font-medium">比例</th>
              )}
              <th className="px-6 py-3 text-right font-medium">議席率</th>
            </tr>
          </thead>
          <tbody>
            {partiesWithSeats.map((r, idx) => {
              const seatPct = ((r.seatsWon / election.totalSeats) * 100).toFixed(1);
              return (
                <motion.tr
                  key={r.id}
                  className="border-b border-white/[0.04] transition-colors hover:bg-white/[0.03]"
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + idx * 0.04 }}
                >
                  <td className="px-6 py-3 tabular-nums text-slate-600">{idx + 1}</td>
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center gap-2">
                      <span
                        className="inline-block h-3 w-3 rounded-sm"
                        style={{ backgroundColor: r.party.color ?? "#6B7280" }}
                      />
                      <span className="font-medium text-slate-200">{r.party.name}</span>
                      {r.party.shortName && (
                        <span className="text-xs text-slate-600">({r.party.shortName})</span>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right font-bold tabular-nums text-white">
                    {r.seatsWon}
                  </td>
                  {election.districtSeats != null && (
                    <td className="px-6 py-3 text-right tabular-nums text-slate-400">
                      {r.districtSeats ?? "-"}
                    </td>
                  )}
                  {election.proportionalSeats != null && (
                    <td className="px-6 py-3 text-right tabular-nums text-slate-400">
                      {r.proportionalSeats ?? "-"}
                    </td>
                  )}
                  <td className="px-6 py-3 text-right tabular-nums text-slate-400">{seatPct}%</td>
                </motion.tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t border-white/[0.06] font-medium">
              <td className="px-6 py-3" />
              <td className="px-6 py-3 text-slate-400">合計</td>
              <td className="px-6 py-3 text-right font-bold tabular-nums text-white">{totalWon}</td>
              {election.districtSeats != null && (
                <td className="px-6 py-3 text-right tabular-nums text-slate-400">
                  {partiesWithSeats.reduce((s, r) => s + (r.districtSeats ?? 0), 0) || "-"}
                </td>
              )}
              {election.proportionalSeats != null && (
                <td className="px-6 py-3 text-right tabular-nums text-slate-400">
                  {partiesWithSeats.reduce((s, r) => s + (r.proportionalSeats ?? 0), 0) || "-"}
                </td>
              )}
              <td className="px-6 py-3 text-right tabular-nums text-slate-400">
                {((totalWon / election.totalSeats) * 100).toFixed(1)}%
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </motion.div>
  );
}
