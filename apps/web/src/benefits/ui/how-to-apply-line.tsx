import type { PublishedBenefit } from '../domain/benefit';

// 어디서 어떻게 신청하는지 한 줄. 정리하지 않은 혜택은 원문 보기로 안내한다
export function HowToApplyLine({ benefit }: { benefit: PublishedBenefit }) {
  if (!benefit.howToApply) return null;
  return (
    <p className="how">
      <span>신청</span>
      {benefit.howToApply.summary}
    </p>
  );
}
