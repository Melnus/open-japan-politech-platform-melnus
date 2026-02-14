import { Badge, Card, FadeIn, ScrollReveal } from "@ojpp/ui";
import { notFound } from "next/navigation";
import { formatCurrency, getBaseUrl } from "@/lib/format";

const ORG_TYPE_LABELS: Record<string, string> = {
  PARTY_BRANCH: "政党支部",
  FUND_MANAGEMENT: "資金管理団体",
  SUPPORT_GROUP: "後援会",
  POLITICAL_COMMITTEE: "政治資金委員会",
  OTHER: "その他",
};

interface OrgDetail {
  id: string;
  name: string;
  type: string;
  address: string | null;
  representative: string | null;
  treasurer: string | null;
  party: { id: string; name: string; shortName: string | null; color: string | null } | null;
  fundReports: {
    id: string;
    fiscalYear: number;
    totalIncome: string;
    totalExpenditure: string;
    balance: string;
    status: string;
  }[];
}

async function getOrganization(id: string): Promise<OrgDetail | null> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/organizations/${id}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch organization");
  return res.json();
}

export default async function OrganizationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const org = await getOrganization(id);
  if (!org) notFound();

  const partyColor = org.party?.color ?? "#6B7280";

  return (
    <div className="mx-auto max-w-7xl px-8 py-12">
      {/* Breadcrumb */}
      <div className="mb-3 text-sm text-[#6e7681]">
        <a href="/organizations" className="text-[#8b949e] transition-colors hover:text-[#FF8C5A]">
          団体一覧
        </a>
        <span className="mx-2">/</span>
        <span className="text-[#c9d1d9]">{org.name}</span>
      </div>

      <FadeIn direction="up" delay={0}>
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-3xl font-bold text-[#f0f0f0]">{org.name}</h2>
            {org.party && (
              <span
                className="rounded-full px-3 py-1 text-sm font-medium text-white"
                style={{
                  backgroundColor: partyColor,
                  boxShadow: `0 0 12px ${partyColor}40`,
                }}
              >
                {org.party.name}
              </span>
            )}
          </div>
          <Badge theme="dark" className="mt-2">
            {ORG_TYPE_LABELS[org.type] ?? org.type}
          </Badge>
        </div>
      </FadeIn>

      <ScrollReveal>
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card variant="dark">
            <p className="text-sm text-[#8b949e]">住所</p>
            <p className="mt-1 font-medium text-[#f0f0f0]">{org.address ?? "-"}</p>
          </Card>
          <Card variant="dark">
            <p className="text-sm text-[#8b949e]">代表者</p>
            <p className="mt-1 font-medium text-[#f0f0f0]">{org.representative ?? "-"}</p>
          </Card>
          <Card variant="dark">
            <p className="text-sm text-[#8b949e]">会計責任者</p>
            <p className="mt-1 font-medium text-[#f0f0f0]">{org.treasurer ?? "-"}</p>
          </Card>
        </div>
      </ScrollReveal>

      <ScrollReveal>
        <section>
          <h3 className="mb-4 text-xl font-bold text-[#f0f0f0]">収支報告書一覧</h3>
          {org.fundReports.length === 0 ? (
            <div className="glass-card rounded-xl p-8">
              <p className="text-center text-[#8b949e]">報告書がありません</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] backdrop-blur-sm">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)]">
                  <tr>
                    <th className="px-4 py-3 font-medium text-[#8b949e]">年度</th>
                    <th className="px-4 py-3 text-right font-medium text-[#8b949e]">収入</th>
                    <th className="px-4 py-3 text-right font-medium text-[#8b949e]">支出</th>
                    <th className="px-4 py-3 text-right font-medium text-[#8b949e]">残高</th>
                    <th className="px-4 py-3 font-medium text-[#8b949e]">ステータス</th>
                  </tr>
                </thead>
                <tbody>
                  {org.fundReports.map((report) => (
                    <tr
                      key={report.id}
                      className="border-b border-[rgba(255,255,255,0.04)] transition-colors last:border-0 hover:bg-[rgba(255,255,255,0.04)]"
                    >
                      <td className="px-4 py-3">
                        <a
                          href={`/reports/${report.id}`}
                          className="font-medium text-[#FF8C5A] transition-colors hover:text-[#FFB88C] hover:underline"
                        >
                          {report.fiscalYear}年
                        </a>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-[#10B981]">
                        {formatCurrency(report.totalIncome)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-[#EF4444]">
                        {formatCurrency(report.totalExpenditure)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-[#60A5FA]">
                        {formatCurrency(report.balance)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          theme="dark"
                          variant={report.status === "PUBLISHED" ? "success" : "default"}
                        >
                          {report.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </ScrollReveal>
    </div>
  );
}
