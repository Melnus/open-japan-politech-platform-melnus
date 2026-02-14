import { prisma } from "@ojpp/db";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

function chamberLabel(chamber: string): string {
  return chamber === "HOUSE_OF_REPRESENTATIVES" ? "衆議院" : "参議院";
}

function formatDate(date: Date): string {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

export default async function ElectionsPage() {
  noStore();
  let elections: {
    id: string;
    name: string;
    chamber: string;
    date: Date;
    totalSeats: number;
    turnout: number | null;
    _count: { results: number };
  }[] = [];

  try {
    elections = await prisma.election.findMany({
      orderBy: { date: "desc" },
      include: {
        _count: { select: { results: true } },
      },
    });
  } catch {
    // DB not available
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold text-white">選挙別推移</h1>

      {elections.length === 0 ? (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-8 text-center">
          <p className="text-slate-400">
            選挙データがまだありません。
            <br />
            <code className="mt-2 inline-block rounded-lg bg-white/[0.05] px-3 py-1 text-xs font-mono text-slate-500">
              pnpm ingest:elections
            </code>{" "}
            を実行してデータを投入してください。
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/[0.06]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/[0.06] bg-white/[0.02]">
              <tr>
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                  選挙名
                </th>
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                  院
                </th>
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                  投票日
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                  総定数
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                  投票率
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                  政党数
                </th>
              </tr>
            </thead>
            <tbody>
              {elections.map((election) => (
                <tr
                  key={election.id}
                  className="border-b border-white/[0.04] transition-colors last:border-0 hover:bg-white/[0.03]"
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/elections/${election.id}`}
                      className="font-medium text-red-400 transition-colors hover:text-red-300 hover:underline"
                    >
                      {election.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-0.5 text-xs font-medium text-slate-300">
                      {chamberLabel(election.chamber)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{formatDate(election.date)}</td>
                  <td className="px-6 py-4 text-right tabular-nums text-slate-300">
                    {election.totalSeats}
                  </td>
                  <td className="px-6 py-4 text-right tabular-nums text-slate-400">
                    {election.turnout != null ? `${election.turnout.toFixed(2)}%` : "-"}
                  </td>
                  <td className="px-6 py-4 text-right tabular-nums text-slate-400">
                    {election._count.results}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
