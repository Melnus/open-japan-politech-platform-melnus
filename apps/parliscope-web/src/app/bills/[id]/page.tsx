import { prisma } from "@ojpp/db";
import { notFound } from "next/navigation";
import { BillStatusBadge } from "@/components/bill-status-badge";
import { BillTimeline } from "@/components/bill-timeline";
import { DiscussionThread } from "@/components/discussion-thread";
import { VoteChart } from "@/components/vote-chart";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BillDetailPage({ params }: PageProps) {
  const { id } = await params;

  const bill = await prisma.bill.findUnique({
    where: { id },
    include: {
      session: true,
      votes: {
        include: { politician: { include: { party: true } } },
      },
      discussions: {
        where: { parentId: null },
        include: { replies: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!bill) {
    notFound();
  }

  const voteCounts = {
    FOR: bill.votes.filter((v) => v.voteType === "FOR").length,
    AGAINST: bill.votes.filter((v) => v.voteType === "AGAINST").length,
    ABSTAIN: bill.votes.filter((v) => v.voteType === "ABSTAIN").length,
    ABSENT: bill.votes.filter((v) => v.voteType === "ABSENT").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f23] to-[#1a1033]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-6">
          <a
            href="/bills"
            className="inline-flex items-center gap-1 text-sm text-indigo-400 transition-colors hover:text-indigo-300"
          >
            &larr; 法案一覧に戻る
          </a>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-[#8b949e]">{bill.number}</span>
            <BillStatusBadge status={bill.status} />
            {bill.category && (
              <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-medium text-indigo-300">
                {bill.category}
              </span>
            )}
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">{bill.title}</h2>
          <div className="mt-4">
            <BillTimeline currentStatus={bill.status} />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main content */}
          <div className="space-y-6 lg:col-span-2">
            {bill.summary && (
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-6 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.05]">
                <h3 className="mb-3 text-lg font-semibold text-white">概要</h3>
                <p className="leading-relaxed text-[#8b949e]">{bill.summary}</p>
              </div>
            )}

            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-6 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.05]">
              <h3 className="mb-4 text-lg font-semibold text-white">投票結果</h3>
              <VoteChart votes={voteCounts} />
              {bill.votes.length > 0 && (
                <div className="mt-5 space-y-2">
                  <h4 className="text-sm font-medium text-[#8b949e]">投票詳細</h4>
                  <div className="max-h-64 space-y-0.5 overflow-y-auto">
                    {bill.votes.map((vote) => (
                      <div
                        key={vote.id}
                        className="flex items-center justify-between rounded-lg px-3 py-1.5 text-sm transition-colors hover:bg-white/[0.04]"
                      >
                        <a
                          href={`/politicians/${vote.politician.id}`}
                          className="text-white transition-colors hover:text-indigo-300"
                        >
                          {vote.politician.name}
                          {vote.politician.party && (
                            <span className="ml-1.5 text-xs text-[#6b7280]">
                              ({vote.politician.party.shortName ?? vote.politician.party.name})
                            </span>
                          )}
                        </a>
                        <span
                          className={`text-xs font-semibold ${
                            vote.voteType === "FOR"
                              ? "text-emerald-400"
                              : vote.voteType === "AGAINST"
                                ? "text-red-400"
                                : vote.voteType === "ABSTAIN"
                                  ? "text-yellow-400"
                                  : "text-[#6b7280]"
                          }`}
                        >
                          {vote.voteType === "FOR"
                            ? "賛成"
                            : vote.voteType === "AGAINST"
                              ? "反対"
                              : vote.voteType === "ABSTAIN"
                                ? "棄権"
                                : "欠席"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-6 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.05]">
              <h3 className="mb-4 text-lg font-semibold text-white">議論</h3>
              <DiscussionThread discussions={bill.discussions} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-6 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.05]">
              <h3 className="mb-4 text-lg font-semibold text-white">基本情報</h3>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-[#6b7280]">提出者</dt>
                  <dd className="mt-0.5 font-medium text-white">{bill.proposer ?? "不明"}</dd>
                </div>
                <div>
                  <dt className="text-[#6b7280]">会期</dt>
                  <dd className="mt-0.5 font-medium">
                    <a
                      href={`/sessions/${bill.session.id}`}
                      className="text-white transition-colors hover:text-indigo-300"
                    >
                      第{bill.session.number}回国会
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-[#6b7280]">提出日</dt>
                  <dd className="mt-0.5 font-medium text-white">
                    {bill.submittedAt
                      ? new Date(bill.submittedAt).toLocaleDateString("ja-JP")
                      : "不明"}
                  </dd>
                </div>
                {bill.passedAt && (
                  <div>
                    <dt className="text-[#6b7280]">成立日</dt>
                    <dd className="mt-0.5 font-medium text-emerald-400">
                      {new Date(bill.passedAt).toLocaleDateString("ja-JP")}
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-[#6b7280]">投票数</dt>
                  <dd className="mt-0.5 font-medium text-white">{bill.votes.length}票</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
