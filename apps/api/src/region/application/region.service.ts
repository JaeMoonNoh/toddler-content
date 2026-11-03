import { Injectable } from '@nestjs/common';

import { NATIONWIDE_CODE, type RegionChanges, regionChangesBetween, type RegionDirectory, RegionTree } from '../domain/region';

import { RegionCatalog } from './ports/region-catalog';
import { RegionSource } from './ports/region-source';

export class RegionSyncRejectedError extends Error {}

export interface RegionSyncResult {
  count: number;
  changes: RegionChanges;
}

// 받은 지역이 이전보다 이만큼 넘게 줄면 원본 오류로 보고 반영하지 않는다
const MIN_KEPT_RATIO = 0.9;

@Injectable()
export class RegionService {
  constructor(
    private readonly catalog: RegionCatalog,
    private readonly source: RegionSource,
  ) {}

  async directory(): Promise<RegionDirectory> {
    const directory = await this.catalog.load();
    if (!directory) throw new RegionSyncRejectedError('지역 목록이 없습니다. pnpm region sync로 먼저 받아 주세요');
    return directory;
  }

  async tree(): Promise<RegionTree> {
    return new RegionTree((await this.directory()).regions);
  }

  // 행정안전부 원본을 받아 지역 목록을 새로 쓰고, 이전과 바뀐 점을 돌려준다
  async sync(today: string): Promise<RegionSyncResult> {
    const before = (await this.catalog.load())?.regions ?? [];
    const after = await this.source.fetchAll();
    rejectSuspicious(before, after);

    await this.catalog.save({ source: this.source.name, fetchedOn: today, regions: after });
    return { count: after.length, changes: regionChangesBetween(before, after) };
  }
}

function rejectSuspicious(before: { code: string }[], after: { code: string }[]) {
  if (!after.some((region) => region.code === NATIONWIDE_CODE)) throw new RegionSyncRejectedError('받은 지역 목록에 전국이 없습니다');
  if (after.length < before.length * MIN_KEPT_RATIO) {
    throw new RegionSyncRejectedError(`지역이 ${before.length}곳에서 ${after.length}곳으로 너무 많이 줄어 반영하지 않았습니다`);
  }
}
