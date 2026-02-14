interface SessionTimelineProps {
  sessions: Array<{
    id: string;
    number: number;
    type: string;
    startDate: string;
    endDate?: string | null;
    _count?: { bills: number };
  }>;
}

const TYPE_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  ORDINARY: { label: "通常", color: "text-blue-400", bg: "bg-blue-500/15" },
  EXTRAORDINARY: { label: "臨時", color: "text-amber-400", bg: "bg-amber-500/15" },
  SPECIAL: { label: "特別", color: "text-emerald-400", bg: "bg-emerald-500/15" },
};

export function SessionTimeline({ sessions }: SessionTimelineProps) {
  return (
    <div className="space-y-3">
      {sessions.map((session) => {
        const typeConfig = TYPE_LABELS[session.type] ?? {
          label: session.type,
          color: "text-[#8b949e]",
          bg: "bg-white/[0.06]",
        };
        return (
          <a
            key={session.id}
            href={`/sessions/${session.id}`}
            className="group block rounded-xl border border-white/[0.06] bg-white/[0.03] p-5 transition-all duration-300 hover:border-indigo-500/30 hover:bg-white/[0.05] hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-indigo-400 transition-colors group-hover:text-indigo-300">
                  第{session.number}回
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${typeConfig.bg} ${typeConfig.color}`}
                >
                  {typeConfig.label}国会
                </span>
              </div>
              {session._count && (
                <span className="text-sm text-[#6b7280]">{session._count.bills}件の法案</span>
              )}
            </div>
            <div className="mt-1.5 text-sm text-[#8b949e]">
              {new Date(session.startDate).toLocaleDateString("ja-JP")}
              {session.endDate && ` 〜 ${new Date(session.endDate).toLocaleDateString("ja-JP")}`}
            </div>
          </a>
        );
      })}
    </div>
  );
}
