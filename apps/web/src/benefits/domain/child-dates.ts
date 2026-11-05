import type { CalendarDate } from './calendar-date';

export const PREGNANCY_DAYS = 280; // 마지막 생리 시작일부터 출산예정일까지

// 신청 일정을 계산하는 기준 날짜. 태어나기 전에는 출산예정일에 태어난다고 본다
export class ChildDates {
  private constructor(
    readonly due: CalendarDate,
    readonly birth: CalendarDate | null,
  ) {}

  // 출생일만 알면 그날을 출산예정일로 본다. 임신 중 혜택의 시작일만 조금 달라지는데, 이미 지난 날짜라 상관없다
  static of(due: CalendarDate | null, birth: CalendarDate | null): ChildDates | null {
    const base = due ?? birth;
    return base ? new ChildDates(base, birth) : null;
  }

  get pregnancyStart(): CalendarDate {
    return this.due.addDays(-PREGNANCY_DAYS);
  }

  get birthOrDue(): CalendarDate {
    return this.birth ?? this.due;
  }

  get isBorn(): boolean {
    return this.birth !== null;
  }
}
