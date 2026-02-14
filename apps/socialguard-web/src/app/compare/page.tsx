import { prisma } from "@ojpp/db";
import { Badge, FadeIn, StaggerGrid, StaggerItem } from "@ojpp/ui";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";

/* ---------- Types ---------- */

interface StanceRow {
  id: string;
  partyId: string;
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

function stanceBadge(stance: string): {
  variant: "success" | "danger" | "warning" | "info" | "default";
  label: string;
} {
  const s = stance.toLowerCase();
  if (s.includes("賛成") || s.includes("推進") || s.includes("拡充")) {
    return { variant: "success", label: stance };
  }
  if (s.includes("反対") || s.includes("慎重") || s.includes("縮小")) {
    return { variant: "danger", label: stance };
  }
  if (s.includes("条件") || s.includes("一部")) {
    return { variant: "warning", label: stance };
  }
  return { variant: "info", label: stance };
}

/* ---------- Main Page ---------- */

export default async function ComparePage() {
  noStore();

  let stances: StanceRow[] = [];
  try {
    stances = (await prisma.socialSecurityStance.findMany({
      include: { party: true },
      orderBy: [{ year: "desc" }, { topic: "asc" }],
    })) as unknown as StanceRow[];
  } catch {
    // DB not available
  }

  if (stances.length === 0) {
    return (
      <div className="min-h-screen">
        <section className="relative overflow-hidden bg-gradient-to-br from-teal-950 to-slate-950 py-16 pb-20">
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />
          <div className="relative mx-auto max-w-7xl px-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              政党比較
            </h1>
            <p className="mt-3 text-gray-400">社会保障政策に対する各党のスタンスを比較</p>
          </div>
        </section>
        <div className="mx-auto max-w-7xl px-8 py-12">
          <div className="dark-card p-8">
            <p className="text-center text-gray-500">
              政党スタンスデータがまだありません。
              <br />
              <code className="text-xs text-gray-400">pnpm ingest:social-security</code>{" "}
              を実行してデータを投入してください。
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* --- Group by party --- */
  const partyMap = new Map<
    string,
    { name: string; shortName: string | null; color: string | null; stances: StanceRow[] }
  >();
  for (const s of stances) {
    if (!partyMap.has(s.partyId)) {
      partyMap.set(s.partyId, {
        name: s.party.name,
        shortName: s.party.shortName,
        color: s.party.color,
        stances: [],
      });
    }
    partyMap.get(s.partyId)!.stances.push(s);
  }

  const parties = [...partyMap.entries()].map(([id, data]) => ({ id, ...data }));
  const topics = [...new Set(stances.map((s) => s.topic))].sort();
  const years = [...new Set(stances.map((s) => s.year))].sort((a, b) => b - a);

  return (
    <div className="min-h-screen">
      {/* ====== Hero ====== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-950 to-slate-950 py-16 pb-20">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-8">
          <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            政党比較
          </h1>
          <p className="mb-4 text-gray-400">社会保障政策に対する各党のスタンスを比較</p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <span>政党: {parties.length}党</span>
            <span>トピック: {topics.length}件</span>
            <span>データ年: {years.join(", ")}</span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-8 py-10 space-y-10">
        {/* ====== Topic-based Comparison Table ====== */}
        <FadeIn>
          <section>
            <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-white">
              <span className="inline-block h-5 w-1 rounded-full bg-gradient-to-b from-emerald-400 to-teal-500" />
              トピック別比較
            </h2>
            <div className="overflow-x-auto rounded-xl dark-card dark-scrollbar">
              <table className="w-full text-left text-sm dark-table">
                <thead>
                  <tr>
                    <th className="px-5 py-4 font-medium sticky left-0 bg-slate-900/80 backdrop-blur-sm min-w-[120px]">
                      トピック
                    </th>
                    {parties.map((p) => (
                      <th key={p.id} className="px-5 py-4 text-center font-medium min-w-[160px]">
                        <span className="inline-flex items-center gap-1.5">
                          <span
                            className="inline-block h-3 w-3 rounded-full"
                            style={{ backgroundColor: p.color ?? "#6B7280" }}
                          />
                          <span className="text-gray-300">{p.shortName ?? p.name}</span>
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {topics.map((topic) => (
                    <tr key={topic}>
                      <td className="px-5 py-4 font-medium sticky left-0 bg-slate-950/80 backdrop-blur-sm text-gray-300">
                        {topic}
                      </td>
                      {parties.map((p) => {
                        const stance = p.stances.find((s) => s.topic === topic);
                        if (!stance) {
                          return (
                            <td key={p.id} className="px-5 py-4 text-center text-gray-700">
                              -
                            </td>
                          );
                        }
                        const badge = stanceBadge(stance.stance);
                        return (
                          <td key={p.id} className="px-5 py-4 text-center">
                            <Badge variant={badge.variant} dot>
                              {badge.label}
                            </Badge>
                            <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                              {stance.summary}
                            </p>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </FadeIn>

        {/* ====== Party Cards ====== */}
        <FadeIn delay={0.1}>
          <section>
            <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-white">
              <span className="inline-block h-5 w-1 rounded-full bg-gradient-to-b from-emerald-400 to-teal-500" />
              各党の社会保障スタンス
            </h2>
            <StaggerGrid className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {parties.map((p) => (
                <StaggerItem key={p.id}>
                  <div className="dark-card p-6 h-full transition-all duration-300 hover:bg-white/[0.05]">
                    <div className="flex h-full flex-col">
                      {/* Party header */}
                      <div className="mb-4 flex items-center gap-3">
                        <div
                          className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                          style={{ backgroundColor: p.color ?? "#6B7280" }}
                        >
                          {(p.shortName ?? p.name).charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-white">{p.name}</h3>
                          {p.shortName && <p className="text-xs text-gray-500">{p.shortName}</p>}
                        </div>
                      </div>

                      {/* Stances list */}
                      <div className="flex-1 space-y-3">
                        {p.stances.map((s) => {
                          const badge = stanceBadge(s.stance);
                          return (
                            <div
                              key={s.id}
                              className="rounded-lg border border-white/5 bg-white/[0.02] p-3"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium text-gray-400">{s.topic}</span>
                                <Badge variant={badge.variant} dot>
                                  {badge.label}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-500 leading-relaxed">{s.summary}</p>
                              {s.manifesto && (
                                <p className="mt-1 text-[10px] text-gray-600 italic line-clamp-2">
                                  &ldquo;{s.manifesto}&rdquo;
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Footer */}
                      <div className="mt-4 border-t border-white/5 pt-3 text-xs text-gray-600">
                        {p.stances.length}件のスタンス
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </section>
        </FadeIn>
      </div>
    </div>
  );
}
