import { SmoothScrollProvider } from "@ojpp/ui";
import type { Metadata } from "next";
import { Noto_Sans_JP, Space_Grotesk } from "next/font/google";
import { FluidCanvas } from "@/components/fluid-canvas";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700"],
});
const notoSansJP = Noto_Sans_JP({ subsets: ["latin"], variable: "--font-jp" });

export const metadata: Metadata = {
  title: "OJPP — Political Command Center",
  description: "AIエージェント時代の政治インフラ — 日本の政治データを完全オープンに可視化",
  openGraph: {
    title: "OJPP — Political Command Center",
    description: "6つのアプリで日本の政治データを完全オープンに可視化",
    siteName: "Open Japan PoliTech Platform",
    locale: "ja_JP",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={`${spaceGrotesk.variable} ${notoSansJP.variable}`}>
      <body style={{ fontFamily: "var(--font-display), var(--font-jp), sans-serif" }}>
        {/* WebGPU fluid simulation — falls back gracefully */}
        <FluidCanvas />

        {/* Rainbow gradient mesh — CSS fallback + ambient layer */}
        <div className="gradient-mesh" aria-hidden="true">
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />
          <div className="blob blob-4" />
          <div className="blob blob-5" />
          <div className="blob blob-6" />
        </div>

        {/* CRT scan lines */}
        <div className="scan-lines" aria-hidden="true" />

        <SmoothScrollProvider>
          <div className="relative z-10">
            <main>{children}</main>
            <footer className="border-t border-[var(--border)] px-6 py-10 text-center">
              <p
                className="mono text-xs tracking-widest text-[var(--accent)]"
                style={{ opacity: 0.5 }}
              >
                OPEN JAPAN POLITECH PLATFORM
              </p>
              <p className="mt-2 text-xs text-[var(--text-dim)]">
                政党にも企業にもよらない、完全オープンな政治テクノロジー基盤
              </p>
              <p className="mono mt-1 text-[0.6rem] text-[var(--text-ghost)]">
                {"v0.1.2 · AGPL-3.0-or-later"}
              </p>
            </footer>
          </div>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
