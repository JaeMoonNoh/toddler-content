import { CalendarDate } from '../domain/calendar-date';
import { deadlineEventsOfSaved } from '../domain/deadline-event';
import type { SavedItem } from '../domain/saved-benefits';
import { BenefitCard } from './benefit-card';
import { CalendarDownload } from './calendar-download';
import { useSavedBenefits } from './saved-benefits-store';
import { TimelineCard } from './timeline-card';

// 신청 마감이 빠른 것부터. 출생일·출산예정일로 일정을 계산한 혜택은 타임라인 카드로 보여준다
export function SavedList({ items }: { items: SavedItem[] }) {
  const inAccount = useSavedBenefits()?.place === 'account';
  // 신청할 것만 알린다. 이미 신청한 혜택은 바뀌어도 할 일이 없다
  const changed = items.filter((item) => item.state === 'todo' && item.benefit.reviewStatus === 'SOURCE_CHANGED').length;
  return (
    <section aria-labelledby="saved-title">
      <div className="listhead">
        <h2 id="saved-title">저장한 혜택</h2>
        <p>{items.length}건</p>
      </div>
      <p className="hint">
        신청 마감이 빠른 순서예요. {inAccount ? '로그인한 계정에 저장돼서 다른 기기에서도 보여요.' : '저장한 목록은 이 기기(브라우저)에만 남아요. 로그인하면 계정으로 옮겨요.'}
      </p>
      {changed > 0 && (
        <p className="notice">저장한 혜택 중 {changed}건은 원문 내용이 바뀌어 다시 확인하고 있어요. 신청 전에 원문을 꼭 확인해 주세요.</p>
      )}
      <CalendarDownload events={deadlineEventsOfSaved(items, CalendarDate.today())} fileName="저장한-혜택-마감일.ics" />
      <ol className="tl">
        {items.map((item) =>
          item.scheduled ? <TimelineCard key={item.benefit.slug} item={item.scheduled} /> : <UnscheduledItem key={item.benefit.slug} item={item} />,
        )}
      </ol>
    </section>
  );
}

function UnscheduledItem({ item }: { item: SavedItem }) {
  const { benefit, deadline } = item;
  return (
    <li className="ev">
      <div className="when">
        <b>{deadline ? deadline.formatShort() : '-'}</b>
        <span>{deadline ? (CalendarDate.today().isAfter(deadline) ? '기간 지남' : '신청 마감') : '기간은 원문 확인'}</span>
      </div>
      <BenefitCard benefit={benefit} as="div" />
    </li>
  );
}
