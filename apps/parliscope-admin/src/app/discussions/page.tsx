import { Badge, Pagination } from "@ojpp/ui";

const sampleDiscussions = [
  {
    id: "D-001",
    title: "デジタル社会基本法改正の論点整理",
    billRef: "B-214-001",
    comments: 24,
    status: "active",
    created: "2025-02-28",
  },
  {
    id: "D-002",
    title: "個人情報保護の強化について",
    billRef: "B-214-002",
    comments: 18,
    status: "active",
    created: "2025-02-25",
  },
  {
    id: "D-003",
    title: "地方自治体への権限委譲の範囲",
    billRef: "B-214-003",
    comments: 31,
    status: "closed",
    created: "2025-02-20",
  },
  {
    id: "D-004",
    title: "再エネ促進のための規制緩和",
    billRef: "B-214-004",
    comments: 12,
    status: "active",
    created: "2025-02-15",
  },
  {
    id: "D-005",
    title: "子育て支援拡充の財源確保",
    billRef: "B-214-005",
    comments: 45,
    status: "active",
    created: "2025-02-10",
  },
  {
    id: "D-006",
    title: "防衛費の適正配分に関する議論",
    billRef: "B-213-001",
    comments: 67,
    status: "closed",
    created: "2025-01-12",
  },
  {
    id: "D-007",
    title: "経済安保の対象範囲",
    billRef: "B-213-002",
    comments: 8,
    status: "archived",
    created: "2025-01-05",
  },
];

const statusVariant: Record<string, "success" | "warning" | "info" | "danger" | "default"> = {
  active: "success",
  closed: "default",
  archived: "warning",
};

const statusLabel: Record<string, string> = {
  active: "アクティブ",
  closed: "クローズ",
  archived: "アーカイブ",
};

export default function DiscussionsPage() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-admin-text">議論管理</h2>
          <p className="mt-1 text-sm text-admin-text-muted">
            {sampleDiscussions.length} 件のスレッド（サンプルデータ）
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-admin-border bg-admin-card">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-admin-border bg-admin-sidebar">
              <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-admin-text-muted">
                ID
              </th>
              <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-admin-text-muted">
                タイトル
              </th>
              <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-admin-text-muted">
                関連法案
              </th>
              <th className="px-5 py-3.5 text-right text-xs font-medium uppercase tracking-wider text-admin-text-muted">
                コメント
              </th>
              <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-admin-text-muted">
                ステータス
              </th>
              <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-admin-text-muted">
                作成日
              </th>
            </tr>
          </thead>
          <tbody>
            {sampleDiscussions.map((d) => (
              <tr
                key={d.id}
                className="border-b border-admin-border transition-colors last:border-0 hover:bg-admin-card-hover"
              >
                <td className="px-5 py-3.5 font-mono text-xs text-admin-text-dim">{d.id}</td>
                <td className="px-5 py-3.5 font-medium text-admin-text">{d.title}</td>
                <td className="px-5 py-3.5 font-mono text-xs text-admin-text-muted">{d.billRef}</td>
                <td className="px-5 py-3.5 text-right font-mono tabular-nums text-admin-text">
                  {d.comments}
                </td>
                <td className="px-5 py-3.5">
                  <Badge variant={statusVariant[d.status] ?? "default"} dot>
                    {statusLabel[d.status] ?? d.status}
                  </Badge>
                </td>
                <td className="px-5 py-3.5 text-admin-text-muted">{d.created}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <Pagination currentPage={1} totalPages={4} baseHref="/discussions" />
      </div>
    </div>
  );
}
