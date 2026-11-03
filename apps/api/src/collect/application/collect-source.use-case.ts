import { diffSnapshot, type SnapshotDiff } from '../domain/snapshot-diff';
import { hashPayload } from '../../shared/domain/payload-diff';
import type { SourceRecord, StoredItem } from '../domain/source-record';
import type { SourceId } from '../../shared/domain/source-id';
import { assertAcceptable, isBaseline } from './policies/collection-policy';
import { SnapshotRepository, type SnapshotPlan } from './ports/snapshot.repository';
import type { SourceFetcher } from './ports/source-fetcher';

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

export class CollectSourceUseCase {
  constructor(private readonly repository: SnapshotRepository) {}

  async execute(fetcher: SourceFetcher): Promise<CollectSourceResult> {
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

  private async applySnapshot(runId: string, fetcher: SourceFetcher, records: SourceRecord[]): Promise<CollectSourceResult> {
    const previous = await this.repository.loadItems(fetcher.source);
    assertAcceptable(countActive(previous), records.length);

    const baseline = isBaseline(previous.length);
    const diff = diffSnapshot(previous, records, fetcher.ignoredFields);
    const withHash = (record: SourceRecord) => ({ record, hash: hashPayload(record.payload, fetcher.ignoredFields) });

    const plan: SnapshotPlan = {
      recordChanges: !baseline,
      added: diff.added.map(withHash),
      updated: diff.updated.map(({ record, changedFields }) => ({ ...withHash(record), changedFields })),
      unchangedIds: diff.unchanged.map((r) => r.externalId),
      removedIds: diff.removed.map((r) => r.externalId),
    };
    await this.repository.saveSnapshot(runId, fetcher.source, plan);

    return {
      source: fetcher.source,
      runId,
      baseline,
      itemCount: records.length,
      added: diff.added.length,
      updated: diff.updated.length,
      removed: diff.removed.length,
      duplicateIds: diff.duplicateIds,
      changes: baseline ? [] : changedItemsOf(diff),
    };
  }
}

function countActive(items: StoredItem[]) {
  return items.filter((item) => !item.removed).length;
}

function changedItemsOf(diff: SnapshotDiff): ChangedItem[] {
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
