const DAY_MS = 86_400_000;
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

// 시각과 시간대 없이 "날짜"만 다룬다. new Date('2026-11-02')가 UTC로 해석돼 하루 밀리는 문제를 피하려고 쓴다
export class CalendarDate {
  private constructor(private readonly epochDay: number) {}

  static parse(text: string): CalendarDate | null {
    const match = ISO_DATE.exec(text);
    if (!match) return null;
    const [year, month, day] = match.slice(1).map(Number);
    const date = CalendarDate.of(year, month, day);
    return date.toIso() === text ? date : null;
  }

  static of(year: number, month: number, day: number): CalendarDate {
    return new CalendarDate(Date.UTC(year, month - 1, day) / DAY_MS);
  }

  // 사용자의 기기 시간대 기준 오늘
  static today(now = new Date()): CalendarDate {
    return CalendarDate.of(now.getFullYear(), now.getMonth() + 1, now.getDate());
  }

  addDays(days: number): CalendarDate {
    return new CalendarDate(this.epochDay + days);
  }

  daysSince(other: CalendarDate): number {
    return this.epochDay - other.epochDay;
  }

  isAfter(other: CalendarDate) {
    return this.epochDay > other.epochDay;
  }

  toIso(): string {
    return new Date(this.epochDay * DAY_MS).toISOString().slice(0, 10);
  }

  // 2026.11.2(월)
  format(): string {
    const d = new Date(this.epochDay * DAY_MS);
    return `${d.getUTCFullYear()}.${d.getUTCMonth() + 1}.${d.getUTCDate()}(${WEEKDAYS[d.getUTCDay()]})`;
  }
}
