import { beforeEach, describe, expect, it } from 'vitest';
import type { SourceRecord } from '../../domain/source-record';
import { CollectService, CollectionAlreadyRunningError } from '../collect.service';
import { FakeSourceFetcher } from './fakes/fake-source-fetcher';
import { InMemorySnapshotRepository } from './fakes/in-memory-snapshot.repository';

const rec = (id: string): SourceRecord => ({ externalId: id, name: id, payload: { id } });

describe('CollectService.collectAll', () => {
  let repo: InMemorySnapshotRepository;

  beforeEach(() => {
    repo = new InMemorySnapshotRepository();
  });

  it('모든 출처를 차례로 수집해 결과를 모은다', async () => {
    const service = new CollectService(repo, [
      new FakeSourceFetcher('GOV24', [[rec('1'), rec('2')]]),
      new FakeSourceFetcher('BOKJIRO_NATIONAL', [[rec('a')]]),
    ]);

    const report = await service.collectAll();

    expect(report.outcomes.map((o) => `${o.source}:${o.status}`)).toEqual(['GOV24:succeeded', 'BOKJIRO_NATIONAL:succeeded']);
    expect(report.hasFailures).toBe(false);
    expect(repo.items.size).toBe(3);
  });

  it('한 출처가 실패해도 나머지 출처는 수집한다', async () => {
    const service = new CollectService(repo, [
      new FakeSourceFetcher('GOV24', [new Error('인증키 오류')]),
      new FakeSourceFetcher('BOKJIRO_NATIONAL', [[rec('a')]]),
      new FakeSourceFetcher('BOKJIRO_LOCAL', [[rec('x')]]),
    ]);

    const report = await service.collectAll();

    expect(report.failed).toEqual([{ source: 'GOV24', status: 'failed', reason: '인증키 오류' }]);
    expect(report.succeeded.map((o) => o.source)).toEqual(['BOKJIRO_NATIONAL', 'BOKJIRO_LOCAL']);
    expect(repo.runs.map((r) => r.status)).toEqual(['FAILED', 'SUCCEEDED', 'SUCCEEDED']);
  });

  it('모든 출처가 실패해도 예외 없이 보고서를 돌려준다', async () => {
    const service = new CollectService(repo, [
      new FakeSourceFetcher('GOV24', [new Error('a')]),
      new FakeSourceFetcher('BOKJIRO_LOCAL', [new Error('b')]),
    ]);

    const report = await service.collectAll();

    expect(report.failed.map((o) => o.source)).toEqual(['GOV24', 'BOKJIRO_LOCAL']);
    expect(report.totalChanges).toBe(0);
  });

  it('출처가 하나도 없으면 빈 보고서를 돌려준다', async () => {
    const report = await new CollectService(repo, []).collectAll();
    expect(report.outcomes).toEqual([]);
    expect(report.hasFailures).toBe(false);
  });

  it('첫 수집(기준점)은 변경 수에 넣지 않는다', async () => {
    const service = new CollectService(repo, [
      new FakeSourceFetcher('GOV24', [[rec('1'), rec('2')]]),
      new FakeSourceFetcher('BOKJIRO_LOCAL', [[rec('x')]]),
    ]);
    expect((await service.collectAll()).totalChanges).toBe(0);
  });

  it('두 번째 수집부터 발생한 변경 수를 모두 더한다', async () => {
    const all = Array.from({ length: 20 }, (_, i) => rec(String(i)));
    const service = new CollectService(repo, [
      new FakeSourceFetcher('GOV24', [all, [...all.slice(1), rec('new')]]),
    ]);

    await service.collectAll();
    const second = await service.collectAll();

    expect(second.totalChanges).toBe(2); // 추가 1 + 삭제 1
  });

  it('수집 중에 다시 실행하면 거절한다', async () => {
    let release!: () => void;
    const fetcher = new FakeSourceFetcher('GOV24', [[rec('1')]]).holdUntil(new Promise<void>((r) => (release = r)));
    const service = new CollectService(repo, [fetcher]);

    const first = service.collectAll();
    await expect(service.collectAll()).rejects.toThrow(CollectionAlreadyRunningError);
    release();
    await first;
  });

  it('앞선 수집이 끝나면 다시 실행할 수 있다', async () => {
    const service = new CollectService(repo, [new FakeSourceFetcher('GOV24', [new Error('실패')])]);

    await service.collectAll();
    await expect(service.collectAll()).resolves.toBeDefined();
  });
});
