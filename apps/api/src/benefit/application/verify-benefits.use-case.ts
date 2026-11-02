import type { Benefit } from '../domain/benefit';
import type { BenefitRepository } from './ports/benefit.repository';
import type { SourceStateReader } from './ports/source-state.reader';

export interface VerifyResult {
  verified: string[];
  failed: { slug: string; reason: string }[];
}

// 사람이 원문을 보고 확인한 혜택에 확인일과 그때 원본 모습을 남긴다. 확인할 수 없는 것만 빼고 나머지는 반영한다
export class VerifyBenefitsUseCase {
  constructor(
    private readonly repository: BenefitRepository,
    private readonly reader: SourceStateReader,
  ) {}

  async execute(slugs: string[], at: Date): Promise<VerifyResult> {
    const wanted = [...new Set(slugs)];
    const found = await this.repository.findBySlugs(wanted);
    const current = await this.reader.read(found.flatMap((benefit) => benefit.sources));
    const bySlug = new Map(found.map((benefit) => [benefit.slug, benefit]));

    const result: VerifyResult = { verified: [], failed: [] };
    const toSave: Benefit[] = [];
    for (const slug of wanted) {
      const benefit = bySlug.get(slug);
      if (!benefit) {
        result.failed.push({ slug, reason: '없는 혜택입니다' });
        continue;
      }
      try {
        toSave.push(benefit.verify(current, at));
        result.verified.push(slug);
      } catch (error) {
        result.failed.push({ slug, reason: error instanceof Error ? error.message : String(error) });
      }
    }

    if (toSave.length) await this.repository.saveAll(toSave);
    return result;
  }
}
