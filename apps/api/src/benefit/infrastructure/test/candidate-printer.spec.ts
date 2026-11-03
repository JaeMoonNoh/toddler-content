import { describe, expect, it } from 'vitest';

import { SourceRef } from '../../domain/source-ref';
import { printCandidates } from '../cli/candidate-printer';

import type { BenefitCandidate } from '../../application/benefit-candidate.service';

const regions = [
  { code: '2800000000', fullName: '인천광역시' },
  { code: '2818500000', fullName: '인천광역시 연수구' },
  { code: '2872000000', fullName: '인천광역시 옹진군' },
];
const candidate = (overrides: Partial<BenefitCandidate> = {}): BenefitCandidate => ({
  regionCode: '2800000000',
  name: '임산부 교통비 지원',
  summary: '임산부 교통비 지원',
  agency: '인천광역시',
  url: 'https://plus.gov.kr/x',
  strength: 'strong',
  sources: [new SourceRef('GOV24', '628000000735'), new SourceRef('BOKJIRO_LOCAL', 'WLF00005468')],
  suggestedSlug: 'gov24-628000000735',
  ...overrides,
});

describe('printCandidates', () => {
  const text = printCandidates(
    {
      regions,
      candidates: [candidate(), candidate({ regionCode: '2818500000', name: '아이 키움 | 지원', strength: 'possible', url: '' })],
    },
    '2026-11-03',
  );

  it('제목, 뽑은 날과 명령, 건수를 쓰고 후보 없는 지역을 알린다', () => {
    expect(text).toContain('# 인천광역시 임신·출산·영유아 혜택 후보 목록');
    expect(text).toContain('- 뽑은 날: 2026-11-03 (`pnpm benefit candidates 2800000000`)');
    expect(text).toContain('- 모두 2건 (강함 1 · 후보 1)');
    expect(text).toContain('- 후보가 없는 지역: 인천광역시 옹진군');
  });

  it('지역마다 표를 만들고 고를 칸을 비워 둔다', () => {
    expect(text).toContain('## 인천광역시 (1건)');
    expect(text).toContain(
      '| [ ] | [임산부 교통비 지원](https://plus.gov.kr/x) | 임산부 교통비 지원 | 인천광역시 | 보조금24, 복지로 | 강함 | `gov24-628000000735` |',
    );
    expect(text).not.toContain('## 인천광역시 옹진군');
  });

  it('링크가 없으면 이름만, 표를 깨는 |는 바꾼다', () => {
    expect(text).toContain('| [ ] | 아이 키움 \\| 지원 |');
  });

  it('긴 설명은 잘라서 보여준다', () => {
    const long = printCandidates({ regions, candidates: [candidate({ summary: '가'.repeat(100) })] }, '2026-11-03');
    expect(long).toContain(`${'가'.repeat(80)}…`);
  });

  it('후보가 하나도 없으면 0건으로', () => {
    expect(printCandidates({ regions, candidates: [] }, '2026-11-03')).toContain('- 모두 0건 (강함 0 · 후보 0)');
  });
});
