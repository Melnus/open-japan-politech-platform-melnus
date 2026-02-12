import { prisma } from "@ojpp/db";
import { Card, HeroSection } from "@ojpp/ui";
import Link from "next/link";
import { SeatBar } from "./seat-bar";

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

async function getElections(): Promise<ElectionData[]> {
  const elections = await prisma.election.findMany({
    include: {
      results: {
        include: { party: true },
        orderBy: { seatsWon: "desc" },
      },
    },
    orderBy: { date: "desc" },
  });
  return elections as unknown as ElectionData[];
}

/* ---------- Helpers ---------- */

function chamberLabel(chamber: string): string {
  return chamber === "HOUSE_OF_REPRESENTATIVES" ? "衆議院" : "参議院";
}

function chamberBadgeColor(chamber: string): string {
  return chamber === "HOUSE_OF_REPRESENTATIVES"
    ? "bg-orange-100 text-orange-800"
    : "bg-blue-100 text-blue-800";
}

function formatDate(dateStr: string | Date): string {
  const d = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

function getMajorityLine(chamber: string, totalSeats: number) {
  const majority = Math.floor(totalSeats / 2) + 1;
  return { seats: majority, label: `過半数 ${majority}` };
}

/* ---------- Hero Election Card (latest elections) ---------- */

function HeroElectionCard({
  election,
  label,
}: {
  election: ElectionData;
  label: string;
}) {
  const totalWon = election.results.reduce((s, r) => s + r.seatsWon, 0);
  const majorityLine = getMajorityLine(election.chamber, election.totalSeats);

  return (
    <Card padding="lg" animate>
      {/* Header */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="mb-1 inline-block rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-3 py-0.5 text-xs font-bold text-white">
            {label}
          </span>
          <h3 className="mt-1 text-2xl font-bold tracking-tight">
            <Link
              href={`/elections/${election.id}`}
              className="hover:text-orange-600 transition-colors"
            >
              {election.name}
            </Link>
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${chamberBadgeColor(election.chamber)}`}
          >
            {chamberLabel(election.chamber)}
          </span>
          <span className="text-sm text-gray-500">{formatDate(election.date)}</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg bg-gray-50 p-3 text-center">
          <p className="text-xs text-gray-500">総定数</p>
          <p className="text-xl font-bold text-gray-900">{election.totalSeats}</p>
        </div>
        {election.districtSeats != null && (
          <div className="rounded-lg bg-gray-50 p-3 text-center">
            <p className="text-xs text-gray-500">選挙区</p>
            <p className="text-xl font-bold text-gray-900">{election.districtSeats}</p>
          </div>
        )}
        {election.proportionalSeats != null && (
          <div className="rounded-lg bg-gray-50 p-3 text-center">
            <p className="text-xs text-gray-500">比例代表</p>
            <p className="text-xl font-bold text-gray-900">{election.proportionalSeats}</p>
          </div>
        )}
        {election.turnout != null && (
          <div className="rounded-lg bg-orange-50 p-3 text-center">
            <p className="text-xs text-orange-600">投票率</p>
            <p className="text-xl font-bold text-orange-700">{election.turnout.toFixed(2)}%</p>
          </div>
        )}
      </div>

      {/* Seat bar — with majority line */}
      <div className="pt-6">
        <SeatBar
          results={election.results}
          totalSeats={election.totalSeats}
          majorityLine={majorityLine}
          height="h-14"
        />
      </div>

      {/* Detailed party table */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b text-xs text-gray-500">
              <th className="pb-2 pr-4 font-medium">順位</th>
              <th className="pb-2 pr-4 font-medium">政党</th>
              <th className="pb-2 pr-4 text-right font-medium">獲得議席</th>
              {election.districtSeats != null && (
                <th className="pb-2 pr-4 text-right font-medium">選挙区</th>
              )}
              {election.proportionalSeats != null && (
                <th className="pb-2 pr-4 text-right font-medium">比例</th>
              )}
              <th className="pb-2 text-right font-medium">議席率</th>
            </tr>
          </thead>
          <tbody>
            {election.results
              .filter((r) => r.seatsWon > 0)
              .map((r, idx) => {
                const seatPct = ((r.seatsWon / election.totalSeats) * 100).toFixed(1);
                return (
                  <tr
                    key={r.id}
                    className="border-b last:border-0 transition-colors hover:bg-orange-50/40"
                  >
                    <td className="py-2 pr-4 text-gray-400">{idx + 1}</td>
                    <td className="py-2 pr-4">
                      <span className="inline-flex items-center gap-2">
                        <span
                          className="inline-block h-3 w-3 rounded-sm"
                          style={{ backgroundColor: r.party.color ?? "#6B7280" }}
                        />
                        <span className="font-medium">{r.party.name}</span>
                        {r.party.shortName && (
                          <span className="text-xs text-gray-400">({r.party.shortName})</span>
                        )}
                      </span>
                    </td>
                    <td className="py-2 pr-4 text-right font-bold">{r.seatsWon}</td>
                    {election.districtSeats != null && (
                      <td className="py-2 pr-4 text-right text-gray-600">
                        {r.districtSeats ?? "-"}
                      </td>
                    )}
                    {election.proportionalSeats != null && (
                      <td className="py-2 pr-4 text-right text-gray-600">
                        {r.proportionalSeats ?? "-"}
                      </td>
                    )}
                    <td className="py-2 text-right text-gray-600">{seatPct}%</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {totalWon < election.totalSeats && (
        <p className="mt-3 text-xs text-gray-400">
          ※ 表示議席合計 {totalWon} / 定数 {election.totalSeats}
          （欠員・諸派を含まない場合があります）
        </p>
      )}

      {/* Detail link */}
      <div className="mt-4 text-right">
        <Link
          href={`/elections/${election.id}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
        >
          詳細を見る
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </Card>
  );
}

/* ---------- Historical Timeline Card (compact) ---------- */

function TimelineElectionCard({ election }: { election: ElectionData }) {
  const totalWon = election.results.reduce((s, r) => s + r.seatsWon, 0);
  const majorityLine = getMajorityLine(election.chamber, election.totalSeats);

  return (
    <div className="group relative border-l-4 border-orange-200 pl-6 pb-8 last:pb-0 transition-colors hover:border-orange-400">
      {/* Timeline dot */}
      <div className="absolute -left-[10px] top-0 h-4 w-4 rounded-full border-2 border-orange-300 bg-white group-hover:border-orange-500 group-hover:bg-orange-50 transition-all" />

      <Card hover>
        <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <h4 className="font-bold">
            <Link
              href={`/elections/${election.id}`}
              className="hover:text-orange-600 transition-colors"
            >
              {election.name}
            </Link>
          </h4>
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${chamberBadgeColor(election.chamber)}`}
            >
              {chamberLabel(election.chamber)}
            </span>
            <span className="text-xs text-gray-500">{formatDate(election.date)}</span>
            {election.turnout != null && (
              <span className="text-xs text-gray-400">投票率 {election.turnout.toFixed(1)}%</span>
            )}
          </div>
        </div>

        <SeatBar
          results={election.results}
          totalSeats={election.totalSeats}
          majorityLine={majorityLine}
          height="h-8"
        />

        {totalWon < election.totalSeats && (
          <p className="mt-2 text-xs text-gray-400">
            議席合計 {totalWon} / 定数 {election.totalSeats}
          </p>
        )}
      </Card>
    </div>
  );
}

/* ---------- Main Page ---------- */

export default async function Home() {
  let elections: ElectionData[] = [];
  try {
    elections = await getElections();
  } catch {
    // Fallback to empty state
  }

  /* --- Empty state --- */
  if (elections.length === 0) {
    return (
      <div>
        <HeroSection
          title="議席勢力図"
          subtitle="衆議院・参議院の議席構成を一目で把握し、政治勢力の変遷を可視化する"
          gradientFrom="from-orange-500"
          gradientTo="to-red-600"
        />
        <div className="mx-auto max-w-7xl px-6 py-12">
          <Card>
            <p className="text-center text-gray-500">
              データを読み込み中です。
              <br />
              <code className="mt-1 inline-block rounded bg-gray-100 px-2 py-1 text-xs font-mono">
                pnpm ingest:elections
              </code>{" "}
              を実行して選挙データを投入してください。
            </p>
          </Card>
        </div>
      </div>
    );
  }

  /* --- Find latest elections --- */
  const hrElections = elections
    .filter((e) => e.chamber === "HOUSE_OF_REPRESENTATIVES")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const hcElections = elections
    .filter((e) => e.chamber === "HOUSE_OF_COUNCILLORS")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const latestHR = hrElections[0] ?? null;
  const latestHC = hcElections[0] ?? null;

  // All elections that are NOT the two hero cards, sorted newest first
  const heroIds = new Set<string>();
  if (latestHR) heroIds.add(latestHR.id);
  if (latestHC) heroIds.add(latestHC.id);
  const historicalElections = elections
    .filter((e) => !heroIds.has(e.id))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div>
      <HeroSection
        title="議席勢力図"
        subtitle="衆議院・参議院の議席構成を一目で把握し、政治勢力の変遷を可視化する"
        gradientFrom="from-orange-500"
        gradientTo="to-red-600"
      >
        <div className="flex flex-wrap gap-4 text-sm text-white/70">
          <span>選挙データ: {elections.length}件</span>
          <span>衆議院: {hrElections.length}件</span>
          <span>参議院: {hcElections.length}件</span>
        </div>
      </HeroSection>

      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* ====== Latest 衆議院 (Hero) ====== */}
        {latestHR && (
          <section className="mb-10">
            <HeroElectionCard election={latestHR} label="最新の選挙結果 -- 衆議院" />
          </section>
        )}

        {/* ====== Latest 参議院 (Hero) ====== */}
        {latestHC && (
          <section className="mb-10">
            <HeroElectionCard election={latestHC} label="最新の選挙結果 -- 参議院" />
          </section>
        )}

        {/* ====== Historical Timeline ====== */}
        {historicalElections.length > 0 && (
          <section className="mt-4">
            <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold">
              <span className="inline-block h-6 w-1 rounded-full bg-gradient-to-b from-orange-500 to-red-500" />
              過去の選挙結果
            </h2>
            <div className="ml-2">
              {historicalElections.map((e) => (
                <TimelineElectionCard key={e.id} election={e} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
