import type { ApplicationPeriod } from './benefit';
import { CalendarDate } from './calendar-date';

const SOON_DAYS = 30; // 마감까지 이만큼 남으면 D-N으로 눈에 띄게

export type PeriodStatus =
  | { kind: 'upcoming'; start: CalendarDate }
  | { kind: 'open'; end: CalendarDate; daysLeft: number }
  | { kind: 'closed'; endYear: number };

export function periodStatus(period: ApplicationPeriod, today: CalendarDate): PeriodStatus {
  const start = CalendarDate.parse(period.start)!;
  const end = CalendarDate.parse(period.end)!;
  if (start.isAfter(today)) return { kind: 'upcoming', start };
  if (today.isAfter(end)) return { kind: 'closed', endYear: end.year };
  return { kind: 'open', end, daysLeft: end.daysSince(today) };
}

export interface PeriodBadge {
  tone: 'upcoming' | 'open' | 'soon' | 'closed';
  text: string;
}

// 기간이 지나도 혜택은 그대로 두고, 다음 공고를 확인하라고만 알린다
export function periodBadge(period: ApplicationPeriod, today: CalendarDate): PeriodBadge {
  const status = periodStatus(period, today);
  const yearOf = (year: number) => (year === today.year ? '올해' : `${year}년`);
  switch (status.kind) {
    case 'upcoming':
      return { tone: 'upcoming', text: `${yearOf(status.start.year)} 신청 ${status.start.formatShort()}부터` };
    case 'open':
      if (status.daysLeft === 0) return { tone: 'soon', text: '오늘 신청 마감' };
      if (status.daysLeft <= SOON_DAYS) return { tone: 'soon', text: `신청 마감 D-${status.daysLeft} · ${status.end.formatShort()}` };
      return { tone: 'open', text: `${yearOf(status.end.year)} 신청 ${status.end.formatShort()}까지` };
    case 'closed':
      return status.endYear === today.year
        ? { tone: 'closed', text: '올해 신청 마감됨 · 내년 공고를 확인해 주세요' }
        : { tone: 'closed', text: `${status.endYear}년 신청 마감됨 · ${yearOf(today.year)} 공고를 확인해 주세요` };
  }
}
