import { describe, expect, it } from 'vitest';

import { SourceRef } from '../../domain/source-ref';
import { printCandidateTexts } from '../cli/candidate-text-printer';

import type { BenefitCandidate } from '../../application/benefit-candidate.service';

const candidate: BenefitCandidate = {
  regionCode: '2611000000',
  name: '출산장려금',
  summary: '출생아 지원',
  agency: '부산광역시 중구',
  url: 'https://plus.gov.kr/x',
  strength: 'strong',
  sources: [new SourceRef('GOV24', '1'), new SourceRef('BOKJIRO_LOCAL', 'WLF1')],
  suggestedSlug: 'gov24-1',
};
const regions = new Map([['2611000000', '부산광역시 중구']]);

describe('printCandidateTexts', () => {
  it('후보마다 slug, 지역, 링크, 신뢰도와 원문을 쓴다 (수집 안 된 원본은 그렇다고 적는다)', () => {
    const text = printCandidateTexts(
      [
        {
          candidate,
          sources: [
            { ref: candidate.sources[0], payload: { 지원대상: '중구 거주 출생아' } },
            { ref: candidate.sources[1], payload: null },
          ],
        },
      ],
      '후보 1/1',
      regions,
    );

    expect(text).toContain('## 1. 출산장려금\n- slug: `gov24-1`\n- 지역: 부산광역시 중구 (2611000000)');
    expect(text).toContain('- 신뢰도: 강함');
    expect(text).toContain('- 지원대상: 중구 거주 출생아');
    expect(text).toContain('복지로 지자체 WLF1: 수집돼 있지 않음');
  });

  it('지역 이름을 모르면 코드만', () => {
    expect(printCandidateTexts([{ candidate: { ...candidate, regionCode: '9' }, sources: [] }], 't', regions)).toContain('- 지역: 9 (9)');
  });

  it('후보가 없으면 제목만', () => {
    expect(printCandidateTexts([], '후보', regions)).toBe('# 후보 (0건)\n');
  });
});
