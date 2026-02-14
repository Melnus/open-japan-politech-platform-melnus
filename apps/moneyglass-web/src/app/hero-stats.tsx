"use client";

import { AnimatedCounter, StaggerGrid, StaggerItem } from "@ojpp/ui";

interface HeroStatsProps {
  organizationCount: number;
  reportCount: number;
  totalIncome: string;
  totalExpenditure: string;
}

function toOku(value: string): number {
  return Math.round(Number(value) / 100_000_000);
}

const statItems = [
  { key: "org", label: "登録団体数", suffix: "" },
  { key: "report", label: "収支報告書", suffix: "" },
  { key: "income", label: "総収入合計", suffix: "億円" },
  { key: "expenditure", label: "総支出合計", suffix: "億円" },
] as const;

export function HeroStats({
  organizationCount,
  reportCount,
  totalIncome,
  totalExpenditure,
}: HeroStatsProps) {
  const values: Record<string, number> = {
    org: organizationCount,
    report: reportCount,
    income: toOku(totalIncome),
    expenditure: toOku(totalExpenditure),
  };

  return (
    <StaggerGrid className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {statItems.map((item) => (
        <StaggerItem key={item.key}>
          <div className="glass-card-accent glow-orange rounded-xl p-6 transition-all duration-300 hover:scale-[1.02] glow-orange-hover">
            <p className="text-sm font-medium text-[#8b949e]">{item.label}</p>
            <p className="mt-2 text-3xl font-bold text-[#FF6B35]">
              <AnimatedCounter end={values[item.key]} suffix={item.suffix} />
            </p>
          </div>
        </StaggerItem>
      ))}
    </StaggerGrid>
  );
}
