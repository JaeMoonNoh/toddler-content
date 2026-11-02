import { describe, expect, it } from 'vitest';
import type { EligibilityCondition, PublishedBenefit } from './benefit';
import { splitByEligibility, UNANSWERED, unansweredConditions, type Household, type Insurance } from './eligibility';

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
const household = (birthParent: Insurance, partner: Insurance): Household => ({ birthParent, partner, birthOrder: null, childcare: 'unknown' });
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

describe('돌봄 방식', () => {
  const homeCare = benefit('가정양육수당', ['HOME_CARE']);
  const daycareFee = benefit('영유아보육료', ['USES_CHILDCARE']);
  const both = [homeCare, daycareFee, everyone];
  const childcare = (value: Household['childcare']): Household => ({ ...UNANSWERED, childcare: value });

  it('답하지 않으면 둘 다 보여준다', () => {
    expect(shownNames(both, UNANSWERED)).toEqual(['가정양육수당', '영유아보육료', '아동수당']);
  });

  it('집에서 돌보면 보육료를 빼고, 어린이집에 다니면 가정양육수당을 뺀다', () => {
    expect(shownNames(both, childcare('home'))).toEqual(['가정양육수당', '아동수당']);
    expect(shownNames(both, childcare('daycare'))).toEqual(['영유아보육료', '아동수당']);
  });

  it('뺀 이유를 알려준다', () => {
    expect(splitByEligibility([homeCare], childcare('daycare')).excluded[0].reasons).toEqual(['어린이집·유치원 안 다닐 때']);
  });

  it('고용보험과 돌봄 방식은 서로 영향을 주지 않는다', () => {
    const leave = benefit('육아휴직', ['EITHER_PARENT_INSURED']);
    expect(shownNames([leave, homeCare], { ...UNANSWERED, childcare: 'daycare', birthParent: 'insured' })).toEqual(['육아휴직']);
  });
});

describe('unansweredConditions', () => {
  it('답하지 않은 조건만 알려준다', () => {
    const b = benefit('조건 둘', ['HOME_CARE', 'BIRTH_PARENT_INSURED']);
    expect(unansweredConditions(b, { ...UNANSWERED, birthParent: 'insured' })).toEqual(['어린이집·유치원 안 다닐 때']);
    expect(unansweredConditions(b, { ...UNANSWERED, birthParent: 'insured', childcare: 'home' })).toEqual([]);
  });

  it('조건이 없으면 빈 목록', () => {
    expect(unansweredConditions(everyone, UNANSWERED)).toEqual([]);
  });
});
