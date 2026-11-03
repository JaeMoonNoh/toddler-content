import type { PublishedBenefit } from './benefit';

export const NATIONWIDE_CODE = '0000000000';

// GET /regions 응답. 행정안전부 행정표준코드(법정동코드)의 시·도, 시·군·구
export interface Region {
  code: string;
  name: string; // 청주시
  fullName: string; // 충청북도 청주시
  parentCode: string | null;
}

export interface RegionDirectory {
  source: string;
  fetchedOn: string;
  regions: Region[];
}

export interface BenefitGroup {
  code: string;
  label: string;
  benefits: PublishedBenefit[];
}

export class RegionTree {
  private readonly byCode: Map<string, Region>;

  constructor(regions: Region[]) {
    this.byCode = new Map(regions.map((region) => [region.code, region]));
  }

  // 사는 곳 첫 칸: 시·도 (세종처럼 시·도가 따로 없는 곳 포함)
  provinces(): Region[] {
    return this.childrenOf(NATIONWIDE_CODE);
  }

  // 둘째 칸: 시·군·구. 일반구(청주시 상당구 등)는 시 아래에 있어서 나오지 않는다
  districtsOf(code: string): Region[] {
    return this.childrenOf(code);
  }

  // 고르지 않았거나 모르는 코드면 전국만
  choose(code: string | null): RegionChoice {
    const lineage: Region[] = [];
    for (let region = code ? this.byCode.get(code) : undefined; region; region = this.byCode.get(region.parentCode ?? '')) {
      lineage.push(region);
    }
    const nationwide = this.byCode.get(NATIONWIDE_CODE) ?? { code: NATIONWIDE_CODE, name: '전국', fullName: '전국', parentCode: null };
    return new RegionChoice(lineage.length ? lineage : [nationwide]);
  }

  private childrenOf(code: string): Region[] {
    return [...this.byCode.values()].filter((region) => region.parentCode === code).sort((a, b) => a.code.localeCompare(b.code));
  }
}

// 사는 곳으로 고른 지역과 그 위 지역 (가까운 곳부터 전국까지). 그 지역 사람은 이 지역들의 혜택을 모두 받는다
export class RegionChoice {
  constructor(readonly lineage: Region[]) {}

  get place(): Region {
    return this.lineage[0];
  }

  covers(benefit: PublishedBenefit): boolean {
    return this.lineage.some((region) => region.code === benefit.regionCode);
  }

  // 고른 지역 자체의 혜택이 하나도 없으면 아직 정리하지 않은 지역이다
  isPrepared(benefits: PublishedBenefit[]): boolean {
    return this.place.code === NATIONWIDE_CODE || benefits.some((benefit) => benefit.regionCode === this.place.code);
  }

  // 가까운 지역부터 묶고 묶음 안은 이름순. 빈 묶음은 뺀다
  groupsOf(benefits: PublishedBenefit[]): BenefitGroup[] {
    return this.lineage
      .map((region) => ({
        code: region.code,
        label: labelOf(region),
        benefits: benefits.filter((b) => b.regionCode === region.code).sort((a, b) => a.name.localeCompare(b.name, 'ko')),
      }))
      .filter((group) => group.benefits.length > 0);
  }

  upperLabels(): string[] {
    return this.lineage.slice(1).map(labelOf);
  }
}

function labelOf(region: Region) {
  return region.code === NATIONWIDE_CODE ? '전국 공통' : region.name;
}

export function regionLabelOf(benefit: PublishedBenefit) {
  return benefit.regionCode === NATIONWIDE_CODE ? '전국 공통' : benefit.regionName;
}
