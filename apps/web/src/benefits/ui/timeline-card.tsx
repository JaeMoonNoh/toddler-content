import { deadlineEventOf } from '../domain/deadline-event';
import { googleCalendarUrl } from '../domain/google-calendar';
import { describeStatus, emphasisOf } from '../domain/schedule-window';
import type { TimelineItem } from '../domain/timeline';
import { BenefitChips } from './benefit-chips';
import { CardFooter } from './card-footer';
import { HowToApplyLine } from './how-to-apply-line';
import { useIsApplied } from './save-controls';

// 한눈에 볼 것(기간, 설명, 금액)만 펼치고, 근거는 접어 둔다
export function TimelineCard({ item }: { item: TimelineItem }) {
  const { benefit, schedule, window, status } = item;
  const applied = useIsApplied(benefit.slug);
  return (
    <li className={applied ? 'ev is-done' : `ev s-${emphasisOf(status)}`}>
      <div className="when">
        <b>{window.formatStartShort()}</b>
        <span>{describeStatus(status)}</span>
      </div>
      <div className="card">
        <BenefitChips benefit={benefit} />
        <h3>{benefit.name}</h3>
        <p className="period">
          {window.formatPeriod()} <span>· {schedule.untilLabel}</span>
        </p>
        <p className="summary">{schedule.summary}</p>
        {benefit.amount && <p className="amt">{benefit.amount.summary}</p>}
        <HowToApplyLine benefit={benefit} />
        <details className="basis">
          <summary>근거</summary>
          <p>
            {schedule.basis.text}{' '}
            <a href={schedule.basis.url} target="_blank" rel="noopener noreferrer">
              근거 보기
            </a>
          </p>
        </details>
        <CardFooter benefit={benefit}>
          {status.kind !== 'closed' && (
            <a href={googleCalendarUrl(deadlineEventOf(item))} target="_blank" rel="noopener noreferrer">
              캘린더에 추가
            </a>
          )}
        </CardFooter>
      </div>
    </li>
  );
}
