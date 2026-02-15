"use client";

import { FadeIn } from "@ojpp/ui";
import { LivingCanvas } from "@/components/living-canvas";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-80 overflow-hidden flex items-end">
        <LivingCanvas particleCount={300} palette="mono" interactive className="opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050505]" />

        <div className="relative z-10 mx-auto max-w-4xl w-full px-6 pb-10">
          <FadeIn>
            <h1
              className="text-5xl font-black tracking-tighter text-white sm:text-6xl"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              About
            </h1>
            <p className="mt-3 text-white/30 max-w-xl leading-relaxed">
              計算機自然的アプローチで市民の声を「生態系」として扱う、 次世代の熟議基盤。
            </p>
          </FadeIn>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-6 py-16 space-y-24">
        {/* Mission */}
        <FadeIn>
          <section>
            <div className="text-xs text-white/15 font-bold uppercase tracking-widest mb-4">
              Mission
            </div>
            <div className="glass-card p-8">
              <p className="text-white/60 leading-relaxed text-lg">
                BroadListeningは、Polisの統計的クラスタリング、Talk to the Cityのナラティブ抽出、
                Habermas Machineの合意形成を超え、3つの独自コンセプトを統合する。
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {["意見生態系", "デジタルフェロモン", "議論構造マイニング"].map((c) => (
                  <span key={c} className="badge-lumi badge-lumi--cyan">
                    {c}
                  </span>
                ))}
              </div>
              <p className="mt-6 text-white/35 leading-relaxed">
                既存のBroad Listeningツールが「意見分布の可視化」に留まるのに対し、
                本プラットフォームは意見間の動的な相互作用をシミュレートし、
                自己組織化的に合意が形成されるプロセスそのものを可視化する。
              </p>
            </div>
          </section>
        </FadeIn>

        {/* AI Participation */}
        <FadeIn>
          <section>
            <div className="text-xs text-white/15 font-bold uppercase tracking-widest mb-4">
              AI Participation
            </div>
            <h2
              className="text-2xl font-black text-white mb-8"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              AIはどう参加するか
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "多視点意見生成",
                  desc: "Claude APIが議論テーマを多角的に分析し、賛成・反対・中立それぞれの視点から合理的な意見を自動生成。",
                },
                {
                  title: "議論構造自動抽出",
                  desc: "投稿された意見からClaim・Premise・Evidence・Rebuttalを自動抽出。Attack/Support関係をリアルタイムでグラフ化。",
                },
                {
                  title: "議論ギャップ検出",
                  desc: "MISSING_EVIDENCE（証拠不足）、UNADDRESSED_CLAIM（未回答主張）、WEAK_PREMISE（弱い前提）を自動検出。",
                },
                {
                  title: "意見クラスタリング",
                  desc: "TF-IDFベースのエンベディングとk-means++で意見を自動分類。各クラスタにLLMが直感的なラベルを付与。",
                },
              ].map((item, i) => (
                <div
                  key={item.title}
                  className="glass-card p-6 animate-in"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <h3 className="text-sm font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-white/30 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </FadeIn>

        {/* Mathematical Foundations */}
        <FadeIn>
          <section>
            <div className="text-xs text-white/15 font-bold uppercase tracking-widest mb-4">
              Mathematics
            </div>
            <h2
              className="text-2xl font-black text-white mb-8"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              数理的基盤
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  name: "Pheromone Decay",
                  formula: "I(t) = I₀ · e^{-λt}",
                  desc: "時間経過に伴う指数関数的減衰。λ = 0.01。",
                },
                {
                  name: "Fitness Function",
                  formula: "f = R · ln(1 + S) · P",
                  desc: "R: 堅牢性, S: 支持数, P: 持続性。",
                },
                {
                  name: "Shannon Diversity",
                  formula: "H = -Σ pᵢ · ln(pᵢ)",
                  desc: "クラスタ間の意見分布均等性。生態系健全性指標。",
                },
                {
                  name: "Quorum Sensing",
                  formula: "Q = H_norm · C · (1 - G)",
                  desc: "正規化多様性×収束度×(1-Gini)。フェーズ遷移閾値。",
                },
              ].map((f) => (
                <div key={f.name} className="glass-card p-6">
                  <div className="text-[10px] text-white/20 uppercase tracking-widest mb-2">
                    {f.name}
                  </div>
                  <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] px-4 py-3 mb-3">
                    <code
                      className="text-sm text-aurora"
                      style={{ fontFamily: "var(--font-outfit)" }}
                    >
                      {f.formula}
                    </code>
                  </div>
                  <p className="text-xs text-white/25 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </FadeIn>

        {/* Architecture */}
        <FadeIn>
          <section>
            <div className="text-xs text-white/15 font-bold uppercase tracking-widest mb-4">
              Architecture
            </div>
            <h2
              className="text-2xl font-black text-white mb-8"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              システムアーキテクチャ
            </h2>

            <div className="space-y-3">
              {[
                {
                  layer: "Input",
                  items: ["市民の意見投稿", "AIエージェント意見生成", "関連法案データ"],
                  color: "cyan",
                },
                {
                  layer: "Processing",
                  items: ["Argument Mining", "TF-IDF + k-means++", "Pheromone Dynamics"],
                  color: "emerald",
                },
                {
                  layer: "Output",
                  items: ["Ecosystem Viz", "Argument Graph", "Pheromone Heatmap"],
                  color: "violet",
                },
              ].map((layer) => (
                <div key={layer.layer} className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`h-2 w-2 rounded-full bg-${layer.color}-400`} />
                    <span className="text-xs font-bold text-white/40 uppercase tracking-widest">
                      {layer.layer}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {layer.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-white/[0.03] border border-white/[0.05] px-3 py-1 text-xs text-white/40"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </FadeIn>

        {/* Tech Stack */}
        <FadeIn>
          <section>
            <div className="text-xs text-white/15 font-bold uppercase tracking-widest mb-4">
              Stack
            </div>
            <div className="glass-card p-6">
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { cat: "Frontend", items: "Next.js 15, React 19, Tailwind CSS 4, Canvas 2D" },
                  { cat: "Backend", items: "API Routes, Prisma v6, SQLite" },
                  { cat: "AI/ML", items: "Claude API, TF-IDF, k-means++" },
                ].map((s) => (
                  <div key={s.cat}>
                    <div className="text-[10px] text-white/15 uppercase tracking-widest mb-1">
                      {s.cat}
                    </div>
                    <p className="text-sm text-white/40">{s.items}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </FadeIn>

        {/* References */}
        <FadeIn>
          <section className="pb-10">
            <div className="text-xs text-white/15 font-bold uppercase tracking-widest mb-4">
              References
            </div>
            <div className="glass-card p-6">
              <ul className="space-y-2 text-sm text-white/30">
                <li>Polis — Statistical opinion clustering with real-time visualization</li>
                <li>Talk to the City — LLM-powered narrative extraction</li>
                <li>Habermas Machine — AI-mediated consensus generation</li>
                <li>Dorigo et al. — Ant Colony Optimization and Stigmergy</li>
                <li>Dung (1995) — Argumentation Frameworks</li>
                <li>Shannon (1948) — A Mathematical Theory of Communication</li>
              </ul>
            </div>
          </section>
        </FadeIn>
      </div>
    </div>
  );
}
