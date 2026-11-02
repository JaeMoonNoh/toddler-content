import { diffSnapshot, hashPayload } from '../domain/snapshot-diff';
import type { SourceId, SourceRecord } from '../domain/source-record';
import { assertAcceptable, isBaseline } from './collection-policy';
import { SnapshotRepository, type SnapshotPlan } from './ports';

export interface ApplySnapshotResult {
  runId: string;
  baseline: boolean;
  itemCount: number;
  added: number;
  updated: number;
  removed: number;
  duplicateIds: string[];
}

// 출처에서 받은 전체 목록을 이전 원본과 비교해 반영하고, 실행 기록을 남긴다
export class ApplySnapshotUseCase {
  constructor(private readonly repository: SnapshotRepository) {}

  async execute(source: SourceId, records: SourceRecord[], ignored: readonly string[] = []): Promise<ApplySnapshotResult> {
    const runId = await this.repository.startRun(source);
    try {
      const previous = await this.repository.loadItems(source);
      assertAcceptable(previous.filter((p) => !p.removed).length, records.length);

      const baseline = isBaseline(previous.length);
      const diff = diffSnapshot(previous, records, ignored);
      const planned = (record: SourceRecord) => ({ record, hash: hashPayload(record.payload, ignored) });

      const plan: SnapshotPlan = {
        recordChanges: !baseline,
        added: diff.added.map(planned),
        updated: diff.updated.map(({ record, changedFields }) => ({ ...planned(record), changedFields })),
        unchangedIds: diff.unchanged.map((r) => r.externalId),
        removedIds: diff.removed.map((r) => r.externalId),
      };
      await this.repository.saveSnapshot(runId, source, plan);

      const result = {
        runId,
        baseline,
        itemCount: records.length,
        added: diff.added.length,
        updated: diff.updated.length,
        removed: diff.removed.length,
        duplicateIds: diff.duplicateIds,
      };
      await this.repository.completeRun(runId, result);
      return result;
    } catch (error) {
      await this.repository.failRun(runId, error instanceof Error ? error.message : String(error));
      throw error;
    }
  }
}
