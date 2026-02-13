import { ApiShowcase } from "@/components/api-showcase";
import { HeroBanner } from "@/components/hero-banner";
import { LiveStatsBar } from "@/components/live-stats-bar";
import { PlatformScore } from "@/components/platform-score";
import { PortalNav } from "@/components/portal-nav";
import { ServiceBentoGrid } from "@/components/service-bento-grid";
import { getPortalStats } from "@/lib/queries";

export const revalidate = 300;

export default async function PortalPage() {
  const stats = await getPortalStats();

  const totalRecords =
    stats.reportCount +
    stats.billCount +
    stats.policyCount +
    stats.electionCount +
    stats.programCount +
    stats.socialProgramCount +
    stats.politicianCount +
    stats.orgCount;

  const now = new Date();
  const lastUpdated = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  const scoreItems = [
    { label: "政党", value: stats.partyCount },
    { label: "法案", value: stats.billCount, suffix: "+" },
    { label: "議員", value: stats.politicianCount },
    { label: "政治団体", value: stats.orgCount, suffix: "+" },
    { label: "政策", value: stats.policyCount },
    { label: "選挙", value: stats.electionCount },
  ];

  return (
    <div className="flex flex-col">
      <PortalNav />
      <HeroBanner />
      <LiveStatsBar totalRecords={totalRecords} lastUpdated={lastUpdated} />
      <div className="py-3">
        <PlatformScore items={scoreItems} />
      </div>
      <section className="py-6">
        <div className="mx-auto max-w-7xl px-3 sm:px-4">
          <p className="label-upper mb-4 tracking-[3px]">{"// ACTIVE MODULES"}</p>
        </div>
        <ServiceBentoGrid stats={stats} />
      </section>
      <ApiShowcase />
    </div>
  );
}
