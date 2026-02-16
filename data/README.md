# OJPP Datasets v0.1

Open Japan PoliTech Platform で使用するデータセットの一覧です。

> **注意**: v0.1 ではすべてデモ用データです。実際の公式データとは異なる場合があります。

## ファイル一覧

| ファイル | 件数 | 説明 | データ性質 |
|---------|------|------|-----------|
| `diet-sessions.json` | 14件 | 国会会期（第200〜213回） | 実データ（国会公式情報に基づく） |
| `sample-bills.json` | 31件 | 法案サンプル | 実在法案＋一部架空 |
| `sample-politicians.json` | 40名 | 国会議員サンプル | 実在する現職・元職議員 |
| `manifesto-policies.json` | 100件 | 政党マニフェスト政策 | 各党の公式マニフェストを参考にしたデモ用データ |
| `parties.json` | 15政党 | 政党マスタ | 実在政党の基本情報 |
| `prefectures.json` | 47都道府県 | 都道府県マスタ | 実データ |
| `FYxxxx-settlementcard.json` | 47都道府県*9年分 | 決算カード（平成27年〜令和5年度） | [実データ（総務省）](https://www.soumu.go.jp/iken/zaisei/card.html) |
|`FYxxxx-population_dynamics_municipal.json`|2,237件（2024年は2,233件）|人口動態(令和3年度〜令和7年度)|[実データ](https://www.soumu.go.jp/main_sosiki/jichi_gyousei/daityo/jinkou_jinkoudoutai-setaisuu.html)|

## データの取り込み

```bash
# データベースのシード（政党・都道府県マスタ）
pnpm db:seed

# 全データの取り込み（政治資金 + 国会 + マニフェスト）
pnpm --filter @ojpp/ingestion ingest:all
```

## 政治資金データについて

政治資金データ（`MoneyGlass` アプリで使用）は `packages/ingestion/src/political-finance/client.ts` で
シード付き疑似乱数 (`seededRandom()`) により動的に生成されます。
各政党の収入規模は実際の政治資金報告を参考にした概算値ですが、
個別の金額は統計的に生成されたサンプルデータです。

## 将来のデータソース

- 国会会議録検索システム API (https://kokkai.ndl.go.jp/)
- 総務省 政治資金収支報告書
- 各政党公式マニフェスト
- political-finance-database.com

## ライセンス

データセット自体は各元データのライセンスに従います。
プラットフォームのコードは AGPL-3.0-or-later です。
