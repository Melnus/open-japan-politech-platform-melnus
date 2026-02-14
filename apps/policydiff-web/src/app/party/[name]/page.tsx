import { prisma } from "@ojpp/db";
import { notFound } from "next/navigation";
import { PolicyCard } from "@/components/policy-card";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ name: string }>;
}

export default async function PartyPage({ params }: Props) {
  const { name } = await params;
  const partyName = decodeURIComponent(name);

  const party = await prisma.party.findUnique({
    where: { name: partyName },
    include: {
      policies: {
        orderBy: { category: "asc" },
      },
    },
  });

  if (!party) {
    notFound();
  }

  const categoriesMap = new Map<string, typeof party.policies>();
  for (const policy of party.policies) {
    const existing = categoriesMap.get(policy.category) ?? [];
    existing.push(policy);
    categoriesMap.set(policy.category, existing);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div
          className="mb-8 rounded-xl border-l-4 glass-card p-6"
          style={{ borderLeftColor: party.color ?? "#6b7280" }}
        >
          <div className="flex items-center gap-3">
            {party.color && (
              <span
                className="inline-block h-4 w-4 rounded-full"
                style={{
                  backgroundColor: party.color,
                  boxShadow: `0 0 10px ${party.color}60`,
                }}
              />
            )}
            <h2 className="text-3xl font-bold text-white">{party.name}</h2>
            {party.shortName && (
              <span
                className="rounded-full px-3 py-1 text-xs font-medium"
                style={{
                  backgroundColor: `${party.color ?? "#6b7280"}20`,
                  color: party.color ?? "#94a3b8",
                }}
              >
                {party.shortName}
              </span>
            )}
          </div>
          <p className="mt-2 text-slate-400">登録政策数: {party.policies.length}件</p>
          {party.website && (
            <a
              href={party.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              公式サイト
            </a>
          )}
        </div>

        {Array.from(categoriesMap.entries()).map(([category, policies]) => (
          <section key={category} className="mb-8">
            <h3 className="mb-4 text-xl font-bold text-white">{category}</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {policies.map((policy) => (
                <PolicyCard
                  key={policy.id}
                  id={policy.id}
                  title={policy.title}
                  category={policy.category}
                  partyName={party.name}
                  partyColor={party.color}
                  status={policy.status}
                  contentPreview={policy.content
                    .slice(0, 100)
                    .replace(/[#*\n]/g, " ")
                    .trim()}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
