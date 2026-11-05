import type { CandidateJudgment, JudgmentDifference } from '../../domain/candidate-judgment';

// 두 판단에서 갈린 후보만. main이 이것만 원문으로 판정한다
export function printJudgmentDifferences(differences: JudgmentDifference[], total: number): string {
  return [
    `같음 ${total - differences.length} · 다름 ${differences.length}`,
    ...differences.map(({ slug, a, b }) => `- ${slug}\n  A: ${judgmentText(a)}\n  B: ${judgmentText(b)}`),
  ].join('\n');
}

function judgmentText(judgment: CandidateJudgment | null): string {
  if (!judgment) return '(판단 없음)';
  const { decision, into, rule, audience, conditions, reason, note } = judgment;
  return [
    decision + (into ? `→${into}` : '') + (rule ? ` 규칙${rule}` : ''),
    audience,
    conditions?.join(','),
    (reason || note) && `| ${(reason || note)!.slice(0, 80)}`,
  ]
    .filter(Boolean)
    .join(' ');
}
