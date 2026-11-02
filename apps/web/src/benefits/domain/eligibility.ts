import type { EligibilityCondition, PublishedBenefit } from './benefit';

export type Insurance = 'unknown' | 'insured' | 'uninsured';
export type Childcare = 'unknown' | 'home' | 'daycare'; // 집에서 돌봄, 어린이집·유치원

// 사용자가 답한 가족 상황. 답하지 않은 건 unknown이고, unknown이면 혜택을 빼지 않는다
export interface Household {
  birthParent: Insurance; // 출산하는 분
  partner: Insurance; // 배우자
  birthOrder: number | null; // 이번 아이가 몇째인지. 3은 셋째 이상. null이면 답하지 않음
  childcare: Childcare;
}

export const UNANSWERED: Household = { birthParent: 'unknown', partner: 'unknown', birthOrder: null, childcare: 'unknown' };

export const CONDITION_LABEL: Record<EligibilityCondition, string> = {
  BIRTH_PARENT_INSURED: '출산하는 분 고용보험 가입',
  PARTNER_INSURED: '배우자 고용보험 가입',
  EITHER_PARENT_INSURED: '부모 중 한 명 고용보험 가입',
  BIRTH_PARENT_UNINSURED: '출산하는 분 고용보험 미가입',
  HOME_CARE: '어린이집·유치원 안 다닐 때',
  USES_CHILDCARE: '어린이집·유치원 다닐 때',
};

// true: 맞음, false: 안 맞음, null: 답이 없어서 모름
function meets(condition: EligibilityCondition, { birthParent, partner, childcare }: Household): boolean | null {
  switch (condition) {
    case 'BIRTH_PARENT_INSURED':
      return answer(birthParent, 'insured');
    case 'BIRTH_PARENT_UNINSURED':
      return answer(birthParent, 'uninsured');
    case 'PARTNER_INSURED':
      return answer(partner, 'insured');
    case 'HOME_CARE':
      return childcare === 'unknown' ? null : childcare === 'home';
    case 'USES_CHILDCARE':
      return childcare === 'unknown' ? null : childcare === 'daycare';
    case 'EITHER_PARENT_INSURED':
      if (birthParent === 'insured' || partner === 'insured') return true;
      if (birthParent === 'uninsured' && partner === 'uninsured') return false;
      return null;
  }
}

function answer(given: Insurance, wanted: Exclude<Insurance, 'unknown'>) {
  return given === 'unknown' ? null : given === wanted;
}

export interface ExcludedBenefit {
  benefit: PublishedBenefit;
  reasons: string[]; // 맞지 않는 조건
}

export interface EligibilitySplit {
  shown: PublishedBenefit[];
  excluded: ExcludedBenefit[];
}

// 조건이 하나라도 확실히 안 맞으면 뺀다. 모르는 조건이 있으면 그대로 보여준다
export function splitByEligibility(benefits: PublishedBenefit[], household: Household): EligibilitySplit {
  const split: EligibilitySplit = { shown: [], excluded: [] };
  for (const benefit of benefits) {
    const unmet = benefit.conditions.filter((condition) => meets(condition, household) === false);
    if (unmet.length) split.excluded.push({ benefit, reasons: unmet.map((c) => CONDITION_LABEL[c]) });
    else split.shown.push(benefit);
  }
  return split;
}

// 아직 답하지 않아서 맞는지 모르는 조건. 금액 합계에서 "조건부"로 표시할 때 쓴다
export function unansweredConditions(benefit: PublishedBenefit, household: Household): string[] {
  return benefit.conditions.filter((c) => meets(c, household) === null).map((c) => CONDITION_LABEL[c]);
}

// 선택 질문 중 답한 개수 (몇째, 출산하는 분 고용보험, 배우자 고용보험, 어린이집)
export function answeredCount({ birthOrder, birthParent, partner, childcare }: Household): number {
  return [birthOrder !== null, birthParent !== 'unknown', partner !== 'unknown', childcare !== 'unknown'].filter(Boolean).length;
}
