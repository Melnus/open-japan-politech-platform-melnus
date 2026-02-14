import { NavigationBar, ScrollReveal, SmoothScrollProvider } from "@ojpp/ui";
import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoSansJP = Noto_Sans_JP({ subsets: ["latin"], variable: "--font-noto-sans-jp" });

export const metadata: Metadata = {
  title: "PolicyDiff - 全政党の政策を、差分で比較する",
  description:
    "全政党のマニフェスト・政策をバージョン管理。AIエージェントが変更を追跡し、誰もが政策の違いと変遷を即座に把握できる。",
  openGraph: {
    title: "PolicyDiff - 全政党の政策を、差分で比較する",
    description:
      "全政党のマニフェスト・政策をバージョン管理。AIエージェントが変更を追跡し、誰もが政策の違いと変遷を即座に把握できる。",
    siteName: "Open Japan PoliTech Platform",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PolicyDiff - 全政党の政策を、差分で比較する",
    description:
      "全政党のマニフェスト・政策をバージョン管理。AIエージェントが変更を追跡し、誰もが政策の違いと変遷を即座に把握できる。",
  },
};

const NAV_ITEMS = [
  { href: "/", label: "ダッシュボード" },
  { href: "/compare", label: "政策比較" },
  { href: "/category/教育", label: "カテゴリ" },
  { href: "/proposals", label: "市民提案" },
  { href: "/api-docs", label: "API" },
  { href: "/about", label: "About" },
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={`${inter.variable} ${notoSansJP.variable}`}>
      <body className="min-h-screen bg-slate-900 font-sans text-slate-100 antialiased">
        <NavigationBar
          brand="PolicyDiff"
          brandColor="text-blue-400"
          items={NAV_ITEMS}
          accentColor="hover:text-blue-400"
          variant="dark"
        />
        <div className="border-b border-slate-700/50 bg-slate-800/60 px-6 py-2 text-center text-xs text-slate-400">
          v0.1 デモ版 —
          政策データは各党の公式マニフェストを参考にしたデモ用データです。公式の政策文書ではありません。
        </div>
        <SmoothScrollProvider>
          <main>{children}</main>
        </SmoothScrollProvider>
        <ScrollReveal>
          <footer className="border-t border-slate-800 bg-slate-950 px-6 py-12 text-center text-sm text-slate-500">
            <div className="mx-auto max-w-7xl">
              <p>
                AIエージェント時代の政策比較 -- あなたのエージェントが全政党の政策を常時分析する
              </p>
              <p className="mt-2">政党にも企業にもよらない、完全オープンな政治テクノロジー基盤</p>
              <p className="mt-1 text-slate-600">
                Open Japan PoliTech Platform v0.1 | AGPL-3.0-or-later
              </p>
            </div>
          </footer>
        </ScrollReveal>
      </body>
    </html>
  );
}
