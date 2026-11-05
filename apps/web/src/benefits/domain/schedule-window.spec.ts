import { describe, expect, it } from 'vitest';
import type { BenefitSchedule } from './benefit';
import { CalendarDate } from './calendar-date';
import { ChildDates } from './child-dates';
import { describeStatus, emphasisOf, ScheduleWindow } from './schedule-window';

const date = (text: string) => CalendarDate.parse(text)!;
const due = ChildDates.of(date('2027-05-06'), null)!;
const schedule = (from: BenefitSchedule['from'], until: BenefitSchedule['until']): BenefitSchedule => ({
  from,
  until,
  untilLabel: '마감',
  summary: '설명',
  basis: { text: '근거', url: 'https://a.kr' },
});
const at = (anchor: 'pregnancy' | 'birth', months = 0, days = 0) => ({ anchor, months, days });

describe('ScheduleWindow', () => {
  it('출생 기준 60일 안 (출생일 포함): 출산예정일부터 59일 뒤까지', () => {
    const window = ScheduleWindow.of(schedule(at('birth'), at('birth', 0, 59)), due);
    expect([window.start.toIso(), window.end.toIso()]).toEqual(['2027-05-06', '2027-07-04']);
  });

  it('출산 40일 전부터 출산 후 60일까지', () => {
    const window = ScheduleWindow.of(schedule(at('birth', 0, -40), at('birth', 0, 60)), due);
    expect([window.start.toIso(), window.end.toIso()]).toEqual(['2027-03-27', '2027-07-05']);
  });

  it('임신 시작은 출산예정일 280일 전', () => {
    expect(ScheduleWindow.of(schedule(at('pregnancy'), at('birth')), due).start.toIso()).toBe('2026-07-30');
  });

  describe('화면에 보여줄 시작', () => {
    it('임신 0주에 시작하면 날짜 대신 "임신 확인 후"로 보여준다', () => {
      const window = ScheduleWindow.of(schedule(at('pregnancy'), at('birth')), due);
      expect(window.formatStart()).toBe('임신 확인 후');
      expect(window.formatStartShort()).toBe('임신 확인 후');
      expect(window.formatPeriod()).toBe('임신 확인 후 ~ 2027.5.6(목)');
    });

    it('정렬과 상태 계산에 쓰는 시작일은 그대로 임신 0주다', () => {
      const window = ScheduleWindow.of(schedule(at('pregnancy'), at('birth')), due);
      expect(window.start.toIso()).toBe('2026-07-30');
      expect(window.statusOn(date('2026-11-03')).kind).toBe('open');
    });

    it('임신 기준이어도 0주가 아니면 날짜로 보여준다', () => {
      const window = ScheduleWindow.of(schedule(at('pregnancy', 4), at('birth')), due);
      expect(window.formatStart()).toBe('2026.11.30(월)');
    });

    it('출생 기준이면 날짜로 보여준다 (출산예정일 당일에 시작해도)', () => {
      const window = ScheduleWindow.of(schedule(at('birth'), at('birth', 0, 59)), due);
      expect(window.formatStartShort()).toBe('5.6(목)');
      expect(window.formatPeriod()).toBe('2027.5.6(목) ~ 2027.7.4(일)');
    });
  });

  it('개월을 먼저 더하고 일수를 더한다 (2년 - 1일)', () => {
    expect(ScheduleWindow.of(schedule(at('birth'), at('birth', 24, -1)), due).end.toIso()).toBe('2029-05-05');
  });

  it('출산예정일이 월말이면 개월 계산은 그 달 말일로 맞춘다', () => {
    expect(ScheduleWindow.of(schedule(at('birth', 1), at('birth', 1)), ChildDates.of(date('2027-01-31'), null)!).start.toIso()).toBe('2027-02-28');
  });

  describe('실제 출생일', () => {
    const born = ChildDates.of(date('2027-05-06'), date('2027-04-20'))!;

    it('출생 기준 날짜는 출생일로 계산한다', () => {
      const window = ScheduleWindow.of(schedule(at('birth'), at('birth', 0, 59)), born);
      expect([window.start.toIso(), window.end.toIso()]).toEqual(['2027-04-20', '2027-06-18']);
    });

    it('임신 기준 날짜는 그대로 출산예정일로 계산한다', () => {
      expect(ScheduleWindow.of(schedule(at('pregnancy', 4), at('birth')), born).start.toIso()).toBe('2026-11-30');
    });

    it('출생일로 계산하면 추정이 아니다', () => {
      expect(ScheduleWindow.of(schedule(at('birth'), at('birth', 0, 59)), born).isEstimated).toBe(false);
      expect(ScheduleWindow.of(schedule(at('birth'), at('birth', 0, 59)), due).isEstimated).toBe(true);
    });

    it('임신 기준 날짜만 쓰면 태어나기 전에도 추정이 아니다', () => {
      expect(ScheduleWindow.of(schedule(at('pregnancy'), at('pregnancy', 3)), due).isEstimated).toBe(false);
    });
  });

  describe('상태', () => {
    const window = ScheduleWindow.of(schedule(at('birth'), at('birth', 0, 59)), due);

    it.each([
      ['2027-05-05', { kind: 'upcoming', daysUntilStart: 1 }],
      ['2027-05-06', { kind: 'open', daysLeft: 59 }],
      ['2027-07-04', { kind: 'open', daysLeft: 0 }],
      ['2027-07-05', { kind: 'closed' }],
    ])('%s에는 %o', (today, status) => {
      expect(window.statusOn(date(today))).toEqual(status);
    });

    it('시작과 끝이 같은 날이면 그날 하루만 가능', () => {
      const oneDay = ScheduleWindow.of(schedule(at('birth'), at('birth')), due);
      expect(oneDay.statusOn(due.due)).toEqual({ kind: 'open', daysLeft: 0 });
    });
  });

  it.each([
    [{ kind: 'upcoming', daysUntilStart: 12 } as const, '12일 뒤 시작'],
    [{ kind: 'open', daysLeft: 30 } as const, '지금 가능 · 30일 남음'],
    [{ kind: 'open', daysLeft: 0 } as const, '오늘 마감'],
    [{ kind: 'closed' } as const, '기간 지남'],
  ])('%o는 "%s"', (status, text) => {
    expect(describeStatus(status)).toBe(text);
  });
});

describe('emphasisOf', () => {
  it.each([
    [{ kind: 'open', daysLeft: 31 } as const, 'open'],
    [{ kind: 'open', daysLeft: 30 } as const, 'soon'],
    [{ kind: 'open', daysLeft: 0 } as const, 'soon'],
    [{ kind: 'upcoming', daysUntilStart: 3 } as const, 'upcoming'],
    [{ kind: 'closed' } as const, 'closed'],
  ])('%o는 %s', (status, emphasis) => {
    expect(emphasisOf(status)).toBe(emphasis);
  });
});
