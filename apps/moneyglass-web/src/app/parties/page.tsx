import { formatCurrency, getBaseUrl } from "@/lib/format";
import { PartyCards } from "./party-cards";

interface PartyData {
  id: string;
  name: string;
  shortName: string | null;
  color: string | null;
  organizationCount: number;
  totalIncome: string;
  totalExpenditure: string;
}

async function getParties(): Promise<PartyData[]> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/parties`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch parties");
  return res.json();
}

export default async function PartiesPage() {
  let parties: PartyData[] = [];
  try {
    parties = await getParties();
  } catch {
    // fallback
  }

  const sortedParties = parties.sort((a, b) => Number(b.totalIncome) - Number(a.totalIncome));

  // Find max income for relative bar widths
  const maxIncome = sortedParties.length > 0 ? Number(sortedParties[0].totalIncome) : 1;

  return (
    <div className="mx-auto max-w-7xl px-8 py-12">
      <div className="mb-10">
        <h2 className="mb-3 text-3xl font-bold tracking-tight text-white">政党別資金集計</h2>
        <p className="text-[#8b949e]">各政党の政治団体における資金の総計を比較</p>
      </div>

      {parties.length === 0 ? (
        <div className="glass-card rounded-xl p-8">
          <p className="text-center text-[#8b949e]">データがありません</p>
        </div>
      ) : (
        <PartyCards
          parties={sortedParties.map((party) => ({
            id: party.id,
            name: party.name,
            color: party.color,
            organizationCount: party.organizationCount,
            totalIncome: party.totalIncome,
            totalExpenditure: party.totalExpenditure,
            formattedIncome: formatCurrency(party.totalIncome),
            formattedExpenditure: formatCurrency(party.totalExpenditure),
            incomeRatio: Number(party.totalIncome) / maxIncome,
            expenditureRatio: Math.min(
              100,
              (Number(party.totalExpenditure) / Math.max(1, Number(party.totalIncome))) * 100,
            ),
          }))}
        />
      )}
    </div>
  );
}
