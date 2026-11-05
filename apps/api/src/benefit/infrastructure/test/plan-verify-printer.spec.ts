import { describe, expect, it } from 'vitest';

import { benefitDetails } from '../../application/test/fakes/benefit-fixtures';
import { BenefitPlan } from '../../domain/benefit-plan';
import { SourceRef } from '../../domain/source-ref';
import { needsCrossCheck, printPlanVerify } from '../cli/plan-verify-printer';

import type { BenefitAmount } from '../../domain/benefit-amount';
import type { BenefitSchedule } from '../../domain/benefit-schedule';

const basis = { text: '출생일로부터 60일 이내', url: 'https://plus.gov.kr/benefit?svcId=1' };
const schedule: BenefitSchedule = {
  from: { anchor: 'birth', months: 0, days: 0 },
  until: { anchor: 'birth', months: 0, days: 59 },
  untilLabel: '신청 마감',
  summary: '60일 안에 신청',
  basis,
};
const amount = (tiers: BenefitAmount['tiers']): BenefitAmount => ({ kind: 'cash', summary: '100만원', tiers, basis });
const item = (plan: BenefitPlan) => ({
  plan,
  card: benefitDetails('1'),
  sources: [{ ref: new SourceRef('GOV24', '1'), payload: { 지원내용: '100만원' } }],
});

describe('needsCrossCheck', () => {
  it('일정, 올해 기간, 합계 금액이 있는 초안만 대조한다', () => {
    expect(needsCrossCheck(item(new BenefitPlan('gov24-1', schedule, null, null, '')))).toBe(true);
    expect(
      needsCrossCheck(item(new BenefitPlan('gov24-1', null, amount([{ minBirthOrder: 1, maxBirthOrder: null, won: 1 }]), null, ''))),
    ).toBe(true);
    expect(needsCrossCheck(item(new BenefitPlan('gov24-1', null, amount(null), null, '')))).toBe(false);
    expect(needsCrossCheck(item(new BenefitPlan('gov24-1', null, null, null, '')))).toBe(false);
  });
});

describe('printPlanVerify', () => {
  it('정리한 값을 사람이 읽는 말로 풀고 원문을 아래에 붙인다', () => {
    const tiers = [
      { minBirthOrder: 1, maxBirthOrder: 1, won: 1_000_000 },
      { minBirthOrder: 2, maxBirthOrder: null, won: 2_000_000 },
    ];
    const text = printPlanVerify([item(new BenefitPlan('gov24-1', schedule, amount(tiers), null, ''))], '대조 1/1');

    expect(text).toContain('- 일정: 출생일 ~ 출생일 + 59일 (신청 마감)');
    expect(text).toContain('- 합계에 넣는 총액: 첫째 1,000,000원, 둘째 이상 2,000,000원');
    expect(text).toContain('- 지원내용: 100만원');
  });

  it('합계에서 빼는 금액은 그렇다고 적는다', () => {
    expect(printPlanVerify([item(new BenefitPlan('gov24-1', null, amount(null), null, ''))], 't')).toContain('없음 (합계 제외)');
  });

  it('빈 목록이면 제목만', () => {
    expect(printPlanVerify([], '대조')).toBe('# 대조 (0건)\n');
  });
});
