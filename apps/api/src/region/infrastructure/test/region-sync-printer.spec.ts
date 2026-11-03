import { describe, expect, it } from 'vitest';

import { CHEONGJU, SEJONG } from '../../application/test/fakes/regions';
import { printRegionSync } from '../cli/region-sync-printer';

describe('printRegionSync', () => {
  it('바뀐 곳이 없으면 한 줄로 쓴다', () => {
    expect(printRegionSync({ count: 285, changes: { added: [], removed: [], renamed: [] } })).toBe('지역 목록 반영: 285곳, 바뀐 곳 없음');
  });

  it('생긴 곳, 사라진 곳, 바뀐 곳을 이름과 코드로 쓰고 혜택 확인을 알린다', () => {
    const renamed = { ...CHEONGJU, fullName: '충청북도 새청주시' };
    const text = printRegionSync({
      count: 285,
      changes: { added: [SEJONG], removed: [CHEONGJU], renamed: [{ before: CHEONGJU, after: renamed }] },
    });

    expect(text.split('\n')).toEqual([
      '지역 목록 반영: 285곳, 생김 1 · 사라짐 1 · 바뀜 1',
      '    생김    세종특별자치시 (3611000000)',
      '    사라짐  충청북도 청주시 (4311000000)',
      '    바뀜    충청북도 청주시 (4311000000) → 충청북도 새청주시',
      '행정구역이 바뀌었다면 그 지역 혜택의 지역 코드도 확인해 주세요.',
    ]);
  });
});
