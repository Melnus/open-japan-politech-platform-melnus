import { prisma } from "@ojpp/db";
import { FadeIn, StaggerGrid, StaggerItem } from "@ojpp/ui";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";

/* ---------- Types ---------- */

interface StanceData {
  id: string;
  topic: string;
  stance: string;
  summary: string;
  manifesto: string | null;
  year: number;
  party: {
    id: string;
    name: string;
    shortName: string | null;
    color: string | null;
  };
}

/* ---------- Helpers ---------- */

function stanceStyle(stance: string) {
  const lower = stance.toLowerCase();
  if (lower.includes("賛成") || lower.includes("推進") || lower.includes("積極")) {
    return {
      bg: "bg-green-500/15",
      text: "text-green-400",
      dot: "bg-green-400",
      heatColor: "rgba(34, 197, 94, 0.3)",
    };
  }
  if (lower.includes("反対") || lower.includes("慎重") || lower.includes("消極")) {
    return {
      bg: "bg-red-500/15",
      text: "text-red-400",
      dot: "bg-red-400",
      heatColor: "rgba(239, 68, 68, 0.3)",
    };
  }
  if (lower.includes("条件") || lower.includes("一部")) {
    return {
      bg: "bg-yellow-500/15",
      text: "text-yellow-400",
      dot: "bg-yellow-400",
      heatColor: "rgba(234, 179, 8, 0.3)",
    };
  }
  return {
    bg: "bg-zinc-500/15",
    text: "text-zinc-400",
    dot: "bg-zinc-400",
    heatColor: "rgba(113, 113, 122, 0.3)",
  };
}

/* ---------- Data fetching ---------- */

async function getStances() {
  noStore();
  const stances = await prisma.culturalStance.findMany({
    include: {
      party: {
        select: { id: true, name: true, shortName: true, color: true },
      },
    },
    orderBy: [{ year: "desc" }, { topic: "asc" }],
  });
  return stances as unknown as StanceData[];
}

/* ---------- Page ---------- */

export default async function ComparePage() {
  let stances: StanceData[] = [];
  let fetchError: string | null = null;

  try {
    stances = await getStances();
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[CultureScope] Failed to fetch stances:", msg);
    fetchError = msg;
  }

  /* Group by party */
  const partyMap = new Map<string, { party: StanceData["party"]; stances: StanceData[] }>();
  for (const s of stances) {
    const existing = partyMap.get(s.party.id);
    if (existing) {
      existing.stances.push(s);
    } else {
      partyMap.set(s.party.id, { party: s.party, stances: [s] });
    }
  }
  const parties = [...partyMap.values()];

  /* Group by topic for cross-comparison */
  const topics = [...new Set(stances.map((s) => s.topic))];

  if (stances.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20">
        <FadeIn>
          <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-white">
            政党別文化政策比較
          </h1>
          <p className="mb-8 text-zinc-400">
            各政党のマニフェストから文化政策に関するスタンスを横断的に比較
          </p>
        </FadeIn>
        <div className="glass-card p-8">
          {fetchError ? (
            <div className="text-center">
              <p className="text-red-400 font-medium">データベース接続エラー</p>
              <code className="mt-3 inline-block rounded-lg bg-red-950/50 border border-red-900/30 px-4 py-2 text-xs font-mono text-red-400">
                {fetchError}
              </code>
            </div>
          ) : (
            <p className="text-center text-zinc-500">
              政党別文化政策スタンスデータがまだ投入されていません。
              <br />
              <code className="mt-2 inline-block rounded-lg bg-amber-950/40 border border-amber-800/20 px-3 py-1 text-xs font-mono text-amber-400">
                pnpm ingest:culture
              </code>{" "}
              を実行してデータを投入してください。
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-8 pt-12">
        <div className="absolute -top-20 left-1/3 h-40 w-80 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <FadeIn>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              政党別文化政策比較
            </h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="mt-3 text-base text-zinc-400">
              各政党のマニフェストから文化政策に関するスタンスを横断的に比較
            </p>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-zinc-500">
              <span>政党数: {parties.length}</span>
              <span>トピック数: {topics.length}</span>
              <span>スタンス数: {stances.length}件</span>
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 pb-16">
        {/* ====== Heatmap Cross-Topic Comparison ====== */}
        {topics.length > 0 && parties.length > 1 && (
          <section className="mb-12">
            <FadeIn>
              <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-white">
                <span className="inline-block h-5 w-1 rounded-full bg-amber-500" />
                トピック横断ヒートマップ
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="px-5 py-4 text-xs font-medium text-zinc-500 min-w-[160px]">
                          トピック
                        </th>
                        {parties.map(({ party }) => (
                          <th key={party.id} className="px-3 py-4 text-center min-w-[120px]">
                            <div className="flex flex-col items-center gap-2">
                              <div
                                className="h-3.5 w-3.5 rounded-full ring-2 ring-white/10"
                                style={{ backgroundColor: party.color ?? "#6B7280" }}
                              />
                              <span className="text-xs font-medium text-zinc-300">
                                {party.shortName ?? party.name}
                              </span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {topics.map((topic) => (
                        <tr
                          key={topic}
                          className="border-b border-white/5 last:border-0 transition-colors hover:bg-white/[0.02]"
                        >
                          <td className="px-5 py-4 font-medium text-zinc-300">{topic}</td>
                          {parties.map(({ party, stances: partyStances }) => {
                            const topicStance = partyStances.find((s) => s.topic === topic);
                            if (!topicStance) {
                              return (
                                <td key={party.id} className="px-3 py-4 text-center">
                                  <span className="text-xs text-zinc-600">---</span>
                                </td>
                              );
                            }
                            const style = stanceStyle(topicStance.stance);
                            return (
                              <td
                                key={party.id}
                                className="px-3 py-4 text-center"
                                style={{ background: style.heatColor }}
                              >
                                <div className="flex flex-col items-center gap-1">
                                  <span
                                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${style.bg} ${style.text}`}
                                  >
                                    <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                                    {topicStance.stance}
                                  </span>
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Legend */}
                <div className="border-t border-white/5 px-5 py-3 flex flex-wrap gap-4 text-xs text-zinc-500">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-green-400" />
                    推進・賛成
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-yellow-400" />
                    条件付き
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-red-400" />
                    慎重・反対
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-zinc-400" />
                    その他
                  </span>
                </div>
              </div>
            </FadeIn>
          </section>
        )}

        {/* ====== Party Cards ====== */}
        <section className="mb-12">
          <FadeIn>
            <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-white">
              <span className="inline-block h-5 w-1 rounded-full bg-amber-500" />
              政党別スタンス詳細
            </h2>
          </FadeIn>

          <StaggerGrid className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {parties.map(({ party, stances: partyStances }) => (
              <StaggerItem key={party.id}>
                <div className="glass-card overflow-hidden">
                  {/* Party Header */}
                  <div className="flex items-center gap-3 border-b border-white/5 px-6 py-4">
                    <div
                      className="h-4 w-4 rounded-full ring-2 ring-white/10"
                      style={{ backgroundColor: party.color ?? "#6B7280" }}
                    />
                    <h3 className="text-lg font-bold text-white">{party.name}</h3>
                    {party.shortName && (
                      <span className="text-sm text-zinc-500">({party.shortName})</span>
                    )}
                  </div>

                  {/* Stance list */}
                  <div className="divide-y divide-white/5">
                    {partyStances.map((s) => {
                      const style = stanceStyle(s.stance);
                      return (
                        <div
                          key={s.id}
                          className="px-6 py-4 transition-colors hover:bg-white/[0.02]"
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm font-medium text-zinc-200">{s.topic}</span>
                            <div className="flex items-center gap-2">
                              <span
                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${style.bg} ${style.text}`}
                              >
                                <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                                {s.stance}
                              </span>
                              <span className="text-[10px] text-zinc-600">{s.year}年</span>
                            </div>
                          </div>
                          <p className="text-sm leading-relaxed text-zinc-400">{s.summary}</p>
                          {s.manifesto && (
                            <p className="mt-2 border-l-2 border-amber-500/30 pl-3 text-xs italic leading-relaxed text-zinc-500">
                              {s.manifesto}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </section>
      </div>
    </div>
  );
}
