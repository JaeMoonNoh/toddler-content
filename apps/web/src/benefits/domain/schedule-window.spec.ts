import { describe, expect, it } from 'vitest';
import type { BenefitSchedule } from './benefit';
import { CalendarDate } from './calendar-date';
import { describeStatus, ScheduleWindow } from './schedule-window';

const date = (text: string) => CalendarDate.parse(text)!;
const due = date('2027-05-06');
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

  it('개월을 먼저 더하고 일수를 더한다 (2년 - 1일)', () => {
    expect(ScheduleWindow.of(schedule(at('birth'), at('birth', 24, -1)), due).end.toIso()).toBe('2029-05-05');
  });

  it('출산예정일이 월말이면 개월 계산은 그 달 말일로 맞춘다', () => {
    expect(ScheduleWindow.of(schedule(at('birth', 1), at('birth', 1)), date('2027-01-31')).start.toIso()).toBe('2027-02-28');
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
      expect(oneDay.statusOn(due)).toEqual({ kind: 'open', daysLeft: 0 });
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
