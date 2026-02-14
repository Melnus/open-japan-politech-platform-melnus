import { prisma } from "@ojpp/db";
import { DashboardClient } from "@/components/dashboard-client";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [
    policyCount,
    partyCount,
    proposalCount,
    parties,
    categories,
    recentPolicies,
    recentProposals,
  ] = await Promise.all([
    prisma.policy.count(),
    prisma.party.count({ where: { isActive: true, name: { not: "無所属" } } }),
    prisma.policyProposal.count(),
    prisma.party.findMany({
      where: { isActive: true, name: { not: "無所属" } },
      orderBy: { name: "asc" },
    }),
    prisma.policy.groupBy({
      by: ["category"],
      _count: { id: true },
      orderBy: { category: "asc" },
    }),
    prisma.policy.findMany({
      take: 12,
      orderBy: { updatedAt: "desc" },
      include: { party: true },
    }),
    prisma.policyProposal.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        policy: { include: { party: true } },
      },
    }),
  ]);

  const categoryCount = categories.length;

  // Serialize data for the client component
  const serializedParties = parties.map((p) => ({
    id: p.id,
    name: p.name,
    color: p.color,
  }));

  const serializedCategories = categories.map((c) => ({
    category: c.category,
    count: c._count.id,
  }));

  const serializedPolicies = recentPolicies.map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    content: p.content.slice(0, 120),
    partyName: p.party?.name ?? null,
    partyColor: p.party?.color ?? null,
  }));

  const serializedProposals = recentProposals.map((pr) => ({
    id: pr.id,
    title: pr.title,
    status: pr.status,
    partyName: pr.policy.party?.name ?? null,
    policyTitle: pr.policy.title,
  }));

  return (
    <DashboardClient
      stats={{ policyCount, partyCount, categoryCount, proposalCount }}
      parties={serializedParties}
      categories={serializedCategories}
      policies={serializedPolicies}
      proposals={serializedProposals}
    />
  );
}
