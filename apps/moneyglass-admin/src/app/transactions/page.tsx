import { Badge, Pagination } from "@ojpp/ui";

const sampleTransactions = [
  {
    id: "TX-001",
    date: "2025-01-15",
    description: "政党交付金",
    category: "収入",
    amount: 1500000,
    status: "confirmed",
  },
  {
    id: "TX-002",
    date: "2025-01-20",
    description: "事務所家賃",
    category: "支出",
    amount: -350000,
    status: "confirmed",
  },
  {
    id: "TX-003",
    date: "2025-02-01",
    description: "個人献金（山田太郎）",
    category: "収入",
    amount: 100000,
    status: "pending",
  },
  {
    id: "TX-004",
    date: "2025-02-05",
    description: "印刷費",
    category: "支出",
    amount: -85000,
    status: "confirmed",
  },
  {
    id: "TX-005",
    date: "2025-02-10",
    description: "集会会場費",
    category: "支出",
    amount: -120000,
    status: "pending",
  },
  {
    id: "TX-006",
    date: "2025-02-15",
    description: "政党交付金（第2四半期）",
    category: "収入",
    amount: 1500000,
    status: "confirmed",
  },
  {
    id: "TX-007",
    date: "2025-03-01",
    description: "交通費",
    category: "支出",
    amount: -45000,
    status: "confirmed",
  },
  {
    id: "TX-008",
    date: "2025-03-10",
    description: "通信費",
    category: "支出",
    amount: -28000,
    status: "confirmed",
  },
];

function formatCurrency(amount: number) {
  const abs = Math.abs(amount);
  const formatted = new Intl.NumberFormat("ja-JP").format(abs);
  return amount >= 0 ? `+${formatted}` : `-${formatted}`;
}

export default function TransactionsPage() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-admin-text">取引一覧</h2>
          <p className="mt-1 text-sm text-admin-text-muted">
            {sampleTransactions.length} 件の取引（サンプルデータ）
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
                日付
              </th>
              <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-admin-text-muted">
                摘要
              </th>
              <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-admin-text-muted">
                分類
              </th>
              <th className="px-5 py-3.5 text-right text-xs font-medium uppercase tracking-wider text-admin-text-muted">
                金額
              </th>
              <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-admin-text-muted">
                ステータス
              </th>
            </tr>
          </thead>
          <tbody>
            {sampleTransactions.map((tx) => (
              <tr
                key={tx.id}
                className="border-b border-admin-border transition-colors last:border-0 hover:bg-admin-card-hover"
              >
                <td className="px-5 py-3.5 font-mono text-xs text-admin-text-dim">{tx.id}</td>
                <td className="px-5 py-3.5 text-admin-text-muted">{tx.date}</td>
                <td className="px-5 py-3.5 text-admin-text">{tx.description}</td>
                <td className="px-5 py-3.5">
                  <Badge variant={tx.category === "収入" ? "success" : "danger"}>
                    {tx.category}
                  </Badge>
                </td>
                <td
                  className={`px-5 py-3.5 text-right font-mono tabular-nums ${tx.amount >= 0 ? "text-green-400" : "text-red-400"}`}
                >
                  {formatCurrency(tx.amount)}
                </td>
                <td className="px-5 py-3.5">
                  <Badge variant={tx.status === "confirmed" ? "info" : "warning"} dot>
                    {tx.status === "confirmed" ? "確認済" : "未確認"}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <Pagination currentPage={1} totalPages={5} baseHref="/transactions" />
      </div>
    </div>
  );
}
