import { prisma } from "@ojpp/db";
import { FadeIn, StaggerGrid, StaggerItem } from "@ojpp/ui";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";

/* ---------- Types ---------- */

interface ProgramRow {
  id: string;
  name: string;
  category: string;
  description: string;
  eligibility: string | null;
  benefit: string | null;
  budget: bigint | null;
  recipients: number | null;
  startYear: number | null;
  lastReformed: number | null;
  sourceUrl: string | null;
  isActive: boolean;
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

function formatAmount(amount: bigint): string {
  const num = Number(amount);
  if (num >= 10000) return `${(num / 10000).toFixed(1)}兆円`;
  return `${num.toLocaleString()}億円`;
}

/* ---------- Main Page ---------- */

export default async function ProgramsPage() {
  noStore();

  let programs: ProgramRow[] = [];
  try {
    programs = (await prisma.socialSecurityProgram.findMany({
      orderBy: [{ category: "asc" }, { name: "asc" }],
    })) as unknown as ProgramRow[];
  } catch {
    // DB not available
  }

  const categories = [...new Set(programs.map((p) => p.category))];
  const activeCount = programs.filter((p) => p.isActive).length;

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
            社会保障制度一覧
          </h1>
          <p className="mb-4 text-gray-400">
            年金・医療・介護・福祉・子育て支援 -- 日本の社会保障制度を網羅的に一覧
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <span>登録制度: {programs.length}件</span>
            <span>アクティブ: {activeCount}件</span>
            <span>カテゴリ: {categories.length}分野</span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-8 py-10">
        {programs.length === 0 ? (
          <div className="dark-card p-8">
            <p className="text-center text-gray-500">
              社会保障制度データがまだありません。
              <br />
              <code className="text-xs text-gray-400">pnpm ingest:social-security</code>{" "}
              を実行してデータを投入してください。
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* ====== Category Filter Legend ====== */}
            <FadeIn>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-white"
                    style={{ backgroundColor: CATEGORY_COLORS[cat] ?? "#6B7280" }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
                    {categoryLabel(cat)}
                    <span className="ml-1 rounded-full bg-white/20 px-1.5 text-[10px]">
                      {programs.filter((p) => p.category === cat).length}
                    </span>
                  </span>
                ))}
              </div>
            </FadeIn>

            {/* ====== Programs by Category ====== */}
            {categories.map((cat) => {
              const catPrograms = programs.filter((p) => p.category === cat);
              return (
                <FadeIn key={cat} delay={0.05}>
                  <section>
                    <h2 className="mb-4 flex items-center gap-3 text-lg font-bold text-white">
                      <span
                        className="inline-block h-5 w-1 rounded-full"
                        style={{ backgroundColor: CATEGORY_COLORS[cat] ?? "#6B7280" }}
                      />
                      {categoryLabel(cat)}
                      <span className="text-sm font-normal text-gray-500">
                        ({catPrograms.length}件)
                      </span>
                    </h2>
                    <StaggerGrid className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {catPrograms.map((p) => (
                        <StaggerItem key={p.id}>
                          <div className="dark-card p-6 h-full transition-all duration-300 hover:bg-white/[0.05]">
                            <div className="flex h-full flex-col">
                              {/* Header */}
                              <div className="mb-3 flex items-start justify-between">
                                <span
                                  className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                                  style={{
                                    backgroundColor: CATEGORY_COLORS[p.category] ?? "#6B7280",
                                  }}
                                >
                                  {categoryLabel(p.category)}
                                </span>
                                {!p.isActive && (
                                  <span className="rounded-full bg-gray-800 px-2 py-0.5 text-xs text-gray-400">
                                    廃止
                                  </span>
                                )}
                              </div>

                              {/* Title */}
                              <h3 className="text-base font-bold leading-tight text-white">
                                {p.name}
                              </h3>

                              {/* Description */}
                              <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-400">
                                {p.description}
                              </p>

                              {/* Details */}
                              <div className="mt-4 space-y-2 border-t border-white/5 pt-3">
                                {p.eligibility && (
                                  <div className="flex gap-2 text-xs">
                                    <span className="shrink-0 font-medium text-gray-500">
                                      対象:
                                    </span>
                                    <span className="text-gray-400">{p.eligibility}</span>
                                  </div>
                                )}
                                {p.benefit && (
                                  <div className="flex gap-2 text-xs">
                                    <span className="shrink-0 font-medium text-gray-500">
                                      給付:
                                    </span>
                                    <span className="text-gray-400">{p.benefit}</span>
                                  </div>
                                )}
                              </div>

                              {/* Footer stats */}
                              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                                {p.recipients != null && (
                                  <span className="inline-flex items-center gap-1">
                                    <svg
                                      className="h-3 w-3"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                                      />
                                    </svg>
                                    約{p.recipients.toLocaleString()}万人
                                  </span>
                                )}
                                {p.budget != null && (
                                  <span className="inline-flex items-center gap-1">
                                    <svg
                                      className="h-3 w-3"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                    {formatAmount(p.budget)}
                                  </span>
                                )}
                                {p.lastReformed && (
                                  <span className="inline-flex items-center gap-1">
                                    <svg
                                      className="h-3 w-3"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                      />
                                    </svg>
                                    {p.lastReformed}年改正
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </StaggerItem>
                      ))}
                    </StaggerGrid>
                  </section>
                </FadeIn>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
