export default function AdminHome() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-admin-text">ダッシュボード</h2>
        <p className="mt-1 text-sm text-admin-text-muted">ParliScope 管理画面の概要</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard label="登録法案数" value="0" sub="件" accentClass="bg-purple-500" />
        <AdminStatCard label="審議中" value="0" sub="件" accentClass="bg-amber-500" />
        <AdminStatCard label="議論スレッド" value="0" sub="件" accentClass="bg-blue-500" />
        <AdminStatCard label="参加者数" value="0" sub="人" accentClass="bg-green-500" />
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-admin-border bg-admin-card p-6">
          <h3 className="mb-4 text-base font-semibold text-admin-text">クイックスタート</h3>
          <ol className="list-inside list-decimal space-y-3 text-sm leading-relaxed text-admin-text-muted">
            <li className="pl-1">「法案管理」から法案データを登録・更新</li>
            <li className="pl-1">「会期管理」で国会会期情報を設定</li>
            <li className="pl-1">「議論管理」で議論スレッドをモデレーション</li>
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
