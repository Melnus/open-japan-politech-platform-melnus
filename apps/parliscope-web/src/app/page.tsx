import { prisma } from "@ojpp/db";
import { DashboardBillsPanel } from "@/components/dashboard-bills-panel";
import { DashboardHero } from "@/components/dashboard-hero";
import { DashboardStats } from "@/components/dashboard-stats";
import { DashboardStatusGrid } from "@/components/dashboard-status-grid";
import { DashboardVotePanel } from "@/components/dashboard-vote-panel";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [billCount, politicianCount, sessionCount, enactedCount, recentBills, statusCounts] =
    await Promise.all([
      prisma.bill.count(),
      prisma.politician.count(),
      prisma.dietSession.count(),
      prisma.bill.count({ where: { status: "ENACTED" } }),
      prisma.bill.findMany({
        take: 6,
        orderBy: { submittedAt: "desc" },
        include: {
          session: true,
          votes: {
            include: { politician: { include: { party: true } } },
          },
        },
      }),
      prisma.bill.groupBy({
        by: ["status"],
        _count: { id: true },
      }),
    ]);

  const statusMap: Record<string, number> = {};
  for (const item of statusCounts) {
    statusMap[item.status] = item._count.id;
  }

  // Find the most-voted bill for the vote visualization
  const voteBill = recentBills.reduce(
    (best, bill) => (bill.votes.length > best.votes.length ? bill : best),
    recentBills[0],
  );

  const voteData = voteBill
    ? {
        billTitle: voteBill.title,
        forCount: voteBill.votes.filter((v) => v.voteType === "FOR").length,
        againstCount: voteBill.votes.filter((v) => v.voteType === "AGAINST").length,
        abstainCount: voteBill.votes.filter((v) => v.voteType === "ABSTAIN").length,
        partyBreakdown: getPartyBreakdown(voteBill.votes),
      }
    : null;

  const billItems = recentBills.map((bill) => ({
    id: bill.id,
    title: bill.title,
    sessionNumber: bill.session.number,
    status: bill.status,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f23] to-[#1a1033]">
      {/* Hero */}
      <DashboardHero />

      <div className="mx-auto max-w-7xl px-6 pb-16">
        {/* Stats */}
        <section className="-mt-8 mb-10">
          <DashboardStats
            stats={[
              { label: "法案数", value: billCount },
              { label: "議員数", value: politicianCount },
              { label: "成立法案", value: enactedCount },
              { label: "会期数", value: sessionCount },
            ]}
          />
        </section>

        {/* Status Grid */}
        <section className="mb-10">
          <h3 className="mb-4 text-lg font-semibold text-white">ステータス別</h3>
          <DashboardStatusGrid statusMap={statusMap} />
        </section>

        {/* Bills + Votes side by side */}
        <section className="grid gap-6 lg:grid-cols-2">
          <DashboardBillsPanel bills={billItems} />
          {voteData && <DashboardVotePanel vote={voteData} />}
        </section>
      </div>
    </div>
  );
}

// Helper to extract party vote breakdown
function getPartyBreakdown(
  votes: {
    voteType: string;
    politician: { party: { name: string; shortName: string | null; color: string | null } | null };
  }[],
) {
  const PARTY_COLORS: Record<string, string> = {
    自由民主党: "#E8312B",
    自民: "#E8312B",
    立憲民主党: "#1E88E5",
    立憲: "#1E88E5",
    公明党: "#F5DEB3",
    公明: "#F5DEB3",
    日本維新の会: "#E65100",
    維新: "#E65100",
    日本共産党: "#DB0000",
    共産: "#DB0000",
    国民民主党: "#FFD700",
    国民: "#FFD700",
    れいわ新選組: "#ED6D00",
    れいわ: "#ED6D00",
  };

  const partyVotes = new Map<string, { forCount: number; againstCount: number; color: string }>();

  for (const v of votes) {
    const partyName = v.politician.party?.shortName ?? v.politician.party?.name ?? "無所属";
    const existing = partyVotes.get(partyName) ?? {
      forCount: 0,
      againstCount: 0,
      color: v.politician.party?.color ?? PARTY_COLORS[partyName] ?? "#6b7280",
    };
    if (v.voteType === "FOR") existing.forCount++;
    else if (v.voteType === "AGAINST") existing.againstCount++;
    partyVotes.set(partyName, existing);
  }

  return Array.from(partyVotes.entries())
    .slice(0, 6)
    .map(([name, data]) => ({
      name,
      color: data.color,
      voted: (data.forCount >= data.againstCount ? "for" : "against") as "for" | "against",
    }));
}
