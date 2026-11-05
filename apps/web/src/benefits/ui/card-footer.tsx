import type { ReactNode } from 'react';
import { reviewBadge, type PublishedBenefit } from '../domain/benefit';
import { SaveControls } from './save-controls';

// 카드 맨 아래: 최종 확인일(또는 출처)과 링크
export function CardFooter({ benefit, children }: { benefit: PublishedBenefit; children?: ReactNode }) {
  const badge = reviewBadge(benefit);
  return (
    <div className="meta">
      <span>{badge.tone === 'verified' ? `${badge.text} · ${benefit.sourceName}` : `출처 ${benefit.sourceName}`}</span>
      <span className="links">
        <SaveControls slug={benefit.slug} />
        {children}
        <a href={benefit.sourceUrl} target="_blank" rel="noopener noreferrer">
          원문 보기
        </a>
      </span>
    </div>
  );
}
