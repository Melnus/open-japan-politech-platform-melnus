import { ScrollReveal, SmoothScrollProvider } from "@ojpp/ui";
import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { DarkNavBar } from "./dark-nav";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoSansJP = Noto_Sans_JP({ subsets: ["latin"], variable: "--font-noto-sans-jp" });

export const metadata: Metadata = {
  title: "SeatMap - 国会の議席勢力図を可視化",
  description:
    "衆議院・参議院の議席構成を一目で把握。過去10年の選挙結果を比較し、政治勢力の変遷を可視化する。",
  openGraph: {
    title: "SeatMap - 国会の議席勢力図を可視化",
    description:
      "衆議院・参議院の議席構成を一目で把握。過去10年の選挙結果を比較し、政治勢力の変遷を可視化する。",
    siteName: "Open Japan PoliTech Platform",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SeatMap - 国会の議席勢力図を可視化",
    description:
      "衆議院・参議院の議席構成を一目で把握。過去10年の選挙結果を比較し、政治勢力の変遷を可視化する。",
  },
};

const NAV_ITEMS = [
  { href: "/", label: "議席構成" },
  { href: "/elections", label: "選挙別推移" },
  { href: "/about", label: "概要" },
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={`${inter.variable} ${notoSansJP.variable} dark`}>
      <body className="min-h-screen bg-slate-950 font-sans text-slate-200 antialiased">
        {/* Dark navigation bar */}
        <DarkNavBar items={NAV_ITEMS} />

        {/* Subtle version banner */}
        <div className="border-b border-white/[0.04] px-6 py-2 text-center text-[10px] text-slate-600">
          v0.1 -- 選挙データは総務省公開資料に基づく
        </div>

        <SmoothScrollProvider>
          <main>{children}</main>
        </SmoothScrollProvider>

        <ScrollReveal>
          <footer className="border-t border-white/[0.06] px-6 py-12 text-center text-sm text-slate-600">
            <div className="mx-auto max-w-7xl">
              <p>国会の勢力図を誰でも見える形に -- AIエージェント時代の政治インフラ</p>
              <p className="mt-2">政党にも企業にもよらない、完全オープンな政治テクノロジー基盤</p>
              <p className="mt-1 text-xs text-slate-700">
                Open Japan PoliTech Platform v0.1 | AGPL-3.0-or-later
              </p>
            </div>
          </footer>
        </ScrollReveal>
      </body>
    </html>
  );
}
