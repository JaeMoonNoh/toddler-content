import { describe, expect, it } from 'vitest';
import type { BenefitSchedule, PublishedBenefit } from './benefit';
import { CalendarDate } from './calendar-date';
import { ChildDates } from './child-dates';
import { childStage } from './pregnancy';
import { RegionTree } from './region';
import { countdownOf, thisWeekOf } from './this-week';
import { buildTimeline } from './timeline';

const due = ChildDates.of(CalendarDate.parse('2027-03-17'), null)!;
const today = CalendarDate.parse('2026-11-09')!; // 출산예정일 128일 전
const region = new RegionTree([{ code: '0000000000', name: '전국', fullName: '전국', parentCode: null }]).choose(null);

// 출산예정일 기준 날짜로 일정을 만든다. today는 출산예정일 -128일
const schedule = (fromDays: number, untilDays: number): BenefitSchedule => ({
  from: { anchor: 'birth', months: 0, days: fromDays },
  until: { anchor: 'birth', months: 0, days: untilDays },
  untilLabel: '마감',
  summary: '설명',
  basis: { text: '근거', url: 'https://a.kr' },
});
const benefit = (name: string, schedule: BenefitSchedule, howToApply: string | null = null): PublishedBenefit => ({
  slug: name,
  name,
  regionCode: '0000000000',
  regionName: '전국',
  sourceName: '보조금24',
  sourceUrl: 'https://plus.gov.kr',
  verifiedAt: null,
  reviewStatus: 'UNVERIFIED',
  schedule,
  conditions: [],
  amount: null,
  applicationPeriod: null,
  howToApply: howToApply ? { summary: howToApply, basis: { text: '근거', url: 'https://a.kr' } } : null,
  audience: null,
});
const weekOf = (benefits: PublishedBenefit[], done: string[] = []) =>
  thisWeekOf(buildTimeline(region, benefits, due, today), today, (slug) => done.includes(slug));
const names = (items: { benefit: PublishedBenefit }[]) => items.map((item) => item.benefit.name);

describe('thisWeekOf', () => {
  it('혜택이 없으면 둘 다 비어 있다', () => {
    expect(weekOf([])).toEqual({ toDo: [], nextDeadline: null, nextOpening: null });
  });

  it('7일 안에 열리는 것은 넣고 8일 뒤에 열리는 것은 뺀다', () => {
    const week = weekOf([benefit('7일 뒤', schedule(-121, 0)), benefit('8일 뒤', schedule(-120, 0))]);
    expect(names(week.toDo)).toEqual(['7일 뒤']);
  });

  it('7일 안에 끝나는 것은 넣고 8일 남은 것은 다음 마감으로 보낸다', () => {
    const week = weekOf([benefit('7일 남음', schedule(-200, -121)), benefit('8일 남음', schedule(-200, -120))]);
    expect(names(week.toDo)).toEqual(['7일 남음']);
    expect(week.nextDeadline?.benefit.name).toBe('8일 남음');
  });

  it('열린 지 7일이 안 된 것은 넣고 딱 7일 된 것은 뺀다', () => {
    const week = weekOf([benefit('6일 전 열림', schedule(-134, 100)), benefit('7일 전 열림', schedule(-135, 100))]);
    expect(names(week.toDo)).toEqual(['6일 전 열림']);
  });

  it('이번 주 것은 마감이 빠른 순서로 놓는다', () => {
    const week = weekOf([benefit('늦게 끝남', schedule(-125, 50)), benefit('빨리 끝남', schedule(-125, 10))]);
    expect(names(week.toDo)).toEqual(['빨리 끝남', '늦게 끝남']);
  });

  it('다음 마감은 지금 신청할 수 있는 것 중 가장 먼저 끝나는 것이다', () => {
    const week = weekOf([benefit('오래 열림', schedule(-200, 300)), benefit('곧 끝남', schedule(-200, 20)), benefit('아직 안 열림', schedule(-50, 0))]);
    expect(week.nextDeadline?.benefit.name).toBe('곧 끝남');
  });

  it('기간이 지난 것은 어디에도 넣지 않는다', () => {
    expect(weekOf([benefit('지남', schedule(-200, -130))])).toEqual({ toDo: [], nextDeadline: null, nextOpening: null });
  });

  it('신청을 마친 혜택은 뺀다', () => {
    const week = weekOf([benefit('마침', schedule(-125, 10)), benefit('남음', schedule(-200, 20))], ['마침', '남음']);
    expect(week).toEqual({ toDo: [], nextDeadline: null, nextOpening: null });
  });

  it('따로 신청하지 않아도 되는 혜택은 뺀다', () => {
    const week = weekOf([benefit('자동', schedule(-125, 10), '따로 신청하지 않아도 돼요 · 문의 129'), benefit('신청', schedule(-200, 20), '보건소 방문')]);
    expect(names(week.toDo)).toEqual([]);
    expect(week.nextDeadline?.benefit.name).toBe('신청');
  });

  it('이번 주 것 말고 가장 먼저 열리는 것을 다음에 열리는 혜택으로 둔다', () => {
    const week = weekOf([benefit('나중에 열림', schedule(-30, 0)), benefit('먼저 열림', schedule(-60, 0)), benefit('이번 주 열림', schedule(-125, 0))]);
    expect(names(week.toDo)).toEqual(['이번 주 열림']);
    expect(week.nextOpening?.benefit.name).toBe('먼저 열림');
  });
});

describe('countdownOf', () => {
  it('임신 중이면 만나는 날까지 센다', () => {
    expect(countdownOf(childStage(due, today), due, '콩이')).toEqual({
      headline: '콩이 만나기 128일 전',
      detail: `임신 21주 5일 · 출산예정일 ${due.due.format()}`,
    });
  });

  it('출산예정일 당일에는 만나는 날이라고 한다', () => {
    const onDue = CalendarDate.parse('2027-03-17')!;
    expect(countdownOf(childStage(due, onDue), due, '콩이')?.headline).toBe('오늘 콩이 만나는 날');
  });

  it('태어난 뒤에는 함께한 날을 센다', () => {
    const born = ChildDates.of(CalendarDate.parse('2027-03-17'), CalendarDate.parse('2027-03-10'))!;
    const later = CalendarDate.parse('2027-04-20')!;
    expect(countdownOf(childStage(born, later), born, '다온')?.headline).toBe('다온 태어난 지 41일');
  });

  it('날짜가 이상하면 보여주지 않는다', () => {
    const far = ChildDates.of(CalendarDate.parse('2028-12-01'), null)!;
    expect(countdownOf(childStage(far, today), far, '콩이')).toBeNull();
  });
});
