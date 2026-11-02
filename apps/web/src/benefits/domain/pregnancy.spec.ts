import { describe, expect, it } from 'vitest';
import { CalendarDate } from './calendar-date';
import { describeStage, pregnancyStage } from './pregnancy';

const today = CalendarDate.parse('2026-11-02')!;
const due = (daysFromToday: number) => today.addDays(daysFromToday);

describe('pregnancyStage', () => {
  it('출산예정일까지 남은 날로 임신 주차를 구한다', () => {
    expect(pregnancyStage(due(175), today)).toEqual({ kind: 'pregnant', weeks: 15, days: 0, daysUntilDue: 175 });
    expect(pregnancyStage(due(172), today)).toEqual({ kind: 'pregnant', weeks: 15, days: 3, daysUntilDue: 172 });
  });

  it('출산예정일 당일은 40주 0일', () => {
    expect(pregnancyStage(due(0), today)).toEqual({ kind: 'pregnant', weeks: 40, days: 0, daysUntilDue: 0 });
  });

  it('딱 280일 남았으면 0주 0일', () => {
    expect(pregnancyStage(due(280), today)).toMatchObject({ kind: 'pregnant', weeks: 0, days: 0 });
  });

  it('280일보다 많이 남았으면 너무 먼 날짜', () => {
    expect(pregnancyStage(due(281), today)).toEqual({ kind: 'too-far', daysUntilDue: 281 });
  });

  it('출산예정일이 지났으면 지난 날수', () => {
    expect(pregnancyStage(due(-1), today)).toEqual({ kind: 'after-due', daysSinceDue: 1 });
  });
});

describe('describeStage', () => {
  it.each([
    [175, '임신 15주 0일 · 출산까지 175일'],
    [0, '오늘이 출산예정일이에요'],
    [-10, '출산예정일로부터 10일 지났어요'],
    [300, '출산예정일이 40주보다 뒤예요. 날짜를 확인해 주세요'],
  ])('출산까지 %i일이면 "%s"', (days, text) => {
    expect(describeStage(pregnancyStage(due(days), today))).toBe(text);
  });
});
