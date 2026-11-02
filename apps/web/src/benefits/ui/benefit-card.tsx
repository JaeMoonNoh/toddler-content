import { reviewBadge, SCOPE_LABEL, type PublishedBenefit } from '../domain/benefit';

export function BenefitCard({ benefit }: { benefit: PublishedBenefit }) {
  const badge = reviewBadge(benefit);
  return (
    <li className="card">
      <div className="chips">
        <span className={`chip scope-${benefit.scope}`}>{SCOPE_LABEL[benefit.scope]}</span>
        <span className={`chip review-${badge.tone}`}>{badge.text}</span>
      </div>
      <h3>{benefit.name}</h3>
      <div className="meta">
        <span>출처 {benefit.sourceName}</span>
        <a href={benefit.sourceUrl} target="_blank" rel="noopener noreferrer">
          원문 보기
        </a>
      </div>
    </li>
  );
}
