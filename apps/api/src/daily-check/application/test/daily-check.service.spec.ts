import { beforeEach, describe, expect, it } from 'vitest';

import { BenefitReviewService, type ReviewQueue } from '../../../benefit/application/benefit-review.service';
import { SourceStateReader } from '../../../benefit/application/ports/source-state.reader';
import { benefitDetails } from '../../../benefit/application/test/fakes/benefit-fixtures';
import { FakeSourceStateReader } from '../../../benefit/application/test/fakes/fake-source-state.reader';
import { InMemoryBenefitRepository } from '../../../benefit/application/test/fakes/in-memory-benefit.repository';
import { Benefit } from '../../../benefit/domain/benefit';
import { CurrentSources } from '../../../benefit/domain/current-sources';
import { SourceRef } from '../../../benefit/domain/source-ref';
import { CollectionAlreadyRunningError, CollectService } from '../../../collect/application/collect.service';
import { CollectionReport } from '../../../collect/application/collection-report';
import { FakeSourceFetcher } from '../../../collect/application/test/fakes/fake-source-fetcher';
import { InMemorySnapshotRepository } from '../../../collect/application/test/fakes/in-memory-snapshot.repository';
import { RecordingCollectionEvents } from '../../../collect/application/test/fakes/recording-collection-events';
import { type DailyCheckResult, DailyCheckService, requiresAttention } from '../daily-check.service';

import type { SourceRecord } from '../../../collect/domain/source-record';

const records = (n: number): SourceRecord[] =>
  Array.from({ length: n }, (_, i) => ({ externalId: String(i + 1), name: `혜택 ${i + 1}`, payload: { 서비스ID: String(i + 1) } }));

class BrokenReader extends SourceStateReader {
  async read(): Promise<CurrentSources> {
    throw new Error('DB 연결 끊김');
  }
}

describe('DailyCheckService', () => {
  let reader: FakeSourceStateReader;
  let benefits: InMemoryBenefitRepository;

  beforeEach(() => {
    reader = new FakeSourceStateReader().set(new SourceRef('GOV24', '1'));
    benefits = new InMemoryBenefitRepository([Benefit.register(benefitDetails('1'))]);
  });

  const dailyCheck = (fetchers: FakeSourceFetcher[], sourceReader: SourceStateReader = reader) =>
    new DailyCheckService(
      new CollectService(new InMemorySnapshotRepository(), fetchers, new RecordingCollectionEvents()),
      new BenefitReviewService(benefits, sourceReader),
    );

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
  const result = (review: DailyCheckResult['review'], collection = ok): DailyCheckResult => ({ collection, review });

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
});
