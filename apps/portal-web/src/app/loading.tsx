export default function Loading() {
  return (
    <div className="flex flex-col">
      {/* Nav skeleton */}
      <div className="flex h-10 items-center justify-between border-b border-[var(--border)] px-4">
        <div className="skeleton-dark h-3 w-16" />
        <div className="skeleton-dark h-2 w-20" />
        <div className="flex gap-3">
          <div className="skeleton-dark h-2 w-12" />
          <div className="skeleton-dark h-2 w-10" />
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="min-h-[92vh] px-4 pt-20 sm:px-6 sm:pt-28">
        <div className="mx-auto max-w-7xl">
          <div className="skeleton-dark mb-4 h-3 w-56" />
          <div className="skeleton-dark mb-3 h-16 w-64 sm:h-24 sm:w-96" />
          <div className="skeleton-dark mb-3 h-16 w-72 sm:h-24 sm:w-[28rem]" />
          <div className="skeleton-dark h-16 w-80 sm:h-24 sm:w-[32rem]" />
          <div className="mt-10 max-w-lg border border-[var(--border)] bg-[var(--bg-card)]">
            <div className="flex gap-1.5 border-b border-[var(--border)] px-3 py-2">
              <div className="h-2.5 w-2.5 rounded-full bg-[var(--text-ghost)]" />
              <div className="h-2.5 w-2.5 rounded-full bg-[var(--text-ghost)]" />
              <div className="h-2.5 w-2.5 rounded-full bg-[var(--text-ghost)]" />
            </div>
            <div className="space-y-3 p-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
                  key={`init-${i}`}
                  className="flex items-center gap-3"
                >
                  <div className="skeleton-dark h-3 w-3" />
                  <div className="skeleton-dark h-2 w-24" />
                  <div className="skeleton-dark h-1.5 flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar skeleton */}
      <div className="flex justify-center gap-4 border-b border-[var(--border)] py-2">
        <div className="skeleton-dark h-3 w-20" />
        <div className="skeleton-dark h-3 w-16" />
        <div className="skeleton-dark h-3 w-20" />
      </div>

      {/* Score bar skeleton */}
      <div className="mx-3 my-3 sm:mx-4">
        <div
          className="grid grid-cols-3 gap-px sm:grid-cols-6"
          style={{ background: "var(--border)" }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
              key={`score-${i}`}
              className="flex flex-col items-center bg-[var(--bg-raised)] px-4 py-3"
            >
              <div className="skeleton-dark h-2 w-8" />
              <div className="skeleton-dark mt-1.5 h-5 w-10" />
            </div>
          ))}
        </div>
      </div>

      {/* Bento grid skeleton */}
      <div className="bento-grid mx-auto max-w-7xl px-3 py-4 sm:px-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
            key={`card-${i}`}
            className={`border border-[var(--border)] bg-[var(--bg-card)] p-5 ${i < 2 ? "sm:col-span-2" : ""}`}
          >
            <div className="skeleton-dark mb-1 h-3 w-24" />
            <div className="skeleton-dark mb-4 h-2 w-16" />
            <div className="skeleton-dark mb-1 h-10 w-20" />
            <div className="skeleton-dark mb-4 h-2 w-14" />
            <div className="space-y-2.5">
              <div>
                <div className="flex justify-between">
                  <div className="skeleton-dark h-2 w-16" />
                  <div className="skeleton-dark h-2 w-10" />
                </div>
                <div className="mt-1 h-[5px] bg-[rgba(255,255,255,0.04)]" />
              </div>
              <div>
                <div className="flex justify-between">
                  <div className="skeleton-dark h-2 w-20" />
                  <div className="skeleton-dark h-2 w-8" />
                </div>
                <div className="mt-1 h-[5px] bg-[rgba(255,255,255,0.04)]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
