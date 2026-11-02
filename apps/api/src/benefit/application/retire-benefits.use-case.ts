import type { BenefitCatalog } from './ports/benefit-catalog';
import type { BenefitRepository } from './ports/benefit.repository';

export interface RetireResult {
  retired: string[];
  failed: { slug: string; reason: string }[];
}

// 목록 파일에서 뺀 혜택을 DB에서도 지운다. sync는 실수로 지우지 않도록 지우지 않으므로 이 명령으로만 지운다
export class RetireBenefitsUseCase {
  constructor(
    private readonly catalog: BenefitCatalog,
    private readonly repository: BenefitRepository,
  ) {}

  async execute(slugs: string[]): Promise<RetireResult> {
    const wanted = [...new Set(slugs)];
    const inCatalog = new Set((await this.catalog.load()).map((entry) => entry.slug));
    const existing = new Set((await this.repository.findBySlugs(wanted)).map((benefit) => benefit.slug));

    const result: RetireResult = { retired: [], failed: [] };
    for (const slug of wanted) {
      if (inCatalog.has(slug)) result.failed.push({ slug, reason: '목록 파일에 아직 있습니다. 목록 파일에서 먼저 빼 주세요' });
      else if (!existing.has(slug)) result.failed.push({ slug, reason: '없는 혜택입니다' });
      else result.retired.push(slug);
    }

    if (result.retired.length) await this.repository.deleteBySlugs(result.retired);
    return result;
  }
}
