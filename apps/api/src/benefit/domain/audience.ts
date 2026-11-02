// 특정 대상만 받는 혜택의 묶음. 화면에서 "해당되면 확인하세요" 아래에 접어 보여줄 때만 쓴다.
// 혜택 내용이 아니라 보여주는 자리라서, 바꿔도 검증을 다시 하지 않는다
export const AUDIENCES = [
  'ADOPTION_FOSTER', // 입양·가정위탁
  'DISABILITY', // 장애
  'SINGLE_TEEN_PARENT', // 한부모·청소년부모
  'LOW_INCOME', // 기초생활·차상위 등 저소득
  'MULTI_CHILD', // 다자녀·다태아
  'INFERTILITY', // 난임·임신 준비
  'SICK_CHILD', // 아이 건강 (미숙아·질환·발달)
  'SPECIAL', // 그 밖의 특정 대상
] as const;

export type Audience = (typeof AUDIENCES)[number];

export function audienceProblems(audience: string | null): string[] {
  return audience !== null && !(AUDIENCES as readonly string[]).includes(audience) ? [`알 수 없는 대상 묶음입니다: "${audience}"`] : [];
}
