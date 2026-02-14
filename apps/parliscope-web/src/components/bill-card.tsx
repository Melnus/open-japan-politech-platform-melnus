import { BillStatusBadge } from "./bill-status-badge";

interface BillCardProps {
  id: string;
  number: string;
  title: string;
  summary?: string | null;
  proposer?: string | null;
  category?: string | null;
  status: string;
  submittedAt?: string | null;
}

export function BillCard({
  id,
  number,
  title,
  summary,
  proposer,
  category,
  status,
  submittedAt,
}: BillCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03] p-5 transition-all duration-300 hover:border-indigo-500/30 hover:bg-white/[0.05] hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-0.5">
      {/* Left accent bar */}
      <div
        className={`absolute inset-y-0 left-0 w-0.5 transition-all duration-300 group-hover:w-1 ${
          status === "ENACTED"
            ? "bg-emerald-500"
            : status === "REJECTED" || status === "WITHDRAWN"
              ? "bg-red-500"
              : status === "COMMITTEE" || status === "PLENARY"
                ? "bg-yellow-500"
                : "bg-indigo-500"
        }`}
      />
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-[#8b949e]">{number}</span>
            <BillStatusBadge status={status} />
            {category && (
              <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-medium text-indigo-300">
                {category}
              </span>
            )}
          </div>
          <a
            href={`/bills/${id}`}
            className="text-lg font-semibold text-white transition-colors group-hover:text-indigo-300"
          >
            {title}
          </a>
          {summary && (
            <p className="mt-1.5 text-sm leading-relaxed text-[#8b949e] line-clamp-2">{summary}</p>
          )}
          <div className="mt-3 flex items-center gap-4 text-xs text-[#6b7280]">
            {proposer && <span>提出: {proposer}</span>}
            {submittedAt && <span>{new Date(submittedAt).toLocaleDateString("ja-JP")}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
