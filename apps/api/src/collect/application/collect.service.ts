import { Inject, Injectable } from '@nestjs/common';

import { hashPayload } from '../../shared/domain/payload-diff';
import { diffSnapshot, type SnapshotDiff } from '../domain/snapshot-diff';

import { CollectionReport, type SourceOutcome } from './collection-report';
import { assertAcceptable, isBaseline } from './policies/collection-policy';
import { type SnapshotPlan, SnapshotRepository } from './ports/snapshot.repository';
import { SOURCE_FETCHERS, type SourceFetcher } from './ports/source-fetcher';

import type { SourceId } from '../../shared/domain/source-id';
import type { SourceRecord, StoredItem } from '../domain/source-record';

export class CollectionAlreadyRunningError extends Error {
  constructor() {
    super('이미 수집이 진행 중입니다.');
  }
}

export interface ChangedItem {
  type: 'ADDED' | 'UPDATED' | 'REMOVED';
  externalId: string;
  name: string;
  fields: string[];
}

export interface CollectSourceResult {
  source: SourceId;
  runId: string;
  baseline: boolean;
  itemCount: number;
  added: number;
  updated: number;
  removed: number;
  duplicateIds: string[];
  changes: ChangedItem[]; // 첫 수집(기준점)이면 비어 있다
}

// 공공 API 출처를 수집해서 이전 원본과 비교하고 저장한다
@Injectable()
export class CollectService {
  private running = false;

  constructor(
    private readonly repository: SnapshotRepository,
    @Inject(SOURCE_FETCHERS) private readonly fetchers: readonly SourceFetcher[],
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

  async collect(fetcher: SourceFetcher): Promise<CollectSourceResult> {
    const runId = await this.repository.startRun(fetcher.source);
    try {
      const records = await fetcher.fetchAll();
      const result = await this.applySnapshot(runId, fetcher, records);
      await this.repository.completeRun(runId, result);
      return result;
    } catch (error) {
      await this.repository.failRun(runId, error instanceof Error ? error.message : String(error));
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
    const diff = diffSnapshot(previous, records, fetcher.ignoredFields);
    await this.repository.saveSnapshot(runId, fetcher.source, this.toPlan(diff, baseline, fetcher.ignoredFields));

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

  private toPlan(diff: SnapshotDiff, baseline: boolean, ignoredFields: readonly string[]): SnapshotPlan {
    const withHash = (record: SourceRecord) => ({ record, hash: hashPayload(record.payload, ignoredFields) });
    return {
      recordChanges: !baseline,
      added: diff.added.map(withHash),
      updated: diff.updated.map(({ record, changedFields }) => ({ ...withHash(record), changedFields })),
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
