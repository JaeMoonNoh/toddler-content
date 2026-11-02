import { beforeEach, describe, expect, it } from 'vitest';
import type { SourceRecord } from '../domain/source-record';
import { ApplySnapshotUseCase } from './apply-snapshot.use-case';
import { CollectionRejectedError } from './collection-policy';
import { InMemorySnapshotRepository } from './in-memory-snapshot.repository.fake';

const IGNORED = ['조회수'];
const rec = (id: string, extra: Record<string, unknown> = {}): SourceRecord => ({
  externalId: id,
  name: `혜택 ${id}`,
  payload: { 서비스ID: id, 서비스명: `혜택 ${id}`, ...extra },
});
const many = (n: number, extra: Record<string, unknown> = {}) => Array.from({ length: n }, (_, i) => rec(String(i + 1), extra));

describe('ApplySnapshotUseCase', () => {
  let repo: InMemorySnapshotRepository;
  let useCase: ApplySnapshotUseCase;

  beforeEach(() => {
    repo = new InMemorySnapshotRepository();
    useCase = new ApplySnapshotUseCase(repo);
  });

  describe('첫 수집', () => {
    it('항목은 저장하지만 변경 내역은 남기지 않는다', async () => {
      const result = await useCase.execute('GOV24', many(3), IGNORED);

      expect(result).toMatchObject({ baseline: true, itemCount: 3, added: 3 });
      expect(repo.items.size).toBe(3);
      expect(repo.changes).toHaveLength(0);
      expect(repo.runs[0].status).toBe('SUCCEEDED');
    });

    it('0건이면 실패로 기록하고 아무것도 저장하지 않는다', async () => {
      await expect(useCase.execute('GOV24', [], IGNORED)).rejects.toThrow(CollectionRejectedError);
      expect(repo.items.size).toBe(0);
      expect(repo.runs[0]).toMatchObject({ status: 'FAILED', error: expect.stringContaining('0건') });
    });
  });

  describe('두 번째 수집부터', () => {
    beforeEach(async () => {
      await useCase.execute('GOV24', [rec('1', { 지원내용: '월 10만원' }), rec('2'), rec('3')], IGNORED);
    });

    it('추가, 변경, 삭제를 각각 기록한다', async () => {
      const result = await useCase.execute('GOV24', [rec('1', { 지원내용: '월 20만원' }), rec('2'), rec('4')], IGNORED);

      expect(result).toMatchObject({ baseline: false, added: 1, updated: 1, removed: 1 });
      expect(repo.changes.map((c) => `${c.type}:${c.externalId}`).sort()).toEqual(['ADDED:4', 'REMOVED:3', 'UPDATED:1']);
      expect(repo.changes.find((c) => c.type === 'UPDATED')!.changedFields).toEqual([
        { field: '지원내용', before: '월 10만원', after: '월 20만원' },
      ]);
    });

    it('무시할 필드만 바뀌면 변경이 없다', async () => {
      const result = await useCase.execute('GOV24', [rec('1', { 지원내용: '월 10만원', 조회수: 99 }), rec('2'), rec('3')], IGNORED);
      expect(result).toMatchObject({ added: 0, updated: 0, removed: 0 });
      expect(repo.changes).toHaveLength(0);
    });

    it('사라졌던 항목이 다시 나타나면 추가로 기록하고 삭제 표시를 지운다', async () => {
      // 1건 삭제가 10% 감소 정책에 걸리지 않도록 별도 출처에 20건으로 확인
      const all = many(20);
      await useCase.execute('BOKJIRO_LOCAL', all, IGNORED);
      await useCase.execute('BOKJIRO_LOCAL', all.filter((r) => r.externalId !== '3'), IGNORED);
      await useCase.execute('BOKJIRO_LOCAL', all, IGNORED);

      expect(repo.changes.filter((c) => c.externalId === '3').map((c) => c.type)).toEqual(['REMOVED', 'ADDED']);
      expect(repo.items.get('BOKJIRO_LOCAL:3')!.removed).toBe(false);
    });

    it('0건이면 전부 삭제로 처리하지 않고 중단한다', async () => {
      await expect(useCase.execute('GOV24', [], IGNORED)).rejects.toThrow('0건');
      expect([...repo.items.values()].every((i) => !i.removed)).toBe(true);
    });
  });

  describe('대량 감소 방지', () => {
    beforeEach(async () => {
      await useCase.execute('GOV24', many(100), IGNORED);
    });

    it('딱 90%까지는 받아들인다', async () => {
      const result = await useCase.execute('GOV24', many(90), IGNORED);
      expect(result.removed).toBe(10);
    });

    it('90% 미만이면 중단하고 아무것도 바꾸지 않는다', async () => {
      await expect(useCase.execute('GOV24', many(89), IGNORED)).rejects.toThrow('90% 미만');
      expect([...repo.items.values()].filter((i) => i.removed)).toHaveLength(0);
      expect(repo.runs.at(-1)!.status).toBe('FAILED');
    });

    it('이미 사라진 항목은 비율 계산에서 뺀다', async () => {
      await useCase.execute('GOV24', many(90), IGNORED); // 활성 90건
      await expect(useCase.execute('GOV24', many(81), IGNORED)).resolves.toMatchObject({ removed: 9 }); // 90의 90%
      await expect(useCase.execute('GOV24', many(72), IGNORED)).rejects.toThrow(CollectionRejectedError); // 81의 90%는 72.9
    });
  });

  describe('저장 실패', () => {
    it('실행 기록을 실패로 남기고 오류를 그대로 던진다', async () => {
      await useCase.execute('GOV24', many(3), IGNORED);
      repo.failNextSave = new Error('DB 연결 끊김');

      await expect(useCase.execute('GOV24', [...many(3), rec('4')], IGNORED)).rejects.toThrow('DB 연결 끊김');
      expect(repo.runs.at(-1)).toMatchObject({ status: 'FAILED', error: 'DB 연결 끊김' });
      expect(repo.items.has('GOV24:4')).toBe(false);
    });

    it('실패한 다음 수집은 실패 전 상태와 비교한다', async () => {
      await useCase.execute('GOV24', many(3), IGNORED);
      repo.failNextSave = new Error('DB 연결 끊김');
      await expect(useCase.execute('GOV24', [...many(3), rec('4')], IGNORED)).rejects.toThrow();

      const result = await useCase.execute('GOV24', [...many(3), rec('4')], IGNORED);
      expect(result.added).toBe(1);
    });
  });

  describe('출처 구분', () => {
    it('출처가 다르면 같은 ID라도 따로 관리한다', async () => {
      await useCase.execute('GOV24', [rec('1')], IGNORED);
      const result = await useCase.execute('BOKJIRO_NATIONAL', [rec('1')], IGNORED);

      expect(result.baseline).toBe(true);
      expect(repo.items.size).toBe(2);
    });
  });

  it('중복 ID는 결과에 담아 알려준다', async () => {
    const result = await useCase.execute('GOV24', [rec('1'), rec('1'), rec('2')], IGNORED);
    expect(result.duplicateIds).toEqual(['1']);
    expect(result.added).toBe(2);
  });
});
