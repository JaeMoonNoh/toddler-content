import { describe, expect, it } from 'vitest';
import { changedFields, hashPayload } from '../payload-diff';

const IGNORED = ['조회수'];

describe('hashPayload', () => {
  it('키 순서가 달라도 같은 지문', () => {
    expect(hashPayload({ a: 1, b: { c: 2, d: 3 } })).toBe(hashPayload({ b: { d: 3, c: 2 }, a: 1 }));
  });

  it('무시할 필드만 다르면 같은 지문', () => {
    expect(hashPayload({ 서비스명: '아동수당', 조회수: 10 }, IGNORED)).toBe(
      hashPayload({ 서비스명: '아동수당', 조회수: 999 }, IGNORED),
    );
  });

  it('무시할 필드가 아예 없어져도 같은 지문', () => {
    expect(hashPayload({ 서비스명: 'A', 조회수: 10 }, IGNORED)).toBe(hashPayload({ 서비스명: 'A' }, IGNORED));
  });

  it('값이 undefined인 키는 키가 없는 것과 같다', () => {
    expect(hashPayload({ a: 1, b: undefined })).toBe(hashPayload({ a: 1 }));
  });

  it('null과 빈 문자열은 다르게 본다', () => {
    expect(hashPayload({ a: null })).not.toBe(hashPayload({ a: '' }));
  });

  it('배열은 순서가 바뀌면 다르게 본다', () => {
    expect(hashPayload({ a: [1, 2] })).not.toBe(hashPayload({ a: [2, 1] }));
  });

  it('문장 끝 공백 하나도 변경으로 본다 (원문 그대로 비교)', () => {
    expect(hashPayload({ a: '월 10만원' })).not.toBe(hashPayload({ a: '월 10만원 ' }));
  });
});

describe('changedFields', () => {
  it('바뀐 필드만 이름순으로 돌려준다', () => {
    expect(changedFields({ b: 1, a: 1, c: 1 }, { b: 2, a: 2, c: 1 })).toEqual([
      { field: 'a', before: 1, after: 2 },
      { field: 'b', before: 1, after: 2 },
    ]);
  });

  it('무시할 필드는 바뀌어도 돌려주지 않는다', () => {
    expect(changedFields({ 조회수: 1 }, { 조회수: 2 }, IGNORED)).toEqual([]);
  });

  it('중첩 객체는 키 순서만 다르면 바뀌지 않은 것으로 본다', () => {
    expect(changedFields({ a: { x: 1, y: 2 } }, { a: { y: 2, x: 1 } })).toEqual([]);
  });
});
