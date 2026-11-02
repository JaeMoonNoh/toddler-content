import type { Benefit } from '../domain/benefit';
import type { SourceState } from '../domain/current-sources';
import type { ReviewStatus } from '../domain/review-status';
import type { SourceRef } from '../domain/source-ref';
import type { BenefitRepository } from './ports/benefit.repository';
import type { SourceStateReader } from './ports/source-state.reader';

export interface BenefitDetail {
  benefit: Benefit;
  status: ReviewStatus;
  sources: { ref: SourceRef; state: SourceState | null }[]; // 연결된 원본의 지금 모습. 수집된 적 없으면 null
}

// 혜택 하나를 검증할 때 필요한 것을 한 번에 모은다: 우리가 정리한 내용과 지금 원문
export class BenefitDetailUseCase {
  constructor(
    private readonly repository: BenefitRepository,
    private readonly reader: SourceStateReader,
  ) {}

  async execute(slug: string): Promise<BenefitDetail | null> {
    const [benefit] = await this.repository.findBySlugs([slug]);
    if (!benefit) return null;

    const current = await this.reader.read(benefit.sources);
    return {
      benefit,
      status: benefit.reviewStatus(current),
      sources: benefit.sources.map((ref) => ({ ref, state: current.of(ref) ?? null })),
    };
  }
}
