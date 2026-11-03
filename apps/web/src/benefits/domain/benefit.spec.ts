import { describe, expect, it } from 'vitest';
import { reviewBadge, type PublishedBenefit } from './benefit';

const benefit = (overrides: Partial<PublishedBenefit>): PublishedBenefit => ({
  slug: 's',
  name: 'n',
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
  ...overrides,
});

describe('reviewBadge', () => {
  it('확인 전이면 검증 전', () => {
    expect(reviewBadge(benefit({}))).toEqual({ tone: 'unverified', text: '검증 전' });
  });

  it('확인됐으면 한국 날짜로 최종 확인일', () => {
    // UTC 11월 2일 16시 = 한국 11월 3일 01시
    expect(reviewBadge(benefit({ reviewStatus: 'VERIFIED', verifiedAt: '2026-11-02T16:00:00.000Z' }))).toEqual({
      tone: 'verified',
      text: '최종 확인 2026.11.03',
    });
  });

  it('확인 뒤 출처가 바뀌었으면 마지막 확인일과 함께 다시 확인 중', () => {
    expect(reviewBadge(benefit({ reviewStatus: 'SOURCE_CHANGED', verifiedAt: '2026-11-02T03:00:00.000Z' })).text).toBe(
      '출처 내용이 바뀌어 다시 확인 중 (마지막 확인 2026.11.02)',
    );
  });
});
