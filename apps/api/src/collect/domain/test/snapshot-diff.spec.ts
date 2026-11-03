import { describe, expect, it } from 'vitest';
import { changedFields, diffSnapshot, hashPayload } from '../snapshot-diff';
import type { SourceRecord, StoredItem } from '../source-record';

const IGNORED = ['조회수'];

const record = (id: string, payload: Record<string, unknown>): SourceRecord => ({
  externalId: id,
  name: String(payload['서비스명'] ?? id),
  payload,
});

const stored = (id: string, payload: Record<string, unknown>, removed = false): StoredItem => ({
  externalId: id,
  name: String(payload['서비스명'] ?? id),
  hash: hashPayload(payload, IGNORED),
  payload,
  removed,
});

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

describe('diffSnapshot', () => {
  it('추가, 변경, 삭제, 그대로를 구분한다', () => {
    const previous = [
      stored('1', { 서비스명: '아동수당', 지원내용: '월 10만원', 조회수: 1 }),
      stored('2', { 서비스명: '부모급여', 지원내용: '월 100만원' }),
      stored('3', { 서비스명: '첫만남이용권' }),
    ];
    const current = [
      record('1', { 서비스명: '아동수당', 지원내용: '월 10만원', 조회수: 500 }),
      record('2', { 서비스명: '부모급여', 지원내용: '월 110만원' }),
      record('4', { 서비스명: '산후조리비' }),
    ];

    const diff = diffSnapshot(previous, current, IGNORED);

    expect(diff.unchanged.map((r) => r.externalId)).toEqual(['1']);
    expect(diff.updated[0].changedFields).toEqual([{ field: '지원내용', before: '월 100만원', after: '월 110만원' }]);
    expect(diff.added.map((r) => r.externalId)).toEqual(['4']);
    expect(diff.removed.map((r) => r.externalId)).toEqual(['3']);
  });

  it('이전도 지금도 비어 있으면 아무 변화가 없다', () => {
    expect(diffSnapshot([], [], IGNORED)).toEqual({ added: [], updated: [], removed: [], unchanged: [], duplicateIds: [] });
  });

  it('지금 목록이 비면 이전 항목이 전부 삭제로 잡힌다 (막는 건 비즈니스 정책의 몫)', () => {
    const diff = diffSnapshot([stored('1', { 서비스명: 'A' }), stored('2', { 서비스명: 'B' })], [], IGNORED);
    expect(diff.removed).toHaveLength(2);
  });

  it('사라졌다가 다시 나타난 항목은 추가로 본다', () => {
    const diff = diffSnapshot([stored('1', { 서비스명: 'A' }, true)], [record('1', { 서비스명: 'A' })], IGNORED);
    expect(diff.added.map((r) => r.externalId)).toEqual(['1']);
    expect(diff.removed).toHaveLength(0);
  });

  it('이미 사라진 항목은 다시 삭제로 잡지 않는다', () => {
    expect(diffSnapshot([stored('1', { 서비스명: 'A' }, true)], [], IGNORED).removed).toHaveLength(0);
  });

  it('새로 생긴 필드와 없어진 필드도 변경으로 잡는다', () => {
    const diff = diffSnapshot(
      [stored('1', { 서비스명: 'A', 신청기한: '상시' })],
      [record('1', { 서비스명: 'A', 지원대상: '임산부' })],
      IGNORED,
    );
    expect(diff.updated[0].changedFields).toEqual([
      { field: '신청기한', before: '상시', after: null },
      { field: '지원대상', before: null, after: '임산부' },
    ]);
  });

  it('같은 ID가 세 번 오면 첫 번째만 쓰고 나머지 두 번을 기록한다', () => {
    const diff = diffSnapshot(
      [],
      [record('1', { 서비스명: 'A' }), record('1', { 서비스명: 'B' }), record('1', { 서비스명: 'C' })],
      IGNORED,
    );
    expect(diff.added).toHaveLength(1);
    expect(diff.added[0].payload['서비스명']).toBe('A');
    expect(diff.duplicateIds).toEqual(['1', '1']);
  });

  it('중복된 ID는 삭제로도 잡히지 않는다', () => {
    const diff = diffSnapshot([stored('1', { 서비스명: 'A' })], [record('1', { 서비스명: 'A' }), record('1', { 서비스명: 'A' })], IGNORED);
    expect(diff.removed).toHaveLength(0);
    expect(diff.unchanged).toHaveLength(1);
  });
});
