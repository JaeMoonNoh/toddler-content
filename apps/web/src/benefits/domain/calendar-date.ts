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

  // 1월 31일 + 1개월처럼 그 달에 없는 날이면 그 달 마지막 날로 맞춘다
  addMonths(months: number): CalendarDate {
    const d = new Date(this.epochDay * DAY_MS);
    const target = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + months, 1));
    const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
    return CalendarDate.of(target.getUTCFullYear(), target.getUTCMonth() + 1, Math.min(d.getUTCDate(), lastDay));
  }

  daysSince(other: CalendarDate): number {
    return this.epochDay - other.epochDay;
  }

  get year() {
    return new Date(this.epochDay * DAY_MS).getUTCFullYear();
  }

  isAfter(other: CalendarDate) {
    return this.epochDay > other.epochDay;
  }

  toIso(): string {
    return new Date(this.epochDay * DAY_MS).toISOString().slice(0, 10);
  }

  // 20261102 (캘린더 파일 형식)
  toCompact(): string {
    return this.toIso().replaceAll('-', '');
  }

  // 11.2(월)
  formatShort(): string {
    return this.format().slice(5);
  }

  // 2026.11.2(월)
  format(): string {
    const d = new Date(this.epochDay * DAY_MS);
    return `${d.getUTCFullYear()}.${d.getUTCMonth() + 1}.${d.getUTCDate()}(${WEEKDAYS[d.getUTCDay()]})`;
  }
}
