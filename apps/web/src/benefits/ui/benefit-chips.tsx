import { periodBadge } from '../domain/application-period';
import { reviewBadge, type PublishedBenefit } from '../domain/benefit';
import { CalendarDate } from '../domain/calendar-date';
import { CONDITION_LABEL } from '../domain/eligibility';
import { NATIONWIDE_CODE, regionLabelOf } from '../domain/region';

// 확인된 혜택은 카드 아래에 작게 확인일만 쓰고, 검증 전·다시 확인 중일 때만 칩으로 눈에 띄게 한다
export function BenefitChips({ benefit }: { benefit: PublishedBenefit }) {
  const badge = reviewBadge(benefit);
  const period = benefit.applicationPeriod ? periodBadge(benefit.applicationPeriod, CalendarDate.today()) : null;
  return (
    <div className="chips">
      <span className={benefit.regionCode === NATIONWIDE_CODE ? 'chip' : 'chip scope-local'}>{regionLabelOf(benefit)}</span>
      {benefit.conditions.map((condition) => (
        <span key={condition} className="chip condition">
          {CONDITION_LABEL[condition]}
        </span>
      ))}
      {period && <span className={`chip period-${period.tone}`}>{period.text}</span>}
      {badge.tone !== 'verified' && <span className={`chip review-${badge.tone}`}>{badge.text}</span>}
    </div>
  );
}
