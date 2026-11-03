import { describe, expect, it } from 'vitest';
import { splitByAudience } from './audience';
import type { Audience, PublishedBenefit } from './benefit';

const benefit = (name: string, audience: Audience | null): PublishedBenefit => ({
  slug: name,
  name,
  regionCode: '0000000000',
  regionName: '전국',
  sourceName: '보조금24',
  sourceUrl: 'https://plus.gov.kr',
  verifiedAt: null,
  reviewStatus: 'UNVERIFIED',
  schedule: null,
  conditions: [],
  amount: null,
  applicationPeriod: null,
  howToApply: null,
  audience,
});

describe('splitByAudience', () => {
  it('누구나 받는 혜택과 대상별 묶음을 나누고, 묶음은 정해진 순서와 이름순으로', () => {
    const split = splitByAudience([
      benefit('아동수당', null),
      benefit('하 입양', 'ADOPTION_FOSTER'),
      benefit('가 입양', 'ADOPTION_FOSTER'),
      benefit('난임 시술비', 'INFERTILITY'),
    ]);
    expect(split.forEveryone.map((b) => b.name)).toEqual(['아동수당']);
    expect(split.groups.map((g) => [g.label, g.benefits.map((b) => b.name)])).toEqual([
      ['난임·임신 준비', ['난임 시술비']],
      ['입양·가정위탁', ['가 입양', '하 입양']],
    ]);
  });

  it('특정 대상 혜택이 없으면 묶음도 없다', () => {
    expect(splitByAudience([benefit('아동수당', null)]).groups).toEqual([]);
  });

  it('혜택이 없으면 둘 다 비어 있다', () => {
    expect(splitByAudience([])).toEqual({ forEveryone: [], groups: [] });
  });
});
