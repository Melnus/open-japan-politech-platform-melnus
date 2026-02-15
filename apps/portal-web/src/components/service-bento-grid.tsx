"use client";

import { StaggerGrid } from "@ojpp/ui";
import { SERVICES } from "@/lib/constants";
import type { PortalStats } from "@/lib/queries";
import { BroadListeningHeroCard } from "./broadlistening-hero-card";
import { ServiceCard } from "./service-card";

interface ServiceBentoGridProps {
  stats: PortalStats;
}

/** bigint の円額を適切な日本語単位（万/億/兆）に変換 */
function formatYen(value: bigint): { num: number; suffix: string } {
  const n = Number(value);
  if (n >= 1_000_000_000_000) {
    // 兆 (1兆 = 10^12)
    return { num: Math.round(n / 1_000_000_000_000), suffix: "兆" };
  }
  if (n >= 100_000_000) {
    // 億 (1億 = 10^8)
    return { num: Math.round(n / 100_000_000), suffix: "億" };
  }
  if (n >= 10_000) {
    // 万 (1万 = 10^4)
    return { num: Math.round(n / 10_000), suffix: "万" };
  }
  return { num: n, suffix: "" };
}

function buildCardData(serviceId: string, stats: PortalStats) {
  switch (serviceId) {
    case "moneyglass": {
      const income = formatYen(stats.totalIncome);
      const expenditure = formatYen(stats.totalExpenditure);
      return {
        heroValue: income.num,
        heroSuffix: income.suffix,
        heroLabel: "TOTAL INCOME",
        kpis: [
          { label: "EXPENDITURE", value: expenditure.num, suffix: expenditure.suffix },
          { label: "ORGANIZATIONS", value: stats.orgCount },
          { label: "REPORTS", value: stats.reportCount },
        ],
      };
    }
    case "parliscope":
      return {
        heroValue: stats.billCount,
        heroLabel: "BILLS TRACKED",
        kpis: [
          { label: "POLITICIANS", value: stats.politicianCount },
          { label: "SESSIONS", value: stats.sessionCount },
          { label: "VOTES", value: stats.voteCount },
        ],
      };
    case "policydiff":
      return {
        heroValue: stats.policyCount,
        heroLabel: "POLICIES",
        kpis: [
          { label: "CATEGORIES", value: stats.policyCategories },
          { label: "PROPOSALS", value: stats.proposalCount },
        ],
      };
    case "seatmap":
      return {
        heroValue: stats.hrSeats,
        heroLabel: "HR SEATS",
        kpis: [
          { label: "HC SEATS", value: stats.hcSeats },
          { label: "ELECTIONS", value: stats.electionCount },
        ],
      };
    case "culturescope": {
      const budget = formatYen(stats.culturalBudgetTotal);
      return {
        heroValue: budget.num,
        heroSuffix: budget.suffix,
        heroLabel: "CULTURAL BUDGET",
        kpis: [
          { label: "PROGRAMS", value: stats.programCount },
          { label: "STANCES", value: stats.culturalStanceCount },
        ],
      };
    }
    case "socialguard": {
      const social = formatYen(stats.socialBudgetTotal);
      return {
        heroValue: social.num,
        heroSuffix: social.suffix,
        heroLabel: "SOCIAL BUDGET",
        kpis: [
          { label: "PROGRAMS", value: stats.socialProgramCount },
          { label: "PREFECTURES", value: stats.welfarePrefectures },
        ],
      };
    }
    case "broadlistening":
      return {
        heroValue: 42,
        heroLabel: "ACTIVE TOPICS",
        kpis: [
          { label: "OPINIONS", value: 3840 },
          { label: "CONSENSUS RATE", value: 67, suffix: "%" },
        ],
      };
    default:
      return { heroValue: 0, heroLabel: "", kpis: [] };
  }
}

export function ServiceBentoGrid({ stats }: ServiceBentoGridProps) {
  return (
    <StaggerGrid className="bento-grid mx-auto max-w-7xl px-3 sm:px-4">
      {SERVICES.map((service) => {
        const data = buildCardData(service.id, stats);
        if (service.id === "broadlistening") {
          return (
            <BroadListeningHeroCard
              key={service.id}
              service={service}
              kpis={data.kpis}
              heroValue={data.heroValue}
              heroSuffix={data.heroSuffix}
              heroLabel={data.heroLabel}
            />
          );
        }
        return (
          <ServiceCard
            key={service.id}
            service={service}
            kpis={data.kpis}
            heroValue={data.heroValue}
            heroSuffix={data.heroSuffix}
            heroLabel={data.heroLabel}
          />
        );
      })}
    </StaggerGrid>
  );
}
