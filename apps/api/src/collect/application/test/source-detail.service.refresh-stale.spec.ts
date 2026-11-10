import { beforeEach, describe, expect, it } from 'vitest';

import { SourceDetailService } from '../source-detail.service';

import { FakeDetailFetcher } from './fakes/fake-detail-fetcher';
import { InMemoryDetailRepository } from './fakes/in-memory-detail.repository';
import { InMemorySnapshotRepository } from './fakes/in-memory-snapshot.repository';
import { RecordingDetailEvents } from './fakes/recording-detail-events';

import type { DetailTarget } from '../detail-refresh-report';

const FIRST_DAY = new Date('2026-11-10T00:00:00Z');
const NEXT_DAY = new Date('2026-11-11T00:00:00Z');
const A_WEEK_LATER = new Date('2026-11-17T00:00:00Z');

const local = (externalId: string): DetailTarget => ({ source: 'BOKJIRO_LOCAL', externalId });
const national = (externalId: string): DetailTarget => ({ source: 'BOKJIRO_NATIONAL', externalId });
const listed = (externalId: string, lastModYmd?: string) => ({
  externalId,
  name: `혜택 ${externalId}`,
  payload: lastModYmd ? { servId: externalId, lastModYmd } : { servId: externalId },
  removed: false,
});
const detail = (externalId: string, lastModYmd?: string, extra: Record<string, unknown> = {}) => ({
  servId: externalId,
  servNm: `혜택 ${externalId}`,
  alwServCn: '100만원 지원',
  ...(lastModYmd && { lastModYmd }),
  ...extra,
});

describe('SourceDetailService.refreshStale', () => {
  let details: InMemoryDetailRepository;
  let snapshots: InMemorySnapshotRepository;
  let localFetcher: FakeDetailFetcher;
  let nationalFetcher: FakeDetailFetcher;
  let service: SourceDetailService;

  beforeEach(() => {
    details = new InMemoryDetailRepository();
    snapshots = new InMemorySnapshotRepository();
    localFetcher = new FakeDetailFetcher('BOKJIRO_LOCAL');
    nationalFetcher = new FakeDetailFetcher('BOKJIRO_NATIONAL');
    service = new SourceDetailService(details, snapshots, [localFetcher, nationalFetcher], new RecordingDetailEvents());
  });

  const fetchedSoFar = () => [...localFetcher.requested, ...nationalFetcher.requested];

  it('지켜볼 원본이 없으면 아무것도 받지 않는다', async () => {
    const report = await service.refreshStale([], FIRST_DAY);

    expect(report.outcomes).toEqual([]);
    expect(report.skipped).toEqual({ upToDate: 0, unlisted: 0 });
  });

  it('처음 보는 원본은 모두 받는다', async () => {
    snapshots.seed('BOKJIRO_LOCAL', [listed('A', '20261002')]).seed('BOKJIRO_NATIONAL', [listed('N')]);
    localFetcher.reply('A', detail('A', '20261002'));
    nationalFetcher.reply('N', detail('N'));

    const report = await service.refreshStale([local('A'), national('N')], FIRST_DAY);

    expect(report.baseline.map((o) => o.externalId)).toEqual(['A', 'N']);
  });

  it('바뀌었을 것 같은 것만 다시 받고, 건너뛴 수를 알려준다', async () => {
    snapshots
      .seed('BOKJIRO_LOCAL', [listed('SAME', '20261002'), listed('MODIFIED', '20261002'), { ...listed('GONE', '20261002'), removed: true }])
      .seed('BOKJIRO_NATIONAL', [listed('N')]);
    localFetcher.reply('SAME', detail('SAME', '20261002')).reply('MODIFIED', detail('MODIFIED', '20261002'));
    nationalFetcher.reply('N', detail('N'));
    await service.refresh([local('SAME'), local('MODIFIED'), national('N')], FIRST_DAY);
    snapshots.seed('BOKJIRO_LOCAL', [listed('MODIFIED', '20261110')]);
    localFetcher.reply('MODIFIED', detail('MODIFIED', '20261110', { alwServCn: '200만원 지원' }));
    localFetcher.requested.length = 0;
    nationalFetcher.requested.length = 0;

    const report = await service.refreshStale([local('SAME'), local('MODIFIED'), local('GONE'), national('N')], NEXT_DAY);

    expect(fetchedSoFar()).toEqual(['MODIFIED']);
    expect(report.changed).toEqual([
      { source: 'BOKJIRO_LOCAL', externalId: 'MODIFIED', name: '혜택 MODIFIED', status: 'changed', fields: ['alwServCn', 'lastModYmd'] },
    ]);
    expect(report.skipped).toEqual({ upToDate: 2, unlisted: 1 });
  });

  it('중앙부처 원본은 일주일이 지나면 다시 받는다', async () => {
    snapshots.seed('BOKJIRO_NATIONAL', [listed('N')]);
    nationalFetcher.reply('N', detail('N'));
    await service.refresh([national('N')], FIRST_DAY);

    const report = await service.refreshStale([national('N')], A_WEEK_LATER);

    expect(report.unchanged.map((o) => o.externalId)).toEqual(['N']);
    expect(details.details.get('BOKJIRO_NATIONAL:N')?.fetchedAt).toEqual(A_WEEK_LATER);
  });

  it('한 건이 실패해도 나머지는 받는다', async () => {
    snapshots.seed('BOKJIRO_LOCAL', [listed('A'), listed('B'), listed('C')]);
    localFetcher.reply('A', detail('A')).reply('B', new Error('BOKJIRO_LOCAL: 시간 초과')).reply('C', detail('C'));

    const report = await service.refreshStale([local('A'), local('B'), local('C')], FIRST_DAY);

    expect(report.fetched.map((o) => o.externalId)).toEqual(['A', 'C']);
    expect(report.failed.map((o) => o.externalId)).toEqual(['B']);
  });

  it('같은 원본이 여러 번 있어도 한 번만 세고 한 번만 받는다', async () => {
    snapshots.seed('BOKJIRO_LOCAL', [listed('A'), listed('B', '20261002')]);
    localFetcher.reply('A', detail('A')).reply('B', detail('B', '20261002'));
    await service.refresh([local('B')], FIRST_DAY);
    localFetcher.requested.length = 0;

    const report = await service.refreshStale([local('A'), local('A'), local('B'), local('B')], NEXT_DAY);

    expect(localFetcher.requested).toEqual(['A']);
    expect(report.skipped.upToDate).toBe(1);
  });

  it('보조금24 원본은 받지 않고 건너뛴 수에도 넣지 않는다', async () => {
    const report = await service.refreshStale([{ source: 'GOV24', externalId: 'G1' }], FIRST_DAY);

    expect(report.outcomes).toEqual([]);
    expect(report.skipped).toEqual({ upToDate: 0, unlisted: 0 });
  });
});
