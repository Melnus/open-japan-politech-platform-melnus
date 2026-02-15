import type { Metadata } from "next";
import { Outfit, Zen_Kaku_Gothic_New } from "next/font/google";
import "./globals.css";
import { DarkNavigationBar } from "@/components/dark-navigation-bar";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const zenKaku = Zen_Kaku_Gothic_New({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-zen",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BroadListening β — 意見生態系プラットフォーム",
  description:
    "意見を計算機自然の生態系として可視化。デジタルフェロモンとArgument Miningが自己組織化的に合意を形成する。",
  openGraph: {
    title: "BroadListening β — 意見生態系プラットフォーム",
    description:
      "意見を計算機自然の生態系として可視化。デジタルフェロモンとArgument Miningが自己組織化的に合意を形成する。",
    siteName: "Open Japan PoliTech Platform",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BroadListening β — 意見生態系プラットフォーム",
    description:
      "意見を計算機自然の生態系として可視化。デジタルフェロモンとArgument Miningが自己組織化的に合意を形成する。",
  },
};

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/topics", label: "Topics" },
  { href: "/about", label: "About" },
  { href: "/api-docs", label: "API" },
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={`${outfit.variable} ${zenKaku.variable}`}>
      <body
        className="min-h-screen bg-[#050505] text-[#f1f5f9] antialiased"
        style={{ fontFamily: "var(--font-zen), var(--font-outfit), system-ui, sans-serif" }}
      >
        <DarkNavigationBar items={NAV_ITEMS} />
        <main>{children}</main>

        {/* Noise texture for film grain */}
        <div className="noise-overlay" />
      </body>
    </html>
  );
}
