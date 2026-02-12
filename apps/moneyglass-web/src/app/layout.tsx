import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MoneyGlass - 政治資金を、ガラスのように透明に",
  description: "全政党・全政治団体の資金の流れを可視化。AIエージェントが24時間監視・分析し、誰もが政治資金の実態にアクセスできる。",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <header className="border-b bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <h1 className="text-xl font-bold">
              <span className="text-blue-600">Money</span>Glass
            </h1>
            <nav className="flex gap-6 text-sm">
              <a href="/" className="hover:text-blue-600">ダッシュボード</a>
              <a href="/politicians" className="hover:text-blue-600">政治家一覧</a>
              <a href="/parties" className="hover:text-blue-600">政党別</a>
              <a href="/api" className="hover:text-blue-600">API</a>
              <a href="/about" className="hover:text-blue-600">このサービスについて</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t bg-white py-8 text-center text-sm text-gray-500">
          <p>AIエージェント時代の政治資金監視 — 人間が見ていなくても、エージェントが見ている</p>
          <p className="mt-1">Open Japan PoliTech Platform | AGPL-3.0</p>
        </footer>
      </body>
    </html>
  );
}
