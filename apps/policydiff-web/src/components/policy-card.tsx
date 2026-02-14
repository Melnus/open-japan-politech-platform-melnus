interface PolicyCardProps {
  id: string;
  title: string;
  category: string;
  partyName?: string;
  partyColor?: string | null;
  status: string;
  contentPreview?: string;
}

export function PolicyCard({
  id,
  title,
  category,
  partyName,
  partyColor,
  status,
  contentPreview,
}: PolicyCardProps) {
  const statusStyle =
    status === "PUBLISHED"
      ? { bg: "rgba(34, 197, 94, 0.15)", color: "#4ade80" }
      : status === "DRAFT"
        ? { bg: "rgba(251, 191, 36, 0.15)", color: "#fbbf24" }
        : { bg: "rgba(148, 163, 184, 0.15)", color: "#94a3b8" };

  return (
    <a href={`/policy/${id}`} className="block">
      <div className="glass-card h-full p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span
            className="tag-badge"
            style={{
              backgroundColor: "rgba(59, 130, 246, 0.15)",
              color: "#60a5fa",
            }}
          >
            {category}
          </span>
          <span
            className="rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}
          >
            {status}
          </span>
        </div>
        {partyName && (
          <div className="mb-2 flex items-center gap-1.5">
            {partyColor && (
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: partyColor }}
              />
            )}
            <span className="text-xs font-medium" style={{ color: partyColor ?? "#94a3b8" }}>
              {partyName}
            </span>
          </div>
        )}
        <h3 className="mb-2 text-sm font-bold leading-snug text-white">{title}</h3>
        {contentPreview && <p className="line-clamp-2 text-xs text-slate-500">{contentPreview}</p>}
      </div>
    </a>
  );
}
