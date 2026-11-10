import { beforeEach, describe, expect, it } from 'vitest';

import { BenefitCatalogService } from '../../../benefit/application/benefit-catalog.service';
import { BenefitReviewService, type ReviewQueue } from '../../../benefit/application/benefit-review.service';
import { SourceStateReader } from '../../../benefit/application/ports/source-state.reader';
import { benefitDetails } from '../../../benefit/application/test/fakes/benefit-fixtures';
import { FakeBenefitCatalog } from '../../../benefit/application/test/fakes/fake-benefit-catalog';
import { FakeSourceStateReader } from '../../../benefit/application/test/fakes/fake-source-state.reader';
import { InMemoryBenefitRepository } from '../../../benefit/application/test/fakes/in-memory-benefit.repository';
import { Benefit } from '../../../benefit/domain/benefit';
import { CurrentSources } from '../../../benefit/domain/current-sources';
import { SourceRef } from '../../../benefit/domain/source-ref';
import { CollectionAlreadyRunningError, CollectService } from '../../../collect/application/collect.service';
import { CollectionReport } from '../../../collect/application/collection-report';
import { DetailRefreshReport } from '../../../collect/application/detail-refresh-report';
import { SourceDetailService } from '../../../collect/application/source-detail.service';
import { FakeDetailFetcher } from '../../../collect/application/test/fakes/fake-detail-fetcher';
import { FakeSourceFetcher } from '../../../collect/application/test/fakes/fake-source-fetcher';
import { InMemoryDetailRepository } from '../../../collect/application/test/fakes/in-memory-detail.repository';
import { InMemorySnapshotRepository } from '../../../collect/application/test/fakes/in-memory-snapshot.repository';
import { RecordingCollectionEvents } from '../../../collect/application/test/fakes/recording-collection-events';
import { RecordingDetailEvents } from '../../../collect/application/test/fakes/recording-detail-events';
import { sampleRegionService } from '../../../region/application/test/fakes/sample-region-service';
import { type DailyCheckResult, DailyCheckService, requiresAttention } from '../daily-check.service';

import type { BenefitDetails } from '../../../benefit/domain/benefit';
import type { SourceRecord } from '../../../collect/domain/source-record';

const records = (n: number): SourceRecord[] =>
  Array.from({ length: n }, (_, i) => ({ externalId: String(i + 1), name: `혜택 ${i + 1}`, payload: { 서비스ID: String(i + 1) } }));

const AT = new Date('2026-11-10T19:00:00Z');

class BrokenReader extends SourceStateReader {
  async read(): Promise<CurrentSources> {
    throw new Error('DB 연결 끊김');
  }
}

class BrokenCatalog extends FakeBenefitCatalog {
  async load(): Promise<BenefitDetails[]> {
    throw new Error('혜택 목록 파일을 읽지 못했습니다');
  }
}

describe('DailyCheckService', () => {
  let reader: FakeSourceStateReader;
  let benefits: InMemoryBenefitRepository;
  let catalog: FakeBenefitCatalog;
  let detailFetcher: FakeDetailFetcher;

  beforeEach(() => {
    reader = new FakeSourceStateReader().set(new SourceRef('GOV24', '1'));
    benefits = new InMemoryBenefitRepository([Benefit.register(benefitDetails('1'))]);
    catalog = new FakeBenefitCatalog([benefitDetails('1')]);
    detailFetcher = new FakeDetailFetcher('BOKJIRO_LOCAL');
  });

  const dailyCheck = (fetchers: FakeSourceFetcher[], sourceReader: SourceStateReader = reader) => {
    const snapshots = new InMemorySnapshotRepository();
    return new DailyCheckService(
      new CollectService(snapshots, fetchers, new RecordingCollectionEvents()),
      new SourceDetailService(new InMemoryDetailRepository(), snapshots, [detailFetcher], new RecordingDetailEvents()),
      new BenefitCatalogService(catalog, benefits, sampleRegionService()),
      new BenefitReviewService(benefits, sourceReader),
    );
  };
  const linkToLocal = (externalId: string) =>
    catalog.add([benefitDetails(externalId, { slug: `local-${externalId}`, sources: [new SourceRef('BOKJIRO_LOCAL', externalId)] })]);
  const localList = (...ids: string[]): SourceRecord[] =>
    ids.map((id) => ({ externalId: id, name: `혜택 ${id}`, payload: { servId: id, lastModYmd: '20261002' } }));

  it('수집한 뒤 혜택 검토 목록을 함께 돌려준다', async () => {
    const result = await dailyCheck([new FakeSourceFetcher('GOV24', [records(3)])]).run();

    expect(result.collection.succeeded).toHaveLength(1);
    expect(result.review).toMatchObject({ status: 'succeeded', queue: { counts: { UNVERIFIED: 1 } } });
  });

  it('수집이 모두 실패해도 이전에 저장된 원본으로 검토 목록은 만든다', async () => {
    const result = await dailyCheck([new FakeSourceFetcher('GOV24', [new Error('API 응답 없음')])]).run();

    expect(result.collection.hasFailures).toBe(true);
    expect(result.review.status).toBe('succeeded');
  });

  it('검토 목록을 못 만들어도 수집 결과는 돌려주고 실패 이유를 담는다', async () => {
    const result = await dailyCheck([new FakeSourceFetcher('GOV24', [records(3)])], new BrokenReader()).run();

    expect(result.collection.succeeded).toHaveLength(1);
    expect(result.review).toEqual({ status: 'failed', reason: 'DB 연결 끊김' });
  });

  it('목록을 수집한 뒤 혜택이 가리키는 복지로 원본의 상세를 받아 결과에 담는다', async () => {
    await linkToLocal('L1');
    detailFetcher.reply('L1', { servId: 'L1', servNm: '혜택 L1', lastModYmd: '20261002' });

    const result = await dailyCheck([new FakeSourceFetcher('BOKJIRO_LOCAL', [localList('L1', 'L2')])]).run(AT);

    expect(detailFetcher.requested).toEqual(['L1']);
    expect(result.details).toMatchObject({ status: 'succeeded' });
    expect(result.details.status === 'succeeded' && result.details.report.baseline.map((o) => o.externalId)).toEqual(['L1']);
  });

  it('상세를 받지 못해도 수집·검토 결과는 돌려주고 실패 이유를 담는다', async () => {
    catalog = new BrokenCatalog();

    const result = await dailyCheck([new FakeSourceFetcher('GOV24', [records(3)])]).run(AT);

    expect(result.collection.succeeded).toHaveLength(1);
    expect(result.details).toEqual({ status: 'failed', reason: '혜택 목록 파일을 읽지 못했습니다' });
    expect(result.review.status).toBe('succeeded');
  });

  it('상세 한 건이 실패해도 일일 확인은 끝까지 하고 실패를 결과에 담는다', async () => {
    await linkToLocal('L1');
    detailFetcher.reply('L1', new Error('BOKJIRO_LOCAL: 시간 초과'));

    const result = await dailyCheck([new FakeSourceFetcher('BOKJIRO_LOCAL', [localList('L1')])]).run(AT);

    expect(result.details.status === 'succeeded' && result.details.report.failed.map((o) => o.externalId)).toEqual(['L1']);
    expect(result.review.status).toBe('succeeded');
    expect(requiresAttention(result)).toBe(true);
  });

  it('수집이 이미 진행 중이면 검토하지 않고 그대로 알린다', async () => {
    let release!: () => void;
    const slow = new FakeSourceFetcher('GOV24', [records(3)]);
    slow.holdUntil(new Promise<void>((resolve) => (release = resolve)));
    const check = dailyCheck([slow]);

    const first = check.run();
    await expect(check.run()).rejects.toThrow(CollectionAlreadyRunningError);
    release();
    await first;
  });
});

describe('requiresAttention', () => {
  const zero = { VERIFIED: 0, UNVERIFIED: 0, SOURCE_CHANGED: 0, SOURCE_REMOVED: 0, SOURCE_MISSING: 0 };
  const queue = (kind: 'UNVERIFIED' | 'SOURCE_CHANGED' | 'SOURCE_MISSING'): ReviewQueue => ({
    items: [
      kind === 'SOURCE_CHANGED'
        ? { slug: 's', name: 'n', verifiedAt: null, status: { kind, changes: [] } }
        : kind === 'SOURCE_MISSING'
          ? { slug: 's', name: 'n', verifiedAt: null, status: { kind, refs: [] } }
          : { slug: 's', name: 'n', verifiedAt: null, status: { kind } },
    ],
    counts: { ...zero, [kind]: 1 },
  });
  const ok = new CollectionReport([]);
  const noDetails: DailyCheckResult['details'] = { status: 'succeeded', report: new DetailRefreshReport([]) };
  const result = (
    review: DailyCheckResult['review'],
    collection = ok,
    details: DailyCheckResult['details'] = noDetails,
  ): DailyCheckResult => ({
    collection,
    details,
    review,
  });
  const quiet = { status: 'succeeded', queue: queue('UNVERIFIED') } as const;

  it('검증 전만 있으면 조용히 둔다', () => {
    expect(requiresAttention(result({ status: 'succeeded', queue: queue('UNVERIFIED') }))).toBe(false);
  });

  it('원본이 바뀌었거나 없는 혜택이 있으면 알린다', () => {
    expect(requiresAttention(result({ status: 'succeeded', queue: queue('SOURCE_CHANGED') }))).toBe(true);
    expect(requiresAttention(result({ status: 'succeeded', queue: queue('SOURCE_MISSING') }))).toBe(true);
  });

  it('검토 실패나 수집 실패도 알린다', () => {
    expect(requiresAttention(result({ status: 'failed', reason: 'x' }))).toBe(true);
    const failed = new CollectionReport([{ source: 'GOV24', status: 'failed', reason: 'x' }]);
    expect(requiresAttention(result({ status: 'succeeded', queue: queue('UNVERIFIED') }, failed))).toBe(true);
  });

  it('상세가 바뀌었거나 상세를 받지 못했으면 알린다', () => {
    const changed = new DetailRefreshReport([
      { source: 'BOKJIRO_LOCAL', externalId: 'L1', name: 'n', status: 'changed', fields: ['alwServCn'] },
    ]);
    const failed = new DetailRefreshReport([{ source: 'BOKJIRO_LOCAL', externalId: 'L1', status: 'failed', reason: 'x' }]);

    expect(requiresAttention(result(quiet, ok, { status: 'succeeded', report: changed }))).toBe(true);
    expect(requiresAttention(result(quiet, ok, { status: 'succeeded', report: failed }))).toBe(true);
    expect(requiresAttention(result(quiet, ok, { status: 'failed', reason: 'x' }))).toBe(true);
  });

  it('상세를 받았는데 그대로이거나 건너뛰었으면 조용히 둔다', () => {
    const unchanged = new DetailRefreshReport([{ source: 'BOKJIRO_LOCAL', externalId: 'L1', name: 'n', status: 'unchanged' }], {
      upToDate: 900,
      unlisted: 1,
    });

    expect(requiresAttention(result(quiet, ok, { status: 'succeeded', report: unchanged }))).toBe(false);
  });
});
