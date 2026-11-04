import { describe, expect, it } from 'vitest';

import { BenefitPlan } from '../benefit-plan';
import { SourceRef } from '../source-ref';

import type { BenefitDetails } from '../benefit';
import type { BenefitAmount } from '../benefit-amount';
import type { BenefitSchedule } from '../benefit-schedule';

const URL = 'https://plus.gov.kr/x';
const card = (overrides: Partial<BenefitDetails> = {}): BenefitDetails => ({
  slug: 'gov24-1',
  name: '출산지원금',
  regionCode: '4100000000',
  sourceUrl: URL,
  sources: [new SourceRef('GOV24', '1')],
  schedule: null,
  conditions: [],
  amount: null,
  applicationPeriod: null,
  howToApply: null,
  audience: null,
  ...overrides,
});
const schedule = (overrides: Partial<BenefitSchedule> = {}): BenefitSchedule => ({
  from: { anchor: 'birth', months: 0, days: 0 },
  until: { anchor: 'birth', months: 12, days: -1 },
  untilLabel: '신청 마감 (출생 후 1년)',
  summary: '출생 후 1년 안에 신청해요',
  basis: { text: '출생일로부터 1년 이내', url: URL },
  ...overrides,
});
const amount = (overrides: Partial<BenefitAmount> = {}): BenefitAmount => ({
  kind: 'cash',
  summary: '첫째 50만원',
  tiers: [{ minBirthOrder: 1, maxBirthOrder: null, won: 500000 }],
  basis: { text: '50만원 지급', url: URL },
  ...overrides,
});
const period = (start: string, end: string) => ({ start, end, basis: { text: '2026.3.2.~3.31.', url: URL } });
const problemsOf = (
  plan: Partial<{ schedule: BenefitSchedule; amount: BenefitAmount; period: ReturnType<typeof period> }>,
  target = card(),
) => new BenefitPlan('gov24-1', plan.schedule ?? null, plan.amount ?? null, plan.period ?? null, '').problemsFor(target, '2026');

describe('BenefitPlan.problemsFor', () => {
  it('세 필드가 모두 비어 있으면 문제가 없다', () => {
    expect(problemsOf({})).toEqual([]);
  });

  it('원문에 맞게 정리한 일정·금액·올해 기간은 문제가 없다', () => {
    expect(problemsOf({ schedule: schedule(), amount: amount(), period: period('2026-03-02', '2026-03-31') })).toEqual([]);
  });

  it('근거 링크가 카드의 원문 링크와 다르면 알린다', () => {
    expect(problemsOf({ schedule: schedule({ basis: { text: '근거', url: 'https://plus.gov.kr/other' } }) })).toEqual([
      'schedule의 근거 링크가 혜택의 원문 링크와 다릅니다',
    ]);
  });

  it('도메인 검사 문제도 함께 알린다', () => {
    expect(problemsOf({ schedule: schedule({ summary: ' ' }) })).toContain('일정 설명이 비어 있습니다');
  });

  it('대상 묶음이 있는 카드에 합계 금액을 채우면 알린다', () => {
    expect(problemsOf({ amount: amount() }, card({ audience: 'LOW_INCOME' }))).toEqual([
      '대상 묶음(LOW_INCOME)이 있는 혜택은 합계 금액(tiers)을 null로 둡니다',
    ]);
  });

  it('조건이 있는 카드에 합계 금액을 채우면 알린다', () => {
    expect(problemsOf({ amount: amount() }, card({ conditions: ['USES_CHILDCARE'] }))).toEqual([
      '조건(USES_CHILDCARE)이 있는 혜택은 합계 금액(tiers)을 null로 둡니다',
    ]);
  });

  it('대상 묶음이 있어도 합계 금액이 null이면 문제가 없다', () => {
    expect(problemsOf({ amount: amount({ tiers: null }) }, card({ audience: 'LOW_INCOME' }))).toEqual([]);
  });

  it('서비스에 합계 금액을 채우면 알린다', () => {
    expect(problemsOf({ amount: amount({ kind: 'service' }) })).toEqual(['서비스는 합계 금액(tiers)을 null로 둡니다']);
  });

  it('정해지지 않은 금액에 합계 금액을 채우면 알린다', () => {
    expect(problemsOf({ amount: amount({ summary: '최대 50만원' }) })).toEqual([
      '금액 설명에 "최대"가 있는데 합계 금액(tiers)을 채웠습니다. 정해진 금액인지 확인해 주세요',
    ]);
  });

  it('올해와 겹치지 않는 신청 기간은 알린다', () => {
    expect(problemsOf({ period: period('2025-01-01', '2025-12-31') })).toEqual([
      '올해(2026) 신청 기간이 아닙니다: 2025-01-01 ~ 2025-12-31',
    ]);
  });

  it('작년에 시작해 올해 끝나는 기간은 받는다', () => {
    expect(problemsOf({ period: period('2025-12-01', '2026-01-31') })).toEqual([]);
  });
});

describe('BenefitPlan.applyTo', () => {
  it('일정·금액·올해 기간만 바꾸고 null이면 비운다', () => {
    const before = card({ name: '그대로', amount: amount() });
    const after = new BenefitPlan('gov24-1', schedule(), null, null, '메모').applyTo(before);

    expect(after).toEqual({ ...before, schedule: schedule(), amount: null, applicationPeriod: null });
  });
});
