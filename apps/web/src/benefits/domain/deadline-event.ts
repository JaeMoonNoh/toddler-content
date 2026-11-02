import type { CalendarDate } from './calendar-date';
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

export function deadlineEventOf({ benefit, schedule, window }: TimelineItem): DeadlineEvent {
  const lines = [
    schedule.summary,
    `기간: ${window.start.format()} ~ ${window.end.format()}`,
    benefit.reviewStatus === 'VERIFIED' ? null : '아직 검증 전인 정보예요. 신청 전에 원문을 확인해 주세요.',
    '출산예정일에 태어난다고 보고 계산한 날짜예요.',
    `원문: ${benefit.sourceUrl}`,
  ];
  return {
    uid: `${benefit.slug}-${window.end.toCompact()}@toddler-content`,
    title: `[${schedule.untilLabel}] ${benefit.name}`,
    date: window.end,
    description: lines.filter((line) => line !== null).join('\n'),
    url: benefit.sourceUrl,
  };
}
