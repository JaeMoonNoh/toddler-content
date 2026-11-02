import { deadlineEventOf } from '../domain/deadline-event';
import { googleCalendarUrl } from '../domain/google-calendar';
import { describeStatus } from '../domain/schedule-window';
import type { TimelineItem } from '../domain/timeline';
import { BenefitChips } from './benefit-chips';

export function TimelineCard({ item }: { item: TimelineItem }) {
  const { benefit, schedule, window, status } = item;
  return (
    <li className={`ev s-${status.kind}`}>
      <div className="when">
        <b>{window.start.formatShort()}</b>
        <span>{describeStatus(status)}</span>
      </div>
      <div className="card">
        <BenefitChips benefit={benefit} />
        <h3>{benefit.name}</h3>
        <dl>
          <dt>기간</dt>
          <dd>
            {window.start.format()} ~ {window.end.format()}
          </dd>
          <dt>마감</dt>
          <dd>{schedule.untilLabel}</dd>
          {benefit.amount && (
            <>
              <dt>금액</dt>
              <dd className="amt">{benefit.amount.summary}</dd>
            </>
          )}
        </dl>
        <p className="summary">{schedule.summary}</p>
        <details className="basis">
          <summary>이 일정의 근거</summary>
          <p>
            {schedule.basis.text}{' '}
            <a href={schedule.basis.url} target="_blank" rel="noopener noreferrer">
              근거 보기
            </a>
          </p>
        </details>
        <div className="meta">
          <span>출처 {benefit.sourceName}</span>
          {status.kind !== 'closed' && (
            <a className="cal" href={googleCalendarUrl(deadlineEventOf(item))} target="_blank" rel="noopener noreferrer">
              구글 캘린더에 마감일 추가
            </a>
          )}
          <a href={benefit.sourceUrl} target="_blank" rel="noopener noreferrer">
            원문 보기
          </a>
        </div>
      </div>
    </li>
  );
}
