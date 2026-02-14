import { Badge, Card, FadeIn, ScrollReveal, Stat } from "@ojpp/ui";
import { notFound } from "next/navigation";
import { formatCurrency, getBaseUrl } from "@/lib/format";
import { ReportCharts } from "./report-charts";

const INCOME_CATEGORY_LABELS: Record<string, string> = {
  PARTY_FEE: "党費",
  DONATION_INDIVIDUAL: "個人寄附",
  DONATION_CORPORATE: "法人寄附",
  DONATION_POLITICAL: "政治団体寄附",
  PARTY_SUBSIDY: "政党交付金",
  FUNDRAISING_EVENT: "政治資金パーティー",
  BUSINESS_INCOME: "事業収入",
  OTHER_INCOME: "その他",
  CARRY_FORWARD: "前年繰越",
};

const EXPENDITURE_CATEGORY_LABELS: Record<string, string> = {
  PERSONNEL: "人件費",
  OFFICE: "事務所費",
  EQUIPMENT: "備品・消耗品費",
  PRINTING: "機関紙誌発行",
  PUBLICITY: "宣伝事業費",
  POLITICAL_ACTIVITY: "政治活動費",
  DONATION_OUT: "寄附・交付金",
  OTHER_EXPENSE: "その他経費",
};

interface ReportDetail {
  id: string;
  fiscalYear: number;
  reportingBody: string;
  totalIncome: string;
  totalExpenditure: string;
  balance: string;
  status: string;
  organization: {
    id: string;
    name: string;
    party: { name: string; color: string | null } | null;
  };
  incomes: {
    id: string;
    category: string;
    source: string | null;
    amount: string;
    description: string | null;
  }[];
  expenditures: {
    id: string;
    category: string;
    recipient: string | null;
    amount: string;
    description: string | null;
  }[];
}

async function getReport(id: string): Promise<ReportDetail | null> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/reports/${id}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch report");
  return res.json();
}

export default async function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const report = await getReport(id);
  if (!report) notFound();

  const partyColor = report.organization.party?.color ?? "#6B7280";

  const incomeData = report.incomes.map((i) => ({
    name: INCOME_CATEGORY_LABELS[i.category] ?? i.category,
    value: Number(i.amount),
  }));

  const expenditureData = report.expenditures.map((e) => ({
    name: EXPENDITURE_CATEGORY_LABELS[e.category] ?? e.category,
    value: Number(e.amount),
  }));

  return (
    <div className="mx-auto max-w-7xl px-8 py-12">
      {/* Breadcrumb */}
      <div className="mb-3 text-sm text-[#6e7681]">
        <a
          href={`/organizations/${report.organization.id}`}
          className="text-[#8b949e] transition-colors hover:text-[#FF8C5A]"
        >
          {report.organization.name}
        </a>
        <span className="mx-2">/</span>
        <span className="text-[#c9d1d9]">{report.fiscalYear}年度 収支報告書</span>
      </div>

      <FadeIn direction="up" delay={0}>
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <h2 className="text-3xl font-bold text-[#f0f0f0]">{report.fiscalYear}年度 収支報告書</h2>
          {report.organization.party && (
            <span
              className="rounded-full px-3 py-1 text-sm font-medium text-white"
              style={{
                backgroundColor: partyColor,
                boxShadow: `0 0 12px ${partyColor}40`,
              }}
            >
              {report.organization.party.name}
            </span>
          )}
          <Badge theme="dark" variant={report.status === "PUBLISHED" ? "success" : "default"}>
            {report.status}
          </Badge>
        </div>
      </FadeIn>

      <ScrollReveal>
        <div className="mb-10 grid gap-4 sm:grid-cols-4">
          <Stat variant="dark" label="総収入" value={formatCurrency(report.totalIncome)} />
          <Stat variant="dark" label="総支出" value={formatCurrency(report.totalExpenditure)} />
          <Stat variant="dark" label="残高" value={formatCurrency(report.balance)} />
          <Stat variant="dark" label="届出先" value={report.reportingBody} />
        </div>
      </ScrollReveal>

      <div className="mb-8 grid gap-8 lg:grid-cols-2">
        {/* Income section */}
        <ScrollReveal>
          <section>
            <h3 className="mb-4 text-xl font-bold text-[#f0f0f0]">収入内訳</h3>
            <Card variant="dark" hover>
              <ReportCharts type="income" data={incomeData} />
            </Card>
            <div className="mt-4 overflow-hidden rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] backdrop-blur-sm">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)]">
                  <tr>
                    <th className="px-4 py-3 font-medium text-[#8b949e]">区分</th>
                    <th className="px-4 py-3 text-right font-medium text-[#8b949e]">金額</th>
                  </tr>
                </thead>
                <tbody>
                  {report.incomes.map((income) => (
                    <tr
                      key={income.id}
                      className="border-b border-[rgba(255,255,255,0.04)] transition-colors last:border-0 hover:bg-[rgba(16,185,129,0.04)]"
                    >
                      <td className="px-4 py-3 text-[#c9d1d9]">
                        {INCOME_CATEGORY_LABELS[income.category] ?? income.category}
                        {income.source && (
                          <span className="ml-2 text-xs text-[#6e7681]">({income.source})</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-medium text-[#10B981]">
                        {formatCurrency(income.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </ScrollReveal>

        {/* Expenditure section */}
        <ScrollReveal>
          <section>
            <h3 className="mb-4 text-xl font-bold text-[#f0f0f0]">支出内訳</h3>
            <Card variant="dark" hover>
              <ReportCharts type="expenditure" data={expenditureData} />
            </Card>
            <div className="mt-4 overflow-hidden rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] backdrop-blur-sm">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)]">
                  <tr>
                    <th className="px-4 py-3 font-medium text-[#8b949e]">区分</th>
                    <th className="px-4 py-3 text-right font-medium text-[#8b949e]">金額</th>
                  </tr>
                </thead>
                <tbody>
                  {report.expenditures.map((exp) => (
                    <tr
                      key={exp.id}
                      className="border-b border-[rgba(255,255,255,0.04)] transition-colors last:border-0 hover:bg-[rgba(239,68,68,0.04)]"
                    >
                      <td className="px-4 py-3 text-[#c9d1d9]">
                        {EXPENDITURE_CATEGORY_LABELS[exp.category] ?? exp.category}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-medium text-[#EF4444]">
                        {formatCurrency(exp.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </ScrollReveal>
      </div>
    </div>
  );
}
