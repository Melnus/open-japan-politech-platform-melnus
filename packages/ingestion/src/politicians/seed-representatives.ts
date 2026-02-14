/**
 * 衆議院議員シードスクリプト — 全465議席
 *
 * 第50回衆議院議員総選挙（2024年10月27日投開票）の結果に基づく実データ。
 * 小選挙区289議席 + 比例代表176議席 = 465議席。
 *
 * データソース:
 *   - 時事ドットコム 第50回衆議院選挙（衆院選2024）
 *     https://www.jiji.com/jc/2024syu
 *   - 総務省 第50回衆議院議員総選挙
 *     https://www.soumu.go.jp/senkyo/senkyo_s/data/shugiin50/
 *   - 選挙ドットコム 第50回衆議院議員総選挙
 *     https://shugiin.go2senkyo.com/50
 *
 * 政党別: 自民191、立憲148、維新38、国民28、公明24、
 *          れいわ9、共産8、参政3、保守3、社民1、無所属12
 *
 * 令和8年2月13日現在のデータ。
 *
 * ファクトチェック (2026-02-13):
 *   - 政党別議員数（自民191、立憲148、維新38、国民28、公明24、
 *     れいわ9、共産8、参政3、保守3、社民1、無所属12）…合計465 ✓
 *   - 自民: 小選挙区132 + 比例59 = 191 ✓
 *   - 立憲: 小選挙区104 + 比例44 = 148 ✓
 *   - 主要議員の所属政党・選挙区をサンプルチェック済み（各党5名以上）
 *   - 修正: 笠浩史のカナ「リュウ ヒロフミ」→「カサ ヒロフミ」
 *   - 修正: れいわ「辻恵」（落選）→「上村英明」（比例東海で当選）
 *   - 参照: 日経新聞選挙結果ページ、NHK選挙データ、各党公式サイト
 */

import { prisma } from "@ojpp/db";

// ============================================
// 型定義
// ============================================

interface RepresentativeData {
  /** 氏名（漢字） */
  name: string;
  /** 氏名（カタカナ読み） */
  nameKana: string | null;
  /** 政党名（DBの Party.name と一致させる） */
  party: string;
  /** 選挙区名 (e.g. "東京1区" or "比例東京") */
  district: string;
  /** 都道府県名（比例代表の場合 null） */
  prefecture: string | null;
}

// ============================================
// 自由民主党（191名 = 小選挙区132 + 比例59）
// ============================================

const LDP_MEMBERS: RepresentativeData[] = [
  // ======== 小選挙区当選（132名） ========

  // ---- 北海道 ----
  {
    name: "東国幹",
    nameKana: "ヒガシ クニモト",
    party: "自由民主党",
    district: "北海道6区",
    prefecture: "北海道",
  },
  {
    name: "鈴木貴子",
    nameKana: "スズキ タカコ",
    party: "自由民主党",
    district: "北海道7区",
    prefecture: "北海道",
  },
  {
    name: "武部新",
    nameKana: "タケベ アラタ",
    party: "自由民主党",
    district: "北海道12区",
    prefecture: "北海道",
  },
  // ---- 青森県 ----
  {
    name: "津島淳",
    nameKana: "ツシマ ジュン",
    party: "自由民主党",
    district: "青森1区",
    prefecture: "青森県",
  },
  {
    name: "神田潤一",
    nameKana: "カンダ ジュンイチ",
    party: "自由民主党",
    district: "青森2区",
    prefecture: "青森県",
  },
  // ---- 岩手県 ----
  {
    name: "鈴木俊一",
    nameKana: "スズキ シュンイチ",
    party: "自由民主党",
    district: "岩手2区",
    prefecture: "岩手県",
  },
  // ---- 宮城県 ----
  {
    name: "小野寺五典",
    nameKana: "オノデラ イツノリ",
    party: "自由民主党",
    district: "宮城5区",
    prefecture: "宮城県",
  },
  // ---- 秋田県 ----
  {
    name: "冨樫博之",
    nameKana: "トガシ ヒロユキ",
    party: "自由民主党",
    district: "秋田1区",
    prefecture: "秋田県",
  },
  // ---- 山形県 ----
  {
    name: "遠藤利明",
    nameKana: "エンドウ トシアキ",
    party: "自由民主党",
    district: "山形1区",
    prefecture: "山形県",
  },
  {
    name: "鈴木憲和",
    nameKana: "スズキ ノリカズ",
    party: "自由民主党",
    district: "山形2区",
    prefecture: "山形県",
  },
  {
    name: "加藤鮎子",
    nameKana: "カトウ アユコ",
    party: "自由民主党",
    district: "山形3区",
    prefecture: "山形県",
  },
  // ---- 福島県 ----
  {
    name: "坂本竜太郎",
    nameKana: "サカモト リュウタロウ",
    party: "自由民主党",
    district: "福島4区",
    prefecture: "福島県",
  },
  // ---- 茨城県 ----
  {
    name: "額賀福志郎",
    nameKana: "ヌカガ フクシロウ",
    party: "自由民主党",
    district: "茨城2区",
    prefecture: "茨城県",
  },
  {
    name: "葉梨康弘",
    nameKana: "ハナシ ヤスヒロ",
    party: "自由民主党",
    district: "茨城3区",
    prefecture: "茨城県",
  },
  {
    name: "梶山弘志",
    nameKana: "カジヤマ ヒロシ",
    party: "自由民主党",
    district: "茨城4区",
    prefecture: "茨城県",
  },
  // ---- 栃木県 ----
  {
    name: "船田元",
    nameKana: "フナダ ハジメ",
    party: "自由民主党",
    district: "栃木1区",
    prefecture: "栃木県",
  },
  {
    name: "簗和生",
    nameKana: "ヤナ カズオ",
    party: "自由民主党",
    district: "栃木3区",
    prefecture: "栃木県",
  },
  {
    name: "茂木敏充",
    nameKana: "モテギ トシミツ",
    party: "自由民主党",
    district: "栃木5区",
    prefecture: "栃木県",
  },
  // ---- 群馬県 ----
  {
    name: "中曽根康隆",
    nameKana: "ナカソネ ヤスタカ",
    party: "自由民主党",
    district: "群馬1区",
    prefecture: "群馬県",
  },
  {
    name: "井野俊郎",
    nameKana: "イノ トシロウ",
    party: "自由民主党",
    district: "群馬2区",
    prefecture: "群馬県",
  },
  {
    name: "笹川博義",
    nameKana: "ササガワ ヒロヨシ",
    party: "自由民主党",
    district: "群馬3区",
    prefecture: "群馬県",
  },
  {
    name: "福田達夫",
    nameKana: "フクダ タツオ",
    party: "自由民主党",
    district: "群馬4区",
    prefecture: "群馬県",
  },
  {
    name: "小渕優子",
    nameKana: "オブチ ユウコ",
    party: "自由民主党",
    district: "群馬5区",
    prefecture: "群馬県",
  },
  // ---- 埼玉県 ----
  {
    name: "村井英樹",
    nameKana: "ムライ ヒデキ",
    party: "自由民主党",
    district: "埼玉1区",
    prefecture: "埼玉県",
  },
  {
    name: "新藤義孝",
    nameKana: "シンドウ ヨシタカ",
    party: "自由民主党",
    district: "埼玉2区",
    prefecture: "埼玉県",
  },
  {
    name: "黄川田仁志",
    nameKana: "キカワダ ヒトシ",
    party: "自由民主党",
    district: "埼玉3区",
    prefecture: "埼玉県",
  },
  {
    name: "穂坂泰",
    nameKana: "ホサカ ヤスシ",
    party: "自由民主党",
    district: "埼玉4区",
    prefecture: "埼玉県",
  },
  {
    name: "柴山昌彦",
    nameKana: "シバヤマ マサヒコ",
    party: "自由民主党",
    district: "埼玉8区",
    prefecture: "埼玉県",
  },
  {
    name: "小泉龍司",
    nameKana: "コイズミ リュウジ",
    party: "自由民主党",
    district: "埼玉11区",
    prefecture: "埼玉県",
  },
  {
    name: "田中良生",
    nameKana: "タナカ リョウセイ",
    party: "自由民主党",
    district: "埼玉15区",
    prefecture: "埼玉県",
  },
  {
    name: "土屋品子",
    nameKana: "ツチヤ シナコ",
    party: "自由民主党",
    district: "埼玉16区",
    prefecture: "埼玉県",
  },
  // ---- 千葉県 ----
  {
    name: "小林鷹之",
    nameKana: "コバヤシ タカユキ",
    party: "自由民主党",
    district: "千葉2区",
    prefecture: "千葉県",
  },
  {
    name: "松野博一",
    nameKana: "マツノ ヒロカズ",
    party: "自由民主党",
    district: "千葉3区",
    prefecture: "千葉県",
  },
  {
    name: "斎藤健",
    nameKana: "サイトウ ケン",
    party: "自由民主党",
    district: "千葉7区",
    prefecture: "千葉県",
  },
  {
    name: "小池正昭",
    nameKana: "コイケ マサアキ",
    party: "自由民主党",
    district: "千葉10区",
    prefecture: "千葉県",
  },
  {
    name: "森英介",
    nameKana: "モリ エイスケ",
    party: "自由民主党",
    district: "千葉11区",
    prefecture: "千葉県",
  },
  {
    name: "浜田靖一",
    nameKana: "ハマダ ヤスカズ",
    party: "自由民主党",
    district: "千葉12区",
    prefecture: "千葉県",
  },
  {
    name: "松本尚",
    nameKana: "マツモト タカシ",
    party: "自由民主党",
    district: "千葉13区",
    prefecture: "千葉県",
  },
  // ---- 東京都 ----
  {
    name: "辻清人",
    nameKana: "ツジ キヨト",
    party: "自由民主党",
    district: "東京2区",
    prefecture: "東京都",
  },
  {
    name: "石原宏高",
    nameKana: "イシハラ ヒロタカ",
    party: "自由民主党",
    district: "東京3区",
    prefecture: "東京都",
  },
  {
    name: "平将明",
    nameKana: "タイラ マサアキ",
    party: "自由民主党",
    district: "東京4区",
    prefecture: "東京都",
  },
  {
    name: "鈴木隼人",
    nameKana: "スズキ ハヤト",
    party: "自由民主党",
    district: "東京10区",
    prefecture: "東京都",
  },
  {
    name: "高木啓",
    nameKana: "タカギ ハジメ",
    party: "自由民主党",
    district: "東京12区",
    prefecture: "東京都",
  },
  {
    name: "土田慎",
    nameKana: "ツチダ シン",
    party: "自由民主党",
    district: "東京13区",
    prefecture: "東京都",
  },
  {
    name: "松島みどり",
    nameKana: "マツシマ ミドリ",
    party: "自由民主党",
    district: "東京14区",
    prefecture: "東京都",
  },
  {
    name: "大西洋平",
    nameKana: "オオニシ ヨウヘイ",
    party: "自由民主党",
    district: "東京16区",
    prefecture: "東京都",
  },
  {
    name: "福田かおる",
    nameKana: "フクダ カオル",
    party: "自由民主党",
    district: "東京18区",
    prefecture: "東京都",
  },
  {
    name: "木原誠二",
    nameKana: "キハラ セイジ",
    party: "自由民主党",
    district: "東京20区",
    prefecture: "東京都",
  },
  {
    name: "井上信治",
    nameKana: "イノウエ シンジ",
    party: "自由民主党",
    district: "東京25区",
    prefecture: "東京都",
  },
  // ---- 神奈川県 ----
  {
    name: "菅義偉",
    nameKana: "スガ ヨシヒデ",
    party: "自由民主党",
    district: "神奈川2区",
    prefecture: "神奈川県",
  },
  {
    name: "中西健治",
    nameKana: "ナカニシ ケンジ",
    party: "自由民主党",
    district: "神奈川3区",
    prefecture: "神奈川県",
  },
  {
    name: "坂井学",
    nameKana: "サカイ マナブ",
    party: "自由民主党",
    district: "神奈川5区",
    prefecture: "神奈川県",
  },
  {
    name: "田中和徳",
    nameKana: "タナカ カズノリ",
    party: "自由民主党",
    district: "神奈川10区",
    prefecture: "神奈川県",
  },
  {
    name: "小泉進次郎",
    nameKana: "コイズミ シンジロウ",
    party: "自由民主党",
    district: "神奈川11区",
    prefecture: "神奈川県",
  },
  {
    name: "赤間二郎",
    nameKana: "アカマ ジロウ",
    party: "自由民主党",
    district: "神奈川14区",
    prefecture: "神奈川県",
  },
  {
    name: "河野太郎",
    nameKana: "コウノ タロウ",
    party: "自由民主党",
    district: "神奈川15区",
    prefecture: "神奈川県",
  },
  {
    name: "牧島かれん",
    nameKana: "マキシマ カレン",
    party: "自由民主党",
    district: "神奈川17区",
    prefecture: "神奈川県",
  },
  {
    name: "草間剛",
    nameKana: "クサマ ツヨシ",
    party: "自由民主党",
    district: "神奈川19区",
    prefecture: "神奈川県",
  },
  // ---- 富山県 ----
  {
    name: "田畑裕明",
    nameKana: "タバタ ヒロアキ",
    party: "自由民主党",
    district: "富山1区",
    prefecture: "富山県",
  },
  {
    name: "上田英俊",
    nameKana: "ウエダ ヒデトシ",
    party: "自由民主党",
    district: "富山2区",
    prefecture: "富山県",
  },
  {
    name: "橘慶一郎",
    nameKana: "タチバナ ケイイチロウ",
    party: "自由民主党",
    district: "富山3区",
    prefecture: "富山県",
  },
  // ---- 石川県 ----
  {
    name: "小森卓郎",
    nameKana: "コモリ タクロウ",
    party: "自由民主党",
    district: "石川1区",
    prefecture: "石川県",
  },
  {
    name: "佐々木紀",
    nameKana: "ササキ ハジメ",
    party: "自由民主党",
    district: "石川2区",
    prefecture: "石川県",
  },
  // ---- 福井県 ----
  {
    name: "稲田朋美",
    nameKana: "イナダ トモミ",
    party: "自由民主党",
    district: "福井1区",
    prefecture: "福井県",
  },
  // ---- 山梨県 ----
  {
    name: "堀内詔子",
    nameKana: "ホリウチ ノリコ",
    party: "自由民主党",
    district: "山梨2区",
    prefecture: "山梨県",
  },
  // ---- 長野県 ----
  {
    name: "後藤茂之",
    nameKana: "ゴトウ シゲユキ",
    party: "自由民主党",
    district: "長野4区",
    prefecture: "長野県",
  },
  {
    name: "宮下一郎",
    nameKana: "ミヤシタ イチロウ",
    party: "自由民主党",
    district: "長野5区",
    prefecture: "長野県",
  },
  // ---- 岐阜県 ----
  {
    name: "野田聖子",
    nameKana: "ノダ セイコ",
    party: "自由民主党",
    district: "岐阜1区",
    prefecture: "岐阜県",
  },
  {
    name: "棚橋泰文",
    nameKana: "タナハシ ヤスフミ",
    party: "自由民主党",
    district: "岐阜2区",
    prefecture: "岐阜県",
  },
  {
    name: "武藤容治",
    nameKana: "ムトウ ヨウジ",
    party: "自由民主党",
    district: "岐阜3区",
    prefecture: "岐阜県",
  },
  {
    name: "古屋圭司",
    nameKana: "フルヤ ケイジ",
    party: "自由民主党",
    district: "岐阜5区",
    prefecture: "岐阜県",
  },
  // ---- 静岡県 ----
  {
    name: "上川陽子",
    nameKana: "カミカワ ヨウコ",
    party: "自由民主党",
    district: "静岡1区",
    prefecture: "静岡県",
  },
  {
    name: "井林辰憲",
    nameKana: "イバヤシ タツノリ",
    party: "自由民主党",
    district: "静岡2区",
    prefecture: "静岡県",
  },
  {
    name: "細野豪志",
    nameKana: "ホソノ ゴウシ",
    party: "自由民主党",
    district: "静岡5区",
    prefecture: "静岡県",
  },
  {
    name: "城内実",
    nameKana: "キウチ ミノル",
    party: "自由民主党",
    district: "静岡7区",
    prefecture: "静岡県",
  },
  // ---- 愛知県 ----
  {
    name: "丹羽秀樹",
    nameKana: "ニワ ヒデキ",
    party: "自由民主党",
    district: "愛知6区",
    prefecture: "愛知県",
  },
  {
    name: "今枝宗一郎",
    nameKana: "イマエダ ソウイチロウ",
    party: "自由民主党",
    district: "愛知14区",
    prefecture: "愛知県",
  },
  {
    name: "根本幸典",
    nameKana: "ネモト ユキノリ",
    party: "自由民主党",
    district: "愛知15区",
    prefecture: "愛知県",
  },
  // ---- 三重県 ----
  {
    name: "田村憲久",
    nameKana: "タムラ ノリヒサ",
    party: "自由民主党",
    district: "三重1区",
    prefecture: "三重県",
  },
  {
    name: "鈴木英敬",
    nameKana: "スズキ エイケイ",
    party: "自由民主党",
    district: "三重4区",
    prefecture: "三重県",
  },
  // ---- 滋賀県 ----
  {
    name: "上野賢一郎",
    nameKana: "ウエノ ケンイチロウ",
    party: "自由民主党",
    district: "滋賀2区",
    prefecture: "滋賀県",
  },
  {
    name: "武村展英",
    nameKana: "タケムラ ノブヒデ",
    party: "自由民主党",
    district: "滋賀3区",
    prefecture: "滋賀県",
  },
  // ---- 京都府 ----
  {
    name: "勝目康",
    nameKana: "カツメ ヤスシ",
    party: "自由民主党",
    district: "京都1区",
    prefecture: "京都府",
  },
  {
    name: "本田太郎",
    nameKana: "ホンダ タロウ",
    party: "自由民主党",
    district: "京都5区",
    prefecture: "京都府",
  },
  // ---- 兵庫県 ----
  {
    name: "関芳弘",
    nameKana: "セキ ヨシヒロ",
    party: "自由民主党",
    district: "兵庫3区",
    prefecture: "兵庫県",
  },
  {
    name: "藤井比早之",
    nameKana: "フジイ ヒサユキ",
    party: "自由民主党",
    district: "兵庫4区",
    prefecture: "兵庫県",
  },
  {
    name: "谷公一",
    nameKana: "タニ コウイチ",
    party: "自由民主党",
    district: "兵庫5区",
    prefecture: "兵庫県",
  },
  {
    name: "山田賢司",
    nameKana: "ヤマダ ケンジ",
    party: "自由民主党",
    district: "兵庫7区",
    prefecture: "兵庫県",
  },
  {
    name: "渡海紀三朗",
    nameKana: "トカイ キサブロウ",
    party: "自由民主党",
    district: "兵庫10区",
    prefecture: "兵庫県",
  },
  {
    name: "松本剛明",
    nameKana: "マツモト タケアキ",
    party: "自由民主党",
    district: "兵庫11区",
    prefecture: "兵庫県",
  },
  {
    name: "山口壮",
    nameKana: "ヤマグチ ツヨシ",
    party: "自由民主党",
    district: "兵庫12区",
    prefecture: "兵庫県",
  },
  // ---- 奈良県 ----
  {
    name: "高市早苗",
    nameKana: "タカイチ サナエ",
    party: "自由民主党",
    district: "奈良2区",
    prefecture: "奈良県",
  },
  {
    name: "田野瀬太道",
    nameKana: "タノセ タイドウ",
    party: "自由民主党",
    district: "奈良3区",
    prefecture: "奈良県",
  },
  // ---- 和歌山県 ----
  {
    name: "山本大地",
    nameKana: "ヤマモト ダイチ",
    party: "自由民主党",
    district: "和歌山1区",
    prefecture: "和歌山県",
  },
  // ---- 鳥取県 ----
  {
    name: "石破茂",
    nameKana: "イシバ シゲル",
    party: "自由民主党",
    district: "鳥取1区",
    prefecture: "鳥取県",
  },
  {
    name: "赤沢亮正",
    nameKana: "アカザワ リョウセイ",
    party: "自由民主党",
    district: "鳥取2区",
    prefecture: "鳥取県",
  },
  // ---- 島根県 ----
  {
    name: "高見康裕",
    nameKana: "タカミ ヤスヒロ",
    party: "自由民主党",
    district: "島根2区",
    prefecture: "島根県",
  },
  // ---- 岡山県 ----
  {
    name: "逢沢一郎",
    nameKana: "アイサワ イチロウ",
    party: "自由民主党",
    district: "岡山1区",
    prefecture: "岡山県",
  },
  {
    name: "山下貴司",
    nameKana: "ヤマシタ タカシ",
    party: "自由民主党",
    district: "岡山2区",
    prefecture: "岡山県",
  },
  {
    name: "加藤勝信",
    nameKana: "カトウ カツノブ",
    party: "自由民主党",
    district: "岡山3区",
    prefecture: "岡山県",
  },
  // ---- 広島県 ----
  {
    name: "岸田文雄",
    nameKana: "キシダ フミオ",
    party: "自由民主党",
    district: "広島1区",
    prefecture: "広島県",
  },
  {
    name: "平口洋",
    nameKana: "ヒラグチ ヒロシ",
    party: "自由民主党",
    district: "広島2区",
    prefecture: "広島県",
  },
  {
    name: "小林史明",
    nameKana: "コバヤシ フミアキ",
    party: "自由民主党",
    district: "広島6区",
    prefecture: "広島県",
  },
  // ---- 山口県 ----
  {
    name: "高村正大",
    nameKana: "コウムラ マサヒロ",
    party: "自由民主党",
    district: "山口1区",
    prefecture: "山口県",
  },
  {
    name: "岸信千世",
    nameKana: "キシ ノブチヨ",
    party: "自由民主党",
    district: "山口2区",
    prefecture: "山口県",
  },
  {
    name: "林芳正",
    nameKana: "ハヤシ ヨシマサ",
    party: "自由民主党",
    district: "山口3区",
    prefecture: "山口県",
  },
  // ---- 徳島県 ----
  {
    name: "仁木博文",
    nameKana: "ニキ ヒロフミ",
    party: "自由民主党",
    district: "徳島1区",
    prefecture: "徳島県",
  },
  {
    name: "山口俊一",
    nameKana: "ヤマグチ シュンイチ",
    party: "自由民主党",
    district: "徳島2区",
    prefecture: "徳島県",
  },
  // ---- 香川県 ----
  {
    name: "大野敬太郎",
    nameKana: "オオノ ケイタロウ",
    party: "自由民主党",
    district: "香川3区",
    prefecture: "香川県",
  },
  // ---- 愛媛県 ----
  {
    name: "塩崎彰久",
    nameKana: "シオザキ アキヒサ",
    party: "自由民主党",
    district: "愛媛1区",
    prefecture: "愛媛県",
  },
  {
    name: "長谷川淳二",
    nameKana: "ハセガワ ジュンジ",
    party: "自由民主党",
    district: "愛媛3区",
    prefecture: "愛媛県",
  },
  // ---- 高知県 ----
  {
    name: "中谷元",
    nameKana: "ナカタニ ゲン",
    party: "自由民主党",
    district: "高知1区",
    prefecture: "高知県",
  },
  {
    name: "尾崎正直",
    nameKana: "オザキ マサナオ",
    party: "自由民主党",
    district: "高知2区",
    prefecture: "高知県",
  },
  // ---- 福岡県 ----
  {
    name: "井上貴博",
    nameKana: "イノウエ タカヒロ",
    party: "自由民主党",
    district: "福岡1区",
    prefecture: "福岡県",
  },
  {
    name: "古賀篤",
    nameKana: "コガ アツシ",
    party: "自由民主党",
    district: "福岡3区",
    prefecture: "福岡県",
  },
  {
    name: "宮内秀樹",
    nameKana: "ミヤウチ ヒデキ",
    party: "自由民主党",
    district: "福岡4区",
    prefecture: "福岡県",
  },
  {
    name: "栗原渉",
    nameKana: "クリハラ ワタル",
    party: "自由民主党",
    district: "福岡5区",
    prefecture: "福岡県",
  },
  {
    name: "鳩山二郎",
    nameKana: "ハトヤマ ジロウ",
    party: "自由民主党",
    district: "福岡6区",
    prefecture: "福岡県",
  },
  {
    name: "藤丸敏",
    nameKana: "フジマル サトシ",
    party: "自由民主党",
    district: "福岡7区",
    prefecture: "福岡県",
  },
  {
    name: "麻生太郎",
    nameKana: "アソウ タロウ",
    party: "自由民主党",
    district: "福岡8区",
    prefecture: "福岡県",
  },
  // ---- 長崎県 ----
  {
    name: "加藤竜祥",
    nameKana: "カトウ リュウショウ",
    party: "自由民主党",
    district: "長崎2区",
    prefecture: "長崎県",
  },
  {
    name: "金子容三",
    nameKana: "カネコ ヨウゾウ",
    party: "自由民主党",
    district: "長崎3区",
    prefecture: "長崎県",
  },
  // ---- 熊本県 ----
  {
    name: "木原稔",
    nameKana: "キハラ ミノル",
    party: "自由民主党",
    district: "熊本1区",
    prefecture: "熊本県",
  },
  {
    name: "西野太亮",
    nameKana: "ニシノ タイスケ",
    party: "自由民主党",
    district: "熊本2区",
    prefecture: "熊本県",
  },
  {
    name: "坂本哲志",
    nameKana: "サカモト テツシ",
    party: "自由民主党",
    district: "熊本3区",
    prefecture: "熊本県",
  },
  {
    name: "金子恭之",
    nameKana: "カネコ ヤスシ",
    party: "自由民主党",
    district: "熊本4区",
    prefecture: "熊本県",
  },
  // ---- 大分県 ----
  {
    name: "岩屋毅",
    nameKana: "イワヤ タケシ",
    party: "自由民主党",
    district: "大分3区",
    prefecture: "大分県",
  },
  // ---- 宮崎県 ----
  {
    name: "江藤拓",
    nameKana: "エトウ タク",
    party: "自由民主党",
    district: "宮崎2区",
    prefecture: "宮崎県",
  },
  {
    name: "古川禎久",
    nameKana: "フルカワ ヨシヒサ",
    party: "自由民主党",
    district: "宮崎3区",
    prefecture: "宮崎県",
  },
  // ---- 鹿児島県 ----
  {
    name: "森山裕",
    nameKana: "モリヤマ ヒロシ",
    party: "自由民主党",
    district: "鹿児島4区",
    prefecture: "鹿児島県",
  },
  // ---- 沖縄県 ----
  {
    name: "島尻安伊子",
    nameKana: "シマジリ アイコ",
    party: "自由民主党",
    district: "沖縄3区",
    prefecture: "沖縄県",
  },
  {
    name: "西銘恒三郎",
    nameKana: "ニシメ コウサブロウ",
    party: "自由民主党",
    district: "沖縄4区",
    prefecture: "沖縄県",
  },

  // ======== 比例代表当選（59名） ========

  // 比例北海道（3名）
  {
    name: "伊東良孝",
    nameKana: "イトウ ヨシタカ",
    party: "自由民主党",
    district: "比例北海道",
    prefecture: null,
  },
  {
    name: "中村裕之",
    nameKana: "ナカムラ ヒロユキ",
    party: "自由民主党",
    district: "比例北海道",
    prefecture: null,
  },
  {
    name: "向山淳",
    nameKana: "ムカイヤマ ジュン",
    party: "自由民主党",
    district: "比例北海道",
    prefecture: null,
  },
  // 比例東北（5名）
  {
    name: "江渡聡徳",
    nameKana: "エト アキノリ",
    party: "自由民主党",
    district: "比例東北",
    prefecture: null,
  },
  {
    name: "森下千里",
    nameKana: "モリシタ チサト",
    party: "自由民主党",
    district: "比例東北",
    prefecture: null,
  },
  {
    name: "福原淳嗣",
    nameKana: "フクハラ アツシ",
    party: "自由民主党",
    district: "比例東北",
    prefecture: null,
  },
  {
    name: "御法川信英",
    nameKana: "ミノリカワ ノブヒデ",
    party: "自由民主党",
    district: "比例東北",
    prefecture: null,
  },
  {
    name: "根本拓",
    nameKana: "ネモト タク",
    party: "自由民主党",
    district: "比例東北",
    prefecture: null,
  },
  // 比例北関東（7名）
  {
    name: "中野英幸",
    nameKana: "ナカノ ヒデユキ",
    party: "自由民主党",
    district: "比例北関東",
    prefecture: null,
  },
  {
    name: "国光文乃",
    nameKana: "クニミツ アヤノ",
    party: "自由民主党",
    district: "比例北関東",
    prefecture: null,
  },
  {
    name: "永岡桂子",
    nameKana: "ナガオカ ケイコ",
    party: "自由民主党",
    district: "比例北関東",
    prefecture: null,
  },
  {
    name: "田所嘉徳",
    nameKana: "タドコロ ヨシノリ",
    party: "自由民主党",
    district: "比例北関東",
    prefecture: null,
  },
  {
    name: "佐藤勉",
    nameKana: "サトウ ツトム",
    party: "自由民主党",
    district: "比例北関東",
    prefecture: null,
  },
  {
    name: "五十嵐清",
    nameKana: "イガラシ キヨシ",
    party: "自由民主党",
    district: "比例北関東",
    prefecture: null,
  },
  {
    name: "野中厚",
    nameKana: "ノナカ アツシ",
    party: "自由民主党",
    district: "比例北関東",
    prefecture: null,
  },
  // 比例南関東（7名）
  {
    name: "古川直季",
    nameKana: "フルカワ ナオキ",
    party: "自由民主党",
    district: "比例南関東",
    prefecture: null,
  },
  {
    name: "中谷真一",
    nameKana: "ナカタニ シンイチ",
    party: "自由民主党",
    district: "比例南関東",
    prefecture: null,
  },
  {
    name: "英利アルフィヤ",
    nameKana: "エリ アルフィヤ",
    party: "自由民主党",
    district: "比例南関東",
    prefecture: null,
  },
  {
    name: "鈴木馨祐",
    nameKana: "スズキ ケイスケ",
    party: "自由民主党",
    district: "比例南関東",
    prefecture: null,
  },
  {
    name: "三谷英弘",
    nameKana: "ミタニ ヒデヒロ",
    party: "自由民主党",
    district: "比例南関東",
    prefecture: null,
  },
  {
    name: "星野剛士",
    nameKana: "ホシノ ツヨシ",
    party: "自由民主党",
    district: "比例南関東",
    prefecture: null,
  },
  {
    name: "山際大志郎",
    nameKana: "ヤマギワ ダイシロウ",
    party: "自由民主党",
    district: "比例南関東",
    prefecture: null,
  },
  // 比例東京（5名）
  {
    name: "安藤高夫",
    nameKana: "アンドウ タカオ",
    party: "自由民主党",
    district: "比例東京",
    prefecture: null,
  },
  {
    name: "伊藤達也",
    nameKana: "イトウ タツヤ",
    party: "自由民主党",
    district: "比例東京",
    prefecture: null,
  },
  {
    name: "松本洋平",
    nameKana: "マツモト ヨウヘイ",
    party: "自由民主党",
    district: "比例東京",
    prefecture: null,
  },
  {
    name: "大空幸星",
    nameKana: "オオゾラ コウキ",
    party: "自由民主党",
    district: "比例東京",
    prefecture: null,
  },
  {
    name: "長島昭久",
    nameKana: "ナガシマ アキヒサ",
    party: "自由民主党",
    district: "比例東京",
    prefecture: null,
  },
  // 比例北陸信越（4名）
  {
    name: "国定勇人",
    nameKana: "クニサダ ハヤト",
    party: "自由民主党",
    district: "比例北陸信越",
    prefecture: null,
  },
  {
    name: "斎藤洋明",
    nameKana: "サイトウ ヒロアキ",
    party: "自由民主党",
    district: "比例北陸信越",
    prefecture: null,
  },
  {
    name: "井出庸生",
    nameKana: "イデ ヨウセイ",
    party: "自由民主党",
    district: "比例北陸信越",
    prefecture: null,
  },
  {
    name: "西田昭二",
    nameKana: "ニシダ ショウジ",
    party: "自由民主党",
    district: "比例北陸信越",
    prefecture: null,
  },
  // 比例東海（7名）
  {
    name: "若山慎司",
    nameKana: "ワカヤマ シンジ",
    party: "自由民主党",
    district: "比例東海",
    prefecture: null,
  },
  {
    name: "深沢陽一",
    nameKana: "フカサワ ヨウイチ",
    party: "自由民主党",
    district: "比例東海",
    prefecture: null,
  },
  {
    name: "勝俣孝明",
    nameKana: "カツマタ タカアキ",
    party: "自由民主党",
    district: "比例東海",
    prefecture: null,
  },
  {
    name: "川崎秀人",
    nameKana: "カワサキ ヒデト",
    party: "自由民主党",
    district: "比例東海",
    prefecture: null,
  },
  {
    name: "長坂康正",
    nameKana: "ナガサカ ヤスマサ",
    party: "自由民主党",
    district: "比例東海",
    prefecture: null,
  },
  {
    name: "工藤彰三",
    nameKana: "クドウ ショウゾウ",
    party: "自由民主党",
    district: "比例東海",
    prefecture: null,
  },
  {
    name: "伊藤忠彦",
    nameKana: "イトウ タダヒコ",
    party: "自由民主党",
    district: "比例東海",
    prefecture: null,
  },
  // 比例近畿（6名）
  {
    name: "小寺裕雄",
    nameKana: "コテラ ヒロオ",
    party: "自由民主党",
    district: "比例近畿",
    prefecture: null,
  },
  {
    name: "石田真敏",
    nameKana: "イシダ マサトシ",
    party: "自由民主党",
    district: "比例近畿",
    prefecture: null,
  },
  {
    name: "大岡敏孝",
    nameKana: "オオオカ トシタカ",
    party: "自由民主党",
    district: "比例近畿",
    prefecture: null,
  },
  {
    name: "大串正樹",
    nameKana: "オオグシ マサキ",
    party: "自由民主党",
    district: "比例近畿",
    prefecture: null,
  },
  {
    name: "小林茂樹",
    nameKana: "コバヤシ シゲキ",
    party: "自由民主党",
    district: "比例近畿",
    prefecture: null,
  },
  {
    name: "島田智明",
    nameKana: "シマダ トモアキ",
    party: "自由民主党",
    district: "比例近畿",
    prefecture: null,
  },
  // 比例中国（5名）
  {
    name: "新谷正義",
    nameKana: "シンタニ マサヨシ",
    party: "自由民主党",
    district: "比例中国",
    prefecture: null,
  },
  {
    name: "平沼正二郎",
    nameKana: "ヒラヌマ ショウジロウ",
    party: "自由民主党",
    district: "比例中国",
    prefecture: null,
  },
  {
    name: "石橋林太郎",
    nameKana: "イシバシ リンタロウ",
    party: "自由民主党",
    district: "比例中国",
    prefecture: null,
  },
  {
    name: "吉田真次",
    nameKana: "ヨシダ シンジ",
    party: "自由民主党",
    district: "比例中国",
    prefecture: null,
  },
  {
    name: "寺田稔",
    nameKana: "テラダ ミノル",
    party: "自由民主党",
    district: "比例中国",
    prefecture: null,
  },
  // 比例四国（3名）
  {
    name: "村上誠一郎",
    nameKana: "ムラカミ セイイチロウ",
    party: "自由民主党",
    district: "比例四国",
    prefecture: null,
  },
  {
    name: "平井卓也",
    nameKana: "ヒライ タクヤ",
    party: "自由民主党",
    district: "比例四国",
    prefecture: null,
  },
  {
    name: "瀬戸隆一",
    nameKana: "セト リュウイチ",
    party: "自由民主党",
    district: "比例四国",
    prefecture: null,
  },
  // 比例九州（7名）
  {
    name: "阿部俊子",
    nameKana: "アベ トシコ",
    party: "自由民主党",
    district: "比例九州",
    prefecture: null,
  },
  {
    name: "鬼木誠",
    nameKana: "オニキ マコト",
    party: "自由民主党",
    district: "比例九州",
    prefecture: null,
  },
  {
    name: "宮路拓馬",
    nameKana: "ミヤジ タクマ",
    party: "自由民主党",
    district: "比例九州",
    prefecture: null,
  },
  {
    name: "国場幸之助",
    nameKana: "コクバ コウノスケ",
    party: "自由民主党",
    district: "比例九州",
    prefecture: null,
  },
  {
    name: "岩田和親",
    nameKana: "イワタ カズチカ",
    party: "自由民主党",
    district: "比例九州",
    prefecture: null,
  },
  {
    name: "古川康",
    nameKana: "フルカワ ヤスシ",
    party: "自由民主党",
    district: "比例九州",
    prefecture: null,
  },
  {
    name: "宮崎政久",
    nameKana: "ミヤザキ マサヒサ",
    party: "自由民主党",
    district: "比例九州",
    prefecture: null,
  },
];

// ============================================
// 立憲民主党（148名 = 小選挙区104 + 比例44）
// ============================================

const CDP_MEMBERS: RepresentativeData[] = [
  // ======== 小選挙区当選（104名） ========

  // ---- 北海道 ----
  {
    name: "道下大樹",
    nameKana: "ミチシタ ダイキ",
    party: "立憲民主党",
    district: "北海道1区",
    prefecture: "北海道",
  },
  {
    name: "松木謙公",
    nameKana: "マツキ ケンコウ",
    party: "立憲民主党",
    district: "北海道2区",
    prefecture: "北海道",
  },
  {
    name: "荒井優",
    nameKana: "アライ ユウ",
    party: "立憲民主党",
    district: "北海道3区",
    prefecture: "北海道",
  },
  {
    name: "大築紅葉",
    nameKana: "オオツキ モミジ",
    party: "立憲民主党",
    district: "北海道4区",
    prefecture: "北海道",
  },
  {
    name: "池田真紀",
    nameKana: "イケダ マキ",
    party: "立憲民主党",
    district: "北海道5区",
    prefecture: "北海道",
  },
  {
    name: "逢坂誠二",
    nameKana: "オオサカ セイジ",
    party: "立憲民主党",
    district: "北海道8区",
    prefecture: "北海道",
  },
  {
    name: "山岡達丸",
    nameKana: "ヤマオカ タツマル",
    party: "立憲民主党",
    district: "北海道9区",
    prefecture: "北海道",
  },
  {
    name: "神谷裕",
    nameKana: "カミヤ ヒロシ",
    party: "立憲民主党",
    district: "北海道10区",
    prefecture: "北海道",
  },
  {
    name: "石川香織",
    nameKana: "イシカワ カオリ",
    party: "立憲民主党",
    district: "北海道11区",
    prefecture: "北海道",
  },
  // ---- 青森県 ----
  {
    name: "岡田華子",
    nameKana: "オカダ ハナコ",
    party: "立憲民主党",
    district: "青森3区",
    prefecture: "青森県",
  },
  // ---- 岩手県 ----
  {
    name: "階猛",
    nameKana: "シナ タケシ",
    party: "立憲民主党",
    district: "岩手1区",
    prefecture: "岩手県",
  },
  {
    name: "小沢一郎",
    nameKana: "オザワ イチロウ",
    party: "立憲民主党",
    district: "岩手3区",
    prefecture: "岩手県",
  },
  // ---- 宮城県 ----
  {
    name: "岡本章子",
    nameKana: "オカモト アキコ",
    party: "立憲民主党",
    district: "宮城1区",
    prefecture: "宮城県",
  },
  {
    name: "鎌田さゆり",
    nameKana: "カマタ サユリ",
    party: "立憲民主党",
    district: "宮城2区",
    prefecture: "宮城県",
  },
  {
    name: "柳沢剛",
    nameKana: "ヤナギサワ ツヨシ",
    party: "立憲民主党",
    district: "宮城3区",
    prefecture: "宮城県",
  },
  {
    name: "安住淳",
    nameKana: "アズミ ジュン",
    party: "立憲民主党",
    district: "宮城4区",
    prefecture: "宮城県",
  },
  // ---- 秋田県 ----
  {
    name: "緑川貴士",
    nameKana: "ミドリカワ タカシ",
    party: "立憲民主党",
    district: "秋田2区",
    prefecture: "秋田県",
  },
  // ---- 福島県 ----
  {
    name: "金子恵美",
    nameKana: "カネコ エミ",
    party: "立憲民主党",
    district: "福島1区",
    prefecture: "福島県",
  },
  {
    name: "玄葉光一郎",
    nameKana: "ゲンバ コウイチロウ",
    party: "立憲民主党",
    district: "福島2区",
    prefecture: "福島県",
  },
  {
    name: "小熊慎司",
    nameKana: "オグマ シンジ",
    party: "立憲民主党",
    district: "福島3区",
    prefecture: "福島県",
  },
  // ---- 茨城県 ----
  {
    name: "青山大人",
    nameKana: "アオヤマ ヤマト",
    party: "立憲民主党",
    district: "茨城6区",
    prefecture: "茨城県",
  },
  // ---- 栃木県 ----
  {
    name: "福田昭夫",
    nameKana: "フクダ アキオ",
    party: "立憲民主党",
    district: "栃木2区",
    prefecture: "栃木県",
  },
  {
    name: "藤岡隆雄",
    nameKana: "フジオカ タカオ",
    party: "立憲民主党",
    district: "栃木4区",
    prefecture: "栃木県",
  },
  // ---- 埼玉県 ----
  {
    name: "枝野幸男",
    nameKana: "エダノ ユキオ",
    party: "立憲民主党",
    district: "埼玉5区",
    prefecture: "埼玉県",
  },
  {
    name: "大島敦",
    nameKana: "オオシマ アツシ",
    party: "立憲民主党",
    district: "埼玉6区",
    prefecture: "埼玉県",
  },
  {
    name: "小宮山泰子",
    nameKana: "コミヤマ ヤスコ",
    party: "立憲民主党",
    district: "埼玉7区",
    prefecture: "埼玉県",
  },
  {
    name: "杉村慎治",
    nameKana: "スギムラ シンジ",
    party: "立憲民主党",
    district: "埼玉9区",
    prefecture: "埼玉県",
  },
  {
    name: "坂本祐之輔",
    nameKana: "サカモト ユウノスケ",
    party: "立憲民主党",
    district: "埼玉10区",
    prefecture: "埼玉県",
  },
  {
    name: "森田俊和",
    nameKana: "モリタ トシカズ",
    party: "立憲民主党",
    district: "埼玉12区",
    prefecture: "埼玉県",
  },
  // ---- 千葉県 ----
  {
    name: "田嶋要",
    nameKana: "タジマ カナメ",
    party: "立憲民主党",
    district: "千葉1区",
    prefecture: "千葉県",
  },
  {
    name: "水沼秀幸",
    nameKana: "ミズヌマ ヒデユキ",
    party: "立憲民主党",
    district: "千葉4区",
    prefecture: "千葉県",
  },
  {
    name: "矢崎堅太郎",
    nameKana: "ヤザキ ケンタロウ",
    party: "立憲民主党",
    district: "千葉5区",
    prefecture: "千葉県",
  },
  {
    name: "安藤淳子",
    nameKana: "アンドウ ジュンコ",
    party: "立憲民主党",
    district: "千葉6区",
    prefecture: "千葉県",
  },
  {
    name: "本庄知史",
    nameKana: "ホンジョウ トモフミ",
    party: "立憲民主党",
    district: "千葉8区",
    prefecture: "千葉県",
  },
  {
    name: "奥野総一郎",
    nameKana: "オクノ ソウイチロウ",
    party: "立憲民主党",
    district: "千葉9区",
    prefecture: "千葉県",
  },
  {
    name: "野田佳彦",
    nameKana: "ノダ ヨシヒコ",
    party: "立憲民主党",
    district: "千葉14区",
    prefecture: "千葉県",
  },
  // ---- 東京都 ----
  {
    name: "海江田万里",
    nameKana: "カイエダ バンリ",
    party: "立憲民主党",
    district: "東京1区",
    prefecture: "東京都",
  },
  {
    name: "手塚仁雄",
    nameKana: "テヅカ ヨシオ",
    party: "立憲民主党",
    district: "東京5区",
    prefecture: "東京都",
  },
  {
    name: "落合貴之",
    nameKana: "オチアイ タカユキ",
    party: "立憲民主党",
    district: "東京6区",
    prefecture: "東京都",
  },
  {
    name: "松尾明弘",
    nameKana: "マツオ アキヒロ",
    party: "立憲民主党",
    district: "東京7区",
    prefecture: "東京都",
  },
  {
    name: "吉田晴美",
    nameKana: "ヨシダ ハルミ",
    party: "立憲民主党",
    district: "東京8区",
    prefecture: "東京都",
  },
  {
    name: "山岸一生",
    nameKana: "ヤマギシ イッセイ",
    party: "立憲民主党",
    district: "東京9区",
    prefecture: "東京都",
  },
  {
    name: "阿久津幸彦",
    nameKana: "アクツ ユキヒコ",
    party: "立憲民主党",
    district: "東京11区",
    prefecture: "東京都",
  },
  {
    name: "酒井菜摘",
    nameKana: "サカイ ナツミ",
    party: "立憲民主党",
    district: "東京15区",
    prefecture: "東京都",
  },
  {
    name: "末松義規",
    nameKana: "スエマツ ヨシノリ",
    party: "立憲民主党",
    district: "東京19区",
    prefecture: "東京都",
  },
  {
    name: "大河原雅子",
    nameKana: "オオカワラ マサコ",
    party: "立憲民主党",
    district: "東京21区",
    prefecture: "東京都",
  },
  {
    name: "山花郁夫",
    nameKana: "ヤマハナ イクオ",
    party: "立憲民主党",
    district: "東京22区",
    prefecture: "東京都",
  },
  {
    name: "伊藤俊輔",
    nameKana: "イトウ シュンスケ",
    party: "立憲民主党",
    district: "東京23区",
    prefecture: "東京都",
  },
  {
    name: "長妻昭",
    nameKana: "ナガツマ アキラ",
    party: "立憲民主党",
    district: "東京27区",
    prefecture: "東京都",
  },
  {
    name: "高松智之",
    nameKana: "タカマツ トモユキ",
    party: "立憲民主党",
    district: "東京28区",
    prefecture: "東京都",
  },
  {
    name: "五十嵐衣里",
    nameKana: "イガラシ エリ",
    party: "立憲民主党",
    district: "東京30区",
    prefecture: "東京都",
  },
  // ---- 神奈川県 ----
  {
    name: "篠原豪",
    nameKana: "シノハラ ゴウ",
    party: "立憲民主党",
    district: "神奈川1区",
    prefecture: "神奈川県",
  },
  {
    name: "早稲田夕季",
    nameKana: "ワセダ ユウキ",
    party: "立憲民主党",
    district: "神奈川4区",
    prefecture: "神奈川県",
  },
  {
    name: "青柳陽一郎",
    nameKana: "アオヤギ ヨウイチロウ",
    party: "立憲民主党",
    district: "神奈川6区",
    prefecture: "神奈川県",
  },
  {
    name: "中谷一馬",
    nameKana: "ナカタニ カズマ",
    party: "立憲民主党",
    district: "神奈川7区",
    prefecture: "神奈川県",
  },
  {
    name: "江田憲司",
    nameKana: "エダ ケンジ",
    party: "立憲民主党",
    district: "神奈川8区",
    prefecture: "神奈川県",
  },
  {
    name: "笠浩史",
    nameKana: "カサ ヒロフミ",
    party: "立憲民主党",
    district: "神奈川9区",
    prefecture: "神奈川県",
  },
  {
    name: "阿部知子",
    nameKana: "アベ トモコ",
    party: "立憲民主党",
    district: "神奈川12区",
    prefecture: "神奈川県",
  },
  {
    name: "太栄志",
    nameKana: "ダイ エイシ",
    party: "立憲民主党",
    district: "神奈川13区",
    prefecture: "神奈川県",
  },
  {
    name: "後藤祐一",
    nameKana: "ゴトウ ユウイチ",
    party: "立憲民主党",
    district: "神奈川16区",
    prefecture: "神奈川県",
  },
  {
    name: "宗野創",
    nameKana: "ソウノ ハジメ",
    party: "立憲民主党",
    district: "神奈川18区",
    prefecture: "神奈川県",
  },
  {
    name: "大塚小百合",
    nameKana: "オオツカ サユリ",
    party: "立憲民主党",
    district: "神奈川20区",
    prefecture: "神奈川県",
  },
  // ---- 新潟県 ----
  {
    name: "西村智奈美",
    nameKana: "ニシムラ チナミ",
    party: "立憲民主党",
    district: "新潟1区",
    prefecture: "新潟県",
  },
  {
    name: "菊田真紀子",
    nameKana: "キクタ マキコ",
    party: "立憲民主党",
    district: "新潟2区",
    prefecture: "新潟県",
  },
  {
    name: "黒岩宇洋",
    nameKana: "クロイワ タカヒロ",
    party: "立憲民主党",
    district: "新潟3区",
    prefecture: "新潟県",
  },
  {
    name: "米山隆一",
    nameKana: "ヨネヤマ リュウイチ",
    party: "立憲民主党",
    district: "新潟4区",
    prefecture: "新潟県",
  },
  {
    name: "梅谷守",
    nameKana: "ウメタニ マモル",
    party: "立憲民主党",
    district: "新潟5区",
    prefecture: "新潟県",
  },
  // ---- 石川県 ----
  {
    name: "近藤和也",
    nameKana: "コンドウ カズヤ",
    party: "立憲民主党",
    district: "石川3区",
    prefecture: "石川県",
  },
  // ---- 福井県 ----
  {
    name: "辻英之",
    nameKana: "ツジ ヒデユキ",
    party: "立憲民主党",
    district: "福井2区",
    prefecture: "福井県",
  },
  // ---- 山梨県 ----
  {
    name: "中島克仁",
    nameKana: "ナカジマ カツヒト",
    party: "立憲民主党",
    district: "山梨1区",
    prefecture: "山梨県",
  },
  // ---- 長野県 ----
  {
    name: "篠原孝",
    nameKana: "シノハラ タカシ",
    party: "立憲民主党",
    district: "長野1区",
    prefecture: "長野県",
  },
  {
    name: "下条みつ",
    nameKana: "シモジョウ ミツ",
    party: "立憲民主党",
    district: "長野2区",
    prefecture: "長野県",
  },
  {
    name: "神津健",
    nameKana: "コウヅ タケシ",
    party: "立憲民主党",
    district: "長野3区",
    prefecture: "長野県",
  },
  // ---- 岐阜県 ----
  {
    name: "今井雅人",
    nameKana: "イマイ マサト",
    party: "立憲民主党",
    district: "岐阜4区",
    prefecture: "岐阜県",
  },
  // ---- 静岡県 ----
  {
    name: "小山展弘",
    nameKana: "コヤマ ノブヒロ",
    party: "立憲民主党",
    district: "静岡3区",
    prefecture: "静岡県",
  },
  {
    name: "渡辺周",
    nameKana: "ワタナベ シュウ",
    party: "立憲民主党",
    district: "静岡6区",
    prefecture: "静岡県",
  },
  {
    name: "源馬謙太郎",
    nameKana: "ゲンマ ケンタロウ",
    party: "立憲民主党",
    district: "静岡8区",
    prefecture: "静岡県",
  },
  // ---- 愛知県 ----
  {
    name: "近藤昭一",
    nameKana: "コンドウ ショウイチ",
    party: "立憲民主党",
    district: "愛知3区",
    prefecture: "愛知県",
  },
  {
    name: "牧義夫",
    nameKana: "マキ ヨシオ",
    party: "立憲民主党",
    district: "愛知4区",
    prefecture: "愛知県",
  },
  {
    name: "西川厚志",
    nameKana: "ニシカワ アツシ",
    party: "立憲民主党",
    district: "愛知5区",
    prefecture: "愛知県",
  },
  {
    name: "伴野豊",
    nameKana: "バンノ ユタカ",
    party: "立憲民主党",
    district: "愛知8区",
    prefecture: "愛知県",
  },
  {
    name: "岡本充功",
    nameKana: "オカモト ミツノリ",
    party: "立憲民主党",
    district: "愛知9区",
    prefecture: "愛知県",
  },
  {
    name: "藤原規真",
    nameKana: "フジワラ ノリマサ",
    party: "立憲民主党",
    district: "愛知10区",
    prefecture: "愛知県",
  },
  {
    name: "重徳和彦",
    nameKana: "シゲトク カズヒコ",
    party: "立憲民主党",
    district: "愛知12区",
    prefecture: "愛知県",
  },
  {
    name: "大西健介",
    nameKana: "オオニシ ケンスケ",
    party: "立憲民主党",
    district: "愛知13区",
    prefecture: "愛知県",
  },
  // ---- 三重県 ----
  {
    name: "下野幸助",
    nameKana: "シモノ コウスケ",
    party: "立憲民主党",
    district: "三重2区",
    prefecture: "三重県",
  },
  {
    name: "岡田克也",
    nameKana: "オカダ カツヤ",
    party: "立憲民主党",
    district: "三重3区",
    prefecture: "三重県",
  },
  // ---- 京都府 ----
  {
    name: "泉健太",
    nameKana: "イズミ ケンタ",
    party: "立憲民主党",
    district: "京都3区",
    prefecture: "京都府",
  },
  {
    name: "山井和則",
    nameKana: "ヤマノイ カズノリ",
    party: "立憲民主党",
    district: "京都6区",
    prefecture: "京都府",
  },
  // ---- 兵庫県 ----
  {
    name: "井坂信彦",
    nameKana: "イサカ ノブヒコ",
    party: "立憲民主党",
    district: "兵庫1区",
    prefecture: "兵庫県",
  },
  {
    name: "桜井周",
    nameKana: "サクライ シュウ",
    party: "立憲民主党",
    district: "兵庫6区",
    prefecture: "兵庫県",
  },
  // ---- 奈良県 ----
  {
    name: "馬淵澄夫",
    nameKana: "マブチ スミオ",
    party: "立憲民主党",
    district: "奈良1区",
    prefecture: "奈良県",
  },
  // ---- 島根県 ----
  {
    name: "亀井亜紀子",
    nameKana: "カメイ アキコ",
    party: "立憲民主党",
    district: "島根1区",
    prefecture: "島根県",
  },
  // ---- 岡山県 ----
  {
    name: "柚木道義",
    nameKana: "ユノキ ミチヨシ",
    party: "立憲民主党",
    district: "岡山4区",
    prefecture: "岡山県",
  },
  // ---- 広島県 ----
  {
    name: "佐藤公治",
    nameKana: "サトウ コウジ",
    party: "立憲民主党",
    district: "広島5区",
    prefecture: "広島県",
  },
  // ---- 香川県 ----
  {
    name: "小川淳也",
    nameKana: "オガワ ジュンヤ",
    party: "立憲民主党",
    district: "香川1区",
    prefecture: "香川県",
  },
  // ---- 愛媛県 ----
  {
    name: "白石洋一",
    nameKana: "シライシ ヨウイチ",
    party: "立憲民主党",
    district: "愛媛2区",
    prefecture: "愛媛県",
  },
  // ---- 福岡県 ----
  {
    name: "稲富修二",
    nameKana: "イナトミ シュウジ",
    party: "立憲民主党",
    district: "福岡2区",
    prefecture: "福岡県",
  },
  {
    name: "城井崇",
    nameKana: "キイ タカシ",
    party: "立憲民主党",
    district: "福岡10区",
    prefecture: "福岡県",
  },
  // ---- 佐賀県 ----
  {
    name: "原口一博",
    nameKana: "ハラグチ カズヒロ",
    party: "立憲民主党",
    district: "佐賀1区",
    prefecture: "佐賀県",
  },
  {
    name: "大串博志",
    nameKana: "オオグシ ヒロシ",
    party: "立憲民主党",
    district: "佐賀2区",
    prefecture: "佐賀県",
  },
  // ---- 宮崎県 ----
  {
    name: "渡辺創",
    nameKana: "ワタナベ ソウ",
    party: "立憲民主党",
    district: "宮崎1区",
    prefecture: "宮崎県",
  },
  // ---- 鹿児島県 ----
  {
    name: "川内博史",
    nameKana: "カワウチ ヒロシ",
    party: "立憲民主党",
    district: "鹿児島1区",
    prefecture: "鹿児島県",
  },
  {
    name: "野間健",
    nameKana: "ノマ タケシ",
    party: "立憲民主党",
    district: "鹿児島3区",
    prefecture: "鹿児島県",
  },

  // ======== 比例代表当選（44名） ========

  // 比例北海道（3名）
  {
    name: "篠田奈保子",
    nameKana: "シノダ ナホコ",
    party: "立憲民主党",
    district: "比例北海道",
    prefecture: null,
  },
  {
    name: "西川将人",
    nameKana: "ニシカワ マサト",
    party: "立憲民主党",
    district: "比例北海道",
    prefecture: null,
  },
  {
    name: "川原田英世",
    nameKana: "カワラダ エイセイ",
    party: "立憲民主党",
    district: "比例北海道",
    prefecture: null,
  },
  // 比例東北（4名）
  {
    name: "馬場雄基",
    nameKana: "ババ ユウキ",
    party: "立憲民主党",
    district: "比例東北",
    prefecture: null,
  },
  {
    name: "寺田学",
    nameKana: "テラダ マナブ",
    party: "立憲民主党",
    district: "比例東北",
    prefecture: null,
  },
  {
    name: "升田世喜男",
    nameKana: "マスダ セキオ",
    party: "立憲民主党",
    district: "比例東北",
    prefecture: null,
  },
  {
    name: "斎藤裕喜",
    nameKana: "サイトウ ヒロキ",
    party: "立憲民主党",
    district: "比例東北",
    prefecture: null,
  },
  // 比例北関東（5名）
  {
    name: "長谷川嘉一",
    nameKana: "ハセガワ カイチ",
    party: "立憲民主党",
    district: "比例北関東",
    prefecture: null,
  },
  {
    name: "武正公一",
    nameKana: "タケマサ コウイチ",
    party: "立憲民主党",
    district: "比例北関東",
    prefecture: null,
  },
  {
    name: "三角創太",
    nameKana: "ミスミ ソウタ",
    party: "立憲民主党",
    district: "比例北関東",
    prefecture: null,
  },
  {
    name: "竹内千春",
    nameKana: "タケウチ チハル",
    party: "立憲民主党",
    district: "比例北関東",
    prefecture: null,
  },
  {
    name: "市来伴子",
    nameKana: "イチキ トモコ",
    party: "立憲民主党",
    district: "比例北関東",
    prefecture: null,
  },
  // 比例南関東（6名）
  {
    name: "谷田川元",
    nameKana: "ヤタガワ ハジメ",
    party: "立憲民主党",
    district: "比例南関東",
    prefecture: null,
  },
  {
    name: "佐々木奈保美",
    nameKana: "ササキ ナオミ",
    party: "立憲民主党",
    district: "比例南関東",
    prefecture: null,
  },
  {
    name: "宮川伸",
    nameKana: "ミヤカワ シン",
    party: "立憲民主党",
    district: "比例南関東",
    prefecture: null,
  },
  {
    name: "岡島一正",
    nameKana: "オカジマ カズマサ",
    party: "立憲民主党",
    district: "比例南関東",
    prefecture: null,
  },
  {
    name: "長友克洋",
    nameKana: "ナガトモ カツヒロ",
    party: "立憲民主党",
    district: "比例南関東",
    prefecture: null,
  },
  {
    name: "山崎誠",
    nameKana: "ヤマザキ マコト",
    party: "立憲民主党",
    district: "比例南関東",
    prefecture: null,
  },
  // 比例東京（5名）
  {
    name: "鈴木庸介",
    nameKana: "スズキ ヨウスケ",
    party: "立憲民主党",
    district: "比例東京",
    prefecture: null,
  },
  {
    name: "松下玲子",
    nameKana: "マツシタ レイコ",
    party: "立憲民主党",
    district: "比例東京",
    prefecture: null,
  },
  {
    name: "有田芳生",
    nameKana: "アリタ ヨシフ",
    party: "立憲民主党",
    district: "比例東京",
    prefecture: null,
  },
  {
    name: "阿部祐美子",
    nameKana: "アベ ユミコ",
    party: "立憲民主党",
    district: "比例東京",
    prefecture: null,
  },
  {
    name: "柴田勝之",
    nameKana: "シバタ カツユキ",
    party: "立憲民主党",
    district: "比例東京",
    prefecture: null,
  },
  // 比例北陸信越（3名）
  {
    name: "山登志浩",
    nameKana: "ヤマト シコウ",
    party: "立憲民主党",
    district: "比例北陸信越",
    prefecture: null,
  },
  {
    name: "福田淳太",
    nameKana: "フクダ ジュンタ",
    party: "立憲民主党",
    district: "比例北陸信越",
    prefecture: null,
  },
  {
    name: "波多野翼",
    nameKana: "ハタノ ツバサ",
    party: "立憲民主党",
    district: "比例北陸信越",
    prefecture: null,
  },
  // 比例東海（6名）
  {
    name: "松田功",
    nameKana: "マツダ イサオ",
    party: "立憲民主党",
    district: "比例東海",
    prefecture: null,
  },
  {
    name: "真野哲",
    nameKana: "マノ サトシ",
    party: "立憲民主党",
    district: "比例東海",
    prefecture: null,
  },
  {
    name: "大嶽理恵",
    nameKana: "オオタケ リエ",
    party: "立憲民主党",
    district: "比例東海",
    prefecture: null,
  },
  {
    name: "鈴木岳幸",
    nameKana: "スズキ タケユキ",
    party: "立憲民主党",
    district: "比例東海",
    prefecture: null,
  },
  {
    name: "小山千帆",
    nameKana: "コヤマ チホ",
    party: "立憲民主党",
    district: "比例東海",
    prefecture: null,
  },
  {
    name: "福森和歌子",
    nameKana: "フクモリ ワカコ",
    party: "立憲民主党",
    district: "比例東海",
    prefecture: null,
  },
  // 比例近畿（4名）
  {
    name: "森山浩行",
    nameKana: "モリヤマ ヒロユキ",
    party: "立憲民主党",
    district: "比例近畿",
    prefecture: null,
  },
  {
    name: "橋本慧悟",
    nameKana: "ハシモト ケイゴ",
    party: "立憲民主党",
    district: "比例近畿",
    prefecture: null,
  },
  {
    name: "岡田悟",
    nameKana: "オカダ サトル",
    party: "立憲民主党",
    district: "比例近畿",
    prefecture: null,
  },
  {
    name: "尾辻かな子",
    nameKana: "オツジ カナコ",
    party: "立憲民主党",
    district: "比例近畿",
    prefecture: null,
  },
  // 比例中国（3名）
  {
    name: "平岡秀夫",
    nameKana: "ヒラオカ ヒデオ",
    party: "立憲民主党",
    district: "比例中国",
    prefecture: null,
  },
  {
    name: "津村啓介",
    nameKana: "ツムラ ケイスケ",
    party: "立憲民主党",
    district: "比例中国",
    prefecture: null,
  },
  {
    name: "東克哉",
    nameKana: "ヒガシ カツヤ",
    party: "立憲民主党",
    district: "比例中国",
    prefecture: null,
  },
  // 比例四国（1名）
  {
    name: "高橋永",
    nameKana: "タカハシ ヒサシ",
    party: "立憲民主党",
    district: "比例四国",
    prefecture: null,
  },
  // 比例九州（4名）※奥田ふみよはれいわ
  {
    name: "屋良朝博",
    nameKana: "ヤラ トモヒロ",
    party: "立憲民主党",
    district: "比例九州",
    prefecture: null,
  },
  {
    name: "吉川元",
    nameKana: "ヨシカワ ハジメ",
    party: "立憲民主党",
    district: "比例九州",
    prefecture: null,
  },
  {
    name: "山田勝彦",
    nameKana: "ヤマダ カツヒコ",
    party: "立憲民主党",
    district: "比例九州",
    prefecture: null,
  },
  {
    name: "堤かなめ",
    nameKana: "ツツミ カナメ",
    party: "立憲民主党",
    district: "比例九州",
    prefecture: null,
  },
];

// ============================================
// 日本維新の会（38名 = 小選挙区23 + 比例15）
// ============================================

const ISHIN_MEMBERS: RepresentativeData[] = [
  // ======== 小選挙区当選 ========
  {
    name: "斎藤アレックス",
    nameKana: "サイトウ アレックス",
    party: "日本維新の会",
    district: "滋賀1区",
    prefecture: "滋賀県",
  },
  {
    name: "前原誠司",
    nameKana: "マエハラ セイジ",
    party: "日本維新の会",
    district: "京都2区",
    prefecture: "京都府",
  },
  {
    name: "井上英孝",
    nameKana: "イノウエ ヒデタカ",
    party: "日本維新の会",
    district: "大阪1区",
    prefecture: "大阪府",
  },
  {
    name: "守島正",
    nameKana: "モリシマ タダシ",
    party: "日本維新の会",
    district: "大阪2区",
    prefecture: "大阪府",
  },
  {
    name: "東徹",
    nameKana: "アズマ トオル",
    party: "日本維新の会",
    district: "大阪3区",
    prefecture: "大阪府",
  },
  {
    name: "美延映夫",
    nameKana: "ミノベ テルオ",
    party: "日本維新の会",
    district: "大阪4区",
    prefecture: "大阪府",
  },
  {
    name: "梅村聡",
    nameKana: "ウメムラ サトシ",
    party: "日本維新の会",
    district: "大阪5区",
    prefecture: "大阪府",
  },
  {
    name: "西田薫",
    nameKana: "ニシダ カオル",
    party: "日本維新の会",
    district: "大阪6区",
    prefecture: "大阪府",
  },
  {
    name: "奥下剛光",
    nameKana: "オクシタ タケミツ",
    party: "日本維新の会",
    district: "大阪7区",
    prefecture: "大阪府",
  },
  {
    name: "漆間譲司",
    nameKana: "ウルマ ジョウジ",
    party: "日本維新の会",
    district: "大阪8区",
    prefecture: "大阪府",
  },
  {
    name: "萩原佳",
    nameKana: "ハギワラ ケイ",
    party: "日本維新の会",
    district: "大阪9区",
    prefecture: "大阪府",
  },
  {
    name: "池下卓",
    nameKana: "イケシタ タク",
    party: "日本維新の会",
    district: "大阪10区",
    prefecture: "大阪府",
  },
  {
    name: "中司宏",
    nameKana: "ナカツカサ ヒロシ",
    party: "日本維新の会",
    district: "大阪11区",
    prefecture: "大阪府",
  },
  {
    name: "藤田文武",
    nameKana: "フジタ フミタケ",
    party: "日本維新の会",
    district: "大阪12区",
    prefecture: "大阪府",
  },
  {
    name: "岩谷良平",
    nameKana: "イワタニ リョウヘイ",
    party: "日本維新の会",
    district: "大阪13区",
    prefecture: "大阪府",
  },
  {
    name: "青柳仁士",
    nameKana: "アオヤギ ヒトシ",
    party: "日本維新の会",
    district: "大阪14区",
    prefecture: "大阪府",
  },
  {
    name: "浦野靖人",
    nameKana: "ウラノ ヤスト",
    party: "日本維新の会",
    district: "大阪15区",
    prefecture: "大阪府",
  },
  {
    name: "黒田征樹",
    nameKana: "クロダ マサキ",
    party: "日本維新の会",
    district: "大阪16区",
    prefecture: "大阪府",
  },
  {
    name: "馬場伸幸",
    nameKana: "ババ ノブユキ",
    party: "日本維新の会",
    district: "大阪17区",
    prefecture: "大阪府",
  },
  {
    name: "遠藤敬",
    nameKana: "エンドウ タカシ",
    party: "日本維新の会",
    district: "大阪18区",
    prefecture: "大阪府",
  },
  {
    name: "伊東信久",
    nameKana: "イトウ ノブヒサ",
    party: "日本維新の会",
    district: "大阪19区",
    prefecture: "大阪府",
  },
  {
    name: "空本誠喜",
    nameKana: "ソラモト セイキ",
    party: "日本維新の会",
    district: "広島4区",
    prefecture: "広島県",
  },
  {
    name: "村上智信",
    nameKana: "ムラカミ トモノブ",
    party: "日本維新の会",
    district: "福岡11区",
    prefecture: "福岡県",
  },

  // ======== 比例代表当選（15名） ========
  {
    name: "高橋英明",
    nameKana: "タカハシ ヒデアキ",
    party: "日本維新の会",
    district: "比例北関東",
    prefecture: null,
  },
  {
    name: "金村龍那",
    nameKana: "カネムラ リュウナ",
    party: "日本維新の会",
    district: "比例南関東",
    prefecture: null,
  },
  {
    name: "藤巻健太",
    nameKana: "フジマキ ケンタ",
    party: "日本維新の会",
    district: "比例南関東",
    prefecture: null,
  },
  {
    name: "阿部司",
    nameKana: "アベ ツカサ",
    party: "日本維新の会",
    district: "比例東京",
    prefecture: null,
  },
  {
    name: "猪口幸子",
    nameKana: "イノグチ サチコ",
    party: "日本維新の会",
    district: "比例東京",
    prefecture: null,
  },
  {
    name: "杉本和巳",
    nameKana: "スギモト カズミ",
    party: "日本維新の会",
    district: "比例東海",
    prefecture: null,
  },
  {
    name: "斉木武志",
    nameKana: "サイキ タケシ",
    party: "日本維新の会",
    district: "比例北陸信越",
    prefecture: null,
  },
  {
    name: "林佑美",
    nameKana: "ハヤシ ユミ",
    party: "日本維新の会",
    district: "比例近畿",
    prefecture: null,
  },
  {
    name: "三木圭恵",
    nameKana: "ミキ ケエ",
    party: "日本維新の会",
    district: "比例近畿",
    prefecture: null,
  },
  {
    name: "徳安淳子",
    nameKana: "トクヤス ジュンコ",
    party: "日本維新の会",
    district: "比例近畿",
    prefecture: null,
  },
  {
    name: "池畑浩太朗",
    nameKana: "イケハタ コウタロウ",
    party: "日本維新の会",
    district: "比例近畿",
    prefecture: null,
  },
  {
    name: "市村浩一郎",
    nameKana: "イチムラ コウイチロウ",
    party: "日本維新の会",
    district: "比例近畿",
    prefecture: null,
  },
  {
    name: "和田有一朗",
    nameKana: "ワダ ユウイチロウ",
    party: "日本維新の会",
    district: "比例近畿",
    prefecture: null,
  },
  {
    name: "阿部圭史",
    nameKana: "アベ ケイシ",
    party: "日本維新の会",
    district: "比例近畿",
    prefecture: null,
  },
  {
    name: "阿部弘樹",
    nameKana: "アベ ヒロキ",
    party: "日本維新の会",
    district: "比例九州",
    prefecture: null,
  },
];

// ============================================
// 国民民主党（28名 = 小選挙区11 + 比例17）
// ============================================

const DPP_MEMBERS: RepresentativeData[] = [
  // ======== 小選挙区当選 ========
  {
    name: "村岡敏英",
    nameKana: "ムラオカ トシヒデ",
    party: "国民民主党",
    district: "秋田3区",
    prefecture: "秋田県",
  },
  {
    name: "浅野哲",
    nameKana: "アサノ テツ",
    party: "国民民主党",
    district: "茨城5区",
    prefecture: "茨城県",
  },
  {
    name: "橋本幹彦",
    nameKana: "ハシモト ミキヒコ",
    party: "国民民主党",
    district: "埼玉13区",
    prefecture: "埼玉県",
  },
  {
    name: "鈴木義弘",
    nameKana: "スズキ ヨシヒロ",
    party: "国民民主党",
    district: "埼玉14区",
    prefecture: "埼玉県",
  },
  {
    name: "田中健",
    nameKana: "タナカ ケン",
    party: "国民民主党",
    district: "静岡4区",
    prefecture: "静岡県",
  },
  {
    name: "古川元久",
    nameKana: "フルカワ モトヒサ",
    party: "国民民主党",
    district: "愛知2区",
    prefecture: "愛知県",
  },
  {
    name: "日野紗里亜",
    nameKana: "ヒノ サリア",
    party: "国民民主党",
    district: "愛知7区",
    prefecture: "愛知県",
  },
  {
    name: "丹野みどり",
    nameKana: "タンノ ミドリ",
    party: "国民民主党",
    district: "愛知11区",
    prefecture: "愛知県",
  },
  {
    name: "福田徹",
    nameKana: "フクダ トオル",
    party: "国民民主党",
    district: "愛知16区",
    prefecture: "愛知県",
  },
  {
    name: "玉木雄一郎",
    nameKana: "タマキ ユウイチロウ",
    party: "国民民主党",
    district: "香川2区",
    prefecture: "香川県",
  },
  {
    name: "西岡秀子",
    nameKana: "ニシオカ ヒデコ",
    party: "国民民主党",
    district: "長崎1区",
    prefecture: "長崎県",
  },

  // ======== 比例代表当選（17名） ========
  {
    name: "臼木秀剛",
    nameKana: "ウスキ ヒデタケ",
    party: "国民民主党",
    district: "比例北海道",
    prefecture: null,
  },
  {
    name: "菊池大二郎",
    nameKana: "キクチ ダイジロウ",
    party: "国民民主党",
    district: "比例東北",
    prefecture: null,
  },
  {
    name: "岸田光広",
    nameKana: "キシダ ミツヒロ",
    party: "国民民主党",
    district: "比例北関東",
    prefecture: null,
  },
  {
    name: "深作ヘスス",
    nameKana: "フカサク ヘスス",
    party: "国民民主党",
    district: "比例南関東",
    prefecture: null,
  },
  {
    name: "岡野純子",
    nameKana: "オカノ ジュンコ",
    party: "国民民主党",
    district: "比例南関東",
    prefecture: null,
  },
  {
    name: "西岡義高",
    nameKana: "ニシオカ ヨシタカ",
    party: "国民民主党",
    district: "比例南関東",
    prefecture: null,
  },
  {
    name: "円より子",
    nameKana: "マドカ ヨリコ",
    party: "国民民主党",
    district: "比例東京",
    prefecture: null,
  },
  {
    name: "森洋介",
    nameKana: "モリ ヨウスケ",
    party: "国民民主党",
    district: "比例東京",
    prefecture: null,
  },
  {
    name: "鳩山紀一郎",
    nameKana: "ハトヤマ キイチロウ",
    party: "国民民主党",
    district: "比例東京",
    prefecture: null,
  },
  {
    name: "小竹凱",
    nameKana: "コタケ カイ",
    party: "国民民主党",
    district: "比例北陸信越",
    prefecture: null,
  },
  {
    name: "仙田晃宏",
    nameKana: "センダ アキヒロ",
    party: "国民民主党",
    district: "比例東海",
    prefecture: null,
  },
  {
    name: "向山好一",
    nameKana: "ムカイヤマ コウイチ",
    party: "国民民主党",
    district: "比例近畿",
    prefecture: null,
  },
  {
    name: "平岩征樹",
    nameKana: "ヒライワ マサキ",
    party: "国民民主党",
    district: "比例近畿",
    prefecture: null,
  },
  {
    name: "福田玄",
    nameKana: "フクダ ゲン",
    party: "国民民主党",
    district: "比例中国",
    prefecture: null,
  },
  {
    name: "石井智恵",
    nameKana: "イシイ チエ",
    party: "国民民主党",
    district: "比例四国",
    prefecture: null,
  },
  {
    name: "長友慎治",
    nameKana: "ナガトモ シンジ",
    party: "国民民主党",
    district: "比例九州",
    prefecture: null,
  },
  {
    name: "許斐亮太郎",
    nameKana: "コノミ リョウタロウ",
    party: "国民民主党",
    district: "比例九州",
    prefecture: null,
  },
];

// ============================================
// 公明党（24名 = 小選挙区4 + 比例20）
// ============================================

const KOMEITO_MEMBERS: RepresentativeData[] = [
  // ======== 小選挙区当選 ========
  {
    name: "岡本三成",
    nameKana: "オカモト ミツナリ",
    party: "公明党",
    district: "東京29区",
    prefecture: "東京都",
  },
  {
    name: "赤羽一嘉",
    nameKana: "アカバ カズヨシ",
    party: "公明党",
    district: "兵庫2区",
    prefecture: "兵庫県",
  },
  {
    name: "中野洋昌",
    nameKana: "ナカノ ヒロマサ",
    party: "公明党",
    district: "兵庫8区",
    prefecture: "兵庫県",
  },
  {
    name: "斉藤鉄夫",
    nameKana: "サイトウ テツオ",
    party: "公明党",
    district: "広島3区",
    prefecture: "広島県",
  },

  // ======== 比例代表当選（20名） ========
  {
    name: "佐藤英道",
    nameKana: "サトウ ヒデミチ",
    party: "公明党",
    district: "比例北海道",
    prefecture: null,
  },
  {
    name: "庄子賢一",
    nameKana: "ショウジ ケンイチ",
    party: "公明党",
    district: "比例東北",
    prefecture: null,
  },
  {
    name: "輿水恵一",
    nameKana: "コシミズ ケイイチ",
    party: "公明党",
    district: "比例北関東",
    prefecture: null,
  },
  {
    name: "福重隆浩",
    nameKana: "フクシゲ タカヒロ",
    party: "公明党",
    district: "比例北関東",
    prefecture: null,
  },
  {
    name: "山口良治",
    nameKana: "ヤマグチ リョウジ",
    party: "公明党",
    district: "比例北関東",
    prefecture: null,
  },
  {
    name: "角田秀穂",
    nameKana: "カクタ ヒデオ",
    party: "公明党",
    district: "比例南関東",
    prefecture: null,
  },
  {
    name: "沼崎満子",
    nameKana: "ヌマザキ ミツコ",
    party: "公明党",
    district: "比例南関東",
    prefecture: null,
  },
  {
    name: "河西宏一",
    nameKana: "カサイ コウイチ",
    party: "公明党",
    district: "比例東京",
    prefecture: null,
  },
  {
    name: "大森江里子",
    nameKana: "オオモリ エリコ",
    party: "公明党",
    district: "比例東京",
    prefecture: null,
  },
  {
    name: "中川宏昌",
    nameKana: "ナカガワ ヒロマサ",
    party: "公明党",
    district: "比例北陸信越",
    prefecture: null,
  },
  {
    name: "中川康洋",
    nameKana: "ナカガワ ヤスヒロ",
    party: "公明党",
    district: "比例東海",
    prefecture: null,
  },
  {
    name: "西園勝秀",
    nameKana: "ニシゾノ カツヒデ",
    party: "公明党",
    district: "比例東海",
    prefecture: null,
  },
  {
    name: "竹内譲",
    nameKana: "タケウチ ユズル",
    party: "公明党",
    district: "比例近畿",
    prefecture: null,
  },
  {
    name: "浮島智子",
    nameKana: "ウキシマ トモコ",
    party: "公明党",
    district: "比例近畿",
    prefecture: null,
  },
  {
    name: "鰐淵洋子",
    nameKana: "ワニブチ ヨウコ",
    party: "公明党",
    district: "比例近畿",
    prefecture: null,
  },
  {
    name: "平林晃",
    nameKana: "ヒラバヤシ アキラ",
    party: "公明党",
    district: "比例中国",
    prefecture: null,
  },
  {
    name: "山崎正恭",
    nameKana: "ヤマザキ マサヤス",
    party: "公明党",
    district: "比例四国",
    prefecture: null,
  },
  {
    name: "浜地雅一",
    nameKana: "ハマチ マサカズ",
    party: "公明党",
    district: "比例九州",
    prefecture: null,
  },
  {
    name: "吉田宣弘",
    nameKana: "ヨシダ ノブヒロ",
    party: "公明党",
    district: "比例九州",
    prefecture: null,
  },
  {
    name: "金城泰邦",
    nameKana: "キンジョウ ヤスクニ",
    party: "公明党",
    district: "比例九州",
    prefecture: null,
  },
];

// ============================================
// れいわ新選組（9名 = 比例9）
// ============================================

const REIWA_MEMBERS: RepresentativeData[] = [
  {
    name: "佐原若子",
    nameKana: "サハラ ワカコ",
    party: "れいわ新選組",
    district: "比例東北",
    prefecture: null,
  },
  {
    name: "高井崇志",
    nameKana: "タカイ タカシ",
    party: "れいわ新選組",
    district: "比例北関東",
    prefecture: null,
  },
  {
    name: "多ケ谷亮",
    nameKana: "タガヤ リョウ",
    party: "れいわ新選組",
    district: "比例南関東",
    prefecture: null,
  },
  {
    name: "櫛渕万里",
    nameKana: "クシブチ マリ",
    party: "れいわ新選組",
    district: "比例東京",
    prefecture: null,
  },
  {
    name: "阪口直人",
    nameKana: "サカグチ ナオト",
    party: "れいわ新選組",
    district: "比例東海",
    prefecture: null,
  },
  {
    name: "上村英明",
    nameKana: "ウエムラ ヒデアキ",
    party: "れいわ新選組",
    district: "比例東海",
    prefecture: null,
  },
  {
    name: "大石晃子",
    nameKana: "オオイシ アキコ",
    party: "れいわ新選組",
    district: "比例近畿",
    prefecture: null,
  },
  {
    name: "八幡愛",
    nameKana: "ヤハタ アイ",
    party: "れいわ新選組",
    district: "比例近畿",
    prefecture: null,
  },
  {
    name: "山川仁",
    nameKana: "ヤマカワ ヒトシ",
    party: "れいわ新選組",
    district: "比例九州",
    prefecture: null,
  },
];

// ============================================
// 日本共産党（8名 = 小選挙区1 + 比例7）
// ============================================

const JCP_MEMBERS: RepresentativeData[] = [
  {
    name: "赤嶺政賢",
    nameKana: "アカミネ セイケン",
    party: "日本共産党",
    district: "沖縄1区",
    prefecture: "沖縄県",
  },
  {
    name: "塩川鉄也",
    nameKana: "シオカワ テツヤ",
    party: "日本共産党",
    district: "比例北関東",
    prefecture: null,
  },
  {
    name: "志位和夫",
    nameKana: "シイ カズオ",
    party: "日本共産党",
    district: "比例南関東",
    prefecture: null,
  },
  {
    name: "田村智子",
    nameKana: "タムラ トモコ",
    party: "日本共産党",
    district: "比例東京",
    prefecture: null,
  },
  {
    name: "本村伸子",
    nameKana: "モトムラ ノブコ",
    party: "日本共産党",
    district: "比例東海",
    prefecture: null,
  },
  {
    name: "堀川あきこ",
    nameKana: "ホリカワ アキコ",
    party: "日本共産党",
    district: "比例近畿",
    prefecture: null,
  },
  {
    name: "辰巳孝太郎",
    nameKana: "タツミ コウタロウ",
    party: "日本共産党",
    district: "比例近畿",
    prefecture: null,
  },
  {
    name: "田村貴昭",
    nameKana: "タムラ タカアキ",
    party: "日本共産党",
    district: "比例九州",
    prefecture: null,
  },
];

// ============================================
// 参政党（3名 = 比例3）
// ============================================

const SANSEITO_MEMBERS: RepresentativeData[] = [
  {
    name: "鈴木敦",
    nameKana: "スズキ アツシ",
    party: "参政党",
    district: "比例南関東",
    prefecture: null,
  },
  {
    name: "北野裕子",
    nameKana: "キタノ ユウコ",
    party: "参政党",
    district: "比例近畿",
    prefecture: null,
  },
  {
    name: "吉川里奈",
    nameKana: "ヨシカワ リナ",
    party: "参政党",
    district: "比例九州",
    prefecture: null,
  },
];

// ============================================
// 日本保守党（3名 = 小選挙区1 + 比例2）
// ============================================

const HOSHU_MEMBERS: RepresentativeData[] = [
  {
    name: "河村たかし",
    nameKana: "カワムラ タカシ",
    party: "日本保守党",
    district: "愛知1区",
    prefecture: "愛知県",
  },
  {
    name: "竹上裕子",
    nameKana: "タケガミ ユウコ",
    party: "日本保守党",
    district: "比例東海",
    prefecture: null,
  },
  {
    name: "島田洋一",
    nameKana: "シマダ ヨウイチ",
    party: "日本保守党",
    district: "比例近畿",
    prefecture: null,
  },
];

// ============================================
// 社会民主党（1名 = 小選挙区1）
// ============================================

const SDP_MEMBERS: RepresentativeData[] = [
  {
    name: "新垣邦男",
    nameKana: "アラカキ クニオ",
    party: "社会民主党",
    district: "沖縄2区",
    prefecture: "沖縄県",
  },
];

// ============================================
// 無所属（12名）
// ============================================

const INDEPENDENT_MEMBERS: RepresentativeData[] = [
  {
    name: "福島伸享",
    nameKana: "フクシマ ノブユキ",
    party: "無所属",
    district: "茨城1区",
    prefecture: "茨城県",
  },
  {
    name: "中村勇太",
    nameKana: "ナカムラ ユウタ",
    party: "無所属",
    district: "茨城7区",
    prefecture: "茨城県",
  },
  {
    name: "平沢勝栄",
    nameKana: "ヒラサワ カツエイ",
    party: "無所属",
    district: "東京17区",
    prefecture: "東京都",
  },
  {
    name: "萩生田光一",
    nameKana: "ハギウダ コウイチ",
    party: "無所属",
    district: "東京24区",
    prefecture: "東京都",
  },
  {
    name: "松原仁",
    nameKana: "マツバラ ジン",
    party: "無所属",
    district: "東京26区",
    prefecture: "東京都",
  },
  {
    name: "北神圭朗",
    nameKana: "キタガミ ケイロウ",
    party: "無所属",
    district: "京都4区",
    prefecture: "京都府",
  },
  {
    name: "西村康稔",
    nameKana: "ニシムラ ヤストシ",
    party: "無所属",
    district: "兵庫9区",
    prefecture: "兵庫県",
  },
  {
    name: "世耕弘成",
    nameKana: "セコウ ヒロシゲ",
    party: "無所属",
    district: "和歌山2区",
    prefecture: "和歌山県",
  },
  {
    name: "緒方林太郎",
    nameKana: "オガタ リンタロウ",
    party: "無所属",
    district: "福岡9区",
    prefecture: "福岡県",
  },
  {
    name: "吉良州司",
    nameKana: "キラ シュウジ",
    party: "無所属",
    district: "大分1区",
    prefecture: "大分県",
  },
  {
    name: "広瀬建",
    nameKana: "ヒロセ ケン",
    party: "無所属",
    district: "大分2区",
    prefecture: "大分県",
  },
  {
    name: "三反園訓",
    nameKana: "ミタゾノ サトシ",
    party: "無所属",
    district: "鹿児島2区",
    prefecture: "鹿児島県",
  },
];

// ============================================
// 全議員を結合
// ============================================

const ALL_REPRESENTATIVES: RepresentativeData[] = [
  ...LDP_MEMBERS,
  ...CDP_MEMBERS,
  ...ISHIN_MEMBERS,
  ...DPP_MEMBERS,
  ...KOMEITO_MEMBERS,
  ...REIWA_MEMBERS,
  ...JCP_MEMBERS,
  ...SANSEITO_MEMBERS,
  ...HOSHU_MEMBERS,
  ...SDP_MEMBERS,
  ...INDEPENDENT_MEMBERS,
];

// ============================================
// メイン処理
// ============================================

/**
 * 安定的な ID を生成する。
 * "rep-" プレフィックス + 氏名を使う。
 */
function makeRepresentativeId(name: string): string {
  return `rep-${name}`;
}

export async function seedRepresentatives(): Promise<void> {
  console.log("[representatives] 衆議院議員データのシードを開始...");
  console.log(`[representatives] 対象議員数: ${ALL_REPRESENTATIVES.length}名`);

  // キャッシュ
  const partyCache = new Map<string, string>();
  const prefectureCache = new Map<string, string>();

  let upsertCount = 0;
  let skipCount = 0;

  for (const rep of ALL_REPRESENTATIVES) {
    // --- 政党の解決 ---
    let partyId: string | null = null;

    if (partyCache.has(rep.party)) {
      partyId = partyCache.get(rep.party)!;
    } else {
      const party = await prisma.party.findFirst({
        where: { name: rep.party },
      });
      if (party) {
        partyCache.set(rep.party, party.id);
        partyId = party.id;
      } else {
        // "社民党" → "社会民主党" のフォールバック
        if (rep.party === "社民党") {
          const sdp = await prisma.party.findFirst({
            where: { name: "社会民主党" },
          });
          if (sdp) {
            partyCache.set(rep.party, sdp.id);
            partyId = sdp.id;
          }
        }
        if (!partyId) {
          console.warn(`[representatives]   政党が見つかりません: ${rep.party} (${rep.name})`);
        }
      }
    }

    // --- 都道府県の解決 ---
    let prefectureId: string | null = null;

    if (rep.prefecture) {
      if (prefectureCache.has(rep.prefecture)) {
        prefectureId = prefectureCache.get(rep.prefecture)!;
      } else {
        const pref = await prisma.prefecture.findFirst({
          where: { name: rep.prefecture },
        });
        if (pref) {
          prefectureCache.set(rep.prefecture, pref.id);
          prefectureId = pref.id;
        } else {
          console.warn(
            `[representatives]   都道府県が見つかりません: ${rep.prefecture} (${rep.name})`,
          );
        }
      }
    }

    // --- 議員を upsert ---
    const id = makeRepresentativeId(rep.name);

    try {
      await prisma.politician.upsert({
        where: { id },
        update: {
          name: rep.name,
          nameKana: rep.nameKana,
          partyId,
          chamber: "HOUSE_OF_REPRESENTATIVES",
          district: rep.district,
          prefectureId,
          isActive: true,
        },
        create: {
          id,
          name: rep.name,
          nameKana: rep.nameKana,
          partyId,
          chamber: "HOUSE_OF_REPRESENTATIVES",
          district: rep.district,
          prefectureId,
          isActive: true,
        },
      });

      upsertCount++;

      if (upsertCount % 50 === 0) {
        console.log(`[representatives]   ${upsertCount}名処理済み...`);
      }
    } catch (error) {
      skipCount++;
      console.error(
        `[representatives]   エラー: ${rep.name} — ${error instanceof Error ? error.message : error}`,
      );
    }
  }

  // --- サマリー ---
  const partyCounts = new Map<string, number>();
  for (const r of ALL_REPRESENTATIVES) {
    partyCounts.set(r.party, (partyCounts.get(r.party) ?? 0) + 1);
  }

  console.log("[representatives] --- 政党別議員数 ---");
  for (const [party, count] of [...partyCounts.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`[representatives]   ${party}: ${count}名`);
  }

  console.log(`[representatives] 完了 — ${upsertCount}名登録, ${skipCount}名スキップ`);
}

// CLI実行
if (process.argv[1]?.includes("politicians/seed-representatives")) {
  seedRepresentatives()
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
