export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f23] to-[#1a1033]">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8">
          <h2 className="mb-2 text-3xl font-bold tracking-tight text-white">ParliScopeについて</h2>
          <p className="text-[#8b949e]">議会データオープンプラットフォーム</p>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-6">
            <h3 className="mb-3 text-lg font-semibold text-white">ミッション</h3>
            <p className="leading-relaxed text-[#8b949e]">
              ParliScopeは、国会・地方議会のデータをオープンにし、AIエージェントと市民が
              議会の動きをリアルタイムに把握できるプラットフォームです。
              政党にも企業にもよらない、完全オープンな政治テクノロジー基盤を目指します。
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-6">
            <h3 className="mb-3 text-lg font-semibold text-white">主な機能</h3>
            <ul className="list-inside list-disc space-y-2.5 text-[#8b949e]">
              <li>国会法案の一覧・詳細閲覧</li>
              <li>会期別の法案整理</li>
              <li>議員の投票行動追跡</li>
              <li>ステータス別の法案フィルタリング</li>
              <li>RESTful APIによるデータアクセス</li>
            </ul>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-6">
            <h3 className="mb-3 text-lg font-semibold text-white">データソース</h3>
            <ul className="list-inside list-disc space-y-2.5 text-[#8b949e]">
              <li>国会会議録検索システムAPI (kokkai.ndl.go.jp)</li>
              <li>衆議院・参議院公式サイト</li>
              <li>SmartNews SMRI 法案データ</li>
            </ul>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-6">
            <h3 className="mb-3 text-lg font-semibold text-white">オープンソース</h3>
            <p className="leading-relaxed text-[#8b949e]">
              本プロジェクトはAGPL-3.0-or-laterライセンスのもとで公開されています。 Open Japan
              PoliTech Platformの一部として開発されています。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
