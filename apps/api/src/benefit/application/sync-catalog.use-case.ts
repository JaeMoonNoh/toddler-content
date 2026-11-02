import { Benefit, type BenefitDetails } from '../domain/benefit';
import type { BenefitCatalog } from './ports/benefit-catalog';
import type { BenefitRepository } from './ports/benefit.repository';

export class CatalogError extends Error {}

export interface SyncResult {
  registered: string[];
  revised: string[]; // 정보가 바뀌어서 다시 확인해야 하는 혜택
  regrouped: string[]; // 대상 묶음만 바뀐 혜택. 확인 기록은 그대로
  unchanged: number;
  notInCatalog: string[]; // DB에는 있지만 목록에서 빠진 혜택. 지우지 않고 알려만 준다
}

// 혜택 목록 파일을 DB에 반영한다. 목록에 문제가 하나라도 있으면 아무것도 반영하지 않는다
export class SyncCatalogUseCase {
  constructor(
    private readonly catalog: BenefitCatalog,
    private readonly repository: BenefitRepository,
  ) {}

  async execute(): Promise<SyncResult> {
    const entries = await this.catalog.load();
    assertUniqueSlugs(entries);

    const existing = new Map((await this.repository.findAll()).map((benefit) => [benefit.slug, benefit]));
    const result: SyncResult = { registered: [], revised: [], regrouped: [], unchanged: 0, notInCatalog: [] };
    const toSave: Benefit[] = [];
    const problems: string[] = [];

    for (const entry of entries) {
      try {
        const before = existing.get(entry.slug);
        const after = before ? before.revise(entry) : Benefit.register(entry);
        if (after === before) {
          result.unchanged++;
          continue;
        }
        if (!before) result.registered.push(entry.slug);
        else if (after.verification === before.verification) result.regrouped.push(entry.slug);
        else result.revised.push(entry.slug);
        toSave.push(after);
      } catch (error) {
        problems.push(error instanceof Error ? error.message : String(error));
      }
    }
    if (problems.length) throw new CatalogError(`혜택 목록에 문제가 있어 반영하지 않았습니다\n- ${problems.join('\n- ')}`);

    const inCatalog = new Set(entries.map((entry) => entry.slug));
    result.notInCatalog = [...existing.keys()].filter((slug) => !inCatalog.has(slug));

    if (toSave.length) await this.repository.saveAll(toSave);
    return result;
  }
}

function assertUniqueSlugs(entries: BenefitDetails[]) {
  const seen = new Set<string>();
  const duplicates = new Set(entries.map((entry) => entry.slug).filter((slug) => seen.size === seen.add(slug).size));
  if (duplicates.size) throw new CatalogError(`같은 slug가 두 번 이상 있습니다: ${[...duplicates].join(', ')}`);
}
