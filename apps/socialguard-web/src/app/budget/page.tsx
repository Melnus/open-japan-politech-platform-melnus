import { prisma } from "@ojpp/db";
import { FadeIn } from "@ojpp/ui";
import { unstable_noStore as noStore } from "next/cache";
import { BudgetPieChart, BudgetTrendChart } from "./budget-charts";

export const dynamic = "force-dynamic";

/* ---------- Types ---------- */

interface BudgetRow {
  id: string;
  fiscalYear: number;
  category: string;
  amount: bigint;
  description: string | null;
}

/* ---------- Helpers ---------- */

const CATEGORY_LABELS: Record<string, string> = {
  PENSION: "年金",
  HEALTHCARE: "医療",
  LONG_TERM_CARE: "介護",
  WELFARE: "福祉",
  CHILD_SUPPORT: "子育て支援",
  EMPLOYMENT: "雇用・労働",
  DISABILITY: "障害福祉",
  TOTAL: "合計",
};

const CATEGORY_COLORS: Record<string, string> = {
  PENSION: "#059669",
  HEALTHCARE: "#0D9488",
  LONG_TERM_CARE: "#0891B2",
  WELFARE: "#6366F1",
  CHILD_SUPPORT: "#EC4899",
  EMPLOYMENT: "#F59E0B",
  DISABILITY: "#8B5CF6",
};

function categoryLabel(cat: string): string {
  return CATEGORY_LABELS[cat] ?? cat;
}

/* ---------- Main Page ---------- */

export default async function BudgetPage() {
  noStore();

  let budgets: BudgetRow[] = [];
  try {
    budgets = (await prisma.socialSecurityBudget.findMany({
      orderBy: { fiscalYear: "asc" },
    })) as unknown as BudgetRow[];
  } catch {
    // DB not available
  }

  if (budgets.length === 0) {
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
              予算推移
            </h1>
            <p className="mt-3 text-gray-400">社会保障関係費の年度別推移を可視化</p>
          </div>
        </section>
        <div className="mx-auto max-w-7xl px-8 py-12">
          <div className="dark-card p-8">
            <p className="text-center text-gray-500">
              社会保障予算データがまだありません。
              <br />
              <code className="text-xs text-gray-400">pnpm ingest:social-security</code>{" "}
              を実行してデータを投入してください。
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* --- Prepare chart data --- */
  const years = [...new Set(budgets.map((b) => b.fiscalYear))].sort();
  const categories = [
    ...new Set(budgets.filter((b) => b.category !== "TOTAL").map((b) => b.category)),
  ];

  const trendData = years.map((year) => {
    const row: Record<string, number | string> = { year: `${year}` };
    for (const cat of categories) {
      const entry = budgets.find((b) => b.fiscalYear === year && b.category === cat);
      row[categoryLabel(cat)] = entry ? Number(entry.amount) : 0;
    }
    const totalEntry = budgets.find((b) => b.fiscalYear === year && b.category === "TOTAL");
    row["合計"] = totalEntry ? Number(totalEntry.amount) : 0;
    return row;
  });

  const latestYear = years[years.length - 1];
  const pieData = budgets
    .filter((b) => b.fiscalYear === latestYear && b.category !== "TOTAL")
    .map((b) => ({
      name: categoryLabel(b.category),
      value: Number(b.amount),
      color: CATEGORY_COLORS[b.category] ?? "#6B7280",
    }))
    .sort((a, b) => b.value - a.value);

  const categoryKeys = categories.map((c) => categoryLabel(c));
  const colorMap = Object.fromEntries(
    categories.map((c) => [categoryLabel(c), CATEGORY_COLORS[c] ?? "#6B7280"]),
  );

  const totalByYear = years.map((year) => {
    const total = budgets.find((b) => b.fiscalYear === year && b.category === "TOTAL");
    return { year, amount: total ? Number(total.amount) : 0 };
  });

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
            予算推移
          </h1>
          <p className="mb-4 text-gray-400">社会保障関係費の年度別推移を可視化</p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <span>
              期間: {years[0]}〜{years[years.length - 1]}年度
            </span>
            <span>カテゴリ: {categories.length}分野</span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-8 py-10 space-y-10">
        {/* ====== Stacked Area Chart ====== */}
        <FadeIn>
          <section>
            <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-white">
              <span className="inline-block h-5 w-1 rounded-full bg-gradient-to-b from-emerald-400 to-teal-500" />
              分野別予算推移
            </h2>
            <div className="dark-card p-8">
              <BudgetTrendChart data={trendData} categoryKeys={categoryKeys} colorMap={colorMap} />
            </div>
          </section>
        </FadeIn>

        {/* ====== Pie Chart ====== */}
        <FadeIn delay={0.1}>
          <section>
            <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-white">
              <span className="inline-block h-5 w-1 rounded-full bg-gradient-to-b from-emerald-400 to-teal-500" />
              {latestYear}年度 構成比
            </h2>
            <div className="dark-card p-8">
              <BudgetPieChart data={pieData} />
            </div>
          </section>
        </FadeIn>

        {/* ====== Year-over-Year Table ====== */}
        <FadeIn delay={0.2}>
          <section>
            <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-white">
              <span className="inline-block h-5 w-1 rounded-full bg-gradient-to-b from-emerald-400 to-teal-500" />
              年度別合計
            </h2>
            <div className="overflow-x-auto rounded-xl dark-card dark-scrollbar">
              <table className="w-full text-left text-sm dark-table">
                <thead>
                  <tr>
                    <th className="px-6 py-4 font-medium">年度</th>
                    <th className="px-6 py-4 text-right font-medium">社会保障関係費</th>
                    <th className="px-6 py-4 text-right font-medium">前年比</th>
                  </tr>
                </thead>
                <tbody>
                  {totalByYear.map((row, i) => {
                    const prev = i > 0 ? totalByYear[i - 1].amount : null;
                    const change = prev ? ((row.amount - prev) / prev) * 100 : null;
                    return (
                      <tr key={row.year}>
                        <td className="px-6 py-4 font-medium text-gray-300">{row.year}年度</td>
                        <td className="px-6 py-4 text-right font-bold text-white">
                          {row.amount >= 10000
                            ? `${(row.amount / 10000).toFixed(2)}兆円`
                            : `${row.amount.toLocaleString()}億円`}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {change != null ? (
                            <span
                              className={
                                change > 0
                                  ? "text-red-400"
                                  : change < 0
                                    ? "text-blue-400"
                                    : "text-gray-500"
                              }
                            >
                              {change > 0 ? "+" : ""}
                              {change.toFixed(1)}%
                            </span>
                          ) : (
                            <span className="text-gray-600">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </FadeIn>
      </div>
    </div>
  );
}
