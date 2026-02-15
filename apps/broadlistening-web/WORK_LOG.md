# BroadListening 作業ログ

## 概要
OJPPの8番目のアプリ `broadlistening-web` を新規実装。意見生態系・デジタルフェロモン・議論構造グラフの3コンセプトを統合したBroad Listeningプラットフォーム。

## Phase 1: スキーマ + スキャフォールド

### Prismaスキーマ (`packages/db/prisma/schema.prisma`)
- 3 enum追加: `BLPhase`, `BLArgumentType`, `BLEdgeRelation`
- 8 モデル追加: `BLTopic`, `BLOpinion`, `BLSupport`, `BLArgument`, `BLArgumentEdge`, `BLPheromone`, `BLCluster`, `BLEcosystemSnapshot`
- `Bill`モデルに`blTopics BLTopic[]`リレーション追加

### アプリスキャフォールド (`apps/broadlistening-web/`)
- package.json, tsconfig.json, next.config.ts, postcss.config.mjs, vercel.json
- layout.tsx, globals.css, dark-navigation-bar.tsx

## Phase 2: アルゴリズム実装 (`src/lib/algorithms/`)

| ファイル | 内容 |
|---------|------|
| `pheromone.ts` | フェロモン動力学: `currentIntensity()`, `reinforce()`, `aggregateField()` |
| `fitness.ts` | 適応度計算: `calculateFitness()`, `rankByFitness()`, `landscapeStats()` + Gini係数 |
| `quorum.ts` | クオーラムセンシング: `shannonDiversity()`, `shannonEvenness()`, `convergenceScore()`, `determinePhase()` |
| `kmeans.ts` | k-means++: `kmeans()`, `findOptimalK()`（elbowメソッド）, `autoKMeans()` |
| `index.ts` | バレルエクスポート |

## Phase 3: LLMパイプライン (`src/lib/llm/`)

| ファイル | 内容 |
|---------|------|
| `client.ts` | Claude APIシングルトン (`claude-sonnet-4-5-20250929`) |
| `argument-extractor.ts` | 議論構造抽出: claims, premises, evidence, rebuttals, relations |
| `embeddings.ts` | TF-IDFベース: `buildVocabulary()`, `embed()`, `normalize()`, `cosineSimilarity()`, `generateEmbeddings()` |
| `label-generator.ts` | クラスタラベル生成 (Claude API, max 20 chars) |
| `gap-detector.ts` | 議論ギャップ検出: MISSING_EVIDENCE, UNADDRESSED_CLAIM, WEAK_PREMISE |
| `index.ts` | バレルエクスポート |

## Phase 4: ビジュアライゼーション (Canvas 2D)

| ファイル | 内容 |
|---------|------|
| `src/components/ecosystem/ecosystem-view.tsx` | 適応度地形 + クラスタ領域 + フェロモン軌跡 + 意見ノード |
| `src/components/argument-graph/argument-graph-view.tsx` | 力学モデル配置、CLAIM/PREMISE/EVIDENCE/REBUTTAL形状分け |
| `src/components/pheromone/pheromone-heatmap.tsx` | radial gradient加算合成、品質→色相マッピング |

## Phase 5: APIルート (`src/app/api/`)

| ファイル | メソッド | 内容 |
|---------|---------|------|
| `topics/route.ts` | GET, POST | トピック一覧（ページネーション）/ 作成 |
| `topics/[id]/route.ts` | GET | トピック詳細（全リレーション含む） |
| `topics/[id]/opinions/route.ts` | GET, POST | 意見一覧 / 投稿（フェロモン初期値生成） |
| `topics/[id]/opinions/[opinionId]/support/route.ts` | POST | 支持（フェロモン強化） |
| `topics/[id]/analyze/route.ts` | POST | LLMパイプライン全実行 |
| `topics/[id]/ecosystem/route.ts` | GET | ビジュアライゼーション用エコシステムデータ |
| `topics/[id]/ai-participate/route.ts` | POST | AI多視点意見生成 |
| `seed/route.ts` | POST | サンプルデータ投入（3トピック+19意見） |

## Phase 6: ページ (`src/app/`)

| ファイル | 内容 |
|---------|------|
| `page.tsx` | ダッシュボード（Hero + ParticleField + GradientMesh + GlowCard統計 + 3コンセプト + ライフサイクル） |
| `about/page.tsx` | About（ミッション・AI参加方法・アーキテクチャ・数理基盤・技術スタック・参考文献） |
| `api-docs/page.tsx` | APIドキュメント（10エンドポイント + 4データモデル） |
| `topics/page.tsx` | トピック一覧（GlowCard + サンプルデータ投入ボタン） |
| `topics/new/page.tsx` | トピック作成フォーム |
| `topics/[id]/page.tsx` | トピック詳細（投稿 + AI参加 + LLM分析 + 3タブビジュアライゼーション + 意見フィード） |

## Phase 7: ポータル統合

| ファイル | 変更 |
|---------|------|
| `apps/portal-web/src/lib/constants.ts` | SERVICES配列にbroadlistening追加（emerald #10b981, port 3009） |
| `package.json` (root) | `dev:broadlistening` スクリプト追加 |

## テスト (`src/lib/algorithms/__tests__/`, `src/lib/llm/__tests__/`)

- `pheromone.test.ts` — 7 tests
- `fitness.test.ts` — 10 tests
- `quorum.test.ts` — 13 tests
- `kmeans.test.ts` — 8 tests
- `embeddings.test.ts` — 10 tests
- **合計: 48/48 PASS**

## UI改善（第2イテレーション）

### globals.css強化
- `ecosystem-card` — グラデーションボーダー + ホバーエフェクト
- `text-gradient-eco` — アニメーション付きグラデーションテキスト
- `btn-primary` / `btn-outline` / `input-eco` — 統一デザインシステム
- 8アニメーション: pheromone-pulse, ecosystem-breathe, node-appear, data-flow, scan-line, glow-shift, float, shimmer

### @ojpp/uiコンポーネント活用
- `GlowCard` — マウス追従グロー効果付きカード
- `ParticleField` + `GradientMeshBackground` — ヒーロー動的背景
- `AnimatedCounter` — スプリングアニメーション統計値
- `FadeIn` / `StaggerGrid` / `StaggerItem` — 段階的表示

## 既知のバグ修正

1. `topics/route.ts` — ローカル`jsonResponse`が`@ojpp/api`をシャドウ → 削除
2. `analyze/route.ts` — `result.arguments`不在、`rel.sourceIdx`/`rel.targetIdx`不在 → 正しいAPI使用
3. `embeddings.ts` — `generateEmbeddings`関数不在 → 追加
4. `embeddings.test.ts` — 日本語TF-IDFトークン化問題 → 英語テストに変更
5. `seed/route.ts` — `BLOpinion`に`x`/`y`/`supportCount`フィールド不在 → 削除
6. `ai-participate/route.ts` — 同上

## PR関連（この session で処理）

- PR #14 (safeEqual) — マージ済み + お礼コメント
- PR #12 (Lighthouse) — マージ済み + お礼コメント
- PR #13 (data expansion) — 修正依頼レビュー（CI failures）

## 現在の状態

- **型チェック**: PASS
- **テスト**: 48/48 PASS
- **全ページ 200 OK**: `/`, `/about`, `/api-docs`, `/topics`, `/topics/new`
- **シードデータ**: 3トピック + 19意見 投入済み
- **dev server**: http://localhost:3009
- **Git**: 未コミット・未プッシュ

## ローカルテスト残項目

1. ダッシュボード — ParticleField/GradientMesh描画、GlowCardホバー、AnimatedCounter
2. トピック一覧 — シードデータ表示、GlowCard動作
3. トピック詳細 — 意見投稿→表示更新、スタンス切り替え
4. LLMパイプライン実行 — 議論抽出・クラスタリング・フェーズ判定（要ANTHROPIC_API_KEY）
5. AIエージェント参加 — 多視点意見生成（要ANTHROPIC_API_KEY）
6. 3ビジュアライゼーション — 生態系/議論構造グラフ/フェロモンマップ
7. About / API docs — セクション表示
8. モバイルレスポンシブ — ナビ・グリッド・カード
9. ポータル連携 — http://localhost:3000 からのリンク
