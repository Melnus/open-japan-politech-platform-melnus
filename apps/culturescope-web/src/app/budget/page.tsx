import { prisma } from "@ojpp/db";
import { FadeIn } from "@ojpp/ui";
import { unstable_noStore as noStore } from "next/cache";
import { BudgetCharts } from "./budget-charts";

export const dynamic = "force-dynamic";

/* ---------- Types ---------- */

interface BudgetData {
  id: string;
  fiscalYear: number;
  category: string;
  amount: bigint;
  description: string | null;
}

/* ---------- Data fetching ---------- */

async function getBudgets() {
  noStore();
  const budgets = await prisma.culturalBudget.findMany({
    orderBy: [{ fiscalYear: "asc" }, { category: "asc" }],
  });
  return budgets as unknown as BudgetData[];
}

/* ---------- Page ---------- */

export default async function BudgetPage() {
  let budgets: BudgetData[] = [];
  let fetchError: string | null = null;

  try {
    budgets = await getBudgets();
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[CultureScope] Failed to fetch budgets:", msg);
    fetchError = msg;
  }

  /* Serialize BigInt for client component */
  const serializedBudgets = budgets.map((b) => ({
    ...b,
    amount: Number(b.amount),
  }));

  if (budgets.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20">
        <FadeIn>
          <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-white">文化庁予算推移</h1>
          <p className="mb-8 text-zinc-400">年度別・分野別の文化予算データをグラフで可視化</p>
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
              予算データがまだ投入されていません。
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
        <div className="absolute -top-20 left-1/4 h-40 w-80 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <FadeIn>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">文化庁予算推移</h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="mt-3 text-base text-zinc-400">
              年度別・分野別の文化予算データをグラフで可視化
            </p>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-zinc-500">
              <span>データ件数: {budgets.length}件</span>
              <span>
                対象期間: {serializedBudgets[0]?.fiscalYear}〜
                {serializedBudgets[serializedBudgets.length - 1]?.fiscalYear}年度
              </span>
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 pb-16">
        <FadeIn>
          <BudgetCharts budgets={serializedBudgets} />
        </FadeIn>
      </div>
    </div>
  );
}
