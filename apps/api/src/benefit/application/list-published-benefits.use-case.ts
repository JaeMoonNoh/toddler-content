import type { BenefitScope } from '../domain/benefit';
import type { BenefitRepository } from './ports/benefit.repository';
import type { SourceStateReader } from './ports/source-state.reader';

export interface PublishedBenefit {
  slug: string;
  name: string;
  scope: BenefitScope;
  sourceName: string;
  sourceUrl: string;
  verifiedAt: Date;
  sourceChangedSinceVerified: boolean; // 화면에 "출처 내용이 바뀌어 다시 확인 중"으로 보여준다
}

// 사이트에 보여줄 혜택. 사람이 확인한 것만 나간다
export class ListPublishedBenefitsUseCase {
  constructor(
    private readonly repository: BenefitRepository,
    private readonly reader: SourceStateReader,
  ) {}

  async execute(): Promise<PublishedBenefit[]> {
    const benefits = await this.repository.findAll();
    const current = await this.reader.read(benefits.flatMap((benefit) => benefit.sources));

    return benefits
      .filter((benefit) => benefit.isPublished(current))
      .map((benefit) => ({
        slug: benefit.slug,
        name: benefit.name,
        scope: benefit.scope,
        sourceName: benefit.primarySource.label,
        sourceUrl: benefit.sourceUrl,
        verifiedAt: benefit.verifiedAt!,
        sourceChangedSinceVerified: benefit.reviewStatus(current).kind === 'SOURCE_CHANGED',
      }))
      .sort((a, b) => a.name.localeCompare(b.name, 'ko'));
  }
}
