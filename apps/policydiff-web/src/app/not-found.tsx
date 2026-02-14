export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="glass-card p-8 text-center">
          <h2 className="mb-2 text-2xl font-bold text-white">404 - ページが見つかりません</h2>
          <p className="mb-6 text-slate-400">
            お探しのページは存在しないか、移動した可能性があります。
          </p>
          <a href="/" className="text-blue-400 transition-colors hover:text-blue-300">
            トップページに戻る
          </a>
        </div>
      </div>
    </div>
  );
}
