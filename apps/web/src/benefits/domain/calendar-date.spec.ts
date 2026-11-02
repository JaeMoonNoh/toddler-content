import { describe, expect, it } from 'vitest';
import { CalendarDate } from './calendar-date';

describe('CalendarDate', () => {
  it('YYYY-MM-DD를 읽고 그대로 돌려준다', () => {
    expect(CalendarDate.parse('2026-11-02')?.toIso()).toBe('2026-11-02');
  });

  it.each(['', '2026-1-2', '2026/11/02', '2026-02-30', '2026-13-01', '2026-11-02T00:00'])('"%s"는 날짜로 보지 않는다', (text) => {
    expect(CalendarDate.parse(text)).toBeNull();
  });

  it('윤년 2월 29일을 읽는다', () => {
    expect(CalendarDate.parse('2028-02-29')?.toIso()).toBe('2028-02-29');
  });

  it('월말과 연말을 넘겨 날짜를 더한다', () => {
    expect(CalendarDate.parse('2026-12-31')!.addDays(1).toIso()).toBe('2027-01-01');
    expect(CalendarDate.parse('2026-03-01')!.addDays(-1).toIso()).toBe('2026-02-28');
  });

  it('두 날짜 사이 일수를 센다', () => {
    expect(CalendarDate.parse('2027-05-06')!.daysSince(CalendarDate.parse('2026-11-02')!)).toBe(185);
  });

  it('기기 시간대의 오늘을 쓴다 (한국 자정 직후에도 하루 밀리지 않음)', () => {
    const justAfterMidnight = new Date(2026, 10, 3, 0, 5); // 지역 시각 11월 3일 00:05
    expect(CalendarDate.today(justAfterMidnight).toIso()).toBe('2026-11-03');
  });

  it('요일과 함께 보여준다', () => {
    expect(CalendarDate.parse('2026-11-02')!.format()).toBe('2026.11.2(월)');
  });
});
