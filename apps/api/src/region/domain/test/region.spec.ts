import { describe, expect, it } from 'vitest';

import { CHEONGJU, CHUNGBUK, NATIONWIDE, SAMPLE_REGIONS, SANGDANG, SEJONG } from '../../application/test/fakes/regions';
import { hasRegionChanges, regionChangesBetween, RegionTree, UnknownRegionError } from '../region';

const tree = new RegionTree(SAMPLE_REGIONS);

describe('RegionTree', () => {
  it('가까운 지역부터 전국까지 잇는다', () => {
    expect(tree.lineageOf(CHEONGJU.code).map((r) => r.name)).toEqual(['청주시', '충청북도', '전국']);
  });

  it('일반구는 시 아래에 있다', () => {
    expect(tree.lineageOf(SANGDANG.code).map((r) => r.name)).toEqual(['상당구', '청주시', '충청북도', '전국']);
  });

  it('세종처럼 시·도가 없는 지역은 바로 전국 아래에 있다', () => {
    expect(tree.lineageOf(SEJONG.code).map((r) => r.name)).toEqual(['세종특별자치시', '전국']);
  });

  it('전국은 전국 하나뿐이다', () => {
    expect(tree.lineageOf(NATIONWIDE.code)).toEqual([NATIONWIDE]);
  });

  it('바로 아래 지역만 돌려준다', () => {
    expect(tree.childrenOf(NATIONWIDE.code).map((r) => r.name)).toEqual(['충청북도', '세종특별자치시']);
    expect(tree.childrenOf(CHUNGBUK.code)).toEqual([CHEONGJU]);
    expect(tree.childrenOf(SEJONG.code)).toEqual([]);
  });

  it('없는 지역 코드는 거절한다', () => {
    expect(tree.has('9999999999')).toBe(false);
    expect(() => tree.lineageOf('9999999999')).toThrow(UnknownRegionError);
  });

  it('위 지역이 목록에 없으면 거절한다', () => {
    const broken = new RegionTree([{ ...CHEONGJU, parentCode: '4400000000' }]);
    expect(() => broken.lineageOf(CHEONGJU.code)).toThrow('4400000000');
  });
});

describe('RegionTree 찾기', () => {
  it('그 지역과 아래 지역을 모두 돌려준다', () => {
    expect(tree.selfAndDescendantsOf(CHUNGBUK.code).map((r) => r.name)).toEqual(['충청북도', '청주시', '상당구']);
    expect(tree.selfAndDescendantsOf(SEJONG.code)).toEqual([SEJONG]);
  });

  it('전체 이름으로 지역을 찾고, 띄어쓰기 차이는 무시한다', () => {
    expect(tree.findByFullName('충청북도 청주시')).toEqual(CHEONGJU);
    expect(tree.findByFullName(' 충청북도  청주시 ')).toEqual(CHEONGJU);
    expect(tree.findByFullName('충청북도')).toEqual(CHUNGBUK);
  });

  it('없는 이름이면 null', () => {
    expect(tree.findByFullName('충청북도 없는시')).toBeNull();
    expect(tree.findByFullName('')).toBeNull();
  });
});

describe('regionChangesBetween', () => {
  it('바뀐 게 없으면 비어 있다', () => {
    const changes = regionChangesBetween(SAMPLE_REGIONS, SAMPLE_REGIONS);
    expect(hasRegionChanges(changes)).toBe(false);
  });

  it('생긴 지역, 사라진 지역, 이름이나 위 지역이 바뀐 지역을 나눈다', () => {
    const merged = { code: '1200000000', name: '전남광주통합특별시', fullName: '전남광주통합특별시', parentCode: NATIONWIDE.code };
    const renamed = { ...CHEONGJU, fullName: '충청북도 새청주시', name: '새청주시' };
    const changes = regionChangesBetween([NATIONWIDE, CHUNGBUK, CHEONGJU, SEJONG], [NATIONWIDE, CHUNGBUK, renamed, merged]);

    expect(changes.added).toEqual([merged]);
    expect(changes.removed).toEqual([SEJONG]);
    expect(changes.renamed).toEqual([{ before: CHEONGJU, after: renamed }]);
  });

  it('처음 받으면 모두 생긴 지역이다', () => {
    expect(regionChangesBetween([], SAMPLE_REGIONS).added).toHaveLength(SAMPLE_REGIONS.length);
  });
});
