import { periodStatus } from '../domain/application-period';
import type { PublishedBenefit } from '../domain/benefit';
import { CalendarDate } from '../domain/calendar-date';
import { BenefitChips } from './benefit-chips';
import { CardFooter } from './card-footer';
import { HowToApplyLine } from './how-to-apply-line';

export function BenefitCard({ benefit }: { benefit: PublishedBenefit }) {
  return (
    <li className={isClosed(benefit) ? 'card is-closed' : 'card'}>
      <BenefitChips benefit={benefit} />
      <h3>{benefit.name}</h3>
      {benefit.amount && <p className="amt">{benefit.amount.summary}</p>}
      <HowToApplyLine benefit={benefit} />
      <CardFooter benefit={benefit} />
    </li>
  );
}

// 올해 신청이 끝난 혜택은 흐리게 (지우지는 않는다)
function isClosed(benefit: PublishedBenefit) {
  return benefit.applicationPeriod !== null && periodStatus(benefit.applicationPeriod, CalendarDate.today()).kind === 'closed';
}
