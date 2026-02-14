"use client";

import { AnimatePresence, motion } from "@ojpp/ui";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

interface Party {
  id: string;
  name: string;
  color: string | null;
}

interface Policy {
  id: string;
  title: string;
  content: string;
  party: Party | null;
}

/**
 * Markdownテキストを安全にReact要素へ変換する。
 * 対応記法: ## 見出し、- 箇条書き、空行による段落区切り。
 * dangerouslySetInnerHTML を使わないためXSSリスクがない。
 */
function renderMarkdown(text: string): ReactNode[] {
  const blocks = text.split(/\n\n+/);
  const elements: ReactNode[] = [];

  for (let bi = 0; bi < blocks.length; bi++) {
    const block = blocks[bi];
    const lines = block.split("\n");

    let li = 0;
    while (li < lines.length) {
      const line = lines[li];
      const headingMatch = line.match(/^##\s+(.+)$/);
      const listMatch = line.match(/^-\s+(.+)$/);

      if (headingMatch) {
        elements.push(
          <h3 key={`${bi}-${li}`} className="mt-3 mb-1 font-bold text-white">
            {headingMatch[1]}
          </h3>,
        );
        li++;
      } else if (listMatch) {
        const items: ReactNode[] = [];
        while (li < lines.length) {
          const m = lines[li].match(/^-\s+(.+)$/);
          if (!m) break;
          items.push(
            <li key={`${bi}-${li}`} className="ml-4 text-slate-400">
              {m[1]}
            </li>,
          );
          li++;
        }
        elements.push(
          <ul key={`${bi}-list-${li}`} className="list-disc">
            {items}
          </ul>,
        );
      } else {
        if (line.trim()) {
          elements.push(
            <p key={`${bi}-${li}`} className="text-slate-400">
              {line}
            </p>,
          );
        }
        li++;
      }
    }

    if (bi < blocks.length - 1) {
      elements.push(<br key={`br-${bi}`} />);
    }
  }

  return elements;
}

const CATEGORIES = [
  "教育",
  "子育て",
  "医療",
  "経済・財政",
  "デジタル",
  "エネルギー",
  "外交・安全保障",
  "福祉",
  "産業",
  "科学技術",
];

export default function ComparePage() {
  const [parties, setParties] = useState<Party[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("教育");
  const [selectedParties, setSelectedParties] = useState<string[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/parties")
      .then((r) => r.json())
      .then((json) => {
        const data = json.data.filter((p: Party & { _count?: { policies: number } }) =>
          (p._count as { policies: number } | undefined)?.policies !== undefined
            ? (p._count as { policies: number }).policies > 0
            : true,
        );
        setParties(data);
        setSelectedParties(data.slice(0, 4).map((p: Party) => p.name));
      });
  }, []);

  useEffect(() => {
    if (!selectedCategory || selectedParties.length === 0) {
      setPolicies([]);
      return;
    }
    setLoading(true);
    const params = new URLSearchParams({
      category: selectedCategory,
      parties: selectedParties.join(","),
    });
    fetch(`/api/compare?${params}`)
      .then((r) => r.json())
      .then((json) => {
        setPolicies(json.data);
        setLoading(false);
      });
  }, [selectedCategory, selectedParties]);

  function toggleParty(name: string) {
    setSelectedParties((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name],
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-2 text-3xl font-extrabold tracking-tight text-white">政党比較</h2>
          <p className="mb-10 text-slate-400">
            カテゴリと政党を選択して、各政党の政策を横並びで比較できます。
          </p>
        </motion.div>

        {/* Category chips */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h3 className="mb-3 text-sm font-bold text-slate-500 uppercase tracking-wider">
            カテゴリを選択
          </h3>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`filter-chip ${selectedCategory === cat ? "filter-chip--active" : ""}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Party selection */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h3 className="mb-3 text-sm font-bold text-slate-500 uppercase tracking-wider">
            政党を選択
          </h3>
          <div className="flex flex-wrap gap-2">
            {parties.map((party) => {
              const isSelected = selectedParties.includes(party.name);
              return (
                <motion.button
                  key={party.id}
                  type="button"
                  onClick={() => toggleParty(party.name)}
                  className="inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-medium transition-all"
                  style={{
                    borderColor: isSelected
                      ? (party.color ?? "#6b7280")
                      : `${party.color ?? "#6b7280"}40`,
                    color: isSelected
                      ? (party.color ?? "#94a3b8")
                      : `${party.color ?? "#94a3b8"}80`,
                    backgroundColor: isSelected ? `${party.color ?? "#6b7280"}15` : "transparent",
                    opacity: isSelected ? 1 : 0.5,
                  }}
                  whileHover={{ scale: 1.04, opacity: 1 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {party.color && (
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: party.color }}
                    />
                  )}
                  {party.name}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Policy comparison cards */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <motion.div
              className="flex items-center gap-3 text-slate-500"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            >
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              読み込み中...
            </motion.div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedCategory}-${selectedParties.join(",")}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {policies.length > 0 ? (
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {policies.map((policy, i) => (
                    <motion.div
                      key={policy.id}
                      className="glass-card flex flex-col p-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: i * 0.06,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                      whileHover={{
                        y: -4,
                        transition: { duration: 0.2 },
                      }}
                    >
                      {/* Party name with color chip */}
                      <div className="mb-4 flex items-center gap-2">
                        {policy.party?.color && (
                          <span
                            className="inline-block h-3 w-3 rounded-full shadow-sm"
                            style={{
                              backgroundColor: policy.party.color,
                              boxShadow: `0 0 8px ${policy.party.color}60`,
                            }}
                          />
                        )}
                        <span
                          className="text-sm font-bold"
                          style={{ color: policy.party?.color ?? "#94a3b8" }}
                        >
                          {policy.party?.name ?? "不明"}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="mb-4 text-base font-bold text-white leading-snug">
                        {policy.title}
                      </h3>

                      {/* Content */}
                      <div className="mb-4 flex-1 space-y-1 text-sm leading-relaxed">
                        {renderMarkdown(policy.content)}
                      </div>

                      {/* Bottom divider + link */}
                      <div className="mt-auto border-t border-white/5 pt-4">
                        <a
                          href={`/policy/${policy.id}`}
                          className="inline-flex items-center gap-1 text-sm font-medium text-blue-400 transition-colors hover:text-blue-300"
                        >
                          詳細を見る
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="glass-card p-12 text-center">
                  <p className="text-slate-500">カテゴリと政党を選択してください。</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
