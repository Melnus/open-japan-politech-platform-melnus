import { Badge } from "@ojpp/ui";

const sampleSessions = [
  {
    id: 214,
    name: "第214回国会（常会）",
    start: "2025-01-20",
    end: "2025-06-22",
    status: "開会中",
    billCount: 58,
  },
  {
    id: 213,
    name: "第213回国会（臨時会）",
    start: "2024-10-01",
    end: "2024-12-21",
    status: "閉会",
    billCount: 32,
  },
  {
    id: 212,
    name: "第212回国会（臨時会）",
    start: "2024-07-15",
    end: "2024-09-20",
    status: "閉会",
    billCount: 18,
  },
  {
    id: 211,
    name: "第211回国会（常会）",
    start: "2024-01-22",
    end: "2024-06-23",
    status: "閉会",
    billCount: 72,
  },
];

export default function SessionsPage() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-admin-text">会期管理</h2>
        <p className="mt-1 text-sm text-admin-text-muted">
          {sampleSessions.length} 件の会期（サンプルデータ）
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-admin-border bg-admin-card">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-admin-border bg-admin-sidebar">
              <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-admin-text-muted">
                回次
              </th>
              <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-admin-text-muted">
                会期名
              </th>
              <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-admin-text-muted">
                開始日
              </th>
              <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-admin-text-muted">
                終了日
              </th>
              <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-admin-text-muted">
                ステータス
              </th>
              <th className="px-5 py-3.5 text-right text-xs font-medium uppercase tracking-wider text-admin-text-muted">
                法案数
              </th>
            </tr>
          </thead>
          <tbody>
            {sampleSessions.map((session) => (
              <tr
                key={session.id}
                className="border-b border-admin-border transition-colors last:border-0 hover:bg-admin-card-hover"
              >
                <td className="px-5 py-3.5 font-mono text-xs text-admin-text-dim">{session.id}</td>
                <td className="px-5 py-3.5 font-medium text-admin-text">{session.name}</td>
                <td className="px-5 py-3.5 text-admin-text-muted">{session.start}</td>
                <td className="px-5 py-3.5 text-admin-text-muted">{session.end}</td>
                <td className="px-5 py-3.5">
                  <Badge variant={session.status === "開会中" ? "success" : "default"} dot>
                    {session.status}
                  </Badge>
                </td>
                <td className="px-5 py-3.5 text-right font-mono tabular-nums text-admin-text">
                  {session.billCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
