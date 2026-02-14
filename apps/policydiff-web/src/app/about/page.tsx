export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h2 className="mb-8 text-3xl font-bold text-white">PolicyDiffについて</h2>

        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="mb-3 text-xl font-bold text-white">概要</h3>
            <p className="text-slate-400 leading-relaxed">
              PolicyDiffは、日本の全政党のマニフェスト・政策をバージョン管理し、 市民がPull
              Requestで改善提案できるオープンソースプラットフォームです。
              AIエージェントが変更を追跡し、誰もが政策の違いと変遷を即座に把握できます。
            </p>
          </div>

          <div className="glass-card p-6">
            <h3 className="mb-3 text-xl font-bold text-white">特徴</h3>
            <ul className="space-y-2 text-slate-400">
              <li className="flex gap-2">
                <span className="font-bold text-blue-400">-</span>
                全政党の政策をGitで管理し、変更履歴を完全に記録
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-blue-400">-</span>
                政策をカテゴリ別に横並びで比較可能
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-blue-400">-</span>
                市民からの政策改善提案をPull Request形式で受け付け
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-blue-400">-</span>
                RESTful APIにより外部のAIエージェントやアプリから利用可能
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-blue-400">-</span>
                AGPL-3.0-or-laterライセンスによる完全オープンソース
              </li>
            </ul>
          </div>

          <div className="glass-card p-6">
            <h3 className="mb-3 text-xl font-bold text-white">ミッション</h3>
            <p className="text-slate-400 leading-relaxed">
              特定の政党のためではなく、民主主義のインフラとして。
              政党にも企業にもよらない、完全オープンな政治テクノロジー基盤を目指しています。
            </p>
            <p className="mt-3 text-slate-400 leading-relaxed">
              AIエージェント時代において、市民一人一人のエージェントが全政党の政策を常時分析し、
              より良い政策形成に貢献できる社会を実現します。
            </p>
          </div>

          <div className="glass-card p-6">
            <h3 className="mb-3 text-xl font-bold text-white">Open Japan PoliTech Platform</h3>
            <p className="text-slate-400 leading-relaxed">
              PolicyDiffは「Open Japan PoliTech Platform (OJPP)」の一部です。
              OJPPは政治資金の透明化(MoneyGlass)、国会審議の可視化(ParliScope)と合わせて、
              日本の民主主義のデジタルインフラを構築するプロジェクトです。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
