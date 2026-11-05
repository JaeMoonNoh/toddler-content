import { describe, expect, it } from 'vitest';
import { CalendarDate } from './calendar-date';
import { ChildDates } from './child-dates';
import { childStage, describeStage, hasSchedule } from './pregnancy';

const today = CalendarDate.parse('2026-11-02')!;
const day = (daysFromToday: number) => today.addDays(daysFromToday);
const due = (daysFromToday: number) => ChildDates.of(day(daysFromToday), null)!;
const born = (daysFromToday: number) => ChildDates.of(day(30), day(daysFromToday))!;

describe('childStage: 태어나기 전', () => {
  it('출산예정일까지 남은 날로 임신 주차를 구한다', () => {
    expect(childStage(due(175), today)).toEqual({ kind: 'pregnant', weeks: 15, days: 0, daysUntilDue: 175 });
    expect(childStage(due(172), today)).toEqual({ kind: 'pregnant', weeks: 15, days: 3, daysUntilDue: 172 });
  });

  it('출산예정일 당일은 40주 0일', () => {
    expect(childStage(due(0), today)).toEqual({ kind: 'pregnant', weeks: 40, days: 0, daysUntilDue: 0 });
  });

  it('딱 280일 남았으면 0주 0일', () => {
    expect(childStage(due(280), today)).toMatchObject({ kind: 'pregnant', weeks: 0, days: 0 });
  });

  it('280일보다 많이 남았으면 너무 먼 날짜', () => {
    expect(childStage(due(281), today)).toEqual({ kind: 'too-far', daysUntilDue: 281 });
  });

  it('출산예정일이 지났으면 지난 날수', () => {
    expect(childStage(due(-1), today)).toEqual({ kind: 'after-due', daysSinceDue: 1 });
  });
});

describe('childStage: 태어난 뒤', () => {
  it('출생일을 넣으면 출산예정일과 관계없이 태어난 지 며칠인지', () => {
    expect(childStage(born(-45), today)).toEqual({ kind: 'born', daysSinceBirth: 45, months: 1 });
  });

  it('오늘 태어났으면 0일 0개월', () => {
    expect(childStage(born(0), today)).toEqual({ kind: 'born', daysSinceBirth: 0, months: 0 });
  });

  it('출생일이 오늘보다 뒤면 날짜 오류', () => {
    expect(childStage(born(1), today)).toEqual({ kind: 'birth-in-future' });
  });

  it('개월은 생일이 돌아온 달만 센다: 1월 31일생은 2월 28일에 아직 0개월, 3월 1일에 1개월', () => {
    const dates = ChildDates.of(null, CalendarDate.parse('2027-01-31'))!;
    expect(childStage(dates, CalendarDate.parse('2027-02-27')!)).toMatchObject({ months: 0 });
    expect(childStage(dates, CalendarDate.parse('2027-03-01')!)).toMatchObject({ months: 1 });
  });

  it('출생일만 넣어도 그날을 출산예정일로 본다', () => {
    const dates = ChildDates.of(null, today)!;
    expect([dates.due.toIso(), dates.birthOrDue.toIso()]).toEqual([today.toIso(), today.toIso()]);
  });

  it('출산예정일도 출생일도 없으면 기준 날짜가 없다', () => {
    expect(ChildDates.of(null, null)).toBeNull();
  });
});

describe('hasSchedule', () => {
  it('날짜가 이상하면 일정을 보여주지 않는다', () => {
    expect([due(281), born(1), due(10), due(-1), born(-1)].map((d) => hasSchedule(childStage(d, today)))).toEqual([false, false, true, true, true]);
  });
});

describe('describeStage', () => {
  it.each([
    [due(175), '임신 15주 0일 · 출산까지 175일'],
    [due(0), '오늘이 출산예정일이에요'],
    [due(-10), '출산예정일로부터 10일 지났어요. 태어났다면 출생일을 넣어 주세요'],
    [due(300), '출산예정일이 40주보다 뒤예요. 날짜를 확인해 주세요'],
    [born(-20), '태어난 지 20일'],
    [born(-400), '태어난 지 400일 · 13개월'],
    [born(3), '출생일이 오늘보다 뒤예요. 날짜를 확인해 주세요'],
  ])('%#: "%s"', (dates, text) => {
    expect(describeStage(childStage(dates, today))).toBe(text);
  });
});
