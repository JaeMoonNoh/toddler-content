import type { Region } from '../../domain/region';

// 행정구역 원본 (행정안전부 행정표준코드)
export abstract class RegionSource {
  abstract readonly name: string;
  abstract fetchAll(): Promise<Region[]>;
}
