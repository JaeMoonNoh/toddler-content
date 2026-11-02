import { describe, expect, it } from 'vitest';
import type { EligibilityCondition, PublishedBenefit } from './benefit';
import { splitByEligibility, UNANSWERED, type Household, type Insurance } from './eligibility';

const benefit = (name: string, conditions: EligibilityCondition[] = []): PublishedBenefit => ({
  slug: name,
  name,
  scope: 'national',
  sourceName: '보조금24',
  sourceUrl: 'https://plus.gov.kr',
  verifiedAt: null,
  reviewStatus: 'UNVERIFIED',
  schedule: null,
  conditions,
  amount: null,
});
const household = (birthParent: Insurance, partner: Insurance): Household => ({ birthParent, partner, birthOrder: null });
const shownNames = (benefits: PublishedBenefit[], h: Household) => splitByEligibility(benefits, h).shown.map((b) => b.name);

const maternityLeave = benefit('출산전후휴가', ['BIRTH_PARENT_INSURED']);
const partnerLeave = benefit('배우자 출산휴가', ['PARTNER_INSURED']);
const parentalLeave = benefit('육아휴직', ['EITHER_PARENT_INSURED']);
const uninsuredBirth = benefit('미적용자 출산급여', ['BIRTH_PARENT_UNINSURED']);
const everyone = benefit('아동수당');
const all = [maternityLeave, partnerLeave, parentalLeave, uninsuredBirth, everyone];

describe('splitByEligibility', () => {
  it('답하지 않았으면 아무것도 빼지 않는다', () => {
    expect(splitByEligibility(all, UNANSWERED)).toEqual({ shown: all, excluded: [] });
  });

  it('출산하는 분만 가입: 배우자 출산휴가와 미적용자 급여를 뺀다', () => {
    expect(shownNames(all, household('insured', 'uninsured'))).toEqual(['출산전후휴가', '육아휴직', '아동수당']);
  });

  it('배우자만 가입: 출산하는 분은 미적용자 급여를 받고, 육아휴직은 배우자가 쓸 수 있다', () => {
    expect(shownNames(all, household('uninsured', 'insured'))).toEqual(['배우자 출산휴가', '육아휴직', '미적용자 출산급여', '아동수당']);
  });

  it('둘 다 미가입: 고용보험 혜택은 모두 빼고 미적용자 급여는 남긴다', () => {
    expect(shownNames(all, household('uninsured', 'uninsured'))).toEqual(['미적용자 출산급여', '아동수당']);
  });

  it('둘 다 가입: 미적용자 급여만 뺀다', () => {
    expect(shownNames(all, household('insured', 'insured'))).toEqual(['출산전후휴가', '배우자 출산휴가', '육아휴직', '아동수당']);
  });

  describe('한쪽만 답했을 때', () => {
    it('출산하는 분 미가입, 배우자 모름: 육아휴직은 배우자가 가입했을 수 있어 남긴다', () => {
      expect(shownNames([parentalLeave, partnerLeave], household('uninsured', 'unknown'))).toEqual(['육아휴직', '배우자 출산휴가']);
    });

    it('배우자 가입, 출산하는 분 모름: 출산하는 분 조건은 빼지 않는다', () => {
      expect(shownNames([maternityLeave, uninsuredBirth], household('unknown', 'insured'))).toEqual(['출산전후휴가', '미적용자 출산급여']);
    });
  });

  it('뺀 혜택은 맞지 않는 조건과 함께 알려준다', () => {
    expect(splitByEligibility([maternityLeave], household('uninsured', 'unknown')).excluded).toEqual([
      { benefit: maternityLeave, reasons: ['출산하는 분 고용보험 가입'] },
    ]);
  });

  it('조건이 여러 개면 하나라도 안 맞으면 빼고, 안 맞는 것만 이유로 든다', () => {
    const both = benefit('둘 다 필요', ['BIRTH_PARENT_INSURED', 'PARTNER_INSURED']);
    expect(splitByEligibility([both], household('insured', 'uninsured')).excluded[0].reasons).toEqual(['배우자 고용보험 가입']);
  });
});
