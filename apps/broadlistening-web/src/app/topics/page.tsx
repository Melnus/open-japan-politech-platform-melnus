"use client";

import { FadeIn } from "@ojpp/ui";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LivingCanvas } from "@/components/living-canvas";

interface TopicSummary {
  id: string;
  title: string;
  description: string;
  phase: string;
  createdAt: string;
  _count: { opinions: number; clusters: number };
}

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

export default function TopicsPage() {
  const [topics, setTopics] = useState<TopicSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    fetch("/api/topics?limit=50")
      .then((r) => (r.ok ? r.json() : { data: [] }))
      .then((d) => setTopics(d.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSeed() {
    setSeeding(true);
    try {
      await fetch("/api/seed", { method: "POST" });
      const res = await fetch("/api/topics?limit=50");
      if (res.ok) {
        const d = await res.json();
        setTopics(d.data ?? []);
      }
    } catch {
      /* ignore */
    } finally {
      setSeeding(false);
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header with mini flow field */}
      <section className="relative h-56 overflow-hidden flex items-end">
        <LivingCanvas
          particleCount={200}
          palette="cyan"
          interactive={false}
          className="opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505]" />

        <div className="relative z-10 mx-auto max-w-5xl w-full px-6 pb-8">
          <FadeIn>
            <div className="flex items-end justify-between">
              <div>
                <h1
                  className="text-4xl font-black tracking-tight text-white"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  Topics
                </h1>
                <p className="mt-2 text-white/30 text-sm">
                  {topics.length > 0
                    ? `${topics.length} active discussions`
                    : "議論のフローフィールドへ"}
                </p>
              </div>
              <div className="flex gap-3">
                {topics.length === 0 && !loading && (
                  <button
                    type="button"
                    onClick={handleSeed}
                    disabled={seeding}
                    className="btn-glass text-sm"
                  >
                    {seeding ? "生成中..." : "Sample Data"}
                  </button>
                )}
                <Link href="/topics/new" className="btn-glow text-sm">
                  New Topic
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Topic grid */}
      <section className="mx-auto max-w-5xl px-6 py-8">
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {["skel-1", "skel-2", "skel-3", "skel-4"].map((id) => (
              <div key={id} className="glass-card animate-pulse p-7">
                <div className="h-4 w-40 rounded bg-white/[0.04]" />
                <div className="mt-4 h-3 w-full rounded bg-white/[0.02]" />
                <div className="mt-2 h-3 w-2/3 rounded bg-white/[0.02]" />
              </div>
            ))}
          </div>
        ) : topics.length === 0 ? (
          <FadeIn>
            <div className="glass-card p-16 text-center">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-white/[0.02] mb-6">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-white/15"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 12h8m-4-4v8" strokeLinecap="round" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">No topics yet</h2>
              <p className="text-white/25 mb-8 max-w-md mx-auto">
                サンプルデータで試すか、新しいトピックを作成して生態系を起動しましょう。
              </p>
              <div className="flex gap-4 justify-center">
                <button type="button" onClick={handleSeed} disabled={seeding} className="btn-glass">
                  {seeding ? "生成中..." : "Sample Data"}
                </button>
                <Link href="/topics/new" className="btn-glow">
                  Create Topic
                </Link>
              </div>
            </div>
          </FadeIn>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {topics.map((topic, i) => {
              const phase = PHASE_MAP[topic.phase] ?? PHASE_MAP.OPEN;
              return (
                <FadeIn key={topic.id} delay={Math.min(i * 0.06, 0.5)}>
                  <Link href={`/topics/${topic.id}`}>
                    <div className="organism-card p-7 cursor-pointer group h-full">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors duration-300 line-clamp-1 flex-1">
                          {topic.title}
                        </h3>
                        <span className={phase.badge}>
                          <span className={`phase-dot ${phase.dot}`} />
                          {phase.label}
                        </span>
                      </div>
                      <p className="text-sm text-white/25 leading-relaxed line-clamp-2 mb-5">
                        {topic.description}
                      </p>

                      {/* Mini stats bar */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5 text-xs text-white/15">
                          <span className="flex items-center gap-1.5">
                            <span className="h-1 w-1 rounded-full bg-cyan-400/50" />
                            {topic._count.opinions} opinions
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className="h-1 w-1 rounded-full bg-emerald-400/50" />
                            {topic._count.clusters} clusters
                          </span>
                        </div>
                        <span className="text-[10px] text-white/10">
                          {new Date(topic.createdAt).toLocaleDateString("ja-JP")}
                        </span>
                      </div>

                      {/* Activity bar — visual pulse based on opinion count */}
                      <div className="mt-4 h-0.5 w-full rounded-full bg-white/[0.03] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-400/40 to-emerald-400/40 transition-all duration-1000"
                          style={{ width: `${Math.min(topic._count.opinions * 5, 100)}%` }}
                        />
                      </div>
                    </div>
                  </Link>
                </FadeIn>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
