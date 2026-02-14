/**
 * 都道府県マスタデータのシード
 *
 * data/prefectures.json から47都道府県を読み込み、
 * JIS X 0401 コード (01-47) で upsert する。
 *
 * 地方区分:
 *   北海道, 東北, 関東, 中部, 近畿, 中国, 四国, 九州・沖縄
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { prisma } from "@ojpp/db";

interface PrefectureData {
  code: string;
  name: string;
  nameEn: string;
  region: string;
}

/**
 * data/prefectures.json を読み込んで返す。
 * 47件であることをバリデーションする。
 */
function loadPrefectures(): PrefectureData[] {
  const filePath = resolve(__dirname, "../../../../data/prefectures.json");
  const raw = readFileSync(filePath, "utf-8");
  const data: PrefectureData[] = JSON.parse(raw);

  if (data.length !== 47) {
    throw new Error(
      `[prefectures] data/prefectures.json に ${data.length} 件しかありません（47件必要）`,
    );
  }

  // コードの重複チェック
  const codes = new Set(data.map((d) => d.code));
  if (codes.size !== 47) {
    throw new Error("[prefectures] code に重複があります");
  }

  // コードの範囲チェック（01-47）
  for (const pref of data) {
    const num = Number.parseInt(pref.code, 10);
    if (num < 1 || num > 47) {
      throw new Error(`[prefectures] 不正なコード: ${pref.code} (${pref.name})`);
    }
  }

  return data;
}

/**
 * 47都道府県をDBにupsertする。
 * codeをキーにして、既存レコードがあればupdate、なければcreateする。
 */
export async function seedPrefectures(): Promise<void> {
  console.log("[prefectures] 都道府県マスタのシードを開始...");

  const prefectures = loadPrefectures();
  let created = 0;
  let updated = 0;

  for (const pref of prefectures) {
    const existing = await prisma.prefecture.findUnique({
      where: { code: pref.code },
    });

    await prisma.prefecture.upsert({
      where: { code: pref.code },
      update: {
        name: pref.name,
        nameEn: pref.nameEn,
        region: pref.region,
      },
      create: {
        code: pref.code,
        name: pref.name,
        nameEn: pref.nameEn,
        region: pref.region,
      },
    });

    if (existing) {
      updated++;
    } else {
      created++;
    }
  }

  console.log(
    `[prefectures] 完了 — ${created}件作成, ${updated}件更新 (計${prefectures.length}件)`,
  );

  // 地方別のサマリ表示
  const regionCounts = new Map<string, number>();
  for (const pref of prefectures) {
    regionCounts.set(pref.region, (regionCounts.get(pref.region) ?? 0) + 1);
  }
  console.log("[prefectures] 地方区分:");
  for (const [region, count] of regionCounts) {
    console.log(`  ${region}: ${count}都道府県`);
  }
}

// CLI実行
if (process.argv[1]?.includes("prefectures/seed-prefectures")) {
  seedPrefectures()
    .then(async () => {
      await prisma.$disconnect();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error(err);
      await prisma.$disconnect();
      process.exit(1);
    });
}
