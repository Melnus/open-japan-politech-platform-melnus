import { formatCurrency, getBaseUrl } from "@/lib/format";
import { DashboardCharts } from "./dashboard-charts";
import { HeroStats } from "./hero-stats";

interface StatsData {
  organizationCount: number;
  reportCount: number;
  totalIncome: string;
  totalExpenditure: string;
  recentReports: {
    id: string;
    fiscalYear: number;
    totalIncome: string;
    totalExpenditure: string;
    organization: {
      name: string;
      party: { name: string; color: string | null } | null;
    };
  }[];
  yearlyStats: {
    year: number;
    totalIncome: string;
    totalExpenditure: string;
    reportCount: number;
  }[];
}

async function getStats(): Promise<StatsData> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/stats`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

export default async function Home() {
  let stats: StatsData | null = null;
  try {
    stats = await getStats();
  } catch {
    // Fallback to empty state
  }

  if (!stats) {
    return (
      <div className="mx-auto max-w-7xl px-8 py-16">
        <h2 className="mb-6 text-3xl font-bold text-white">政治資金の流れを、誰でも見える形に</h2>
        <div className="glass-card rounded-xl p-8">
          <p className="text-center text-[#8b949e]">
            データを読み込み中、またはデータベースにデータがありません。
            <br />
            <code className="mt-2 inline-block rounded-lg bg-[rgba(255,107,53,0.1)] px-3 py-1.5 text-xs text-[#FFAD80]">
              pnpm --filter @ojpp/ingestion ingest:finance
            </code>{" "}
            を実行してデータを投入してください。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 pb-20">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        {/* Glow pulse line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF6B35]/40 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-8">
          <h2 className="mb-3 text-4xl font-extrabold tracking-tight text-white">
            政治資金を、ガラスのように透明に
          </h2>
          <p className="mb-10 max-w-2xl text-lg text-[#8b949e]">
            全政党の収支報告書を構造化データとして公開
          </p>

          <HeroStats
            organizationCount={stats.organizationCount}
            reportCount={stats.reportCount}
            totalIncome={stats.totalIncome}
            totalExpenditure={stats.totalExpenditure}
          />
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl space-y-10 px-8 py-12">
        {/* Charts Section */}
        <section>
          <h3 className="mb-6 text-xl font-bold text-white">年度別収支推移</h3>
          <div className="glass-card rounded-xl p-8">
            <DashboardCharts yearlyStats={stats.yearlyStats} />
          </div>
        </section>

        {/* Reports Table */}
        <section>
          <h3 className="mb-6 text-xl font-bold text-white">最新の報告書</h3>
          <div className="glass-card overflow-x-auto rounded-xl">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[rgba(255,255,255,0.06)]">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#8b949e]">
                    団体名
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#8b949e]">
                    政党
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#8b949e]">
                    年度
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-[#8b949e]">
                    収入
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-[#8b949e]">
                    支出
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.recentReports.map((report) => (
                  <tr
                    key={report.id}
                    className="border-b border-[rgba(255,255,255,0.03)] transition-colors last:border-0 hover:bg-[rgba(255,107,53,0.04)]"
                  >
                    <td className="max-w-[200px] px-6 py-4">
                      <a
                        href={`/reports/${report.id}`}
                        className="block truncate font-medium text-[#FF6B35] transition-colors hover:text-[#FF8C5A] hover:underline"
                      >
                        {report.organization.name}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-white"
                        style={{
                          backgroundColor: `${report.organization.party?.color ?? "#6B7280"}33`,
                          border: `1px solid ${report.organization.party?.color ?? "#6B7280"}66`,
                        }}
                      >
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: report.organization.party?.color ?? "#6B7280" }}
                        />
                        {report.organization.party?.name ?? "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#8b949e]">{report.fiscalYear}年</td>
                    <td className="px-6 py-4 text-right font-mono font-medium text-[#10B981]">
                      {formatCurrency(report.totalIncome)}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-medium text-[#EF4444]">
                      {formatCurrency(report.totalExpenditure)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
