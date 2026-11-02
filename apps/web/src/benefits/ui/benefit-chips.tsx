import { reviewBadge, SCOPE_LABEL, type PublishedBenefit } from '../domain/benefit';
import { CONDITION_LABEL } from '../domain/eligibility';

export function BenefitChips({ benefit }: { benefit: PublishedBenefit }) {
  const badge = reviewBadge(benefit);
  return (
    <div className="chips">
      <span className={`chip scope-${benefit.scope}`}>{SCOPE_LABEL[benefit.scope]}</span>
      {benefit.conditions.map((condition) => (
        <span key={condition} className="chip condition">
          {CONDITION_LABEL[condition]}
        </span>
      ))}
      <span className={`chip review-${badge.tone}`}>{badge.text}</span>
    </div>
  );
}
