import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Canvas Verdict — 그림 피드백 플랫폼',
  description:
    '클립 스튜디오 등 외부 드로잉 툴로 작업한 피드백을 실시간으로 공유하고, 의료 테마 처방전으로 체계적인 성장을 경험하세요.',
  keywords: ['그림 피드백', '아트 피드백', 'Canvas Verdict', '처방전', '일러스트'],
  openGraph: {
    title: 'Canvas Verdict — 그림 피드백 플랫폼',
    description: '피드백을 처방전으로. 당신의 성장을 데이터로.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={inter.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
