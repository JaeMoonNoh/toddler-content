import { describe, expect, it } from 'vitest';
import type { ApplicationPeriod, BenefitSchedule, PublishedBenefit } from './benefit';
import { CalendarDate } from './calendar-date';
import { ChildDates } from './child-dates';
import { RegionTree } from './region';
import { SavedBenefits } from './saved-benefits';
import { buildTimeline } from './timeline';

const due = ChildDates.of(CalendarDate.parse('2027-05-06'), null)!;
const today = CalendarDate.parse('2026-11-05')!;
const region = new RegionTree([{ code: '0000000000', name: '전국', fullName: '전국', parentCode: null }]).choose(null);

const untilBirth = (days: number): BenefitSchedule => ({
  from: { anchor: 'pregnancy', months: 0, days: 0 },
  until: { anchor: 'birth', months: 0, days },
  untilLabel: '마감',
  summary: '설명',
  basis: { text: '근거', url: 'https://a.kr' },
});
const period = (start: string, end: string): ApplicationPeriod => ({ start, end, basis: { text: '근거', url: 'https://a.kr' } });
const benefit = (slug: string, more: Partial<PublishedBenefit> = {}): PublishedBenefit => ({
  slug,
  name: slug,
  regionCode: '0000000000',
  regionName: '전국',
  sourceName: '보조금24',
  sourceUrl: 'https://plus.gov.kr',
  verifiedAt: null,
  reviewStatus: 'UNVERIFIED',
  schedule: null,
  conditions: [],
  amount: null,
  applicationPeriod: null,
  howToApply: null,
  audience: null,
  ...more,
});

describe('SavedBenefits', () => {
  it('저장하면 챙길 것, 신청했다고 표시하면 신청 완료, 빼면 사라진다', () => {
    const saved = SavedBenefits.empty().save('a').save('b').markApplied('b').remove('a');
    expect([saved.stateOf('a'), saved.stateOf('b')]).toEqual([null, 'applied']);
  });

  it('바꿔도 원래 목록은 그대로다', () => {
    const before = SavedBenefits.empty();
    before.save('a');
    expect(before.has('a')).toBe(false);
  });

  it('신청 완료를 되돌리면 다시 챙길 것이 된다', () => {
    expect(SavedBenefits.empty().markApplied('a').save('a').stateOf('a')).toBe('todo');
  });

  it('저장한 값으로 되살린다', () => {
    const json = JSON.parse(JSON.stringify(SavedBenefits.empty().save('a').markApplied('b')));
    const restored = SavedBenefits.fromJSON(json);
    expect([restored.stateOf('a'), restored.stateOf('b')]).toEqual(['todo', 'applied']);
  });

  it.each([null, 'x', {}, { version: 2, items: [] }, { version: 1, items: 'x' }])('깨진 값 %j은 빈 목록으로 시작한다', (value) => {
    expect(SavedBenefits.fromJSON(value).toJSON().items).toEqual([]);
  });

  it('모양이 틀린 항목만 버린다', () => {
    const restored = SavedBenefits.fromJSON({ version: 1, items: [{ slug: 'a', state: 'todo' }, { slug: 'b', state: 'x' }, { state: 'todo' }] });
    expect(restored.toJSON().items).toEqual([{ slug: 'a', state: 'todo' }]);
  });
});

describe('SavedBenefits.listOf', () => {
  const benefits = [
    benefit('출생 후 1년', { schedule: untilBirth(365) }),
    benefit('출생 후 60일', { schedule: untilBirth(60) }),
    benefit('올해 공고', { applicationPeriod: period('2026-03-01', '2026-12-31') }),
    benefit('지난 공고', { applicationPeriod: period('2026-01-01', '2026-06-30') }),
    benefit('기간 모름'),
    benefit('신청함', { schedule: untilBirth(10) }),
    benefit('저장 안 함', { schedule: untilBirth(1) }),
  ];
  const saved = ['출생 후 1년', '출생 후 60일', '올해 공고', '지난 공고', '기간 모름', '신청함']
    .reduce((list, slug) => list.save(slug), SavedBenefits.empty())
    .markApplied('신청함');

  it('마감이 가까운 순, 마감을 모르는 것, 마감이 지난 것, 신청을 마친 것 순서로 놓는다', () => {
    const items = saved.listOf(benefits, buildTimeline(region, benefits, due, today), today);
    expect(items.map((item) => item.benefit.slug)).toEqual(['올해 공고', '출생 후 60일', '출생 후 1년', '기간 모름', '지난 공고', '신청함']);
  });

  it('출산예정일로 계산한 일정이 있으면 붙이고 그 마감일을 쓴다', () => {
    const [item] = saved.listOf([benefits[1]], buildTimeline(region, benefits, due, today), today);
    expect([item.scheduled?.benefit.slug, item.deadline?.toIso()]).toEqual(['출생 후 60일', '2027-07-05']);
  });

  it('출산예정일이 없으면 일정 없이 공고 마감만 본다', () => {
    const items = saved.listOf(benefits, null, today);
    expect(items.map((item) => [item.benefit.slug, item.deadline?.toIso() ?? null])).toEqual([
      ['올해 공고', '2026-12-31'],
      ['기간 모름', null],
      ['출생 후 1년', null],
      ['출생 후 60일', null],
      ['지난 공고', '2026-06-30'],
      ['신청함', null],
    ]);
  });

  it('사는 곳 목록에 없는 저장 혜택은 보이지 않는다', () => {
    expect(saved.listOf([], null, today)).toEqual([]);
  });
});
