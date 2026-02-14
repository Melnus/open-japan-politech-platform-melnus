"use client";

import { ScrollReveal } from "@ojpp/ui";
import { useState } from "react";

/* ── Copy button ── */
function CopyBtn({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };
  return (
    <button
      onClick={handleCopy}
      className="mono shrink-0 border border-[var(--border)] px-2 py-0.5 text-[0.55rem] tracking-wider transition-all hover:border-[var(--accent)] hover:text-[var(--accent)]"
      style={
        copied
          ? {
              borderColor: "var(--accent)",
              color: "var(--accent)",
              textShadow: "0 0 8px var(--accent)",
            }
          : {}
      }
    >
      {copied ? "COPIED!" : (label ?? "COPY")}
    </button>
  );
}

/* ── Copyable command block ── */
function CmdBlock({ cmd, comment }: { cmd: string; comment?: string }) {
  return (
    <div className="group flex items-center gap-3 border-b border-[var(--border)] px-3 py-2 transition-colors last:border-b-0 hover:bg-[var(--accent-dim)]">
      <span className="mono text-[0.6rem] text-[var(--accent)]">$</span>
      <code className="mono min-w-0 flex-1 truncate text-[0.65rem] text-[var(--text)]">{cmd}</code>
      {comment && (
        <span className="hidden text-[0.55rem] text-[var(--text-ghost)] sm:inline">{comment}</span>
      )}
      <CopyBtn text={cmd} />
    </div>
  );
}

/* ── Terminal card shell ── */
function TermCard({
  title,
  desc,
  children,
  className,
}: {
  title: string;
  desc: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col border border-[var(--border)] bg-[var(--bg)] ${className ?? ""}`}
    >
      {/* dots */}
      <div className="flex items-center gap-2 border-b border-[var(--border)] px-3 py-1.5">
        <span className="h-2 w-2 rounded-full bg-[var(--neon-pink)]" style={{ opacity: 0.6 }} />
        <span className="h-2 w-2 rounded-full bg-[var(--accent)]" style={{ opacity: 0.6 }} />
        <span className="h-2 w-2 rounded-full bg-[var(--neon-blue)]" style={{ opacity: 0.6 }} />
        <span className="kpi-value ml-2 text-[0.55rem] text-[var(--text-ghost)]">{title}</span>
      </div>
      {/* desc */}
      <div className="border-b border-[var(--border)] px-3 py-2">
        <span className="kpi-value text-[0.6rem] text-[var(--text-dim)]">{desc}</span>
      </div>
      {/* content */}
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}

const API_EXAMPLES = [
  { cmd: "curl -s https://moneyglass.ojpp.dev/api/parties | jq", comment: "全政党データ" },
  { cmd: "curl -s https://parliscope.ojpp.dev/api/bills | jq", comment: "法案一覧" },
  { cmd: "curl -s https://seatmap.ojpp.dev/api/elections | jq", comment: "選挙データ" },
];

const API_ENDPOINTS = [
  { method: "GET", path: "/api/parties", service: "MONEYGLASS", desc: "全政党一覧" },
  { method: "GET", path: "/api/organizations", service: "MONEYGLASS", desc: "政治団体一覧" },
  { method: "GET", path: "/api/reports", service: "MONEYGLASS", desc: "収支報告書" },
  { method: "GET", path: "/api/politicians", service: "PARLISCOPE", desc: "議員一覧" },
  { method: "GET", path: "/api/bills", service: "PARLISCOPE", desc: "法案一覧" },
  { method: "GET", path: "/api/sessions", service: "PARLISCOPE", desc: "国会会期" },
  { method: "GET", path: "/api/policies", service: "POLICYDIFF", desc: "政策文書" },
  { method: "GET", path: "/api/proposals", service: "POLICYDIFF", desc: "政策提案" },
  { method: "GET", path: "/api/elections", service: "SEATMAP", desc: "選挙データ" },
  { method: "GET", path: "/api/budgets", service: "CULTURESCOPE", desc: "文化予算" },
  { method: "GET", path: "/api/programs", service: "CULTURESCOPE", desc: "文化プログラム" },
  { method: "GET", path: "/api/budgets", service: "SOCIALGUARD", desc: "社会保障予算" },
  { method: "GET", path: "/api/welfare-stats", service: "SOCIALGUARD", desc: "都道府県別福祉" },
];

const SERVICE_COLORS: Record<string, string> = {
  MONEYGLASS: "#ff6b35",
  PARLISCOPE: "#a855f7",
  POLICYDIFF: "#3b82f6",
  SEATMAP: "#06d6d6",
  CULTURESCOPE: "#fbbf24",
  SOCIALGUARD: "#34d399",
};

const SETUP_CMD = "curl -fsSL https://ojpp.dev/install | sh";

export function ApiShowcase() {
  return (
    <section className="py-6">
      <div className="mx-auto max-w-7xl px-3 sm:px-4">
        <p className="label-upper mb-4 tracking-[3px]">{"// API & DEVELOPER"}</p>

        {/* ── Top row: Quick Access + 開発する ── */}
        <ScrollReveal>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {/* Quick Access — 2/3 width */}
            <TermCard
              title="ojpp-api — try it now"
              desc="コピーしてターミナルに貼り付けるだけ — 認証不要・完全オープンAPI"
              className="md:col-span-2"
            >
              {API_EXAMPLES.map((ex) => (
                <CmdBlock key={ex.cmd} cmd={ex.cmd} comment={ex.comment} />
              ))}
            </TermCard>

            {/* 開発する — 1/3 width */}
            <TermCard title="setup — 1 command" desc="ワンコマンドで全6サービスが起動">
              <div className="flex flex-1 flex-col">
                <CmdBlock cmd={SETUP_CMD} comment="all-in-one" />
                <div className="mt-auto border-t border-[var(--border)] px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="kpi-value text-[0.5rem] text-[var(--text-ghost)]">
                      AGPL-3.0
                    </span>
                    <a
                      href="https://github.com/ochyai/open-japan-politech-platform"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mono ml-auto border border-[var(--border)] px-2 py-0.5 text-[0.55rem] tracking-wider text-[var(--text-dim)] transition-all hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    >
                      GitHub →
                    </a>
                  </div>
                </div>
              </div>
            </TermCard>
          </div>
        </ScrollReveal>

        {/* ── Bottom row: Full API Reference — full width ── */}
        <ScrollReveal>
          <div className="mt-3">
            <TermCard
              title="ojpp-api — all endpoints"
              desc="各サービスが独立したREST APIを提供 — JSON + ページネーション対応"
            >
              {/* 2-column endpoint grid on desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2">
                {API_ENDPOINTS.map((ep, i) => (
                  <div
                    key={`${ep.service}-${ep.path}`}
                    className="flex items-center gap-3 border-b border-[var(--border)] px-3 py-1.5 text-[0.65rem] transition-colors hover:bg-[var(--accent-dim)] md:odd:border-r"
                  >
                    <span className="kpi-value text-[0.55rem] text-[var(--text-ghost)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="kpi-value w-8 font-bold text-[var(--accent)]">
                      {ep.method}
                    </span>
                    <span className="kpi-value flex-1 text-[var(--text)]">{ep.path}</span>
                    <span
                      className="kpi-value text-[0.5rem] tracking-[1px]"
                      style={{ color: SERVICE_COLORS[ep.service] }}
                    >
                      {ep.service}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[var(--border)] px-3 py-1.5">
                <span className="kpi-value text-[0.5rem] text-[var(--text-ghost)]">
                  {"6 apps // 13 routes // JSON + pagination // REST"}
                </span>
              </div>
            </TermCard>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
