/**
 * 社会保障（SocialGuard）シードスクリプト
 *
 * データソース:
 *   - 財務省「一般会計歳出予算」社会保障関係費
 *     https://www.mof.go.jp/policy/budget/budger_workflow/budget/
 *   - 厚生労働省「社会保障関係予算」
 *     https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000164769.html
 *   - こども家庭庁「こども・子育て支援加速化プラン」（2024年〜）
 *   - 総務省「統計でみる都道府県のすがた」
 *   - 厚生労働省「介護保険事業状況報告」
 *   - 厚生労働省「国民医療費の概況」
 *
 * 注意:
 *   - 社会保障関係費は億円単位（BigInt）
 *   - 都道府県別データは各種統計を基にした推計値を含む
 *   - 2025年以降は概算要求・推計値を含む
 */

import { prisma } from "@ojpp/db";

// ============================================
// 型定義
// ============================================

interface SocialSecurityBudgetYear {
  fiscalYear: number;
  /** 年金（億円） */
  pension: bigint;
  /** 医療（億円） */
  healthcare: bigint;
  /** 介護（億円） */
  longTermCare: bigint;
  /** 福祉（生活保護等）（億円） */
  welfare: bigint;
  /** 子育て支援（億円） */
  childSupport: bigint;
  /** 雇用・労働（億円） */
  employment: bigint;
  /** 障害福祉（億円） */
  disability: bigint;
  /** 合計（億円） */
  total: bigint;
}

interface SocialSecurityProgramData {
  name: string;
  category: string;
  description: string;
  eligibility: string | null;
  benefit: string | null;
  /** 制度全体の予算規模（億円、一般会計+特別会計含む概算値） */
  budget: bigint | null;
  /** 受給者数（万人） */
  recipients: number | null;
  startYear: number | null;
  lastReformed: number | null;
  sourceUrl: string | null;
  isActive: boolean;
}

interface PrefectureWelfareData {
  prefectureName: string;
  stats: {
    category: string;
    value: number;
    unit: string;
    indicator: string;
  }[];
}

interface SocialSecurityStanceData {
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
// 社会保障関係費データ（2019-2026, 億円単位）
// ============================================

/**
 * 社会保障関係費の推移（一般会計当初予算ベース）
 *
 * 出典:
 *   - 財務省「予算のポイント」各年度版
 *   - 厚生労働省「社会保障関係予算のポイント」
 *   - 参議院調査室「社会保障関係予算」各年度分析レポート
 *   - 高齢化の進行により毎年約5,000-8,000億円の自然増
 *   - 2024年以降はこども家庭庁設置・加速化プランで子育て支援が急増
 *
 * カテゴリと公式分類の対応:
 *   pension     → 年金給付費
 *   healthcare  → 医療給付費 + 保健衛生対策費
 *   longTermCare→ 介護給付費
 *   welfare     → 生活扶助等社会福祉費のうち生活保護・一般福祉
 *   childSupport→ 少子化対策費
 *   employment  → 雇用労災対策費
 *   disability  → 生活扶助等社会福祉費のうち障害福祉サービス関連
 *   total       → 社会保障関係費合計（公式値）
 *
 * 注意:
 *   - 公式分類の「生活扶助等社会福祉費」には障害福祉サービス費が含まれるため
 *     welfare + disability ≒ 生活扶助等社会福祉費
 *   - 保健衛生対策費（約4,000-5,000億円）はhealthcareに含めて計上
 *   - 2026年度は概算要求・推計値
 */
const SOCIAL_SECURITY_BUDGET_DATA: SocialSecurityBudgetYear[] = [
  {
    // 平成25年度（2013年度）当初予算
    // 公式合計: 291,224億円（29兆1,224億円）
    // 参照: 財務省「平成25年度予算のポイント」
    fiscalYear: 2013,
    pension: 107_898n,
    healthcare: 112_498n,
    longTermCare: 25_640n,
    welfare: 20_600n,
    childSupport: 13_143n,
    employment: 345n,
    disability: 11_100n,
    total: 291_224n,
  },
  {
    // 平成26年度（2014年度）当初予算
    // 公式合計: 305,175億円（30兆5,175億円）
    // 参照: 財務省「平成26年度予算のポイント」消費税率8%引上げ
    fiscalYear: 2014,
    pension: 109_397n,
    healthcare: 114_254n,
    longTermCare: 26_739n,
    welfare: 20_700n,
    childSupport: 20_972n,
    employment: 353n,
    disability: 12_760n,
    total: 305_175n,
  },
  {
    // 平成27年度（2015年度）当初予算
    // 公式合計: 315,297億円（31兆5,297億円）
    // 参照: 財務省「平成27年度予算のポイント」子ども・子育て支援新制度開始
    fiscalYear: 2015,
    pension: 111_418n,
    healthcare: 115_938n,
    longTermCare: 27_897n,
    welfare: 21_000n,
    childSupport: 21_843n,
    employment: 361n,
    disability: 16_840n,
    total: 315_297n,
  },
  {
    // 平成28年度（2016年度）当初予算
    // 公式合計: 319,738億円（31兆9,738億円）
    // 参照: 財務省「平成28年度予算のポイント」
    fiscalYear: 2016,
    pension: 113_452n,
    healthcare: 117_185n,
    longTermCare: 28_973n,
    welfare: 20_800n,
    childSupport: 21_553n,
    employment: 375n,
    disability: 17_400n,
    total: 319_738n,
  },
  {
    // 平成29年度（2017年度）当初予算
    // 公式合計: 324,735億円（32兆4,735億円）
    // 参照: 財務省「平成29年度予算のポイント」
    fiscalYear: 2017,
    pension: 115_020n,
    healthcare: 118_079n,
    longTermCare: 29_855n,
    welfare: 21_200n,
    childSupport: 22_131n,
    employment: 380n,
    disability: 18_070n,
    total: 324_735n,
  },
  {
    // 平成30年度（2018年度）当初予算
    // 公式合計: 329,732億円（32兆9,732億円）
    // 参照: 財務省「平成30年度予算のポイント」
    fiscalYear: 2018,
    pension: 116_853n,
    healthcare: 119_974n,
    longTermCare: 31_153n,
    welfare: 21_400n,
    childSupport: 22_517n,
    employment: 385n,
    disability: 17_450n,
    total: 329_732n,
  },
  {
    // 平成31年度（2019年度）当初予算
    // 公式合計: 340,593億円（34兆593億円）
    // 参照: 参議院調査室「平成31年度社会保障関係予算」
    fiscalYear: 2019,
    pension: 120_488n,       // 年金給付費 12兆488億円
    healthcare: 122_370n,    // 医療給付費11兆8,543億円 + 保健衛生対策費3,827億円
    longTermCare: 32_101n,   // 介護給付費 3兆2,101億円
    welfare: 25_206n,        // 生活扶助等社会福祉費のうち生活保護・一般福祉
    childSupport: 23_440n,   // 少子化対策費 2兆3,440億円
    employment: 388n,        // 雇用労災対策費 388億円
    disability: 16_600n,     // 障害福祉サービス費（生活扶助等社会福祉費の一部）
    total: 340_593n,         // 34兆593億円（公式値）
  },
  {
    // 令和2年度（2020年度）当初予算
    // 公式合計: 358,608億円（35兆8,608億円）
    // 参照: 参議院調査室「令和2年度社会保障関係予算」
    fiscalYear: 2020,
    pension: 125_232n,       // 年金給付費 12兆5,232億円（+3.9%）
    healthcare: 126_730n,    // 医療給付費12兆1,546億円 + 保健衛生対策費5,184億円
    longTermCare: 33_838n,   // 介護給付費 3兆3,838億円（+5.4%）
    welfare: 24_000n,        // 生活扶助等社会福祉費のうち生活保護・一般福祉
    childSupport: 30_387n,   // 少子化対策費 3兆387億円（+28.9%、幼児教育無償化通年化）
    employment: 395n,        // 雇用労災対策費 395億円（当初予算ベース）
    disability: 18_026n,     // 障害福祉サービス費（生活扶助等社会福祉費の一部）
    total: 358_608n,         // 35兆8,608億円（公式値）
  },
  {
    // 令和3年度（2021年度）当初予算
    // 公式合計: 358,421億円（35兆8,421億円）
    // 参照: 財務省「令和3年度社会保障関係予算のポイント」
    fiscalYear: 2021,
    pension: 126_116n,       // 年金給付費 12兆6,116億円
    healthcare: 124_387n,    // 医療給付費11兆9,637億円 + 保健衛生対策費4,750億円
    longTermCare: 34_662n,   // 介護給付費 3兆4,662億円
    welfare: 24_400n,        // 生活扶助等社会福祉費のうち生活保護・一般福祉
    childSupport: 29_478n,   // 少子化対策費 2兆9,478億円
    employment: 400n,        // 雇用労災対策費 400億円
    disability: 18_978n,     // 障害福祉サービス費（生活扶助等社会福祉費の一部）
    total: 358_421n,         // 35兆8,421億円（公式値）
  },
  {
    // 令和4年度（2022年度）当初予算
    // 公式合計: 362,735億円（36兆2,735億円）
    // 参照: 財務省「令和4年度社会保障関係予算のポイント」
    fiscalYear: 2022,
    pension: 127_505n,       // 年金給付費 12兆7,505億円
    healthcare: 125_324n,    // 医療給付費12兆854億円 + 保健衛生対策費4,470億円
    longTermCare: 35_843n,   // 介護給付費 3兆5,843億円
    welfare: 23_400n,        // 生活扶助等社会福祉費のうち生活保護・一般福祉
    childSupport: 30_224n,   // 少子化対策費 3兆224億円
    employment: 435n,        // 雇用労災対策費 435億円
    disability: 20_004n,     // 障害福祉サービス費（生活扶助等社会福祉費の一部）
    total: 362_735n,         // 36兆2,735億円（公式値）
  },
  {
    // 令和5年度（2023年度）当初予算
    // 公式合計: 368,889億円（36兆8,889億円）
    // 参照: 参議院調査室「令和5年度社会保障関係予算」
    fiscalYear: 2023,
    pension: 130_857n,       // 年金給付費 13兆857億円
    healthcare: 126_017n,    // 医療給付費12兆1,517億円 + 保健衛生対策費4,500億円
    longTermCare: 36_809n,   // 介護給付費 3兆6,809億円
    welfare: 22_340n,        // 生活扶助等社会福祉費のうち生活保護・一般福祉
    childSupport: 31_412n,   // 少子化対策費 3兆1,412億円（出産育児一時金50万円に増額）
    employment: 447n,        // 雇用労災対策費 447億円
    disability: 21_007n,     // 障害福祉サービス費（生活扶助等社会福祉費の一部）
    total: 368_889n,         // 36兆8,889億円（公式値）
  },
  {
    // 令和6年度（2024年度）当初予算
    // 公式合計: 377,193億円（37兆7,193億円）
    // 参照: 財務省「令和6年度社会保障関係予算のポイント」
    fiscalYear: 2024,
    pension: 134_020n,       // 年金給付費 13兆4,020億円（+2.4%）
    healthcare: 126_810n,    // 医療給付費12兆2,366億円 + 保健衛生対策費4,444億円
    longTermCare: 37_188n,   // 介護給付費 3兆7,188億円（+1.0%）
    welfare: 22_312n,        // 生活扶助等社会福祉費のうち生活保護・一般福祉
    childSupport: 33_823n,   // 少子化対策費 3兆3,823億円（+7.7%、加速化プラン本格化）
    employment: 440n,        // 雇用労災対策費 440億円
    disability: 22_600n,     // 障害福祉サービス費（生活扶助等社会福祉費の一部）
    total: 377_193n,         // 37兆7,193億円（公式値）
  },
  {
    // 令和7年度（2025年度）政府案
    // 公式合計: 382,778億円（38兆2,778億円）
    // 参照: 財務省「令和7年度社会保障関係予算のポイント」
    fiscalYear: 2025,
    pension: 136_916n,       // 年金給付費 13兆6,916億円（+2.2%、2025年問題: 団塊世代全員75歳以上）
    healthcare: 127_642n,    // 医療給付費12兆3,208億円 + 保健衛生対策費4,434億円
    longTermCare: 37_274n,   // 介護給付費 3兆7,274億円（+0.2%）
    welfare: 21_875n,        // 生活扶助等社会福祉費のうち生活保護・一般福祉
    childSupport: 35_213n,   // 少子化対策費 3兆5,213億円（+4.1%、児童手当拡充）
    employment: 458n,        // 雇用労災対策費 458億円（+4.1%）
    disability: 23_400n,     // 障害福祉サービス費（生活扶助等社会福祉費の一部）
    total: 382_778n,         // 38兆2,778億円（公式値）
  },
  {
    // 令和8年度（2026年度）推計
    // 合計は自然増5,500億円程度を見込んだ推計値
    // 注意: 概算要求段階・推計値であり確定値ではない
    fiscalYear: 2026,
    pension: 139_500n,       // 年金給付費推計 13兆9,500億円（年金スライド見込み）
    healthcare: 129_000n,    // 医療給付費推計 + 保健衛生対策費
    longTermCare: 37_800n,   // 介護給付費推計 3兆7,800億円
    welfare: 21_600n,        // 生活扶助等社会福祉費のうち生活保護・一般福祉推計
    childSupport: 36_500n,   // 少子化対策費推計 3兆6,500億円（加速化プラン継続）
    employment: 478n,        // 雇用労災対策費推計
    disability: 23_900n,     // 障害福祉サービス費推計
    total: 388_778n,         // 38兆8,778億円（推計値: 前年度+約6,000億円）
  },
];

// ============================================
// 社会保障制度データ
// ============================================

const SOCIAL_SECURITY_PROGRAM_DATA: SocialSecurityProgramData[] = [
  {
    name: "国民年金（基礎年金）",
    category: "PENSION",
    description:
      "日本国内に住所を有する20歳以上60歳未満の全ての人が加入する公的年金制度。老齢基礎年金、障害基礎年金、遺族基礎年金の3種類を給付。2024年度の満額支給額は年額816,000円（月額68,000円）。",
    eligibility: "日本国内に住所を有する20歳以上60歳未満の者",
    benefit: "老齢基礎年金: 満額年816,000円（2024年度）、保険料納付期間に応じて支給",
    budget: 126_000n,
    recipients: 3300,
    startYear: 1961,
    lastReformed: 2024,
    sourceUrl: "https://www.nenkin.go.jp/service/kokunen/",
    isActive: true,
  },
  {
    name: "厚生年金保険",
    category: "PENSION",
    description:
      "会社員・公務員等が加入する被用者年金制度。基礎年金に上乗せして報酬比例の年金を支給。保険料率は18.3%（労使折半）。2024年度のモデル年金額は夫婦で月額約23万円。",
    eligibility: "厚生年金適用事業所に勤務する70歳未満の被用者",
    benefit: "報酬比例年金: 加入期間と平均報酬に応じて計算。モデル年金月額約23万円（夫婦）",
    budget: 127_000n,
    recipients: 1600,
    startYear: 1944,
    lastReformed: 2024,
    sourceUrl: "https://www.nenkin.go.jp/service/kounen/",
    isActive: true,
  },
  {
    name: "国民健康保険",
    category: "HEALTHCARE",
    description:
      "自営業者、農林漁業者、退職者等が加入する医療保険制度。市区町村が保険者となり運営（2018年度から都道府県が財政運営の責任主体に）。医療費の原則3割を自己負担。",
    eligibility: "被用者保険・後期高齢者医療の対象とならない全住民",
    benefit: "医療費の7割を保険給付（義務教育就学前は8割）",
    budget: 32_000n,
    recipients: 2700,
    startYear: 1961,
    lastReformed: 2023,
    sourceUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/iryouhoken/",
    isActive: true,
  },
  {
    name: "後期高齢者医療制度",
    category: "HEALTHCARE",
    description:
      "75歳以上（一定の障害がある場合は65歳以上）の高齢者を対象とした医療保険制度。2008年に老人保健制度から移行。自己負担割合は原則1割（現役並み所得者は3割、2022年10月から一定所得以上は2割）。",
    eligibility: "75歳以上の者（65歳以上で一定の障害がある者を含む）",
    benefit: "医療費の9割を保険給付（現役並み所得者は7割、一定所得者は8割）",
    budget: 78_000n,
    recipients: 1900,
    startYear: 2008,
    lastReformed: 2024,
    sourceUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/iryouhoken/koukikourei/",
    isActive: true,
  },
  {
    name: "介護保険制度",
    category: "LONG_TERM_CARE",
    description:
      "40歳以上が保険料を負担し、要介護・要支援認定を受けた高齢者等に介護サービスを給付する社会保険制度。2000年に創設。第9期（2024-2026年度）の全国平均保険料は月額6,225円。",
    eligibility: "65歳以上の第1号被保険者、40-64歳の第2号被保険者",
    benefit: "要介護1〜5: 居宅・施設介護サービス。自己負担原則1割（一定所得以上2-3割）",
    budget: 37_000n,
    recipients: 690,
    startYear: 2000,
    lastReformed: 2024,
    sourceUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/hukushi_kaigo/kaigo_koureisha/gaiyo/",
    isActive: true,
  },
  {
    name: "生活保護制度",
    category: "WELFARE",
    description:
      "生活に困窮する者に対し、その困窮の程度に応じて必要な保護を行い、最低限度の生活を保障する制度。生活扶助、住宅扶助、医療扶助、教育扶助等8種類の扶助。2024年の被保護世帯は約164万世帯。",
    eligibility: "資産、能力等あらゆるものを活用してもなお生活に困窮する者",
    benefit: "生活扶助（単身高齢者: 約7.1万円/月）、住宅扶助、医療扶助等",
    budget: 38_000n,
    recipients: 200,
    startYear: 1950,
    lastReformed: 2023,
    sourceUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/hukushi_kaigo/seikatsuhogo/",
    isActive: true,
  },
  {
    name: "児童手当",
    category: "CHILD_SUPPORT",
    description:
      "子育て世帯に現金給付する制度。2024年10月に大幅拡充され、所得制限撤廃、高校生まで延長（0歳〜18歳）、第3子以降は月3万円に倍増。支給月も年6回（偶数月）に。",
    eligibility: "0歳から18歳までの子どもを養育する者（2024年10月から所得制限なし）",
    benefit: "0〜2歳: 月15,000円、3歳〜高校生: 月10,000円、第3子以降: 月30,000円",
    budget: 23_000n,
    recipients: 1600,
    startYear: 1972,
    lastReformed: 2024,
    sourceUrl: "https://www.cfa.go.jp/policies/kokoseido/jidouteate/",
    isActive: true,
  },
  {
    name: "児童扶養手当",
    category: "CHILD_SUPPORT",
    description:
      "ひとり親家庭の生活の安定と自立の促進を目的とした手当。全部支給は月額45,500円（2024年度）。所得に応じて一部支給。受給者約87万人。",
    eligibility: "18歳到達年度末までの子どもを養育するひとり親家庭等",
    benefit: "全部支給: 月45,500円（第2子加算10,750円、第3子以降6,450円）",
    budget: 4_000n,
    recipients: 87,
    startYear: 1962,
    lastReformed: 2024,
    sourceUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000137038.html",
    isActive: true,
  },
  {
    name: "雇用保険",
    category: "EMPLOYMENT",
    description:
      "労働者の生活および雇用の安定と就職の促進を目的とした社会保険制度。失業等給付、育児休業給付、教育訓練給付等を支給。保険料率は1.55%（2024年度、労使合計）。",
    eligibility: "雇用保険適用事業所に週20時間以上勤務する労働者",
    benefit: "基本手当: 離職前賃金の50-80%（90-330日間）、育児休業給付金等",
    budget: 2_800n,
    recipients: null,
    startYear: 1947,
    lastReformed: 2024,
    sourceUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000144972.html",
    isActive: true,
  },
  {
    name: "労災保険",
    category: "EMPLOYMENT",
    description:
      "労働者の業務上の事由または通勤による負傷・疾病・障害・死亡に対して保険給付を行う制度。保険料は全額事業主負担。フリーランス・ギグワーカーへの適用拡大が議論中。",
    eligibility: "全ての労働者（パート・アルバイト含む）。特別加入制度あり",
    benefit: "療養補償給付、休業補償給付（賃金の80%）、障害補償給付、遺族補償給付等",
    budget: null,
    recipients: null,
    startYear: 1947,
    lastReformed: 2023,
    sourceUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/roudoukijun/rousai/",
    isActive: true,
  },
  {
    name: "障害者総合支援制度",
    category: "DISABILITY",
    description:
      "障害者（身体・知的・精神）および難病患者に対して、日常生活・社会生活の支援を総合的に行う制度。居宅介護、生活介護、就労支援、グループホーム等のサービスを提供。",
    eligibility: "身体障害者、知的障害者、精神障害者、難病患者等",
    benefit: "居宅介護、生活介護、就労継続支援（A型・B型）、グループホーム、短期入所等",
    budget: 19_000n,
    recipients: 140,
    startYear: 2013,
    lastReformed: 2024,
    sourceUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/hukushi_kaigo/shougaishahukushi/",
    isActive: true,
  },
  {
    name: "特別児童扶養手当",
    category: "DISABILITY",
    description:
      "精神または身体に障害を有する20歳未満の児童を養育する者に対して支給される手当。1級（重度）月55,350円、2級（中度）月36,860円（2024年度）。",
    eligibility: "精神・身体に障害を有する20歳未満の児童を養育する者",
    benefit: "1級: 月55,350円、2級: 月36,860円（2024年度）",
    budget: 2_200n,
    recipients: 27,
    startYear: 1964,
    lastReformed: 2024,
    sourceUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/hukushi_kaigo/shougaishahukushi/jidou/",
    isActive: true,
  },
  {
    name: "出産育児一時金",
    category: "CHILD_SUPPORT",
    description:
      "出産に要する費用の負担軽減のため、健康保険から支給される一時金。2023年4月から42万円から50万円に増額。正常分娩の保険適用が2026年度から検討中。",
    eligibility: "健康保険・国民健康保険の被保険者または被扶養者で出産した者",
    benefit: "1児につき50万円（産科医療補償制度加算対象外の場合は48.8万円）",
    budget: 4_500n,
    recipients: 77,
    startYear: 1994,
    lastReformed: 2023,
    sourceUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/iryouhoken/shussan/",
    isActive: true,
  },
  {
    name: "育児休業給付金",
    category: "CHILD_SUPPORT",
    description:
      "雇用保険の被保険者が育児休業を取得した場合に支給される給付金。2025年度から「出生後休業支援給付」が新設され、休業開始後28日間は実質手取り10割を保障。",
    eligibility: "1歳未満の子を養育するため育児休業を取得した雇用保険被保険者",
    benefit: "休業開始から180日間: 賃金の67%、181日目以降: 50%（2025年〜28日間は実質100%）",
    budget: 7_500n,
    recipients: 50,
    startYear: 1995,
    lastReformed: 2025,
    sourceUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000135090_00001.html",
    isActive: true,
  },
  {
    name: "高額療養費制度",
    category: "HEALTHCARE",
    description:
      "医療費の自己負担額が高額になった場合、一定の上限額を超えた分を払い戻す制度。所得区分により月額上限は約35,400円〜約252,600円。2025年に上限額引き上げが検討されている。",
    eligibility: "全ての健康保険加入者",
    benefit: "70歳未満・一般所得: 月額上限約80,100円+（医療費-267,000円）x1%",
    budget: 25_000n,
    recipients: null,
    startYear: 1973,
    lastReformed: 2024,
    sourceUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/iryouhoken/juuyou/kougakuiryou/",
    isActive: true,
  },
  {
    name: "協会けんぽ（全国健康保険協会）",
    category: "HEALTHCARE",
    description:
      "中小企業の従業員とその家族が加入する健康保険制度。全国健康保険協会が保険者として運営。加入者数は約4,000万人（被保険者+被扶養者）で、日本最大の医療保険制度。平均保険料率は10.0%（2024年度、労使折半）。都道府県ごとに保険料率が異なる。",
    eligibility: "協会けんぽ適用事業所に勤務する被保険者およびその被扶養者",
    benefit: "医療費の7割を保険給付（義務教育就学前は8割）、傷病手当金、出産手当金等",
    budget: 110_000n,
    recipients: 4000,
    startYear: 2008,
    lastReformed: 2024,
    sourceUrl: "https://www.kyoukaikenpo.or.jp/",
    isActive: true,
  },
  {
    name: "子ども・子育て支援新制度",
    category: "CHILD_SUPPORT",
    description:
      "2015年施行の子ども・子育て支援法に基づく制度。認定こども園・幼稚園・保育所を通じた共通の給付、地域の子育て支援の充実を推進。2019年10月から幼児教育・保育の無償化（3-5歳全世帯、0-2歳住民税非課税世帯）を実施。",
    eligibility: "就学前の子どもを持つ全世帯（無償化は3-5歳全世帯、0-2歳住民税非課税世帯）",
    benefit: "施設型給付（認定こども園・幼稚園・保育所）、地域型保育給付、地域子育て支援事業",
    budget: 15_000n,
    recipients: 270,
    startYear: 2015,
    lastReformed: 2024,
    sourceUrl: "https://www8.cao.go.jp/shoushi/shinseido/",
    isActive: true,
  },
  {
    name: "こども誰でも通園制度",
    category: "CHILD_SUPPORT",
    description:
      "2024年度から全国の自治体で本格実施が始まった新制度。親の就労要件にかかわらず、0〜2歳の未就園児が保育所等を定期的に利用できる制度。こども家庭庁が所管。月10時間を上限として利用可能。",
    eligibility: "0歳6か月〜2歳の未就園児（親の就労状況を問わない）",
    benefit: "月10時間を上限に保育所等を利用可能。利用料は自治体により異なる",
    budget: 1_000n,
    recipients: null,
    startYear: 2024,
    lastReformed: 2024,
    sourceUrl: "https://www.cfa.go.jp/policies/kodomo-tsuuen/",
    isActive: true,
  },
  {
    name: "障害者雇用促進制度",
    category: "DISABILITY",
    description:
      "障害者の雇用の促進等に関する法律に基づく制度。民間企業に対して法定雇用率（2024年4月から2.5%、2026年7月から2.7%）の達成を義務づけ。未達成企業は納付金を支払い、超過達成企業は調整金を受け取る。",
    eligibility: "身体障害者、知的障害者、精神障害者（精神障害者保健福祉手帳所持者）",
    benefit: "雇用義務制度、障害者雇用納付金・調整金、各種助成金、ジョブコーチ支援等",
    budget: 3_500n,
    recipients: 64,
    startYear: 1960,
    lastReformed: 2024,
    sourceUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/shougaishakoyou/",
    isActive: true,
  },
  {
    name: "特別障害者手当",
    category: "DISABILITY",
    description:
      "精神又は身体に著しく重度の障害を有する在宅の20歳以上の者に支給される手当。常時特別の介護を必要とする状態にある重度障害者の福祉の向上を図る。月額28,840円（2024年度）。",
    eligibility: "精神・身体に著しく重度の障害があり、日常生活で常時特別の介護を必要とする20歳以上の在宅者",
    benefit: "月額28,840円（2024年度）。所得制限あり",
    budget: 500n,
    recipients: 14,
    startYear: 1986,
    lastReformed: 2024,
    sourceUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/hukushi_kaigo/shougaishahukushi/jidou/",
    isActive: true,
  },
  {
    name: "出生後休業支援給付",
    category: "CHILD_SUPPORT",
    description:
      "2025年4月から新設された給付制度。子の出生直後の一定期間に夫婦ともに育児休業を取得した場合、休業開始から28日間の給付率を13%上乗せし、実質的に手取り10割を保障。男性の育児休業取得促進が目的。",
    eligibility: "子の出生後8週間以内に14日以上の育児休業を取得した雇用保険被保険者（配偶者も同時取得が条件）",
    benefit: "育児休業給付金（67%）+出生後休業支援給付（13%）= 実質手取り100%保障（28日間）",
    budget: 2_000n,
    recipients: null,
    startYear: 2025,
    lastReformed: 2025,
    sourceUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000130583.html",
    isActive: true,
  },
  {
    name: "医療費適正化計画",
    category: "HEALTHCARE",
    description:
      "高齢者の医療の確保に関する法律に基づき、国と都道府県が策定する医療費適正化計画。第4期（2024-2029年度）では特定健診・保健指導の実施率向上、後発医薬品（ジェネリック）の使用促進、医療DXの推進等に取り組む。",
    eligibility: "全国民（特に40歳以上の特定健診対象者）",
    benefit: "特定健診・特定保健指導、後発医薬品の使用促進、医療費の見える化",
    budget: 2_500n,
    recipients: null,
    startYear: 2008,
    lastReformed: 2024,
    sourceUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/iryouhoken/database/iryomap/",
    isActive: true,
  },
  {
    name: "地域包括ケアシステム",
    category: "LONG_TERM_CARE",
    description:
      "高齢者が住み慣れた地域で自分らしい暮らしを最期まで続けられるよう、住まい・医療・介護・予防・生活支援を一体的に提供する体制。2025年を目途に構築が進められてきた。地域包括支援センターが中核拠点。全国約5,400か所設置。",
    eligibility: "65歳以上の高齢者（二次予防事業対象者含む）",
    benefit: "地域包括支援センターによる相談支援、介護予防、在宅医療・介護連携、生活支援体制整備",
    budget: 5_000n,
    recipients: null,
    startYear: 2006,
    lastReformed: 2024,
    sourceUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/hukushi_kaigo/kaigo_koureisha/chiiki-houkatsu/",
    isActive: true,
  },
  {
    name: "国民年金基金",
    category: "PENSION",
    description:
      "自営業者等の国民年金第1号被保険者が、老齢基礎年金に上乗せして年金を受け取るための任意加入制度。2019年4月に全国国民年金基金に統合。掛金は月額最大68,000円で全額社会保険料控除の対象。",
    eligibility: "国民年金第1号被保険者（20歳以上60歳未満の自営業者等）、任意加入被保険者",
    benefit: "加入口数・期間に応じた終身年金または確定年金（上乗せ部分）",
    budget: null,
    recipients: 36,
    startYear: 1991,
    lastReformed: 2019,
    sourceUrl: "https://www.npfa.or.jp/",
    isActive: true,
  },
  {
    name: "障害者総合支援制度（自立支援給付）",
    category: "DISABILITY",
    description:
      "障害者総合支援法に基づく障害福祉サービスの給付制度。居宅介護、重度訪問介護、同行援護、行動援護、生活介護、就労継続支援（A型・B型）、就労移行支援、共同生活援助（グループホーム）等のサービスを提供。2024年4月の法改正で就労選択支援が新設。",
    eligibility: "身体障害者、知的障害者、精神障害者、難病患者等（障害支援区分の認定が必要）",
    benefit: "居宅介護、生活介護、就労支援、グループホーム等の障害福祉サービス。利用者負担は原則1割（所得に応じた上限あり）",
    budget: 33_000n,
    recipients: 150,
    startYear: 2013,
    lastReformed: 2024,
    sourceUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/hukushi_kaigo/shougaishahukushi/",
    isActive: true,
  },
  {
    name: "特別児童扶養手当",
    category: "CHILD_SUPPORT",
    description:
      "精神又は身体に障害を有する20歳未満の児童を監護する父母等に支給される手当。1級（重度）月額55,350円、2級（中度）月額36,860円（2024年度）。",
    eligibility: "精神又は身体に障害を有する20歳未満の児童を監護する父母等",
    benefit: "1級: 月額55,350円、2級: 月額36,860円（2024年度）。所得制限あり",
    budget: 1_600n,
    recipients: 27,
    startYear: 1964,
    lastReformed: 2024,
    sourceUrl: "https://www.mhlw.go.jp/bunya/shougaihoken/jidou/huyou.html",
    isActive: true,
  },
  {
    name: "労災保険（労働者災害補償保険）",
    category: "EMPLOYMENT",
    description:
      "業務上の事由又は通勤により労働者が負傷、疾病、障害、死亡した場合に保険給付を行う制度。保険料は全額事業主負担。療養補償給付、休業補償給付、障害補償給付、遺族補償給付等を支給。特別加入制度により中小事業主、一人親方等も加入可能。",
    eligibility: "全ての労働者（パート・アルバイト含む）。特別加入制度あり",
    benefit: "療養補償給付（全額）、休業補償給付（給付基礎日額の80%）、障害補償給付、遺族補償給付等",
    budget: 8_500n,
    recipients: 68,
    startYear: 1947,
    lastReformed: 2024,
    sourceUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/roudoukijun/rousai/",
    isActive: true,
  },
  {
    name: "求職者支援制度",
    category: "EMPLOYMENT",
    description:
      "雇用保険を受給できない求職者に対して、職業訓練（求職者支援訓練）を実施し、訓練期間中の生活を支援するため月10万円の職業訓練受講給付金を支給する制度。2011年10月に創設。",
    eligibility: "雇用保険の受給資格がない求職者（収入要件・資産要件等あり）",
    benefit: "職業訓練受講給付金: 月額10万円 + 通所手当 + 寄宿手当",
    budget: 600n,
    recipients: 3,
    startYear: 2011,
    lastReformed: 2023,
    sourceUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/kyushokusha_shien/",
    isActive: true,
  },
  {
    name: "後期高齢者医療制度",
    category: "HEALTHCARE",
    description:
      "75歳以上（一定の障害がある65歳以上含む）の高齢者を対象とした医療保険制度。2008年4月に老人保健制度から移行。都道府県単位の広域連合が運営。窓口負担は原則1割（現役並み所得者は3割、2022年10月から一定以上の所得がある者は2割）。",
    eligibility: "75歳以上の全ての者（65歳以上の一定の障害がある者含む）",
    benefit: "医療費の自己負担1割（一定以上所得者2割、現役並み所得者3割）",
    budget: 80_000n,
    recipients: 1890,
    startYear: 2008,
    lastReformed: 2024,
    sourceUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/iryouhoken/koukikourei/",
    isActive: true,
  },
  {
    name: "国民健康保険",
    category: "HEALTHCARE",
    description:
      "自営業者、農業者、無職者等が加入する公的医療保険。2018年度から都道府県が財政運営の責任主体に。市町村が保険料の賦課・徴収、資格管理等を実施。約2,700万人が加入。",
    eligibility: "会社の健康保険や後期高齢者医療制度に加入していない全ての住民",
    benefit: "医療費の7割を保険給付（義務教育就学前は8割）、高額療養費、出産育児一時金等",
    budget: 95_000n,
    recipients: 2700,
    startYear: 1958,
    lastReformed: 2024,
    sourceUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/iryouhoken/koukikourei/",
    isActive: true,
  },
  {
    name: "障害年金",
    category: "PENSION",
    description:
      "病気やけがによって生活や仕事などが制限されるようになった場合に支給される年金。障害基礎年金（1級: 年額1,020,000円、2級: 年額816,000円、2024年度）と障害厚生年金（報酬比例）がある。",
    eligibility: "国民年金・厚生年金の被保険者期間中に初診日がある者（保険料納付要件あり）",
    benefit: "障害基礎年金1級: 年額1,020,000円、2級: 年額816,000円（2024年度）+ 障害厚生年金（報酬比例）",
    budget: 20_000n,
    recipients: 220,
    startYear: 1961,
    lastReformed: 2024,
    sourceUrl: "https://www.nenkin.go.jp/service/jukyu/shougainenkin/",
    isActive: true,
  },
  {
    name: "遺族年金",
    category: "PENSION",
    description:
      "国民年金・厚生年金の被保険者（または被保険者であった者）が亡くなった時に、遺族に支給される年金。遺族基礎年金（子のある配偶者または子に支給）と遺族厚生年金（報酬比例）がある。",
    eligibility: "死亡した被保険者によって生計を維持されていた遺族（配偶者、子、父母、孫、祖父母）",
    benefit: "遺族基礎年金: 年額816,000円+子の加算（2024年度）、遺族厚生年金: 報酬比例の3/4",
    budget: 68_000n,
    recipients: 620,
    startYear: 1961,
    lastReformed: 2024,
    sourceUrl: "https://www.nenkin.go.jp/service/jukyu/izokunenkin/",
    isActive: true,
  },
  {
    name: "特定健康診査・特定保健指導（メタボ健診）",
    category: "HEALTHCARE",
    description:
      "40歳から74歳までの公的医療保険加入者を対象とした健康診査。メタボリックシンドローム（内臓脂肪症候群）に着目し、生活習慣病の予防を目的とする。2008年度から実施。実施率は特定健診58.1%、特定保健指導26.5%（2022年度）。",
    eligibility: "40歳以上74歳以下の公的医療保険加入者（被保険者・被扶養者）",
    benefit: "年1回の健康診査（無料〜少額の自己負担）、リスクに応じた保健指導（動機付け支援・積極的支援）",
    budget: 3_000n,
    recipients: 3100,
    startYear: 2008,
    lastReformed: 2024,
    sourceUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/seikatsu/",
    isActive: true,
  },
  {
    name: "介護予防・日常生活支援総合事業",
    category: "LONG_TERM_CARE",
    description:
      "2015年の介護保険法改正により創設された事業。要支援1・2の者及び基本チェックリスト該当者を対象に、介護予防・生活支援サービスを市町村が主体となって実施。従来の予防給付の一部を移行。",
    eligibility: "65歳以上の全ての高齢者（介護予防事業）、要支援1・2及び基本チェックリスト該当者（サービス事業）",
    benefit: "訪問型サービス、通所型サービス、生活支援サービス、一般介護予防事業",
    budget: 7_000n,
    recipients: null,
    startYear: 2015,
    lastReformed: 2024,
    sourceUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000192309.html",
    isActive: true,
  },
  {
    name: "母子父子寡婦福祉資金貸付",
    category: "CHILD_SUPPORT",
    description:
      "母子家庭・父子家庭・寡婦の経済的自立と生活意欲の助長を図るため、各種資金を無利子又は低利で貸し付ける制度。事業開始資金、就学資金、技能習得資金、就職支度資金等12種類の貸付金がある。",
    eligibility: "母子家庭の母、父子家庭の父、寡婦（配偶者のない女子でかつて母子家庭の母であった者）等",
    benefit: "無利子又は年1.0%の低利貸付。就学資金（月額最大96,000円）、事業開始資金（最大326万円）等",
    budget: 300n,
    recipients: 5,
    startYear: 1952,
    lastReformed: 2021,
    sourceUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000062986.html",
    isActive: true,
  },
  {
    name: "児童扶養手当",
    category: "CHILD_SUPPORT",
    description:
      "ひとり親家庭等の生活の安定と自立の促進を図るため、児童を監護する母又は父等に支給される手当。2024年11月分から第3子以降の加算額が大幅に引き上げられた。全額支給: 月額45,500円（2024年度）。",
    eligibility: "18歳に達する日以降の最初の3月31日までの児童を監護する母又は父等（所得制限あり）",
    benefit: "全額支給: 月額45,500円、第2子加算: 10,750円、第3子以降加算: 6,450円（2024年度）",
    budget: 4_000n,
    recipients: 87,
    startYear: 1962,
    lastReformed: 2024,
    sourceUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000137801.html",
    isActive: true,
  },
  {
    name: "児童手当",
    category: "CHILD_SUPPORT",
    description:
      "子ども・子育て支援の一環として、中学校卒業までの児童を養育している者に支給される手当。2024年10月分から大幅拡充され、支給対象が高校生年代まで拡大、所得制限が撤廃、第3子以降の支給額が月3万円に引上げ。",
    eligibility: "18歳に達する日以降の最初の3月31日までの児童を養育する者（2024年10月〜所得制限なし）",
    benefit: "3歳未満: 月15,000円、3歳〜高校生: 月10,000円、第3子以降: 月30,000円（2024年10月〜）",
    budget: 28_000n,
    recipients: 1600,
    startYear: 1972,
    lastReformed: 2024,
    sourceUrl: "https://www.cfa.go.jp/policies/kokoseido/jidouteate/",
    isActive: true,
  },
  {
    name: "生活困窮者自立支援制度",
    category: "WELFARE",
    description:
      "生活保護に至る前の段階にある生活困窮者に対し、自立に向けた包括的な支援を行う制度。2015年4月に施行。自立相談支援事業（必須）、住居確保給付金（必須）、就労準備支援事業、家計改善支援事業等を実施。",
    eligibility: "現に経済的に困窮し、最低限度の生活を維持することができなくなるおそれのある者",
    benefit: "自立相談支援、住居確保給付金（家賃相当額を最長9か月支給）、就労準備支援、家計改善支援等",
    budget: 500n,
    recipients: 90,
    startYear: 2015,
    lastReformed: 2024,
    sourceUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000059425.html",
    isActive: true,
  },
  {
    name: "年金生活者支援給付金",
    category: "PENSION",
    description:
      "消費税率引上げ分を活用し、年金を含めても所得が低い年金受給者の生活を支援するため、年金に上乗せして支給する給付金。2019年10月の消費税率10%引上げと同時に開始。",
    eligibility: "65歳以上の老齢基礎年金受給者で前年の所得が一定以下の者等",
    benefit: "老齢年金生活者支援給付金: 月額5,310円（2024年度、保険料納付期間に応じて算定）",
    budget: 5_600n,
    recipients: 870,
    startYear: 2019,
    lastReformed: 2024,
    sourceUrl: "https://www.mhlw.go.jp/stf/nenkinkyuufukin/index.html",
    isActive: true,
  },
];

// ============================================
// 都道府県別社会保障データ（2024年度）
// ============================================

/**
 * 都道府県別の福祉統計データ
 *
 * 出典:
 *   - 厚生労働省「国民医療費の概況」（2022年度データを基に推計）
 *   - 厚生労働省「介護保険事業状況報告」
 *   - 厚生労働省「厚生年金保険・国民年金事業の概況」
 *   - 一人あたり年金受給額は地域差あり（都市部は報酬比例部分が高い傾向）
 *   - 一人あたり医療費は高齢化率と相関
 *   - 要介護認定率は人口構成と地域の介護施設整備状況に依存
 */
const PREFECTURE_WELFARE_DATA: PrefectureWelfareData[] = [
  { prefectureName: "北海道", stats: [
    { category: "PENSION", value: 183.2, unit: "万円/年", indicator: "一人あたり年金受給額" },
    { category: "HEALTHCARE", value: 38.5, unit: "万円/年", indicator: "一人あたり医療費" },
    { category: "LONG_TERM_CARE", value: 20.1, unit: "%", indicator: "要介護認定率" },
  ]},
  { prefectureName: "青森県", stats: [
    { category: "PENSION", value: 168.5, unit: "万円/年", indicator: "一人あたり年金受給額" },
    { category: "HEALTHCARE", value: 39.2, unit: "万円/年", indicator: "一人あたり医療費" },
    { category: "LONG_TERM_CARE", value: 21.5, unit: "%", indicator: "要介護認定率" },
  ]},
  { prefectureName: "岩手県", stats: [
    { category: "PENSION", value: 170.8, unit: "万円/年", indicator: "一人あたり年金受給額" },
    { category: "HEALTHCARE", value: 37.8, unit: "万円/年", indicator: "一人あたり医療費" },
    { category: "LONG_TERM_CARE", value: 20.8, unit: "%", indicator: "要介護認定率" },
  ]},
  { prefectureName: "宮城県", stats: [
    { category: "PENSION", value: 182.5, unit: "万円/年", indicator: "一人あたり年金受給額" },
    { category: "HEALTHCARE", value: 35.2, unit: "万円/年", indicator: "一人あたり医療費" },
    { category: "LONG_TERM_CARE", value: 18.9, unit: "%", indicator: "要介護認定率" },
  ]},
  { prefectureName: "秋田県", stats: [
    { category: "PENSION", value: 167.2, unit: "万円/年", indicator: "一人あたり年金受給額" },
    { category: "HEALTHCARE", value: 40.5, unit: "万円/年", indicator: "一人あたり医療費" },
    { category: "LONG_TERM_CARE", value: 22.8, unit: "%", indicator: "要介護認定率" },
  ]},
  { prefectureName: "山形県", stats: [
    { category: "PENSION", value: 172.0, unit: "万円/年", indicator: "一人あたり年金受給額" },
    { category: "HEALTHCARE", value: 36.8, unit: "万円/年", indicator: "一人あたり医療費" },
    { category: "LONG_TERM_CARE", value: 20.2, unit: "%", indicator: "要介護認定率" },
  ]},
  { prefectureName: "福島県", stats: [
    { category: "PENSION", value: 176.8, unit: "万円/年", indicator: "一人あたり年金受給額" },
    { category: "HEALTHCARE", value: 37.5, unit: "万円/年", indicator: "一人あたり医療費" },
    { category: "LONG_TERM_CARE", value: 19.5, unit: "%", indicator: "要介護認定率" },
  ]},
  { prefectureName: "茨城県", stats: [
    { category: "PENSION", value: 186.5, unit: "万円/年", indicator: "一人あたり年金受給額" },
    { category: "HEALTHCARE", value: 33.8, unit: "万円/年", indicator: "一人あたり医療費" },
    { category: "LONG_TERM_CARE", value: 17.5, unit: "%", indicator: "要介護認定率" },
  ]},
  { prefectureName: "栃木県", stats: [
    { category: "PENSION", value: 188.2, unit: "万円/年", indicator: "一人あたり年金受給額" },
    { category: "HEALTHCARE", value: 33.5, unit: "万円/年", indicator: "一人あたり医療費" },
    { category: "LONG_TERM_CARE", value: 17.2, unit: "%", indicator: "要介護認定率" },
  ]},
  { prefectureName: "群馬県", stats: [
    { category: "PENSION", value: 185.0, unit: "万円/年", indicator: "一人あたり年金受給額" },
    { category: "HEALTHCARE", value: 34.0, unit: "万円/年", indicator: "一人あたり医療費" },
    { category: "LONG_TERM_CARE", value: 17.8, unit: "%", indicator: "要介護認定率" },
  ]},
  { prefectureName: "埼玉県", stats: [
    { category: "PENSION", value: 195.8, unit: "万円/年", indicator: "一人あたり年金受給額" },
    { category: "HEALTHCARE", value: 31.5, unit: "万円/年", indicator: "一人あたり医療費" },
    { category: "LONG_TERM_CARE", value: 15.8, unit: "%", indicator: "要介護認定率" },
  ]},
  { prefectureName: "千葉県", stats: [
    { category: "PENSION", value: 196.2, unit: "万円/年", indicator: "一人あたり年金受給額" },
    { category: "HEALTHCARE", value: 31.8, unit: "万円/年", indicator: "一人あたり医療費" },
    { category: "LONG_TERM_CARE", value: 16.0, unit: "%", indicator: "要介護認定率" },
  ]},
  { prefectureName: "東京都", stats: [
    { category: "PENSION", value: 210.5, unit: "万円/年", indicator: "一人あたり年金受給額" },
    { category: "HEALTHCARE", value: 33.2, unit: "万円/年", indicator: "一人あたり医療費" },
    { category: "LONG_TERM_CARE", value: 15.2, unit: "%", indicator: "要介護認定率" },
  ]},
  { prefectureName: "神奈川県", stats: [
    { category: "PENSION", value: 202.0, unit: "万円/年", indicator: "一人あたり年金受給額" },
    { category: "HEALTHCARE", value: 32.0, unit: "万円/年", indicator: "一人あたり医療費" },
    { category: "LONG_TERM_CARE", value: 15.5, unit: "%", indicator: "要介護認定率" },
  ]},
  { prefectureName: "新潟県", stats: [
    { category: "PENSION", value: 178.5, unit: "万円/年", indicator: "一人あたり年金受給額" },
    { category: "HEALTHCARE", value: 35.5, unit: "万円/年", indicator: "一人あたり医療費" },
    { category: "LONG_TERM_CARE", value: 19.2, unit: "%", indicator: "要介護認定率" },
  ]},
  { prefectureName: "富山県", stats: [
    { category: "PENSION", value: 185.5, unit: "万円/年", indicator: "一人あたり年金受給額" },
    { category: "HEALTHCARE", value: 34.5, unit: "万円/年", indicator: "一人あたり医療費" },
    { category: "LONG_TERM_CARE", value: 18.5, unit: "%", indicator: "要介護認定率" },
  ]},
  { prefectureName: "石川県", stats: [
    { category: "PENSION", value: 184.0, unit: "万円/年", indicator: "一人あたり年金受給額" },
    { category: "HEALTHCARE", value: 35.0, unit: "万円/年", indicator: "一人あたり医療費" },
    { category: "LONG_TERM_CARE", value: 18.8, unit: "%", indicator: "要介護認定率" },
  ]},
  { prefectureName: "福井県", stats: [
    { category: "PENSION", value: 180.5, unit: "万円/年", indicator: "一人あたり年金受給額" },
    { category: "HEALTHCARE", value: 35.2, unit: "万円/年", indicator: "一人あたり医療費" },
    { category: "LONG_TERM_CARE", value: 19.0, unit: "%", indicator: "要介護認定率" },
  ]},
  { prefectureName: "山梨県", stats: [
    { category: "PENSION", value: 182.0, unit: "万円/年", indicator: "一人あたり年金受給額" },
    { category: "HEALTHCARE", value: 34.2, unit: "万円/年", indicator: "一人あたり医療費" },
    { category: "LONG_TERM_CARE", value: 18.0, unit: "%", indicator: "要介護認定率" },
  ]},
  { prefectureName: "長野県", stats: [
    { category: "PENSION", value: 179.5, unit: "万円/年", indicator: "一人あたり年金受給額" },
    { category: "HEALTHCARE", value: 32.5, unit: "万円/年", indicator: "一人あたり医療費" },
    { category: "LONG_TERM_CARE", value: 18.2, unit: "%", indicator: "要介護認定率" },
  ]},
  { prefectureName: "岐阜県", stats: [
    { category: "PENSION", value: 186.0, unit: "万円/年", indicator: "一人あたり年金受給額" },
    { category: "HEALTHCARE", value: 33.5, unit: "万円/年", indicator: "一人あたり医療費" },
    { category: "LONG_TERM_CARE", value: 17.8, unit: "%", indicator: "要介護認定率" },
  ]},
  { prefectureName: "静岡県", stats: [
    { category: "PENSION", value: 190.0, unit: "万円/年", indicator: "一人あたり年金受給額" },
    { category: "HEALTHCARE", value: 32.8, unit: "万円/年", indicator: "一人あたり医療費" },
    { category: "LONG_TERM_CARE", value: 17.0, unit: "%", indicator: "要介護認定率" },
  ]},
  { prefectureName: "愛知県", stats: [
    { category: "PENSION", value: 198.0, unit: "万円/年", indicator: "一人あたり年金受給額" },
    { category: "HEALTHCARE", value: 31.2, unit: "万円/年", indicator: "一人あたり医療費" },
    { category: "LONG_TERM_CARE", value: 15.8, unit: "%", indicator: "要介護認定率" },
  ]},
  { prefectureName: "三重県", stats: [
    { category: "PENSION", value: 187.5, unit: "万円/年", indicator: "一人あたり年金受給額" },
    { category: "HEALTHCARE", value: 34.0, unit: "万円/年", indicator: "一人あたり医療費" },
    { category: "LONG_TERM_CARE", value: 17.5, unit: "%", indicator: "要介護認定率" },
  ]},
  { prefectureName: "滋賀県", stats: [
    { category: "PENSION", value: 190.5, unit: "万円/年", indicator: "一人あたり年金受給額" },
    { category: "HEALTHCARE", value: 32.0, unit: "万円/年", indicator: "一人あたり医療費" },
    { category: "LONG_TERM_CARE", value: 16.5, unit: "%", indicator: "要介護認定率" },
  ]},
  { prefectureName: "京都府", stats: [
    { category: "PENSION", value: 192.0, unit: "万円/年", indicator: "一人あたり年金受給額" },
    { category: "HEALTHCARE", value: 35.5, unit: "万円/年", indicator: "一人あたり医療費" },
    { category: "LONG_TERM_CARE", value: 18.5, unit: "%", indicator: "要介護認定率" },
  ]},
  { prefectureName: "大阪府", stats: [
    { category: "PENSION", value: 193.5, unit: "万円/年", indicator: "一人あたり年金受給額" },
    { category: "HEALTHCARE", value: 37.8, unit: "万円/年", indicator: "一人あたり医療費" },
    { category: "LONG_TERM_CARE", value: 19.8, unit: "%", indicator: "要介護認定率" },
  ]},
  { prefectureName: "兵庫県", stats: [
    { category: "PENSION", value: 192.5, unit: "万円/年", indicator: "一人あたり年金受給額" },
    { category: "HEALTHCARE", value: 35.0, unit: "万円/年", indicator: "一人あたり医療費" },
    { category: "LONG_TERM_CARE", value: 18.2, unit: "%", indicator: "要介護認定率" },
  ]},
  { prefectureName: "奈良県", stats: [
    { category: "PENSION", value: 191.0, unit: "万円/年", indicator: "一人あたり年金受給額" },
    { category: "HEALTHCARE", value: 34.5, unit: "万円/年", indicator: "一人あたり医療費" },
    { category: "LONG_TERM_CARE", value: 18.8, unit: "%", indicator: "要介護認定率" },
  ]},
  { prefectureName: "和歌山県", stats: [
    { category: "PENSION", value: 178.0, unit: "万円/年", indicator: "一人あたり年金受給額" },
    { category: "HEALTHCARE", value: 38.0, unit: "万円/年", indicator: "一人あたり医療費" },
    { category: "LONG_TERM_CARE", value: 21.0, unit: "%", indicator: "要介護認定率" },
  ]},
  { prefectureName: "鳥取県", stats: [
    { category: "PENSION", value: 172.5, unit: "万円/年", indicator: "一人あたり年金受給額" },
    { category: "HEALTHCARE", value: 36.5, unit: "万円/年", indicator: "一人あたり医療費" },
    { category: "LONG_TERM_CARE", value: 20.5, unit: "%", indicator: "要介護認定率" },
  ]},
  { prefectureName: "島根県", stats: [
    { category: "PENSION", value: 170.0, unit: "万円/年", indicator: "一人あたり年金受給額" },
    { category: "HEALTHCARE", value: 37.2, unit: "万円/年", indicator: "一人あたり医療費" },
    { category: "LONG_TERM_CARE", value: 21.5, unit: "%", indicator: "要介護認定率" },
  ]},
  { prefectureName: "岡山県", stats: [
    { category: "PENSION", value: 183.0, unit: "万円/年", indicator: "一人あたり年金受給額" },
    { category: "HEALTHCARE", value: 35.8, unit: "万円/年", indicator: "一人あたり医療費" },
    { category: "LONG_TERM_CARE", value: 19.0, unit: "%", indicator: "要介護認定率" },
  ]},
  { prefectureName: "広島県", stats: [
    { category: "PENSION", value: 187.0, unit: "万円/年", indicator: "一人あたり年金受給額" },
    { category: "HEALTHCARE", value: 36.0, unit: "万円/年", indicator: "一人あたり医療費" },
    { category: "LONG_TERM_CARE", value: 18.5, unit: "%", indicator: "要介護認定率" },
  ]},
  { prefectureName: "山口県", stats: [
    { category: "PENSION", value: 181.5, unit: "万円/年", indicator: "一人あたり年金受給額" },
    { category: "HEALTHCARE", value: 38.2, unit: "万円/年", indicator: "一人あたり医療費" },
    { category: "LONG_TERM_CARE", value: 20.5, unit: "%", indicator: "要介護認定率" },
  ]},
  { prefectureName: "徳島県", stats: [
    { category: "PENSION", value: 177.0, unit: "万円/年", indicator: "一人あたり年金受給額" },
    { category: "HEALTHCARE", value: 39.5, unit: "万円/年", indicator: "一人あたり医療費" },
    { category: "LONG_TERM_CARE", value: 21.2, unit: "%", indicator: "要介護認定率" },
  ]},
  { prefectureName: "香川県", stats: [
    { category: "PENSION", value: 180.0, unit: "万円/年", indicator: "一人あたり年金受給額" },
    { category: "HEALTHCARE", value: 37.0, unit: "万円/年", indicator: "一人あたり医療費" },
    { category: "LONG_TERM_CARE", value: 19.5, unit: "%", indicator: "要介護認定率" },
  ]},
  { prefectureName: "愛媛県", stats: [
    { category: "PENSION", value: 175.5, unit: "万円/年", indicator: "一人あたり年金受給額" },
    { category: "HEALTHCARE", value: 38.0, unit: "万円/年", indicator: "一人あたり医療費" },
    { category: "LONG_TERM_CARE", value: 20.8, unit: "%", indicator: "要介護認定率" },
  ]},
  { prefectureName: "高知県", stats: [
    { category: "PENSION", value: 171.0, unit: "万円/年", indicator: "一人あたり年金受給額" },
    { category: "HEALTHCARE", value: 41.0, unit: "万円/年", indicator: "一人あたり医療費" },
    { category: "LONG_TERM_CARE", value: 22.5, unit: "%", indicator: "要介護認定率" },
  ]},
  { prefectureName: "福岡県", stats: [
    { category: "PENSION", value: 184.0, unit: "万円/年", indicator: "一人あたり年金受給額" },
    { category: "HEALTHCARE", value: 38.5, unit: "万円/年", indicator: "一人あたり医療費" },
    { category: "LONG_TERM_CARE", value: 19.5, unit: "%", indicator: "要介護認定率" },
  ]},
  { prefectureName: "佐賀県", stats: [
    { category: "PENSION", value: 174.0, unit: "万円/年", indicator: "一人あたり年金受給額" },
    { category: "HEALTHCARE", value: 39.0, unit: "万円/年", indicator: "一人あたり医療費" },
    { category: "LONG_TERM_CARE", value: 20.2, unit: "%", indicator: "要介護認定率" },
  ]},
  { prefectureName: "長崎県", stats: [
    { category: "PENSION", value: 173.5, unit: "万円/年", indicator: "一人あたり年金受給額" },
    { category: "HEALTHCARE", value: 40.0, unit: "万円/年", indicator: "一人あたり医療費" },
    { category: "LONG_TERM_CARE", value: 21.8, unit: "%", indicator: "要介護認定率" },
  ]},
  { prefectureName: "熊本県", stats: [
    { category: "PENSION", value: 174.5, unit: "万円/年", indicator: "一人あたり年金受給額" },
    { category: "HEALTHCARE", value: 39.5, unit: "万円/年", indicator: "一人あたり医療費" },
    { category: "LONG_TERM_CARE", value: 21.0, unit: "%", indicator: "要介護認定率" },
  ]},
  { prefectureName: "大分県", stats: [
    { category: "PENSION", value: 176.0, unit: "万円/年", indicator: "一人あたり年金受給額" },
    { category: "HEALTHCARE", value: 39.8, unit: "万円/年", indicator: "一人あたり医療費" },
    { category: "LONG_TERM_CARE", value: 21.2, unit: "%", indicator: "要介護認定率" },
  ]},
  { prefectureName: "宮崎県", stats: [
    { category: "PENSION", value: 170.5, unit: "万円/年", indicator: "一人あたり年金受給額" },
    { category: "HEALTHCARE", value: 38.8, unit: "万円/年", indicator: "一人あたり医療費" },
    { category: "LONG_TERM_CARE", value: 21.5, unit: "%", indicator: "要介護認定率" },
  ]},
  { prefectureName: "鹿児島県", stats: [
    { category: "PENSION", value: 169.5, unit: "万円/年", indicator: "一人あたり年金受給額" },
    { category: "HEALTHCARE", value: 40.2, unit: "万円/年", indicator: "一人あたり医療費" },
    { category: "LONG_TERM_CARE", value: 22.0, unit: "%", indicator: "要介護認定率" },
  ]},
  { prefectureName: "沖縄県", stats: [
    { category: "PENSION", value: 162.0, unit: "万円/年", indicator: "一人あたり年金受給額" },
    { category: "HEALTHCARE", value: 36.0, unit: "万円/年", indicator: "一人あたり医療費" },
    { category: "LONG_TERM_CARE", value: 19.8, unit: "%", indicator: "要介護認定率" },
  ]},
];

// ============================================
// 政党別社会保障スタンスデータ
// ============================================

const SOCIAL_SECURITY_STANCE_DATA: SocialSecurityStanceData[] = [
  {
    partyName: "自由民主党",
    stances: [
      {
        topic: "年金制度改革",
        stance: "現行制度の改善",
        summary: "基礎年金の給付水準維持のため、厚生年金との財政調整を検討。被用者保険の適用拡大を段階的に推進。マクロ経済スライドの調整期間統一を2025年の年金制度改正で実現。",
        manifesto: "持続可能な年金制度の構築 - マクロ経済スライド調整と適用拡大",
        year: 2024,
      },
      {
        topic: "医療費負担見直し",
        stance: "応能負担の推進",
        summary: "後期高齢者の窓口負担2割化を推進。高額療養費制度の上限額見直し、リフィル処方の普及促進、後発医薬品使用促進でコスト適正化を図る。",
        manifesto: "全世代型社会保障の構築 - 応能負担と給付の適正化",
        year: 2024,
      },
      {
        topic: "介護人材確保",
        stance: "処遇改善推進",
        summary: "介護職員の処遇改善加算の拡充、ICT・介護ロボットの導入促進による業務効率化。外国人介護人材の受入拡大（特定技能、EPA）。2024年度介護報酬改定で1.59%引上げ。",
        manifesto: "介護人材の処遇改善と生産性向上 - テクノロジー活用で魅力ある職場に",
        year: 2024,
      },
      {
        topic: "子育て支援拡充",
        stance: "強力推進",
        summary: "こども未来戦略に基づく加速化プランを推進。児童手当の拡充（所得制限撤廃、高校生延長、第3子月3万円）、出産育児一時金50万円、育児休業給付率引上げ。2028年度までに年間3.6兆円の予算倍増を目標。",
        manifesto: "次元の異なる少子化対策 - こども予算の倍増",
        year: 2024,
      },
      {
        topic: "最低賃金引上げ",
        stance: "段階的引上げ",
        summary: "2030年代半ばまでに全国加重平均1,500円を目標。2024年度は過去最大の51円引上げで全国平均1,055円に。中小企業の生産性向上支援と並行して引上げを推進。",
        manifesto: "最低賃金1,500円の実現 - 成長と分配の好循環",
        year: 2024,
      },
      {
        topic: "ベーシックインカム",
        stance: "反対",
        summary: "ベーシックインカムの導入には否定的。既存の社会保障制度の改善・充実を優先する姿勢。給付付き税額控除については検討の余地があるとの立場。",
        manifesto: null,
        year: 2024,
      },
    ],
  },
  {
    partyName: "立憲民主党",
    stances: [
      {
        topic: "年金制度改革",
        stance: "最低保障年金の導入",
        summary: "低年金・無年金問題の解消のため、最低保障年金制度の導入を提唱。全ての高齢者に月額8万円以上の年金を保障。財源は所得税の累進強化と金融所得課税。",
        manifesto: "最低保障年金の実現 - 老後の安心を全ての人に",
        year: 2024,
      },
      {
        topic: "医療費負担見直し",
        stance: "負担増に反対",
        summary: "後期高齢者の窓口負担引上げに反対。高額療養費の上限額引上げにも反対。医療費の適正化は診療報酬の見直し、予防医療の充実で対応すべきとの立場。",
        manifesto: "医療費の窓口負担増反対 - 予防医療と健康寿命の延伸",
        year: 2024,
      },
      {
        topic: "介護人材確保",
        stance: "賃金大幅引上げ",
        summary: "介護職員の月額賃金を全産業平均まで引き上げることを目標。公定価格の見直し、介護報酬の大幅引上げを要求。介護の社会化を一層推進。",
        manifesto: "介護職員の賃金を月10万円引上げ - 介護崩壊を防ぐ",
        year: 2024,
      },
      {
        topic: "子育て支援拡充",
        stance: "更なる拡充要求",
        summary: "政府の加速化プランは不十分と批判。子どもの医療費無料化（18歳まで）、給食費無償化、高等教育の無償化拡大を要求。教育の完全無償化を目標に掲げる。",
        manifesto: "子ども・教育の完全無償化 - 給食費・医療費・高等教育",
        year: 2024,
      },
      {
        topic: "最低賃金引上げ",
        stance: "早期1,500円達成",
        summary: "最低賃金の早期1,500円達成を要求。中小企業支援として社会保険料の事業主負担軽減を提案。全国一律最低賃金制度の導入を検討。",
        manifesto: "最低賃金1,500円の早期実現と全国一律化",
        year: 2024,
      },
      {
        topic: "ベーシックインカム",
        stance: "給付付き税額控除支持",
        summary: "ベーシックインカムそのものではなく、給付付き税額控除（日本版EITC）の導入を提唱。低所得者への実質的な所得保障を税制を通じて実現。",
        manifesto: "給付付き税額控除の導入 - 働いても貧しい人をなくす",
        year: 2024,
      },
    ],
  },
  {
    partyName: "公明党",
    stances: [
      {
        topic: "年金制度改革",
        stance: "適用拡大推進",
        summary: "厚生年金の適用拡大を積極推進。パート・アルバイトへの適用要件緩和を継続。年金受給開始時期の柔軟化（60-75歳）の周知を推進。",
        manifesto: "厚生年金の適用拡大と低年金対策の充実",
        year: 2024,
      },
      {
        topic: "医療費負担見直し",
        stance: "低所得者配慮",
        summary: "医療費の適正化を支持するが、低所得高齢者への配慮を最重視。高額療養費制度の維持・充実を要求。予防医療の推進による将来の医療費抑制を重視。",
        manifesto: "誰もが安心して医療を受けられる社会 - 低所得者への配慮",
        year: 2024,
      },
      {
        topic: "介護人材確保",
        stance: "処遇改善と環境整備",
        summary: "介護職員の処遇改善と労働環境の改善を推進。介護現場のICT化・ロボット導入を支援。介護離職ゼロの実現を目指す。",
        manifesto: "介護離職ゼロ - 家族介護者支援と介護人材の確保",
        year: 2024,
      },
      {
        topic: "子育て支援拡充",
        stance: "強力推進",
        summary: "児童手当の拡充を与党として推進した実績。0-2歳児の保育料無償化、幼児教育・保育の質の向上を重点課題とする。出産費用の保険適用を推進。",
        manifesto: "0-2歳の保育料完全無償化と出産費用の保険適用",
        year: 2024,
      },
      {
        topic: "最低賃金引上げ",
        stance: "着実な引上げ",
        summary: "最低賃金の着実な引上げを支持。中小企業・小規模事業者の経営を圧迫しないよう、各種支援策との併用を重視。",
        manifesto: null,
        year: 2024,
      },
      {
        topic: "ベーシックインカム",
        stance: "慎重",
        summary: "ベーシックインカムの導入には慎重。既存の社会保障制度の充実を優先。生活困窮者への個別支援の強化を重視。",
        manifesto: null,
        year: 2024,
      },
    ],
  },
  {
    partyName: "日本維新の会",
    stances: [
      {
        topic: "年金制度改革",
        stance: "積立方式への移行",
        summary: "現行の賦課方式から積立方式への段階的移行を主張。年金保険料の個人積立口座制度の導入を提唱。世代間の不公平の解消を目指す。",
        manifesto: "年金制度の抜本改革 - 積立方式への段階的移行",
        year: 2024,
      },
      {
        topic: "医療費負担見直し",
        stance: "自己負担の適正化",
        summary: "医療費の自己負担の適正化を推進。窓口負担の年齢別から所得別への転換を提唱。混合診療の解禁、市場メカニズムの活用を推進。",
        manifesto: "医療の規制改革 - 混合診療の解禁と選択肢の拡大",
        year: 2024,
      },
      {
        topic: "介護人材確保",
        stance: "規制改革重視",
        summary: "介護分野の規制改革を推進。混合介護の解禁、株式会社の参入促進、ICT・AI活用による効率化を重視。介護職の専門性向上とキャリアパスの明確化。",
        manifesto: "介護の規制改革 - 混合介護の解禁とICT活用",
        year: 2024,
      },
      {
        topic: "子育て支援拡充",
        stance: "教育の無償化重視",
        summary: "大阪での実績（私立高校無償化）を全国展開することを提唱。教育の完全無償化（0歳〜大学院）を最終目標に掲げる。教育バウチャー制度の導入も提案。",
        manifesto: "教育の完全無償化 - 0歳から大学院まで",
        year: 2024,
      },
      {
        topic: "最低賃金引上げ",
        stance: "市場メカニズム重視",
        summary: "最低賃金の引上げは支持するが、規制的な引上げよりも、経済成長による自然な賃金上昇を重視。中小企業の生産性向上と一体での引上げを主張。",
        manifesto: null,
        year: 2024,
      },
      {
        topic: "ベーシックインカム",
        stance: "前向き検討",
        summary: "ベーシックインカムの導入に前向き。既存の社会保障制度を整理統合し、シンプルなベーシックインカム制度への移行を検討すべきとの立場。負の所得税としての実装を提案。",
        manifesto: "ベーシックインカムの検討 - 社会保障制度のシンプル化",
        year: 2024,
      },
    ],
  },
  {
    partyName: "国民民主党",
    stances: [
      {
        topic: "年金制度改革",
        stance: "被用者保険の適用拡大",
        summary: "厚生年金の適用対象をフリーランス・ギグワーカーにも拡大することを提唱。第3号被保険者制度の段階的見直し。年金積立金のより積極的な運用も検討。",
        manifesto: "「手取りを増やす」年金改革 - 適用拡大と制度の持続性強化",
        year: 2024,
      },
      {
        topic: "医療費負担見直し",
        stance: "現役世代の負担軽減",
        summary: "現役世代の社会保険料負担の軽減を最重視。後期高齢者の窓口負担見直しは容認。医療DXの推進による効率化、予防医療への投資拡大を提唱。",
        manifesto: "現役世代の手取りを増やす社会保険料改革",
        year: 2024,
      },
      {
        topic: "介護人材確保",
        stance: "処遇改善と生産性向上",
        summary: "介護職員の賃金引上げと、テクノロジー活用による生産性向上の両立を重視。介護DXの推進、見守りセンサー・介護ロボットへの投資拡大を提案。",
        manifesto: "介護DXで人手不足を解消 - テクノロジー投資と処遇改善",
        year: 2024,
      },
      {
        topic: "子育て支援拡充",
        stance: "強く推進",
        summary: "「人づくりこそ国づくり」の理念で子育て・教育支援を最重点政策に。児童手当の更なる拡充、学校給食の無償化、高等教育の授業料後払い（出世払い）制度を提唱。",
        manifesto: "教育国債の創設 - 人づくりへの大胆な投資",
        year: 2024,
      },
      {
        topic: "最低賃金引上げ",
        stance: "積極的引上げ",
        summary: "最低賃金1,500円の早期達成を強く支持。「手取りを増やす」政策パッケージの一環として、最低賃金引上げと社会保険料負担軽減の同時実施を提唱。",
        manifesto: "最低賃金1,500円と「103万円の壁」解消のセット実現",
        year: 2024,
      },
      {
        topic: "ベーシックインカム",
        stance: "給付付き税額控除支持",
        summary: "ベーシックインカムの理念に共感しつつも、現実的な第一歩として給付付き税額控除の導入を提案。特に子育て世帯・若年低所得者層への重点的な給付を提唱。",
        manifesto: null,
        year: 2024,
      },
    ],
  },
  {
    partyName: "日本共産党",
    stances: [
      {
        topic: "年金制度改革",
        stance: "マクロ経済スライド廃止",
        summary: "マクロ経済スライドの廃止と年金給付水準の引き上げを強く要求。最低保障年金の導入（月7万円以上）を提唱。財源は大企業・富裕層への課税強化と軍事費の削減。",
        manifesto: "マクロ経済スライド廃止・最低保障年金月7万円以上の実現",
        year: 2024,
      },
      {
        topic: "医療費負担見直し",
        stance: "負担増に断固反対",
        summary: "医療費の窓口負担増に断固反対。国民健康保険料の引き下げ、後期高齢者の窓口負担1割への復帰を要求。国民皆保険制度の堅持を最重視。",
        manifesto: "医療費の窓口負担軽減 - 国保料の引き下げと無料低額診療の拡充",
        year: 2024,
      },
      {
        topic: "介護人材確保",
        stance: "介護報酬大幅引上げ",
        summary: "介護報酬の大幅引上げと、介護職員の月額賃金5万円以上の引上げを要求。国の責任で介護基盤を整備し、介護保険料の引下げと自己負担の軽減を同時に実現すべきと主張。",
        manifesto: "介護崩壊を止める - 介護職の賃金月5万円引上げと保険料引下げ",
        year: 2024,
      },
      {
        topic: "子育て支援拡充",
        stance: "大幅拡充要求",
        summary: "子どもの医療費完全無料化、学校給食無償化、大学授業料の半額化と無償化への前進を強く要求。子ども予算の GDP比を欧州水準（3%以上）に引き上げることを目標。",
        manifesto: "子どもの医療費・給食費・大学学費の無償化 - 教育に金をかける国へ",
        year: 2024,
      },
      {
        topic: "最低賃金引上げ",
        stance: "即時1,500円以上",
        summary: "最低賃金の即時1,500円以上への引上げを要求。中小企業支援として社会保険料の事業主負担軽減、賃上げ助成金の拡充を提案。全国一律最低賃金の実現を主張。",
        manifesto: "全国一律・最低賃金1,500円以上の即時実現",
        year: 2024,
      },
      {
        topic: "ベーシックインカム",
        stance: "慎重",
        summary: "ベーシックインカムが社会保障制度の縮小・解体につながる危険性を警告。個別の社会保障制度の充実を優先すべきとの立場。生活保護制度の活用促進と基準引上げを重視。",
        manifesto: null,
        year: 2024,
      },
    ],
  },
  {
    partyName: "れいわ新選組",
    stances: [
      {
        topic: "年金制度改革",
        stance: "最低保障年金導入",
        summary: "全ての高齢者に月額10万円以上の最低保障年金を支給する制度の導入を提唱。財源は国債発行と大企業・富裕層への課税。MMT（現代貨幣理論）に基づく積極財政を主張。",
        manifesto: "最低保障年金月10万円 - 全ての高齢者に安心を",
        year: 2024,
      },
      {
        topic: "医療費負担見直し",
        stance: "窓口負担ゼロ",
        summary: "医療費の窓口負担をゼロにすることを目標。国民健康保険料の大幅引き下げ。医療はベーシックサービスとして無償化すべきとの立場。",
        manifesto: "医療費窓口負担ゼロ - 医療はベーシックサービス",
        year: 2024,
      },
      {
        topic: "介護人材確保",
        stance: "公務員化を提案",
        summary: "介護職員の公務員化（公的介護職員制度）を提案。国が責任を持って雇用し、全産業平均以上の賃金を保障。介護の市場化を見直し、公的サービスとしての介護を再構築。",
        manifesto: "介護職員の国家公務員化 - 安定雇用と賃金保障",
        year: 2024,
      },
      {
        topic: "子育て支援拡充",
        stance: "完全無償化",
        summary: "妊娠から大学卒業までの全ての費用の無償化を提唱。児童手当の大幅増額（月3万円以上）、出産費用・不妊治療の完全無償化。財源は国債発行。",
        manifesto: "子育て費用の完全無償化 - 妊娠から大学まで",
        year: 2024,
      },
      {
        topic: "最低賃金引上げ",
        stance: "即時1,500円",
        summary: "最低賃金の即時1,500円への引上げを要求。中小企業への直接補助（社会保険料の国負担）で引上げを支援。全国一律の最低賃金を主張。",
        manifesto: "最低賃金1,500円・全国一律 - 中小企業への直接補助付き",
        year: 2024,
      },
      {
        topic: "ベーシックインカム",
        stance: "導入支持",
        summary: "ベーシックインカムの導入を積極的に支持。月額7-10万円の給付を全国民に。既存の社会保障制度は維持しつつ上乗せする形で導入を提案。財源は国債と累進課税強化。",
        manifesto: "全国民へのベーシックインカム月7万円 - 誰も取り残さない社会保障",
        year: 2024,
      },
    ],
  },
  {
    partyName: "社会民主党",
    stances: [
      {
        topic: "年金制度改革",
        stance: "最低保障年金導入",
        summary: "税方式の最低保障年金制度の創設を提唱。全ての高齢者に最低月額8万円の年金を保障。マクロ経済スライドの廃止を要求。",
        manifesto: "最低保障年金の創設 - 老後の貧困をなくす",
        year: 2024,
      },
      {
        topic: "医療費負担見直し",
        stance: "負担増反対",
        summary: "医療費の窓口負担増に反対。国民皆保険制度の堅持と医療アクセスの平等を最重視。予防医療と地域医療の充実を推進。",
        manifesto: null,
        year: 2024,
      },
      {
        topic: "介護人材確保",
        stance: "賃金引上げ要求",
        summary: "介護職員の大幅な賃金引上げを要求。介護労働者の労働条件改善を労働政策の観点から推進。",
        manifesto: null,
        year: 2024,
      },
      {
        topic: "子育て支援拡充",
        stance: "強く推進",
        summary: "子育て支援の大幅拡充を要求。教育の無償化、子どもの貧困対策、ひとり親家庭への支援強化を重視。",
        manifesto: "子どもの貧困ゼロ - ひとり親家庭への重点支援",
        year: 2024,
      },
      {
        topic: "最低賃金引上げ",
        stance: "即時引上げ",
        summary: "最低賃金の大幅引上げを強く要求。労働者の生活を守る観点から、全国一律1,500円以上を目標に。",
        manifesto: "最低賃金の全国一律1,500円以上への引上げ",
        year: 2024,
      },
      {
        topic: "ベーシックインカム",
        stance: "社会保障充実を優先",
        summary: "ベーシックインカムよりも既存の社会保障制度の充実を優先。ただし、ベーシックサービス（医療・教育・住宅の無償化）には賛成。",
        manifesto: null,
        year: 2024,
      },
    ],
  },
  {
    partyName: "NHK党",
    stances: [
      {
        topic: "年金制度改革",
        stance: "中立",
        summary: "年金制度改革について特に目立った独自の主張なし。NHK改革が最優先課題。",
        manifesto: null,
        year: 2024,
      },
      {
        topic: "医療費負担見直し",
        stance: "中立",
        summary: "特段の主張なし。",
        manifesto: null,
        year: 2024,
      },
      {
        topic: "介護人材確保",
        stance: "中立",
        summary: "特段の主張なし。",
        manifesto: null,
        year: 2024,
      },
      {
        topic: "子育て支援拡充",
        stance: "中立",
        summary: "NHK受信料廃止による家計負担軽減が子育て支援につながるとの主張。",
        manifesto: null,
        year: 2024,
      },
      {
        topic: "最低賃金引上げ",
        stance: "中立",
        summary: "特段の主張なし。",
        manifesto: null,
        year: 2024,
      },
      {
        topic: "ベーシックインカム",
        stance: "中立",
        summary: "特段の主張なし。",
        manifesto: null,
        year: 2024,
      },
    ],
  },
  {
    partyName: "参政党",
    stances: [
      {
        topic: "年金制度改革",
        stance: "自助努力重視",
        summary: "年金制度の持続性確保のため、個人の自助努力（iDeCo、NISA等）の促進を重視。年金積立金の国内投資拡大を提唱。",
        manifesto: "年金の安定運用と個人の資産形成支援",
        year: 2024,
      },
      {
        topic: "医療費負担見直し",
        stance: "予防医療重視",
        summary: "西洋医学偏重の医療制度を見直し、東洋医学・予防医学の活用を推進。食育による健康増進で医療費を削減すべきとの立場。添加物規制の強化も主張。",
        manifesto: "予防医療と食育による医療費削減 - 東洋医学の活用推進",
        year: 2024,
      },
      {
        topic: "介護人材確保",
        stance: "地域コミュニティ活用",
        summary: "地域コミュニティの互助機能を回復し、家族介護と地域介護の充実を図るべきとの立場。外国人介護人材の大量受入には慎重。",
        manifesto: null,
        year: 2024,
      },
      {
        topic: "子育て支援拡充",
        stance: "家庭教育重視",
        summary: "子育て支援の拡充を支持するが、家庭での養育を最重視。3歳児神話を肯定的に捉え、在宅育児手当の創設を提唱。祖父母世代との三世代同居支援も推進。",
        manifesto: "在宅育児手当の創設と三世代同居の推進",
        year: 2024,
      },
      {
        topic: "最低賃金引上げ",
        stance: "中小企業配慮",
        summary: "最低賃金引上げは基本的に支持するが、中小企業の経営への影響を最重視。急激な引上げには反対の立場。",
        manifesto: null,
        year: 2024,
      },
      {
        topic: "ベーシックインカム",
        stance: "反対",
        summary: "ベーシックインカムは国民の勤労意欲を削ぐとして反対。自助努力と家族・地域の支え合いを重視する立場。",
        manifesto: null,
        year: 2024,
      },
    ],
  },
  {
    partyName: "日本保守党",
    stances: [
      {
        topic: "年金制度改革",
        stance: "制度の安定化",
        summary: "年金制度の安定的な運営を重視。年金積立金の国内投資拡大と運用の透明性向上を提唱。世代間公平の実現を目指す。",
        manifesto: null,
        year: 2024,
      },
      {
        topic: "医療費負担見直し",
        stance: "現行制度維持",
        summary: "国民皆保険制度の維持を基本姿勢としつつ、応能負担の適正化を支持。外国人の国民健康保険利用の厳格化を強く主張。",
        manifesto: "外国人の医療保険タダ乗り防止",
        year: 2024,
      },
      {
        topic: "介護人材確保",
        stance: "日本人人材の育成優先",
        summary: "日本人の介護人材育成を優先すべきとの立場。外国人介護人材の大量受入には慎重。介護職の社会的地位向上を提唱。",
        manifesto: null,
        year: 2024,
      },
      {
        topic: "子育て支援拡充",
        stance: "日本人の出生率向上",
        summary: "日本人の出生率向上を最重視。第3子以降の大幅な支援拡充を提唱。伝統的家族の価値を重視した子育て環境の整備。",
        manifesto: "日本人の出生率回復 - 第3子以降への大胆な支援",
        year: 2024,
      },
      {
        topic: "最低賃金引上げ",
        stance: "経済成長と並行",
        summary: "最低賃金の引上げは経済成長と並行して進めるべきとの立場。中小企業への配慮を重視。",
        manifesto: null,
        year: 2024,
      },
      {
        topic: "ベーシックインカム",
        stance: "反対",
        summary: "ベーシックインカムに反対。勤労を基本とする社会を堅持すべきとの立場。",
        manifesto: null,
        year: 2024,
      },
    ],
  },
  {
    partyName: "チームみらい",
    stances: [
      {
        topic: "年金制度改革",
        stance: "適用拡大と透明化",
        summary: "厚生年金の適用拡大と年金制度の透明化を推進。年金財政の見える化で国民の信頼回復を図る。",
        manifesto: null,
        year: 2025,
      },
      {
        topic: "医療費負担見直し",
        stance: "現役世代負担軽減",
        summary: "現役世代の社会保険料負担軽減を重視。応能負担の適正化と医療DXの推進。",
        manifesto: null,
        year: 2025,
      },
      {
        topic: "介護人材確保",
        stance: "処遇改善推進",
        summary: "介護職員の処遇改善と ICT活用の推進。",
        manifesto: null,
        year: 2025,
      },
      {
        topic: "子育て支援拡充",
        stance: "推進",
        summary: "子育て支援の更なる拡充を支持。教育への投資拡大を重視。",
        manifesto: null,
        year: 2025,
      },
      {
        topic: "最低賃金引上げ",
        stance: "段階的引上げ",
        summary: "最低賃金の段階的引上げを支持。経済成長との両立を重視。",
        manifesto: null,
        year: 2025,
      },
      {
        topic: "ベーシックインカム",
        stance: "検討に前向き",
        summary: "ベーシックインカムの研究・検討に前向き。",
        manifesto: null,
        year: 2025,
      },
    ],
  },
  {
    partyName: "中道改革連合",
    stances: [
      {
        topic: "年金制度改革",
        stance: "持続可能性の確保",
        summary: "年金制度の持続可能性確保のため、エビデンスに基づく改革を推進。",
        manifesto: null,
        year: 2025,
      },
      {
        topic: "医療費負担見直し",
        stance: "応能負担の適正化",
        summary: "応能負担の適正化と医療アクセスの公平性確保を推進。",
        manifesto: null,
        year: 2025,
      },
      {
        topic: "介護人材確保",
        stance: "総合的対策",
        summary: "介護人材の処遇改善、テクノロジー活用、多文化共生の観点からの外国人材活用を総合的に推進。",
        manifesto: null,
        year: 2025,
      },
      {
        topic: "子育て支援拡充",
        stance: "推進",
        summary: "子育て支援の拡充を支持。少子化対策を最重要課題と位置づけ。",
        manifesto: null,
        year: 2025,
      },
      {
        topic: "最低賃金引上げ",
        stance: "着実な引上げ",
        summary: "最低賃金の着実な引上げを支持。中小企業支援との両立を重視。",
        manifesto: null,
        year: 2025,
      },
      {
        topic: "ベーシックインカム",
        stance: "研究段階",
        summary: "ベーシックインカムについては研究を進めるべきとの立場。実証実験の実施を提案。",
        manifesto: null,
        year: 2025,
      },
    ],
  },
];

// ============================================
// メイン処理
// ============================================

export async function seedSocialSecurity(): Promise<void> {
  console.log("=".repeat(60));
  console.log("[social] 社会保障（SocialGuard）シードを開始...");
  console.log("=".repeat(60));

  // ─────────────────────────────────────────
  // 1. 社会保障関係費（SocialSecurityBudget）
  // ─────────────────────────────────────────
  console.log("\n[social] --- 社会保障関係費データ ---");
  let budgetCount = 0;

  for (const yearData of SOCIAL_SECURITY_BUDGET_DATA) {
    const entries: { category: string; amount: bigint; description: string }[] = [
      { category: "PENSION", amount: yearData.pension, description: `${yearData.fiscalYear}年度 年金関係費（基礎年金国庫負担等）` },
      { category: "HEALTHCARE", amount: yearData.healthcare, description: `${yearData.fiscalYear}年度 医療関係費（医療給付費、後期高齢者支援金等）` },
      { category: "LONG_TERM_CARE", amount: yearData.longTermCare, description: `${yearData.fiscalYear}年度 介護関係費（介護給付費国庫負担等）` },
      { category: "WELFARE", amount: yearData.welfare, description: `${yearData.fiscalYear}年度 福祉関係費（生活保護、社会福祉等）` },
      { category: "CHILD_SUPPORT", amount: yearData.childSupport, description: `${yearData.fiscalYear}年度 子育て支援関係費（児童手当、保育等）` },
      { category: "EMPLOYMENT", amount: yearData.employment, description: `${yearData.fiscalYear}年度 雇用・労働関係費（雇用保険国庫負担等）` },
      { category: "DISABILITY", amount: yearData.disability, description: `${yearData.fiscalYear}年度 障害福祉関係費（障害者総合支援等）` },
      { category: "TOTAL", amount: yearData.total, description: `${yearData.fiscalYear}年度 社会保障関係費合計` },
    ];

    for (const entry of entries) {
      await prisma.socialSecurityBudget.upsert({
        where: {
          fiscalYear_category: {
            fiscalYear: yearData.fiscalYear,
            category: entry.category as "PENSION" | "HEALTHCARE" | "LONG_TERM_CARE" | "WELFARE" | "CHILD_SUPPORT" | "EMPLOYMENT" | "DISABILITY" | "TOTAL",
          },
        },
        update: {
          amount: entry.amount,
          description: entry.description,
          sourceUrl: "https://www.mof.go.jp/policy/budget/budger_workflow/budget/",
        },
        create: {
          fiscalYear: yearData.fiscalYear,
          category: entry.category as "PENSION" | "HEALTHCARE" | "LONG_TERM_CARE" | "WELFARE" | "CHILD_SUPPORT" | "EMPLOYMENT" | "DISABILITY" | "TOTAL",
          amount: entry.amount,
          description: entry.description,
          sourceUrl: "https://www.mof.go.jp/policy/budget/budger_workflow/budget/",
        },
      });
      budgetCount++;
    }

    console.log(
      `[social]   ${yearData.fiscalYear}年度: 合計 ${Number(yearData.total).toLocaleString()}億円（${(Number(yearData.total) / 10000).toFixed(1)}兆円）`,
    );
  }

  console.log(`[social] 予算データ: ${budgetCount}件登録完了`);

  // ─────────────────────────────────────────
  // 2. 社会保障制度（SocialSecurityProgram）
  // ─────────────────────────────────────────
  console.log("\n[social] --- 社会保障制度データ ---");
  let programCount = 0;

  for (const program of SOCIAL_SECURITY_PROGRAM_DATA) {
    const existing = await prisma.socialSecurityProgram.findFirst({
      where: { name: program.name },
    });

    if (existing) {
      await prisma.socialSecurityProgram.update({
        where: { id: existing.id },
        data: {
          category: program.category as "PENSION" | "HEALTHCARE" | "LONG_TERM_CARE" | "WELFARE" | "CHILD_SUPPORT" | "EMPLOYMENT" | "DISABILITY" | "TOTAL",
          description: program.description,
          eligibility: program.eligibility,
          benefit: program.benefit,
          budget: program.budget,
          recipients: program.recipients,
          startYear: program.startYear,
          lastReformed: program.lastReformed,
          sourceUrl: program.sourceUrl,
          isActive: program.isActive,
        },
      });
    } else {
      await prisma.socialSecurityProgram.create({
        data: {
          name: program.name,
          category: program.category as "PENSION" | "HEALTHCARE" | "LONG_TERM_CARE" | "WELFARE" | "CHILD_SUPPORT" | "EMPLOYMENT" | "DISABILITY" | "TOTAL",
          description: program.description,
          eligibility: program.eligibility,
          benefit: program.benefit,
          budget: program.budget,
          recipients: program.recipients,
          startYear: program.startYear,
          lastReformed: program.lastReformed,
          sourceUrl: program.sourceUrl,
          isActive: program.isActive,
        },
      });
    }

    programCount++;
    console.log(
      `[social]   ${program.name}（${program.startYear ?? "N/A"}〜, 受給者 ${program.recipients ? program.recipients + "万人" : "N/A"}）`,
    );
  }

  console.log(`[social] 制度データ: ${programCount}件登録完了`);

  // ─────────────────────────────────────────
  // 3. 都道府県別福祉統計（WelfareStat）
  // ─────────────────────────────────────────
  console.log("\n[social] --- 都道府県別福祉統計データ ---");
  let statCount = 0;
  const fiscalYear = 2024;

  for (const prefData of PREFECTURE_WELFARE_DATA) {
    const prefecture = await prisma.prefecture.findFirst({
      where: { name: prefData.prefectureName },
    });

    if (!prefecture) {
      console.warn(
        `[social] 都道府県「${prefData.prefectureName}」がDBに見つかりません。スキップします。`,
      );
      continue;
    }

    for (const stat of prefData.stats) {
      await prisma.welfareStat.upsert({
        where: {
          prefectureId_fiscalYear_category_indicator: {
            prefectureId: prefecture.id,
            fiscalYear,
            category: stat.category as "PENSION" | "HEALTHCARE" | "LONG_TERM_CARE" | "WELFARE" | "CHILD_SUPPORT" | "EMPLOYMENT" | "DISABILITY" | "TOTAL",
            indicator: stat.indicator,
          },
        },
        update: {
          value: stat.value,
          unit: stat.unit,
        },
        create: {
          prefectureId: prefecture.id,
          fiscalYear,
          category: stat.category as "PENSION" | "HEALTHCARE" | "LONG_TERM_CARE" | "WELFARE" | "CHILD_SUPPORT" | "EMPLOYMENT" | "DISABILITY" | "TOTAL",
          value: stat.value,
          unit: stat.unit,
          indicator: stat.indicator,
        },
      });
      statCount++;
    }
  }

  console.log(`[social] 都道府県別統計: ${statCount}件登録完了（${fiscalYear}年度）`);

  // ─────────────────────────────────────────
  // 4. 政党別社会保障スタンス（SocialSecurityStance）
  // ─────────────────────────────────────────
  console.log("\n[social] --- 政党別社会保障スタンスデータ ---");
  let stanceCount = 0;

  for (const partyStance of SOCIAL_SECURITY_STANCE_DATA) {
    const party = await prisma.party.findFirst({
      where: { name: partyStance.partyName },
    });

    if (!party) {
      console.warn(
        `[social] 政党「${partyStance.partyName}」がDBに見つかりません。スキップします。`,
      );
      continue;
    }

    for (const stance of partyStance.stances) {
      await prisma.socialSecurityStance.upsert({
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

    console.log(`[social]   ${partyStance.partyName}: ${partyStance.stances.length}件`);
  }

  console.log(`[social] スタンス: ${stanceCount}件登録完了`);

  // ─────────────────────────────────────────
  // サマリー
  // ─────────────────────────────────────────
  console.log("\n" + "=".repeat(60));
  console.log(
    `[social] 完了 -- 予算${budgetCount}件, 制度${programCount}件, 都道府県統計${statCount}件, スタンス${stanceCount}件`,
  );
  console.log("=".repeat(60));
}

// CLI実行
if (process.argv[1]?.includes("social-security/seed-social-security")) {
  seedSocialSecurity()
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
