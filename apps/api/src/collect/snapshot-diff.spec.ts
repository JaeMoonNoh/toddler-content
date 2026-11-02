import { describe, expect, it } from 'vitest';
import { assertNotShrunk, diffSnapshot, hashPayload, type SourceRecord, type StoredItem } from './snapshot-diff';

const IGNORED = ['조회수'];

const record = (id: string, payload: Record<string, unknown>): SourceRecord => ({
  externalId: id,
  name: String(payload['서비스명'] ?? id),
  payload,
});

const stored = (id: string, payload: Record<string, unknown>, removed = false): StoredItem => ({
  externalId: id,
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
});

describe('diffSnapshot', () => {
  it('추가, 변경, 삭제, 그대로를 구분한다', () => {
    const previous = [
      stored('1', { 서비스명: '아동수당', 지원내용: '월 10만원', 조회수: 1 }),
      stored('2', { 서비스명: '부모급여', 지원내용: '월 100만원' }),
      stored('3', { 서비스명: '첫만남이용권' }),
    ];
    const current = [
      record('1', { 서비스명: '아동수당', 지원내용: '월 10만원', 조회수: 500 }), // 조회수만 바뀜 → 그대로
      record('2', { 서비스명: '부모급여', 지원내용: '월 110만원' }), // 내용 변경
      record('4', { 서비스명: '산후조리비' }), // 새 항목
    ];

    const diff = diffSnapshot(previous, current, IGNORED);

    expect(diff.unchanged.map((r) => r.externalId)).toEqual(['1']);
    expect(diff.updated).toHaveLength(1);
    expect(diff.updated[0].changedFields).toEqual([
      { field: '지원내용', before: '월 100만원', after: '월 110만원' },
    ]);
    expect(diff.added.map((r) => r.externalId)).toEqual(['4']);
    expect(diff.removed.map((r) => r.externalId)).toEqual(['3']);
  });

  it('사라졌다가 다시 나타난 항목은 추가로 본다', () => {
    const diff = diffSnapshot([stored('1', { 서비스명: 'A' }, true)], [record('1', { 서비스명: 'A' })], IGNORED);
    expect(diff.added.map((r) => r.externalId)).toEqual(['1']);
    expect(diff.removed).toHaveLength(0);
  });

  it('이미 사라진 항목은 다시 삭제로 잡지 않는다', () => {
    const diff = diffSnapshot([stored('1', { 서비스명: 'A' }, true)], [], IGNORED);
    expect(diff.removed).toHaveLength(0);
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

  it('같은 ID가 두 번 오면 첫 번째만 쓰고 기록한다', () => {
    const diff = diffSnapshot([], [record('1', { 서비스명: 'A' }), record('1', { 서비스명: 'B' })], IGNORED);
    expect(diff.added).toHaveLength(1);
    expect(diff.added[0].payload['서비스명']).toBe('A');
    expect(diff.duplicateIds).toEqual(['1']);
  });
});

describe('assertNotShrunk', () => {
  it('이전보다 10% 넘게 줄면 중단', () => {
    expect(() => assertNotShrunk(1000, 899)).toThrow();
    expect(() => assertNotShrunk(1000, 900)).not.toThrow();
  });

  it('처음 수집할 때는 검사하지 않는다', () => {
    expect(() => assertNotShrunk(0, 0)).not.toThrow();
  });
});
