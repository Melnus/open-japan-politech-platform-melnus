export default function AdminHome() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-admin-text">ダッシュボード</h2>
        <p className="mt-1 text-sm text-admin-text-muted">MoneyGlass 管理画面の概要</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard label="総収入" value="--" sub="未集計" accentClass="bg-green-500" />
        <AdminStatCard label="総支出" value="--" sub="未集計" accentClass="bg-red-500" />
        <AdminStatCard label="取引件数" value="0" sub="件" accentClass="bg-blue-500" />
        <AdminStatCard label="報告書" value="0" sub="件" accentClass="bg-amber-500" />
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-admin-border bg-admin-card p-6">
          <h3 className="mb-4 text-base font-semibold text-admin-text">クイックスタート</h3>
          <ol className="list-inside list-decimal space-y-3 text-sm leading-relaxed text-admin-text-muted">
            <li className="pl-1">「データ取り込み」から会計ソフトのCSVをアップロード</li>
            <li className="pl-1">取引データを確認・分類</li>
            <li className="pl-1">「報告書生成」から政治資金収支報告書XMLを出力</li>
          </ol>
        </div>
        <div className="rounded-xl border border-admin-border bg-admin-card p-6">
          <h3 className="mb-4 text-base font-semibold text-admin-text">最近のアクティビティ</h3>
          <div className="flex items-center justify-center py-8 text-sm text-admin-text-dim">
            アクティビティはまだありません
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminStatCard({
  label,
  value,
  sub,
  accentClass,
}: {
  label: string;
  value: string;
  sub: string;
  accentClass: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-admin-border bg-admin-card p-5 transition-colors hover:bg-admin-card-hover">
      <div className={`absolute left-0 top-0 h-full w-1 ${accentClass}`} />
      <p className="text-xs font-medium uppercase tracking-wider text-admin-text-muted">{label}</p>
      <div className="mt-2 flex items-baseline gap-1.5">
        <p className="text-2xl font-bold text-admin-text">{value}</p>
        <span className="text-sm text-admin-text-dim">{sub}</span>
      </div>
    </div>
  );
}
