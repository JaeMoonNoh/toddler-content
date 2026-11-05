import { toSource } from './plan-text-printer';

import type { CandidateWithSources } from '../../application/benefit-candidate.service';

const STRENGTH_LABEL = { strong: '강함', possible: '후보' } as const;

// 후보마다 원문을 모아, 고르기 규칙(docs/benefit-candidate-rules.md)대로 판단할 사람이 읽을 md를 만든다
export function printCandidateTexts(items: CandidateWithSources[], title: string, regionNames: Map<string, string>): string {
  return [`# ${title} (${items.length}건)`, '', ...items.map((item, index) => toSection(item, index, regionNames))].join('\n');
}

function toSection({ candidate, sources }: CandidateWithSources, index: number, regionNames: Map<string, string>): string {
  return [
    `## ${index + 1}. ${candidate.name}`,
    `- slug: \`${candidate.suggestedSlug}\``,
    `- 지역: ${regionNames.get(candidate.regionCode) ?? candidate.regionCode} (${candidate.regionCode})`,
    `- 기관: ${candidate.agency}`,
    `- 원문 링크: ${candidate.url}`,
    `- 신뢰도: ${STRENGTH_LABEL[candidate.strength]}`,
    '',
    ...sources.map(({ ref, payload }) => toSource(ref.source, ref.externalId, payload)),
  ].join('\n');
}
