import { CalendarDate } from '../domain/calendar-date';
import type { SavedItem } from '../domain/saved-benefits';
import { BenefitCard } from './benefit-card';
import { TimelineCard } from './timeline-card';

// 신청 마감이 빠른 것부터. 출산예정일로 일정을 계산한 혜택은 타임라인 카드로 보여준다
export function SavedList({ items }: { items: SavedItem[] }) {
  return (
    <section aria-labelledby="saved-title">
      <div className="listhead">
        <h2 id="saved-title">저장한 혜택</h2>
        <p>{items.length}건</p>
      </div>
      <p className="hint">신청 마감이 빠른 순서예요. 저장한 목록은 이 기기(브라우저)에만 남아요.</p>
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
