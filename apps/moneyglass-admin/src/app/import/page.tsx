export default function ImportPage() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-admin-text">データ取り込み</h2>
        <p className="mt-1 text-sm text-admin-text-muted">会計データのインポート</p>
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
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-admin-text">データ取り込み</h3>
        <p className="mb-4 text-sm text-admin-text-muted">この機能は v0.2 で実装予定です。</p>
        <span className="inline-block rounded-full border border-admin-border bg-admin-sidebar px-4 py-1.5 text-xs font-medium text-admin-text-dim">
          Coming Soon
        </span>
      </div>
    </div>
  );
}
