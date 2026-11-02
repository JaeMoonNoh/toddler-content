import type { BenefitDetails } from '../../domain/benefit';
import { SourceRef } from '../../domain/source-ref';

// 유스케이스 테스트에서 함께 쓰는 혜택 정보
export function benefitDetails(id: string, overrides: Partial<BenefitDetails> = {}): BenefitDetails {
  return {
    slug: `gov24-${id}`,
    name: `혜택 ${id}`,
    scope: 'national',
    sourceUrl: `https://plus.gov.kr/benefit?svcId=${id}`,
    sources: [new SourceRef('GOV24', id)],
    schedule: null,
    conditions: [],
    amount: null,
    ...overrides,
  };
}
