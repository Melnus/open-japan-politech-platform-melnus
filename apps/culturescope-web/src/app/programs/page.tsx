import { prisma } from "@ojpp/db";
import { FadeIn, StaggerGrid, StaggerItem } from "@ojpp/ui";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";

/* ---------- Types ---------- */

interface ProgramData {
  id: string;
  name: string;
  category: string;
  description: string;
  budget: bigint | null;
  startYear: number;
  endYear: number | null;
  targetGroup: string | null;
  ministry: string;
  sourceUrl: string | null;
  isActive: boolean;
}

/* ---------- Constants ---------- */

const CATEGORY_LABELS: Record<string, string> = {
  ARTS_PROMOTION: "芸術文化振興",
  CULTURAL_PROPERTY: "文化財保護",
  MEDIA_ARTS: "メディア芸術",
  INTERNATIONAL: "国際文化交流",
  COPYRIGHT: "著作権",
  JAPANESE_LANGUAGE: "国語・日本語教育",
  RELIGIOUS_AFFAIRS: "宗務",
  CREATIVE_INDUSTRY: "文化産業",
  CULTURAL_FACILITY: "文化施設整備",
  DIGITAL_ARCHIVE: "デジタルアーカイブ",
  LOCAL_CULTURE: "地域文化振興",
  TOTAL: "合計",
};

function getCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category;
}

function formatBudgetAmount(amount: bigint): string {
  const num = Number(amount);
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}兆円`;
  if (num >= 100) return `${Math.round(num / 100)}億円`;
  return `${num}百万円`;
}

/* ---------- Data fetching ---------- */

async function getPrograms() {
  noStore();
  const programs = await prisma.culturalProgram.findMany({
    orderBy: [{ isActive: "desc" }, { budget: "desc" }],
  });
  return programs as unknown as ProgramData[];
}

/* ---------- Page ---------- */

export default async function ProgramsPage() {
  let programs: ProgramData[] = [];
  let fetchError: string | null = null;

  try {
    programs = await getPrograms();
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[CultureScope] Failed to fetch programs:", msg);
    fetchError = msg;
  }

  /* Group by category */
  const categories = [...new Set(programs.map((p) => p.category))];
  const activeCount = programs.filter((p) => p.isActive).length;

  if (programs.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20">
        <FadeIn>
          <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-white">文化施策一覧</h1>
          <p className="mb-8 text-zinc-400">文化庁の補助金・助成金プログラムと文化政策を網羅</p>
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
              文化プログラムデータがまだ投入されていません。
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
        <div className="absolute -top-20 right-1/4 h-40 w-80 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <FadeIn>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">文化施策一覧</h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="mt-3 text-base text-zinc-400">
              文化庁の補助金・助成金プログラムと文化政策を網羅
            </p>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-zinc-500">
              <span>全{programs.length}件</span>
              <span>実施中: {activeCount}件</span>
              <span>分野数: {categories.length}</span>
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 pb-16">
        {/* ====== Category Filter Summary ====== */}
        <FadeIn>
          <div className="mb-10 flex flex-wrap gap-2">
            {categories.map((cat) => {
              const count = programs.filter((p) => p.category === cat).length;
              return (
                <a
                  key={cat}
                  href={`#category-${cat}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-zinc-300 transition-all hover:border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-400"
                >
                  {getCategoryLabel(cat)}
                  <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] text-zinc-400">
                    {count}
                  </span>
                </a>
              );
            })}
          </div>
        </FadeIn>

        {/* ====== Programs by Category ====== */}
        {categories.map((cat) => {
          const catPrograms = programs.filter((p) => p.category === cat);
          const maxBudget = Math.max(...catPrograms.map((p) => Number(p.budget ?? 0)), 1);

          return (
            <section key={cat} id={`category-${cat}`} className="mb-12">
              <FadeIn>
                <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-white">
                  <span className="inline-block h-5 w-1 rounded-full bg-amber-500" />
                  {getCategoryLabel(cat)}
                  <span className="text-sm font-normal text-zinc-500">
                    ({catPrograms.length}件)
                  </span>
                </h2>
              </FadeIn>

              <StaggerGrid className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {catPrograms.map((p) => {
                  const budgetPct = p.budget ? (Number(p.budget) / maxBudget) * 100 : 0;

                  return (
                    <StaggerItem key={p.id}>
                      <div className="glass-card group relative overflow-hidden p-5 transition-all duration-300 hover:border-amber-500/20 hover:bg-white/[0.05]">
                        {/* Budget bar at top */}
                        {p.budget && (
                          <div className="absolute inset-x-0 top-0 h-0.5 bg-white/5">
                            <div
                              className="h-full bg-amber-500/60 transition-all duration-700"
                              style={{ width: `${budgetPct}%` }}
                            />
                          </div>
                        )}

                        {/* Header */}
                        <div className="mb-3 flex items-start justify-between">
                          <span className="inline-block rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400">
                            {getCategoryLabel(p.category)}
                          </span>
                          {p.isActive ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-400">
                              <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                              実施中
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-xs font-medium text-zinc-500">
                              <span className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
                              終了
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-base font-bold tracking-tight leading-tight text-white">
                          {p.name}
                        </h3>

                        {/* Description */}
                        <p className="mt-3 text-sm leading-relaxed text-zinc-400 line-clamp-3">
                          {p.description}
                        </p>

                        {/* Budget visual */}
                        {p.budget && (
                          <div className="mt-4 rounded-lg bg-amber-500/5 border border-amber-500/10 px-3 py-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-zinc-500">予算額</span>
                              <span className="text-sm font-bold text-amber-400">
                                {formatBudgetAmount(p.budget)}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Metadata */}
                        <div className="mt-3 flex flex-wrap gap-2 text-xs">
                          <span className="rounded-lg bg-white/5 px-2.5 py-1 text-zinc-500">
                            {p.startYear}年〜{p.endYear ? `${p.endYear}年` : "継続中"}
                          </span>
                          {p.targetGroup && (
                            <span className="rounded-lg bg-blue-500/10 px-2.5 py-1 text-blue-400">
                              対象: {p.targetGroup}
                            </span>
                          )}
                          <span className="rounded-lg bg-white/5 px-2.5 py-1 text-zinc-500">
                            {p.ministry}
                          </span>
                        </div>

                        {/* Source link */}
                        {p.sourceUrl && (
                          <div className="mt-4 pt-3 border-t border-white/5">
                            <a
                              href={p.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-medium text-amber-400 hover:text-amber-300 transition-colors"
                            >
                              出典を見る &rarr;
                            </a>
                          </div>
                        )}
                      </div>
                    </StaggerItem>
                  );
                })}
              </StaggerGrid>
            </section>
          );
        })}
      </div>
    </div>
  );
}
