// 혜택을 받으려면 갖춰야 하는 조건. 사용자가 답한 내용과 비교하는 건 브라우저에서 한다
export const ELIGIBILITY_CONDITIONS = [
  'BIRTH_PARENT_INSURED', // 출산하는 분이 고용보험 가입자 (출산전후휴가 급여 등)
  'PARTNER_INSURED', // 배우자가 고용보험 가입자 (배우자 출산휴가 급여)
  'EITHER_PARENT_INSURED', // 부모 중 한 명이라도 고용보험 가입자 (육아휴직 급여 등)
  'BIRTH_PARENT_UNINSURED', // 출산하는 분이 고용보험 미가입 (고용보험 미적용자 출산급여)
  'HOME_CARE', // 어린이집·유치원을 다니지 않고 집에서 돌봄 (가정양육수당 등)
  'USES_CHILDCARE', // 어린이집·유치원을 다님 (보육료 지원 등). 가정양육수당과 함께 받을 수 없다
] as const;

export type EligibilityCondition = (typeof ELIGIBILITY_CONDITIONS)[number];

export function conditionProblems(conditions: readonly string[]): string[] {
  const unknown = conditions.filter((c) => !(ELIGIBILITY_CONDITIONS as readonly string[]).includes(c));
  return [
    unknown.length > 0 && `알 수 없는 조건입니다: ${unknown.join(', ')}`,
    new Set(conditions).size !== conditions.length && '같은 조건이 두 번 있습니다',
    conditions.includes('BIRTH_PARENT_INSURED') &&
      conditions.includes('BIRTH_PARENT_UNINSURED') &&
      '출산하는 분의 고용보험 가입과 미가입을 함께 요구할 수 없습니다',
    conditions.includes('HOME_CARE') &&
      conditions.includes('USES_CHILDCARE') &&
      '집에서 돌봄과 어린이집·유치원 이용을 함께 요구할 수 없습니다',
  ].filter((problem): problem is string => Boolean(problem));
}

export function sameConditions(a: readonly EligibilityCondition[], b: readonly EligibilityCondition[]) {
  return [...a].sort().join(',') === [...b].sort().join(',');
}
