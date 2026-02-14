import { prisma } from "@ojpp/db";
import { unstable_noStore as noStore } from "next/cache";
import { SeatChartView } from "./seat-chart-view";

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
  noStore();
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

/* ---------- Serialize for client ---------- */

function serializeElection(e: ElectionData) {
  return {
    ...e,
    date: e.date instanceof Date ? e.date.toISOString() : String(e.date),
    results: e.results.map((r) => ({
      ...r,
      totalVotes: r.totalVotes != null ? String(r.totalVotes) : null,
    })),
  };
}

/* ---------- Main Page ---------- */

export default async function Home() {
  let elections: ElectionData[] = [];
  let fetchError: string | null = null;
  try {
    elections = await getElections();
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[SeatMap] Failed to fetch elections:", msg);
    fetchError = msg;
  }

  /* --- Empty / Error state --- */
  if (elections.length === 0) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="mx-auto max-w-lg rounded-xl border border-white/[0.06] bg-white/[0.03] p-8 text-center">
          {fetchError ? (
            <>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                <svg
                  className="h-6 w-6 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <p className="font-medium text-red-400">データベース接続エラー</p>
              <p className="mt-2 text-sm text-slate-500">
                PostgreSQLに接続できませんでした。Supabaseコンテナが起動しているか確認してください。
              </p>
              <code className="mt-3 inline-block rounded-lg bg-red-500/10 px-4 py-2 text-xs font-mono text-red-300">
                {fetchError}
              </code>
            </>
          ) : (
            <>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-700/50">
                <svg
                  className="h-6 w-6 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <p className="text-slate-300">選挙データがまだ投入されていません。</p>
              <code className="mt-3 inline-block rounded-lg bg-white/[0.05] px-4 py-2 text-xs font-mono text-slate-400">
                pnpm ingest:elections
              </code>
              <p className="mt-2 text-xs text-slate-600">
                を実行して選挙データを投入してください。
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  /* --- Serialize and pass to client --- */
  const serialized = elections.map(serializeElection);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      <SeatChartView elections={serialized as never} />
    </div>
  );
}
