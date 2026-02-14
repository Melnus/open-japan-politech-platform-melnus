export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-950 to-slate-950 py-16 pb-20">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />
        <div className="relative mx-auto max-w-4xl px-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            SocialGuard について
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-8 py-10">
        <div className="space-y-6">
          <div className="dark-card p-8">
            <h2 className="mb-3 text-lg font-bold text-white">SocialGuard とは</h2>
            <p className="leading-relaxed text-gray-400">
              SocialGuard
              は、日本の社会保障制度に関するデータを一元的に可視化するオープンソースプロジェクトです。
              年金・医療・介護・子育て支援など、暮らしに直結する社会保障関係費の推移や制度の全体像を、
              直感的なダッシュボードとして提供します。
            </p>
          </div>

          <div className="dark-card p-8">
            <h2 className="mb-3 text-lg font-bold text-white">何ができるか</h2>
            <ul className="ml-4 list-disc space-y-2 text-gray-400">
              <li>社会保障関係費の年度別推移をグラフで確認（分野別内訳付き）</li>
              <li>年金・医療・介護・福祉・子育て支援など主要制度を一覧表示</li>
              <li>都道府県別の福祉指標（受給率、一人あたり費用等）を比較</li>
              <li>各政党の社会保障政策に対するスタンスを横断比較</li>
              <li>API経由でのデータアクセス（AIエージェント対応）</li>
            </ul>
          </div>

          <div className="dark-card p-8">
            <h2 className="mb-3 text-lg font-bold text-white">データソース</h2>
            <p className="leading-relaxed text-gray-400">
              以下の公的機関が公開するデータに基づいています。
              データの正確性には十分注意していますが、公式発表との差異がある場合は公式データを参照してください。
            </p>
            <ul className="ml-4 mt-3 list-disc space-y-1 text-gray-400">
              <li>
                <span className="font-medium text-gray-300">厚生労働省</span> --
                社会保障費用統計、各種白書、制度概要
              </li>
              <li>
                <span className="font-medium text-gray-300">財務省</span> --
                一般会計歳出予算、社会保障関係費の推移
              </li>
              <li>
                <span className="font-medium text-gray-300">総務省統計局</span> --
                都道府県別統計データ、人口統計
              </li>
            </ul>
          </div>

          <div className="dark-card p-8">
            <h2 className="mb-3 text-lg font-bold text-white">非党派性</h2>
            <p className="leading-relaxed text-gray-400">
              SocialGuard は Open Japan PoliTech Platform (OJPP)
              の一部として、完全な非党派性を維持しています。
              特定の政党・政治的立場を推進することなく、すべての政党のデータを公平に表示します。
              社会保障制度の透明性向上と市民の理解促進を目的としています。
            </p>
          </div>

          <div className="dark-card p-8">
            <h2 className="mb-3 text-lg font-bold text-white">技術スタック</h2>
            <ul className="ml-4 list-disc space-y-1 text-gray-400">
              <li>Next.js 15 (App Router)</li>
              <li>TypeScript / Tailwind CSS v4</li>
              <li>Prisma / PostgreSQL</li>
              <li>Recharts（チャート描画）</li>
              <li>Motion（アニメーション）</li>
            </ul>
          </div>

          <div className="dark-card p-8">
            <h2 className="mb-3 text-lg font-bold text-white">ライセンス</h2>
            <p className="leading-relaxed text-gray-400">
              AGPL-3.0-or-later ライセンスの下で公開されています。
              コードの利用・改変・再配布は自由ですが、派生物も同じライセンスで公開する必要があります。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
