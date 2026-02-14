export default function ReportsPage() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-admin-text">報告書生成</h2>
        <p className="mt-1 text-sm text-admin-text-muted">政治資金収支報告書の生成</p>
      </div>
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-admin-border bg-admin-card px-12 py-16 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-admin-accent-light">
          <svg
            className="h-6 w-6 text-admin-text-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-admin-text">報告書生成</h3>
        <p className="mb-4 text-sm text-admin-text-muted">この機能は v0.2 で実装予定です。</p>
        <span className="inline-block rounded-full border border-admin-border bg-admin-sidebar px-4 py-1.5 text-xs font-medium text-admin-text-dim">
          Coming Soon
        </span>
      </div>
    </div>
  );
}
