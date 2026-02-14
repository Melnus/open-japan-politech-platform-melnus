/**
 * 参議院議員シードスクリプト — 全248議席（現員247名）
 *
 * 参議院公式サイトの会派別・選挙区別議員一覧に基づく実データ。
 * https://www.sangiin.go.jp/japanese/joho1/kousei/giin/220/giinmei.htm
 * https://www.sangiin.go.jp/japanese/giin/hireiku/hireiku.htm
 *
 * 令和8年2月12日現在のデータ。
 * 第26回（2022年）改選組 + 第27回（2025年）改選組 = 全議員。
 */

import { prisma } from "@ojpp/db";

// ============================================
// 型定義
// ============================================

interface CouncillorData {
  /** 氏名（漢字） */
  name: string;
  /** 氏名（カタカナ読み） */
  nameKana: string | null;
  /** 政党名（DBの Party.name と一致させる） */
  party: string;
  /** 選挙区名 or "比例代表" */
  district: string;
  /** 都道府県名（比例代表の場合 null） */
  prefecture: string | null;
}

// ============================================
// 自由民主党・無所属の会（101名）
//   — 自民党本体 + 無所属で会派参加
// ============================================

const LDP_MEMBERS: CouncillorData[] = [
  // === 選挙区選出 ===
  // 北海道
  {
    name: "長谷川岳",
    nameKana: "ハセガワ ガク",
    party: "自由民主党",
    district: "北海道",
    prefecture: "北海道",
  },
  {
    name: "船橋利実",
    nameKana: "フナバシ トシミ",
    party: "自由民主党",
    district: "北海道",
    prefecture: "北海道",
  },
  {
    name: "岩本剛人",
    nameKana: "イワモト タケト",
    party: "自由民主党",
    district: "北海道",
    prefecture: "北海道",
  },
  {
    name: "高橋はるみ",
    nameKana: "タカハシ ハルミ",
    party: "自由民主党",
    district: "北海道",
    prefecture: "北海道",
  },
  // 秋田県
  {
    name: "石井浩郎",
    nameKana: "イシイ ヒロオ",
    party: "自由民主党",
    district: "秋田県",
    prefecture: "秋田県",
  },
  // 宮城県
  {
    name: "櫻井充",
    nameKana: "サクライ ミツル",
    party: "自由民主党",
    district: "宮城県",
    prefecture: "宮城県",
  },
  // 福島県
  {
    name: "星北斗",
    nameKana: "ホシ ホクト",
    party: "自由民主党",
    district: "福島県",
    prefecture: "福島県",
  },
  {
    name: "森まさこ",
    nameKana: "モリ マサコ",
    party: "自由民主党",
    district: "福島県",
    prefecture: "福島県",
  },
  // 茨城県
  {
    name: "加藤明良",
    nameKana: "カトウ アキヨシ",
    party: "自由民主党",
    district: "茨城県",
    prefecture: "茨城県",
  },
  {
    name: "上月良祐",
    nameKana: "コウヅキ リョウスケ",
    party: "自由民主党",
    district: "茨城県",
    prefecture: "茨城県",
  },
  // 栃木県
  {
    name: "上野通子",
    nameKana: "ウエノ ミチコ",
    party: "自由民主党",
    district: "栃木県",
    prefecture: "栃木県",
  },
  {
    name: "高橋克法",
    nameKana: "タカハシ カツノリ",
    party: "自由民主党",
    district: "栃木県",
    prefecture: "栃木県",
  },
  // 群馬県
  {
    name: "中曽根弘文",
    nameKana: "ナカソネ ヒロフミ",
    party: "自由民主党",
    district: "群馬県",
    prefecture: "群馬県",
  },
  {
    name: "清水真人",
    nameKana: "シミズ マサト",
    party: "自由民主党",
    district: "群馬県",
    prefecture: "群馬県",
  },
  // 埼玉県
  {
    name: "古川俊治",
    nameKana: "フルカワ トシハル",
    party: "自由民主党",
    district: "埼玉県",
    prefecture: "埼玉県",
  },
  // 千葉県
  {
    name: "猪口邦子",
    nameKana: "イノグチ クニコ",
    party: "自由民主党",
    district: "千葉県",
    prefecture: "千葉県",
  },
  {
    name: "臼井正一",
    nameKana: "ウスイ ショウイチ",
    party: "自由民主党",
    district: "千葉県",
    prefecture: "千葉県",
  },
  {
    name: "石井準一",
    nameKana: "イシイ ジュンイチ",
    party: "自由民主党",
    district: "千葉県",
    prefecture: "千葉県",
  },
  // 東京都
  {
    name: "朝日健太郎",
    nameKana: "アサヒ ケンタロウ",
    party: "自由民主党",
    district: "東京都",
    prefecture: "東京都",
  },
  {
    name: "生稲晃子",
    nameKana: "イクイナ アキコ",
    party: "自由民主党",
    district: "東京都",
    prefecture: "東京都",
  },
  {
    name: "鈴木大地",
    nameKana: "スズキ ダイチ",
    party: "自由民主党",
    district: "東京都",
    prefecture: "東京都",
  },
  // 神奈川県
  {
    name: "浅尾慶一郎",
    nameKana: "アサオ ケイイチロウ",
    party: "自由民主党",
    district: "神奈川県",
    prefecture: "神奈川県",
  },
  {
    name: "三原じゅん子",
    nameKana: "ミハラ ジュンコ",
    party: "自由民主党",
    district: "神奈川県",
    prefecture: "神奈川県",
  },
  {
    name: "脇雅昭",
    nameKana: "ワキ マサアキ",
    party: "自由民主党",
    district: "神奈川県",
    prefecture: "神奈川県",
  },
  // 新潟県
  {
    name: "小林一大",
    nameKana: "コバヤシ カズヒロ",
    party: "自由民主党",
    district: "新潟県",
    prefecture: "新潟県",
  },
  // 富山県
  {
    name: "野上浩太郎",
    nameKana: "ノガミ コウタロウ",
    party: "自由民主党",
    district: "富山県",
    prefecture: "富山県",
  },
  // 石川県
  {
    name: "岡田直樹",
    nameKana: "オカダ ナオキ",
    party: "自由民主党",
    district: "石川県",
    prefecture: "石川県",
  },
  {
    name: "宮本周司",
    nameKana: "ミヤモト シュウジ",
    party: "自由民主党",
    district: "石川県",
    prefecture: "石川県",
  },
  // 福井県
  {
    name: "山崎正昭",
    nameKana: "ヤマザキ マサアキ",
    party: "自由民主党",
    district: "福井県",
    prefecture: "福井県",
  },
  {
    name: "滝波宏文",
    nameKana: "タキナミ ヒロフミ",
    party: "自由民主党",
    district: "福井県",
    prefecture: "福井県",
  },
  // 山梨県
  {
    name: "永井学",
    nameKana: "ナガイ マナブ",
    party: "自由民主党",
    district: "山梨県",
    prefecture: "山梨県",
  },
  // 岐阜県
  {
    name: "渡辺猛之",
    nameKana: "ワタナベ タケユキ",
    party: "自由民主党",
    district: "岐阜県",
    prefecture: "岐阜県",
  },
  {
    name: "若井敦子",
    nameKana: "ワカイ アツコ",
    party: "自由民主党",
    district: "岐阜県",
    prefecture: "岐阜県",
  },
  // 静岡県
  {
    name: "若林洋平",
    nameKana: "ワカバヤシ ヨウヘイ",
    party: "自由民主党",
    district: "静岡県",
    prefecture: "静岡県",
  },
  {
    name: "牧野たかお",
    nameKana: "マキノ タカオ",
    party: "自由民主党",
    district: "静岡県",
    prefecture: "静岡県",
  },
  // 愛知県
  {
    name: "藤川政人",
    nameKana: "フジカワ マサヒト",
    party: "自由民主党",
    district: "愛知県",
    prefecture: "愛知県",
  },
  {
    name: "酒井庸行",
    nameKana: "サカイ ヤスユキ",
    party: "自由民主党",
    district: "愛知県",
    prefecture: "愛知県",
  },
  // 三重県
  {
    name: "山本佐知子",
    nameKana: "ヤマモト サチコ",
    party: "自由民主党",
    district: "三重県",
    prefecture: "三重県",
  },
  // 滋賀県
  {
    name: "こやり隆史",
    nameKana: "コヤリ タカシ",
    party: "自由民主党",
    district: "滋賀県",
    prefecture: "滋賀県",
  },
  // 京都府
  {
    name: "西田昌司",
    nameKana: "ニシダ ショウジ",
    party: "自由民主党",
    district: "京都府",
    prefecture: "京都府",
  },
  {
    name: "吉井章",
    nameKana: "ヨシイ アキラ",
    party: "自由民主党",
    district: "京都府",
    prefecture: "京都府",
  },
  // 大阪府
  {
    name: "松川るい",
    nameKana: "マツカワ ルイ",
    party: "自由民主党",
    district: "大阪府",
    prefecture: "大阪府",
  },
  // 兵庫県
  {
    name: "末松信介",
    nameKana: "スエマツ シンスケ",
    party: "自由民主党",
    district: "兵庫県",
    prefecture: "兵庫県",
  },
  {
    name: "加田裕之",
    nameKana: "カダ ヒロユキ",
    party: "自由民主党",
    district: "兵庫県",
    prefecture: "兵庫県",
  },
  // 奈良県
  {
    name: "佐藤啓",
    nameKana: "サトウ ケイ",
    party: "自由民主党",
    district: "奈良県",
    prefecture: "奈良県",
  },
  {
    name: "堀井巌",
    nameKana: "ホリイ イワオ",
    party: "自由民主党",
    district: "奈良県",
    prefecture: "奈良県",
  },
  // 和歌山県
  {
    name: "鶴保庸介",
    nameKana: "ツルホ ヨウスケ",
    party: "自由民主党",
    district: "和歌山県",
    prefecture: "和歌山県",
  },
  // 鳥取県・島根県
  {
    name: "青木一彦",
    nameKana: "アオキ カズヒコ",
    party: "自由民主党",
    district: "鳥取県・島根県",
    prefecture: null,
  },
  // 岡山県
  {
    name: "小野田紀美",
    nameKana: "オノダ キミ",
    party: "自由民主党",
    district: "岡山県",
    prefecture: "岡山県",
  },
  {
    name: "小林孝一郎",
    nameKana: "コバヤシ コウイチロウ",
    party: "自由民主党",
    district: "岡山県",
    prefecture: "岡山県",
  },
  // 広島県
  {
    name: "宮沢洋一",
    nameKana: "ミヤザワ ヨウイチ",
    party: "自由民主党",
    district: "広島県",
    prefecture: "広島県",
  },
  {
    name: "西田英範",
    nameKana: "ニシダ ヒデノリ",
    party: "自由民主党",
    district: "広島県",
    prefecture: "広島県",
  },
  // 山口県
  {
    name: "江島潔",
    nameKana: "エジマ キヨシ",
    party: "自由民主党",
    district: "山口県",
    prefecture: "山口県",
  },
  {
    name: "北村経夫",
    nameKana: "キタムラ ツネオ",
    party: "自由民主党",
    district: "山口県",
    prefecture: "山口県",
  },
  // 香川県
  {
    name: "磯崎仁彦",
    nameKana: "イソザキ ヨシヒコ",
    party: "自由民主党",
    district: "香川県",
    prefecture: "香川県",
  },
  // 愛媛県
  {
    name: "山本順三",
    nameKana: "ヤマモト ジュンゾウ",
    party: "自由民主党",
    district: "愛媛県",
    prefecture: "愛媛県",
  },
  // 徳島県・高知県
  {
    name: "中西祐介",
    nameKana: "ナカニシ ユウスケ",
    party: "自由民主党",
    district: "徳島県・高知県",
    prefecture: null,
  },
  // 福岡県
  {
    name: "大家敏志",
    nameKana: "オオイエ サトシ",
    party: "自由民主党",
    district: "福岡県",
    prefecture: "福岡県",
  },
  {
    name: "松山政司",
    nameKana: "マツヤマ マサジ",
    party: "自由民主党",
    district: "福岡県",
    prefecture: "福岡県",
  },
  // 佐賀県
  {
    name: "福岡資麿",
    nameKana: "フクオカ タカマロ",
    party: "自由民主党",
    district: "佐賀県",
    prefecture: "佐賀県",
  },
  {
    name: "山下雄平",
    nameKana: "ヤマシタ ユウヘイ",
    party: "自由民主党",
    district: "佐賀県",
    prefecture: "佐賀県",
  },
  // 長崎県
  {
    name: "山本啓介",
    nameKana: "ヤマモト ケイスケ",
    party: "自由民主党",
    district: "長崎県",
    prefecture: "長崎県",
  },
  {
    name: "古賀友一郎",
    nameKana: "コガ ユウイチロウ",
    party: "自由民主党",
    district: "長崎県",
    prefecture: "長崎県",
  },
  // 熊本県
  {
    name: "松村祥史",
    nameKana: "マツムラ ヨシフミ",
    party: "自由民主党",
    district: "熊本県",
    prefecture: "熊本県",
  },
  {
    name: "馬場成志",
    nameKana: "ババ セイシ",
    party: "自由民主党",
    district: "熊本県",
    prefecture: "熊本県",
  },
  // 大分県
  {
    name: "古庄玄知",
    nameKana: "フルショウ ハルトモ",
    party: "自由民主党",
    district: "大分県",
    prefecture: "大分県",
  },
  // 宮崎県
  {
    name: "松下新平",
    nameKana: "マツシタ シンペイ",
    party: "自由民主党",
    district: "宮崎県",
    prefecture: "宮崎県",
  },
  // 鹿児島県
  {
    name: "野村哲郎",
    nameKana: "ノムラ テツロウ",
    party: "自由民主党",
    district: "鹿児島県",
    prefecture: "鹿児島県",
  },

  // === 比例代表選出 ===
  {
    name: "赤松健",
    nameKana: "アカマツ ケン",
    party: "自由民主党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "阿達雅志",
    nameKana: "アダチ マサシ",
    party: "自由民主党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "有村治子",
    nameKana: "アリムラ ハルコ",
    party: "自由民主党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "井上義行",
    nameKana: "イノウエ ヨシユキ",
    party: "自由民主党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "今井絵理子",
    nameKana: "イマイ エリコ",
    party: "自由民主党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "いんどう周作",
    nameKana: "インドウ シュウサク",
    party: "自由民主党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "小川克巳",
    nameKana: "オガワ カツミ",
    party: "自由民主党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "越智俊之",
    nameKana: "オチ トシユキ",
    party: "自由民主党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "梶原大介",
    nameKana: "カジワラ ダイスケ",
    party: "自由民主党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "片山さつき",
    nameKana: "カタヤマ サツキ",
    party: "自由民主党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "かまやち敏",
    nameKana: "カマヤチ サトシ",
    party: "自由民主党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "神谷政幸",
    nameKana: "カミヤ マサユキ",
    party: "自由民主党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "木村義雄",
    nameKana: "キムラ ヨシオ",
    party: "自由民主党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "見坂茂範",
    nameKana: "ケンザカ シゲノリ",
    party: "自由民主党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "自見はなこ",
    nameKana: "ジミ ハナコ",
    party: "自由民主党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "進藤金日子",
    nameKana: "シンドウ カネヒコ",
    party: "自由民主党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "鈴木宗男",
    nameKana: "スズキ ムネオ",
    party: "自由民主党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "石田昌宏",
    nameKana: "イシダ マサヒロ",
    party: "自由民主党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "友納理緒",
    nameKana: "トモノウ リオ",
    party: "自由民主党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "長谷川英晴",
    nameKana: "ハセガワ ヒデハル",
    party: "自由民主党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "橋本聖子",
    nameKana: "ハシモト セイコ",
    party: "自由民主党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "東野秀樹",
    nameKana: "ヒガシノ ヒデキ",
    party: "自由民主党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "藤井一博",
    nameKana: "フジイ カズヒロ",
    party: "自由民主党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "藤木眞也",
    nameKana: "フジキ シンヤ",
    party: "自由民主党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "福山守",
    nameKana: "フクヤマ マモル",
    party: "自由民主党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "本田顕子",
    nameKana: "ホンダ アキコ",
    party: "自由民主党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "舞立昇治",
    nameKana: "マイタチ ショウジ",
    party: "自由民主党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "山田太郎",
    nameKana: "ヤマダ タロウ",
    party: "自由民主党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "山田宏",
    nameKana: "ヤマダ ヒロシ",
    party: "自由民主党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "山谷えり子",
    nameKana: "ヤマタニ エリコ",
    party: "自由民主党",
    district: "比例代表",
    prefecture: null,
  },

  // === 無所属で自民会派に参加 ===
  {
    name: "寺田静",
    nameKana: "テラダ シズカ",
    party: "無所属",
    district: "秋田県",
    prefecture: "秋田県",
  },
  {
    name: "出川桃子",
    nameKana: "デガワ モモコ",
    party: "自由民主党",
    district: "鳥取県・島根県",
    prefecture: null,
  },
  {
    name: "宮本和宏",
    nameKana: "ミヤモト カズヒロ",
    party: "自由民主党",
    district: "滋賀県",
    prefecture: "滋賀県",
  },
];

// ============================================
// 立憲民主・無所属（40名）
// ============================================

const CDP_MEMBERS: CouncillorData[] = [
  // === 選挙区選出 ===
  {
    name: "徳永エリ",
    nameKana: "トクナガ エリ",
    party: "立憲民主党",
    district: "北海道",
    prefecture: "北海道",
  },
  {
    name: "勝部賢志",
    nameKana: "カツベ ケンシ",
    party: "立憲民主党",
    district: "北海道",
    prefecture: "北海道",
  },
  {
    name: "田名部匡代",
    nameKana: "タナブ マサヨ",
    party: "立憲民主党",
    district: "青森県",
    prefecture: "青森県",
  },
  {
    name: "福士珠美",
    nameKana: "フクシ タマミ",
    party: "立憲民主党",
    district: "青森県",
    prefecture: "青森県",
  },
  {
    name: "木戸口英司",
    nameKana: "キドグチ エイジ",
    party: "立憲民主党",
    district: "岩手県",
    prefecture: "岩手県",
  },
  {
    name: "横沢高徳",
    nameKana: "ヨコサワ タカノリ",
    party: "立憲民主党",
    district: "岩手県",
    prefecture: "岩手県",
  },
  {
    name: "石垣のりこ",
    nameKana: "イシガキ ノリコ",
    party: "立憲民主党",
    district: "宮城県",
    prefecture: "宮城県",
  },
  {
    name: "打越さく良",
    nameKana: "ウチコシ サクラ",
    party: "立憲民主党",
    district: "新潟県",
    prefecture: "新潟県",
  },
  {
    name: "小西洋之",
    nameKana: "コニシ ヒロユキ",
    party: "立憲民主党",
    district: "千葉県",
    prefecture: "千葉県",
  },
  {
    name: "長浜博行",
    nameKana: "ナガハマ ヒロユキ",
    party: "立憲民主党",
    district: "千葉県",
    prefecture: "千葉県",
  },
  {
    name: "塩村あやか",
    nameKana: "シオムラ アヤカ",
    party: "立憲民主党",
    district: "東京都",
    prefecture: "東京都",
  },
  {
    name: "熊谷裕人",
    nameKana: "クマガイ ヒロト",
    party: "立憲民主党",
    district: "埼玉県",
    prefecture: "埼玉県",
  },
  {
    name: "高木真理",
    nameKana: "タカギ マリ",
    party: "立憲民主党",
    district: "埼玉県",
    prefecture: "埼玉県",
  },
  {
    name: "牧山ひろえ",
    nameKana: "マキヤマ ヒロエ",
    party: "立憲民主党",
    district: "神奈川県",
    prefecture: "神奈川県",
  },
  {
    name: "杉尾秀哉",
    nameKana: "スギオ ヒデヤ",
    party: "立憲民主党",
    district: "長野県",
    prefecture: "長野県",
  },
  {
    name: "羽田次郎",
    nameKana: "ハタ ジロウ",
    party: "立憲民主党",
    district: "長野県",
    prefecture: "長野県",
  },
  {
    name: "斎藤嘉隆",
    nameKana: "サイトウ ヨシタカ",
    party: "立憲民主党",
    district: "愛知県",
    prefecture: "愛知県",
  },
  {
    name: "田島麻衣子",
    nameKana: "タジマ マイコ",
    party: "立憲民主党",
    district: "愛知県",
    prefecture: "愛知県",
  },
  {
    name: "小島とも子",
    nameKana: "コジマ トモコ",
    party: "立憲民主党",
    district: "三重県",
    prefecture: "三重県",
  },
  {
    name: "泉房穂",
    nameKana: "イズミ フサホ",
    party: "無所属",
    district: "兵庫県",
    prefecture: "兵庫県",
  },
  {
    name: "三上えり",
    nameKana: "ミカミ エリ",
    party: "立憲民主党",
    district: "広島県",
    prefecture: "広島県",
  },
  {
    name: "森本真治",
    nameKana: "モリモト シンジ",
    party: "立憲民主党",
    district: "広島県",
    prefecture: "広島県",
  },
  {
    name: "広田一",
    nameKana: "ヒロタ ハジメ",
    party: "立憲民主党",
    district: "徳島県・高知県",
    prefecture: null,
  },
  {
    name: "古賀之士",
    nameKana: "コガ ユキヒト",
    party: "立憲民主党",
    district: "福岡県",
    prefecture: "福岡県",
  },
  {
    name: "吉田忠智",
    nameKana: "ヨシダ タダトモ",
    party: "立憲民主党",
    district: "大分県",
    prefecture: "大分県",
  },
  {
    name: "山内佳菜子",
    nameKana: "ヤマウチ カナコ",
    party: "立憲民主党",
    district: "宮崎県",
    prefecture: "宮崎県",
  },

  // === 比例代表選出 ===
  {
    name: "青木愛",
    nameKana: "アオキ アイ",
    party: "立憲民主党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "石橋通宏",
    nameKana: "イシバシ ミチヒロ",
    party: "立憲民主党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "小沢雅仁",
    nameKana: "オザワ マサヒト",
    party: "立憲民主党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "鬼木誠",
    nameKana: "オニキ マコト",
    party: "立憲民主党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "岸真紀子",
    nameKana: "キシ マキコ",
    party: "立憲民主党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "郡山りょう",
    nameKana: "コオリヤマ リョウ",
    party: "立憲民主党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "古賀千景",
    nameKana: "コガ チカゲ",
    party: "立憲民主党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "柴愼一",
    nameKana: "シバ シンイチ",
    party: "立憲民主党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "辻元清美",
    nameKana: "ツジモト キヨミ",
    party: "立憲民主党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "水岡俊一",
    nameKana: "ミズオカ シュンイチ",
    party: "立憲民主党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "村田享子",
    nameKana: "ムラタ キョウコ",
    party: "立憲民主党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "森ゆうこ",
    nameKana: "モリ ユウコ",
    party: "立憲民主党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "吉川沙織",
    nameKana: "ヨシカワ サオリ",
    party: "立憲民主党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "蓮舫",
    nameKana: "レンホウ",
    party: "立憲民主党",
    district: "比例代表",
    prefecture: null,
  },
];

// ============================================
// 国民民主党・新緑風会（25名）
// ============================================

const DPP_MEMBERS: CouncillorData[] = [
  // === 選挙区選出 ===
  {
    name: "上田清司",
    nameKana: "ウエダ キヨシ",
    party: "国民民主党",
    district: "埼玉県",
    prefecture: "埼玉県",
  },
  {
    name: "江原くみ子",
    nameKana: "エハラ クミコ",
    party: "国民民主党",
    district: "埼玉県",
    prefecture: "埼玉県",
  },
  {
    name: "小林さやか",
    nameKana: "コバヤシ サヤカ",
    party: "国民民主党",
    district: "千葉県",
    prefecture: "千葉県",
  },
  {
    name: "牛田茉友",
    nameKana: "ウシダ マユ",
    party: "国民民主党",
    district: "東京都",
    prefecture: "東京都",
  },
  {
    name: "奥村祥大",
    nameKana: "オクムラ ショウタ",
    party: "国民民主党",
    district: "東京都",
    prefecture: "東京都",
  },
  {
    name: "かごしま彰宏",
    nameKana: "カゴシマ アキヒロ",
    party: "国民民主党",
    district: "神奈川県",
    prefecture: "神奈川県",
  },
  {
    name: "庭田幸恵",
    nameKana: "ニワタ ユキエ",
    party: "国民民主党",
    district: "富山県",
    prefecture: "富山県",
  },
  {
    name: "後藤斎",
    nameKana: "ゴトウ ヒトシ",
    party: "国民民主党",
    district: "山梨県",
    prefecture: "山梨県",
  },
  {
    name: "伊藤孝恵",
    nameKana: "イトウ タカエ",
    party: "国民民主党",
    district: "愛知県",
    prefecture: "愛知県",
  },
  {
    name: "水野孝一",
    nameKana: "ミズノ コウイチ",
    party: "国民民主党",
    district: "愛知県",
    prefecture: "愛知県",
  },
  {
    name: "芳賀道也",
    nameKana: "ハガ ミチヤ",
    party: "国民民主党",
    district: "山形県",
    prefecture: "山形県",
  },
  {
    name: "舟山康江",
    nameKana: "フナヤマ ヤスエ",
    party: "国民民主党",
    district: "山形県",
    prefecture: "山形県",
  },
  {
    name: "榛葉賀津也",
    nameKana: "シンバ カヅヤ",
    party: "国民民主党",
    district: "静岡県",
    prefecture: "静岡県",
  },
  {
    name: "堂込麻紀子",
    nameKana: "ドウゴメ マキコ",
    party: "国民民主党",
    district: "茨城県",
    prefecture: "茨城県",
  },
  {
    name: "原田秀一",
    nameKana: "ハラダ シュウイチ",
    party: "国民民主党",
    district: "香川県",
    prefecture: "香川県",
  },

  // === 比例代表選出 ===
  {
    name: "足立康史",
    nameKana: "アダチ ヤスシ",
    party: "国民民主党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "礒崎哲史",
    nameKana: "イソザキ テツジ",
    party: "国民民主党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "伊藤辰夫",
    nameKana: "イトウ タツオ",
    party: "国民民主党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "川合孝典",
    nameKana: "カワイ タカノリ",
    party: "国民民主党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "竹詰仁",
    nameKana: "タケツメ ヒトシ",
    party: "国民民主党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "田村まみ",
    nameKana: "タムラ マミ",
    party: "国民民主党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "浜口誠",
    nameKana: "ハマグチ マコト",
    party: "国民民主党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "浜野喜史",
    nameKana: "ハマノ ヨシフミ",
    party: "国民民主党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "平戸航太",
    nameKana: "ヒラト コウタ",
    party: "国民民主党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "山田吉彦",
    nameKana: "ヤマダ ヨシヒコ",
    party: "国民民主党",
    district: "比例代表",
    prefecture: null,
  },
];

// ============================================
// 公明党（21名）
// ============================================

const KOMEITO_MEMBERS: CouncillorData[] = [
  // === 選挙区選出 ===
  {
    name: "秋野公造",
    nameKana: "アキノ コウゾウ",
    party: "公明党",
    district: "福岡県",
    prefecture: "福岡県",
  },
  {
    name: "石川博崇",
    nameKana: "イシカワ ヒロタカ",
    party: "公明党",
    district: "大阪府",
    prefecture: "大阪府",
  },
  {
    name: "伊藤孝江",
    nameKana: "イトウ タカエ",
    party: "公明党",
    district: "兵庫県",
    prefecture: "兵庫県",
  },
  {
    name: "川村雄大",
    nameKana: "カワムラ ユウダイ",
    party: "公明党",
    district: "東京都",
    prefecture: "東京都",
  },
  {
    name: "里見隆治",
    nameKana: "サトミ リュウジ",
    party: "公明党",
    district: "愛知県",
    prefecture: "愛知県",
  },
  {
    name: "下野六太",
    nameKana: "シモノ ロクタ",
    party: "公明党",
    district: "福岡県",
    prefecture: "福岡県",
  },
  {
    name: "杉久武",
    nameKana: "スギ ヒサタケ",
    party: "公明党",
    district: "大阪府",
    prefecture: "大阪府",
  },
  {
    name: "高橋光男",
    nameKana: "タカハシ ミツオ",
    party: "公明党",
    district: "兵庫県",
    prefecture: "兵庫県",
  },
  {
    name: "竹谷とし子",
    nameKana: "タケヤ トシコ",
    party: "公明党",
    district: "東京都",
    prefecture: "東京都",
  },
  {
    name: "西田実仁",
    nameKana: "ニシダ マコト",
    party: "公明党",
    district: "埼玉県",
    prefecture: "埼玉県",
  },
  {
    name: "三浦信祐",
    nameKana: "ミウラ ノブヒロ",
    party: "公明党",
    district: "神奈川県",
    prefecture: "神奈川県",
  },

  // === 比例代表選出 ===
  {
    name: "上田勇",
    nameKana: "ウエダ イサム",
    party: "公明党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "窪田哲也",
    nameKana: "クボタ テツヤ",
    party: "公明党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "佐々木雅文",
    nameKana: "ササキ マサフミ",
    party: "公明党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "竹内真二",
    nameKana: "タケウチ シンジ",
    party: "公明党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "谷合正明",
    nameKana: "タニアイ マサアキ",
    party: "公明党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "司隆史",
    nameKana: "ツカサ タカシ",
    party: "公明党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "平木大作",
    nameKana: "ヒラキ ダイサク",
    party: "公明党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "宮崎勝",
    nameKana: "ミヤザキ マサル",
    party: "公明党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "原田大二郎",
    nameKana: "ハラダ ダイジロウ",
    party: "公明党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "横山信一",
    nameKana: "ヨコヤマ シンイチ",
    party: "公明党",
    district: "比例代表",
    prefecture: null,
  },
];

// ============================================
// 日本維新の会（19名）
// ============================================

const ISHIN_MEMBERS: CouncillorData[] = [
  // === 選挙区選出 ===
  {
    name: "浅田均",
    nameKana: "アサダ ヒトシ",
    party: "日本維新の会",
    district: "大阪府",
    prefecture: "大阪府",
  },
  {
    name: "高木かおり",
    nameKana: "タカギ カオリ",
    party: "日本維新の会",
    district: "大阪府",
    prefecture: "大阪府",
  },
  {
    name: "片山大介",
    nameKana: "カタヤマ ダイスケ",
    party: "日本維新の会",
    district: "兵庫県",
    prefecture: "兵庫県",
  },
  {
    name: "松沢成文",
    nameKana: "マツザワ シゲフミ",
    party: "日本維新の会",
    district: "神奈川県",
    prefecture: "神奈川県",
  },
  {
    name: "岡崎太",
    nameKana: "オカザキ フトシ",
    party: "日本維新の会",
    district: "大阪府",
    prefecture: "大阪府",
  },
  {
    name: "新実彰平",
    nameKana: "ニイミ ショウヘイ",
    party: "日本維新の会",
    district: "京都府",
    prefecture: "京都府",
  },
  {
    name: "佐々木りえ",
    nameKana: "ササキ リエ",
    party: "日本維新の会",
    district: "大阪府",
    prefecture: "大阪府",
  },

  // === 比例代表選出 ===
  {
    name: "青島健太",
    nameKana: "アオシマ ケンタ",
    party: "日本維新の会",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "石井苗子",
    nameKana: "イシイ ミツコ",
    party: "日本維新の会",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "石井めぐみ",
    nameKana: "イシイ メグミ",
    party: "日本維新の会",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "猪瀬直樹",
    nameKana: "イノセ ナオキ",
    party: "日本維新の会",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "上野ほたる",
    nameKana: "ウエノ ホタル",
    party: "日本維新の会",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "嘉田由紀子",
    nameKana: "カダ ユキコ",
    party: "日本維新の会",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "金子道仁",
    nameKana: "カネコ ミチヒト",
    party: "日本維新の会",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "串田誠一",
    nameKana: "クシダ セイイチ",
    party: "日本維新の会",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "柴田巧",
    nameKana: "シバタ タクミ",
    party: "日本維新の会",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "石平",
    nameKana: "セキ ヘイ",
    party: "日本維新の会",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "中条きよし",
    nameKana: "チュウジョウ キヨシ",
    party: "日本維新の会",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "松野明美",
    nameKana: "マツノ アケミ",
    party: "日本維新の会",
    district: "比例代表",
    prefecture: null,
  },
];

// ============================================
// 参政党（15名）
// ============================================

const SANSEITO_MEMBERS: CouncillorData[] = [
  // === 選挙区選出 ===
  {
    name: "櫻井祥子",
    nameKana: "サクライ ショウコ",
    party: "参政党",
    district: "茨城県",
    prefecture: "茨城県",
  },
  {
    name: "大津力",
    nameKana: "オオツ ツトム",
    party: "参政党",
    district: "埼玉県",
    prefecture: "埼玉県",
  },
  {
    name: "塩入清香",
    nameKana: "シオイリ サヤカ",
    party: "参政党",
    district: "東京都",
    prefecture: "東京都",
  },
  {
    name: "初鹿野裕樹",
    nameKana: "ハジカノ ユウキ",
    party: "参政党",
    district: "神奈川県",
    prefecture: "神奈川県",
  },
  {
    name: "杉本純子",
    nameKana: "スギモト ジュンコ",
    party: "参政党",
    district: "愛知県",
    prefecture: "愛知県",
  },
  {
    name: "宮出千慧",
    nameKana: "ミヤデ チサト",
    party: "参政党",
    district: "大阪府",
    prefecture: "大阪府",
  },
  {
    name: "中田優子",
    nameKana: "ナカダ ユウコ",
    party: "参政党",
    district: "福岡県",
    prefecture: "福岡県",
  },

  // === 比例代表選出 ===
  {
    name: "神谷宗幣",
    nameKana: "カミヤ ソウヘイ",
    party: "参政党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "安達悠司",
    nameKana: "アダチ ユウジ",
    party: "参政党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "安藤裕",
    nameKana: "アンドウ ヒロシ",
    party: "参政党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "岩本麻奈",
    nameKana: "イワモト マナ",
    party: "参政党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "梅村みずほ",
    nameKana: "ウメムラ ミズホ",
    party: "参政党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "後藤翔太",
    nameKana: "ゴトウ ショウタ",
    party: "参政党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "松田学",
    nameKana: "マツダ マナブ",
    party: "参政党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "山中泉",
    nameKana: "ヤマナカ イズミ",
    party: "参政党",
    district: "比例代表",
    prefecture: null,
  },
];

// ============================================
// 日本共産党（7名）
// ============================================

const JCP_MEMBERS: CouncillorData[] = [
  // === 選挙区選出 ===
  {
    name: "山添拓",
    nameKana: "ヤマゾエ タク",
    party: "日本共産党",
    district: "東京都",
    prefecture: "東京都",
  },
  {
    name: "吉良よし子",
    nameKana: "キラ ヨシコ",
    party: "日本共産党",
    district: "東京都",
    prefecture: "東京都",
  },

  // === 比例代表選出 ===
  {
    name: "小池晃",
    nameKana: "コイケ アキラ",
    party: "日本共産党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "岩渕友",
    nameKana: "イワブチ トモ",
    party: "日本共産党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "大門実紀史",
    nameKana: "ダイモン ミキシ",
    party: "日本共産党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "仁比聡平",
    nameKana: "ニヒ ソウヘイ",
    party: "日本共産党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "白川容子",
    nameKana: "シラカワ ヨウコ",
    party: "日本共産党",
    district: "比例代表",
    prefecture: null,
  },
];

// ============================================
// れいわ新選組（5名）
// ============================================

const REIWA_MEMBERS: CouncillorData[] = [
  {
    name: "大島九州男",
    nameKana: "オオシマ クスオ",
    party: "れいわ新選組",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "天畠大輔",
    nameKana: "テンバタ ダイスケ",
    party: "れいわ新選組",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "木村英子",
    nameKana: "キムラ エイコ",
    party: "れいわ新選組",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "伊勢崎賢治",
    nameKana: "イセザキ ケンジ",
    party: "れいわ新選組",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "奥田ふみよ",
    nameKana: "オクダ フミヨ",
    party: "れいわ新選組",
    district: "比例代表",
    prefecture: null,
  },
];

// ============================================
// 日本保守党（2名）
// ============================================

const HOSHU_MEMBERS: CouncillorData[] = [
  {
    name: "百田尚樹",
    nameKana: "ヒャクタ ナオキ",
    party: "日本保守党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "北村晴男",
    nameKana: "キタムラ ハルオ",
    party: "日本保守党",
    district: "比例代表",
    prefecture: null,
  },
];

// ============================================
// 沖縄の風（2名）
// ============================================

const OKINAWA_MEMBERS: CouncillorData[] = [
  {
    name: "伊波洋一",
    nameKana: "イハ ヨウイチ",
    party: "無所属",
    district: "沖縄県",
    prefecture: "沖縄県",
  },
  {
    name: "高良沙哉",
    nameKana: "タカラ サチカ",
    party: "無所属",
    district: "沖縄県",
    prefecture: "沖縄県",
  },
];

// ============================================
// チームみらい・無所属の会（2名）
// ============================================

const MIRAI_MEMBERS: CouncillorData[] = [
  {
    name: "安野貴博",
    nameKana: "アンノ タカヒロ",
    party: "チームみらい",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "尾辻朋実",
    nameKana: "オツジ トモミ",
    party: "無所属",
    district: "鹿児島県",
    prefecture: "鹿児島県",
  },
];

// ============================================
// 社会民主党（2名）
// ============================================

const SDP_MEMBERS: CouncillorData[] = [
  {
    name: "福島みずほ",
    nameKana: "フクシマ ミズホ",
    party: "社会民主党",
    district: "比例代表",
    prefecture: null,
  },
  {
    name: "ラサール石井",
    nameKana: "ラサール イシイ",
    party: "社会民主党",
    district: "比例代表",
    prefecture: null,
  },
];

// ============================================
// 各派に属しない議員（無所属・6名）
// ============================================

const INDEPENDENT_MEMBERS: CouncillorData[] = [
  {
    name: "関口昌一",
    nameKana: "セキグチ マサカズ",
    party: "自由民主党",
    district: "埼玉県",
    prefecture: "埼玉県",
  }, // 参議院議長のため会派離脱
  {
    name: "平山佐知子",
    nameKana: "ヒラヤマ サチコ",
    party: "無所属",
    district: "静岡県",
    prefecture: "静岡県",
  },
  {
    name: "福山哲郎",
    nameKana: "フクヤマ テツロウ",
    party: "立憲民主党",
    district: "京都府",
    prefecture: "京都府",
  }, // 参議院副議長のため会派離脱
  {
    name: "ながえ孝子",
    nameKana: "ナガエ タカコ",
    party: "無所属",
    district: "愛媛県",
    prefecture: "愛媛県",
  },
  {
    name: "望月良男",
    nameKana: "モチヅキ ヨシオ",
    party: "無所属",
    district: "和歌山県",
    prefecture: "和歌山県",
  },
  {
    name: "齊藤健一郎",
    nameKana: "サイトウ ケンイチロウ",
    party: "無所属",
    district: "比例代表",
    prefecture: null,
  }, // 元NHK党、離党して無所属
];

// ============================================
// 全議員を結合
// ============================================

const ALL_COUNCILLORS: CouncillorData[] = [
  ...LDP_MEMBERS,
  ...CDP_MEMBERS,
  ...DPP_MEMBERS,
  ...KOMEITO_MEMBERS,
  ...ISHIN_MEMBERS,
  ...SANSEITO_MEMBERS,
  ...JCP_MEMBERS,
  ...REIWA_MEMBERS,
  ...HOSHU_MEMBERS,
  ...OKINAWA_MEMBERS,
  ...MIRAI_MEMBERS,
  ...SDP_MEMBERS,
  ...INDEPENDENT_MEMBERS,
];

// ============================================
// メイン処理
// ============================================

/**
 * 安定的な ID を生成する。
 * 氏名からひらがな・カタカナ・漢字をそのまま使うと cuid との衝突が起きうるため、
 * "cou-" プレフィックス + 氏名のハッシュ的な表現を使う。
 */
function makeCouncillorId(name: string): string {
  return `cou-${name}`;
}

export async function seedCouncillors(): Promise<void> {
  console.log("[councillors] 参議院議員データのシードを開始...");
  console.log(`[councillors] 対象議員数: ${ALL_COUNCILLORS.length}名`);

  // キャッシュ
  const partyCache = new Map<string, string>();
  const prefectureCache = new Map<string, string>();

  let upsertCount = 0;
  let skipCount = 0;

  for (const councillor of ALL_COUNCILLORS) {
    // --- 政党の解決 ---
    let partyId: string | null = null;

    if (partyCache.has(councillor.party)) {
      partyId = partyCache.get(councillor.party)!;
    } else {
      const party = await prisma.party.findFirst({
        where: { name: councillor.party },
      });
      if (party) {
        partyCache.set(councillor.party, party.id);
        partyId = party.id;
      } else {
        // "社民党" → "社会民主党" のフォールバック
        if (councillor.party === "社民党") {
          const sdp = await prisma.party.findFirst({
            where: { name: "社会民主党" },
          });
          if (sdp) {
            partyCache.set(councillor.party, sdp.id);
            partyId = sdp.id;
          }
        }
        if (!partyId) {
          console.warn(
            `[councillors]   政党が見つかりません: ${councillor.party} (${councillor.name})`,
          );
        }
      }
    }

    // --- 都道府県の解決 ---
    let prefectureId: string | null = null;

    if (councillor.prefecture) {
      if (prefectureCache.has(councillor.prefecture)) {
        prefectureId = prefectureCache.get(councillor.prefecture)!;
      } else {
        const pref = await prisma.prefecture.findFirst({
          where: { name: councillor.prefecture },
        });
        if (pref) {
          prefectureCache.set(councillor.prefecture, pref.id);
          prefectureId = pref.id;
        } else {
          console.warn(
            `[councillors]   都道府県が見つかりません: ${councillor.prefecture} (${councillor.name})`,
          );
        }
      }
    }

    // --- 議員を upsert ---
    const id = makeCouncillorId(councillor.name);

    try {
      await prisma.politician.upsert({
        where: { id },
        update: {
          name: councillor.name,
          nameKana: councillor.nameKana,
          partyId,
          chamber: "HOUSE_OF_COUNCILLORS",
          district: councillor.district,
          prefectureId,
          isActive: true,
        },
        create: {
          id,
          name: councillor.name,
          nameKana: councillor.nameKana,
          partyId,
          chamber: "HOUSE_OF_COUNCILLORS",
          district: councillor.district,
          prefectureId,
          isActive: true,
        },
      });

      upsertCount++;

      if (upsertCount % 50 === 0) {
        console.log(`[councillors]   ${upsertCount}名処理済み...`);
      }
    } catch (error) {
      skipCount++;
      console.error(
        `[councillors]   エラー: ${councillor.name} — ${error instanceof Error ? error.message : error}`,
      );
    }
  }

  // --- サマリー ---
  const partyCounts = new Map<string, number>();
  for (const c of ALL_COUNCILLORS) {
    partyCounts.set(c.party, (partyCounts.get(c.party) ?? 0) + 1);
  }

  console.log("[councillors] --- 政党別議員数 ---");
  for (const [party, count] of [...partyCounts.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`[councillors]   ${party}: ${count}名`);
  }

  console.log(`[councillors] 完了 — ${upsertCount}名登録, ${skipCount}名スキップ`);
}

// CLI実行
if (process.argv[1]?.includes("politicians/seed-councillors")) {
  seedCouncillors()
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
