import { babySizeOf } from '../domain/baby-size';
import type { CalendarDate } from '../domain/calendar-date';
import type { ChildDates } from '../domain/child-dates';
import { withTopicParticle } from '../domain/child-name';
import { deadlineEventOf } from '../domain/deadline-event';
import { googleCalendarUrl } from '../domain/google-calendar';
import type { ChildStage } from '../domain/pregnancy';
import { describeStatus } from '../domain/schedule-window';
import { countdownOf, thisWeekOf } from '../domain/this-week';
import type { Timeline, TimelineItem } from '../domain/timeline';
import { useSavedBenefits } from './saved-benefits-store';

// 처음 보는 곳. 감성(남은 날, 과일 크기)은 위에, 해야 할 일과 마감은 차분하게 아래에 둔다
export function ThisWeekPanel({ timeline, stage, dates, callName, today }: { timeline: Timeline; stage: ChildStage; dates: ChildDates; callName: string; today: CalendarDate }) {
  const saved = useSavedBenefits()?.saved;
  const countdown = countdownOf(stage, dates, callName);
  if (!countdown) return null;
  const size = babySizeOf(stage);
  const { toDo, nextDeadline, nextOpening } = thisWeekOf(timeline, today, (slug) => saved?.stateOf(slug) === 'applied');

  return (
    <section className="week" aria-labelledby="week-title">
      <div className="week-hero">
        <div>
          <h2 id="week-title">{countdown.headline}</h2>
          <p>{countdown.detail}</p>
        </div>
        {size && (
          <span className="week-fruit" aria-hidden="true">
            {size.emoji}
          </span>
        )}
      </div>
      {size && stage.kind === 'pregnant' && (
        <p className="week-size">
          {withTopicParticle(callName)} 지금 <b>{size.fruit}</b>만 해요 <small>크기는 대략이에요</small>
        </p>
      )}

      <h3>이번 주에 챙길 것</h3>
      {toDo.length === 0 ? (
        <p className="week-empty">
          이번 주는 여유 있어요.
          {nextOpening && (
            <>
              {' '}
              다음은 <b>{nextOpening.benefit.name}</b> · {describeStatus(nextOpening.status)}
            </>
          )}
        </p>
      ) : (
        <ul className="week-list">
          {toDo.map((item) => (
            <li key={item.benefit.slug}>
              <b>{item.benefit.name}</b>
              <span>{describeStatus(item.status)}</span>
            </li>
          ))}
        </ul>
      )}

      {nextDeadline && <NextDeadline item={nextDeadline} />}
    </section>
  );
}

function NextDeadline({ item }: { item: TimelineItem }) {
  return (
    <div className="week-next">
      <span className="week-next-label">다음 마감</span>
      <b>{item.benefit.name}</b>
      <span>
        {item.window.end.format()}까지 · {describeStatus(item.status)}
      </span>
      <a className="btn" href={googleCalendarUrl(deadlineEventOf(item))} target="_blank" rel="noopener noreferrer">
        캘린더에 넣기
      </a>
    </div>
  );
}
