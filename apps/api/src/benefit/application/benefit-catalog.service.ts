import { Injectable } from '@nestjs/common';

import { RegionService } from '../../region/application/region.service';
import { Benefit, type BenefitDetails } from '../domain/benefit';

import { BenefitCatalog } from './ports/benefit-catalog';
import { BenefitRepository } from './ports/benefit.repository';

export class CatalogError extends Error {}

export interface SyncResult {
  registered: string[];
  revised: string[]; // 정보가 바뀌어서 다시 확인해야 하는 혜택
  regrouped: string[]; // 대상 묶음만 바뀐 혜택. 확인 기록은 그대로
  unchanged: number;
  notInCatalog: string[]; // DB에는 있지만 목록에서 빠진 혜택. 지우지 않고 알려만 준다
}

export interface RetireResult {
  retired: string[];
  failed: { slug: string; reason: string }[];
}

// 혜택 목록 파일(사람이 정리한 혜택)을 DB와 맞춘다
@Injectable()
export class BenefitCatalogService {
  constructor(
    private readonly catalog: BenefitCatalog,
    private readonly repository: BenefitRepository,
    private readonly regions: RegionService,
  ) {}

  // 목록 파일을 DB에 반영한다. 목록에 문제가 하나라도 있으면 아무것도 반영하지 않는다
  async sync(): Promise<SyncResult> {
    const entries = await this.catalog.load();
    rejectDuplicateSlugs(entries);

    const existing = new Map((await this.repository.findAll()).map((benefit) => [benefit.slug, benefit]));
    const result: SyncResult = { registered: [], revised: [], regrouped: [], unchanged: 0, notInCatalog: [] };
    const toSave: Benefit[] = [];
    const tree = await this.regions.tree();
    const problems: string[] = entries
      .filter((entry) => !tree.has(entry.regionCode))
      .map((entry) => `${entry.slug}: 지역 목록에 없는 지역 코드입니다 (${entry.regionCode})`);

    for (const entry of entries) {
      try {
        const before = existing.get(entry.slug);
        const after = before ? before.revise(entry) : Benefit.register(entry);
        if (after === before) {
          result.unchanged++;
          continue;
        }
        if (!before) result.registered.push(entry.slug);
        else if (before.changeKind(entry) === 'audience') result.regrouped.push(entry.slug);
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

  // 목록 파일에서 뺀 혜택을 DB에서도 지운다. sync는 실수로 지우지 않도록 지우지 않으므로 이 명령으로만 지운다
  async retire(slugs: string[]): Promise<RetireResult> {
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

function rejectDuplicateSlugs(entries: BenefitDetails[]) {
  const seen = new Set<string>();
  const duplicates = new Set(entries.map((entry) => entry.slug).filter((slug) => seen.size === seen.add(slug).size));
  if (duplicates.size) throw new CatalogError(`같은 slug가 두 번 이상 있습니다: ${[...duplicates].join(', ')}`);
}
