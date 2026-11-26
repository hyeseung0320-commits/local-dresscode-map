import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "우리 동네 데이트 장소 드레스코드",
  description:
    "동네별 데이트 장소의 분위기와 추천 옷차림을 기록하고 공유하는 웹앱",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-neutral-50 text-neutral-900">
        <header className="border-b border-neutral-200 bg-white">
          <nav className="mx-auto max-w-4xl px-5 h-16 flex items-center justify-between">
            <Link href="/" className="font-bold text-lg tracking-tight">
              👗 드레스코드 맵
            </Link>
            <Link
              href="/places/new"
              className="text-sm font-medium px-4 py-2 rounded-full bg-neutral-900 text-white hover:bg-neutral-700 transition-colors"
            >
              + 장소 등록
            </Link>
          </nav>
        </header>
        <main className="flex-1 mx-auto w-full max-w-4xl px-5 py-8">
          {children}
        </main>
        <footer className="border-t border-neutral-200 py-6 text-center text-xs text-neutral-400">
          우리 동네 데이트 장소 드레스코드 기록 · Sprint 1
        </footer>
      </body>
    </html>
  );
}
