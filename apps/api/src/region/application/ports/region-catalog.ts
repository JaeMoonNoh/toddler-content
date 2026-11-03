import type { RegionDirectory } from '../../domain/region';

// 사이트가 쓰는 지역 목록 (git에 커밋해서 바뀐 점을 사람이 본다)
export abstract class RegionCatalog {
  abstract load(): Promise<RegionDirectory | null>; // 한 번도 받지 않았으면 null
  abstract save(directory: RegionDirectory): Promise<void>;
}
