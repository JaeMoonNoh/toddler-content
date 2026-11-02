import { describe, expect, it } from 'vitest';
import type { BenefitAmount, PublishedBenefit } from './benefit';
import { amountRange, formatRange, formatWon, receiptOf } from './amount';

const firstMeeting: BenefitAmount = {
  kind: 'voucher',
  summary: '첫째 200만원, 둘째 이상 300만원',
  tiers: [
    { minBirthOrder: 1, maxBirthOrder: 1, won: 2_000_000 },
    { minBirthOrder: 2, maxBirthOrder: null, won: 3_000_000 },
  ],
  basis: { text: '근거', url: 'https://a.kr' },
};
const flat = (won: number): BenefitAmount => ({ ...firstMeeting, kind: 'cash', tiers: [{ minBirthOrder: 1, maxBirthOrder: null, won }] });
const wage: BenefitAmount = { ...firstMeeting, kind: 'wage', tiers: null, summary: '통상임금' };
const benefit = (name: string, amount: BenefitAmount | null): PublishedBenefit => ({
  slug: name,
  name,
  scope: 'national',
  sourceName: '보조금24',
  sourceUrl: 'https://plus.gov.kr',
  verifiedAt: null,
  reviewStatus: 'UNVERIFIED',
  schedule: null,
  conditions: [],
  amount,
});

describe('amountRange', () => {
  it.each([
    [1, { min: 2_000_000, max: 2_000_000 }],
    [2, { min: 3_000_000, max: 3_000_000 }],
    [3, { min: 3_000_000, max: 3_000_000 }],
  ])('%i째 아이면 그 구간의 금액', (order, range) => {
    expect(amountRange(firstMeeting, order)).toEqual(range);
  });

  it('몇째인지 모르면 가장 적은 금액 ~ 가장 많은 금액', () => {
    expect(amountRange(firstMeeting, null)).toEqual({ min: 2_000_000, max: 3_000_000 });
  });

  it('출생 순위와 상관없는 금액은 모를 때도 하나', () => {
    expect(amountRange(flat(9_600_000), null)).toEqual({ min: 9_600_000, max: 9_600_000 });
  });

  it('금액을 정할 수 없으면 null', () => {
    expect(amountRange(wage, 1)).toBeNull();
  });
});

describe('receiptOf', () => {
  const benefits = [benefit('첫만남이용권', firstMeeting), benefit('아동수당', flat(9_600_000)), benefit('육아휴직', wage), benefit('금액 없음', null)];

  it('합계에 넣을 수 있는 금액만 많이 받는 순서로 더한다', () => {
    const receipt = receiptOf(benefits, 1);
    expect(receipt.lines.map((l) => [l.benefit.name, l.range.min])).toEqual([
      ['아동수당', 9_600_000],
      ['첫만남이용권', 2_000_000],
    ]);
    expect(receipt.total).toEqual({ min: 11_600_000, max: 11_600_000 });
  });

  it('몇째인지 모르면 합계도 범위', () => {
    expect(receiptOf(benefits, null).total).toEqual({ min: 11_600_000, max: 12_600_000 });
  });

  it('금액을 정할 수 없는 혜택은 따로 알려주고, 금액을 정리하지 않은 혜택은 넣지 않는다', () => {
    expect(receiptOf(benefits, 1).notCounted.map((b) => b.name)).toEqual(['육아휴직']);
  });

  it('혜택이 없으면 0원', () => {
    expect(receiptOf([], 1)).toEqual({ lines: [], total: { min: 0, max: 0 }, notCounted: [] });
  });
});

describe('formatWon', () => {
  it.each([
    [2_000_000, '200만원'],
    [10_000_000, '1,000만원'],
    [12_500_000, '1,250만원'],
    [15_000, '1만 5,000원'],
    [5_000, '5,000원'],
    [0, '0원'],
  ])('%i → %s', (won, text) => {
    expect(formatWon(won)).toBe(text);
  });

  it('범위는 앞쪽 "원"을 빼고 잇는다', () => {
    expect(formatRange({ min: 2_000_000, max: 3_000_000 })).toBe('200만 ~ 300만원');
    expect(formatRange({ min: 2_000_000, max: 2_000_000 })).toBe('200만원');
  });
});
