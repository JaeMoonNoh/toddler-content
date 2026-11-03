import type { SourceId } from '../../shared/domain/source-id';
import type { CollectSourceResult } from './collect.service';

export type SourceOutcome =
  | { source: SourceId; status: 'succeeded'; result: CollectSourceResult }
  | { source: SourceId; status: 'failed'; reason: string };

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
