"use client";

import { FadeIn, GlowCard, StaggerGrid, StaggerItem } from "@ojpp/ui";

interface Endpoint {
  method: "GET" | "POST";
  path: string;
  description: string;
  params?: string[];
  body?: string[];
  response?: string;
}

const ENDPOINTS: Endpoint[] = [
  {
    method: "GET",
    path: "/api/topics",
    description: "トピック一覧を取得（ページネーション対応）",
    params: ["page", "limit"],
    response: "{ data: BLTopic[], pagination: { page, limit, total, totalPages } }",
  },
  {
    method: "POST",
    path: "/api/topics",
    description: "新しいトピックを作成",
    body: [
      "title (string)",
      "description (string)",
      "quorumThreshold? (number)",
      "billId? (string)",
    ],
    response: "BLTopic",
  },
  {
    method: "GET",
    path: "/api/topics/:id",
    description: "トピック詳細を取得（意見・クラスタ・議論構造含む）",
    response: "BLTopic (with all relations)",
  },
  {
    method: "GET",
    path: "/api/topics/:id/opinions",
    description: "トピックの意見一覧を取得",
    params: ["page", "limit"],
    response: "{ data: BLOpinion[], pagination: { ... } }",
  },
  {
    method: "POST",
    path: "/api/topics/:id/opinions",
    description: "意見を投稿（フェロモン初期値を自動生成）",
    body: ["content (string)", "stance (FOR|AGAINST|NEUTRAL)", "authorId? (string)"],
    response: "BLOpinion",
  },
  {
    method: "POST",
    path: "/api/topics/:id/opinions/:opinionId/support",
    description: "意見を支持（フェロモン強化）",
    body: ["stance (FOR|AGAINST|NEUTRAL)", "weight? (number)", "userId (string)"],
    response: "BLSupport",
  },
  {
    method: "POST",
    path: "/api/topics/:id/analyze",
    description:
      "LLMパイプライン全実行（議論抽出→エンベディング→クラスタリング→適応度→フェーズ判定）",
    response: "{ arguments, clusters, phase, ecosystem }",
  },
  {
    method: "GET",
    path: "/api/topics/:id/ecosystem",
    description: "ビジュアライゼーション用エコシステムデータを取得",
    response: "{ topic, ecosystem, argumentGraph, pheromone, history }",
  },
  {
    method: "POST",
    path: "/api/topics/:id/ai-participate",
    description: "AIエージェントに多視点から意見を生成させる",
    body: ["perspectives? (number, default: 3)"],
    response: "{ opinions: BLOpinion[] }",
  },
  {
    method: "POST",
    path: "/api/seed",
    description: "サンプルデータを投入（デモ用）",
    response: "{ topics: number, opinions: number }",
  },
];

const METHOD_STYLES = {
  GET: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  POST: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
};

export default function ApiDocsPage() {
  return (
    <div className="relative min-h-screen">
      {/* Header */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          <FadeIn>
            <h1 className="text-4xl font-black tracking-tight">
              <span className="text-gradient-eco">API</span>
              <span className="text-white"> ドキュメント</span>
            </h1>
            <p className="mt-4 text-lg text-[#8b949e]">
              BroadListening
              APIはRESTful設計で、JSON形式でデータを返します。認証不要で自由に利用できます。
            </p>
          </FadeIn>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-6 pb-20 space-y-8">
        {/* Base URL */}
        <FadeIn>
          <GlowCard glowColor="rgba(16, 185, 129, 0.25)">
            <h3 className="text-sm font-bold text-white mb-3">ベースURL</h3>
            <code className="rounded-lg bg-black/30 px-4 py-2 text-sm text-emerald-400 font-mono inline-block">
              http://localhost:3009
            </code>
            <h3 className="text-sm font-bold text-white mt-6 mb-3">
              共通レスポンス形式（ページネーション）
            </h3>
            <pre className="overflow-x-auto rounded-lg bg-black/30 p-4 text-xs text-emerald-400/80 font-mono">
              {`{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}`}
            </pre>
          </GlowCard>
        </FadeIn>

        {/* Endpoints */}
        <div>
          <FadeIn>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400/60 mb-2">
              Endpoints
            </h2>
            <h3 className="text-2xl font-bold text-white mb-6">エンドポイント一覧</h3>
          </FadeIn>

          <StaggerGrid className="space-y-4">
            {ENDPOINTS.map((ep) => (
              <StaggerItem key={`${ep.method}-${ep.path}`}>
                <div className="ecosystem-card p-5 transition-all duration-300 hover:bg-emerald-500/[0.04]">
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-md border px-2.5 py-1 text-xs font-bold ${METHOD_STYLES[ep.method]}`}
                    >
                      {ep.method}
                    </span>
                    <code className="text-sm font-medium font-mono text-white">{ep.path}</code>
                  </div>
                  <p className="mt-3 text-sm text-[#8b949e]">{ep.description}</p>

                  {ep.params && (
                    <div className="mt-3">
                      <span className="text-xs text-[#4b5563] font-medium">Query Params: </span>
                      {ep.params.map((p) => (
                        <code
                          key={p}
                          className="mr-1.5 rounded-md bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 text-xs text-teal-300 font-mono"
                        >
                          {p}
                        </code>
                      ))}
                    </div>
                  )}

                  {ep.body && (
                    <div className="mt-3">
                      <span className="text-xs text-[#4b5563] font-medium">Request Body: </span>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {ep.body.map((b) => (
                          <code
                            key={b}
                            className="rounded-md bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 text-xs text-amber-300/80 font-mono"
                          >
                            {b}
                          </code>
                        ))}
                      </div>
                    </div>
                  )}

                  {ep.response && (
                    <div className="mt-3">
                      <span className="text-xs text-[#4b5563] font-medium">Response: </span>
                      <code className="text-xs text-emerald-400/60 font-mono">{ep.response}</code>
                    </div>
                  )}
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>

        {/* Data Models */}
        <FadeIn>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400/60 mb-2">
              Data Models
            </h2>
            <h3 className="text-2xl font-bold text-white mb-6">主要データモデル</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                name: "BLTopic",
                fields: [
                  "id, title, description",
                  "phase (OPEN|DELIBERATION|CONVERGENCE|CLOSED)",
                  "quorumThreshold, billId?",
                ],
              },
              {
                name: "BLOpinion",
                fields: [
                  "id, content, stance",
                  "authorId, x, y, fitness",
                  "supportCount, topicId, clusterId?",
                ],
              },
              {
                name: "BLArgument",
                fields: [
                  "id, type (CLAIM|PREMISE|EVIDENCE|REBUTTAL)",
                  "content, confidence",
                  "opinionId, topicId",
                ],
              },
              {
                name: "BLPheromone",
                fields: ["id, intensity, quality", "decayRate, lastUpdated", "opinionId"],
              },
            ].map((model) => (
              <div key={model.name} className="ecosystem-card p-5">
                <h4 className="text-sm font-bold text-emerald-400 font-mono">{model.name}</h4>
                <ul className="mt-3 space-y-1">
                  {model.fields.map((f) => (
                    <li key={f} className="text-xs text-[#6b7280] font-mono">
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
