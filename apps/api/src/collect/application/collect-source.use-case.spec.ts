import { beforeEach, describe, expect, it } from 'vitest';
import type { SourceId, SourceRecord } from '../domain/source-record';
import { CollectSourceUseCase } from './collect-source.use-case';
import { FakeSourceFetcher } from './fakes/fake-source-fetcher';
import { InMemorySnapshotRepository } from './fakes/in-memory-snapshot.repository';
import { CollectionRejectedError } from './policies/collection-policy';

const rec = (id: string, extra: Record<string, unknown> = {}): SourceRecord => ({
  externalId: id,
  name: `혜택 ${id}`,
  payload: { 서비스ID: id, 서비스명: `혜택 ${id}`, ...extra },
});
const many = (n: number) => Array.from({ length: n }, (_, i) => rec(String(i + 1)));

describe('CollectSourceUseCase', () => {
  let repo: InMemorySnapshotRepository;
  let useCase: CollectSourceUseCase;
  const collect = (records: SourceRecord[] | Error, source: SourceId = 'GOV24') =>
    useCase.execute(new FakeSourceFetcher(source, [records]));

  beforeEach(() => {
    repo = new InMemorySnapshotRepository();
    useCase = new CollectSourceUseCase(repo);
  });

  describe('첫 수집', () => {
    it('항목은 저장하지만 변경 내역은 남기지 않는다', async () => {
      const result = await collect(many(3));

      expect(result).toMatchObject({ source: 'GOV24', baseline: true, itemCount: 3, added: 3 });
      expect(repo.items.size).toBe(3);
      expect(repo.changes).toHaveLength(0);
      expect(repo.runs[0].status).toBe('SUCCEEDED');
    });

    it('0건이면 실패로 기록하고 아무것도 저장하지 않는다', async () => {
      await expect(collect([])).rejects.toThrow(CollectionRejectedError);
      expect(repo.items.size).toBe(0);
      expect(repo.runs[0]).toMatchObject({ status: 'FAILED', error: expect.stringContaining('0건') });
    });
  });

  describe('가져오기 실패', () => {
    it('실행 기록을 실패로 남기고 오류를 그대로 던진다', async () => {
      await expect(collect(new Error('API 응답 없음'))).rejects.toThrow('API 응답 없음');
      expect(repo.runs[0]).toMatchObject({ source: 'GOV24', status: 'FAILED', error: 'API 응답 없음' });
    });

    it('이전에 저장한 항목은 그대로 둔다', async () => {
      await collect(many(3));
      await expect(collect(new Error('시간 초과'))).rejects.toThrow();

      expect(repo.items.size).toBe(3);
      expect([...repo.items.values()].every((i) => !i.removed)).toBe(true);
    });
  });

  describe('두 번째 수집부터', () => {
    beforeEach(async () => {
      await collect([rec('1', { 지원내용: '월 10만원' }), rec('2'), rec('3')]);
    });

    it('추가, 변경, 삭제를 각각 기록한다', async () => {
      const result = await collect([rec('1', { 지원내용: '월 20만원' }), rec('2'), rec('4')]);

      expect(result).toMatchObject({ baseline: false, added: 1, updated: 1, removed: 1 });
      expect(repo.changes.map((c) => `${c.type}:${c.externalId}`).sort()).toEqual(['ADDED:4', 'REMOVED:3', 'UPDATED:1']);
      expect(repo.changes.find((c) => c.type === 'UPDATED')!.changedFields).toEqual([
        { field: '지원내용', before: '월 10만원', after: '월 20만원' },
      ]);
    });

    it('무시할 필드만 바뀌면 변경이 없다', async () => {
      const result = await collect([rec('1', { 지원내용: '월 10만원', 조회수: 99 }), rec('2'), rec('3')]);
      expect(result).toMatchObject({ added: 0, updated: 0, removed: 0 });
      expect(repo.changes).toHaveLength(0);
    });

    it('0건이면 전부 삭제로 처리하지 않고 중단한다', async () => {
      await expect(collect([])).rejects.toThrow('0건');
      expect([...repo.items.values()].every((i) => !i.removed)).toBe(true);
    });
  });

  it('사라졌던 항목이 다시 나타나면 추가로 기록하고 삭제 표시를 지운다', async () => {
    const all = many(20); // 1건 삭제가 10% 감소 정책에 걸리지 않을 만큼
    await collect(all);
    await collect(all.filter((r) => r.externalId !== '3'));
    await collect(all);

    expect(repo.changes.filter((c) => c.externalId === '3').map((c) => c.type)).toEqual(['REMOVED', 'ADDED']);
    expect(repo.items.get('GOV24:3')!.removed).toBe(false);
  });

  describe('대량 감소 방지', () => {
    beforeEach(async () => {
      await collect(many(100));
    });

    it('딱 90%까지는 받아들인다', async () => {
      expect((await collect(many(90))).removed).toBe(10);
    });

    it('90% 미만이면 중단하고 아무것도 바꾸지 않는다', async () => {
      await expect(collect(many(89))).rejects.toThrow('90% 미만');
      expect([...repo.items.values()].filter((i) => i.removed)).toHaveLength(0);
      expect(repo.runs.at(-1)!.status).toBe('FAILED');
    });

    it('이미 사라진 항목은 비율 계산에서 뺀다', async () => {
      await collect(many(90));
      await expect(collect(many(81))).resolves.toMatchObject({ removed: 9 });
      await expect(collect(many(72))).rejects.toThrow(CollectionRejectedError);
    });
  });

  describe('저장 실패', () => {
    it('실행 기록을 실패로 남기고 오류를 그대로 던진다', async () => {
      await collect(many(3));
      repo.failNextSave = new Error('DB 연결 끊김');

      await expect(collect([...many(3), rec('4')])).rejects.toThrow('DB 연결 끊김');
      expect(repo.runs.at(-1)).toMatchObject({ status: 'FAILED', error: 'DB 연결 끊김' });
      expect(repo.items.has('GOV24:4')).toBe(false);
    });

    it('실패한 다음 수집은 실패 전 상태와 비교한다', async () => {
      await collect(many(3));
      repo.failNextSave = new Error('DB 연결 끊김');
      await expect(collect([...many(3), rec('4')])).rejects.toThrow();

      expect((await collect([...many(3), rec('4')])).added).toBe(1);
    });
  });

  it('출처가 다르면 같은 ID라도 따로 관리한다', async () => {
    await collect([rec('1')], 'GOV24');
    const result = await collect([rec('1')], 'BOKJIRO_NATIONAL');

    expect(result.baseline).toBe(true);
    expect(repo.items.size).toBe(2);
  });

  it('중복 ID는 결과에 담아 알려준다', async () => {
    const result = await collect([rec('1'), rec('1'), rec('2')]);
    expect(result.duplicateIds).toEqual(['1']);
    expect(result.added).toBe(2);
  });
});
