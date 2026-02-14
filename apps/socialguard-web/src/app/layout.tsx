import { ScrollReveal, SmoothScrollProvider } from "@ojpp/ui";
import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { DarkNavigationBar } from "./dark-navigation-bar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoSansJP = Noto_Sans_JP({ subsets: ["latin"], variable: "--font-noto-sans-jp" });

export const metadata: Metadata = {
  title: "SocialGuard - 社会保障データダッシュボード",
  description:
    "年金・医療・介護・子育て支援を一目で把握。社会保障関係費の推移や制度一覧、都道府県比較、政党スタンスを可視化する。",
  openGraph: {
    title: "SocialGuard - 社会保障データダッシュボード",
    description:
      "年金・医療・介護・子育て支援を一目で把握。社会保障関係費の推移や制度一覧、都道府県比較、政党スタンスを可視化する。",
    siteName: "Open Japan PoliTech Platform",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SocialGuard - 社会保障データダッシュボード",
    description:
      "年金・医療・介護・子育て支援を一目で把握。社会保障関係費の推移や制度一覧、都道府県比較、政党スタンスを可視化する。",
  },
};

const NAV_ITEMS = [
  { href: "/", label: "ダッシュボード" },
  { href: "/budget", label: "予算" },
  { href: "/programs", label: "制度一覧" },
  { href: "/prefectures", label: "都道府県" },
  { href: "/compare", label: "政党比較" },
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={`${inter.variable} ${notoSansJP.variable}`}>
      <body className="min-h-screen bg-slate-950 font-sans text-gray-100 antialiased">
        <DarkNavigationBar items={NAV_ITEMS} />
        <div className="border-b border-emerald-900/40 bg-emerald-950/50 px-6 py-2 text-center text-xs text-emerald-400/70">
          v0.1 -- 厚生労働省・財務省公開資料に基づく社会保障データ
        </div>
        <SmoothScrollProvider>
          <main>{children}</main>
        </SmoothScrollProvider>
        <ScrollReveal>
          <footer className="border-t border-white/5 bg-slate-950 px-6 py-12 text-center text-sm text-gray-500">
            <div className="mx-auto max-w-7xl">
              <p>社会保障を誰でも見える形に -- AIエージェント時代の政治インフラ</p>
              <p className="mt-2">政党にも企業にもよらない、完全オープンな政治テクノロジー基盤</p>
              <p className="mt-1 text-gray-600">
                Open Japan PoliTech Platform v0.1 | AGPL-3.0-or-later
              </p>
            </div>
          </footer>
        </ScrollReveal>
      </body>
    </html>
  );
}
