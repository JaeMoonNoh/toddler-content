import type { Audience } from './audience';
import type { EligibilityCondition } from './eligibility-condition';

// 후보 하나를 보고 내린 판단 (docs/benefit-candidate-rules.md의 판단 파일 한 줄)
export interface CandidateJudgment {
  slug: string;
  decision: 'exclude' | 'include' | 'merge';
  into?: string; // merge일 때 합칠 대표 후보
  name?: string;
  audience?: Audience;
  conditions?: EligibilityCondition[];
  rule?: number; // exclude일 때 빼는 기준 번호
  reason?: string;
  note?: string;
}

export interface JudgmentDifference {
  slug: string;
  a: CandidateJudgment | null; // 한쪽에만 있으면 다른 쪽은 null
  b: CandidateJudgment | null;
}

// 두 판단이 결정(넣음·뺌·합칠 대상), 대상 묶음, 조건 중 하나라도 다른 후보. 이유 문구가 다른 것은 같은 판단으로 본다
export function judgmentDifferences(a: CandidateJudgment[], b: CandidateJudgment[]): JudgmentDifference[] {
  const left = new Map(a.map((judgment) => [judgment.slug, judgment]));
  const right = new Map(b.map((judgment) => [judgment.slug, judgment]));
  return [...new Set([...left.keys(), ...right.keys()])]
    .map((slug) => ({ slug, a: left.get(slug) ?? null, b: right.get(slug) ?? null }))
    .filter(({ a: x, b: y }) => !x || !y || keyOf(x) !== keyOf(y));
}

function keyOf({ decision, into, audience, conditions }: CandidateJudgment): string {
  return JSON.stringify([decision, decision === 'merge' ? into : null, audience ?? null, [...(conditions ?? [])].sort()]);
}
