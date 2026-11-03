import { RegionService } from '../../region.service';

import { FakeRegionSource } from './fake-region-source';
import { InMemoryRegionCatalog } from './in-memory-region-catalog';
import { SAMPLE_REGIONS } from './regions';

import type { Region } from '../../../domain/region';

// 다른 기능의 테스트에서 지역 목록이 필요할 때 쓴다 (전국 > 충북 > 청주시 > 상당구, 전국 > 세종)
export function sampleRegionService(regions: Region[] = SAMPLE_REGIONS) {
  return new RegionService(new InMemoryRegionCatalog({ source: '테스트', fetchedOn: '2026-11-03', regions }), new FakeRegionSource([]));
}
