// 아직 혜택 목록에 없는 원본 중 사이트에 올릴 만한 것을 고를 때 쓰는 규칙

export type CandidateStrength = 'strong' | 'possible';

const STRONG_WORDS = /(임신|출산|산모|산후|신생아|난임|임산부|영유아|태아|분유|기저귀|출생|입양|모유|태교|분만)/;
// NOTE: '돌봄'은 노인 돌봄이 많아서 넣지 않는다. 아이돌봄은 '아이'로 걸린다
const RELATED_WORDS = /(아동|육아|보육|다자녀|아이|양육|어린이집)/;
const LEADING_REGION = /^(\S+(특별시|광역시|특별자치시|특별자치도|도|시|군|구)\s+)+/;

export interface CandidateText {
  name: string; // 서비스 이름
  detail: string; // 지원 대상, 요약 등 설명
  lifeStages: string; // 복지로 생애주기 (예: "임신 · 출산, 영유아"). 보조금24는 빈 문자열
}

// 강함: 이름이나 생애주기가 임신·출산. 후보: 설명에만 관련 단어가 있거나 범위가 넓음. 관련 없으면 null
export function candidateStrengthOf({ name, detail, lifeStages }: CandidateText): CandidateStrength | null {
  if (STRONG_WORDS.test(name) || lifeStages.includes('임신')) return 'strong';
  if (STRONG_WORDS.test(detail) || RELATED_WORDS.test(name) || lifeStages.includes('영유아')) return 'possible';
  return null;
}

// 같은 혜택이 보조금24와 복지로에 따로 올라와 있는지 볼 때 쓰는 이름
// (앞의 지역 이름, 띄어쓰기, 문장부호, 끝의 "지원·사업" 무시)
export function serviceNameKey(name: string): string {
  return name
    .replace(LEADING_REGION, '')
    .replace(/[\s·ㆍ,()[\]'"-]/g, '')
    .replace(/(지원사업|사업|지원|서비스)$/, '');
}
