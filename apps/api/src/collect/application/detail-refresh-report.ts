import type { SourceId } from '../../shared/domain/source-id';

export interface DetailTarget {
  source: SourceId;
  externalId: string;
}

export type RefreshedDetail = DetailTarget & { name: string } & (
    | { status: 'baseline' } // 처음 받아서 기준점만 저장했다
    | { status: 'unchanged' }
    | { status: 'changed'; fields: string[] }
  );

export type FailedDetail = DetailTarget & { status: 'failed'; reason: string };

export type DetailOutcome = RefreshedDetail | FailedDetail;

export class DetailRefreshReport {
  constructor(readonly outcomes: readonly DetailOutcome[]) {}

  get fetched() {
    return this.outcomes.filter((o): o is RefreshedDetail => o.status !== 'failed');
  }

  get baseline() {
    return this.outcomes.filter((o) => o.status === 'baseline');
  }

  get unchanged() {
    return this.outcomes.filter((o) => o.status === 'unchanged');
  }

  get changed() {
    return this.outcomes.filter((o) => o.status === 'changed');
  }

  get failed() {
    return this.outcomes.filter((o) => o.status === 'failed');
  }
}
