import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "계산기 모음 | 실업급여 · 연차수당 · 퇴직금 · D-Day",
  description: "실업급여, 연차수당, 퇴직금, 주휴수당, 만 나이, D-Day, 전역일, 환율, 단위 변환 등 생활에 필요한 계산기를 한 곳에서 이용하세요."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <header className="border-b bg-white">
          <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-lg font-bold">🧮 계산기 모음</Link>
            <span className="text-xs text-slate-500">설치·로그인 없이 바로 계산</span>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <footer className="border-t bg-white">
          <div className="mx-auto max-w-5xl px-4 py-6 text-xs text-slate-500">
            계산 결과는 일반적인 공식과 예시 값에 기반한 참고용입니다. 법적 효력이 있는 정확한 금액은 관련 기관 또는 전문가에게 확인하세요.
          </div>
        </footer>
      </body>
    </html>
  );
}
