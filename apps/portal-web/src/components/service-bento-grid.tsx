"use client";

import { StaggerGrid } from "@ojpp/ui";
import { SERVICES } from "@/lib/constants";
import type { PortalStats } from "@/lib/queries";
import { ServiceCard } from "./service-card";

interface ServiceBentoGridProps {
  stats: PortalStats;
}

function buildCardData(serviceId: string, stats: PortalStats) {
  switch (serviceId) {
    case "moneyglass":
      return {
        heroValue: Number(stats.totalIncome / 10000n),
        heroSuffix: "万",
        heroLabel: "TOTAL INCOME",
        kpis: [
          { label: "EXPENDITURE", value: Number(stats.totalExpenditure / 10000n), suffix: "万" },
          { label: "ORGANIZATIONS", value: stats.orgCount },
          { label: "REPORTS", value: stats.reportCount },
        ],
      };
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
    case "culturescope":
      return {
        heroValue: Number(stats.culturalBudgetTotal),
        heroSuffix: "M",
        heroLabel: "CULTURAL BUDGET",
        kpis: [
          { label: "PROGRAMS", value: stats.programCount },
          { label: "STANCES", value: stats.culturalStanceCount },
        ],
      };
    case "socialguard":
      return {
        heroValue: Number(stats.socialBudgetTotal),
        heroSuffix: "億",
        heroLabel: "SOCIAL BUDGET",
        kpis: [
          { label: "PROGRAMS", value: stats.socialProgramCount },
          { label: "PREFECTURES", value: stats.welfarePrefectures },
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
