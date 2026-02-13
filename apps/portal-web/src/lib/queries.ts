import { prisma } from "@ojpp/db";

export interface PortalStats {
  // Core political entities
  partyCount: number;
  politicianCount: number;
  orgCount: number;
  prefectureCount: number;

  // MoneyGlass
  reportCount: number;
  totalIncome: bigint;
  totalExpenditure: bigint;

  // ParliScope
  billCount: number;
  voteCount: number;
  sessionCount: number;

  // PolicyDiff
  policyCount: number;
  policyCategories: number;
  proposalCount: number;

  // SeatMap
  electionCount: number;
  hrSeats: number;
  hcSeats: number;

  // CultureScope
  culturalBudgetTotal: bigint;
  programCount: number;
  culturalStanceCount: number;

  // SocialGuard
  socialBudgetTotal: bigint;
  socialProgramCount: number;
  welfarePrefectures: number;
}

const FALLBACK_STATS: PortalStats = {
  partyCount: 15,
  politicianCount: 713,
  orgCount: 200,
  prefectureCount: 47,
  reportCount: 66,
  totalIncome: 58_000_000_000n,
  totalExpenditure: 52_000_000_000n,
  billCount: 90,
  voteCount: 350,
  sessionCount: 21,
  policyCount: 130,
  policyCategories: 10,
  proposalCount: 45,
  electionCount: 9,
  hrSeats: 465,
  hcSeats: 248,
  culturalBudgetTotal: 106_700_000_000n,
  programCount: 20,
  culturalStanceCount: 13,
  socialBudgetTotal: 36_800_000_000_000n,
  socialProgramCount: 24,
  welfarePrefectures: 47,
};

export async function getPortalStats(): Promise<PortalStats> {
  try {
    const [
      partyCount,
      politicianCount,
      orgCount,
      prefectureCount,
      reportCount,
      incomeAgg,
      expenditureAgg,
      billCount,
      voteCount,
      sessionCount,
      policyCount,
      policyCats,
      proposalCount,
      electionCount,
      hrSeats,
      hcSeats,
      culturalBudgetAgg,
      programCount,
      culturalStanceCount,
      socialBudgetAgg,
      socialProgramCount,
      welfarePrefectures,
    ] = await Promise.all([
      prisma.party.count({ where: { isActive: true } }),
      prisma.politician.count(),
      prisma.politicalOrganization.count(),
      prisma.prefecture.count(),

      // MoneyGlass
      prisma.fundReport.count(),
      prisma.fundReport.aggregate({ _sum: { totalIncome: true } }),
      prisma.fundReport.aggregate({ _sum: { totalExpenditure: true } }),

      // ParliScope
      prisma.bill.count(),
      prisma.vote.count(),
      prisma.dietSession.count(),

      // PolicyDiff
      prisma.policy.count(),
      prisma.policy.groupBy({ by: ["category"] }).then((r) => r.length),
      prisma.policyProposal.count(),

      // SeatMap
      prisma.election.count(),
      prisma.election
        .findFirst({
          where: { chamber: "HOUSE_OF_REPRESENTATIVES" },
          orderBy: { date: "desc" },
          select: { totalSeats: true },
        })
        .then((r) => r?.totalSeats ?? 465),
      prisma.election
        .findFirst({
          where: { chamber: "HOUSE_OF_COUNCILLORS" },
          orderBy: { date: "desc" },
          select: { totalSeats: true },
        })
        .then((r) => r?.totalSeats ?? 248),

      // CultureScope
      prisma.culturalBudget.aggregate({
        _sum: { amount: true },
        where: { category: "TOTAL" },
      }),
      prisma.culturalProgram.count(),
      prisma.culturalStance.count(),

      // SocialGuard
      prisma.socialSecurityBudget.aggregate({
        _sum: { amount: true },
        where: { category: "TOTAL" },
      }),
      prisma.socialSecurityProgram.count(),
      prisma.welfareStat.groupBy({ by: ["prefectureId"] }).then((r) => r.length),
    ]);

    return {
      partyCount,
      politicianCount,
      orgCount,
      prefectureCount,
      reportCount,
      totalIncome: incomeAgg._sum.totalIncome ?? 0n,
      totalExpenditure: expenditureAgg._sum.totalExpenditure ?? 0n,
      billCount,
      voteCount,
      sessionCount,
      policyCount,
      policyCategories: policyCats,
      proposalCount,
      electionCount,
      hrSeats,
      hcSeats,
      culturalBudgetTotal: culturalBudgetAgg._sum.amount ?? 0n,
      programCount,
      culturalStanceCount,
      socialBudgetTotal: socialBudgetAgg._sum.amount ?? 0n,
      socialProgramCount,
      welfarePrefectures,
    };
  } catch (e) {
    console.warn("[portal] DB unreachable, using fallback stats:", (e as Error).message);
    return FALLBACK_STATS;
  }
}
