import type { BenefitSchedule, ScheduleOffset } from './benefit';
import type { CalendarDate } from './calendar-date';

const PREGNANCY_DAYS = 280;

export type WindowStatus =
  | { kind: 'upcoming'; daysUntilStart: number }
  | { kind: 'open'; daysLeft: number } // 0이면 오늘이 마지막 날
  | { kind: 'closed' };

// 출산예정일로 계산한 실제 신청 기간. 태어나기 전에는 출생일을 출산예정일로 본다
export class ScheduleWindow {
  private constructor(
    readonly start: CalendarDate,
    readonly end: CalendarDate,
  ) {}

  static of(schedule: BenefitSchedule, due: CalendarDate): ScheduleWindow {
    return new ScheduleWindow(dateOf(schedule.from, due), dateOf(schedule.until, due));
  }

  statusOn(today: CalendarDate): WindowStatus {
    if (this.start.isAfter(today)) return { kind: 'upcoming', daysUntilStart: this.start.daysSince(today) };
    if (today.isAfter(this.end)) return { kind: 'closed' };
    return { kind: 'open', daysLeft: this.end.daysSince(today) };
  }
}

function dateOf({ anchor, months, days }: ScheduleOffset, due: CalendarDate): CalendarDate {
  const base = anchor === 'pregnancy' ? due.addDays(-PREGNANCY_DAYS) : due;
  return base.addMonths(months).addDays(days);
}

export function describeStatus(status: WindowStatus): string {
  switch (status.kind) {
    case 'upcoming':
      return `${status.daysUntilStart}일 뒤 시작`;
    case 'open':
      return status.daysLeft === 0 ? '오늘 마감' : `지금 가능 · ${status.daysLeft}일 남음`;
    case 'closed':
      return '기간 지남';
  }
}
