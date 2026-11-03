import { describe, expect, it } from 'vitest';

import { benefitDetails } from '../../application/test/fakes/benefit-fixtures';
import { Benefit } from '../../domain/benefit';
import { CurrentSources } from '../../domain/current-sources';
import { SourceRef } from '../../domain/source-ref';
import { BenefitDetailPrinter, describeOffset } from '../cli/benefit-detail-printer';

import type { BenefitDetail } from '../../application/benefit-review.service';

const gov = new SourceRef('GOV24', '135200005015');
const benefit = Benefit.register(
  benefitDetails('135200005015', {
    name: '첫만남이용권 지원',
    sources: [gov],
    conditions: [],
    schedule: {
      from: { anchor: 'birth', months: 0, days: 0 },
      until: { anchor: 'birth', months: 24, days: -1 },
      untilLabel: '신청·사용 기한',
      summary: '생년월일로부터 2년 안에 써야 해요',
      basis: { text: '생년월일로부터 2년내에 신청하여 사용 가능', url: 'https://plus.gov.kr/a' },
    },
    amount: {
      kind: 'voucher',
      summary: '첫째 200만원, 둘째 이상 300만원',
      tiers: [
        { minBirthOrder: 1, maxBirthOrder: 1, won: 2_000_000 },
        { minBirthOrder: 2, maxBirthOrder: null, won: 3_000_000 },
      ],
      basis: { text: '첫째아 200만원, 둘째아 이상 300만원 지급', url: 'https://plus.gov.kr/a' },
    },
  }),
);
const state = {
  ref: gov,
  hash: 'h',
  payload: { 지원내용: '첫째아 200만원,\n\n둘째아 이상 300만원', 신청기한: '상시신청', 조회수: 10 },
  removed: false,
};
const detail = (overrides: Partial<BenefitDetail> = {}): BenefitDetail => ({
  benefit,
  status: benefit.reviewStatus(new CurrentSources([state])),
  sources: [{ ref: gov, state }],
  ...overrides,
});

describe('BenefitDetailPrinter', () => {
  const text = new BenefitDetailPrinter().print(detail());

  it('정리한 일정과 금액을 사람이 읽는 말로 보여준다', () => {
    expect(text).toContain('  기간: 출생일 ~ 출생일 + 24개월 - 1일 (신청·사용 기한)');
    expect(text).toContain('  이용권: 첫째 200만원, 둘째 이상 300만원');
    expect(text).toContain('  합계에 넣는 금액: 첫째 2,000,000원, 둘째 이상 3,000,000원');
  });

  it('원문은 검증에 필요한 필드만, 줄바꿈 없이 보여준다', () => {
    expect(text).toContain('[지금 원문 · 보조금24 135200005015]\n  지원내용: 첫째아 200만원, 둘째아 이상 300만원\n  신청기한: 상시신청');
    expect(text).not.toContain('조회수');
  });

  it('비어 있는 원문 필드는 보여주지 않는다', () => {
    const empty = { ...state, payload: { 지원내용: 'a', 접수기관: null, 신청방법: '' } };
    const out = new BenefitDetailPrinter().print(detail({ sources: [{ ref: gov, state: empty }] }));
    expect(out).not.toContain('접수기관');
    expect(out).not.toContain('신청방법');
  });

  it('마지막에 verify 명령을 알려준다', () => {
    expect(text.split('\n').at(-1)).toBe('원문과 맞으면: pnpm benefit verify gov24-135200005015');
  });

  it('올해 신청 기간이 있으면 날짜와 근거를 보여준다', () => {
    const withPeriod = Benefit.register(
      benefitDetails('b55353000001', {
        applicationPeriod: {
          start: '2026-06-15',
          end: '2026-12-31',
          basis: { text: '신청기한: 2026. 6. 15. ~ 2026. 12. 31.', url: 'https://plus.gov.kr/e' },
        },
      }),
    );
    const out = new BenefitDetailPrinter().print({ benefit: withPeriod, status: { kind: 'UNVERIFIED' }, sources: [] });
    expect(out).toContain(
      '[우리가 정리한 올해 신청 기간]\n  기간: 2026-06-15 ~ 2026-12-31\n  근거: 신청기한: 2026. 6. 15. ~ 2026. 12. 31.',
    );
  });

  it('신청 방법이 있으면 설명과 근거를 보여준다', () => {
    const withHow = Benefit.register(
      benefitDetails('1', {
        howToApply: { summary: '주민센터 방문 · 문의 129', basis: { text: '신청방법: 방문신청', url: 'https://plus.gov.kr/x' } },
      }),
    );
    const out = new BenefitDetailPrinter().print({ benefit: withHow, status: { kind: 'UNVERIFIED' }, sources: [] });
    expect(out).toContain('[우리가 정리한 신청 방법]\n  설명: 주민센터 방문 · 문의 129\n  근거: 신청방법: 방문신청');
  });

  it('정리하지 않은 일정·금액은 그렇다고 알려준다', () => {
    const bare = Benefit.register(benefitDetails('1'));
    const out = new BenefitDetailPrinter().print({ benefit: bare, status: { kind: 'UNVERIFIED' }, sources: [] });
    expect(out).toContain('[우리가 정리한 일정]\n  아직 정리하지 않았어요');
    expect(out).toContain('[우리가 정리한 금액]\n  아직 정리하지 않았어요');
    expect(out).toContain('[우리가 정리한 올해 신청 기간]\n  없음');
    expect(out).toContain('[우리가 정리한 신청 방법]\n  아직 정리하지 않았어요');
  });

  it('수집된 적 없는 원본과 사라진 원본을 알려준다', () => {
    expect(new BenefitDetailPrinter().print(detail({ sources: [{ ref: gov, state: null }] }))).toContain('수집된 적 없는 원본');
    expect(new BenefitDetailPrinter().print(detail({ sources: [{ ref: gov, state: { ...state, removed: true } }] }))).toContain(
      '⚠ 출처 목록에서 사라졌어요',
    );
  });

  it('긴 원문 필드는 잘라서 보여준다', () => {
    const long = { ...state, payload: { 지원내용: '가'.repeat(100) } };
    expect(new BenefitDetailPrinter(10).print(detail({ sources: [{ ref: gov, state: long }] }))).toContain(
      `  지원내용: ${'가'.repeat(10)}…`,
    );
  });
});

describe('describeOffset', () => {
  it.each([
    [{ anchor: 'birth', months: 0, days: 0 }, '출생일'],
    [{ anchor: 'birth', months: 0, days: 59 }, '출생일 + 59일'],
    [{ anchor: 'birth', months: 0, days: -40 }, '출생일 - 40일'],
    [{ anchor: 'birth', months: 24, days: -1 }, '출생일 + 24개월 - 1일'],
    [{ anchor: 'pregnancy', months: 0, days: 0 }, '임신 시작(출산예정일 280일 전)'],
  ] as const)('%o → %s', (offset, text) => {
    expect(describeOffset(offset)).toBe(text);
  });
});
