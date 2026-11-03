import { describe, expect, it } from 'vitest';

import { ComparisonRule } from '../../../shared/domain/comparison-rule';
import { diffSnapshot } from '../snapshot-diff';

import type { SourceRecord, StoredItem } from '../source-record';

const rule = ComparisonRule.of('GOV24');

const record = (id: string, payload: Record<string, unknown>): SourceRecord => ({
  externalId: id,
  name: (payload['서비스명'] as string | undefined) ?? id,
  payload,
});

const stored = (id: string, payload: Record<string, unknown>, removed = false): StoredItem => ({
  externalId: id,
  name: (payload['서비스명'] as string | undefined) ?? id,
  payload,
  removed,
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

    const diff = diffSnapshot(previous, current, rule);

    expect(diff.unchanged.map((r) => r.externalId)).toEqual(['1']);
    expect(diff.updated[0].changedFields).toEqual([{ field: '지원내용', before: '월 100만원', after: '월 110만원' }]);
    expect(diff.added.map((r) => r.externalId)).toEqual(['4']);
    expect(diff.removed.map((r) => r.externalId)).toEqual(['3']);
  });

  it('이전도 지금도 비어 있으면 아무 변화가 없다', () => {
    expect(diffSnapshot([], [], rule)).toEqual({ added: [], updated: [], removed: [], unchanged: [], duplicateIds: [] });
  });

  it('지금 목록이 비면 이전 항목이 전부 삭제로 잡힌다 (막는 건 비즈니스 정책의 몫)', () => {
    const diff = diffSnapshot([stored('1', { 서비스명: 'A' }), stored('2', { 서비스명: 'B' })], [], rule);
    expect(diff.removed).toHaveLength(2);
  });

  it('사라졌다가 다시 나타난 항목은 추가로 본다', () => {
    const diff = diffSnapshot([stored('1', { 서비스명: 'A' }, true)], [record('1', { 서비스명: 'A' })], rule);
    expect(diff.added.map((r) => r.externalId)).toEqual(['1']);
    expect(diff.removed).toHaveLength(0);
  });

  it('이미 사라진 항목은 다시 삭제로 잡지 않는다', () => {
    expect(diffSnapshot([stored('1', { 서비스명: 'A' }, true)], [], rule).removed).toHaveLength(0);
  });

  it('새로 생긴 필드와 없어진 필드도 변경으로 잡는다', () => {
    const diff = diffSnapshot(
      [stored('1', { 서비스명: 'A', 신청기한: '상시' })],
      [record('1', { 서비스명: 'A', 지원대상: '임산부' })],
      rule,
    );
    expect(diff.updated[0].changedFields).toEqual([
      { field: '신청기한', before: '상시', after: null },
      { field: '지원대상', before: null, after: '임산부' },
    ]);
  });

  it('같은 ID가 세 번 오면 첫 번째만 쓰고 나머지 두 번을 기록한다', () => {
    const diff = diffSnapshot([], [record('1', { 서비스명: 'A' }), record('1', { 서비스명: 'B' }), record('1', { 서비스명: 'C' })], rule);
    expect(diff.added).toHaveLength(1);
    expect(diff.added[0].payload['서비스명']).toBe('A');
    expect(diff.duplicateIds).toEqual(['1', '1']);
  });

  it('중복된 ID는 삭제로도 잡히지 않는다', () => {
    const diff = diffSnapshot([stored('1', { 서비스명: 'A' })], [record('1', { 서비스명: 'A' }), record('1', { 서비스명: 'A' })], rule);
    expect(diff.removed).toHaveLength(0);
    expect(diff.unchanged).toHaveLength(1);
  });

  it('이전 항목이 옛 순서로 저장돼 있어도 순서만 다르면 그대로로 본다', () => {
    const local = ComparisonRule.of('BOKJIRO_LOCAL');
    const diff = diffSnapshot([stored('1', { lifeNmArray: '청년, 노년' })], [record('1', { lifeNmArray: '노년, 청년' })], local);

    expect(diff.unchanged).toHaveLength(1);
    expect(diff.updated).toHaveLength(0);
  });

  it('순서 변경과 실제 변경이 함께 있으면 실제 바뀐 필드만 알려준다', () => {
    const local = ComparisonRule.of('BOKJIRO_LOCAL');
    const diff = diffSnapshot(
      [stored('1', { lifeNmArray: '청년, 노년', servNm: 'A' })],
      [record('1', { lifeNmArray: '노년, 청년', servNm: 'B' })],
      local,
    );

    expect(diff.updated[0].changedFields).toEqual([{ field: 'servNm', before: 'A', after: 'B' }]);
  });
});
