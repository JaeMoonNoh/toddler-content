import { describe, expect, it } from 'vitest';
import type { BenefitScope, PublishedBenefit } from './benefit';
import { groupForRegion, REGIONS } from './region';

const benefit = (name: string, scope: BenefitScope): PublishedBenefit => ({
  slug: name,
  name,
  scope,
  sourceName: '보조금24',
  sourceUrl: 'https://plus.gov.kr',
  verifiedAt: null,
  reviewStatus: 'UNVERIFIED',
  schedule: null,
  conditions: [],
});
const region = (id: string) => REGIONS.find((r) => r.id === id)!;
const all = [benefit('하 전국', 'national'), benefit('가 전국', 'national'), benefit('충북', 'chungbuk'), benefit('청주', 'cheongju')];

describe('groupForRegion', () => {
  it('청주는 청주, 충북, 전국 순서로 묶고 묶음 안은 이름순', () => {
    expect(groupForRegion(region('cheongju'), all).map((g) => [g.label, g.benefits.map((b) => b.name)])).toEqual([
      ['청주시', ['청주']],
      ['충청북도', ['충북']],
      ['전국 공통', ['가 전국', '하 전국']],
    ]);
  });

  it('청주 외 충북은 청주 혜택을 빼고 보여준다', () => {
    expect(groupForRegion(region('chungbuk'), all).map((g) => g.scope)).toEqual(['chungbuk', 'national']);
  });

  it('다른 지역은 전국 공통만', () => {
    expect(groupForRegion(region('other'), all).map((g) => g.scope)).toEqual(['national']);
  });

  it('혜택이 없는 묶음은 빼고, 혜택이 없으면 빈 목록', () => {
    expect(groupForRegion(region('cheongju'), [benefit('전국', 'national')]).map((g) => g.scope)).toEqual(['national']);
    expect(groupForRegion(region('cheongju'), [])).toEqual([]);
  });
});
