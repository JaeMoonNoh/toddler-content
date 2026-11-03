// 행정구역. 행정안전부 행정표준코드(법정동코드)의 시·도, 시·군·구 단위만 쓴다
export const NATIONWIDE_CODE = '0000000000';

export interface Region {
  code: string; // 법정동코드 10자리 (예: 청주시 4311000000)
  name: string; // 가장 아래 이름 (예: 청주시)
  fullName: string; // 전체 이름 (예: 충청북도 청주시)
  parentCode: string | null; // 전국만 null
}

export interface RegionDirectory {
  source: string; // 어디서 받았는지 (화면에 출처로 보여준다)
  fetchedOn: string; // 받은 날 YYYY-MM-DD
  regions: Region[];
}

export class UnknownRegionError extends Error {}

// 지역을 위아래로 잇는다. 어떤 지역에 사는 사람은 그 지역과 위 지역(시·도, 전국)의 혜택을 모두 받는다
export class RegionTree {
  private readonly byCode: Map<string, Region>;

  constructor(regions: Region[]) {
    this.byCode = new Map(regions.map((region) => [region.code, region]));
  }

  has(code: string) {
    return this.byCode.has(code);
  }

  get(code: string): Region {
    const region = this.byCode.get(code);
    if (!region) throw new UnknownRegionError(`없는 지역 코드입니다: ${code}`);
    return region;
  }

  // 가까운 지역부터 전국까지
  lineageOf(code: string): Region[] {
    const lineage: Region[] = [];
    for (let region: Region | null = this.get(code); region; region = region.parentCode ? this.get(region.parentCode) : null) {
      lineage.push(region);
    }
    return lineage;
  }

  childrenOf(code: string): Region[] {
    return [...this.byCode.values()].filter((region) => region.parentCode === code);
  }
}

export interface RegionChanges {
  added: Region[];
  removed: Region[];
  renamed: { before: Region; after: Region }[];
}

// 행정구역 개편(통합, 이름 변경)을 사람이 확인할 수 있게 바뀐 지역만 고른다
export function regionChangesBetween(before: Region[], after: Region[]): RegionChanges {
  const old = new Map(before.map((region) => [region.code, region]));
  const now = new Map(after.map((region) => [region.code, region]));
  return {
    added: after.filter((region) => !old.has(region.code)),
    removed: before.filter((region) => !now.has(region.code)),
    renamed: after.flatMap((region) => {
      const previous = old.get(region.code);
      return previous && (previous.fullName !== region.fullName || previous.parentCode !== region.parentCode)
        ? [{ before: previous, after: region }]
        : [];
    }),
  };
}

export function hasRegionChanges({ added, removed, renamed }: RegionChanges) {
  return added.length + removed.length + renamed.length > 0;
}
