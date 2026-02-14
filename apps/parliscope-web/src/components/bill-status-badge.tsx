const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  SUBMITTED: { label: "提出", color: "text-blue-400", bg: "bg-blue-500/15" },
  COMMITTEE: { label: "委員会審議中", color: "text-yellow-400", bg: "bg-yellow-500/15" },
  PLENARY: { label: "本会議審議中", color: "text-yellow-400", bg: "bg-yellow-500/15" },
  PASSED_LOWER: { label: "衆院可決", color: "text-amber-400", bg: "bg-amber-500/15" },
  PASSED_UPPER: { label: "参院可決", color: "text-amber-400", bg: "bg-amber-500/15" },
  ENACTED: { label: "成立", color: "text-emerald-400", bg: "bg-emerald-500/15" },
  REJECTED: { label: "否決", color: "text-red-400", bg: "bg-red-500/15" },
  WITHDRAWN: { label: "撤回", color: "text-red-400", bg: "bg-red-500/15" },
};

export function BillStatusBadge({ status }: { status: string }) {
  const config = STATUS_MAP[status] ?? {
    label: status,
    color: "text-gray-400",
    bg: "bg-gray-500/15",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bg} ${config.color}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${config.color
          .replace("text-", "bg-")
          .replace("-400", "-500")}`}
      />
      {config.label}
    </span>
  );
}

// Alias for dashboard usage
export { BillStatusBadge as DarkBillStatusBadge };
