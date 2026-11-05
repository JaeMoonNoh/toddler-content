import type { PublishedBenefit } from './benefit';
import { CalendarDate } from './calendar-date';
import type { SavedItem } from './saved-benefits';
import type { Timeline, TimelineItem } from './timeline';

// 캘린더에 넣을 마감일 하루짜리 일정
export interface DeadlineEvent {
  uid: string;
  title: string;
  date: CalendarDate;
  description: string;
  url: string;
}

// 이미 지난 마감은 넣지 않는다
export function deadlineEventsOf(timeline: Timeline): DeadlineEvent[] {
  return timeline.phases
    .flatMap((phase) => phase.items)
    .filter((item) => item.status.kind !== 'closed')
    .map(deadlineEventOf)
    .sort((a, b) => a.date.daysSince(b.date));
}

// 저장한 혜택 중 아직 신청하지 않았고 마감이 지나지 않은 것. 출산예정일로 계산한 일정이 없으면 올해 공고 마감을 쓴다
export function deadlineEventsOfSaved(items: SavedItem[], today: CalendarDate): DeadlineEvent[] {
  return items
    .filter((item) => item.state === 'todo' && item.deadline !== null && !today.isAfter(item.deadline))
    .flatMap((item) => {
      if (item.scheduled) return deadlineEventOf(item.scheduled);
      return item.benefit.applicationPeriod ? periodDeadlineEventOf(item.benefit, item.benefit.applicationPeriod) : [];
    })
    .sort((a, b) => a.date.daysSince(b.date));
}

export function deadlineEventOf({ benefit, schedule, window }: TimelineItem): DeadlineEvent {
  const note = window.isEstimated ? '출산예정일에 태어난다고 보고 계산한 날짜예요.' : null;
  return eventOf(benefit, window.end, `[${schedule.untilLabel}] ${benefit.name}`, [schedule.summary, `기간: ${window.formatPeriod()}`], note);
}

function periodDeadlineEventOf(benefit: PublishedBenefit, period: { start: string; end: string }): DeadlineEvent {
  const start = CalendarDate.parse(period.start)!;
  const end = CalendarDate.parse(period.end)!;
  return eventOf(benefit, end, `[신청 마감] ${benefit.name}`, [`올해 신청 기간: ${start.format()} ~ ${end.format()}`], null);
}

function eventOf(benefit: PublishedBenefit, date: CalendarDate, title: string, details: string[], note: string | null): DeadlineEvent {
  const lines = [
    ...details,
    benefit.reviewStatus === 'VERIFIED' ? null : '아직 검증 전인 정보예요. 신청 전에 원문을 확인해 주세요.',
    note,
    `원문: ${benefit.sourceUrl}`,
  ];
  return {
    uid: `${benefit.slug}-${date.toCompact()}@toddler-content`,
    title,
    date,
    description: lines.filter((line) => line !== null).join('\n'),
    url: benefit.sourceUrl,
  };
}
