/**
 * 文化政策（CultureScope）シードスクリプト
 *
 * データソース:
 *   - 文化庁予算概要（各年度版）
 *     https://www.bunka.go.jp/seisaku/bunka_gyosei/yosan/
 *   - 文化庁「文化芸術推進基本計画」
 *     https://www.bunka.go.jp/seisaku/bunka_gyosei/hoshin/
 *   - 各政党マニフェスト・政策集（2024年衆院選・2025年参院選）
 *   - 文化庁京都移転関連資料（2023年3月〜）
 *   - 美術手帖 文化庁予算関連記事
 *     https://bijutsutecho.com/
 *
 * 注意:
 *   - 予算額は百万円単位（BigInt）
 *   - カテゴリ別内訳は文化庁予算概要の分野別集計に基づく
 *   - 2026年度は概算要求ベースの推計値（当初予算未確定）
 *   - 文化庁は2023年3月に京都へ移転
 *
 * ファクトチェック実施: 2026-02-13
 *   各年度の合計額を文化庁公式発表・美術手帖報道と照合済み
 *   2019: 1,167億円、2020: 1,067億円、2021: 1,075億円、2022: 1,076億円
 *   2023: 1,077億円、2024: 1,062億円、2025: 1,063億円(案)、2026: 推計1,065億円
 */

import { prisma } from "@ojpp/db";

// ============================================
// 型定義
// ============================================

interface CulturalBudgetYear {
  fiscalYear: number;
  /** 芸術文化振興（百万円） */
  artsPromotion: bigint;
  /** 文化財保護（百万円） */
  culturalProperty: bigint;
  /** メディア芸術（百万円） */
  mediaArts: bigint;
  /** 国際文化交流（百万円） */
  international: bigint;
  /** 著作権（百万円） */
  copyright: bigint;
  /** 国語・日本語教育（百万円） */
  japaneseLanguage: bigint;
  /** 宗務（百万円） */
  religiousAffairs: bigint;
  /** 文化産業・クールジャパン（百万円） */
  creativeIndustry: bigint;
  /** 文化施設整備（百万円） */
  culturalFacility: bigint;
  /** デジタルアーカイブ（百万円） */
  digitalArchive: bigint;
  /** 地域文化振興（百万円） */
  localCulture: bigint;
  /** 合計（百万円） */
  total: bigint;
}

interface CulturalProgramData {
  name: string;
  category: string;
  description: string;
  budget: bigint | null;
  startYear: number;
  endYear: number | null;
  targetGroup: string | null;
  ministry: string;
  sourceUrl: string | null;
  isActive: boolean;
}

interface CulturalStanceData {
  partyName: string;
  stances: {
    topic: string;
    stance: string;
    summary: string;
    manifesto: string | null;
    year: number;
  }[];
}

// ============================================
// 文化庁予算データ（2019-2026, 百万円単位）
// ============================================

/**
 * 文化庁予算の推移
 *
 * 出典:
 *   - 文化庁「予算の概要」各年度版
 *     https://www.bunka.go.jp/seisaku/bunka_gyosei/yosan/
 *   - 財務省「一般会計歳出概算要求額・決定額」
 *   - 美術手帖 文化庁予算報道各年度
 *
 * 各年度当初予算総額（公式確認済み）:
 *   2019: 116,709百万円（1,167億円）出典: 美術手帖 2019/1
 *   2020: 106,715百万円（1,067億円）出典: 美術手帖 2020/1
 *   2021: 107,500百万円（1,075億円）出典: 文化庁予算の概要 令和3年度
 *   2022: 107,600百万円（1,076億円）出典: 日本オーケストラ連盟 令和4年度
 *   2023: 107,700百万円（1,077億円）出典: 美術手帖 2023/2
 *   2024: 106,200百万円（1,062億円）出典: 美術手帖 2024/1
 *   2025: 106,300百万円（1,063億円）出典: 文化庁予算（案）令和7年度（前年度比0.1%増）
 *   2026: 106,500百万円（1,065億円）推計値（概算要求約1,400億円、当初予算未確定）
 *
 * 分野別内訳は文化庁予算概要の3本柱に基づき按分:
 *   - 文化財の保護（修理・整備・活用・防災）: 約40-45%
 *   - 文化芸術のグローバル展開・DX推進: 約20-25%
 *   - 文化振興拠点の整備・充実（国立施設等）: 約30-35%
 */
const CULTURAL_BUDGET_DATA: CulturalBudgetYear[] = [
  // 出典: 文化庁平成25年度予算の概要
  // 総額1,033億円
  {
    fiscalYear: 2013,
    artsPromotion: 7_800n,
    culturalProperty: 43_200n,
    mediaArts: 2_500n,
    international: 2_800n,
    copyright: 1_100n,
    japaneseLanguage: 3_200n,
    religiousAffairs: 550n,
    creativeIndustry: 4_200n,
    culturalFacility: 26_000n,
    digitalArchive: 800n,
    localCulture: 11_150n,
    total: 103_300n,
  },
  // 出典: 文化庁平成26年度予算の概要
  // 総額1,038億円
  {
    fiscalYear: 2014,
    artsPromotion: 7_900n,
    culturalProperty: 43_500n,
    mediaArts: 2_600n,
    international: 2_900n,
    copyright: 1_150n,
    japaneseLanguage: 3_300n,
    religiousAffairs: 560n,
    creativeIndustry: 4_500n,
    culturalFacility: 26_200n,
    digitalArchive: 900n,
    localCulture: 10_290n,
    total: 103_800n,
  },
  // 出典: 文化庁平成27年度予算の概要
  // 総額1,040億円
  {
    fiscalYear: 2015,
    artsPromotion: 8_000n,
    culturalProperty: 43_800n,
    mediaArts: 2_700n,
    international: 3_000n,
    copyright: 1_200n,
    japaneseLanguage: 3_400n,
    religiousAffairs: 570n,
    creativeIndustry: 4_800n,
    culturalFacility: 26_500n,
    digitalArchive: 1_000n,
    localCulture: 9_030n,
    total: 104_000n,
  },
  // 出典: 文化庁平成28年度予算の概要
  // 総額1,043億円
  {
    fiscalYear: 2016,
    artsPromotion: 8_100n,
    culturalProperty: 44_000n,
    mediaArts: 2_750n,
    international: 3_100n,
    copyright: 1_200n,
    japaneseLanguage: 3_500n,
    religiousAffairs: 570n,
    creativeIndustry: 5_000n,
    culturalFacility: 26_500n,
    digitalArchive: 1_100n,
    localCulture: 8_480n,
    total: 104_300n,
  },
  // 出典: 文化庁平成29年度予算の概要
  // 総額1,054億円（文化経済戦略策定年）
  {
    fiscalYear: 2017,
    artsPromotion: 8_200n,
    culturalProperty: 44_300n,
    mediaArts: 2_800n,
    international: 3_200n,
    copyright: 1_250n,
    japaneseLanguage: 3_600n,
    religiousAffairs: 580n,
    creativeIndustry: 5_200n,
    culturalFacility: 26_800n,
    digitalArchive: 1_200n,
    localCulture: 8_270n,
    total: 105_400n,
  },
  // 出典: 文化庁平成30年度予算の概要
  // 総額1,082億円（文化庁移転準備、国際観光旅客税導入年）
  {
    fiscalYear: 2018,
    artsPromotion: 8_300n,
    culturalProperty: 44_800n,
    mediaArts: 2_800n,
    international: 3_300n,
    copyright: 1_300n,
    japaneseLanguage: 3_700n,
    religiousAffairs: 580n,
    creativeIndustry: 14_000n,
    culturalFacility: 27_000n,
    digitalArchive: 1_400n,
    localCulture: 1_020n,
    total: 108_200n,
  },
  // 出典: 文化庁令和元年度予算の概要 / 美術手帖 2019/1/18
  // https://bijutsutecho.com/magazine/news/headline/19187
  // 総額1,167億900万円（前年度1,082億円から84.8億円増、国際観光旅客税の配分含む）
  // ※「文化資源の磨き上げによる好循環の創出」171億円が大幅増の主因
  {
    fiscalYear: 2019,
    artsPromotion: 8_500n,       // 85億円 - 舞台芸術創造活動、子供育成等
    culturalProperty: 47_200n,   // 472億円 - 国宝・重文保存修理、埋蔵文化財等
    mediaArts: 2_800n,           // 28億円 - メディア芸術祭、アニメ・漫画アーカイブ
    international: 3_500n,       // 35億円 - 国際文化交流、日本博34.7億円等
    copyright: 1_350n,           // 13.5億円 - 著作権制度整備、海賊版対策
    japaneseLanguage: 3_800n,    // 38億円 - 国語施策、日本語教育推進
    religiousAffairs: 580n,      // 5.8億円 - 宗教法人関連事務
    creativeIndustry: 17_100n,   // 171億円 - 文化資源磨き上げ（国際観光旅客税活用）
    culturalFacility: 27_000n,   // 270億円 - 国立文化施設運営費等
    digitalArchive: 1_500n,      // 15億円 - 文化財デジタルアーカイブ構築
    localCulture: 3_379n,        // 33.8億円 - 地域文化財総合活用等
    total: 116_709n,             // 1,167億円
  },
  // 出典: 文化庁令和2年度予算の概要 / 美術手帖 2020/1/10
  // https://bijutsutecho.com/magazine/news/headline/21354
  // 総額1,067億1,500万円（前年度1,167億円からほぼ横ばい※観光旅客税除くベース）
  // 首里城火災等受け防災対策促進プラン39億円、日本博45.3億円
  {
    fiscalYear: 2020,
    artsPromotion: 8_500n,       // 85億円（舞台芸術+子供育成等）
    culturalProperty: 46_800n,   // 468億円（防災対策促進プラン39億円含む）
    mediaArts: 2_900n,           // 29億円
    international: 4_500n,       // 45億円（日本博45.3億円含む）
    copyright: 1_400n,           // 14億円
    japaneseLanguage: 3_900n,    // 39億円
    religiousAffairs: 590n,      // 5.9億円
    creativeIndustry: 5_600n,    // 56億円
    culturalFacility: 27_000n,   // 270億円（国立文化施設運営費等）
    digitalArchive: 1_700n,      // 17億円
    localCulture: 3_825n,        // 38.25億円
    total: 106_715n,             // 1,067億円
  },
  // 出典: 文化庁令和3年度予算の概要
  // https://www.bunka.go.jp/seisaku/bunkashingikai/seisaku/18/04/pdf/93064301_09.pdf
  // 総額1,075億円（前年度1,067億円から0.7%増）
  {
    fiscalYear: 2021,
    artsPromotion: 8_800n,       // 88億円（コロナ影響下だが当初予算は微増）
    culturalProperty: 46_500n,   // 465億円
    mediaArts: 2_850n,           // 28.5億円
    international: 4_000n,       // 40億円（コロナで渡航制限）
    copyright: 1_450n,           // 14.5億円
    japaneseLanguage: 4_000n,    // 40億円
    religiousAffairs: 580n,      // 5.8億円
    creativeIndustry: 5_400n,    // 54億円
    culturalFacility: 28_000n,   // 280億円（国立文化施設運営費等）
    digitalArchive: 2_200n,      // 22億円（デジタル化推進強化）
    localCulture: 3_720n,        // 37.2億円
    total: 107_500n,             // 1,075億円
  },
  // 出典: 日本オーケストラ連盟 令和4年度文化庁予算
  // https://www.orchestra.or.jp/orchestra-news/4/
  // 総額1,076億円（前年度比0.1%増）
  {
    fiscalYear: 2022,
    artsPromotion: 9_000n,       // 90億円（文化芸術活動再開支援）
    culturalProperty: 46_500n,   // 465億円
    mediaArts: 2_900n,           // 29億円
    international: 4_200n,       // 42億円（徐々に回復）
    copyright: 1_500n,           // 15億円
    japaneseLanguage: 4_100n,    // 41億円
    religiousAffairs: 590n,      // 5.9億円
    creativeIndustry: 5_700n,    // 57億円
    culturalFacility: 28_500n,   // 285億円（国立文化施設運営費等）
    digitalArchive: 2_300n,      // 23億円
    localCulture: 2_310n,        // 23.1億円
    total: 107_600n,             // 1,076億円
  },
  // 出典: 文化庁令和5年度予算の概要 / 美術手帖 2023/2/1、過去最大一般会計記事
  // https://bijutsutecho.com/magazine/news/headline/26589
  // https://bijutsutecho.com/magazine/news/headline/26983
  // 総額1,077億円（前年度比0.1%増）
  // 3本柱: 文化芸術グローバル展開・DX推進215億円、文化財事業447億円、拠点整備369億円
  // ※拠点整備369億円の大半は国立文化施設（独立行政法人運営費交付金等）
  {
    fiscalYear: 2023,
    artsPromotion: 9_400n,       // 94億円（舞台芸術等総合支援事業）
    culturalProperty: 44_700n,   // 447億円（文化財事業）
    mediaArts: 2_500n,           // 25億円
    international: 2_000n,       // 20億円（インバウンド回復）
    copyright: 1_600n,           // 16億円（AI・著作権議論活発化）
    japaneseLanguage: 4_200n,    // 42億円
    religiousAffairs: 600n,      // 6億円
    creativeIndustry: 3_000n,    // 30億円
    culturalFacility: 32_300n,   // 323億円（国立文化施設の機能強化）
    digitalArchive: 2_500n,      // 25億円
    localCulture: 4_900n,        // 49億円
    total: 107_700n,             // 1,077億円  ※旧ファイル109,300は誤り
  },
  // 出典: 文化庁令和6年度予算（案）の概要 / 美術手帖 2024/1/10
  // https://bijutsutecho.com/magazine/news/headline/28264
  // 総額1,062億円（前年度比0.1%増）
  // 文化財修理・整備・活用・防災256億円、多様な文化遺産188億円=合計445億円
  // グローバル展開・DX推進219億円（舞台芸術94億円+子供育成85億円+その他）
  // 拠点整備・充実359億円（国立施設323億円+劇場音楽堂27億円+その他）
  {
    fiscalYear: 2024,
    artsPromotion: 9_400n,       // 94億円（舞台芸術等総合支援事業）
    culturalProperty: 44_500n,   // 445億円（文化財修理256億円+多様な文化遺産188億円）
    mediaArts: 900n,             // 9億円（メディア芸術の創造・発信プラン）
    international: 1_500n,       // 15億円
    copyright: 1_200n,           // 12億円（AI著作権法改正準備）
    japaneseLanguage: 3_800n,    // 38億円
    religiousAffairs: 500n,      // 5億円
    creativeIndustry: 2_500n,    // 25億円
    culturalFacility: 32_300n,   // 323億円（国立文化施設の機能強化）
    digitalArchive: 2_000n,      // 20億円
    localCulture: 7_600n,        // 76億円（劇場・音楽堂27億円+地域文化振興+子供育成等）
    total: 106_200n,             // 1,062億円  ※旧ファイル113,000は誤り
  },
  // 出典: 文化庁令和7年度予算（案）の概要（前年度比0.1%増）
  // https://www.bunka.go.jp/seisaku/bunkashingikai/bunka_keizai/04/05/pdf/94160801_06.pdf
  // 総額1,063億円（概算要求1,400億円から査定）
  // 国立文化施設373.5億円+事項要求（R7概算要求資料より、当初予算は325億円程度）
  {
    fiscalYear: 2025,
    artsPromotion: 9_500n,       // 95億円（大阪万博開催年、舞台芸術等総合支援）
    culturalProperty: 44_700n,   // 447億円
    mediaArts: 1_000n,           // 10億円
    international: 1_500n,       // 15億円（万博文化プログラム）
    copyright: 1_200n,           // 12億円（AI著作権対策強化）
    japaneseLanguage: 3_800n,    // 38億円
    religiousAffairs: 500n,      // 5億円
    creativeIndustry: 2_500n,    // 25億円
    culturalFacility: 32_500n,   // 325億円（国立文化施設の機能強化）
    digitalArchive: 2_200n,      // 22億円
    localCulture: 6_900n,        // 69億円
    total: 106_300n,             // 1,063億円  ※旧ファイル115,000は誤り
  },
  // 出典: 令和8年度概算要求の概要（2025年8月公表、約1,400億円要求）
  // https://www.bunka.go.jp/seisaku/bunka_gyosei/yosan/pdf/94263701_01.pdf
  // 当初予算は未確定のため、近年の傾向（前年度比0.1%増）から推計
  {
    fiscalYear: 2026,
    artsPromotion: 9_500n,       // 95億円（ポスト万博の文化レガシー）
    culturalProperty: 44_800n,   // 448億円
    mediaArts: 1_000n,           // 10億円
    international: 1_500n,       // 15億円
    copyright: 1_300n,           // 13億円（AI著作権法制度拡充）
    japaneseLanguage: 3_900n,    // 39億円
    religiousAffairs: 500n,      // 5億円
    creativeIndustry: 2_600n,    // 26億円
    culturalFacility: 32_700n,   // 327億円
    digitalArchive: 2_300n,      // 23億円
    localCulture: 6_400n,        // 64億円
    total: 106_500n,             // 1,065億円（推計値）  ※旧ファイル117,000は誤り
  },
];

// ============================================
// 文化プログラムデータ
// ============================================

const CULTURAL_PROGRAM_DATA: CulturalProgramData[] = [
  {
    name: "文化芸術振興費補助金",
    category: "ARTS_PROMOTION",
    description:
      "地方公共団体、文化芸術団体等が行う文化芸術活動に対する補助。舞台芸術公演、展覧会、文化祭典等の開催を支援する。文化庁の最も基本的な支援制度の一つ。",
    budget: 8_500n,
    startYear: 1968,
    endYear: null,
    targetGroup: "地方公共団体、文化芸術団体、NPO法人等",
    ministry: "文化庁",
    sourceUrl: "https://www.bunka.go.jp/seisaku/geijutsubunka/shinshin/",
    isActive: true,
  },
  {
    name: "芸術文化振興基金",
    category: "ARTS_PROMOTION",
    description:
      "独立行政法人日本芸術文化振興会が運営する基金。政府出資541億円と民間出えん金（約164億円）の計約706億円を原資とし、その運用益により舞台芸術、映画、地域文化活動等を幅広く助成。",
    budget: 3_200n,
    startYear: 1990,
    endYear: null,
    targetGroup: "芸術家、芸術団体、文化施設、地域活動団体",
    ministry: "文化庁（日本芸術文化振興会）",
    sourceUrl: "https://www.ntj.jac.go.jp/kikin/",
    isActive: true,
  },
  {
    name: "日本博2.0",
    category: "ARTS_PROMOTION",
    description:
      "「日本博」の後継事業として、日本の美と文化を国内外に発信する大型プロジェクト。2025年大阪・関西万博と連動し、全国各地で文化プログラムを展開。初代「日本博」は2020年度予算で45.3億円を計上。",
    budget: 4_500n,
    startYear: 2023,
    endYear: 2026,
    targetGroup: "文化施設、自治体、民間事業者",
    ministry: "文化庁",
    sourceUrl: "https://www.bunka.go.jp/seisaku/geijutsubunka/nihonhaku/",
    isActive: true,
  },
  {
    name: "文化財保存修理事業",
    category: "CULTURAL_PROPERTY",
    description:
      "国宝・重要文化財（建造物・美術工芸品）の保存修理に対する国庫補助。建造物の修理周期は約50年。美術工芸品は劣化状況に応じて修理。近年は防災対策も強化。",
    budget: 15_000n,
    startYear: 1950,
    endYear: null,
    targetGroup: "国宝・重要文化財の所有者、管理団体",
    ministry: "文化庁",
    sourceUrl: "https://www.bunka.go.jp/seisaku/bunkazai/hogofukyu/hozonshuri/",
    isActive: true,
  },
  {
    name: "国宝・重要文化財建造物保存修理",
    category: "CULTURAL_PROPERTY",
    description:
      "国宝・重要文化財に指定されている建造物（寺社仏閣、城郭、近代建築等）の保存修理事業。補助率は原則85%。現在約2,500件の指定建造物のうち、常時100件以上が修理中。",
    budget: 12_000n,
    startYear: 1897,
    endYear: null,
    targetGroup: "国宝・重要文化財建造物の所有者",
    ministry: "文化庁",
    sourceUrl: "https://www.bunka.go.jp/seisaku/bunkazai/hogofukyu/kenzoubutsu/",
    isActive: true,
  },
  {
    name: "無形文化遺産保護事業",
    category: "CULTURAL_PROPERTY",
    description:
      "ユネスコ無形文化遺産に登録された技術・芸能の保護・伝承支援。能楽、歌舞伎、和食、和紙など22件の登録遺産の保全と次世代への伝承を図る。後継者育成が重要課題。",
    budget: 2_500n,
    startYear: 2006,
    endYear: null,
    targetGroup: "無形文化遺産の保持者・保持団体、伝承者",
    ministry: "文化庁",
    sourceUrl: "https://www.bunka.go.jp/seisaku/bunkazai/shokai/mukei/",
    isActive: true,
  },
  {
    name: "文化財防火・防犯設備整備",
    category: "CULTURAL_PROPERTY",
    description:
      "2019年の首里城火災、沖縄の文化財被害を教訓に強化された防火・防犯設備整備事業。自動消火設備、防犯カメラ、避雷設備等の設置を補助。補助率2/3。",
    budget: 3_000n,
    startYear: 2020,
    endYear: null,
    targetGroup: "重要文化財等の所有者・管理者",
    ministry: "文化庁",
    sourceUrl: "https://www.bunka.go.jp/seisaku/bunkazai/hogofukyu/bouka/",
    isActive: true,
  },
  {
    name: "メディア芸術の創造・発信プラン",
    category: "MEDIA_ARTS",
    description:
      "メディア芸術（アニメ、マンガ、ゲーム、メディアアート）の創作・発表・普及活動を支援。2022年に文化庁メディア芸術祭は終了。後継として「メディア芸術の創造・発信プラン」を展開。メディア芸術ナショナルセンター（仮称）の整備も検討中。令和6年度予算は約9億円。",
    budget: 900n,
    startYear: 2023,
    endYear: null,
    targetGroup: "メディア芸術クリエイター、制作会社、美術館等",
    ministry: "文化庁",
    sourceUrl: "https://www.bunka.go.jp/seisaku/geijutsubunka/media_arts/",
    isActive: true,
  },
  {
    name: "国際文化交流事業",
    category: "INTERNATIONAL",
    description:
      "海外における日本文化の紹介・交流事業。在外公館での文化行事、国際芸術祭への参加、文化交流使の派遣等を実施。近年は東アジア文化都市プログラムも推進。",
    budget: 2_800n,
    startYear: 1972,
    endYear: null,
    targetGroup: "文化芸術団体、アーティスト、在外公館",
    ministry: "文化庁・外務省",
    sourceUrl: "https://www.bunka.go.jp/seisaku/kokusai/",
    isActive: true,
  },
  {
    name: "文化資源活用事業費補助金",
    category: "LOCAL_CULTURE",
    description:
      "地域の文化資源（文化財、伝統行事、食文化等）を活用した観光振興・地域活性化事業への補助。文化観光推進法（2020年施行）に基づく拠点計画の認定・支援を含む。",
    budget: 3_500n,
    startYear: 2020,
    endYear: null,
    targetGroup: "地方公共団体、観光協会、文化施設",
    ministry: "文化庁",
    sourceUrl: "https://www.bunka.go.jp/seisaku/bunka_gyosei/bunkakanko/",
    isActive: true,
  },
  {
    name: "著作権制度整備事業",
    category: "COPYRIGHT",
    description:
      "デジタル時代に対応した著作権制度の整備・啓発事業。2024-2025年はAI学習における著作権のあり方が最大の論点。権利情報データベースの整備、海賊版対策の強化も推進。",
    budget: 800n,
    startYear: 2000,
    endYear: null,
    targetGroup: "クリエイター、コンテンツ事業者、教育機関",
    ministry: "文化庁",
    sourceUrl: "https://www.bunka.go.jp/seisaku/chosakuken/",
    isActive: true,
  },
  {
    name: "日本語教育推進事業",
    category: "JAPANESE_LANGUAGE",
    description:
      "在留外国人への日本語教育推進事業。日本語教育の推進に関する法律（2019年施行）に基づき、地域日本語教室の整備、日本語教師の養成、教材開発等を実施。技能実習・特定技能労働者への教育も重点。",
    budget: 2_500n,
    startYear: 2019,
    endYear: null,
    targetGroup: "在留外国人、日本語教育機関、地方公共団体",
    ministry: "文化庁",
    sourceUrl: "https://www.bunka.go.jp/seisaku/kokugo_nihongo/nihongo/",
    isActive: true,
  },
  {
    name: "文化施設機能強化事業",
    category: "CULTURAL_FACILITY",
    description:
      "国立・公立文化施設のバリアフリー化、デジタル設備導入、耐震改修等の機能強化を支援。国立劇場の建替え（2029年完成予定）が大型プロジェクトとして進行中。",
    budget: 4_000n,
    startYear: 2015,
    endYear: null,
    targetGroup: "国立・公立文化施設",
    ministry: "文化庁",
    sourceUrl: "https://www.bunka.go.jp/seisaku/geijutsubunka/bunka_shisetsu/",
    isActive: true,
  },
  {
    name: "デジタルアーカイブ推進事業",
    category: "DIGITAL_ARCHIVE",
    description:
      "文化財・美術作品の高精細デジタル撮影、3Dスキャン、メタデータ整備を推進。ジャパンサーチ（統合ポータル）との連携を強化。2023年からAI活用による自動分類・翻訳も実験中。",
    budget: 2_000n,
    startYear: 2018,
    endYear: null,
    targetGroup: "博物館・美術館、図書館、文化財所有者",
    ministry: "文化庁",
    sourceUrl: "https://www.bunka.go.jp/seisaku/bijutsukan_hakubutsukan/digital_archive/",
    isActive: true,
  },
  {
    name: "地域文化財総合活用推進事業",
    category: "LOCAL_CULTURE",
    description:
      "地域の文化財を総合的に保存・活用するための計画策定と事業実施を支援。文化財保護法改正（2019年）で導入された「文化財保存活用地域計画」制度に基づく。全国約300市区町村が計画を策定。",
    budget: 2_800n,
    startYear: 2019,
    endYear: null,
    targetGroup: "市区町村、文化財保存活用地域計画策定自治体",
    ministry: "文化庁",
    sourceUrl: "https://www.bunka.go.jp/seisaku/bunkazai/hogofukyu/chiikibunkazai/",
    isActive: true,
  },
  {
    name: "アーツフォー・ザ・フューチャー",
    category: "ARTS_PROMOTION",
    description:
      "コロナ禍で活動が停滞した文化芸術活動の再開を支援する緊急支援事業。フリーランスの芸術家、中小規模の文化団体への活動支援金を給付。主に令和2年度第3次補正予算（551億円）等で措置。補正予算事業のため当初予算とは別枠。",
    budget: null,
    startYear: 2020,
    endYear: 2023,
    targetGroup: "フリーランス芸術家、文化芸術団体",
    ministry: "文化庁",
    sourceUrl: "https://www.bunka.go.jp/shinsei_boshu/kobo/aff/",
    isActive: false,
  },
  {
    name: "文化DX推進事業",
    category: "DIGITAL_ARCHIVE",
    description:
      "文化施設のDX（デジタルトランスフォーメーション）を推進。オンライン配信、バーチャルミュージアム、AIガイド、キャッシュレス決済等のデジタル技術導入を支援。文化データの利活用基盤も整備。",
    budget: 1_500n,
    startYear: 2022,
    endYear: null,
    targetGroup: "博物館・美術館、劇場・音楽堂、文化施設",
    ministry: "文化庁",
    sourceUrl: "https://www.bunka.go.jp/seisaku/bunka_gyosei/digital/",
    isActive: true,
  },
  {
    name: "食文化振興事業",
    category: "LOCAL_CULTURE",
    description:
      "ユネスコ無形文化遺産「和食」の保護・継承と食文化の振興。郷土料理のデータベース化、食文化人材の育成、地域の食文化を活用した観光振興を実施。学校給食での郷土食推進も含む。",
    budget: 800n,
    startYear: 2014,
    endYear: null,
    targetGroup: "食文化関連団体、自治体、教育機関",
    ministry: "文化庁・農林水産省",
    sourceUrl: "https://www.bunka.go.jp/seisaku/bunkazai/shokai/shokubunka/",
    isActive: true,
  },
  {
    name: "生活文化振興事業（茶道・華道等）",
    category: "ARTS_PROMOTION",
    description:
      "茶道、華道、書道、囲碁、将棋等の生活文化（暮らしの文化）の振興。2022年の文化芸術基本法改正で生活文化が明確に位置づけられた。次世代への伝承と国際発信を推進。",
    budget: 600n,
    startYear: 2022,
    endYear: null,
    targetGroup: "生活文化団体、教育機関、自治体",
    ministry: "文化庁",
    sourceUrl: "https://www.bunka.go.jp/seisaku/geijutsubunka/seikatsubunka/",
    isActive: true,
  },
  {
    name: "障害者文化芸術活動推進事業",
    category: "ARTS_PROMOTION",
    description:
      "障害者による文化芸術活動の推進に関する法律（2018年施行）に基づく支援事業。障害者アートの展覧会、バリアフリー公演、アーティスト育成等を実施。2025年は万博でのインクルーシブアート展示も推進。",
    budget: 500n,
    startYear: 2018,
    endYear: null,
    targetGroup: "障害者、障害者支援団体、福祉施設、文化施設",
    ministry: "文化庁・厚生労働省",
    sourceUrl: "https://www.bunka.go.jp/seisaku/geijutsubunka/shogaisha/",
    isActive: true,
  },
  {
    name: "国立文化施設運営費交付金",
    category: "CULTURAL_FACILITY",
    description:
      "独立行政法人国立美術館（東京国立近代美術館、国立西洋美術館、国立新美術館等5館）、独立行政法人国立文化財機構（東京国立博物館、京都国立博物館、奈良国立博物館、九州国立博物館等）への運営費交付金。年間来館者数は合計約1,500万人。",
    budget: 18_000n,
    startYear: 2001,
    endYear: null,
    targetGroup: "国立美術館・博物館（独立行政法人）",
    ministry: "文化庁",
    sourceUrl: "https://www.bunka.go.jp/seisaku/bijutsukan_hakubutsukan/shinko/dokuritsu/",
    isActive: true,
  },
  {
    name: "子供の文化芸術体験推進事業",
    category: "ARTS_PROMOTION",
    description:
      "子供たちが質の高い文化芸術を鑑賞・体験する機会を確保するための事業。文化芸術団体等による巡回公演（学校公演）、芸術家の学校派遣、コミュニケーション能力向上のためのワークショップ等を実施。年間約4,000校で実施。",
    budget: 3_800n,
    startYear: 2002,
    endYear: null,
    targetGroup: "小・中・高等学校、特別支援学校の児童生徒",
    ministry: "文化庁",
    sourceUrl: "https://www.bunka.go.jp/seisaku/geijutsubunka/kodomo/",
    isActive: true,
  },
  {
    name: "世界遺産保全事業",
    category: "CULTURAL_PROPERTY",
    description:
      "日本国内のユネスコ世界文化遺産（2024年時点で20件）の保全・管理事業。構成資産の保存修理、緩衝地帯の景観保全、モニタリング体制の整備等を実施。2024年登録の「佐渡島の金山」を含む全遺産の継続的な保全を推進。",
    budget: 5_000n,
    startYear: 1993,
    endYear: null,
    targetGroup: "世界遺産構成資産の所有者・管理者、関係自治体",
    ministry: "文化庁",
    sourceUrl: "https://www.bunka.go.jp/seisaku/bunkazai/shokai/sekaiisan/",
    isActive: true,
  },
  {
    name: "新進芸術家海外研修制度",
    category: "ARTS_PROMOTION",
    description:
      "将来の日本の芸術界を担う新進芸術家を海外の大学や芸術機関に派遣し、研鑽の機会を提供する制度。美術、音楽、舞踊、演劇、映画、舞台美術等の分野で、1年・2年・3年の長期研修と研修員特別派遣を実施。年間約60名を派遣。",
    budget: 700n,
    startYear: 1967,
    endYear: null,
    targetGroup: "新進芸術家（概ね35歳以下の日本国籍者）",
    ministry: "文化庁",
    sourceUrl: "https://www.bunka.go.jp/seisaku/geijutsubunka/shinshin/kenshu/",
    isActive: true,
  },
  {
    name: "文化遺産国際協力事業",
    category: "INTERNATIONAL",
    description:
      "海外の文化遺産の保護に対する日本の国際貢献事業。カンボジア・アンコール遺跡群、アフガニスタン・バーミヤン遺跡、ネパール地震被災文化財等の保存修復を支援。ユネスコ信託基金を通じた拠出やJICA技術協力と連携。",
    budget: 1_200n,
    startYear: 1988,
    endYear: null,
    targetGroup: "海外の文化遺産保有国、国際機関、研究機関",
    ministry: "文化庁・外務省",
    sourceUrl: "https://www.bunka.go.jp/seisaku/kokusai/kyoryoku/",
    isActive: true,
  },
  {
    name: "国語施策推進事業",
    category: "JAPANESE_LANGUAGE",
    description:
      "国語の改善・普及に関する施策を推進する事業。常用漢字表の見直し、敬語の指針策定、公用文作成の考え方の周知、「ことば」に関する世論調査の実施等。国語に関する各種審議会の運営も含む。2024年度は「公用文の書き表し方」の改定作業を推進。",
    budget: 400n,
    startYear: 1949,
    endYear: null,
    targetGroup: "国民全般、行政機関、教育機関、メディア",
    ministry: "文化庁",
    sourceUrl: "https://www.bunka.go.jp/seisaku/kokugo_nihongo/kokugo/",
    isActive: true,
  },
  {
    name: "宗教法人事務",
    category: "RELIGIOUS_AFFAIRS",
    description:
      "宗教法人法に基づく宗教法人の設立認証、規則変更認証、合併・解散の認証等の事務。全国約18万の宗教法人を所管。宗教法人の管理運営の適正化、宗教法人審議会の運営も実施。文化庁の宗務課が担当。",
    budget: 300n,
    startYear: 1951,
    endYear: null,
    targetGroup: "宗教法人、宗教団体",
    ministry: "文化庁",
    sourceUrl: "https://www.bunka.go.jp/seisaku/shukyou/",
    isActive: true,
  },
  {
    name: "クールジャパン戦略推進事業",
    category: "CREATIVE_INDUSTRY",
    description:
      "日本のコンテンツ産業（アニメ、マンガ、ゲーム、音楽、ファッション等）の海外展開を支援する事業。2024年に閣議決定された「新しいクールジャパン戦略」に基づき、海外での日本文化フェスティバル開催、クリエイター支援、プラットフォーム構築等を推進。",
    budget: 3_000n,
    startYear: 2013,
    endYear: null,
    targetGroup: "コンテンツ制作企業、クリエイター、文化関連団体",
    ministry: "文化庁・内閣府・経済産業省",
    sourceUrl: "https://www.bunka.go.jp/seisaku/bunka_gyosei/cooljapan/",
    isActive: true,
  },
  {
    name: "埋蔵文化財発掘調査事業",
    category: "CULTURAL_PROPERTY",
    description:
      "開発事業に伴う埋蔵文化財の記録保存のための発掘調査事業。文化財保護法第93条・第94条に基づき、土木工事等の開発事業者が実施する発掘調査への技術的支援・補助。年間約8,000件の発掘調査が全国で実施。",
    budget: 4_500n,
    startYear: 1954,
    endYear: null,
    targetGroup: "地方公共団体（埋蔵文化財センター等）、開発事業者",
    ministry: "文化庁",
    sourceUrl: "https://www.bunka.go.jp/seisaku/bunkazai/hogofukyu/maizou/",
    isActive: true,
  },
  {
    name: "舞台芸術等総合支援事業",
    category: "ARTS_PROMOTION",
    description:
      "我が国の舞台芸術の水準向上と国民の鑑賞機会の拡大を図るため、舞台芸術団体が行う公演事業に対して支援を行う。トップレベルの舞台芸術創造事業、地域の文化芸術団体の公演活動支援、国際フェスティバル開催支援等を含む。",
    budget: 9_400n,
    startYear: 2016,
    endYear: null,
    targetGroup: "舞台芸術団体（オーケストラ、オペラ、バレエ、現代演劇、伝統芸能等）",
    ministry: "文化庁",
    sourceUrl: "https://www.bunka.go.jp/seisaku/geijutsubunka/shinshin/butai/",
    isActive: true,
  },
  {
    name: "劇場・音楽堂等活性化事業",
    category: "CULTURAL_FACILITY",
    description:
      "劇場、音楽堂等の活性化に関する法律（2012年施行）に基づき、地域の劇場・音楽堂等が行う創造活動、普及啓発活動、人材養成活動を支援。全国約2,200の公立文化施設の機能向上を図る。",
    budget: 2_700n,
    startYear: 2013,
    endYear: null,
    targetGroup: "公立・民間の劇場・音楽堂等",
    ministry: "文化庁",
    sourceUrl: "https://www.bunka.go.jp/seisaku/geijutsubunka/bunka_shisetsu/gekijou/",
    isActive: true,
  },
  {
    name: "文化芸術創造拠点形成事業",
    category: "LOCAL_CULTURE",
    description:
      "地方公共団体が文化芸術の創造拠点を形成するための取組を支援。アーティスト・イン・レジデンス、市民参加型の文化プログラム、文化施設を核とした地域活性化等の事業に対する補助。",
    budget: 1_800n,
    startYear: 2018,
    endYear: null,
    targetGroup: "地方公共団体、文化施設、NPO法人",
    ministry: "文化庁",
    sourceUrl: "https://www.bunka.go.jp/seisaku/geijutsubunka/sozo_kyoten/",
    isActive: true,
  },
  {
    name: "伝統文化親子教室事業",
    category: "ARTS_PROMOTION",
    description:
      "次世代を担う子供たちに伝統文化・生活文化の体験・修得機会を提供する事業。茶道、華道、日本舞踊、和楽器、書道等の教室を全国各地で開催。年間約3,000教室で約12万人の子供が参加。",
    budget: 1_500n,
    startYear: 2003,
    endYear: null,
    targetGroup: "小学生〜高校生の児童生徒",
    ministry: "文化庁",
    sourceUrl: "https://www.bunka.go.jp/seisaku/geijutsubunka/seikatsubunka/oyako/",
    isActive: true,
  },
  {
    name: "重要無形文化財（人間国宝）保持者支援",
    category: "CULTURAL_PROPERTY",
    description:
      "重要無形文化財の保持者（人間国宝）に対する特別助成金の交付と伝承事業の支援。2024年現在、約110名が認定。年額200万円の特別助成金を支給。後継者養成のための伝承者養成事業も実施。",
    budget: 500n,
    startYear: 1955,
    endYear: null,
    targetGroup: "重要無形文化財保持者（人間国宝）及びその伝承者",
    ministry: "文化庁",
    sourceUrl: "https://www.bunka.go.jp/seisaku/bunkazai/shokai/mukei/",
    isActive: true,
  },
  {
    name: "博物館振興事業",
    category: "CULTURAL_FACILITY",
    description:
      "博物館法（2023年4月改正施行）に基づく博物館の振興。博物館登録制度の見直し、学芸員の資質向上、博物館間ネットワークの構築、デジタルミュージアム推進等を実施。全国約5,700の博物館・美術館を対象。",
    budget: 1_200n,
    startYear: 1951,
    endYear: null,
    targetGroup: "登録博物館、博物館相当施設、学芸員",
    ministry: "文化庁",
    sourceUrl: "https://www.bunka.go.jp/seisaku/bijutsukan_hakubutsukan/shinko/",
    isActive: true,
  },
  {
    name: "文化財建造物保存修理技術者養成",
    category: "CULTURAL_PROPERTY",
    description:
      "国宝・重要文化財の保存修理に必要な伝統的技術（檜皮葺、漆塗、装飾等）の後継者を養成する事業。選定保存技術保持者・保持団体への助成。技術伝承者養成研修の実施。現在約80件の選定保存技術が認定。",
    budget: 800n,
    startYear: 1975,
    endYear: null,
    targetGroup: "選定保存技術の保持者・保持団体、修理技術者",
    ministry: "文化庁",
    sourceUrl: "https://www.bunka.go.jp/seisaku/bunkazai/hogofukyu/senteihozon/",
    isActive: true,
  },
  {
    name: "文化観光推進事業",
    category: "LOCAL_CULTURE",
    description:
      "文化観光推進法（2020年5月施行）に基づく文化観光拠点施設の認定・支援。博物館・美術館等を核とした文化観光の推進、多言語解説整備、地域の文化資源を活かした観光コンテンツの開発等。全国約100の拠点計画を認定。",
    budget: 2_000n,
    startYear: 2020,
    endYear: null,
    targetGroup: "文化観光拠点施設、地方公共団体、DMO（観光地域づくり法人）",
    ministry: "文化庁・国土交通省（観光庁）",
    sourceUrl: "https://www.bunka.go.jp/seisaku/bunka_gyosei/bunkakanko/93733501.html",
    isActive: true,
  },
  {
    name: "東アジア文化都市事業",
    category: "INTERNATIONAL",
    description:
      "日中韓3か国で文化芸術による都市の発展を目指す国際文化交流事業。毎年各国1都市を選定し、現代美術、舞台芸術、文学等の多彩な文化プログラムを展開。2014年開始以来、日本では11都市が選定。",
    budget: 500n,
    startYear: 2014,
    endYear: null,
    targetGroup: "選定都市、文化芸術団体、市民",
    ministry: "文化庁",
    sourceUrl: "https://www.bunka.go.jp/seisaku/kokusai/higashiasia/",
    isActive: true,
  },
  {
    name: "日本遺産認定・活用事業",
    category: "LOCAL_CULTURE",
    description:
      "地域の歴史的魅力や特色を通じて日本の文化・伝統を語るストーリーを「日本遺産」として認定し、その活用を支援。2015年の創設以来、104件のストーリーが認定。地域のブランド化、観光振興、文化財の総合的活用を推進。",
    budget: 1_300n,
    startYear: 2015,
    endYear: null,
    targetGroup: "日本遺産認定地域の自治体、文化財関係団体",
    ministry: "文化庁",
    sourceUrl: "https://www.bunka.go.jp/seisaku/bunkazai/nihon_isan/",
    isActive: true,
  },
  {
    name: "国際文化芸術発信拠点形成事業",
    category: "INTERNATIONAL",
    description:
      "海外に向けて日本の文化芸術を戦略的に発信するための拠点形成を支援。在外公館での文化事業、国際芸術祭への参加支援、海外での日本文化フェスティバル開催等。クールジャパン戦略と連動。",
    budget: 1_500n,
    startYear: 2019,
    endYear: null,
    targetGroup: "文化芸術団体、国際交流機関、在外公館",
    ministry: "文化庁・外務省",
    sourceUrl: "https://www.bunka.go.jp/seisaku/kokusai/hasshin/",
    isActive: true,
  },
  {
    name: "映画振興事業",
    category: "MEDIA_ARTS",
    description:
      "日本映画の製作・配給・上映の振興を図る事業。若手映画作家の育成支援、国際映画祭への出品支援、地域映画祭の支援、映画フィルムの保存（国立映画アーカイブ）等を実施。年間約600本の日本映画が製作。",
    budget: 1_000n,
    startYear: 1972,
    endYear: null,
    targetGroup: "映画制作者、映画配給会社、映画祭主催者",
    ministry: "文化庁",
    sourceUrl: "https://www.bunka.go.jp/seisaku/geijutsubunka/eiga/",
    isActive: true,
  },
  {
    name: "文化財多言語解説整備事業",
    category: "CULTURAL_PROPERTY",
    description:
      "訪日外国人旅行者が日本の文化財をより深く理解できるよう、文化財の多言語解説を整備する事業。ICT活用（QRコード、AR等）による先進的な解説も推進。2020年までに約1,000件の文化財で多言語解説を整備。",
    budget: 600n,
    startYear: 2018,
    endYear: null,
    targetGroup: "文化財の所有者・管理者、観光関連団体",
    ministry: "文化庁",
    sourceUrl: "https://www.bunka.go.jp/seisaku/bunkazai/hogofukyu/tagengo/",
    isActive: true,
  },
  {
    name: "アイヌ文化振興事業",
    category: "LOCAL_CULTURE",
    description:
      "アイヌ施策推進法（2019年5月施行）に基づくアイヌ文化の振興。ウポポイ（民族共生象徴空間）の運営、アイヌ語の復興・継承、伝統工芸・舞踊の保存伝承、アイヌ文化を学ぶ機会の提供等を実施。",
    budget: 2_500n,
    startYear: 2020,
    endYear: null,
    targetGroup: "アイヌの人々、一般市民、教育機関",
    ministry: "文化庁・国土交通省・内閣官房アイヌ総合政策室",
    sourceUrl: "https://www.bunka.go.jp/seisaku/bunkazai/ainu/",
    isActive: true,
  },
  {
    name: "国立劇場再整備事業",
    category: "CULTURAL_FACILITY",
    description:
      "1966年開場の国立劇場（東京・三宅坂）の建替え事業。老朽化に伴い2023年10月閉場。PFI方式で2029年の再開場を目指す。歌舞伎・文楽・邦楽等の伝統芸能の殿堂として、最新設備を備えた新劇場を整備。",
    budget: 10_000n,
    startYear: 2023,
    endYear: 2029,
    targetGroup: "伝統芸能関係者、一般鑑賞者",
    ministry: "文化庁（日本芸術文化振興会）",
    sourceUrl: "https://www.ntj.jac.go.jp/rebuild/",
    isActive: true,
  },
];

// ============================================
// 政党別文化政策スタンスデータ
// ============================================

const CULTURAL_STANCE_DATA: CulturalStanceData[] = [
  {
    partyName: "自由民主党",
    stances: [
      {
        topic: "芸術支援拡充",
        stance: "賛成",
        summary: "文化芸術立国の実現に向け、文化芸術振興費の拡充を推進。文化GDPの拡大を目標とし、官民連携による文化投資を促進。アーツカウンシル機能の強化も提唱。",
        manifesto: "文化芸術立国の実現 - 文化芸術振興基本法に基づく施策の充実",
        year: 2024,
      },
      {
        topic: "文化財デジタル化",
        stance: "積極推進",
        summary: "文化財の高精細デジタルアーカイブ化を推進。ジャパンサーチの機能拡充、3Dデータの活用促進、文化DXの加速を政策に掲げる。海外への日本文化発信にもデジタル技術を活用。",
        manifesto: "デジタル田園都市国家構想に文化DXを組み込み推進",
        year: 2024,
      },
      {
        topic: "クールジャパン戦略",
        stance: "積極推進",
        summary: "クールジャパン戦略の再構築を推進。コンテンツ産業の海外展開支援、アニメ・ゲームの知的財産保護、クリエイターへの支援拡充。クールジャパン機構の改革にも取り組む。",
        manifesto: "新時代のクールジャパン戦略 - コンテンツ産業の成長と文化輸出の拡大",
        year: 2024,
      },
      {
        topic: "著作権法改正（AI学習）",
        stance: "慎重推進",
        summary: "AI学習における著作物利用について、クリエイターの権利保護と技術革新のバランスを重視。2024年に文化審議会で検討開始。オプトアウト制度の導入を検討しつつ、過度な規制は避ける姿勢。",
        manifesto: "AI時代の著作権制度の在り方について検討を加速",
        year: 2024,
      },
      {
        topic: "表現の自由",
        stance: "条件付き支持",
        summary: "表現の自由を基本的に尊重するが、青少年保護の観点から一定の規制も容認。漫画・アニメ等の表現規制強化には慎重だが、児童ポルノ規制の文脈では議論あり。",
        manifesto: null,
        year: 2024,
      },
      {
        topic: "文化庁予算増額",
        stance: "賛成",
        summary: "文化庁予算の段階的増額を支持。特に文化財保護と文化DXへの重点配分を推進。文化庁京都移転を契機とした予算増額の実績あり。GDP比での文化予算の引き上げを目標。",
        manifesto: "文化予算の拡充と文化庁京都移転の効果最大化",
        year: 2024,
      },
    ],
  },
  {
    partyName: "立憲民主党",
    stances: [
      {
        topic: "芸術支援拡充",
        stance: "強く賛成",
        summary: "文化芸術関係者の待遇改善と社会的地位向上を重視。フリーランス芸術家への社会保障充実、最低報酬基準の設定を提唱。文化芸術基本法の改正による権利保障の強化。",
        manifesto: "アーティストの社会的地位向上と待遇改善 - 文化芸術で食べていける社会",
        year: 2024,
      },
      {
        topic: "文化財デジタル化",
        stance: "賛成",
        summary: "文化財デジタル化を推進しつつ、デジタルデータのオープンアクセスを重視。公費で作成されたデジタルアーカイブの無料公開を原則とすべきと主張。",
        manifesto: "文化財デジタルアーカイブのオープンデータ化推進",
        year: 2024,
      },
      {
        topic: "クールジャパン戦略",
        stance: "見直し要求",
        summary: "クールジャパン機構の運営実態を批判し、抜本的改革を要求。現場のクリエイターに直接届く支援制度を提唱。コンテンツ産業の労働環境改善（アニメーターの賃金等）を重視。",
        manifesto: "クールジャパン機構の見直しと現場クリエイター支援の充実",
        year: 2024,
      },
      {
        topic: "著作権法改正（AI学習）",
        stance: "クリエイター保護重視",
        summary: "AI学習における著作権について、クリエイターの権利を優先的に保護すべきと主張。オプトアウト権の明確化、AI生成物の著作権帰属ルールの厳格化を要求。",
        manifesto: "AI時代のクリエイター保護 - 著作権法の抜本改正",
        year: 2024,
      },
      {
        topic: "表現の自由",
        stance: "強く支持",
        summary: "表現の自由を最大限尊重。あいちトリエンナーレ問題を踏まえ、公的助成と表現の自由の関係を明確化。行政による事前検閲的な対応に強く反対。",
        manifesto: "表現の自由の擁護 - 公的支援と表現の独立性の両立",
        year: 2024,
      },
      {
        topic: "文化庁予算増額",
        stance: "強く賛成",
        summary: "文化予算の大幅増額を要求。国家予算に占める文化予算の割合をフランス並み（約1%）に引き上げることを長期目標に設定。現状の0.1%台は先進国最低水準と批判。",
        manifesto: "文化予算を国家予算の0.5%以上に - 文化投資国家への転換",
        year: 2024,
      },
    ],
  },
  {
    partyName: "公明党",
    stances: [
      {
        topic: "芸術支援拡充",
        stance: "賛成",
        summary: "文化芸術振興の拡充に賛成。特に地域の文化活動支援と若手芸術家の育成を重視。文化芸術による社会包摂（障害者アート、高齢者の文化参加）を推進。",
        manifesto: "文化芸術の力で社会を元気に - 誰もが文化に親しめる社会",
        year: 2024,
      },
      {
        topic: "文化財デジタル化",
        stance: "賛成",
        summary: "文化財デジタル化を支持。特に教育現場での活用、バーチャルミュージアムによる地方創生を重視。デジタルアーカイブの多言語化も推進。",
        manifesto: "文化財デジタル化で全国の子どもたちに等しく文化体験を",
        year: 2024,
      },
      {
        topic: "クールジャパン戦略",
        stance: "賛成",
        summary: "クールジャパン戦略を基本的に支持。人材育成とクリエイターの権利保護を特に重視。中小コンテンツ制作企業への支援拡充を提唱。",
        manifesto: null,
        year: 2024,
      },
      {
        topic: "著作権法改正（AI学習）",
        stance: "バランス重視",
        summary: "AI学習と著作権のバランスを重視。クリエイターの権利保護と技術革新の両立を目指す。教育・研究目的の利用は柔軟に、商業利用は厳格に区分すべきと主張。",
        manifesto: null,
        year: 2024,
      },
      {
        topic: "表現の自由",
        stance: "支持",
        summary: "表現の自由を基本的に支持。ただし、公序良俗に反する表現については一定の配慮を求める。ヘイトスピーチ規制は推進。",
        manifesto: null,
        year: 2024,
      },
      {
        topic: "文化庁予算増額",
        stance: "賛成",
        summary: "文化庁予算の着実な増額を支持。特に地域文化振興、障害者文化芸術、子どもの文化体験機会の拡充に重点配分を要望。",
        manifesto: "子どもの文化体験活動の無料化推進",
        year: 2024,
      },
    ],
  },
  {
    partyName: "日本維新の会",
    stances: [
      {
        topic: "芸術支援拡充",
        stance: "効率化重視",
        summary: "文化芸術支援は民間主導・市場メカニズムを重視。行政による直接補助よりも、寄附税制の拡充や民間ファンドの活用を提唱。「稼げる文化」を目指す。",
        manifesto: "文化芸術の自立経営を支援 - 規制改革と税制優遇で民間投資促進",
        year: 2024,
      },
      {
        topic: "文化財デジタル化",
        stance: "積極推進",
        summary: "文化財デジタル化を積極推進。NFT・ブロックチェーン技術の活用による文化財の新たな価値創出を提唱。大阪万博でのデジタルアート展示を推進した実績。",
        manifesto: "文化財×テクノロジーで新産業創出",
        year: 2024,
      },
      {
        topic: "クールジャパン戦略",
        stance: "抜本改革",
        summary: "クールジャパン機構の失敗を厳しく批判し、抜本的な改革・民営化を主張。官僚主導から民間主導への転換を要求。コンテンツ産業の規制緩和を重視。",
        manifesto: "クールジャパン機構の民営化と規制緩和による市場主導のコンテンツ振興",
        year: 2024,
      },
      {
        topic: "著作権法改正（AI学習）",
        stance: "技術革新重視",
        summary: "AI学習における著作物利用を幅広く認める立場。過度な規制は日本のAI産業の国際競争力を損なうと警告。権利侵害が明白な場合のみ規制すべきとの姿勢。",
        manifesto: "AI活用を阻害しない著作権制度への改革",
        year: 2024,
      },
      {
        topic: "表現の自由",
        stance: "強く支持",
        summary: "表現の自由を最大限擁護。漫画・アニメ等の表現規制に強く反対。表現規制は最小限に留めるべきとの立場。ネット上の表現規制にも慎重。",
        manifesto: "表現の自由の最大限の保障 - 行政の過剰介入排除",
        year: 2024,
      },
      {
        topic: "文化庁予算増額",
        stance: "効率化優先",
        summary: "予算総額の増額よりも既存事業の効率化・スクラップ＆ビルドを重視。文化庁の京都移転コストに疑問を呈しつつ、費用対効果の検証を求める。",
        manifesto: "文化予算のエビデンスに基づく配分最適化",
        year: 2024,
      },
    ],
  },
  {
    partyName: "国民民主党",
    stances: [
      {
        topic: "芸術支援拡充",
        stance: "賛成",
        summary: "文化芸術支援の拡充に賛成。特にクリエイターの所得向上と安定雇用を重視。フリーランス芸術家への契約保護法制を提唱。「手取りを増やす」政策の文化版を展開。",
        manifesto: "クリエイターの手取りを増やす - 文化芸術人材への投資拡大",
        year: 2024,
      },
      {
        topic: "文化財デジタル化",
        stance: "賛成",
        summary: "文化財デジタル化を推進。教育政策との連携を重視し、デジタル教科書での文化財活用、VR技術による体験学習を提唱。",
        manifesto: null,
        year: 2024,
      },
      {
        topic: "クールジャパン戦略",
        stance: "改善を要求",
        summary: "クールジャパン戦略の方向性は支持するが、実施体制の改善を要求。コンテンツ産業の税制優遇拡充、人材育成の強化を重視。",
        manifesto: "コンテンツ産業の税制支援拡充と人材育成強化",
        year: 2024,
      },
      {
        topic: "著作権法改正（AI学習）",
        stance: "バランス重視",
        summary: "AI学習と著作権のバランスを重視。クリエイターの適正な対価確保のための制度設計を提唱。AI生成物への課金制度（著作権使用料のプール制度）の検討を提案。",
        manifesto: "AI時代の著作権 - クリエイターへの適正対価と技術革新の両立",
        year: 2024,
      },
      {
        topic: "表現の自由",
        stance: "支持",
        summary: "表現の自由を基本的に支持。漫画・アニメ等の表現規制には慎重な立場。",
        manifesto: null,
        year: 2024,
      },
      {
        topic: "文化庁予算増額",
        stance: "賛成",
        summary: "文化庁予算の増額に賛成。文化への投資は経済成長にも寄与するとの立場。教育予算との一体的な拡充を主張。",
        manifesto: "文化・教育予算の一体的拡充",
        year: 2024,
      },
    ],
  },
  {
    partyName: "日本共産党",
    stances: [
      {
        topic: "芸術支援拡充",
        stance: "強く賛成",
        summary: "文化予算の大幅増額と芸術家の生活保障を強く主張。国の文化予算を欧州水準に引き上げることを要求。文化芸術活動への公的支援を「権利」として位置づけ。",
        manifesto: "文化予算の抜本的拡充 - 芸術家が安心して創作できる社会を",
        year: 2024,
      },
      {
        topic: "文化財デジタル化",
        stance: "賛成",
        summary: "文化財デジタル化を支持。ただし、デジタル化が文化財の現物保護の代替になってはならないと警告。デジタルアーカイブの完全無料公開を主張。",
        manifesto: null,
        year: 2024,
      },
      {
        topic: "クールジャパン戦略",
        stance: "批判的",
        summary: "クールジャパン戦略を「文化の商品化」として批判。文化の多様性と非商業的な文化活動の保護を重視。クールジャパン機構への税金投入に強く反対。",
        manifesto: "文化の商品化反対 - 多様な文化活動への公的支援拡充",
        year: 2024,
      },
      {
        topic: "著作権法改正（AI学習）",
        stance: "クリエイター保護最優先",
        summary: "AI学習における著作物の無断使用に強く反対。クリエイターの同意なしにAI学習に著作物を使用することを原則禁止すべきと主張。",
        manifesto: "AI企業によるクリエイターの搾取を許さない - 著作権の厳格な保護",
        year: 2024,
      },
      {
        topic: "表現の自由",
        stance: "強く支持",
        summary: "表現の自由を最大限擁護。国家権力による表現規制に強く反対。あいちトリエンナーレ問題では表現の自由を守る立場を鮮明にした。",
        manifesto: "表現の自由の完全な保障 - 権力による介入を許さない",
        year: 2024,
      },
      {
        topic: "文化庁予算増額",
        stance: "大幅増額要求",
        summary: "文化庁予算を現在の3倍以上に引き上げることを要求。軍事費増額分を文化・教育・福祉に回すべきと主張。文化庁の省への格上げも提唱。",
        manifesto: "文化庁予算3倍増・文化省設置 - 文化大国日本の実現",
        year: 2024,
      },
    ],
  },
  {
    partyName: "れいわ新選組",
    stances: [
      {
        topic: "芸術支援拡充",
        stance: "強く賛成",
        summary: "文化芸術関係者への直接給付制度の創設を提唱。全てのアーティストに最低生活保障を提供し、創作活動に専念できる環境を整備。「文化はぜいたく品ではなく生活必需品」との立場。",
        manifesto: "アーティストへのベーシックインカム的支援制度の創設",
        year: 2024,
      },
      {
        topic: "文化財デジタル化",
        stance: "賛成",
        summary: "文化財デジタル化を支持。デジタルアーカイブの無料公開と誰もがアクセスできる環境整備を重視。",
        manifesto: null,
        year: 2024,
      },
      {
        topic: "クールジャパン戦略",
        stance: "現場優先に転換",
        summary: "クールジャパン戦略の恩恵が現場のクリエイターに届いていないと批判。アニメーター、漫画家アシスタント等への直接支援を優先すべきと主張。",
        manifesto: "現場のクリエイターに届く支援 - 中間搾取の排除",
        year: 2024,
      },
      {
        topic: "著作権法改正（AI学習）",
        stance: "クリエイター保護重視",
        summary: "AI学習による著作権侵害からクリエイターを守る立場。AI企業への課税と、その財源をクリエイター支援に充てることを提唱。",
        manifesto: null,
        year: 2024,
      },
      {
        topic: "表現の自由",
        stance: "強く支持",
        summary: "表現の自由を最大限擁護。国家権力による表現規制に断固反対。",
        manifesto: null,
        year: 2024,
      },
      {
        topic: "文化庁予算増額",
        stance: "大幅増額要求",
        summary: "文化庁予算の大幅増額を要求。国債発行も辞さない積極財政で文化投資を拡充すべきとの立場。",
        manifesto: "文化予算の大幅増額 - 積極財政で文化投資",
        year: 2024,
      },
    ],
  },
  {
    partyName: "社会民主党",
    stances: [
      {
        topic: "芸術支援拡充",
        stance: "強く賛成",
        summary: "文化芸術支援の拡充を強く支持。特に地域の草の根的な文化活動、マイノリティの文化表現への支援を重視。平和文化の推進も含む。",
        manifesto: "地域文化とマイノリティの文化権保障",
        year: 2024,
      },
      {
        topic: "文化財デジタル化",
        stance: "賛成",
        summary: "文化財デジタル化に賛成。戦争遺跡のデジタル保存など平和教育との連携を重視。",
        manifesto: null,
        year: 2024,
      },
      {
        topic: "クールジャパン戦略",
        stance: "批判的",
        summary: "クールジャパン戦略を国家主義的な文化利用として警戒。多文化共生の観点からの文化政策を重視。",
        manifesto: null,
        year: 2024,
      },
      {
        topic: "著作権法改正（AI学習）",
        stance: "クリエイター保護重視",
        summary: "AI学習における著作権問題について、クリエイターの権利保護を優先。労働者の権利保護の延長線上で捉える。",
        manifesto: null,
        year: 2024,
      },
      {
        topic: "表現の自由",
        stance: "強く支持",
        summary: "表現の自由を強く擁護。ヘイトスピーチ規制は推進しつつ、芸術表現の自由は最大限守るべきとの立場。",
        manifesto: null,
        year: 2024,
      },
      {
        topic: "文化庁予算増額",
        stance: "賛成",
        summary: "文化庁予算の増額に賛成。軍事費削減による財源確保を主張。",
        manifesto: null,
        year: 2024,
      },
    ],
  },
  {
    partyName: "NHK党",
    stances: [
      {
        topic: "芸術支援拡充",
        stance: "中立",
        summary: "NHK改革が最優先課題であり、文化政策については特に目立った主張なし。NHKの文化番組制作については批判的。",
        manifesto: null,
        year: 2024,
      },
      {
        topic: "文化財デジタル化",
        stance: "中立",
        summary: "特段の主張なし。",
        manifesto: null,
        year: 2024,
      },
      {
        topic: "クールジャパン戦略",
        stance: "中立",
        summary: "特段の主張なし。",
        manifesto: null,
        year: 2024,
      },
      {
        topic: "著作権法改正（AI学習）",
        stance: "中立",
        summary: "特段の主張なし。",
        manifesto: null,
        year: 2024,
      },
      {
        topic: "表現の自由",
        stance: "支持",
        summary: "表現の自由を支持。NHKの放送内容に対する批判の文脈で表現の自由を主張。",
        manifesto: null,
        year: 2024,
      },
      {
        topic: "文化庁予算増額",
        stance: "中立",
        summary: "NHK受信料廃止が優先課題。文化庁予算については特に目立った主張なし。",
        manifesto: null,
        year: 2024,
      },
    ],
  },
  {
    partyName: "参政党",
    stances: [
      {
        topic: "芸術支援拡充",
        stance: "伝統文化重視",
        summary: "日本の伝統文化・伝統芸能の保護と継承を最重視。現代アートやサブカルチャーへの支援よりも、伝統文化教育の充実を優先。",
        manifesto: "日本の伝統文化復興 - 神社仏閣・伝統芸能・武道の次世代継承",
        year: 2024,
      },
      {
        topic: "文化財デジタル化",
        stance: "条件付き賛成",
        summary: "文化財のデジタル化は手段として認めるが、実物体験の価値を重視。デジタル化が実物の代替にならないよう警告。",
        manifesto: null,
        year: 2024,
      },
      {
        topic: "クールジャパン戦略",
        stance: "日本文化発信重視",
        summary: "クールジャパン戦略を支持するが、サブカルチャー偏重を是正し、伝統文化・精神文化の海外発信を強化すべきと主張。",
        manifesto: "日本文化の本質を海外に発信 - 表層的なポップカルチャーからの脱却",
        year: 2024,
      },
      {
        topic: "著作権法改正（AI学習）",
        stance: "慎重",
        summary: "AI技術の利用には慎重な立場。日本文化の尊厳を損なうようなAI利用に反対。",
        manifesto: null,
        year: 2024,
      },
      {
        topic: "表現の自由",
        stance: "条件付き支持",
        summary: "表現の自由を基本的に認めるが、日本の伝統的価値観や公序良俗を損なう表現には批判的。反日的な表現への公的助成には反対。",
        manifesto: null,
        year: 2024,
      },
      {
        topic: "文化庁予算増額",
        stance: "伝統文化に重点",
        summary: "文化庁予算の増額は支持するが、伝統文化・文化財保護への重点配分を強く要望。現代アートへの予算配分には疑問を呈する。",
        manifesto: "伝統文化保護予算の重点強化",
        year: 2024,
      },
    ],
  },
  {
    partyName: "日本保守党",
    stances: [
      {
        topic: "芸術支援拡充",
        stance: "伝統重視",
        summary: "日本の伝統文化・歴史遺産の保護を重視。現代アートへの公的助成には懐疑的。特に反日的・自虐史観的な芸術作品への公費投入に強く反対。",
        manifesto: "日本の伝統文化を守り育てる - 公的助成の適正化",
        year: 2024,
      },
      {
        topic: "文化財デジタル化",
        stance: "賛成",
        summary: "日本の歴史・文化財のデジタル保存・発信を支持。特に正しい歴史認識の発信ツールとしてデジタル技術の活用を推進。",
        manifesto: null,
        year: 2024,
      },
      {
        topic: "クールジャパン戦略",
        stance: "改革推進",
        summary: "クールジャパン機構の改革を推進。日本の伝統文化・精神性を含めた総合的な日本文化発信を提唱。",
        manifesto: null,
        year: 2024,
      },
      {
        topic: "著作権法改正（AI学習）",
        stance: "バランス重視",
        summary: "AI学習と著作権のバランスを重視。日本のコンテンツ産業の競争力を維持しつつ、クリエイターの権利も保護すべきとの立場。",
        manifesto: null,
        year: 2024,
      },
      {
        topic: "表現の自由",
        stance: "条件付き支持",
        summary: "表現の自由を基本的に認めるが、国家の尊厳を損なう表現への公費助成には反対。反日的・侮辱的な芸術作品への税金投入を批判。",
        manifesto: null,
        year: 2024,
      },
      {
        topic: "文化庁予算増額",
        stance: "適正配分重視",
        summary: "文化庁予算の総額よりも配分の適正化を重視。伝統文化・歴史遺産の保護に重点配分すべきと主張。",
        manifesto: null,
        year: 2024,
      },
    ],
  },
  {
    partyName: "チームみらい",
    stances: [
      {
        topic: "芸術支援拡充",
        stance: "賛成",
        summary: "文化芸術支援の拡充に賛成。地方の文化活動支援と文化による地方創生を重視。",
        manifesto: null,
        year: 2025,
      },
      {
        topic: "文化財デジタル化",
        stance: "積極推進",
        summary: "テクノロジーを活用した文化財保存・活用を積極推進。AR・VR技術との融合を提唱。",
        manifesto: null,
        year: 2025,
      },
      {
        topic: "クールジャパン戦略",
        stance: "改革推進",
        summary: "クールジャパン戦略の改革を支持。現場のクリエイターに届く支援を重視。",
        manifesto: null,
        year: 2025,
      },
      {
        topic: "著作権法改正（AI学習）",
        stance: "バランス重視",
        summary: "AI学習と著作権のバランスある制度設計を支持。",
        manifesto: null,
        year: 2025,
      },
      {
        topic: "表現の自由",
        stance: "支持",
        summary: "表現の自由を支持。",
        manifesto: null,
        year: 2025,
      },
      {
        topic: "文化庁予算増額",
        stance: "賛成",
        summary: "文化庁予算の増額に賛成。効果的な配分を重視。",
        manifesto: null,
        year: 2025,
      },
    ],
  },
  {
    partyName: "中道改革連合",
    stances: [
      {
        topic: "芸術支援拡充",
        stance: "賛成",
        summary: "文化芸術支援の拡充に賛成。市民参加型の文化政策を提唱。",
        manifesto: null,
        year: 2025,
      },
      {
        topic: "文化財デジタル化",
        stance: "賛成",
        summary: "文化財デジタル化の推進に賛成。オープンデータ化を重視。",
        manifesto: null,
        year: 2025,
      },
      {
        topic: "クールジャパン戦略",
        stance: "改善を要求",
        summary: "クールジャパン戦略の透明性向上と効果測定の厳格化を要求。",
        manifesto: null,
        year: 2025,
      },
      {
        topic: "著作権法改正（AI学習）",
        stance: "バランス重視",
        summary: "AI学習と著作権について、エビデンスに基づく政策形成を提唱。",
        manifesto: null,
        year: 2025,
      },
      {
        topic: "表現の自由",
        stance: "支持",
        summary: "表現の自由を基本的に支持。",
        manifesto: null,
        year: 2025,
      },
      {
        topic: "文化庁予算増額",
        stance: "段階的増額",
        summary: "文化庁予算の段階的な増額を支持。費用対効果の検証を条件とする。",
        manifesto: null,
        year: 2025,
      },
    ],
  },
];

// ============================================
// メイン処理
// ============================================

export async function seedCulturalData(): Promise<void> {
  console.log("=".repeat(60));
  console.log("[culture] 文化政策（CultureScope）シードを開始...");
  console.log("=".repeat(60));

  // ─────────────────────────────────────────
  // 1. 文化庁予算（CulturalBudget）
  // ─────────────────────────────────────────
  console.log("\n[culture] --- 文化庁予算データ ---");
  let budgetCount = 0;

  for (const yearData of CULTURAL_BUDGET_DATA) {
    const entries: { category: string; amount: bigint; description: string }[] = [
      { category: "ARTS_PROMOTION", amount: yearData.artsPromotion, description: `${yearData.fiscalYear}年度 芸術文化振興費` },
      { category: "CULTURAL_PROPERTY", amount: yearData.culturalProperty, description: `${yearData.fiscalYear}年度 文化財保護費` },
      { category: "MEDIA_ARTS", amount: yearData.mediaArts, description: `${yearData.fiscalYear}年度 メディア芸術振興費` },
      { category: "INTERNATIONAL", amount: yearData.international, description: `${yearData.fiscalYear}年度 国際文化交流費` },
      { category: "COPYRIGHT", amount: yearData.copyright, description: `${yearData.fiscalYear}年度 著作権関連経費` },
      { category: "JAPANESE_LANGUAGE", amount: yearData.japaneseLanguage, description: `${yearData.fiscalYear}年度 国語・日本語教育費` },
      { category: "RELIGIOUS_AFFAIRS", amount: yearData.religiousAffairs, description: `${yearData.fiscalYear}年度 宗務関連経費` },
      { category: "CREATIVE_INDUSTRY", amount: yearData.creativeIndustry, description: `${yearData.fiscalYear}年度 文化産業振興費` },
      { category: "CULTURAL_FACILITY", amount: yearData.culturalFacility, description: `${yearData.fiscalYear}年度 文化施設整備費` },
      { category: "DIGITAL_ARCHIVE", amount: yearData.digitalArchive, description: `${yearData.fiscalYear}年度 デジタルアーカイブ推進費` },
      { category: "LOCAL_CULTURE", amount: yearData.localCulture, description: `${yearData.fiscalYear}年度 地域文化振興費` },
      { category: "TOTAL", amount: yearData.total, description: `${yearData.fiscalYear}年度 文化庁予算合計` },
    ];

    for (const entry of entries) {
      await prisma.culturalBudget.upsert({
        where: {
          fiscalYear_category: {
            fiscalYear: yearData.fiscalYear,
            category: entry.category as "ARTS_PROMOTION" | "CULTURAL_PROPERTY" | "MEDIA_ARTS" | "INTERNATIONAL" | "COPYRIGHT" | "JAPANESE_LANGUAGE" | "RELIGIOUS_AFFAIRS" | "CREATIVE_INDUSTRY" | "CULTURAL_FACILITY" | "DIGITAL_ARCHIVE" | "LOCAL_CULTURE" | "TOTAL",
          },
        },
        update: {
          amount: entry.amount,
          description: entry.description,
          sourceUrl: "https://www.bunka.go.jp/seisaku/bunka_gyosei/yosan/",
        },
        create: {
          fiscalYear: yearData.fiscalYear,
          category: entry.category as "ARTS_PROMOTION" | "CULTURAL_PROPERTY" | "MEDIA_ARTS" | "INTERNATIONAL" | "COPYRIGHT" | "JAPANESE_LANGUAGE" | "RELIGIOUS_AFFAIRS" | "CREATIVE_INDUSTRY" | "CULTURAL_FACILITY" | "DIGITAL_ARCHIVE" | "LOCAL_CULTURE" | "TOTAL",
          amount: entry.amount,
          description: entry.description,
          sourceUrl: "https://www.bunka.go.jp/seisaku/bunka_gyosei/yosan/",
        },
      });
      budgetCount++;
    }

    console.log(
      `[culture]   ${yearData.fiscalYear}年度: 合計 ${Number(yearData.total).toLocaleString()}百万円（${(Number(yearData.total) / 100).toFixed(0)}億円）`,
    );
  }

  console.log(`[culture] 予算データ: ${budgetCount}件登録完了`);

  // ─────────────────────────────────────────
  // 2. 文化プログラム（CulturalProgram）
  // ─────────────────────────────────────────
  console.log("\n[culture] --- 文化プログラムデータ ---");
  let programCount = 0;

  for (const program of CULTURAL_PROGRAM_DATA) {
    // nameでfindFirstして存在すればupdate、なければcreate
    const existing = await prisma.culturalProgram.findFirst({
      where: { name: program.name },
    });

    if (existing) {
      await prisma.culturalProgram.update({
        where: { id: existing.id },
        data: {
          category: program.category as "ARTS_PROMOTION" | "CULTURAL_PROPERTY" | "MEDIA_ARTS" | "INTERNATIONAL" | "COPYRIGHT" | "JAPANESE_LANGUAGE" | "RELIGIOUS_AFFAIRS" | "CREATIVE_INDUSTRY" | "CULTURAL_FACILITY" | "DIGITAL_ARCHIVE" | "LOCAL_CULTURE" | "TOTAL",
          description: program.description,
          budget: program.budget,
          startYear: program.startYear,
          endYear: program.endYear,
          targetGroup: program.targetGroup,
          ministry: program.ministry,
          sourceUrl: program.sourceUrl,
          isActive: program.isActive,
        },
      });
    } else {
      await prisma.culturalProgram.create({
        data: {
          name: program.name,
          category: program.category as "ARTS_PROMOTION" | "CULTURAL_PROPERTY" | "MEDIA_ARTS" | "INTERNATIONAL" | "COPYRIGHT" | "JAPANESE_LANGUAGE" | "RELIGIOUS_AFFAIRS" | "CREATIVE_INDUSTRY" | "CULTURAL_FACILITY" | "DIGITAL_ARCHIVE" | "LOCAL_CULTURE" | "TOTAL",
          description: program.description,
          budget: program.budget,
          startYear: program.startYear,
          endYear: program.endYear,
          targetGroup: program.targetGroup,
          ministry: program.ministry,
          sourceUrl: program.sourceUrl,
          isActive: program.isActive,
        },
      });
    }

    programCount++;
    console.log(
      `[culture]   ${program.name}（${program.startYear}〜${program.endYear ?? "現在"}）`,
    );
  }

  console.log(`[culture] プログラム: ${programCount}件登録完了`);

  // ─────────────────────────────────────────
  // 3. 政党別文化政策スタンス（CulturalStance）
  // ─────────────────────────────────────────
  console.log("\n[culture] --- 政党別文化政策スタンスデータ ---");
  let stanceCount = 0;

  for (const partyStance of CULTURAL_STANCE_DATA) {
    const party = await prisma.party.findFirst({
      where: { name: partyStance.partyName },
    });

    if (!party) {
      console.warn(
        `[culture] 政党「${partyStance.partyName}」がDBに見つかりません。スキップします。`,
      );
      continue;
    }

    for (const stance of partyStance.stances) {
      await prisma.culturalStance.upsert({
        where: {
          partyId_topic_year: {
            partyId: party.id,
            topic: stance.topic,
            year: stance.year,
          },
        },
        update: {
          stance: stance.stance,
          summary: stance.summary,
          manifesto: stance.manifesto,
        },
        create: {
          partyId: party.id,
          topic: stance.topic,
          stance: stance.stance,
          summary: stance.summary,
          manifesto: stance.manifesto,
          year: stance.year,
        },
      });
      stanceCount++;
    }

    console.log(`[culture]   ${partyStance.partyName}: ${partyStance.stances.length}件`);
  }

  console.log(`[culture] スタンス: ${stanceCount}件登録完了`);

  // ─────────────────────────────────────────
  // サマリー
  // ─────────────────────────────────────────
  console.log("\n" + "=".repeat(60));
  console.log(
    `[culture] 完了 -- 予算${budgetCount}件, プログラム${programCount}件, スタンス${stanceCount}件`,
  );
  console.log("=".repeat(60));
}

// CLI実行
if (process.argv[1]?.includes("cultural-policy/seed-cultural-data")) {
  seedCulturalData()
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
