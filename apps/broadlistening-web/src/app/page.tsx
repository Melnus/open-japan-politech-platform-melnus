"use client";

import { AnimatedCounter, FadeIn } from "@ojpp/ui";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LivingCanvas } from "@/components/living-canvas";
import {
  ArgumentMiniGraph,
  ConvergenceDots,
  DecayCurveGraph,
  DiversityBarsGraph,
  FitnessCurveGraph,
  OpinionBubbles,
} from "@/components/mini-viz";
import { OpinionStream } from "@/components/opinion-stream";

interface TopicSummary {
  id: string;
  title: string;
  description: string;
  phase: string;
  createdAt: string;
  _count: { opinions: number; clusters: number };
}

interface StreamOpinion {
  content: string;
  stance: string;
  fitness: number;
}

/** ヒーローセクション用ハードコード意見 — API待ちなしで即表示 */
const HERO_OPINIONS: StreamOpinion[] = [
  {
    content: "児童手当を月5万円に引き上げるべき。フランスの家族手当モデルが参考になる。",
    stance: "FOR",
    fitness: 0.88,
  },
  {
    content: "現金給付だけでは効果が薄い。保育所の待機児童ゼロが先決。",
    stance: "AGAINST",
    fitness: 0.72,
  },
  {
    content: "大学教育費の完全無償化が最も効果的。教育費への不安が最大の理由。",
    stance: "FOR",
    fitness: 0.81,
  },
  {
    content: "少子化は個人の選択の結果であり、政府が介入すべきではない。",
    stance: "AGAINST",
    fitness: 0.65,
  },
  {
    content: "企業の働き方改革こそ本丸。テレワーク・フレックスの義務化を。",
    stance: "NEUTRAL",
    fitness: 0.77,
  },
  { content: "EU型の包括的なリスクベース規制を早期に導入すべき。", stance: "FOR", fitness: 0.85 },
  {
    content: "過度な規制はイノベーションを阻害する。ソフトローで柔軟に対応すべき。",
    stance: "AGAINST",
    fitness: 0.7,
  },
  { content: "AIが生成したコンテンツには透かしを義務化すべき。", stance: "FOR", fitness: 0.82 },
  { content: "AIリテラシー教育を義務教育に組み込むべき。", stance: "NEUTRAL", fitness: 0.79 },
  { content: "再生可能エネルギー100%を2035年までに達成すべき。", stance: "FOR", fitness: 0.83 },
  {
    content: "原発再稼働は現実的に必要。ベースロード電源として不可欠。",
    stance: "AGAINST",
    fitness: 0.68,
  },
  {
    content: "カーボンプライシングの早期導入で市場メカニズムを活用すべき。",
    stance: "FOR",
    fitness: 0.76,
  },
  {
    content: "地方分権の強化を求む。都市部と地方で必要な施策は大きく異なる。",
    stance: "FOR",
    fitness: 0.74,
  },
  { content: "デジタル民主主義の推進。市民参加型の政策立案を。", stance: "FOR", fitness: 0.86 },
  { content: "社会保障制度の持続可能性を根本から再設計すべき。", stance: "NEUTRAL", fitness: 0.71 },
  { content: "オープンデータの活用推進。透明性のある政治資金を。", stance: "FOR", fitness: 0.8 },
  { content: "多様性を尊重する社会制度の構築が急務。", stance: "NEUTRAL", fitness: 0.73 },
  { content: "次世代への投資拡大。科学技術政策の充実を。", stance: "FOR", fitness: 0.78 },
  {
    content: "男女の賃金格差の解消が最優先。経済的自立なしに安心して産めない。",
    stance: "FOR",
    fitness: 0.84,
  },
  { content: "保育士の給与を一般企業並みに引き上げるべき。", stance: "FOR", fitness: 0.75 },
  {
    content: "マイナンバー制度の利便性向上と、プライバシー保護の両立を。",
    stance: "NEUTRAL",
    fitness: 0.69,
  },
  { content: "防衛費増額より教育・研究開発投資を優先すべき。", stance: "AGAINST", fitness: 0.67 },
  { content: "選挙制度改革。若者の投票率を上げるオンライン投票を。", stance: "FOR", fitness: 0.87 },
  { content: "気候変動への具体的行動計画。2030年目標の引き上げを。", stance: "FOR", fitness: 0.82 },
  { content: "フリーランス・ギグワーカーの社会保障を整備すべき。", stance: "FOR", fitness: 0.76 },
  {
    content: "公共交通のバリアフリー化を加速すべき。高齢社会のインフラ整備。",
    stance: "FOR",
    fitness: 0.72,
  },
  {
    content: "食料自給率の向上は国家安全保障の問題。農業政策の抜本改革を。",
    stance: "FOR",
    fitness: 0.74,
  },
  { content: "空き家問題と住宅政策。若者に手の届く住宅供給を。", stance: "NEUTRAL", fitness: 0.7 },
  {
    content: "メンタルヘルスケアの公的支援を拡充すべき。社会的コストは計り知れない。",
    stance: "FOR",
    fitness: 0.79,
  },
  { content: "地域包括ケアシステムの全国展開を急ぐべき。", stance: "FOR", fitness: 0.71 },
  { content: "顔認識AIの公共空間での使用を厳しく制限すべき。", stance: "FOR", fitness: 0.8 },
  {
    content: "介護離職ゼロの実現。介護と仕事の両立支援を制度化すべき。",
    stance: "FOR",
    fitness: 0.77,
  },
  {
    content: "子どもの貧困対策。教育格差を生まない社会の仕組みづくり。",
    stance: "FOR",
    fitness: 0.85,
  },
  {
    content: "災害対策のDX。AI・ドローンを活用した防災システムの構築を。",
    stance: "FOR",
    fitness: 0.78,
  },
  {
    content: "文化芸術への公的投資を倍増すべき。GDP比0.1%は先進国最低水準。",
    stance: "FOR",
    fitness: 0.73,
  },
  { content: "デジタル庁の権限を強化し、行政のDXを加速すべき。", stance: "FOR", fitness: 0.76 },
];

/** ヒーローセクション用ハードコード統計値 */
const HERO_STATS = { topicCount: 5, totalOpinions: 200 };

const PHASE_MAP: Record<string, { label: string; badge: string; dot: string }> = {
  OPEN: { label: "Collecting", badge: "badge-lumi badge-lumi--emerald", dot: "bg-emerald-400" },
  DELIBERATION: {
    label: "Deliberating",
    badge: "badge-lumi badge-lumi--amber",
    dot: "bg-amber-400",
  },
  CONVERGENCE: { label: "Converging", badge: "badge-lumi badge-lumi--cyan", dot: "bg-cyan-400" },
  CLOSED: { label: "Closed", badge: "badge-lumi badge-lumi--rose", dot: "bg-white/30" },
};

const STEPS = [
  {
    num: "01",
    title: "意見を投げ込む",
    subtitle: "Voice Your Perspective",
    desc: "トピックを選んで、あなたの考えを投稿する。賛成・反対・中立、どの立場でも。AIエージェントも独自の視点から参加する。すべての声が、この生態系の養分になる。",
    accent: "from-cyan-400 to-cyan-600",
    glow: "rgba(34, 211, 238, 0.15)",
    Viz: OpinionBubbles,
  },
  {
    num: "02",
    title: "生態系が動き出す",
    subtitle: "Ecosystem Awakens",
    desc: "LLMが議論構造を自動抽出。Claim、Premise、Evidence、Rebuttalに分解される。意見はクラスタリングされ、デジタルフェロモンが支持の軌跡を描く。適応度の高い意見が浮かび上がる。",
    accent: "from-emerald-400 to-emerald-600",
    glow: "rgba(52, 211, 153, 0.15)",
    Viz: ArgumentMiniGraph,
  },
  {
    num: "03",
    title: "合意が自己組織化する",
    subtitle: "Self-Organizing Consensus",
    desc: "クオーラムセンシングが多様性と収束のバランスを測定。Shannon多様性指数 H = -Σ pᵢ·ln(pᵢ) が生態系の健全性を示し、自然な合意形成プロセスそのものが可視化される。",
    accent: "from-violet-400 to-violet-600",
    glow: "rgba(139, 92, 246, 0.15)",
    Viz: ConvergenceDots,
  },
];

export default function HomePage() {
  const [topics, setTopics] = useState<TopicSummary[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const topicsRes = await fetch("/api/topics?limit=20");
        const topicsData = topicsRes.ok ? await topicsRes.json() : { data: [] };
        setTopics(topicsData.data ?? []);
      } catch {
        /* ignore */
      } finally {
        setLoaded(true);
      }
    }
    fetchData();
  }, []);

  // Parallax scroll tracking
  useEffect(() => {
    function onScroll() {
      setScrollY(window.scrollY);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative">
      {/* ═══════════════════════════════════════════
          HERO — Multi-layered immersive experience
          ═══════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative h-screen min-h-[700px] flex items-center overflow-hidden"
      >
        {/* Layer 0: Flow field particles */}
        <LivingCanvas particleCount={600} palette="cyan" interactive />

        {/* Layer 1: Opinion stream — ハードコード意見で即表示 */}
        <div className="absolute inset-0 z-[1] liquid-lens-container noise-flicker">
          <OpinionStream opinions={HERO_OPINIONS} lanes={18} className="h-full" density="dense" />
        </div>

        {/* Layer 2: Directional vignette */}
        <div
          className="absolute inset-0 z-[2]"
          style={{
            background: `
              radial-gradient(ellipse 55% 65% at 20% 50%, rgba(5,5,5,0.85), rgba(5,5,5,0.2)),
              linear-gradient(to right, rgba(5,5,5,0.55) 0%, rgba(5,5,5,0.05) 60%, rgba(5,5,5,0.4) 100%)
            `,
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-60 z-[2] bg-gradient-to-t from-[#050505] to-transparent" />

        {/* Layer 3: Content */}
        <div
          className="relative z-10 mx-auto max-w-7xl px-6 w-full"
          style={{ transform: `translateY(${scrollY * -0.1}px)` }}
        >
          <div className="max-w-2xl">
            <div className="animate-in">
              <span className="badge-lumi badge-lumi--cyan">
                <span className="phase-dot bg-cyan-400" />
                Open Japan PoliTech Platform
              </span>
            </div>

            <h1
              className="mt-8 text-7xl font-black tracking-tighter leading-[0.95] sm:text-9xl animate-in animate-in-delay-1"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              <span className="text-aurora">Broad</span>
              <br />
              <span className="text-white">Listening</span>
              <span className="text-cyan-400/40 text-4xl sm:text-5xl ml-3 align-super">β</span>
            </h1>

            <p className="mt-8 text-xl text-white/80 leading-relaxed max-w-lg animate-in animate-in-delay-2">
              いま画面を流れるテキストが、全国の市民の声。
              <span className="text-white font-bold">あなたの一言</span>が、 この流れに合流する。
            </p>

            <div className="mt-12 flex items-center gap-4 animate-in animate-in-delay-3">
              <Link href="/topics" className="btn-glow text-base py-4 px-8">
                声を投げ込む
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="ml-2"
                  aria-hidden="true"
                >
                  <path
                    d="M3 8h10m0 0L9 4m4 4L9 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              <Link href="/about" className="btn-glass text-base py-4 px-8">
                仕組みを知る
              </Link>
            </div>

            <div className="mt-16 flex gap-12 animate-in animate-in-delay-4">
              {[
                { value: HERO_STATS.topicCount, label: "Active Topics" },
                { value: HERO_STATS.totalOpinions, label: "Opinions Flowing" },
              ].map((s) => (
                <div key={s.label}>
                  <div
                    className="text-4xl font-black text-white"
                    style={{ fontFamily: "var(--font-outfit)" }}
                  >
                    <AnimatedCounter to={s.value} duration={2} />
                  </div>
                  <div className="text-xs text-white/50 font-medium uppercase tracking-widest mt-1">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-in animate-in-delay-5 z-10">
          <span className="text-[10px] text-white/20 uppercase tracking-[0.3em]">Scroll</span>
          <div className="h-10 w-px bg-gradient-to-b from-white/20 to-transparent animate-bounce-slow" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          HOW IT WORKS — With animated visualizations
          ═══════════════════════════════════════════ */}
      <section className="relative py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="text-center mb-6">
              <span className="text-xs text-white/15 uppercase tracking-[0.3em] font-bold">
                How it works
              </span>
            </div>
          </FadeIn>

          <div className="space-y-0">
            {STEPS.map((step, i) => (
              <FadeIn key={step.num} delay={i * 0.2}>
                <div className="relative py-20 border-b border-white/[0.03] last:border-0 group">
                  {/* Massive background number */}
                  <div
                    className="step-number absolute top-1/2 -translate-y-1/2 -left-4 select-none pointer-events-none"
                    style={{
                      fontSize: "clamp(150px, 22vw, 300px)",
                      fontFamily: "var(--font-outfit)",
                      fontWeight: 900,
                      color: "rgba(255,255,255,0.015)",
                      lineHeight: 1,
                    }}
                  >
                    {step.num}
                  </div>

                  {/* 2-column: Text + Visualization */}
                  <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                    {/* Left: Text */}
                    <div className="flex items-start gap-6">
                      <div className="shrink-0">
                        <div
                          className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${step.accent} text-white/90`}
                          style={{ boxShadow: `0 0 50px ${step.glow}` }}
                        >
                          <span
                            className="text-xl font-black"
                            style={{ fontFamily: "var(--font-outfit)" }}
                          >
                            {step.num}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-[10px] text-white/15 uppercase tracking-[0.2em] font-bold mb-2">
                          {step.subtitle}
                        </div>
                        <h3
                          className="text-2xl sm:text-3xl font-black text-white mb-4 tracking-tight"
                          style={{ fontFamily: "var(--font-outfit)" }}
                        >
                          {step.title}
                        </h3>
                        <p className="text-sm text-white/35 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>

                    {/* Right: Animated Visualization */}
                    <div className="relative h-64 md:h-72 rounded-2xl overflow-hidden bg-white/[0.02] border border-white/[0.04]">
                      <step.Viz className="w-full h-full" />
                      {/* Subtle scan lines overlay */}
                      <div className="absolute inset-0 scan-lines pointer-events-none opacity-50" />
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          LIVE TOPICS — Liquid floating cards
          ═══════════════════════════════════════════ */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="morph-blob w-[600px] h-[600px] bg-cyan-500/20 -left-60 top-20" />
        <div
          className="morph-blob w-[400px] h-[400px] bg-violet-500/15 right-0 bottom-0"
          style={{ animationDelay: "-8s" }}
        />

        <div className="relative mx-auto max-w-6xl">
          <FadeIn>
            <div className="flex items-end justify-between mb-16">
              <div>
                <span className="text-xs text-white/15 uppercase tracking-[0.3em] font-bold block mb-3">
                  Live Ecosystem
                </span>
                <h2
                  className="text-5xl sm:text-6xl font-black tracking-tight text-white"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  Topics
                </h2>
                <p className="mt-4 text-white/30 text-lg">いま動いている議論に飛び込む</p>
              </div>
              <Link href="/topics" className="btn-glass text-sm">
                All topics →
              </Link>
            </div>
          </FadeIn>

          {!loaded ? (
            <div className="grid gap-6 md:grid-cols-2">
              {["skel-1", "skel-2", "skel-3", "skel-4"].map((id) => (
                <div key={id} className="glass-card animate-pulse p-8" style={{ minHeight: 180 }}>
                  <div className="h-4 w-32 rounded bg-white/5" />
                  <div className="mt-4 h-3 w-full rounded bg-white/[0.02]" />
                  <div className="mt-2 h-3 w-2/3 rounded bg-white/[0.02]" />
                </div>
              ))}
            </div>
          ) : topics.length === 0 ? (
            <FadeIn>
              <div className="glass-card p-20 text-center">
                <h3 className="text-2xl font-bold text-white mb-3">生態系はまだ空です</h3>
                <p className="text-white/30 mb-10 max-w-md mx-auto text-lg">
                  最初のトピックを作成して、意見のフローフィールドを起動させましょう。
                </p>
                <Link href="/topics/new" className="btn-glow text-base py-4 px-8">
                  最初のトピックを作成
                </Link>
              </div>
            </FadeIn>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {topics.map((topic, i) => {
                const phase = PHASE_MAP[topic.phase] ?? PHASE_MAP.OPEN;
                return (
                  <FadeIn key={topic.id} delay={i * 0.1}>
                    <Link href={`/topics/${topic.id}`}>
                      <div
                        className="liquid-card p-8 cursor-pointer group h-full"
                        style={{
                          animationName: "bubble-float",
                          animationDuration: `${5 + (i % 3) * 2}s`,
                          animationTimingFunction: "ease-in-out",
                          animationIterationCount: "infinite",
                          animationDelay: `${i * -1.5}s`,
                        }}
                      >
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors duration-500 line-clamp-1">
                            {topic.title}
                          </h3>
                          <span className={phase.badge}>
                            <span className={`phase-dot ${phase.dot}`} />
                            {phase.label}
                          </span>
                        </div>
                        <p className="text-sm text-white/30 leading-relaxed line-clamp-2 mb-6">
                          {topic.description}
                        </p>

                        <div className="flex items-center gap-6 text-xs text-white/25">
                          <span className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-cyan-400/50 animate-pulse" />
                            <span
                              className="text-lg font-black text-white/60"
                              style={{ fontFamily: "var(--font-outfit)" }}
                            >
                              {topic._count.opinions}
                            </span>
                            opinions
                          </span>
                          <span className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-400/50" />
                            <span
                              className="text-lg font-black text-white/60"
                              style={{ fontFamily: "var(--font-outfit)" }}
                            >
                              {topic._count.clusters}
                            </span>
                            clusters
                          </span>
                        </div>

                        {/* Activity bar */}
                        <div className="mt-5 h-1 w-full rounded-full bg-white/[0.04] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-400/50 via-emerald-400/40 to-violet-400/30 transition-all duration-2000"
                            style={{ width: `${Math.min(topic._count.opinions * 3, 100)}%` }}
                          />
                        </div>
                      </div>
                    </Link>
                  </FadeIn>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CORE SCIENCE — Animated graphs + formulas
          ═══════════════════════════════════════════ */}
      <section className="relative py-40 px-6">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="text-center mb-16">
              <span className="text-xs text-white/15 uppercase tracking-[0.3em] font-bold block mb-3">
                How the System Thinks
              </span>
              <h2
                className="text-5xl sm:text-6xl font-black tracking-tight text-white mb-4"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                3つのアルゴリズム
              </h2>
              <p className="text-base text-white/25 max-w-2xl mx-auto leading-relaxed">
                BroadListeningは「多数決」ではありません。生態学・昆虫行動学・情報理論の3つの原理を使って、
                少数意見も含めた多様な声を公平に扱い、自然に合意を形成するシステムです。
              </p>
            </div>
          </FadeIn>

          <div className="space-y-32">
            {/* ── 適応度ランドスケープ ── */}
            <FadeIn>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
                <div>
                  <div className="text-[10px] text-white/15 uppercase tracking-[0.2em] font-bold mb-2">
                    Fitness Landscape
                  </div>
                  <h3
                    className="text-3xl font-black text-white mb-3 tracking-tight"
                    style={{ fontFamily: "var(--font-outfit)" }}
                  >
                    適応度ランドスケープ
                  </h3>
                  <code
                    className="inline-block text-xl font-bold text-cyan-400/80 mb-5"
                    style={{
                      fontFamily: "var(--font-outfit)",
                      textShadow: "0 0 20px rgba(34,211,238,0.3)",
                    }}
                  >
                    f = R · ln(1+S) · P
                  </code>
                  <p className="text-sm text-white/40 leading-relaxed mb-3">
                    各意見の「生存力」を3つの指標の積で定量化。適応度が高い意見が浮かび上がり、低い意見は背景に沈む。
                    対数関数により、100人の支持も10人の支持も「差が圧倒的」にはならない —
                    多数決の暴走を防ぐ設計。
                  </p>
                  <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-3 mb-5">
                    <p className="text-[11px] text-white/30 leading-relaxed">
                      <span className="text-cyan-400/60 font-bold">具体例:</span>{" "}
                      「AI規制は段階的に」（支持30、反論3回耐え、2日間安定）→ f=0.82（高適応度）。
                      「全面禁止すべき」（支持50だが反論で支持離散、1日で失速）→
                      f=0.41。支持数だけでは決まらない。
                    </p>
                  </div>
                  <div className="space-y-2.5">
                    <div className="flex items-start gap-3">
                      <code className="text-cyan-400/70 text-xs font-bold shrink-0 mt-0.5 w-6">
                        R
                      </code>
                      <p className="text-xs text-white/30 leading-relaxed">
                        <span className="text-white/50 font-medium">堅牢性（Robustness）</span> —
                        反論に対してどれだけ耐えたか。Rebuttalを受けても支持を維持した意見ほどRが高い。0〜1の範囲。
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <code className="text-cyan-400/70 text-xs font-bold shrink-0 mt-0.5 w-6">
                        S
                      </code>
                      <p className="text-xs text-white/30 leading-relaxed">
                        <span className="text-white/50 font-medium">支持数（Support Count）</span> —
                        その意見に明示的に「支持」を投じたユーザー数。右のグラフの横軸。
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <code className="text-cyan-400/70 text-xs font-bold shrink-0 mt-0.5 w-6">
                        P
                      </code>
                      <p className="text-xs text-white/30 leading-relaxed">
                        <span className="text-white/50 font-medium">持続性（Persistence）</span> —
                        投稿からの経過時間に対する支持の安定度。一時的なバズではなく、持続的に支持される意見を評価。
                      </p>
                    </div>
                  </div>
                </div>
                <div className="h-64 md:h-72 rounded-2xl overflow-hidden bg-white/[0.02] border border-white/[0.04]">
                  <FitnessCurveGraph className="rounded-2xl" />
                </div>
              </div>
            </FadeIn>

            {/* ── デジタルフェロモン ── */}
            <FadeIn delay={0.15}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
                <div className="order-2 md:order-1 h-64 md:h-72 rounded-2xl overflow-hidden bg-white/[0.02] border border-white/[0.04]">
                  <DecayCurveGraph className="rounded-2xl" />
                </div>
                <div className="order-1 md:order-2">
                  <div className="text-[10px] text-white/15 uppercase tracking-[0.2em] font-bold mb-2">
                    Digital Pheromone — Stigmergy
                  </div>
                  <h3
                    className="text-3xl font-black text-white mb-3 tracking-tight"
                    style={{ fontFamily: "var(--font-outfit)" }}
                  >
                    デジタルフェロモン
                  </h3>
                  <code
                    className="inline-block text-xl font-bold text-emerald-400/80 mb-5"
                    style={{
                      fontFamily: "var(--font-outfit)",
                      textShadow: "0 0 20px rgba(52,211,153,0.3)",
                    }}
                  >
                    I(t) = I₀ · e^&#123;-λt&#125;
                  </code>
                  <p className="text-sm text-white/40 leading-relaxed mb-3">
                    アリが巣と餌場の間にフェロモンの痕跡を残し、群れが最短経路を「発見」する仕組みを議論に応用。
                    ユーザーが意見に「支持」を投じるとフェロモン強度が上昇し、時間とともに指数関数的に減衰する。
                  </p>
                  <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-3 mb-5">
                    <p className="text-[11px] text-white/30 leading-relaxed">
                      <span className="text-emerald-400/60 font-bold">具体例:</span>{" "}
                      「教育無償化」に5人が支持 → フェロモン強度5.0。
                      3時間後、誰も追加支持しなければ →
                      強度2.2に減衰。一方「AI活用教育」に継続的に支持が集まり →
                      フェロモンが何度も強化 →
                      こちらの軌跡が太く残る。支持されない意見は自然に消える。
                    </p>
                  </div>
                  <div className="space-y-2.5">
                    <div className="flex items-start gap-3">
                      <code className="text-emerald-400/70 text-xs font-bold shrink-0 mt-0.5 w-6">
                        I₀
                      </code>
                      <p className="text-xs text-white/30 leading-relaxed">
                        <span className="text-white/50 font-medium">初期強度</span> —
                        支持が投じられた瞬間のフェロモン濃度。支持の品質（根拠の有無等）に応じて変動。
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <code className="text-emerald-400/70 text-xs font-bold shrink-0 mt-0.5 w-6">
                        λ
                      </code>
                      <p className="text-xs text-white/30 leading-relaxed">
                        <span className="text-white/50 font-medium">減衰率（Decay Rate）</span> —
                        フェロモンが揮発する速度。トピックの緊急性が高いほどλを大きく設定し、古い情報が素早く退場する。
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <code className="text-emerald-400/70 text-xs font-bold shrink-0 mt-0.5 w-6">
                        t
                      </code>
                      <p className="text-xs text-white/30 leading-relaxed">
                        <span className="text-white/50 font-medium">経過時間</span> —
                        最後に支持が投じられてからの時間。新たな支持でI₀がリセットされ、フェロモン軌跡が「強化」される。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* ── Shannon多様性指数 ── */}
            <FadeIn delay={0.3}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
                <div>
                  <div className="text-[10px] text-white/15 uppercase tracking-[0.2em] font-bold mb-2">
                    Ecosystem Health — Shannon Diversity Index
                  </div>
                  <h3
                    className="text-3xl font-black text-white mb-3 tracking-tight"
                    style={{ fontFamily: "var(--font-outfit)" }}
                  >
                    生態系健全性モニタリング
                  </h3>
                  <code
                    className="inline-block text-xl font-bold text-violet-400/80 mb-5"
                    style={{
                      fontFamily: "var(--font-outfit)",
                      textShadow: "0 0 20px rgba(139,92,246,0.3)",
                    }}
                  >
                    H = -Σ pᵢ · ln(pᵢ)
                  </code>
                  <p className="text-sm text-white/40 leading-relaxed mb-3">
                    議論が「一色に染まっていないか」を測る指標。Hが高い＝多様な視点が共存。Hが低い＝一つの意見に偏っている危険信号。
                    H値に基づいてフェーズが自動遷移: OPEN → DELIBERATION → CONVERGENCE → CLOSED。
                  </p>
                  <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-3 mb-5">
                    <p className="text-[11px] text-white/30 leading-relaxed">
                      <span className="text-violet-400/60 font-bold">具体例:</span>{" "}
                      5つのクラスタに20%ずつ均等に分布 → H=1.61（健全）。
                      1つのクラスタに80%が集中、残り4つに5%ずつ → H=0.92（偏り注意）。
                      さらに集中が進めば、システムがCONVERGENCEフェーズに自動遷移して合意形成へ。
                    </p>
                  </div>
                  <div className="space-y-2.5">
                    <div className="flex items-start gap-3">
                      <code className="text-violet-400/70 text-xs font-bold shrink-0 mt-0.5 w-6">
                        pᵢ
                      </code>
                      <p className="text-xs text-white/30 leading-relaxed">
                        <span className="text-white/50 font-medium">クラスタ比率</span> —
                        i番目の意見クラスタに属する意見数 ÷
                        全意見数。LLMがk-means++で自動クラスタリング。
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <code className="text-violet-400/70 text-xs font-bold shrink-0 mt-0.5 w-6">
                        H
                      </code>
                      <p className="text-xs text-white/30 leading-relaxed">
                        <span className="text-white/50 font-medium">多様性指数</span> —
                        0（全意見が同一クラスタ）〜
                        ln(k)（k個のクラスタが完全均等）。右のグラフは5クラスタでの計算例。
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <code className="text-violet-400/70 text-xs font-bold shrink-0 mt-0.5 w-6">
                        Σ
                      </code>
                      <p className="text-xs text-white/30 leading-relaxed">
                        <span className="text-white/50 font-medium">全クラスタの和</span> —
                        各クラスタの「驚き量」（-pᵢ·ln(pᵢ)）を合算。稀な視点ほど情報量が大きく、多様性に貢献する。
                      </p>
                    </div>
                  </div>
                </div>
                <div className="h-64 md:h-72 rounded-2xl overflow-hidden bg-white/[0.02] border border-white/[0.04]">
                  <DiversityBarsGraph className="rounded-2xl" />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ Footer ═══ */}
      <footer className="border-t border-white/[0.03] py-20 px-6">
        <div className="mx-auto max-w-6xl flex flex-col items-center text-center gap-5">
          <div
            className="text-2xl font-black tracking-tight"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            <span className="text-aurora">Broad</span>
            <span className="text-white/40">Listening</span>
          </div>
          <p className="text-sm text-white/15 max-w-md">
            Open Japan PoliTech Platform —
            政党にも企業にもよらない、完全オープンな政治テクノロジー基盤
          </p>
          <p className="text-[10px] text-white/10 uppercase tracking-widest">AGPL-3.0-or-later</p>
        </div>
      </footer>
    </div>
  );
}
