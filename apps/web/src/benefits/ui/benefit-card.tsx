import { periodStatus } from '../domain/application-period';
import type { PublishedBenefit } from '../domain/benefit';
import { CalendarDate } from '../domain/calendar-date';
import { BenefitChips } from './benefit-chips';
import { CardFooter } from './card-footer';
import { HowToApplyLine } from './how-to-apply-line';
import { useIsApplied } from './save-controls';

export function BenefitCard({ benefit, as: Tag = 'li' }: { benefit: PublishedBenefit; as?: 'li' | 'div' }) {
  const applied = useIsApplied(benefit.slug);
  return (
    <Tag className={['card', isClosed(benefit) && 'is-closed', applied && 'is-done'].filter(Boolean).join(' ')}>
      <BenefitChips benefit={benefit} />
      <h3>{benefit.name}</h3>
      {benefit.amount && <p className="amt">{benefit.amount.summary}</p>}
      <HowToApplyLine benefit={benefit} />
      <CardFooter benefit={benefit} />
    </Tag>
  );
}

// 올해 신청이 끝난 혜택은 흐리게 (지우지는 않는다)
function isClosed(benefit: PublishedBenefit) {
  return benefit.applicationPeriod !== null && periodStatus(benefit.applicationPeriod, CalendarDate.today()).kind === 'closed';
}
