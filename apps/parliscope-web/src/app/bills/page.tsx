import { prisma } from "@ojpp/db";
import { BillCard } from "@/components/bill-card";
import { BillListAnimated } from "./bill-list-animated";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    status?: string;
    sessionId?: string;
    category?: string;
    page?: string;
  }>;
}

const STATUSES = [
  { value: "", label: "すべて" },
  {
    value: "ENACTED",
    label: "成立",
    activeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  },
  {
    value: "COMMITTEE",
    label: "委員会審議中",
    activeClass: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
  },
  {
    value: "SUBMITTED",
    label: "提出",
    activeClass: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  },
  { value: "REJECTED", label: "否決", activeClass: "bg-red-500/20 text-red-300 border-red-500/40" },
  {
    value: "WITHDRAWN",
    label: "撤回",
    activeClass: "bg-red-500/20 text-red-300 border-red-500/40",
  },
];

export default async function BillsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const limit = 20;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (params.status) where.status = params.status;
  if (params.sessionId) where.sessionId = params.sessionId;
  if (params.category) where.category = params.category;

  const [bills, total, sessions] = await Promise.all([
    prisma.bill.findMany({
      where,
      skip,
      take: limit,
      orderBy: { submittedAt: "desc" },
      include: { session: true },
    }),
    prisma.bill.count({ where }),
    prisma.dietSession.findMany({ orderBy: { number: "desc" } }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f23] to-[#1a1033]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="mb-2 text-3xl font-bold tracking-tight text-white">法案一覧</h2>
          <p className="text-[#8b949e]">国会に提出された法案を検索・フィルターできます</p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
          <div>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#6b7280]">
              ステータス
            </span>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => {
                const isActive = (params.status ?? "") === s.value;
                const defaultActiveClass = "bg-indigo-500/20 text-indigo-300 border-indigo-500/40";
                return (
                  <a
                    key={s.value}
                    href={`/bills?status=${s.value}&sessionId=${params.sessionId ?? ""}&category=${params.category ?? ""}`}
                    className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? (s.activeClass ?? defaultActiveClass)
                        : "border-white/[0.08] text-[#8b949e] hover:border-white/[0.15] hover:bg-white/[0.04] hover:text-white"
                    }`}
                  >
                    {s.label}
                  </a>
                );
              })}
            </div>
          </div>
          <div>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#6b7280]">
              会期
            </span>
            <div className="flex flex-wrap gap-2">
              <a
                href={`/bills?status=${params.status ?? ""}&sessionId=&category=${params.category ?? ""}`}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
                  !params.sessionId
                    ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"
                    : "border-white/[0.08] text-[#8b949e] hover:border-white/[0.15] hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                すべて
              </a>
              {sessions.slice(0, 5).map((s) => (
                <a
                  key={s.id}
                  href={`/bills?status=${params.status ?? ""}&sessionId=${s.id}&category=${params.category ?? ""}`}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
                    params.sessionId === s.id
                      ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"
                      : "border-white/[0.08] text-[#8b949e] hover:border-white/[0.15] hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  第{s.number}回
                </a>
              ))}
            </div>
          </div>
        </div>

        <p className="mb-4 text-sm text-[#6b7280]">{total}件の法案</p>

        <BillListAnimated>
          {bills.map((bill) => (
            <BillCard
              key={bill.id}
              id={bill.id}
              number={bill.number}
              title={bill.title}
              summary={bill.summary}
              proposer={bill.proposer}
              category={bill.category}
              status={bill.status}
              submittedAt={bill.submittedAt?.toISOString() ?? null}
            />
          ))}
        </BillListAnimated>

        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            {page > 1 && (
              <a
                href={`/bills?status=${params.status ?? ""}&sessionId=${params.sessionId ?? ""}&category=${params.category ?? ""}&page=${page - 1}`}
                className="rounded-lg border border-white/[0.08] px-4 py-2 text-sm text-[#8b949e] transition-all hover:border-white/[0.15] hover:bg-white/[0.04] hover:text-white"
              >
                前へ
              </a>
            )}
            <span className="px-4 py-2 text-sm text-[#6b7280]">
              {page} / {totalPages}
            </span>
            {page < totalPages && (
              <a
                href={`/bills?status=${params.status ?? ""}&sessionId=${params.sessionId ?? ""}&category=${params.category ?? ""}&page=${page + 1}`}
                className="rounded-lg border border-white/[0.08] px-4 py-2 text-sm text-[#8b949e] transition-all hover:border-white/[0.15] hover:bg-white/[0.04] hover:text-white"
              >
                次へ
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
