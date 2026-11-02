import { describe, expect, it } from 'vitest';
import type { BenefitSchedule, BenefitScope, PublishedBenefit } from './benefit';
import { CalendarDate } from './calendar-date';
import { REGIONS } from './region';
import { buildTimeline } from './timeline';

const due = CalendarDate.parse('2027-05-06')!;
const today = CalendarDate.parse('2026-11-02')!;
const region = (id: string) => REGIONS.find((r) => r.id === id)!;

const schedule = (fromDays: number, untilDays: number, anchor: 'pregnancy' | 'birth' = 'birth'): BenefitSchedule => ({
  from: { anchor, months: 0, days: fromDays },
  until: { anchor: 'birth', months: 0, days: untilDays },
  untilLabel: '마감',
  summary: '설명',
  basis: { text: '근거', url: 'https://a.kr' },
});
const benefit = (name: string, schedule: BenefitSchedule | null, scope: BenefitScope = 'national'): PublishedBenefit => ({
  slug: name,
  name,
  scope,
  sourceName: '보조금24',
  sourceUrl: 'https://plus.gov.kr',
  verifiedAt: null,
  reviewStatus: 'UNVERIFIED',
  schedule,
  conditions: [],
  amount: null,
});

describe('buildTimeline', () => {
  it('시작일 순서로 놓고 출산예정일 기준 시기별로 묶는다', () => {
    const timeline = buildTimeline(
      region('cheongju'),
      [
        benefit('육아휴직', schedule(0, 3000)),
        benefit('진료비', schedule(0, 730, 'pregnancy')),
        benefit('산후도우미', schedule(-40, 60)),
        benefit('가정양육수당', schedule(730, 2600)),
        benefit('부모급여', schedule(0, 59)),
      ],
      due,
      today,
    );

    expect(timeline.phases.map((p) => [p.label, p.items.map((i) => i.benefit.name)])).toEqual([
      ['임신 중', ['진료비']],
      ['출산 준비 (출산 45일 전부터)', ['산후도우미']],
      ['출산 직후 (60일 안)', ['부모급여', '육아휴직']],
      ['그 이후', ['가정양육수당']],
    ]);
  });

  it('시작일이 같으면 먼저 끝나는 것부터', () => {
    const timeline = buildTimeline(region('other'), [benefit('긴 것', schedule(0, 300)), benefit('짧은 것', schedule(0, 59))], due, today);
    expect(timeline.phases[0].items.map((i) => i.benefit.name)).toEqual(['짧은 것', '긴 것']);
  });

  it('경계: 출산 45일 전 시작은 출산 준비, 46일 전은 임신 중, 출산 후 60일은 출산 직후, 61일은 그 이후', () => {
    const timeline = buildTimeline(
      region('other'),
      [benefit('a', schedule(-46, 0)), benefit('b', schedule(-45, 0)), benefit('c', schedule(60, 90)), benefit('d', schedule(61, 90))],
      due,
      today,
    );
    expect(timeline.phases.map((p) => p.items.map((i) => i.benefit.name))).toEqual([['a'], ['b'], ['c'], ['d']]);
  });

  it('사는 곳에서 못 받는 혜택은 빼고, 규칙이 없는 혜택은 따로 모은다', () => {
    const timeline = buildTimeline(
      region('other'),
      [benefit('충북 수당', schedule(0, 365), 'chungbuk'), benefit('전국 수당', schedule(0, 59)), benefit('규칙 없음', null)],
      due,
      today,
    );
    expect(timeline.phases.flatMap((p) => p.items.map((i) => i.benefit.name))).toEqual(['전국 수당']);
    expect(timeline.unscheduled.map((b) => b.name)).toEqual(['규칙 없음']);
  });

  it('지금 날짜 기준 상태를 붙인다', () => {
    const [item] = buildTimeline(region('other'), [benefit('진료비', schedule(0, 730, 'pregnancy'))], due, today).phases[0].items;
    expect(item.status).toEqual({ kind: 'open', daysLeft: 915 });
  });

  it('규칙이 있는 혜택이 없으면 시기 묶음이 비어 있다', () => {
    expect(buildTimeline(region('other'), [benefit('규칙 없음', null)], due, today).phases).toEqual([]);
  });
});
