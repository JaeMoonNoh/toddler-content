import { describe, expect, it } from 'vitest';

import { wordDiffExcerpt } from '../cli/word-diff';

describe('wordDiffExcerpt', () => {
  it('숫자만 바뀌면 숫자만 바뀐 것으로 보여준다', () => {
    expect(wordDiffExcerpt('최대 30만원 지원', '최대 50만원 지원')).toBe('최대 [-30-]{+50+}만원 지원');
  });

  it('말이 더해지기만 하면 더한 말만 표시한다', () => {
    expect(wordDiffExcerpt('관내 거주 임산부', '관내 1년 이상 거주 임산부')).toBe('관내 {+1년 이상 +}거주 임산부');
  });

  it('말이 지워지기만 하면 지운 말만 표시한다', () => {
    expect(wordDiffExcerpt('관내 1년 이상 거주 임산부', '관내 거주 임산부')).toBe('관내 [-1년 이상 -]거주 임산부');
  });

  it('떨어진 곳 두 군데가 바뀌면 사이의 긴 부분을 줄이고, 앞뒤도 40자만 남긴다', () => {
    const middle = '가'.repeat(100);
    const head = '앞'.repeat(60);
    const tail = '뒤'.repeat(60);
    const excerpt = wordDiffExcerpt(`${head} 30만원 ${middle} 60일 ${tail}`, `${head} 50만원 ${middle} 90일 ${tail}`)!;

    expect(excerpt).toContain('[-30-]{+50+}만원');
    expect(excerpt).toContain('[-60-]{+90+}일');
    expect(excerpt).toContain(' … ');
    expect(excerpt.startsWith('…')).toBe(true);
    expect(excerpt.endsWith('…')).toBe(true);
    expect(excerpt.length).toBeLessThan(250);
  });

  it('사이가 짧으면 줄이지 않는다', () => {
    expect(wordDiffExcerpt('첫째 30만원, 둘째 50만원', '첫째 40만원, 둘째 60만원')).toBe('첫째 [-30-]{+40+}만원, 둘째 [-50-]{+60+}만원');
  });

  it('같은 글이면 보여줄 것이 없다', () => {
    expect(wordDiffExcerpt('최대 30만원', '최대 30만원')).toBeNull();
  });

  it('띄어쓰기·줄바꿈만 다르면 보여줄 것이 없다', () => {
    expect(wordDiffExcerpt('최대\r\n30만원  지원', ' 최대 30만원 지원')).toBeNull();
  });

  it('없던 필드가 생기면 전체가 더한 말이다', () => {
    expect(wordDiffExcerpt(null, '출생일로부터 60일 이내')).toBe('{+출생일로부터 60일 이내+}');
  });

  it('있던 필드가 사라지면 전체가 지운 말이다', () => {
    expect(wordDiffExcerpt('출생일로부터 60일 이내', undefined)).toBe('[-출생일로부터 60일 이내-]');
  });

  it('아주 긴 글이 통째로 생기면 앞부분만 남기고 전체 길이를 적는다', () => {
    const excerpt = wordDiffExcerpt(null, '가'.repeat(5000))!;
    expect(excerpt).toBe(`{+${'가'.repeat(200)}…(5000자)+}`);
  });

  it('글이 아닌 값(목록)은 JSON으로 바꿔 비교한다', () => {
    expect(wordDiffExcerpt([{ tel: '129' }], [{ tel: '120' }])).toBe('[{"tel":"[-129-]{+120+}"}]');
  });
});
