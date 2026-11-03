import { describe, expect, it } from 'vitest';
import type { PublishedBenefit } from './benefit';
import { NATIONWIDE_CODE, regionLabelOf, RegionTree } from './region';

const NATIONWIDE = { code: NATIONWIDE_CODE, name: '전국', fullName: '전국', parentCode: null };
const CHUNGBUK = { code: '4300000000', name: '충청북도', fullName: '충청북도', parentCode: NATIONWIDE_CODE };
const CHEONGJU = { code: '4311000000', name: '청주시', fullName: '충청북도 청주시', parentCode: CHUNGBUK.code };
const SANGDANG = { code: '4311100000', name: '상당구', fullName: '충청북도 청주시 상당구', parentCode: CHEONGJU.code };
const CHUNGJU = { code: '4313000000', name: '충주시', fullName: '충청북도 충주시', parentCode: CHUNGBUK.code };
const SEOUL = { code: '1100000000', name: '서울특별시', fullName: '서울특별시', parentCode: NATIONWIDE_CODE };
const SEJONG = { code: '3611000000', name: '세종특별자치시', fullName: '세종특별자치시', parentCode: NATIONWIDE_CODE };
const tree = new RegionTree([SEJONG, CHUNGBUK, NATIONWIDE, CHUNGJU, CHEONGJU, SANGDANG, SEOUL]);

const benefit = (name: string, regionCode: string, regionName = ''): PublishedBenefit => ({
  slug: name,
  name,
  regionCode,
  regionName,
  sourceName: '보조금24',
  sourceUrl: 'https://plus.gov.kr',
  verifiedAt: null,
  reviewStatus: 'UNVERIFIED',
  schedule: null,
  conditions: [],
  amount: null,
  applicationPeriod: null,
  howToApply: null,
  audience: null,
});
const all = [
  benefit('하 전국', NATIONWIDE_CODE),
  benefit('가 전국', NATIONWIDE_CODE),
  benefit('충북', CHUNGBUK.code),
  benefit('청주', CHEONGJU.code),
  benefit('서울', SEOUL.code),
];

describe('RegionTree', () => {
  it('첫 칸은 시·도와 세종을 코드 순서로', () => {
    expect(tree.provinces().map((r) => r.name)).toEqual(['서울특별시', '세종특별자치시', '충청북도']);
  });

  it('둘째 칸은 시·군·구만 (일반구는 시 아래라 빠진다)', () => {
    expect(tree.districtsOf(CHUNGBUK.code).map((r) => r.name)).toEqual(['청주시', '충주시']);
  });

  it('세종은 둘째 칸이 없다', () => {
    expect(tree.districtsOf(SEJONG.code)).toEqual([]);
  });

  it('고른 지역부터 전국까지 잇는다', () => {
    expect(tree.choose(CHEONGJU.code).lineage.map((r) => r.name)).toEqual(['청주시', '충청북도', '전국']);
  });

  it('고르지 않았거나 모르는 코드면 전국만', () => {
    expect(tree.choose(null).lineage.map((r) => r.code)).toEqual([NATIONWIDE_CODE]);
    expect(tree.choose('9999999999').lineage.map((r) => r.code)).toEqual([NATIONWIDE_CODE]);
  });

  it('지역 목록이 비어 있어도 전국은 고를 수 있다', () => {
    expect(new RegionTree([]).choose(null).place.code).toBe(NATIONWIDE_CODE);
  });
});

describe('RegionChoice', () => {
  it('고른 지역과 위 지역의 혜택만 받는다', () => {
    const choice = tree.choose(CHEONGJU.code);
    expect(all.filter((b) => choice.covers(b)).map((b) => b.name)).toEqual(['하 전국', '가 전국', '충북', '청주']);
  });

  it('청주는 청주, 충북, 전국 순서로 묶고 묶음 안은 이름순', () => {
    expect(tree.choose(CHEONGJU.code).groupsOf(all).map((g) => [g.label, g.benefits.map((b) => b.name)])).toEqual([
      ['청주시', ['청주']],
      ['충청북도', ['충북']],
      ['전국 공통', ['가 전국', '하 전국']],
    ]);
  });

  it('충북만 고르면 청주 혜택은 빠진다', () => {
    expect(tree.choose(CHUNGBUK.code).groupsOf(all).map((g) => g.label)).toEqual(['충청북도', '전국 공통']);
  });

  it('혜택이 없는 묶음은 빼고, 혜택이 없으면 빈 목록', () => {
    expect(tree.choose(CHEONGJU.code).groupsOf([benefit('전국', NATIONWIDE_CODE)]).map((g) => g.label)).toEqual(['전국 공통']);
    expect(tree.choose(CHEONGJU.code).groupsOf([])).toEqual([]);
  });

  it('고른 지역 자체 혜택이 없으면 아직 정리하지 않은 지역이다', () => {
    expect(tree.choose(CHUNGJU.code).isPrepared(all)).toBe(false);
    expect(tree.choose(CHUNGJU.code).upperLabels()).toEqual(['충청북도', '전국 공통']);
    expect(tree.choose(CHEONGJU.code).isPrepared(all)).toBe(true);
  });

  it('전국만 고른 상태는 언제나 정리된 상태다', () => {
    expect(tree.choose(null).isPrepared([])).toBe(true);
  });
});

describe('regionLabelOf', () => {
  it('전국은 "전국 공통", 나머지는 지역 이름', () => {
    expect(regionLabelOf(benefit('a', NATIONWIDE_CODE, '전국'))).toBe('전국 공통');
    expect(regionLabelOf(benefit('b', CHEONGJU.code, '청주시'))).toBe('청주시');
  });
});
