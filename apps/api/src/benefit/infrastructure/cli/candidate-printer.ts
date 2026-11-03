import type { BenefitCandidate, CandidateList } from '../../application/benefit-candidate.service';

const STRENGTH_LABEL = { strong: '강함', possible: '후보' } as const;
const MAX_SUMMARY = 80;

// 지역 후보 목록을 사람이 [x]로 고르는 md로 바꾼다 (docs/research에 저장해서 쓴다)
export function printCandidates({ regions, candidates }: CandidateList, today: string): string {
  const [area] = regions;
  const strong = candidates.filter((c) => c.strength === 'strong').length;
  const sections = regions.flatMap((region) => {
    const rows = candidates.filter((c) => c.regionCode === region.code);
    if (!rows.length) return [];
    return [
      '',
      `## ${region.fullName} (${rows.length}건)`,
      '',
      '| 포함 | 서비스명 | 한 줄 설명 | 기관 | 출처 | 신뢰도 | slug |',
      '|---|---|---|---|---|---|---|',
      ...rows.map(toRow),
    ];
  });
  const empty = regions.filter((region) => !candidates.some((c) => c.regionCode === region.code)).map((r) => r.fullName);

  return (
    [
      `# ${area.fullName} 임신·출산·영유아 혜택 후보 목록`,
      '',
      `- 뽑은 날: ${today} (\`pnpm benefit candidates ${area.code}\`)`,
      '- 출처: 수집해 둔 보조금24(지자체 혜택)와 복지로 지자체. 이미 혜택 목록에 있는 원본은 뺐어요',
      '- 고르는 법: 넣을 항목만 `[ ]`를 `[x]`로 바꿔 주세요. 애매하면 링크로 원문을 확인해요',
      '- 신뢰도 **강함**: 이름이나 생애주기가 임신·출산·영유아. **후보**: 설명에만 관련 단어가 있거나 대상이 넓음',
      `- 모두 ${candidates.length}건 (강함 ${strong} · 후보 ${candidates.length - strong})`,
      ...(empty.length ? [`- 후보가 없는 지역: ${empty.join(', ')}`] : []),
      ...sections,
    ].join('\n') + '\n'
  );
}

function toRow(candidate: BenefitCandidate): string {
  const sources = [...new Set(candidate.sources.map((ref) => ref.label))].join(', ');
  return `| [ ] | ${link(candidate)} | ${cell(shorten(candidate.summary))} | ${cell(candidate.agency)} | ${sources} | ${STRENGTH_LABEL[candidate.strength]} | \`${candidate.suggestedSlug}\` |`;
}

function link({ name, url }: BenefitCandidate) {
  return url ? `[${cell(name)}](${url})` : cell(name);
}

function shorten(text: string) {
  const flat = text.replace(/\s+/g, ' ').trim();
  return flat.length > MAX_SUMMARY ? `${flat.slice(0, MAX_SUMMARY)}…` : flat;
}

// 표가 깨지지 않게 줄바꿈과 | 를 바꾼다
function cell(text: string) {
  return text.replace(/\s+/g, ' ').replace(/\|/g, '\\|').trim();
}
