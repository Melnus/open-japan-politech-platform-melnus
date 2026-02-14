interface Reply {
  id: string;
  content: string;
  stance?: string | null;
  createdAt: string | Date;
}

interface Discussion {
  id: string;
  content: string;
  stance?: string | null;
  createdAt: string | Date;
  replies: Reply[];
}

const STANCE_MAP: Record<string, { label: string; color: string; bg: string }> = {
  FOR: { label: "賛成", color: "text-emerald-400", bg: "bg-emerald-500/15" },
  AGAINST: { label: "反対", color: "text-red-400", bg: "bg-red-500/15" },
  NEUTRAL: { label: "中立", color: "text-[#8b949e]", bg: "bg-white/[0.06]" },
};

export function DiscussionThread({ discussions }: { discussions: Discussion[] }) {
  if (discussions.length === 0) {
    return <p className="text-sm text-[#6b7280]">まだ議論がありません。</p>;
  }

  return (
    <div className="space-y-4">
      {discussions.map((d) => {
        const stanceConfig = d.stance ? STANCE_MAP[d.stance] : null;
        return (
          <div key={d.id} className="border-l-2 border-white/[0.1] pl-4">
            <div className="flex items-center gap-2">
              {stanceConfig && (
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${stanceConfig.bg} ${stanceConfig.color}`}
                >
                  {stanceConfig.label}
                </span>
              )}
              <span className="text-xs text-[#6b7280]">
                {new Date(d.createdAt).toLocaleDateString("ja-JP")}
              </span>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-[#8b949e]">{d.content}</p>
            {d.replies.length > 0 && (
              <div className="mt-3 space-y-2 pl-4">
                {d.replies.map((r) => {
                  const replyStance = r.stance ? STANCE_MAP[r.stance] : null;
                  return (
                    <div key={r.id} className="border-l border-white/[0.06] pl-3">
                      <div className="flex items-center gap-2">
                        {replyStance && (
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${replyStance.bg} ${replyStance.color}`}
                          >
                            {replyStance.label}
                          </span>
                        )}
                        <span className="text-xs text-[#6b7280]">
                          {new Date(r.createdAt).toLocaleDateString("ja-JP")}
                        </span>
                      </div>
                      <p className="mt-0.5 text-sm text-[#8b949e]">{r.content}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
