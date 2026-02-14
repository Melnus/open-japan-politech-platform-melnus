"use client";

import { ScrollReveal } from "@ojpp/ui";

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

export function ApiShowcase() {
  return (
    <ScrollReveal>
      <section className="mx-auto max-w-4xl px-3 py-8 sm:px-4">
        <p className="label-upper mb-3 tracking-[3px]">{"// AGENT & DEVELOPER API"}</p>

        <div className="border border-[var(--border)] bg-[var(--bg)]">
          {/* Terminal header bar */}
          <div className="flex items-center gap-2 border-b border-[var(--border)] px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--neon-pink)]" style={{ opacity: 0.6 }} />
            <span className="h-2 w-2 rounded-full bg-[var(--accent)]" style={{ opacity: 0.6 }} />
            <span className="h-2 w-2 rounded-full bg-[var(--neon-blue)]" style={{ opacity: 0.6 }} />
            <span className="kpi-value ml-2 text-[0.55rem] text-[var(--text-ghost)]">ojpp-api</span>
          </div>

          {/* Description */}
          <div className="border-b border-[var(--border)] px-3 py-2">
            <span className="kpi-value text-[0.6rem] text-[var(--text-dim)]">
              各サービスが独立したREST APIを提供 — JSON + ページネーション対応
            </span>
          </div>

          {/* Endpoint list */}
          <div>
            {API_ENDPOINTS.map((ep, i) => (
              <div
                key={`${ep.service}-${ep.path}`}
                className="flex items-center gap-3 border-b border-[var(--border)] px-3 py-1.5 text-[0.65rem] transition-colors last:border-b-0 hover:bg-[var(--accent-dim)]"
              >
                <span className="kpi-value text-[0.55rem] text-[var(--text-ghost)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="kpi-value w-8 font-bold text-[var(--accent)]">{ep.method}</span>
                <span className="kpi-value flex-1 text-[var(--text)]">{ep.path}</span>
                <span
                  className="kpi-value w-24 text-[0.5rem] tracking-[1px]"
                  style={{ color: SERVICE_COLORS[ep.service] }}
                >
                  {ep.service}
                </span>
                <span className="text-[var(--text-dim)]">{ep.desc}</span>
              </div>
            ))}
          </div>

          {/* Terminal footer */}
          <div className="border-t border-[var(--border)] px-3 py-1.5">
            <span className="kpi-value text-[0.5rem] text-[var(--text-ghost)]">
              {"6 apps // 32 endpoints // JSON + pagination // REST"}
            </span>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
