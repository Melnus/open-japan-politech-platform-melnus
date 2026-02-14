"use client";

import { AnimatePresence, motion, useInView } from "@ojpp/ui";
import { useRef, useState } from "react";

interface DashboardProps {
  stats: {
    policyCount: number;
    partyCount: number;
    categoryCount: number;
    proposalCount: number;
  };
  parties: { id: string; name: string; color: string | null }[];
  categories: { category: string; count: number }[];
  policies: {
    id: string;
    title: string;
    category: string;
    content: string;
    partyName: string | null;
    partyColor: string | null;
  }[];
  proposals: {
    id: string;
    title: string;
    status: string;
    partyName: string | null;
    policyTitle: string;
  }[];
}

/* ── Animated Stat Card ── */
function StatCard({ label, value, delay }: { label: string; value: number; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      className="stat-glow glass-card p-6"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ type: "spring", stiffness: 100, damping: 15, delay }}
    >
      <p className="text-sm font-medium text-slate-400">{label}</p>
      <motion.p
        className="mt-2 text-3xl font-bold tracking-tight text-white"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ type: "spring", stiffness: 120, damping: 12, delay: delay + 0.1 }}
      >
        {value.toLocaleString()}
      </motion.p>
    </motion.div>
  );
}

/* ── Policy Card (SVG-style) ── */
function PolicyCard({
  policy,
  index,
}: {
  policy: DashboardProps["policies"][number];
  index: number;
}) {
  const maxContent = 200;
  const totalPolicies = 12;
  const progressPercent = Math.max(30, Math.min(90, 80 - index * 5));

  return (
    <motion.a
      href={`/policy/${policy.id}`}
      className="glass-card block p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.06,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        y: -4,
        transition: { duration: 0.2 },
      }}
    >
      {/* Party header */}
      <div className="mb-3 flex items-center gap-2">
        {policy.partyColor && (
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: policy.partyColor }}
          />
        )}
        <span className="text-sm font-semibold text-white">{policy.partyName ?? "不明"}</span>
      </div>

      {/* Content preview */}
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        {policy.content.length > 80 ? `${policy.content.slice(0, 80)}...` : policy.content}
      </p>

      {/* Tags */}
      <div className="mb-4 flex flex-wrap gap-2">
        <span
          className="tag-badge"
          style={{
            backgroundColor: "rgba(59, 130, 246, 0.15)",
            color: "#60a5fa",
          }}
        >
          {policy.category}
        </span>
      </div>

      {/* Progress bar */}
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{
            width: `${progressPercent}%`,
            backgroundColor: policy.partyColor ?? "#3B82F6",
          }}
        />
      </div>
    </motion.a>
  );
}

export function DashboardClient({
  stats,
  parties,
  categories,
  policies,
  proposals,
}: DashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const isCardsInView = useInView(cardsRef, { once: true, margin: "-40px" });

  const filteredPolicies = selectedCategory
    ? policies.filter((p) => p.category === selectedCategory)
    : policies;

  const allCategories = categories.map((c) => c.category);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950">
      {/* ── Hero Section ── */}
      <section ref={heroRef} className="relative overflow-hidden pb-8 pt-16">
        {/* Dot grid background */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        {/* Glow line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />

        <div className="relative mx-auto max-w-7xl px-6">
          <motion.h1
            className="mb-3 text-4xl font-extrabold tracking-tight text-white md:text-5xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            政策を、差分で読み解く
          </motion.h1>
          <motion.p
            className="mb-10 max-w-2xl text-base text-slate-400"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            全政党のマニフェストを{stats.categoryCount}カテゴリで構造化比較
          </motion.p>

          {/* ── Stats Row ── */}
          <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="登録政策数" value={stats.policyCount} delay={0} />
            <StatCard label="政党数" value={stats.partyCount} delay={0.08} />
            <StatCard label="カテゴリ数" value={stats.categoryCount} delay={0.16} />
            <StatCard label="市民提案数" value={stats.proposalCount} delay={0.24} />
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <div className="mx-auto max-w-7xl px-6 pb-16">
        {/* ── Category Filter Chips ── */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className={`filter-chip ${selectedCategory === null ? "filter-chip--active" : ""}`}
            >
              すべて
            </button>
            {allCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory((prev) => (prev === cat ? null : cat))}
                className={`filter-chip ${selectedCategory === cat ? "filter-chip--active" : ""}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.section>

        {/* ── Policy Cards Grid ── */}
        <section className="mb-16" ref={cardsRef}>
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory ?? "all"}
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {filteredPolicies.length > 0 ? (
                filteredPolicies.map((policy, i) => (
                  <PolicyCard key={policy.id} policy={policy} index={i} />
                ))
              ) : (
                <div className="col-span-full py-16 text-center">
                  <p className="text-slate-500">該当する政策がありません。</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* ── Party List ── */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-6 text-2xl font-bold text-white">政党一覧</h2>
          <div className="flex flex-wrap gap-3">
            {parties.map((party, i) => (
              <motion.a
                key={party.id}
                href={`/party/${encodeURIComponent(party.name)}`}
                className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all hover:scale-[1.04]"
                style={{
                  borderColor: `${party.color ?? "#6b7280"}60`,
                  color: party.color ?? "#94a3b8",
                  backgroundColor: `${party.color ?? "#6b7280"}10`,
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                whileHover={{
                  backgroundColor: `${party.color ?? "#6b7280"}25`,
                  borderColor: party.color ?? "#6b7280",
                }}
              >
                {party.color && (
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: party.color }}
                  />
                )}
                {party.name}
              </motion.a>
            ))}
          </div>
        </motion.section>

        {/* ── Recent Proposals ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-6 text-2xl font-bold text-white">最近の政策変更提案</h2>
          {proposals.length > 0 ? (
            <div className="space-y-3">
              {proposals.map((proposal, i) => {
                const statusStyle =
                  proposal.status === "OPEN"
                    ? { bg: "rgba(59, 130, 246, 0.15)", color: "#60a5fa" }
                    : proposal.status === "ACCEPTED"
                      ? { bg: "rgba(34, 197, 94, 0.15)", color: "#4ade80" }
                      : proposal.status === "REJECTED"
                        ? { bg: "rgba(239, 68, 68, 0.15)", color: "#f87171" }
                        : { bg: "rgba(148, 163, 184, 0.15)", color: "#94a3b8" };
                return (
                  <motion.div
                    key={proposal.id}
                    className="glass-card flex items-center justify-between p-5"
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <div>
                      <h4 className="font-medium text-white">{proposal.title}</h4>
                      <p className="mt-1 text-xs text-slate-500">
                        {proposal.partyName} / {proposal.policyTitle}
                      </p>
                    </div>
                    <span
                      className="rounded-full px-3 py-1 text-xs font-semibold"
                      style={{
                        backgroundColor: statusStyle.bg,
                        color: statusStyle.color,
                      }}
                    >
                      {proposal.status}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="glass-card p-8 text-center">
              <p className="text-slate-500">まだ提案がありません。</p>
              <p className="mt-2 text-sm text-slate-600">
                GitHubからPull Requestを送るか、このサイトから提案できます。
              </p>
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}
