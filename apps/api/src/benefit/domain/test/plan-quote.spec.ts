import { describe, expect, it } from 'vitest';

import { missingQuotes } from '../plan-quote';

const source = '지원내용: 출생아 1인당 100만원 지급\n신청기한: 출생일로부터 1년 이내 · 방문 신청';

describe('missingQuotes', () => {
  it('원문을 그대로 옮긴 조각은 통과한다 (띄어쓰기·가운뎃점·줄바꿈은 무시)', () => {
    expect(missingQuotes('출생아 1인당 100만원  지급 / 출생일로부터 1년 이내 방문 신청', source)).toEqual([]);
  });

  it('앞에 붙인 짧은 이름표는 원문에 없어도 된다', () => {
    expect(missingQuotes('금액: 출생아 1인당 100만원 지급', source)).toEqual([]);
  });

  it('원문에 없는 조각만 돌려준다', () => {
    expect(missingQuotes('출생아 1인당 100만원 지급 / 출생일로부터 6개월 이내', source)).toEqual(['출생일로부터 6개월 이내']);
  });

  it('원문이 비어 있으면 모든 조각이 없다', () => {
    expect(missingQuotes('100만원', '')).toEqual(['100만원']);
  });
});
