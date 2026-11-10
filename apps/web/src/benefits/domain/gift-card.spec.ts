import { describe, expect, it } from 'vitest';
import type { BenefitAmount, PublishedBenefit } from './benefit';
import { UNANSWERED } from './eligibility';
import { giftCardOf } from './gift-card';
import { RegionTree } from './region';

const tree = new RegionTree([
  { code: '0000000000', name: '전국', fullName: '전국', parentCode: null },
  { code: '5000000000', name: '제주특별자치도', fullName: '제주특별자치도', parentCode: '0000000000' },
  { code: '5013000000', name: '서귀포시', fullName: '제주특별자치도 서귀포시', parentCode: '5000000000' },
]);
const seogwipo = tree.choose('5013000000');

const byOrder = (first: number, second: number): BenefitAmount => ({
  kind: 'cash',
  summary: '요약',
  tiers: [
    { minBirthOrder: 1, maxBirthOrder: 1, won: first },
    { minBirthOrder: 2, maxBirthOrder: null, won: second },
  ],
  basis: { text: '근거', url: 'https://a.kr' },
});
const benefit = (name: string, amount: BenefitAmount, extra: Partial<PublishedBenefit> = {}): PublishedBenefit => ({
  slug: name,
  name,
  regionCode: '0000000000',
  regionName: '전국',
  sourceName: '보조금24',
  sourceUrl: 'https://plus.gov.kr',
  verifiedAt: '2026-11-03T00:00:00Z',
  reviewStatus: 'VERIFIED',
  schedule: null,
  conditions: [],
  amount,
  applicationPeriod: null,
  howToApply: null,
  audience: null,
  ...extra,
});

describe('giftCardOf', () => {
  it('몇째인지 답하지 않았으면 첫째 기준으로 더한다', () => {
    const card = giftCardOf([benefit('첫만남이용권', byOrder(2_000_000, 3_000_000)), benefit('아동수당', byOrder(9_600_000, 9_600_000))], UNANSWERED, seogwipo);
    expect(card?.total).toBe(11_600_000);
    expect(card?.lines).toEqual([
      { name: '아동수당', won: 9_600_000 },
      { name: '첫만남이용권', won: 2_000_000 },
    ]);
    expect(card?.basis).toBe('제주특별자치도 서귀포시 · 첫째 기준 · 몇 년에 걸쳐 받는 금액이에요');
  });

  it('둘째라고 답하면 둘째 금액으로 더한다', () => {
    const card = giftCardOf([benefit('첫만남이용권', byOrder(2_000_000, 3_000_000))], { ...UNANSWERED, birthOrder: 2 }, seogwipo);
    expect(card?.total).toBe(3_000_000);
    expect(card?.basis).toContain('둘째 기준');
  });

  it('답에 따라 빠질 수 있는 금액과 검증 전 금액은 넣지 않는다', () => {
    const card = giftCardOf(
      [
        benefit('아동수당', byOrder(9_600_000, 9_600_000)),
        benefit('가정양육수당', byOrder(6_200_000, 6_200_000), { conditions: ['HOME_CARE'] }),
        benefit('검증 전 지원금', byOrder(1_000_000, 1_000_000), { reviewStatus: 'UNVERIFIED', verifiedAt: null }),
      ],
      UNANSWERED,
      seogwipo,
    );
    expect(card?.lines.map((line) => line.name)).toEqual(['아동수당']);
  });

  it('조건에 답해서 맞으면 넣는다', () => {
    const card = giftCardOf([benefit('가정양육수당', byOrder(6_200_000, 6_200_000), { conditions: ['HOME_CARE'] })], { ...UNANSWERED, childcare: 'home' }, seogwipo);
    expect(card?.total).toBe(6_200_000);
  });

  it('네 건까지 이름을 적고 나머지는 건수만 센다', () => {
    const benefits = [1, 2, 3, 4, 5, 6].map((n) => benefit(`혜택${n}`, byOrder(n * 100_000, n * 100_000)));
    const card = giftCardOf(benefits, UNANSWERED, seogwipo);
    expect(card?.lines.map((line) => line.name)).toEqual(['혜택6', '혜택5', '혜택4', '혜택3']);
    expect(card?.moreCount).toBe(2);
    expect(card?.total).toBe(2_100_000);
  });

  it('출처는 겹치지 않게 모으고 가장 최근 확인일을 붙인다', () => {
    const card = giftCardOf(
      [
        benefit('A', byOrder(100_000, 100_000)),
        benefit('B', byOrder(200_000, 200_000), { sourceName: '복지로', verifiedAt: '2026-11-07T03:00:00Z' }),
        benefit('C', byOrder(300_000, 300_000)),
      ],
      UNANSWERED,
      seogwipo,
    );
    expect(card?.source).toBe('출처: 보조금24, 복지로 (2026.11.07 확인)');
  });

  it('넣을 금액이 하나도 없으면 카드를 만들지 않는다', () => {
    expect(giftCardOf([], UNANSWERED, seogwipo)).toBeNull();
  });
});
