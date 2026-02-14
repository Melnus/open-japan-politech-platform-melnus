import { prisma } from "@ojpp/db";
import { notFound } from "next/navigation";
import { MarkdownRenderer } from "@/components/markdown-renderer";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PolicyPage({ params }: Props) {
  const { id } = await params;

  const policy = await prisma.policy.findUnique({
    where: { id },
    include: {
      party: true,
      proposals: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!policy) {
    notFound();
  }

  const statusStyle =
    policy.status === "PUBLISHED"
      ? { bg: "rgba(34, 197, 94, 0.15)", color: "#4ade80" }
      : policy.status === "DRAFT"
        ? { bg: "rgba(251, 191, 36, 0.15)", color: "#fbbf24" }
        : { bg: "rgba(148, 163, 184, 0.15)", color: "#94a3b8" };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-6">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span
              className="tag-badge"
              style={{
                backgroundColor: "rgba(59, 130, 246, 0.15)",
                color: "#60a5fa",
              }}
            >
              {policy.category}
            </span>
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}
            >
              {policy.status}
            </span>
            {policy.party && (
              <a
                href={`/party/${encodeURIComponent(policy.party.name)}`}
                className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition-all hover:scale-[1.04]"
                style={{
                  borderColor: `${policy.party.color ?? "#6b7280"}60`,
                  color: policy.party.color ?? "#94a3b8",
                }}
              >
                {policy.party.color && (
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: policy.party.color }}
                  />
                )}
                {policy.party.name}
              </a>
            )}
          </div>
          <h2 className="text-3xl font-bold text-white">{policy.title}</h2>
          {policy.publishedAt && (
            <p className="mt-2 text-sm text-slate-500">
              公開日: {new Date(policy.publishedAt).toLocaleDateString("ja-JP")}
            </p>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="glass-card p-6">
              <MarkdownRenderer content={policy.content} />
            </div>
          </div>

          <div className="space-y-6">
            {policy.party && (
              <div className="glass-card p-5">
                <h3 className="mb-3 text-sm font-bold text-slate-500 uppercase tracking-wider">
                  政党情報
                </h3>
                <div className="flex items-center gap-2">
                  {policy.party.color && (
                    <span
                      className="inline-block h-3 w-3 rounded-full"
                      style={{ backgroundColor: policy.party.color }}
                    />
                  )}
                  <a
                    href={`/party/${encodeURIComponent(policy.party.name)}`}
                    className="font-medium text-white transition-colors hover:text-blue-400"
                  >
                    {policy.party.name}
                  </a>
                </div>
              </div>
            )}

            <div className="glass-card p-5">
              <h3 className="mb-3 text-sm font-bold text-slate-500 uppercase tracking-wider">
                メタデータ
              </h3>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-slate-500">バージョン</dt>
                  <dd className="font-medium text-white">v{policy.version}</dd>
                </div>
                {policy.gitRef && (
                  <div>
                    <dt className="text-slate-500">Git Ref</dt>
                    <dd className="font-mono text-xs text-slate-400">{policy.gitRef}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="glass-card p-5">
              <h3 className="mb-3 text-sm font-bold text-slate-500 uppercase tracking-wider">
                変更提案 ({policy.proposals.length}件)
              </h3>
              {policy.proposals.length > 0 ? (
                <div className="space-y-2">
                  {policy.proposals.map((proposal) => {
                    const propStyle =
                      proposal.status === "OPEN"
                        ? { bg: "rgba(59, 130, 246, 0.15)", color: "#60a5fa" }
                        : proposal.status === "ACCEPTED"
                          ? { bg: "rgba(34, 197, 94, 0.15)", color: "#4ade80" }
                          : proposal.status === "REJECTED"
                            ? { bg: "rgba(239, 68, 68, 0.15)", color: "#f87171" }
                            : { bg: "rgba(148, 163, 184, 0.15)", color: "#94a3b8" };
                    return (
                      <div key={proposal.id} className="rounded-lg border border-white/5 p-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium text-white">{proposal.title}</span>
                          <span
                            className="rounded-full px-2 py-0.5 text-xs font-medium"
                            style={{ backgroundColor: propStyle.bg, color: propStyle.color }}
                          >
                            {proposal.status}
                          </span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                          {proposal.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-slate-500">まだ変更提案はありません。</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
