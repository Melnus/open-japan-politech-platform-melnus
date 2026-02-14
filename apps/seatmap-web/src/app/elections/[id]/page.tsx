import { prisma } from "@ojpp/db";
import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SeatBar } from "../../seat-bar";

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
  date: Date;
  totalSeats: number;
  districtSeats: number | null;
  proportionalSeats: number | null;
  turnout: number | null;
  results: PartyResult[];
}

/* ---------- Data fetching (direct DB) ---------- */

async function getElection(id: string): Promise<ElectionData | null> {
  noStore();
  const election = await prisma.election.findUnique({
    where: { id },
    include: {
      results: {
        include: { party: true },
        orderBy: { seatsWon: "desc" },
      },
    },
  });
  return election as unknown as ElectionData | null;
}

/* ---------- Helpers ---------- */

function chamberLabel(chamber: string): string {
  return chamber === "HOUSE_OF_REPRESENTATIVES" ? "衆議院" : "参議院";
}

function formatDate(dateStr: string | Date): string {
  const d = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

function getMajorityLine(_chamber: string, totalSeats: number) {
  const majority = Math.floor(totalSeats / 2) + 1;
  return { seats: majority, label: `過半数 ${majority}` };
}

function formatVotes(votes: bigint | string | null): string {
  if (votes == null) return "-";
  const n = typeof votes === "bigint" ? Number(votes) : Number(votes);
  if (isNaN(n)) return String(votes);
  return new Intl.NumberFormat("ja-JP").format(n);
}

/* ---------- Dynamic Metadata ---------- */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const election = await getElection(id);
  if (!election) {
    return { title: "選挙が見つかりません - SeatMap" };
  }
  return {
    title: `${election.name} - SeatMap`,
    description: `${election.name}（${chamberLabel(election.chamber)}）の議席構成。${formatDate(election.date)}投開票、定数${election.totalSeats}議席。`,
  };
}

/* ---------- Page ---------- */

export default async function ElectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const election = await getElection(id);

  if (!election) {
    notFound();
  }

  const totalWon = election.results.reduce((s, r) => s + r.seatsWon, 0);
  const majorityLine = getMajorityLine(election.chamber, election.totalSeats);

  // Determine the top party
  const topParty = election.results[0];

  // Parties with seats vs without
  const partiesWithSeats = election.results.filter((r) => r.seatsWon > 0);
  const partiesWithoutSeats = election.results.filter((r) => r.seatsWon === 0);

  return (
    <div>
      {/* Hero header - dark theme */}
      <div className="border-b border-white/[0.06] bg-gradient-to-b from-red-950/20 to-transparent px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="rounded-full border border-white/10 px-4 py-1.5 text-sm text-slate-400 backdrop-blur transition-colors hover:bg-white/5 hover:text-white"
            >
              &larr; トップ
            </Link>
            <Link
              href="/elections"
              className="rounded-full border border-white/10 px-4 py-1.5 text-sm text-slate-400 backdrop-blur transition-colors hover:bg-white/5 hover:text-white"
            >
              選挙一覧
            </Link>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {election.name}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {chamberLabel(election.chamber)} | {formatDate(election.date)} 投開票
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Stats grid */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">院</p>
            <p className="mt-1 text-lg font-bold text-white">{chamberLabel(election.chamber)}</p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">総定数</p>
            <p className="mt-1 text-lg font-bold tabular-nums text-white">
              {election.totalSeats}議席
            </p>
          </div>
          {election.districtSeats != null && (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
              <p className="text-[10px] uppercase tracking-wider text-slate-500">選挙区</p>
              <p className="mt-1 text-lg font-bold tabular-nums text-white">
                {election.districtSeats}議席
              </p>
            </div>
          )}
          {election.proportionalSeats != null && (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
              <p className="text-[10px] uppercase tracking-wider text-slate-500">比例代表</p>
              <p className="mt-1 text-lg font-bold tabular-nums text-white">
                {election.proportionalSeats}議席
              </p>
            </div>
          )}
          {election.turnout != null && (
            <div className="rounded-xl border border-amber-500/10 bg-amber-500/5 p-4">
              <p className="text-[10px] uppercase tracking-wider text-amber-500">投票率</p>
              <p className="mt-1 text-lg font-bold tabular-nums text-amber-400">
                {election.turnout.toFixed(2)}%
              </p>
            </div>
          )}
        </div>

        {/* Seat bar (large) */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
          <h2 className="mb-1 text-base font-semibold text-white">議席構成</h2>
          <p className="mb-5 text-sm text-slate-500">
            各政党の獲得議席数を横棒で表示。過半数ラインは {majorityLine.seats} 議席。
          </p>
          <div className="pt-6">
            <SeatBar
              results={election.results}
              totalSeats={election.totalSeats}
              majorityLine={majorityLine}
              height="h-16"
            />
          </div>
          {topParty && (
            <p className="mt-4 text-sm text-slate-400">
              第一党:{" "}
              <span className="font-bold" style={{ color: topParty.party.color ?? undefined }}>
                {topParty.party.name}
              </span>{" "}
              ({topParty.seatsWon}議席 /{" "}
              {((topParty.seatsWon / election.totalSeats) * 100).toFixed(1)}%)
              {topParty.seatsWon >= majorityLine.seats ? (
                <span className="ml-2 rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-400">
                  単独過半数
                </span>
              ) : (
                <span className="ml-2 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-400">
                  過半数未達
                </span>
              )}
            </p>
          )}
        </div>

        {/* Detailed results table */}
        <div className="mt-8 overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02]">
          <div className="border-b border-white/[0.06] px-6 py-4">
            <h2 className="text-base font-semibold text-white">政党別獲得議席</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] text-xs text-slate-500">
                  <th className="px-6 py-3 font-medium">順位</th>
                  <th className="px-6 py-3 font-medium">政党</th>
                  <th className="px-6 py-3 text-right font-medium">獲得議席</th>
                  {election.districtSeats != null && (
                    <th className="px-6 py-3 text-right font-medium">選挙区</th>
                  )}
                  {election.proportionalSeats != null && (
                    <th className="px-6 py-3 text-right font-medium">比例</th>
                  )}
                  <th className="px-6 py-3 text-right font-medium">議席率</th>
                  <th className="px-6 py-3 text-right font-medium">得票数</th>
                  {election.results.some((r) => r.voteShare != null) && (
                    <th className="px-6 py-3 text-right font-medium">得票率</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {partiesWithSeats.map((r, idx) => {
                  const seatPct = ((r.seatsWon / election.totalSeats) * 100).toFixed(1);
                  return (
                    <tr
                      key={r.id}
                      className="border-b border-white/[0.04] transition-colors last:border-0 hover:bg-white/[0.03]"
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
                      <td className="px-6 py-3 text-right tabular-nums text-slate-400">
                        {seatPct}%
                      </td>
                      <td className="px-6 py-3 text-right tabular-nums text-slate-400">
                        {formatVotes(r.totalVotes)}
                      </td>
                      {election.results.some((rr) => rr.voteShare != null) && (
                        <td className="px-6 py-3 text-right tabular-nums text-slate-400">
                          {r.voteShare != null ? `${r.voteShare.toFixed(2)}%` : "-"}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t border-white/[0.06] font-medium">
                  <td className="px-6 py-3" />
                  <td className="px-6 py-3 text-slate-400">合計</td>
                  <td className="px-6 py-3 text-right font-bold tabular-nums text-white">
                    {totalWon}
                  </td>
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
                  <td className="px-6 py-3" />
                  {election.results.some((rr) => rr.voteShare != null) && (
                    <td className="px-6 py-3" />
                  )}
                </tr>
              </tfoot>
            </table>
          </div>

          {totalWon < election.totalSeats && (
            <div className="border-t border-white/[0.04] px-6 py-3">
              <p className="text-xs text-slate-600">
                ※ 表示議席合計 {totalWon} / 定数 {election.totalSeats}
                （欠員・諸派を含まない場合があります）
              </p>
            </div>
          )}
        </div>

        {/* Parties without seats (if any) */}
        {partiesWithoutSeats.length > 0 && (
          <div className="mt-8 rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
            <h2 className="mb-3 text-base font-semibold text-white">議席を獲得しなかった政党</h2>
            <div className="flex flex-wrap gap-2">
              {partiesWithoutSeats.map((r) => (
                <span
                  key={r.id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] px-3 py-1 text-xs text-slate-400"
                >
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-sm"
                    style={{ backgroundColor: r.party.color ?? "#6B7280" }}
                  />
                  {r.party.name}
                  {r.voteShare != null && (
                    <span className="text-slate-600">({r.voteShare.toFixed(2)}%)</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Mini seat composition visual card */}
        <div className="mt-8 rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
          <h2 className="mb-4 text-base font-semibold text-white">議席構成の内訳</h2>
          <div className="space-y-3">
            {partiesWithSeats.map((r) => {
              const pct = (r.seatsWon / election.totalSeats) * 100;
              return (
                <div key={r.id} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 truncate text-right text-sm font-medium text-slate-400 sm:w-36">
                    {r.party.shortName || r.party.name}
                  </span>
                  <div className="flex-1">
                    <div className="h-5 w-full overflow-hidden rounded bg-white/[0.05]">
                      <div
                        className="h-full rounded transition-all"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: r.party.color ?? "#6B7280",
                          minWidth: "2px",
                        }}
                      />
                    </div>
                  </div>
                  <span className="w-20 text-right text-sm tabular-nums text-slate-300">
                    {r.seatsWon} <span className="text-xs text-slate-600">({pct.toFixed(1)}%)</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1 rounded-lg border border-white/[0.08] px-4 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-white/[0.05] hover:text-white"
          >
            &larr; トップに戻る
          </Link>
          <Link
            href="/elections"
            className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-red-600 to-red-500 px-4 py-2 text-sm font-bold text-white transition-all hover:shadow-lg hover:shadow-red-500/20"
          >
            選挙一覧を見る &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
