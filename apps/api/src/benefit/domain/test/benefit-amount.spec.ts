import { describe, expect, it } from 'vitest';

import { amountProblems, type AmountTier, type BenefitAmount, sameAmount } from '../benefit-amount';

const amount = (overrides: Partial<BenefitAmount> = {}): BenefitAmount => ({
  kind: 'voucher',
  summary: '첫째 200만원, 둘째 이상 300만원',
  tiers: [
    { minBirthOrder: 1, maxBirthOrder: 1, won: 2_000_000 },
    { minBirthOrder: 2, maxBirthOrder: null, won: 3_000_000 },
  ],
  basis: { text: '첫째아 200만원, 둘째아 이상 300만원 지급', url: 'https://plus.gov.kr' },
  ...overrides,
});
const tiers = (...list: [number, number | null, number][]): AmountTier[] =>
  list.map(([minBirthOrder, maxBirthOrder, won]) => ({ minBirthOrder, maxBirthOrder, won }));

describe('amountProblems', () => {
  it('출생 순위별 구간이 첫째부터 빈틈없이 이어지면 문제없다', () => {
    expect(amountProblems(amount())).toEqual([]);
  });

  it('출생 순위와 상관없는 금액은 구간 하나', () => {
    expect(amountProblems(amount({ tiers: tiers([1, null, 1_000_000]) }))).toEqual([]);
  });

  it('셋째부터 달라지는 구간도 표현한다', () => {
    expect(amountProblems(amount({ tiers: tiers([1, 2, 1_000_000], [3, null, 2_000_000]) }))).toEqual([]);
  });

  it('금액을 정할 수 없으면 구간 없이 설명만 둔다', () => {
    expect(amountProblems(amount({ kind: 'wage', tiers: null, summary: '통상임금 100% (월 상한 250만원)' }))).toEqual([]);
  });

  it.each([
    ['구간 없음', { tiers: [] }, '구간이 비어'],
    ['둘째부터 시작', { tiers: tiers([2, null, 1]) }, '1번째 아이부터'],
    ['중간에 빈틈', { tiers: tiers([1, 1, 1], [3, null, 1]) }, '2번째 아이부터'],
    ['겹침', { tiers: tiers([1, 2, 1], [2, null, 1]) }, '3번째 아이부터'],
    ['마지막 구간에 끝이 있음', { tiers: tiers([1, 3, 1]) }, '마지막 금액 구간은 끝이 없어야'],
    ['중간 구간에 끝이 없음', { tiers: tiers([1, null, 1], [2, null, 1]) }, '중간 금액 구간'],
    ['0원', { tiers: tiers([1, null, 0]) }, '1원 이상'],
    ['소수 금액', { tiers: tiers([1, null, 1.5]) }, '정수'],
    ['모르는 종류', { kind: 'point' as never }, '금액 종류'],
    ['설명 없음', { summary: ' ' }, '금액 설명'],
    ['근거 없음', { basis: { text: '', url: 'https://a.kr' } }, '근거 문장'],
    ['근거 링크 http', { basis: { text: '근거', url: 'http://a.kr' } }, 'https'],
  ])('%s이면 알려준다', (_, overrides, message) => {
    expect(amountProblems(amount(overrides as Partial<BenefitAmount>)).join(' ')).toContain(message);
  });
});

describe('sameAmount', () => {
  it('내용이 같으면 같다', () => {
    expect(sameAmount(amount(), amount())).toBe(true);
    expect(sameAmount(null, null)).toBe(true);
  });

  it('금액, 설명, 근거 중 하나라도 다르면 다르다', () => {
    expect(sameAmount(amount(), amount({ tiers: tiers([1, null, 2_000_000]) }))).toBe(false);
    expect(sameAmount(amount(), amount({ summary: '다름' }))).toBe(false);
    expect(sameAmount(amount(), null)).toBe(false);
  });
});
