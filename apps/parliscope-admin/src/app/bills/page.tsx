import { Badge, Pagination } from "@ojpp/ui";

const sampleBills = [
  {
    id: "B-214-001",
    name: "デジタル社会形成基本法改正案",
    session: "第214回",
    status: "審議中",
    category: "内閣提出",
    updated: "2025-03-01",
  },
  {
    id: "B-214-002",
    name: "個人情報保護法改正案",
    session: "第214回",
    status: "委員会審査",
    category: "内閣提出",
    updated: "2025-02-28",
  },
  {
    id: "B-214-003",
    name: "地方自治法改正案",
    session: "第214回",
    status: "成立",
    category: "内閣提出",
    updated: "2025-02-25",
  },
  {
    id: "B-214-004",
    name: "再生可能エネルギー促進法案",
    session: "第214回",
    status: "審議中",
    category: "議員立法",
    updated: "2025-02-20",
  },
  {
    id: "B-214-005",
    name: "子ども・子育て支援法改正案",
    session: "第214回",
    status: "審議中",
    category: "内閣提出",
    updated: "2025-02-18",
  },
  {
    id: "B-213-001",
    name: "防衛費財源確保法案",
    session: "第213回",
    status: "成立",
    category: "内閣提出",
    updated: "2025-01-15",
  },
  {
    id: "B-213-002",
    name: "経済安全保障推進法改正案",
    session: "第213回",
    status: "廃案",
    category: "議員立法",
    updated: "2025-01-10",
  },
  {
    id: "B-213-003",
    name: "教育機会確保法改正案",
    session: "第213回",
    status: "成立",
    category: "議員立法",
    updated: "2025-01-05",
  },
];

const statusVariant: Record<string, "success" | "warning" | "info" | "danger" | "default"> = {
  審議中: "warning",
  委員会審査: "info",
  成立: "success",
  廃案: "danger",
};

export default function BillsPage() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-admin-text">法案管理</h2>
          <p className="mt-1 text-sm text-admin-text-muted">
            {sampleBills.length} 件の法案（サンプルデータ）
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
                法案名
              </th>
              <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-admin-text-muted">
                会期
              </th>
              <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-admin-text-muted">
                種別
              </th>
              <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-admin-text-muted">
                ステータス
              </th>
              <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-admin-text-muted">
                更新日
              </th>
            </tr>
          </thead>
          <tbody>
            {sampleBills.map((bill) => (
              <tr
                key={bill.id}
                className="border-b border-admin-border transition-colors last:border-0 hover:bg-admin-card-hover"
              >
                <td className="px-5 py-3.5 font-mono text-xs text-admin-text-dim">{bill.id}</td>
                <td className="px-5 py-3.5 font-medium text-admin-text">{bill.name}</td>
                <td className="px-5 py-3.5 text-admin-text-muted">{bill.session}</td>
                <td className="px-5 py-3.5">
                  <Badge variant={bill.category === "内閣提出" ? "info" : "default"}>
                    {bill.category}
                  </Badge>
                </td>
                <td className="px-5 py-3.5">
                  <Badge variant={statusVariant[bill.status] ?? "default"} dot>
                    {bill.status}
                  </Badge>
                </td>
                <td className="px-5 py-3.5 text-admin-text-muted">{bill.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <Pagination currentPage={1} totalPages={3} baseHref="/bills" />
      </div>
    </div>
  );
}
