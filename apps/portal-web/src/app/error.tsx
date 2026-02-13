"use client";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: globalThis.Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="kpi-value text-5xl font-bold tracking-[8px] text-[var(--neon-pink)]">ERR</div>
      <div className="mx-auto h-px w-16 bg-[var(--accent)]" />
      <p className="max-w-md text-sm text-[var(--text-dim)]">
        データの取得中にエラーが発生しました。データベース接続を確認してください。
      </p>
      <p className="kpi-value text-[0.6rem] text-[var(--text-ghost)]">
        {error.digest ?? error.message}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-2 border border-[var(--border)] px-4 py-2 kpi-value text-xs tracking-[2px] text-[var(--accent)] transition-colors hover:bg-[var(--accent-dim)]"
      >
        RETRY
      </button>
    </div>
  );
}
