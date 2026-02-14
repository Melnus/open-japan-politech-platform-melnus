import { FadeIn } from "@ojpp/ui";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <FadeIn>
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-white">
          CultureScope について
        </h1>
        <p className="mb-10 text-zinc-500">文化政策を可視化するオープンソースプロジェクト</p>
      </FadeIn>

      <div className="space-y-6">
        <FadeIn delay={0.05}>
          <div className="glass-card p-6">
            <h2 className="mb-4 text-lg font-bold text-white">CultureScope とは</h2>
            <p className="leading-relaxed text-zinc-400">
              CultureScope
              は、日本の文化政策に関するデータを可視化するオープンソースプロジェクトです。
              文化庁予算の推移、芸術振興プログラム、文化財保護施策、各政党の文化政策スタンスを
              透明性のある形で提示します。
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="glass-card p-6">
            <h2 className="mb-4 text-lg font-bold text-white">何ができるか</h2>
            <ul className="ml-4 list-disc space-y-2 text-zinc-400 marker:text-amber-500">
              <li>文化庁予算の年度別・分野別推移をチャートで可視化</li>
              <li>芸術文化振興、文化財保護、メディア芸術など分野別の予算配分を把握</li>
              <li>文化庁の補助金・助成金プログラムを一覧表示</li>
              <li>各政党の文化政策スタンスを横断的に比較</li>
              <li>API経由でのデータアクセス（AIエージェント対応）</li>
            </ul>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="glass-card p-6">
            <h2 className="mb-4 text-lg font-bold text-white">データソース</h2>
            <ul className="ml-4 list-disc space-y-3 text-zinc-400 marker:text-amber-500">
              <li>
                <span className="font-medium text-zinc-300">文化庁予算概要</span> —
                文化庁が毎年度公開する予算概要資料に基づく分野別予算データ
              </li>
              <li>
                <span className="font-medium text-zinc-300">各党マニフェスト</span> —
                各政党が公開するマニフェスト・政策集から文化政策に関するスタンスを抽出
              </li>
              <li>
                <span className="font-medium text-zinc-300">文化庁公開資料</span> —
                文化プログラム・補助金制度の詳細情報
              </li>
            </ul>
            <p className="mt-4 text-sm text-zinc-600">
              データの正確性には十分注意していますが、公式発表との差異がある場合は公式データを参照してください。
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="glass-card p-6">
            <h2 className="mb-4 text-lg font-bold text-white">文化政策の分野</h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {[
                "芸術文化振興",
                "文化財保護",
                "メディア芸術",
                "国際文化交流",
                "著作権",
                "国語・日本語教育",
                "文化産業",
                "文化施設整備",
                "デジタルアーカイブ",
                "地域文化振興",
              ].map((label) => (
                <span
                  key={label}
                  className="inline-block rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-400"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.25}>
          <div className="glass-card p-6">
            <h2 className="mb-4 text-lg font-bold text-white">非党派性</h2>
            <p className="leading-relaxed text-zinc-400">
              CultureScope は Open Japan PoliTech Platform (OJPP)
              の一部として、完全な非党派性を維持しています。
              特定の政党・政治的立場を推進することなく、すべての政党の文化政策データを公平に表示します。
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="glass-card p-6">
            <h2 className="mb-4 text-lg font-bold text-white">技術スタック</h2>
            <ul className="ml-4 list-disc space-y-1.5 text-zinc-400 marker:text-amber-500">
              <li>Next.js 15 (App Router)</li>
              <li>TypeScript / Tailwind CSS v4</li>
              <li>Prisma / PostgreSQL</li>
              <li>Recharts（チャート描画）</li>
              <li>Motion（アニメーション）</li>
            </ul>
          </div>
        </FadeIn>

        <FadeIn delay={0.35}>
          <div className="glass-card p-6">
            <h2 className="mb-4 text-lg font-bold text-white">ライセンス</h2>
            <p className="leading-relaxed text-zinc-400">
              AGPL-3.0-or-later ライセンスの下で公開されています。
              コードの利用・改変・再配布は自由ですが、派生物も同じライセンスで公開する必要があります。
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
