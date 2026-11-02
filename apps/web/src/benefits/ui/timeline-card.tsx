import { reviewBadge, SCOPE_LABEL } from '../domain/benefit';
import { describeStatus } from '../domain/schedule-window';
import type { TimelineItem } from '../domain/timeline';

export function TimelineCard({ item }: { item: TimelineItem }) {
  const { benefit, schedule, window, status } = item;
  const badge = reviewBadge(benefit);
  return (
    <li className={`ev s-${status.kind}`}>
      <div className="when">
        <b>{window.start.formatShort()}</b>
        <span>{describeStatus(status)}</span>
      </div>
      <div className="card">
        <div className="chips">
          <span className={`chip scope-${benefit.scope}`}>{SCOPE_LABEL[benefit.scope]}</span>
          <span className={`chip review-${badge.tone}`}>{badge.text}</span>
        </div>
        <h3>{benefit.name}</h3>
        <dl>
          <dt>기간</dt>
          <dd>
            {window.start.format()} ~ {window.end.format()}
          </dd>
          <dt>마감</dt>
          <dd>{schedule.untilLabel}</dd>
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
          <a href={benefit.sourceUrl} target="_blank" rel="noopener noreferrer">
            원문 보기
          </a>
        </div>
      </div>
    </li>
  );
}
