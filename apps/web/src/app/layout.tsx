import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: '출산 혜택 타임라인',
  description: '지역과 출산예정일만 넣으면 받을 수 있는 혜택과 신청 일정을 보여줍니다.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0, padding: 24 }}>{children}</body>
    </html>
  );
}
