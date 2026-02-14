import { ScrollReveal, SmoothScrollProvider } from "@ojpp/ui";
import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { CultureScopeNav } from "./components/nav";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoSansJP = Noto_Sans_JP({ subsets: ["latin"], variable: "--font-noto-sans-jp" });

export const metadata: Metadata = {
  title: "CultureScope - 日本の文化政策を可視化",
  description:
    "文化庁予算・芸術振興・文化財保護を一目で把握。文化政策データを可視化し、政党の文化政策スタンスを比較する。",
  openGraph: {
    title: "CultureScope - 日本の文化政策を可視化",
    description:
      "文化庁予算・芸術振興・文化財保護を一目で把握。文化政策データを可視化し、政党の文化政策スタンスを比較する。",
    siteName: "Open Japan PoliTech Platform",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CultureScope - 日本の文化政策を可視化",
    description:
      "文化庁予算・芸術振興・文化財保護を一目で把握。文化政策データを可視化し、政党の文化政策スタンスを比較する。",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={`${inter.variable} ${notoSansJP.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <CultureScopeNav />
        <div className="border-b border-amber-900/30 bg-amber-950/40 px-6 py-2 text-center text-xs text-amber-400/70">
          v0.1 デモ版 — 文化庁公開資料に基づく文化政策データ
        </div>
        <SmoothScrollProvider>
          <main>{children}</main>
        </SmoothScrollProvider>
        <ScrollReveal>
          <footer className="border-t border-white/5 bg-black/40 px-6 py-12 text-center text-sm text-zinc-500">
            <div className="mx-auto max-w-7xl">
              <p className="tracking-wide">
                文化を、政治の言語で読み解く — AIエージェント時代の政治インフラ
              </p>
              <p className="mt-2">政党にも企業にもよらない、完全オープンな政治テクノロジー基盤</p>
              <p className="mt-1 text-xs text-zinc-600">
                Open Japan PoliTech Platform v0.1 | AGPL-3.0-or-later
              </p>
            </div>
          </footer>
        </ScrollReveal>
      </body>
    </html>
  );
}
