interface Endpoint {
  method: string;
  path: string;
  description: string;
  params?: { name: string; type: string; description: string }[];
}

const ENDPOINTS: Endpoint[] = [
  {
    method: "GET",
    path: "/api/organizations",
    description: "政治団体の一覧を取得",
    params: [
      { name: "party", type: "string", description: "政党IDでフィルタ" },
      {
        name: "type",
        type: "string",
        description: "団体種別でフィルタ (PARTY_BRANCH | FUND_MANAGEMENT)",
      },
      { name: "page", type: "number", description: "ページ番号 (デフォルト: 1)" },
      { name: "limit", type: "number", description: "1ページの件数 (デフォルト: 20, 最大: 100)" },
    ],
  },
  {
    method: "GET",
    path: "/api/organizations/:id",
    description: "政治団体の詳細を取得（収支報告書一覧を含む）",
  },
  {
    method: "GET",
    path: "/api/reports",
    description: "収支報告書の一覧を取得",
    params: [
      { name: "year", type: "number", description: "会計年度でフィルタ" },
      { name: "organizationId", type: "string", description: "団体IDでフィルタ" },
      { name: "page", type: "number", description: "ページ番号" },
      { name: "limit", type: "number", description: "1ページの件数" },
    ],
  },
  {
    method: "GET",
    path: "/api/reports/:id",
    description: "収支報告書の詳細を取得（収入・支出の明細を含む）",
  },
  {
    method: "GET",
    path: "/api/parties",
    description: "政党一覧を取得（totalIncome / totalExpenditure 集計付き）",
  },
  {
    method: "GET",
    path: "/api/stats",
    description: "ダッシュボード統計を取得（団体数、報告書数、総収支、年度別推移）",
  },
];

export default function ApiDocsPage() {
  return (
    <div className="mx-auto max-w-4xl px-8 py-12">
      <h2 className="mb-3 text-3xl font-bold text-white">API ドキュメント</h2>
      <p className="mb-8 text-[#8b949e]">
        MoneyGlass APIは、政治資金データへのプログラムによるアクセスを提供します。
        全てのエンドポイントはRESTful JSON APIです。
      </p>

      <div className="mb-8">
        <div className="glass-card rounded-xl p-8">
          <h3 className="mb-3 font-bold text-white">Base URL</h3>
          <code className="rounded-lg bg-[rgba(255,107,53,0.1)] px-3 py-1.5 text-sm text-[#FFAD80]">
            https://your-domain.com/api
          </code>
          <h3 className="mb-2 mt-6 font-bold text-white">レスポンス形式</h3>
          <p className="text-sm text-[#8b949e]">一覧APIはページネーション付きで返却されます:</p>
          <pre className="mt-3 overflow-x-auto rounded-lg border border-[rgba(255,107,53,0.15)] bg-[#0d1117] p-4 text-sm text-[#FF6B35]">
            {`{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}`}
          </pre>
        </div>
      </div>

      <div className="space-y-4">
        {ENDPOINTS.map((endpoint) => (
          <div key={endpoint.path} className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-3">
              <span className="rounded-lg bg-[rgba(255,107,53,0.15)] px-2.5 py-1 text-xs font-bold text-[#FF6B35]">
                {endpoint.method}
              </span>
              <code className="text-sm font-medium text-white">{endpoint.path}</code>
            </div>
            <p className="mt-3 text-sm text-[#8b949e]">{endpoint.description}</p>
            {endpoint.params && (
              <div className="mt-4">
                <p className="text-xs font-medium text-[#6e7681]">クエリパラメータ</p>
                <table className="mt-2 w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[rgba(255,255,255,0.06)] text-xs text-[#6e7681]">
                      <th className="py-2 pr-4">名前</th>
                      <th className="py-2 pr-4">型</th>
                      <th className="py-2">説明</th>
                    </tr>
                  </thead>
                  <tbody>
                    {endpoint.params.map((param) => (
                      <tr
                        key={param.name}
                        className="border-b border-[rgba(255,255,255,0.03)] last:border-0"
                      >
                        <td className="py-2 pr-4">
                          <code className="text-xs text-[#FF6B35]">{param.name}</code>
                        </td>
                        <td className="py-2 pr-4 text-xs text-[#6e7681]">{param.type}</td>
                        <td className="py-2 text-xs text-[#8b949e]">{param.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
