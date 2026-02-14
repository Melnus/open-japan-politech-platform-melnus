import { prisma } from "@ojpp/db";
import { notFound } from "next/navigation";
import { BillStatusBadge } from "@/components/bill-status-badge";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

const TYPE_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  ORDINARY: { label: "通常国会", color: "text-blue-400", bg: "bg-blue-500/15" },
  EXTRAORDINARY: { label: "臨時国会", color: "text-amber-400", bg: "bg-amber-500/15" },
  SPECIAL: { label: "特別国会", color: "text-emerald-400", bg: "bg-emerald-500/15" },
};

export default async function SessionDetailPage({ params }: PageProps) {
  const { id } = await params;

  const session = await prisma.dietSession.findUnique({
    where: { id },
    include: {
      bills: {
        orderBy: { submittedAt: "desc" },
      },
    },
  });

  if (!session) {
    notFound();
  }

  const typeConfig = TYPE_LABELS[session.type] ?? {
    label: session.type,
    color: "text-[#8b949e]",
    bg: "bg-white/[0.06]",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f23] to-[#1a1033]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-6">
          <a
            href="/sessions"
            className="inline-flex items-center gap-1 text-sm text-indigo-400 transition-colors hover:text-indigo-300"
          >
            &larr; 会期一覧に戻る
          </a>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              第{session.number}回国会
            </h2>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${typeConfig.bg} ${typeConfig.color}`}
            >
              {typeConfig.label}
            </span>
          </div>
          <p className="mt-2 text-[#8b949e]">
            {new Date(session.startDate).toLocaleDateString("ja-JP")}
            {session.endDate && ` 〜 ${new Date(session.endDate).toLocaleDateString("ja-JP")}`}
          </p>
          <p className="mt-1 text-sm text-[#6b7280]">{session.bills.length}件の法案</p>
        </div>

        <h3 className="mb-4 text-xl font-bold text-white">法案一覧</h3>
        <div className="space-y-3">
          {session.bills.map((bill) => (
            <div
              key={bill.id}
              className="group rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.05] hover:shadow-lg hover:shadow-indigo-500/5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex flex-wrap items-center gap-2">
                    <span className="text-xs text-[#6b7280]">{bill.number}</span>
                    <BillStatusBadge status={bill.status} />
                    {bill.category && (
                      <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-medium text-indigo-300">
                        {bill.category}
                      </span>
                    )}
                  </div>
                  <a
                    href={`/bills/${bill.id}`}
                    className="font-semibold text-white transition-colors group-hover:text-indigo-300"
                  >
                    {bill.title}
                  </a>
                  {bill.summary && (
                    <p className="mt-1 text-sm text-[#8b949e] line-clamp-1">{bill.summary}</p>
                  )}
                </div>
                <span className="shrink-0 text-xs text-[#6b7280]">
                  {bill.submittedAt ? new Date(bill.submittedAt).toLocaleDateString("ja-JP") : ""}
                </span>
              </div>
            </div>
          ))}
          {session.bills.length === 0 && (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-6">
              <p className="text-center text-[#6b7280]">この会期の法案データはありません。</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
