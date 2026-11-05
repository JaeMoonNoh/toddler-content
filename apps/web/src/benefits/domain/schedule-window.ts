import type { BenefitSchedule, ScheduleOffset } from './benefit';
import type { CalendarDate } from './calendar-date';
import type { ChildDates } from './child-dates';

// 임신 0주는 마지막 생리 시작일이라 그날엔 아무도 신청할 수 없다. 실제로는 병원에서 임신을 확인한 뒤부터 신청한다
const AFTER_PREGNANCY_CONFIRMED = '임신 확인 후';

export type WindowStatus =
  | { kind: 'upcoming'; daysUntilStart: number }
  | { kind: 'open'; daysLeft: number } // 0이면 오늘이 마지막 날
  | { kind: 'closed' };

// 출생일(태어나기 전에는 출산예정일)로 계산한 실제 신청 기간
export class ScheduleWindow {
  private constructor(
    readonly start: CalendarDate, // 정렬과 상태 계산에 쓴다. 화면에는 formatStart로 보여준다
    readonly end: CalendarDate,
    private readonly startsWhenPregnancyConfirmed: boolean,
    readonly isEstimated: boolean, // 아직 안 태어나서 출산예정일에 태어난다고 보고 계산했는지
  ) {}

  static of(schedule: BenefitSchedule, dates: ChildDates): ScheduleWindow {
    const usesBirth = schedule.from.anchor === 'birth' || schedule.until.anchor === 'birth';
    return new ScheduleWindow(
      dateOf(schedule.from, dates),
      dateOf(schedule.until, dates),
      isPregnancyStart(schedule.from),
      usesBirth && !dates.isBorn,
    );
  }

  formatStart(): string {
    return this.startsWhenPregnancyConfirmed ? AFTER_PREGNANCY_CONFIRMED : this.start.format();
  }

  formatStartShort(): string {
    return this.startsWhenPregnancyConfirmed ? AFTER_PREGNANCY_CONFIRMED : this.start.formatShort();
  }

  formatPeriod(): string {
    return `${this.formatStart()} ~ ${this.end.format()}`;
  }

  statusOn(today: CalendarDate): WindowStatus {
    if (this.start.isAfter(today)) return { kind: 'upcoming', daysUntilStart: this.start.daysSince(today) };
    if (today.isAfter(this.end)) return { kind: 'closed' };
    return { kind: 'open', daysLeft: this.end.daysSince(today) };
  }
}

function isPregnancyStart({ anchor, months, days }: ScheduleOffset) {
  return anchor === 'pregnancy' && months === 0 && days === 0;
}

function dateOf({ anchor, months, days }: ScheduleOffset, dates: ChildDates): CalendarDate {
  const base = anchor === 'pregnancy' ? dates.pregnancyStart : dates.birthOrDue;
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

const SOON_DAYS = 30; // 마감까지 이만큼 남았을 때만 눈에 띄게 한다

// 화면에서 얼마나 강조할지. 지금 가능한 혜택이 많아도 마감이 가까운 것만 튀게 한다
export type WindowEmphasis = 'soon' | 'open' | 'upcoming' | 'closed';

export function emphasisOf(status: WindowStatus): WindowEmphasis {
  if (status.kind === 'open') return status.daysLeft <= SOON_DAYS ? 'soon' : 'open';
  return status.kind;
}
