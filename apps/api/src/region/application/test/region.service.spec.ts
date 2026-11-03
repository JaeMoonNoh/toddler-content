import { describe, expect, it } from 'vitest';

import { RegionService, RegionSyncRejectedError } from '../region.service';

import { FakeRegionSource } from './fakes/fake-region-source';
import { InMemoryRegionCatalog } from './fakes/in-memory-region-catalog';
import { CHEONGJU, CHUNGBUK, NATIONWIDE, SAMPLE_REGIONS, SEJONG } from './fakes/regions';

const directory = (regions = SAMPLE_REGIONS) => ({ source: '이전 원본', fetchedOn: '2026-10-01', regions });

describe('RegionService.sync', () => {
  it('처음 받으면 목록을 저장하고 모두 생긴 지역으로 알린다', async () => {
    const catalog = new InMemoryRegionCatalog();
    const result = await new RegionService(catalog, new FakeRegionSource(SAMPLE_REGIONS)).sync('2026-11-03');

    expect(catalog.directory).toEqual({ source: '가짜 원본', fetchedOn: '2026-11-03', regions: SAMPLE_REGIONS });
    expect(result.count).toBe(SAMPLE_REGIONS.length);
    expect(result.changes.added).toHaveLength(SAMPLE_REGIONS.length);
  });

  it('바뀐 게 없어도 받은 날은 새로 쓴다', async () => {
    const catalog = new InMemoryRegionCatalog(directory());
    const result = await new RegionService(catalog, new FakeRegionSource(SAMPLE_REGIONS)).sync('2026-11-03');

    expect(catalog.directory?.fetchedOn).toBe('2026-11-03');
    expect(result.changes).toEqual({ added: [], removed: [], renamed: [] });
  });

  it('원본을 못 받으면 이전 목록을 그대로 둔다', async () => {
    const catalog = new InMemoryRegionCatalog(directory());
    await expect(new RegionService(catalog, new FakeRegionSource(new Error('시간 초과'))).sync('2026-11-03')).rejects.toThrow('시간 초과');
    expect(catalog.directory).toEqual(directory());
  });

  it('전국이 없으면 반영하지 않는다', async () => {
    const catalog = new InMemoryRegionCatalog();
    await expect(new RegionService(catalog, new FakeRegionSource([CHUNGBUK, CHEONGJU])).sync('2026-11-03')).rejects.toThrow(
      RegionSyncRejectedError,
    );
    expect(catalog.directory).toBeNull();
  });

  it('빈 목록이 오면 반영하지 않는다', async () => {
    const catalog = new InMemoryRegionCatalog(directory());
    await expect(new RegionService(catalog, new FakeRegionSource([])).sync('2026-11-03')).rejects.toThrow('전국이 없습니다');
    expect(catalog.directory).toEqual(directory());
  });

  it('이전보다 10% 넘게 줄면 반영하지 않는다 (딱 90%는 받아들인다)', async () => {
    const many = Array.from({ length: 10 }, (_, i) => ({ ...CHEONGJU, code: `43${String(i).padStart(8, '0')}` }));
    const catalog = new InMemoryRegionCatalog(directory([NATIONWIDE, ...many]));

    await expect(new RegionService(catalog, new FakeRegionSource([NATIONWIDE, ...many.slice(0, 8)])).sync('2026-11-03')).rejects.toThrow(
      '너무 많이 줄어',
    );
    await expect(
      new RegionService(catalog, new FakeRegionSource([NATIONWIDE, ...many.slice(0, 9)])).sync('2026-11-03'),
    ).resolves.toMatchObject({
      count: 10,
    });
  });
});

describe('RegionService.directory / tree', () => {
  it('저장된 목록으로 트리를 만든다', async () => {
    const tree = await new RegionService(new InMemoryRegionCatalog(directory()), new FakeRegionSource([])).tree();
    expect(tree.lineageOf(SEJONG.code).map((r) => r.code)).toEqual([SEJONG.code, NATIONWIDE.code]);
  });

  it('한 번도 받지 않았으면 받으라고 알려준다', async () => {
    await expect(new RegionService(new InMemoryRegionCatalog(), new FakeRegionSource([])).directory()).rejects.toThrow('pnpm region sync');
  });
});
