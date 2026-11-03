import { Inject, Injectable } from '@nestjs/common';

import { ComparisonRule } from '../../shared/domain/comparison-rule';
import { diffSnapshot, type SnapshotDiff } from '../domain/snapshot-diff';

import { type ChangedItem, CollectionReport, type CollectSourceResult, type SourceOutcome } from './collection-report';
import { assertAcceptable, isBaseline } from './policies/collection-policy';
import { CollectionEvents } from './ports/collection-events';
import { type SnapshotPlan, SnapshotRepository } from './ports/snapshot.repository';
import { SOURCE_FETCHERS, type SourceFetcher } from './ports/source-fetcher';

import type { SourceId } from '../../shared/domain/source-id';
import type { SourceRecord, StoredItem } from '../domain/source-record';

export class CollectionAlreadyRunningError extends Error {
  constructor() {
    super('이미 수집이 진행 중입니다.');
  }
}

// 공공 API 출처를 수집해서 이전 원본과 비교하고 저장한다
@Injectable()
export class CollectService {
  private running = false;

  constructor(
    private readonly repository: SnapshotRepository,
    @Inject(SOURCE_FETCHERS) private readonly fetchers: readonly SourceFetcher[],
    private readonly events: CollectionEvents,
  ) {}

  // 출처를 차례로 수집한다. 한 출처가 실패해도 나머지는 계속한다
  async collectAll(): Promise<CollectionReport> {
    this.rejectIfRunning();
    this.running = true;
    try {
      const outcomes: SourceOutcome[] = [];
      for (const fetcher of this.fetchers) outcomes.push(await this.toOutcome(fetcher));
      return new CollectionReport(outcomes);
    } finally {
      this.running = false;
    }
  }

  // 수집해 둔 원본 중 지금도 출처에 있는 것. 혜택 후보를 고를 때 쓴다
  async currentItems(source: SourceId): Promise<SourceRecord[]> {
    const items = await this.repository.loadItems(source);
    return items.filter((item) => !item.removed).map(({ externalId, name, payload }) => ({ externalId, name, payload }));
  }

  async collect(fetcher: SourceFetcher): Promise<CollectSourceResult> {
    const runId = await this.repository.startRun(fetcher.source);
    this.events.started(fetcher.source, runId);
    try {
      const records = await fetcher.fetchAll();
      const result = await this.applySnapshot(runId, fetcher, records);
      await this.repository.completeRun(runId, result);
      this.events.succeeded(result);
      return result;
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      await this.repository.failRun(runId, reason);
      this.events.failed(fetcher.source, runId, reason);
      throw error;
    }
  }

  private rejectIfRunning() {
    if (this.running) throw new CollectionAlreadyRunningError();
  }

  private async toOutcome(fetcher: SourceFetcher): Promise<SourceOutcome> {
    try {
      return { source: fetcher.source, status: 'succeeded', result: await this.collect(fetcher) };
    } catch (error) {
      return { source: fetcher.source, status: 'failed', reason: error instanceof Error ? error.message : String(error) };
    }
  }

  private async applySnapshot(runId: string, fetcher: SourceFetcher, records: SourceRecord[]): Promise<CollectSourceResult> {
    const previous = await this.repository.loadItems(fetcher.source);
    assertAcceptable(countActive(previous), records.length);

    const baseline = isBaseline(previous.length);
    const diff = diffSnapshot(previous, records, ComparisonRule.of(fetcher.source));
    await this.repository.saveSnapshot(runId, fetcher.source, this.toPlan(diff, baseline));

    return {
      source: fetcher.source,
      runId,
      baseline,
      itemCount: records.length,
      added: diff.added.length,
      updated: diff.updated.length,
      removed: diff.removed.length,
      duplicateIds: diff.duplicateIds,
      changes: baseline ? [] : toChangedItems(diff),
    };
  }

  private toPlan(diff: SnapshotDiff, baseline: boolean): SnapshotPlan {
    return {
      recordChanges: !baseline,
      added: diff.added.map((record) => ({ record })),
      updated: diff.updated,
      unchangedIds: diff.unchanged.map((r) => r.externalId),
      removedIds: diff.removed.map((r) => r.externalId),
    };
  }
}

function countActive(items: StoredItem[]) {
  return items.filter((item) => !item.removed).length;
}

function toChangedItems(diff: SnapshotDiff): ChangedItem[] {
  return [
    ...diff.added.map(({ externalId, name }) => ({ type: 'ADDED' as const, externalId, name, fields: [] })),
    ...diff.updated.map(({ record, changedFields }) => ({
      type: 'UPDATED' as const,
      externalId: record.externalId,
      name: record.name,
      fields: changedFields.map((c) => c.field),
    })),
    ...diff.removed.map(({ externalId, name }) => ({ type: 'REMOVED' as const, externalId, name, fields: [] })),
  ];
}
