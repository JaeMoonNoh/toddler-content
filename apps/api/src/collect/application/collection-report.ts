import type { SourceId } from '../../shared/domain/source-id';

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

export type SourceOutcome =
  { source: SourceId; status: 'succeeded'; result: CollectSourceResult } | { source: SourceId; status: 'failed'; reason: string };

export class CollectionReport {
  constructor(readonly outcomes: readonly SourceOutcome[]) {}

  get succeeded() {
    return this.outcomes.filter((o) => o.status === 'succeeded');
  }

  get failed() {
    return this.outcomes.filter((o) => o.status === 'failed');
  }

  get hasFailures() {
    return this.failed.length > 0;
  }

  get totalChanges() {
    return this.succeeded.reduce((sum, { result }) => sum + result.changes.length, 0);
  }
}
