import { deadlineEventOf } from '../domain/deadline-event';
import { googleCalendarUrl } from '../domain/google-calendar';
import { describeStatus, emphasisOf } from '../domain/schedule-window';
import type { TimelineItem } from '../domain/timeline';
import { BenefitChips } from './benefit-chips';
import { CardFooter } from './card-footer';

// 한눈에 볼 것(기간, 설명, 금액)만 펼치고, 근거는 접어 둔다
export function TimelineCard({ item }: { item: TimelineItem }) {
  const { benefit, schedule, window, status } = item;
  return (
    <li className={`ev s-${emphasisOf(status)}`}>
      <div className="when">
        <b>{window.start.formatShort()}</b>
        <span>{describeStatus(status)}</span>
      </div>
      <div className="card">
        <BenefitChips benefit={benefit} />
        <h3>{benefit.name}</h3>
        <p className="period">
          {window.start.format()} ~ {window.end.format()} <span>· {schedule.untilLabel}</span>
        </p>
        <p className="summary">{schedule.summary}</p>
        {benefit.amount && <p className="amt">{benefit.amount.summary}</p>}
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
