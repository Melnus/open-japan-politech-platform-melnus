import { prisma } from "@ojpp/db";
import { FadeIn, StaggerGrid, StaggerItem } from "@ojpp/ui";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { DashboardCharts } from "./components/dashboard-charts";
import { StatCard } from "./components/stat-card";

export const dynamic = "force-dynamic";

/* ---------- Types ---------- */

interface BudgetData {
  id: string;
  fiscalYear: number;
  category: string;
  amount: bigint;
  description: string | null;
}

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
  isActive: boolean;
}

/* ---------- Category display map ---------- */

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

/* ---------- Helpers ---------- */

function formatBudgetAmount(amount: bigint): string {
  const num = Number(amount);
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}兆円`;
  }
  if (num >= 100) {
    return `${(num / 100).toFixed(0)}億円`;
  }
  return `${num}百万円`;
}

/* ---------- Data fetching ---------- */

async function getData() {
  noStore();

  const [budgets, programs, budgetCount, programCount] = await Promise.all([
    prisma.culturalBudget.findMany({
      orderBy: [{ fiscalYear: "desc" }, { category: "asc" }],
    }),
    prisma.culturalProgram.findMany({
      where: { isActive: true },
      orderBy: { budget: "desc" },
      take: 6,
    }),
    prisma.culturalBudget.count(),
    prisma.culturalProgram.count(),
  ]);

  return {
    budgets: budgets as unknown as BudgetData[],
    programs: programs as unknown as ProgramData[],
    budgetCount,
    programCount,
  };
}

/* ---------- Main Page ---------- */

export default async function Home() {
  let data: Awaited<ReturnType<typeof getData>> | null = null;
  let fetchError: string | null = null;

  try {
    data = await getData();
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[CultureScope] Failed to fetch data:", msg);
    fetchError = msg;
  }

  const budgets = data?.budgets ?? [];
  const programs = data?.programs ?? [];

  /* --- Compute stats --- */
  const latestYear = budgets.length > 0 ? budgets[0].fiscalYear : null;
  const latestTotalBudget = budgets.find(
    (b) => b.fiscalYear === latestYear && b.category === "TOTAL",
  );

  /* Previous year for YoY comparison */
  const prevYear = latestYear ? latestYear - 1 : null;
  const prevTotalBudget = prevYear
    ? budgets.find((b) => b.fiscalYear === prevYear && b.category === "TOTAL")
    : null;
  const yoyChange =
    latestTotalBudget && prevTotalBudget
      ? ((Number(latestTotalBudget.amount) - Number(prevTotalBudget.amount)) /
          Number(prevTotalBudget.amount)) *
        100
      : null;

  const activeProgramCount = data?.programCount ?? 0;

  /* --- Latest year budgets (non-TOTAL) --- */
  const latestYearBudgets = budgets.filter(
    (b) => b.fiscalYear === latestYear && b.category !== "TOTAL",
  );
  const uniqueCategories = new Set(latestYearBudgets.map((b) => b.category));

  /* --- Budget trend: TOTAL by year --- */
  const totalByYear = budgets
    .filter((b) => b.category === "TOTAL")
    .sort((a, b) => a.fiscalYear - b.fiscalYear)
    .map((b) => ({
      year: `${b.fiscalYear}`,
      amount: Number(b.amount),
    }));

  /* --- Category breakdown for horizontal bars --- */
  const maxCatAmount = Math.max(...latestYearBudgets.map((b) => Number(b.amount)), 1);
  const categoryBreakdown = latestYearBudgets
    .sort((a, b) => Number(b.amount) - Number(a.amount))
    .map((b) => ({
      category: b.category,
      label: getCategoryLabel(b.category),
      amount: Number(b.amount),
      percentage: (Number(b.amount) / maxCatAmount) * 100,
    }));

  /* --- Budget numeric value for count-up --- */
  const budgetNumeric = latestTotalBudget ? Math.round(Number(latestTotalBudget.amount) / 100) : 0;

  /* --- Empty state --- */
  if (budgets.length === 0 && programs.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="glass-card p-8">
          {fetchError ? (
            <div className="text-center">
              <p className="text-red-400 font-medium">データベース接続エラー</p>
              <p className="mt-3 text-sm text-zinc-500">
                PostgreSQLに接続できませんでした。Supabaseコンテナが起動しているか確認してください。
              </p>
              <code className="mt-3 inline-block rounded-lg bg-red-950/50 border border-red-900/30 px-4 py-2 text-xs font-mono text-red-400">
                {fetchError}
              </code>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-950/50 border border-amber-800/30">
                <svg
                  className="h-8 w-8 text-amber-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <p className="text-lg font-medium text-zinc-300">データ未投入</p>
              <p className="mt-3 text-sm text-zinc-500">文化政策データがまだ投入されていません。</p>
              <code className="mt-4 inline-block rounded-lg bg-amber-950/40 border border-amber-800/20 px-4 py-2 text-xs font-mono text-amber-400">
                pnpm ingest:culture
              </code>
              <p className="mt-3 text-xs text-zinc-600">
                を実行して文化庁予算・文化プログラムデータを投入してください。
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* ====== Hero Section ====== */}
      <section className="relative overflow-hidden px-6 pb-8 pt-12">
        {/* Subtle gradient glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-40 w-96 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <FadeIn>
            <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              文化を、政治の言語で読み解く
            </h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="mt-3 max-w-xl text-base text-zinc-400">
              文化庁予算{uniqueCategories.size > 0 ? `${uniqueCategories.size}` : "12"}分野
              {totalByYear.length > 0 ? `×${totalByYear.length}年分` : "×8年分"}
              の推移を可視化
            </p>
          </FadeIn>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 pb-16">
        {/* ====== Stats Row ====== */}
        <section className="mb-10">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label={latestYear ? `${latestYear}年度予算` : "予算総額"}
              value={latestTotalBudget ? formatBudgetAmount(latestTotalBudget.amount) : "---"}
              numericValue={budgetNumeric > 0 ? budgetNumeric : undefined}
              prefix="¥"
              suffix="億"
              delay={0}
            />
            <StatCard
              label="前年比"
              value={
                yoyChange != null ? `${yoyChange >= 0 ? "+" : ""}${yoyChange.toFixed(1)}%` : "---"
              }
              subtext={yoyChange != null ? (yoyChange >= 0 ? "増加" : "減少") : undefined}
              subtextColor={yoyChange != null ? (yoyChange >= 0 ? "green" : "red") : "zinc"}
              delay={0.05}
            />
            <StatCard
              label="登録プログラム"
              value={`${activeProgramCount}件`}
              numericValue={activeProgramCount > 0 ? activeProgramCount : undefined}
              suffix="件"
              delay={0.1}
            />
            <StatCard
              label="対象カテゴリ"
              value={`${uniqueCategories.size}分野`}
              numericValue={uniqueCategories.size > 0 ? uniqueCategories.size : undefined}
              suffix="分野"
              delay={0.15}
            />
          </div>
        </section>

        {/* ====== Area Chart + Category Bars ====== */}
        <section className="mb-10">
          <FadeIn>
            <DashboardCharts totalByYear={totalByYear} categoryBreakdown={categoryBreakdown} />
          </FadeIn>
        </section>

        {/* ====== Top Programs ====== */}
        {programs.length > 0 && (
          <section className="mb-10">
            <FadeIn>
              <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-white">
                <span className="inline-block h-5 w-1 rounded-full bg-amber-500" />
                主な文化プログラム
              </h2>
            </FadeIn>
            <StaggerGrid className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {programs.map((p) => (
                <StaggerItem key={p.id}>
                  <div className="glass-card group p-5 transition-all duration-300 hover:border-amber-500/20 hover:bg-white/[0.05]">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="inline-block rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400">
                        {getCategoryLabel(p.category)}
                      </span>
                      {p.isActive && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                          実施中
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold tracking-tight text-white">{p.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-400 line-clamp-3">
                      {p.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs">
                      {p.budget && (
                        <span className="rounded-lg bg-amber-500/10 px-2.5 py-1 font-medium text-amber-400">
                          {formatBudgetAmount(p.budget)}
                        </span>
                      )}
                      <span className="rounded-lg bg-white/5 px-2.5 py-1 text-zinc-500">
                        {p.startYear}年〜{p.endYear ? `${p.endYear}年` : "継続中"}
                      </span>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGrid>
            <FadeIn delay={0.3}>
              <div className="mt-6 text-right">
                <Link
                  href="/programs"
                  className="inline-flex items-center gap-1 text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
                >
                  すべての文化施策を見る
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </FadeIn>
          </section>
        )}

        {/* ====== Quick Navigation ====== */}
        <section>
          <FadeIn>
            <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-white">
              <span className="inline-block h-5 w-1 rounded-full bg-amber-500" />
              もっと探る
            </h2>
          </FadeIn>
          <StaggerGrid className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StaggerItem>
              <Link href="/budget" className="block">
                <div className="glass-card group relative overflow-hidden p-6 transition-all duration-300 hover:border-amber-500/30">
                  <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-amber-500/5 transition-all duration-500 group-hover:bg-amber-500/10" />
                  <h3 className="relative text-lg font-bold text-white">予算推移</h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-zinc-500">
                    年度別・分野別の文化庁予算をチャートで可視化
                  </p>
                </div>
              </Link>
            </StaggerItem>
            <StaggerItem>
              <Link href="/programs" className="block">
                <div className="glass-card group relative overflow-hidden p-6 transition-all duration-300 hover:border-emerald-500/30">
                  <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-emerald-500/5 transition-all duration-500 group-hover:bg-emerald-500/10" />
                  <h3 className="relative text-lg font-bold text-white">文化施策</h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-zinc-500">
                    文化庁の補助金・助成金プログラム一覧
                  </p>
                </div>
              </Link>
            </StaggerItem>
            <StaggerItem>
              <Link href="/compare" className="block">
                <div className="glass-card group relative overflow-hidden p-6 transition-all duration-300 hover:border-violet-500/30">
                  <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-violet-500/5 transition-all duration-500 group-hover:bg-violet-500/10" />
                  <h3 className="relative text-lg font-bold text-white">政党比較</h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-zinc-500">
                    各政党の文化政策スタンスを横断的に比較
                  </p>
                </div>
              </Link>
            </StaggerItem>
          </StaggerGrid>
        </section>
      </div>
    </div>
  );
}
